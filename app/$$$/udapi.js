/** 
 *  UD API class UDapi - invoked with API.method().
 */
class UDapi
{
    // Parameters
    delimiters = " \n\t=+-*/;,&\()'\"{}[]:";
    keepDelimiters = "=+-*/;,&\()'";
    // API calls maps
    fctMap = {};
    detectErrors = false;
    availableModules = null;
    loadable = null;
    argsLoadable = {};
    
    /*
    ude_cmds = [ 
        'changeTagOnCurrent', 'changeTag', 'changeClassOnCurrent', 'changeSubType', 
        'changeClass', 'setAttribute', 'insertElement', 'updateElement', 'removeElement', 'followScroll', 
        'initialiseElement', 'loadScript', 'getEditType', 'setChanged', 'isDefaultContent',
        'insertTextAtCursor', 'insertHTMLatCursor', 'updateTable'
    ]; // 'floatConfig', 'reFloatConfig', 'rearmFloaterTO'
    */
    calc_cmds = [ 'redoDependencies', 'toggleSwitch'];
    ud_cmds = [ 'setModel', 'copyModel', 'makeDirectory', 'translateTerm', 'onTrigger', 'docParameter', 'reload', 'fetchElement'];
    clipboard_cmds = ['clipElement'];
    local_cmds = [
        'insertRow', 'showOneOfClass', 'setChanged', 'loadStyle',
        'copyPortion', 'grabPortionList', 'pageBanner', 'grabFromTable',
        'loadModule', 'service', 'calculate', 'addCalculatorFunction', 'showNextInList', 'showFirstInList', 
        'LED', 'env', 'switchHighlight', 'setupUDElinks', 'listAPI', 'getShortcut',
        'raiseErrors', 'ignoreErrors', 'poll', 'isFunction'
    ];
   // Obsolete utility_cmds = [ 'copy', 'deepCopy', 'removeChildren', 'egaliseHeightOfClass', 'buildDisplayableDeviceList', 'botlog', 'dispatchNameChange'];
    afterClick = { 'Styler':"leftColumn.closeAll();"};
    // Modules
    ud = null;
    dom = null;
    udjson = null;
	udajax = null;
    ude = null;
    calc = null;
    utilities = null;
    // API source
    buffer = null;
    // Work
    expr;  // expression to evaluate using DOMcalc
    order; // the parsed order to be executed
    litteral;
    initial_state = 1;
    litteral_state = 2;
    argument_state = 3;
    argumentFct_state = 4;
    valueSet_state = 5;    
    state = 0;
    stateStack = [];
    bannerStack = [];
    bannerZone = "";
    bannerTimeoutId = -1;
    valueSetFctLevel=0;
    clipboardFctsAdded = false;
    utilityFctsAdded = false;
    // Error Management
    unknownCalls = [];
    
    // setup UDapi
    constructor( ud)
    {
        this.ud = ud;
        if (ud)
        {
            if ( typeof ud.ude != "undefined" && ud.ude) {
                this.ude = ud.ude; 
                this.calc = this.ude.calc;
            } else this.ude = ud;
            this.dom = ud.dom;
            this.udjson = ud.dom.udjson;
            this.cursor = ud.dom.cursor;
            this.udajax = ud.udajax;            
            if ( ud.apiBuffer_requests) this.buffer = this.dom.element( ud.apiBuffer_requests);
        }
        // Build fcts into this for API.fct calls to integrated modules
        this.addFunctions( this, this.local_cmds);
        this.addFunctions( this.ud, this.ud_cmds); // now included
        // this.addFunctions( this.ude, this.ude_cmds);
        // this.addFunctions( this.calc, this.calc_cmds);  
        this.bannerZone = document.getElementById('bannerMessage');

        // Setup global API variable as proxy to this
        
        window.API = this;
        if ( typeof process == 'object') API = this;
        if ( this.dom && this.dom.udjson) { API.json = this.dom.udjson;} // shortcut
        
        // Load API extension modules
        this.set1 = new UDapiSet1( this); 
        if ( typeof UDapiSet2 != "undefined") this.set2 = new UDapiSet2( this);
        if ( typeof UDapiSet3 != "undefined") this.set3 = new UDapiSet3( this);
        if ( typeof UD_ressources_init == "function") UD_ressources_init( this.ud, this);
        if ( typeof UD_content_init == "function") UD_content_init( this.ud);
        if ( typeof UDutilities_init == "function") this.utilities = UDutilities_init( this.ud, this);

        // Activate botlog 
        if ( typeof process == 'undefined') setTimeout( function() { API.botlogUpdate( "server");}, 300);
        
        // Deprecated by API.json ??
        if ( typeof window.udjson != "undefined") API.udjson = window.udjson;

    } // UDapi.construct()
        
   /**
    *  add functions here
    */
    setupUDElinks( ude) {
        API.ude = ude;
        API.calc = ude.calc;
        this.set1.ude = ude;        
        this.set1.calc = ude.calc;        
        /* shortcuts not used yet
        this.set1.udeTable = API.udeTable;
        this.set1.udeList = API.udeList;
        this.set1.udeDraw = API.udeDraw;
        */
    }
    addFunctions ( module, functions)
    {
        for ( let fcti=0; fcti < functions.length; fcti++) {
            let fct = functions[ fcti];
            /*
            * IDEA Test for chained functions ie fctMap[x] = array
            * +fctName or seperate function addFunctionToHook
            */
            this.fctMap[ fct] = module;
        }  
        // Capture dom & co here ?
    } // UDapi.addFunctions()
        
    // Poll command inputs - called by UD heartbeat
    poll ( allowedTime = 5)
    {
        //var maxTicks = this.ude.ticks+allowedTime;
        // Obsolete if ( window.clipboarder && !this.clipboardFctsAdded) this.addFunctions( window.clipboarder, this.clipboard_cmds);
        // Obsolete if ( this.utilties && !this.utilityFctsAdded) this.addFunctions( this.utilities, this.utility_cmds);
        // Loop through requests using ; and . as seperators
        var request;
        var reply = "";
        while ( /*this.ude.ticks < maxTicks &&*/ ( request = this.getNextRequest()))
        {
            debug( { level:2}, "API request",request);
            if ( request.indexOf(';'))
            {
                // Ends with ;(semi-colon) so it's a JS instruction
                // Extract ref
                request = request.split('|');
                let ref = request[0];
                let command = request[1].replace( /@8/g, ':').replace(/@1/g, '@');
                let callbackId = request[2];
                // Run the command
                reply += this.run( [ command]);
                // Send back reply
                if ( callbackId && isNaN( callbackId))
                    document.getElementById( callbackId).textContent += ref+":"+reply+"\n"; 
                this.processAfterClick( ref);
            }
            else if ( request.indexOf('.'))
            {                
                // ends with .(period) so its a natural language command 
                /*
                let phrase = requests.substr( 0, requests.indexOf( '.'));
                */
            }
        }
        return reply;
    } // UDapi.poll()
    
    // INTERNAL
    // Execute a set of commands
    getNextRequest()
    {
        if ( !this.buffer) return "";
        var requests = this.buffer.textContent;
        var p1;
        if ( ( p1 = requests.indexOf( '\n')) >= 0)
        {
            // There's a request - extract it
            var request = requests.substr( 0, p1);
            requests = requests.substr(p1+1);
            this.buffer.textContent = requests; 
            return request;
        }
        else return "";
    } // UDapi.getRequest()
    
