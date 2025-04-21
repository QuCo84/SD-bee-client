/**
 * udjson set of fcts for handling JSON data
 */
 
class UDJSON { 
    dom;
    textCol1 = "n°";
    textCol2 = "text";
    attrMap = { 
        label: "name",
        href:"href", src:"src", onclick:"onclick", 
        class:"class", style:"style",
        formula:"ude_formula", placeholder:"ude_place",
        type:"ud_type", subType:"ud_subtype", mime:"ud_mime", 
        stage:"ude_stage", menu:"ude_menu", autosave:"ude_autosave", edit:"ude_edit", 
        bind: "ude_bind", datasrc:"ude_datasrc", follow:"ud_follow", 
        valid: "ude_onvalid", invalid: "ude_oninvalid", title:"title",
        offset:"ud_offset", validate:"ude_validate", accept:"ude_accept",
        width:"width", height:"height", x:"x", y:"y", ui:"ude_ui", 
        val:"value", inputType: "type", checked:"checked", spell:"spellcheck", max:"max"
    };
    tempClasses = [ 
        //'part', 'subpart', 'zone', 'table', 'list', 'graphic', 'text', 'zoneToFill', 'filledZone', 'page',
        'editing', 'edcontainer', 'edinside'
    ]; 
    lastJSONkeys = [];
    use_onclick = false;
    use_onclick_el = "";
    mode = "";
    jsonComments = {};
  
    constructor( dom) {
        this.dom = dom;
        this.mode = this.dom.element( 'UD_mode').textContent;
    }
    
    /**
    * @api {js} API.json.read(jsonOrObject,key,postOp) Read a value in an object
    * @apiParam {mixed} jsonOrObject JSON string or an object
    * @apiParam {string} key Name of attribute in object
    * @apiParam {string} postOp Empty string (default) for no op, otherwose incrementAfter, incrementAfterBase32, delete
    * @apiSuccess {mixed} Value read or modified (incrementAfter)
    * @apiGroup Data
    */
    read( jsonOrObject, key, postOp="") { return this.value( jsonOrObject, key, null, postOp);}
   /**
    * @api {js} API.json.readFromDiv(holderId,key,postOp) Read a value from a JSON string stored n a container
    * @apiParam {mixed} holderId Id of an element containing the JSON string to read from
    * @apiParam {string} key Name of attribute in object
    * @apiParam {string} postOp Empty string (default) for no op, otherwose incrementAfter, incrementAfterBase32, delete
    * @apiSuccess {mixed} Value read or modified (incrementAfter)
    * @apiGroup Data
    */
    readFromDiv( holderId, key, postOp="") { return this.value( holderId, key, null, postOp);}
  
  /**
    * @api {js} API.json.write(jsonOrObject,key,value,operation) Read, write or perfom an operation on a value in an object
    * @apiParam {mixed} jsonOrObject JSON string or an object
    * @apiParam {string} key Name of attribute in object
    * @apiParam {mixed} value Null (default) for reading, otherwise value to write to attribute in object. 
    * @apiParam {string} operation Null (default) or set for simple writing, 
    *            delete, addToCSV, removeFromCSV, add (in array), remove (from array), incrementAfter, incrementAfterBase32
    * @apiSuccess {mixed} Value read or modified (incrementAfter) or object if an attriute was written value
    * @apiGroup Data
    */
    write( jsonOrObjectOrId, key, value, operation) { return this.value( jsonOrObjectOrId, key, value, operation);}
  /**
    * @api {js} API.json.writeToDiv(holderId,key,value,operation) Read, write or perfom an operation on a value in an object
    * @apiParam {mixed} holderId Id of element containing the JSON string to write to
    * @apiParam {string} key Name of attribute in object
    * @apiParam {mixed} value Value to write to attribute in object
    * @apiParam {string} operation Null (default) or set for simple writing, 
    *            delete, addToCSV, removeFromCSV, add (in array), remove (from array), incrementAfter, incrementAfterBase32
    * @apiSuccess {mixed} Value read or modified (incrementAfter) or object if an attriute was written value
    * @apiGroup Data
    */
    writeToDiv( holderId, key, value, operation) { return this.value( holderId, key, value, operation);}
  
   /**
    * @api {js} API.json.value(jsonOrObjectOrId,key,value,operation) Read, write or perfom an operation on a value in an object
    * @apiParam {mixed} jsonOrObjectOrId JSON string, object or id of a JSON string holder
    * @apiParam {string} key Name of attribute in object
    * @apiParam {mixed} value Null (default) for reading, otherwise value to write to attribute in object. When writing, holder is updated if id provided
    * @apiParam {string} operation Null (default) for simple reading or writing, 
    *            set, delete, addToCSV, removeFromCSV, add (in array), remove (from array), incrementAfter, incrementAfterBase32
    * @apiSuccess {mixed} Value read or modified (incrementAfter) or object if an attriute was written value
    * @apiGroup Data
    */
    value( jsonString, key, value=null, op="") {
        // !!!IMPORTANT Shortcuts to value don't have this, patch while finding the best way to buid shortcuts
        if ( typeof this == "undefined") return window.udjson.value( jsonString, key, value, op);
        let json = null;        
        let jsonHolder = null;
        if ( typeof jsonString == "string") {
            if ( jsonString == "") return null;
            // Look for data holder if short name   
            if ( jsonString.length < 48 && jsonString[0] != '{' && ( jsonHolder = this.dom.element( jsonString))) { 
                json = this.parse( jsonHolder.textContent);
            } else { json = this.parse( jsonString);}
        }
        else if ( typeof jsonString == "object") json = jsonString;
        if ( json && typeof json[ key] != "undefined" && value == null && !op) return json[ key];
        else if ( json && value == null && !op) return "";
        else if ( json) {
            let returnValue = "";
            let ind = -1;
            let work = json[ key];
            switch ( op) {
                case "" :
                case "set" :
                    json[ key] = value;
                    break;
                case "replace" :
                    if ( typeof json[ key] == "string") {
                        json[ key] = json[ key].replace( value[0], value[1]);
                    }
                    break;
                case "delete" :
                    delete json[ key];
                    break;
                case "addToCSV" :
                    if ( work) work = work.split( ','); else work = [];
                    ind = work.indexOf( value);                     
                    if ( ind > -1) break;
                    work.push( value);
                    json[ key] = work.join( ",");
                    break;
                case "removeFromCSV" :
                    if ( work) work = work.split( ','); else work = [];
                    ind = work.indexOf( value);
                    if ( ind == -1) break;
                    work.splice( ind, 1);
                    json[ key] = work.join( ",");
                    break;
                case "add" :
                    if ( typeof work.length == "undefined") break;
                    ind = work.indexOf( value)
                    if ( ind > -1) break;
                    work.push( value);
                    json[ key] = work;
                    break;
                case "remove" :
                    if ( typeof work.length == "undefined") break;
                    ind = work.indexOf( value)
                    if ( ind == -1) break;                    
                    work.splice( ind, 1);
                    json[ key] = work;
                    break;
                case "incrementAfter" :
                    returnValue = json[ key]++;
                    break;
                case "incrementAfterBase32" :
                    returnValue = json[ key];
                    json[ key] = ( parseInt( returnValue, 32) + 1).toString( 32);
                    break;
            }
            if ( typeof jsonString == "string")  json = JSON.stringify( json);
            if ( jsonHolder)  { jsonHolder.textContent = json;} 
            if ( returnValue != "") return returnValue; 
            else return json;
        }
        return '';
    }
    
   /**
    * @api {js} API.json.parse(json) Parse a JSON string, return null if syntax error
    * @apiParam {string} json JSON value to parse
    * @apiSuccess {object} Resulting object or null if error
    * @apiGroup Data
    */    
    parse( jsonOrId) {
        let object = null;
        let json = jsonOrId;
        let jsonHolder = null;
        // 2DO replace indexOf with isNameLike( string) tests for spaces, ", number, {  and [
        if ( jsonOrId.indexOf( '{') == -1 && jsonOrId.length < 48 && ( jsonHolder = this.dom.element( jsonOrId)) ) { 
            json = jsonHolder.textContent;
        }
        try {
            object = JSON.parse( json);
        }
        catch(e) {
            debug( {level:4}, "Can't parse JSON string ", e, json); 
        }
        return object;
    } // JSONParse()
     
    text( json, path) {
           let value = this.valueByPath( json, path);
           let text = "";
           for ( let line=0; line < value.length; line++) text += value[ line]+"\n";
           return text;
    }
   
