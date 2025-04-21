/**
 *  UDElist.js
 * 
 *  This is the client-side part of the list module and works with the server-side udlist.php.
 *  
 *  As with other UD modules, methods are grouped in 4 blocks as listed below :
 *    
 *     1 - UD-VIEW-MODEL - Preparing data received from server for editing
 *     2 - UD-VIEW-MODEL - Preparing edited data for saving
 *     3 - UDE-VIEW      - Editing functions
 *     4 - CALUCLATOR    - Calculator functions on tables 
 *
 */
 class UDElist
 {
    dom;
    ude;
    
    // Set up table editor
    constructor( dom, ude)  {
        this.dom = dom;
        this.ude = ude;
        if ( typeof API != "undefined" && API) API.addFunctions( 
            this, 
            [ 
                'getItem', 'getItems', 'getMatchingItems', 'getFirstMatchingItem', 'insertItem', 'emptyList', 'fillListFromTable',
                'getFirstMatchingItemIndex', 'updateItemInList', 'insertItemInList', 'deleteItemFromList', 'fillListFromArray',
            ]
        );
    } // UDElist.construct()
    
   /**
    *   Update a list by running all formulas and checking against table's source
    *   called by UD-VIEW-MODEL Reception from server - prepare a table for editing
    *   @param {string} $id id of element to update
    *   @param {boolean} $recurrent reserved for future used
    update child eelementboolean update() - called by udtable.php via ud.js and ude.js
     *     initalise() - setup the editing zone and update, invoked by udlist.php
     */    
    update( id, recurrent = false)
    {
        // Get list
        let list = document.getElementById( id);
        // if !table initialise
        // Get list's source if provided
        let dataSource = this.dom.attr( list, "ude_datasrc");
        // Loop through items
        let items = list.childNodes;
        for (var i=0; i < items.length; i++)
        {
            var item = items[i];
            // Avoid items with no text node
            if ( !item.childNodes)
            {
                // No child nodes so add empty text
                var emptyTextNode = document.createTextNode( "...");
                cell.appendChild( emptyTextNode);
            }
            if ( item.textContent.charAt(0) == "=")
            {
                item.setAttribute( "ude_formula", item.textContent.substring(1, item.textContent.length-1));
                item.textContent = "...";
            }
            // Compute formula if present
            if (item.getAttribute( "ude_formula")) this.ude.calc.updateElement( cell, i+1, recurrent);                
             // Compute click formula if present
            if ( item.getAttribute( "onclickformula"))
            {                
                item.setAttribute( "onclick", this.ude.calc.exec( row.getAttribute( "onclickformula").replace(/index/g, i+1)));
            }    
        } // end item loop              
        debug( {level:4}, "updateList", items.length);        
    } // UDElist.update()
     
     
   /**
    *   Setup editing zone for a list that's just been created or loaded
    *   called by UD-VIEW-MODEL/ud.js or UDE-VIEW/ude.js viewEvent( create)
    *   @param {string} $saveableId  id of containing element
    */    
    initialise( saveableId) 
    {
        // Get element pointers
        let element = this.dom.element( saveableId);        
        if ( !element) return debug({ level:2, return:null}, "Initialise can't find "+saveableId);
        let containerElement = element.parentNode; 
        let nextSibling = element.nextSibling;        
        let children = this.dom.children( element);
        // Get element's style
        let classList = element.classList;
        let style = "";
        for (var i=0; i < classList.length; i++)
            if ( classList.item( i) != "table" && style == "") style = classList.item( i);        
        // Initialise working variables
        let json = null;
        let bind = "";
        // Get data according to MIME        
        let mimeType = this.dom.attr( element, 'ud_mime'); 
        if ( !mimeType) {
            mimeType = "text/json";
            this.dom.attr( element, 'ud_mime', mimeType);
        }
        switch ( mimeType)
        {
            case "text/json" :
                if ( children.length) {
                    json = JSONparse( children[0].textContent);
                    bind = children[0].id;
                }    
                if ( !json) {
                    let suggestedName = this.dom.attr( element, 'name');
                    if ( !suggestedName) suggestedName = "List_"+element.id; 
                    // Delete all children
                    this.dom.emptyElement( element);
                    // Add new object to element
                    let newElement = element.appendChild( this.newListObject( suggestedName));
                    bind = newElement.id;
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
        if (json) {            
            // 2DO add element's styles to JSON
            let editZone = this.dom.JSONput( json, bind, "", this.dom.keepPermanentClasses( element.className, true));
            element.appendChild( editZone);
        }
    } // UDElist.initialize()
    
   /**
    * Build a new List object
    * @param {string} suggestedName Suggested name for object
    * @return {string} JSON object
    */    
    newListObject( suggestedName) {
        // Name
        let name = suggestedName.replace(/ /g, '_').replace(/'/g,'_').replace(/"/g, '');
        let objectName = name + "_object";
        // Data
        // 2DO Get default value from register
        let objectData = { 
            meta:{ type:"list", name:name, zone:name+"editZone", caption:suggestedName, captionPosition:"top"}, 
            data:{ tag:"jsonlist", name:name, class:"listStyle1", value:[ "Enter item", "Enter Item"] 
            },
            changes: []
        };
        // Create object div and append to element
        let objectAttributes = {id:objectName, class:"object listObject, hidden", ud_mime:"text/json"};
        let object = this.dom.prepareToInsert( 'div', JSON.stringify( objectData), objectAttributes);
        this.dom.attr( object, 'ud_mime', "text/json"); 
        return object;
    } // UDElist.newListObject()
    
    /* *
     *   UD-VIEW-MODEL Saving to server part
     *     prepareToSave() - called by ude.js setChanged()
     *     convertHTMLtableToJSON() - used when saveable data is JSON
    */
    
    // Update binded saveable element with table's content
    prepareToSave( editorZone, dataHolder)
    {
        // 2DO editorZOne may be captionName span 
        // Get object's container
        let saveableElement = dataHolder.parentNode;
        
        // Detect change in object's name and update other elements as required
        API.dispatchNameChange( saveableElement);

        // Get MIME type
        let mimeType = this.dom.attr( saveableElement, 'ud_mime');       
        
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
                //dataHolder.innerHTML = JSON.stringify( this.dom.JSONget( editorZone, true));
                break;
            case "text/text" :  //(or csv) 
                break;
            case "text/html" :
                // Direct transfer -- do nothing hiddenId attribute will assure text including in saving
                // dataHolder.innerHTML = editorZone.innerHTML;
                break;
        }
        // Return true to go ahead with saving     
        return true;        
    } // UDElist.prepareToSave()
      
    /* *
     *   UDE-VIEW PART - table manipulation methods called from ude.js and udapi.js
     *     inputEvent() - called bu ude.js to dispatch events
     *     insertRow(), insertCol(), deleteRow(), deleteCol()
     *     rowHeight(), colWidth()
     */
    
    // User-generated event 
    inputEvent( e, element)
    {    
        let processed = false;
        let source = element;
        let content = source.textContent;
        let event = e.event;
        let listElement = source.parentNode;
        let items = listElement.childNodes;  
        let index = -1;
        for ( index=0; index < items.length; index++) { if ( items[index] == source) break;}
        let listId = listElement.id;
        switch ( event)
        {
            case "create" :
                this.initialise( listId);
                processed = true;
                break;
            case "change":
                if ( this.dom.parentAttr( element, 'ude_stage').toLowerCase() == "on") break; // Formula editing handled by stage editing 
                // Initialise if object updated
                if ( source.classList.contains( 'object')) {
                    this.initialise( source.parentNode.id);
                    break;
                }           
                if ( content[0] == '=') // && ( content[ content.length-1] == ';') || this.domGetParentAttribute( 'ude_autosave') == "on"))
                {
                    // A formula so update ude_formula attribute and compute result
                    let formula = content.substr( 1, content.length-1); //-2 if ; to validate end
                    source.setAttribute( 'ude_formula', formula);
                    this.ude.calc.updateElement( source);
                    processed = true;                    
                }
                break;
            case "newline" :
                // Insert new item
                if ( source.tagName.toLowerCase() == "span" && source.classList.contains( 'caption')) return false;                    
                if ( index > items.length || index == -1) return false;
                let newItem = null;
                if ( e.HTMLoffset < items[ index].innerHTML.length) {
                    // Insert inside an item : split item 
                    newItem = this.insertItem( listId, index, items[ index].innerHTML.substring( e.HTMLoffset));
                    if ( e.HTMLoffset == 0) { items[ index].innerHTML = "...";}
                    else { items[ index].innerHTML = items[ index].innerHTML.substring( 0, e.HTMLoffset);}
                } else {
                    // Insert a new item
                    // Look for model
                    let modelItem = (items.length) ? items[ 0] : null;
                    let modelItemContent = this.dom.udjson.value( UD_defaultContentByExTag, "li");  // "...";
                    let modelItemFormula = "";
                    if ( modelItem && modelItem.classList.contains( 'itemModel')) {
                        // 2DO set ude_place by looping through children
                        modelItemContent = modelItem.innerHTML;
                        modelItemFormula = this.dom.attr( modelItem, 'ude_formula');
                    }
                    newItem = this.insertItem( listId, index, modelItemContent);
                }
                // Save change
                this.ude.setChanged( listElement);
                // Set cursor on new element
                this.dom.cursor.HTMLelement = newItem;
                this.dom.cursor.textElement = newItem.childNodes[0];               
                this.dom.cursor.textOffset = 0;
                this.dom.cursor.set();
                // event was processed
                processed = true;
                break;
            case "save" :            
                if ( typeof e.target != "undefined") processed = this.prepareToSave( element, e.target);
                break;
            case "merge up" :
            case "merge down" :
                if ( source.tagName != "LI") { processed = true; break;}            
                if ( index > 0 && event == "merge up") {
                    let item = items[  index - 1];
                    let pos = item.textContent.length;
                    item.innerHTML += source.innerHTML;
                    source.remove();
                    items = listElement.childNodes;
                    this.dom.cursor.setAt( items[  index - 1], pos);
                } else if ( event == "merge down" && index < items.length) {
                    let pos = source.textContent.length;
                    items[  index + 1].innerHTML = source.innerHTML + items[  index + 1].innerHTML;
                    source.remove();  
                    items = listElement.childNodes;
                    this.dom.cursor.setAt( items[ index], pos);                    
                }
                // Save change
                this.ude.setChanged( listElement);
                processed = true;            
            case "remove" :
                break;
            case "insert" :
                break;
            case "paste" :
                // Pasting
                // Place HTML in temp DIV
                let workDiv = document.createElement( 'div');
                workDiv.innerHTML = e.data.replace(/\n/g, '');
                // Find UL element
                listElement = workDiv.getElementsByTagName( 'ul');
                if ( listElement.length) {
                    // Paste data contains a list so insert a new div.list element
                    let data = this.convertHTMLToObjectDiv( workDiv);
                    // Find where to insert
                    let insertAfter = this.dom.getSaveableParent( element);
                    this.dom.insertElementAtCursor( 'div', data, {ud_type:"list"}, insertAfter, true);
                    processed = true;
                } else if ( this.dom.cursor.HTMLelement && this.dom.cursor.HTMLelement.tagName == "LI") {
                    // Insert data on a item                     
                    if ( this.dom.hasDefaultContent( element) || !element.textContent) { 
                        // Replace empty item completely
                        element.textContent = workDiv.textContent; // !!! why not innerHTML ?
                        // Place cursor at end of current item
                        this.dom.cursor.setAt( element, 10000);
                        // Remove initialContent
                        element.classList.remove( 'initialcontent');
                    /*
                    } else if ( this.dom.cursor.selectionInNode) {
                        // Replace selected text with pasted text
                        $$$.insertTextAtCursor( workDiv.textContent);
                    */
                    } else if ( this.dom.cursor.textOffset < ( this.dom.cursor.textElement.textContent.length - 1)) {
                        // Cursor between start and penultimate character - insert at cursor, and  move cursor to end of insert
                        $$$.insertTextAtCursor( workDiv.textContent);
                    } else { 
                        // Cursor at end of an item - create a new item after current one and set as current item
                        let index = this.dom.siblings( element).indexOf( this.dom.cursor.HTMLelement);
                        if ( index > -1) element = this.insertItem( element.id, index, workDiv.textContent);
                        // Place cursor at end of new item
                        this.dom.cursor.setAt( element, 10000);
                    }
                    
                    processed = true;
                }
                API.setChanged( element);
                break;
            case "endPaste" :
                processed = true;
                break;
            case "use" :
            case "idea" :
               /**
                * Model for USEing data
                *   type:data or already seperated into e.data and e.type
                *   element.subtype or new ude_use defines what we accept
                *      text : just add data
                *      html : add HTML
                *      textWithLinks : add link to current item's text
                *      
                */
                if ( this.dom.hasDefaultContent( element)) { element.textContent = e.data;}
                else { 
                    // OLD solution API.insertTextAtCursor( e.data);
                    // Insert new item with use data
                    let newItem = this.insertItem( listId, items.length - 1, e.data);
                    // Set cursor at end of new element
                    this.dom.cursor.setAt( newItem, newItem.textContent.length);                    
                }
                API.setChanged( element);
                processed = true;
                break;            
        }   
        return processed;
    } // UDElist.inputEvent()
    
   /**
    * Prepare an HTML list as JSON.
    */    
    convertHTMLToObjectDiv( html, caption = "...") {
        // Pasting an HTML list
        let objectDiv = "";
        // Place list in temp DIV
        let workDiv = document.createElement( 'div');
        this.dom.attr( workDiv, 'ud_type', 'list');
        workDiv.innerHTML = html;
        // Find UL or LI element
        let listElement = workDiv.getElementsByTagName( 'ul');
        if ( listElement.length) {
            listElement = listElement[0];
            // Add caption and list name
            // 2DO UDE fct for getting index
            let pastedListName = 'List'+window.udparams['AutoIndex_list'];
            window.udparams['AutoIndex_list']++;            
            let captionHTML = caption+'<span class="objectName">'+pastedListName+'</span>';
            let objectName = this.dom.insertElement( 'span', captionHTML, {}, listElement);
            // Prepare list as JSON object (without container)
            let object = this.dom.JSONget( workDiv);
            let json = JSON.stringify( object);
            let objectDiv = '<div id="'+pastedListName+'" class="listObject">'+json+'</div>';
        } /*else if ( workDiv.getElementsByTagName( 'li').length) {
        } else {
            // Process as text
            let text = workDiv.textContent;
            if ( text.indexOf( "http") == 0) {
                        // It's a link
            }
        }*/                
        return objectDiv;
    }
    
    // 2DO API doc
    
   /**
	* Insert a new item into list.
	* @param {string} elementOrId Element where to insert or it's id, null for cursor position
	* @param {integer] index Index of item to install after, -1 for top
	* @param {string} data Content of list item
	*/
    insertItem( elementOrId, index, data) {
        // Find list
        let element = this.dom.element( elementOrId);
		if ( !element && this.dom.cursor.HTMLelement && this.dom.cursor.HTMLelement.tagName.toLowerCase() == "li" )
			element = this.dom.cursor.HTMLelement.parentNode;
        if ( !element) return debug( {level:1, return:null}, "List not found or no cursor", elementOrId)
		let exTag = this.dom.attr( element, "exTag");
		if (  exTag == "div.list") element = this.dom.element( "ul", element); //element.getElementsByTagName( "ul")[0];
		else if ( exTag != "ul" && exTag != "ol") return debug( {level:1, return:null}, "Not a list element");
        // Detect content to be used as placeholder
        let placeholder = false;
        if ( data.indexOf( '*') === 0) {
            // Inserted text beginning with * means use as placeholder
            data = data.substring(1);
            placeholder = true;
        }
        // Create new item
		let newItem = null;
        let items = this.dom.children( element);
        if ( index > -1) {
			// Index specified so find item to insert after
			// Find point to insert AFTER
			let insertAfter = null;
            if ( index > items.length) index = items.length-1;
            insertAfter = items[ index]; 
			newItem = this.dom.insertElement( 'li', data, {}, insertAfter, true);
            if ( placeholder) this.dom.attr( newItem, 'ude_place', newItem.textContent);
        } else  {
            // Insert at end of list
            if ( items.length)  newItem =  this.dom.insertElement( 'li', data, { ude_place:"..."}, items[ items.length -1], true);
            else newItem =  this.dom.insertElement( 'li', data, { ude_place:"..."}, element, false, true);
            if ( placeholder) this.dom.attr( newItem, 'ude_place', newItem.textContent);
        }
        this.ude.calc.updateElement( newItem);
        return newItem;
    } // UDElist.insertItem()
        
   /**
	* Delete an item from a list.
	* @param {string} elementId Id of <ul> element, 0 for cursor position
	* @param {integer] index Index of item to delete
	*/
    deleteItem( listId, index)
    {
        
    } // UDElist.deleteItem()
          
   /**
	* Empty a list.
	* @param {string} elementId Id of <ul> element, 0 for cursor position
	* @param {integer] index Index of item to delete
	*/
    emptyList( elementOrId, index) {
        let element = this.dom.element( elementOrId);
        if ( !element) return debug( {level:1, return:null}, "List not found or no cursor", elementOrId)
		let exTag = this.dom.attr( element, "exTag");
		if (  exTag == "div.list") element = this.dom.element( "ul", element); //element.getElementsByTagName( "ul")[0];
		else if ( exTag != "ul" && exTag != "ol") return debug( {level:1, return:null}, "Not a list element");
        let items = this.dom.children( element);
        for ( let itemi=0; itemi < items.length; itemi++) {
            let item = items[ itemi];
            if ( !item.classList.contains( 'model')) item.remove();            
        }
    } 

   /**
    * Fill a list with contents from a column in a table  
    * @param {*} tableName 
    * @param {*} columnName 
    * @param {*} targetName 
    */ 
    fillListFromTable( tableName, columnName, targetName) {
        let table = $$$.dom.element( tableName);
        let target = $$$.dom.element( targetName);
        if ( !table || !target) return;
        let tableId = table.id;
        let rows = $$$.findRows( tableId, '');
        for ( let rowi=0; rowi < rows.length; rowi++) {
            let listContent = $$$.getRow( tableId, rows[ rowi])[ columnName];
            $$$.insertItem( targetId, -1, listContent);
        }
    }    
    
    /**
    * Fill a list with contents from an array  
    * @param {*} tableName 
    * @param {*} columnName 
    * @param {*} targetName 
    */ 
    fillListFromArray( data, targetName, defaultOnly = true) {
        let container = this.dom.elementByName( targetName);
        let target = this.dom.element( targetName);
        if ( typeof data == "undefined" || !data || !target || !container) return;
        if ( defaultOnly && !container.classList.contains( 'initialcontent')) return;
        this.emptyList( target);
        for ( let datai=0; datai < data.length; datai++) {
            let listContent = data[ datai];
            if ( listContent) this.insertItem( targetName, -1, listContent);
        }
        if ( defaultOnly) {
            container.classList.remove( 'initialcontent');
            target.classList.remove( 'initialcontent');
        }
    }    

    /* * 
     *  CALCULATOR & API PART - Methods for running calculator functions on a list
     */

    // Match item - return true of cells match

   /** 
    * @api {JS} API.matchItem(listId) True if item matches
    * @apiParam {string} item The &lt;LI&gt; element
    * @apiParam {string} expr The regular expression to test item
    * @apiSuccess {boolean} return True if item matches
    * @apiGroup Elements
    */
   /**
    * Return True if item matches a regular expression
    * @param {string} item The &lt;LI&gt; element
    * @param {string} expr The regular expression to test item
    * @return {boolean} Tue if match
    */
    matchItem( item, expr)
    {
        // RegEx match
        let c = item.textContent + '/';
        if ( expr == "" || c.match( expr)) return true;
        return false;
    } //UDElist.matchItem()
   /*
    * @api {Formula} matchItem(listId,itemIndex,expr) True if item matches
    * @apiParam {string} item The &lt;LI&gt; element
    * @apiParam {string} expr The regular expression to test item
    * @apiSuccess {boolean} return True if item matches
    * @apiGroup Formulae functions
    */
    
    /*
    * @api {Formula} getItem(listId,index) 
    * @apiParam {string} item The &lt;LI&gt; element
    * @apiParam {string} index The item no (starting at 1)
    * @apiSuccess {string} Item content
    * @apiGroup Elements
    */
    getItem( listId, index) {
        // Get list
        let list = document.getElementById( listId);
        if ( list.tagName.toLowerCase() != "ul") list = list.getElementsByTagName('ul')[0];
        if (!list) return debug( {level:1, return:null}, "No list", id);        
        // Get items
        let items = list.getElementsByTagName( 'li');
        if ( index <= 0 || index > items.length) return debug( {level:1, return:null}, "Bad index", index, items);  
        return items[ index - 1].textContent;
    }
    

   /* 
    * @api {JS} API.getItems(listId) Get all list items
    * @apiParam {string} listId Id of HTML list
    * @apiParam {string} selector Regular expression to match items 
    * @apiSuccess {[string]} Return selected items
    * @apiGroup Elements
    */
  /**
    * Return a list of all items from an HTML list
    * @param {string} listId Id of HTML list
    * @param {string} selector Regular expression to match items
    * @return [{string}] Text content of selected items
    */
    getItems( listId) { return this.getMatchingItems( listId, "");}
    
   /** 
    * @api {JS} API.getMatchingItems(listId,selector) Get list items that match
    * @apiDescription Get items from an HTML list that match a regular expression
    * @apiParam {string} listId Id of HTML list
    * @apiParam {string} selector Regular expression to match items 
    * @apiSuccess {[string]} Return value Text content of selected items
    * @apiGroup Elements
    */    
   /**
    * Return a list of items from an HTML list that match a regular expression
    * @param {string} listId Id of HTML list
    * @param {string} selector Regular expression to match items
    * @return [{string}] Text content of selected items
    */
    getMatchingItems( listId, selector="")
    {
        let r=[];
        // Get list
        let list = document.getElementById( listId);
        if ( list.tagName.toLowerCase() != "ul") list = list.getElementsByTagName('ul')[0];
        if (!list) return debug( {level:1, return:"ERR: no list "+id}, "No list", id);        
        // Get items
        var items = list.getElementsByTagName( 'li');
        for (var i=0; i < items.length; i++) 
           if ( this.matchItem( items[i], selector)) r.push( items[ i].textContent);
        return r;
    } // UDElist.findItems()

    /**
    * @api Return index of first item to match an expression
    * @apiParam {string} listId Id of HTML list
    * @apiParam {string} selector Regular expression to match items
    * @apiSuccess {[number]} Index (1 - n) of matching item or false if no match
    * @apiGroup Elements
    */
    getFirstMatchingItemIndex( listId, selector="")
    {
        let r=[];
        // Get list
        let list = document.getElementById( listId);
        if ( list.tagName.toLowerCase() != "ul") list = list.getElementsByTagName('ul')[0];
        if (!list) return debug( {level:1, return:"ERR: no list "+id}, "No list", id);        
        // Get items
        var items = list.getElementsByTagName( 'li');
        for (var i=0; i < items.length; i++) 
           if ( this.matchItem( items[i], selector)) return i+1;
        return false;
    } 
 

  /**  
    * @api {JS} API.getFirstMatchingItem(listId,selector) Get first list item that matches
    * @apiDescription Get first item from an HTML list that matches a regular expression
    * @apiParam {string} listId Id of HTML list
    * @apiParam {string} selector Regular expression to match items 
    * @apiSuccess {[string]} Return value Text content of selected items
    * @apiGroup Elements
    */
   /**
    * Return the first item from an HTML list that matches a regular expression
    * @param {string} listId Id of HTML list
    * @param {string} selector Regular expression to match items
    * @return {string[]} Text content of selected items
    */    
    findFirstMatchingItem( listId, selector)
    {
        var w =this.getMatchingItems( listId, selector);
        if (w) return w[0];
        else return -1;
    } // UDE.findFirstItem()   

     /*
    * @api {js} updateItemInList(listId,index,value) 
    * @apiParam {string} item The &lt;LI&gt; element
    * @apiParam {string} index The item no (starting at 1)
    * @apiParam {string} value Text context of item
    * @apiSuccess {string} Item content
    * @apiGroup Elements
    */
    updateItemInList( listId, index, value) {
        // Get list
        let list = document.getElementById( listId);
        if ( list.tagName.toLowerCase() != "ul") list = list.getElementsByTagName('ul')[0];
        if (!list) return debug( {level:1, return:null}, "No list", id);        
        // Get items
        let items = list.getElementsByTagName( 'li');
        if ( index <= 0 || index > items.length) return debug( {level:1, return:null}, "Bad index", index, items);  
        // Write item
        items[ index - 1].textContent = value;
        return value;
    }
    
   /**
	* Insert a new item into a list.
	* @param {string} elementId Id of <ul> element, 0 for cursor position
	* @param {integer] index Index of item to install after, -1 for top
	* @param {string} data Content of list item
	*/   
	insertItemInList( listId, index, data) {
		if ( !this.udeList) this.udeList = this.ude.modules[ "div#list"][instance];
		if ( !this.udeList) return "ERR:function unavailable";
		return this.udeList.insertItem( listId, index, data); 
	}	
	
  /**
	* Delete an item from a list.
	* @param {string} elementId Id of <ul> element, 0 for cursor position
	* @param {integer] index Index of item to delete
	*/
    deleteItemFromList( listId, index) {
		if ( !this.udeList) this.udeList = this.ude.modules[ "div#list"][instance];
		if ( !this.udeList) return "ERR:function unavailable";
		return this.udeList.deleteItem( listId, index); 
    }

    
    
 } // JS class UDElist
 
if ( typeof process != 'object') {
    /*
    define( function() {   
        let exTag = "div.list";    
        if ( window.ud && !window.ud.ude.modules[ exTag].instance) {
            // Initialise
            let module = new UDEtable( window.ud.dom, window.ud.ude);
            window.ud.ude.modules[ exTag].instance = module;
            window.ud.ude.modules[ exTag].state = "loaded";
            window.ud.ude.tableEd = module;
        }
        let src = new Error().stack.match(/([^ \n])*([a-z]*:\/\/\/?)*?[a-z0-9\/\\]*\.js/ig)[0];
        return { class : UDEtable, src: src, exTag:'div.table'};
    });
    */
    let exTag = "div.list";    
    if ( window.ud && !window.ud.ude.modules[ exTag].instance) {
        // Initialise
        let module = new UDElist( window.ud.dom, window.ud.ude);
        window.ud.ude.modules[ exTag].instance = module;
        window.ud.ude.modules[ exTag].state = "loaded";
    }
} else {
    // Testing under node.js
    //TEST_export( { class: UDElist}, ( typeof module == "undefined"));
    if ( typeof module == "undefined") define ( function() { return function() { return { class: UDElist};}});
    else module.exports = { class: UDElist};
    let exTag = "div.list";
    if ( typeof window == "undefined")
    {
        console.log( 'Syntax:OK');            
        console.log( 'Start of test program');
        console.log( "Setting up browser (client) test environment"); 
        let path = "../..";
        const testMod = require( path+'/tests/testenv.js');
        testMod.load( []);
        ud = new UniversalDoc( 'document', true, 133);
        ude = ud.ude; // new UDE( window.topElement, null);    
        window.ud = ud; window.ude = ude;        
        let listEditor = new UDElist( ude.dom, ude);
        ude.modules[ exTag].instance = listEditor;
        ude.modules[ exTag].state = "loaded";
        let view = listEditor.dom.element( "div.part[name='myView']", listEditor.dom.element( 'document'));        
        // Test 1 - JSON list
        {
            // Create object div.listObject and append to element            
            name = "mylist";
            // Data
            let objectData = { 
                meta:{ type:"list", name:name, zone:name+"editZone", caption:"test list", captionPosition:"top"}, 
                data:{ tag:"ul", name:name, class:"listStyle1", value:{ 0:{ tag:"li", value:"item 1"}, 1:{ tag:"li", value:"item 2"}}},
                changes: []
            }
            let objectAttributes = {id:name+"_object", class:"listObject, hidden", ud_mime:"text/json"};
            let objectElement = listEditor.dom.prepareToInsert( 'div', JSON.stringify( objectData), objectAttributes);
            // Create container div.list
            let listId = "B0100000005000000M";            
            let listAttributes = {id:listId, class:"list", ud_mime:"text/json"};
            let listElement = listEditor.dom.prepareToInsert( 'div', "...", listAttributes);
            listElement.appendChild( objectElement);
            // Append list to view
            view.appendChild( listElement);   
            // Initialise list
            listEditor.initialise( listId);
            testResult( "1 - list creation JSON100",  ude.dom.element( name), view.innerHTML);
            // console.log( view.innerHTML);
        }       
        // Test 2 - HTML list with caption
        {
            // Create list with HTML            
            // Data
            let objectData = '<span>My List 2 <span class="objectName">myList2></span></span>';
            objectData += '<ul id="myList2" class="listStyle1"><li>Item 1</li><li>Item 2</li></ul>';            
            // Create container div.list
            let listId = "B0100000007000000M";            
            let listAttributes = {id:listId, class:"list", ud_mime:"text/html"};
            let listElement = listEditor.dom.prepareToInsert( 'div', objectData, listAttributes);
            // Append list to view
            view.appendChild( listElement);   
            // Initialise list
            listEditor.initialise( listId);
            testResult( "2 - list creation composite",  ude.dom.element( name), view.innerHTML);

        } 
        // Test 3 - Text as caption
        {
            // Create list with text           
            // Data
            let objectData = 'My List 3';          
            // Create container div.list
            let listId = "B010000000900000M";            
            let listAttributes = {id:listId, class:"list initialcontent", ud_mime:"text/json", name:"mylist2"};
            let listElement = listEditor.dom.prepareToInsert( 'div', objectData, listAttributes);
            // Append list to view
            view.appendChild( listElement);   
            // Initialise list
            listEditor.initialise( listId);
            testResult( "3 - list creation direct insert",  ude.dom.element( listId), view.innerHTML);
        }        
        
         // Test 4 - Fill from array
         {
            // Create list with text           
            // Data
            let data = [ 'itemzz 1', 'Itemzz 2','Itemzz 3'];          
            // Create container div.list
            let listName = "mylist2";         
            listEditor.fillListFromArray( data, listName);
            let list = ude.dom.element( listName).innerHTML;
            testResult( "4 - fill from array",  list.indexOf( 'Itemzz 2') > -1, list);
        }        

        console.log( 'Test completed');
        process.exit();
    } else {
        if ( window.ud && window.ude && !window.ude.modules[ exTag].instance) {
            // Initialise
            let module = new UDElist( window.ud.dom, window.ude);
            window.ude.modules[ exTag].instance = module;
            window.ude.modules[ exTag].state = "loaded";
        }

    }
} // End of test routine