    run( commands)
    {
        var r="";
        for( var cmdi in commands)
        {
            var command = commands[cmdi];
            this.order = "";
            this.state = this.initial_state;
            this.prepareForExec( command);
            if ( this.order.indexOf( "ERR:") > -1) return "ERR";
            // r += "OK";
            r += eval( this.order); // Order has been parsed and is secure
            // 2DO HOw to send an anwser
            debug( {level:4}, "Ran ", this.order);
            return r;
        }    
        
    } // UDapi.run()

    // Evaluate a term
    eval( term)
    {        
        // This test is non redundant with calc.exec but useful for tests
        if ( term == "" || !isNaN( term)
            || ( this.expr.charAt(0) == "'" && this.expr.charAt( this.expr.length-1) == "'") 
            || ( this.expr.charAt(0) == '"' && this.expr.charAt( this.expr.length-1) == '"') 
        ) return term;
        // Compute value of term via the DOM calculator
        var v = this.calc.exec( this.expr);
        // Return quoted if not numercial
        if ( isNaN( v)) return '"'+v+'"';
        else return v;
    } // UDapi.eval()
    
    // Add a token to current order
    // state = initial, litteral, argument, argumentFct; 2DO comment
    addTokenToOrder( token, delimiter)
    {
        var c = delimiter;
        if ( this.state == this.litteral_state)
        {
            this.expr += token + c;
            if ( c == this.litteral) this.state = this.stateStack.pop(); 
        }
        else if ( this.state == this.argument_state)
        {
            if ( c == '(')
            {
                this.expr += token + c;
                this.stateStack.push( this.state);
                this.state = this.argumentFct_state;
            }
            else if (c == ')')
            {
                // End of function call or order arguments
                this.expr += ""+token;
                this.order += this.eval( this.expr)+c;
                this.expr = "";
                this.state = this.stateStack.pop();
            }
            else if ( c == ',')
            {
                // Argument seperator
                this.expr += ""+token;
                this.order += this.eval( this.expr)+c;
                this.expr = "";
                
            }
            else if (c == '{')
            {
                // Start of Value set (ie JSON notation)
                if (this.state != this.valueSet_state) this.order += "JSON.parse('{";
                this.stateStack.push( this.state);
                this.state = this.valueSet_state;
                this.expr = "";
            }
            else if ( c == "'" || c == '"')
            {
                // Litteral
                this.stateStack.push( this.state);
                this.state = this.litteral_state;
                this.litteral = c;
                this.expr = c;
            }
            else this.expr += "" + token + c;
        }        
        else if ( this.state == this.initial_state)
        {
            if ( c == '(')
            {
                // Token is a command - use API to redirect to correct class
                this.order += "API."+token+c;
                // Pass to argument state
                this.stateStack.push( this.state);
                this.state = this.argument_state;
                this.expr = "";
            }
            else this.order += c;
        }
        else if ( this.state = this.valueSet_state)
        {    
            // Value set state - close on }, evaluate after :
            if ( c == '}')
            {
                this.expr += token;
                this.order += this.eval( this.expr)+c;
                this.state = this.stateStack.pop();
                if (this.state != this.valueSet_state) this.order += "')";
                this.expr = "";
            }
            else if (c == ':')
            {
                this.order += '"'+token+'"'+ c;
            }
            else if (c == '(')
            {
                this.valueSetFctLevel++;
                this.expr += token+c;    
            }
            else if (c ==')')
            {
                this.expr += ""+token+c;
                if ( --this.valueSetFctLevel == 0)
                {
                    this.order += this.eval( this.expr);
                    this.expr = "";
                }
            }
            else if ( c == ',')
            {
                this.expr += ""+token;
                if ( this.valueSetFctLevel == 0)
                {    
                    this.order += this.eval( this.expr)+c;
                    this.expr = "";
                } 
                else this.expr += c;                
            }
            else this.expr += token + c;
        }
        else if ( this.state == this.argumentFct_state)
        {
            this.expr += ""+token + c;
            if ( c == '(') this.stateStack.push( this.state);
            else if (c == ')') this.state = this.stateStack.pop();             
        } // end switch state    
        return "";
    } // UDapi.addTokenToOrder()
   
   // prepare an instruction for execution -- same as calc for the moment
   prepareForExec( expr)
   {
     this.expr = this.order = "";
     var token = "";
     this.state = this.initial_state;
     this.valueSetFctLevel = 0;
     for (var i=0; i < expr.length; i++)
     {
       var c = expr[i];
       if ( this.delimiters.indexOf(c) > -1) token = this.addTokenToOrder( token, c);
       else token += c;         
     }
     if (token) this.addTokenToOrder( token, null);
     if ( this.stateStack.length) debug( { level:1}, "Order incomplete" + expr);
     return true;
   } // UDapi.prepareForExec()
    
    // Analyse natural language text and generate command list
    nlp( text)
    {
    } // UDapi.nlp()
    
    // Run some code after a click on an element outside the editor
    processAfterClick( source)
    {
        if ( typeof this.afterClick[ source] != "undefined")
            eval( this.afterClick[source]);
    } //UDE.processAfterClick()
    
    /*
    *  LOCAL COMMANDS
    */
    // Include seperate files
    /* get file_include ../api/apiset1.js */
    
    insertRow( tableId, index, data, beforeOrAfter=true)
    {
        // Check table
        let table = document.getElementById( tableId);
        if (!table) return debug( {level:2, return:null}, "No table", tableId);
        // Check table editor loaded
        if ( !this.ude.tableEd) return debug( {level:2, return:null}, "No table editor", tableId);
        // Use table editor to insert row
        let r = this.ude.tableEd.insertRow( tableId, index, data, beforeOrAfter);
        this.ude.tableEd.update( tableId, true);
        // Set container for saving
        this.ude.setChanged( table);
        //saveable.setAttribute( 'ud_dbaction', "refresh");        
        API.redoDependencies();
        return r;
    } // UDapi.insertRow()

