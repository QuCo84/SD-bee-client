// SPDX-License-Identifier: GPL-3.0
/**
 *   Implements the UniversalDoc Javascript class for exchanging editable HTML elements under a specific DIV with a server. Operations
 *   include saving changes and newly created elements as well as fetching updates from the server when multiple users may work on the
 *   same document.
 *
 *   <p>The class is designed to work alongside a javascript-powered viewer or editor which calls the viewEvent() method to indicate operations 
 *   that have been performed on an element.
 *   From the server, 3 sets of data are expected :
 *     <li>HTML containing multiple elements from the document combined with javascript for creating an instance of the UniversalDoc
 *       class and invoking methods of this class needed to initialize the document. This content is sent within the complete page when a
 *       page is loaded or just the HTML of the document when a refresh or a new document is requested from the server. </li>
 *     <li>JSON content for the update of a single HTML element within the document</li>
 *     <li>JSON content with the list of HTML elements inserted or deleted recently</li></p>
 * 
 *   <p>Each HTML element's id has a specific format which makes it possible for multple instances of the class to generate new ids 
 *   simultanously and for the server to arrange elements in the right order.</p>
 *
 *   <p>Application-specific attributes are used to control the behaviour and some of these must be initially included in the HTML sent by
 *   the server. The ud.php is the "sister" of this module and generates the expected HTML from data retrieved from a database.
 *   The attributes are listed with comments in the CONSTANTS section of this program.</p>
 *     
 * @package VIEW-MODEL 
 *
 */
 /*
 function requestEditor( fct, callerElement, index)
{
  console.log( "Request Editor", typeof callerElement);
  if ( typeof callerElement == "string")
    document.getElementById( 'UDErequest').textContent += "requestEditor|"+fct+"('"+callerElement+"','"+index+"');\n";
  else
    document.getElementById( 'UDErequest').textContent += "requestEditor|"+fct+"('"+callerElement.getAttribute("_value"+index)+"');\n";
} // requestEditor()
*/

/**
 * The UniversalDoc JS class provides the client-side part of the View Model and is ivoked by the onload Javascript generated
 * by the server-side part of the View-Model.
 *
 * <p>Its tasks are the following :
 *    <li>set up browser encapsulation classes : DOM, DOMcursor and UDAJAX</li>
 *    <li>initialise the JS API</li>
 *    <li>setup the UD editor (ude.js) which will in turn set up the calculator for handling formulae 
 *    <li>monitor the DOM provided by the server and send changes on individual eements, including inserts and suppressions,
 *    back to the server</li>
 *    <li>query the server for updates made elsewhere and update the DOM with these<li>
 *    <li>monitor the network and session status</li>
 *    <li>reload the page when session is down, to get logged out page</li>
 * </p>
 *
 * @package VIEW-MODEL
 */
class UniversalDoc
{
   /**
    * @namespace
    * @property {object}  defaults Default values for attributes which control the object's behaviourinteger
    * @property {integer} defaults.tick Nb of ms in a tick (100)
    * @property {integer} defaults.minTicksToSave Minimum nb of ticks after last change that an element can be saved (10 ticks)
    * @property {integer} defaults.maxTicksToFetch Maximum nb of ticks between fetches (120  ticks)
    * @property {integer} defaults.maxTicksDisconnected Maximum nb of ticks class can be disconnected (1200) 
    * @property {integer} defaults.autoreloadTicks Maximum nb of ticks before page refresh (0 = inactive)   
    * @property {integer} defaults.idleTicks Idle status after this many ticks without event(600)  
    * @property {integer}    
    * @property {integer}    
    * @property {integer}
    */
    minTicksToSave = 10;                //    
    maxTicksToFetch = 1200;             // 
    maxTicksDisconnected = 1200;        // Close window, or clear content if disconnected
    autoReloadTicks = 0; // 30000;      // Automatic refresh page time (if idle), disabled if 0
    idleTicks = 6000;                   // Ticks without a view event generating idle status
    ticksInfo = 100;                    // Display info during 
    ticksToInfo = 12000;                // Display info    
    minIdStep = 300;                    // Mininum step in id block n°s
    server = "http://dev.rfolks.com";   // Server for AJAX requests 2DO www and switch to dev in constructor REPLACED WITH VARIABLED DEFINED IN require-config
    service = "webdesk";                // Service for AJAX requests REPLACED WITH VARIABLE require-config
    fetchAction = "AJAX_fetch";
    refreshAction = { model: "AJAX_modelShow", model3: "AJAX_modelShow", edit2: "AJAX_show", edit3: "AJAX_show", display2:"AJAX_show"};
    serverFormName = "INPUT_UDE_FETCH";
    serverTime = 0;
    /*
    exTagMap = { 
         4: "div.part", 5:"div.zone", 6:"h1", 7:"h2", 8:"h3", 9:"h4", 10:"p", 11:"p.subpara",
        12: "div.table", 13:"div.list", 14:"div.graphic", 15:"div.linetext", 16:"div.server", 17:"div.css", 18:"div.js", 19:"div.json",
        20: "div.apiCalls", 21: "div.chart", 22: "div.audio", 23:"div.video",
        31: "div.zoneToFill", 32: "div.filledZone", 51: "div.page",
        60: "div.html", 61: "div.html.emailTemplate2col",
        80: "div.connector", 81: "div.connector.csv", 82: "div.connector.site", 83: "div.connector.googleDrive", 84: "div.connector.dataGloop",
        85: "div.connector.googleCalendar", 86: "div.connector.dropZone", 87: "div.connector.service", 88: "div.connector.document",
        89 : "div.connector.googleSheet", 90 : "div.connector.googleDoc", 
        100: "p.undefined"
     };
    tagMap = { h1:6, h2:7, h3:8, h4:9, p:10}; // h5 h6
    mapDiv = { 
        part:4, subpart:5, zone:5, table:12, list:13, graphic:14, linetext:15, 
        server:16, css:17, js:18, json:19, api:20, chart:21, audio:22, video:23,
        zoneToFill:31, page:51,
        html:60, "html.emailTemplate2col":61,
        connector:80, "connector.csv":81, "connector.site": 82, "connector.googleDrive": 83, "connector.dataGloop": 84,
    };
    */
    /*
    earlyInit = [ 
        'div.list', 'div.table', 'div.graphic', 
        'div.text', 'div.linetext', 'div.server', 'div.json', 'div.css', 'div.js', 'div.api', 'div.resource',
        'div.connector', 'div.html'
    ];
    */    
     
    reverseTagMap ={};
    historyElementId = "UD_history";    // Name of element used to store navigation history
     
    // Variables    
    ticks = 0;                          // 100ms tick counts
    tickOffset;                         // Not used 
    timestamp = 0;
    lastViewEventTicks = 0;             // Ticks at last viewEvent
    topElement;                         // HTML element that contains all elements of the document managed here
    elementsToSave = [];                // List of HTML elements that need saving
    elementsToFetch = [];               // List of HTML elements that need re-fetching
    serverRequestId = 1;                // Counter to identify requests sent to server
    userId;                             // User's id provided by server in base 32 for element naming
    autoLayoutAdjust = true;            // adjust height of scroll & document divs
    ownerId;                            // Doc owner's id provided by server in base 32 for element naming 
    user_id;                            // User's id in base 10 for access control
    mode;                               // page's edition mode, retrieved from UD_mode element
    sync = true;                       // Allow or diable synchronisation with server 
    
    
    ude=null;                           // Editor or viewer instance
    dom=null;                           // DOM instance (created by UDE)
    udajax = null;                      // Instance of UDAJAX for communication with the server
    udlocal = null;                     // Instance of UDSAVE for local saving of data
    api = null;                         // Instance of UDapi class for running commands
    networkStatus =                     // Network status
      { connected:true, secure:false, session:true, dchanged:0, dlastfocus:0};
    info =                              // Info zone
      { displayed:false, dstarted:0, dlastDisplay:0};
    botlog = { busy: false, openToServer:false, call:null, log:{}}
    infoZoneName = "";
    infoZone = null;
    localStorageStatus = {};            // Status of local storage
    apiBuffer_requests = UDapiBuffer_requests;
    triggeredActions = [];
    currentURL = "";                    // Latest request to fill document
    
    // Node.js/JSDOM mode
    unitTesting = false;
    currentPage = null;                 // points to JSDOM implementation of page
    
    syncRemovePending = [];
    
