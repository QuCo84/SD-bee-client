/**
 *  dom.js
 *    an encapsulation of DOM operations in DOM class and DOM_cursor class to centralise operations on 
 *    DOM for better tracing and rule application.
 *    Exemples of use :
 *       process browser differences (still a few)
 *       apply application rules such as look in parents for an attribute's value 
 *       manage cursor independantly of browser actions (see DOM_cursor)
 *       normalise tracing of DOM operations
 *       provide a single point of access to DOM values for calculator functions (see DOMvalue)  
 *       PLANNED prefix application-specific attribute names
 *    
 *  2DO
 *      1 - ELEMENT ACCESS 
 *      2 - VALUE ACCESS
 *      3 - MODIFICATION/INSERTION
 *      4 - UTILITIES ( Calcul & API)
 *      5 - CURSOR DOM_cursor 
 
 *    Methods are grouped as follows :
 *      1 - VALUE ACCESS : attr(), value() to read or write any value of an element attribute, content, style ...) uses findElement(), findChild() formula based, getElementAsJSON(), JSONget JSONput
 *      2 - ELEMENT ACESS : element(), siblings,(), children(), getSaveableParent() -- accessing 1 or more elements   2DO Move to 1
 *      3 - MISC : getParentAttribute(), getLookupFormTable() 2DO move to udetable.js
 *      4 - CREATION/INSERTION : insertElement(), insertElementAtCursor(), uses prepareToInsert(), insertPreparedElement(), splitTextElement(), createElementFromJSON()
 *      5 - MODIF : changeTag(), setStyle(), fillElement(), clearStyleOnAll()
 *      6 - CALCUL ; getWidthAndHeight()
 *    Cursor methods
 *      fetch(), set()
 *      save(), restore() : save with ids not instances
 *
 *  2DO            next clean remove commented code
 *  2DO            dom(Cursor)NoCE = extended class to add fcts for cursor mgmt 
 *      2019-12-03 DOM_cursor.set() - find textElement if not initialised     
 *  OK  2019-11-20 v-4 cleaned up
 */
 
 /*
  * Useful
  * Node.TEXT_NODE  Node.ELEMENT_NODE
  */
  
var DOM_lastAccessedValues=[];

// JSON fcts ready to be included solve getfile first
function JSONvalue( json, key) { return window.udjson.value( json, key);}
/*
function JSONvalue( json, key)
{
    if ( json && typeof json[ key] != "undefined") return json[ key];
    else return "";
}
*/
function JSONparse( json_str) { return window.udjson.parse( json_str);}
/*
function JSONparse( json_str)
{
    try {
        let json = JSON.parse( json_str);
        return json;
    }
    catch (e)
    {
        return null;
    }    
}
*/
/**
 *  The DOM JS class provides an encapsulation of DOM operations for better tracing and rules application.
 *
 * <p>Its tasks are the following :
 *    <li>handle any browser incompatibilites (still a few)</li>
 *    <li>normalise tracing of DOM operations</li>
 *    <li>apply application rules such as look in parents for an attribute's value</li>
 *    <li>prefix application-specific attribute names</li>
 *    <li>manage cursor independantly of contenteditable and other browser actions<li>
 * </p>
 */
class DOM
{
    // Parameters
    maxElementDepth = 30;
   /**
    * @property {object}        parent Object that initiated DOM object
    * @property {object}        cursor DOMcursor instance for managing cursor
    * @property {object}        value  DOMvalue instance for reading values from DOM (used by DOMcalc)
    * @property {HTMLelement}   topElement HTMLelement containing complete document (all contententeditable content)
    * @property {Array.string}  appAttributes Array of accepted attributes 
    * @property {integer}       lowerCaseAttr Attributes to force lower case when reading   
    * @property {integer} defaults.idleTicks Idle status after this many ticks without event(600)  
    * @property {integer}    
    * @property {integer}    
    * @property {integer}
    */
  // container = null; // contains everything editable
  DOM_properties = {};
  parent = null;
  cursor;
  udjson = null;
  domvalue = null;
  topElement = null;
  lastAccessedElement = null;
  autoHome = null;
  autoIndex1 = -1;
  autoIndex2 = -1;
  headerRowCache = {};
  transformScale = 1;
  
  // 2DO fill dynamically form class info
  // displayableTags = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "td"];
  classMap = {}; // Trial
  
  dummyText = "...";
  
  nodejs = false;
  
  constructor( topElement, parent) {
    this.topElement = topElement;
    this.parent = parent;
    this.cursor = new DOM_cursor( this.topElement, this);
    this.udjson = new UDJSON( this); 
    window.udjson = this.udjson;
    this.domvalue = new DOMvalue( this);    

    // if ( typeof process != 'object') requirejs( [ud-utilities/udjson], function () { this.udjson = new UDJson( this);}
    //debug( { level:5}, "Reading document.styleSheets", document.styleSheets);
    if ( typeof process == "object") this.nodejs = true;
    //this.debug_once=true;
    
  } // DOM.constructeur()
  
  /*
   * Accès aux valeurs du DOM
   */
    JSONget( element) { return this.udjson.getElement( element);}
    JSONput( json, sourceId = "", parentTag = "") { return this.udjson.putElement( json, sourceId, parentTag);}
    // For UDEcalc the calculator
    value( path, value=null, element = null) { return this.domvalue.value( path, value, element);}
  
    // App attribute
    appAttribute( element, attrName, value=null) { this.attr( element, attrName, value);}
    
    // Set an attr if JSON and vice-versa
    setAttr( json, element, attrName, toJSON = true)
    {
        if ( toJSON)
        {
            if ( this.attr( element, attrName)) json[ attrName] = this.attr( element, attrName);
        }
        else
        {
            if ( typeof json[attrName] != "undefined") this.attr( element, attrName, json[attrName]);          
        }
    }
    
   /**
    * Read or write an attribute in a HTML element
    * @param {mixed} element The HTML element whose attribute is to be written or its id
    * @param {string} attrName Name of the attribute, special cases: starts with "computed_" (useComputedPrefix)  use computed style, "exTag" = tag.ud_type
    * @param {mixed} value Read if null, clear attribute if "__CLEAR__", otherwise set attribute
    * @return {mixed} Attribute's value, null if element or attribute not found
    */
   /** 
    * @api {JS} API.dom.attr(elementOrId,attrName,value=null) attr() - read/write an attribute of an HTML element
    * @apiParam {mixed} element The HTML element whose attribute is to be written or its id
    * @apiParam {string} attrName Name of the attribute, special cases: starts with "computed_" use computed style, "exTag" = tag.ud_type
    * @apiParam {mixed} value Read if null, clear attribute if "__CLEAR__", otherwise set attribute
    * @apiSuccess {mixed} return Attribute's value, "" if element or attribute not found
    * @apiGroup Elements
    * @apiName attr
    *    
    */
    attr( elementOrId, attrName, value=null){
        debug( {level:5, coverage:"attr"});        
        let element = this.element( elementOrId);
        if ( !element ||  typeof element.getAttribute == "undefined") return "";                 
        if ( value != null) {
            // Writing
            // 2DO control values
            if ( UD_appAttributes.indexOf( attrName) > -1) {
                // App attribute
                let attrTidy = ( attrName.indexOf( 'data-') == 0) ? attrName : "data-"+attrName.replace( /_/g, '-');
                if ( attrTidy != attrName && typeof element.getAttribute( attrName) != "undefined") {
                    element.removeAttribute( attrName);
                } 
                if ( value == "__CLEAR__") {
                    if ( typeof element.getAttribute( attrTidy) != "undefined") element.removeAttribute( attrTidy);
                } else {
                    // Write with compliant (tidy) name
                    element.setAttribute( attrTidy, value);
                }
            } else {
                if ( UD_domAttributes.indexOf( attrName) == -1) { 
                    let caller = debug_callerFct();
                    console.error( "Writing unknown attribute:"+attrName, caller);
                }
                if ( typeof value == "boolean" && value) element.setAttribute( attrName, '');
                else if ( attrName == "class") element.className = value;
                else if ( value == "__CLEAR__") element.removeAttribute( attrName);                
                else element.setAttribute( attrName, value);
            }
            return value;
        } else {
            // Reading
            if ( UD_styleAttributes.indexOf( attrName) > -1 || attrName.indexOf( UD_useComputedPrefix) == 0) {
                // Use computed style
                attrName = attrName.replace( UD_useComputedPrefix, "");
                var computedStyle = element.currentStyle || window.getComputedStyle( element);
                if ( typeof computedStyle[ attrName] != "undefined" ) value = computedStyle[ attrName];
                //Remove px and make number
                if ( value && value.indexOf('px') > -1) value = parseFloat( value.replace("px", ""));
            } else if ( attrName == 'textContent of siblings') {
                // Aggregate text content of editable siblings
                // 2D0 Make a seperate function and use variable list of classes to ignore
                let siblings = element.parentNode.childNodes;
                value = "";
                let dummy = API.getParameter( "dummyText"); 
                for ( let sibi=0; sibi < siblings.length; sibi++){
                    let child = siblings[ sibi];
                    let childText = child.textContent;
                    if ( 
                        child.nodeType == 1 
                        && !child.classList.contains( 'rowNo')
                        && child.getAttribute( 'contenteditable') != "false"
                        && childText != dummy
                        && childText != this.attr( child, 'ude_place')
                    ) { 
                        value += childText;
                    }
                }
            } else if ( attrName == 'editable') {                
                value = true; 
                if ( this.attr( element, "exTag") == "div.page") value = false;                
                let walkElement = element;
                let safe = 10;
                while ( value && walkElement && walkElement.id != "document" && --safe) {
                    if ( this.attr( walkElement, 'contenteditable') == "true") { return value;}
                    let elMode = this.attr( walkElement, 'ude_edit').toLowerCase();
                    // Legacy editing on/off is sufficient update udelement.php
                    if ( !elMode){
                        elMode = this.attr( walkElement, 'ude_mode').toLowerCase();
                        if ( this.attr( walkElement, 'ude_input') == "none") elMode = "display";
                        if ( !elMode || elMode.indexOf('edit') > -1) elMode = "on"; else elMode = "off";                        
                    }
                    let docMode = this.element( 'UD_mode');
                    if ( docMode) docMode = docMode.textContent
                    if ( 
                        [ 'div.page'].indexOf( this.attr( walkElement, "exTag")) == -1                    
                        && ( this.attr( walkElement, 'contenteditable') == "false"
                            || this.attr( walkElement, 'ude_noedit' )
                            || walkElement.classList.contains( 'noedit')
                            || ( walkElement.tagName == "INPUT")
                            || ( docMode != "edit3" && elMode && elMode.indexOf("off") == 0)
                            || ( !elMode && docMode && docMode == "model")
                        )
                    ) {
                        value = false;
                        break;
                    }
                    walkElement = walkElement.parentNode;
                }
                if ( element.id == "document" || this.attr( element, 'exTag') == "div.page") value = false;
            } else if ( attrName == "exTag" || attrName == "exTagType") {
                value = element.tagName.toLowerCase();
                if ( value == "div" || value == "span") {
                    let type = this.attr( element,'ud_type');
                    if ( type) { value += "." + type;}
                    let subType = this.attr( element, 'ud_subtype');                     
                    if ( attrName == "exTagType" && subType) value += "."+subType;
                } else if ( value == "p" && element.classList.contains( 'undefined')) value = "p.undefined";
            //} else if ( attrName == "class") {
            //    value = element.getAttribute( 'class');
            } else if ( UD_domAttributes.indexOf( attrName) > -1) {
                value = element.getAttribute( attrName);
                if ( !value) value = "";
            } else {  
                // 2DO check attribute is authorised
                // Order : Tidy name attribute, raw attribute, member of element (textContent for ex)
                let attrTidy = ( attrName.indexOf( 'data-') == 0) ? attrName : "data-"+attrName.replace( /_/g, '-');
                value = element.getAttribute( attrTidy);
                if ( !value) {
                    // Backward compatibity with app attributes not named with data-
                    value = element.getAttribute( attrName);
                }
                // HTML element member
                if ( !value && typeof element[ attrName] != "undefined") { value = element[attrName];}
                // Always return something
                if ( !value || typeof value == "undefined") value = ""; 
                // Arrange some values
                if ( value && UD_lowerCaseAttr.indexOf( attrName) > -1) value = value.toLowerCase(); 
                if ( UD_appAttributes.indexOf( attrName) == -1 && UD_domAttributes.indexOf( attrName) == -1) { 
                    let caller = debug_callerFct();
                    console.error( "Reading unknown attribute:"+attrName, caller);
                }                
            }
            debug( {level:5, coverage:"attr"});            
            return value;
        }    
    } // DOM.attr()    

