
/**
 * see with calc for lastAssessedValues & autohome
 * using cursor dom.cursor
 */

// const { ExitStatus } = require("typescript");


class DOMvalue {
   /**
    * @property {object} parent Object that initiated DOMvalue object
    * @property {array.string}  appAttributes Array of attributes to be read with dom.attr
    * @property {integer} defaults.autoreloadTicks Maximum nb of ticks before page refresh (0 = inactive)   
    * @property {integer} defaults.idleTicks Idle status after this many ticks without event(600)  
    * property {integer}    
    * property {integer}    
    * property {integer}
    */
  parent = null;
  dom;
  empty;
  useFirstCharAsType = true;
  
  constructor( dom) {
      this.dom = dom;
      this.cursor = dom.cursor;
      this.lowerCaseAttr = UD_lowerCaseAttr;
      this.indexableTags = UD_indexableTags;
      this.empty = document.createElement( 'p');
      this.empty.textContent = "";
  }
 // Retrieve or set a value in the DOM tree
 // Full path : elementId.index1.index2.attribute
 // Incomplete paths : colIndex  
 //                    colIndex.attribute
 // default elementId = autoHome or element where cursor is
 // default index1 = autoIndex1 or row/ul where cursor is
 // default index2 (2 dim element) = col where cursor is. if string then indexed against row names
  /**
    * Read a value from inside the DOM, used by the DOM caclulator (UDEcalc)
    * @param {string} path A path to the value with format: element.[index1.][index2.][attribute]
    * @param {mixed} value Value to write, deprecated
    * @return {HTMLelement} element An TML element to use as first path element
    * @api {JS} API.dom.value(path) Read a value from DOM
    * @apiParam {string} path A path to the value with format: element.[index1.][index2.][attribute]
    * @apiSuccess {Array.HTMLelement} return An array of HTML elements or null if not found
    * @apiGroup DOM
    */
    value( path, value=null, element = null) {
        /*var err = Error("Test");
        console.log( err.stack);*/
        if ( typeof path == "string") path = path.split('.');
        // Adjust according to nb of elements in path
        switch (path.length) {
          case 1:
            // Single element = index 2 on current element
            path[2] = path[0];
            path[1] = path[0] = "";
            /*
            path[3] = path[0];
            path[2] = path[1] = path[0] = "";*/
            break;      
          case 2:
            // 2 elements = ??
            path[2] = path[1];
            path[1] = path[0];
            path[0] = "";
           /*
            path[3] = path[1];
            path[2] = path[0];
            path[1] = path[0] = "";
            */
          case 3:
           // 3 elements = ??
        
        }
        // Decide wether firts character of index2 designates value type
        this.useFirstCharAsType = true;
        if ( path[2].substring( 0, 1) == "!") { 
            this.useFirstCharAsType = false;
            path[2] = path[2].substring(1);
        }
        
        let target;
        if( element) target = element;
        else {
            // Find DOM element
            target = this.findElement( path[0]);
            if (!target) { debug( {level:8}, "can't find", path[0]); return null;}
        }
        let saveable = this.dom.getSaveableParent( target);
        let exTag = this.dom.attr( saveable, 'exTag');
        if ( [ "div.json", "div.connector"].indexOf( exTag) > -1) {
            // Access a JSON set of values
            let dataHolder = saveable.getElementsByTagName( 'div')[0];
            let jsonStr = dataHolder.textContent;
            let jsonPath = path[1];
            if ( path[2]) { jsonPath += "/"+path[2];}
            if ( jsonStr.indexOf ( '"meta":') > -1) { jsonPath = "data/value/"+jsonPath;}
            let val = this.dom.udjson.valueByPath( jsonStr, jsonPath, value);
            if ( val) {
                DOM_lastAccessedValues.push( target);
                return val;
            }
        }
    
        // Look for child element if indexes provided 
        if ( path[1] || path[2]) target = this.findChild( target, path[1], path[2]);
        if (!target) { debug( {level:8}, "can't find child (path)", path); return "N/A";}

        // 2DO if target is Array, loop for each and return array
        // Find attribute
        let attrName = path[3];
        if ( !attrName || attrName == "")
        {
          if ( target) attrName = "innerHTML"; 
          else return "N/A";
        }
        
        // Log element for dependency management (2DO find a more elegant solution)
        this.dom.lastAccessedElement = target;
        // 2DO All cases of writing value
        if (attrName == "textContent" || attrName == "innerHTML" ) {
            DOM_lastAccessedValues.push( target);
            if ( value) {
                // WRIT ECONTENT directly
                target[ attrName] = value;
                return value;
            }
        }
        // Get value
        if ( path[2] == "all" && typeof target == "object")
        {
           // use recusivity for "all" requests
           value = "";
           for ( let targi=0; targi<target.length; targi++) value += this.value( "..."+attrName, null, target[ targi])+",";
           value = value.substring(0, value.length-1).split(',');
        }
        else if ( attrName.indexOf('css_') == 0)
        {
          // CSS value
          if (value) target.style[attrName.substr(4)] = value;
          else value = target.style[attrName.substr(4)];
        }
        else if ( UD_appAttributes.indexOf( attrName.toLowerCase()) > -1) {
          // Attribute
          if ( value) this.dom.attr( target, attrName, value);
          else 
          {
            value = this.dom.attr( target, attrName);
            if (attrName == '_type') value = value+target.textContent;
            if (!value || value == "") value = this.dom.parentAttr( target, attrName);
            /* replace with parentAttr call 18/01/2021
            {
              // Look for attribute in parent mode
              let w = target.parentNode;
              let safe = 5;
              while ( w && !w.getAttribute(attrName) && w.parentNode && --safe) w = w.parentNode;
              if (w) value = w.getAttribute( attrName);
              if ( !value) value = "";
              this.dom.lastAccessedElement = w;
            }
            */
          }
        }
        else if (attrName == "_element")
        {
          // Pointer to the element itself  
          value = target;
        }
        /*else if (attrName == "_rowIndex")
        {
        }*/
        else if (attrName == "length")
        {
          // Element's length  
          value = target.length;
        }
        else
        {
            // HTML attribute  
            value = target[attrName];
            // Allow reading parent for values other than text or HTML content
            if ( (!value || value == "") && attrName != 'textContent' && attrName != 'innerHTML') 
                value = this.dom.parentAttr( target, attrName);
            /* Not needed 18/01/2021
            {
                // Look for attribute in parent mode
                let w = target.parentNode;
                let safe = 5;
                while ( !w[attrName] && w.parentNode && --safe) w = w.parentNode;
                value = w[attrName];
            }
            */
            if ( !value) value = "";
        }
        
        // Set typeof value
        if ( this.lowerCaseAttr.indexOf( attrName) > -1) value = value.toLowerCase();
        else if ( (attrName == "textContent" || attrName == "innerHTML") && path[2] != "")
        {
            // Patch to process LINKS fieldname syntax and A1, B1 cells
            if ( path[2].substr( 0, 1).toLowerCase() == path[2].substr( 0,1) && this.useFirstCharAsType)
            {
                // Starts with small letter assume type indicator
                switch ( path[2].substr(0,1))
                {
                    case 'i':
                        if ( value=="") value = 0; else value = parseInt( value);
                        break;
                    case 'f':
                        if ( value=="") value = 0.0; else value = parseFloat( value);
                        break
                }
            }
            else /*if ( path[2].length < 3 && path[2].toUpperCase() == path[2])*/
            {
                // Capital letter(s) means value type is variable
                if ( value && value != "" && !isNaN( value)) {
                    // Convert to number if string represents a number
                    if ( parseFloat( value) == parseInt( value)) value = parseInt( value);
                    else value = parseFloat( value);
                }
            }
        }    
        if ( path.length == 5) 
          value = '<span class="'+path[4]+'">'+value+'</span>';
        if ( value == null) value = "N/A";  
        debug( {level:3}, path, this.dom.autoIndex1, element, value);  
        return value;
    } // DOMvalue.value()  
  