  /** 
    * api {JS} showOneOfClass(elementIdOrName,hideOthers=true) Display 1 element of a specified class
    * @apiParam {string} id Id of element to show
    * @apiParam {boolean} hideOthers If true hide all other elements of the same class as element id
    *
    */
  /**
    * Show one element of a class
    * @param {string} elementIdOrName Element to show or its id or name
    * @param {boolean} hideOthers If true hide all other elements of the same class as element id
    */    
    showOneOfClass( elementIdOrName, hideOthers) { return this.showOnePortion( elementIdOrName, hideOthers);}
    showOnePortion( elementIdOrName, hideOthers)
    {
        let element = this.dom.element( elementIdOrName);
        if ( !element) element = this.dom.element( "div.part[name='"+elementIdOrName+"']", this.dom.element( 'document'));
        if ( !element) return debug( { level:2, return:null}, "can't find element in UDAPI.showOneOfClass()", elementIdOrName);
        let id = element.id;
        if ( element.tagName.toLowerCase() == "div")
        {
            // Remove class hidden from this DIV
            element.classList.remove( "hidden");
            // Add class hidden to all DIVs of same class 
            let elements = $$$.dom.elements( "div."+element.classList.item(0), element.parentNode);
            //var elements = document.getElementsByClassName( element.classList.item(0));
            for ( var eli = 0; eli < elements.length; eli++)                     
            {
                //if ( isNaN( eli)) break;
                var el = elements[ eli];
                if ( el.id != id && !el.classList.contains('hidden')) el.classList.add('hidden');
            }
            // Clear mobile scroll emulation if part            
            if ( element.classList.contains( 'part')) this.ude.followScroll( 0);        

        }
        else if ( [ "h1", "h2", "h3", "h4"].indexOf( element.tagName.toLowerCase()) > -1)
        {
            var tagName =  element.tagName.toLowerCase();
            var tagIndex = [ "h1", "h2", "h3", "h4"].indexOf( element.tagName.toLowerCase());
            var action = "ignore";
            // Loop through all siblings            
            var siblings = this.dom.children( element.parentNode); //.childNodes;
            for (var i = 0; i< siblings.length; i++)
            {
                var elemWalk = siblings[i];
                if ( elemWalk.tagName.toLowerCase() == tagName)
                {
                    // Same tag name expand of this element other wise collapse
                    if ( elemWalk == element) action = "expand";
                    else action = "collapse";
                }
                else if  ( [ "h1", "h2", "h3", "h4"].indexOf( element.tagName.toLowerCase()) < tagIndex)
                {
                    // Ignore if title higher in the hierachie
                    action = "ignore"; // could even break;
                }
                else
                {
                    // Apply the current action to an element 
                    switch (action)
                    {
                        case "ignore": break;
                        case "collapse":
                            elemWalk.classList.add('hidden');
                            break;
                        case "expand":
                            if ( elemWalk.classList.contains( 'hidden')) elemWalk.classList.remove('hidden');
                            else elemWalk.classList.add('hidden');
                            break;
                    }
                }
            } // end of sibling loop            
        }  // end of hn process
        // Go to window top
        let scroll = document.getElementById( 'scroll');
        if (scroll && element.classList.contains( 'part')) { 
            scroll.scrollTop = 0;
            window.scroll (0, 0);
        }
        return element;        
    } // UDapi.showOnePortion()
    
  /**  
    * @api {JS} activateOneOfClass(elementOrId,disactivateOthers)
    * @apiParam {string} id Id of element to show
    * @apiParam {boolean} hideOthers If true (default) hide all other elements of the same class as element id
    * @apiGroup Styles
    *
    */
   /**
    * Add "active" class to one element of a class and remove from others
    * @param {mixed} elementOrId HTML element or its Id
    * @param {boolean} disactivateOthers If true or absent remove active from all other elements of the same class as element id
    */    
    activateOneOfClass( elementOrId, disactivateOthers = true) 
    {
        let element = this.dom.element( elementOrId);
        if ( !element) return debug( { level:2, return:null}, "can't find element in UDapi;activateOneOfClass()", elementOrId);
        let classList = element.classList;
        let className = "";
        for ( let classi=0; classi< classList.length; classi++) {
            if ( [ 'left', 'right', 'active'].indexOf( classList.item( classi)) == -1) className = classList[ classi];
        }
        if ( !className) return;
        let container = element.parentNode;
        let classRoom = this.dom.elements( '.'+className, container);
        for ( let eli=0; eli < classRoom.length; eli++) {
            let el = classRoom[ eli];
            if ( el == element) el.classList.add( 'active');
            else el.classList.remove( 'active');
        }        
    } // UDapi.activateOneOfClass()


    // SetChanged
    setChanged( elementOrIdOrName)
    {
        // 2DO if no id use this to find 1st table or div with bind
        let element = this.dom.element( elementOrIdOrName);
        if ( !element) {
            element = API.dom.element( "[name='"+elementOrIdOrName+"']", 'document');
            if ( !element || !API.dom.attr( element, 'ud_oid')) 
                return debug( { level:2, return:null}, "can't find saveable element in UDapi.setChanged()", elementOrIdOrName); 
        }      
        return this.ude.setChanged( element, 1);
    } // UDapi.setChanged()
    
    // Load styles
    loadStyle( id)
    {
        let element = document.getElementById( id);
        if ( !element) return debug( { level:2, return:null}, "can't find element in UDapi.loadStyle()", id);  
        let rules = element.textContent;
        /*
        rules = rules.replace( /&nbsp;/g, ' ');
        rules = rules.replace( "CSS\n", "");
        ud.addStyleRules( rules);
        */
        let style = document.createElement("style");
        style.appendChild(document.createTextNode( rules));
        // Add the <style> element to the page
        document.head.appendChild(style);

        return style.sheet;

    } // UDapi.loadStyle()
    
   /**
    * @api {JS} copyPortion(sourceIdOrName,targetIdOrName,headerId="",map=null) Copy a portion of HTML   
    * @apiParam {string} sourceIdOrName Source of portion's id or name 
    * @apiParam {string} targetIdOrName Target element's id or name
    * @apiParam {string} headerId Manadatory, id of element where to copy source's H1 title
    * @apiParam {string} tagListStr CSV string of tags to include in portion
    * @apiSuccess {string} HTML with UL element
    * @apiGroup HTML
    */
   /**
    * Copy a portion from source to target
    * @param {string} sourceIdOrName Source of portion's id or name 
    * @param {string} targetIdOrName Target element's id or name
    * @param {string} headerId Manadatory, id of element where to copy source's H1 title
    * @param {string} tagListStr CSV string of tags to include in portion
    * @return {string} HTML with UL element    
    */
    // 2DO sourceId < sourceIdOrName 
    copyPortion( sourceId, targetId, headerIdOrName = "", map = null, fct= null)
    {
        if ( !map) {
            // Default map
            map = { 
                h3: { style: "titleButton", tag: "h3"},
                h2: { style: "helpTitle", tag: "h2"}
            };
        }
        if ( !fct) fct = "$$$.showOneOfClass";
        // Find target
        let target = document.getElementById( targetId);
        if ( !target) return debug( { level:2, return:null}, "can't find element in UDapi.grabContent()", targetId);  
        // Find source
        let source = document.getElementById( sourceId);
        if ( !source) return debug( { level:2, return:null}, "can't find element in UDapi.grabContent()", sourceId); 
        // Place source content in header
        if ( headerIdOrName)
        {
            // Find header zone
            let header = document.getElementById( headerIdOrName);
            if ( !header) header = target.previousSibling;
            // if ( !header) header = this.dom.element( "[name='" + headerIdOrName + "']", this.dom.getView(source));
            if ( !header) return debug( { level:2, return:null}, "can't find element in UDapi.grabContent()", headerIdOrName); 
            // change tag.styles and tag name (the latter requires element to have a parent)
            // TEST this.mapClassAndTag( source, map);        
            header.innerHTML = source.innerHTML;
        }   
        // Grab elements "in" the portion
        let elements = this.grabPortion( source).inn; // merge out
        // Clear target
        target.innerHTML = "";
        // Loop through elements in portion
        let first = null;
        for (var i=0; i < elements.length; i++)
        {
            if ( elements[i].nodeType != 1) continue;
            // clone
            var newel = elements[i].cloneNode( true);
            // change id
            newel.id += "_copied";
            // add to target
            target.appendChild( newel);
            // change tag.styles and tag name (the latter requires element to have a parent)
            this.mapClassAndTag( newel, map);
            // apply addAttr and addContent (classATtributeMap must be transfered)
            // cheating
            if ( newel.className == "titleButton")
            {
                //newel.setAttribute( 'onclick', "new UDapiRequest(  'titleButton class', 'showOneOfClass( %id, 1);', event);");
                newel.setAttribute( 'onclick', fct+"( '"+newel.id+"', 1);");
                if (!first) first = newel;
            }
            
        }
        if ( first) this.showOnePortion( first.id, true);
        if ( typeof process == "undefined") window.scroll( 0, 0);
    } // UDapi.copyPortion()
    