   /**
    * Create a new UniversalDoc instance
    * @param {string} top Id of top element, usually "document"
    * @param {boolean} editable true if at least some of the content is editable
    * @param {integer] user Id of user (needed to for multi-user control of editing)
    *   
    */
   constructor( top, editable=false, user) // 2DO add service
   {
        var testing = false;
        if ( typeof process == 'object') 
        { 
            testing = true; 
            this.unitTesting = true;
        }
        
        //
        window.ud = this;    
        
        // Find top element
        this.topElement = document.getElementById(top);
        if ( !this.topElement)
        {
            // 2DO debug message and message to user (faulty doc)
            return;
        }    

        // Save user id in base 10 and base 32
        this.user_id = user;
        this.userId = ("00000"+user.toString( 32)).slice(-5).toUpperCase(); 
        this.ownerId = this.userId; // Roadmap : server must be provide this somehow
        
        // Set container as contenteditable if editable
        if ( editable) this.topElement.setAttribute( 'contenteditable', 'true');
        
        // SETUP BROWSER CLASSES        

        // Set up access to DOM via the DOM and DOMcursor classes
        //if ( typeof process == 'object') this.dom = new window.DOM( this.topElement, this);  
        this.dom = new DOM( this.topElement, this);
                 
        // Temp instruction for monitoring nb of DOM elements for ecoindex
        console.log( "Page contains " + document.getElementsByTagName( '*').length + ' elements');
        /*
        // Get network status and instantiate UDAJAX
        let url = window.location.href.split('/');
        this.server = url[0]+'//'+url[2];
        */
        /*
        if ( window.location.href.substr( 0, 5) == "https")
        {
            this.networkStatus.secure = true;
            this.server = "https://www.rfolks.com";
        }    
        else if ( window.location.href.indexOf('www') > -1) this.server = "http://www.rfolks.com";
        */
        if ( testing && typeof UD_SERVER == "undefined") {
            const UD_SERVER = "http://dev.rfolks.com";
            const UD_SERVICE = "webdesk"; 
            this.udajax = new UDAJAX( this, UD_SERVER, UD_SERVICE);            
        } else { this.udajax = new UDAJAX( this, UD_SERVER, UD_SERVICE);}
        /*if ( typeof process == 'object') this.udajax = new UDAJAX( this, this.server, this.service);
        else this.udajax = new UDAJAX( this, this.server, this.service)*/
        if ( this.udajax) this.networkStatus.connected = true;
       
        // Get local storage status
        if ( !testing && window.localStorage) this.localStorageStatus['present'] = true;  

        // Setup $$$ function library (API)
        if ( typeof UDapi == "undefined")
            this.ude.loadScript( "ud-view-model/udapi.js", "window.ud.api = new UDapi( window.ud);", "UDapi", "UDapi");
        else this.api = setupAPI( this); // new UDapi( this);

        // UDE - UniversalDocEditor
        /*if ( typeof process == 'object') this.ude =  new window.UDE( this.topElement, this);
        else*/
        this.ude =  new UDE( this.topElement, this);
        this.api.ude = this.ude;
        this.api.calc = this.ude.calc;
                       
        // Document attributes
        if ( typeof window.udAttributes == "undefined")
        {
            let newWindow = "yes";
            let options = document.getElementsByName( '_new_window');
            if ( options.length == 1 && !options[0].checked) newWindow = "no";
            window.udAttributes = { newWindowOnFiles:newWindow};
        }
            
        // Set contentEditable on parts
        // Get all parts as children of document
        let parts = this.dom.childrenOfClass( this.topElement, 'part');
        for ( let parti=0; parti < parts.length; parti++)
        {
            let part = parts[ parti];
            if ( part.classList.contains( 'NoEdit')) this.dom.attr( part, 'contenteditable', "false");
            //  stage edited items will be made contenteditable by ude in stageEditing        
        }
        
        //this.initialiseElement = function() { return true;}
        //API.initialiseElement = function() { return true;} // TEMP Disactivate initialiseELement as automatic      
                
        // Set up information zone
        if ( this.infoZoneName) this.infoZone = document.getElementById( this.infoZoneName);
        let modeHolder = this.dom.element( 'UD_mode');
        if ( modeHolder) this.mode = modeHolder.textContent;
        
        let footer = document.getElementById( 'footer');
        if (footer) { this.displayFooter();}
        
        // 2DO Check document call fct / All ids unique / Manage part / 1 visible part / => error message provide by server but invisible
        
        // Shortcuts for background tasks
        this.pageBanner = $$$.getShortCut( 'pageBanner');
        this.botlogUpdate = $$$.getShortcut( 'botlogUpdate');
        this.getParameter = $$$.getShortcut( 'getParameter');
        this.apiPoll = $$$.getShortcut( 'poll');

        // Start background task for detecting modified elements and listen to window focus as TO only works when ther's focus
        setInterval( function(self) {return function() {self.heartbeat();}}(this), 100); 
        window.addEventListener("focus", function(event) { window.ud.focusEvent();});
        
        // Initialise document
        this.initialise();
        
        debug( {level:3}, "UniversalDoc up and running");

        // Try Firefox debug( 3, null, navigator.clipboard.readText());
     
   } // UniversalDocElement.constructor()
   
   initialise() {
        // console.log( this.api.json.value( UD_exTagAndClassInfo, 'p'), UD_exTagAndClassInfo[ 'div.video']);
        // Animate banner for version
        let banner = this.dom.element( 'banner');
        banner.style.backgroundColor = "rgb( 241,208,208,1)";
        // setTimeout( function() {  banner.style.backgroundColor = "rgb( 208,234,241,1)";}, 2000);
        setTimeout( function() {  banner.style.backgroundColor = "rgb( 208,234,241,1)";}, 2000);        
        // Initialise elements
        let elements = this.dom.elements( '*', this.topElement);
        let elLen = elements.length;
        let gval = this.dom.udjson.value;
        if ( typeof UD_exTagAndClassInfo == "undefined") {
            UD_exTagAndClassInfo = UD_register[ 'UD_exTagAndClassInfo'];
        }
        for (let eli=0; eli <elLen; eli++) {
            let element = elements[eli];
            let exTag = this.dom.attr( element, 'exTag');
            let oid = this.dom.attr( element, 'ud_oid');
            if ( element.nodeType == Node.ELEMENT_NODE && oid 
                && ( gval( UD_exTagAndClassInfo[ exTag], 'earlyInit')
                    || gval( UD_exTagAndClassInfo[ exTag], 'useTextEditor'))
                //this.earlyInit.indexOf( exTag) > -1) 
            ) {
                try { this.initialiseElement( element.id);}
                catch( e) { console.log( "ERR. Can't initialise " + element.id, e);}
                // 2DO read ud_extra and set direct attributes accordingly
            }
            else if ( this.dom.attr( element, 'onclick') && !API.testEditorAttr( element, 'ude_edit')) {
                // Make sure clickable non-editable elements have contenteditable turned off
                this.dom.attr( element, 'contenteditable', 'false');
            }
        }
        // Set up View selector
        //setTimeout( function() {
        let views = this.dom.elements( "li.viewoutline", this.dom.element( "document-outline")); 
        let viewSelector = this.dom.element( 'view-selector');
        let currentPart =  this.dom.element( 'div.part:not(.hidden)', this.dom.element( 'document'));
        let currentPartName = this.dom.attr( currentPart, 'name');        
        let appViewName = "";
        if ( viewSelector && views && views.length > 1 && window.innerWidth > 800) {
            for ( let viewi = 0; viewi < views.length; viewi++) {
                let view = views[ viewi];
                let viewName = view.textContent; // 2DO span, sub span
                // Grab App view name for mobile mode
                if ( !appViewName && this.dom.attr( view, 'ud_type') == "app") appViewName = this.dom.attr( view, 'name');
                let switchName = viewName.toLowerCase().replace( / /g, '_')+"sel";   
                let click = "API.switchView( '"+viewName+"', '"+switchName+"');"              
                let className = 'tab';
                if ( [ 'managesel', 'botlogsel', 'gérersel'].indexOf( switchName) > -1) className += ' right';
                else className += ' left';                
                if (  currentPartName == viewName) {
                    className += ' active';
                   
                }
                let label = viewName;
                if ( label.length > 15) label = viewName.substring( 0, 6) + '...' + viewName.substring( label.length-6);
                let viewCtrl = API.dom.insertElement( 'span', label, { id: switchName, class:className, onclick:click, title:viewName}, viewSelector, true, true);
                // Check view's content if empty
                // 2DO BUG View is list entry in outline, use viewName to find real view, rename variables
                let viewEl = this.dom.elementByName( viewName);
                if ( this.dom.children(viewEl).length == 0) { 
                    setTimeout( function() {
                        API.updateContentAfterEvent( viewEl, { eventType:"emptyView"});
                    }, 1000);
                }
            }            
            API.dom.insertElement( 'span', "+", { id: "newView", class:"tab left", onclick:"API.addView();"}, viewSelector, true, true);
        } else if ( viewSelector) { viewSelector.classList.add( 'hidden');}
        // Show default or app part according to screen width
        debug( {level:1}, "Default view " + currentPartName + ' ' + appViewName);
        if (  appViewName && window.innerWidth < this.ude.minWidthFloater) API.switchView( appViewName);
        else API.switchView( currentPartName);
        // Patch 240318 to run app script once loaded on default view
        let viewScript = 'view_load_' + currentPartName;
        setTimeout( function() {
            if ( typeof global[ viewScript] == "function") global[ viewScript]();
        }, 1000);
        // Trial Tablet : hide header if staging systematic
        /*
        // Auto paging trial on h2
        let titles = this.dom.children( 'h2', 'document');
        for ( let titlei=0; titlei < titles.length; titlei++) {
            let titleEl = titles[ titlei];
            let breakBefore = this.dom.attr( titleEl, 'computed_break-before');
            if ( breakBefore == "page" && titleEl.previousSibling) {
                this.dom.insertElement( 'div'). Need insert pageBreak
            }
        }
        */

   }
   
   /**
    * Process events from VIEW package, ie editor.
    * @param {string} e Event name: focus, changeClass, change; changeTag, create, delete or server remove
    * @param {HTMLelement} element The element concerned by the event or its id
    * @return {HTMLelement} The saveable parent element contained the element 
    */
   viewEvent( e, element)
   {
        // Check element
        if ( typeof element == "string") element = this.dom.element( element);
        if ( !element || typeof element.tagName == "undefined") return false;
        
        // Check element not outisde document
        if ( [ 'scroll', 'middleColumn', 'content', 'body'].indexOf( element.id) > -1) return;
        
        // Note ticks
        this.lastViewEventTicks = this.ticks;
        // Look for a saveableParent
        let saveableParent = this.dom.getSaveableParent( element);
        // Page or View saveableParent not allowed 
        if ( 
            saveableParent && saveableParent != element
            //&& e != "changeClass" 
            && ( saveableParent.classList.contains( 'page') || saveableParent.classList.contains( 'part'))
        ) {
            saveableParent = null;
        }
        // Look at type of event
        switch (e)
        {
            case "focus" :
                // User has just entered this elements
                // Check last update time to if if re-fetching is required
                // Release prevous and reserve this one Pt to user tlabel editing
                break;
                
            case "changeClass" :
            case "change" : 
                // Element has just been changed in VIEW
                // Check element ok for saving
                if (
                    !saveableParent 
                    || this.dom.attr( saveableParent, 'ud_oid') == "__NONE__"
                    || this.dom.attr( saveableParent, 'ud_oid') == ""
                    || this.dom.attr( saveableParent, 'ud_dchanged') == ""
                    || this.dom.attr( saveableParent, 'ud_dupdated') == ""
                ) {
                    return debug( { level:1, return:null}, "Cannot set as changed an unknown or incorrect element", element);
                }
                this.dom.attr( saveableParent, "ud_dchanged", this.ticks);
                // 2DO add to list of elements to watch
                break;
        
            case "changeTag" : {
                // Element has been recreated with a new tag
                let newId = this.computeId( element);
                if ( newId != element.id) {
                    element.id = newId;
                    this.dom.attr( element, 'ud_saveId', "yes");
                }
                // Substitute AutoIndexes
                let name = this.buildName( element);
                if ( name) { 
                    // Element contained AutoIndex_xxx so update content
                    this.dom.attr( element, 'name', name);
                }
                this.dom.attr( element, 'ud_dchanged', this.ticks);
                // 2DO Add on to watch list
            break;}
            case "createView" :
                {
                    // Compute new OID
                    let oid = this.dom.parentAttr( element.parentNode, "ud_oid"); 
                    oid = "UniversalDocElement--"+oid.split('--')[1]+"-21-0"; 
                    // Add attributes to element
                    this.dom.attr( element, 'ud_oid', oid);
                    this.dom.attr( element, 'ud_dupdated', this.ticks - 1); 
                    this.dom.attr( element, 'ud_dchanged', this.ticks);
                    this.dom.attr( element, 'ud_dbaction', "insert");
                }
                break;
            case "create" : {
                // Element has just been created in VIEW        
                // Set element's ID
                if ( !element.id || element.id.length < 17 || element.id.indexOf( '__TMP') == 0) {
                    if ( element.id && element.id.indexOf( '__TMP') == 0) element.id = "";
                    element.id = this.computeId( element);
                }    
                // Determine oid
                let parent = element.parentNode;
                if ( this.dom.attr( parent, 'ud_type') == "page") parent = parent.parentNode;
                let oid = this.dom.parentAttr( parent, "ud_oid"); // getParentAttribute( "", "ud_oid", element);
                if ( oid.indexOf( '_FILE_UniversalDocElement') > -1) {
                    // OS version
                    let oidA = oid.split( '--')
                    oid = oidA[0] + '-_FILE_UniversalDocElement-' + element.id + '--' + oidA[1] + '-21-0';
                } else {
                    // SOILinks version 
                    oid += "-"+oid.split('--')[1].split('-').slice( 0, 1)+"-0";    
                }
                
                // Set app attributes
                this.dom.attr( element, 'ud_oid', oid);
                this.dom.attr( element, 'ud_dupdated', this.ticks - 1); 
                this.dom.attr( element, 'ud_dchanged', this.ticks);
                this.dom.attr( element, 'ud_dbaction', "insert");  
                this.dom.attr( element, 'ud_saveId', "yes");              
                // Substitute blockName into content
                element.innerHTML = element.innerHTML.replace( /{id}/g, element.id);
                let name = this.buildName( element);
                if ( name) { this.dom.attr( element, 'name', name);}
            break;}
            case "move" :  // element has been movde so recompute db name used for positioning
                let oldDBname = element.id
                element.id = this.computeId( element, true);
                this.dom.attr( element, 'ud_saveId', "yes");
                this.dom.attr( element, 'ud_dchanged', this.ticks);
                // 2DO seek & change oldName in programs, sources etc
                debug( {level:3}, "Moved "+oldDBname+"to "+element.id);
                break;
            case "delete" :
                if (!saveableParent) break;
                this.dom.attr( saveableParent, 'ud_dchanged', this.ticks);
                this.dom.attr( saveableParent, 'ud_dbaction', 'remove'); 
                // Add to update list if request isn't already sent
                let sent = this.dom.attr( element, "ud_dsent");
                if ( !sent) this.syncRemovePending.push( saveableParent.id);            
                break;
            case "server remove" : // 2DO should be in viewModelEvent
                element.remove();
                break;        
     }
     return saveableParent;
   } // UniversalDoc.viewEvent()
   
