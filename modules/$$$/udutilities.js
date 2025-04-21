/** 
 *    UDutilites JS class with a set of methods available through API
 *      
 */

 // Include seperate files
 /* get*file_include ./udjson.js */
class UDutilities
{
    moduleName = "UDutilities";
    ud = null;      // access to UniversalDoc class
    // ude = null;     // access to editor;
    dom = null;     // access to dom
    api = null;     // access to API
    actionElement = null; // Current element for action boxes Will move to floater
    
    copyAttributes = [ 'ude_formula', 'ude_autosave', 'ude_stage'];
    
    constructor( ud, api = null)
    {
        this.ud = ud;
        // this.ude = ud.ude; // Not set yet !
        this.dom = ud.dom;
        this.api = ( api) ? api : ud.api;
        this.api.addFunctions( this, [ 
            'buildManagePart', 'diffuseDoc',
            'copy', 'deepCopy', 'copyElements', 'removeChildren', 'egaliseHeightOfClass', 'buildDisplayableDeviceList',  
            'dispatchNameChange', 'changeName', 'dispatchClassChange', 'prePostDocName',
            'getInlineHTML', 'concatHTMLelements'
        ]);
    } // UDutilities.constructor()
    
   /**
    * Complete doc's manage part. JS equivalent of old PHP fct
    */    
    buildManagePart( isDir = false) {
        // 2DO when register loaded - check buildManageOnClientSide
        // Get Manage zones to fill
        let managePart = this.dom.elementByName( 'Manage'); // IDEA /[mM]anage/ regexp or ['Manage','manage']
        if ( !managePart) managePart = this.dom.elementByName( 'manage');
        if ( !managePart) return debug( {level:1, return:false}, "No manage part found");
        $$$.dom.attr( managePart, 'contenteditable', 'true');
        $$$.dom.attr( managePart, 'ude_edit', 'on');
        let botlogZone = this.dom.elementByName( 'BotlogZone');
        let namesZone = this.dom.elementByName( 'DocNames');
        let paramZone = this.dom.elementByName( 'DocParameters');
        let actionsZone = this.dom.elementByName( 'DocActions');
        let historyZone = this.dom.elementByName( 'DocHistory');
        // Define shortcuts
        let json = this.dom.udjson;
        let T = API.translateTerm;
        // Setup translations temporarily
        let lang = this.dom.textContent( 'UD_lang');
        if ( lang == "FR") {
            T( "Parameters", true, "Paramètres");
            T( "Diffuse this document", true, "Diffusez ce document");
            T( "Share this documen", true, "Partagez ce document");
            T( "Document history", true, "Voir l'histoire du document");
        }
        // Hide Botlog that's is first zone of Manage view
        if ( botlogZone) botlogZone.classList.add( 'hidden');
        // For A4 layount on ManageView
        managePart.classList.add( 'LAY_A4');
        // Get oid array for document
        let oid = this.dom.attr( this.ud.topElement, 'ud_oid').split( '--');
        // Fill Names zone if needed
        if ( namesZone && this.dom.children( namesZone).length < 1) {
            // Add title before Names zone
            this.dom.insertElement( 'h1', T("Manage doc"), {}, namesZone);
            // Fill Names zone
            let docName = this.dom.textContent( 'UD_docTitle');
            let docSubtitle = this.dom.textContent( 'UD_docSubtitle');
            if ( !docSubtitle) docSubtitle = "Description courte";
            let model = this.dom.textContent( 'UD_docModel');
            let namesEdition = { 
                tag: "div", value: {
                    docName: { tag:"p", name: "MANAGE_docName", value: {
                        docTitle:{tag:"span", class:"title",  placeholder:"Nouvelle tâche", stage:"on", menu:"off", value: docName},
                        docSubtitle : {tag:"span", class:"subtitle", stage:"on", menu:"off", placeholder:"Description courte", value: docSubtitle}
                    }},
                    model : { tag: "p", name: "MANAGE_model", value: {
                        label : { tag:"span", class:"label", edit:"off", value: 'Processus :'},
                        modelValue : { tag:"span",  stage: "on", menu:"off", value: model},
                        //  "modelValue":{"tag":"span","value":"=selectorTag( list( 'UD_docAllowedModels'),'','{!Select process!}');"},
                        // previousSibling.childNodes[0] below when above uncommented
                         ok : { tag: "span", class:"button", onclick: "$$$.setModel( this.previousSibling.value)", value:"OK"}
                    }},
                    partEditing : { tag: "div", value: {
                        viewTitle : { tag:"h2", edit:"off", value:"Vues"},
                        viewlist : { tag:"div", name:"MANAGE_viewNames", type:"zoneToFill"}
                    }}
                }
            }; //  name:"MANAGE_docsubTitle",
            let dbName = this.dom.textContent( 'UD_dbName');
            let dbNameFixed = dbName.split( '_')[0];  
            // Build HTML          
            namesZone.innerHTML =  json.putElement( namesEdition).innerHTML;   
            // Add UD parameters to doc name zone       
            this.dom.attr( 'MANAGE_docName', 'ud_oid', oid[0]+'--'+oid[1]);
            this.dom.attr( 'MANAGE_docName', 'ud_extra', '{"name":"'+dbNameFixed+'"}');
            this.dom.attr( 'MANAGE_docName', 'ud_dchanged', 0);
            this.dom.attr( 'MANAGE_docName', 'ud_dupdated', 0);
            this.dom.attr( 'MANAGE_docName', 'ud_fields', "nlabel tcontent"); 
            API.onTrigger( 'MANAGE_docName', 'prepost', API.prePostDocName, false);
            /* // Add UD parameters to model/processus zone
                    let typeEl = this.dom.element( tmpId + 'type');
                    let typeSelector = this.dom.element( 'select', typeEl);                   
                    model = typeSelector.value;
                    $$$.setMode( model);
            */
            this.ud.buildPartEditing( 'MANAGE_viewNames');          
            /* buildPartEditing could b ehere could be here
            let views = this.dom.elements( 'div.part', this.ud.topElement);
            for ( let viewi=0; viewi < views.lengh; viewi++) {
                namesEdition[ 'view'+viewi] = {
                    viewName : { tag:"h3", value:this.dom.attr( view[ viewi], 'name')}
                }
            }*/
        }
        // Fill Paramaters zone if needed
        if ( paramZone && this.dom.children( paramZone).length < 1) {
            // Fill Parameters zone 
            // Get doc's parameters            
            let system = json.parse( 'UD_system');
            if ( !system || !Object.keys(system).length) system = { ideas:["defaultPart", "copyParts"]};
            // Create JSON element with parameters
            let paramObjectName = UD_wellKnownElements.UD_docParams;
            let paramHolderName = paramObjectName.replace( '_object', '');            
            let obj = {
                meta : { 
                    type:"text", subtype:"JSON", name:paramHolderName, 
                    zone:paramHolderName+"editZone", caption:"DocParams", captionPostion:"top"
                },
                data : {
                    tag: "textedit",
                    class:"textContent",
                    value : system
                },
                changes : []                
            };            
            // Create holder for parameter object
            let objHolder = {tag:"div", class:"object hidden", name:paramObjectName, value:JSON.stringify(obj)};
            // Create title switch & JSON element
            // !!!IMPORTANT editor must have label (HTML name attribute) otherwise dispatchNameChange deletes it
            let paramEdition = {
                tag: "div", value : {
                    title: { tag:"h3", onclick: "API.toggleClass( 'MANAGE_params', 'hidden');", value:T("Parameters")},
                    editor : { tag:"div", type:"json", class:"json hidden", name:"MANAGE_params", label:paramHolderName, value:objHolder},
                    /*editor: { tag:"div", type: "json", name:"MANAGE_params", class:"editzone *hidden", value: {tag: "textedit", mime:"text/json", value:system}}*/
                }
            };
            let paramZoneTempEl = json.putElement( paramEdition); 
            paramZone.innerHTML = paramZoneTempEl.innerHTML;
            let paramsEl = this.dom.element( 'MANAGE_params');
            this.ud.ude.initialiseElement( paramsEl);
            this.dom.attr( paramsEl, 'ud_oid', oid[0]+'--'+oid[1]);
            this.dom.attr( paramsEl, 'ud_dchanged', 0);
            this.dom.attr( paramsEl, 'ud_dupdated', 0);
            this.dom.attr( paramsEl, 'ud_fields', "textra");
            paramsEl.classList.add( 'hidden');
        }
        // Fill Actions zone if needed
        if ( actionsZone && this.dom.children( actionsZone).length < 1) {
            // Fill action zone
            let actions = {
                tag: 'div', value: {
                    title : {tag:"h2", value:T("Actions")},
                    //sharing : {},
                    diffusion : { tag:"div", value:{
                        title: { tag:"h3", onclick:"API.toggleClass( 'MANAGE_diffusion', 'hidden');", value:T("Diffuse this document")},
                        diffuse: { tag:"div", class:"*hidden", name:"MANAGE_diffusion", value: {
                            msg: { 
                                tag: "p",
                                name : "MANAGE_diffuseMsg",
                                class: "customerMessage",
                                value:"Bonjour,<br><br>Voici le lien pour votre présentation de SD bee : {link}<br><br>L'équipe SD bee"
                            },
                            recipients: {
                                "meta":{"name":"MANAGE_recipients","zone":"MANAGE_recipientseditZone","type":"list","class":"input", "captionPosition":"top","caption":"Entrez les adresses emails des destinataires ici :"},
                                "data":{"1":{"tag":"ul","name":"MANAGE_recipients","class":"listStyle1","value":{"1":{"tag":"li","class":"input","placeholder":"Enter item","value":"contact@sd-bee.com"}}}},
                                "changes":{}
                            },
                            btn: {tag:"span", class:"button", onclick:"API.diffuseDoc( 'MANAGE_diffuseMsg', 'MANAGE_recipients');", value:"Diffuse"} 
                    }}}},
                    docactions : { tag:"div", value: {
                        title: { tag:"h3", value:T("Copy, delete ...")},
                        deletedoc : { tag:"span", class:"button", onclick:"API.deleteDoc();", value: "Delete"}
                    }}
                }
            };
            actionsZone.innerHTML = json.putElement( actions).innerHTML;
        }        
        if ( isDir) {
            let closeManage = "API.switchView( 'Dir listing');";
            let closeHTML = "<span ud_type=\"button\" class=\"button\" onclick=\""+closeManage+"\">Close Manage</span>";
            this.dom.insertElement( "div", closeHTML, { class:"manageZone"}, managePart, true, true);  
        }
        // Extract botlog content and place in new zone
        let botlog = ( botlogZone) ? this.dom.element( 'p.botlog', botlogZone) : null;
        let botlogContent = ( botlog) ? botlog.innerHTML : "";
        if ( botlogContent) {
            if ( !historyZone) {
                // Build History part
                let history = {
                    tag: 'div', value: {
                        title:{ tag:"h2", onclick:"API.toggleClass( 'MANAGE_history', 'hidden');", value:T("Document history")},
                        history : { tag:"div", class:"*hidden", name:"MANAGE_history", value:{
                            content: { tag:"p", name:"MANAGE_botlog", class:"botlogDisplay", value:botlogContent}    
                        }}
                    }
                };
                let historyElement = json.putElement( history);
                let attr = { name:'DocHistory', class:"manageZone", 'data-ud-type':"zone"};
                historyZone = this.dom.prepareToInsert( 'div', historyElement.innerHTML, attr);
                let page = this.dom.element( 'div.page', managePart);
                if ( page) page.appendChild( historyZone); else managePart.appendChild( historyZone);
            } else {
                // Update History part
                let botlogTarget = this.dom.element( 'MANAGE_botlog');
                botlogTarget.innerHTML = botlogContent;
            }
        }    
    } // API.buildManagePart()
    