    // Change class and tag name of an element according to a map
    // 2DO DOM ?
    mapClassAndTag( element, map)
    {
        var newelTagStyle = element.tagName.toLowerCase();
        if ( map && map[newelTagStyle]) {
            if ( map[newelTagStyle].style) element.className = map[newelTagStyle].style;
            if ( map[newelTagStyle].tag != element.tagName.toLowerCase()) this.dom.changeTag( element, map[newelTagStyle].tag, "");
        }
    } // UDapi.mapClassAndTag()
    

  
   /** 
    * @api {JS} grabPortionList(sourceIdOrName,targetIdOrName,params) Return HTML list of available portions    
    * @apiParam {string} sourceIdOrName Source of portion's id or name 
    * @apiParam {string} targetIdOrName Target element's id or name
    * @apiParam {object} params Named list of parameters with headerId:id of header zone, tagListStr:CSV list of tags to copy
    * @apiParam {string} tagListStr CSV string of tags to include in portion
    * @apiSuccess {string} HTML with UL element
    * @apiGroup HTML
    *
    */  
   /**
    * Return an HTML list of available portions
    * @param {string} sourceIdOrName Source of portion's id or name 
    * @param {string} targetIdOrName Target element's id or name
    * @param {string} headerId Manadatory, id of element where to copy source's H1 title
    * @param {string} tagListStr CSV string of tags to include in portion
    * @return {string} HTML with UL element  
    */      
    grabPortionList( sourceIdOrName, targetIdOrName, params) {
        // Extract params
        let headerIdOrName = this.dom.udjson.value( params, 'headerId');
        let tagListStr = this.dom.udjson.value( params, 'tagListStr');
        /*let action = this.dom.udjson.value( params, 'action');
        if ( !action) action = "API.showOneOfClass";*/
        let titleElement = null;
        let mode = this.dom.udjson.value( params, 'mode');
        if ( !mode) mode = "list";
        // Build map
        let tagList = tagListStr.split(',');
         // Find target
        let target = this.dom.element( targetIdOrName);
        if ( !target) target = this.dom.element( "[name='"+targetIdOrName+"']", 'document');
        if ( !target) return debug( { level:2, return:null}, "can't find element in UDapi.grabPortionList()", targetIdOrName);  
        // Find source
        let source = this.dom.element( sourceIdOrName);
        if ( !source) source = this.dom.element( "[name='"+sourceIdOrName+"']", 'document');
        if ( !source) return debug( { level:2, return:null}, "can't find element in UDapi.grabPortionList()", sourceIdOrName); 
        // Place source content in header
        if ( headerIdOrName) {
            // Find header zone
            let header = this.dom.element( headerIdOrName);
            if ( !header) header = this.dom.element( "[name='" + headerIdOrName + "']", source);
            if ( !header) return debug( { level:2, return:null}, "can't find header in UDapi.grabPortionList()", headerIdOrName); 
            titleElement = source.querySelector("div h1");
            if (titleElement) header.innerHTML = titleElement.innerHTML;             
            else header.innerHTML = "Home";
        }           
        // Target content
        let targetContent = "{details}";
        let itemCount = 0;
        let details = document.createElement( 'div');
        if ( mode == "titles") {
            // map for testing
            let map = { 
                h3: { style: "titleButton", tag: "h3"},
                h2: { style: "helpTitle", tag: "h2"}
            };
            // Loop through sibling elements in source
            let elements = this.dom.children( source);
            for (let eli=0; eli < elements.length; eli++) {
                let element = elements[ eli];
                if ( element.nodeType != 1) continue;
                let tag = element.tagName.toLowerCase();
                if ( !tagList.length || tagList.indexOf( tag) >  -1) {
                    // Title element
                    let copyId = element.id+"_copy";
                    let title = "<"+tag+" id=\""+copyId+"\">";
                    title += "<a href=\"javascript:\" class= \"sleepingButton\" udapi_value1=\""+element.id+"\" udapi_quotes=\"//\"";
                    //let onclick = this.dom.udjson.value( params, 'callback')+"('chapter', this);";
                    let onclick = "API.showOneOfClass( '"+ copyId +"',1);";
                    title += ' onclick="'+onclick+'">';
                    //li += ' onclick="'+this.dom.udjson.value( params, 'callback')+'(1, this);">';
                    title += element.textContent;
                    title += "</a></" + tag + ">";
                    targetContent += title;
                    let elContent = this.grabPortion( element).inn; 
                    let first = null;
                    for (let contenti=0; contenti < elContent.length; contenti++)
                    {
                        let el = elContent[ contenti];
                        if ( el.nodeType != 1) continue;
                        // clone
                        var newel = el.cloneNode( true);
                        // change id
                        newel.id += "_copy";
                        newel.classList.add( 'hidden');
                        // add to target
                        targetContent += newel.outerHTML;
                        // change tag.styles and tag name (the latter requires element to have a parent)
                        // this.mapClassAndTag( newel, map);
                        // apply addAttr and addContent (classATtributeMap must be transfered)
                        // cheating
                        if ( newel.className == "titleButton")
                        {
                            newel.setAttribute( 'onclick', "API.showOneOfClass( '"+newel.id+"', 1);");
                            if (!first) first = newel;
                        }                        
                    }                    
                    itemCount++;
                } else if ( !itemCount && element != titleElement) {
                    // Copy as hidden elements between titles
                    let copyEl = element.cloneNode( true);
                    copyEl.id = copyEl.id + "_copy";
                    // if ( itemCount) copyEl.classList.add( 'hidden');
                    this.dom.attr( copyEl, 'ud_oid', '');
                    targetContent += copyEl.outerHTML; // details.appendChild(  copyEl);  
                }
            }
        } else {
            targetContent += "<ul class=\"portionList\">";            
            // Loop through sibling elements in source
            let elements = this.dom.children( source);
            for (let i=0; i < elements.length; i++) {
                let element = elements[i];
                if ( element.nodeType != 1) continue;
                if ( !tagList.length || tagList.indexOf( element.tagName.toLowerCase()) >  -1) {
                    // LI element
                    var li = "<li><a href=\"javascript:\" class= \"sleepingButton\" udapi_value1=\""+element.id+"\" udapi_quotes=\"//\"";
                    let onclick = this.dom.udjson.value( params, 'callback')+"('chapter', this);";
                    li += ' onclick="'+onclick+'">';
                    //li += ' onclick="'+this.dom.udjson.value( params, 'callback')+'(1, this);">';
                    li += element.textContent;
                    li += "</a></li>";
                    targetContent += li;
                    itemCount++;
                } else if ( !itemCount && element != titleElement) {
                    let copyEl = element.cloneNode( true);
                    copyEl.id = "Copy of " + copyEl.id;
                    this.dom.attr( copyEl, 'ud_oid', '');
                    details.appendChild(  copyEl);  
                }
            }
            targetContent += "</ul>";
        }
        targetContent = targetContent.replace( '{details}', details.innerHTML);
        target.innerHTML = targetContent;
        target.setAttribute( 'contenteditable', "false")
        window.scroll( 0, 0);      
    } // grabPortionList()
    