   /**
    * @api {formula} json(jsonOrId,attrPath) Read a value from a multi-level JSON representation
    * @apiDescription Placed in a cell's formula, integrates values from any JSON data into table
    * @apiParam {string} jsonOrId JSON representation of data
    * @apiParam {string} attrPath Path to requested value using '/' ex level1/level2/level3 
    * @apiSuccess {mixed} return Read value or NULL if not found
    * @apiGroup Data
    * @api {JS} API.json.valueByPath(jsonString,attrPath,value) Read or write a value in a JSON representation
    * @apiDescription Placed in a cell's formula, gives the cell's column index 
    * @apiParam {string} jsonOrObjectOrId JSON representation of data, an object or the id of an element holding the JSON respresentation
    * @apiParam {string} attrPath Path to requested value using '/' ex level1/level2/level3 
    * @param {mixed} value Value to write, NULL if reading
    * @apiSuccess {mixed} return Written or read value or NULL if path not found
    * @apiGroup Data
    *    
    */         
    valueByPath( jsonString, attrPath, value = null)
    {
        let json = null;
        let jsonHolder = null;
        if ( typeof jsonString == "string") {
            if ( jsonString == "") return null;
            // Look for data holder if short name   
            if ( jsonString.length < 48 && jsonString[0] != '{' && ( jsonHolder = this.dom.element( jsonString))) { 
                json = this.parse( jsonHolder.textContent);
            } else { json = this.parse( jsonString);}
        }
        else if ( typeof jsonString == "object") json = jsonString;
        if (!json) return null;
        let j = json;
        let path = attrPath;
        if ( typeof path == "string") path = path.split('/');
        if ( value == null) {
            // READING a value from an object according to a path
            // Loop through each step of path to value
            for ( let i =0; i< path.length; i++) {     
                if ( !isNaN( path[ i])) { path[ i] = parseInt( path[i]);}
                if ( typeof j[path[i]] == "undefined") return null;
                j = j[path[i]];
                // if ( !j) return null;
            }
            // Return value
            return j;
        } else {
            // WRITING a value in an object according to a path 
            let lastj = null; // keep track of parent element
            // Follow each step of path to see if an array or object is required to hold value
            for ( let i=0; i< path.length; i++) {
                let create = false;
                let empty = {};
                lastj = j;
                // Get next element in object
                j = j[ path[ i]];
                if ( typeof j == "undefined" && i < ( path.length -1)) {
                    // Element doesn't exist and path not terminated so we need to create an empty element
                    if ( !isNaN( path[ i+1])) { 
                        // Current step is a number so we need an array
                        path[ i+1] = parseInt( path[i+1]);
                        
                        //empty = ( i < path.length -1) ? empty = [{}] : empty = [];
                        if ( Array.isArray( lastj)) { 
                            // New element in existing array
                            switch ( i) {
                                case 0 : json = j = empty; break;
                                case 1 : json[ path[0]].push( empty); break;
                                case 2 : json[ path[0]][ path[1]].push( empty); break;
                                case 3 : json[ path[0]][ path[1]][ path[2]].push( empty); break;
                                case 4 : json[ path[0]][ path[1]][ path[2]][ path[3]].push( empty); break;
                                case 5 : json[ path[0]][ path[1]][ path[2]][ path[3]].push( empty); break;
                                case 6 : debug( { level:1}, "valueByPath only accesses 6 levels", path); break;
                            }   
                        } else {
                            // New array
                            empty = [];
                            switch ( i) {
                                case 0 : json[ path[0]] =  j = empty; break;
                                case 1 : json[ path[0]][ path[1]] = j = empty; break;
                                case 2 : json[ path[0]][ path[1]][ path[2]] = j = empty; break;
                                case 3 : json[ path[0]][ path[1]][ path[2]][ path[3]] = j = empty; break;
                                case 4 : json[ path[0]][ path[1]][ path[2]][ path[3]][ path[4]] = j = empty; break;
                                case 5 : debug( { level:1}, "valueByPath only accesses 6 levels", path); break;
                            }   
                        }
                    } else {
                        // New objectR
                        switch ( i) {
                            case 0 : json[ path[0]] = j = empty; break;
                            case 1 : json[ path[0]][ path[1]] =  j = empty; break;
                            case 2 : json[ path[0]][ path[1]][ path[2]] = j = empty; break;
                            case 3 : json[ path[0]][ path[1]][ path[2]][ path[3]] = j = empty; break;
                            case 4 : json[ path[0]][ path[1]][ path[2]][ path[3]][ path[4]] = j = empty; break;
                            case 5 : json[ path[0]][ path[1]][ path[2]][ path[3]][ path[4]][ path[5]] = j = empty; break;
                            case 6 : debug( { level:1}, "valueByPath only accesses 6 levels", path); break;
                        }
                    }
                }
            }
            /*
              if key !isNaN then
              arr = json[ path ...
              if arr.length < key then arr[ key] =  else arr.push()
              path.pop
            */
            // Set value in object
            let lastKey = path[ path.length - 1];
            let lastEntryLen = 0;            
            if ( typeof ( lastKey) == "number") {
                // Entry is an existing item in an array                
                switch ( path.length) {
                    case 1 : lastEntryLen = json.length;
                    case 2 : lastEntryLen = json[ path[0]].length;break;
                    case 3 : lastEntryLen = json[ path[0]][ path[ 1]].length; break;
                    case 4 : lastEntryLen = json[ path[0]][ path[1]][ path[2]].length; break;
                    case 5 : lastEntryLen = json[ path[0]][ path[1]][ path[2]][ path[3]].length; break;
                    case 6 : lastEntryLen = json[ path[0]][ path[1]][ path[2]][ path[3]][ path[4]].length; break;
                    case 7 : lastEntryLen = json[ path[0]][ path[1]][ path[2]][ path[3]][ path[4]][ path[5]].length; break;
                    case 8 : lastEntryLen = json[ path[0]][ path[1]][ path[2]][ path[3]][ path[4]][ path[ 5]] [ path[ 6]].length; break;
                    default : debug( { level:1}, "valueByPath only accesses 8 levels", path); break;
                } 
            }
            if ( typeof ( lastKey) == "number" && lastKey >= lastEntryLen) {
                // Entry is a new item in an array
                switch ( path.length) {
                    case 1 : json.push( value); break;
                    case 2 : json[ path[0]].push( value);break;
                    case 3 : json[ path[0]][ path[1]].push( value); break;
                    case 4 : json[ path[0]][ path[1]][ path[2]].push( value); break;
                    case 5 : json[ path[0]][ path[1]][ path[2]][ path[3]].push( value); break;
                    case 6 : json[ path[0]][ path[1]][ path[2]][ path[3]][ path[4]].push( value); break;
                    case 7 : json[ path[0]][ path[1]][ path[2]][ path[3]][ path[4]][ path[5]].push( value); break;
                    case 8 : json[ path[0]][ path[1]][ path[2]][ path[3]][ path[4]][ path[5]][ path[6]].push( value); break;
                    default : debug( { level:1}, "valueByPath only accesses 8 levels", path); break;
                }                
            } else {
                // Entry is inside an object or an array with sufficient items
                switch ( path.length) {
                    case 1 : json[ path[0]] = value; break;
                    case 2 : json[ path[0]][ path[1]] = value; break;
                    case 3 : json[ path[0]][ path[1]][ path[2]] = value; break;
                    case 4 : json[ path[0]][ path[1]][ path[2]][ path[3]] = value; break;
                    case 5 : json[ path[0]][ path[1]][ path[2]][ path[3]][ path[4]] = value; break;
                    case 6 : json[ path[0]][ path[1]][ path[2]][ path[3]][ path[4]][ path[5]] = value; break;
                    case 7 : json[ path[0]][ path[1]][ path[2]][ path[3]][ path[4]][ path[5]][ path[6]] = value; break;
                    case 8 : json[ path[0]][ path[1]][ path[2]][ path[3]][ path[4]][ path[5]][ path[6]][ path[7]] = value; break;
                    default : debug( { level:1}, "valueByPath only accesses 8 levels", path); break;
                }
            }
            if ( typeof jsonString == "string")  json = JSON.stringify( json);
            if ( jsonHolder)  { jsonHolder.textContent = json;}          
            return json;
        }
    }  // UDJSON.valueByPath()
    