   /**
    * Diffuse a document using the SendDoc service
    */
    diffuseDoc( msgHolderId, recipientsHolderId) {
        if ( window.APP_DIFFUSE) return;
	    window.APP_DIFFUSE = true;
	    // Check data holders
	    let msgHolder = API.dom.element( msgHolderId);
	    let recipientsHolder = API.dom.element( recipientsHolderId);
	    if  ( !msgHolder || !recipientsHolder) {
	       API.pageBanner( 'temp', 'Missing data');
	       window.APP_DIFFUSE = false;
	       return;
	    }
	    // Get message
	    let html = msgHolder.innerHTML;
	    // Substitute general parameters
	    // Get recipients
        let recipients = API.getItems( recipientsHolderId);
        API.pageBanner( "temp", "Diffusion d'une instance de ce modèle à " + recipients.length + " emails");
	    // For each recipient
        for ( let reci=0; reci < recipients.length; reci++) {
	        let recipient = recipients[ reci];
	        // Setup link
	       
	        // Personalise message
	        // Send message
	        let params = {
	           action:"send",
	           subject: "SD bee demo",
	           body: html,
	           to:  recipient,
	           oid : API.dom.attr( 'document', 'ud_oid'),
	           docName : "Demo SD bee",
	           lifeInDays : 30,
	          // template : msg, // could be API.dom.attr( msgHolder, 'ud_oid')
	        };
	        let rep = API.service( "SendDoc", params);
	        console.log( rep);
	   }
	   window.APP_DIFFUSE = false;
	   return true;
	} // API.diffuseDoc()
    