   /**
    * Return true if element is editable
    */
    isEditable ( element, clickable = false) {
        let exTag = this.attr( element, 'exTag');
        let hasEditTag = $$$.testEditorAttr( element, 'ude_edit');
        hasEditTag |= $$$.testEditorAttr( element, 'ude_stage');
        hasEditTag |= (exTag == "input");
        let dontEdit = ( !element);
        dontEdit |= (exTag == "div.page");
        dontEdit |= !hasEditTag;
        dontEdit |=  ( clickable && this.attr( element.parentNode, 'ud_type') != "link")
        return !dontEdit;
    }

    
   /**
    * Remove an attribute in a HTML element
    * @param {mixed} element The HTML element whose attribute is to be written or its id
    * @param {string} attrName Name of the attribute
    * @return {mixed} Attribute's value, null if element or attribute not found
    * @api {JS} API.dom.clearAttr(elementOrId,attrName) Clear an attribute in a HTML element
    * @apiParam {mixed} element The HTML element whose attribute is to be written or its id
    * @apiParam {mixed} value Read if null, clear attribute if "__CLEAR__", otherwise set attribute
    * @apiSuccess {mixed} return Attribute's value, "" if element or attribute not found
    * @apiGroup Elements
    *    
    */
    clearAttr( elementOrId, attr) { this.attr( elementOrId, attr, "__CLEAR__");}
    
   /**                                           
    * Read an attribute from the ud_extra attribute of an HTML element or one of its parents
    * @param {mixed} element The HTML element whose attribute is to be written or its id
    * @param {string} attrName Name of the attribute
    * @return {mixed} Attribute's value, null if element or attribute not found
    * @api {JS} API.dom.extrAttr(elementOrId,attrName,value=null) Read an "extra" attribute of an HTML element
    * @apiParam {mixed} element The HTML element whose attribute is to be written or its id
    * @apiParam {string} attrName Name of the attribute, special cases: starts with "computed_" use computed style, "exTag" = tag.ud_type
    * @apiSuccess {mixed} return Attribute's value, "" if element or attribute not found
    * @apiGroup Elements
    *    
    */
    extraAttr( elementOrId, extraAttrName) {
       // Get value from ud_extra parameter
       let value = "";
       let extra = this.parentAttr( elementOrId, 'ud_extra');
       let docMode = this.element( 'UD_mode').textContent;
        if ( extra && docMode == "edit2") {
           extra = this.udjson.parse( extra);
           if ( extra && extra[ extraAttrName]) value = extra[ extraAttrName];
        }              
       return value;
    }

   /**
    * Read an attribute from an HTML element, its binded element, a parent or a parent's binded element
    * @param {mixed} elementOrId The HTML element or its Id
    * @param {string} attrName The attribute's name
    * @return {string} The attributes value if found, otherwise null
    * @api {JS} API.dom.parentAttr(elementOrId,attrName) Get an attribute from an element or its context
    * @apiParam {mixed} elementOrId HTML element or its id
    * @apiParam {string} attrName The attribute's name
    * @apiSuccess {string} return The attribute's vale
    * @apiError {object} return null
    * @apiGroup Elements
    */        
    parentAttr( elementOrId, attrName) {
        let element = this.element( elementOrId);
        let maxLevel = 10;
        let value = "";
        let walkElement = element;
        let bind = "";
        while ( 
            walkElement
            //&& !( this.attr( walkElement, 'ud_oid')) // is UD element
            && !( value = this.attr( walkElement, attrName))
            && !( bind = this.attr( walkElement, 'ude_bind'))
            && --maxLevel
            && walkElement != this.topElement
        )
            walkElement = walkElement.parentNode;
        if ( bind) return this.parentAttr( this.element( bind), attrName);
        return value;
    } // DOM.parentAttr()
    
    
   /**
    * Get Text content of a set of elements
    * @param {mixed[]} elementsOrIds Array of elements
    * @return {string} The Text content of the elements
    * @api {JS} API.dom.textContent(elementsOrIds) Get text content from 1 or more elements
    * @apiParam {mixed[]} elementsOrIds Array of elements
    * @apiSuccess {mixed} return The Text content of the elements
    * @apiGroup Elements
    */
    textContent( elementsOrIds) {
        let text = "";
        if ( typeof elementsOrIds == "string") elementsOrIds = [ elementsOrIds];
        for ( let eli=0; eli < elementsOrIds.length; eli++) {
            let element = this.element( elementsOrIds[ eli]);
            if ( !element || element.nodeType != Node.ELEMENT_NODE) continue; 
            let exTag = this.attr( element, 'exTag');
            if ( [ "div.linetext", "div.server", "div.css", "div.js", "div.json", "div.html"].indexOf( exTag) > -1 ) {
                // Extract text from child of element
                switch ( this.attr( element, 'ud_mime')) {
                    case "text/json" :
                        let json = JSONparse( element.textContent);
                        if ( !json) continue;
                        text += this.udjson.text( json, "data/value");
                        break;
                    case "text/text" :
                    default :
                        let textContainer = this.element( 'div.textObject', element);
                        if ( !textContainer) continue;                        
                        // Remove 1st line
                        let lines = textContainer.textContent.split( "\n");
                        let firstLine = lines.shift();
                        if ( ["linetext", "css", "js", "json", "html"].indexOf( firstLine.toLowerCase()) == -1) {
                            text += firstline + "\n";
                        } 
                        text += lines.join("\n");
                        //textContainer.textContent.replace( "CSS\n", "").replace( "\n", "");
                        break;
                }
            }
            else text += element.textContent;
        }
        return text;    
    }  // DOM.textContent()                                                         
    
    /*
                        var child = siblings[i];
                    if ( child.nodeType == 1 && child.getAttribute( 'contenteditable') != "false") 
                        value += child.textContent;

    */
   /**
    *  ELEMENT ACCESS
    */    
    
   /**
    * Get an HTML element
    * @param {mixed} query The HTML element's Id, a selection query or an HTMLelement (returned as is)
    * @param {HTMLelement} parent If not provided, query is Id otherwise query is query select
    * @return {HTMLelement} The HTML element, thefirst HTML element if selection found, or null if not found
    * @api {JS} API.dom.element(query,parentOrId=null) Get an HTML element
    * @apiParam {mixed} query The HTML element's Id, a selection query or an HTMLelement (returned as is)
    * @apiParam {HTMLelement} parent If not provided, query is Id otherwise query is query select
    * @apiSuccess {mixed} return The HTML element or null if not found
    * @apiGroup Elements
    */
    element( query, parentOrId=null) {
        if ( !query) return null;
        let element = null;
        let parent = null;
        if ( typeof query == "object") { 
            // Return directly if HTML element
            if ( typeof query.tagName != "undefined") { return query;}
            // Use object to generate querySelector
            let q = query;
            if ( typeof q.parent == "string") { parentOrId = q.parent;}
            else { parentOrId = this.element( JSON.stringify( q.parent));}
            if ( q.tag == "tbody" || q.tag == "thead") { query = q.tag;} // ignore child no for these tags         
            else { query =  q.tag + ":nth-child(" + q.child + ")";}
        }           
        if ( query[0] == '{') {
            // Use JSON object to generate query selector
            let q = this.udjson.parse( query);
            if ( !q) return null;
            if ( typeof q.parent == "string") { parentOrId = q.parent;}
            else { parentOrId = this.element( JSON.stringify( q.parent));}
            if ( q.tag == "tbody" || q.tag == "thead") { query = q.tag;} // ignore child no for these tags         
            else { query =  q.tag + ":nth-child(" + q.child + ")";}
            /*
            if ( typeof q.grandchild == "undefined") {
                query = ":nth-child(" + q.child + ")";
                parentOrId = q.parent;
            } else {
                query = ":nth-child(" + q.grandchild + ")";
                parentOrId = this.element( ":nth-child(" + q.child + ")", q.parent);
            }
            */
        }
        if ( parentOrId) {
            parent = this.element( parentOrId);
            if ( !parent) {
                let named = document.getElementsByName( parentOrId);
                if ( named.length) parent = named[ 0];
            }    
            if ( !parent) parent = this.element( 'document');
        }
        if (!parent) {
            // Convention spaces replaced by '_' in ids
            let elementId = query.replace( / /g, "_");
            element = document.getElementById( elementId);
            /* Seperate fct
            if ( !element) 
            {
                let namedElements = document.getElementsByName( query);
                if ( namedElements.length == 0) return debug( {level:2, return:null}, "Can't find element with id or name", query);
                if ( namedElements.length > 1) return debug( {level:2, return:null}, "Can't distinguish element with name", query);
                element = namedElements[ 0];
            }
            */
        } else {
            if ( this.nodejs) {
                if ( parent.id) { 
                    element =  document.querySelector( '#'+parent.id+ ' '+query);
                    if ( !element && " table ul ".indexOf( query) > -1) {
                        console.log( "parse children for query");
                        // Node not in document yet so under node.js we need to do our own search
                        // Very basic processing, mainly for udjson get that looks for table in element
                        let children = parent.childNodes;
                        for ( let childi = 0; childi < children.length; childi++) {
                            let child = children[ childi];
                            if ( child.nodeType == Node.ELEMENT_NODE && child.tagName.toLowerCase() == query) {
                                element = child;
                                break;
                            }
                        }
                    }
                }
            } else  { element = parent.querySelector( query);}
        }  
        return element;
    } // DOM.element()
    
    /**
    * Get a set of HTML element with a selection query
    * @param {mixed} query A selection query
    * @param {HTMLelement} parentOrId Where to look (HTMLelement or Id)
    * @return {Array.HTMLelement} An array of HTML elements or null if not found
    * @api {JS} API.dom.elements(query,parentOrId) Get a set of HTML elements
    * @apiParam {mixed} query A selection query
    * @apiParam {HTMLelement} parent Where to look
    * @apiParam {string} afterId Only return elements with an id higher than this value
    * @apiParam {string} beforeId Only return elements with an id lower that this value
    * @apiSuccess {Array.HTMLelement} return An array of HTML elements or null if not found
    * @apiGroup Elements
    */   
    elements( query, parentOrId, after = "", before = "") {
        let parent = this.element( parentOrId);
        if ( !parent) return [];
        let found = null;
        if ( this.nodejs) found = ( parent.id) ? document.querySelectorAll( '#'+parent.id+' '+query) : [];
        else found = parent.querySelectorAll( query);
        // Only keep HTML elements (not comments) whose ID is between after & before     
        let result = [];
        for ( let foundi=0; foundi < found.length; foundi++)
        {
            let node = found[ foundi];
            if  ( node.nodeType != Node.ELEMENT_NODE) continue;
            let id = node.id;            
            if ( 
               (!after && !before)
               || ( id && ( !after || id > after) && ( !before || id < before))
            ) {
                // Keep this node
                result.push( node);
            }
        }    
        return result;
    } // DOM.elements()
 