    // Recurrent fct for valueByPath
    setValueByPath( object, path, value, parent = null) {
        if ( typeof object == "string") { object = this.parse( object);}
        if ( typeof path == "string") { path = path.split( '/');}
        let firstKey = path.shift();
        if ( !isNaN( firstKey)) { firstKey = parseInt( firstKey);}
        if ( !object) return object;
        if ( !this.valueByPath( object, firstKey)) {
            // Create a node
            if ( typeof firstKey == "string") {
                if ( path.length) {
                    if ( !isNaN( path[0])) object[ firstKey] = []; 
                    else object[ firstKey] = {}; 
                } else object[ firstKey] = value;
            } else {
                // Numeric key
                if ( Array.isArray( object)) {
                    if ( firstKey < object.length) object[ firstKey] = value; else object.push( value);
                } else if ( path.length) { object = [{}];}
                else object = [ value];
            }
        } else if ( !path.length) {
            // Rewrite existing node
           object[ firstKey] = value;
        }   
        if ( path.length) { object[ firstKey] = this.setValueByPath( object[ firstKey], path, value, object);}
        return object
    }
    
   /**
    * @api API.json.merge( target, source) Merge values in source with the target
    * @apiParam {mixed} target Object, JSON string or name of JSON string holder where to merge to
    * @apiParam {mixed} source Object, JSON string or name of JSON string holder with data to merge
    * @apiSuccess {mixed} Merged data as object or JSON string (same as target)
    * @apiGroup Data
    */
    merge( targetStr, sourceStr, path = "") {
        // Get Target
        // 2DO exchangeJSON( jsonStr, json=null)
        let target = null;
        let targetHolder = null;
        if ( typeof targetStr == "string") {
            if ( targetStr == "") return null;
            // Look for data holder if short name   
            if ( targetStr.length < 48 && targetStr[0] != '{' && ( targetHolder = this.dom.element( targetStr))) { 
                target = this.parse( targetHolder.textContent);
            } else { target = this.parse( targetStr);}
        }
        else if ( typeof targetStr == "object") { target = targetStr};
        // Get Source
        let source = null;
        let sourceHolder = null;
        if ( typeof sourceStr == "string") {
            if ( sourceStr == "") return null;
            // Look for data holder if short name   
            if ( sourceStr.length < 48 && sourceStr[0] != '{' && ( sourceHolder = this.dom.element( sourceStr))) { 
                source = this.parse( sourceHolder.textContent);
                // 2DO need full-proof logic : look for textedit and get value
                if ( this.value( source, 'meta')) { source = this.valueByPath( source, "data/value");}
            } else { source = this.parse( sourceStr);}
        }
        else if ( typeof sourceStr == "object") { source = sourceStr};
        // Merge
        for ( let key in source) {
            let value = source[ key];
            let cpath = path;
            if ( cpath) cpath += "/" + key; else cpath = key;
            if ( typeof value == "number" || typeof value == "string") { 
                // Isolated values - set directly
                this.setValueByPath( target, cpath, value);
            } else if  ( Array.isArray( value)) {
                // Array values - check if target is pure (nb indexes) or named
                let targetArr = this.valueByPath( target, cpath);
                if ( !targetArr) {
                    // Add new array value
                    targetArr = value;
                    this.setValueByPath( target, cpath, targetArr);
                } else if ( Array.isArray( targetArr)) {
                    // Target is a pure array APPEND or REPLACE 2DO REMOVE specific values                    
                    if ( value[0] == "_APPEND_") {
                        value.shift();
                        for ( let i = 0; i < value.length; i++) { 
                            if ( value[ i] && targetArr.indexOf( value[ i]) == -1 ) targetArr.push( value[ i]);
                         }
                    } else {
                        if ( value[0] == "_REPLACE_") { value.shift();}
                        targetArr = value;
                    }
                    this.setValueByPath( target, cpath, targetArr);
                } else if ( targetArr && typeof targetArr == "object") {
                    // Target is object, process as Named array 2DO Do we need this ?
                    // could change values as index in keys but non determinist
                    for ( let i = 0; i < value.length; i++) { 
                        if ( targetArr && value[ i]) targetArr[ "e"+i] = value[ i];
                    } 
                    // this.setValueByPath( target, cpath, targetArr);                    
                }               
            } else { 
                // Object values - use recursivity to merge
                target = this.merge( target, value, cpath); 
            }
        }
        if ( typeof targetStr == "string")  target = JSON.stringify( target);
        if ( targetHolder)  { targetHolder.textContent = target;}    
        return target;        
    }    

   /**
    * Get an element's content as an object
    *     { 
    *        meta:{ type, name, zone, caption, captionPosition}
    *        head:{ tag, class, value [ headindex :{ value, tag, class}]}
    *        data:{ tag, class, value [
    *           index1: { index2: { value, tag, class, formula}}, index2: { value ....}}
    *           index1 : {value, tag, class, formula}
    *        }
    *        changes:{
    *            changeindex : { section, index1, index2, value}
    *        }
    *     }
    */
    // 2DO ude_bind !! detect changes
    