   /**
    * Make a copy of a JSON-coded object stored in a DIV element
    *   @param {integer} srcElementId identity of object to copy
    *   @return {HTMLelement} element with copy
    */
    copyObjectInDiv( srcElementId) {
        
    } // UDutilities.copyObject()
    
   /**
    *   Copy an element's contents
    *   @param {HTMLelement} source source element or source element's id
    *   @param {HTMLelement} destination destination element or source element's id 
    *   @param {object} substitute keyed array of values (default empty) to substitute in transfered content ({key} syntax) 
    *   @param {boolean} keepFormulae if true (default) then also transfert ude_formula attribute of transfered elements 
    *   @return {HTMLelement} copied element
    */
    copy( source, destination, substitute={}, level = 0, keepFormulas = true)
    {
        
        let elTag = this.dom.attr( source, 'tagName');
        let elType = this.dom.attr( source, 'ud_type');
        let elClass = source.className;
        let attributes = {};
        // 2DO Improve - loop through children, don't copy ude_bind, change name on class Object use copyObject
        let data = source.innerHTML
        if ( ['subpart', 'zone'].indexOf( elType) > -1) data = ""; // child.textContent;
        if ( this.dom.attr( source, 'ud_oid') == "") return null;
        if ( elType) attributes = { ud_type: elType, class: elType};
        if ( elClass) attributes['class'] = elClass;
        // Substitute
        if ( data != "")
        {
       // for ( var i=0; i < this.copyAttributes.length; i++)
       // {
         //   if ( this.dom.attr( source, this.copyAttributes[i]))
          //  {
          //      let value = this.dom.attr( source, this.copyAttributes[i]);
                for ( var key in substitute)
                {
                    let re = new RegExp( '{'+key+'}', "g");
                    data = data.replace( re, substitute[key]);
                }
                //attributes[ this.copyAttributes[i]] = value;
            //}
        }
        //if ( elTag == 'span') attributes['ude_stage'] = "on";
        // Insert new element into DOM
        let newElement = null;
        newElement = this.dom.prepareToInsert( elTag, data, attributes);
        newElement = destination.appendChild( newElement);
        if ( !keepFormulas) this.ud.ude.calc.substituteFormulaeInElement( newElement);
        this.ud.viewEvent( "create", newElement); // inform VIEW-MODEL of new element
        if ( elType)
        {
            switch ( elType)
            {
                case "zone" :
                case "subpart" :
                    // Use recurrence to copy lower levels
                    // Delay so parent ud_oid is set by server
                    let me = this;
                    // setTimeout( function () { me.deepCopy( source.id, newElement.id, substitute, false, keepFormulas)}, 2500);
                    let fct = function () { me.deepCopy( source.id, newElement.id, substitute, false, keepFormulas)};
                    this.ud.onTrigger( newElement, 'update', fct);                    
                    break;
                default :
                    this.ud.ude.initialiseElement( newElement.id);
                    break;
            }
        }
        return newElement;
    } // UDutilities.copy()
    
    deepCopy( sourceId, destinationId, substitute = {}, copyTop = false, keepFormulas = true)
    {
        let source = this.dom.element( sourceId);
        let destination = this.dom.element( destinationId);
        let d_oid = this.dom.attr( destination, 'ud_oid');
        let firstCopy = null;
        if ( d_oid != "" && d_oid.split('--')[1].split('-').pop() == 0)
        {
            let me = this;
            setTimeout( function () { me.deepCopy( sourceId, destinationId, substitute, copyTop)}, 1500);
            return debug( {level:2, return:false}, "Destination not saveable yet", destination);
        }
        
        if ( copyTop)
        {
            // Copy of top node required
            destination = this.copy( source, destination);
            firstCopy = destination;
            let me = this;
            // setTimeout( function () { me.deepCopy( sourceId, destinationId, substitute, false, keepFormulas)}, 1500);
            let fct = function () {  me.deepCopy( sourceId, destinationId, substitute, false, keepFormulas)};
            this.ud.onTrigger( newElement, 'update', fct);                    
            return ( {level:2, return:true}, "Destination not saveable yet", destination);
        }
        // Copy source's children
        var children = this.dom.children( source);
        for ( var i=0; i < children.length; i++)
        {
            let child = children[ i];
            let childType = this.dom.attr( child, 'ud_type');
            if ( ['page'].indexOf( childType) > -1) continue;            
            let newElement = this.copy( child, destination, substitute, 0, keepFormulas);
            if ( !firstCopy) firstCopy = newElement;
        }
        if ( !firstCopy || typeof firstCopy.id == "undefined")
            return debug( {level:2, return:false}, "Nothing copied in API.deepCopy()", source, destination);
        return firstCopy.id;
    } // UDutilities.deepCopy()
    