    computeId( element, moving=false) {
        let saveableElements = [];
        let saveableIndex = -1;
        let partId = "";
        let parts = [];
        let currentId = element.id;
        // Find View (part)
        let walkElement = element.parentNode;
        let safe = 5;
        while ( !walkElement.classList.contains('part') && safe--) walkElement = walkElement.parentNode;
        if ( !walkElement.classList.contains('part')) return debug( {level:2, return:false}, "Can't find element's part in parts", element);
        partId = this.dom.attr( walkElement, 'id').substring( 0, 13);
        parts = this.dom.childrenOfClass( this.topElement, "part"); // elements( ".part", this.topElement);
        for ( var i=0; i < parts.length; i++) { 
            if ( this.dom.attr( parts[i], 'id').substring( 0, 13) == partId) break;
        }
        if ( i == parts.length) {
            return debug( {level:2, return:false}, "Can't find element's part in parts", element, parts);
        }
        let part = parts[i];
        partId = partId.substring( 0, 3);
        // Get list of elements in view
        let elements = part.getElementsByTagName('*');
        for (let eli=0; eli < elements.length; eli++)
        {
            let el = elements[eli];
            let id = this.dom.attr( el, 'id');
            if ( this.dom.attr( el, 'ud_oid') && id.length>=15 && id.substring( 0, 3) == partId) {
                saveableElements.push( id);
                if ( el == element) saveableIndex = saveableElements.length-1;
            } else if ( el == element) {
                saveableIndex = saveableElements.length;
                saveableElements.push( "BTOFIND");
            }
        }
        // Find Previous and Next elements from saveable
        let prev = null; //element.previousSibling;
        if ( saveableIndex >= 1)
            prev = this.dom.element( saveableElements[ saveableIndex-1]);
        let next = null; // element.nextSibling;
        if ( saveableIndex > -1 && saveableIndex < saveableElements.length - 1) 
            next = this.dom.element( saveableElements[ saveableIndex+1]); 
        
        // Compute id (nname in db) of block       
        // B<block 2><element 10><user 5>
        // Future-proofness : 1st letter can be used to indicate counting schema
        let id, prevId, nextId, newId, user;
        // Id part is 10 32-base digits (in capitals)
        if ( prev) prevId = parseInt( prev.id.substring( 3, 13), 32);
        else prevId = 1;
        let maxId = parseInt( 'VVVVVVVVVV', 32) - this.minIdStep * 2;
        if ( next)  {
            nextId = parseInt( next.id.substring( 3, 13), 32);
        } else {
            nextId = Math.min( prevId + this.minIdStep*16, maxId);
        }
        // Compute newId
        let halfwayId = Math.round(( prevId + nextId)/2);
        let minId = prevId + this.minIdStep*0.5;
        let maxNextId = nextId - this.minIdStep*0.5;
        if ( maxNextId < minId)
        {                   
            debug( { level:2}, "renumbering required (server or JS)");
            minId = prevId + 10;
            maxNextId = nextId - 10;
            if ( maxNextId <= minId) {
                alert( "Technical issue with block ids, reloading");
                this.reload( true);
            }
        }                    
        //let bestId = prevId + 2*this.minIdStep;
        let bestId = prevId + this.getDBidStepFactor( element) * this.minIdStep;
        if ( bestId < maxNextId && bestId > minId) newId = bestId;
        else if ( halfwayId < maxNextId && halfwayId > minId) newId = halfwayId;
        else newId = maxNextId;
        // NewId halfway between prev and next
        // newId = Math.round(( prevId + nextId)/2);
        if ( !moving) {
            // Don't change change existing id for higher nb
            let currentBlockId = parseInt( currentId.substring( 3, 13), 32);
            if ( currentId && currentBlockId < newId) return currentId; 
        }
        // Build string id
        newId = newId.toString( 32);
        debug( { level:3}, "newId :" + newId)
        // User part is 5 32-base digits (in capitals)
        user = ("00000"+this.userId).slice(-5).toUpperCase();        
        // Complete id field B010123456901234
        id = partId+( "0000000000"+newId).slice(-10).toUpperCase()+user;      
        return id;
    } // UniversalDoc.computeId()
   /**
    * Process events from VIEW-MODEL server-side.
    * @param {string} e Event name: 
    * @param {HTMLelement} element concerned by the event
    */
    viewModelEvent( e, element)
    {
    } // UniversalDoc.viewModelEvent()
    
   /**
    * Handle doc's window just got focus
    */
    focusEvent() {
        // Store ticks of last focus for network status monitoring and disconnect
        this.networkStatus.dlastfocus = this.ticks;
        // Update ticks using last recorded timestamp  
        let lost = Date.now() - this.timestamp;
        this.ticks += Math.round( lost/100);
        // Provoke events based on maxTicksToFetch
        if ( lost >= this.maxTicksToFetch) {          
           this.ticks = Math.round( this.ticks / this.maxTicksToFetch) * this.maxTicksToFetch - 5;
        }
        debug( {level:3}, "Window has focus");
    }
   