  /** 
    * Remove temporary classes from class attribute
    * @param {object} json
    */                                                        
    checkClasses( json) {
        let classes = this.value( json, 'class');
        if ( classes &&  typeof classes == "string" && classes != "") {
            classes = this.dom.keepPermanentClasses( classes);
            if ( classes) { json = this.value( json, 'class', classes);}
            else { json = this.value( json, 'class', "", "delete");}
        }   
        return json;        
    }
  /**
    * Get a JSON representation of an HTML element
    * @param {HTMLelement} element The HTML element
    * @param {boolean} top Set to false for recurrent calls
    * @return {object} The JSON representation
    * @api {JS} API.json.getElement(element) Get JSON representation of an HTML element set
    * @apiParam {HTMLelement} element The HTML element
    * @apiSuccess {object} return The JSON representation 
    * @apiGroup HTML
    * @apiDescription  The JSON representation is as follows :
    *        <li>meta:{ type, name, zone, caption, captionPosition}</li>
    *        <li>data:{ tag, class, value [</li><ul>
    *        <li>  subelement1: { tag, class, attr, value:{subsubelement1a: { value, tag, class, formula}}, subelement1b: { value ....}}}</li>
    *        <li>  subelement2: {value, tag, class, formula}</li>
    *        </ul><li>]}</li>
    *        <li>changes:{changeindex : { section, index1, index2, value}}</li>
    *        <li>Subelement tags are HTML tags or <ul>
    *           <li>"textedit" - converts an array of strings to a text editing table</li>
    *           <li>"jsontable" - converts an (named) array of objects to a table<li>
    *        </ul></li>
    */    
    getElement( element, top=true)
    {
        // 2DO JSON model / existing to detect use/include
        // Initialise response
        let json = {};
        
        // Extract data from element
        let tag = element.tagName.toLowerCase();
        let id = element.id;
        let name = element.name; // not used
        let type = this.dom.attr( element, 'ud_type');
        let useData = false;
        if ( top)
        {
            // 2DO add head if headed element (table)
            // 2DO add data / content
            //json.tag = tag;
            json.meta = {};
            if ( id) json.meta.name = id.replace( "editZone", "");
            json.meta.zone = id;
            for( let key in this.attrMap) {
                let srcKey = this.attrMap[ key];
               if ( [ 'style', 'bind'].indexOf( key) > -1 || !srcKey) { continue;} 
               if ( this.dom.attr( element, srcKey)) json.meta[ key] = this.dom.attr( element, srcKey);
            }
            json.meta = this.checkClasses( json.meta);
            let divs = this.dom.elements( "div", element);
            useData = true;
            let children = this.dom.children( element);
            // TRIAL #2207006    
            if ( API) {
                this.use_onclick = API.testEditorAttr( element, 'ude_edit', 'on');
                this.use_onclick_el = element.id; 
            }
            
        }
        else
        {
            json.tag = tag;
            if ( id && id.indexOf( 'udcalc') != 0 && id.indexOf( 'udecalc') != 0) json.name = id;
            for( let key in this.attrMap) {
                let srcKey = this.attrMap[ key];
                if ( [ 'style'].indexOf( key) > -1 || !srcKey) { continue;}                 
                if ( this.dom.attr( element, srcKey)) 
                    json[ key] = this.dom.attr( element, srcKey);
                else if (  key == "onclick" && this.dom.attr( element, '_onclick')) {
                        // onclick is stored as '_onclick' to enable edition 
                        json[ key] = this.dom.attr( element, '_onclick');
                } 
            }
            json = this.checkClasses( json);
            // Check for ud_follow attribute to avoid jsonising generatable content 
            if ( this.value( json, 'follow') == "off") { 
                json[ 'value'] = "";
                return json;
            }
        }
        // 2DO direct towards use/include
        // Content goes to value attribute     
        let children = Array.from( element.childNodes);
        // Extract text caption
        let captionSpan = null;
        if ( top && children.length && children[0].tagName == "SPAN" && children[0].classList.contains("caption")) {
            // Caption at top
            if ( children[0].childNodes.length == 1) {
                // Caption is pure text so store caption in meta
                captionSpan = children.shift();
                json.meta.captionPosition = "top";
            }
        } else if ( top && children.length > 2 && children[1].tagName == "SPAN" && children[1].classList.contains("caption")) {
            // Caption at top
            if ( children[1].childNodes.length == 1) {
                // Caption is pure text so store caption in meta
                children.shift(); // Skip name editor
                captionSpan = children.shift();
                json.meta.captionPosition = "top";
            }
        } else if ( top && children.length && children[ children.length - 1].tagName == "SPAN" && children[ children.length - 1].classList.contains("caption")) {
            // Caption bottom
            if ( children[ children.length - 1].length == 1) {
                // Pure text so store caption in meta
                captionSpan = children.pop;
                json.meta.captionPosition = "bottom";
            }
       }
       if ( captionSpan) {
            let captionEls = captionSpan.childNodes;            
            let caption = "";
            let captionElCount = 0;
            for ( let eli=0; eli < captionEls.length; eli++) {
                let el = captionEls[ eli];
                if ( el.nodeType == Node.TEXT_NODE) caption += el.textContent;
                else if ( el.nodeType == Node.ELEMENT_NODE && el.tagName == "SPAN" && !el.classList.contains( 'objectName')) {
                    caption += el.outerHTML;
                }
            }
            if ( caption) { 
                // Caption is pure text so store in meta 
                let temp = document.createElement( 'textarea');
                temp.textContent = caption.replace( /\n/g, '');
                caption = temp.innerHTML;  
                json.meta.caption = caption; // captionSpan.childNodes[0].textContent;   
            }            
        }
        let key = "value";
        if ( useData) key = "data";        
        if ( element.innerHTML == element.textContent) {
            // Simple text content, value is a string
            json[ key] = element.textContent;
        } else if ( type == "text" || type == "textedit") {
            let table = this.dom.element( "table", element); 
            if ( !table && typeof process == "object") { 
                if ( element.tagName == "TABLE") table = element;
                else {
                   // If needed by robot may need better logique
                   table = this.dom.children( element)[1];
                   if ( table.tagName != "TABLE") table = this.dom.children( element)[2];
                }

                if ( !table) return null;
            } // !!! Under node.js, querySelector doesn't work on not attached items            
            /*if ( table.classList.contains( 'html')) { json[ key] = this.readTextEditor( table, "text/html");}
            else */
            json[ key] = this.readTextEditor( table, this.dom.attr( table, 'ud_mime'));
        } else if ( type == "list") { // test
            let list = this.dom.element( "ul", element); 
            json[ key] = this.readList( list);
        } else if ( tag == "ul") { // test
            json = this.readList( element);
        } else if ( type == "table") { 
            let table = this.dom.element( "table", element); 
            json[ key] = this.readTable( table);
        } else if ( tag == "table") { // test
            json[ key] = this.readTable( element);
        } else if (type == "divdata") {
            json[ key] = children[0].innerHTML;         
        } else if ( children.length == 1) {
            // Single element
            json[ key] = this.getElement( children[0], false);
        } else {
            // Multiple elements            
            let useIndex = [ 'ul', 'thead', 'tbody'].indexOf( tag);
            if ( useData || useIndex > -1) {
                // Use a keyed array
                json[ key] = {};
                let index = 1;
                for ( let childi = 0; childi < children.length; childi++) {
                    let child = children[ childi];
                    let childExTag = this.dom.attr( child, 'exTag');
                    // 2DO shorthand version for tables (ie assumed tr, td)
                    if ( child.nodeType == 1) {
                        if ( child.tagName == "BR") json[ key].push( { tag:"br", value:""});
                        else { 
                            // Use key specified in ud_key attribute or index
                            // !!!Warning 12/04/2022 this code was disabled, remove this comment after trials 
                            let key2 = this.dom.attr( child, 'ud_key');
                            if ( !key2 ) key2 = index;
                            json[ key][ key2] = this.getElement( child, false);
                        }
                    }
                    else if ( child.nodeType == 3) json[ key][ index] = { value:child.textContent};
                    index++;
                }
                
            }
            else {
                // Use an array
                json[ key] = [];
                for ( let childi = 0; childi < children.length; childi++) {
                    let child = children[ childi];
                    if ( child.nodeType == 1) {
                        if ( child.tagName == "BR") json[ key].push( { tag:"br", value:""});
                        else json[ key].push( this.getElement( child, false)); 
                    }
                    else if ( child.nodeType == 3) json[ key].push( { value:child.textContent});            
                }
            }    
        }
        if ( top) json.changes = {};
        // Clear onclick mode
        if ( this.use_onclick && element.id == this.use_onclick_el) {
            this.use_onclick = false,
            this.use_onclick_el = "";
        }        
        return json;
    } // UDJSON.getElement()
      