    elementByName( name, exTag="") {
        let doc = this.element( 'document');
        if ( !doc) {
            console.log( "FATAL ERROR No document element", document.body.innerHTML);
            return null;
        }
        // 2DO test nodejs
        // 2DO test name = object means query select 
        let candidates = this.elements( exTag+"[name='"+name+"']", doc);
        if ( !candidates || candidates.length == 0) return debug( {level:3, return:null}, "DOM.elementByName name not found", name);
        else if ( candidates.length > 1) return debug( {level:3, return:null}, "DOM.elementByName name not unique", name);
        return candidates[ 0];
    }
   /**
    * Get an HTML element's unpaged HTML element children, ie overlooking paging DIVs and text nodes. Alternative
    * name chidren()
    * @param {mixed} elementOrId The HTML element or its Id
    * @return {Array.HTMLelement} An array of HTML elements
    * @api {JS} API.dom.children(elementOrId) Get an element's saveable children
    * @apiParam {mixed} elementOrId HTML element or its id
    * @apiSuccess {Array.HTMLelement} return An array of HTML elements
    * @apiGroup Elements
    */   
    unpagedChildElements( elementOrId) {
        let element = this.element( elementOrId);
        if (!element) return [];
        let children=[];
        let childNodes = element.childNodes; 
        if ( !childNodes) return children;
        for (var i=0; i<childNodes.length; i++) {
            var child = childNodes[i];
            if ( child.nodeType != 1) continue;
            if ( typeof child.classList != "undefined" && child.classList.contains("page")) children = children.concat( this.children( child));
            else children.push( child);
        }    
        return children;
    } // DOM.children()
    // Backward compatibility
    children( elementOrId) { return this.unpagedChildElements( elementOrId);}
   
   /**
    * Get an HTML element's direct element node children, ie overlooking text nodes
    * @param {mixed} elementOrId The HTML element or its Id
    * @return {Array.HTMLelement} An array of HTML elements
    * @api {JS} API.dom.childElements(elementOrId) Get an HTML element's children
    * @apiParam {mixed} elementOrId HTML element or its id
    * @apiSuccess {Array.HTMLelement} return An array of HTML elements
    * @apiGroup Elements
    */   
    childElements( elementOrId) {
        let element = this.element( elementOrId);
        if (!element) return null;
        let children=[];
        let childNodes = element.childNodes; 
        if ( !childNodes) return children;
        for (var i=0; i<childNodes.length; i++) {
            var child = childNodes[i];
            if ( child.nodeType != 1) continue;
            children.push( child);
        }    
        return children;
    } // DOM.childElements()
    
   /**
    * Get an HTML element's direct children, including text nodes, and return as array
    * @param {mixed} elementOrId The HTML element or its Id
    * @return {Array.HTMLelement} An array of HTML elements
    * @api {JS} API.dom.childElements(elementOrId) Get an HTML element's children
    * @apiParam {mixed} elementOrId HTML element or its id
    * @apiSuccess {Array.HTMLelement} return An array of HTML elements
    * @apiGroup Elements
    */   
    childNodes( elementOrId) {
        let element = this.element( elementOrId);
        if (!element) return null;
        let children=[];
        let childNodes = element.childNodes; 
        if ( !childNodes) return children;
        for (var i=0; i<childNodes.length; i++) {
            var child = childNodes[i];
            children.push( child);
        }    
        return children;        
    }
    
   /**
    * Get HTML div.page element's of document or a view
    * @param {mixed} viewOrId The HTML div.view element or its Id
    * @return {Array.HTMLelement} An array of HTML div.page elements
    * @api {JS} API.dom.childElements(elementOrId) Get pages of document or view
    * @apiParam {mixed} elementOrId HTML element or its id
    * @apiSuccess {Array.HTMLelement} return An array of HTML elements
    * @apiGroup Elements
    */   
    pages( viewOrId = "document") {
        let element = this.element( viewOrId);
        if (!element) element = this.element( '[name="'+viewOrId+'"]', this.element( 'document'));
        if (!element) return null;
        let children=[];
        let childNodes = element.childNodes; 
        if ( !childNodes) return children;
        for (var i=0; i<childNodes.length; i++) {
            var child = childNodes[i];
            if ( child.nodeType != 1) continue;
            if ( typeof child.classList != "undefined" && child.classList.contains("page")) children.push( child);
        }    
        return children;
    } // DOM.pages()
    
   /**
    * Get HTML div.view element's of document
    * @param {mixed} viewOrId The HTML div.view element or its Id
    * @return {Array.HTMLelement} An array of HTML div.page elements
    * @api {JS} API.dom.childElements(elementOrId) Get the document's views
    * @apiParam {mixed} elementOrId HTML element or its id
    * @apiSuccess {Array.HTMLelement} return An array of HTML elements
    * @apiGroup Elements
    */   
    views() { return this.childElements( 'document');}
    
    /**
    * Get an HTML element's siblings overlooking paging DIVs and text nodes
    * @param {mixed} elementOrId The HTML element or its Id
    * @return {Array.HTMLelement} An array of HTML elements or null if none found
    * @api {JS} API.dom.siblings(elementOrId) Get an element's siblings
    * @apiParam {mixed} elementOrId HTML element or its id
    * @apiSuccess {mixed} return An array of HTML elements
    * @apiGroup Elements
    */   
    siblings( elementOrId) {
        let element = this.element( elementOrId);
        var siblings = [];
        // Build list of containers
        var container = element.parentNode;
        if (container.classList.contains("page")) siblings = this.children( container.parentNode);
        else siblings = this.children(container);
        return siblings;
    } // DOM.siblings()
    
   /** 
    * @api {JS} API.dom.emptyElement(elementOrId) Empty an HTML element of its contents
    * @apiParam {mixed} elementOrId HTML element or its id
    * @apiSuccess {HTMLelement} return The empty HTML element
    * @apiError {object} return null
    * @apiGroup Elements
    */
   /**
    * Empty an HTML element of all its contents
    * @param {mixed} elementOrId The HTML element or its Id
    * @return {HTMLelement} The empty HTML elements or null if none found
    */    
    emptyElement( elementOrId) {
        let element = this.element( elementOrId);
        if ( !element) return null;
        element.innerHTML = "";
        return element;
    } // DOM.emptyElement()
    
   /**
    * childrenAsJSON
    * return JSON array of { value, class, tag}
    * 2DO replace with JSONget
    */    
    childrenAsJSON( element, allowedNodeTypes= []) {
        debug( { level:2}, "childrenAsJSON OLD called");
        let children = element.childNodes;
        let json = [];
        for ( let childi=0; childi < children.length; childi++)
        {
            let child = children[ childi];
            if ( child.nodeType == Node.TEXT_NODE)
                // for text nodes, add a value-only element to response                
                json.push( { value:child.textContent});
            else if ( child.nodeType == Node.ELEMENT_NODE)
            {   
                if ( child.tagName.toLowerCase() == "br") 
                    // for BR's add an empty vamue-only element to response
                    json.push( {value:""})
                else // 2DO check allowedNodeTypes
                {
                    // for HTML elements, add value, tag and if needed class and formula
                    let jsonItem = { value:child.textContent, tag:child.tagName.toLowerCase()}
                    if ( child.className) jsonItem.class = child.className;
                    let formula = this.attr( child, 'ude_formula');
                    if ( formula) jsonItem.formula = formula;
                    // push to result
                    json.push( jsonItem);
                }
                // else debug( { level:2, return:null}, "Forbidden tag")                
            }
        }
        return json;
    } // DOM.childrenAsJSON()
    
    /**
    * Get an HTML element's children of a class. Alternative ( API.dom.elements( "."+className, elementOrId);
    * @param {mixed} elementOrId The HTML element or its Id
    * @param {string} className Class of requested children 
    * @return {Array.HTMLelement} Array of HTML elements
    * @api {JS} API.dom.childrenOfClass(elementOrId,className) Get children of a class
    * @apiParam {mixed} elementOrId HTML element or its id
    * @apiParam {string} className Class of requested children
    * @apiSuccess {Array.HTMLelement} return Array of HTML elements
    * @apiError {object} return null
    * @apiGroup Elements
    */   
    childrenOfClass( elementOrId, className) {
        //debug( { level:2}, "childrenOfClass OLD called");
        // return this.elements( "."+className, elementOrId);
        let element = this.element( elementOrId);
        if ( !this.nodejs) return this.elements( "."+className, element);
        let children = this.childElements( element);
        let result = [];
        for ( let childi=0; childi < children.length; childi++)
        {
            let child = children[ childi];
            if ( child.nodeType == 1 && child.classList.contains( className)) result.push( child);
        }
        return result;
    } // DOM.childrenOfClass()
    
   /**
    * Return True if element has specified class
    * @param {mixed} elementOrId HTML element or its Id
    * @param {string} className A class to test
    * @return {boolean} True if class present
    * @api {JS} API.dom.hasClass(elementOrId,className) True if class present
    * @apiParam {mixed} elementOrId HTML element or its Id
    * @apiParam {string} className A class to test
    * @apiSuccess {boolean} True if class present
    * @apiGroup Styles
    */
    hasClass( elementOrId, className) { return this.dom.element( elementOrId).classList.contains( className);}
   
   /**
    * Get an HTML element's saveable parent, ie the container that can be sent to server
    * @param {mixed} elementOrId The HTML element or its Id
    * @return {HTMLelement} A saveable HTML element
    * @api {JS} API.dom.getSaveableParent(elementOrId) Get HTML elements with a selection query
    * @apiParam {mixed} elementOrId HTML element or its id
    * @apiSuccess {HTMLelement} return The saveable HTML element
    * @apiError {object} return null
    * @apiGroup Elements
    */   
    getSaveableParent( elementOrId, followBind = true) {
        let element = this.element( elementOrId);
        let safe = this.maxElementDepth; 
        let walkElement = element;
        while ( walkElement && typeof walkElement.tagName != "undefined"
                && !this.attr( walkElement, 'ud_oid') 
                && ( !walkElement.id || walkElement.id.indexOf( "__TMP") != 0)
                && safe--
        ) {
            if ( followBind && this.attr( walkElement, 'ude_bind')) break;
            walkElement = walkElement.parentNode;
        }
        if ( walkElement) {
            if ( followBind && this.attr( walkElement, 'ude_bind')) {
                // Follow binding only once using recurrsive call
                return this.getSaveableParent( this.attr( walkElement, 'ude_bind'), false);
            }
            else if ( this.attr( walkElement, 'ud_oid') || ( walkElement.id && walkElement.id.indexOf( "__TMP") == 0)) {
                // Saveable element found
                return walkElement;
            } else if ( this.attr( walkElement, 'ud_type') == "page") {
                // Somethings wrong
                return debug( {level:8, return:null}, "getSaveable() found page before saveable", elementOrId);
            }
            return debug( {level:8, return:null}, "can't find saveable", elementOrId);
        } 
        return debug( {level:8, return:null}, "can't find saveable", elementOrId);
    } // DOM.getSaveableParent()
    