   /**
    * 100ms tick to handle background tasks.
    * <p>Background tasks are :
    * <li>check network status</li>
    * <li>handle info display</li>
    * <li>reload if del </li>
    * <li>botlog update and thinling indicator</li>
    * <li>send updates to server</li>
    * <li>sizing and positionning of elements</li>
    *</p>
    * 
    */
    // Background task (auto save)
    heartbeat()
    {
        // Increment tick counter
        this.ticks++;
        this.timestamp = Date.now();
        
        // Check session
        let status = this.networkStatus.session;
        if ( typeof this.networkStatus.save == "undefined")
            this.networkStatus.save = {connected:this.networkStatus.connected, secure:this.networkStatus.secure, session:status};
        else if ( this.networkStatus.save.session != status)
        {
            // Note new status and time of change
            this.networkStatus.save.session = status;            
            this.networkStatus.dchanged = ( this.networkStatus.dlastfocus) ? this.networkStatus.dlastfocus : this.ticks;
            this.networkStatus.dlastfocus = 0;
        }
        else if ( !status && (this.ticks - this.networkStatus.dchanged) > this.maxTicksDisconnected)
        {
            // Session really lost, close content (2DO or refresh if home)
            this.networkStatus.dchanged = this.ticks;
            this.reload( ( this.dom.attr( this.topElement, 'ud_oid') != "UniversalDocElement--21--{OIDPARAM}"));
        }
        else if ( status && this.infoZone && !this.info.display && (this.ticks - this.info.dlastDisplay) > this.ticksToInfo)
        {
            this.info.display = true;
            this.info.dstarted = this.ticks;
            this.infoZone = document.getElementById( this.infoZoneName);
            //this.infoZone.style.display = "block"; 
            //this.api.pageBanner( 'set', "Your free acess is financed by sponsored information flashes");
        }
        else if ( this.infoZone && this.info.display && (this.ticks - this.info.dstarted) > this.ticksInfo)
        {            
            this.pageBanner( 'clear');
            this.infoZone.style.display = "none";
            this.info.display = false;            
            this.info.dlastDisplay = this.ticks;            
        }
             
        // Reload after so many ticks if idle so we make sure unauthorised data doesn't remain displayed
        if ( this.autoReloadTicks && this.ticks > this.autoReloadTicks && ( this.ticks - this.lastViewEventTicks) > this.idleTicks) 
        {
            this.dom.cursor.save();
            this.reload( false);
            this.lastViewEventTicks = this.ticks;
            this.dom.cusor.restore();
        }
                
        // Update busy status
        let busy = false;
        busy  = ( this.elementsToSave.length > 0) | ( this.elementsToFetch.length > 0);
        busy |= this.botlogUpdate( 'busy') | this.ude.isBusy() | this.udajax.isBusy(); 
        busy |= (requirejs_app != "onloaded");
        this.botlog.busy = busy;
        // Set indicator
        if ( busy && false) { 
            console.log( "SAVE/botlog/UDE/UDAJAX", this.elementsToSave.length, API.botlogUpdate( 'busy'), this.ude.isBusy(), this.udajax.isBusy()); 
        }
        if ( this.api) this.api.LED( 'STATUS_busy', !busy);
        
        // Save or fetch next element (only 1 per beat)
        if ( this.elementsToSave.length > 0) this.saveElement( this.elementsToSave.shift());
        else if ( this.elementsToFetch.length > 0) this.fetchElement( this.elementsToFetch.shift());
        
        // Fill list of elements to update /*unless unitTesting in which case there is no saving*/
        if (this.ticks % (this.minTicksToSave/2) == 0 /*&& !this.unitTesting*/)
        {
            // Examine all elements to find which need saving or fetching
            //let elements = [ this.topElement];
            //elements = elements.concat( this.topElement.getElementsByTagName('*'));
            // let elements = this.topElement.getElementsByTagName('*');
            let elements = document.querySelectorAll( '#document *');
            for (let i =0; i <elements.length; i++)
            {
                let element = elements[i];
                if ( 
                    element.nodeType == 1 
                    && this.dom.attr( element, 'ud_dchanged') && !this.dom.attr( element, 'ud_dsent')
                )
                {
                    let changeTime = parseInt( this.dom.attr( element, 'ud_dchanged'));
                    let updatedTime = parseInt( this.dom.attr( element, 'ud_dupdated'));
                    if (
                        changeTime > updatedTime && ( this.ticks - changeTime) > this.minTicksToSave
                        && this.elementsToSave.indexOf( element) == -1
                    )
                    {
                        debug( { level:5}, " Save ", this.dom.attr( element, 'ud_oid'));
                        this.elementsToSave.push( element); 
                    }
                    /*
                    else if ( 
                        this.isFetchable( element) 
                        && changeTime < updatedTime
                        && updatedTime < (this.ticks - this.maxTicksToFetch + Math.round( Math.random()*100)))
                    {
                        debug( { level: 2}, " Fetch ", element.getAttribute('ud_oid'));
                        this.elementsToFetch.push( element); 
                
                    }
                    */
                }
                else if ( this.dom.attr( element, 'ud_refresh').toLowerCase() == "yes")
                {
                    // 2DO less frequently
                    this.ude.dispatchEditEvent( element, {event:"refresh"});
                }                
            }
            if (this.ticks % (this.maxTicksToFetch) == 0) this.syncWithServer();           
        }
      
        // API
        if ( this.apiPoll) this.apiPoll( 5);
      
        // 5 secs routines
        if ( ( this.ticks % 50) == 0 || this.ticks < 20)
        {
             // Manage height of content container
            if ( this.autoLayoutAdjust) {
                let windowH = window.innerHeight;            
                let content = this.dom.element( "content");
                let scroll = this.dom.element( "scroll");
                let viewSel = this.dom.element( 'view-selector');
                if ( content && scroll) {
                    let heightM = scroll.offsetHeight;
                    let heightC = content.offsetHeight;
                    let targetH = (this.ude.tabletMode) ? windowH - 30 : windowH - 70 - 30; // Header and footer
                    if ( this.dom.element( 'p9')) { targetH -= 22;} // DEV debug zone (p9)   
                    //if ( heightC < heightM+10) { content.style.height = (heightM+10)+"px";}                     
                    if ( heightC != targetH && this.dom.attr( scroll, "computed_overflowY") == "scroll") { 
                        // Setup content and scroll height
                        content.style.height = targetH + "px";
                        let scrollH = targetH;
                        scrollH -= ( this.dom.attr( scroll, 'computed_marginTop') + this.dom.attr( scroll, 'computed_marginBottom'));
                        scrollH -= ( viewSel) ? viewSel.offsetHeight : 0;
                        scroll.style.height = scrollH + "px";
                    } else if ( heightC != targetH){
                        // Setup content height                    
                        let doc = this.dom.element( 'document');
                        let heightD = doc.offsetHeight;
                        //content.style.height = heightD + "px";
                        content.style.height = targetH + "px";
                        doc.style.height = ( targetH - 20) + "px"; // vewSelector height
                    } else { 
                        this.dom.element( 'footer').classList.remove( 'hidden');
                    }
                }
                if ( this.getParameter( 'device_isMobile') == "yes") this.autoLayoutAdjust = false;
            }
            /*
            // Save cursor positions trial
            let views = this.dom.elements( "div.part", this.topElement);
            let navInfo = "{";
            for ( let viewi = 0; viewi < views.length; viewi++) {
                let view = views[ viewi];
                let savedCursorIndex = this.dom.attr( view, 'ud_cursor');
                if ( savedCursorIndex && savedCursorIndex > -1) { 
                    navInfo += '"'+this.dom.attr( view, 'name') + '":' + savedCursorIndex + ' '+ this.dom.cursor.savedCursorAsString( savedCursorIndex);
                }
            }
            navInfo += "}";
            if ( navInfo != "{}") console.log( "Cursor info test", navInfo)
                */
        }
    } // UniversalDoc.heartbeat()
       
   /**
    * Display footer after adjusting position (based on content's height)
    */
    displayFooter() {
        let content = this.dom.element( "content");
        let scroll = this.dom.element( "scroll");
        if ( content && scroll) {
            let heightM = scroll.offsetHeight;
            let heightC = content.offsetHeight; 
            if ( heightC < heightM+10) { content.style.height = (heightM+10)+"px";} 
            this.dom.element( 'footer').classList.remove( 'hidden'); // style.display = "block";
        }        
    } // UniversalDoc.displayFooter()
    
   /**
    * Save an element.
    * @param {HTMLelement} element The element to save
    */
   saveElement( element) // saveOrUpdateElement
   {
        // 2DO start by DBtype, don't get innerHTML for containers and don't write content (UDAJAX)        
        // if ( element.) this.fetchElement
        if ( typeof element == "string")
        {
            element = this.dom.element( element);
            if ( !element) return debug( { level:2, return: false}, "Can't find id to save", element);
        } 
        // TRIAL Don't save non editable elements
        if ( !this.dom.isEditable( element)) { 
            this.dom.attr( element, 'ud_dupdated', parseInt( this.dom.attr( element, 'ud_dchanged'))+1);
            return;
        }
        // Get content  
        let content = element.innerHTML;
        let hiddenId;
        if ( ( hiddenId = this.dom.attr( element, 'ud_hidden')))
        {
            // Add hidden content
            content += document.getElementById( hiddenId);
        }
  
        // Get action
        let action = "update";
        let setCursor = false;
        if ( this.dom.attr( element, 'ud_dbaction')) action = this.dom.attr( element, 'ud_dbaction');
        let postAction = action;
        // TEMP Fix for graphic creation
        if ( action == "insert" && this.dom.attr( element, 'ud_type') == "graphic") action = "refresh";
        debug( { level:3}, "Server request "+this.serverRequestId, action, element.id);
     
        // Page management - ask for document refresh if page too big
        let page = element.parentNode;
        // 2DO add an "idle" condition, ie refesh when idle just change timeout for example or needRefresh condition
        if ( page && typeof page.classList != "undefined" && page.classList.contains('page') && page.scrollHeight > page.clientHeight)
        {
            debug( {level:2}, "Page height too big refresh", page)
            // Reload the entire document 
            // action = "refresh";
            // 2DO display waiting
        }
        //if ( action != "insert" && element.getAttribute( 'UD_iheight') != element.offsetHeight) action = "refresh";

        // Get OID and wether cursor needs resetting
        let oid = this.dom.attr( element, 'ud_oid');
        if (action == "refresh" /*|| action == "insert"*/)
        {
            oid = this.dom.attr( this.topElement, 'ud_oid');
            this.ude.dom.cursor.save();
        }    
        else if ( action == "remove")
        {
            // Modifiy OID for removal (add SP parameter)
            oid = oid+"--SP|"+(oid.split("--")[1].split("-").length/2-1);
            this.dom.attr( element, 'ud_oid', oid);
            this.dom.attr( element, 'ud_dbaction', "remove");
            this.ude.dom.cursor.save();
            debug( { level:5}, "removing ",oid);
        }
        
        // Detect pre save function & execute        
        let prePost = this.dom.attr( element, 'ud_prepost');
        if ( prePost) {
            // Do trigger action
            let triggerNo = parseInt( prePost) - 1;
            let fct = this.triggeredActions[ triggerNo].fct;
            if ( this.triggeredActions[ triggerNo].once) {
                this.triggeredActions[ triggerNo] = null;
                this.dom.attr( element, "ud_prepost", "__CLEAR__");
            }
            /* PATCH 2235019
            * For bug #2235019 Span attributes lost when renaming doc
            * this patch saves and restore content before and after posting and used content provided by prepost trigger
            */
            let contentToSave = (fct) ? fct( element) : "";  
            if ( contentToSave) {
                let contentToRestore = element.innerHTML;
                element.innerHTML = contentToSave;
                this.udajax.postElement (element, oid, action, this.getDBtype( element)); 
                element.innerHTML = contentToRestore;
            } else {
                this.udajax.postElement (element, oid, action, this.getDBtype( element));
            }  /* end patch 2235019  + remove else below*/       
        } else {            
            // Use udajax for exchange with server 
            this.udajax.postElement (element, oid, action, this.getDBtype( element));
        }
        
        // Post AJAX actions
        /*if ( action == "update" || action == "insert")*/ this.dom.attr( element, "ud_dsent", this.ticks);
     
        return;
    } // UniversalDoc.saveElement()
    
   /**
    * Refresh comple content.
    */
    refresh()
    {
        // Assuming dir listing
        this.fetchElement( document.getElementById('document'), "AJAX_modelShow");
        setTimeout( function() {
            let options = document.getElementsByName( '_new_window');
            if ( options.length == 1 && typeof window.udAttributes != "undefined")
                if ( window.udAttributes.newWindowOnFiles.toLowerCase() == "yes") options[0].checked = true;
                else  options[0].checked = false;
        }, 1000);
        

    } // UniversalDoc.refresh()
   
   /**
    * Fetch an element from server.
    * @param {HTMLelement} element The element to fetch
    */
   fetchElement( element, reqAction="")
   {
        // Compute URI for server call
        let oid = this.dom.attr( element, 'ud_oid');
        if ( element.id == "document") oid = this.dom.attr( element, 'ud_oidchildren');;        
        
        if ( !reqAction || reqAction == "") 
            if ( element.id == "document") reqAction = this.refreshAction[ this.mode]; else reqAction = this.fetchAction;      
        let call = '/'+this.service+'/'+oid+"/"+reqAction+"/";
        // Define action on success from server
        let action ="update";
        if ( element.id == "document") action = "refresh";        
        // Define context
        let context = {element:element, action:action, setCursor:false, ud:this};
        // Send request via UDAJAX;
        this.udajax.serverRequest( call, "GET", "", context);
        // 2DO composite elements may require a 2nd fetch unless update handles 2 datasets 
        // Show editable elements as busy
        if ( this.dom.isEditable( element)) element.classList.add( 'busy');
        //this.ude.dom.attr( element, 'ude_edit', "Off");
        this.dom.attr( element, 'ud_dsent', this.ticks);        

        return;
   } // UniversalDoc.fetchElement()