  /**
    * Create an HTML element from a JSON representation
    * @param {string} json The JSON representation
    * @param {string} sourceId Bind the element to another HTML element
    * @param {string} parentTag Reserved for filling in gaps automatically
    * @return {HTMLelement} An unattached HTML element
    * @api {JS} API.json.putElement(element) Create element set from JSON
    * @apiParam {string} json The JSON representation
    * @apiParam {string} sourceId Bind the element to another HTML element
    * @apiSuccess {HTMLelement} return An unattached HTML element
    * @apiGroup HTML
    * @apiDescription  The JSON representation is as follows :
    *        meta:{ type, name, zone, caption, captionPosition}
    *        data:{ tag, class, value [
    *           subelement1: { subsubelement1a: { value, tag, class, formula}}, subelement1b: { value ....}}
    *           subelement2: {value, tag, class, formula}
    *        ]}
    *        cache:
    *        changes:{
    *            changeindex : { section, index1, index2, value}
    *        }
    *        caption is added as SPAN element with class caption containg a SPAN element of class objectName with name
    *    
    */        
    putElement( json, sourceId = "", parentTag = "", containerClass="")
    {
        let html = "";
        // Extract info from json
        let meta = this.value( json, 'meta');
        if ( !meta) meta = json;
        meta = this.checkClasses( meta)
        let tag = this.value( meta, 'tag');
        let id = this.value( meta, 'name');
        let containerId = this.value( meta, 'zone');
        // Create container HTML element if required
        let element = null;
        //if ( !containerId && id) containerId = id+"editZone"       
        if ( containerId) {
            // Object defines a Container - create if necessary
            // console.log( "using container "+containerId);
            element = this.dom.element( containerId);
            if ( element) { 
                this.dom.emptyElement( element);
                for( let key in this.attrMap) {
                    if ( this.value( meta, key) !== "") this.dom.attr( element, this.attrMap[ key], this.value( meta, key));
                }
            } else {
                // Create container id
                element = document.createElement( 'div');
                element.id = containerId;
                if ( containerId.toLowerCase().indexOf( 'editzone') > -1) element.className = "editzone";
                for( let key in this.attrMap) {
                    if ( this.value( meta, key) !== "") {
                       // if ( key == "onclick" && use_onclick) key = "_onclick"; 
                        this.dom.attr( element, this.attrMap[ key], this.value( meta, key));
                    }
                }
                if ( sourceId) this.dom.attr( element, 'ude_bind', sourceId);
                else this.dom.attr( element, 'ude_bind', id+'_object');                     
                if (containerClass) {
                    // Just add first class if multiple classes (cf initialcontent)
                    /*
                    * Improve = ignore initialcontent
                    */
                    let containerClasses = containerClass.split( ' ');
                    element.classList.add( containerClasses[0]);
                }
            }
            // TRIAL #2207006
            if ( API) {
                this.use_onclick =  ( window.UDE_init) ? API.testEditorAttr( element, 'ude_edit', 'on') : false;
                this.use_onclick_el = element.id;   
            }

            // Insert hidden name editor
            // this.dom.insertElement( 'span', id, { class:"objectName hidden", ude_stage:"on"}, element, false, true);
        } else if ( tag) {    
            // Object has tag so create element
            element = document.createElement( tag);
            if (id) element.id = id;
            if (containerClass) {
                // Just add first class if multiple classes (cf initialcontent)
                /*
                * Improve = ignore initialcontent
                */
                let containerClasses = containerClass.split( ' ');
                element.classList.add( containerClasses[0]);
            }
            if ( id.indexOf( 'editZone') > 0 && sourceId) this.dom.attr( element, 'ude_bind', sourceId);
            let element_use_onclick = ( this.value( meta, 'ui')) ? false : this.use_onclick;
            for( let key in this.attrMap) {
                if ( this.value( meta, key)) {
                    if ( key == "onclick" && element_use_onclick && this.value( meta, 'ui') != "yes") 
                        this.dom.attr( element, '_onclick', this.value( meta, key));
                    else if ( key == "placeholder" && tag == "input") 
                        this.dom.attr( element, key, this.value( meta, key));
                    else if ( this.attrMap[ key])
                        this.dom.attr( element, this.attrMap[ key], this.value( meta, key));
                }
            }
        } else {
            // Error
        }   
        // continue classname,
        // Add content
        // 2DO head, body
        if ( !element) return null;
        let content = this.value( json, 'data');
        if ( !content) content = this.value( json, 'value');
        if ( !content) content = this.value( json, 'placeholder');
        if ( !content) content = "";
        /*
        let content = "";
        if ( data) content = data;
        else content = this.value( json, 'value');
        */
        /*
        else for ( key in json) {
            if key starts with tag or specials (jsontable for ex)
            recursive call or call another fct
        }        
        if ( !content) { content = "";};
        */
       // Process content as string, object or array
        if ( typeof content == "string") {
            // String value, add text node
            if ( content == "" && json.tag == "br") element.appendChild( document.createElement( 'br'));            
            //else if ( content) { element.appendChild( document.createTextNode( content));} // translateTerm ?
            else if ( content) { element.innerHTML = content; }
        } else if ( typeof content == "object")  {
            // 2DO if content.use or include then putElement( initialjson[ content.use])
            // Value is multiple 
            if ( Array.isArray( content) || this.value( content, "tag") == "") {
                // Array item loop
                //console.log( content, "keyed array");
                // Use same loop for array and named list
                for ( var key in content)
                { 
                    // 2DO process acoording to tag, ex tbody assume TR subContent = object = a row assume TD
                    if (  key.charAt(0) == '_' || key == 'length') continue;
                    let subContent = content[ key];
                    if ( typeof subContent == "string" 
                         || ( this.value( subContent, "tag") == "" && this.value( subContent, "meta") == "")
                    ) {
                        // String value or object with just value so add text node
                        if ( typeof subContent == "object") subContent = subContent.value;
                        if ( subContent == "" && element.tagName == "P") element.appendChild( document.createElement( 'br'));            
                        else if ( subContent) { element.appendChild( document.createTextNode( subContent));}
                    } else if ( typeof content == "object" && this.value( content[key], "tag") == "datadiv") {
                        let child = document.createElement( 'div'); 
                        child.id = content[ key].name;
                        child.innerHTML = JSON.stringify( content[ key].value);
                        child.className = "hidden";
                        this.dom.attr( child, 'ud_type', "divdata");
                        element.appendChild( child);
                     } else {
                        // Carry down element's class 
                        if ( !this.value( content[ key], 'class') && containerClass) content[key].class = containerClass;
                        // Use recursivity
                        let child = this.putElement( content[ key], sourceId, tag, containerClass);
                        // Story JSON key so getElement can use the same
                        if ( sourceId) this.dom.attr( child, 'ud_key', key);                        
                        element.appendChild( child);
                    }      
                } // end of array item loop
            } else if (content) {
                    // Single object
                    let initialise = false;
                    //console.log( content, "object");
                    let contentType = content.tag;
                    let child = null;
                    if ( content.name) id = content.name;                
                    if ( contentType == "textedit") {
                        if ( !content.value) { content.value = { dummy:"..."};}                        
                        let id2 = id.replace( 'editZone', '-table'); // Patch for HTML elements where table is cretae din editZone
                        child = this.createTextEditor( content.value, id2, content.class); //, this.value( content, 'mime'));
                    } else if ( contentType == "datadiv") {
                        child = document.createElement( 'div'); 
                        child.innerHTML = JSON.stringify( content.value);
                        child.className = "hidden";
                        this.dom.attr( child, 'ud_type', "divdata");
                    } else if ( contentType == "jsonlist") {
                        if ( !content.value) { content.value = { dummy:"..."};}
                        child = this.createList( content.value, id, content);
                        // Carry down element's class
                        if ( containerClass) // && !this.dom.keepPermanentClasses( child.className)) 
                            child.className = containerClass; // List.add( containerClass);
                    } else if ( contentType == "jsontable") {
                        if ( !content.value) { content.value = { dummy:"..."};}
                        child = this.createTable( content.value, id, content);
                        // Carry down element's class
                        if ( containerClass) // && !this.dom.keepPermanentClasses( child.className)) 
                            child.className = this.dom.keepPermanentClasses( containerClass, false);//containerClass; //List.add( containerClass);
                    } else if ( content.tag == "div" && content.class.indexOf( 'object') > -1 && typeof content.value == "object") {
                        // div.object means its a JSON100 element - write value object as JSON and initialise parent element after creation
                        content.value = JSON.stringify( content.value).replace( /&quot;/g, '&amp;quot;'); // &quot; gets converted via innerHTML
                        child = this.putElement( content, sourceId, tag, containerClass);
                        initialise = true;
                    } else {
                        // if ( content.value && this.value( content, 'skipEmpty') != "on");
                        if ( !this.value( content, 'class') && containerClass) content.class = containerClass;
                        child = this.putElement( content, sourceId, tag, containerClass);
                        // if ( id) child.id = id; // Why ???
                    }
                   /*
                    * // Avoid empty elements
                    * if (child)
                    */    
                    element.appendChild( child);
                   // if ( initialise) setTimeout( function() { $$$.initialiseElement( $$$.dom.elementByName( meta.label));}, 5000);
            }
        }    
        // Add caption
        let caption = this.value( meta, 'caption');
        let captionPosition = this.value( meta, 'captionPosition');
        if ( caption && captionPosition)
        {
            let captionSpan = document.createElement( 'span');
            captionSpan.className = "caption";
            captionSpan.innerHTML = caption;  // + ' <span class="objectName" ude_stage="on">'+id+'</span>';
            this.dom.attr( captionSpan, 'spellcheck', "false");
            // 2DO Bind 
            switch ( captionPosition)
            {
                case "top" :
                    if ( element.childNodes[0].classList.contains( 'objectName')) {
                        element.insertBefore( captionSpan, element.childNodes[1]);
                    } else { 
                        element.insertBefore( captionSpan, element.childNodes[0]);
                    }
                    break;
                case "bottom" :
                    element.appendChild( captionSpan);
                    break;
            }
        }    
        // Arrange table
        if ( typeof process != "object") { // !TESTING
            let table = this.dom.element( "table", element);        
            if ( table && table.parentNode == element) { 
                if ( table.id) this.dom.arrangeTable( table.id); else this.dom.arrangeTable( table); 
            }
        }
               
        // Add Cached data        
        if ( json) {
            let cache = this.value( json, 'cache');
            if ( cache && typeof cache.tag != "undefined") element.appendChild( this.putElement( cache, sourceId, tag));
        }
        // Clear onclick model
        if ( this.use_onclick && element.id == this.use_onclick_el) {
            this.use_onclick = false,
            this.use_onclick_el = "";
        }
        return element;
        // return element.innerHTML;
    } // UDJSON.putElement()
    
   /**
    * @api {JS} API.json.toHTML(obj) Convert an object to HTML
    * @apiparam {object} obj Object to convert to HTML
    * @apiSuccess {string} Converted HTML
    * @apiGroup HTML
    */    
    toHTML( obj) {
        let r = "";
        if ( typeof obj !== "object") return obj;
        let w = { tag:"div", value:obj};
        let tempEl = this.putElement( w, false);
        if ( tempEl) r = tempEl.innerHTML; else r="ERR"; 
        return r;
    } // UDJSON_toHTML()

    createList( items, name, content) {
        // Extract useful parameters from content
        let style = ( typeof( content.class) == "undefined") ? "": content.class;
        //let datasrc = ( typeof( content.datasrc) == "undefined") ? "": content.datasrc;
        let list = document.createElement( 'ul');
        if ( style) list.className = style;   
        //if ( datasrc) this.dom.attr( table, 'ude_datasrc', datasrc);
        list.id = name;
        for ( let itemi=0; itemi < items.length; itemi++) {
            let item = document.createElement( 'li');
            let itemContent = items[ itemi];
            if ( typeof itemContent == "object") {
                let tempEl = this.putElement( { tag:'li', value:itemContent}, false);
                item.innerHTML = ( tempEl) ? tempEl.innerHTML : "ERR";                
            } else {
                item.innerHTML = itemContent;
            }
            list.appendChild( item);
        }
        return list;
    }