   /**
    * Get the containing element where editor functions (style etc) can be applied
    * 
    */
    getEditableParent( elementOrId, selection = false) {
        // Get the HTML element and saveable parent
        let element = this.element( elementOrId);
        if ( !element) { return null;}
        let saveable = this.getSaveableParent( element); 
        let exTagSaveable = this.attr( saveable, 'exTag');
        // New approach test 220527
        let editableInside = this.udjson.valueByPath( UD_exTagAndClassInfo, exTagSaveable+'/editableInside');
        // Saveable not editable inside so just return saveable
        if ( !editableInside) return saveable;
        // Saveable is editable inside so walk up until we find editable element
        let walk = element;
        let exTag = this.attr( walk, 'exTag');
        let editable = this.udjson.valueByPath( UD_exTagAndClassInfo, exTag+'/editable');
        let safe = this.maxElementDepth; 
        while( !editable && walk != saveable && safe--) {
            walk = walk.parentNode;
            exTag = this.attr( walk, 'exTag');
            editable = this.udjson.valueByPath( UD_exTagAndClassInfo, exTag+'/editable');
            if ( walk.classList.contains( 'editzone')) editable = false;
        }
        return walk;
        /* TEST 22/05/27
        // Get its extended tag
        let exTag = this.attr( element, 'exTag');
        // Get the immediate parent
        let parent = element.parentNode;
        let exTagParent = this.attr( parent, 'exTag');
        let displayable = this.getDisplayableParent( element);
        // Get the saveable element containing the element and its extended tag
        let saveable = this.getSaveableParent( element); 
        let exTagSaveable = this.attr( saveable, 'exTag');
        let bindParent = this.getParentWithAttribute( 'ude_bind', element);
        if ( bindParent) {
            if ( this.attr( bindParent, 'ud_subtype') != "") { return bindParent;}
            else if ( this.attr( bindParent, 'ud_type') == "text"
                // Some editors use class linetext and have no ud_type 2DO align
                || bindParent.classList.contains( "linetext")
                || this.attr( bindParent, 'ud_mime').indexOf( "text") > -1
            ) { return saveable;}
        }
        if ( [ 'div.zoneToFill', 'div.filledZone', 'div.image'].indexOf( exTagSaveable) > -1) { return saveable;}
        // Spans in elements other than text editors are editable separetely
        let editableInside = [ 'p', 'h1', 'h2', 'h3', 'h4', 'li', 'td', 'div.drawstyles'];
        if ( [ 'span.field', 'span.button', 'span.link', 'span.drawstyle', 'span.styled'].indexOf( exTag) > -1 && editableInside.indexOf( exTagParent) > -1) { return element;} 
        else if ( exTag == "span" && ( !element.classList.contains( 'caption') || selection)) return element;
        else if ( exTag == "div.html" || ( exTag == "span" && element.classList.contains( 'caption'))) { return saveable;}
        else { return displayable;}
        */
    }
  
   /**
    * Get an HTML element's displayeable parent, ie the first div parent with ud_type
    * @param {mixed} elementOrId The HTML element or its Id
    * @return {HTMLelement} A saveable HTML element
    * @api {JS} API.dom.getDisplayableParent(elementOrId) Get displayable parent of element
    * @apiParam {mixed} elementOrId HTML element or its id
    * @apiSuccess {HTMLelement} return The displayeable HTML element
    * @apiError {object} return null
    * @apiGroup Elements
    */   
    getDisplayableParent( elementOrId) {
        let element = this.element( elementOrId);
        let safe = 5;
        let walkElement = element;
        let displayable = true;
        while ( walkElement && typeof walkElement.tagName != "undefined"
            && typeof UD_exTagAndClassInfo[ this.attr( walkElement, 'exTag')] != "undefined"
            && !( displayable = UD_exTagAndClassInfo[ this.attr( walkElement, 'exTag')].displayable)
            // && this.displayableTags.indexOf( walkElement.tagName.toLowerCase()) == -1 
            //&& !( walkElement.tagName =="DIV" && this.attr( walkElement, 'ud_type'))  // this.isComposite
            && safe--
        ) {
            walkElement = walkElement.parentNode;
        }
        if ( walkElement && typeof UD_exTagAndClassInfo[ this.attr( walkElement, 'exTag')] == "undefined") {
            console.log( "BUG udconstants.js", walkElement, this.attr( walkElement, 'exTag'));
        }
        if ( !walkElement 
            || typeof walkElement == "undefined" 
            || typeof walkElement.tagName == "undefined"
            || typeof UD_exTagAndClassInfo[ this.attr( walkElement, 'exTag')] == "undefined"
            || !displayable
            //|| (  this.displayableTags.indexOf( walkElement.tagName.toLowerCase()) == -1 && !this.attr( walkElement, 'ud_type'))
        ) { console.log( "can't find displayable", element); return null; }// 2DO capture exception
        return walkElement;
    } // DOM.getDisplayableParent()
    // Alternative (better?) name
    getTypedDivParent( elementOrId) { return this.getDisplayableParent( elementOrId);}
    
   /**
    * Get an HTML element's binded parent, ie the container used to display the element (may replace displayable)
    * @param {mixed} elementOrId The HTML element or its Id
    * @return {HTMLelement} A binded HTML element (ie with ude_bind attribute)
    * @api {JS} API.dom.getBindedParent(elementOrId) Get parent binded to another element (ude_bind attribute)
    * @apiParam {mixed} elementOrId HTML element or its id
    * @apiSuccess {HTMLelement} return The displayeable HTML element
    * @apiError {object} return null
    * @apiGroup Elements
    */   
    getBindedParent( elementOrId) {
        let element = this.element( elementOrId);
        let safe = 10;
        let walkElement = element;
        while ( walkElement && typeof walkElement != "undefined"
             && !this.attr( walkElement, 'ud_oid') && !this.attr( walkElement, 'ude_bind')
             && safe--
        ) {
            walkElement = walkElement.parentNode;
        }
        if ( !walkElement || ( !this.attr( walkElement, 'ud_oid') && !this.attr( walkElement, 'ude_bind')))
            return debug( {level:8, return:null}, "can't find saveable", element);
        if ( this.attr( walkElement, 'ude_bind')) {
            let bindId = this.attr( walkElement, 'ude_bind');
            let bind = ( bindId == "previous") ? walkElement.previousSibling : ( bindId == "next") ? walkElement.nextSibling : this.element( bindId);
            if ( bind) return bind;
        }
        debug( { level:5}, "No binded parent", element);
        return null;
    } // DOM.getBindedParent()
    
  // Get the value of an attribute from an element or one of its parents
  // parentTag ignored -- to decide if need or not use parentAttr
  getParentAttribute( parentTag, attrName, element) {
    if ( !parentTag && element) return this.parentAttr( element, attrName); //value( "..."+attrName, null, element);
    //return null;
    // 2DO default element = cursor
    parentTag = parentTag.toUpperCase();
    let elementWalk = element;
    let safe = this.maxElementDepth;    
    while ( elementWalk != document && elementWalk.tagName != parentTag && safe--) elementWalk = elementWalk.parentNode;
    if ( elementWalk == document || elementWalk.tagName != parentTag) return debug( {level:2, return: null}, "No parent with tag", parentTag, element);
    if ( attrName == "_element") { return elementWalk;} // 2DO backward compatable stuff used by udetable.js 
    else { return this.parentAttr( elementWalk, attrName);}
    // return this.value( "..."+attrName, null, elementWalk); //element.getAttribute( attrName);    
  } // DOM.getParentAttribute
   
   /**
    * Get parent of an HTML element of a certain tag
    * @param {string} elementOrId The HTML element or its id
    * @param {string} exTag The exteded tag to find
    * @return {HTMLelement} The parent if found
    */   
   getParentWithTag( elementOrId, exTag)
   {
        let elementWalk = this.element( elementOrId);
        var safe = this.maxElementDepth;     
        while ( elementWalk && elementWalk != document && this.attr( elementWalk, 'exTag') != exTag && safe--) elementWalk = elementWalk.parentNode;
        if ( !elementWalk || elementWalk == document || this.attr( elementWalk, 'exTag') != exTag) return null; 
        // debug( {level:2, return: null}, "No parent with tag", parentTag, element);
        return elementWalk;   
    } // DOM.getParentWithTag()
  
   /**
    * Get parent of an HTML element which has an attribute
    * @param {string} attrName The required attribute
    * @param {mixed} elementOrId The HTML element or its Id
    * @return {HTMLelement} The HTML element if found
    */   
  getParentWithAttribute( attrName, element)
  {
    var elementWalk = element;
    var safe = this.maxElementDepth;     
    while ( elementWalk && elementWalk != document && !this.attr( elementWalk, attrName) && safe--) elementWalk = elementWalk.parentNode;
    if ( !elementWalk || elementWalk == document || !this.attr( elementWalk, attrName)) return null; 
    // debug( {level:2, return: null}, "No parent with tag", parentTag, element);
    return elementWalk;   
  } // DOM.getParentAttribute

   /**
    * Return view element containing an element
    * @param {mixed} elementOrId  HTML element or id
    * @return {HTMLelement} The View element
    * @api {JS} API.dom.getView(elementOrId) Get View element
    * @apiParam {mixed} elementOrId HTML element or its Id
    * @apiSuccess {HTMLelement} return The View HTMLelement
    * @apiError {object} return null
    * @apiGroup Views    
    */         
    getView( elementOrId) {
        let element = this.element( elementOrId);
        let safe = 10;
        let partClassList = null;
        let walk = element;
        while ( walk && walk.id != "document" && !walk.classList.contains( 'part') && --safe) walk = walk.parentNode;
        if ( walk && walk.classList.contains( 'part')) return walk;
        return null;
    }
   /** 
    * @api {JS} API.dom.getViewType(elementOrId) Get View element
    * @apiParam {mixed} elementOrId HTML element or its Id
    * @apiSuccess {string} return The View type
    * @apiError {string} return ""
    * @apiGroup Views    
    */ 
   /**
    * Return the type of view (stored as a class) containing an element
    * @param {mixed} elementOrId  HTML element or id
    * @return {HTMLelement} The View element
    */   
    getViewType( elementOrId) {
        let view = this.getView( elementOrId);
        if ( !view) return "";
        let viewType = this.attr( view, 'ud_subtype');
        // Load map of tags/classlists according to view style
        // if ( !this.classMap) this.classMap = JSONparse( this.element( "UD_classMap").textContent);        
        // Look for view style
        // let partClass = "";
        /*
        let nextViewIds = this.udjson.parse( this.element( 'UD_nextViewIds').textContent);
        if ( !nextViewIds) debug( { level:1, return:""}, "FATAL ERROR No NextViewIds");
        let viewClasses = Object.keys( nextViewIds);
        for ( let classi=0; classi < UD_viewClasses.length; classi++) {
            if ( view.classList.contains( UD_viewClasses[ classi])) { 
                viewType = UD_viewClasses[ classi]; 
                break;
            }
        }
        */
        return viewType;
    } // getViewType()

