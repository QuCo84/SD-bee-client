/**
 *  UDEtable.js
 * 
 *  This is the client-side part of the table module and works with the server-side udtable.php
 *  
 *  As with other UD modules, methods are grouped in 4 blocks as listed below :
 *    
 *     1 - UD-VIEW-MODEL - Preparing data recieved from server for editing
 *     2 - UD-VIEW-MODEL - Preparing edited data for saving
 *     3 - UDE-VIEW      - Editing functions
 *     4 - CALCULATOR    - Calculator functions on tables 
 *
 */
 
function UDEtable_adjust( element) {
    let table = API.dom.element( 'table', element);
    if ( table && table.id) API.dom.arrangeTable( table.id, false);
}
 
class UDEtable {
    dom;
    ude;
    widths = null;
    idsCleared = [];
    mouseDownElement = null;
    
    // Set up table editor
    constructor( dom, ude)
    {
        this.dom = dom;
        this.ude = ude;
        if ( typeof API != "undefined" && API) 
            API.addFunctions( this, [ 
                "updateTable", "getRow", "matchRow", "findRows", "findFirstRow", "getFirstRow", 
                "writeCell", "updateRow", "emptyTable", "tableColumns", "insertRow", "insertColumn", 
                "removeRow", "removeColumn"
            ]);
    } // UDEtable.construct()
    
    /* *
     *   UD-VIEW-MODEL Reception from server - prepare a table for editing
     *     update() - called by udtable.php via ud.js and ude.js
     *     initalise() - setup the editing zone
     */
    
    // Update a table by updating content, running all formulas and checking against table's source
    updateTable( id, recurrent = false) { this.update( id, recurrent);}
    update( id, recurrent = false)
    {
        // Get table, head and body
        var table = document.getElementById( id);
        if (!table) return;
        if ( table.tagName.toLowerCase() != "table") table = table.getElementsByTagName('table')[0];
        if (!table) return debug( {level:1, return:"ERR: no table "+id}, "No table", id);        
        var thead = table.getElementsByTagName('thead')[0];
        var tbody = table.getElementsByTagName('tbody')[0];
        if ( !thead || !tbody ) return debug( {level:5, return:"ERR: no head or body in "+id}, "No head or body", table);
        // Link head and body scroll
        this.dom.attr( tbody, 'onscroll', "this.previousSibling.scrollLeft = this.scrollLeft;");
        // Get table's source if provided
        let dataSource = this.dom.attr( table, "ude_datasrc");
        if ( !dataSource) dataSource = this.dom.attr( table, "ude_source"); // ??? valid
        // Find rowModel
        var rowModel = table.rows[1];
        if ( rowModel) {
            // Loop through model row cells
            for (let iCol = 0; iCol < rowModel.cells.length; iCol++)
            {
                let cell = rowModel.cells[iCol];
                // Could use this.ude.editingElement = cell
                if ( cell.classList.contains( 'stageediting')) continue; 
                // Avoid cells with no children
                if ( !cell.childNodes)
                {
                    // No child nodes so add empty text
                    var emptyTextNode = document.createTextNode( "");
                    cell.appendChild( emptyTextNode);
                }
                if ( cell.textContent.charAt(0) == "=")
                {                    
                    cell.setAttribute( "ude_formula", cell.textContent.substr(1));
                    let fillText = API.getParameter( 'computingText');
                    cell.setAttribute( "ude_place", fillText);
                    cell.textContent = fillText;
                }              
            }  // end cell loop
        }
        var rows = tbody.rows;        
        // if ( !rowModel || !rowModel.classList.contains( 'rowModel')) return debug( {level:2, return:"ERR: no model in "+id}, "No model", table);
        // Add rows to match sources
        // 2DO should realy delete all existing rows and read from source
        if ( rowModel && dataSource && dataSource != "this")
        { 
            // Get row count from source
            var nbOfRows = document.getElementById(dataSource).getElementsByTagName('tbody')[0].rows.length;
            // Loop through source's rows
            while ( nbOfRows < rows.length) {
                rows[ rows.length-1].remove();
            }
            for (var i=rows.length; i < nbOfRows; i++)
            {        
                var newRow = this.dom.prepareToInsert( 'tr', rowModel, {});
                newRow = tbody.appendChild( newRow);
                // var newRow = this.dom.insertElement('tr', rowModel.cloneNode(true), null, tbody);
            }  // end of source row loop
            // 2DO set autoHome this.dom.autoHome = this.dom.element( dataSource);
        } // end of update from source        
        // Substitute "auto" id's and rund formulas
        rows = tbody.rows;
        // Read table's auto index
        let auto = 1;
        //var auto = this.dom.attr( table, 'ude_autoindex');
        //if (!auto) auto = 1;
        if ( this.idsCleared.indexOf( id) > -1) {
            // Clear cell id's (will be set by udcalc as needed)
            for (let irow=0; irow<rows.length; irow++) {
                var row = rows[irow];
                for (var iCol = 0; iCol < row.cells.length; iCol++) rows.cells[ iCol].id = "";
            }
            this.idsCleared.push( id);
        }
        // Loop through rows
        for (var i=0; i<rows.length; i++)
        {
            var row = rows[i];
            if ( row.id == "auto") row.id = table.id+'_'+auto++; 
            this.dom.autoIndex1 = i+1;
            // Loop through cells
            for (var iCol = 0; iCol < row.cells.length; iCol++)
            {
                var cell = row.cells[iCol];
                // Could use this.ude.editingElement = cell
                if ( cell.classList.contains( 'stageediting')) continue; 
                // Substitute auto id's
                // if ( cell.id == "auto") cell.id = table.id+'_'+auto++; 
                // Avoid cells with no children
                if ( !cell.childNodes)
                {
                    // No child nodes so add empty text
                    var emptyTextNode = document.createTextNode( "");
                    cell.appendChild( emptyTextNode);
                }
                if ( cell.textContent.charAt(0) == "=")
                {
                    cell.setAttribute( "ude_formula", cell.textContent.substr(1));
                    let fillText = API.getParameter( 'computingText');
                    cell.setAttribute( "ude_place", fillText);
                    cell.textContent = fillText;
                }
                // Manage formulae
                if ( this.dom.attr( cell, "ude_formula")) this.ude.calc.updateElement( cell, i+1, recurrent);  
                else  if ( cell.textContent == '...' && rowModel && this.dom.attr( rowModel.cells[ iCol], "ude_formula")) {
                    // 2DO =use( { parent:table.id, child:thead tr[nth-child(2)] td[nth-child( iCol)]});
                    this.dom.attr( cell, "ude_formula", this.dom.attr( rowModel.cells[ iCol], "ude_formula"));
                    this.ude.calc.updateElement( cell, i+1, recurrent);
                    this.dom.attr( cell, "ude_formula", "__CLEAR__");
                }   
                // Manage cell class
                /* Could do this is json create/readTable, if td class read then filter if same as model */
                if ( rowModel && rowModel.cells[ iCol].className && !cell.className) cell.className = rowModel.cells[ iCol].className;
            }  // end cell loop
            // Row formulas
            if ( this.dom.attr( row, "ude_rowidformula")) 
                row.id = this.ude.calc.exec( this.dom.attr( row, "ude_rowidformula").replace(/index/g, i+1));
            if ( this.dom.attr( row, "ude_onclickformula"))               
                row.setAttribute( "onclick", this.ude.calc.exec( this.dom.attr( row, "ude_onclickformula").replace(/index/g, i+1)));
            // Make sur row has an id
            /* 2021-07-08 - disactivate for drag-drop delete - bad logic
            if (!row.id) {
                let titleNode = row.querySelector( 'td span.title');
                if ( titleNode) row.id = titleNode.textContent.replace( / /g, '_'); 
            } 
            */            
    
        } // end row loop    
        this.dom.autoIndex1 = -1;
        // if ( auto > 1) this.dom.attr( table, 'ude_autoindex', auto);           
        debug( {level:6}, "updateTable", table.rows.length);        
    } // UDEtable.update()
     