    readList( list) {
        let jsonList = { tag:"jsonlist"};
        // Add table attributes
        jsonList.name = list.id;
        if ( list.className) jsonList.class = list.className;
        //let source = this.dom.attr( list, 'ude_datasrc');
        //if ( source) { json.list.source = source;}
        let listData = [];
        let items = list.childNodes;
        if ( !items.length) return jsonList;
        for ( let itemi=0; itemi < items.length; itemi++) {
            let item = items[ itemi];
            let itemData = { "tag":"li"};
            if ( this.dom.attr( item, 'ude_formula')) { 
                itemData = "=" + this.dom.attr( item, 'ude_formula');
            } else {
                itemData = item.textContent;
                if ( this.dom.isHTML( itemData)) {
                    // If cell contains HTML then save cell content as object
                    let tempObj = this.getElement( item, false);
                    itemData = ( tempObj) ? tempObj.value : "ERR";
                }
            }  
            listData.push( itemData); 
        }
        jsonList.value = listData;
        return jsonList;
    }
    
  /**
    * @api {JS} API.json.createTable(rows,name,content) Create an HTML table from an object
    * @apiParam {Array.object} rows Array of rows or named array of rows
    * @apiParam {string} name Table's name
    * @apiParam {object} content Contains table's parameters
    * @apiSuccess {HTMLelement} The HTML table
    * @apiGroup HTML 
    * @apiDescription The "rows" argument takes 2 forms : <ul>
    * <li> an array of named lists (objects) [{col1:val1,col2;val2}, {col1:val1,col2;val2}]</li>
    * <li> or a named list of named lists { row1id:{col1:val1, col2:val2}, row2id:{col1:val1, col2:val2}}</li>
    * </ul>
    * The model row is the 1st list if rows is an array and the row with id = "model" if it's a named list.
    * <br>The JSON representation of the table (getElement(), putElement()) is 
    * { tag: "jsontable", class:classname, value:rows}
    *    
    */
   createTable( rows, name, content) {
        // Extract useful parameters from content
        let style = ( typeof( content.class) == "undefined") ? "": content.class;
        let datasrc = ( typeof( content.datasrc) == "undefined") ? "": content.datasrc;
        // Detect if rows is an array or a named list ie id:{ col1:val1, col2:val2...}
        let arrayOrList = ( Array.isArray( rows)) ? false : true; 
        let cols = [];
        let lines = [];
        let model = {};
        if ( arrayOrList) {
            // Named list -- use row key as Id       
            cols.push( 'id'); 
            for ( let id in rows) {
                if ( id == "model") {
                   model = rows[ id];
                   continue;
                }
                let row = Object.assign( {}, rows[ id]);
                row[ 'id'] = id;
                for ( let col in row) {
                    if ( cols.indexOf( col) == -1) cols.push( col);
                }
                lines.push( row);
            } 
        } else {
            // Simple array
            model = rows[ 0];
            for ( let rowi=1; rowi < rows.length; rowi++) {
                let row = rows[ rowi];
                for ( let col in row) {
                    if ( cols.indexOf( col) == -1) cols.push( col);
                }
                lines.push( row);
            }
        }
        // Create table
        let table = document.createElement( 'table');
        if ( style) table.className = style;   
        if ( datasrc) this.dom.attr( table, 'ude_datasrc', datasrc);
        table.id = name;
        // this.dom.attr( table, "ude_autosave", "off");
        // this.dom.attr( table, 'ude_bind', name);
        let thead = document.createElement( 'thead');        
        let tbody = document.createElement( 'tbody');
        let html = "";
        html += "<tr>";
        for ( let coli=0; coli < cols.length; coli++) html += "<th>" + cols[ coli] + "</th>";
        html += "</tr><tr class=\"rowModel\">";
        for ( let coli=0; coli < cols.length; coli++) {
            let v = model[ cols[ coli]];
            if ( v == null) v = "";
            let fillText = API.getParameter( 'computingText');
            if ( v[0] ==  "=") html += "<td ude_formula=\"" + v.substring( 1) + "\">"+fillText+"</td>";
            else html += '<td ude_stage="on">' + v + "</td>";
        }
        html += "</tr>";
        thead.innerHTML = html;
        table.appendChild( thead);
        let dummy = API.getParameter( 'dummyText');
        for ( let rowi=0; rowi < lines.length; rowi++) {
            let newRow = document.createElement( 'tr');
            html = "";            
            for ( let coli=0; coli < cols.length; coli++) {
                let v = ( typeof lines[ rowi][ cols[ coli]] == "undefined") ? "" : lines[ rowi][ cols[ coli]];
                if ( v == null) v = "";
                let fillText = API.getParameter( 'computingText');
                if ( v[0] ==  "=") html += "<td ude_stage=\"on\" ude_formula=\"" + v.substring( 1) + "\">"+fillText+"</td>";
                else {
                    if ( typeof v == "object") {
                        // If cell content is an object then generate HTML from it and store in cell 
                        let w={};
                        // w[ 'meta'] = { name:"temptable", zone:"temptablezone"};
                        w = { tag:"div", value:v};
                        if ( v == dummy) { w[ "placeholder"]=dummy;}
                        let tempEl = this.putElement( w, false);
                        if ( tempEl) v = tempEl.innerHTML; else v="ERR";
                    }
                    html += '<td>' + v + "</td>";
                }
            }
            newRow.innerHTML = html;
            tbody.appendChild( newRow);
        }  // end of row loop  
        table.appendChild( tbody);
        return table;   
    } // createTable()
    
  /**
    * @api {JS} API.readTable(table) Grab an HTML table as an object
    * @apiOaram {Array.string} lines Text to edit as an array of strings
    * @apiParam {string} name Table's name
    * @apiParam {string} style Table's style
    * @apiSuccess {object} The table as an object
    * @apiGroup HTML
    */
    readTable( table) {
        let jsonTable = { tag:"jsontable"};
        // Add table attributes
        jsonTable.name = table.id;
        if ( table.className) { jsonTable.class = table.className;}
        let source = this.dom.attr( table, 'ude_datasrc');
        if ( source) { json.table.source = source;}
        // Get column names
        let thead = table.getElementsByTagName('thead')[0];
        let cols = [];
        for ( let coli=0; coli < thead.rows[0].cells.length; coli++) { cols.push( thead.rows[0].cells[ coli].textContent);}
        // Store table data in array or named array
        let tableData = [];
        let useArray = true;
        if ( cols[0] == "id" ) { // || all values are id-like}
            tableData = {};
            useArray = false;
        }

        // Get model row
        {
            let modelRow = thead.rows[1];
            let cells = modelRow.cells;
            let row = {};
            for ( let celli=0; celli < cells.length; celli++) {
                let cell = cells[ celli];
                let cellContent = "";                
                if ( this.dom.attr( cell, 'ude_formula')) {
                    if ( celli == 0 && !useArray) { 
                        useArray = true;     
                        tableData = [];
                    }
                    cellContent = "=" + this.dom.attr( cell, 'ude_formula')
                }
                // 2DO if model formula wit
                else { cellContent = cells[ celli].innerHTML;}
                if ( celli == 0 && !useArray) { continue;}
                row[ cols[ celli]] = cellContent;
            }
            if ( useArray) tableData.push( row); else tableData[ 'model'] = row;
        }
        // Get body and store in value  
        let rowId = "";
        let tbody = table.getElementsByTagName('tbody')[0];
        let row = {};
        for ( let rowi=0; rowi < tbody.rows.length; rowi++ ){
            let cells = tbody.rows[ rowi].cells; 
            row = {};
            rowId = "";
            for ( let celli=0; celli < cells.length; celli++) {
                if ( celli == 0 && !useArray) {
                    rowId = cells[ celli].textContent;
                    continue;
                }
                let cell = cells[ celli];
                if ( this.dom.attr( cell, 'ude_formula')) { 
                    row[ cols[ celli]] = "=" + this.dom.attr( cell, 'ude_formula')
                } else {
                    let cellContent = cell.innerHTML;
                    //if ( cells[ celli].innerHTML != cellContent) {
                    if ( $$$.dom.children( cell).length) {
                        // If cell contains HTML then save value part of cell as object
                        let tempObj = this.getElement( cells[ celli], false);
                        if ( tempObj) cellContent = tempObj.value; else cellContent = "ERR";
                    }
                    row[ cols[ celli]] = cellContent;
                }
            }
            if ( useArray) tableData.push( row); else tableData[ rowId] = row;
        }
        jsonTable.value = tableData;
        return jsonTable;
    } // UDjson.readTable())    
    