   /**
    * Return the user-chosen class of view containing an element
    * @param {mixed} elementOrId  HTML element or id
    * @return {HTMLelement} The View element
    */   
    getViewClass( elementOrId) {
        let view = this.getView( elementOrId);
        if ( !view) return "";
        let viewType = this.attr( view, 'ud_subtype');
        if ( view.classname == "") return "";
        let classList = view.className.split( ' '); // classList.entries();  
        for ( let classi = 0; classi < classList.length; classi++) {
            let classn = classList[ classi];
            if ( 
                classn != "part" && classn != "view"
                && classn != viewType && classn.indexOf( UD_layoutPrefix) != 0
            ) {
                // This is the user-defined layout class
                return classn;
            }
        }      
        /*
        for ( let className in classList) { // of view.classList.entries()) {
            if ( 
                className[1] != "part" && className[1] != "view"
                && className[1] != viewType && className[1].indexOf( UD_layoutPrefix) != 0
            ) {
                // This is the user-defined class
                return className[1];
            }
        }
        */
        return "";
    } // getViewType()
    
    
   /**
    * Return true if element has default content
    * @param {HTMLelement} elementOrId The HTML element or its id
    * @return {boolean} True if content is 'placeholder'
    * Replaced with same functon in ude.js
    */     
    hasDefaultContent( elementOrId) {
        let element = this.element( elementOrId);
        if ( !element) return false;
        // Get default content to compare with        
        let defaultContent = this.udjson.value( UD_defaultContentByExTag, this.attr( element, 'exTag')); 
        return ( 
            element.classList.contains('initialcontent') 
            || this.attr( element, 'ude_place') == element.innerHTML
            || ( defaultContent && element.innerHTML == defaultContent)             
        );
    }  // DOM.hasDefaultContent()
    
   /**
    * Create a lookup object from a table, used by lookup() calc fct
    * @param {string} tableName Id of table which is name of Table element
    * @param {string} nameField Label of the column to get key
    * @param {string} content Label of column to get value    
    * @return {object} A named list
    */   
  createLookupFromTable( tableName, nameField, content) {
    let r = {};
    let table = document.getElementById( tableName);
    if ( !table) return null;
    let columns = [];
    for (let celli=0; celli < table.rows[0].cells.length; celli++) columns.push( table.rows[0].cells[ celli].textContent);
    let keyIndex = columns.indexOf( nameField);
    let contentIndex = columns.indexOf( content);
    let nbRows = table.rows.length;
    for ( let rowi=1;  rowi < nbRows; rowi++) {  
       if ( content.substr(0,1) == "h")
         r[ table.rows[ rowi].cells[keyIndex].textContent] = table.rows[ rowi].cells[ contentIndex].innerHTML;
       else
         r[ table.rows[ rowi].cells[keyIndex].textContent] = table.rows[ rowi].cells[ contentIndex].textContent;
    }
    return r;
  } // DOM.createLookupFromTable();
  

  /**
    * @api {JS} API.dom.removeStylesFromHTML(html,matchToClass) Remove styles from HTML
    * @apiParam {string} html HTML to process
    * @apiParam {string} matchToClass Match to a loaded CSS class if true 
    * @apiSuccess {string} return Cleasned HTML
    * @apiError {object} return null
    * @apiGroup Elements
    */ 
   /**
    * Clean HTML of styles or match to best class (for clipboarder)
    * @param {string} html HTML to process
    * @param {boolean} matchToClass Match to a loaded CSS class if true
    * @return {string} Cleasned HTML
    */    
    removeStylesFromHTML( html, matchToClass=false)
    {
        let filterStrings = [ "<body>", "</body>", "<html>", "</html>"];
        let filterTags = ['meta', 'b', 'body', 'html', 'br'];
        let cleanContent = "";
        let workDiv = null;
        if ( typeof html == "string")
        {
            // HTML provided, build a work div so we can use DOM functions
            for ( let filteri=0; filteri < filterStrings.length; filteri++) html = html.replace( filterStrings[ filteri], "");
            html = html.replace( /\n/g, "");            
            workDiv = document.createElement( 'div');
            workDiv.innerHTML = html;
        }
        else workDiv = html;  // Recurrent call with DOMified elements 
        let children = workDiv.childNodes;
        for ( let childi=0; childi < children.length; childi++) 
        {
            let child = children[ childi];
            if ( child.nodeType == Node.TEXT_NODE) 
            {
                let text = child.textContent.trim();
                cleanContent += text;
            }
            else if ( child.nodeType == Node.ELEMENT_NODE)
            {
                let tag = child.tagName.toLowerCase();
                if (  tag == "span" && this.attr( child, "style"))
                {
                    // Remove spans with styles
                    cleanContent += this.removeStylesFromHTML( child);                    
                }
                /*
                else if (  tag == "img")
                {
                    // Remove style and class from  
                    cleanContent += child.outerHTML;                    
                }
                */
                else if ( filterTags.indexOf( tag) > -1) 
                    cleanContent += this.removeStylesFromHTML( child);
                else {
                    child.className = "";
                    if ( this.attr( child, "style")) this.attr( child, "style", "");
                    cleanContent += child.outerHTML;
                }
            }
        }
        return cleanContent;
    } // DOM.removeStylesFromHTML()
  
  /*
   * 2 - INSERTION OF ELEMENTS
   */ 
    // 2DO not needed use splitText directly 
    splitTextElement( textElement, offset)
    {
        // Split a text element in 2
        //if ( offset == textElement.textContent.length) textElement.textContent += this.dummyText;
        //let next = textElement.nextSibling;
        let newTextElement = textElement.splitText(  offset);
        //if ( next) { textElement.parentNode.insertBefore( newTextElement, next);}
        //else { textElement.parentNode.appendChild( newTextElement);}
        return newTextElement;
    }  // DOM.splitTextElement()
    
    // Move to cursor ?
    getTextElementAtCursor() {
        let textNode = this.cursor.textElement;
        if ( !textNode) {
            let element = this.cursor.HTMLelement;
            textNode = document.createTextNode( "");
            element.appendChild( textNode);
            this.cursor.textElement = textNode;
            this.cursor.textOffset = 0;
        }
        return textNode;
    }
  
    // Insert an unattached HTML element ready for insert
   /**
    * Prepare an HTML element for insertion into document
    * @param {string} tag Tag of HTML element
    * @param {mixed} data Content of element as string, an element to copy or attributes
    * @param {object} attributes Attributes with values  to set in element
    * @return {HTMLelement} An unattached HTML element
    * @api {JS} API.dom.insertPreparedElement(tag,data,attributes={}) Insert a prepared element
    * @apiParam {string} tag Tag of HTML element
    * @apiParam {mixed} data Content of element as string, an element to copy or attributes
    * @apiParam {object} attributes Attributes with values  to set in element
    * @apiSuccess {HTMLelement} return Unattached element
    * @apiError {object} return null
    * @apiGroup Elements
    */    
    insertPreparedElement( unattachedElement, before=this.cursor.HTMLelement, parent=null)
    {
        // Check arguments
        if (!before && !parent) return  debug( {level:2, return:null}, "No where to insertElement");
        if ( !parent) parent = before.parentNode;
        // Check before is not an editZone
        if ( before && before.id && ( before.id.indexOf( 'editZone') > -1 || before.id.indexOf( 'viewZone') > -1)) // 2DO fct
        {
            // Edit zone goes with previous element, so skip
            before = before.nextSibling;
        }
        debug( {level:5}, "Inserting in DOM", unattachedElement, before);
        var newElement = null;
        if ( before)
        {
            // Insert before
            newElement = parent.insertBefore( unattachedElement, before);
        }  
        else
        { 
            // Append  
            newElement = parent.appendChild( unattachedElement);
        }
        
        if ( before == this.cursor.HTMLelement)
        {
            // Position cursor on new element
            this.cursor.HTMLelement = newElement;      
            this.cursor.HTMLoffset = 0;
            this.cursor.textElement = this.cursor.HTMLelement.childNodes[0];
            this.cursor.textOffset = 0;
            this.cursor.set();        
        }
        return newElement;

    } // DOM.insertPreparedElement  
  
   /**
    * Prepare an HTML element for insertion into document
    * @param {string} tag Tag of HTML element
    * @param {mixed} data Content of element as string, an element to copy or attributes
    * @param {object} attributes Attributes with values  to set in element
    * @return {HTMLelement} An unattached HTML element
    * @api {JS} API.dom.prepareToInsert(tag,data,attributes={}) Create an element
    * @apiParam {string} tag Tag of HTML element
    * @apiParam {mixed} data Content of element as string, an element to copy or attributes
    * @apiParam {object} attributes Attributes with values  to set in element
    * @apiSuccess {HTMLelement} return Unattached element
    * @apiError {object} return null
    * @apiGroup Elements
    */   
    prepareToInsert( tag, data, attributes={}) {
        // Create or clone element
        let element = null;
        if ( typeof data == "object") {
            if ( typeof data.parentNode != "undefined") {
                // Consider data as a model and clone
                element = data.cloneNode( true); //deep = try
                element.classList.remove( 'rowModel');
                element.classList.remove( 'model');
            } else {
                // Just a set of attributes Not really needed as caller can use the attributes parameter
                element = document.createElement( tag);
				if ( tag == "img") {
                    element.setAttribute( 'src', data.src);
                    if ( data.class) element.setAttribute( 'className', data.src);
                }
            }
        } else {            
            // Create element
            element = document.createElement( tag);
            if ( !element) return debug( {level:2, return:null}, "Can't create", tag);
            // 2DO Improve - always innerHTML and add empty text node if empty
            if ( data ) {
                // Consider data as innerHTML
                element.innerHTML = data;
            } else {
                // Consider data as textContent
                let textContent = this.dummyText;
                if ( typeof data == "string" && data != "") textContent = data;
                // Add text content
                if ( ['p', 'span', 'td', 'li'].indexOf( tag) > -1 || textContent != this.dummyText) {   
                    // Add text node to element
                    let newText = document.createTextNode( textContent);
                    element.appendChild( newText);
                }
            }   
        }
        // Add attributes
        for (let key in attributes) {
            if ( key == 'class') element.className = attributes[key];
            else this.attr( element, key, attributes[key]);
        }
        // Return unattached, but prepared, element
        return element;
    } // prepareToInsert()
    
    insertElementAtCursor( elementType, data, attributes={}, beforeOrAfter=true) 
    {
        if ( !this.cursor.HTMLelement) return debug( { level:2, return:null}, "No cursor to insert at", this.cursor);  
        let at = this.cursor.HTMLelement;
        let newElement = this.insertElement( elementType, data, attributes, at, beforeOrAfter);
        if ( newElement)
        {
            if ( elementType == 'br' && Array.from( at.childNodes).indexOf( newElement)) {
                // Add Text
                let newText = document.createTextNode( '');
                if ( newElement.nextSibling) at.insertBefore( newText, newElement.nextSibling);
                else at.appendChild( newText);
                this.cursor.textElement = newText;
                this.cursor.textOffset = 0;
            } else {
                // Move cursor to newElement
                this.cursor.HTMLelement = newElement;
                this.cursor.HTMLoffset = 0;
                this.cursor.textElement = null; // set will find it
            }
            this.cursor.set();
        }    
        return newElement;
    }
    