   /**
    * @api {JS} API.copyElements(sourceIdOrName,targetIdOrName,containerId) Create a copy of elements in a view's or a zone 
    * @apiParam {string} sourceIdOrName Id or name of the set of elements to copy
    * @apiParam {string} targetIdOName Id or nameof where to place created copy of elements
    * @apiParam {string} containerId Id of element containing source & target. Default = document
    * @apiSuccess {boolean} Success or Failure
    * @apiGroup HTML
    */
    copyElements( sourceIdOrName, targetIdOrName, containerId = "document") {
        // Find Source & Target
        let container = this.dom.element( containerId);
        let source = this.dom.element( sourceIdOrName);
        if ( !source && container) source = this.dom.element( "[name='"+sourceIdOrName+"']", container);
        let target = this.dom.element( targetIdOrName);
        if ( !target && container) target = this.dom.element( "[name='"+targetIdOrName+"']", container);
        if ( !source || !target) return debug( {level:1, return:false}, "Can't copy from to", sourceIdOrName, targetIdOrName);
        // Find Source & Target id's for subtitution
        let sourceViewId = source.id.substring( 0,3);        
        let targetViewId = target.id.substring( 0,3);
        let sourceBlockId = source.id.substring( 3, 13);        
        let targetBlockId = target.id.substring( 3, 13);
        let sourceBlockNo = parseInt( sourceBlockId, 32);
        let targetBlockNo = parseInt( targetBlockId, 32);
        let userId = ("00000"+window.ud.userId).slice(-5).toUpperCase();
        // Get view name suffix to use for renaming objects
        let nameSuffix = this.dom.attr( target, 'name').replace( this.dom.attr( source, 'name'), '');
        nameSuffix = nameSuffix.replace( / /g, '_');
        // Get list of elements to re-create in Target
        let children = API.dom.children( source);
        // Loop 1 - create elements
        let lastEl = null;
        for ( let childi = children.length - 1; childi >= 0; childi--) {
            let child = children[ childi];
            let id = child.id;
            let copyId = targetViewId + id.substring( 3, 13) + userId;
            if ( sourceViewId == targetViewId) {
                let blockNo = parseInt( id.substring( 3, 13), 32);
                blockNo = targetBlockNo + ( blockNo - sourceBlockNo);
                copyId = targetViewId + ( "0000000000"+blockNo).slice(-10) + userId;
            }
            if ( this.dom.element( copyId)) {
                // Target element exists already
                // if updateAll                
                // indicate source
                lastEl = this.dom.element( copyId);
                this.dom.attr( lastEl, 'ude_datasrc', id);
                let extra = API.json.parse( API.dom.attr( lastEl, 'ud_extra'));
                if ( !extra) extra = {};
                extra[ 'datasrc'] = id;
                API.dom.attr( lastEl, 'ud_extra', JSON.stringify( extra));
                // 2DO update content
                API.setChanged( lastEl);
            } else {
                // Create Target element
                let copyEl = child.cloneNode( true);
                copyEl.id = copyId;
                // 2DO Name management
                let name = this.dom.attr( child, 'name');
                let object = this.dom.element( name + '_object');               
                let newName = "";
                if ( name && object) {
                    // JSON100 element - do renaming once copied element added to DOM
                    newName = name + nameSuffix;                                     
                }
                // Link to source for translation etc
                // 2DO Use id of editable content (table, list ...)
                this.dom.attr( copyEl, 'ude_datasrc', id);
                // Add requiresAction class
                copyEl.classList.add( 'ud_requiresAction');
                let extra = API.json.parse( API.dom.attr( copyEl, 'ud_extra'));
                if ( !extra) extra = {};
                extra[ 'datasrc'] = id;                
                API.dom.attr( copyEl, 'ud_extra', JSON.stringify( extra));
                // Add to page in target
                let page = ( lastEl) ? lastEl.parentNode : target.childNodes[ target.childNodes.length - 1]; // page
                if ( this.dom.attr( page, 'exTag') == "div.page") {
                    if ( childi == children.length - 1) copyEl = page.appendChild( copyEl);
                    else copyEl = page.insertBefore( copyEl, lastEl);
                } else {
                    if ( childi == children.length - 1) copyEl = target.appendChild( copyEl);
                    else copyEl = target.insertBefore( copyEl, lastEl);
                }
                // Save                
                if ( newName && object) {
                    // Change name
                    if ( !API.changeName( copyEl, newName)) {
                        // copyEl.remove();
                        return false; // this module but using API in case its moved
                    }
                    // Link target to actual data
                    this.dom.attr( copyEl, 'ude_datasrc', newName);
                }
                this.ud.viewEvent( 'create', copyEl);
                lastEl = copyEl;                
            }
        } // end of Loop 1
        API.paginate( target);
    } // UD_utilities.copyElements()
    

