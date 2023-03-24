/**
 * udeconnector.js
 *
 * Universal Document element that extracts data from an external source
 * and presents it as a table
 * Client-side code
 *
 */
 
 /**
 * udeconnector JS class 
 * Universal Document element that extracts data from an external source
 * and presents it as a table. Works with server side's udconnector.php 
 * <p>DOM structure is for JSON100
 *   DIV type connector subype
 *      DIV type object class hidden with JSON data
 *      DIV #name_editZone type editZone
 *          Buttons
 *      DIV #name_parameters_editZone type textedit
 *         table for editing text
 *      DIV #name_dataeditZone type table
 *         dataset table
 * </p>
 */
 class UDEconnector
 {
    ud;
    dom;
    ude;
    paramEditor;
    dataEditor;
    editZoneSuffix = "editZone";
    paramZoneSuffix = "_parameters_editZone";
    dataZoneSuffix = "_dataeditZone";
    siteExtract = null;
    
    // Set UDEconnector editor
    constructor( ud)
    {
        this.ud = ud;
        this.dom = ud.dom;
        if ( typeof ud.ude != "undefined") this.ude = ud.ude; else this.ude = ud;
        // Setup editors
        this.paramEditor = this.ude.modules['div.linetext'].instance;
        this.dataEditor = this.ude.modules['div.table'].instance;
        if ( typeof API != "undefined") {
            API.addFunctions( this, [ 
                'connectorGet', 'connectorSet', 'connectorRefresh', 'connectorDataTable', 'connectorUpdateServer',
                'connectorAppend'
            ]);
        }
    } // UDEconnector.construct()
       /**
    *  UDE-VIEW Interface                                                 
    */
    
    // User-generated event 
    inputEvent( e, element)
    {        
        let processed = false;
        let source = element;
        let event = e.event;
        let saveable = this.dom.getSaveableParent( source);
        let saveableId = saveable.id;
        // Check editors
        this.paramEditor = this.ude.modules['div.linetext'].instance;
        this.dataEditor = this.ude.modules['div.table'].instance;
        
        // Process event  
        switch ( event) {
            case "create" :
                processed = this.initialise( saveableId);
                break;
            case "change":
                break;
            case "newline" :
                // Determine if event is in data table or paramater table
                let bind = this.dom.getParentWithAttribute( 'ude_bind', element);
                let isData = ( bind.id.indexOf( 'dataeditZone') > -1);
                // Call appropriate editor
                if ( isData) { processed = this.dataEditor.inputEvent( e, element);}
                else { processed = this.paramEditor.inputEvent( e, element);}
                break;
            case "save" :
                processed = this.prepareToSave( element, e.target);
                break;
            case "remove" :
                break;
            case "insert" :
                break;
            case "configure" :
                debug( {level:5}, "UDEconnector inputEvent/configure");            
                let name = this.dom.attr( saveable, 'name');
                let editZoneId = name+this.dataZoneSuffix;
                if ( !this.dom.element( editZoneId)) editZoneId = name+this.editZoneSuffix;
                let paramZoneId = name + this.paramZoneSuffix;            
                let subType = this.dom.attr( saveable, 'ud_subtype'); 
                if ( subType == "site") { // Make switch when larger choice
                    let configZoneId = name+"_config";
                    API.showNextInList( [editZoneId, configZoneId, paramZoneId]); 
                    if ( 
                        ( !this.dom.element( configZoneId) || !this.dom.element( configZoneId).classList.contains( 'hidden'))
                        && this.siteExtract
                    ) {
                        this.siteExtract.buildConfigZone( name);
                    }
                } else  API.showNextInList( [editZoneId, paramZoneId]);
                processed = true;
                break;
            case "copy" : 
            case "cut" : 
            case "paste" : case "endPaste" :
            case "merge up" :
            case "merge down" : {
                let displayable = this.dom.getParentWithAttribute( 'ude_bind', source);
                if ( displayable.id.indexOf( this.paramZoneSuffix) > -1)
                    processed = this.paramEditor.inputEvent( e, element);
            break;}
            case "insert column" : {
                let displayable = this.dom.getParentWithAttribute( 'ude_bind', source);
                if ( displayable.id.indexOf( this.dataZoneSuffix) > -1)
                    processed = this.dataEditor.inputEvent( e, element);
            break;}
        }   
        return processed;
    
    } // UDEconnector.inputEvent()
    
   /**
    *  UD-VIEW-MODEL Interface
    */
    // Intialise a connector
    initialise( saveableId)  // can find dataholder with ud_bind
    {
        // Check editors
        this.paramEditor = this.ude.modules['div.linetext'].instance;
        this.dataEditor = this.ude.modules['div.table'].instance;
        // Get element pointers
        let element = this.dom.element( saveableId);
        //let containerElement = element.parentNode; 
        //let nextSibling = element.nextSibling;        
        let children = element.childNodes;
        // Get element's type
        // let type = this.dom.attr( element, 'ud_type');
        let subType = this.dom.attr( element, 'ud_subtype');
        // Get element's style
        let classList = element.classList;
        let style = "";
        for (let i=0; i < classList.length; i++)
            if ( classList.item( i) != "table" && style == "") style = classList.item( i);
        // Get data according to MIME  
        let json = null;
        let bind = null;        
        let mimeType = element.getAttribute( 'ud_mime'); 
        if ( !mimeType) mimeType = "text/json";        
        switch ( mimeType)
        {
            case "text/json" :
                if ( children.length) {
                    json = JSONparse( children[0].textContent);
                    bind = children[0].id;
                }    
                if ( !json) {
                    let suggestedName = element.textContent;
                    if ( !suggestedName) suggestedName = "Connector_"+element.id; 
                    // Delete all children
                    this.dom.emptyElement( element);
                    // Add new object to element
                    let newElement = element.appendChild( this.newConnectorObject( suggestedName));
                    bind = newElement.id;
                    json = JSONparse( newElement.textContent);
                }
                // else if json.meta.name != children[0].id.replace( "_object", ""); debug won't bind
                break;
            case "text/mixed" :
            case "text/text" :  //(or csv) 
            case "text/html" :
                break;
        }
        // Build edit zone and append to element
        let name = "";
        if (json) {
            // JSON100 format
            // 2DO add element's styles to JSON Not not here in changeClass or udjson.getElement()
            name = json.meta.name;
            let editZone = this.dom.element( name + this.editZoneSuffix);            
            if ( !editZone) {
                let className = this.dom.keepPermanentClasses( element.className, true);
                editZone = this.dom.udjson.putElement( json, bind, "", className);
                element.appendChild( editZone);
            }
            // API.dom.linkBodyScroll( name);
            // 2DO Not needed done in udjson now
            /*
            let dataTable = this.dom.element( name);
            if ( dataTable) {
                let edTableHead = this.dom.element( 'thead', dataTable);
                let edTableBody = this.dom.element( 'tbody', dataTable);
                if ( edTableBody && edTableHead) {
                    this.dom.attr( edTableBody, 'onscroll', "this.previousSibling.scrollLeft = this.scrollLeft;");
                }
            }
            */ // end not needed            
        } else {
            // Old way 2DO delete when new approach in production      
            // Get Composite elements, initialising if necessary
            let compositeInfo = setupComposite( element, { "caption": element.textContent.substr( 0, 40), "parameters.textObject" : { _label:"parameters"}, "data.tableObject" : { _table:{_label:"data"}}});
            name = compositeInfo[ 'rootName'];
            // foreach compositeIno
            // Build div according to class 
            // Build invisible Parameter edit table and bind to Parameter div
            // 2DO if type siteextract load siteextract class and siteextract->buildparamZone
            let content = compositeInfo[ name+'_parameters.textObject'];
            let ezname = name+this.paramZoneSuffix;
            let attr = {
                id:ezname, class:'table hidden', ud_type: "editZone", ud_subtype: "json", ude_bind:name+'_parameters',
                ud_mime:"text/json", ude_autosave:"off", ude_stage:"off"
            };
            let edParamZone = this.dom.prepareToInsert( 'div', '', attr);
            content = this.paramEditor.JSONtoText( content);
            let edTable = this.paramEditor.convertTextToHTMLtable( content, name+'_parameters_', style);
            edParamZone.appendChild( edTable);
            let pname = name+'handler';
            let edHandle = this.dom.prepareToInsert( 'p', '...', {id:pname});
            edParamZone.appendChild( edHandle);
            element.appendChild( edParamZone);
            // Build visible Data table and bind to Data div
            content = compositeInfo[ name+'_data.tableObject'];
            if ( content) try { content = JSON.parse( content);} catch( e) { content = null;}
            ezname = name+this.dataZoneSuffix;
            attr = { 
                id:ezname, class:'table', ud_type: "editZone", ud_subtype: "html", ude_bind:name+'_data',
                ud_mime:"text/json", ude_autosave:"off", ude_stage:"off"
            };
            let edDataZone = null;
            if ( content) {
                if ( typeof content.meta != "undefined") edDataZone = this.dom.udjson.putElement( content, name+'_data');
                else { 
                    edDataZone = this.dom.prepareToInsert( 'div', '', attr);
                    edTable = this.dataEditor.convertJSONtoHTMLtable( content, name+'_data_', style);
                    edDataZone.appendChild( edTable);                    
                }
                edTable = this.dom.element( 'table', edDataZone);
                let edTableHead = this.dom.element( 'thead', edTable);
                let edTableBody = this.dom.element( 'tbody', edTable);
                if ( edTableBody && edTableHead)
                    this.dom.attr( edTableBody, 'onscroll', "this.previousSibling.scrollLeft = this.scrollLeft;");                
            } else {
                edDataZone = this.dom.prepareToInsert( 'div', '', attr);            
                edDataZone.textContent = "No data yet. Please configure first";
                edDataZone.classList.add( 'hidden');
                edParamZone.classList.remove( 'hidden');            
            }
            pname = name+'handler';
            edHandle = this.dom.prepareToInsert( 'p', '...', {id:pname});
            edDataZone.appendChild( edHandle);
            element.appendChild( edDataZone); 
            let captionEl = element.getElementsByTagName( 'span')[ 0];
            let buttonsBefore = captionEl.nextSibling;
            // Build Configure command to switch between parameters and editor
            //let switchEditZones = "API.showNextInList( ['"+edDataZone.id+"', '"+edParamZone.id+"']);";
            let switchEditZones = "API.configureElement( '"+name+"');"
            let anchor = this.dom.prepareToInsert( 'a', "Configure", { href:"javascript:", onclick:switchEditZones});
            let button = this.dom.prepareToInsert( 'span', " ", { class:"rightButton"});
            button.appendChild( anchor);
            element.insertBefore( button, buttonsBefore);
            /* not needed
            // Refresh button
            let action = "API.connectorRefresh( '"+name+"');"
            anchor = this.dom.prepareToInsert( 'a', "Refresh", { href:"javascript:", onclick:action});
            button = this.dom.prepareToInsert( 'span', " ", { class:"rightButton"});
            button.appendChild( anchor);
            element.insertBefore( button, buttonsBefore);
             // Update button
            action = "API.connectorUpdateServer( '"+name+"');"
            anchor = this.dom.prepareToInsert( 'a', "Update server", { href:"javascript:", onclick:refreshAction});
            button = this.dom.prepareToInsert( 'span', " ", { class:"rightButton"});
            button.appendChild( anchor);
            element.insertBefore( button, buttonsBefore);
            */
        }
        if ( subType == "site") {     
            let attr = { id:name+"_config", class:'configurator', ud_type: "configZone", ude_bind:name+'_parameters', ude_edit:"off"};
            let configZone = this.dom.prepareToInsert( 'div', '', attr);
            element.appendChild( configZone);
            let requiredByApp = this.dom.element( 'UD_requiredModules').textContent;
            if ( typeof process != "object" && requiredByApp.indexOf( 'udcsiteextract') == -1) {
                API.loadScript( "modules/connectors/udcsiteextract.js", "let me = window.ud.ude.modules[ 'div.connector'].instance; me.siteExtract = new UDC_siteExtract( me);", "UDC_siteExtract", "div.connector.site");
            }
        }
        
        return true;
    } // UDEconnector.initialise()

   /**
    * Build a new Connector object
    * @param {string} suggestedName Suggested name for object
    * @return {string} JSON object
    */    
    newConnectorObject( suggestedName) {
        // Name
        let name = suggestedName.replace(/ /g, '_').replace(/'/g,'_').replace(/"/g, '');
        let objectName = name + "_object";
        // Data
        // 2DO get config from defaultConfig
        // 2DO use a button parameter in meta and a special tag "button"
        let objectData = { 
            meta:{ type:"connector", name:name, zone:name+"editZone", caption:suggestedName, captionPosition:"top"}, 
            data:{ 
                button1:{ tag:"span", class:"rightButton", value:{ tag:"a", ui:"yes", href:"javascript:", onclick:"API.showNextInList( ['"+name+"_dataeditZone', '"+name+"_parameters_editZone']);", value:"configurer"}},
                button2:{ tag:"span", class:"rightButton", value:{ tag:"a", ui:"yes", href:"javascript:", onclick:"API.connectorRefresh( '"+name+"');", value:"refresh"}}, 
                button3:{ tag:"span", class:"rightButton", value:{ tag:"a", ui:"yes", href:"javascript:", onclick:"API.connectorUpdateServer( '"+name+"');", value:"update server"}},
                config:{ tag:"div", type:"text", name:name+"_parameters_editZone", value: { tag:"textedit", name:name+"_parameter", class:"textContent", value:[ "json", 'ready = "no"']}},
                cache:{ tag:"div", type:"table", name:name+"_dataeditZone", class:"hidden", value:"Pas de données. Configurez le connecteur d'abord"},   
            },
            changes: []
        };
        // Create object div and append to element
        let objectAttributes = {id:objectName, class:"object connectorObject, hidden", ud_mime:"text/json"};
        let object = this.dom.prepareToInsert( 'div', JSON.stringify( objectData), objectAttributes);
        this.dom.attr( object, 'ud_mime', "text/json"); 
        return object;
    } // UDElist.newConnectorObject()

   
    // Update binded saveable element with table's content
    prepareToSave( editorZone, dataHolder)
    {
        let saveable = dataHolder.parentNode;        
        // Process according to MIME type
        let mime = this.dom.attr( saveable, "ud_mime");        
        // if text/text force json  
        if ( mime = "text/mixed") {
            // Transform to JSON
            // Setup data holder

            /*
{"meta":{"name":"connector_1","zone":"connector_1editZone","class":"editzone","type":"text","captionPosition":"top","caption":"connector_1"},"data":{"tag":"textedit","class":"dataset","value":["","SOm"],"mime":"","cache":{"value":{"1":{"tag":"table","class":"dataset","value":{"tag":"jsontable","name":"","class":"dataset","value":[{"OID":"","value":"","text":"","HTML":""},{"OID":"UniversalDocElement--21-1-21-341-21-2075","value":"","text":"{\"meta\":{\"name\":\"USP\",\"zone\":\"USPeditZone\",\"class\":\"list\",\"type\":\"list\",\"caption\":\"Les bénéfices potentielles qui peuvent en tirer les entreprise en utilisant SD-Bee sont :     \",\"captionPosition\":\"top\"},\"data\":{\"tag\":\"ul\",\"name\":\"USP\",\"class\":\"list\",\"value\":{\"0\":{\"tag\":\"li\",\"value\":\"de simplifier de nombreuses tâches quotidiennes réalisées dans les entreprises et gagner du temps\"},\"1\":{\"tag\":\"li\",\"value\":\"d'accélérer la digitalisation en épousant au plus près les besoins de chaque métier\"},\"2\":{\"tag\":\"li\",\"value\":\"d'ouvrir une transition maîtrisée vers l'assistance par des robots et l'automatisation\"},\"3\":{\"tag\":\"li\",\"value\":\"de garder le libre choix en matière de stockage des données\"},\"5\":{\"tag\":\"li\",\"value\":\"de réduire les coûts en utilisant le potentiel des navigateurs web, leurs extensions Open Source et les outils déjà en place\"}}},\"changes\":{}}","HTML":""},{"OID":"...","value":[{"tag":"br","value":""}],"text":"...","HTML":""}]}},"2":{"tag":"p","name":"connector_1handler","value":"..."}}}},"changes":{}}
            */
            //mime = "text/json";
        } 
        switch ( mime)
        {
            case "text/json" :
                // Detect change in object's name and update other elements as required
                API.dispatchNameChange( saveable);   
                if ( dataHolder.id.indexOf( '_object') == -1) { editorZone = editorZone.parentNode;}
                if ( !editorZone) return debug( { level:1, return:false}, "Invalid connector");
                // if ( editorZone.id.indexOf( 'dataeditZone') > -1) { return false;}
                let jsonAPI = API.json;
                let edZoneContents = jsonAPI.getElement( editorZone, true);
                if ( dataHolder.id.indexOf( '_object') > -1) {                    
                    let json = jsonAPI.parse( dataHolder.textContent);
                    let path = "data";
                    if ( editorZone.id.indexOf( this.paramZoneSuffix) > -1) { path += "/config/value";}
                    else if ( editorZone.id.indexOf( this.dataZoneSuffix) > -1) { path += "/cache/value";}
                    // Change appropriate value in object
                    json = jsonAPI.valueByPath( json, path, edZoneContents.data);
                    // Detect name change & update meta if required
                    let oldName = jsonAPI.value( json.meta, 'name');
                    let newName = this.dom.attr( saveable, 'name');
                    if ( oldName != newName) {
                        jsonAPI.value( json.meta, 'name', newName);
                        jsonAPI.value( json.meta, 'zone', [ oldName, newName], 'replace');
                        jsonAPI.value( json.meta, 'caption', [ oldName, newName], 'replace');
                        let captionElement = this.dom.element( 'span.caption', editorZone);
                        if ( captionElement) {
                            captionElement.textContent = captionElement.textContent.replace( oldName, newName);
                        }
                    }
                    dataHolder.textContent = JSON.stringify( json);
                }
                else { dataHolder.textContent = JSON.stringify( edZoneContents);}
                break;            
            case "text/mixed" :
                this.paramEditor.prepareToSave( editorZone, dataHolder);
                break;
        }
        return true;
    } // UDEconnector.prepareToSave()
    
   /*
    * API
    */
    then( context) {
        let connector = this;
        let name = context.connectorName;
        let cache = this.connectorCache( name);
        let data = {};
        let editZone = null;
        if ( cache.id.indexOf( '_object') > -1) { 
            data = this.dom.udjson.valueByPath( cache.textContent, "data/cache");
            editZone = this.dom.element( name+this.dataZoneSuffix);
        } else { 
            let dataZone = this.dom.element( name + "_data");
            data = JSONparse( dataZone.textContent);
            let edDataTable = connector.dom.element( connector.connectorDataTable( name));
            editZone = this.dom.element( name+this.dataZoneSuffix);
        }
        if ( !editZone) { editZone = this.dom.element( name+this.editZoneSuffix);}
        if ( !editZone) {
            return debug( {level:1, return:false}, "Can't find edit zone for connector ", name);
        }
        
        /*
        let className = "dataset";
        if ( edDataTable) className = edDataTable.className;
        */
        let edTable = this.dom.udjson.putElement( data, name+'_data');        
        editZone.innerHTML = edTable.innerHTML; 
        // Link horizontal scroll
        edTable = this.dom.element( 'table', editZone) ; // !!! Important need live table 
        API.updateTable( edTable.id);        
        let edTableHead = this.dom.element( 'thead', edTable);
        let edTableBody = this.dom.element( 'tbody', edTable);
        if ( edTableBody && edTableHead)
            this.dom.attr( edTableBody, 'onscroll', "this.previousSibling.scrollLeft = this.scrollLeft;");                        
        if ( context.thenDo) eval( context.thenDo);    
        if ( context.change) this.ud.viewEvent( 'change', this.connectorSaveable( name)); // dataZone.parentNode);
    }

   /**
    * Read a parameter in a connector
    * @api {JS} API.connectorGet() Set a single connector's parameter
    * @apiParam {string} connectorName Connector's name
    * @apiParam {string} param Parameter's name
    * @apiSuccess {mixed} return Value that has been set
    * @apiFailure {string} return ""
    */
    connectorGet( connectorName, param) {
        // Find connector's paramaters
        let params = this.connectorParameters( connectorName); // this.dom.element( connectorName+"_parameters");
        return API.dom.udjson.valueByPath( params, param);
    } // UDEconnector.connectorGet()    
    
   /**
    * Set a parameter in a connector
    * @api {JS} API.connectorSet() Set a single connector's parameter
    * @apiParam {string} connectorName Connector's name
    * @apiParam {string} param Parameter's name
    * @apiParam {mixed} value Parameter's value to set
    * @apiSuccess {mixed} return Value that has been set
    * @apiFailure {null} return Null
    */
    connectorSet( connectorName, param, value, op = "") {
        // Find connector's paramaters
        let params = this.connectorParameters( connectorName); // this.dom.element( connectorName+"_parameters");
        if ( !params) return null;
        // Modify as requested and update in DOM
        params = API.udjson.valueByPath( params, param, value, op);
        this.connectorParameters( connectorName, params); //connectorParams.textContent = JSON.stringify( params);
        // Update
        let connector = this.dom.element( "[name='"+connectorName+"']", "document"); // getSaveableParent( connectorParams);
        this.ude.textEd.inputEvent( { event:"update", editZoneId:connectorName+'_parameters_editZone'}, connector);        
        this.ud.viewEvent( "change", connector);
        // Update edition
        let paramEditZone = this.dom.element( connectorName+'_parameters_editZone');
        let paramEditContent = this.paramEditor.JSONtoText( params);
        let paramEditTable = this.paramEditor.convertTextToHTMLtable( paramEditContent, connectorName+'_parameters_', "textContent");
        paramEditZone.innerHTML = paramEditTable.outerHTML;
        return value;
    } // UDEconnector.connectorSet()
    
   /**
    * Refresh a connector's data from server
    * @api {JS} API.connectorSet() Set a single connector's parameter
    * @apiParam {string} connectorName Connector's name
    * @apiParam {string} param Parameter's name
    * @apiParam {mixed} value Parameter's value to set
    * @apiSuccess {mixed} return Value that has been set
    * @apiFailure {null} return Null
    */
    connectorRefresh( connectorName, thenDo, serverParams={}) {
        let connector = this.connectorSaveable( connectorName);
        let params = this.connectorParameters( connectorName); // this.dom.element( connectorName+"_parameters");
        let cacheHolder = this.connectorCache( connectorName); // this.dom.element( connectorName+"_data");
        if ( !connector || !params || !cacheHolder) return null;
        // Prepare server request
        if ( !params || params.ready != "yes") return null;
        let service = params.service;
        if ( !service) return null;
        // Pseudo services, do'nt use server
        if ( service == "_clearCache_") {
            API.json.valueByPath( cacheHolder.id, "data/cache", {});
           this.ud.viewEvent( "change", connector);
            API.pageBanner ( 'temp', "Reload page to update connector");
            return null;
        }
        let oid = this.dom.attr( connector, 'ud_oid')+"--UD|1";
        let uri = "/"+service+"/"+oid+"/";
        let action = this.dom.udjson.value( params, 'action');
        if ( action) uri += action+"/"; else uri += '/';
        let context = { action: "set json", holder: connectorName+"_object", jsonPath: "data/cache", connector:this, connectorName:connectorName, ud:this.ud, thenDo:thenDo, change:true};        
        for ( let serverParam in serverParams) { 
            uri += serverParam + '|' + serverParams[ serverParam] + '/';
            context[ serverParam] = serverParams[ serverParam];
        }
        
        if ( cacheHolder.id.indexOf( '_object') == -1) { 
            context = { zone: cacheHolder.id, action: "fill zone", connector:this, connectorName:connectorName, ud:this.ud, thenDo:thenDo};
        }
       // and promise
       /*
       let promise = new Promise((UDconnector_promiseSuccess)=> {
            context.promise = this;
            window.ud.udajax.serverRequest( uri, "GET", "", context);
       });
       promise.then((value) => {
           console.log( "then", value);
       }); 
       */
       /*
        let thenFct = this.then.bind( this);
        let promise = new Promise( (resolve, reject) => {        
            console.log( "Promise udeconnector", thenFct);            
        });
        promise.then( (context) => {
           console.log( "then udeconnector", context);
           this.then( context);
        });*/
        this.catch = function(context) { console.error( "Can't refresh connector (catch)");};
        context.promise = this;        
        window.ud.udajax.serverRequest( uri, "GET", "", context);
        /* Idea 2225002
            let promise = window.ud.udajax.serverRequest( uri, "GET", "", context);
            // Attach next action to promise created by udajax.serverRequest
            promise.then( this.then.bind(this));
        
        */

    } // UDEconnector.connectorRefresh()

   /**
    * Update server with changes to connector's data
    * @api {JS} API.connectorSet() Set a single connector's parameter
    * @apiParam {string} connectorName Connector's name
    * @apiParam {string} param Parameter's name
    * @apiParam {mixed} value Parameter's value to set
    * @apiSuccess {mixed} return Value that has been set
    * @apiFailure {null} return Null
    */
    connectorUpdateServer( connectorName, thenDo=null) {
        let connector = this.connectorSaveable( connectorName);
        let params = this.connectorParameters( connectorName); // this.dom.element( connectorName+"_parameters");
        let cacheHolder = this.connectorCache( connectorName); // this.dom.element( connectorName+"_data");
        let dataTable = this.dom.element( connectorName);
        if ( !connector || !params || !cacheHolder || !dataTable) return null;
        let service = params.service;
        if ( !service) return null;        
        // Prepare server requests
        let oid = this.dom.attr( connector, 'ud_oid')+"--UD|1";;
        let uri = "/"+service+"/"+oid+"/";
        let action = this.dom.udjson.value( params, 'action');
        if ( action) { uri += action+"/";}        
        let context = { zone: cacheHolder.id, action: "ignore", connector:this, connectorName:connectorName, ud:this.ud, thenDo:thenDo};       
        let lines = this.dataEditor.findRows( dataTable.id, "id:0");
        // Only 1 line really ?        
        if ( service == "csvfile") {
            // Mode CSV
            lines = this.dataEditor.findRows( dataTable.id, ".*");
            let postData = "";
            /*
                postData += "lines="+encodeURIComponent(JSON.stringify( lines));
            */
            for ( let linei = 0; linei < lines.length; linei++) {
                let line = this.dataEditor.getRow( dataTable.id, lines[ linei], false);
                let lineStr = "";
                if ( line.action == "ignore") continue;                
                for ( let fieldName in line) {
                    if ( fieldName == "action" || fieldName == "id" || fieldName == "oid") { continue;}
                    let value = line[ fieldName];
                    if ( isNaN( value) && this.ude.calc.datestr( value, UD_dateFormats).indexOf('ERR') > -1) {
                        value = value.replace( /"/g, '').replace( /'/g, '');
                        lineStr += '"'+encodeURIComponent( value)+'",';
                    } else {
                        lineStr += encodeURIComponent( line[ fieldName])+",";
                    }
                }
                postData += "line"+linei+"="+lineStr.substring( 0, lineStr.length-1)+"&";
            }
            postData = postData.substring( 0, postData.length-1);
            if (postData) window.ud.udajax.serverRequest( uri, "POST", postData, context);            
        } else if ( action == "ALAX_data") {
            let formName = "TestLog"; // Need to get this from params and build OID with it
            let newOID = "LogEntry--22-5-22-0";  
            let table = this.dom.element( connectorName);
            let tableBody = this.dom.element( 'tbody', table);
            if ( !tableBody) { return;}
            let logOid = this.dom.attr( tableBody.rows[0].cells[0], 'ude_datasrc');
            newOID = logOid.split( '--')[1].split( '-')
            newOID.splice( -1, 1, "0");
            newOID = logOid.split( '--')[0].split( '-')[0]+"--"+newOID.join('-');
            for ( let linei = 0; linei < lines.length; linei++) {
                let postData = "form="+formName+"&input_oid="+newOID;
                let line = this.dataEditor.getRow( dataTable.id, lines[ linei]);
                for ( let fieldName in line) {
                    if ( fieldName == "id") { continue;}
                    postData += "&" + fieldName + "=" + line[ fieldName];
                }
                // 2DO use serviceRequest or own callback to process feedback
                window.ud.udajax.serverRequest( uri, "POST", postData, context);            
            }
        } else {
            // Just update connector, server will lauch update routine on connector
            this.ude.setChanged( connector, true);
        }
/*       // and promise
       let promise = new Promise((UDconnector_promiseSuccess)=> {
            context.promise = this;
            window.ud.udajax.serverRequest( uri, "PUT", postData, context);
       });
       promise.then((value) => {
           console.log( "then", value);
       });   
*/
    } // UDEconnector.updateServer()
    
   /**
    * Append a line to data table & update server if flag
    * @api {JS} API.connectorAppend() Append a line to data table and save
    * @apiParam {string} connectorName Connector's name
    * @apiSuccess {mixed} return Value that has been set
    * @apiFailure {null} return Null means not ready
    */    
    connectorAppend( connectorName, line, save = false) {
        let connector = this.connectorSaveable( connectorName);
        let params = this.connectorParameters( connectorName);
        let cacheHolder = this.connectorCache( connectorName);                         
        let dataTable = this.dom.element( connectorName);
        // Check editors
        this.dataEditor = this.ude.modules['div.table'].instance;
        if ( !connector || !params || !cacheHolder || !dataTable) return null;
        // Check fields in line correspond 
        let cols = this.dataEditor.tableColumns( connectorName);
        let safeLine = {};
        for ( let col in line) {
            if ( cols.indexOf( col) > -1) { safeLine[ col] = line[ col];}
        }
        if ( safeLine != {}) {
            safeLine[ 'id'] = 0;
            this.dataEditor.insertRow( connectorName, 100000, safeLine);
            this.connectorUpdateServer( connectorName, null);
        }
        return true;
    } // UDEconnector.connectorAppend()
 
    
   /**
    * Get the data table of a connector
    * @api {JS} API.connectorSet() Set a single connector's parameter
    * @apiParam {string} connectorName Connector's name
    * @apiSuccess {mixed} return Value that has been set
    * @apiFailure {null} return Null means not ready
    */    
    connectorDataTable( connectorName) {
        if ( this.dom.element( connectorName)) return connectorName;
        else return connectorName+"_data_edittable"; 
    }
    
   /**
    * Get the saveable element conaing the connector
    * @api {JS} API.connectorSet() Set a single connector's parameter
    * @apiParam {string} connectorName Connector's name
    * @apiSuccess {mixed} return Value that has been set
    * @apiFailure {null} return Null means not ready
    */    
    connectorSaveable( connectorName) {
        let connectorObject = this.dom.element( connectorName + "_object");
        // Read parameters
        if ( !connectorObject) { connectorObject = this.dom.element( connectorName+"_parameters");}
        if ( !connectorObject) return null;
        return connectorObject.parentNode;
    } // UDEconnector.connectorSaveable()
    

   /**
    * Get connector's paramaters
    * @api {JS} API.connectorParameters() Set a single connector's parameter
    * @apiParam {string} connectorName Connector's name
    * @apiSuccess {object} return Paramater object
    * @apiFailure {null} return Null means not ready
    */    
    connectorParameters( connectorName, params = null) {
        let connectorObject = this.dom.element( connectorName + "_object");
        if ( !params) {
            // Read parameters
            if ( connectorObject) {
                // 100% JSON mode
                params = this.dom.udjson.valueByPath( connectorObject.textContent, "data/config/value/value");
            } else  if ( ( connectorObject = this.dom.element( connectorName+"_parameters"))) {
                // Composite mode
                let paramsJSON = connectorObject.textContent;
                params = this.dom.udjson.parse( paramsJSON);
            }
        } else {
            // Write parameters
           if ( connectorObject) {
                // 100% JSON mode
                connectorObject.textContent = this.dom.udjson.valueByPath( connectorObject.textContent, "data/config/value/value", params);
            } else  if ( ( connectorObject = this.dom.element( connectorName+"_parameters"))) {
                // Composite mode
                let paramsJSON = JSON.stringify( params);
                connectorObject.textContent = paramsJSON;
            }
        }
        return params;
    } // UDEconnector.connectorParameters()

   /**
    * Get connector's paramaters
    * @api {JS} API.connectorParameters() Set a single connector's parameter
    * @apiParam {string} connectorName Connector's name
    * @apiSuccess {object} return Paramater object
    * @apiFailure {null} return Null means not ready
    */    
    connectorCache( connectorName, cacheData = null) {
        let connectorObject = this.dom.element( connectorName + "_object");
        let cache = null;
        // Read cache
        if ( connectorObject) {
            // 100% JSON mode
            cache = connectorObject; //.textContent, "cache");
        } else  {
            cache = this.dom.element( connectorName+"_data");
            /*
            // Composite mode
            let cacheJSON = connectorObject.textContent;
            cache = this.dom.udjson.parse( cacheJSON);
            */
        }
        if ( cache && cacheData) {
            // Write parameters
           if ( cache.id.indexOf( "_object") > -1) {
                // 100% JSON mode
                connectorObject.textContent = this.dom.udjson.valueByPath( connectorObject.textContent, "data/cache", cacheData);
            } else  if ( ( connectorObject = this.dom.element( connectorName+"_data"))) {
                // Composite mode
                let cacheJSON = JSON.stringify( cacheData);
                connectorObject.textContent = cacheJSON;
            }
        }
        return cache;
    } // UDEconnector.connectorParameters()
        
 } // JS UDEconnector class
 
 
 // Functions
  /**
  * Setup and return caption and data from a composite element
  * Initialise with default data if necessary
  *
  * @param element pointer to DOM element
  * @param defaultCaption string value to use to setup caption
  * @param defaultData object set of dataKey:text where dataKey is name.class
  * @param defaultNameSuffix array of string 
  * @return object caption data : set of class: text
  *
  */
 function setupComposite( element, defaults)
 {
    
    let children = element.childNodes;
    let data = {};
    // Build an oject with existing data
    for ( let childi=0; childi < children.length; childi++)
    {
        let child = children[ childi];
        if ( child.nodeType == 1)
        {
            if ( child.tagName.toLowerCase() == "span" && child.classList.contains( 'caption'))
            {
                data[ 'caption'] = child.textContent.substr( 0, 40);
                data[ 'rootName'] = data[ 'caption'].replace(/ /g, '_').replace(/'/g,'_').replace(/"/g, '');
            }    
            else if ( child.tagName.toLowerCase() == "div") data[ child.id + '.'+child.classList.item(0)] = child.textContent;
        }
    }
    let caption = data['caption'];
    if ( !caption)
    {
        // Not a composite element yet so setup
        let caption = "";
        if ( defaults) caption = defaults[ 'caption'];
        else caption = element.textContent.substr( 0, 40);
        let name = caption.replace(/ /g, '_').replace(/'/g,'_').replace(/"/g, '');  
        data[ 'rootName'] = name;        
        // Remove children
        let removeNodes = element.childNodes;
        for ( let removei=0; removei < removeNodes.length; removei++) element.removeChild( removeNodes[ removei]);        
        // Set up elements from defaults
        for ( let dataKey in defaults)
        {
            let newElement = null;
            if ( dataKey == "caption")
            {
                // Add Caption
                newElement = API.dom.prepareToInsert( 'span', caption, {class:'caption'});
                newElement = element.appendChild( newElement); 
                data['caption'] = caption;
            }
            else if  ( dataKey == "save")
            {
                // Add Save button            
                let action = "new UDapiRequest('UDtext', 'setChanged(/"+name+"editZone/, 1);', event);";
                newElement = API.dom.prepareToInsert( 'input', "", { type:"button", value:"save", onclick:action, udapi_quotes:"//"})
                newElement = element.appendChild( newElement);
            }
            else
            {
                // Add a Data div
                data[ name + dataKey] = defaults[ dataKey];            
                let w = dataKey.split( '.');
                let divName = name + '_' + w[1];
                let dataClass = w[1];
                newElement = API.dom.prepareToInsert( 'div', data, {id:divName, class:dataClass+",hidden"});
                newElement = element.appendChild( newElement);
            }
        }
    }
    /*
    else
    {
        let name = caption.replace(/ /g, '_').replace(/'/g,'_').replace(/"/g, '');  
        data[ 'rootName'] = name;        
    }
    */
    return data;
 }  //  setupComposite()
 
 function UDconnector_promiseSuccess( context) {
    // Check editors
    this.dataEditor = this.ude.modules['div.table'].instance;
    let connector = context.connector;
    let name = context.connectorName;
    let dataZone = connector.dom.element( name+"_data");
    let edDataTable = connector.dom.element( connector.DataTable( name));
    edTable = connector.dataEditor.convertJSONtoHTMLtable( dataZone.textContent, name+'_data_', style);
    edDataTable.innerHTML = edTable.innerHTML; 
    if ( context.thenDo) eval( context.thenDo);    
 }
 
function UDEconnector_init() {
    // Initialise module
    let udc = new UDEconnector( window.ud);
    window.ud.ude.modules['div.connector'].instance = udc;
    window.ud.ude.modules['div.connector'].state = "loaded";
}

if ( typeof process != 'object' && window.ud && !window.ud.ude.modules['div.connector'].instance) {
    UDEconnector_init();
}
 
if ( typeof process == 'object') {
    // Testing under node.js
    module.exports = { class: UDEconnector, init:UDEconnector_init};
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined" && typeof ModuleUnderTest == "undefined") {
        console.log( 'Syntax:OK'); 
        console.log( 'Start of test program');
        let envMod = require( '../../tests/testenv.js');
        envMod.load();
        ud = new UniversalDoc( 'document', true, 133);
        // Initialise
        let udc = new UDEconnector( ud);
        window.ud.ude.modules['div.connector'].instance = udc;
        window.ud.ude.modules['div.connector'].state = "loaded";
        {
            // Add UDEconnector
            let test = "connector : ";
            let name = "myConnector";
            let data = {
                meta:{ type:"connector", subType:"site", name:name, zone:name+"editZone", caption:test, captionPosition:"top"}, 
            data:{ 
                button:{ tag:"span", class:"rightButton", value:{ tag:"a", href:"javascript:", onclick:"API.showNextInList( ['"+name+"_dataeditZone', '"+name+"_parametereditZone']);", value:"configurer"}},
                config:{ tag:"div", type:"text", name:name+'_paramater_editZone', value: { tag:"textedit", name:name+"_parameter", class:"textContent", value:[ "json", "ready = no", 'param1 = "abc,def,ghi"']}}
            },
            cache:{ tag:"div", name:name+"_dataeditZone", class:"warning hidden", value:"Pas de données. Configurez le connecteur d'abord"},            
            changes: []  
            }
            let object = API.dom.prepareToInsert( 'div', JSON.stringify( data),{id:name+"_object", class:"object connectorObject hidden"});
            let attr = { 
                id:"B0100055555000000M", name:name, class:"connector", ud_type:"connector", 
                ud_subtype:"site", ud_mime:"text/json"
            };
            let connector = API.dom.prepareToInsert( 'div', "", attr);
            connector.appendChild( object);
            let part = API.dom.element( "div.part[name='myView']", API.dom.element( 'document'));
            part.appendChild( connector);
            API.initialiseElement( connector.id);
            // dumpElement( connector);
            if ( connector.textContent.indexOf( "def")) console.log( test+"OK"); else console.log( test+"KO");
        }        
        // Test with server delays
        // let udc = ud.ude.modules[ 'div.connector'].instance;
        udc.testNo = 2;
        if ( !udc.siteExtract && typeof udc.ude.modules[ 'modules/connectors/udcsiteextract.js'] != "undefined") {
             udc.siteExtract = udc.ude.modules[ 'modules/connectors/udcsiteextract.js'].instance;
        }
        function nextTest( udc)
        {
            switch ( udc.testNo)
            {
                case 2 : // Wait for siteExtract module
                case 3 :
                case 4 :
                case 5 :
                case 6 :
                case 7 :
                    let siteExtract = udc.siteExtract; // this.ude.modules[ 'modules/connectors/udcsiteextract.js'].instance;
                    if ( siteExtract) udc.testNo = 7; 
                    break;
                case 8 : // Configure
                    let connector = API.dom.element( "div.connector[name='myConnector']", API.dom.element( 'document'));
                    udc.ude.dispatchEvent( {event:"configure"}, connector);
                    // dumpElement( connector);
                    break;
                case 9 :
                   console.log( "Program's trace checksum: "+debug ("__CHECKSUM__"));
                   console.log( "Test completed");
                   process.exit();
                   break;                
            }
            // Get HTML of Capteur_1_Bâtiment_AviewZone
            udc.testNo++;
        } // nextTest()
        
        // GET & POST test
        nextTest( udc);
        setInterval( function() { nextTest( udc);}, 5000);
           
    }        
} // End of test routine