    // Intialise client-side a table element that's just been created or loaded
    initialise( saveableId) {        
        // Get element pointers
        var element = this.dom.element( saveableId);
        var containerElement = element.parentNode; 
        var nextSibling = element.nextSibling;        
        var children = this.dom.children( element); // element.childNodes; // 
        // Get element's style
        let classList = element.classList;
        let style = "";
        for (var i=0; i < classList.length; i++)
            if ( classList.item( i) != "table" && style == "") style = classList.item( i);
        // Initialise variables
        var bind = "";
        var json = null;
        var name = "";
        let newProc = true;
        if ( newProc) {        // new approach
        // Get data according to MIME        
        let mimeType = this.dom.attr( element, 'ud_mime');  
        if ( !mimeType) {
            mimeType = "text/json";
            this.dom.attr( element, 'ud_mime', mimeType);  
        }
        switch ( mimeType) {
            case "text/json" :
                if ( children.length) {
                    json = JSONparse( children[0].textContent);
                    bind = children[0].id;
                }    
                if ( !json) {
                    let suggestedName = this.dom.attr( element, 'name');
                    // Delete all children
                    this.dom.emptyElement( element);
                    // Add new object to element
                    let newElement = element.appendChild( this.newTableObject( suggestedName));      
                    json = JSONparse( newElement.textContent);
                }
                // else if json.meta.name != children[0].id.replace( "_object", ""); debug won't bind
                break;
            case "text/text" :  //(or csv) 
                break;
            case "text/html" :
                // Direct transfer -- do nothing hiddenId attribute will assure text including in saving
                // dataHolder.innerHTML = editorZone.innerHTML;
                break;
        }
        
        // Build edit zone and append to element
        let edTable = null;        
        if ( json) {
            // Convert table object's JSON to HTML
            // 2DO add element's styles to JSON
            let editZone = this.dom.JSONput( json, bind, '', this.dom.keepPermanentClasses( element.className, true));
            element.appendChild( editZone);
            edTable = this.dom.element( json.meta.name);
            // DONE LATER Update cells with formulas
            // if ( this.dom.attr( edTable, 'ude_datasrc')) { this.update( edTable.id); }
            // Adjust table whenever it is updated
            API.onTrigger( element, 'update', function( el) {UDEtable_adjust(el);}, false);
        } else {    // old proc
        // Complete section will disappear once new Proc accepted
        if ( children[0].tagName == "SPAN" && children[0].classList.contains('caption')) {
            name = children[0].textContent;
            name = name.replace(/ /g, '_').replace(/'/g,'_').replace(/"/g, '');            
            containerElement = element.parentNode;
            bind = children[1].id;
            let jsonContent = children[ children.length - 1].textContent;
            json = JSON.parse( jsonContent);
            // jsonHolder = 
        } else  {
            // DEPRECATED
            // Not a composite element yet so setup
            // Get content as default name           
            name = element.textContent;
            name = name.replace(/ /g, '_').replace(/'/g,'_').replace(/"/g, '');            
            // Remove text element
            var textNodes = element.childNodes;
            for ( var i=0; i < textNodes.length; i++) element.removeChild( textNodes[i]);        
            // Set up spam for caption
            let newElement = this.dom.prepareToInsert( 'span', name, {class:'caption'});
            newElement = element.appendChild( newElement);
            // Set up hidden dataHolder with default data
            json = {
                _table:{_id:"table_1edittable","_classList":"tableStyle1"},
                thead:[
                    { rowNo:{value:"row",tag:"th"},A:{value:"A",tag:"th"},B:{value:"B",tag:"th"},C:{value:"C",tag:"th"}},
                    { _class:"rowModel", rowNo:{value:"","ude_formula":"row()"},A:{value:"..."},B:{value:"..."},C:{value:"..."}}
                ],
                tbody:[
                    {rowNo:{value:"1"},A:{value:"A1..."},B:{value:"..."},C:{value:"..."}}
                ]
            };
            newElement = this.dom.prepareToInsert( 'div', JSON.stringify( json), {id:name, class:"tableObject hidden", ud_mime:"text/json"});
            newElement = element.appendChild( newElement);
            // jsonHolder = 
        }
        
        // 2DO if update need request update and onsuccess insert data into content
        // 2DO if this.requestUpdateJSONcontentIfRequired( jsonHolder)
        //    come back here later 
        
        // Build HTML table from JSON data
        
        // Set up editZone
        var ezname = name+'editZone';
        var attr = { id:ezname, class:'table',  ud_type:"editZone", ud_subtype:"table", ude_bind:name, ud_mime:"text/json", ude_autosave:"on", ude_stage:"on"};
        var edZone = this.dom.prepareToInsert( 'div', '', attr);
        // var Save button 
        // var handle
        edTable = this.convertJSONtoHTMLtable( json, name, style);
        edZone.appendChild( edTable);
        element.appendChild( edZone);        
        //if ( nextSibling) containerElement.insertBefore( edZone, nextSibling);
        //else containerElement.appendChild( edZone);  
        }        
        if ( this.widths) this.setColumnWidths( edTable.id, this.widths);
        if ( edTable && edTable.id) this.update( edTable.id);
        }        
        return true;
    } // UDEtable.initialise()
    
   /**
    * setup an empty table in UD JSON format
    					thead:{ tag:"thead", value:[
						{tag:"tr", value:{ A:{ tag:"th", value:"A"}, B:{tag:"th", value:"B"}}},
						{tag:"tr", class:"rowModel", value:{ A:{ tag:"td", value:""}, B:{tag:"td", value:"B"}}}
					]}, 
					tbody: { tag:"tbody", value:[
						{tag:"tr", value: { A:{tag:"td", value:"..."}, B:{tag:"td", value:"..."}}}
					]},
				}
    */
	newTableObject( suggestedName) {
        // Name
        if ( !suggestedName) return null;
        let name = suggestedName.replace(/ /g, '_').replace(/'/g,'_').replace(/"/g, '');
        let objectName = name + "_object";
        // Data
        // 2DO get default value from register
        let fillText = API.getParameter( 'computingText');;
        let objectData = { 
            meta:{ type:"table", name:name, zone:name+"editZone", caption:suggestedName, captionPosition:"top"}, 
            data:{ 
				tag:"jsontable", name:name, class:"tableStyle1", value:[
                    { "A":"", "B":"", "C":""},
                    { "A":fillText, "B":fillText, "C":fillText}
                ]
			},		
            changes: []
        };
        // Create object div aabd return
        let objectAttributes = {id:objectName, class:"object tableObject hidden", ud_mime:"text/json"};
        let object = this.dom.prepareToInsert( 'div', JSON.stringify( objectData), objectAttributes);
        this.dom.attr( object, 'ud_mime', "text/json");
        return object;
    } // UDEtable.newTableObject()
	
   /**
    * Request an update JSON content if required
    */     
    requestUpdateJSONcontentIfRequired( jsonHolder, json) {
        // Get table source
        // Get update frequency and last update
        // Need update ? return false;
            // Send AJAX request (Getsuccess action = updateJSONelement)
        return true;    
    } // requestUpdateJSONcontentIfRequired()    

   /**
    * Update JSON with response server
    */     
    updateJSONcontent( context, html, js) {
        // Get json data holder
        // Get json data
        // Get standard data sent by server
        // Insert into json data convertStandardToJSONtable
        // Update last update date
    } // uodateJSONcontent()
    
    /**
     * Insert standard data into JSON object
     */
    convertStandardToJSONtable( standard, oldJSON)
    {
        // Build _table object
        // Buid thead object
        // Build tbody object
        /*
                { _table : { _id, _classList: _source, _update, _lastUpdated} 
                        _table:{_id:"table_1edittable","_classList":"tableStyle1"},
                thead:[
                    { rowNo:{value:"row",tag:"th"},A:{value:"A",tag:"th"},B:{value:"B",tag:"th"},C:{value:"C",tag:"th"}},
                    { _class:"rowModel", rowNo:{value:"","ude_formula":"row()"},A:{value:"..."},B:{value:"..."},C:{value:"..."}}
                ],
                tbody:[
                    {rowNo:{value:"1"},A:{value:"A1..."},B:{value:"..."},C:{value:"..."}}
                ]
*/
    }    

    /**
     * Convert JSON in saveable element to HTML table for editZone
     */     
    convertJSONtoHTMLtable( json, name, style)
    {
        let totalWidths = {};
        let table = document.createElement( 'table');
        table.id = name+"edittable";
        // Style is provided by element otherwise use default set in json
        if ( style) table.className = style;
        else if ( json._table && json._table._classList) table.className = json._table._classList;
        let thead = document.createElement( 'thead');
        let tbody = document.createElement( 'tbody');
        // Create head
        var rows = json.thead;
        for ( var i=0; i < rows.length; i++)
        {
            let row = rows[i];
            let newRow = document.createElement( 'tr');
            //let cells = row.cells;
            var className = row['_class'];
            if ( className) newRow.className = className;
            for ( var key in row)
            {
                if (key.charAt(0) == '_') continue;
                // row 0 build key/cell no map
                let cell = row[ key];
                let newCell = null;
                if ( typeof cell.tag != "undefined") newCell = document.createElement( cell.tag);
                else newCell = document.createElement( 'td');
                if ( typeof cell.class != "undefined") newCell.className = cell.class;
                if ( typeof cell.ude_formula != "undefined") this.dom.attr( newCell, "ude_formula", cell.ude_formula);                
                let content = "";
                if ( typeof cell.value != "undefined") content = cell.value;
                // Initialise totalWidths on header 2DO do on textContent after setting innerHTML
                if ( i == 0) totalWidths[ content.toLowerCase()] = content.length;
                // Detect special datasource field
                if ( i == 1 && key.toLowerCase() == "datasource") this.dom.attr( table, "ude_source", content);
                // Set content as HTML
                newCell.innerHTML = content;
                /*
                var textNode = document.createTextNode( content);
                newCell.appendChild( textNode);
                */
                newRow.appendChild( newCell);
            }
            thead.appendChild( newRow);
        }    
        table.appendChild( thead);
        // Create body
        var rows = json.tbody;
        for ( var i=0; i < rows.length; i++)
        {
            let row = rows[i];
            let newRow = document.createElement( 'tr');
            //let cells = row.cells;
            var className = row['_class'];
            if ( className) newRow.className = className;
            for ( var cellName in row)
            {
                if ( cellName.charAt(0) == '_' ) continue;
                // Add empty cells if idenx > 
                let cell = row[ cellName]; //cells[j];
                let newCell = null;
                newCell = document.createElement( 'td');
                if ( typeof cell.class != "undefined") newCell.className = cell.class;
                if ( typeof cell.ude_formula != "undefined") this.dom.attr( newCell, "ude_formula", cell.ude_formula);                
                let content = "";
                if ( cell.value && typeof cell.value != "undefined") content = cell.value;
                if ( !content) 
                     console.log( "oops");
                // Quick fix for spreadsheet app
                if ( cellName.length > 0) 
                    if ( content) totalWidths[ cellName.toLowerCase()] += Math.max( content.length, 20);
                    else totalWidths[ cellName.toLowerCase()] += 20;
                else
                {
                    totalWidths[ cellName.toLowerCase()] += 5;
                    if ( cellName.length == 0) newCell.setAttribute("contenteditable", "false");
                }    
                //let textNode = document.createTextNode( content);               
                //newCell.appendChild( textNode);
                if ( typeof content.replace != "undefined") content = content.replace( /\n/g, "<br>");
                newCell.innerHTML = content;
                newRow.appendChild( newCell);
            }  // end of cell loop
            tbody.appendChild( newRow);
        }  // end of row loop
        // Add body to table
        table.appendChild( tbody);
        // Compte column widths
        let totalWidth = 0;
        for ( var cellName in totalWidths) totalWidth += totalWidths[ cellName];
        let widths = {};
        for ( var cellName in totalWidths) widths[ cellName] = Math.round( 100*totalWidths[ cellName]/totalWidth);
        this.widths = widths;
        // Set column widths
        // this.setColumnWidths( table.id, widths);
        return table;
    } // convertJSONtoHTMLtable()
    
    /* *
     *   UD-VIEW-MODEL Saving to server part
     *     prepareToSave() - called by ude.js setChanged()
     *     convertHTMLtableToJSON() - used when saveable data is JSON
    */
    
    // Update binded saveable element with table's content
    prepareToSave( editorZone, dataHolder)
    {
        // Get MIME type
        let saveableElement = dataHolder.parentNode;
        let mimeType = this.dom.attr( saveableElement, 'ud_mime');
        // Detect change in object's name and update other elements as required
        API.dispatchNameChange( saveableElement);
        // Process according to MIME type
        switch ( mimeType)
        {
            case "text/json" :
                // Store name currently in JSON object
                let jsonAPI = API.json;
                let json = jsonAPI.parse( dataHolder.textContent);
                let oldName = jsonAPI.value( json.meta, 'name');
                // Udpate JSON object
                dataHolder.textContent = JSON.stringify( this.dom.udjson.getElement( editorZone, true));
                // Detect change of name
                json = jsonAPI.parse( dataHolder.textContent);
                let newName = jsonAPI.value( json.meta, 'name');
                let caption = jsonAPI.value( json.meta, 'caption');
                if ( oldName != newName && caption) {
                    // Update caption with change of name                    
                    caption = caption.replace( oldName, newName);
                    json.meta.caption = caption;
                    dataHolder.textContent = JSON.stringify( json);
                    let captionHolder = this.dom.element( 'span.caption', newName+'editZone');
                    if ( captionHolder) captionHolder.textContent = caption;
                }
                break;
            case "text/text" :  //(or csv) 
                break;
            case "text/html" :
                let children = this.dom.children( saveableElement);
                if ( children[0].tagName == "SPAN" && children[0].classList.contains('caption')) {
                    // HTML with JSON-coded table
                    let jsonStr = this.convertHTMLtableToJSON( editorZone, saveableElement);           
                    dataHolder.textContent = jsonStr;                    
                } else {
                    // Pure HTML - save as is
                }
                
                // Direct transfer -- do nothing hiddenId attribute will assure text including in saving
                // dataHolder.innerHTML = editorZone.innerHTML;
                break;
        }
        // Return true to go ahead with saving     
        return true;        
    } // UDEtable.prepareToSave()
    
    // Save HTML as JSON data
    // 2DO Is this used ... getElement/putElement must do this
    convertHTMLtableToJSON ( editorZone)
    {  
        // 2DO could check is DIV and class table(container)
        if ( editorZone.tagName != "DIV") return debug( {level:1, return:null}, "Not an editing zone.", editorZone);
        // Get elements in editing zone DIV
        var table = editorZone.getElementsByTagName( 'table')[0];
        var spans = editorZone.getElementsByTagName( "span");
        // Create object to hold table data
        var tableId = table.id;         
        var tableJSON = { _table:{_id: tableId, _classList:table.className, _ud_bind: this.dom( table, 'ude_bind')}};        
        /*
        // Add header and footer to JSON        
        if ( spans.length)
        {
            tableJSON[ 'header'] = spans[0].innerHTML;
            tableJSON[ 'footer'] = spans[1].innerHTML;
        } 
        */         
        // Use column names in JSON
        var cols = [];        
        // expecting table > head > header rows > cells and table > body > body rows > cells
        // may be surrounding by a header and footer span ?
        var parts = table.childNodes;
        // Loop through parts
        for (var parti=0; parti<parts.length; parti++)
        {
            var part = parts[parti];
            if ( part.tagName != 'THEAD' && part.tagName != 'TBODY') return debug({level:1, return: null}, table);
            var partJSON = [];
            // Loop through rows in part
            for (var rowi=0; rowi<part.rows.length; rowi++)
            {
                var row = part.rows[ rowi];
                var rowJSON = {};
                if ( row.className) rowJSON['_class'] = row.className;
                if ( row.onclick) rowJSON['_onclick'] = this.dom.attr( row, 'onclick');
                // Loop through cells in row
                for (var celli=0; celli<row.cells.length; celli++)
                {
                    var cell = row.cells[ celli];
                    var cellJSON = {};
                    // Use column labels to name cells
                    if ( parti == 0 && rowi == 0 ) {
                        let cellType = this.dom.attr( cell, 'ud_type');
                        if ( cellType) cols.push( cellType + cell.textContent);
                        else cols.push( cell.textContent);
                    }
                    cellJSON.value = cell.innerHTML;
                    if ( cell.tagName == 'TH') cellJSON.tag = 'th';
                    this.dom.setAttr( cellJSON, cell, 'class', true);                                    
                    if ( this.dom.attr( cell, 'ude_formula')) cellJSON.ude_formula = this.dom.attr( cell, 'ude_formula');
                    rowJSON[ cols[celli]] = cellJSON;   
                } // end of cell loop
                partJSON.push( rowJSON);
            }  // end of row loop        
            tableJSON[ part.tagName.toLowerCase()] = partJSON;  
       } // end of part loop
       return JSON.stringify( tableJSON);
     } // UDEtable.convertHTMLtableToJSON()
    
    
    /* *
     *   UDE-VIEW PART - table manipulation methods called from ude.js and udapi.js
     *     inputEvent() - called bu ude.js to dispatch events
     *     insertRow(), insertCol(), deleteRow(), deleteCol()
     *     rowHeight(), colWidth()
     */
    
    // User-generated event 
    inputEvent( e, element=null)
    {    
        let processed = false;
        let source = ( element) ? element : e.target;
        let saveable = this.dom.getSaveableParent( element);
        let displayable = this.dom.getParentWithAttribute( 'ude_bind', element);
        let content = source.innerHTML;
        let event = ( typeof e.event != "undefined") ? e.event : e.type;
        let row = ( ["TD","TH"].indexOf( source.tagName) > -1) ? source.parentNode : ( source.tagName == "TR") ? source : null;
        let table = ( row) ? row.parentNode.parentNode : null;
        let cell = ( ["TD","TH"].indexOf( source.tagName) > -1) ? source : null;      
        switch ( event)
        {
            case "click" :
                // Conditional display of header rows : rowModel
                if ( row && row.parentNode.tagName == 'THEAD' && row == row.parentNode.childNodes[0]) {
                    let model = row.nextSibling;
                    if ( model) model.style.display = "table-row";                    
                } else if (row) {
                    let model = row.parentNode.parentNode.childNodes[0].childNodes[1];
                    if ( model && row != model) model.style.display = "none"; 
                }
                this.dom.cursor.fetch();
                // Listen to mouse moves
                if ( table && cell) {
                    let me = this;
                    table.addEventListener( "mousedown", function (event) { me.inputEvent( event);});
                    table.addEventListener( "mouseup", function (event) { me.inputEvent( event);});
                    table.addEventListener( "mousemove", function (event) { me.inputEvent( event);});
                    //table.addEventListener( "mouseout", function (event) { this.inputEvent( event);});
                }
                break;
            case "click outside" :
                if ( table) {
                    table.removeEventListener( "mousedown", function (event) { me.inputEvent( event);});
                    table.removeEventListener( "mouseup", function (event) { me.inputEvent( event);});
                    table.removeEventListener( "mousemove", function (event) { me.inputEvent( event);});
                    this.clearSelected( table);
                }
                break;
            case "mousedown" :
                if ( !table || !cell) break;
                // Store selected cell & clear
                this.mouseDownElement = this.getRowAndColumn( table, cell);
                this.clearSelected( table);
                // Don't marj a sprocessed so selection inside cell is still possible
                /*
                cell.classList.add( 'selected');
                processed = true;
                if ( this.dom.cursor.HTMLelement != cell) this.dom.cursor.setAt(cell, 0);
                */
                break;
            case "mousemove" :
                if ( !table || !cell || !this.mouseDownElement) break;
                if ( cell != this.mouseDownElement.cell) {
                    // At least 2 cells selected                
                    // Add selected class to cells
                    let cellCoord = this.getRowAndColumn( table, cell);
                    this.setSelected( table, this.mouseDownElement, cellCoord);   
                    this.dom.cursor.set( this.mouseDownElement.cell, this.dom.cursor.textOffset);
                    processed = true;
                }                
                // Scroll table management
                // if table is scrollable                
                let tbody = $$$.dom.element( 'tbody', table);              
                console.log( tbody.scrollTop, cell.offsetTop);
                let step = 20;
                if ( cell.offsetTop > ( tbody.scrollTop + this.dom.attr( tbody, 'computed_height') - step)) tbody.scrollTop += step;
                if ( cell.offsetTop < ( tbody.scrollTop + 2*step) ) tbody.scrollTop -= step;
                break;    
            case "mouseup" :
                if ( !table || !cell ) break;  
                this.mouseDownElement = null; 
                if ( this.dom.elements( '.selected', table).length)  { //if cell.classList.contains( 'selected')                        
                    processed = true;
                }
                break;    
            case "Key Backspace" : 
            case "Key Delete" :
                if ( !table || !cell) break;
                if ( cell.classList.contains( 'selected'))  {
                    let selected = this.dom.elements( '.selected', table);   
                    let safe = 5;                                     
                    while ( selected.length && --safe) {
                        // If a complete row is selected remove it
                        let walk = selected[0];
                        row = walk.parentNode;
                        if ( selected.indexOf( walk) == -1) break;
                        while ( ( walk = walk.nextSibling)) if ( selected.indexOf( walk) == -1) break;
                        if ( !walk) {                            
                            walk = selected[0];
                            while ( ( walk = walk.previousSibling)) {
                                // Leave loop if not selected
                                if ( selected.indexOf( walk) == -1) break;
                                // Remove element from selection list
                                //selected.splice( selectedi, 1);
                            }
                            if ( !walk) {
                                this.removeRow( table, row);
                                processed = true;
                            }                            
                        }
                        selected = this.dom.elements( '.selected', table);
                        // If a complete column is selected remove it
                        // let cols = this.getColumn( table, selected[0]);
                        let cols = this.getColumn( table, cell);
                        for ( let coli=0; coli < cols.length; coli++) {
                            let selectedi = selected.indexOf(  cols[ coli]);
                            // Leave loop if not selected
                            if ( selectedi == -1) break;
                            // Remove element from selection list
                            selected.splice( selectedi, 1);
                            // If last column then remove column
                            if ( coli == ( cols.length - 1)) {
                                this.removeColumn( table, cell);
                                processed = true;
                            }
                        }
                        // Rebuild list of selected cells
                        //selected = this.dom.elements( '.selected', table);
                        if ( !processed) {
                            // Otherwise delete content 
                            let dummy = API.getParameter( "dummyText");
                            for ( let selecti=0; selecti < selected.length; selecti++) {
                                selected[ selecti].textContent = dummy;
                            }
                            selected = [];
                            processed = true;                            
                        }
                        
                    }                    
                    // Clear selected if event processed
                    if ( processed) this.clearSelected( table);
                }
                break;
            case "change":
                // 
                if ( this.dom.udjson.value( e, 'multinode') == "true") { 
                    let table = element.parentNode.parentNode.parentNode;
                    this.update( table.id);
                    break;                    
                }
                // Initialise if object updated
                if ( source.classList.contains( 'object')) {
                    this.initialise( source.parentNode.id);
                    break;
                }
                // Nothing to do if stage editing
                if ( API.testEditorAttr( element, 'ude_stage')) break;
                // Not stage editing handle formula entry
                if ( content[0] == '=') // && ( content[ content.length-1] == ';') || this.domGetParentAttribute( 'ude_autosave') == "on"))
                {
                    // A formula so update ude_formula attribute and compute result
                    var formula = content.substr( 1, content.length-1); //-2 if ; to validate end
                    this.dom.attr( source, 'ude_formula', formula);
                    this.ude.calc.updateElement( source); 
                }
                else if ( this.dom.attr( source, 'ude_formula')) this.dom.attr( source, 'ude_formula', "__CLEAR__");
                
                if ( source.tagName == "TD") {
                    // Capture change on "datasource" field and update ude_source attribute if its the case
                    row = source.parentNode;
                    for (var i=0; i < row.cells.length; i++) if ( row.cells.item(i) == source) break;
                    let col = i; // row.cells.indexOf( source);                
                    let table = row.parentNode.parentNode;
                    let cols = table.getElementsByTagName('thead')[0].childNodes[0].cells;
                    let colName = cols[ col].textContent;
                    if ( colName.toLowerCase() == "datasource") this.dom.attr( table, "ude_source", content);
                }
                // Event processed
                processed = true;
                break;
            case "insert row" :
            case "newline" : 
                // New line
                let tablec = this.getRowAndColumn( table, cell);
                let beforeOrAfter = ( tablec.column > 1);
                // 2DO Split current line, replace mode 
                if ( e.data) { row = this.insertRow( null, -1, e.data, beforeOrAfter);}
                else { row = this.insertRow( null, -1, null, beforeOrAfter);} // empty row 
                let updateEv = this.dom.udjson.value( e, 'update');
                if ( updateEv == "" || updateEv) { this.update( row.parentNode.parentNode.id);}            
                if ( this.dom.getParentAttribute( "", "ude_autosave", this.dom.cursor.HTMLelement) != "Off")
                    this.ude.setChanged( this.dom.cursor.HTMLelement);
               this.dom.cursor.HTMLelement = row.querySelector( "td :not([contenteditable='false'])"); //row.cells[0];  
                if ( !this.dom.cursor.HTMLelement) this.dom.cursor.HTMLelement = row.cells[1];
               this.dom.cursor.textElement = this.dom.cursor.HTMLelement.childNodes[0];               
               this.dom.cursor.textOffset = 0;
               this.dom.cursor.set();
               processed = true;
               break;
            case "paste" : { // Paste to current cell
                let cursor = this.dom.cursor;
                // Get text element of cell where cursor is positionned and offset in it's content
                cell = cursor.textElement;                 
                let offset = cursor.textOffset;
                let body = cell.parentNode.parentNode.parentNode;
                let table = body.parentNode; 
                // Get cell's content
                let ctext = cell.textContent;
                let text = e.data;                
                if ( text.indexOf( ';') > -1) {
                    // Text is CSV syntax ie fill multiple cells
                    let row = cell.parentNode.parentNode;
                    // Next 2 lines should be a fct
                    let rowNo = 0;
                    while ( (row = row.previousElementSibling)) rowNo++;
                    let col = cell;
                    // idem
                    let colNo = 0;                   
                    while ( (col = col.previousElementSibling)) colNo++;                         
                    let nbRows = body.rows.length;             
                    let rows = text.split( "\n");
                    let lastCellModified = null;
                    for ( let rowi=0; rowi < rows.length; rowi++) {
                        let row = rows[ rowi];
                        let cellValues = row.split( ';');
                        if ( !colNo && rowNo >= nbRows) this.insertRow( table.id, rowNo - 1, row, true, true);
                        else {
                            for ( let coli=colNo; coli < cellValues.length; coli++) {
                                let cellValue = cellValues[ coli];
                                lastCellModified = body.rows[ rowNo].cells[ coli];
                                lastCellModified.innerHTML = cellValue;                            
                            }
                        }
                        colNo = 0;
                        rowNo++;

                    }
                    this.dom.cursor.setAt( lastCellModified, 10000);
                } else if ( cursor.selectionMultiNode) {
                    // Multiple nodes selected 
                    // 2DO delete or empty cells ? could be spans inside cell
                } else if ( cursor.selectionInNode) {
                    // Text inside cell is selected
                    ctext = ctext.substr( 0, offset)+text+ctext.substr(cursor.focusOffset);
                    cell.textContent = ctext;
                } else {
                    // Insert at cursor
                    ctext = ctext.substr( 0, offset)+text+ctext.substr(offset);
                    cell.textContent = ctext;
                    this.dom.cursor.setAt( element, offset+text.length);
                }
                // Save
                this.ude.setChanged( table);
                processed = true;
            break;}
            case "endPaste" :
                cell = this.dom.cursor.HTMLelement;
                this.update( cell.parentNode.parentNode.parentNode.id);
                processed = true;
               break;
            case "insert column" :
                if ( e.data) { cell = this.insertColumn( null, -1, e.data);}
                else { cell = this.insertColumn();}
                if ( cell) this.dom.cursor.setAt( cell);  
                processed = true;
                break;                        
            case "create":
                // this.initialise();
                // processed = true;
                break;
            
            case "copy" :
                // Get selection
                this.dom.cursor.fetch();
                let cursor = this.dom.cursor;
                // Expetcting selection to be on whole HTML elements
                if ( cursor.textElement == null) return false;
                let startElement = cursor.HTMLelement;
                let endElement = cursor.focusElement;
                // let offset = cursor.textOffset;
                // If no selection copy all
                let rows = startElement.parentNode.parentNode.childNodes;
                // Loop to build text
                let walkRow = startElement.parentNode; // td > tr
                let endRow = endElement.parentNode;
                if ( endElement.nodeType == 3) endRow = endElement.parentNode.parentNode;
                let safe = 1000;
                let text = "";
                let cells = walkRow.cells;                
                let cellStart = [].slice.call(cells).indexOf( startElement);
                if ( cellStart == -1) cellStart = 0;
                let cellEnd = cells.length -1;                
                for ( let celli=cellStart; celli <= cellEnd; celli++) text += cells[ celli].textContent+";";
                text = text.substring( 0, text.length - 1)+"\n";
                while ( walkRow && walkRow != endRow && safe--)
                {
                    // Next line
                    walkRow = walkRow.nextSibling;
                    // Grab content as text : cell1;cell2;cell3\n
                    cells = walkRow.cells;
                    cellStart = 0;
                    cellEnd = cells.length -1;
                    if ( walkRow == endRow) cellEnd = [].slice.call(cells).indexOf( endElement); 
                    if ( cellEnd == -1) cellEnd = cells.length -1;                
                    // 2DO if , or ; then ""     
                    for ( let celli=cellStart; celli <= cellEnd; celli++) text += cells[ celli].textContent+";";
                    text = text.substring( 0, text.length - 1)+"\n";
                }                
                text = text.substring( 0, text.length - 1);
                // Store in clipboard
                if ( clipboarder) {
                    let clip = clipboarder.createClip( 'text', text); //, clipGroup);
                    clipboarder.saveClip( clip); //, deleteCopied); // save in base if element is being deleted                
                }
                // Store in event target object
                e.target.clipContent = text;
                e.target.clipType = "text";
                processed = true;
                break;    
                
            case "refresh" :
                // Get table's refresh data
                // Source is saveableElement
                let jsonContainer = source.getElementsByTagName( 'div')[0];
                let json = JSON.parse( jsonContainer.textContent);
                let params = json['_table'];
                let update = params['_updateMinutes']*60;
                let lastUpdate = new Date( params['_lastUpdate']);
                if ( ( Date.now() - lastUpdate) > update)
                {
                    // Request update
                    let uri = params[ '_sourceURL'];
                    this.ud.udajax.serverRequest( uri, "GET", "", context={ element:jsonContainer, action:"compositeUpdate"})
                    // 
                }
                break;
            case "merge up" :
            case "merge down" :
            case "remove" :
                if ( source.tagName != "TD") { processed = true; break;}
                let rowText = this.dom.attr( source, "textContent of siblings").replace(/\s/g, '');;
                if (rowText == "") {
                    row = source.parentNode;
                    let tableId = row.parentNode.parentNode.id;
                    let cursor = row.previousSibling;
                    let offset = 0;                    
                    if ( cursor) offset = cursor.textContent.length - 1;                    
                    if ( ( event == "merge down" || !cursor) && row.nextSibling) {
                        cursor = row.nextSibling; 
                        offset = 0;
                    }          
                    row.remove();
                    this.update( tableId);
                    // Move cursor
                    this.dom.cursor.HTMLelement = cursor;
                    this.dom.cursor.HTMLoffset = offset;
                    this.dom.cursor.set();
                    // Event consumed                            
                    processed = true;                          
                }
                break;
            case "save" :
                let target = e.target;            
                if ( typeof target != "undefined") processed = this.prepareToSave( displayable, target);            
                break;
            case "setValue" : {
                let path = e.key;
                let rowIndex = path[0];
                let colName = path[1]; 
                let npath = element.id+"."+rowIndex+"."+colName+"._element";
                cell = this.dom.domvalue.value( npath);
                cell.textContent = e.value;
                this.ude.setChanged( cell);
                break;
            }
            case "ArrowUp" :
            case "ArrowDown":
                row = element.parentNode;
                let coli = element.cellIndex;
                let nextRow = ( event == "ArrowDown") ? row.nextSibling : row.previousSibling;
                if ( nextRow) {
                    let target = nextRow.cells[ coli];
                    this.dom.cursor.setAt( target);
                    processed = true;
                } else {    
                    // End of table has been reached, go to next element
                }                
                break;
        }   
        return processed;
    } // UDEtable.inputEvent()
    
    // Insert a new row in at table
    insertRow( tableId, index, data, beforeOrAfter=true, placeholder=false)
    {
        // Find table
        let table;
        let cell=null;
        if ( tableId) table = document.getElementById( tableId);
        else if ( this.dom.cursor.HTMLelement)
        {
            cell = this.dom.cursor.HTMLelement;
            if (cell.tagName.toLowerCase() != "td") return debug( {level:2}, "Can't insert TR as cursor not on TD", this.cursor);
            table = cell.parentNode.parentNode.parentNode; // row/tbody/table
            // OLD table = this.dom.getParentAttribute( "table", "_element", this.dom.cursor.HTMLelement); // .parentNode.parentNode;
        }    
        else return debug( {level:5, return:null}, "No cursor or no cursor at table");
        if (!table) return debug( {level:5, return:"ERR: no table "+tableId}, "No table", tableId);
        let body = table.getElementsByTagName('tbody')[0];
        // Find row model        
        let model = table.rows[1].cloneNode(true);
        model.style.display = "";
        // Interpret index and find ROW where to insert
        let row = null;  // DOM will use cursor in this case
        if ( index > -1) {
            // Find row at Index            
            if ( index > body.rows.length) index = body.rows.length-1; //May need a TR+ element to signify Append or  an Append fct in DOM. Otherwise always have an extra invisible row at end of body
            if ( body) row = body.rows[ index]; 
            if ( !body || !row) return debug( {level:5, return:"ERR: no body or row"+tableId}, "No body or row", table);
        } 
        else if ( cell)  row = cell.parentNode;
        else {
            // 2DO check if last row is empty, use it
            // Use last row
            index = body.rows.length;
            row = body.rows[ index - 1];
            // Modify row if it is empty
            if ( !row.textContent.match( /[^.]+/) ) {                
                // Insert new row with clone of model & remove current one
                this.dom.insertElement( 'tr', model, {}, row, true);
                row.remove();    
                // Update last row
                this.updateRow( tableId, index, data);
                return true;
            }            
        }
        
        // if ( !model.classList.contains( 'rowModel')) return debug( {level:2, return:"ERR: no model in "+tableId}, "No model", table);
        // Insert row via DOM
        let newRow = (row) ? this.dom.insertElement( 'tr', model, {}, row, beforeOrAfter) : this.dom.insertElement( 'tr', model, {}, body, beforeOrAfter, true); 
        if ( !data && model) data = "...;".repeat( model.cells.length - 1);
        // Transfert provided data
        if ( typeof data == 'string')
        {
            // CSV data
            let rowData = data.split(';');
            let cols = rowData.length;
            // 2DO Check nb versus cells 
            for (let coli=0; coli < cols; coli++) newRow.cells[ coli].textContent = rowData[ coli];
        }
        // 2DO if array same nb as cells
        else if ( data && typeof data == "object") // object
        {
            // 2DO FCT Get column names with type  (_type is to be renamed here and in DOM)
            let colCells = table.getElementsByTagName('thead')[0].rows[0].cells;
            if (!colCells) return debug( {level:5, return:"ERR: no header row in "+tableId}, "No header", table);
            let cols = [];
            for (let coli=0; coli<colCells.length; coli++)
            {
                let columnName = this.dom.attr( colCells[coli], '_type');
                let colChildren = colCells[coli].childNodes;  // this.dom.children( colCells[coli]); // filters textNodes
                for (let i = 0; i < colChildren.length; ++i)
                    if (colChildren[i].nodeType === Node.TEXT_NODE) columnName += colChildren[i].textContent.trim();
                cols.push( columnName);
                //cols.push( this.dom.attr( colCells[coli], '_type') + colCells[coli].textContent); // columnName
            }
            // For reach data element, find corresponding column and load
            for ( let colName in data)
            {
                let coli = cols.indexOf( colName);
                if (coli == -1) return debug( {level:5, return:"ERR: "+colName+" not a column of "+tableId}, "No column", colName, table);
                let cellContent = data[ colName];
                let cell = newRow.cells.item( coli);
                cell.innerHTML = cellContent;
                if ( cellContent[0] == '=') {
                    // A formula so update ude_formula attribute and compute result
                    var formula = cellContent.substr( 1); 
                    this.dom.attr( cell, 'ude_formula', formula);
                    this.ude.calc.updateElement( cell); 
                }                
                if ( cellContent.length && placeholder) this.dom.attr( cell, "ude_place", cellContent); // 2DO class placeholding ?
            }
        }
        /*
        this.update( table.id)
        this.ude.setChanged( table);
        // saveable.setAttribute( 'ud_dbaction', "refresh"); // Temp : force refresh page
        */
        return newRow;
    } // UDEtable.insertRow()
    
    insertColumn( tableId="", colIndex=-1, data=null)
    {
        // Find table
        let table;
        if ( tableId) table = document.getElementById( tableId);
        else if ( this.dom.cursor.HTMLelement) 
            table = this.dom.getParentAttribute( "table", "_element", this.dom.cursor.HTMLelement); // .parentNode.parentNode;
        else return debug( {level:5, return:null}, "No cursor or no cursor at table");
        if (!table) return debug( {level:5, return:"ERR: no table "+tableId}, "No table", tableId);
        // Check colIndex
        if ( colIndex == -1) {
            // Get colIndex from cursor
            colIndex = 0;
            let walkCell = this.dom.cursor.HTMLelement;
            let safe = 20;
            while ( (walkCell = walkCell.previousSibling) && safe--) colIndex++;
        }
        else if ( colIndex >= table.rows[0].cells.length ) { 
            return debug( {level:5, return:null}, "No such col in table", colIndex, table);
        }
        // Prepare colData array
        let colData=[];
        if ( typeof data == 'string') { colData = data.split(';');} // csv data
        for ( let coli=colData.length; coli< table.rows.length; coli++) { colData.push("");} // top up to table length 
        // Insert cell in each row of table
        let rows = table.rows;
        for( let rowi=0; rowi< rows.length; rowi++) {
            // 2DO move to dom.insertElement()
            // this.dom.insertElement( row.cells[0].tagName, colData[i], {}, rows[i].cells[ colIndex]);
            let newCell=null;
            let row = rows[ rowi];
            let cellAfter = row.cells[ colIndex].nextSibling;
            newCell = document.createElement( row.cells[0].tagName);
            if ( cellAfter) { row.insertBefore( newCell, cellAfter);}
            else { row.appendChild( newCell);}            
            let textNode = document.createTextNode( "");
            if ( colData && colData[ rowi]) textNode.textContent = colData[ rowi];
            newCell.appendChild( textNode);
            if ( rowi == 0) {
                let defName = "Col "+row.cells.length;
                newCell.textContent = defName;
                this.dom.attr( newCell, 'ude_place', defName);
            }
        }
        // 
        return rows[0].cells[ colIndex+1]; // table; 
    } // UDEtable.insertColumn()
    
    removeRow( tableOrId, rowOrIndex) { return this.deleteRow( tableOrId, rowOrIndex);}
    deleteRow( tableOrId, rowOrIndex)  {
        let table = null;
        let cell = null;
        if ( tableOrId) table = this.dom.element( tableOrId);
        else if ( this.dom.cursor.HTMLelement)
        {
            table = this.dom.getParentAttribute( "table", "_element", this.dom.cursor.HTMLelement); // .parentNode.parentNode;
            cell = this.dom.cursor.HTMLelement;
            if (cell.tagName.toLowerCase() != "td") return debug( {level:2}, "Can't insert TR as cursor not on TD", this.cursor);
        }    
        else return debug( {level:5, return:null}, "No cursor or no cursor at table");
        if (!table) return debug( {level:5, return:null}, "No table", tableOrId);
        // Interpret index and find ROW to remove
        let index = ( typeof rowOrIndex == 'object') ? Array.prototype.indexOf.call( rowOrIndex.parentNode.rows, rowOrIndex) : rowOrIndex - 1;
        let row = null;  // DOM will use cursor in this case
        if ( index > -1) 
        {
            // Find row at Index
            var body = table.getElementsByTagName('tbody')[0];
            if ( index > body.rows.length) index = body.rows.length-1; 
            if ( body) row = body.rows[ index]; 
            if ( !body || !row) return debug( {level:5, return:null}, "No body or row", table);
        } 
        else if ( cell) row = cell.parentNode;
        else return debug( {level:2, return : null}, "Table specified but not index");
        // Get Next and previous cells
        let nextRow = row.nextSibling;
        let prevRow = row.previousSibling;
        let nextCell = null;
        if ( nextRow) nextCell = nextRow.cells[0];   // 1st editable cell of nextRow
        let prevCell = null;
        if ( prevRow) prevCell = prevRow.cells[ prevRow.cells.length -1]; // last editable cell of prevRow
        // Remove row
        row.remove();
        // Update table
        this.updateTable( table.id);        
        // Return cell where to place cursor
        if ( nextCell) return nextCell; else return prevCell;
    } // UDEtable.deleteRow()

   /**
	* Empty a table's body
	* @param {string} elementId Id of <ul> element, 0 for cursor position
	* @param {integer] index Index of item to delete
	*/
    emptyTable( elementOrId, index) {
        let element = this.dom.element( elementOrId);	
        if ( !element) return debug( {level:1, return:null}, "Table not found or no cursor", elementOrId)
		let exTag = this.dom.attr( element, "exTag");
		if (  exTag == "div.table") element = this.dom.element( "table", element); //element.getElementsByTagName( "ul")[0];
		else if ( exTag != "table" ) return debug( {level:1, return:null}, "Not a table element");
        let body = element.getElementsByTagName('tbody')[0];
        let rows = this.dom.children( body);
        for ( let rowi=1; rowi < rows.length; rowi++) {
            let row = rows[ rowi];
            if ( !row.classList.contains( 'model')) row.remove();            
        }
    } 
    
    /**
	* Clear selected class
	* @param {string} tableOrId Table element or its id
	* @param {integer] index Index of item to delete
	*/
    clearSelected( tableOrId) {
        let table = this.dom.element( tableOrId);
        if ( table && table.tagName.toLowerCase() != "table") table = this.dom.elements('table', table)[0];
        if (!table) return debug( {level:1, return:"ERR: no table "+tableOrId}, "No table", tableOrId);        
        // Remove selected class from all cells
        let rows = table.rows;
        for ( let rowi=0; rowi < rows.length; rowi++) {
            let cells = rows[ rowi].cells;
            for ( let celli=0; celli < cells.length; celli++) cells[ celli].classList.remove( 'selected');
        }
        return true;    
    } 

    /**
	* Set selected class
	* @param {string} tableOrId Table element or its id
	* @param {integer] index Index of item to delete
	*/
    setSelected( tableOrId, fromCell, toCell) {
        let table = this.dom.element( tableOrId);
        if ( table && table.tagName.toLowerCase() != "table") table = this.dom.elements('table', table)[0];
        if (!table) return debug( {level:1, return:"ERR: no table "+tableOrId}, "No table", tableOrId);
        // Clear selected
        this.clearSelected( table);
        // Set from and to row/column
        let fromRow = fromCell.row;
        let toRow = toCell.row;
        let fromCol = fromCell.column;
        let toCol = toCell.column;
        if ( fromRow > toRow) {
            toRow = fromRow;
            fromRow = toCell.row;
        }
        if ( fromCol > toCol) {
            toCol = fromCol;
            fromCol = toCell.column;
        }
        // Add selected class to cells
        let rows = table.rows;
        for ( let rowi=fromRow; rowi <= toRow; rowi++) {
            let cells = rows[ rowi].cells;
            for ( let celli=fromCol; celli <= toCol; celli++) cells[ celli].classList.add( 'selected');
        }
        return true;    
    } 

    /**
	* @api {JS} $$$.removeColumn(tableid,colIndex) Remove a column from a table
	* @apiParam {string} tableId Id of table element
	* @apiParam {integer} colIndex Index of column to delete starting with 1
    * @apiSuccess {boolean} true
    * @apiError  {string}  Error message
    * @apiGroup Tables
	*/
    removeColumn( tableOrId, cellOrIndex)  {        
        // Find table, head & body
        let table = this.dom.element( tableOrId);
        if ( table && table.tagName.toLowerCase() != "table") table = this.dom.elements('table', table)[0];
        if (!table) return debug( {level:1, return:"ERR: no table "+tableOrId}, "No table", tableOrId);        
        let thead = this.dom.elements( 'thead', table)[0];
        let tbody = this.dom.elements( 'tbody', table)[0];
        if ( !thead || !tbody ) return debug( {level:5, return:"ERR: no head or body in "+id}, "No head or body", table);       
        // Check column index
        let colIndex = ( typeof cellOrIndex == 'object') ? Array.prototype.indexOf.call( cellOrIndex.parentNode.cells, cellOrIndex) : cellOrIndex - 1;
        if ( !colIndex || colIndex > thead.rows[0].cells.length) 
            return debug( {level:5, return:"ERR: bad column index"+colIndex}, "Bad column index", colIndex); 
        if ( thead.rows[0].cells.length == 1) 
            return debug( {level:5, return:"ERR: can't remve last column, delete table instead"}, "Last column reove, delete table instead");     
        // Remove column
        let rows = table.rows;
        for ( let rowi=0; rowi < rows.length; rowi++) rows[ rowi].deleteCell( colIndex);
        return true;        
    }
    
    setColumnWidths( tableId, widths)
    {
        // Get table, head and body
        let table = document.getElementById( tableId);
        if ( table.tagName.toLowerCase() != "table") table = table.getElementsByTagName('table')[0];
        if (!table) return debug( {level:1, return:"ERR: no table "+id}, "No table", id);        
        let thead = table.getElementsByTagName('thead')[0];
        let tbody = table.getElementsByTagName('tbody')[0];
        if ( !thead || !tbody ) return debug( {level:5, return:"ERR: no head or body in "+id}, "No head or body", table);        
        // Get 1t header row and 1st body 
        let firstHeader = thead.childNodes[0].cells;
        let firstBody = null;
        if ( tbody.childNodes.length > 0) firstBody = tbody.childNodes[0].cells;
        else return;
        let widthRow = this.dom.attr( table, 'computed_width'); 
        for ( var i=0; i< firstHeader.length; i++)
        {
            let headCell = firstHeader[ i];
            let cellName = headCell.textContent;
            let bodyCell = firstBody[ i];
            let width = widths[ cellName.toLowerCase()];
            headCell.style.width = Math.round( width*widthRow/100)+'px';
            bodyCell.style.width = Math.round( width*widthRow/100)+'px';
        }
    } // UDEtable.setColWidths()
    
    setRowHeights( tableId, heights)
    {
        
    } // UDEtable.setRowHeights()
    
     
    /* * 
     *  CALCULATOR PART - Methods for running calculator functions on a table
     */
     
    // Match row - return true if cells match
    matchRow( row, expr, cols)
    {
        // 2DO if expr = !.... then inverse logic
        // Build JSON string of row's values
        var cells = row.cells;
        var rowstr = "";            
        for (var j=0; j <cells.length; j++)
        {
            if ( cells[j] == window.UDEcalc_element) return false;
            rowstr += cols[j]+":"+cells[j].textContent+",";
        }
        //rowstr = rowstr.substring( 0, rowstr.length-1)+"."; 
        // RegEx match
        if ( rowstr.match( expr)) return true;
        return false;
    } //UDEtable.matchRow()

    /*
    * @api {JS} API.findRows(tableId) Get matching rows' no
    * @apiParam {string} tableId Id of HTML table
    * @apiParam {string} selector Regular expression to match concanted row
    * @apiSuccess {[integer]} return List of row nos
    * @apiGroup Tables
    */
    findRows( tableId, selector)
    {
        var r=[];
        // Get table, head and body
        var table = document.getElementById( tableId);
        if ( table.tagName.toLowerCase() != "table") table = table.getElementsByTagName('table')[0];
        if (!table) return debug( {level:1, return:"ERR: no table "+id}, "No table", id);        
        var thead = table.getElementsByTagName('thead')[0];
        var tbody = table.getElementsByTagName('tbody')[0];
        if ( !thead || !tbody ) return debug( {level:5, return:"ERR: no head or body in "+id}, "No head or body", table);        
        // Get column names from header row
        var cols = [];
        var headerRow = thead.rows[0].cells;
        for (var coli=0; coli < headerRow.length; coli++)
        {
            let colType = this.dom.attr( headerRow[coli], '_type');
            if ( colType)
                cols.push( colType + headerRow[coli].textContent);
            else
                cols.push( headerRow[coli].textContent);
        }
        // Get rows
        var rows = tbody.rows;
        for (var i=0;i<rows.length; i++)
        {
           if ( this.matchRow( rows[i], selector, cols)) r.push( i + 1);
        }
        // if ( r.length == 0 && i > 0) r.push( rows.length); //-1);
        return r;
    } // UDEtable.findRows()
 
    /* 
    * @api {JS} API.findFirstRow(tableId,selector) Get 1st matching row's index
    * @apiParam {string} tableId Id of HTML table
    * @apiParam {string} selector Regular expression to match concanted row
    * @apiSuccess {integer} return Index of first matching row
    * @apiGroup Tables
    */
    findFirstRow( tableId, selector)
    {
        var w = this.findRows( tableId, selector);
        if (w) return w[0];
        else return -1;
    } // UDE.findFirstRow()

    getFirstRow( tableId, selector) {
        let ind = this.findFirstRow( tableId, selector);
        if (ind > -1) return this.getRow( tableId, ind);
        return null;
    }
   
   /**
    * @api {JS} API.sumsBy(tableId,key,valueToAdd,firstRow,lastRow) Column sums by a column value
    * @apiParam {string} tableId Id of HTML table
    * @apiParam {string} key Column name used for grouping
    * @apiParam {string} valueToAdd Column name used for value to cumulate
    * @apiParam {mixed} firstRow index of first row or search expression
    * @apiParam {mixed} lastRow index of last row or search expression   
    * @apiSuccess {object} return Named list of sums
    * @apiGroup Tables
    */
    sumsByOld( tableId, key, valueToAdd, firstRow, lastRow) {
        var r={};
        // Params
        if ( typeof firstRow == "string") firstRow = this.findFirstRow( tableId, firstRow);        
        if ( typeof lastRow == "string") lastRow = this.findFirstRow( tableId, lastRow);
        // Get table, head and body
        var table = document.getElementById( tableId);
        if ( table.tagName.toLowerCase() != "table") table = table.getElementsByTagName('table')[0];
        if (!table) return debug( {level:1, return:"ERR: no table "+id}, "No table", id);        
        var thead = table.getElementsByTagName('thead')[0];
        var tbody = table.getElementsByTagName('tbody')[0];
        if ( !thead || !tbody ) return debug( {level:5, return:"ERR: no head or body in "+id}, "No head or body", table);        
        // Get column names from header row
        var cols = [];
        var headerRow = thead.rows[0].cells;
        for (var coli=0; coli < headerRow.length; coli++)
        {
            let colType = this.dom.attr( headerRow[coli], '_type');
            if ( colType)
                cols.push( colType + headerRow[coli].textContent);
            else
                cols.push( headerRow[coli].textContent);
        }
        var keyIndex = cols.indexOf( key);
        var valueToAddIndex = cols.indexOf( valueToAdd);
        if ( keyIndex == -1 || valueToAddIndex == -1)
                return debug( {level:1, return:"ERR: can't find "+key+" or "+valueToAdd}, "No key or valueToAdd", table, key, valueToAdd);
        // Get rows
        var rows = tbody.rows;
        if ( lastRow > rows.length) { lastRow = rows.length - 1;}
        for ( let rowi = firstRow; rowi < lastRow; rowi++)
        {
            // For each row add value to apprpriate counter
            var cells = rows[ rowi].cells;
            var keyVal = cells[ keyIndex].textContent;
            if ( typeof r[ keyVal] == "undefined")  r[ keyVal] = 0;
            var nb = parseFloat( cells[ valueToAddIndex].textContent);
            if ( !isNaN( nb)) r[ keyVal] += nb;
        }
        
        // Return sums table as list
        var rs = "";
        for ( var rkey in r) rs += rkey+":"+r[rkey] + " €, "; // BIdon not always euros + rKey may need ""
        return rs; // .substring( 0, rs.length-4);
    } // UDEtable.sumsBy()
    
   /* 
    * @api {JS} API.sumsBy(tableId,groupBy,valueToAdd,selector) A column sums according to a column's value
    * @apiParam {string} tableId Id of HTML table
    * @apiParam {string} groupBy Column name of key
    * @apiParam {string} valueToAdd Column name of value 
    * @apiParam {mixed} selectors If string, row match expression,  if object then match with firstRow and lastRow attributes  
    * @apiSuccess {object} return Named list of sums
    * @apiGroup Tables
    */
    sumsBy( tableId, groupBy, valueToAdd, selectors) {
        let r={};
        let match = selectors;
        let firstRow = "";
        let lastRow = "";
        if ( typeof selectors == "object") {
            match = this.dom.udjson.value( selectors, 'match');
            firstRow = this.dom.udjson.value( selectors, 'firstRow');
            lastRow = this.dom.udjson.value( selectors, 'lastRow');
            if ( firstRow && typeof firstRow == "string" ) firstRow = this.findFirstRow( tableId, lastRow);        
            if ( lastRow && typeof lastRow == "string") lastRow = this.findFirstRow( tableId, lastRow);
        }
        // Get table, head and body
        let table = document.getElementById( tableId);
        if ( table && table.tagName.toLowerCase() != "table") table = table.getElementsByTagName('table')[0];
        if (!table) return debug( {level:1, return:"ERR: no table "+tableId}, "No table", tableId);        
        let thead = table.getElementsByTagName('thead')[0];
        let tbody = table.getElementsByTagName('tbody')[0];
        if ( !thead || !tbody ) return debug( {level:5, return:"ERR: no head or body in "+id}, "No head or body", table);        
        // Get column names from header row
        let cols = this.dom.domvalue.getColNamesForIndex( thead.rows[0].cells);
        let keyIndex = cols.indexOf( groupBy);
        let valueToAddIndex = cols.indexOf( valueToAdd);
        if ( keyIndex == -1 || valueToAddIndex == -1)
                return debug( {level:1, return:"ERR: can't find "+groupBy+" or "+valueToAdd}, "No key or valueToAdd", table, groupBy, valueToAdd);
        // Get rows
        let rows = tbody.rows;
        if ( !lastRow || lastRow > rows.length) { lastRow = rows.length - 1;}
        if ( !firstRow || firstRow < 0) { firstRow = 0;}
        for ( let rowi = firstRow; rowi <= lastRow; rowi++)
        {
            // For each matching row add value to apprpriate counter
            if ( !match || this.matchRow( rows[ rowi], match, cols)) {
                let cells = rows[ rowi].cells; 
                let keyVal = cells[ keyIndex].textContent;
                if ( keyVal.indexOf( ' ') > -1) { keyVal = "'"+keyVal+"'";}
                if ( keyVal && keyVal != "''") {
                    if ( typeof r[ keyVal] == "undefined")  r[ keyVal] = 0;
                    let nb = parseFloat( cells[ valueToAddIndex].textContent);
                    if ( !isNaN( nb)) r[ keyVal] += nb;
                }
            }            
        }        
        // Return sums table as list
        return r;
    } // UDEtable.sumsBy()
    
    sumsByAK( tableId, groupBy, valueToAdd, selector) {
        let list = this.sumsBy( tableId, groupBy, valueToAdd, selector);
        let keys = [];
        for ( let key in list) { keys.push( key);}
        return keys;
    }
    sumsByAV( tableId, groupBy, valueToAdd, selector) {
        let list = this.sumsBy( tableId, groupBy, valueToAdd, selector);
        let vals = [];
        for ( let key in list) { vals.push( list[ key]);}
        return vals;
    }    
   
   /**
    * @api {JS} API.sumsIf(tableId,valueToAdd,rowMatch) Column sum of selected rows
    * @apiParam {string} tableId Id of HTML table
    * @apiParam {string} valueToAdd Column name of value 
    * @apiParam {string} rowMatch Reguar expression to select rows ow    
    * @apiSuccess {integer} return Sum
    * @apiGroup Tables
    */
    sumIf( tableId, valueToAdd, rowMatch) {
        var r=0;
        // Get table, head and body
        var table = document.getElementById( tableId);
        if (!table) return debug( {level:1, return:"ERR: no table "+tableId}, "No table", tableId);
        if ( table.tagName.toLowerCase() != "table") table = table.getElementsByTagName('table')[0];
        if (!table) return debug( {level:1, return:"ERR: no table "+tableId}, "No table", tableId);        
        var thead = table.getElementsByTagName('thead')[0];
        var tbody = table.getElementsByTagName('tbody')[0];
        if ( !thead || !tbody ) return debug( {level:5, return:"ERR: no head or body in "+tableId}, "No head or body", table);        
        // Get column names from header row
        let cols = this.dom.domvalue.getColNamesForIndex( thead.rows[0].cells);
        var valueToAddIndex = cols.indexOf( valueToAdd);
        if ( valueToAddIndex == -1)
                return debug( {level:1, return:"ERR: can't find "+valueToAdd}, "No valueToAdd", table, valueToAdd);
        // Get rows
        var rows = tbody.rows;
        var firstRow = 0;
        var lastRow = rows.length-1;
        for (var i=firstRow; i<=lastRow; i++)
        {
            // For each matching row add value
            var cells = rows[i].cells;
            var nb = parseFloat( cells[ valueToAddIndex].textContent);
            if ( !isNaN( nb) && this.matchRow( rows[i], rowMatch, cols)) r += nb;
        }
        
        // Return sum
        return r;
        
    } // UDEtable.sumsIf()

   /**
    * @api {JS} API.concatIf(tableId,valueToAdd,rowMatch) Concatenation of a column for selected rows
    * @apiParam {string} tableId Id of HTML table
    * @apiParam {string} valueToAdd Column name of value 
    * @apiParam {string} rowMatch Reguar expression to select rows ow    
    * @apiSuccess {string} return Concantenation
    * @apiGroup Elements
    */
    concatIf( tableId, valueToAdd, rowMatch)
    {
        var r="";
        // Get table, head and body
        var table = document.getElementById( tableId);
        if (!table) return debug( {level:1, return:"ERR: no table "+tableId}, "No table", tableId);
        if ( table.tagName.toLowerCase() != "table") table = table.getElementsByTagName('table')[0];
        if (!table) return debug( {level:1, return:"ERR: no table "+tableId}, "No table", tableId);        
        var thead = table.getElementsByTagName('thead')[0];
        var tbody = table.getElementsByTagName('tbody')[0];
        if ( !thead || !tbody ) return debug( {level:5, return:"ERR: no head or body in "+tableId}, "No head or body", table);
        // Get column names from header row
        let cols = this.dom.domvalue.getColNamesForIndex( thead.rows[0].cells);
        var valueToAddIndex = cols.indexOf( valueToAdd);
        if ( valueToAddIndex == -1)
                return debug( {level:1, return:"ERR: can't find "+valueToAdd}, "No key or valueToAdd", table, key, valueToAdd);
        // Get rows
        var rows = tbody.rows;
        var firstRow = 0;
        var lastRow = rows.length-1;
        for (var i=firstRow; i<=lastRow; i++)
        {
            // For each matching row add value
            let row = rows[ i];
            let cells = row.cells;
            let txt = "";
            // 2DO make dom fct
            let cellChildren = cells[ valueToAddIndex].childNodes;
            for ( let childi=0; childi < cellChildren.length; childi++)
            {        
                let cellChild = cellChildren[ childi];        
                if (  cellChild.nodeType == 3 && cellChild.textContent) txt += cellChild.textContent + "\n";
            }        
            // let txt=cells[ valueToAddIndex].textContent.trim().replace( /<br>/g, "\n");
            if ( this.matchRow( row, rowMatch, cols) && txt.indexOf( "2DO") == -1) r += txt+"\n"; // 2DO Horrible patch 2DO
        }
        
        // Return sum
        return r;
        
    } // UDEtable.concatIf()
        
   /**
    *  @api {JS} API.valueList(tableId,columnName) Get values from table 
    *  @apiParam {string} tableId Id of table
    *  @apiParam {string} columnName Label of column
    *  @apiSuccess {[string]} return List of text contents
    *  @apiGroup Data
    */
    valueList( tableId, columnName, unique = true)
    {
        let r=[];
        // Get table, head and body
        let table = this.dom.element( tableId);
        if (!table) return debug( {level:1, return:"ERR: no table "+tableId}, "No table", tableId);        
        if ( table.tagName.toLowerCase() != "table") table = table.getElementsByTagName('table')[0];
        let thead = table.getElementsByTagName('thead')[0];
        let tbody = table.getElementsByTagName('tbody')[0];
        if ( !thead || !tbody ) return debug( {level:5, return:"ERR: no head or body in "+tableId}, "No head or body", table);
        // Get column names from header row
        let cols = this.dom.domvalue.getColNamesForIndex( thead.rows[0].cells);
        // Find columnName
        let colIndex = cols.indexOf( columnName);
        if (!colIndex) return debug( {level:1, return:[]}, "No such column in table", columnName, table);        
        // Compile value from each row
        let rows = tbody.rows;
        for (let rowi=0; rowi < rows.length; rowi++)
        {
            if ( !rows[rowi].cells[colIndex].textContent) { continue;}
            // Add to  result
            let colValue = rows[rowi].cells[colIndex].textContent;
            if ( !unique || r.indexOf( colValue) == -1) { r.push( colValue);}
            // Update DOM_accessedValues
            if ( typeof DOM_lastAccessedValues != "undefined") DOM_lastAccessedValues.push( rows[rowi].cells[colIndex]);
        }
        // Encode as JSON and return
        return r; // JSON.stringify( r);        
    }  // UDEtable.valueList()   
    
  /**
    *  @api {JS} API.getRow(tableId,rowIndex) Return a row as an object 
    *  @apiParam {string} tableId Id of table
    *  @apiParam {string} rowIndex Index of row
    *  @apiParam {boolean} html Returns HTML contents if true (default)
    *  @apiSuccess {object} return Object with columnName:value
    *  @apiGroup Tables
    *
    */
    getRow ( tableId, rowIndex, html = true, defaultAsEmpty = false) {
        let r={};
        // Get table, head and body
        let table = document.getElementById( tableId);
        if ( table && table.tagName.toLowerCase() != "table") table = table.getElementsByTagName('table')[0];
        if (!table) return debug( {level:1, return:"ERR: no table "+tableId}, "No table", tableId);        
        let thead = table.getElementsByTagName('thead')[0];
        let tbody = table.getElementsByTagName('tbody')[0];
        if ( !thead || !tbody ) return debug( {level:5, return:"ERR: no head or body in "+id}, "No head or body", table); 
        if ( rowIndex > tbody.rows.length) return debug( {level:5, return:null}, "Bad index", tableId, rowIndex);         
        // Get column names from header row
        let cols = [];
        let headerRow = thead.rows[0].cells;
        for (var coli=0; coli < headerRow.length; coli++)
        {
            let colType = this.dom.attr( headerRow[coli], '_type');
            if ( colType)
                cols.push( colType + headerRow[coli].textContent);
            else
                cols.push( headerRow[ coli].textContent);
        }
        // Get row
        let row = tbody.rows[ rowIndex-1];
        if ( !row) return null;
        let cells = row.cells;         
        // Add value from each column
        for ( coli=0; coli < cols.length; coli++)
        {
            // Add to  result
            let cell = cells[ coli];
            let input = this.dom.element( 'input', cell);
            if ( input) r[ cols[coli]] = this.dom.attr( input, 'value');
            else
                r[ cols[coli]] = (html) ? cells[ coli].innerHTML : cells[ coli].textContent;
            if ( defaultAsEmpty && this.dom.hasDefaultContent( cells[ coli])) r[ cols[coli]] = "";
            if ( cols[ coli] == "id") {
                r[ 'oid'] = this.dom.attr( cells[ coli], 'ud_oid');
            }           
            // Update DOM_accessedValues
            if ( typeof DOM_lastAccessedValues != "undefined") 
                DOM_lastAccessedValues.push( row.cells[ coli]);
        }
        // Return object
        return r;                
    } // UDEtable.getRow()
    
   /**
    * @api {JS} API.tableColumns(tableId) Get matching rows' no
    * @apiParam {string} tableId Id of HTML table
    * @apiSuccess {[integer]} return List of row nos
    * @apiGroup Tables
    */
    tableColumns( tableId)
    {
        let cols=[];
        // Get table, head and body
        let table = document.getElementById( tableId);
        if ( table.tagName.toLowerCase() != "table") table = table.getElementsByTagName('table')[0];
        if (!table) return debug( {level:1, return:"ERR: no table "+id}, "No table", id);        
        let thead = table.getElementsByTagName('thead')[0];
        let tbody = table.getElementsByTagName('tbody')[0];
        if ( !thead || !tbody ) return debug( {level:5, return:"ERR: no head or body in "+id}, "No head or body", table);        
        // Get column names from header row
        let headerRow = thead.rows[0].cells;
        for ( let coli=0; coli < headerRow.length; coli++)
        {
            let colType = this.dom.attr( headerRow[coli], '_type');
            if ( colType)
                cols.push( colType + headerRow[coli].textContent);
            else
                cols.push( headerRow[coli].textContent);
        }
        return cols;
    } // UDEtable.tableColumns()

    /**
    * @api {JS} $$$.getColumn(tableOrId,cell) Get all cells in column indicated by cell
    * @apiParam {string} tableId Id of HTML table
    * @apiSuccess {[integer]} return List of row nos
    * @apiGroup Tables
    */
    getColumn( tableOrId, cellOrIndex) {
        let r = [];
        let table = $$$.dom.element( tableOrId);
        let colIndex = ( typeof cellOrIndex == 'object') ? Array.prototype.indexOf.call(cellOrIndex.parentNode.cells, cellOrIndex) : cellOrIndex - 1;
        let rows = table.rows;
        for ( let rowi=0; rowi < rows.length; rowi++) {
            // if ( rows[ rowi].classList.contains('rowModel')) continue;
            let cells = rows[ rowi].cells;
            r.push( cells[ colIndex]);
        }
        return r;  
    }

    /**
    * @api {JS} $$$.getRowAndColum(tableOrId,cell) Return an object with cell,row index & column index
    * @apiParam {string} tableId Id of HTML table
    * @apiSuccess {[integer]} return List of row nos
    * @apiGroup Tables
    */
    getRowAndColumn( tableOrId, cell) {
        let table = $$$.dom.element( tableOrId);
        if ( !table) return null;
        let colIndex = Array.prototype.indexOf.call(cell.parentNode.cells, cell);
        let rowIndex = Array.prototype.indexOf.call(  table.rows, cell.parentNode);
        return { cell:cell, row:rowIndex, column:colIndex};  
    }

   /**
    * @api {JS} API.writeCell(tableId,row,col) Write a cell's value
    * @apiParam {string} tableId Id of HTML table
    * @apiParam {mixed} row Index of row or key
    * @apiParam {string} column name
    * @apiParam {string} value, HTML or text to write to cell, if it starts with "=" it will be used as a formula
    * @apiSuccess {[integer]} return List of row nos
    * @apiGroup Tables
    */
    writeCell( tableId, row, col, value) {
        // Get table, head and body
        let table = document.getElementById( tableId);
        if ( table.tagName.toLowerCase() != "table") table = table.getElementsByTagName('table')[0];
        if (!table) return debug( {level:1, return:"ERR: no table "+id}, "No table", id);        
        let thead = table.getElementsByTagName('thead')[0];
        let tbody = table.getElementsByTagName('tbody')[0];
        if ( !thead || !tbody ) return debug( {level:5, return:"ERR: no head or body in "+id}, "No head or body", table);
        // Find row
        let rowIndex = -1;
        if ( typeof row == "number") rowIndex = row - 1;
        else {
            // 2DO Use key to find row no
        }          
        if ( rowIndex == -1 ||rowIndex > tbody.rows.length) return debug( {level:5, return:null}, "Can't find row", tableId, row);         
        // Find column names from header row
        let colIndex = -1;
        let headerRow = thead.rows[0].cells;
        for (var coli=0; coli < headerRow.length; coli++)
        {
            if  ( headerRow[coli].textContent == col) {
                colIndex = coli;
                break;
            }
        }
        if ( coli == -1) return debug( {level:5, return:null}, "Can't find column", tableId, col);
        // Write cell
        tbody.rows[ rowIndex].cells[ colIndex].innerHTML = value;
        if ( value[0] == '=') {
            // A formula so update ude_formula attribute and compute result
            let formula = value.substr( 1); 
            let cell = tbody.rows[ rowIndex].cells[ colIndex];
            this.dom.attr( cell, 'ude_formula', formula);
            this.ude.calc.updateElement( cell); 
        }     
        // Update object
        let editZone = table.parentNode;
        this.prepareToSave( editZone, $$$.dom.element( $$$.dom.attr( editZone, 'ude_bind')));
        return value;
    }
    /**
    * @api {JS} API.updateRow(tableId,row,data) Update several cells of a row
    * @apiParam {string} tableId Id of HTML table
    * @apiParam {mixed} row Index of row or key
    * @apiParam {object} data, Named array of cells with new value
    * @apiSuccess {boolean]} return True if no errors,false otherwise
    * @apiGroup Elements
    */
    updateRow( tableId, rowIndex, data) {
        for ( let key in data) {
            if ( !this.writeCell( tableId, rowIndex, key, data[ key])) return false;
        }
        return true;
    }
 
 } // JS class UDEtable
 
if ( typeof process != 'object') {
    /*define( function() {   
        let exTag = "div.table";    
        if ( window.ud && !window.ud.ude.modules[ exTag].instance) {
            // Initialise
            let module = new UDEtable( window.ud.dom, window.ud.ude);
            window.ud.ude.modules[ exTag].instance = module;
            window.ud.ude.modules[ exTag].state = "loaded";
            window.ud.ude.tableEd = module;
        }
        let src = new Error().stack.match(/([^ \n])*([a-z]*:\/\/\/?)*?[a-z0-9\/\\]*\.js/ig)[0];
        return { class : UDEtable, src: src, exTag:'div.table'};
    });*/
    let exTag = "div.table";    
    if ( window.ud && !window.ud.ude.modules[ exTag].instance) {
        // Initialise
        let module = new UDEtable( window.ud.dom, window.ud.ude);
        window.ud.ude.modules[ exTag].instance = module;
        window.ud.ude.modules[ exTag].state = "loaded";
        window.ud.ude.tableEd = module;
    }
} else {
    // Testing under node.js
    module.exports = { class: UDEtable};
    let exTag = "div.table";    ;
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined")
    {
        console.log( 'Start of test program');
        console.log( 'Syntax:OK');
        console.log( 'Start of test program');
        console.log( "Setting up browser (client) test environment");
        let path = "../..";        
        const testMod = require( path+'/tests/testenv.js');
        testMod.load( []);
        // TEST_verbose = true;
        let ud = new UniversalDoc( 'document', true, 133);
        let ude = ud.ude; // new UDE( window.topElement, null); 
        // Initialise
        let module = new UDEtable( ud.dom, ude);
        ude.modules[ exTag].instance = module;
        ude.modules[ exTag].state = "loaded";
        ude.tableEd = module;        
        let tableEditor = module;
        let view = tableEditor.dom.element( "div.part[name='myView']", tableEditor.dom.element( 'document'));   
        let test = "";        
        // Test 1 - JSON table
        {
            // Create object div.listObject and append to element            
            // Data
            name = "myTable";
            let objectData = {"meta":{"type":"table","class":"tableStyle1", "name":"Table1","zone":"Table1editZone","caption":"Table1","captionPosition":"top"},"data":{"tag":"table", "name":"Table1", "class":"tableStyle1","value":{"thead":{"tag":"thead","value":[{"tag":"tr","value":{"row":{"tag":"th","value":"row"},"A":{"tag":"th","value":"A"},"B":{"tag":"th","value":"B"},"C":{"tag":"th","value":"C"}}},{"tag":"tr", "class":"rowmodel", "value":{"row":{"tag":"td","value":"","formula":"row()"},"A":{"tag":"td","value":"",},"B":{"tag":"td","value":""},"C":{"tag":"td","value":"",}}}]},"tbody":{"tag":"tbody","value":[{"tag":"tr","value":{"row":{"tag":"td","value":"1"},"A":{"tag":"td","value":"Labradors"},"B":{"tag":"td","value":"Labradors"},"C":{"tag":"td","value":"100"}}},{"tag":"tr","value":{"row":{"tag":"td","formula":"row()","value":"2"},"A":{"tag":"td", "value":"Retrievers"},"B":{"tag":"td", "value":""},"C":{"tag":"td","value":"95"}}},{"tag":"tr","value":{"row":{"tag":"td","formula":"row()","value":"3"},"A":{"tag":"td","value":"Setters"},"B":{"tag":"td","value":""},"C":{"tag":"td", "value":"86"}}},{"tag":"tr","value":{"row":{"tag":"td","formula":"row()","value":"4"},"A":{"tag":"td", "value":"Pointers"},"B":{"tag":"td", "value":""},"C":{"tag":"td", "value":"72"}}},{"tag":"tr","value":{"row":{"tag":"td","formula":"row()","value":"5"},"A":{"tag":"td", "value":"Hounds"},"B":{"tag":"td", "value":""},"C":{"tag":"td", "value":"96"}}},{"tag":"tr","value":{"row":{"tag":"td","formula":"row()","value":""},"A":{"tag":"td", "value":"Hounds"},"B":{"tag":"td","value":""},"C":{"tag":"td","value":"10"}}}]}}},"changes":[]};
            let objectAttributes = {id:name+"_object", class:"tableObject, hidden", ud_mime:"text/json"};
            let objectElement = tableEditor.dom.prepareToInsert( 'div', JSON.stringify( objectData), objectAttributes);
            // Create container div.table
            let tableElementId = "B0100000005000000M";            
            let tableAttributes = {id:tableElementId, class:"table", ud_mime:"text/json"};
            let tableElement = tableEditor.dom.prepareToInsert( 'div', "...", tableAttributes);
            tableElement.appendChild( objectElement);
            // Append list to view
            view.appendChild( tableElement);   
            // Initialise list
            tableEditor.initialise( tableElementId);
            // Check nb of tables
            if (ude.dom.elements( "#Table1", view).length == 1) console.log( "Test 1 : OK");
            else console.log( "Test 1  : KO", ude.dom.elements( "table", view).length);
        }       
        // Test 2 - HTML table
        {
            // Create list with HTML     NOT UPDATED       
            // Data
            name = "myTable";
            let objectData = '<span>My Table 2 <span class="objectName">myTable2></span></span>';
            objectData += '<table id="myTable2" class="tableStyle1"><thead><tr><th>A</th><th>B</th><th>C</th></tr></thead><tbody><tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tbody></table>';            
            // Create container div.list
            let tableId = "B0100000007000000M";            
            let tableAttributes = {id:tableId, class:"table", ud_mime:"text/html"};
            let tableElement = tableEditor.dom.prepareToInsert( 'div', objectData, tableAttributes);
            // Append list to view
            view.appendChild( tableElement);   
            // Initialise list
            tableEditor.initialise( tableId);
            if ( ude.dom.elements( "table", view).length == 4) console.log( "Test 2 : OK");
            else console.log( "Test 2  : KO", ude.dom.elements( "table", view).length); 
        } 
        // Test 3 - Text as caption
        {
            // Create table with text           
            // Data
            name = "myTable";
            let objectData = 'My Table 3';          
            // Create container div.list
            let tableId = "B010000000900000M";            
            let tableAttributes = {id:tableId, name:name, class:"table", ud_mime:"text/json"};
            let tableElement = tableEditor.dom.prepareToInsert( 'div', objectData, tableAttributes);
            // Append list to view
            view.appendChild( tableElement);   
            // Initialise list
            tableEditor.initialise( tableId);
            if ( ude.dom.elements( "table", view).length == 5) console.log( "Test 3 : OK");
            else console.log( "Test 3  : KO", ude.dom.elements( "table", view).length); 
        }        
        // Test 4 - sumsBy
        {
            test = "4 - sumsBy";
            // Find table with text  
            let tableId = "Table1"; // "B0100000005000000M";              
            let sumsBy = tableEditor.sumsBy( tableId, 'A', 'C', "");;             
            testResult( test, ( Object.keys( sumsBy).length == 5 && sumsBy['Hounds'] == 106), Object.keys( sumsBy) + ' ' + sumsBy['Hounds']); 
        }        
 
        
        console.log( 'Test completed');
        process.exit();
    } else {
        if ( typeof ud != "undefined" && !ud.ude.modules[ exTag].instance) {
            // Initialise
            let module = new UDEtable( window.ud.dom, window.ud.ude);
            window.ud.ude.modules[ exTag].instance = module;
            window.ud.ude.modules[ exTag].state = "loaded";
            window.ud.ude.tableEd = module;
        }
    }       
} // End of test routine