    /**
    * @api {JS} API.concatHTMLelements(sourceIdOrName,params) Concanete 
    * @apiParam {string} sourceIdOrName Id or name of the set of elements to copy
    * @apiParam {string} targetIdOName Id or nameof where to place created copy of elements
    * @apiParam {string} containerId Id of element containing source & target. Default = document
    * @apiSuccess {boolean} Success or Failure
    * @apiGroup HTML
    */
    concatHTMLelements( sourceName, params)
    {
        let gval = this.dom.udjson.value;
        let baseStyle = gval( params, 'baseStyle');
        let styleId = gval( params, 'styleId');
        let containerCode = gval( params, 'containerCode');
        //let elementStyle = gval( params, 'elementStyle');
        let units = {
            width:"px", height:"px", "font-size":"px", float:"", color:"", 
            "background-color":"", 
            "margin-top":"px", "margin-left":"px", "margin-right":"px", "margin-bottom":"px",
            "padding-top":"px", "padding-right":"px", "padding-bottom":"px", "padding-left":"px", 
            "border-radius":"px"
        };
        let source = this.dom.elementByName( sourceName);
        if ( !source) return debug( { level:1, return:""}, "Can't find ", sourceName);
        let html = "";
        let head = "";
        if ( styleId) {
            let style = this.ud.ude.calc.textContent2HTML( styleId);
            if ( style.indexOf( '<meta name="viewport"') == -1) {
                head += '<meta name="viewport" content="width=device-width,initial-scale=1.0">'+"\n";
                head += '<meta charset="UTF-8">'+"\n";
            }
            if ( style.indexOf( '<style') > -1) { head += style;}
            else { head += '<style type="text/css">'+style+'</style>';}
        }        
        if ( baseStyle) 
        {
            html += "<html><head>"+head+"</head>";
            html += "<body style=\"";        
            // Add base style to body     
            for( var key in baseStyle) 
            {
                let val = baseStyle[ key];
                let unit = "";
                let foundUnit = "";
                if ( typeof val == "string") {
                    foundUnit = val.slice( -2);
                    if ( val.slice( -1) == "%") { foundUnit = "%";}
                }
                if ( key.charAt(0) == '_') key = key.substr( 1);
                if ( typeof units[key] != "undefined") unit = units[key];
                if ( [ "%", "px", "em"].indexOf( foundUnit) > -1) unit = "";
                html += key+":"+baseStyle[key]+unit+";";
            }    
            html += "\">";
            // Add opening container code
            html += containerCode.open;            
        }    
        // Get elements
        let children = this.dom.elements( "div[data-ud-type='filledZone'],div[data-ud-type='html']", source);        
        // For each element
        for ( let childi=0; childi < children.length; childi++)
        {
            let child = children[ childi];
            let childExTag = this.dom.attr( child, 'exTag');
            if ( childExTag == "div.html") {
                let childView = this.dom.element( "div div.htmlView", child);
                if ( !childView) continue;               
                html += childView.innerHTML;
            } else html += child.innerHTML;
        }
        // Add closing container code
        html += containerCode.close;
        if ( baseStyle) html += "</body></html>";
        //html = html.replace( /&nbsp;/g, ' ');        
        return html;        
    } 

    getInlineHTML( parentId, baseStyle, elementStyle, skipIds, styleId="")
    {
        let units = {
            width:"px", height:"px", "font-size":"px", float:"", color:"", 
            "background-color":"", 
            "margin-top":"px", "margin-left":"px", "margin-right":"px", "margin-bottom":"px",
            "padding-top":"px", "padding-right":"px", "padding-bottom":"px", "padding-left":"px", 
            "border-radius":"px"
        };
        let parent = parentId;
        if ( typeof parentId == "string") parent = this.dom.element( parentId);
        let html = "";
        let head = "";
        if ( styleId) {
            let style = this.ud.ude.calc.textContent2HTML( styleId);
            if ( style.indexOf( '<meta name="viewport"') == -1) {
                head += '<meta name="viewport" content="width=device-width,initial-scale=1.0">'+"\n";
                head += '<meta charset="UTF-8">'+"\n";
            }
            if ( style.indexOf( '<style') > -1) { head += style;}
            else { head += '<style type="text/css">'+style+'</style>';}
        }        
        if ( baseStyle) 
        {
            html += "<html><head>"+head+"</head>";
            html += "<body style=\"";        
            // Add base style to body     
            for( var key in baseStyle) 
            {
                let val = baseStyle[ key];
                let unit = "";
                let foundUnit = "";
                if ( typeof val == "string") {
                    foundUnit = val.slice( -2);
                    if ( val.slice( -1) == "%") { foundUnit = "%";}
                }
                if ( key.charAt(0) == '_') key = key.substr( 1);
                if ( typeof units[key] != "undefined") unit = units[key];
                if ( [ "%", "px", "em"].indexOf( foundUnit) > -1) unit = "";
                html += key+":"+baseStyle[key]+unit+";";
            }    
            html += "\">";
            // 2DO Container Code
            html += '<table class="emailContainer" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td>';            
        }    
        // Get elements
        let children = this.dom.children( parent);
        // For each element
        for ( var i=0; i < children.length; i++)
        {
            let child = children[ i];
            let htmlEl = "";
            // Check if element is to be skipped
            if ( skipIds.indexOf( child.id) > -1) continue;
            
            if ( child.nodeType == 3)
            {
                // Text node
                htmlEl += child.textContent;
                // continue;
            }
            else if ( child.nodeType == 1)
            {
                let childType = this.dom.attr( child, 'exTag');
                if ( [ "div.zone"].indexOf( childType) > -1) {
                    // Use recurrence to get other levels 
                    htmlEl += this.getInlineHTML( child.id, null, elementStyle, skipIds);
                    htmlEl += "\n";
                } else if ( ['div.filledZone', 'div.zoneToFill'].indexOf( childType) > -1) {
                    // Just add inner HTML
                    htmlEl += child.innerHTML;
                } else if ( this.dom.attr( child, 'computed_display') != "none") {
                    // Add HTML element wih inline style and inner HTML
                    let tag = child.tagName.toLowerCase();
                    htmlEl = "<div style=\""; // "<"+tag+" style=\"";
                    // GetComputedStyles to see différences with base
                    // htmlEl += this.getInlineStyle( child, elementStyle, units);
                    htmlEl += "\">\n";
                    htmlEl += child.innerHTML;
                    htmlEl += "</div>\n";
                }
            }    
            // Add element(s HTML to result)
            html += htmlEl+"\n";            
        }
        // 2DO CLose containerCode
        if ( baseStyle) html += "</td></tr></table></body></html>";
        html = html.replace( /&nbsp;/g, ' ');        
        return html;        
    } // getInlineHTML()
    