  /**
    * @api {JS} API.createTextEditor(lines,name,style,mime) Create an HTML table for editing lined text
    * @apiParam {Array.string} lines Text to edit as an array of strings
    * @apiParam {string} name Table's name
    * @apiParam {string} style Table's style
    * @apiParam {string} mime MIME type (text/text(default), text/css, text/javascrpt, text/json, text/html)
    * @apiSuccess {HTMLelement} The HTML table
    * @apiGroup HTML
    */
    createTextEditor( lines, name, style, mime = "") {
        let table = document.createElement( 'table');
        if ( style) table.className = "textContent "+style; else table.className = "textContent"; 
        // JSON tables id = name (!IMPORTANT for calculations) , connectors
        table.id = name; // +"edittable";        
        // if ( typeof style != "undefined" && style.indexOf( 'json') > -1) { table.id = name;}
        this.dom.attr( table, "ude_autosave", "off");
        // this.dom.attr( table, 'ude_bind', name);
        if ( !mime) {
            if ( Array.isArray( lines)) {
                switch( lines[0].trim().toUpperCase()) {
                    case "SERVER" : mime = "text/text"; break;
                    case "CSS" : mime = "text/css"; break;
                    case "JS"  : mime = "text/javascript"; break;
                    case "JSON" : mime = "text/json"; break;
                    case "HTML" : mime = "text/html"; break;
                    case "RESOURCE" : mime = "text/json"; break;
                    default : mime = "text/text"; break;
                }
            } else { mime = "text/json";}
        }
        this.dom.attr( table, 'ud_mime', mime);
        let thead = document.createElement( 'thead');        
        let tbody = document.createElement( 'tbody');
        // Save buton
        // let onclick = "window.ud.ude.setChanged( document.getElementById( '"+name+"editZone'), true);";
        let onclick = "API.setChanged( '" + table.id + "', 1);"
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
        if ( typeof lines.length == "undefined") {
            // Lines are JSON
            lines = this.JSONtoText( lines).split("\n");  
        }
        let area = document.createElement( 'textarea');
        for ( var i=0; i < lines.length; i++)
        {
            let newRow = document.createElement( 'tr');
            let lineText = lines[ i];
            /*
            area.textContent = lines[ i];
            lineText = area.innerHTML; 
            */
            html = "";
            html += "<td contenteditable=\"false\" ude_formula=\"row()\" class=\"rowNo\">"+(i+1)+"</td>";
            html += "<td class=\"linetext\">"+lineText+"</td>"; 
            newRow.innerHTML = html;
            tbody.appendChild( newRow);
        }  // end of row loop  
        table.appendChild( tbody);
        return table;       
    } // createTextEditor()
 
    
   /**
    * Convert JSON to lined text
    */
    JSONtoText( json, textKeyPrefix = "")
    {
        if ( typeof json == "string" && json != "") json = JSON.parse( json);
        if ( !json) return "";
        let text = "";
        let comments = this.jsonComments;
        let commentsKey = $$$.getParameter( 'comment-key-in-JSON');
        if ( !textKeyPrefix) {
            text += "JSON content\n"; // 1st line indicates JSON content            
            comments = ( typeof json[ commentsKey] != "undefined") ? json[ commentsKey] : [];
            this.jsonComments = comments;
        }
        for( let key in json)
        {
            if ( key == "length" || key == commentsKey) continue;
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
                    debug( { level:2}, "unknown value type in JSON", textKeyPrefix + key, value);
                    break;
            }  
            // Comments  
            if ( comments && typeof comments[ textKey] != "undefined") {
                text += '//' + comments[ textKey] + "\n"; 
            }            
        }
        return text;
    }  // UDEtext.JSONtoText()  
    
  /**
    * @api {JS} API.readTextEditor(name,mime) Create an HTML table for editing lined text
    * @apiParam {string} name Table's name
    * @apiParam {string} mime MIME type (text/css, text/javascrpt, text/json, text/html)
    * @apiSuccess {mixed} Array of lines or object
    * @apiGroup HTML
    */
    readTextEditor( table, mime="text/text") {
        let jsonLines = {};
        let body = this.dom.element( 'tbody', table);
        let rows = ( body) ? body.rows : table.rows;
        //let rows = table.getElementsByTagName( 'tbody')[0].rows;
        if (!rows) return debug( {level:1, return: null}, "no rows in tbody of ", table);
        // Compile text from each row of the table (2 cols : line n0 and text)
        let values = [];
        // Detect JSON content
        let jsonTable = (mime == "text/json");
        let jsonTarget;
        this.lastJSONkeys = []; 
        for (let irow=0; irow < rows.length; irow++) 
        {
            let line = rows[irow].cells[1].textContent; //.replace(/"/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            // 2DO remove udcalc id's
            /*
            
            */
            // if ( id && id.indexOf( 'udcalc') != 0 && id.indexOf( 'udecalc') != 0) json.name = id;
            if ( mime == "text/html") line = rows[irow].cells[1].innerHTML;
            if ( irow == 0 && line.toLowerCase().indexOf('json') == 0) {
                jsonTable = true;
                jsonTarget = line.toLowerCase().replace( "json", "").trim();
            }
            if ( jsonTable && irow) jsonLines = this.prepareJSONstring( jsonLines, line);
            else values.push( line);
        }
        if ( jsonTable) values = jsonLines;
        let json = { tag:"textedit", class: table.className.replace( /textContent/g, ""), value:values, mime:mime};
        return json;        
    } // UDJSON.readTextEditor()
    
    prepareJSONstring( json, line) {  
        // Handle comments
        if ( line.substring(0, 2) == "//") {
            // Comment line        
            let commentsKey = $$$.getParameter( 'comment-key-in-JSON');
            if ( typeof json[ commentsKey] == 'undefined') json[ commentsKey] = {};
            json[ commentsKey][ this.lastJSONkeys.join('/')] = line.substring( 2); // add \n
            return json;
        }                
        // Split line into key & value
        let p = line.indexOf('=');
        if ( p <= 0) return json; // 2DO test for comments too
        let key = line.substr( 0, p).trim();
        let value = line.substr( p+1).trim();
        /*
        * 2DO Look for end of line comment & store 
        */
        /*if ( value.charAt(0) == '[' && value.charAt( value.length - 1) == ']') value = JSON.parse( value);
        else value = JSON.parse( value);*/ 
        if ( value) value = JSON.parse( value); else value = null;        
        let keys = key.split( '/');
        // Replace empty key slots with last value used
        for ( let keyi=0; keyi < keys.length; keyi++) {
            if ( keys[ keyi].length == 0) keys[ keyi] = this.lastJSONkeys[ keyi];            
        }
        this.lastJSONkeys = keys;
        if ( value != null) {
            if ( keys.length > 1) 
            {
                json = this.valueByPath( json, key, value);
                /*
                if ( typeof json[keys[0]] == "undefined") json[ keys[0]] = {};
                if ( keys.length > 2) { json = this.valueByPath( json, key, value);}
                */
                /*
                    if ( typeof json[keys[0]][keys[1]] == "undefined") { json[ keys[0]][ keys[1]] = {};}
                    json[keys[0]][keys[1]][keys[2]] = value;                
                }*/
                // else json[keys[0]][keys[1]] = value;
            }
            else json[key] = value;
        }
        return json;        
    } // UDEtext.prepareJSONstring()
    
}
// Auto-test
if ( typeof process == 'object') {    
    // Testing under node.js 
    module.exports = { UDJSON:UDJSON};
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined" && typeof ModuleUnderTest == "undefined") {
        console.log( 'Syntax:OK');            
        console.log( 'Start of test program');
        console.log( "Setting up browser (client) test environment"); 
        let path = "..";
        const testMod = require( path+'/tests/testenv.js');      
        testMod.load( []);
        let ud = new UniversalDoc( 'document', true, 133);
        let dom = ud.dom; // new DOM( 'document', null);
        let udjson = new UDJSON( dom);
        console.log( "start testing");
        let test = "";
        {
            // Accessing JSON values
            test = "Test value: ";
            let json = { p1:"val 1", p2:"val1,val2,val3", p4:["val20", "val21"]};
            json = udjson.value( json, 'p3', 'val33');
            json = udjson.value( json, 'p2', 'val4', 'addToCSV');
            json = udjson.value( json, 'p4', 'val22', 'add');
            if ( 
                json.p2.indexOf( 'val4') > -1 
                && udjson.value( json, 'p3') == "val33"
                && udjson.value( json, 'p4').indexOf( "val22") > -1 
            ) console.log( test + "OK"); else console.log( test + "KO", json);
        }
        {
            // Accessing JSON values
            test = "Test value by path: ";
            let json = { p1:{pa:"val 1"}, p2:{a:"val1",b:"val2", c:"val3"}, p4:["val20", "val21"]};
            json = udjson.valueByPath( json, 'p3', 'val33');
            json = udjson.valueByPath( json, 'p2/d', 'val4');
            json = udjson.valueByPath( json, 'p4', 'val22', 'add');
            if ( 
                json.p2.d.indexOf( 'val4') > -1 
                && udjson.valueByPath( json, 'p3') == "val33"
                && udjson.valueByPath( json, 'p4').indexOf( "val22") > -1 
            ) console.log( test + "OK"); else console.log( test + "KO", json);
        }
        // JSON<-->HTML test
        test = "Test JSON2HTML 1";
        let data = { tag:"ul", name:"myul", defaults:{ tag:{1:"li"}}, "value":{ 0:{ value:"item1", tag:"li"}, 1:{ value:"item2", tag:"li"}}};
        let json = { meta:{ type:"list", name:"mylist", zone:"myListeditZone", caption:"My list", captionPosition:"top"}, data:data, changes:{}};        
        let element = udjson.putElement( json);
        // dumpElement( element); // console.log( element, element.childNodes[0].tagName);
        let rjson = udjson.getElement( element);
        // console.log( rjson);
        if ( rjson.meta.type == "list") console.log( test+" : OK"); else console.log( test+": KO");        
        // Table (text editor example)
        test = "Test JSON2HTML 2";
        /*
        data = { tag:"table", name:"mytext", "value":{ 
        thead:{ tag:"thead", value:[{ tag:"tr:", value:{id:{ tag:"th", value:"id"}, text:{ tag:"th", value:"text"}}}]},
        tbody: { tag: "tbody", value:[{ tag:"tr:", value:{id:{ tag:"td", value:"1"}, text:{ tag:"td", value:"line1"}}}]}
        }};
        */
        data = { tag:"textedit", name:"mytext", "value":[ "line1", "line2"]}; 
        json = { meta:{ type:"text", name:"mytext", zone:"mytexteditZone", caption:"My text", captionPosition:"top"}, data:data, changes:{}};        
        element = udjson.putElement( json);
        // dumpElement( element); // console.log( element, element.childNodes[0].tagName);
        rjson = udjson.getElement( element);
        // console.log( rjson);
        if ( rjson && rjson.meta.type == "text") console.log( test+" : OK"); else console.log( test+": KO", rjson);
        {
            test = "setValueByPath (recurrent)";
            let obj = {};
            obj = udjson.setValueByPath( obj, 'first', "no 1");
            obj = udjson.setValueByPath( obj, 'second/0', "no 2");
            obj = udjson.setValueByPath( obj, 'second/1', "no 3 wrong");
            obj = udjson.setValueByPath( obj, 'second/2', "no 4");
            obj = udjson.setValueByPath( obj, 'third/a', "no 5");
            obj = udjson.setValueByPath( obj, 'third/b', "no 6");
            obj = udjson.setValueByPath( obj, 'second/1', "no 3");
            let json = '{"first":"no 1","second":["no 2","no 3","no 4"],"third":{"a":"no 5","b":"no 6"}}';
            testResult( test, JSON.stringify( obj) == json, JSON.stringify( obj));
        }
        {
            test = "merge";
            let obj = udjson.parse( '{"first":"no 1","second":["no 2","no 3","no 4"],"third":{"a":"no 5","b":"no 6"}}');
            obj = udjson.merge( obj, '{ "third":{"a":"no 50"}, "second":["no 20", "no 3", "no 4"]}');
            let json = '{"first":"no 1","second":["no 20","no 3","no 4"],"third":{"a":"no 50","b":"no 6"}}';
            testResult( test, JSON.stringify( obj) == json, JSON.stringify( obj));
        }
        {
            test = "jsontable array";
            data = { tag:"jsontable", name:"myJtable", class:"aclass", "value":[
                { col1:"Model Col 1", col2:"Model Col 2", col3:"Model Col 3"},
                { col1:"Row 1 Col 1", col2:" Row 1 Col 2", col3:" Row 1 Col 3"},
                { col1:"Row 2 Col 1", col2:" Row 2 Col 2", col3:" Row 2 Col 3"},
            ]};
            json = { meta:{ type:"table", name:"myJtable", zone:"myJtableeditZone", caption:"My JSON table", captionPosition:"top"}, data:data, changes:{}};
            element = udjson.putElement( json);            
            let el = dom.insertElement( 'div', element.outerHTML, { id:test}, dom.element( "B010000000500000M"), true);
            let table = dom.element( 'table', element);
            let got = udjson.getElement( element);
            testResult( test, ( JSON.stringify( got.data) == JSON.stringify( json.data)), JSON.stringify( got.data)+JSON.stringify( json.data)+"!");
        }
        {
            test = "jsontable named array";
            data = { tag:"jsontable", name:"myJ2table", "value":{
                model : { col1:"Model Col 1", col2:"Model Col 2", col3:"Model Col 3"},
                row1: { col1:"Row 1 Col 1", col2:" Row 1 Col 2", col3:" Row 1 Col 3"},
                row2: { col1:"Row 2 Col 1", col2:" Row 2 Col 2", col3:" Row 2 Col 3"},
            }};
            json = { meta:{ type:"table", name:"myJ2table", zone:"myJ2tableeditZone", caption:"My 2 JSON table", captionPosition:"top"}, data:data, changes:{}};      
            element = udjson.putElement( json);
            let el = dom.insertElement( 'div', element.outerHTML, { id:test}, dom.element( "B010000000500000M"), true);
            let got = udjson.getElement( element);
            testResult( test, ( JSON.stringify( got.data) == JSON.stringify( json.data)), JSON.stringify( got));
        }
        {
            test = "json_access";
            let json = '{"first":"no 1","second":["no 2","no 3","no 4"],"third":{"a":"no 5","b":"no 6"}, "fourth":4}';
            let holder = dom.insertElement( 'div', json, { id:test, class:"hidden"}, dom.element( "UD_resources"), false, true);
            let read1 = udjson.read( json, "first");
            let read2 = udjson.readFromDiv( test, "first");
            let read3 = udjson.readFromDiv( test, "fourth", "incrementAfter");
            let read4 = udjson.readFromDiv( test, "fourth");
            udjson.writeToDiv( test, "first", "no 1 changed");
            let read5 = udjson.readFromDiv( test, "first");
            testResult( 
                test, 
                ( read1 == "no 1" && read2 == "no 1" && read3 == 4 && read4 == 5 && read5 == "no 1 changed"), 
                read1+' '+read2+' '+read3+' '+read4+' '+read5
            );
            
        }
        {
            test = "jsonlist";
            data = { tag:"jsonlist", name:"myJ2list", "value":["item 1", "item 2", "item 3"]};
            json = { meta:{ type:"div", name:"myJ2list", zone:"myJ2listeditZone", caption:"My 2 JSON list", captionPosition:"top"}, data:data, changes:{}};      
            element = udjson.putElement( json);
            //let el = dom.insertElement( 'div', element.outerHTML, { id:test}, dom.element( "B010000000500000M"), true);
            let got = udjson.getElement( element);
            //dumpElement( element);
            //console.log( got);
            testResult( test, ( JSON.stringify( got.data) == JSON.stringify( json.data)), JSON.stringify( got));
        }
        {
            test = "parsing stringify &quot";
            data = [ "HTML", "&lt;div style=&quot;width:100%;&quot;&gt;"];
            json = JSON.stringify( data);            
            let el = document.createElement( 'div');
            el.innerHTML = json.replace( /&quot;/g, '&amp;quot;');
            testResult( test, ( json.indexOf( '&quot;') > -1 && el.innerHTML.indexOf( '&amp;quot;') > -1), json + el.innerHTML);
        }
        // End of auto-test
        console.log( "Test completed");    
        process.exit(0);
    }
}
 
 