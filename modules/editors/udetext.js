/* -------------------------------------------------------------------------------------------
 *  UDEtext.js
 *    text (line-based) edition child class for ude
 */
/**
 *  The UDEtext JS class is a line-based text editor and works with the server-side udtext.php.
 *  <p>It uses a 2 column table for editing and relies on the udetext editor for some operations</p>
 *  
 *  As with other UD modules, methods are grouped in 4 blocks as listed below :
 *    
 *     1 - UD-VIEW-MODEL - Preparing data received from server for editing
 *     2 - UD-VIEW-MODEL - Preparing edited data for saving
 *     3 - UDE-VIEW      - Editing functions
 *     4 - CALUCLATOR    - Calculator functions on tables 
 *
 */
 class UDEtext
 {
    dom;
    ude;
    textCol1 = "n°";
    textCol2 = "text";
    // nativeExTags = [ "div.text", "div.linetext", "div.commands", "div.css", "div.js", "div.json", "div.apiCalls"];
    defaultContent = { 
        linetext: "Server/CSS/JS/JSON\n\n\n",
        server :"Server\n\n\n",
        css :"CSS\n\n",
        js:"JS\n\n\n",
        json:"JSON\n\n\n",
        api:"API\n\n"
    };
    
    // Set up table editor
    constructor( dom, ude)
    {
        this.dom = dom;
        this.ude = ude;
    } // UDEtext.construct()
    
    // Intilaise a table that's just been created
    initialise( saveableId)  // can find dataholder with ud_bind
    {
        // Get element pointers
        let element = this.dom.element( saveableId);
        let containerElement = element.parentNode; 
        let nextSibling = element.nextSibling;        
        let children = element.childNodes;
        // Get element's type
        let type = this.dom.attr( element, 'ud_type');
        // Get element's style
        let classList = element.classList;
        let style = "";
        for (var i=0; i < classList.length; i++)
            if ( classList.item( i) != "table" && style == "") style = classList.item( i);                
        // Initialise work variables
        let bind = "";
        let content = "";
        let name = "";
        let json = null;
         // Process according to MIME type
        let mimeType = this.dom.attr( element, 'ud_mime');
        if ( !mimeType) { 
            mimeType = "text/json";
            this.dom.attr( element, 'ud_mime', mimeType); 
        }
        // Patch for transition
        if ( mimeType == "text/json" && children.length > 1 ) mimeType = "text/text";        
        switch ( mimeType)
        {
            case "text/json" :
                if ( children.length) {
                    json = JSONparse( children[0].textContent);
                    bind = children[0].id;
                }    
                if ( !json) {
                    let suggestedName = this.dom.attr( element, 'name');
                    //if ( !suggestedName) suggestedName = element.textContent;
                    if ( !suggestedName) suggestedName = "Text_"+element.id; 
                    /*
                    if ( !suggestedName) {
                        let index = 'AutoIndex_'+type;
                        if ( typeof window.udparams[ index] == "undefined") {
                            window.udparams[ index] = 1;
                        }   
                        name = type+' '+window.udparams[ index];
                        window.udparams[ index]++;
                    }
                    */
                    // Delete all children
                    this.dom.emptyElement( element);
                    // Add new object to element
                    let newElement = element.appendChild( this.newTextObject( suggestedName, type));
                    bind = newElement.id;
                    json = JSONparse( newElement.textContent);
                }
                let editZone = this.dom.udjson.putElement( json, bind);
                element.appendChild( editZone);     
                // else if json.meta.name != children[0].id.replace( "_object", ""); debug won't bind
                break;
            case "text/text" :  //(or csv) 
        
                // 2DO improve test, make a function
                if ( children.length && children[0].nodeType == 1 && children[0].tagName == "SPAN" && children[0].classList.contains('caption')) {
                    name = children[0].textContent;
                    name = name.replace(/ /g, '_').replace(/'/g,'_').replace(/"/g, '');            
                    containerElement = element.parentNode;
                    bind = children[1].id;
                    content = children[ children.length - 1].innerHTML; //220804 contains <br's
                } else {
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
                    // Setup Save button            
                    let action = "new UDapiRequest('UDtext', 'setChanged(/"+name+"editZone/, 1);', event);";
                    newElement = this.dom.prepareToInsert( 'input', "", { type:"button", value:"save", onclick:action, udapi_quotes:"//"})
                    newElement = element.appendChild( newElement);
                    // Set up hidden dataHolder with default data
                    content = this.defaultContent[type]; 
                    newElement = this.dom.prepareToInsert( 'div', content, {id:name, class:"listObject, hidden"});
                    newElement = element.appendChild( newElement);
                }
                // Build HTML line text editor as HTML table from JSON data
                // Set up editZone
                let ezname = name+'editZone';
                let attr = { id:ezname, class:'table', ud_type: "editZone", ud_subtype: "text", ude_bind:name, ud_mime:"text/"+type, ude_autosave:"off", ude_stage:"off"};
                let edZone = this.dom.prepareToInsert( 'div', '', attr);
                // Prepare JSON content for editing DEPRECATED
                if ( type == "json") content = this.JSONtoText( content);        
                let edTable = this.convertTextToHTMLtable( content, name, style);
                edZone.appendChild( edTable);
                element.appendChild( edZone);
                break;
        }
        
        //if ( nextSibling) containerElement.insertBefore( edZone, nextSibling);
        //else containerElement.appendChild( edZone);                   
    } // UDEtext.initialise()
     
    newTextObject( suggestedName, subtype) {
        // Name
        let name = suggestedName.replace(/ /g, '_').replace(/'/g,'_').replace(/"/g, '');
        let objectName = name + "_object";
        // Data
        let objectData = { 
            meta:{ type:"text", subtype:subtype, name:name, zone:name+"editZone", caption:suggestedName, captionPosition:"top", autosave:"off"}, 
            data:{ tag:"textedit", class:"textContent "+subtype, value:[ subtype.toUpperCase(), "...", "..."]},
            changes: []
        };
        if ( subtype.toLowerCase() == "json") {
            objectData = { 
                meta:{ type:"text", subtype:subtype, name:name, zone:name+"editZone", caption:suggestedName, captionPosition:"top"}, 
                data:{ tag:"textedit", class:"textContent "+subtype, value:{jsonval1:"..."}},
                changes: []
            };
        };
        // Create object div and append to element
        let objectAttributes = {id:objectName, class:"object textObject, hidden", ud_mime:"text/json"};
        let object = this.dom.prepareToInsert( 'div', JSON.stringify( objectData), objectAttributes);
        this.dom.attr( object, 'ud_mime', "text/json"); 
        return object;
    } // UDEtext.newTextObject()
      
    // Convert text to table-based editor
    convertTextToHTMLtable( content, name, style, saveAction="")
    {
        // 2226012 - avoid \n in servercmds disturbing contenteditable display
        content = content.replace( /<br data-ud-type="linebreak">/g, "\n");
        let lines = content.split( '\n');
        let table = document.createElement( 'table');
        if ( style) table.className = "textContent "+style; else table.className = "textContent";   
        table.id = name+"edittable";
        // this.dom.attr( table, 'ude_bind', name);
        let thead = document.createElement( 'thead');        
        let tbody = document.createElement( 'tbody');
        // Save buton
        let onclick = "window.ud.ude.setChanged( document.getElementById( '"+name+"editZone'), true);";
        if ( saveAction) onclick = saveAction;
        let save = "";
        save += '<span class="rightButton"><a ref="javascript" onclick="'+onclick+'">save</a>';  // 2DO translate term or icon  
        let html = "";
        html += "<tr contenteditable=false><th class=\"rowNo\">"+this.textCol1+"</th><th class=\"linetext\">"+this.textCol2+" "+save+"</th></tr>";
        html += "<tr class=\"rowModel\">";
        html += "<td class=\"rowNo\" ude_formula=\"row()\" contenteditable=\"false\">=row()</td>";
        html += "<td class=\"linetext\">...</td>";
        html += "</tr>";
        thead.innerHTML = html;
        table.appendChild( thead);
        for ( var i=0; i < lines.length; i++)
        {
            let newRow = document.createElement( 'tr');
            html = "";
            html += "<td contenteditable=\"false\" ude_formula=\"row()\" class=\"rowNo\">"+(i+1)+"</td>";
            html += "<td class=\"linetext\">"+lines[i]+"</td>"; 
            newRow.innerHTML = html;
            tbody.appendChild( newRow);
        }  // end of row loop  
        table.appendChild( tbody);
        return table;
    } // UDEtext.convertTextToHTMLtable()
    
    // User-generated event 
    inputEvent( e, element)
    {   
        let processed = false;
        let event = e.event;
        let saveable = this.dom.getSaveableParent( element);
        let exTag = this.dom.attr( saveable, 'exTag');
        let displayable = this.dom.getParentWithAttribute( 'ude_bind', element);        
        let data = "..."; 
        if ( typeof e.data != "undefined") data = e.data; 
        let coffset = this.dom.cursor.textOffset; // 2DO if text edition has decorations, will need to compute offset        
        switch( event) {
            case "change" :
                if ( this.dom.udjson.value( e, 'multinode') == "true") { 
                    let table = this.dom.getParentWithTag( element, 'table');
                    this.ude.tableEd.update( table.id);
                }    
                break;
            case "newline" : 
                let row = null;
                if ( this.dom.isHTML( data)) {
                    // Data is HTML, convert to editable text, split lines on < and each ine to editor
                    let temp = document.createElement( 'textarea');
                    temp.textContent = data.replace( /\n/g, '');
                    let htmledit = temp.innerHTML;  
                    let lines = htmledit.split( '&lt;');
                    for ( let linei=0; linei < lines.length; linei++) {
                        let line = lines[ linei].replace( /\"/g, '\"');
                        if ( line == "") { continue;}
                        let newEvent = { event:event, data:'&lt;'+line.trim()};
                        this.inputEvent( newEvent, element);
                    }
                    processed = true;
                    break;
                }
                let beforeOrAfter = true; // after
                if ( (!data || data == "...") && coffset) {
                    // Split text at cursor using HTML
                    let HTMLoffset = this.dom.cursor.HTMLoffset;
                    let current = this.dom.cursor.HTMLelement.innerHTML;
                    let len = current.length;      
                    if ( HTMLoffset < len) data = current.substr( HTMLoffset, len) ;
                    this.dom.cursor.HTMLelement.innerHTML = current.substr( 0, HTMLoffset);
                } else if ( coffset == 0) { beforeOrAfter = false;}
                // Use Table editor if available
                data = data.replace( /"/g, '\\"');
                let nlContent = this.dom.udjson.parse( '{ "'+ this.textCol1+'":"=row()", "'+this.textCol2+'":"'+data+'"}');
                if ( this.ude.tableEd) row = this.ude.tableEd.insertRow( null, -1, nlContent, beforeOrAfter, false); 
                else row = this.dom.insertElementAtCursor('tr');
                // 2DO should have own update or a more offical way of using udetable
                let update = this.dom.udjson.value( e, 'update');
                if ( update == "" || update) { this.ude.updateTable( row.parentNode.parentNode.id);}               
                if ( this.dom.getParentAttribute( "", "ude_autosave", this.dom.cursor.HTMLelement) != "Off")
                    this.ude.setChanged( this.dom.cursor.HTMLelement);
                // Move cursor (2DO need a test, may not always be required or wanted)
                this.dom.cursor.HTMLelement = row.querySelector( 'td :not([contenteditable=false])'); //row.cells[0]; 
                if ( !this.dom.cursor.HTMLelement) this.dom.cursor.HTMLelement = row.cells[1];                
                this.dom.cursor.setAt( this.dom.cursor.HTMLelement, data.length);
                /*                
                this.dom.cursor.textElement = this.dom.cursor.HTMLelement.childNodes[0];               
                this.dom.cursor.textOffset = 0;
                this.dom.cursor.set();
                */
                // Event has been processed
                processed = true;
                break;
            case "paste" :
                // Pasting into text content table
                // Check container node
                let ntext = this.dom.cursor.HTMLelement;
                if ( !ntext){ break;}
                // Clear if text is placeholder
                this.ude.clearPlaceholder( ntext); 
                let ctext = ntext.textContent;
                let offsetAfter=0;                
                if ( typeof data == "string") { 
                    // Pasting string data - convert from HTML to text
                    let temp = document.createElement( 'textarea');
                    temp.innerHTML = data.replace( /\n/g, '');
                    let textData = temp.textContent;
                    let cursor = this.dom.cursor;
                    if ( cursor.selectionMultiNode) {
                        // Multiple lines selected 
                        // Delete selected text
                        // First row
                        let row = ntext.parentNode;
                        let table = row.parentNode.parentNode;
                        if ( !coffset) {
                            ntext = this.dom.cursor.focusElement;
                            this.ude.tableEd.removeRow( table, row);
                        } else ntext.textContent = ctext.substring( 0,coffset);
                        let lastRow = this.dom.cursor.focusElement.parentNode.parentNode;
                        let lastOffset = this.dom.cursor.focusOffset;
                        //  Middle rows
                        let walk = row.nextSibling;
                        while( walk && walk != lastRow) {
                            row = walk;
                            walk = walk.nextSibling;
                            this.ude.tableEd.removeRow( table, row);
                        }
                        // Last row
                        if ( lastOffset >= this.dom.cursor.focusElement.parentNode.textContent.length) {
                            if ( ntext == this.dom.cursor.focusElement) ntext = this.dom.cursor.focusElement.nextSibling;
                            this.ude.tableEd.removeRow( table, lastRow);
                        } else lastRow.textContent = lastRow.textContent.substring( lastOffset);                    
                        // Update cursor
                        this.dom.cursor.setAt( ntext, coffset);
                        // this.dom.cursor.fetch();  
                    } else if ( cursor.selectionInNode) {
                        // Replace selected text with pasted text
                        /*
                        ntext.textContent = ctext.substring( 0, coffset) + textData + ctext.substring( cursor.focusOffset);
                        offsetAfter = coffset + textData.length;                    
                        */
                        ntext.textContent = ctext.substring( 0, coffset) + ctext.substring( cursor.focusOffset);
                        this.dom.cursor.setAt( ntext, coffset);
                    } /*else {
                        // Insert text
                        ntext.textContent = ctext.substring( 0, coffset) + textData; //  + ctext.substring( coffset);
                        if ( typeof e.last != "undefined" && !e.last) {
                            // Go to new line
                            let nldata = ctext.substr( coffset);
                            nldata = nldata.replace( /"/g, '\\"');
                            nldata = this.dom.udjson.parse( '{ "'+ this.textCol1+'":"=row()", "'+this.textCol2+'":"'+nldata+'"}');
                            let row = this.ude.tableEd.insertRow( null, -1, nldata);
                            ntext = row.cells[1];
                            offsetAfter = nldata.length;
                        } else {
                            ntext.textContent += ctext.substr( coffset);
                        }    
                    }*/
                    // Insert text
                    if ( !ntext) {
                        let nlContent = this.dom.udjson.parse( '{ "'+ this.textCol1+'":"=row()", "'+this.textCol2+'":"'+data+'"}');
                        if ( this.ude.tableEd) row = this.ude.tableEd.insertRow( null, -1, nlContent, true, false); 
                    }
                    ctext = ntext.textContent;
                    ntext.textContent = ctext.substring( 0, coffset) + textData;
                    if ( typeof e.last != "undefined" && !e.last) {
                        /*
                        // Go to new line
                        let nldata = ctext.substr( coffset);
                        nldata = nldata.replace( /"/g, '\\"');
                        nldata = this.dom.udjson.parse( '{ "'+ this.textCol1+'":"=row()", "'+this.textCol2+'":"'+nldata+'"}');
                        let row = this.ude.tableEd.insertRow( null, -1, nldata);
                        ntext = row.cells[1];
                        offsetAfter = nldata.length;
                        */
                        offsetAfter = ntext.textContent.length;
                    } else {
                        ntext.textContent += ctext.substr( coffset);
                    }   
                    
                                    
                    /* rewritten 24/12/23
                    if ( coffset < ctext.length - 1 && !e.last) { 
                        // Place end of current line on a new line
                        let nldata = ctext.substr( coffset);
                        nldata = nldata.replace( /"/g, '\\"');
                        nldata = this.dom.udjson.parse( '{ "'+ this.textCol1+'":"=row()", "'+this.textCol2+'":"'+nldata+'"}');
                        if ( this.ude.tableEd) {
                            let row = this.ude.tableEd.insertRow( null, -1, nldata);
                            offsetAfter = nldata.length;
                            //this.ude.updateTable( row.parentNode.parentNode.id);
                        }
                        //else row = this.dom.insertElementAtCursor('tr');
                    } else { 
                        ntext.textContent = ctext.substr( 0, coffset) + textData + ctext.substr( coffset);
                        offsetAfter = coffset + textData.length;
                    }
                    */
                    
                }
                else if ( typeof data == "object") {
                    if ( this.dom.udjson.value( data, 'src'))
                        ctext = ctext.substr(0, coffset)+data.src+ctext.substr( coffset);
                    this.dom.cursor.HTMLelement.innerHTML = ctext;
                }
                this.dom.cursor.setAt( ntext, offsetAfter);
                processed = true;
                break;
            case "endPaste" :
                let cell = this.dom.cursor.HTMLelement;
                this.ude.updateTable( cell.parentNode.parentNode.parentNode.id);
                processed = true;
                break;
            case "cut" :
            case "copy" :
                // Get selection
                this.dom.cursor.fetch();
                let cursor = this.dom.cursor;
                let startElement = cursor.textElement;
                let endElement = cursor.focusElement; // 2DO check if these are textElements
                // If no selection copy all
                let rows = cursor.HTMLelement.parentNode.parentNode.childNodes;
                // Loop to build and, if cut,  delete text
                let startRow = startElement.parentNode.parentNode;
                let endRow = endElement.parentNode.parentNode;
                let startOffset = this.dom.cursor.computeHTMLoffset( cursor.textElement.textContent, cursor.textOffset);
                let endOffset = this.dom.cursor.computeHTMLoffset( cursor.focusElement.textContent, cursor.focusOffset);
                let safe = 1000;
                let del = ( event == "cut");
                let text = this.getSelection( startRow, endRow, startOffset, endOffset);
                let ctype = "text";
                if ( this.dom.isHTML( text)) { ctype = "html";}
                if ( window.clipboarder) {
                    // Open clipboard !!! important to enable saving clips
                    window.clipboarder.openClipboard();
                    // Create clip in Clipboarder
                    let clip = window.clipboarder.createClip( ctype, text);
                    if ( clip) window.clipboarder.saveClip( clip);
                }
                if ( [ 'div.css', 'div.js'].indexOf( exTag) > -1 && UD_SERVER.indexOf( 'https:') > -1) {
                    // Copy CSS & JS elements to system clipboard
                    navigator.clipboard.writeText( text);
                    /*
                    let transfer = new DataTransfer();
                    if ( ctype == "text") { ctype = "plain";}
                    transfer.items.add( text, "text/"+ctype);
                    let cbItem = new ClipboardItem( {'text/plain' : transfert});
                    navigator.clipboard.write( cbItem);
                    */
                }
                // Cut/copy opertaion completed
                processed = true;
                break;
            case "merge up" :
            case "merge down" :
            case "remove" : {
                if ( element.tagName != "TD") { processed = true; break;}
                let rowText = this.dom.attr( element, "textContent of siblings").replace(/\s/g, '');
                let cellHTML = element.innerHTML;
                let row = element.parentNode;
                let tableId = row.parentNode.parentNode.id;
                let cursor = row.previousSibling.cells[1];
                let offset = 0;
                if ( cursor) offset = cursor.innerHTML.length;
                if ( ( event == "merge down" || !cursor) && row.nextSibling) {
                    cursor = row.nextSibling.cells[1]; 
                    offset = 0;
                }          
                if ( rowText) {
                    let mergeHTML = cursor.innerHTML;
                    cursor.innerHTML = mergeHTML.substring( 0, offset) + cellHTML +  mergeHTML.substring( offset);
                    offset += mergeHTML.length - 1;
                }              
                row.remove();
                this.ude.tableEd.update( tableId);
                // Move cursor
                this.dom.cursor.HTMLelement = cursor;
                this.dom.cursor.HTMLoffset = offset;
                this.dom.cursor.textElement = cursor.firstChild; // 2DO improve with function get FirstTextNode
                this.dom.cursor.textOffset = offset-1;
                this.dom.cursor.set();
                // Event consumed                            
                processed = true;
            break;}
            case "save" :
                let target = e.target;            
                if ( target) processed = this.prepareToSave( displayable, target);            
                break;
            case "update" :
                // Object has been updated
                let type = this.dom.attr( element, 'ud_type');
                let name = this.dom.attr( element, 'name');
                if ( !name) name = element.id;
                let edZone = this.dom.element( name+'editZone');
                if ( this.dom.udjson.value( e, 'editZoneId')) edZone = this.dom.element( this.dom.udjson.value( e, 'editZoneId'));
                let style = edZone.className;
                let content = this.dom.udjson.value( e, 'object');
                if ( content) { content = JSON.stringify( content);}
                else {
                    if ( type != "json") {
                        // text edition
                        let obj = this.dom.element( 'div.textObject', element);
                        if (obj) content = obj.textContent;
                    } else {
                        // JSON edition
                        let obj = this.dom.element( 'div.object', element);
                        if ( !obj) return;
                        content = this.dom.udjson.valueByPath( obj.textContent, 'data/value');
                    }                    
                }
                if ( type == "json") content = this.JSONtoText( content);        
                let edTable = this.convertTextToHTMLtable( content, name, style);
                if (edZone) edZone.innerHTML = edTable.outerHTML;
                processed = true;
                break;    
            case "setValue" : { // Set a value in object             
                let type = this.dom.attr( saveable, 'ud_type');
                let name = this.dom.attr( element, 'id');
                if ( type == "json") {
                    let key = e.key;
                    // Get current data
                    let dataHolder = saveable.getElementsByTagName( 'div')[0];
                    let jsonStr = dataHolder.textContent;
                    // Make change
                    let jsonKey = "data/value/"+key[0];
                    if ( key[1]) jsonKey += "/"+key[1];
                    jsonStr = this.dom.udjson.valueByPath( jsonStr, jsonKey, e.value);
                    dataHolder.textContent = jsonStr;
                    this.ude.setChanged( saveable);
                    // Reinitialise text editor
                    //let jsonText = this.JSONtoText( jsonStr);
                    //let edTable = this.convertTextToHTMLtable( jsonText, name, "textContent");
                    let edZone = this.dom.element( name+'editZone');
                    let bind = this.dom.attr( edZone, 'ude_bind');
                    let newEdZone = this.dom.udjson.putElement( this.dom.udjson.parse( jsonStr), bind);
                    edZone.innerHTML = newEdZone.outerHTML;
                }
                break;
            }
        }
        return processed; // not processed
    } // UDEtext.inputEvent()
    
   /**
    * Get portion of text and optionnally delete
    */
    getSelection( startRow, endRow, startOffset, endOffset, del = false) {
        // Loop to build and, if cut,  delete text
        let walkRow = startRow;
        let safe = 1000;
        // 2DO undecorate() and getHTMLoffset
        let text = walkRow.cells[ 1].innerHTML.substring( startOffset) + "\n";
        if ( startRow == endRow) { text = walkRow.cells[ 1].innerHTML.substring( startOffset, endOffset)}
        let toDel = [];
        if ( del) {
            if ( startOffset == 0) { toDel.push( walkRow);}
            else { walkRow.cells[1].innerHTML = walkRow.cells[1].innerHTML.substring( 0, startOffset);}
        }
        while ( walkRow && walkRow != endRow && safe--)
        {
            // Next line
            walkRow = walkRow.nextSibling;
            // Add line field 
            let line = walkRow.cells[1].innerHTML;
            if ( walkRow == endRow)
            {
                text += line.substring( 0, endOffset);
                if (del) {
                    if ( cursor.focusOffset < walkRow.cell[ 1].innerHTML.length) {
                        walkRow.cells[ 1].innerHTML = line.substring( endOffset);
                    } else { toDel.push( walkRow);}
                }    
            } else {
                if ( text) { text += "\n";}
                text += line;
            }    
            if ( del) { toDel.push( walkRow);}                    
        }
        // Delete rows marked for delete
        for ( let deli = 0; deli < toDel.length; deli++) { toDel[ deli].remove();}
        return text;
    } // UDEtext.getSelection()
    // Not used
    getHTMLOffset( textNode, textOffset) {
        let container = textNode.parentNode;
        let siblings = container.childNodes;
        let toffset = 0;
        let hoffset = 0;
        for ( let childi=0; childi < children.length; childi++) {
           toffset += child.textContent.length;
           if ( toffset >= textOffset) { break;}
           if ( child.nodeType == Node.TEXT_NODE) { hoffset += child.textContent.length;}
           else if ( child.nodeType == Node.ELEMENT_NODE) {hoffset += child.outerHTML.length;}
        }
        return hoffset;
    }
    
    // Update binded saveable element with table's content
    prepareToSave( editorZone, dataHolder)
    {
        let saveable = dataHolder.parentNode;  
        // Process according to MIME type
        let mime = this.dom.attr( editorZone, "ud_mime");
        /*legacy*/ if ( !mime) mime = this.dom.attr( saveable, "ud_mime");         
        // Detect change in object's name and update other elements as required
        // Handle name changes for native text components (as opposed to components using this class for text edition)
        // if ( this.nativeExTags.indexOf( this.dom.attr( saveable, 'exTag')) > -1) { API.dispatchNameChange( saveable);}
        API.dispatchNameChange( saveable);       
        // Patch temp for doc params 2DO make this clearer ex if saveable.id = BVU...
        if ( mime == "text/json" && this.dom.children( saveable).length > 2 ) mime = "text/text"; 
        // Patch for old connectors (newsv4)
        // if ( mime == "text/mixed" && this.dom.attr( saveable, 'ud_type') == "connector" ) mime = "text/text"; 
        // Save in JSON100 format
        else if ( mime != "text/json") {
            // Convert from mixed format
            let name = dataHolder.id; // editorZone.id.replace( 'editZone', '');
            let subType = this.dom.attr( saveable, 'ud_type');
            dataHolder = this.newTextObject( name, subType);
            let children = saveable.childNodes;
            dataHolder = saveable.insertBefore( dataHolder, children[0]);
            // Move caption to attribute           
            for ( let childi=1; childi < children.length; childi++) {
                let child = children[ childi];
                if ( this.dom.attr( child, 'exTag') == "span" && child.classList.contains( 'caption')) {
                    editorZone.insertBefore( child, editorZone.childNodes[0]);
                }
                else if ( child != dataHolder && child != editorZone) child.remove();                    
            }
            children[0].id = children[0].id + "object"; // Quick fix to avoid name already used
            this.dom.attr( editorZone, 'ud_type', "text"); // Important for getElement to detect linetext 
            mime = "text/json";
        }
        //if ( [ "text/js"].indexOf( mime) > -1) mime = "text/json";      
        switch ( mime)
        {
            case "text/json" : {
                // Store name currently in JSON object
                let jsonAPI = API.json;
                let json = jsonAPI.parse( dataHolder.textContent);
                let oldName = jsonAPI.value( json.meta, 'name');            
                dataHolder.innerHTML = JSON.stringify( this.dom.udjson.getElement( editorZone, true));
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
            break; }
            case "text/js" :
            case "text/css" : 
            case "text/text" :  //(or csv)     
            case "text/linetext" :
            case "text/server" :
                // DEPRECATED
                // Find table that holds text
                let table = editorZone.getElementsByTagName( 'table')[0];
                if (!table) return debug( {level:1, return: null}, "can't find table in ", editorZoneId);
                let rows = table.getElementsByTagName( 'tbody')[0].rows;
                if (!rows) return debug( {level:1, return: null}, "no rows in tbody of ", editorZoneId);
                // Compile text from each row of the table (2 cols : line n0 and text)
                let text = "";
                // Detect JSON content
                let jsonTable = false;
                let json = {};
                let jsonTarget
                for (let irow=0; irow < rows.length; irow++) {
                    let line = rows[irow].cells[1].textContent; //.replace(/"/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                    if ( mime == "text/html") line = rows[irow].cells[1].innerHTML;
                    if ( irow == 0 && line.indexOf('JSON') == 0) {
                        jsonTable = true;
                        jsonTarget = line.replace( "JSON", "").trim();
                    }
                    if ( jsonTable) json = this.prepareJSONstring( json, line);
                    else text += line+"\n"; //.replace( / /g, "&nb"+"sp;")+"\n"; // ? really
                }
                if ( jsonTable) {
                    let jsonStr = JSON.stringify( json);
                    switch ( jsonTarget) {
                        case "parent_extra":
                            // Save data as _extra attribute of parent 
                            var parent = dataHolder.parentNode;
                            this.dom.attr( parent, 'ud_extra', jsonStr);
                            break;
                        case "content" :  
                            // Save data as JSON string in data holder
                            dataHolder.textContent = JSON.stringify( json);
                            break;
                    }    
                }
                // Text content goes to data holder
                else dataHolder.textContent = text.substring(0, text.length-1);
                break;
        }
        // Return true to go ahead with saving
        return true;
    } // UDEtext.prepareToSave()
    
    // JSON saving - 1 line at a time
    prepareJSONstring( json, line)
    {   
        let p = line.indexOf('=');
        if ( p <= 0) return json; // 2DO test for comments too
        let key = line.substr( 0, p).trim();
        let value = line.substr( p+1).trim();
        value = JSON.parse( value); 
        let keys = key.split( '/');
        if ( keys.length > 1) 
        {
            if ( typeof json[keys[0]] == "undefined") json[ keys[0]] = {};
            if ( keys.length > 2)
            {
                if ( typeof json[keys[0]][keys[1]] == "undefined") json[ keys[0]][ keys[1]] = {};
                json[keys[0]][keys[1]][keys[2]] = value;                
            }
            else json[keys[0]][keys[1]] = value;
        }
        else json[key] = value;
        return json;        
    } // UDEtext.prepareJSONstring()
    
    
   /**
    * Convert JSON to lined text
    */
    JSONtoText( json, textKeyPrefix = "")
    {
        if ( typeof json == "string" && json != "") json = this.dom.udjson.parse( json);
        if ( !json) return "";
        let text = "";
        if ( !textKeyPrefix) text += "JSON content\n"; // 1st line indicates JSON content
        for( let key in json)
        {
            if ( key == "length") continue;
            let value = json[ key];
            let textKey = textKeyPrefix + key
            switch ( typeof value)
            {
                case "array"  :
                case "object" :
                    // Use recurrence                    
                    text += this.JSONtoText( value, textKey + '/' );
                    break;
                case "number" :
                    text += textKey + " = " + value + "\n";
                    break;
                case "string" :
                    text += textKey + " = \"" + value + "\"\n";
                    break;
                default :
                    debug( { level:2}, "unknown value type in JSON", prefix + key, value);
                    break;
            }    
        }
        return text;
    }  // UDEtext.JSONtoText()  
    
 } // JS class UDEtext

if ( typeof process == 'object')
{
    // Testing under node.js
        // Testing under node.js
    module.exports = { class: UDEtext};
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined")
    {
        console.log( "Syntax : OK");
        console.log( 'Start of test program');
        console.log( "Test completed");
    }    
} // End of test routine