  // Find an HTML element in DOM
 findElement( id)
 {
   var target = null;
   if ( !id || id == "") 
   {
     // No id provided use autoHome or cursor as current element
     if (this.dom.autoHome) current = this.dom.autoHome;
     else
     {
       // Use cursor   
       if (!this.cursor.HTMLelement) this.cursor.fetch();
       if (!this.cursor.HTMLelement) return debug( {level:2, returnValue:null}, "cursor not set");
       var current = this.cursor.HTMLelement;
     }
     // Then put current on parent element or linked visible corresponding to type
     switch ( current.tagName.toLowerCase())
     {
        case "ul":
        case "span" :
            break;
        case "td":
            current = current.parentNode.parentNode.parentNode; // TABLE
            if ( current.tagName != "TABLE") return debug( {level:2, returnValue:null}, "No TABLE containing TD");
            break;
        case "div":
     }
     // Then look for a datasrc attribute in element or its parents
     var w = current;
     var safe = 5;
     while ( !this.dom.attr( w, 'ude_datasrc') && --safe) w = w.parentNode;
     if ( this.dom.attr( w, 'ude_datasrc')) target = document.getElementById( this.dom.attr( w, 'ude_datasrc'));   
     else target = current;
    }  
    else
    {
       target = document.getElementById( id);
       // If not found try substituting spaces for _ as used by composite objects
       if ( !target) target = document.getElementById( id.replace( / /g, '_'));
       if ( !target) target = this.dom.elementByName( id); // test 220912 for formulas targeting simple elements
    }
    if (!target) return debug( {level:8, returnValue:null}, id +" not found in DOM");
    // Target may be a JSON object, in this case use visible element in editZone
    if ( this.dom.attr( target, 'ud_type').indexOf( 'Object') > -1 || this.dom.attr( target, 'computed_display') == "none")
    {
        // Alternative would be to switch on target's parents ud_type and look for id+editabletable (ex)
        let visible = target.parentNode.nextSibling;
        if ( this.dom.attr( visible, 'ude_bind') == target.id)
        {
            // OK This points to the element so it contans what we want
            if ( visible.childNodes[0].tagName == "TABLE") target = visible.childNodes[0];
            // 2DO other cases
        }
    }
    return target;
 } // DOMvalue.findElement()
 