   /**
    * Update an element in DOM with data received from server.
    * @param {HTMLelement} element The element to update
    * @param {string} returndDataString Server's JSON-code response to fetch request
    */
    updateElement( element, returnedDataString)
    {
        if ( !this.dom.isEditable( element)) { 
            console.log( element.id + " is not editable so cannot be updated");
            return;
        }
        let returnedData;
        try { 
            returnedData = JSON.parse( returnedDataString);
        } catch { 
            return debug( {level:1, return:false}, "Non JSON server response", returnedDataString);
        }
        if ( !element || !element.id) return debug( {level:1, return: false}, "Can't update element", element);
        if ( returnedData.nname != element.id && element.id.indexOf( 'MANAGE_') == -1) return debug( {level:1, return: false}, "bad record from server", element.id, returnedData);
        let fieldsToChange = this.dom.attr( element, 'ud_fields'); 
        let currentType = this.getDBtype( element);
        if ( returnedData.newElement)
        {
            // Newly inserted element
            if ( this.dom.attr( element, '_add')) this.dom.attr( element, 0); // Obsolete ?
            if ( returnedData.oid) this.dom.attr( element, 'ud_oid', returnedData.oid);
        } else if ( typeof window.botlogId != "undefined" && element.id == window.botlogId) {
            // Always update botlog
            element.innerHTML = returnedData.tcontent;             
        } else if ( 
          ( returnedData.result.indexOf("OK") == -1 && returnedData.modifiableBy != this.user_id) // if session !=
          && element.innerHTML != returnedData.tcontent
        )
        {
            // Update existing element if changed by another user
            this.dom.cursor.save();
            if ( currentType == returnedData.stype)
            {
                // Same type of element returned as that in DOM so update content & class 
                if ( !fieldsToChange || fieldsToChange.indexOf( 'tcontent') > -1) element.innerHTML = returnedData.tcontent; 
                // 2DO #2116010 nlabel/thtml fields inner = tcontent + thtml if thtml initialise not required
                if ( returnedData.nstyle && ( !fieldsToChange || fieldsToChange.indexOf( 'nstyle') > -1)) 
                    this.dom.attr( element, 'class', returnedData.nstyle); 
                // Initialise element
                this.ude.initialiseElement( element.id);
                // Check if element needs post update processing
                if ( this.dom.attr( element, 'ud_display')) doupdate( this.dom.attr( element, 'ud_display'));                             
            }
            else if ( !fieldsToChange || fieldsToChange.indexOf( 'stype') > -1)
            {
                // Element has changed type
                // Update content
                if ( !fieldsToChange || fieldsToChange.indexOf( 'tcontent') > -1) element.innerHTML = returnedData.tcontent; 
                // Get extended tag of new type
                let newTag = Object.keys( UD_exTagAndClassInfo).find( key => UD_exTagAndClassInfo[ key].db_type == returnedData.stype);
                // let newTag = this.exTagMap[ returnedData.stype];
                if ( typeof newTag == "undefined") return debug( {level:2, return:false}, "can't update stype", returnedData);
                // Use DOM changeTag function to change tag, don't mark as changed
                this.dom.changeTag( element, newTag);
            }
        }
        // Clear pending request indicater
        this.dom.attr( element, 'ud_dsent', "");
        // Set frequency of uodates according to nb of users
        if ( returnedData.users.length > 1) this.minTicksToFetch = 500/Math.min( returnedData.users.length, 10);
        
        // Indicate if available for edition
        let edit = this.dom.attr( element, 'ude_edit').split( ' ');
        // let session = this.dom.element( 'UD_session').textContent; if ( returnedData.modifiableBySession == session) {
        if ( returnedData.modifiableBy == returnedData.you)  {
            // Back to initial value if field contains 2 values
            if ( edit.length > 1) { this.ude.dom.attr( element, 'ude_edit', edit[ 1]);}
        } else  if ( edit && edit.length == 1) {
            // Set to off and keep initial value
            this.ude.dom.attr( element, 'ude_edit', "Off "+edit[0]);
        };
        // Update updated time and remove busy
        this.dom.attr( element, 'ud_dupdated', this.ticks);
        element.classList.remove( 'busy');
        
        // Trigger action ? 
        let triggerNo = this.dom.attr( element, "ud_onupdate");
        if ( triggerNo)
        {
            // Do trigger action
            triggerNo = parseInt( triggerNo) - 1;
            let fct = this.triggeredActions[ triggerNo].fct;
            if ( this.triggeredActions[ triggerNo].once) {
                this.triggeredActions[ triggerNo] = null;
                this.dom.attr( element, "ud_onupdate", "__CLEAR__");
            }
            if (fct) fct( element);
        }
        
        // Detect newly inserted elements
        if ( returnedData.newElements) this.syncWithServer();
        return true;
     
   } // UniversalDoc.updateElement()
  
   isDirListing() {
       let docModelHolder = this.dom.element( 'UD_docModel');
       if ( docModelHolder) if ( docModelHolder.textContent.indexOf( "Basic model for home directories") == 0) return true; 
       return false;
   }
   /**
    * If no paramaters, ask server for all recent changes in displayed content and with parameters handle server's response
    * @param {object} context Current context if server's reponses
    * @param {string} json Server's JSON-coded response if server's response
    * @param {string} JS code provided by server if server' response
    */
    syncWithServer( context=null, json="", js="")
    {
        if ( !context)
        {
            if ( !this.sync) return;
            // Ask server for update
            let oidTop = this.dom.attr( this.topElement, "ud_oid");
            let oid = this.dom.attr( this.topElement, "ud_oidchildren");
            if ( oidTop) {
                // Just 1st level if Dir Listing
                if ( ( this.mode == "model1" || this.mode == "model") && this.isDirListing()) {
                    oid = oidTop.replace( "--{OIDPARAM}", "");
                    if ( oid != "UniversalDocElement--21") oid += "-21";
                }                   
                let now = Date.now()/1000;
                let lastCallTime = Math.round( now - this.maxTicksToFetch/10);
                if ( this.serverTime && Math.abs( lastCallTime - this.serverTime) > 10) lastCallTime += ( this.serverTime - lastCallTime);
                let uri = '/' + UD_SERVICE + '/' + oid + '/AJAX_getChanged/?lastTime=' + lastCallTime;
                context = { element:this.topElement, ud:this};
                let me = this;
                this.udajax.serverRequest( uri, "GET", "", context, me.syncWithServer);
            }
        }
        else
        {
            // Response from server ... !!!WARNING no "this", use context ud instead
            let ud = context.ud; 
            let dom = ud.dom;    
            // Check changed elements
            let changedElements = JSONparse( json); 
            let nbChanged = Object.keys( changedElements).length;
            if ( !changedElements) return debug( {level:2, return:false}, "Bad server response", json);
            if ( nbChanged > 1) debug( {level:2}, "Changed elements count", changedElements.length);
            if ( ud.mode == "model" && nbChanged > 2) { ud.reload( true); return}            
            for (  let name in changedElements)
            {
                let changeRecord = changedElements[name];
                let element = ud.dom.element( name);
                if ( element) {
                    // Existing element
                    // 2DO Check oid ?
                    if ( name == "UD_user") {
                        // Update session status
                        let user = ud.dom.element( name).textContent;
                        if ( changeRecord.content != user) ud.networkStatus.session = false;
                        else ud.networkStatus.session = true;
                        if ( typeof changeRecord.time != "undefined") ud.serverTime = changeRecord.time;
                    }
                    else if ( changeRecord.oid == "__DELETED") ud.viewEvent( "server remove", element);                   
                    else if ( changeRecord.ticks >= ud.dom.attr( element, 'ud_dupdated')) {
                        if ( name[ 0] == "A") ud.reload( false);
                        else ud.elementsToFetch.push( element);
                    }    
                } else if ( changeRecord.oid != "__DELETED") {
                    // New element
                    if ( name[ 0] == "A") { ud.reload( false); return;} // Reload if Directory content     (not processed yet)                
                    let beforeId = changeRecord.before;
                    let before = ud.dom.element( beforeId);
                    let afterId = changeRecord.after;
                    let after = ud.dom.element( afterId);
                    let oid = changeRecord.oid;                    
                    let parentId = changeRecord.parent;
                    if ( parentId)
                    {
                        // Server has provided a parent so insert in this element
                        let parent = dom.element( parentId);
                        if ( !parent) continue;
                        let newElement = dom.prepareToInsert( 'p', '...', { ud_oid:oid});
                        let children = dom.children( parent);
                        if ( children.length == 0 || children.indexOf( before) == -1) parent.appendChild( newElement);
                        else parent.insertBefore( newElement, before);
                        ud.elementsToFetch.push( newElement);                        
                    } else if ( before) {
                        // Insert before the provided before element                   
                        let newElement = ud.dom.insertElement( 'p', '...', { id:name, ud_oid:oid, ud_dupdated:ud.ticks, ud_dchanged:ud.ticks}, before, false);
                        ud.elementsToFetch.push( newElement); 
                    } else if ( after) {
                        // Insert after the provided after element                   
                        let newElement = ud.dom.insertElement( 'p', '...', { id:name, ud_oid:oid, ud_dupdated:ud.ticks, ud_dchanged:ud.ticks}, after, true);
                        ud.elementsToFetch.push( newElement); 
                        
                    } else {
                        // Reload page for full sync
                        ud.reload( false); 
                    }
                    // 2DO Double elements ex table div with data / editzone div
                    //  insertElement( elementType, data, attributes={}, at = null)
                } else { 
                    // Element not in document
                    let pendingPos = ud.syncRemovePending.indexOf( name)
                    if ( pendingPos > -1) {
                        // Normal - recently deleted
                        ud.syncRemovePending.splice( pendingPos, 1); 
                    } else if ( changeRecord.oid == "__DELETED") {
                        console.log( "Deleted element is absent", changedElements, name);
                    } else {
                        // Not normal - refresh document to reflect all changes
                        // PATCH for basic model & empty name bug 
                        if ( name && name[ 0] != "A" && name != "Basic model for home directories") {
                            console.log( "Delete an unfound object in", changedElements);
                            ud.reload( false);
                        }
                    }
                }
            }       
        }    
    } // UniversalDoc.syncWithServer()
   
    /* ---------------------------------------------------------------------------------------------------
     * Utilities or functions for main part
     *   isFetchable(), getDBtype()
     */
   /**
    * Return true if element is fetchable from server
    * @param {HTMLelement} element
    */
    isFetchable( element)
    {
        let tag = element.tagName.toLowerCase();
        if (['p', 'h1', 'h2', 'h3','h4', 'h5', 'h6'].indexOf( tag) > -1) return true;
        else if ( tag == 'div' && this.ude.dom.attr( element, 'ude_type') != "") return true;
        return false;        
    } // UniversalDoc.isFetchable()