    // Create and insert an HTML element into document
    // 2DO better if insertBefore, insertAfter, insertIn
   /**
    * Create & insert an HTML element without informing VIEW-MODEL
    * @param {string} tag Tag of HTML element
    * @param {mixed} data Content of element as string, an element to copy or attributes
    * @param {object} attributes Attributes with values  to set in element
    * @param {HTMLelement} at Where to insert, null = cursor
    * @param {boolean} beforeOrAfter Insert before (false, default) or After( true)
    * @param {boolean} inside Insert inside at if true
    * @return {HTMLelement} Inserted HTML element
    * @api {JS} API.dom.insertElement(tag,data,attributes={},at=null,beforeOrAfter=false,inside=false) Insert an element
    * @apiParam {string} tag Tag of HTML element
    * @apiParam {mixed} data Content of element as string, an element to copy or attributes
    * @apiParam {object} attributes Attributes with values  to set in element
    * @apiParam {HTMLelement} at Where to insert, null = cursor
    * @apiParam {boolean} beforeOrAfter Insert before (false, default) or After( true)
    * @apiParam {boolean} inside Insert inside at if true
    * @apiSuccess {HTMLelement} return Inserted element
    * @apiError {object} return null
    * @apiGroup Elements
    */       
    insertElement( tag, data, attributes={}, at = null, beforeOrAfter = false, inside = 0) {
        debug( {level:5, coverage:"insertElement"});        
        // Build element to insert
        let elementToInsert = this.prepareToInsert( tag, data, attributes);
        if ( !elementToInsert) return debug( { level:2, return:null}, "Can't insert", elementType, data, attributes);
        // Determine parent/before for insertBefore or parent for appending
        let before = null;
        let parent = null;
        if ( !at) at = this.cursor.HTMLelement; // use cursor
        if ( !at) return debug( { level:1, return:null}, "Don't know where to insert", elementType, data, attributes);
		// at is the reference element for insertion
        parent = at.parentNode;
        before = at;
        // Determine extended tag
        let exTag = this.attr( elementToInsert, "exTag");
        if ( beforeOrAfter) {
            // Insert AFTER at, ie bEFORE at.nextSibling. 
            // If no next sibling, or not ELEMENT_NODE then before = null which will force appending
            let nextSib = at.nextSibling;                   
            if ( nextSib && nextSib.nodeType != Node.ELEMENT_NODE) {
                //console.log( nextSib.nodeType, Node, Node.ELEMENT_NODE); dumpElement( nextSib);    
                nextSib = null;
            }
            before = nextSib;
           // dumpElement( nextSib);
        }
        // Detect if element has special insertion instructions
        let insertInstruction = this.udjson.value( UD_exTagAndClassInfo[ exTag], 'insertable');
        if ( ( insertInstruction == "inside" && inside > -1) || inside > 0) {
            // Insert INSIDE at so set before to appropriate text node and parent to at
            if ( at == this.cursor.HTMLelement) {
                parent = at;
                if ( this.cursor.textElement && this.cursor.textOffset > 0) {
                    before = this.splitTextElement( this.cursor.textElement, this.cursor.textOffset);
                }
                else if ( this.cursor.textElement && this.cursor.textOfffset == 0) {
                    before = this.cursor.textElement;
                }  
            } else { 
                parent = at;
                before = null;
            }    
        }
        // Detect if element is to be inserted at parent's level
        if ( !inside && insertInstruction == "above") {
            // Insert ABOVE at so set before to appropriate text node and parent to at
            let above = at.parentNode;
            if ( !above || above == this.topElement) return debug( { level:2, return:null}, "Can't find parent", at);            
            before = above.nextSibling; // can be null
            parent = above.parentNode;
        }
        // Insert the prepared element
        let newElement = this.insertPreparedElement( elementToInsert, before, parent);
        debug( {level:5, coverage:"insertElement"});
        return newElement;
    } // DOM.insertElement()
    
    remove( elementOrId) {
        let element = this.element( elementOrId);
        if ( element) { element.remove();}
    }
  
   /*
   * 3 - STYLE AND CONTENT OF EXISTING ELEMENTS
   */
   /**
    * Set an element's content
    * @param {string} elementOrId HTML element or its id or name
    * @param {string} html HTML or text
    * @return {HTMLelement} The filled HTML element
    * @api {JS} API.dom.fillElement(elementOrId,html) Set an element's contents
    * @apiParam {string} elementOrId HTML element or its id or name
    * @apiParam {string} html HTML or text
    * @apiSuccess {HTMLelement} return The filled HTML element
    * @apiError {object} return null
    * @apiGroup Elements
    */      
    fillElement ( elementOrId, html) {
        let element = this.element( elementOrId);
        if ( !element) return debug( { level:5, return:null}, "fillElement can't find", elementOrId)
        element.innerHTML=html;
        return element;
    } // DOM.fillElement()
  
    setStyle( className, child)
    {
        debug( { level:2}, "setStyle OLD called");
        return value( 'class', className, this.topElement);
    //this.topElement.setAttribute( 'class', className);
    } // DOM.setStyle()
  
   /**
    * @api {JS} API.dom.setStyleAttr(elementName,attrName,value) Set a style attribute in a named element
    * @apiParam {string} elementName Name of a saveable element
    * @apiParam {string} attrName Attribute's name
    * @apiParam {string} value Value to set
    * @apiSuccess {HTMLelement} return The HTML element whose style was modified
    * @apiError {object} return null
    * @apiGroup Styles
    */        
   /**
    * Set a style attribute in a named element
    * @param {string} elementName Name of a saveable element
    * @param {string} attrName Attribute's name
    * @param {string} value Value to set
    * @return {HTMLelement} The filled HTML element
    */
    setStyleAttr( elementName, attrName, value) {
        let candidates = document.querySelectorAll( "[name='"+elementName+"']");
        let element = null;
        if ( candidates.length == 1) { element = candidates[0];}
        else {
            element = document.getElementById( elementName);
            if ( !element) { return null;}    
            element = this.getSaveableParent( element);             
        }               
        element.style[ attrName] = value;
        return element;
    } // DOM.setStyleAttr()

   /**
    * @api {JS} API.dom.styleSelection(selection) Set a style attribute in a named element
    * @apiParam {string} elementName Name of a saveable element
    * @apiParam {string} attrName Attribute's name
    * @apiParam {string} value Value to set
    * @apiSuccess {HTMLelement} return The HTML element whose style was modified
    * @apiError {object} return null
    * @apiGroup Styles
    */        
   /**
    * Add span with class around text selection
    * @param {string} elementName Name of a saveable element
    * @param {string} attrName Attribute's name
    * @param {string} value Value to set
    * @return {HTMLelement} The filled HTML element
    */
    styleSelection( selection, className, id="") {
        if ( !selection) { selection = this.cursor.fetch();}
        // Get start and end elements of selection which are always text nodes as forced by cursor.fetch()
        let startText = selection.textElement;
        let endText = selection.focusElement; 
        if ( !startText || !endText || startText.nodeType != Node.TEXT_NODE || endText.nodeType != Node.TEXT_NODE) { return false;}
        // Find containing elements
        let startElement = startText.parentNode;
        let endElement = endText.parentNode;
        if ( startElement.parentNode != endElement.parentNode) { return false;}
        // Build content of new span
        let html = "";
        let before = null;
        if ( startText == endText) { 
            // Selection in a single text node
            html = startText.textContent.substring( selection.textOffset, selection.focusOffset);
            let next = endText.nextSibling;
            startText.textContent = startText.textContent.substring( 0, selection.textOffset) + endText.textContent.substring( selection.focusOffset);
            let insertBefore = ( selection.textOffset) ? this.splitTextElement( startText, selection.textOffset) : startText;
            let attr = {class: className, ud_type:className, ude_stage:"on"};
            let span = this.insertElement( 'span', html, attr, insertBefore, false, -1);
            this.cursor.setAt( span);
        } else if ( startElement == endElement) {
            // Start and end in same element but there must be a span element in between
            return false;
        } else {
            // Start and end are in 2 different elements, one or both are span elements possibly with a span between
            let walkElement = startElement;
            let safe  = 10;
            while( walkElement != endElement && --safe) {
                // Remove span.notype tags
                if ( [ 'span.field', 'span.input'].indexOf( this.attr( walkElement, 'exTag')) > -1) { html += walkElement.outerHTML;}
                else { html += walkElement.textContent;}
                walkElement = walkElement.nextSibling();
            }
            if ( [ 'span.field', 'span.input'].indexOf( this.attr( walkElement, 'exTag')) > -1) { html += walkElement.outerHTML;}
            else { html += endElement.textContent;}            
        }
        // 
        let attr = {class: className};
        if ( id) { attr.id = id; attr.name = id;}
        // Insert span with extracted content
        if (  before) {
            let span = this.insertElement( 'span', html, {class: className}, before);
            return true;
        }
        // Mark element as changed 2DO this fct should be in UDE or 
        API.setChanged( this.cursor.HTMLelement);      
    } // DOM.styleSelection()
    
   /**
    * Convert an HTML element's tag
    * @param {string} elementOrId HTML element or its id or name
    * @param {string} newTag Extended tag of new HTML element
    * @return {HTMLelement} The changed HTML element
    * @api {JS} API.dom.changeTag(elementOrId, exTag) Change an element's tag
    * @apiParam {string} elementOrId HTML element or its id or name
    * @apiParam {string} exTag Extended tag syntax p or div.table
    * @apiSuccess {HTMLelement} return The filled HTML element
    * @apiError {object} return null
    * @apiGroup Elements
    */          
    changeTag( elementOrId, newTag, newUdType=null) {
        // Find element to change
        let element = this.element( elementOrId);
        if ( !element || !element.parentNode) return false;
        // 
        let id = element.getAttribute('id');        
        let tagParts = newTag.split( '.');
        if ( newTag.indexOf( '.') && tagParts.length == 1) tagParts = newTag.split( '.'); 
        if ( newUdType && tagParts.length == 1) tagParts.push( newUdType); // backward compatibility
        // Build full tag string
        var tag = "";
        tag += '<'+newTag;
        tag += ' id="'+id+'"';
        tag += ' ud_oid="'+this.attr( element,'ud_oid')+'"'; 
        tag += ' ud_dupdated="'+this.attr( element, 'ud_dupdated')+'"';
        tag += ' ud_dchanged="'+this.attr( element, 'ud_dchanged')+'"';
        tag += ' ud_iheight="'+this.attr( element, 'ud_iheight')+'"';
        tag += ' ud_mode="'+this.attr( element, 'ud_mode')+'"';
        if ( tagParts.length > 1 )
        {
            tag += ' ud_type="'+tagParts[1]+'"';
            tag += ' class="'+tagParts[1]+'"';
            if ( tagParts.length > 2) tag += ' ud_subtype="'+tagParts[2]+'"';
        }            
        tag += '>';
        element.outerHTML=tag+element.innerHTML+'</'+newTag+'>';
        return this.element(id);
    } // changeTag()

   /** 
    * @api {JS} API.dom.removeClassFromChildren(elementOrId, className) Remove class from descendance
    * @apiParam {string} elementOrId HTML element or its id or name
    * @apiParam {string} className Class to remove
    * @apiSuccess {HTMLelement} return The filled HTML element
    * @apiGroup Elements
    * @apiError {object} return null
    */ 
   /**
    * Remove a class from children, grand-children etc
    * @param {string} elementOrId HTML element or its id or name
    * @param {string} className Class to remove
    * @return {HTMLelement} The changed HTML element
    */
    removeClassFromChildren( elementOrId, className) {
        let element = this.element( elementOrId);
        if (!element) return null;
        let childNodes = element.childNodes;
        for (let ichild=0; ichild < childNodes.length; ichild++) {
            if ( childNodes[ichild].nodeType != 3) {
                childNodes[ichild].classList.remove( className);
                this.removeCSSfromAll( childNodes[ichild], className);
            }
        }  
        return element;        
    } // DOM.removeCSSfromAll()

    removeCSSfromAll( className, parent) {
        debug( { level:2}, "rmoveCSSfromAll OLD called");  
        var childNodes = parent.childNodes;
        for (var ichild=0; ichild < childNodes.length; ichild++) {
            if ( childNodes[ichild].nodeType != 3) {
                childNodes[ichild].classList.remove( className);
                this.removeCSSfromAll( className, childNodes[ichild]);
            }
        }     
    } // DOM.removeCSSfromAll()
    