 // Find a child element of an HTML element in DOM
 findChild( parent, index1, index2) {
    let target = parent;
    // 1st index
    if ( index1 == "" || index1.indexOf("auto") == 0) {
       // Computing index as position in parent
       let ext = index1.substr(4);
       if ( this.dom.autoIndex1 > 0) index1 = this.dom.autoIndex1;
       else {
         let current;
         if ( this.dom.autoHome) current = this.dom.autoHome;
         else current = this.cursor.HTMLelement;
         switch (current.tagName.toLowerCase()) // or this.value("..tagName")
         {
           case "td" :
           case "li" :
             index1 = 1;           
             var w = current.parentNode; // tr element
             while ( (w = w.previousSibling)) index1++;           
             // Get correponding row in tbody of target table
             break;
           case "spam" :          
             break;
           default :
             return debug( {level:2, returnValue:null}, "unexpected tag "+current.tagName);  
         }
       }
       if (ext) index1 += parseInt( ext);
       target = target.getElementsByTagName('tbody')[0].rows[index1-1]; //current .parentNode.parentNode
    
    }
    else if ( index1 == "all")
    {
      // All means use a parent node
      switch ( parent.tagName.toLowerCase())
      {
        case "table":
          target = parent.rows;
          break;
        case "ul" :
        default :
          break;  
      } 
    }
    else if ( this.indexableTags.indexOf( parent.tagName.toLowerCase()) > -1) {
      if ( !isNaN(parseInt( index1))) {
        // Numercial index provided
        // 2DO use index as rowid => row
        index1 = parseInt( index1);
        switch ( parent.tagName.toLowerCase()) {
          case "table":
              let rows = parent.getElementsByTagName('tbody')[0].rows;
              if ( index1 < 0 || index1 > rows.length) return debug( { level:2, return: null}, "Bad index 1", target, index1); 
              target = rows[index1-1]; 
              break;
          case "ul" :
              let items = parent.childNodes;
              if ( index1 < 0 || index1 > items.length) return debug( { level:2, return: null}, "Bad index 1", target, index1); 
              target = items[index1-1]; 
              break;
          default :
              break;  
        }
      } else {
        // String index provided - assume there is an id field
        // Find entry where id = index
        let index1Candidates = $$$.findRows( parent.id, "id:"+index1+",");
        if ( !Array.isArray( index1Candidates) || index1Candidates.length != 1) return null;
        // target = $$$.getRowElement( parent.id, indexCanadidates[0]);
        let rows = parent.getElementsByTagName('tbody')[0].rows;
        target = rows[ index1Candidates[0] - 1];           
      } 
    } else { return null;}
    
    // 2nd dimension index
    if ( !target) return null;
    
    if ( index2 == "")
    {
      return target;
    }
    else
    {
      if ( isNaN(parseInt( index2)))
      {
        // index2 is all or a column label
        switch ( target.tagName.toLowerCase())
        {
          case "tr":
            if ( index2 == "all") target = target.cells;            
            else
            {
              // Get typed columns labels of target
              // 2DO target is row ?
              // 2DO cache to avoid redoing 
              var headerRow = target.parentNode.parentNode.getElementsByTagName('thead')[0].rows[0];
              if (!headerRow) headerRow = target.parentNode.rows[0];
              var cols =  this.getColNamesForIndex( headerRow.cells);// [];          
              // var cols = this.value( "..all._type", null, headerRow.cells);
              // Find cell(s)
              // 2DO if target is array, then foreach               
              if ( cols.indexOf( index2) > -1)  target = target.cells[ cols.indexOf( index2)];
              else { target = this.empty; console.log( "Force empty", index2, cols);}
            }  
            break;
          case "ul" :
          default :
            break;  
        }          
      }
      else
      {
        // index2 is a number
        switch ( target.tagName.toLowerCase()) //this.value( "..tagName", null, target))
        {
          case "tr":
            target = target.cells[index2-1];
            break;
          case "ul" :
          default :
            break;  
        } 
      }  
    }
    return target;
 } // DOMvalue.findChild()