   /**
    * Map extended tag (tagName + ud_type) to stype value.
    * @param {HTMLelement} elem The element concerned by the event
    * @return {integer} stype value
    */
    getDBtype( elem)
    {
        // DB type is first found in 1) exTag with subtype 2) exTag 3) p.undefined
        let gval = this.dom.udjson.value;
        let stype = gval( UD_exTagAndClassInfo[ this.dom.attr( elem, 'exTagType')], 'db_type');
        if ( !stype) stype = gval( UD_exTagAndClassInfo[ this.dom.attr( elem, 'exTag')], 'db_type');
        if ( !stype) stype = gval( UD_exTagAndClassInfo[ 'p.undefined'], 'db_type');
        return stype;
    } // UniversalDoc.getDBtype()
 
   /**
    * Get the DB id set factor to use ideally in computing a new block's id
    * @param {HTMLelement} elem The element concerned by the event
    * @return {integer} step value
    */
    getDBidStepFactor( elem)
    {
        // DB Id Step Factor is the number of minimum steps from the previous block no. to use if the next block no is sufficiently high
        // Value is first found in 1) exTag with subtype 2) exTag 3) default value of 2
        let gval = this.dom.udjson.value;
        let step = gval( UD_exTagAndClassInfo[ this.dom.attr( elem, 'exTagType')], 'db_id_step_factor');
        //if ( !step) step = gval( UD_exTagAndClassInfo[ this.dom.attr( elem, 'exTag')], 'db_type');
        if ( !step) step = 2;
        return step;
    } // UniversalDoc.getDBidStepFactor()
 
   
   /* ---------------------------------------------------------------------------------------------------
    * API commands and JS HAVE BEEN MOVED TO APISET1.JS but calls to window.ud.fct still around
    *   addTool, loadTool, setClipboardHandler, 
    *   setModel, setSystemParameters ( in fact set and save)
    *   updateTable, updateGraphic
    *  inserts not used
    */
     
   /**
    * Add a tool to a tool set
    * @param {string} divName Id of tool set name where tool is to be added
    * @param {string} name Tool's name
    * @param {string} icon URL of tool's icon
    * @param {string} call URL of web service or a JS file
    * @param {string} help Rollover text (icon's title)
    */    
    addTool( divName, name, icon, call, help="")
    {
        // Remove any icon of same name
        if ( this.dom.element( name+'-icon'))
        {
            let element = this.dom.element( name+'-icon');
            element.remove(); // element.parent.removeChild( elem);
        }  
        // Build tool's icon zone
        let div = document.createElement('div');
        let img = document.createElement('img');
        img.src = icon;
        let link = document.createElement('a');
        let txt = document.createTextNode(name);
        link.appendChild( img);
        link.appendChild( document.createElement( 'br'));
        link.appendChild( txt);
        // Rollover text
        link.title = name;
        if ( help) link.title = help;
        // Click
        link.href="javascript:";
        let onclick = "";
        let toolZone = divName.replace("-selector", "-zone");
        onclick += "window.ud.loadTool( this,'"+divName+"', '"+call+"','"+toolZone+"');";
        this.dom.attr( link, 'onclick', onclick);
        // Add linked image to icon zone
        div.appendChild( link);
        this.dom.attr( div, 'class', 'tool-icon');
        this.dom.attr( div, 'id', name+'-icon');
        // Add to tool selector
        this.dom.element( divName).appendChild( div);
        // Quick fix : how to make class names independant of displayed label 
        let clName = name;
        if ( name.toLowerCase() == "tagger") clName = "Inserter";
        // Load module
        if ( call.indexOf( '.js') > -1)
        {
            // Tool is a JS module
            // console.log( call);
            try {
                if ( this.unitTesting) {
                    requirejs( ['modules/'+call.replace( '.js', '')], function() {
                        window.ud.ude.modules['modules/'+call] = { src:call, instance:null, state:"loaded"};
                        doOnload( "window.ud.ude.modules['modules/"+call+"']['instance'] = new window."+clName+"( window.ud, '"+toolZone+"');");                        
                    });
                    // clName = "window."+clName;                    
                } else if ( typeof window.ud.ude.modules['modules/'+call] == "undefined") {
                    window.ud.ude.modules['modules/'+call] = { src:call, instance:null, state:"loading"};
                    requirejs( ['modules/'+call.replace( '.js', '') + version], function() {
                        // window.ud.ude.modules['modules/'+call] = { src:call, instance:null, state:"loaded"};
                        doOnload( "window.ud.ude.modules['modules/"+call+"']['instance'] = new "+clName+"( window.ud, '"+toolZone+"');window.ud.ude.modules['modules/"+call+"']['state']='loaded';");
                    });
                }
            } catch ( error) { console.log( "Load ERR", error.message, clName, call);}     
        }
   } // UniversalDoc.addTool()
   
   /**
    * Load a tool's interface
    * @param {HTMLelement} clickedElement Tool container div that has been clicked
    * @param {string} setDiv Id of Tool set
    * @param {string} call URL of web service or a JS file
    * @param {string} zoneId Id of div to use for interace
    */    
    loadTool( clickedElement, setDiv, call, zoneId)
    {
        let div = document.getElementById( setDiv);
        for (let child in div.childNodes) 
        {
            // console.log( typeof div.childNodes[child]);
            if ( typeof div.childNodes[child] == "object") div.childNodes[child].classList.remove('selected');
        }
        clickedElement.parentNode.classList.add('selected');
        let zone = document.getElementById( zoneId);
        zone.innerHTML = "";        
        if ( call.indexOf( '.js') > -1)
        {
            // Generate event on instance for JS tools
            let tool = this.ude.modules[ 'modules/' + call]['instance'];
            if ( tool) tool.event( 'open');
        }
        else
        {    
            // Use AJAX call to server to open tool
            call = call.replace( /{topOID}/g, this.dom.attr( document.getElementById("document"), 'ud_oid'));
            if ( !this.unitTesting)
            {
                let server = new UDAJAX( this, ""); // full relative path provided by tools
                server.serverRequest( call+"/e|open/", "GET", "", {action:"fill zone", zone:zoneId});
            }
        }  
   }  // UniversalDoc.loadTool()
   
  /**
    * clear all tols in a set
    * @param {string} setDivId Id of div used for tool set
    * @param {string} iconDivId Id of div with tool's icon
    */
    clearTools( setDivId, iconDivId)
    {
        let setDiv = document.getElementById( setDivId);
        let tools = setDiv.childNodes;
        let nbOfTools = tools.length;
        for ( let tooli=nbOfTools; tooli > 0; tooli--) tools[ tooli - 1].remove();
        let iconDiv = document.getElementById( iconDivId);
        let iconImg = iconDiv.getElementsByTagName( 'img')[0];
        this.dom.attr( iconImg, 'src', "/upload/N3u2U2g3W_emptyIcon50.png");
        return true;        
    }  // UniversalDoc.clearTools()  
   
   /**
    *  NAVIGATION
    */    
   /**
    * Load an UD
    * @param {string} url of UD
    */    
    loadDocument( url)
    {
        if ( this.unitTesting || url.indexOf( 'AJAX_') > -1)
        {
            let urlParts = url.split( '/'); // http(s):/ /domain/service/oid/action/params..//.
            let uriParts = urlParts.splice( 3, urlParts.length - 3);
            let uri = uriParts.join('/');           
            let context = { action: "refresh", element: this.topElement, zone:"document"};
            this.udajax.serverRequest( uri, "GET", "", context);
        }
        else document.location = url;        
        return true;
    } // UniversalDoc.loadDocument()
    