   /** 
    * @api {JS} API.dom.keepPermanentClasses(classStrList,saving=false) Return className string with temporary classes removed and * in first character removed (to avoid this being removed)
    * @apiParam {string} classStrList Space or comma seperated list of classes (className attribute)
    * @apiParam {boolean} saving Remove also ud_type classes if list is to be saved to DB
    * @apiSuccess {string} return The filtered space or comma seperated list
    * @apiGroup Classes management
    */ 
   /**
    * Remove a class from children, grand-children etc
    * @param {string} classStrList Space or comma seperated list of classes (className attribute)
    * @param {boolean} aving Remove also ud_type classes if list is to be saved to DB
    * @return {string} return The filtered space or comma seperated list
    */    
    keepPermanentClasses( classStrList, saving=false) {
        // Convert to array if strike
        // Define temporary or work classes 2DO COnstant
        let tempClasses = UD_register[ 'UD_wellKnown'][ 'UD_editorTemporaryClasses'];
        if ( saving) {
            if ( typeof API.listTypeAndSubTypeClasses == "undefined") {
             tempClasses = tempClasses.concat( ['part', 'subpart', 'zone', 'table', 'list', 'graphic', 'text', 'zoneToFill', 'filledZone', 'page']);
            } else {
                tempClasses = tempClasses.concat( API.listTypeAndSubTypeClasses());
            }
        }
        // Build array of classes from CSV or SSV 
        let sep = ' ';
        if ( classStrList.indexOf( ',') > -1) { sep = ",";}
        let classes = classStrList.split( sep);
        let keepClasses = [];
        for ( let classi=0; classi < classes.length; classi++) {
            let classname = classes[ classi];
            if ( classname.charAt( 0) != "_" && tempClasses.indexOf( classname) == -1) { 
                if ( classname.charAt(0) == '*') classname = classname.substr(1);
                keepClasses.push( classname);
            }
        }        
        if ( keepClasses.length) { return keepClasses.join( sep);}
        return "";
    }
    
    keepPermanentClass( classStrList) {
        // Define temporary or work classes 2DO COnstant
        let tempClasses = UD_register[ 'UD_wellKnown'][ 'UD_editorTemporaryClasses'];        
        tempClasses = tempClasses.concat( API.listTypeAndSubTypeClasses());

        // Build array of classes from CSV or SSV 
        let sep = ' ';
        if ( classStrList.indexOf( ',') > -1) { sep = ",";}
        let classes = classStrList.split( sep);
        let keepClasses = [];
        for ( let classi=0; classi < classes.length; classi++) {
            let classname = classes[ classi];
            if ( classname.charAt( 0) != "_" && tempClasses.indexOf( classname) == -1) { keepClasses.push( classname);}
        }        
        if ( keepClasses.length) { return keepClasses[ 0];}
        return "";        
    } // DOM.keepPermanentClass()
    
    keepTemporaryClasses( classStrList) {
        // Convert to array if strike
        // Define temporary or work classes 2DO COnstant
        let tempClasses = [ 'editing', 'edcontainer', 'edinside'];          
        // Build array of classes from CSV or SSV 
        let sep = ' ';
        if ( classStrList.indexOf( ',') > -1) { sep = ",";}
        let classes = classStrList.split( sep);
        let keepClasses = [];
        for ( let classi=0; classi < classes.length; classi++) {
            let classname = classes[ classi];
            if ( classname.charAt( 0) != "_" && tempClasses.indexOf( classname) > -1) { keepClasses.push( classname);}
        }        
        if ( keepClasses.length) { return keepClasses.join( sep);}
        return "";
    }


  /*
   * 4 - HTML CALCULATIONS
   */
   /**
    * Get HTML length of a text litteral
    * @param {string} text Text to measure
    * @return {integer} Length
    * @api {Formula} getLengthOfText(text) Length of text
    * @apiParam {string} text Text to measure
    * @apiSuccess {integer} return Length of text
    * @apiError {object} return null
    * @apiGroup Elements
    */    
   getLengthOfText( text) {
     let element = document.createElement("div");
     element.textContent = text;
     let r = element.innerHTML.length;
     return debug( { level:5, return:r, coverage:6, file:"dom.js"}, "getLengthOfText()");
   } // DOM.HTML_getLengthOfText()

   /**
    * @api {JS} API.dom.increment(elementOrId,attribute,amount=1)
    * @apiParam {mixed} elementOrId The HTML element or its id
    * @apiParam {mixed} attribute The name of the value to increment
    * @apiSuccess {object} return Length of text
    * @apiError {object} return null
    * @apiGroup Elements
    */
   /**  
    * Increment a value, sucu as scrollTop
    * @param {string} text Text to measure
    * @param {string} cssStyle Style to use
    * @return {object} Bounding rectangle
   */    
    increment( elementOrId, attr, amount=1 ) {
        let element = this.element( elementOrId);
        let value = element[ attr];
        let units = value.substring( -2);
        value = parseFloat( value.substring( 0, -2));
        value += amount;
        element[ attr] = value+units;
    }

   /**
    * @api {JS} API.dom.getWidthAndHeightOfText(text) {width, height}
    * @apiParam {string} text Text to measure
    * @apiSuccess {object} return Length of text
    * @apiError {object} return null
    * @apiGroup Elements
    */
   /**  
    * Get width and height of a text litteral for a specific class
    * @param {string} text Text to measure
    * @param {string} cssStyle Style to use
    * @return {object} Bounding rectangle
   */    
    getWidthAndHeightOfText( text, cssClass) {
        let element = document.getElementById("textWidthAndHeightCalculator");
        if ( !element) element = document.createElement( 'div');
        if (cssClass) element.classList.add( cssClass); // Get fontsize
        element.style.fontSize = 14;
        element.textContent = text;
        let r = element.getBoundingClientRect();
        return r;
    } // DOM.getWidthAndHeightOfText()
  