    /* NOT offical API yet
    * @api {JS} grabPortion(element) Return an HTML portion as 3 arrays    
    * @apiParam {HTMLelement} element The portion's source element 
    * @apiSuccess {object} Object with in array, out array and boud array
    * @apiGroup HTML
    */
   /**
    * Return an HTML portion as 3 arrays of elements: inn (elements in the portion), out (elements outside portion) and bound (binded)
    * @param {HTMLelement} element The portion's source element 
    * @return {object} Object with in array, out array and bouNd array
    *
    */       
    grabPortion( element)
    {
        let inn = [];
        let out = [];
        let bound = [];
        if ( element.tagName.toLowerCase() == "div") {
            // GRAB 1 DIV of a specific class
            // element is "in"
            let elements = element.childNodes;
            for ( let eli in elements) inn.push( elements[ eli]);
            // All other siblings of the same class are "out"
            elements = element.parentNode.getElementsByClassName( element.classList.item(0));
            // Loop through siblings
            for ( let eli in elements) {
                if ( isNaN( eli)) break;
                let el = elements[ eli];
                if ( el.id != id && !el.classList.contains('hidden')) out.push( el);
            } // end of sibling loop
            
        }  else if ( [ "h1", "h2", "h3", "h4", "h5"].indexOf( element.tagName.toLowerCase()) > -1) {
            // GRAB ALL CONTENT BETWEEN 2 TITLES OF SAME LEVEL
            // Get tag name and header hierachie or index
            var tagName =  element.tagName.toLowerCase();
            var tagIndex = [ "h1", "h2", "h3", "h4", "h5"].indexOf( element.tagName.toLowerCase());
            // tagIndex++;
            // By default ignore elements
            var action = "ignore";
            // Loop through all siblings            
            var siblings = this.dom.siblings( element); //element.parentNode.childNodes;
            for (var i = 0; i< siblings.length; i++) {
                var elemWalk = siblings[i];
                if ( elemWalk.tagName.toLowerCase() == tagName) {
                    // Same tag name, this and following elements are "in" if this element 
                    if ( elemWalk == element) action = "in";
                    // otherwise "out"
                    else action = "out";
                    // But all elements of this type are "in"
                    bound.push( elemWalk);
                } else if  ( [ "h1", "h2", "h3", "h4", "h5"].indexOf( element.tagName.toLowerCase()) < tagIndex) {
                    // Ignore if title higher in the hierachy
                    action = "ignore"; // could even break;
                    inn.push( elemWalk);
                } else {
                    // Apply the current action to an element 
                    switch (action) {
                        case "ignore": break;
                        case "in":
                            inn.push( elemWalk);
                            break;
                        case "out":
                            out.push( elemWalk);
                            break;
                    }
                }
            } // end of sibling loop
            
        }  // end of hn process
        // Return the list of "in" and "out" elements
        return {inn:inn, out:out, bound:bound};
    } // UDapi.grabPortion()
    
    pageBanner( cmd, html = "")
    {
        // Initialise stack and banner div id if needed
        if ( typeof this.bannerStack == "undefined")
        {
            this.bannerStack = [];
            this.bannerZone = document.getElementById('bannerMessage');
            this.bannerTimeoutId = -1;
        }
       
        // Process command
        switch ( cmd)
        {
            case "clear" :
                // Restore banner from stack
                if (this.bannerStack.length == 0) return debug( {level:2, return:false}, "Nothing in banner stack on clear in API pageBanner()");
                this.bannerZone.innerHTML = this.bannerStack.pop();
                this.bannerTimeoutId = -1;
                if ( this.bannerStack.length) {
                    // Rearm timer if stack not empty
                    this.bannerTimeoutId = setTimeout( function() { me.pageBanner( "clear");}, 5000);
                }
                break;
            case "set" :
                // 2DO auto translate msg
                if ( !html) return debug( {level:2, return:false}, "Can't write nothing to banner, use clear instead in API pageBanner()");
                if ( html.charAt(0) == "=") html = this.calc.exec( html.substr(1));
                let currentMsg = this.bannerZone.innerHTML;
                if ( currentMsg != "" && currentMsg != "Banner zone") this.bannerStack.push( this.bannerZone.innerHTML);
                this.bannerZone.innerHTML = html;
                break;
            case "tmp" :
            case "temp" :
                if ( !html) return debug( {level:2, return:false}, "Can't write nothing to banner, use clear instead in API pageBanner()");
                if ( html.charAt(0) == "=") html = this.calc.exec( html.substr(1));
                // In real life, only 1 temporary message at a time so no need to stack systematically 
                // 2DO need some form of grouping message (ie same task)
                if ( !this.bannerStack.length) { this.bannerStack.push( this.bannerZone.innerHTML);}
                this.bannerZone.innerHTML = html;
                var me = this;
                if ( this.bannerTimeoutId > -1) clearTimeout( this.bannerTimeoutId);
                this.bannerTimeoutId = setTimeout( function() { me.pageBanner( "clear");}, 10000);
                break;
        }
    } // UDapi.pageBanner()
    
   /**
    * @api {JS} grabFromTable(targetOrId,tableOrId,field) Fill an element with content from a table column    
    * @apiParam {mixed} targetOrId Target element or it's id
    * @apiParam {mixed} tableOrId Table or it's id 
    * @apiParam {string} field Label of column
    * @apiSuccess {HTMLelement} Target element filled
    * @apiError {NTMLelement} null
    * @apiGroup HTML
    *
    */  
   /**
    * Fill an element with content taken from  a coum in a table
    * @param {mixed} targetOrId Target element or it's id
    * @param {mixed} tableOrId Table or it's id 
    * @param {string} field Label of column
    * @return {HTMLelement} Target element or null if failure
    */
    grabFromTable( targetOrId, tableOrId, field) {
        // Find target
        let target = this.dom.element( targetOrId);
        if ( !target) return debug( { level:2, return:null}, "can't find element", targetOrId);  
        // Find source
        let table = this.dom.element( tableOrId);
        if ( !table) return debug( { level:2, return:null}, "can't find table", tableOrId);
        // Find column to use
        let cols = table.rows[0].cells;
        let colArray = [];
        // 2DO fct
        for ( let coli=0; coli<cols.length; coli++)
             colArray.push( this.dom.attr( cols[ coli],'_type') + cols[ coli].textContent);
        let colIndex = colArray.indexOf( field);
        if ( colIndex == -1) return debug( { level:2, return:null}, "can't find column in table", field, tableId);       
        // Assemble required data from each row of source table
        let rows = table.getElementsByTagName( 'tbody')[0].rows;
        let html = "";
        for ( let rowi=0; rowi < rows.length; rowi++) html += rows[ rowi].cells[ colIndex].innerHTML;
        if ( html) target.innerHTML = html;
    } // UDapi.grabFromTable()
    