   /**
    *    reload current document
    *    @param {boolean} useAJAX Default TRue. Use AJAX request of true else change page's location
    *    @param {string} env Optional string aded to request for ENViromental variable settings
    */
    reload( useAJAX = true, env = "")
    {
        let refreshAction = this.refreshAction [ this.mode];
        let uri = this.service+'/'+this.dom.attr( this.topElement, 'ud_oid')+'/'+refreshAction+'/';  
        if ( this.isDirListing()) {
            uri = this.service+'/'+this.dom.attr( this.topElement, 'ud_oid')+'-21/'+refreshAction+'/';  
        } 
        if ( useAJAX)
        {
            // Just update document part   
            let context = { action:"refresh", element:this.topElement};
            // DEPRECATED really necessary ?            
            // if ( this.mode == "model") uri = uri.replace( refreshAction, "AJAX_modelShow");
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
    *  Add a new page to history of loaded URL's
    * @param {string} url of UD    
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
    *  Go back to previous page
    */
    back()
    {
        let historyElement = this.dom.element( "UD_history");
        let history = historyElement.textContent.split(",");
        if (history.length > 2)
        {    
            let currentInHistory = history.indexOf( this.currentURL);
            if ( currentInHistory > 1)
            {    
                let previous = history[ currentInHistory - 1];
                this.loadDocument( previous);
            }    
        }    
    } // UniversalDoc.back()
    
   /**
    * Set handler for Clipboard operations
    * @param {object} handler Instance of a Clipboarding object   
    */
   setClipboardHandler( handler)
   {
     this.ude.clipboardHandler = handler;
     return this;
   } // UniversalDoc.setClipboardHandler()

   /**
    * Insert a HTML element at cursor position
    * @param {string} type Extended tag of element to insert
    * @param {string} data Content (text, html, JSON) of element's content
    * @param {object} attributes List of attribute/values of element     
    */
   insertElement( type, data, attributes)
   {
     // 2DO if loading document set cursor first
     //this.dom.insertElementAtCursor( type, data, attributes);
     this.dom.insertElement_old( type, data, attributes);
   } // UniversalDoc.insertElement()
   
   /**
    * Insert a text element at cursor position
    * @param {string} text Text content
    * @param {string} type MIME type of content, default plain     
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
   
   
   /* bad name, probably not used
   // Fetch elements
   fetch( nb)
   {
     return this.htmlContent;
   } // fetch()
   */
   
   insertTable( params, at)
   {
     //this.ude.setCursor( at);
     return this.ude.insertTableAtCursor( params);
   } // UniversalDocElement.insertTable()  
   
    // Initialise an element
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
        
   insertHTML( html, at)
   {
     //this.ude.setCursor( at);
     return this.ude.insertHTML( html);
   } // UniversalDocElement.insertAtCursor()  

   // Interpret inline instructions
   clientSideInterpretor ( instruction)
   {
      switch ( commande)
      {
        case "insert table" :
          break;
      }
   } // clientSideInterpretor()
   
   /**
    * Set current UD's model (in nstyle field) and refresh page with waiting message
    * @param {string} modelName Name of model
    * @api {JS} API.setModel(modelName) Set model of current UD
    * @apiParam {string} modelName Name of model
    */
    setModel( modelName, createModel=false)
    {  
        // Get action
        let action = "reload";
        let setCursor = false;
        let postAction = action;
        debug( { level:3}, "Server request model "+this.serverRequestId, action, modelName);
        // Get OID fore server request
        let oid = this.dom.attr( this.topElement, 'ud_oid'); // This for children access change ud.php
        let postData = "nstyle="+modelName;
        if ( createModel) postData += "&stype=3";
        // else if ( modelName.indexOf( "dir")) postData += "&stype=1";
        postData += "&input_oid="+oid;
        postData += "&form="+this.serverFormName;
        // Use udajax for exchange with server   
        let call = '/'+this.service+'/'+oid+"/AJAX_show/";
        // Prepare context for response handling
        let context = {element:this.topElement, action:action, setCursor:setCursor, ud:this};
        // Send request to server
        this.udajax.serverRequest( call, "POST", postData, context, null); 
        // Setup waiting         
        let T = $$$.getShortcut( "translateTerm");
        let html = '<div style="text-align:center"><img src="' + UDE_processingIcon + '"><br>';
        html += T( 'Initialisation de la page') + ' '+ T('avec') + ' ' + modelName;
        html += '.</div>';
        this.topElement.innerHTML = html;
        window.scrollTo( 0, 0);
        return;        
    } // UDapi.setModel()
 
   /**
    * @api {JS} $$$.copyModel(modelName) Current UD becomes a model
    * @apiParam {string} modelName Name of model
    */
    copyModel( modelName) { return this.setModel( modelName, true);}
   /**
    * Turn current UD into a directory
    * @param {string} modelName Name of model directory
    * @api {JS} API.makeDirectory(modelName) Current UD becomes a model
    * @apiParam {string} modelName Name of model
    */
    makeDirectory( modelName) {
        // Get action
        let action = "close";
        let setCursor = false;
        let postAction = action;
        debug( { level:3}, "Server request model "+this.serverRequestId, action, modelName);
        // Get OID for server request
        let oid = this.dom.attr( this.topElement, 'ud_oid'); // This for children access change ud.php
        let postData = "nstyle="+modelName;
        postData += "&stype=1";
        postData += "&tContent="+this.dom.element( 'UD_docFull').innerHTML.replace( 'Nouveau document', 'Nouveau repertoire');
        postData += "&input_oid="+oid;
        postData += "&form="+this.serverFormName;
        // Use udajax for exchange with server   
        let call = '/'+this.service+'/'+oid+"/AJAX_fetch/";
        // Prepare context for response handling
        let context = {element:this.topElement, action:action, setCursor:setCursor, ud:this};
        // Send request to server
        this.udajax.serverRequest( call, "POST", postData, context, null); 
        // Setup waiting         
        let html = '<div style="text-align:center"><img src="' + UDE_processingIcon + '">';
        html += "<br>Création d'un repertoire avec "+modelName+".</div>";
        this.topElement.innerHTML = html;
        window.scrollTo( 0, 0);
        return;        
       
    }

   /**
    * Set system parameters of current UD
    * @param {object} params List of attribute values
    */
    setSystemParameters( params)
    {
        // Control values
        
        // Write textra of document
        // Get action
        let action = "reload";
        let setCursor = false;
        let postAction = action;
        debug( { level:3}, "Server request system params"+this.serverRequestId, action, params);
     
        let oid = this.dom.attr( this.topElement, 'ud_oid'); // This for children access change ud.php
        let postData = "textra={\"system\":{"+JSON.stringyfy( params)+"}";
        postData += "&input_oid="+oid;
        postData += "&form="+this.serverFormName;
        // Use udajax for exchange with server   
        let call = '/'+this.service+'/'+oid+"/"+this.refreshAction[ this.mode]+"/";
        // Prepare context for response handling
        let context = {element:this.topElement, action:action, setCursor:setCursor, ud:this};
        // send request to server
        this.udajax.serverRequest( call, "POST", postData, context, null); 

        return;        
        
    } // ud.setSystemParameters()

   /**
    * Get or set a parameter of current UD
    * @param {string} doc Doc identifer default = "me"
    * @param {string} paramName Name of parameter to set
    * @param {mixed} value Value to write, null for reading
    */
    delay( ms) {
        return new Promise(resolve => {
            setTimeout( resolve, ms);
          });
    }

    async docParameter( doc, paramName, value=null)
    {
        if ( !doc || doc == $$$.getParameter( "UD_wellKnown/UD_wellKnownElements/UD_currentDocument", "register")) {
            // Ensure manage view is built
            $$$.buildManagePart();
            // Get current value of parameter
            let current = $$$.json.valueByPath( "UD_docParams_object", "data/value/" + paramName);
            await this.delay(50); 
            {
                if ( value == null)  return current;
                // Write value
                $$$.json.valueByPath( "UD_docParams_object", "data/value/" + paramName, value);
                // update holder and mark as updated
                let paramsHolder = $$$.dom.element( "MANAGE_params");
                $$$.dispatchEditEvent( { event:"update"}, paramsHolder);
                $$$.setChanged( paramsHolder);
            }
        } else {
            let dataHolder = this.dom.elementByName( doc);
            if ( dataHolder) {
                // Use data available in document
                // If log & userID use userId to find last entry                
            } else {
                // Get parameter from another document 
                let infoPr = this.getDocInfo (doc);
                let info = {};
                let current = "";
                infoPr.then( (context) => {
                    info =  $$$.json.parse( 'UD_spare');
                    if ( info) {
                        current = $$$.json.value( info.params, paramName);
                        //if ( !value)  return current;
                        // Write value
                        if ( value) info.params = $$$.json.value( info.params, paramName, value);
                        // Send to server
                        // 2DO
                    }
                }).catch( e => console.log( "docParamater", e));      
                await infoPr;     
                info =  $$$.json.parse( 'UD_spare');
                current = $$$.json.value( info.params, paramName);                
                return current;
            }    
        }
        return value;            
    } // ud.docParameter()
   
    async getDocInfo( doc) {
        let docParts = doc.split( '/');
        if ( docParts.length == 1) {
            let docOID = this.dom.attr( 'document', 'ud_oid');
            let homeOID = "UniversalDocElement--" + docOID.split( '--')[1].split( '-').splice( 0, 2).join('-');
            return $$$.servicePromise( 
                'doc', 
                { 
                    action: "getInfo",
                    dir:homeOID,
                    doc:doc,
                    dataTarget: "UD_spare", 
                    dataMap:{ info:"info", params:"params"}
                }, 
                true
            );             
        } else {
            let docName = docParts.pop();
            let dirPath = docParts.join( '/');
            return $$$.servicePromise( 
                'doc', 
                { 
                    action: "getInfo", dirPath:  dirPath, doc: docName,
                    dataTarget: "UD_spare", 
                    dataMap:{ info:"info", params:"params"}
                }, 
                true
            );   
        }    
    } 
   /**
    * Set element's style (in nstyle field)
    * @param {string} style Style name
    */
   setStyle( style)
   {
     this.ude.setStyle( style);
   }
   
   /**
    * Add a set of style rules
    * @param {string} css CSS of rules   
    */  
    addStyleRules( css)
    {
        css = css.replace(/\n/g, "");
        // console.log( css);
        // 2DO will need a rule seperator to split
        css = css.split('}');
        var style = document.createElement("style");
        style.appendChild(document.createTextNode(""));
        document.head.appendChild(style);
        for (var i in css) {
            if ( css[i].indexOf('{') == -1) continue;
            var rule = css[i]+'}';
            if( !style.sheet.insertRule( rule, style.sheet.length)) debug( { level:1}, "addStyleRules Fail on", rule);
            // Reset class on existing elements
            var name = rule.substring( 0, rule.indexOf('{'));
            if (name.indexOf('.') > -1) name = name.substring( name.indexOf('.')+1);
            var elements = document.getElementById('document').getElementsByClassName( name);
            for (var iel=0; iel<elements.length; iel++) { 
                var element = elements[iel]; 
                element.classList.remove( name); 
                element.classList.add( name);
            } 
        } // end rule loop  
    } // UniversalDoc.addStyleRules()
   
   /** OBSOLETE
    * Load and initiate a module
    * @param {string} moduleName Name of module
    * @param {object} args List of arguments
    * @param {object} source Not used
    * /
    loadModule( moduleName, args, source)
    {
        let mod = null;
        if ( typeof process == 'object') {
            // try
            mod = new window[ moduleName]( this.topElement);
        }
        else mod = new moduleName( args); // eval( "new "+moduleName+"( args)");
        // if (!mod) load file 
        return mod;
    } // UniversalDoc.loadModule()
    */
    
   /** MOVED to apiSet1
    * Translate  aterm to current language
    * @param {string} term The term to translate
    * @param {boolean} replaceUnderscores Default True, _ to -
    * @return {string} Translated term 
    */
    translateTerm( term, replaceUnderscores=true)
    {
        debug( "Deprecated call to ud.translateTerm");
        console.err( "Deprecated call to ud.translateTerm");
        return API.translateTerm( term, replaceUnderscore);
        /*
        let r = "";
        if ( replaceUnderscores) term = term.replace( '_', '-');
        let searchTerm = this.ude.calc.removeAccentsAndLower( term);
        if ( typeof this.terms[ term] != "undefined") r = this.terms[ term]; 
        else if ( typeof this.terms[ searchTerm] != "undefined") r = this.terms[ searchTerm];
        if ( !r) { r = term;}
        else if ( r && term[ 0].toUpperCase() == term[0]) { r = r[0].toUpperCase() + r.substr( 1);}
        //  for ( let chari=0; chari < term.length; chari++)
        return r;
        */
    } // UniversalDoc.translateTerm() 
        
 
   /**
    *    Build part names editing zone from outline in ressources
    *    @param {string} targetId Id of View where editing names is to be placed
    *    @return part editing element or null if failure
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
        for (let i=0; i < partsList.length; i++) {
            let partItem = partsList[ i];
            // Find part
            let partId = this.dom.attr( partItem, 'target_id');
            let part = this.dom.element( partId);
            // Determine if name can be changed
            let edit = true;
            let extra = this.dom.attr( part, 'ud_extra');
            if (extra) {
                extra = this.dom.udjson.parse( extra);
                if ( extra[ 'fromModel']) edit = false;
            }
            if (!part) continue;
            // Get part's id, OID and editing fields
            let id = part.id;
            let ud_oid = this.dom.attr( part, 'ud_oid');
            let ud_fields = 'tcontent';
            // Get part's content
            let content = partItem.innerHTML;
            // Add paragraph to target with id, ud_oid, ud_fields
            let para = document.createElement( 'p');
            para.id = id + '_manage';
            para.className = edit ? "viewname" : "viewname noedit";
            this.dom.attr( para, 'ud_oid', ud_oid);
            this.dom.attr( para, 'ud_fields', ud_fields);
            this.dom.attr( para, 'ud_dupdated', ''+this.ticks);
            this.dom.attr( para, 'ud_dchanged', ''+this.ticks);
            this.dom.attr( para, 'ude_stage', "on");
            this.dom.attr( para, 'ude_menu', "off");
            para.innerHTML = content;
            target.appendChild( para);
        } // end of partList loop
        return target;
    } // UniversalDoc.buildPartEditing() 
    
   /**
    * Try to build name from element's content
    * 2DO {label}
    */
    buildName( element) {  
        let name = "";
        let foundIndex = 0;
        let text = "";
        let caption = this.dom.element( 'span.caption', element);
        if ( caption ) text = caption.textContent;
        else text = element.innerHTML;
        if ( text.indexOf( "AutoIndex_") > -1) { foundIndex = text.match(/{AutoIndex_([^}]*)}/);}
        if ( foundIndex) {
            // let index = 'AutoIndex_'+indexName
            let index = 'AutoIndex_' + foundIndex[ 1];
            if ( typeof window.udparams[ index] == "undefined") {
                window.udparams[ index] = 1;
            }            
            name = text.replace( '{'+index+'}', window.udparams[ index]);
            window.udparams[ index]++;
            if ( caption) caption.textContent = name; else element.innerHTML = name;
        }    
        return name;
    } // buildName()   
    
    run( cmd)
    {
        return this.api.run( cmd);
    }
    
   /**
    * Set an application trigger on an element
    * @param {HTMLelement} element The element on which the trigger is placed
    * @param {string} trigger The triggers name : update - element is updated by server
    * @param {function} fct The function to call
    * @param {boolean} once If tru, trigger is disabled after use
    */    
    onTrigger( elementOrId, trigger, fct, once = true)
    {
        let element = this.dom.element( elementOrId);
        let triggerNo = 0;
        // Look for first empty slot in triggeredActions and fill with fct
        for ( let trigi = 0; trigi < this.triggeredActions.length; trigi++)
        {
            if ( !this.triggeredActions[ trigi])
            {
                triggerNo = trigi+1;
                this.triggeredActions[ trigi] = { fct:fct, once:once};
            }
        }
        if ( !triggerNo)
        {
            // Add a new slot for ths fct
            this.triggeredActions.push( { fct:fct, once:once});
            triggerNo = this.triggeredActions.length;
        }
        // 2DO call secret fct to secure triggerActions 
        /*let theSecretKey = Symbol("meaning of life");
Object.defineProperty(myObject, theSecretKey, {
    enumerable : false,
    value : 42
});*/
        // Set element with triggerNo event 
        switch (trigger)
        {
            case "update" :
                this.dom.attr( element, "ud_onupdate", triggerNo);
                break
            case "prepost" :
                this.dom.attr( element, "ud_prepost", triggerNo);
                break            
        }
    } // UniversalDoc.onTrigger()
    
   /**
    * Perform an operation on botlog
    * @param {string} action The required action on botlog: get, set, busy
    * @param {string} id Id of botlog entry
    * @param {string} status Status of entry
    * @param {string} details Details of operation
    * /
    botlogUpdate( action, id, status, details)
    {
        if ( action == "get")
        {
            // Return formatted botlog
        }
        else if ( action == "set")
        {
            if (  typeof this.botlog.log[ id] == "undefined")
                this.botlog.log[ id] = { status:status, details:details, start:this.ticks, update:this.ticks};
            else     
                this.botlog.log[id] = { status:status, details: this.botlog.log[id].details+"\n"+details, update:this.ticks};
        }
        else if ( action == "busy")
        {
            let busy = false;
            for ( var logid in this.botlog.log)        
            {
                bl = botlog.log[ logid];
                if ( bl.status)
                {
                    if ( bl.update - bl.start > 50) bl.error = true; else bl.error = false;
                    busy = true; 
                }              
            }
            return busy;
        }
    } // UD.botlogUpdate()
    */
    
} // UniversalDocElement Javascript class

// This needs to be loaded immediately
// 
const UDapiBuffer_requests = "UDErequest";

// JS class UDapiRequest 
class UDapiRequest
{
    