   /**
    * @api {JS} API.dom.isInViewport(elementOrId) True if view port
    * @apiParam {string} elementOrId HTML element or its id
    * @apiSuccess {boolean} return True if visible
    * @apiGroup Elements
    */
   /**
    * Returns True if element is in view port
    * @param {mixed} elementOrId HTML element or its id
    * @return {boolean} True if in view port
    */    
    isInViewport( elementOrId) {
        let element = this.element( elementOrId);
        if ( !element) return false;
        else if ( element.nodeType != Node.ELEMENT_NODE) return true;
        const rect = element.getBoundingClientRect();
        return (
            rect.top > 0 &&
            rect.left > 0 &&
            rect.bottom <= 2*(window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= 2*(window.innerWidth || document.documentElement.clientWidth)
        );
    } // DOM.isInViewport()

   /**
    * @api {JS} API.dom.isVisible(elementOrId, containerTag) True if visible
    * @apiParam {string} elementOrId HTML element or its id
    * @apiSuccess {boolean} return True if visible
    * @apiGroup Elements
    */
   /**
    * Returns True if an element is wholly or partially visible
    * @param {mixed} elementOrId HTML element or its id
    * @return {boolean} True if visible
    * 2DO may need parameter for completely visible
    */    
    isVisible( elementOrId, containerTag = "div") {
        if ( !this.element( 'scroll')) return true;
        let r = false;
        let element = this.element( elementOrId);
        // 2DO look for parent with overflow:scroll
        let walk = element;
        let container = null;
        let safe = 10;
        let overflowY = "";
        while ( 
            walk
            && walk != this.topElement            
            && walk.style.display != "none"
            && !walk.classList.contains( 'hidden')
            && ( walk.style.opacity == "" || walk.style.opacity != 0)
            && safe--
        ) {
            if ( containerTag && walk.tagName.toLowerCase() == containerTag) { container = walk;}
            overflowY = this.attr( walk, "computed_overflowY");
            if ( overflowY == "scroll" || overflowY == "auto"/*|| overflowY == "hidden"*/) { container = walk; break;}
            walk = walk.parentNode;
        }
        if ( walk == this.topElement || overflowY == "scroll" || overflowY == "auto") { 
            // Made it to top or scrolling container without encountering invisibility
            if ( container) {
                // Check container offset 
                /* complely visible
                 * let bottom = ( partial) ? element.offsetTop + 10 : element.offsetTop + element.clientHeight;
                 * use bottom below
                */
                if ( 
                    element.offsetTop >= container.scrollTop 
                    && ( element.offsetTop /*+ element.clientHeight*/) <= ( container.offsetTop + container.offsetHeight + 10)
                ) {
                    r = true;
                } 
            } else { r = true;}
        }
        /*
        let container = this.getParentWithTag( element, containerTag);
        if ( !element || !container) return true;
        // const rect = { top: container.scrollTop, bottom: container.scrollTop + container.clientHeight};
        let r = (
            element.style.display != "none"
            && !( element.style.display == "" && element.classList.contains( 'hidden'))
            && element.style.opacity != 0
            && element.offsetTop >= container.scrollTop 
            && ( element.offsetTop + element.clientHeight) <= ( container.scrollTop + container.clientHeight + 10)
        );
        */
        return r;
    } // DOM.isVisible()
    
   /**
    * @api {JS} API.dom.makeVisible(elementOrId, containerTag) True if made visible
    * @apiParam {string} elementOrId HTML element or its id
    * @apiSuccess {boolean} return True if visible
    * @apiGroup Elements
    */   
  /**
    * Make an element visible
    * @param {mixed} elementOrId HTML element or its id
    * @return {boolean} True if visible
    */    
    makeVisible( elementOrId, containerOrId = "scroll", mode = "middle") {
        // Get elements
        let element = this.element( elementOrId);
        let container = this.element( containerOrId);
        if ( !element || !container) return false;
        if ( element.style.display == "none" || ( element.style.display == "" && element.classList.contains( 'hidden'))) { return false;}
        // Compute required offset
        const bounds = element.getBoundingClientRect();
        const height = document.documentElement.clientHeight - container.offsetTop; // clientHeight
        let saveable = this.getSaveableParent( element);
        let anchor = element.offsetParent;
        let offset = ( saveable && saveable.offsetParent != anchor) ? saveable.offsetTop + element.offsetTop : element.offsetTop;
        let top = ( offset - container.offsetTop);
        top -= ( mode == "top") ? 0 : height/3;
        if ( top < 0) { top = 0;}
        if ( typeof container.scrollTo == "function") {
            // Scroll
            let view = this.getView( element);
            let transfo = this.attr( view, 'computed_transform');
            if ( transfo && transfo != "none") { // TESTING 2022-05-17 Assume scale(0.8)
                container.scrollTo( 0, top); // *0.8); // Don't scale with mobile full page
            } else container.scrollTo( 0, top);
        }
        // API.clearCursor();
        //container.scrollTop = top;
        return true;
    } // DOM.makeVisible()
    
    /**
    * @api {JS} API.dom.isHTML(text) True if text is HTML
    * @apiParam {string} text Text to test
    * @apiSuccess {boolean} return True if HTML
    * @apiGroup Text
    */
   /**
    * Returns True if element is in visible
    * @param {string} text Text to test
    * @return {boolean} True if visisble
    */    
    isHTML( text) {
        let temp = document.createElement( 'div');
        temp.innerHTML = text;
        if ( temp.innerHTML == temp.textContent 
            || ( temp.childNodes.length == 1 && temp.childNodes[0].nodeType == Node.TEXT_NODE)
        ) return false;
        return true;
    } // DOM.isHTML()
    
   /**
    * @api {JS} API.getSelector(element) Return a selector (ie path to) to find an element
    * @apiParam element The element to point too
    * @apiGroup Elements
    */
    getSelector( element) {
        let selector = ""; 
        if ( !element.id ) {
            // Select nth span within parent
            // !!!IMPORTANT tag is needed as untagged :nth-child doesn't give good results on tables
            let parent = element.parentNode;
            if ( !parent) { return debug( { level:2, return:""}, "Can't build selector for", element);}
            let tag =  element.tagName.toLowerCase(); 
            let n = Array.prototype.indexOf.call(parent.getElementsByTagName( tag), element)+1;            
            let parentSelector = "";            
            if ( parent.id) { selector = { child:n, tag: tag, parent: parent.id};}
            else { 
                parentSelector = this.getSelector( parent);
                if ( !parentSelector) return "";
                selector = { child:n, tag: tag, parent:convertToObject( parentSelector )};
            }
            /*
                let parent2 = parent.parentNode;
                let n2 = Array.prototype.indexOf.call(parent2.children, parent)+1;
                selector = { grandchild:n, child:n2, parent: parent2.id};
            } */
            // selector = "'" + JSON.stringify( selector) + "'";
            // selector = JSON.stringify( selector); //.replace( /&/g, '&amp;').replace( /"/g, '&quot;');
            // Make a object string using only ' as " will be used for the attribute
            let selectorStr = "{";
            for ( let key in selector) { 
                let val = selector[ key];
                /*
                if ( key == "parent" && typeof val == "object") { selectorStr+= '"' + key '":' + parentSelector + ",";}
                else if ( isNaN( val)) { selectorStr += '"' + key + '":"' + val + '",';}
                else { selectorStr += key + ':' + val + ',';}
                */
                if ( key == "parent" && typeof val == "object") { selectorStr+= key + ":" + parentSelector + ",";}
                else if ( isNaN( val)) { selectorStr += key + ":'" + val + "',";}
                else { selectorStr += key + ':' + val + ',';}               
            }
            selectorStr = selectorStr.substr( 0, selectorStr.length - 1) + "}";
            selector = selectorStr;
        } else { selector = "'" + element.id + "'";}
        return selector;
    }
    
   /**
    * Arrange a table
    */
    arrangeTable( tableId, to=true) {
        //let tableId = table.id;
        if ( to && typeof tableId == "string") {
            // Initialising so delay execution
            setTimeout( function() { API.dom.arrangeTable( tableId, false);}, 500); 
            return;           
        }
        let table = this.element( tableId);
        if ( !table || table.classList.contains( 'textContent') || !this.isVisible( table)) { return;}
       /* if ( to && table.id) { 
            // Initialising so delay execution
            setTimeout( function() { API.dom.arrangeTable( table.id, false);}, 500); 
            return;
        } else {*/
            // if ( table.id) { API.updateTable( table.id);} // Update identified tables       
            let tableHead = API.dom.element( 'thead', table);
            let tableBody = API.dom.element( 'tbody', table);
            // 2DO look for display block
            if ( tableBody && tableHead) {
                // Link scrolling of head with body
                API.dom.attr( tableBody, 'onscroll', "this.previousSibling.scrollLeft = this.scrollLeft;");
                let fontSize = 16;            
                let cols = tableHead.rows[0].cells;
                // 2DO only continue if dataset or overflow-x:scroll or no width set  
                // Pass 1 - get total/average column widths in chars
                let bodyCharLength = [];
                let bodyCharTotal = 0;
                let maxColCharLength = []
                let rowCount = tableBody.rows.length;                
                for ( let coli=0; coli < cols.length; coli++) {
                    let titleWidth = tableHead.rows[0].cells[ coli].textContent.length;
                    bodyCharLength.push(0);
                    maxColCharLength.push(0);
                    for ( let rowi =0; rowi < rowCount; rowi++) {
                        let colb = tableBody.rows[ rowi].cells[ coli];
                        // Get length of longest line in text                        
                        let colTextA = colb.innerHTML.split( "<br>");
                        let colLen = 0;
                        for ( let txti=0; txti < colTextA.length; txti++) {
                            // Convert HTML to text
                            let lineHTML = colTextA[ txti];
                            let work = document.createElement( 'div');
                            work.innerHTML = lineHTML;
                            let txt = work.textContent;
                            if ( txt.length > colLen) colLen = txt.length;
                        }
                        // Take length of cell as longest line or title                     
                        let len = Math.max( colLen,  titleWidth);
                        // Don't let length fall below average
                        if ( rowi) { len = Math.max( len, bodyCharLength[ coli]/rowi);}
                        bodyCharLength[ coli] += len;
                        // Store max length for this column and total for table body
                        if ( len > maxColCharLength[ coli]) maxColCharLength[ coli] = len;
                        bodyCharTotal += len;
                        // 2DO ensure right justif if nb
                    }                    
                }                 
                if ( !bodyCharTotal) return;
                // Pass 2 - set body & head widths in pixels for each column
                let maxTableWidth = this.attr( table, UD_useComputedPrefix+'maxWidth'); 
                let visibleWidth = table.parentNode.getBoundingClientRect().width - 5 * cols.length;
                let transformRatio = 1;
                let view = API.getView( table);
                let transform = this.attr( view, 'computed_transform');
                if ( transform && transform != "none") {
                    let w = transform.match( /matrix\(([^,]*),/)
                    if ( w.length > 1) transformRatio = parseFloat( w[1]);
                }
                for ( let coli=0; coli < cols.length; coli++) {
                    let colh = cols[ coli];
                    // let colb = tableBody.rows[0].cells[ coli];
                    // let width = colb.getBoundingClientRect().width - 2;
                    bodyCharTotal *= transformRatio;
                    let widthPerCent = Math.round( 100*bodyCharLength[ coli]/bodyCharTotal);
                    let width = Math.round( visibleWidth * bodyCharLength[ coli]/bodyCharTotal);
                    let minWidth = Math.min( 
                        Math.round( 10*bodyCharLength[ coli]/( rowCount * transformRatio)), 
                        ( widthPerCent > 35) ? Math.round( width*0.6) : width
                    )/transformRatio;
                    let useWidth = 0;
                    if ( maxTableWidth && maxTableWidth != "none") {
                        // If table has max-width then use this for scollable table
                        let maxWidth = Math.round( maxTableWidth * bodyCharLength[ coli]/bodyCharTotal);
                        useWidth = Math.min( fontSize*maxColCharLength[ coli], maxWidth);
                    } else {
                        // Use visible width to avoid horizontal scrolling
                        useWidth = width;
                    }
                    if ( useWidth > 0) {
                        for ( let rowi=0; rowi < tableBody.rows.length; rowi++) {
                            let colb = tableBody.rows[ rowi].cells[coli];
                            colb.style.minWidth = useWidth + "px";
                            colb.style.maxWidth = useWidth + "px";
                        }
                        colh.style.minWidth = useWidth + "px";
                        colh.style.maxWidth = useWidth + "px";

                        /*
                        colb.style.minWidth = minWidth + "px";
                        colb.style.maxWidth = maxWidth + "px";
                        colb.style.width = width + "px";
                        colh.style.minWidth = minWidth + "px";
                        colh.style.maxWidth = maxWidth + "px";
                        colh.style.width = width + "px";
                        */
                    }
                } 
            }
        //}
    }    
    
    arrangeTables( view) {
        let tables = this.elements( 'table', view);
        for ( let tablei=0; tablei < tables.length; tablei++) {
            let table = tables[ tablei];
            this.arrangeTable( table, false);
        }
    }
  
} // class DOM

if ( typeof process == 'object') {    
    // Testing under node.js 
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined") global.ModuleUnderTest = "DOM";
    let domcursor = require( "./domcursor.js");
    const DOM_cursor = domcursor.DOM_cursor;    
    let udjsonmod = require( "../$$$/udjson.js");
    const UDJSON = udjsonmod.UDJSON;    
    let domvaluemod = require( "./domvalue.js");
    const DOMvalue = domvaluemod.DOMvalue;    
    module.exports = { DOM:DOM, DOM_cursor:DOM_cursor, JSONparse:JSONparse, JSONvalue:JSONvalue, UDJSON:UDJSON, DOMvalue:DOMvalue};
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined") {
        // Test this module
        console.log( 'Syntax dom.js OK');           
        console.log( 'Start of dom.js test program');
        // Setup browser emulation
        let path = "../..";
        const testMod = require( path+'/tests/testenv.js');
        testMod.load( []);    
        // Setup our DOM object
        var dom = new DOM( document.getElementById( 'document'), null);
        // Tests
        let test = "";
        {
            test = "Test 1";
            console.log( dom.value( "B0100000001000000M...textContent"));
            let element = dom.element( "B0100000000000000M");
            // dumpElement( element);
            let children = dom.children( element);
            // console.log( children);
            let firstChild = children[ 0];
            if ( dom.parentAttr( firstChild, 'data-ud-attr') == "attribVal") console.log( test+" : OK"); else console.log( test+": KO", firstChild, dom.parentAttr( firstChild, 'data-ud-attr'));
        }
        {
            // JSON<-->HTML test 2DO move to JSON            
            test = "Test 2";
            let data = { tag:"ul", name:"myul", defaults:{ tag:{1:"li"}}, "value":{ 0:{ value:"item1", tag:"li"}, 1:{ value:"item2", tag:"li"}}};
            //json = { value:[ { tag:"span", value:"My caption"}, json]};
            let json = { 
                meta:{ type:"list", name:"mylist", zone:"myListeditZone", caption:"My list", captionPosition:"top"}, 
                data:data, changes:{}
            };        
            //console.log( json);
            let element = dom.JSONput( json);
            //dumpElement( element); // console.log( element, element.childNodes[0].tagName);
            let rjson = dom.JSONget( element); //, true);
            //console.log( rjson);
            if ( JSONvalue( rjson, 'meta').type == "list") console.log( test+" : OK"); else console.log( test+": KO");
        }
        {
            // Text
            test = "3 - text editor";
            let data = { tag:"textedit", "mime":"text/text", "value":["line1", "line2", "line3"]};
            //json = { value:[ { tag:"span", value:"My caption"}, json]};
            let json = { meta:{ type:"text", name:"mytextD", zone:"mytextDeditZone", caption:"My text", captionPosition:"top"}, data:data, changes:{}};
            let element = dom.JSONput( json);
            // dumpElement( element);
            let rjson = JSON.stringify(  dom.JSONget( element));
            testResult( test, rjson.indexOf( 'textedit') > -1 && rjson.indexOf( 'line1') > -1, rjson);
            // console.log( rjson);
        }
        {
           // Views & pages
           test = "4 - views";
           let views = dom.views();          
           let pages = dom.pages( "myView");
           testResult( test, views.length == 4 && pages.length == 1, views.length + " views and " + pages.length + " pages in myView");         
        }
        {
            //console.log( dom.attr( 'B0100000000000000M', 'name'));
        }
        {
            test = "Test 6 - default content";
            testResult( test, dom.hasDefaultContent( "B0100000009000000M"));         
        }
        {
            test = "Test 7 - data- prefix read only";
            let element = dom.element( "B0100000000000000M");
            dom.attr( element, 'data-ud-model', "test"); // write directly as data-
            let model = dom.attr( element, 'ud_model'); // read with bad format
            testResult( test, model=="test");         
        }

        // End of auto-test
        console.log( "Program checksum : ", debug( '__CHECKSUM__'));
        console.log( "Program coverage : ", debug( '__COVERAGE__'));
        console.log( "Test completed");     
    }
    else
    {
        window.DOM = DOM;
    }    
} // End of test routine