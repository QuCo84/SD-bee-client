/** 
 *  UD API class UDapi - commands accessible via externalExchange DOM element.
 */
class UDapiSet1
{
    // Parameters
    // Modules
    moduleName = "apiset1.js";
    ud = null;
    dom = null;
	udajax = null;
    ude = null;
    calc = null;
    udeTable = null;
    udeList = null;	
    udeDraw = null;
    utilities = null;
    /*
    terms  = {                          // Translated terms to use (2DO make dymanic, set by ud)
        "This screen": "Cet écran",
        "genericMobile": "Mobile en portrait",
        "genericTabletLandscape" : "Tablette en paysage",
        "INPUT_addApage" : "INPUT_ajouterUnePage",
        "INPUT_addAdir" : "INPUT_ajouterUnRepertoire",
        "INPUT_addAtemplate" : "INPUT_ajouterUnModèle",
        "list": "liste",
        "emphasized": "faire sortir",
        "quoted": "citation",
        "chapter" : "chapitre",
        "sub-section" : "sous-section",
        "graphic": "illustration",
        "Name is already used": "Le nom est déjà utilisé",
    }
    */
    terms = null;
    
    // setup UDapi
    constructor( udOrAPI)
    {
        if ( typeof API == "undefined") {
            // Just testing this set of methods
            this.ud = udOrAPI;
            if ( typeof this.ud.ude != "undefined") this.ude = this.ud.ude; else this.ude = ud;
            this.dom = this.ud.dom;
			this.udajax = this.ud.udajax;
            this.calc = this.ude.calc;
			this.udeTable = this.ude.modules[ "div.table"]["instance"];
		} else if ( udOrAPI == API) {
            // Called by API
            this.ud = API.ud;
            this.dom = API.dom;
            this.udajax = API.udajax;            
            this.utilities = API.utilities;
            API.addFunctions( this, [
                "addStyleRules", "addToHistory", "addTool", 
                "back", "botlogUpdate", "buildPartEditing",
                "clearTools",
                "initialiseElement", "insertElement", "insertHTML", "insertTable", 
                "loadDocument", "createDocument",  
                "loadModule", "loadTool", "postForm",       
                "reload", "reloadView", "removeElement",
                "setModel", "setStyle", "setSystemParameters", "setUDparam", "env",
                "translateTerm", "switchView", "configureElement", "HTMLeditor",
                "displayDocInPanel", "goTo", "getView", "showMenu", "clearMenu",
                "displayTip", "addTip", "hoverOver", "clickOn", "addView", "setupView",
                "createUser", "prepareUserCreation", "getOIDbyName", "checkAndWriteValue", "getRadioValue"
            ]);            
        }
       // if ( typeof process == 'object') global.API = this;            


    } // UDapi.construct()