    // Load a JS script from modules subdir
    loadModule( subdir, name, script = "")
    {
        var fullName = subdir+'/'+name+'.js';
        if ( !script) script = "window.ud.ude.modules['modules/"+fullName+"']['instance'] = new "+name+"();";
        this.ude.loadScript( 'modules/'+fullName, script);
    } // UDapi.loadModule()
    

   /**
    * @api {JS} service(service,params_json,responseMap) Call a web service and place content in DOM
    * @apiParam {string} service Name of the service
    * @apiParam {string} params_json JSON-coded parameters 
    * @apiParam {object} responseMap Descibes how to map service response to DOM elements
    * @apiSuccess {boolean} True if request sent
    * @apiGroup Services
    *
    */ 
   /**
    * Invoke a web service and place content as instructed
    * @param {string} service Name of the service 
    * @param {string} params_json JSON-coded parameters 
    * @param {boolean} promise Descibes how to map service response to DOM elements
    * @return {boolean} True if request sent
    */
    async servicePromise( service, params_json, usePromise = true)  {
        // 2DO Server should provide this as dependent on dataModel
        let serviceOidPattern = "SetOfValues--16--nname|{service}%20service";
        let serviceOid = serviceOidPattern.replace( "{service}", service);
        let params = params_json;
        if( typeof params_json != "object") params = JSON.parse( params_json);
        if ( !params) return false;
        params['service'] = service;
        params['process'] = $$$.dom.textContent( 'UD_model'); 
        params['task'] = this.dom.textContent( 'UD_dbName'); 
        let uri = '/' + UD_SERVICE + '/' + serviceOid + "/AJAX_service/";
        let context = { 
            dataTarget:params['dataTarget'], 
            dataSource:params['dataSource'],
            dataMap:params['dataMap'],
            dataReplace:params[ 'dataReplace'],
            service:service,
            waitPopup:true
        };  
        let data = "form=INPUT_Service"+service+"&input_oid=SetOfValues--16-0&nServiceRequest="+encodeURIComponent( JSON.stringify( params));
        let me = this;
        if ( usePromise) {
            //await this.ud.udajax.serverRequestPromise( uri, "POST", data, context, me.serviceResponse);
            return this.ud.udajax.serverRequestPromise( uri, "POST", data, context, me.serviceResponse);
        } else this.ud.udajax.serverRequest( uri, "POST", data, context, me.serviceResponse);
    }
    service( service, params_json) {
        // 2DO Server should provide this as dependent on dataModel
        let serviceOidPattern = "SetOfValues--16--nname|{service}%20service";
        let serviceOid = serviceOidPattern.replace( "{service}", service);
        let params = params_json;
        if( typeof params_json != "object") params = JSON.parse( params_json);
        if ( !params) return false;
        params['service'] = service;
        params['process'] = $$$.dom.textContent( 'UD_model'); 
        params['task'] = this.dom.textContent( 'UD_dbName'); 
        let uri = '/' + UD_SERVICE + '/' + serviceOid + "/AJAX_service/";
        let context = { 
            dataTarget:params['dataTarget'], 
            dataSource:params['dataSource'],
            dataMap:params['dataMap'],
            dataReplace:params[ 'dataReplace'],
            service:service
        };  
        let data = "form=INPUT_Service"+"&input_oid=SetOfValues--16-0&nServiceRequest="+encodeURIComponent( JSON.stringify( params));
        let me = this;
        this.ud.udajax.serverRequest( uri, "POST", data, context, me.serviceResponse);
        return true;
    } // UDapi.service()    
    serviceResponse( context, html, js) {
        // !!! No this !!!
        let me = window.ud.api;
        // 2DO Process as JSON
        let response = me.dom.udjson.parse( html);
        if ( !response) {
            me.pageBanner( "temp", html);
            return;
        }
        let banner =  "";
        if ( !response.success) {
            banner += '<span class="error">'+response.message+'</span>';
            me.pageBanner( "temp", banner);
            $$$.botlog( context.service, false, "Error service " + context.service + ": " + response.message);
            //if ( context.promise) context.promise.reject( context);
            return;
        }
        // Success
        // if ( typeof context.bannerOnSuccess == "undefined" || context.bannerOnSuccess)
        banner += '<span class="success">'+response.message+'</span>';
        $$$.pageBanner( "temp", banner);                
        $$$.botlog( context.service, false, "Service " + context.service + ": success") ;
        let data = response.data;       
        if ( data) {
            // Data is available
            let targetName = context.dataTarget;
            let sourceName = context.dataSource;
            let dataMap = context.dataMap;
            if ( targetName && sourceName) {
                // Place data source's value directly in target element
                let target = me.dom.element( targetName);
                if ( !target) target = me.dom.elementByName( targetName);
                //let target = me.dom.element( "[name='" + targetName + "']", "document");
                let value = ( sourceName == 'value') ? response.value : me.json.value( data, sourceName);
                if ( target && value) {
                    let targetExTag = me.dom.attr( target, 'exTag');
                    // Patch for gen text demo need a callback or then
                    if ( targetExTag == "div.part") {
                        // Target is a view so lets append results as paragraphs
                        if ( typeof value == "object" && Array.isArray( value)) {
                            // Append array to view
                            let viewText = target.textContent;
                            let viewContent = me.dom.children( target);
                            let last = viewContent[ viewContent.length - 1];
                            for ( let vali=0; vali < value.length; vali++) {
                               let idea = value[ vali];
                               let exists = viewText.indexOf( idea);
                               if ( exists < 0) last =  $$$.insertElement( 'p', idea, {}, last, true);
                            }
                        }
                        // else ignore
                    } else if ( 
                        context.dataReplace
                        || targetName == "UD_spare" // always write over this element
                        || !target.textContent
                        || target.textContent == me.dom.attr( target, 'ude_place') 
                        || target.textContent == null || target.textContent == 'null'                        
                    ) {
                        // Replace default content
                        if ( typeof value == "object") value = JSON.stringify( value);
                        target.textContent = value;
                        me.ude.setChanged( target);                    
                    } else if ( target.textContent != value) {
                        // Add to existing content but only if response is different
                        target.textContent += "," + value;
                        me.ude.setChanged( target);
                    }        
                }                
                // ANd call a fct (initialise parent ?) = js
            } else if ( targetName && typeof dataMap != "undefined" && Object.keys( dataMap).length){
                // Place data using map                
                let targetData = me.json.parse( targetName);
                for ( let dataKey in dataMap) {
                    let val = me.json.valueByPath( data, dataKey);
                    // 2DO if = formulas hmm formulas on json values ?
                    // SImpler fct on value
                    if ( val) targetData = me.json.valueByPath( targetData, dataMap[ dataKey], val);
                    else targetData = me.json.valueByPath( targetData, dataMap[ dataKey], me.translateTerm("No value"));
                    if ( typeof val == "object") {
                        /*221108 - Patch to change name of copied JSON100 objects
                        // Remmove when parameter added to Doc service
                        if ( typeof val.name != "undefined") val.name = targetName.replace( '_object', '');
                        if ( typeof val[1] != "undefined" && typeof val[1].name != "undefined") 
                            val[1].name = targetName.replace( '_object', '');
                        */
                    }
                    me.dom.element( targetName).textContent = JSON.stringify( targetData);
                    me.ude.setChanged( targetName);
                }                
            }
            if ( context.promise) context.resolve( context);
        } 
        // if js eval
    } // Uadpi.serviceResponse()
   /**
    * @api {JS} serviceEmail(action,campaignOrId,subject,contactListId,body) Call the email service
    * @apiParam {string} subject Subject field of campaign
    * @apiParam {string} action Send|Setup campaign|Stats| 
    * @apiParam {string} contactListId Id of contactl ist for campaign
    * @apiParam {string} body HTML of message
    * @apiGroup Services
    *
    */
    
