/**
 * udecalc.js
 *  Calculator for DOM
 *    detects elements with an ude_formula attribute<br>
 *    computes result of formulae with values taken from other DOM elements designated as id.index1.index2.attribute<br>
 *    keeps track of dependencies to know when each formula must be re-computed
 */
 
 
 class UDEcalc
 {

   dom;
   ude;
   delimiters = " \n\t=+-*/;,&\()'\"";
   keepDelimiters = "=+-*/;,&\()'";
   expr;
   litteral;
   quote;
   autoId = 1;
   cssCalc = null;
   termCount = 0;
   
       
    mathFunctions = [ 
        "abs", "acos", "acosh", "asin", "asinh", "atan", "atan2", "atanh", "cbrt",
        "ceil", "clz32", "cos", "cosh", "exp", "expm1", "floor", "fround", "hypot", "imul",
        "log", "log10", "lop1p", "log2", "max", "min", "pow", "random", "round", "sign", 
        "sin", "sinh", "sqrt", "tan", "tanh", "trunc"
    ];
    cssFunctions = ["classesByTag"];
    tableFunctions = [
        "findRows", "findFirstRow", "sumsBy", "sumsByAK", "sumsByAV", "sumIf", "concatIf",
        "valueList", "getRow", "tableColumns"
    ];
   localFunctions = [
        "lookup", "ajaxZoneCall", "style", "if", "row", "column", 
        "datestr", "json", "imageTag", "linkTag", "linkJStag", "metricTag", "multiCalc", 
        "checkboxTag", "switchTag", "switchTagCallback", "toggleSwitch", "selectorTag", "getSingleChoice",
        "textContent2HTML", "substitute", "buildComposite",
        "buildJSONlist", "checkValue", "inList", "inBetween", "listNames", "listValues", "formatList", "removeAccents",
        "item", "trim", "uppercase", "titlecase", "orop", "oneOf", "defaultValue", "jsonKeys", "api",
        "isName", "isDate", "array", "content", "uround", "value", "textReplace", "attrPath"
    ];
    functions = {};
    dependencies = {};
    toDo = [];
    lockToDo = false;
   
    constructor( dom, ude) {  
        this.dom = dom;
        this.ude = ude;
        // Setup dayjs
        if ( typeof moment == "undefined" && ude && typeof process == "undefined") {
            window.dayjs = require("dayjs");
            window.moment = window.dayjs;
            window.moment.locale( window.lang.toLowerCase());
        }        
        // Add API functions
        if ( typeof API != "undefined" && API) { 
            API.addFunctions( this, [ 'redoDependencies', 'toggleSwitch', 'if', 'selectorTag', 'getSingleChoice', 'getMultipleChoice']);
        }
    }
   
    // Add a function
    addFunctions( functionNames, module) {
        for ( let fcti=0; fcti < functionNames.length; fcti++) {
            this.functions[ functionNames[ fcti]] = module;
        }
        return true;
    }
   
   // Add a token to the current expression, adding appropiate instance/methods
   addTokenToExpr( token, delimiter)
   {
        var c = delimiter;
        if ( this.litteral)
        {
            // Within quotes
            this.expr += token+c;
            if ( c == this.quote) this.litteral = false; // !this.litteral;         
        } 
        else if ( c == "'" || c == '"') 
        {
            // Start of a litteral
            this.litteral = true; // !this.litteral;
            this.quote = c;
            this.expr += c;
        }        
        else
        {   
            // Not within quotes
            if ( !isNaN( token) /* a number*/) this.expr += token;
            else if ( c && c == '(')
            {
                if ( token == "") // || "+-*/".indexOf( this.expr.charAt( this.expr.length-1))>-1
                {
                    // Aritmetic expression ()
                    this.expr += c;
                }
                else
                {
                    // Token must be an allowed function call
                    // Prefix with the appropriate instance
                    if ( this.mathFunctions.indexOf( token)>-1) this.expr += "Math."+token;
                    else if ( this.localFunctions.indexOf( token)>-1) this.expr += "this."+token;
                    else if ( this.tableFunctions.indexOf( token)>-1) this.expr += "this.ude.tableEd."+token;
                    else if ( typeof this.functions[ token] != "undefined") this.expr += this.functions[ token];
                    else if ( this.cssFunctions.indexOf( token)>-1)
                    {
                        // Model for loadable function sets
                        /*if ( !this.cssCalc) 
                            this.ude.loadScript( 
                                 "ude-view/udecalc_css.js", 
                                 "window.ud.ude.calc.cssCalc = new UDEcalc_css( window.ud.ude.calc);"
                            );*/                                 
                        if ( this.cssCalc)  this.expr += "this.cssCalc."+token;
                        else this.expr += "ERR:RETRY LATER"; // Return as error
                    }    
                    else {
                        // 2DO cache this 
                        let returnType = APIreturnType( token);
                        if ( ["string", "number", "boolean"].indexOf( returnType) > -1) this.expr += "API."+token;
                        else this.expr += "ERR:Unknown function or unallowed response type";
                    }
                }    
            }  
            // else if (c == ' ') { tokenWithSpace}
            else
            {
                // Token is a text string, including ., outside quotes 
                // to be interpretated as a path to a value
                // Prefix with DOM's value expression
                // 2DO use tokenwithSpace if exists
                if ( token.indexOf( 'window') == 0) this.expr += token;
                else this.expr += "this.dom.value('"+token+"')";
                this.termCount++;
            }
            // Keep delimiter if keep list
            if ( (c && this.keepDelimiters.indexOf(c) > -1) ) this.expr += c;            
        }            
      return "";
    } // UDEcalc.addTokenToExpr()

   prepareForExec( expr) {
     this.expr = "";
     var token = "";
     this.litteral = false;
     this.quote = '';
     this.termCount = 0;     
     for (var i=0; i < expr.length; i++) {
        var c = expr[i];
        if ( this.delimiters.indexOf(c) > -1 && !( this.expr == "" && (c == '-' || c == '+'))) {
            // Delimter - add token to expression
            token = this.addTokenToExpr( token, c);
        } else {
            // Not a delimiter add to token
            token += c;         
        }
     }
     if (token) token = this.addTokenToExpr( token, null);
     return true;
   } // UDEcalc.prepareForExec()
 
   /**
    * eval() -- evaluate an expression
    */
   exec( expr, element) { return this.eval( expr, element)} // old name
   eval( expr, element) //, resetLastAccessedValues= true or clear
   {
     var r;
     debug( {level:4}, "Computing ", this.expr, expr);     
     // DOM_lastAccessedValues = []; // 2DO use fct clear, get and member variable?
     if ( !expr || !this.prepareForExec( expr) || this.expr.indexOf('ERR:') > -1) return "ERR";
     expr = expr.replace( /&quot;/g, "'"); // Patch for 1PMP
     // If expr is just a number or single chain then don't évaluate 
    if ( !isNaN( this.expr)) { return this.expr;}
    else if (  
        ( this.expr.charAt(0) == "'" && this.expr.charAt( this.expr.length-1) == "'" && this.expr.match(/'/g||[]).length == 2)
        || ( this.expr.charAt(0) == '"' && this.expr.charAt( this.expr.length-1) == '"' && this.expr.match(/\"/g||[]).length == 2)
    ) { return this.expr.substr( 1, this.expr.length-2);}

     try 
     { 
        r = eval( this.expr); // this.expr is safe and has been parsed
        debug( {level:4}, "Computed ", this.expr, expr, r);
     }
     catch( error)
     {
        r = "Err";
        debug( {level:0}, "ERR eval :",this.expr);
        console.log( error);
        if ( DEBUG_level > 2) eval( this.expr); // for debugging
     }
     return r;
   } // UDEcalc.exec()
   
   // Mark for update
   markToUpdate( element, index=-1, recurrent=false)
   {
       this.toDo.push( { element:element, index:index, recurrent:recurrent});
   }
   
   // Update an element
   updateElement( element, indexV=0, recurrent=false)
   {
        if (!element || !this.dom.attr( element, 'ude_formula')) return;
        // Don't update an element in staged editing
        if ( element == this.ude.editingElement || element.classList.contains( 'stageediting')) return;
        // If calculator not initialised, just stock in todo list
        if ( !this.dependencies)
        {
            this.markToUpdate( element, indexV, recurrent);
            return;
        }
        debug( {level:4}, "updating", element.id, indexV);
        // Get formula, action and if content is json
        let expr = this.dom.attr( element, "ude_formula");
        if ( !expr)
        {
            // 2DO Remove from dependencies
            return;
        }
        let action = this.dom.attr( element, "ude_updateaction");
        let json = false;        
        if ( element.textContent.charAt( 0) == '{') json = true;
        // Reset list of accessed values used to compute Dependencies
        DOM_lastAccessedValues = [];
        // Save current auto values and set for element being updated
        var saveAuto = { home:this.dom.autoHome, index1:this.dom.autoIndex1, index2:this.dom.autoIndex2};       
        if ( action && json)
        {
            // Call defined action with updated JSON
            switch ( action)
            {
                case "chart.initialise" :
                    let saveable = this.dom.getSaveableParent( element);
                    this.ude.initialiseElement( saveable.id);
                    break;
            }    
        }
        else
        {
            // Update single value
            // Substitute index in formula
            let hasIndex = ( expr.indexOf( 'index.') > -1);
            if ( indexV && hasIndex) {
                expr = expr.replace(/index/g, indexV); //w[1]);
                this.dom.attr( element, 'ude_formula', expr);
            } else expr = expr.replace(/{index}/g, 1);
            let dataSrcId = this.dom.parentAttr( element, 'ude_datasrc');
            // Initialise Auto values for domvalue
            if ( dataSrcId) this.dom.autoHome = this.dom.element( dataSrcId);
            else this.dom.autoHome = element;           
            if ( [ 'td', 'li'].indexOf( this.dom.attr( element, 'exTag')) > -1) {
                 // Set autoIndex1 as correponding sibling in parent node for TD's and LI's
                let index = 1;           
                let walkElement = element.parentNode; // tr element
                while ( (walkElement = walkElement.previousSibling)) index++; 
                this.dom.autoIndex1 = index;                
            }
            // Run formula and set element's content with result
            window.UDEcalc_element = element;
            let result = this.exec( expr);            
            this.dom.autoIndex1 = 0;
            this.dom.autoHome = "";
            if ( result == "...") this.markToUpdate( element, indexV, recurrent);
            else {
                element.innerHTML = result;
                if ( typeof result == "string" && result.indexOf( 'ERR') == 0) element.classList.add( 'error'); else element.classList.remove( 'error');
            }    
            if ( this.dom.elements( 'table', element).length) {
                // Result contains table so arrange
                this.dom.arrangeTables( element, false);
            }
            window.UDEcalc_element = null;
        }
        // Update dependencies
        var values = DOM_lastAccessedValues;
        // For each element id used in formula, add current element to array of dependant elements
        for ( var ivalue in values)
        {
            var valElement = values[ivalue];
            var value = this.dom.attr( values[ivalue], 'id');
            if (!value)
            {
                // Create id automatically if used element has none
                value = "udcalc"+this.autoId++;
                values[ivalue].id = value;		 
            }
            // Create or update dependancy array as needed	   
            if ( typeof this.dependencies[value] == "undefined") this.dependencies[value] = [element];
            else if ( this.dependencies[value].indexOf( element) == -1) this.dependencies[value].push( element);
            // Update element if not already updated in current Do
            // this.updateElement( valElement);       
        }        
        // Re update this element if a valElement was updated
        // Update elements dependant on this element
        if ( recurrent) this.checkDependencies( element);
        // Restore dom variables and return
        this.dom.autoHome = saveAuto.home;
        this.dom.autoIndex1 = saveAuto.index1;
        this.dom.autoIndex2 = saveAuto.index2;
        debug( {level:4}, "updated", element.id, indexV); 
        // Return true if element updated     
        return true;
   } // UDEcalc.updateElement()
   
   do( allowedTime)
   {
      if (this.lockToDo) return;
      if ( !this.dependencies) this.initializeDependencies();
      var toDo = this.toDo;
      this.toDo = [];      
      for( var ielem=0; ielem<toDo.length; ielem++)
      { 
         var elem =toDo[ielem];
         if ( typeof elem =="object" && typeof elem.id == "undefined")
         {
            var ind = elem.index;
            var rec = elem.recurrent;             
            this.updateElement( elem.element, ind, rec);
         }
         else
         {
            // 2DO Find UDE_formula from model copying not useful ex UDE_formula="usemodel"
            // 2DO Find index to replace in UDE formula id is not reliable
            var w = this.dom.attr( elem, 'id');
            if (w) w = w.split('_');
            // 2DO testing index processed by dom.value
            // 2DO use 'index' in formulas to avoid this replacement
            if (w && w.length > 1) this.updateElement( elem, parseInt( w[1]));
            else this.updateElement( elem);
         }
      }
   } // UDEcalc.do()
   
   redoDependencies()
   {
       this.toDo = []; 
       this.initializeDependencies();   
       return true;   
   } // UDEcalc.redoDependencies()
   
   /*
    * 2 - DEPENDENCY MANAGEMENT
    */
    /*
     *  2DO
     *  At start, find existing dependencies
     *  When dom.value UDEformula updateDependency
     *  When dom.value writing mark calc needed or just do it
     *  On tick 1 value at a time 
     */
    
    initializeDependencies()
    {
  
      // Examine all elements to find which need updating
      this.dependencies = [];
      this.lockToDo = true;
      var elements = this.dom.topElement.getElementsByTagName('*');
      // Build array of toDo elements
      var todoArray=[];
      for (var todoi in this.toDo)
          if ( typeof this.toDo[todoi] == "object") todoArray.push( this.toDo[todoi].element);
          else todoArray.push( this.toDo[todoi]);      
      // Run thru backwards as higher level formulas are at the top of the doc (param)
      for (var i = elements.length-1; i >=0; i--)
      {
        var element = elements[i];
        if ( element.nodeType == 1 && this.dom.attr( element, 'ude_formula')  
             && !(element.tagName =="TD" && element.parentNode.classList.contains('rowModel'))
        )
        {
            // Element has formula and is not a Model element
            var id = this.dom.attr( element, 'id');
            if (!id) {
                // Add an id automatically 
                id = "udcalc"+this.autoId++;
                element.id = id;		 
            }
            // Update element directly if not already in update list
            if ( todoArray.indexOf( element) == -1) this.updateElement( element);
        }       
      }
      this.lockToDo = false;
      debug({level:1}, "Dependencies", this.dependencies);
    } // UDEcalc.initializeDependencies() 
    
    checkDependencies( element)
    {
      if (typeof element == "undefined")
      {
        // If no element provided then use cursor 
        this.dom.cursor.fetch();
        element = this.dom.cursor.HTMLelement;
      }  
      // Build array of toDo elements
      var todoArray=[];  
      for (var todoi in this.toDo)
          if ( typeof this.toDo[todoi] == "object") todoArray.push( this.toDo[todoi].element);
          else todoArray.push( this.toDo[todoi]);
      // Add dependant elements to needUpdate list
      this.lockToDo = true;
      if (
        element && typeof element != "undefined" 
        && typeof this.dependencies[ element.id] != "undefined"
      )
      {
        var elemsToUpdate = this.dependencies[ element.id];
        for (var ielem in elemsToUpdate)
        {
            var elem = elemsToUpdate[ielem];
            if ( elem == element)
            {
                // Loop detected
                elem.innerHTML = "ERR";
                this.lockToDO = false;
                return;
            }
            if ( elem.textContent.charAt(0) != '{') elem.innerHTML = "...";
            if ( todoArray.indexOf( elem) == -1)
            { 
                this.toDo.push( elem);
                // Recursive for checking consequential chanes
                this.checkDependencies( elem);            
            }
            // else circular  
        }
      }
      this.lockToDo = false;
    } // UDEcalc.checkDependencies()
   
   /*
    * 3 - LOCAL FUNCTIONS AVAILABLE IN FORMULAE
    */
   
   /**
    * Build a lookup table as an object from a table in DOM
    * @param {mixed} element The HTML element whose attribute is to be written or its id
    * @param {string} attrName Name of the attribute, special cases: starts with "computed_" use computed style, "exTag" = tag.ud_type
    * @param {mixed} value Read if null, clear attribute if "__CLEAR__", otherwise set attribute
    * @return {mixed} Attribute's value, null if element or attribute not found
    * @api {JS} API.lookup(tableName,nameField,content) Build lookup from table
    * @apiParam {string} tableName Id of table (which is also the name of the div.table element)
    * @apiParam {string} nameField Label of the column to use as key
    * @apiParam {string} content Label of column to use as value    
    * @apiSuccess {HTMLelement} return A named list
    * @apiError {object} return null
    * @apiGroup Elements
    *    
    */   
   lookup( table, lookupKey, result, lookupValue)
   {
     var tableData = this.dom.createLookupFromTable( table, lookupKey, result);
     //console.log( lookupValue, tableData);
     return tableData[ lookupValue];
   } // UDEcalc.lookup()
  
   /**
    * Generate a JS instruction to fetch and display data from server
    * @param {integer} type The type of document or page: 1-model, 2-instance
    * @param {string} oid DB's full path with parameters 
    * @param {string} target Id of element to be filled with server's response
    * @return {string} JS to place in an onclick atribute
    * @api {onclick} API.displayOIDcall(type,oid,targetId) Fetch element from server and display
    * @apiParam {integer} type The type of document or page: 1-model, 2-instance
    * @apiParam {string} oid DB's full path with parameters 
    * @apiParam {string} target Id of element to be filled with server's response
    * @apiSuccess {string} return JS to place in an onclick atribute
    * @apiGroup Elements
    *    
    */    
    displayOIDcall( type, oid, target="")
    {
        let r = "";
        // Get new window option
        let newWindow = (window.udAttributes.newWindowOnFiles.toLowerCase() == "yes");
        if ( !target) newWindow = false;        
        // Build URI
        let uri = oid+'/';
        if ( !newWindow) uri += 'AJAX_';
        // Model or document        
        if ( type == 1) uri += 'modelShow/';
        else if ( type == 2 || type == 3) uri += 'show/';
        // Generate call
        if ( newWindow && target) {
            // Open in named tab
            r = "window.open('webdesk/"+uri+"'/, '"+target+"')";            
        } else {
            // Display in current window
            r = "window.ud.udajax.serverRequest( '"+uri+"', 'GET', null, { zone: \"document\", action:\"fill zone\", element:null, ud:window.ud});";    
        }
        return r;
    } // UDEcalc.displayOIDcall()
   
   /*
    *   ajaxZoneUpdate() -- generate a call to UDajax.updateZone() for an onclick attribute
    *     @param url
    *     @param zoneId
    */
    ajaxUpdateZoneCall( url, zoneId)
    {
        let r = "window.ud.udajax.serverRequest( '"+url+"', 'GET', null, { zone: \""+zoneId+"\", action:\"fill zone\", element:null, ud:window.ud});";    
        return r;
    } // UDEcalc.ajaxZoneUpdateCall()
    
   /* 
    *   ajaxZoneCall() -- Prepare an AJAX call to update a zone
    *     @param table   -- id of table where data is stored
    *     @param index   -- row (index 1) to use
    *     @param field   -- attribute of id column where OID is stored 
    *     @param zone    -- ide of zone to update
    *     @param target  -- name of tab to open. {id} is replaced with text content of id column
    *     @param externalURL --     
    */
    // 2DO use displayOIDcall 
    ajaxZoneCall(table, index, field, action, zone, target, externalURL = "")
    {
        var r = "";
        debug({level:5}, "Ajax zone GetValue", table, index, field, zone, target);
        // Patch for oidchildren
        if ( field == "oidChildren") field = "data-ud-oidchildren";
        var oid = this.dom.value( table+"."+index+".id."+field);
        // Get new window option   could alo use this.eval( 'UD_openNewWindow...value')
        let newWindowCheckbox = this.dom.element( 'UD_openNewWindow'); 
        let newWindow = ( !newWindowCheckbox || newWindowCheckbox.value.toLowerCase() == "yes");
        // 2DO shorten oid
        // Patch to force User Depth
        if ( oid.indexOf( 'UD|') == -1 && oid.indexOf( 'CD|') > -1) oid = oid.replace( 'CD', 'UD|3|CD'); 
        oid += "/"+action+"/";
        if ( externalURL)
        {
            // Display an external URL in a new tab
            var id = this.dom.value( table+"."+index+".id.textContent");
            if ( id == 0)
            {
                // Patch to use same window
                // r = "window.ud.udajax.updateZone('"+externalURL+"','"+zone+"');";
                r = "window.ud.udajax.serverRequest( '"+externalURL+"', 'GET', null, { zone: \"document\", action:\"fill zone\", element:null, ud:window.ud});";    
                
            }
            else
            {
                // Seperate window
                target = target.replace("{id}", id);
                r = "window.open('"+externalURL+"', '"+target+"')";
            }
        }
        else if ( typeof target != "undefined" && target != "" && target != "_") 
        {
            // Display a document in a new tab
            var id = this.dom.value( table+"."+index+".id.textContent");
            target = target.replace("{id}", id);
            if ( newWindow)
            {
                oid = oid.replace( "AJAX_modelShow", "show"); // 2DO improve
                r = "window.open('/webdesk/"+oid+"', '"+target+"')";
            }
            else
            {
                oid = oid.replace( "AJAX_modelShow", "AJAX_show"); // 2DO improve
                r = "window.ud.udajax.updateZone('"+oid+"','"+zone+"');"; 
            }
        }
        else
        {
            // Refresh document with contents of selected OID 
            // r = "LFJ_ajaxZone('"+oid+"','"+zone+"');"; 
            r = "window.ud.udajax.updateZone('"+oid+"','"+zone+"');"; 
       }
        return r;
    } // UDEcalc.ajaxZoneCall()
   
   /**
    * Stylize a value by generating HTML with a classed <span> tag containing a value
    * @param {string} str Value to stylise
    * @param {string} className Class to apply to SPAN
    * @return {string} HTML code
    * @api {onclick} API.style(str,className) Get HTML code to stylise a litteral
    * @apiParam {integer} type The type of document or page: 1-model, 2-instance
    * @apiParam {string} str Value to stylise
    * @apiParam {string} className Class to apply to SPAN
    * @apiSuccess {string} return HTML code
    * @apiGroup Text or HTML
    *    
    */        
    style( str, className)
    {
        return '<span class="'+className+'">'+str+'</span>';
    } // UDEcalc.style() 
  
    // 2DO mobe next 2 fcts to udetable.js
   /**
    * Get row index of a table cell
    * @param {string} selector Null to use current element
    * @return {integer} Index
    * @api {formula} row() Get a cell's row index
    * @apiDescription Place in a cell's formula, gives the cell's row index    
    * @apiSuccess {string} return the cell's row index else -1 
    * @apiGroup Tables
    *    
    */        
    row( selector="")
    {
        if ( !selector)
        {
            // No selector so return current row
            let cell = this.dom.autoHome;
            if ( !cell || this.dom.attr( cell, 'exTag') != "td") return -1;
            let row = cell.parentNode; // tr element
            let index = 0;
            while ( (row = row.previousElementSibling)) index++;
            return index+1;
        }
        else if (!isNaN( selector)) {
            // Selector is number, use as offset from current row
            let rowIndex = this.row();
            return rowIndex + selector;
        } else {
            // Which table ?
            var tableId = this.dom.getParentAttribute( "table", "id", this.dom.autoHome);
            // Search row
            var rowIndex = this.ude.tableEd.findFirstRow( tableId, selector);
            if (rowIndex) return rowIndex;
            else return -1;
        }
    } // UDEcalc.row()

    // Get index of a Column
   /**
    * Get column index of a table cell
    * @param {string} selector Null to use current element
    * @return {integer} Index
    * @api {formula} column() Get a cell's column index
    * @apiDescription Placed in a cell's formula, gives the cell's column index    
    * @apiSuccess {string} return the cell's row index else -1 
    * @apiGroup Tables
    *    
    */ 
    column( selector="")
    {
        if ( !selector)
        {
            // Current column
            let current = this.dom.autoHome;
            let row = current.parentNode;
            let cols = Array.from( row.cells);
            let index = cols.indexOf( current);
            return index+1;
        }
        else
        {
            // Find first cell of current row that matches selector
            // Return corresponing column
        }
    } // UDEcalc.column()            
    
    // Date expression
    // If string returns value, if value returns string
    // Ex : datestr( datestr( 'today') + datastr( '10 days')) returns 25/01/2020 if today is 15/01/2020 
    //      datestr( '10 days after today')
    // expression -> date -> unix time -> expression
   /**
    * Convert a date from & forma to another including 
    * to a time-from-now phrase and vice-versa (uses dayjs a moment.js lightweight equivalent)
    * @param {string} expr Expression to convert ex datestr('today') returns 25/12/2020 on Christmas day 2020
    * @return {string} Converted expresion
    * @api {formula} column() Convert  a date string to/from time-from-now
    * @apiParam {string} expr Expression to convert date or [today, tomorrow, yesterday, 1 month ago ...]   
    * @apiSuccess {string} return Converted expression [today, tomorrow, yesterday, 1 month ag ...] or date
    * @apiGroup Data
    *    
    */ 
    datestr( expr, formatIn="", formatOut = "", future=false)
    {
        // Setup dayjs
        dayjs = this.dayjs;
        if ( !this.dayjs) {
            this.dayjs = dayjs = requirejs( 'dayjs');
            let customParseFormat = requirejs('dayjscdn/plugin/customParseFormat');
            let relativeTime = requirejs('dayjscdn/plugin/relativeTime');
            let weekOfYear = requirejs('dayjscdn/plugin/weekOfYear');
            let locale = requirejs ( 'dayjscdn/locale/fr');
            dayjs.extend( customParseFormat);
            dayjs.extend( relativeTime);
            dayjs.extend( weekOfYear);
            // dayjs.extend( locale);
            if ( typeof dayjs.locale == 'function') dayjs.locale( window.lang.toLowerCase());     
            this.currentDate = null;           
            this.currentWeek = -1;
        }   
                  
       // let val = ( expr) ? dayjs( expr, formatIn) : dayjs();
        let val = dayjs();
        if ( Array.isArray( formatIn)) {
            // Try multiple formats
            for ( let formati=0; formati < formatIn.length; formati++) {
                val = dayjs( expr, formatIn[ formati]);
                if ( val.isValid()) break;
            }
        } else val = (formatIn) ? dayjs( expr, formatIn) : (expr) ? dayjs( expr, 'DD/MM/YYYY hh:mm') : dayjs();
        //if (val && expr.indexOf( '/') == -1) return val.format('DD/MM/YYYY');
        if ( !val.isValid() && !(formatIn)) { // typeof expr == "string") 
            // Interpret expression
            expr = expr.trim();           
            if ( !this.currentDate) this.currentDate = dayjs();
            let d = this.currentDate;             
            let lg = window.lang.toLowerCase();  
            let daysOfWeek_short = {
                'en':[ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sunw', 'monw', 'tuew', 'wedw', 'thuw', 'friw', 'satw'],
                'fr':[ 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim', 'lunpr', 'marpr', 'merpr', 'jeupr', 'venpr', 'sampr', 'dimpr',]
            };
            let expressionsLang = {
                'en' : [
                    '^today',
                    '^tomorrow',
                    '^(' + daysOfWeek_short[ 'en'].join( '|') + ') ([0-9]*)h([0-9]*)', // Mon 10h00, Tue 10h30
                    '^\\+([0-9]*)d',
                    '^\\+([0-9]*)h',                    
                    '^([0-9]*)h([0-9]*)',
                    '^([0-9]*)h',          
                    '^week ([0-9]*)',
                    '^([0-9][0-9])/([0-9][0-9])/([0-9][0-9][0-9][0-9]) ([0-9][0-9])h([0-9][0-9])',
                    '^clear'
                ],
                'fr' : [
                    "^aujourd'hui",
                    '^demain',
                    '^(' + daysOfWeek_short[ 'fr'].join( '|') + ') ([0-9]*)h([0-9]*)', // Lu 10h00, Je 10h30
                    '^\\+([0-9]*)j',
                    '^\\+([0-9]*)h',
                    "^([0-9]*)h([0-9]*)",
                    "^([0-9]*)h",                             
                    '^semaine ([0-9]*)',
                    '^([0-9][0-9])/([0-9][0-9])/([0-9][0-9][0-9][0-9]) ([0-9][0-9])h([0-9][0-9])',
                    '^raz'
                ]
            };
            /*
            'fr' : { 'today':'aujourd'hui', 'day-time': '(Lu|Ma|Me|Je|Ve|Sa|Di)\s*([0-9]*)h'}
            '
            switch key day-time ... 
            */
            let expressions = expressionsLang[ lg];
            let cmd = null;
            for ( let expri=0; expri < expressions.length; expri++) {                
                if ( !expressions[ expri]) continue;
                let reg = new RegExp( expressions[ expri], "i");
                cmd = expr.match( reg);
               // console.log( cmd, reg, expr);
                if ( cmd) {
                    cmd[0] = expri+1;
                    /*
                    let lists = expri.split( '(');
                    for ( let cmdi = 1; cmdi < cmd.length; cmdi++) {
                        if 
                    }
                    */
                    break;
                }                
            }
            if ( !cmd && lg != 'en') {
                // Check again in english for programs
                expressions = expressionsLang[ 'en'];
                for ( let expri=0; expri < expressions.length; expri++) {                
                    if ( !expressions[ expri]) continue;
                    let reg = new RegExp( expressions[ expri], "i");
                    cmd = expr.match( reg);
                // console.log( cmd, reg, expr);
                    if ( cmd) {
                        cmd[0] = expri+1;
                        break;
                    }                
                }
            }
            if ( cmd) {
                function startOfWeek( weekNo) {
                    let currentWeek = dayjs().week();
                    d = dayjs();
                    d = d.startOf( 'week'); //.add( 1, 'day');
                    if ( weekNo >= currentWeek) d = d.add( ( weekNo - currentWeek) * 7, 'days');
                    else d = d.subtract( ( currentWeek - weekNo) * 7, 'days');
                    return d;
                }
                switch ( cmd[ 0]) {
                    case 0 :                    
                        break;
                    case 1 : // Today
                        d = d.subtract(1, 'days');
                        this.currentDate = d;
                        break;
                    case 2 : // Tomorrow
                        d = d.add(1, 'days');
                        this.currentDate = d;
                        break;            
                    case 3 : // Date & time for a week day and time
                        let day = cmd[1].toLowerCase();
                        let weekDay = daysOfWeek_short[ 'fr'].indexOf( day);
                        let weekDayL = 'fr';
                        if ( weekDay == -1) {
                            weekDay = daysOfWeek_short[ 'en'].indexOf( day);
                            weekDayL = 'en';
                        }
                        if ( weekDay == -1) {
                            d = 0;
                            break;
                        }                        
                        let hours = parseInt( cmd[2]);
                        let minutes = ( typeof cmd[3] == 'string') ? parseInt( cmd[3]) : 0;
                        if ( this.currentWeek > 0) d = startOfWeek( this.currentWeek);
                        if ( this.dayjs.locale() == "en" && weekDayL == "fr") d = d.add( 1, 'days');
                        // console.log( d.format() + ' ' + dayjs.locale());
                        d = d.add( weekDay, 'days').add( hours, 'hours').add( minutes, 'minutes');
                        if ( future && d.isBefore( dayjs())) {
                            d = 0;
                            break;
                        }
                        this.currentDate = d;                        
                        break;
                    case 4 : // Add days
                        d = d.add( parseInt( cmd[1]), 'days');                        
                        break;
                    case 5 : // Add hours
                        d = d.add( parseInt( cmd[1]), 'hours');                        
                        break;
                    case 6 : case 7 : // At a specif time
                        let t = cmd[1] + 'h' + (( typeof cmd[2] != "undefined" && cmd[2]) ? cmd[2] : "00");
                        let d2 = dayjs( t, 'h:mm'); // today at requested hour
                        if ( d.isBefore( d2)) d = d2; // send today at requested time
                        else if ( future) {
                            d = 0;
                            break;
                        } else d = d2.add( 1, 'days'); // send tomorrow at requested time
                        this.currentDate = d;
                        break;                    
                    case 8 : // Date at start of a week of the year    
                        let targetWeek = parseInt( cmd[1]);                   
                        this.currentWeek = targetWeek;
                        this.currentDate = startOfWeek( targetWeek);
                        break;
                    case 9 : // Full date
                        d = dayjs( new Date( cmd[3], cmd[2], cmd[1], cmd[4], cmd[5]));
                        this.currentDate = d;
                        break;
                    case 10 : // Clear
                        this.currentDate = null;   
                        break;
                }
            } else {
                d = 0;
            }
        //console.log( d);
            if ( !formatOut) formatOut = 'DD/MM/YYYY';
            val = (d) ? d.format( formatOut) : d;
            return val;
        } else if ( formatOut) {
            // Converting from 1 format to another
            let r = "";
            if ( val.isValid()) r = val.format( formatOut); //else return "";
            return r;
        } else {
            // If nb assume UNIX time and convert to time from now
            if ( !isNaN( expr)) {
                // Ever come here ?
                console.log( 'date expr is Number :' + expr);
                val = dayjs.unix( expr);
                return val.fromNow();
            } else {
                // Date OK
                this.currentDate = val;
                return val;
            }
        }
      
    } // UDEcalc.datestr()


    
   /**
    * @api {JS} API.json(jsonString,attrPath,value) Read or write a value in a JSON representation
    * @apiDescription Placed in a cell's formula, gives the cell's column index 
    * @apiParam {string} jsonString JSON representation of data
    * @apiParam {string} attrPath Path to requested value using '/' ex level1/level2/level3 
    * @apiParam {mixed} value Value to write, NULL if reading
    * @apiSuccess {mixed} return Written or read value or NULL if path not found
    * @apiGroup Data
    *    
    */         
    
   /**
    * Read or write a value from multiple level JSON representation
    * @param {string} jsonString JSON representation of data
    * @param {string} attrPath Path to requested value using '/' ex level1/level2/level3 
    * @param {mixed} value Value to write, NULL if reading
    * @return {mixed} Read value or NULL if not found
    */         
    json( jsonString, attrPath, value = null)
    {
        // 2DO use this.dom.udjson.valueByPath
        if ( typeof jsonString == "string")
        {
            if ( jsonString == "") return null;
            try {
                var j = JSON.parse( jsonString);
            }
            catch (e) { 
                debug( {level:2}, "Bad JSON", jsonString);
                return null;
            }    
        }
        else if ( typeof jsonString == "object") j = jsonString;
        if (!j) return null;        
        var path = attrPath.split('/');
        for ( var i =0; i< path.length; i++)
        {            
            j = j[path[i]];
            if ( !j) 
              return debug( {level:1, return: null}, "json can't find value in jsonSTring",attrPath, jsonString);
        }
        if ( value) j[path[i]] = value;
        return j;
    }  // UDEcalc.json()
  
    // if() for formula
   /**
    * Return a value according to a test
    * @param {boolean} test True of False expression
    * @param {mixed} trueReturn Value to return if test is true
    * @param {mixed} falseReturn Value to return if test is false
    * @return {string} The appropriate return value
    * @api {formula} if(test,trueReturn,falseReturn) Get a cell's column index
    * @apiParam {boolean} test True of False expression
    * @apiParam {mixed} trueReturn Value to return if test is true
    * @apiParam {mixed} falseReturn Value to return if test is false
    * @apiSuccess {string} The appropriate return value
    * @apiGroup Logic
    *    
    */ 
    if( test, truereturn, falsereturn) { 
        if (test) return truereturn; else return falsereturn;
    }

    /**
    * Return an <img> (image) tag in formula
    * @param {string} url URL/URI of image
    * @param {string} alt ALT and TITLE of image
    * @param {integer} width Width of image with units or "auto"
    * @param {integer} height Height of image with unit or "auto"
    * @return {string} The Image tag
    * @api {formula} imageTag(url,alt,width,height) Get an image tag
    * @apiParam {string} url URL/URI of image
    * @apiParam {string} alt ALT and TITLE of image
    * @apiParam {integer} width Width of image with units or "auto"
    * @apiParam {integer} height Height of image with unit or "auto"
    * @apiSuccess {string} return The <img> tag
    * @apiGroup Text or HTML
    *    
    */ 
    imageTag( url, alt, width, height) {
        let img = document.createElement("img");
        img.setAttribute( 'src', url);
        img.setAttribute( 'alt', alt);
        // img.setAttribute( 'width', width);
        // img.setAttribute( 'height', height);
        img.style.width = width;
        img.style.height = height;
        return img.outerHTML;
    }
    
   /**
    * Return an &lt:a&gt; (link) tag in formula
    * @param {string} url URL/URI of image
    * @param {string} alt ALT and TITLE of image
    * @param {string} text HTML inside link
    * @return {string} The &lt:a&gt; tag
    * @api {formula} linkTag(url,alt,text) Get an <a> tag
    * @apiParam {string} url URL/URI of target
    * @apiParam {string} alt ALT and TITLE of image
    * @apiParam {string} text HTML inside link
    * @apiSuccess {string} return The &lt:a&gt; tag
    * @apiGroup Text or HTML
    *    
    */ 
    linkTag( urlOrAction, alt, text)
    {
        // return anchor tag
        let anchor = document.createElement("a");
        if ( urlOrAction.indexOf( '/') > -1) anchor.href = urlOrAction;
        else $$$.dom.attr( anchor, 'onclick', urlOrAction.replace( '&quot;', '"'));
        //anchor.alt = alt;
        anchor.target=alt;
        // anchor.setAttribute( 'contenteditable', "false");
        let textNode = document.createTextNode( text);
        anchor.appendChild( textNode);
        return anchor.outerHTML;
    } // UDEcalc.linkTag()

    // linkJStag() in formula returns an <a onclick="js;">..</a> sequence
   /**
    * Return an &lt:a&gt; (link) tag with onclick attribute in formula
    * @param {string} js onclick code
    * @param {string} alt ALT and TITLE of image
    * @param {string} text HTML inside link
    * @return {string} The &lt:a onclick=""&gt; tag
    * @api {formula} linkJStag(js,alt,text) Get an <a> tag with onclick attribute
    * @apiParam {string} js onclick code
    * @apiParam {string} alt ALT and TITLE of image
    * @apiParam {string} text HTML inside link
    * @apiSuccess {string} return The &lt:a onclick=""&gt; tag
    * @apiGroup Text or HTML
    *    
    */ 
    linkJStag( js, alt, text)
    {
        // return anchor tag
        let anchor = document.createElement("a");
        anchor.href = "javascript:";
        //anchor.alt = alt;
        anchor.target = alt;
        if ( js && js!= "") anchor.setAttribute( 'onclick', js);
        else anchor.setAttribute( 'onclick', "alert('En cours de développement');"); // event.preventDefault();});
        anchor.setAttribute( 'contenteditable', "false");
        let textNode = document.createTextNode( text);
        anchor.appendChild( textNode);
        return anchor.outerHTML;
    } // UDE.linkJStag()
    
   /** 
    * @api {formula} checkboxTag(value,id,updateId,text) Get a <input type="checkbox"> tag
    * @apiParam {string} value Initial value
    * @apiParam {string} id Id of field
    * @apiParam {string} updateId Id of field to update
    * @apiParam {string} text Text to display
    * @apiSuccess {string} return The &lt;input&gt; tag
    * @apiGroup Text or HTML 
    */         
   /**
    * Return an &lt;input type="checkbox"&gt; tag in formula
    * @param {string} value Initial value
    * @param {string} id Id of field
    * @param {string} updateId Id of field to update
    * @param {string} text Text to display
    * @return {string} The &lt;input&gt; tag
    */
    checkboxTag( value, id="", updateId="", text="")
    {
        // Prepare onchange call
        let onchange = "";
        onchange += "if (this.checked) this.value='yes'; else this.value='no';";
        if ( updateId) onchange += "window.ud.ude.updateTable('"+updateId+"');"; // 2DO Improve might not be a table
        // Prepare checkbox tag
        let cbox = '<input id="'+id+'" type="checkbox" onchange="'+onchange+'"'; 
        if ( value || ( typeof value == "string" && value.toLowerCase() == "yes")) cbox += ' checked value="yes"';
        else cbox += 'value="no"';
        cbox += ' />'+text; // 2DO spacing
        // Return complete checkbox tag
        return cbox;
    } // checkboxTag()

   /** 
    * @api {formula} switchTag(bind,model,alt) Get a switch controled checkbox
    * @apiParam {string} variable Path to variable (domValue)
    * @apiParam {string} model For future use
    * @apiParam {string} alt Rollover text (future use)
    * @apiSuccess {string} return The HTML
    * @apiGroup Text or HTML
    */     
  /**
    * Return an switch-controled checkbox
    * @param {string} bind Path to variable (domValue) .. could be attr name
    * @param {string} model For future use
    * @param {string} alt Rollover text (future use)
    * @return {string} The &lt;input&gt; tag
    */
    switchTag( bind, switchClass="UDswitch", text="", id="myVal1") {
        let value = this.dom.domvalue.value( bind);
        let onOff = ( value == "on") ? "on" : "off";
        let cbox = "";
        cbox += '<span class="label">' + text + '</span>';
        cbox += '<span class="' + switchClass + '">';        
        cbox += '<input type="checkbox" id="'+id+'" value="'+value+'"';
        if ( value) { cbox += " checked";}
        cbox += ">";    
        cbox += '<label for="'+id+'" class="'+onOff+'" onclick="API.toggleSwitch(this);" ude_bind="'+bind+'">';
        cbox += '<span class="switch"></span>';
        cbox += '</label>';
        // Add styles if necessary
        let styles = this.eval( "classesByTag( 'span.' + switchClass);");
        if ( styles.indexOf( "ERR") > -1) { 
            let me = this;
            // !!! setTimeout( function() { me.switchTag( bind, switchClass, text);}, 500);
        } else if ( !styles) {
            let cssSelector = "span."+switchClass;
            styles = "";
            styles += cssSelector + "{ display:block; float:right;}\n";
            styles += cssSelector + " input { display:none;}\n";
            styles += cssSelector + " label { background-color :blue; position:relative; width:36px; height:20px; border-radius:20px;display:block;}\n";
            styles += cssSelector + " label.off { background-color :gray; position:relative; width:36px; height:20px; border-radius:20px;display:block;}\n";
            styles += cssSelector + " label.on span.switch { border-radius:50%; position:absolute; top:2px; left:18px; width:16px; height:16px; background:white;}\n";
            styles += cssSelector + " label.off span.switch { border-radius:50%; position:absolute; top:2px; left:1px; width:16px; height:16px; background:white;}\n"; 
            API.addStyleRules( styles);
        }
        // Return complete checkbox tag
        return cbox;
    } // switchTag()
    
   /** 
    * @api {formula} switchTagCallback(callback,event,model, alt) Get a switch controled checkbox
    * @apiParam {string} callback Function to call with event & clicked element as arguments
    * @apiParam {string} event Argument passed to callback with the click element
    * @apiParam {string} model For future use    
    * @apiParam {string} alt Rollover text (future use)
    * @apiSuccess {string} return The HTML
    * @apiGroup Text or HTML
    */     
  /**
    * Return an switch-controled checkbox
    * @param {string} variable Path to variable (domValue)
    * @param {string} event Argument passed to callback with the click element
    * @param {string} model For future use    
    * @param {string} alt Rollover text (future use)
    * @return {string} The &lt;input&gt; tag
    */
    switchTagCallback( callback, event, model="sw1", text="") {
        let cbox  = this.switchTag( "", "sw1", "alt");
        let oldClickStr = 'onclick=\"API.toggleSwitch(this);\"';
        let onclick = callback+"( '"+event+"', this);";
        let newClickStr = 'onclick=\"'+onclick+'\"';
        cbox = cbox.replace( oldClickStr, newClickStr);
        return cbox;
    } // UDEcalc.switchTagCallback()
    
    toggleSwitch( labelEl) {
        let inp = labelEl.previousSibling;
        let sw = labelEl.childNodes[ 0];
        let bind = this.dom.attr( labelEl, 'ude_bind');
        let cssVals = document.querySelector(':root'); 
        let onOff = ( this.dom.attr( inp, 'value') == "on") ? "off" : "on";
        inp.setAttribute( 'value', onOff);
        labelEl.className = onOff;
        let path = bind.split( '.');
        let bindedRoot = this.dom.element( path.shift());
        let event = { event:"setValue", type:"setValue", key:path, value:onOff};
        this.ude.dispatchEvent( event, bindedRoot);
        //this.calc.updateElement( editingElement);
        //cssVals.style.setProperty( '--'+inp.id, 'block' or none);             
    }
    
   /** 
    * @api {formula} selectorTag(options,id,updateId,text) Get a <select><option > tag
    * @apiParam {string[]} options List of options
    * @apiParam {string} id Id of field
    * @apiParam {string} updateId Id of field to update
    * @apiParam {string} text Text to display
    * @apiSuccess {string} return The &lt;input&gt; tag
    * @apiGroup Text or HTML 
    */         
   /**
    * Return an &lt;input type="checkbox"&gt; tag in formula
    * @param {string[]} options List of options
    * @param {string} id Id of field
    * @param {string} updateId Id of field to update
    * @param {string} text Text to display
    * @return {string} The &lt;input&gt; tag
    */
    selectorTag( options, id="", text="", onchange="")
    {
        let tag = "";
        tag += '<select';
        if ( id) tag += ' id="' + id +'"';
        // On change script
        if ( onchange) tag += ' onchange="'+onchange+'"';
        tag += '>';
        // Prompt as 1st option
        if ( text) tag += '<option value="">' + text + '</option>';
        // Add options
        for ( let opti=0; opti < options.length; opti++) {
            tag += '<option value="' + options[ opti] + '">' + options[ opti] + '</option>';
        }
        tag += '</select>';
        // Return complete tag
        return tag;
    } // selectorTag()

   /**
    * Return the value of a selected radio button
    * @param {mixed} elementOrId The element containing a set of radio buttons
    * @return {string} The value field of the selected element or null if not found
    */
    getSingleChoice( elementOrId) {
        let value = null;
        let element = this.dom.element( elementOrId);
        if ( !element) return null;
        let choices = this.dom.elements( 'input[ type="radio"]', element);
        if ( choices.length == 0) choices = this.dom.elements( 'option', element);
        for ( let choicei=0; choicei<choices.length; choicei++) {
            let choice = choices[ choicei];
            if ( choice.checked || choice.selected) {
                value = choice.value;
                break;
            }
        }
        return value;
    }

   /**
    * Return selected values of a set of checkboxes or select control as a CSV string 
    * @param {mixed} elementOrId The element containing a set of radio buttons
    * @return {string} The value field of the selected element or null if not found
    */
    getMultipleChoices( elementOrId) {
        let value = [];
        let element = this.dom.element( elementOrId);
        if ( !element) return null;
        if ( this.dom.attr( element, 'exTag') == "fieldset") {
            let choices = this.dom.elements( 'input[ type="checkbox"]', element);
            if ( choices.length == 0) choices = this.dom.elements( 'option', element);
            for ( let choicei=0; choicei<choices.length; choicei++) {
                let choice = choices[ choicei];
                if ( choice.checked || choice.selected) {
                    value.push( choice.value);
                }
            }
        }    
        return value.join( ',');
    }
    


   /**
    * @api {formula}metricTag( type, id, value, params) Return a mini SVG graph display of a value
    * @apiParam {string} type type of display
    * @apiParam {string} id Id of field
    * @apiParam {number} value value to display
    * @apiParam {Array.number} param parameters for red zones, green zones etc
    * @apiSuccess {string} The &lt;input&gt; tag
    * @apiGroup HTML
    */
    metricTag( type, id, value, params)
    {
        let tag = "";
        // Get parameters
        let max = params[0];
        let holderId = params[ 1];
        let caption = params[ 2]; // Always units ?
        // Get width of parent
        let holder = this.dom.elementByName( holderId);
        let width = holder.clientWidth - 40;// ul padding !!!Might not be visible, clientWidth will be 0 
        // Calculate position
        value = Math.min( value, max * 1.3);
        let posX = Math.round(100*value/( max * 1.3)); // 2DO handle max as target
        let points = [ (posX-2),0,(posX+2), 0, posX, 80];
        let pointsStr = points.join( ",");
        //let section2 = 100 - section1;
        // 2DO Better type => HTML code with substitution, can be fetched from resource
        if ( type == "value versus target") {
            // Temp define style here
            /*let rules = "span.counter{ width:200px; height:60px; font-size:4em; font-family:led-digital-7;color:rgb(10,250,25); background-color:black; display:block; text-align:center; margin:0 auto 5px;}"
            let style = document.createElement("style");
            style.appendChild(document.createTextNode( rules));
            // Add the <style> element to the page
            document.head.appendChild(style);*/
            // Display value
            tag += '<span class="counter">'+value+' '+caption+'</span>';
        }
        if ( ["value versus target", "progress", "limit"].indexOf( type) > -1){
            // Display progress gauge
            let className = "progressmetric"; // type+'metric'; !!! Attention spaces
            tag += '<svg';
            if ( id) tag += ' id="' + id + '"';
            tag += ' viewBox="0 0 100 100" preserveaspectratio="none"'
            tag += ' class="'+className+'" width="'+width+'"';
            tag += '>'; 
            tag += '<rect class="back low" width="33%" height="100%" y="3" />';
            tag += '<rect class="back medium" width="33%" height="100%" x="33" y="3" />';
            tag += '<rect class="back high" width="33%" height="100%" x="66" y="3" />';
            tag += '<polygon class="cursor" points="'+pointsStr+'" />';
            tag += '</svg>';
            if ( caption) tag += '<span class="gaugecaption">'+caption+'</span>';
        }
        // 2DO substitute values
        // Return complete tag
        return tag;
    } // metricTag()

    
    
   /**
    * Compute formulae (=expression) in an object or JSON string
    * @param {mixed} json Object or JSON representation
    * @return {mixed} Object with formula resolved or JSON reprsentation
    * @api {formula} multiCalc(json) Resolve formulae in a JSON string
    * @apiParam {mixed} json Object or JSON representation
    * @apiSuccess {mixed} return Object with formula resolved or JSON reprsentation
    * @apiGroup Data
    *    
    */ 
    multiCalc( json) {
        // 2DO this.updateElement
        let obj = null;
        if ( typeof json == "string") obj = this.dom.udjson.parse( json); else obj = this.dom.udjson.parse( JSON.stringify( json));
        if ( !obj) { return debug( { level:2, return:null}, "Multicalc, no JSON", json);}
        for (let key in obj)
        {
            let val = obj[ key];
            if ( typeof val == "object") val = this.multiCalc( val);
            else if ( typeof val == "string" && val.charAt( 0) == "=") val = this.exec( val.substr( 1));
            obj[ key] = val;
        }
        if ( typeof json == "string") return JSON.stringify( obj);
        return obj;
    } // UDEcalc.multiCalc()

   /**
    * Remove formulae from an element's children or fix values
    * @param {mixed} elementOrId HTML element or its id
    * @return {mixed} HTML element with formulae removed
    * @api {formula} substituteFormulaeInElement(elementOrId) Remove formulae from an element
    * @apiParam {mixed} elementOrId HTML element or its id
    * @apiSuccess {mixed} return HTML element without formulae in children
    * @apiGroup Elements
    *    
    */ 
    substituteFormulaeInElement( elementOrId) {
        // 2DO this.updateElement
        let element = this.dom.eleent( elementOrId);
        if ( !element) return;
        let html = "";
        let children = element.childNodes;
        for (let childi = 0; childi < children.length; childi++)
        {            
            let child = children[ childi];
            if ( child.nodeType == 3) html += child.textContent;
            else
            {   
                let formula = this.dom.attr( child, "ude_formula");
                let type = this.dom.attr( child, "ud_type");
                if ( formula) child.innerHTML = this.exec( formula, child); 
                this.dom.attr( child, "ude_formula", "__CLEAR__");                
                if ( type == "field") html += child.innerHTML;
                else html += child.outerHTML;
            }    
        }
        element.innerHTML = html;
        return element;
    } // UDEcalc.substituteFormulaeInElement()
    
   /**
    * text2HTML()   couldbe editable2HTML
    *   @param sourceId
    *   @return html
    */
    textContent2HTML( sourceId)
    {
        // Get HTML in edit form
        let container = this.dom.element( sourceId);
        if ( !container) {
            container = this.dom.element( sourceId+"_object");
        }
        if ( !container) return "";
        let lines = [];
        let htmledit = "";
        htmledit = container.textContent;
        let json = API.json.parse( htmledit);
        if ( json && API.json.value( json, 'meta')) {
            // JSON100 format
            lines = API.json.valueByPath( json, 'data/edit/value/value');
        } else {
            // Remove {edit} used by HTML element (will evolve)
            htmledit = htmledit.replace( '{edit}', '');
            // Build html for display
            lines = htmledit.split( "\n");
        }    
        // Remove 1st line
        let firstLine = lines.shift().trim().toLowerCase();
        let txt = "";
        if ( ["linetext", "css", "js", "json", "html"].indexOf( firstLine) == -1) {
            txt += firstLine = "\n";
        } 
        if (firstLine != "html") { txt += lines.join("\n");}
        else {
            // Concatene editable content without \n except for style and script sections and substitue empty lines with break
            let scriptOrStyle = false;
            for (let linei in lines) {
                let line = lines[ linei].trim();
                // Remove escaped quotes
                line = line.replace( /\\\"/g, '"');
                // Detect style and script open and close tags to add \n for lines inside these tags
                if ( line.indexOf( '<style') > -1 || line.indexOf( '<style') > -1) scriptOrStyle = true;
                else if ( line.indexOf( '</style') > -1 || line.indexOf( '</style') > -1) scriptOrStyle = false;
                // Handle lines according to wether they are styles or script or not
                if ( scriptOrStyle) line +="\n";
                else if ( !line) { line="<br />";}
                txt += line;
            }
        }
        // Set editable content as innerHTML of temporary textarea
        let area = document.createElement( 'textarea');
        area.innerHTML = txt.replace( /\n/g, '').replace(/\r/g, '');
        // HTML equivalent is textarea's value
        let html = area.value;
        // Return HTML
        return html;
    } // UDEcalc.text2HTML()
    
   /**
    * HTML2editable()   
    *   @param html
    *   @return html
    */
    HTML2editable( html)
    {
        // Convert HTML to editable text using textarea element
        let area = document.createElement( 'textarea');
        area.textContent = html;
        let htmledit = area.innerHTML;
        htmledit = htmledit.replace( /</g, "\n<");
        // 2DO place in target if provided        
        // Return editable
        return htmledit;
    } // UDEcalc.text2HTML()
    
  /**
    * Substitute into a string using {key} format 
    * @param {string} original Original text or HTML
    * @param {object} values Named list of values to substitute
    * @return {string} String with substitutions  
    * @api {formula} substitute(elementOrId) Remove formulae from an element
    * @apiParam {string} original Original text or HTML
    * @apiParam {object} values Named list of values to substitute
    * @apiSuccess {string} return String with substitutions
    * @apiGroup Text or HTML
    *    
    */ 
    substitute( original, values) {
        let r = original;
        for ( var key in values)
        {
            let expr = new RegExp( "\{"+key+"\}", 'g');
            r = r.replace( expr, values[ key]);
        }
        return r;
    } // UDEcalc.substitute()

   /**
    * buildComposite() OBSOLETE
    *   @param name
    *   @param content
    *   @return HTML of composite element
    */
    buildComposite( name, type, content)
    {
        let cleanName = name.replace(/ /g, '_').replace(/'/g,'_').replace(/"/g, '');
        // Process according to type
        if ( type == "html") content = this.HTML2editable( content);
        // Prepare data for HTML
        let caption = name;
        let data = content;
        if ( typeof content.caption != "undefined")
        {
            caption = content.caption;
            data = content.data;
        }
        // Build element's HTML
        let shtml = "";
        shtml += '<span class="caption">'+caption+'<span class="objectName">'+cleanName+'</span></span>';
        shtml += '<div id="'+cleanName+'" class="'+type+'object hidden" ude_editZone="'+cleanName+'editZone"';
        shtml += '>'+data+'</div>';
        return shtml;
    } // UDEcalc.buildComposite()
    
   /**
    * buildJSONlist()
    *   @param name
    *   @param content
    *   @return HTML of composite element
    */
    buildJSONlist( name, mime, content)
    {
        let cleanName = name.replace(/ /g, '_').replace(/'/g,'_').replace(/"/g, '');
        if ( mime != "text/plain") return "ERR: MIME type not processed yet"+mime;
        if ( !content) return {};
        let items = content.split('\n');
        // Build JSON list
        let jsonList = { _list:{ _id:name, _classList: "listScroll1"}};
        for ( let itemi = 0; itemi < items.length; itemi++)
        {
            let content = items[ itemi];
            let prevItemi = items.indexOf( content);
            if ( prevItemi > -1 &&  prevItemi < itemi) continue;
            let itemData = { value: content};
            jsonList[ 'i'+(itemi+1)] = itemData;
        }
        return JSON.stringify( jsonList);
    } // UDEcalc.buildJSONlist()
    
   /**
    * @api {JS} checkValue(checkExpr,value) true if value passes
    * @apiparam {string} checkFct The function to use for checking
    * @apiparam {string} value The text representation of the value to check
    * @apiSuccess {boolean} True if value passes
    * @apiGroup Data
    */
   /**
    * Check a value
    * @param {string} checkExpr The function to use for checking
    * @param {string} value The text representation of the value to check
    * @return {boolean} True if value passes
    */
    checkValue( checkExpr, value) {
        // Insert value after 1st (
        let expr = "";
        if ( typeof( value) == "string") { expr = checkExpr.replace( /\(/, "('"+value+"',");}
        else if ( typeof( value) == "number") {  expr = checkExpr.replace( /\(/, "("+value+",");}
        return this.eval( expr);
    } // UDEcalc.checkValue()
   
   /**
    * @api {JS} inList(value,val1,val2,val3) true if value is val1,val2 or val3
    * @apiparam {mixed} value Value to check
    * @apiparam {mixed} arguments List of allowed values
    * @apiSuccess {boolean} True if value found
    * @apiGroup Data    
    */    
    inList() {
        let args = Array.from( arguments);
        let value = args.shift();
        if ( args.length == 1) {
            // Only one item in list, check if not a reference to a list 2DO or table
            let candidate = this.dom.element( args[0]);
            if ( candidate && candidate.tagName == "UL") {
                args = API.getItems( candidate.id);
            }
        }
        return ( args.indexOf( value) != -1);
    } // UDEcalc.inList()

   /**
    * @api {JS} inBetween(value,min,max) true if value in between min and max
    * @apiparam {number} value Numbe to check
    * @apiparam {number} min Lower boundary
    * @apiparam {number} max Higher boundary   
    * @apiSuccess {boolean} True if value passes
    * @apiGroup Data
    */
    inBetween( value, min, max) {
        let nvalue = parseFloat( value);
        let pass = false;
        if ( !isNaN( nvalue)) { 
            let lower = parseFloat( min);
            let higher = parseFloat( max);
            if ( isNaN( lower) || isNaN( higher)) {
                debug( {level:2}, "Between not a number", min, max);
                pass = true;
            } else { pass = ( nvalue >= lower && nvalue <= higher);}
        }        
        return pass;
    } // UDEcalc.inList()
    
   /**
    * Number of terms in formula
    * @param {string} formula The formula
    * @return {integer} Count of terms in formula
    */
    countTermsInFormula( formula) {
        if ( !formula) return 0;
        this.prepareForExec( formula);
        return this.termCount;
    } // UDEcalc.countTermsInFormula()

   /**
    * @api {Formula} listNames(list)
    * @apiParam {object} list The list
    * @apiSuccess {string[]} Array of names in list
    * @apiGroup Formulas
    */
   /**
    * Return names in list
    * @param {object} list The list
    * @return {string[]} Array of names in list
    */
    listNames( list) { return Object.keys( list);}

    /**
    * @api {Formula} listValues(list)
    * @apiParam {object} list The list
    * @apiSuccess {string[]} Array of names in list
    * @apiGroup Formulas
    */
   /**
    * Return values in list
    * @param {object} list The list
    * @return {string[]} Array of names in list
    */
    listValues( list) { return Object.values( list);}
    
    /**
    * @api {Formula} item(data,index)
    * @apiParam {object} data An array or object
    * @apiParam {mixed} index Index simple or list to a member of data
    * @apiSuccess {string} The item in data
    * @apiGroup Formulas
    */
   /**
    * Return values in list
    * @param {object} data An array or object
    * @apiParam {mixed} index Index simple or list to a member of data
    * @return {string} The item in data indexed
    */
    item( data, index) {
        let r = "";
        if ( Array.isArray( data) && !isNaN( index)) {
            r = data[ index - 1];
            if ( typeof r != "object") { return r;}
            // 2DO use recursive call and get new index
        }
    }
   
   /**
    * @api {Formula} formatList(list,sep,format)
    * @apiParam {object} list The list
    * @apiParam {string} sep The seperator to place between name and value
    * @apiParam {string} format The format string for each value
    * @apiSuccess {string} The formatted list as a string
    * @apiGroup Formulas
    */
   /**
    * Format a list as a string
    * @param {object} list The list
    * @return {string[]} Array of names in list
    */
    formatList( list, sep, format) { 
        let r = "";
        for ( let key in list) {
            let v = r[ key];
            if ( !isNaN( v)) { 
                let f = format.split( ' ');
                switch ( f[0]) {
                    case "money" :
                        r += '"' + key + '":' + new Intl.NumberFormat( lang, { style: 'currency', currency: f[ 1]}).format( value) + ', ';
                        break;
                    default :
                        r += '"' + key + '":' + new Intl.NumberFormat( lang, { style: 'decimal', maximumSignificantDigits: f[ 1]}).format( value) + ', ';
                        break;
                }        
            } else { r += '"' + key + '":"' + v + '", ';}
        }
        return r.substr( 0, r.length - 2);
    } // UDEcalc.formatList()

   /**
    * @api {Formula} formatList(list,sep,format)
    * @apiParam {object} list The list
    * @apiParam {string} sep The seperator to place between name and value
    * @apiParam {string} format The format string for each value
    * @apiSuccess {string} The formatted list as a string
    * @apiGroup Formulas
    */
   /**
    * Remove accents and lower case a text string
    * @text {string} text Inital text
    * @return {string} Text in lowercase with no accents
    * @api {Formula} removeAccentsAndLower(text)
    * @apiParam {string} text Initial text
    * @apiSuccess {string} Text without accents
    * @apiGroup Formulas
    */
    removeAccentsAndLower( text) { 
        let r=text.trim().toLowerCase();
        r = r.replace(new RegExp(/\s/g),"");
        r = r.replace(new RegExp(/[àáâãäå]/g),"a");
        r = r.replace(new RegExp(/æ/g),"ae");
        r = r.replace(new RegExp(/ç/g),"c");
        r = r.replace(new RegExp(/[èéêë]/g),"e");
        r = r.replace(new RegExp(/[ìíîï]/g),"i");
        r = r.replace(new RegExp(/ñ/g),"n");                
        r = r.replace(new RegExp(/[òóôõö]/g),"o");
        r = r.replace(new RegExp(/œ/g),"oe");
        r = r.replace(new RegExp(/[ùúûü]/g),"u");
        r = r.replace(new RegExp(/[ýÿ]/g),"y");
        r = r.replace(new RegExp(/\W/g),"");
        return r;
    }
    trim( text, ignore="_") {
        let ignoreRegex = newRegExp( "/"+ignore+"/", "g");
        return text.replace( ignoreRegex, '').trim();
    }
    uppercase (text) { if ( text) return text.toUpperCase(); else return "";}
    titlecase(str) {
        if (!str) return "";
        return str.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }
    
    orop() {
        let r = false;
        for ( let argi=0; argi < arguments.length; argi++) {
           r |= arguments[ argi];
        } 
        return r;
    }
    oneOf( value) { 
        let l = [];
        for ( let argi=1; argi < arguments.length; argi++) {
           l.push( arguments[ argi]);
        }
        return ( l.indexOf( value) > -1);
    }
    defaultValue( value, def) { if ( value === "") return def; else return value;}
    
   /**
    * Get keys form a JSON value stored in a holder
    */    
    jsonKeys( holderIdOrJSON) {
        let json = API.json.parse( holderIdOrJSON);
        if ( json) return Object.keys( json); else return [];
        
    }
    
  /**
    * get resource
    */
    api( apiFct, arg1, arg2) {
        // 2DO need a jsonfct API call)
        if ( [ 'valueByPath'].indexOf( apiFct) > -1) {
            return API.json.valueByPath(arg1, arg2);
        } else return API[ apiFct]( arg1, arg2);
    }    
    
   /**
    * @api {Formula} isName(text) Return true if text can be a name
    * @apiParam {string} text The character or completed text to validate
    * @apiSuccess {boolean} True if character or text accepted
    * @apiGroup Formulas
    */
    isName( text) {
        if ( text.length == 1) {
            // Check 1 character for editor
            return (/^[a-zA-Z\u00C0-\u017F 0-9\-]$/.test(text)) ? text : "";
        } else {
            // Check a completed name
            return (/^[a-zA-Z\u00C0-\u017F 0-9\-]+$/.test(text)) ? text : "";
        }
    } // UDEcalc.isName()

   /**
    * @api {Formula} isDate(text) Return true if text can be a date or part of a date
    * @apiParam {string} text A single character or the completed text to validate
    * @apiSuccess {boolean} True if character or text accepted
    * @apiGroup Formulas
    */
    isDate( text, formatIn="DD/MM/YY", formatOut="DD/MM/YYYY") {
        if ( text.length == 1) {
            // Check 1 character for editor
            return /^[0-9\/]$/.test(text);
        } else {
            // Check a completed date
            return this.datestr( text, formatIn, formatOut);            
        }
    } // UDEcalc.isDate()
  
   /**
    * @api {Formula} array(val1,val2) Return an array with provided values
    * @apiParam {mixed} val A value
    * @apiSuccess {mixed} The array
    * @apiGroup Formulas
    */
    array() {
        let r = [];
        for (var i = 0; i < arguments.length; i++) {
            r.push(arguments[i]);
        }
        return r;
    } // UDEcalc.array()
    
   /**
    * @api {Formula} content(elementIdOrName) Return element's HTML with modified ids
    * @apiParam {string} elementIdOrName Element to grab
    * @apiSuccess {string} HTML
    * @apiGroup Formulas
    */
    content( elementIdOrName) {
        let element = this.dom.element( elementIdOrName);
        if ( !element) element = this.dom.elementByName( elementIdOrName);
        if ( !element) return "";
        let content = element.outerHTML;
        let unique = "U"+this.ude.ticks;
        content = content.replace( /id="/g, 'id="'+unique).replace( /name="/g, 'name="'+unique);
        return content;
    }  
   /**
    * @api {Formula} uround(numberOrArray,decimals) Return rounded values
    * @apiParam {mixed} numberOrArray Element to grab
    * @apiParams {integer} decimals Number of decimals
    * @apiSuccess {mixed} numberOrArray with all values rounded
    * @apiGroup Formulas
    */
    uround( numberOrArray, decimals=0) {
        if ( !Array.isArray( numberOrArray)) {
            let number = numberOrArray;
            // IDEA if string tokenise and round all values
            if ( isNaN( number)) return number;
            if ( typeof number == "string") number = parseFloat( number);
            // IDEA if decimals < 0 divide by 100, 1000 etc
            if ( !decimals) number = Math.round( number);
            else number = Math.round( number * 10 ** decimals ) / ( 10 ** decimals);
            return number;
        }
        let w = numberOrArray;
        for ( let i=0; i < w.length; i++) {
            w[ i] = this.uround( w[ i], decimals);
        }
        return w;
    } // =uround()
    
   /**
    * @api {Formula} value(elementid, index1, index2) Return a value (useful when dynamic expression needed)
    * @apiParam {string} elementid Element where value is stored
    * @apiParams {mixed} index1 Index 1 inside element (li ou tr index), default ""
    * @apiParams {mixed} index2 Index 2 inside element (td), default ""
    * @apiSuccess {mixed} numberOrArray Value found in element
    * @apiGroup Formulas
    */
    value( elementId, index1="", index2="") {
        let r = this.dom.value(elementId+'.'+index1+'.'+index2);
        if ( !isNaN( r)) {
            let f = parseFloat( r);
            let i = parseInt( r); 
            return ( f == i) ? i : f;
        }
        return r;
    } // =value()

   /**
    * @api {Formula} textReplace(search,replace,source) Return a source with search replaced by replace
    * @apiParam {string} search String to search
    * @apiParams {string replace String to replace search
    * @apiParams {string} source String to operate on
    * @apiSuccess {string} Modified string
    * @apiGroup Formulas
    */
    textReplace( search, replace, source) { return source.replace( search, replace);}

  /**
    * @api {Formula} attrPath(elementOrId,attr) Returns path to an element's attribute
    * @apiParam {mixed} elementOrId The id of an element
    * @apiParams {string attr Name of an atribue
    * @apiSuccess {string} Value path to attribute ( id...attr)
    * @apiGroup Formulas
    */
    attrPath( selector, attr) { 
        let element = doOnload( "$$$.dom.element(" + selector + ");");
        if ( !element) { console.log( selector); return "";}
        if ( !element.id) {
            if ( this.dom.attr( element, 'name')) {
                element.id = this.dom.attr( element, 'name');
            } else {
                element.id = $$$.getName( element, true);
                this.dom.attr( element, 'name', element.id);
            }
        }    
        return element.id + "..." + attr;
    }
    
} // class js UDEcalc

// Auto-test 
if ( typeof process == 'object')
{
    // Testing under node.js
    module.exports = { UDEcalc: UDEcalc};
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined") {
        console.log( 'Syntax : OK');
        const envMod = require( '../tests/testenv.js');
        // console.log( envMod);
        requirejs = envMod.require;
        envMod.load();        
        if ( typeof window == "object") window.UDEcalc = UDEcalc; 
        else window = {};    
        // console.log( 'Creating UDEcalc');  // use debug   
        let calc = new UDEcalc( null, null);
        var DOM_lastAccessedValues;
        DEBUG_level = 6;   // >5 for checksum
        let r;
        let test = "";
        // Test 1
        if ( ( r = calc.exec( "'test'", null)) == "test") console.log ("Test1 : OK");
        else console.log( "Test1 : KO "+r);
        // Test 2
        if ( ( r = calc.exec( "(20+5)*2-3*(7+5)", null)) == ((20+5)*2-3*(7+5))) console.log ("Test2 : OK");
        else console.log( "Test2 : KO "+r);
        // Test 3
        if ( ( r = calc.exec( "json('{\"val1\":10}', 'val1')", null)) == 10) console.log ("Test3 : OK");
        else console.log( "Test3 : KO"); 
        test = "4 checkValue/inList";
        testResult( test, calc.checkValue( "inList( 'abc','def','ghi')", "abc"));
        test = "5 checkValue/inBetween";
        testResult( test, calc.checkValue( "inBetween( 100,200)", 150));
        {
            test = "6 formatList";
            let list = { Labradors:50, Hounds:20, Retrievers: 56}; 
            testResult( test, calc.formatList( list, "=", "").indexOf( 'Retrievers') > -1);
        }
        {
            test = "7 listName, list Values";
            let list = { Labradors:50, Hounds:20, Retrievers: 56}; 
            testResult( test, calc.listNames( list).length == calc.listValues( list).length && calc.listNames( list).length == 3);
        }
        {
            test = "8 uround";
            let w = [ 12.235466, "abc", 55, 623.3333333];
            let r = calc.uround( w, 2);
            testResult( test, w[0] == 12.24, r);
        }
        {
            test = "9 datestr";     
            let expr = "demain";    
            let r = calc.datestr( expr);
            console.log( expr, r);
            testResult( test, r.indexOf( '20') > -1, r);
        }
        {
            test = "10 datestr";     
            let expr = "+3j";  // after 'demain' so 4 days from today        
            let r = calc.datestr( expr);
            console.log( expr, r);
            testResult( test, r.indexOf( '20') > -1, r);
        }
        {
            test = "11 datestr working with week of year";     
            let expr = "semaine 21";       
            let r = calc.datestr( expr);
            let r2 = calc.datestr( 'Marpr 10h30','',"YYYY-MM-DDTHH:mm:00");
            // console.log( expr, r, r2);
            let r3 = calc.datestr( 'jEnpr 10h30','',"YYYY-MM-DDTHH:mm:00");
            testResult( test, (r2  && r2.indexOf( '05') > -1 &&  !r3), r2 + ' ' + r3);
        }
        {
            test = "12 datestr with full date";     
            let expr = "24/05/2024 10h15";       
            let r = calc.datestr( expr, '',"YYYY-MM-DDTHH:mm:00");
            testResult( test, r.indexOf( '05') > -1, r);
        }
        {
            test = "13 datestr with just time";     
            let expr = "10h15";       
            let r = calc.datestr( expr, '',"YYYY-MM-DDTHH:mm:00");
            testResult( test, r.indexOf( '10:15') > -1, r);
        }
        console.log( "Program's trace checksum: "+debug( "__CHECKSUM__"));    
        console.log( 'Test completed');
    }    
} // Auto-test