    /* ---------------------------------------------------------------------------------------------------
     * API part 1 - included by udapi.js.
	 *
     * constructor and test code defined here for auto-testing methodes defined here.
     */

/* get  file_include start */     
   /**
    * @api {JS} API.addTool(divName,name,icon,call,help) Add a tool to a tool set
    * @apiParam {string} divName Id of tool set name where tool is to be added
    * @apiParam {string} name Tool's name
    * @apiParam {string} icon URL of tool's icon
    * @apiParam {string} call URL of web service or a JS file
    * @apiParam {string} help Rollover text (icon's title)
    * @apiGroup Tools and tool sets
    */    
    addTool( divName, name, icon, call, help="")
    {
        // Remove any icon of same name
        if ( this.dom.findElement( name+'-icon'))
        {
            var element = this.dom.findElement( name+'-icon');
            element.remove(); // element.parent.removeChild( elem);
        }  
        // Build tool's icon zone
        var div = document.createElement('div');
        var img = document.createElement('img');
        img.src = icon;
        var link = document.createElement('a');
        var txt = document.createTextNode(name);
        link.appendChild( img);
        link.appendChild( document.createElement( 'br'));
        link.appendChild( txt);
        // Rollover text
        link.title = name;
        if ( help) link.title = help;
        // Click
        link.href="javascript:";
        var onclick = "";
        var toolZone = divName.replace("-selector", "-zone");
        onclick += "window.ud.loadTool( this,'"+divName+"', '"+call+"','"+toolZone+"');";
        link.setAttribute( 'onclick', onclick);
        // Add linked image to icon zone
        div.appendChild( link);
        div.setAttribute( 'class', 'tool-icon');
        div.setAttribute( 'id', name+'-icon');
        // Add to tool selector
        document.getElementById( divName).appendChild( div);
        // Quick fix : how to make class names independant of displayed label 
        let clName = name;
        if ( name.toLowerCase() == "tagger") clName = "Inserter";
        // Load module
        if ( call.indexOf( '.js') > -1)
        {
            // Tool is a JS module to load
            if ( !this.unitTesting)
                this.ude.loadScript( 
                    'modules/'+call, 
                    "window.ud.ude.modules['modules/"+call+"']['instance'] = new "+clName+"( window.ud, '"+toolZone+"');"
                );
            else
            {
                let mod = require( "../modules/"+call);
                let newCl = mod.class;
                this.ude.modules["modules/"+call] = {};
                this.ude.modules["modules/"+call]['instance'] = new newCl( this, toolZone);                  
            }        
        }
        else
        {    
            // Tool is an AJAX sever - prepare 'load' call with result processing
            if ( !this.unitTesting)
            {
                // 2DO use UDAJAX
                var xhttp = new XMLHttpRequest();
                xhttp.element = div;
                xhttp.ud = this;
                xhttp.onreadystatechange = function() 
                {
                    if (this.readyState == 4 && this.status == 200)
                    {
                        var onload = getOnload( this.responseText);
                        debug({level:7}, onload);
                        doOnload( onload);
                        //console.log( this.responseText);
                    }  
                    // else if error  
                };
                // console.log( call);
                xhttp.open("GET", call+"/e|load/", true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send();
            }    
        }    
   } // UniversalDoc.addTool()
   
   /**
    * @api {JS} API.loadTool(clikcedElement,setDiv,call,zoneId) Load a tool's User Interface to a specified zone
    * @apiParam {HTMLelement} clickedElement Tool container div that has been clicked
    * @apiParam {string} setDiv Id of Tool set
    * @apiParam {string} call URL of web service or a JS file
    * @apiParam {string} zoneId Id of div to use for interface
    * @apiGroup Tools and tool sets    
    */    
    loadTool( clickedElement, setDiv, call, zoneId)
    {
        var div = document.getElementById( setDiv);
        for (var child in div.childNodes) 
        {
            console.log( typeof div.childNodes[child]);
            if ( typeof div.childNodes[child] == "object") div.childNodes[child].classList.remove('selected');
        }
        clickedElement.parentNode.classList.add('selected');
        let zone = document.getElementById( zoneId);
        zone.innerHTML = "";        
        if ( call.indexOf( '.js') > -1)
        {
            // Generate event on instance for JS tools
            var tool = this.ude.modules[ 'modules/' + call]['instance'];
            if ( tool) tool.event( 'open');
        }
        else
        {    
            // Use AJAX call to server to open tool
            call = call.replace( /{topOID}/g, this.dom.attr( this.topElement,'UD_oid'));
            if ( !this.unitTesting)
            {
                var server = new UDAJAX( this, ""); // full relative path provided by tools
                server.serverRequest( call+"/e|open/", "GET", "", {action:"fill zone", zone:zoneId});
            }
        }  
   }  // UniversalDoc.loadTool()
   
  /**
    * @api {JS} API.clearTools(setDivId,iconDivId) Clear all tools in a set and place empty icon
    * @apiParam {string} setDivId Id of div used for tool set
    * @apiParam {string} iconDivId Id of div with tool's icon
    * @apiGroup Tools and tool sets    
    */
    clearTools( setDivId, iconDivId)
    {
        let setDiv = document.getElementById( setDivId);
        let tools = setDiv.childNodes;
        let nbOfTools = tools.length;
        for ( let tooli=nbOfTools; tooli > 0; tooli--) tools[ tooli - 1].remove();
        let iconDiv = document.getElementById( iconDivId);
        let iconImg = iconDiv.getElementsByTagName( 'img')[0];
        iconImg.setAttribute( 'src', "/upload/N3u2U2g3W_emptyIcon50.png");
        return true;        
    }  // UniversalDoc.clearTools()  
   
   /**
    *  NAVIGATION
    */    
   /**
    * @api {JS} API.loadDocument(url) Load an UD
    * @apiParam {string} url The URL of the UD
    * @apiGroup Documents   
    */    
    loadDocument( url, tab="")
    {
        // 2DO take into account open docs in new tab (if tab = auto maybe)
        let newWindowCheckbox = API.dom.element( 'UD_openNewWindow');
        let newWindow = ( !newWindowCheckbox || newWindowCheckbox.value == "yes");
        // show AJAX_show has /
        if ( !newWindow && ( this.unitTesting || url.indexOf( 'AJAX_') > -1))
        {
            // Use AJAX
            let urlParts = url.split( '/'); // http(s):/ /domain/service/oid/action/params..//.
            let uriParts = urlParts.splice( 3, urlParts.length - 3);
            let uri = uriParts.join('/');           
            let context = { action: "refresh", element: this.topElement, zone:"document"};
            this.udajax.serverRequest( uri, "GET", "", context);
        }
        else if( newWindow && tab) {
            // Open window
            window.open( url, tab);
        } else { 
            // Change current page
            document.location = url;
        }            
        return true;
    } // UniversalDoc.loadDocument()
    
   /**
    * @api {JS} API.reload(useAJAX=true,env="") Reload the current UD
    * @apiParam {boolean} useAJAX Default TRue. Use AJAX request of true else change page's location
    * @apiParam {string} env Optional string for ENViromental variable settings
    * @apiGroup Documents  
    */
    reload( useAJAX = true, env = "") {
        let uri = this.ud.service+'/'+this.dom.attr( this.topElement, 'ud_oid')+'/'+this.refreshAction+'/';         
        if ( useAJAX)
        {
            // Just update document part   
            let context = { action:"refresh", element:this.topElement};
            if ( env) uri += env + '/';
            this.udajax.serverRequest( uri, "GET", "", context);            
        }
        else
        {
            // Reload complete HTML page
            // window.location = document.location.href;  
            location.reload( true);            
        }
        return true;
    } // UniversalDoc.reload()
    
   /**
    * @api {JS} API.reloadView(viewId) Reload a view
    * @apiParam {string} viewId Name of view
    * @apiGroup Documents  
    */
    reloadView( viewId) {
        let view = this.dom.element( viewId);
        if ( !view) return false;
        let viewOid = this.dom.attr( view, 'ud_oid');
        let viewContentsURI = viewOid+"-21/AJAX_show/";
        this.ud.udajax.updateZone( viewContentsURI, viewId);
        return true;
    }
    
   /**
    * @api {JS} API.addToHistory(url) Add to URL history
    * @apiDescription Add a new page to the history of loaded URLs (for single-page mode)
    * @apiParam {string} url The URL to add to history. By default the url of current UD   
    * @apiGroup Documents
    */
    addToHistory( url)
    {
        // Set a scurrent
        this.currentURL = url;
        // Add to history if a new URL
        let historyElement = this.dom.element( this.historyElementId);
        if ( !historyElement) return false;
        let history = historyElement.textContent.split(",");
        if ( history.indexOf( url) == -1) history.push( url);
        historyElement.textContent = history.join( ',');
        return true;        
    } // UniversalDoc.addToHistory()
    
   /**
    * @api {JS} API.back() Go back to previous page
    * @apiGroup Documents    
    */
    back()
    {
        let historyElement = this.dom.element( "UD_history");
        let history = historyElement.textContent.split(",");
        if (history.length > 2) {    
            let currentInHistory = history.indexOf( this.currentURL);
            if ( currentInHistory > 1) {    
                let previous = history[ currentInHistory - 1];
                this.loadDocument( previous);
            } else { this.loadDocument( "/webdesk/");}   
        } else { this.loadDocument( "/webdesk/");}  
        
    } // UniversalDoc.back()
    
   /**
    * @api {JS} API.insertElement(elementTag,data,attributes) Insert and save an HTML element at cursor position
    * @apiParam {string} elementTag Extended tag of element to insert
    * @apiParam {string} data Content (text, html, JSON) of element's content
    * @apiParam {object} attributes List of attribute/values of element
    * @apiParam {HTMLelement} at HTML element where to insert
    * @apiParam {boolean} insertAfter Insert after at if true, before if false
    * @apiParam {boolean} inside Insert inside at if true     
    * @apiGroup Elements
    */
    insertElement( elementTag, data, attributes={}, at = null, insertAfter = false, inside=false)
    {
        // Insert element into DOM 
        let newElement = null;
        if ( !at) newElement = this.dom.insertElementAtCursor( elementTag, data, attributes);
        else newElement = this.dom.insertElement( elementTag, data, attributes, at, insertAfter, inside);
        // Inform VIEW-MODEL of new element
        this.dataSource.viewEvent( "create", newElement);
        return newElement;
    } // API.insertElement()
    
   /*insertElement( type, data, attributes)
   {
     // 2DO if loading document set cursor first
     //this.dom.insertElementAtCursor( type, data, attributes);
     this.dom.insertElement_old( type, data, attributes);
   } // UniversalDoc.insertElement()*/

   /**
    * @api {JS} API.removeElement(elementId) Remove an HTML element
    * @apiParam {string} elementId ID of HTML element
    * @apiGroup Elements
    */
   removeElement( elementId) {
        let element = this.dom.element( elementId);
        if ( !element) return;
        let saveable = this.dom.getSaveableParent( element);
        if ( saveable == element) this.ud.viewEvent( 'delete', element);
        else if ( saveable) {
            let exTag = this.dom.attr( element, 'exTag');
            if ( [ 'span.styled'].indexOf( exTag) > -1) {
                // Integrate content into parent
                let parentContent = element.parentNode.innerHTML;
                element.parentNode.innerHTML = parentContent.replace( element.outerHTML, element.innerHTML);
            } else {
                // Remove element
                element.remove();
            }
            this.ud.viewEvent( 'change', saveable);
        }
   } // UniversalDoc.removeElement()
   
   /**
    * @api {JS} API.inertText(text,type="plain") Insert a text element at cursor position
    * @apiParam {string} text Text content
    * @apiParam {string} type MIME type of content, default plain 
    * @apiGroup Elements
    */
   insertText( text, type="plain")
   {
     this.ude.insertTextAtCursor( text, type);
   } // UniversalDoc.insertText()

   prepareHTML( html)
   {
     
   } // prepareHTML()
  
   // Tell server user working on this element
   reserveElement()
   {
   } // reserveElement()
   
   
   // Fetch elements
   fetch( nb)
   {
     return this.htmlContent;
   } // fetch()
   
   /**
    * @api {JS} API.insertTable(params,at) Insert a table
    * @apiParam {object} params List of key/values
    * @apiParam {HTMLelement} at insert after this element. If null tne after cursor.
    * @apiGroup Elements
    */
   insertTable( params, at)
   {
     //this.ude.setCursor( at);
     return this.ude.insertTableAtCursor( params);
   } // UniversalDocElement.insertTable()  
   
   /**
    * @api {JS} API.insertTable(id) Setup editing zone of an element
    * @apiParam {string} id Id of element to initialise
    * @apiGroup Elements
    */
    initialiseElement (id)
    {
        // Let editor prepare element for viewing and editing     
        this.ude.initialiseElement( id);
        return;
    }
   
    // Updata an HTML table composite element, id may point to table or a containing DIV
    updateTable( id)
    {
        let tableId = id;
        let element = this.dom.element( id);
        if ( !element) return false;
        // Get First table element in DIV
        if ( element.tagName == "DIV")
            tableId = element.getElementsByTagName( 'table')[0].id;
        // Call editor's table update method
        return this.ude.updateTable( tableId);
    } // UniversalDocElement.updateTable()  
 
   // Update an HTML graphic composite element
   updateGraphic( id)
   {
     return this.ude.updateGraphic( id);
   } // UniversalDocElement.updateGraphic()
        
   /**
    * @api {JS} API.insertHTML(html,at) Insert HTML
    * @apiParam {string} html HTML code to insert
    * @apiParam {mixed} at Id of element where to insert after or the HTML element itself
    * @apiGroup Elements
    */
   insertHTML( html, at)
   {
     API.dom.cursor.setAt( at);
     return this.ude.insertHTMLAtCursor( html);
   } // UniversalDocElement.insertAtCursor()  

   // Interpret inline instructions
   clientSideInterpretor ( instruction)
   {
      switch ( commande) {
        case "insert list" :
          break;
        case "insert table" :
          break;
        case "insert graphic" :
          break;
        case "insert chart" :
          break;
          
      }
   } // clientSideInterpretor()
   
   /**
    * @api {JS} API.setModel(modelName) Set current UD's model, update server (in nstyle field) and refresh page with waiting message
    * @apiParam {string} modelName Name of model
    * @apiGroup Documents    
    */
    // 2DO use ud.js version
    setModel( modelName) {  this.ud.setModel( modelName);}
    /*
        // Get action
        let action = "reload";
        let setCursor = false;
        // Get OID fore server request
        let oid = this.ud.topElement.getAttribute( 'ud_oid'); // This for children access change ud.php
        let postData = "nstyle="+modelName;
        postData += "&input_oid="+oid;
        postData += "&form="+this.serverFormName;
        // Use udajax for exchange with server   
        let call = '/'+this.ud.service+'/'+oid+"/"+this.ud.refreshAction[ this.ud.mode]+"/";
        // Prepare context for response handling
        let context = {element:this.topElement, action:action, setCursor:setCursor, ud:this};
        // Send request to server
        this.udajax.serverRequest( call, "POST", postData, context, null); 
        // Setup waiting         
        let html = '<div style="text-align:center"><img src="/upload/3VUvtUCVi_processing.gif">';
        html += '<br>Initialisation de la page avec '+modelName+'.</div>';
        this.ud.topElement.innerHTML = html;
        window.scrollTo( 0, 0);
        return debug( { level:5, coverage:14, file:"apiset1.js", return: true}, "Server request model "+this.udajax.serverRequestId, action, modelName);   
    } // UDapi.setModel()
*/
   /**
    * @api {JS} API.setSystemParamaters(params) Set system parameters of current UD
    * @apiParam {object} params List of attribute values
	* @apiSuccess {boolean} True
    * @apiGroup Documents
    */
    setSystemParameters( params) {
        // 2DO Control values 
        /* and get ?
        let paramHolder = this.dom.element( 'BVV0000000A300000M_params_object');
        let params = null;
        if ( paramHolder) { params = API.dom.udjson.valueByPath( paramHolder.textContent, "data/value");}
        API.dom.udjson.valueByPath( API.dom.element( 'BVV0000000A300000M_params_object').textContent, "data/value"+param);
        API.udjson.valueByPath( 'docParams', param); 
        */
        // Write textra of document
        let action = "reload";
        let setCursor = false;
        let oid = this.dom.attr( this.topElement, 'ud_oid'); // This for children access change ud.php
        let postData = "textra={\"system\":{"+JSON.stringyfy( params)+"}";
        postData += "&input_oid="+oid;
        postData += "&form="+this.serverFormName;
        // Use udajax for exchange with server   
        let call = '/'+this.ud.service+'/'+oid+"/"+this.refreshAction+"/";
        // Prepare context for response handling
        let context = {element:this.topElement, action:action, setCursor:setCursor, ud:this};
        // send request to server
        this.udajax.serverRequest( call, "POST", postData, context, null); 
        return debug( { level:5, coverage:10, file:"apiset1.js", return: true}, "Server request system params"+this.serverRequestId, action, params);
    } // ud.setSystemParameters()
    
    /**
    * @api {JS} API.env(key, var) Set an ENViromental variable
    * @apiParam {string} style Style name
    * @apiGroup Documents
    */
    env( key, value) {
        let call = '/'+this.ud.service+'/?'+key+'='+value;
        let context = { action:"ignore"};
        this.udajax.serverRequest( call, "GET", null, context); 
    }
   
   /**
    * @api {JS} API.setStyle(style) Set current element's style (in nstyle field)
    * @apiParam {string} style Style name
    * @apiGroup Documents
    */
   setStyle( style) {
     this.ude.setStyle( style);
   }
   
   /**
    * @api {JS} API.addStyleRules(rules) Add a set of style rules
    * @apiParam {string} css CSS of rules
    * @apiGroup Styles
    */  
    addStyleRules( css)
    {
        //css = css.replace(/\s/g, "");
        console.log( css);
        // 2DO will need a rule seperator to split
        css = css.split('}');
        let style = document.createElement("style");
        style.appendChild(document.createTextNode(""));
        document.head.appendChild(style);
        for (let i in css) {
            let ruleStart = css[i].indexOf( '{');
            if ( ruleStart == -1) continue;
            let selector = css[i].substr( 0, ruleStart-1).replace(/\n/g, "");
            let cssPart = css[i].substr( ruleStart + 1).replace(/\s/g, "");
            let rule = selector + '{' + cssPart + '}';
            if( !style.sheet.insertRule( rule)) debug( { level:5}, "addStyleRules Fail on", rule);
            let name = rule.substring( 0, rule.indexOf('{')-1);
            if (name.indexOf('.') > -1) name = name.substring( name.indexOf('.')+1);
            let elements = document.getElementById('document').getElementsByClassName( name);
            for (let iel=0; iel<elements.length; iel++) { 
                let element = elements[iel]; 
                element.classList.remove( name); 
                element.classList.add( name);
            } 
        } // end rule loop  
    } // UniversalDoc.addStyleRules()
   
   /**
    * @api {JS} API.loadModule(moduleName,args,source) Load and initiate a module
    * @apiParam {string} moduleName Name of module
    * @apiParam {object} args List of arguments
    * @apiParam {object} source Not used
    * @apiSuccess {object} The loaded module
    * @apiGroup Modules
    */
    loadModule( moduleName, args, source) {
        var mod = null;
        if ( typeof process == 'object') {
            // try
            mod = new window[ moduleName]( this.topElement);
        }
        else mod = new moduleName( args);
        // if (!mod) load file 
        return mod;
    } // UniversalDoc.loadModule()

   /**
    * @api {JS} API.postForm(formId,uri,prompt) Post a form
    * @apiParam {string} formId Id of form or a containing div 
    * @apiParam {string} uri Set form's action attribute of present 
    * @apiParam {string} prompt Empty (by defaumt) or text of confirmation prompt
    * @apiSuccess {boolean} False to stop onsubmit from sending form
    * @apiGroup Modules    
    */
    // 2DO uri by default = form's action attribute
    postForm( formId, uri="", prompt="") {
        let form = document.forms['loginform'];
        if ( uri) form.setAttribute( 'action', uri);
        if ( prompt == "" || Confirm(prompt)) form.submit();
    } // UniversalDoc.postForm()

    
   /**
    * @api {JS} API.translateTerm(term) Translate a term to current language
    * @apiParam {string} term The term to translate
    * @apiParam {boolean} translateEverything If true (default) translate as phrase, otherwise translate terms between {! and !}
    * @apiParam {string} setTranslation Store translated value for future use
    * @apiSuccess {string} Translated term 
    * @apiGroup Text or HTML
    */
    // 2DO remove translateEverything
    translateTerm( term, translateEverything = true, setTranslation = "") {
        if ( !term) return "";
        let translation = "";
        if ( !this.terms) {
            // Load existing terms
            this.terms = API.json.merge( UD_terms, 'UD_terms');
        }
        if ( setTranslation) {
            // Add a new term for translation
            if ( translateEverything) this.terms[ term] = setTranslation;
            /*else {
                // 2DO Get {! .. !} sequencies and read translations from array
            }*/
        } else {
            // Get translation
            if ( term.indexOf( '{!') == -1) {
                // Lookup full term
                translation = this.terms[ term];
                if ( typeof translation == "undefined") { 
                    //2DO Store values/lkeys for speed                   
                    let inverseIndex = Object.values( this.terms).indexOf( term);
                    if ( inverseIndex) {
                        let keys = Object.keys( this.terms);
                        translation = keys[ inverseIndex];
                    }
                }
                if ( typeof translation == "undefined") translation = this.terms[ term.replace( '_', '-')];
            } else {
                // Translate all terms between between {! & !}
                let safe = 20;
                let p1 = term.indexOf( '{!');
                while( p1 > -1 && safe--) {
                    let p2 = term.indexOf( '!}', p1);
                    if ( !p2) break;
                    let termToTranslate = term.substring( p1+2, p2);
                    let translatedTerm = ( typeof this.terms[ termToTranslate] == "string") ?
                        this.terms[ termToTranslate] : termToTranslate;
                    term = term.substr( 0, p1) + translatedTerm + term.substr( p2+2);
                    p1 = term.indexOf( '{!');
                }
            }
        }
        if ( typeof translation == "undefined" || !translation) translation = term;
        return translation;
    } // UniversalDoc.translateTerm()    
 
   /**
    *    @api {JS} API.buildPartEditing(targetId) Build part names editing zone from outline in ressources
    *    @apiParam {string} targetId Id of View where editing names is to be placed
    *    @apiSuccess Part names editing zone
    *    @apiGroup Documents
    */
    buildPartEditing( targetId)
    {
        // Find target
        let target = this.dom.element( targetId);
        if ( !target) return debug( {level:2, return:null}, "Can't find part editing zone", targetId); 
        // Get outline from sources
        let outlineId = window.udparams.outlineId;
        let outline = this.dom.element( outlineId);
        if ( !outline) return debug( {level:2, return:null}, "Can't find outline or outlineId", outlineId);
        let partsList = outline.getElementsByTagName( 'li');
        // For each part
        for (let i=0; i < partsList.length; i++)
        {
            let partItem = partsList[ i];
            // Find part
            let partId = this.dom.attr( partItem, 'target_id');
            let part = this.dom.element( partId);
            if (!part) continue;
            // Get part's id, OID and editing fields
            let id = part.id;
            let ud_oid = this.dom.attr( part, 'ud_oid');
            let ud_fields = 'tcontent';
            // Get part's content
            let content = partItem.innerHTML;
            // Add paragraph to target with id, ud_oid, ud_fields
            let para = document.createElement( 'p');
            para.id = id+'_manage';
            this.dom.attr( para, 'ud_oid', ud_oid);
            this.dom.attr( para, 'ud_fields', ud_fields);
            this.dom.attr( para, 'ud_dupdated', ''+this.ticks);
            this.dom.attr( para, 'ud_dchanged', ''+this.ticks);
            para.innerHTML = content;
            target.appendChild( para);
        } // end of partList loop
        return target;
    } // UniversalDoc.buildPartEditing() 
    
    runCommand( cmd)
    {
        return this.run( cmd);
    }
    
   /**
    * @api {JS} API.onTrigger(element,trigger,fct,once=true) Set an application-level trigger on an element
    * @apiParam {HTMLelement} element The element on which the trigger is placed
    * @apiParam {string} trigger The triggers name : update - element is updated by server
    * @apiParam {function} fct The function to call
    * @apiParam {boolean} once If tru, trigger is disabled after use
    * @apiGroup Elements
    */    
    /*
    onTrigger( element, trigger, script, once = true) {
        let triggerNo = 0;
        // Look for first empty slot in triggeredActions and fill with scripts
        for ( let trigi = 0; trigi < this.triggeredActions.length; trigi++) {
            if ( !this.triggeredActions[ trigi]) {
                triggerNo = trigi+1;
                this.triggeredActions[ trigi] = script;
            }
        }
        if ( !triggerNo) {
            // Add a new slot for ths fct
            this.triggeredActions.push( script);
            triggerNo = this.triggeredActions.length;
        }
        // Set element with triggerNo event
		/ *		
        switch (trigger)
        {
            case "update" :
                this.dom.attr( element, "ud_onupdate", triggerNo);
                break;
        }
		* /
		if ( trigger == "update") this.dom.attr( element, "ud_onupdate", triggerNo);
    } // UniversalDoc.onTrigger()
    */
   /**
    * @api {JS} API.botlogUpdate(action,id,status,details) Perform an operation on botlog
    * @apiParam {string} action The required action on botlog: get, set, busy
    * @apiParam {string} id Id of botlog entry, null if new
    * @apiParam {string} status Status of entry
    * @apiParam {string} details Details of operation
    * @apiGroup Robots
    * @apiSuccess {boolean} True if at least one botlog entry has open status 
    */
    botlogUpdate( action, id, status, details)
    {
        let botlog = window.ud.botlog;
        let ticks = window.ud.ticks;
        // Get botlog element content       
        let botlogZone = this.dom.element( "BVU00000002000000M");
        if ( !botlogZone || this.dom.attr( botlogZone, 'exTag')!= "p") botlogZone = this.dom.element( "BVU00000002200000M");
        if ( !botlogZone) return;
        window.botlogId  = botlogZone.id;      
        let botlogContent = [];
        let botlogChildren = botlogZone.childNodes;
        for ( let bli=0; bli < botlogChildren.length; bli++)
            if ( botlogChildren[ bli].nodeType == 3) botlogContent.push(  botlogChildren[ bli].textContent.trim());
        let save = false;
        let changed = false;
        let reload = false;        
        // Process action
        if ( action == "get") {
            // Return formatted botlog
        } else if ( action == "set") {
            if (  typeof botlog.log[ id] == "undefined")
                botlog.log[ id] = { status:status, details:details, start:this.ticks, update:ticks};
            else     
                botlog.log[id] = { status:status, details: botlog.log[id].details+"\n"+details, update:ticks};
        } else if ( action == "busy") {
            let busy = false;
            for ( let logId in botlog.log) {
                let bl = botlog.log[ logId];
                if ( bl.status) {
                    if ( bl.update - bl.start > 50) bl.error = true; else bl.error = false;
                    busy = true; 
                } else {
                    botlogContent.push( bl.details);
                    delete botlog.log[ logId];
                    botlogZone.innerHTML = botlogContent.join( "<br>");
                }                
            }
            // Too frequent return debug ( {level:5, return:busy, coverage:26, file:"apiset1.js"}, "botlogUpdate action:", action);
            return busy;
        } else if (action == "server" || action == "") {
            // Look for commands in botlog element and sync with server if open          
            for ( let bli=0; bli < botlogContent.length; bli++) {
                let line = botlogContent[ bli];
                if ( line == "__OPEN__") { 
                    if ( botlog.call) clearInterval( botlog.call);
                    botlog.call = setInterval( function() {API.botlogUpdate( "server");}, 2000);
                    botlog.openToServer = true;
                    let botlogContainer = botlogZone.parentNode;
                    if ( this.dom.attr( botlogContainer, "ud_type") == "zone" )  botlogContainer = botlogContainer.parentNode;
                    API.showOneOfClass( botlogContainer.id, true);
                    botlogContent[ bli] = "Ouvert au serveur";  
                    changed = true;                    
                } else if ( line =="__CLOSE__") {
                    if ( botlog.call) clearInterval( botlog.call);
                    botlog.call = setInterval( function() {API.botlogUpdate( "server");}, 12000);
                    botlog.openToServer = false;
                    let defaultPart = this.dom.attr( this.topElement, "ud_defaultpart"); 
                    if ( defaultPart) API.showOneOfClass( defaultPart, true);
                    botlogContent[ bli] = "Fermé au serveur";
                    save = true;
                    changed = true;                     
                } else if ( line =="__RELOAD__") {
                    reload = true;                    
                    botlogContent[ bli] = "Rechargé";
                    changed = true;                     
                }   
            }
            if ( changed) botlogZone.innerHTML = botlogContent.join( "<br>");
            if (reload) API.reload( false);  
            // Update & save or fetch
            if ( botlog.openToServer) this.ud.fetchElement( botlogZone);    
            else {
                // Bolog "owned" by client
                // Delete terminated task from local log and add to botlog element
                for ( let logId in botlog.log) {
                    let bl = botlog.log[ logId];
                    if ( !bl.status) {
                        botlogContent.push( bl.details);
                        delete botlog.log[ logId];
                        botlogZone.textContent = botlogContent.join( "<br>");
                        save = true;
                    }
                } 
                if ( save) this.ud.viewEvent( "change", botlogZone);                
            }
			debug( { level:5, coverage:41, file:"apiset1.js"}, "botlogUpdate action:", action); 
        }
    } // UD.botlogUpdate()
    
   /**
    * @api {JS} API.setUDparam(param,value) Set parameter on current UD
    * @apiParam {string} param The name of the parameter
    * @apiParam {string} value The value to set
    * @apiGroup Documents
    * @apiSuccess {mixed} Return The value set
    */
    setUDparam( param, value) {
        // 2DO if not owner/write access then send to AJAX_data SoV with nname filter        
        // Check manage view is available
        API.buildManagePart();
        // Get doc parameter management
        let paramObj = this.dom.element( UD_wellKnownElements['UD_docParams']);
        let docParam = null; 
        let params = null;
        if ( paramObj) {
            let paramObjData = this.dom.udjson.parse( paramObj.textContent);
            if ( !paramObjData) { return null;}
            params = paramObjData.data.value;          
            // Set value
            params[ param] = value;
            paramObjData.data.value = params;
            paramObj.textContent = JSON.stringify( paramObjData); 
            docParam = paramObj.parentNode;
        } else {
            /*legacy TO DELETE*/
            docParam = this.dom.element( 'BVV00000300000000M_params');
            if ( !docParam) return debug( { level:3, return:null}, "Can't find doc parameters, so can't change them");
            paramObj = this.dom.element( 'div.textObject', docParam);
            if ( !paramObj) return debug( { level:3, return:null}, "Can't find doc parameters, so can't change them", docParam);
            params = this.dom.udjson.parse( paramObj.textContent);
            if ( !params) { return null;}
            // Set value
            params[ param] = value;
            paramObj.textContent = JSON.stringify( params);            
        }
        // Update edit zone and mark as changed
        this.ude.textEd.inputEvent( { event:"update", object:params}, docParam);
        this.ud.viewEvent( "change", docParam);
        return params;
    } // API.setUDparam()
    
   /**
    * @api {JS} API.userId() Return 5 base 32 digits representing user
    * @apiGroup Documents
    * @apiSuccess {string} User id in base 32
    */
    userId() { return this.ud.userId;}
   /**
    * @api {JS} API.ownerId() Return 5 base 32 digits representing doc owner.
    * @apiGroup Documents
    * @apiSuccess {string} Owner id in base 32, needed to access elements added at creation
    */
    ownerId() { return this.ud.ownerId;}
    
    /**
    * @api {JS} API.createDocument(name="") Create a document in current directory
    * @apiParam {string} name The document's name, default = New document
    * @apiParam {string} model The document's model
    * @apiGroup Documents
    * @apiSuccess {mixed} Return The value set
    */
    createDocument( name = "Nouvelle  tâche", shortDescription = "Description courte", model = "", dirName = "") {
        // 2DO Input name if required using variable prompt
        // Popup waiting
        let popup = this.dom.element( "system-message-popup");
        if ( popup) {
            popup.innerHTML = '<div style="text-align:center"><img src="/upload/3VUvtUCVi_processing.gif"></div>';
            popup.classList.add( 'show');
        }
        // Translate parameters with {!...!} syntax
        name = API.translateTerm( name, true);
        shortDescription = API.translateTerm( shortDescription, false);
        model = API.translateTerm( model, false);
        // Get OID of currrent directory
        let currentOid = this.dom.attr( this.dom.element( 'document'), 'ud_oid');
        let oidStr = currentOid;
        let oidA = oidStr.split( '--')[1].split('-');
        let mode = this.dom.element( 'UD_mode').textContent;
        // 2DO get model or models list from API.getEditorAttr stored in textra
        // let model = this.dom.element( 'UD_docModel').textContent;
        if ( mode.indexOf( "model") != 0) oidA = oidA.slice(0, -2);
        if ( dirName) {
            // Get dir's path
            let dirOIDholder = this.dom.element( dirName);
            if ( dirOIDholder) {
                // Merge Dir with Doc OID
                let dirOID = dirOIDholder.textContent.split( '--')[1].split('-');
                oidA = dirOID;
            }
        }
        // Build string OID
        if ( oidA.length % 2 == 1) oidStr = "UniversalDocElement--"+oidA.join('-')+"-0";  
        else oidStr = "UniversalDocElement--"+oidA.join('-')+"-21-0";
        // Lang
        let lang = this.dom.element( 'UD_lang').textContent;
        let form = "INPUT_addApage";
        if ( lang != "EN") form = API.translateTerm( form);
        // Create POST data
        let postdata = "";
        // Form info
        postdata += "form="+form;
        postdata += "&input_oid="+oidStr;
        // UD element info
        postdata += "&stype=2&nstyle=&tgivenname="+name;
        postdata += "&tcontent="+shortDescription;
        postdata += "&nstyle="+model;
        postdata += "&textra="+ JSON.stringify( { system:{ state:"new"}});
        // URL to call
        let call = "/webdesk/"+oidStr+"/AJAX_addDirOrFile/e%7CcreateAndOpen/p1%7Cfile/";
        // Prepare context for response handling
        let context = { action:"fill zone", zone: "left-tool-zone",  setCursor:false, ud:this.ud};         
        let me = this;
        //let resolveFct = this.createDocument2.bind( me);
        //let rejectFct = this.cantCreateDocument.bind( me);
        let promise = new Promise( (resolve, reject) => {            
            console.log( "Promise new doc");
            //resolve( context);
        });
        promise.then( (context) => {
           console.log( "then APIset1", context);
           this.createDocument2( context);
        });
        promise.catch( (context) => { console.error( "Can't create doc (catch)");});
        context.promise = promise;
        context.resolve = ( (context)=>{
            console.log( "then byresolve APIset1", context);
            this.createDocument2( context);
         });     
        context.thenDo = { postdata:postdata, uri: call};        
        // Send request                   
        window.ud.udajax.serverRequest( call, "GET", "", context);
        // this.ud.udajax.serverRequest( call, "POST", postdata, context);
        // 2DO Timed refresh
        return false; // so onsubmit does nothing
    }
    createDocument2( context) {
        let call = context.thenDo.uri;
        let postdata = context.thenDo.postdata;
        let context2 = { action:"fill zone", zone: "left-tool-zone",  setCursor:false, ud:this.ud};
        let prom2 = new Promise( (resolve, reject) => {
            console.log( "Promise new doc 2");
            //resolve( context2);
        });
        prom2.then ( (context2) => this.createDocument3( context2));
        context2.promise = prom2;
        context2.resolve = ( (context2)=>{
            console.log( "then APIset1", context2);
            this.createDocument3( context2);
         });  
        this.ud.udajax.serverRequest( call, "POST", postdata, context2);
    }
    createDocument3( context) {
        let popup = this.dom.element( "system-message-popup");
        if ( popup) {
            popup.classList.remove( 'show');
        }
    }
    cantCreateDocument( context) { 
        let popup = this.dom.element( "system-message-popup");
        if ( popup) {
            popup.classList.remove( 'show');
        }
        console.error( "Can't create doc");
    }
   
   /**
    * @api {JS} API.switchView(name) Switch displayed view
    * @apiParam {string} name Name of view to display
    * @apiGroup Documents
    * @apiSuccess {boolean} True
    */
    switchView( viewName, switchName="") {
        let switchEl = (switchName) ? API.dom.element( switchName) : null;
        if ( switchEl && switchEl.classList.contains( UD_wellKnownClasses.active)) {
            // View already active so display menu
            let visibleView = this.dom.element( "div.part:not(.hidden)", this.dom.element( 'document'));              
            return API.displayMenu( visibleView);
        }
        // Change the visible view
        let currentView = this.dom.element( "div.part:not(.hidden)", this.dom.element( 'document'));
        // if ( !currentView) return debug( {level:1, return:false}, "No view is visible");
        if ( currentView) { 
            // Save cursor for current view
            this.dom.attr( currentView, 'ud_cursor', this.dom.cursor.save( this.dom.attr( currentView, 'ud_cursor')));
        }
        // Find requested view
        let view = API.showOneOfClass( viewName);
        if ( !switchEl) {
            let lang = API.dom.element( 'UD_lang').textContent;
            let viewNameWithLanguage = ( API.hasLanguageSuffix( viewName)) ? viewName : viewName + " " + lang; 
            let view = API.showOneOfClass( viewNameWithLanguage)
            if ( !view) view = API.showOneOfClass( viewName);
        }
        if ( !view) { return null;}
        // Fill Manage part
        //if ( viewName.toLowerCase() == "manage") API.buildManagePart();
        // Hook for automatically running scripts to fill view
        this.buildView( viewName);
        // Restore cursor
        if ( API.testEditorAttr( view, 'ude_edit', "on")) {
            // Restore cursor on eidtable views
            this.dom.cursor.restore( this.dom.attr( view, 'ud_cursor'), true);
        }
        // Set class of document, scroll & content containers with class derived from view's class
        // Keep current classses that don't start with view or theme prefix
        let doc = API.dom.element( 'document');
        let scroll = API.dom.element( 'scroll');
        let content = API.dom.element( 'content');
        let containerNewClasses = [];
        let containerClasses = doc.classList;
        for ( let cli=0; cli < containerClasses.length; cli++) {
            let containerClass = containerClasses.item( cli);
            if ( containerClass.indexOf( UD_viewPrefix) == -1 &&  containerClass.indexOf( UD_themePrefix) == -1) { 
                containerNewClasses.push( containerClass);
            }
        }
        let viewClasses = view.className.split( ' ');
        for ( let classi=0; classi < viewClasses.length; classi++) {
            let className = viewClasses[ classi];
            if ( className.indexOf( UD_layoutPrefix) == 0 || className.indexOf( UD_themePrefix) == 0) {
                containerNewClasses.push( UD_viewPrefix + className);
            }
        }
        let newClassStr = containerNewClasses.join( ' ');
        doc.className  = newClassStr;
        scroll.className = newClassStr;
        content.className = newClassStr;
        // Toggle switch
        if ( !switchName) { switchName = viewName.toLowerCase().replace( / /g, '_')+"sel"; } 
        API.activateOneOfClass( switchName); 
        // Close menu
        API.hideMenu();
        // Close system message box
        let popup = $$$.dom.element( 'system-message-popup');
        if ( popup) popup.classList.remove( 'magneto');
        // Get views's transform scale required for scrolling operations
        let transform = this.dom.attr( view, 'computed_transform');
        if ( transform && transform.indexOf( 'scale(')) { 
            // TESTING 2022-05-17 Assume scale(0.8)        
            API.dom.transformScale = 0.8;
        } else API.dom.transformScale = 1;        
        // Arrange the views's tables
        API.dom.arrangeTables( view); 
        // Check paging
        API.paginate( view);
    } // API switchView()
    
    buildView( viewName) {
        if ( viewName.toLowerCase() == "manage") $$$.buildManagePart();
        else if ( typeof $$$[ 'build_' + viewName + '_view'] == 'function')
            $$$[ 'build_' + viewName + '_view']();
    }

   /**
    * @api {JS} API.configureElement( name) Generate a "configure" event on an element and provide default processing of this event
    * @apiParam {string} name Name of element to configure
    * @apiGroup Documents
    * @apiSuccess {boolean} True
    */
    configureElement( elementOrIdOrName) {
        let element = this.dom.element( elementOrIdOrName);
        if ( !element) { element = this.dom.element( "[name='"+elementOrIdOrName+"']", 'document');}
        let saveable = this.dom.getSaveableParent( element);
        if (!saveable) return debug( {level:7, return:false}, "apiset1.configureElement() can't find ", name);
        if ( !this.ude.dispatchEvent( { event:"configure", action:"enter"}, saveable)) {
            // Default configure event processing
            let name = this.dom.attr( saveable, 'name');
            if ( name && this.dom.element( name+'editZone') && this.dom.element( name+'_parameters_editZone')) {
                API.showNextInList( [name+'editZone', name+'_parameters_editZone']);
            }
        }
        // 2DO move to calc
        function inNamedList( list, valueToFind) {
            for( let key in list) {
                if ( valueToFind == list[ key]) return key;
            }
            return "";
        }
        let insertables = API.insertables( saveable);
        if ( insertables && inNamedList( insertables, this.dom.attr( element, 'exTag'))) 
            API.displayConfig( element); 
        else API.displayConfig( saveable);
        // Temp corrected 13/05/2022 : allow span configuration in p elements
        // if ( exTag == "p") API.displayConfig( element); else API.displayConfig( saveable);
    } // API configureElement()
 
   /**
    * @api {JS} API.HTMLeditor(elementOrId) Open an HTML editor on an element
    * @apiParam {mixed} elementOrId HTML element or its Id
    * @apiGroup HTML
    * @apiSuccess {boolean} True
    */
    HTMLeditor( elementOrId, close=false) {
        let element = this.dom.element( elementOrId);
        if ( !element) return debug( {level:4, return:false}, "Can't find element", elementOrId);
        // 2DO Look for existing editZone or element such as div.HTML. Switch zone in ths case
                // 2DO Move this if to HTMLeditor() and use availabeActions
        let elementName = this.dom.attr( element, 'name').replace( / /g, '_');
        if ( this.dom.element( elementName + 'editZone')) { // if ( this.dom.attr( saveable, 'exTag') == "div.html") {
            // Use existing editing zone for this element
            API.showNextInList( [ elementName+"editZone", elementName+"viewZone"]);
            return;
        }

        // Open temporary editor        
        if ( !close) {
            if ( this.dom.element( element.id+"editZone")) { 
                // Close editor without saving
                this.dom.element( element.id+"editZone").remove();            
                element.classList.remove( 'hidden');
                return;
            } 
            let html = element.innerHTML;
            let area = document.createElement( 'textarea');
            area.textContent = html;
            let htmledit = area.innerHTML.split( "&lt;").join("\n&lt;");
            if ( htmledit[0] == "\n") { htmledit = htmledit.substring( 1);} // remove empty 1st line
            // Build edit zone and add to same container as element
            // Build editZone for configuration as invisble
            let newEditZone = document.createElement( 'div');
            this.dom.attr( newEditZone, "id", element.id+"editZone");
            this.dom.attr( newEditZone, "class", "linetext");
            this.dom.attr( newEditZone, "ude_autosave", "off");
            this.dom.attr( newEditZone, "ude_bind", element.id);
            this.dom.attr( newEditZone, "ud_type", "linetext");
            this.dom.attr( newEditZone, "ud_subtype", "text");
           // Add HTML edition
            let saveAction = "API.HTMLeditor( '"+element.id+"', true);";
            let edTable = this.ude.textEd.convertTextToHTMLtable( htmledit, element.id, "", saveAction);
            newEditZone.appendChild( edTable);
            // Attach to DOM
            let next = element.nextSibling;
            let container = element.parentNode;            
            if ( next) { container.insertBefore( newEditZone, next);}
            else { container.appendChild( newEditZone); }
            element.classList.add( 'hidden');
        } else {
            // Transfert edited content to element
            let editorZone = this.dom.element( element.id+"editZone");
            let table = editorZone.getElementsByTagName( 'table')[0];
            if (!table) return debug( {level:1, return: null}, "can't find table in ", editorZoneId);
            let rows = table.getElementsByTagName( 'tbody')[0].rows;
            if (!rows) return debug( {level:1, return: null}, "no rows in tbody of ", editorZoneId);
            // Compile text from each row of the table (2 cols : line n0 and text)
            let text = "";
            for (let irow=0; irow < rows.length; irow++) {
                let line = rows[irow].cells[1].innerHTML;
                text += line;
            }
            let area = document.createElement( 'textarea');
            area.innerHTML = text;
            let html = area.textContent;
            editorZone.remove();
            element.innerHTML = html;            
            element.classList.remove( 'hidden');
            this.ud.viewEvent( "change", element);
        }
    } // API.HTMLeditor()
    
    keepOneLanguage( html) {
        let saveable = this.dom.element( "[name='"+name+"']", 'document');
        if (!saveable) return debug( {level:7, return:false}, "apiset1.configureElement() can't find ", name);
        if ( !this.ude.dispatchEvent( { event:"configure"}, saveable)) {
            // Default configure event processing
            API.showNextInList( [name+'editZone', name+'_parameters_editZone']);
        }
    } // API keepOneLanguage()
    
   /**
    * @api {JS} API.displayDocInPanel(docOID,panelName) Display doc in side panel
    * @apiParam {string} docOID OID (DB identifier) of document
    * @apiParam {string} panelName Name of the panel to use (left or right)
    * @apiGroup Documents
    * @apiSuccess {boolean} True
    */
    displayDocInPanel( panelName, docOID="", docName="") {
        let column = this.dom.element( panelName+"Column");        
        let selector = this.dom.element( panelName+"-tool-selector");
        let zone = this.dom.element( panelName+"-tool-zone");
        if ( zone && docOID) {
            if ( selector) selector.style.display = "none";
            // Fill zone with iframe
            API.dom.emptyElement( zone);            
            let attr = { onclick:"API.displayDocInPanel( 'right');" };
            API.dom.insertElement( "div", "Close", attr, zone, false, true);
            let call = "/webdesk/"+docOID+"/show/?mode=frame";
            let sandbox = "allow-top-navigation allow-scripts allow-same-origin";            
            attr = { id: docName, src:call, class:"docDisplay", sandbox:sandbox, style:"width:100%; height:750px;"};
            API.dom.insertElement( "iframe", "", attr, zone, false, true);
            column.style.width = "380px";            
            return true;
        } else if ( zone) {
            // Close doc
            API.dom.emptyElement( zone);
            if ( selector) selector.style.display="block";
        }
        return false;
    }
    
   /**
    * @api {JS} API.goTo(anchorId) Center anchor
    * @apiParam {string} anchorIdOrNameOrPage Id or name of anchor
    * @apiParam {string} viewOrId Id of View
    * @apiParam {string} documentOid of Document
    * @apiGroup Documents
    * @apiSuccess {boolean} True
    */
    goTo( anchorOrId, viewOrName = null, mode = "middle") {
        // Find container
        let container = ( typeof viewOrName == "string") ? this.dom.element( '[name="' + viewOrName + '"]', 'document') : viewOrName;
        if ( !container) { container = this.dom.element( "div.part:not(.hidden)", this.dom.element( 'document'));}
        // Find anchor by id, name or special case
        let target = this.dom.element( anchorOrId);
        if ( !target) {            
            if ( anchorOrId.indexOf ( 'Page ') == 0 && container && API.dom.attr( container,'exTag') == "div.part") {
                // Page indexing
                let pageNo = parseInt( anchorOrId.substr(5));
                let page = API.dom.childElements( container)[ pageNo - 1];
                target = page.childNodes[ 0];                
            } else {
                // By name
                target = API.dom.element( '[name="' + anchorOrId + '"]', container);
            }
        }    
        // Display Target
        if ( target) {
                if ( container) {
                    // Change view if necessary
                    let currentView = this.dom.element( "div.part:not(.hidden)", this.dom.element( 'document'));
                    if ( currentView && currentView != container) { this.switchView( this.dom.attr( container, 'name'));}
                }
            this.dom.cursor.setAt( target);
            this.dom.makeVisible( target, "scroll", mode);
        } else {
            return debug( { level:5, return:false}, "Can't find element to goTo", anchorOrId);
        }
        /*
        let topPos = target.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo( { top: topPos, behaviour: 'smooth'});
        */
        return true;
    }
   /** 
    * @api {JS} API.dom.getView(elementOrId) Get View element
    * @apiParam {mixed} elementOrId HTML element or its Id
    * @apiSuccess {HTMLelement} return The View HTMLelement
    * @apiError {object} return null
    * @apiGroup Views    
    */     
   /**
    * Return view element conatining an element
    * @param {mixed} elementOrId  HTML element or id
    * @return {HTMLelement} The View element
    */
   
    getView( elementOrId) {
        let element = this.dom.element( elementOrId);
        let safe = 10;
        let partClassList = null;
        let walk = element;
        while ( walk && walk.id != "document" && !walk.classList.contains( 'part') && --safe) walk = walk.parentNode;
        if ( walk.classList.contains( 'part')) return walk;
        return null;
    } // getView()

    // 2DO Document API
    showMenu( elementName) {
        let element = API.dom.element( '[Name="'+elementName+'"]', 'document');
        if ( !element) { return;}
        // this.dom.makeVisible( element);
        API.displayMenu( element); // this.ude.displayFloatingMenu( element);
    }
    
    clearMenu() { API.hideMenu();} // this.ude.displayFloatingMenu();}
    
    hoverOver( elementOrId) {
        let element = API.dom.element( elementOrId);
        if ( element) {
            let event = new MouseEvent('mouseover', {
              'view': window,
              'bubbles': true,
              'cancelable': true
            });
            element.dispatchEvent(event);
        }
    }
  
    clickOn( elementOrId = "") {
        let element = ( elementOrId) ? this.dom.element( elementOrId) : this.dom.cursor.fetch().HTMLelement;
        if ( element) {
            let event = new MouseEvent('click', {
              'view': window,
              'bubbles': true,
              'cancelable': true
            });
            element.dispatchEvent(event);
        }
    }

    
    displayTip( tipName, position={x:100, y:100, from:"bottomLeft"}, duration = 20, elementsToHighlight=[]) {
        if ( typeof TIPS_manager == "undefined") { return;}
        return TIPS_manager( tipName, position, duration*1000, elementsToHighlight);
    }
    
    addTip ( tipName, content) {
        let tipsHolder = API.dom.element( 'tips');
        let tip = API.dom.element( tipName);
        if ( tip) { tip.innerHTML = content;}
        else if ( tipsHolder) {
            let attr = { id: tipName, class:"tip hidden"};
            tip = API.dom.insertElement( 'div', '<p>'+content+'</p>', attr, tipsHolder, false, true);
        }
        return tip;
    }
    
    addView() {
        // Get configuration content : Name, Description, Type, Class, Layout & OK with call to setupView Get from constant.js
        let viewContent = API.defaultContent( "div.part", "_unconfigured");
        // Views are not saved until they are configured
        // Find or create view
        let tempName = "_NEW_VIEW_ID";
        let attr = { id:tempName, name:"_NEW_VIEW_NAME", class:"part unconfigured", ud_type:"part"};
        let view = this.dom.element( tempName);
        if ( !view) {
            view = API.dom.insertElement( "div", "", attr, this.dom.element( 'document'), false, true);
            let page = API.dom.insertElement( "div", "", { class:"page", ud_type:"page"}, view, false, true);
            // Add access to hidden views
            let system = API.json.parse( "UD_system");
            if ( system && typeof system.showHidden != "undefined") {
                let hidden = [ { tag:"h2", value:"Voir les vues cachées"}];
                for ( let hidi =0; hidi < system.showHidden.length; hidi++) {
                    let hiddenView = system.showHidden[ hidi];
                    hidden.push( { tag:"span", class:"button", onclick:"API.switchView('"+hiddenView+"');", value:hiddenView});
                }
                let element = API.json.putElement( { tag:"div", value:hidden});
                page.appendChild( element);
            }
            // Add configuration content
            // 2DO use udcontent fct with no save mode
            for ( let key in viewContent) {
                let elementData = viewContent[ key];
                let value = elementData.value;
                // Use placeholder value if value empty
                if ( value == "" && elementData.placeholder != "") {
                    value = API.translateTerm( elementData.placeholder);
                    elementData.placeholder = value;
                }
                // 2DO substitue variables between { and }
                // Run formulas
                if ( value[0] == '=') {
                    value = this.calc.exec( API.translateTerm( value.substring( 1), false));
                }
                // Update element
                elementData.value = value;
                // Name element automatically (2DO could use substitution)
                elementData.name = tempName + key;
                // Create element
                let element = API.json.putElement( elementData); 
                this.dom.attr( element, 'ud_oid', "__NONE__");
                // element.id = tempName + key;
                page.appendChild( element);
            }
        }
        // Display new view        
        this.switchView( "_NEW_VIEW_NAME", "newView");
        return view;
    }
    
    // 2DO document API call. realyy API or internal fct
    setupView( tmpId = "_NEW_VIEW_ID") {
        // Find view
        let view = API.dom.element( tmpId);
        let page = view.childNodes[0];
        if ( API.dom.attr( page, 'ud_type') != "page") { page = view;}
        // Read config data and set in view        
        let children = page.childNodes;
        let name = "";
        let description = ""; 
        let type = "doc";
        let layout = "standard";
        let className = "";
        for ( let childi=0; childi < children.length; childi++) {
           let child = children[ childi];
           let value = child.textContent;
           switch (child.id.replace( tmpId, "")) {
                case 'name' : name = value; break;
                case 'describe' : description = value; break;
                case 'type' : 
                    let typeEl = this.dom.element( tmpId + 'type');
                    let typeSelector = this.dom.element( 'select', typeEl);                   
                    type = typeSelector.value; //options[ typeSelector.selectedIndex].value;
                    // type = value.trim().toLowerCase(); 
                    break;
                case 'layout' :
                    let layEl = this.dom.element( tmpId + 'layout');
                    let laySelector = this.dom.element( 'select', layEl);
                    layout = laySelector.value; // options[ laySelector.selectedIndex].value;
                    // layout = value.trim().toLowerCase(); 
                    break;
                case 'className' : 
                    className =  " "+value;
                    break;
           }          
        }
        for ( let childi=children.length-1; childi >= 0; childi--) {  children[ childi].remove();}
        // Set view no. Create event on view element
        view.className = "part " + type.replace( / /g, '_') + " LAY_" + layout.replace( / /g, '_') + " " + className;
        let viewNo = API.getTagOrStyleInfo( 'div.part.'+type, 'nextId');
        // 2DO needs a fct
        API.json.valueByPath( 
            UD_exTagAndClassInfo, 
            'div.part.'+type+'/nextId', 
            ( parseInt( viewNo, 32) + 1).toString( 32)
        );
        // let viewNo = API.json.value( 'UD_nextViewIds', type, null, 'incrementAfterBase32');
        // if ( isNaN( viewNo)) viewNo = API.json.value( 'UD_nextViewIds', type);
        view.id = ('B' + ('00'+viewNo).slice( -2) + '0000000000' + ("00000"+this.ud.userId).slice(-5)).toUpperCase(); 
        API.dom.attr( view, 'name', name);
        API.dom.attr( view, 'ud_subtype', type);
        this.ud.viewEvent( "createView", view);
        // On update copy intitial content using API.checkContent
        let onUpdateTrigger = API.onTrigger( view, 'update', API.checkContent);
        // Add selector into view-selector
        let viewSelector = this.dom.element( 'view-selector'); 
        let switchName = name.toLowerCase().replace( / /g, '_')+"sel";   
        let click = "API.switchView( '"+name+"', '"+switchName+"');"              
        let switchClass = 'tab left active';
        let viewCtrl = API.dom.insertElement( 'span', name, { id: switchName, class:switchClass, onclick:click, title:name}, viewSelector, true, true);
    }

   /**
    * @api {JS} API.createUser(username) Create a user
    * @apiParam {string} username The name to give to user
    * @apiParam {string} email The user's email
    * @apiParam {string} idHolderId The id of the where the user's id is to be stored  
    * @apiParam {string} homeOID DB address of home directory to give this user
    * @apiSuccess {HTMLelement} return The View HTMLelement
    * @apiError {object} return null
    * @apiGroup Users   
    */    
    createUser( name = "", email = "", userModel = "client", idHolderId="UserId", homeOID = "") {
        if ( !name) {
            // Get User's name for UserName holder
            let nameHolder = this.dom.elementByName( 'UserName');
            name = ( nameHolder) ? nameHolder.textContent : "";
            if ( name == this.dom.attr( nameHolder, 'ude_place')) name = "";
            if ( !nameHolder || !name) {
                API.pageBanner( 'temp', API.translateTerm( "A name is required"));
                return debug( {level:1, return:false}, "Can't find UserName");
            }
        }
        if ( !email) {
            // Get User's email ( required for sending link)
            let emailHolder = this.dom.elementByName( 'UserEmail');
            let email = ( emailHolder) ? emailHolder.textContent : "";
            if ( email == this.dom.attr( emailHolder, 'ude_place')) email = "";
            if ( !emailHolder || !email) {
                API.pageBanner( 'temp', API.translateTerm( "A valid email is required"));
                return debug( {level:1, return:false}, "Can't find valid UserEmail");
            }
        }
        // Find holder for User's id ( required for response)
        let idHolder = this.dom.elementByName( idHolderId);
        if ( !idHolder) {
            API.pageBanner( 'temp', API.translateTerm( "An element to write response is required"));
            return debug( {level:1, return:false}, "Can't find id element");
        }    
        // Prepare server call with createUserResponse
        let uri = "/webdesk/"+homeOID+"/AJAX_userManager/e|create/out|json/";
        // Prepare user's parameters
        let params = {
            // modelUser : "standard",
            // homeOID : "{OID}",// use OID
            userModel: userModel
        };
        // Prepare POST data
        let data = {
            form : "INPUT_createUser",
            input_oid : "Links_User--2-0",
            nname: name,
            tpasswd: "",
            tdomain: 'localhost_webdesk',
            stype: LINKSUSER_login,
            nemail: email,
            tparams: JSON.stringify( params)
        };
        let formData = ""
        for ( var key in data) formData += key+"="+data[ key]+"&";
        formData = formData.substring( 0, formData.length-1);
        // Prepare context
        let context = { dataTarget:idHolderId, dataSource:"id"};
        // Send and process response
        let me = this;
        this.ud.udajax.serverRequest( uri, "POST", formData, context, me.createUserResponse);

        // Retrieve link ( : <br>  add span id) and place in span on config
        
    } // API.createUser()
    // 2DO can be merged or replaced by udapi.serviceResponse
    createUserResponse( context, html, js) {
        // !!! No this !!!
        let me = window.ud.api;
        // Process as JSON
        let response = me.dom.udjson.parse( html);
        if ( !response || !response.success) {
            me.pageBanner( "temp", html);
            return;
        }
        let banner =  "";
        if ( response.success) banner += '<span class="success">'+response.message+'</span>';
        else banner += '<span class="error">'+response.message+'</span>';
        let data = response.data;
        if ( !data) return false;
        // 2DO could use value with dotted path or elementByName could accept selection query
        let target = me.dom.elementByName( context.dataTarget);
        let value = me.json.value( data, context.dataSource);
        if ( target && value) {
            if ( target.textContent == me.dom.attr( target, 'ude_place')) target.textContent = value;
            else target.textContent += "," + value; 
            me.ude.setChanged( target);            
        }        
    } // API.createUserResponse()
    
    prepareUserCreation() {
        // Prepare server call with createUserResponse
        let uri = "/webdesk//AJAX_userManager/e|arm/out|json/";
        this.ud.udajax.serverRequest( uri, "GET", null, { action:"ignore"});
    }
   /**
    * @api {JS} API.getOIDbyName(elementName) Get the OID where a named element is stored
    * @apiParam {string} elementName The name of the element
    * @apiSuccess {string} OID 
    * @apiError {object} return null
    * @apiGroup Elements    
    */    
    getOIDbyName( elementName) {
        let element = this.dom.elementByName( elementName);
        let saveable = this.dom.getSaveableParent( element);
        return this.dom.attr( saveable, 'ud_oid');     
    } // API.getOIDbyName()     

   /**
    * @api {JS} API.checkAndWriteValue(path,value,expr) Check and write a value
    * @apiParam {string} path The dotted expression where valid value is to be written
    * @apiParam {mixed} value The value to  be written
    * @apiParam {string} expr The expression to evaluate if value is valid
    * @apiSuccess {boolean} True if validated
    * @apiError {string} Error message
    * @apiGroup Data   
    */    
    checkAndWriteValue( path, value, expr, successCallback="", failureCallback="") {
        let validateExpr = expr.replace( /this/g, value);
        // ValueHolder = currentQuestion value = placeHolder if empty
        if ( !validateExpr || this.calc.eval( validateExpr)) {
            // Value is accepted
            let target =  this.dom.domvalue.value( path + "._element");
            //let target =  this.dom.domvalue.value( path, value + "._element");
            target.textContent = value;
            API.setChanged( target);
            //this.dom.domvalue.value( path, value);
            //API.setChanged( this.dom.lastAccessedElement);
            if ( successCallback) {
                // Backword compatibility with Questions app - remove when this module is used
                if ( typeof window[ successCallback] == "function") window[ successCallback]();
                // Use API
                else $$$[successCallback]();
            }
            return true;
        }
        // Value is not accepted
        if ( failureCallback) $$$[failureCallback](); //window[ failureCallback]( error);
        else {
            // Default handling of unaccepted values
            let error = "Error: ";
            error += API.translateTerm( "Unacceptable value");
            // Display in banner 2DO insert element 
            API.pageBanner( 'temp', error);
        }
        return false;
    } // API.checkAndWriteValue()  

    getRadioValue( elementOrId) {
        let element = this.dom.element( elementOrId);
        if ( !element) return "";
        let saveable = this.dom.getSaveableParent( element);
        let radios = this.dom.elements( "input[type='radio']", saveable);
        for ( let radio of radios) if ( radio.checked) return radio.value;
        return "";
    }
    
/* getfile_include end */     
    
} // JS class UDapiSet1
    

if ( typeof process == 'object')
{
    // Testing under node.js
    module.exports = { class: UDapiSet1};    
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined" && typeof ModuleUnderTest == "undefined") { 
        ModuleUnderTest = "apiset1.js";
        console.log( "Syntax OK");
        console.log( 'apiset1.js Test completed'); 
    }        
} // End of test routine