   /**
    * @api {js} egaliseHeightOfClass(className) equalise height of all elements with class to highest element 
    * @apiParam className id of container element
    * @apiGroup HTML
    *   
    */
    egaliseHeightOfClass( className)
    {
        let elements = document.getElementsByClassName( className);
        // Get max height
        let maxHeight = 0;
        for ( let eli=0; eli < elements.length; eli++)
        {
            let elHeight = this.dom.attr( elements[ eli], "computed_height");
            if( elHeight > maxHeight) maxHeight = elHeight;
        }
        // Set height to all
        maxHeight += "px";
        for ( let eli=0; eli < elements.length; eli++) elements[ eli].style.height = maxHeight;
            // this.dom.attr( elements[ eli], "height", maxHeight);
        return true;
    } // UDutilities.egaliseHeightOfClass() 

    
    // getContentWithInlineStyles() returns content with styles inlined
    getContentWithInlineStyles()
    {
        
    }
    
    // getInlineStyle() returns style string
    getInlineStyle( element, elementStyle, units)
    {
        let inlineStyle = "";
        for( var key in elementStyle)
        {
            // Ignore attributes starting with _
            if (key.charAt(0) == '_') continue;
            // Get numerical or string value of computed style attribute as appropriated
            let attrValue = this.dom.attr( element, "computed_"+key);
            console.log( key + ":" + attrValue);
            let compareValue = attrValue;
            if ( !isNaN( compareValue)) compareValue = Math.floor( parseFloat( compareValue));
            // Compare style attribute with provided one  
            if ( compareValue != elementStyle[key] && compareValue != "")
            {
                // This style attribute is required, add it with or without units
                let unit = "";
                if ( typeof units[key] != "undefined" && !isNaN( attrValue)) unit = units[key];
                inlineStyle += key+":"+attrValue+unit+";";
            }                
        }
        return inlineStyle;
    } //UDutilites.getInlineStyles()
    
    // Build a displayable list of device emulations
    buildDisplayableDeviceList()
    {
        let elementId = "scroll";
        let classList = this.ud.ude.calc.exec( "classesByTag( '#scroll');");
        let clearClasses = classList; // only one of these active at a time
        classList = classList.split(',');
        let display = '<ul>';    
        let onclickDef = "window.ud.ude.changeClass( '', '"+elementId+"', '"+clearClasses+"');";
        display += '<li><a href="javascript:" onclick="'+onclickDef+'">This screen</a></li>';
        for( var classi=0; classi < classList.length; classi++)
        {                
            let className = classList[ classi];
            if ( className == "") continue;
            let appPartName = this.dom.element( 'UD_appPart').textContent;
            let appPart = document.getElementsByName( appPartName)[0];
            let onclick = "";
            if ( appPart)
            {
                onclick += "API.showOneOfClass( '"+appPart.id+"');";
                onclick += "API.followScroll( '"+appPart.id+"');";
            }
            onclick += "API.changeClass( '"+className+"', '"+elementId+"', '"+clearClasses+"');";            
            display += '<li><a href="javascript:" onclick="'+onclick+'", ude_p1="'+elementId+'">';
            display += API.translateTerm( className);
            display += '</a></li>';
        }    
        display +='</ul>';
        return display;
    } // UDutilities.getDeviceList()
    
   /**
    * appendHTMLblock()
    *   @param html
    *   
    *   Insert an HTML block into a zone
    */
    appendHTMLblock( className, valuesToSubstitute, targetId)
    {
        
    } // UDutilities.appendHTMLblock()
    
   /**
    * removeChildren() -- mark an element's children for removal from DB 
    *   @param parentId -- id of container element
    *   
    */
    removeChildren( parentId)
    {
        let parent = this.dom.element( parentId);
        if ( !parent) return false;
        let walk = parent.childNodes[0];
        if ( !walk) return false;
        while ( walk)
        {
            let toRemove = walk;
            walk = walk.nextSibling;
            this.ud.viewEvent( 'delete', toRemove);
        }
        return true;
    } // UDutilities.removeChildren()