   /**
    * calculate
    *   @param expr expression to compute
    *   @result result of calculation
    */
    calculate( expr)
    {
        return this.calc.eval( expr);
    } // UDapi.calculate()
 
   /**
    * addCalculatorFunction -- add a new function to calculator
    *   @param string name : function's name
    *   @param function fct : function's code
    *   @result boolean : true if added, false if already exists
    */
    addCalculatorFunction( name, fct)
    {
        let calc = this.calc;
        if ( typeof calc[ name] == "undefined")
        {
            calc[ name] = fct;
            calc.localFunctions.push( name);
            return true;
        }
        return false;
    } // UDapi.addCalculatorFunction() 
        
   /**
    * Show next element in a list
    */
    showNextInList( elementIdList)
    {
        let eli;
        let element;
        // Find displayed element and hide it
        for ( eli=0; eli < elementIdList.length; eli++)
        {            
            element = this.dom.element( elementIdList[ eli]);
            if ( !element.classList.contains( 'hidden'))
            {
                element.classList.add( 'hidden');
                // Trial 12/04/2022 force visibility of row models
                let rowModel = this.dom.element( 'tr.rowModel', element);
                if ( rowModel) rowModel.style.display="unset";                
                break;
            }
        }
        // Display next element 
        if ( eli >= elementIdList.length - 1) element = this.dom.element( elementIdList[ 0]);
        else element = this.dom.element( elementIdList[ eli+1]);
        if (element) { 
            element.classList.remove( 'hidden');
            // Trial 12/04/2022 force visibility of row models
            let rowModel = this.dom.element( 'tr.rowModel', element);
            if ( rowModel) rowModel.style.display="block";
        }
    } 

    /**
    * Show next element in a list
    */
    showFirstInList( elementIdList) {
        // Displayed element and hide it           
        let element = this.dom.element( elementIdList[ 0]);
        if ( !element) return;
        element.classList.remove( 'hidden');
        // Hide others 
        for ( let eli=1; eli < elementIdList.length; eli++) {
            element = this.dom.element( elementIdList[ eli]);
            if (element) element.classList.add( 'hidden');
        }
    }
    
   /**
    * Update the state of a virtual LED indicator
    */    
    LED( id, onOff)
    {
        let led = document.getElementById( id);
        if (!led) return;
        if ( led.tagName.toLowerCase() != "circle") return;
        let color = "lightgreen";
        if ( !onOff) color = "pink";
        led.setAttribute( 'stroke', color);    
        led.setAttribute( 'fill', color);  
    } // UDAPI.LED()

   /**
    * Set an ENViromental variable on server by sending an "ignore" request
    */    
    env( key, value)
    {
        let uri = "/"+this.ud.service+"//AJAX_fetch/"+key+"|"+value+"/";
        let context = { action:"ignore"};
        this.ud.udajax.serverRequest( uri, "GET", "", context);
    } // UDAPI.env()
    
   /**
    * Highlight on/off for an element
    */    
    switchHighlight( elementId)
    {
        let element = null;
        if ( typeof elementId == "string") element = this.dom.element( elementId);
        else element = elementId;
        if ( !element) return;
        if ( element.classList.contains( 'highlight'))
            element.classList.remove( 'highlight');
        else
            element.classList.add( 'highlight');
    } // UDAPI.switchHighlight()   

   /**
    * @api {js} API.listAPI(elementOrId) List API functions
    * @apiGroup Help
    */
    listAPI( elementOrId=null) {
        let r = "<ul class=\"listAPI\">";
        let rTxt = "";
        for ( let fct in this.fctMap) {
            // 2DO link upload/smartdoc_prod/api/doc/index.html#api-Elements-JsApiDomElementQueryParentoridNull
            r += "<li>"+fct+"<li>";
            let module = this.fctMap[ fct];
            rTxt += fct + "," + module.constructor.name + "\n";
        }
        let obj = API.dom;
        let proto = Object.getOwnPropertyNames( Object.getPrototypeOf( obj));
        for (let protoi = 0; protoi < proto.length; protoi++) {
            let key = proto[ protoi];
            if ( typeof obj[key] == "function" && key  != "constructor") {
                r += "<li>"+key+"<li>";
                rTxt += "dom." + key + ",dom\n";               
            }
        }
        obj = API.dom.cursor;
        proto = Object.getOwnPropertyNames( Object.getPrototypeOf( obj));
        for (let protoi = 0; protoi < proto.length; protoi++) {
            let key = proto[ protoi];
            if ( typeof obj[key] == "function" && key  != "constructor") {
                r += "<li>"+key+"<li>";
                rTxt += "dom.cursor." + key + ",dom.cursor\n";               
            }
        }
        obj = API.dom.udjson;
        proto = Object.getOwnPropertyNames( Object.getPrototypeOf( obj));
        for (let protoi = 0; protoi < proto.length; protoi++) {
            let key = proto[ protoi];
            if ( typeof obj[key] == "function" && key  != "constructor") {
                r += "<li>"+key+"<li>";
                rTxt += "dom.udjson." + key + ",udjson\n";               
            }
        }
        

        r += "</ul>";
        if ( !elementOrId) {
            console.log( rTxt);
            return r;
        }
        // 2DO fill an element
    } // API.listAPI()
    
   /**
    * @api {js} API.getShortcut(fctName) Return a function to call an API function directly
    * @apiParam {string} fctName Name of the function
    * @apiSuccess  {function} The binded function to call
    * @apiGroup Programs
    */
    getShortcut( fctName, module="") {
        if (!module) module = this.fctMap[ fctName];
        if ( module) {
            let fct = module[ fctName];
            let binded = fct.bind( module);
            return binded;
        } else {
            return function(...args) { 
                if (this.detectErrors) {
                    console.log( "ERR no " + fctName);
                } else return args[0];                
            }
        }
        return null;
    }
    
   /**
    * @api {js} $$$.raiseErrors() Activates reporting of errors in calls to library
    * @apiGroup Programs
    */
    raiseErrors() { this.detectErrors=true;}

   /**
    * @api {js} $$$.ignoreErrors() Disactivates reporting of errors in calls to library
    * @apiGroup Programs
    */
    ignoreErrors() { this.detectErrors=false;}
    
    isLoadable( fctName) {
        let module = "";
        for ( let mod in this.availableModules) {
            if ( this.availableModules[ mod] && this.availableModules[ mod].indexOf( fctName) > -1) {
                // Module found
                module = mod;
                break;
            }
        }
        if ( module) return 'modules/$$$/' + module;
        if ( !this.loadable) this.loadable = $$$.json.parse( 'UD_loadable');        
        return $$$.json.value( this.loadable, fctName);
    }
    