  getColNamesForIndex( headerRow) {
    let cols = [];
    for ( let coli=0; coli<headerRow.length; coli++)
    if ( headerRow[coli].getAttribute('_type'))
        cols.push( headerRow[coli].getAttribute('_type') + headerRow[coli].textContent.replace(/ /g, '').replace( /-/,'_').replace( /(')/g, ''));
    else
        cols.push( headerRow[coli].textContent.replace(/ /g, '').replace( /-/,'_').replace( /(')/g, ''));                        
    return cols; 
  }

} // DOMvalue JS class

if ( typeof process == 'object') {    
    // Testing under node.js 
    module.exports = { DOMvalue:DOMvalue};
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined" && typeof ModuleUnderTest == "undefined") {
        ModuleUnderTest = "domvalue.js";
        console.log( 'Syntax:OK ' + ModuleUnderTest);            
        console.log( 'Start of test program');
        console.log( "Setting up browser (client) test environment"); 
        let path = "..";
        const testMod = require( path+'/tests/testenv.js');      
        testMod.load( []);
        let ud = new UniversalDoc( 'document', true, 133);
        let dom = ud.dom;
        //let dom = new DOM( 'document', null);
        console.log( "start testing domvalue.js");
        let test = "";
        {
            test = "Test 1: ";
            let val = dom.value( "B0100000001000000M...textContent");
            // console.log( dom.value( "B0100000001000000M...textContent"));
            if ( val == "Hello big world") console.log( test+"OK"); else console.log( test+"KO", val);
        }
        {
            test = "2 read JSON value";
            testResult( test, dom.domvalue.value( 'testConnector_parameters.ready..textContent') == "no");
        }
        {
          test = "3 read velue in table with string indexes";
          testResult( test, dom.domvalue.value( 'myTable.myId1.val1.textContent') == 32, dom.domvalue.value( 'myTable.myId1.val1.textContent'));
      }
        // End of auto-test
        console.log( "Test completed");
        process.exit(0);     
    }
}