    insertIntoTemplate( elementId, classFilters, template)
    {
        /*
        template = `<table border="0" cellpadding="0" cellspacing="0" width="600" id="templateColumns">
    <tr>
        <td align="center" valign="top" width="50%" class="templateColumnContainer">
            <table border="0" cellpadding="10" cellspacing="0" width="100%">
                <tr>
                    <td class="leftColumnContent">
                        <img src="http://placekitten.com/g/480/300" width="280" style="max-width:280px;" class="columnImage" />
                    </td>
                </tr>
                <tr>
                    <td valign="top" class="leftColumnContent">
                        <h1>Left Column</h1>
                        Lorem ipsum dolor sit amet.
                    </td>
                </tr>
            </table>
        </td>
        <td align="center" valign="top" width="50%" class="templateColumnContainer">
            <table border="0" cellpadding="10" cellspacing="0" width="100%">
                <tr>
                    <td class="rightColumnContent">
                        <img src="http://placekitten.com/g/480/300" width="280" style="max-width:280px;" class="columnImage" />
                    </td>
                </tr>
                <tr>
                    <td valign="top" class="rightColumnContent">
                        <h1>Right Column</h1>
                        Lorem ipsum dolor sit amet.
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>`;
*/
        let style = `<style type="text/css">
    @media only screen and (max-width: 480px){
        #templateColumns{
            width:100% !important;
        }

        .templateColumnContainer{
            display:block !important;
            width:100% !important;
        }

        .columnImage{
            height:auto !important;
            max-width:480px !important;
            width:100% !important;
        }

        .leftColumnContent{
            font-size:16px !important;
            line-height:125% !important;
        }

        .rightColumnContent{
            font-size:16px !important;
            line-height:125% !important;
        }
    }
</style>`;
        let element = elementId;
        if ( typeof elementId == "string") element = this.dom.element( elementId);
        let data = {};
        let children = element.childNodes();
        // Build table of inline contents from doc elements
        for ( let childi=0; children.length; childi++)
        {
            let child = child[i];
            let classList = child.classList;
            let filterClass = "";
            for ( let classi = 0; classi < classFilters.length; classi++) 
                if ( classList.contains( classFilters[i])) { filterClass = classFilters[i]; break;}
            if ( filterClass) 
                if ( typeof data[ filterClass] == "undefined")  data[ filterClass] = [ this.getContentWithInlineStyles( child)];
                else data[ filterClass].push( this.getContentWithInlineStyles( child));
        }    
        let html = "";
        // For each set found apply template
        let firstFilter = classFilters[ 0];
        let sets = data[ firstFilter];
        for ( let datai = 0; datai < sets.length; datai++)
        {
            let w = template;
            for ( let key in data)
            {
                let expr = new RegExp( '{'+key+'}', "g");
                w = w.replace( expr, data[key][datai]);
            }
            html += w;            
        }
        return html;
    } // UD_utilities_insertIntoTemplate()
    
   /**
    * Detect a change of an element's name, check its unique and update all appropriate elements
    * @param {HTMLelement} nameElement The element containing the name
    */
    dispatchNameChange( saveableOrId) {
        let saveable = this.dom.element( saveableOrId);      
        let spans = this.dom.elements( 'span.objectName', saveable); 
        let objectDivs = this.dom.elements( 'div.object', saveable); 
        // let editZones = this.dom.elements( 'div[ude_bind]', saveable); 
        if ( !spans.length && !objectDivs.length) return true; // Can't dispatch name change but don't stop saving
        let objectNameHolder = ( spans.length) ? spans[ 0] : null; // [ spans.length - 1]; //[0]
        let objectName = ( objectNameHolder) ? objectNameHolder.textContent : this.dom.attr( saveable, 'name');
        let dataHolder = objectDivs[0];
        // let editZone = editZones[0];
        /* DEPRECATED 20220520 & created issues
        if ( objectName == "") {
            // Object's name has been deleted. Temporarily this means delete object
            this.ud.viewEvent( 'delete', saveable);
            return false; // Don't save element
        } else */if ( objectName && dataHolder.id.indexOf( objectName + '_') != 0) { //( dataHolder.id != objectName + "_object") {
            // Object name has changed, so change dataholder id, ude_bind in editzone, editzone and displayedObject's id
            let oldName = dataHolder.id.replace( '_object', '');              
            let found = this.dom.element( objectName); // s( '[name="'+objectName+'"]', 'document');
            if ( found) {
                // An element already exists with this name so restore old name and return false
                if ( objectNameHolder) objectNameHolder.textContent = oldName;
                API.pageBanner( 'temp', '<span class="error">'+API.translateTerm( 'Name is already used')+'</span>')
                return debug( {level:1, return: false}, "Can't dispatch name change as name is not unique", objectName);
            }
            
            dataHolder.id = objectName + "_object";
            // Update name and bind attr on all divs inside element
            let newName = objectName;
            if ( this.dom.attr( saveable, 'name') != newName) {
                this.dom.attr( saveable, 'name', this.dom.attr( saveable, 'name').replace( oldName, newName));
            }
            // Look at all elements in saveable, especially the divs
            let divs = []; //this.dom.elements( '*', saveable); 
            if ( this.nodejs) divs = document.querySelectorAll( '#'+saveable.id+' *');
            else divs = saveable.querySelectorAll( '*');
            for ( let divi=0; divi < divs.length; divi++) {                
                let div = divs[ divi];
                if (div == dataHolder) continue; // DataHolder's id already changed
                if ( div.id) { div.id = div.id.replace( oldName, newName);}
                let bind = this.dom.attr( div, 'ude_bind');
                if ( bind) { this.dom.attr( div, 'ude_bind', bind.replace( oldName, newName));}
                let onclick = this.dom.attr( div, 'onclick');
                if ( onclick) { this.dom.attr( div, 'onclick', onclick.replace( oldName, newName));}
            }
            // 2DO Update name in JSON100 meta
            // Hide name to show change taken into account
            if ( objectNameHolder && !objectNameHolder.classList.contains( 'hidden')) objectNameHolder.classList.add( 'hidden');
        }
        return true; // Element can be saved
    } // dispatchNameChange()
    