   /**
    *  PASS-THRU METHODS FOR API.fct() 
    */
    // 2DO Generate these automatically from lists of functions. Need nb of params somewhere or always 5
    insertElement()
    { 
      let newElement = this.ude.insertElement( arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
      this.ude.initialiseElement( newElement.id);
    }
    removeChildren( parentId) { return this.utilities.removeChildren( parentId);}
    followScroll ( elementId) { return this.ude.followScroll( elementId);}
    changeClass( ) { return this.ude.changeClass( arguments[0], arguments[1], arguments[2]);}
    reload() { return this.ud.reload( arguments[0], arguments[1], arguments[2]);}
    dom() { return this.dom;}

    /*
     * @api {js} $$$.loadFcts(fcts) Check a set of $$$ functions are available and load modules if needed
     * @apiParam {string[]} fcts List of fct names to check
     * @apiSuccess {integer} string - missing fcts, 0 - not available yet - loading, 1 - all loaded
     * 
     */ 
    loadFcts( fcts) {
        let modules = [];
        let unavailable = "";
        for ( let fcti = 0; fcti < fcts.length; fcti++) {
            let fct = fcts[ fcti];
            if ( typeof this.fctMap[ fct] == 'undefined') {
                let module = this.isLoadable( fct);
                if ( !module) unavailable += fct + ' ';
                else if ( modules.indexOf( module) == -1) modules.push( module + version);
            }
        }
        if ( unavailable) return unavailable.trim();
        else if ( modules.length) {
            require( modules);
            return false;
        }
        return true;
    }

    loadAndRun( fcts, script) {
        let modules = [];
        for ( let fcti = 0; fcti < fcts.length; fcti++) {
            let fct = fcts[ fcti];
            if ( typeof this.fctMap[ fct] == 'undefined') {
                let module = this.isLoadable( fct);
                if ( module && modules.indexOf( module) == -1) modules.push( module + version);
            }
        }
        require( modules, script);
    }

    isFunction( fct) {
        return ( typeof this.fctMap[ fct] == 'object');
    }
        
} // JS class UDapi
 
/*
class UDmodule {
    constructor() {
        let props = Object.getOwnPropertyNames( Object.getPrototypeOf(this));
        let fcts = props.filter(( e, i, arr) => { 
            if ( e!=arr[i+i] && typeof this[e] == "function" && e != "constructor") return true;
        });

        if ( typeof $$$ != "undefined") {
            $$$.addFunctions( this, fcts);
        }
    }
}
*/
class Deferred {
    constructor() {
      this.promise = new Promise((resolve, reject)=> {
        this.reject = reject
        this.resolve = resolve
      })
    }
}
 
function setupAPI( ud) {
    let api = new UDapi( ud);
    // if ( object = "process") return api;
    API = new Proxy( api, {
        get : function(target, prop, receiver) {
            // Lookup property in target's fctMap and call appropriate module
            let module = target.fctMap[ prop];
            if ( module) { 
                // console.log( "Using module", target.fctMap[ prop].moduleName);
                /*
                * code if we decide to chain functions
                if ( typeof got == "object" && Array.isArray( got)) {
                    // Module is an array of modules which provide the requested function, so call each in term
                    return function(...args) {
                        let r = [];
                        for ( let fcti=0; fcti < module.length; fcti++) {
                            r[] = module[ fcti][ prop].apply( module[ fcti], args);
                        }
                        return r;
                    }
                } else
                */                
                // If mapped function return functions result
                return function (...args) {
                    let result = module[prop].apply(module, args);
                    // console.log(prop + JSON.stringify(args) + ' -> ' + JSON.stringify(result));
                    return result;
                };
            } else {
                // Get property from target
                let got = target[ prop] 
                if ( typeof got == "function") {
                    // If function return functions result
                    return function (...args) {
                        let result = got.apply(this, args);
                        // console.log(prop + JSON.stringify(args) + ' -> ' + JSON.stringify(result));
                        return result;
                    };

                } else if ( typeof got == "undefined") {
                    // No function or variable with the requested name available in library                    
                    let hook = !(target.detectErrors);
                    let loadable = target.isLoadable( prop);
                    if ( loadable) {
                        // Fetch resource (or module) and then run function
                        return function( ...args) {
                            api.argsLoadable[ prop] = args;
                            /**
                             * This will use baseURL inconfigrequire
                             * To force public
                             * global $PUBLIC;
                             * if ( $PUBLIC) {
                             *   // Version ?
                             *   if ( get_class( $PUBLIC) != 'FileStorage') {
                             *      $fc = $PUBLIC->getContents()
                            *       file_put_contents( 'tmp/'.$filename, $fc)
                             *      $loadable = '/tmp/'.$filename require( /tmp/ )
                            *    }
                            *  }
                             */
                            require( [loadable + version], function() {
                                let result = $$$[ prop]( ...api.argsLoadable[ prop]);
                                return result;
                            });
                        }
                    } else if ( hook) {
                        // Hook mode just return 1st argument
                        return function(...args) {
                            debug( {level:5}, "Unactivated hook ", prop);
                            return args[0];
                        }
                    } else {
                        // Error mode
                        return function() { 
                            let err = "ERR 450 - Unknown function call " + prop + "()";
                            debug( {level:2}, err);
                            if ( this.unknownCalls.indexOf( prop) == -1) {
                               this.unknownCalls.push( prop);
                                let debugLevelHolder = this.dom.element( 'UD_debug');
                                if ( debugLevelHolder && parseInt( debugLevelHolder.textContent) > 10) alert( err);
                            }
                            return null; // "ERR"
                        };
                    }
                } else return got;
            }
   }}); 
   // Setup new (alternative) names
   $$$ = API;
   UDLIB = API;
   return API;
} // setupAPI()
    

if ( typeof process == 'object')
{
    // Testing under node.js
    // Load modules associated with API
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined" && typeof ModuleUnderTest == "undefined") {  
        ModuleUnderTest = "udapi.js";
        console.log( "Syntax OK");
        const api1 = require( "./apiset1.js");    
        const UDapiSet1 = api1.class;
        module.exports = { class: UDapi, SET1:UDapiSet1, init:setupAPI};     
        const envMod = require( '../tests/testenv.js');
        envMod.load();
        // Setup our UniversalDoc object
        const ud = new UniversalDoc( 'document', true, 133);
        if ( ud.api) console.log( "API loaded : OK"); else { console.log( "API loaded : KO"); process.exit( -1);}
        let r = API.insertRow( 'myTable', 0, {val1:32,val2:"text",val3:"dom...value"});
        if (r) console.log( "Test insertRow : OK"); else console.log( "Test insertRow : KO");
        //API.exec = function( expr) { console.log( "Calculating "+expr); return API.calc.eval( expr);};
        //r = API.exec( "5+6");
        //console.log( r);
        r = API.copyPortion( 'source_h1a', 'target');
        if ( document.getElementById( 'target').outerHTML.indexOf( "helpTitle") > -1) console.log( "Test copyPortion : OK"); else console.log( "Test copyPortion : KO");
        {
            let test = "API wrapping good & bad functions";
            API.raiseErrors();
            let r1 = API.badFct( "abc");
            let r2 = API.calculate( "2+3");
            testResult( test, ( (r1 == null || r1.indexOf( 'ERR') > -1) & r2 == 5), API);
        }
        console.log( 'udapi.js Test completed'); 
        process.exit();
    } else {
        const api1 = require( "./apiset1.js");    
        const UDapiSet1 = api1.class;
        module.exports = { class: UDapi, SET1:UDapiSet1, init:setupAPI};     
    }
} // End of test routine