    // Syntax new UDapiRequest( ref, command, id of HTMLelement where to respond)
    // if e(vent) replace _V_ by UDapi_value callback UDapi_callbackid UDapi_quotes
    // if ref is object read all values from there
    constructor( ref, command, e=null)    
    {
        var quote = "";
        var callbackId = "";
        var caller = null;
        
        if ( typeof ref == "object")
        {
            var objCmd = ref;
            command = ref.command;
            if ( typeof ref.quotes != "undefined") quote = ref.quotes;
            if ( typeof ref.callbackId != "undefined") callbackId = ref.callbackId;
            ref = ref.caller; 
            e = null;
        }
        
        if ( e) {
            let dom = API.dom;
            // Find the element where the event was fired
            if (e.target) caller = e.target; else caller = e;
            if (caller)
            {
                // Look for paramters in call's attributes
                if ( dom.attr( caller, 'udapi_quotes')) quote = dom.attr( caller, 'udapi_quotes');
                if ( dom.attr( caller, 'udapi_callbackid')) callbackId = dom.attr( caller, 'udapi_callbackId');
                if ( dom.attr( caller, 'udapi_value1'))
                    command = command.replace( '%value1', "'"+dom.attr( caller, 'udapi_value1')+"'");
                if ( caller.getAttribute( 'id')) command = command.replace( '%id', "'"+dom.attr( caller, 'id')+"'");
            }
        }
        // Use quotes parameter to replace a pair of characters with quotes
        if ( quote)
          command = command.replace( new RegExp( quote.charAt(0), 'g'), "'").replace( new RegExp( quote.charAt(1), 'g'), "'");
        // 2DO Check | not used in command ?
        // Send command to buffer
        document.getElementById( UDapiBuffer_requests).textContent += ref+"|"+command+"|"+callbackId+"\n";
        debug( { level:4}, "API - command submitted", ref, command, callbackId);
        // if request comes from  a tool set, close toolset
        if ( [ "Outline"].indexOf( ref) > -1) leftColumn.switchDisplayMode();
        // if ( [ ""].indexOf( ref) > -1) rightColumn.switchDisplayMode();        
    }
    
   
} // end of JS class UDapiRequest

if ( typeof process == 'object')
{
    // Testing under node.js
    // Get arguments
    // console.log( process.argv);
    // Export    
    module.exports = { UniversalDoc: UniversalDoc, UDapiRequest:UDapiRequest, UDapiBuffer_requests:UDapiBuffer_requests};
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined" && typeof ModuleUnderTest == "undefined")
    {
        // Test this module
        ModuleUnderTest = "ud.js";
        console.log( 'Syntax : OK');         
        console.log( 'Start of ud.js test program');        
        // Setup browser emulation
        console.log( "Setting up browser (client) test environment");    
        // console.log( Date.now());
        var envMod = require( '../tests/testenv.js');
        envMod.load();
        //TEST_requireSetup( [ 'modules/connectors/udeconnector']);        
        // Setup our UniversalDoc object
        ud = new UniversalDoc( 'document', true, 133);
        const connMod = require( '../modules/connectors/udeconnector.js');
        connMod.init();
        const drawMod = require( '../modules/editors/udedraw.js');
       //console.log( API);
        //console.log( API.pageBanner);        
        let test = "Test 1 : retrieve content from integrated page";
        if ( ud.ude.dom.value( "B0100000001000000M...textContent") == "Hello big world") console.log( test + ': OK');
        else console.log( test + ': KO ' + ud.ude.dom.value( "B0100000001000000M...textContent"));
        // updateTest
        ud.updateElement( 
            ud.dom.element('B0100000001000000M'), 
            '{"stype":10, "nname" : "B0100000001000000M", "nstyle":"", "tcontent":"Hello again", "result":"", "users":"22", "newElement": 0, "modifiableBy":202}');
        if ( ud.dom.value( "B0100000001000000M...textContent") == "Hello again") console.log( "Test update: OK");
        else console.log( "Test update: KO " + ud.dom.value( "B0100000001000000M...textContent"));
        TEST_serverSaving = false;
        let before = API.dom.element( "B010000000500000M");
        let el = document.createElement( "p");
        el.textContent = "inserted";
        before.parentNode.insertBefore( el, before);
        // create event
        ud.viewEvent( "create", el);
        testResult( "Insert test", ( el.id == "B0100000001IO00045"), el.id);
        API.dom.attr( el, "ud_dupdated", API.dom.attr( el, "ud_dchanged"));
        // Add some pointers to ud
        ud.Zone = Zone;
        ud.UDapiRequest = UDapiRequest; 
        ud.domjs = domjs;
        ud.testNo = 2;        
        // console.log( Date.now());
        // Get sample data from server
        function nextTest( ud)
        {
            switch ( ud.testNo)
            {
                case 2 : // GET SHOW test document
                    let url = 'webdesk/UniversalDocElement--21-725-21--UD|3|NO|OIDLENGTH|CD|5/show/tusername|demo/tpassword|demo/';
                    console.log( "GET from server", url);                   
                    ud.udajax.serverRequest( url, 'GET', '', { ud:ud, action: "reload"});
                    break;
                case 3 : // POST test 
                    if(  ud.dom.value( "B01000000B0000000M...textContent") == "Text") console.log( "Test 2 : OK");
                    else console.log( "Test 2 : KO", ud.topElement.innerHTML);
                    //console.log( ud.topElement, ud.dom.attr( ud.topElement, 'ud_oid'));
                    // console.log( window.Inserter);
                    //console.log( ud.topElement.innerHTML);
                    //console.log( document.querySelectorAll( '#document .part'));
                    //console.log( ud.ude.calc.cssCalc)
                    // process.exit();
                    //ud.ude.insertElement( 'p', 'test insert para', {}, ud.dom.element( 'B0100000002000000M'), true);
                    break;
                case 4 :
                   console.log( "Program's trace checksum: "+debug ("__CHECKSUM__"));
                   console.log( "Test completed : OK");
                   process.exit();
                   break;                
            }
            // Get HTML of Capteur_1_Bâtiment_AviewZone
            ud.testNo++;
        } // nextTest()
        
        // GET & POST test
        nextTest( ud);
        setInterval( function() { nextTest( ud);}, 5000);
    }    
} // End of test routine