   /*
    *   Change the name of a binded element using the text of the provided element
    *   2DO merge with dispatch ie dispatch new name throughout object
    *   API.changeName()
    */    
    /* 2DO changeName( elementOrId, newName) to change name directly 
    */
    changeName( elementOrId, newName = "") {
        let element = API.dom.element( elementOrId);
        if ( !element) { return debug( { level:1, return:false}, "Can't changeName on unfound element", elementOrId);}
        if ( !newName) {
            // No name provided so look for an element where name has been edited
            if ( element.id == '_TMPnameEdition') {
                // Menu control optin has name edition DEPRECATED
                let bindId = API.dom.attr( element, 'ude_bind');
                let bindEl = ( bindId == "previous") ? element.previousSibling : ( bindId == "next") ? element.nextSibling : null;
                newName = element.textContent;
                element.remove();
                element = bindEl;
                // this.ude.setChanged( bindEl);
            } else if ( element == window.MENU.editElement) { // API.dom.getSaveableParent( element)) {
                // Element is being edited - look for objectName field 
                let actionBox = ( element.tagName == "SPAN") //this.dom.attr( element, 'exTag') == "span")
                    ? element.parentNode.previousSibling
                    : element.previousSibling;            
                let nameInput = API.dom.element( "span.objectName", actionBox);
                if ( nameInput) { newName = nameInput.textContent;} // API.dom.attr( element, 'name', nameHolder.textContent);}            
            } else {
                                // Composite element has SPAN holder for name (deprecated)
            }
        }
        if ( newName) {
            // Look for name holder
            let cname = API.dom.attr( element, 'name');
            let editZoneId = cname + "editZone";
            let editZone = this.dom.element( editZoneId);
            let nameHolder = ( cname && editZone) ? API.dom.element( "span.objectName", editZone): null;
            if ( nameHolder) {
                // Write name to SPAN holder DEPRECATED
                nameHolder.textContent = newName; 
            } else if ( !API.dom.element( '[name="'+newName+'"]', "document")) {
                // Name is free to use so write to element's name attribute
                API.dom.attr( element, 'name', newName);
                // also id for span elements
                if ( element.tagName == "SPAN") element.id = newName;
            } else {
                // Name is already used - display error message
                API.pageBanner( 'tmp', "Duplicate name");
                return;
            }
            // Change name throughtout the element's children
            this.dispatchNameChange( element);
            // Update JSON100 object by generating a save event on element
            let object = this.dom.element( newName + '_object');
            if ( object) {
                editZoneId = newName + "editZone";
                editZone = this.dom.element( editZoneId);
                // Update object holder               
                this.ud.ude.dispatchEvent( { event:"save", target:object}, editZone); 
            }
            // Save name change
            this.ud.ude.setChanged( element, true);
            // Increment Autoindex if used
            let nameParts = newName.split( '_');
            if ( nameParts.length == 2 && !isNaN( nameParts[ 1]) && typeof window.udparams['AutoIndex_' + nameParts[0]] != "undefined") {
                // Autoindex used
                window.udparams[ 'AutoIndex_' + nameParts[0]]++;
            }
        }
        return true;
        // 2DO if name and matches AUtoIndex increment AutoIndex        
    } // API.changeName(), UDutilities.changeName()


   /**
    * Change the class of an element's child nodes based on element's class
    * @param {HTMLelement} nameElement The element containing the name
    */
    dispatchClassChange( saveableOrId, oldClass, newClass="") {
        let saveable = this.dom.element( saveableOrId);
        if ( !saveable || !oldClass || !newClass) return;
        if ( !newClass) newClass = this.dom.keepPermanentClass( saveable.className);
        //if ( !oldClass)
        if ( newClass != oldClass) {
            // Look at all elements in saveable, especially the divs
            let els = this.dom.elements( '*', saveable); 
            for ( let eli=0; eli < els.length; eli++) {                
                let el = els[ eli];
                if ( el && el.className) el.className = el.className.replace( oldClass, newClass);
            }
        }
        return true; // Element can be saved
    } // dispatchClassChange()

   /**
    * Adjust doc name holder's id field before saving
    */
    prePostDocName( element) {
        // Element is a holder for doc's name or subtitle with DB name in ud_extra attribute
        // Manage view doc name element : extract label field and rebuild name
        let nameParts = this.dom.children( element);
        let label = "";
        let shortLabel = "";
        let content = "";
        // Determine HTML label and short text label
        if ( nameParts.length > 1) {
            content = '<span class="title">'+htmlEntities(nameParts[0].textContent)+'</span>';
            if ( nameParts[1].textContent != this.dom.attr( nameParts[1], 'ude_place')) {
                content += '<span class="subtitle">'+htmlEntities(nameParts[1].textContent)+'</span>';
            }
            label = nameParts[0].textContent;
            shortLabel = nameParts[0].textContent.replace( / /g, '').substring( 0, 8);
        } else if ( nameParts.length > 0) {
            label = nameParts[0].textContent;
            shortLabel = nameParts[0].textContent.replace( / /g, '').substring( 0, 8);          
        } else {
            label = element.textContent;
            shortLabel = label.replace( / /g, '').substring( 0, 8);
        }             
        let system = this.dom.udjson.parse( this.dom.attr( element, 'ud_extra'));
        if ( system && this.dom.udjson.value( system, 'name')) {
            // Rebuild DB nname field using name info stored in extra  
            let dbName = system[ 'name'] + "_" + shortLabel;
            element.id = dbName; // Name not important as oid points to doc
            this.dom.attr( element, 'name', label);
            this.dom.attr( element, 'ud_saveid', 'yes'); // force nname save
        }
        return content;
    }
    
} // JS Class UDutilities 

if ( typeof process != 'object') {
    let mod = new UDutilities( ud, API);
} else {    
    // Testing under node.js
    module.exports = { class: UDutilities};
    //window.UDAJAX = UDAJAX;
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined")
    {
        console.log( 'Syntax udutilities.js:OK');
        console.log( 'Start of test program'); 
        // Setup browser emulation
        console.log( "Setting up browser (client) test environment");    
        // console.log( Date.now());
        var envMod = require( '../tests/testenv.js');
        envMod.load();
        // Setup our UniversalDoc object
        ud = new UniversalDoc( 'document', true, 133);
        let test = "Manage part";
        API.buildManagePart();
        testResult( test, API.dom.element( 'UD_docParams'), API.dom.element( 'MANAGE_params'));
        console.log( "Test completed");
        process.exit();
    }    
} // End of test routine