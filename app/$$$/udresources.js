/**
 *  udressources.js
 *    API functions to access meta data on current document and class map info 
 *    Centralised access to this data
 */

// 2DO rename UD_resources
class UD_ressources {
   /**
    * Defines available classes and element types by view class.
    * view class : {
    *    tag : [ class1, class2],  // syntax for a tag with not taking insertables
    *    tag : { 0:class, span.spanClass:[ spanSubClass, spanSubClass]},  // syntax with insertables (span) 
    * }
    * Standard view class holder (hidden div) is UD_classMap. Default data is ...
    *    
    * @ {object}
    */    
    ud = null;
    classMap = null; // availableClassesAndTagsByViewClass
    info = null; 
    register = null;
    
   /**
    * Defines classes to add to an element when a class defined as available is selected for an element.
    * Style definitions with the combined-classes generate entries here 
    * @type {object}
    */  
    mappedClasses = {};
    dom;
    
    constructor( ud, api) {
        this.ud = ud;
        // this.classMap = API.json.parse( API.dom.element( "UD_classMap").textContent);
        // Add API fcts
        if ( typeof API != "undefined") 
        { 
            if ( !API && typeof process == "object") API = api;
            API.addFunctions( this, [ 
                "getTagOrStyleInfo", "getTagOrStyleLabel",
                "availableTags", "listTypeAndSubTypeClasses", "availableClassesForExtag", "availableClasses",
                "availableStylesForSelection", "availableTagsForSelection",
                "availableLayouts", "availableLayoutsForExTag",
                "insertables", "getViewTypeClass", "getClassesForView", "updateClassMap",
                "getEditorAttr", "testEditorAttr", "setEditorAttrPermanently", "setLiveEditorAttrs", 
                "getParameter", "getConstant", "hasLanguageSuffix",
                "defaultContent", "hasDefaultContent", "updateResource", "refreshResource"
            ]);
            this.dom = API.dom;
            // TRial #2222007 this.info = API.json.parse( "UD_tagAndClassInfo");
            this.register = UD_register;            
            this.info = this.register[ 'UD_exTagAndClassInfo'];
            // Set UD_exTagAndClassInfo global variable
            UD_exTagAndClassInfo = this.info;
            let updates = this.dom.udjson.parse( 'UD_registerModifications');
            if ( updates) {
                UD_exTagAndClassInfo = this.updateResource( UD_exTagAndClassInfo, updates[0]);
                this.register[ 'UD_exTagAndClassInfo'] = UD_exTagAndClassInfo;
            }    
            if ( 
                typeof UD_register != "undefined"
                && typeof UD_register.UD_parameters.buildManageOnClientSide != "undefined"
            ) debug( "Register loaded");
            /*
            modifiedResources = API.json.parse( "UD_modifiedResources");
            if ( modifiedResources) this.register = this.dom.udjson.merge( UD_register, modifiedResources);
            */
            // Make this module available as a global
            window.UD_resources = this;
            
        }
    }

    
   /*
    *  READING ressources
    */   
   /**
    * @api {JS} $$$.getTagOrStyleInfo(tagOrStyle,attr) Return the info on a class or style
    * @apiParam {string} tagOrStyle  The tag or style
    * @apiParam {string} attr The required attribute, "" for all   
    * @apiSucces {string} The requested info, "" if none
    * @apiGroup Parameters
    */    
    getTagOrStyleInfo( tagOrStyle, attr="") {
        let lang = window.lang;
        let info = API.json.value( UD_exTagAndClassInfo, tagOrStyle);
        if ( info && attr) {
            return API.json.value( info, attr);    
        } else if (info) {
            return info;
        }
        return "";
    } // getTagOrStyleLabel()

    
   /**
    * could be API.getRessourceLabel
    * @api {JS} API.getTagOrStyleLabel(tagOrStyle) Get label for a tag or style
    * @apiParam {mixed} elementOrId HTML element or its Id
    * @apiSuccess {string} return text or HTML for images
    * @apiError {object} return null
    * @apiGroup Parameters   
    */       
   /**
    * Return the label to use for a tag or style
    * @param {string} tagOrStyle  The value to be labellised
    * @return {string} The displayable label
    * @apiGroup Register
    */    
    getTagOrStyleLabel( tagOrStyle) {
        let label = "";
        let lang = window.lang;
        let info = API.json.value( UD_exTagAndClassInfo, tagOrStyle);
        if ( info) {
            label = "";
            if ( lang != "EN") { label = API.json.value( info, "label_" + lang);}
            if ( !label) { label = API.json.value( info, 'label');}            
        } else { label = API.translateTerm( tagOrStyle);}
        if ( !label) { label = tagOrStyle;}
        return label;
    } // getTagOrStyleLabel()

    
   /**
    * @api {JS} API.availableTags(elementOrId) Return an array of available extended tags for an element
    * @apiParam {string} extag The extended tag
    * @apiSuccess {string[]} Array of class names
    * @apiGroup Parameters
    */
    availableTags( elementOrId) {
        let tags = [];
        let element = API.dom.element( elementOrId);
        let exTag = API.dom.attr( element, 'exTag');
        /*
        let tagMap = this.classMap[  "div.part."+API.dom.getViewType( element)][ 'elements'][ API.dom.attr( element, 'exTag')];
        if ( tagMap) { tags = Object.keys( tagMap);}
        */
        if ( !element) return tags;
        let gval = API.json.value;
        let viewType = API.dom.getViewType( element);
        if ( !viewType) return tags;
        for ( let exTag in this.info) {
            let info = this.info[ exTag];
            let viewTypes = gval( info, 'viewTypes');
            if ( typeof viewTypes == "undefined") continue; // !!! can happen when resources added
            if ( viewTypes == "all" || viewTypes.indexOf( viewType) > -1) tags.push( exTag);
        }
        return tags;       
    } // UD_ressources.availableTags()

    /**
    * @api {JS} API.listTypeClasses() Return an array of types used as classes
    * @apiParam {string} extag The extended tag
    * @apiSuccess {string[]} Array of class names
    * @apiGroup Parameters
    */
    listTypeAndSubTypeClasses() {
        let r = [];
        let viewTypes = API.json.parse( 'UD_nextViewIds');
        for ( let viewType in viewTypes) r.push( viewType.replace( / /g, '_'));
        for ( let exTag in this.info) {
            let type = this.info[ exTag][ 'ud_type'];
            let subType = this.info[ exTag][ 'ud_subType'];
            if ( type && r.indexOf( type) == -1) r.push( type);
            if ( subType && r.indexOf( subType) == -1) r.push( subType);
        }
        return r;      
    } // UD_ressources.listTypeAndSubTypeClasses()
    
   /**
    * @api {JS} API.availableClassesForExtag(extag) Return an array of available classes for the specified extended tag
    * @apiParam {string} extag The extended tag
    * @apiSuccess {string[]} Array of class names
    * @apiGroup Parameters
    */
    availableClassesForExtag( exTag, viewType = "doc", viewClass = "") {
        let classes = [];
        let gval = API.json.value;
        let info = this.info[ exTag];
        /*
        if ( exTag == "div.part") {
            classes = this.info[ exTag+'.'+viewType][ classes];    
        } else {
        */
        let classesByViewType = gval( info, 'classesByViewType');
        /*
        use selector = viewType or viewType.viewClass for better precision
        could rename classesByViewType as classesByViewTypeAndClass
        if ( classesByViewType) {
            if ( gval( classesByViewType, viewType)) classes = gval( classesByViewType, viewType);
            if ( gval( classesByViewType, 'default')) classes = classes.concat( gval( classesByViewType, 'default'));
        }
        Replac 155-158
        */
        classes = ( classesByViewType) ? 
            ( gval( classesByViewType, viewType)) ? 
                ( gval( classesByViewType, viewType)) : gval( classesByViewType, 'default') 
                : [];
        //console.log( info, classes, classesByViewType);                
        return classes;
    } // UD_ressources.getAvailableClassesForExtag()
    
   /**
    * @api {JS} API.availableClasses(elementOrId) Return an array of available classes for an element
    * @apiParam {string} extag The extended tag
    * @apiSuccess {string[]} Array of class names
    * @apiGroup Parameters
    */
    availableClasses( elementOrId, exTag="", viewType="", viewClass="") {
        let classes = [];
        let element = API.dom.element( elementOrId);
        if ( !exTag) exTag = API.dom.attr( element, 'exTag');
        if ( !viewType) viewType = API.dom.getViewType( element);
        classes = this.availableClassesForExtag( exTag, viewType, viewClass);
        let notLay = [];
        for ( let classi=0; classi < classes.length; classi++) {
            let className = classes[ classi];
            if ( className.indexOf( 'LAY_') == -1) { notLay.push( className);}
        }
        return notLay;       
    } // UD_ressources.availableClasses()
  
   /**
    * @api {JS} API.availableLayouts(elementOrId) Return an array of available layouts for an element
    * @apiParam {string} extag The extended tag
    * @apiSuccess {string[]} Array of class names
    * @apiGroup Parameters
    */
    availableLayouts( elementOrId) {
        let classes = [];
        let element = API.dom.element( elementOrId);
        let exTag = ( element) ? API.dom.attr( element, 'exTag') : elementOrId; //2DO availableLayoutsForExtag
        let viewType = API.dom.getViewType( element);
        classes = this.availableClassesForExtag( exTag, viewType);
        let lay = [];
        for ( let classi=0; classi < classes.length; classi++) {
            let className = classes[ classi];
            if ( className.indexOf( 'LAY_') == 0) { lay.push( className);}
        }
        return lay;     
    } // UD_ressources.availableLayouts()
  
     /**
    * @api {JS} API.availableLayouts(elementOrId) Return an array of available layouts for an element
    * @apiParam {string} extag The extended tag
    * @apiSuccess {string[]} Array of class names
    * @apiGroup Parameters
    */
    availableLayoutsForExTag( exTag) {
        let classes = [];
        if ( exTag == "div.part") {
            let gval = API.json.value;
            let info = this.info[ exTag];
            let w = gval( info, 'defaultContentByClassOrViewType');
            classes = Object.keys( w);
        } else classes = this.availableClassesForExtag( exTag, viewType);
        let lay = [];
        for ( let classi=0; classi < classes.length; classi++) {
            let className = classes[ classi];
            if ( className.indexOf( 'LAY_') == 0) { lay.push( className.replace( 'LAY_', ''));}
        }
        return lay;     
    } // UD_ressources.availableLayouts()

  
    /**
    * @api {JS} API.availableStylesForSelection(elementOrId) Return an array of styles for a selection in an element
    * @apiParam {string} extag The extended tag
    * @apiSuccess {string[]} Array of class names
    * @apiGroup Parameters
    */
    availableStylesForSelection( elementOrId) {
        let styles = [];
        let element = API.dom.element( elementOrId);
        let exTag = API.dom.attr( element, 'exTag');        
        let gval = API.json.value;
        let info = this.info[ exTag];
        let insertable = gval( info, 'insertableTags');
        for ( let className in insertable) { styles.push( className);}
        return styles;       
    } // UD_ressources.availableStylesForSelection()

    availableTagsForSelection( elementOrId) {
        let styles = [];
        let element = API.dom.element( elementOrId);
        let exTag = API.dom.attr( element, 'exTag');        
        let gval = API.json.value;
        let info = this.info[ exTag];
        let insertable = gval( info, 'insertableTags');
        for ( let className in insertable) { styles.push( "span." + className);}
        return styles;       
    } // UD_ressources.availableStylesForSelection()
   
    insertables( elementOrId) {
        let insertables = {};
        let element = API.dom.element( elementOrId);
        let exTag = API.dom.attr( element, 'exTag');
        let gval = API.json.value;
        let info = this.info[ exTag];
        insertables = gval( info, 'insertableTags');
        return insertables;
    } // UD_ressources.insertables()
    
    getViewTypeClass() {}
    getClassesForView() {}
    
    defaultContent( elementOrExTag, viewTypeOrClassName = "", asHTML = false) {
        let exTag = ( typeof elementOrExTag == "object") ? this.dom.attr( elementOrExTag, 'exTag') : elementOrExTag;
        if ( !viewTypeOrClassName && typeof elementOrExTag == "object") 
            viewTypeOrClassName = API.getViewType( elementOrExTag);
        let info = this.info[ exTag];
        let defaultContent = ""; 
        let defaultContents = API.json.value( info, 'defaultContentByClassOrViewType');
        if ( defaultContents && Object.keys( defaultContents).length) { 
            defaultContent = API.json.value( defaultContents, viewTypeOrClassName);
        }
        if ( !defaultContent) defaultContent = API.json.value( info, 'defaultContent');
        if ( !defaultContent) defaultContent = "..."; // { "para": {"tag":"p","value":"..."}};
        // 2DO label substitution but also in hasDEfaultContent OR Autoindex = label & no
        // Convert object to HTML if asHTML requested
        if ( typeof defaultContent == "object" && asHTML) defaultContent = API.json.toHTML( defaultContent);
        return defaultContent;
    } // UD_ressources.defaultContent()
        
    hasDefaultContent( elementOrId) {
        let element = this.dom.element( elementOrId);
        let exTag = this.dom.attr( element, 'exTag');
        return ( element.innerHTML == this.defaultContent( exTag));
    }

   /**
    * @api {JS} API.defaultAttrValue(exTag,attr) Return the default value of an attribute
    * @apiParam {string} extag The extended tag
    * @apiParam {string} attr Attribute name
    * @apiParam {object} values Use for recurrent calls
    * @apiSuccess {string} default value, "" if none
    * @apiGroup Parameters
    */    
    defaultAttrValue( exTag, attr, values = null) {
        let defaultValue = "";
        if ( attr.indexOf( 'data-') != 0) attr = "data-"+attr.replace( 'ude_', 'ude-');
        if ( !values) { values = UDE_attributeValues[ attr];}
        if ( typeof values == "undefined") return defaultValue;
        // Look up type-based default value
        defaultValue = API.json.valueByPath( values, exTag+'/'+attr);
        if ( !defaultValue) {
            // Look up general default value
            for ( let key in values) {
                let text = values[ key];
                if ( typeof text == "object") defaultValue = this.defaultAttrValue( attr, text.items);
                else if ( text.indexOf( '*default*') > -1) defaultValue = key;
                if (defaultValue) break;
            }
        }
        return defaultValue;
    } // UD_ressources.defaultAttrValue()
    

   /**
    * @api {JS} API.getEditorAttr(elementOrId,attr) Return the value of an editing attribute of an element
    * @apiParam {mixed} elementOrId The element, its id or selection query
    * @apiParam {string} attr Attribute name
    * @apiSuccess {string} attribute's value, "" if none
    * @apiGroup Parameters
    */    
    getEditorAttr( elementOrId, attr) {
        let element = this.dom.element( elementOrId);
        // Could be done in dom.attr
        if ( attr.indexOf( 'data-') == 0) attr = attr.replace( 'data-','').replace('-', '_');
        let attrValue = this.dom.attr( element, attr);
        if ( !attrValue) {
            // Look at textra parameter
            let textra = this.dom.attr( element, 'ud_extra');
            if ( !textra) textra = this.dom.parentAttr( element, 'ud_extra');
            if (textra) {
                textra = API.json.parse( textra);
                if ( textra) {
                    // Attributes in extra can be renamed by server
                    let attrTidy = ( attr.indexOf( 'data-') == 0) ? attr : "data-"+attr.replace( /_/g, '-');
                    attrValue = textra[ attr];
                    if ( !attrValue) attrValue = textra[ attrTidy];
                    if ( !attrValue) attrValue = textra[ attr.replace( 'ud_', '').replace( 'ude_', '')];
                }
            }
        }
        if ( !attrValue) attrValue = this.dom.parentAttr( element, attr);
        if ( !attrValue) {
            // Use default value
            attrValue = this.defaultAttrValue( this.dom.attr( element, 'exTag'), attr);
        }
        return attrValue;
    } // UD_ressources.getEditorAttr()
    
   /**
    * @api {JS} API.testEditorAttr(elementOrId,attr,value) Return true if attibute is on or contains value
    * @apiParam {mixed} elemetOrId The element, its id or selection query
    * @apiParam {string} attr Attribute name
    * @apiParam {string} value Use for recurrent calls
    * @apiSuccess {mixed} default value, "" if none
    * @apiGroup Parameters
    */        
    testEditorAttr( elementOrId, attr, value) {
        let attrValue = this.getEditorAttr( elementOrId, attr);
        let docModeHolder = this.dom.element( 'UD_mode');
        let elementMode = "edit2";
        if ( docModeHolder) elementMode = docModeHolder.textContent;       
        if ( elementMode == "edit3" && [ 'ude_edit', 'ude_menu'].indexOf( attr) > -1) attrValue = "on";
        return ( attrValue == "on" || ( value && attrValue.indexOf( value) > -1) );
    } // // UD_ressources.testEditorAttr()
    
    getParameter( name, scope="global") {
        let r = "";
        if ( scope == "global") {
            r = this.dom.udjson.value( UD_register[ 'UD_parameters'], name);
        } else {
            let holder = API.dom.element( 'UD_' + name);
            if ( holder) r = holder.textContent;   
            else return debug( {level:2, return: ""}, "can't find UD_"+name);
        }
        if (r && typeof r == "string") {
            let r_lower = r.toLowerCase();
            if ( [ 'yes', 'no', 'on', 'off'].indexOf( r_lower) > -1) return r_lower;
        }
        return r;
    } // API.getParameter()
    
    getConstant( set, name) {
        // 2DO search UD_register.UD_parameters or this.register
        let value = set[ name];
        let userId = this.getParameter( 'userId');
        let userIdb32 = parseInt( userId, 10).toString( 32);
        userIdb32 = ("00000"+userIdb32).substring( userIdb32.length);
        value = value.replace( "{userId}", userId).replace( "{userId_base32}", userIdb32);
        return value;
    }
    
   /*
    * @api {JS} API.hasLanguageSuffix(term) return true if term ends with langauge code
    */
    hasLanguageSuffix( term) {
        let last2 = term.substr( term.length-2);
        let languageCodes = this.getParameter( 'languageCodes');
        if ( languageCodes.indexOf( last2)) return true;
        return false;
    }
   /*
    *  WRITING Ressources
    */   

   /**
    * @api {JS} API.setEditorAttr(elementOrId,attr,value) Set the value of an editing attribute of an element
    * @apiParam {mixed} elementOrId The element, its id or selection query
    * @apiParam {string} attr Attribute name
    * @apiParam {string} value ATtribute value
    * @apiSuccess {string} attribute's value, "" if none
    * @apiGroup Parameters
    */    
    setEditorAttrPermanently( elementOrId, attr, value) {
        let element = this.dom.element( elementOrId);
        let saveable =  this.dom.getSaveableParent( element);
        // Convert booleans to string
        if ( typeof value == "boolean") value = (value) ? "on" : "off";
        // Set live value
        let attrValue = this.dom.parentAttr( element, attr, value);
        if ( element  == saveable) {
            // Set saveable value
            let textra = this.dom.attr( element, 'ud_extra');
            textra = ( textra) ? API.json.parse( textra) : {}; 
            textra[ attr] = value;
            this.dom.attr( element, 'ud_extra', JSON.stringify( textra));
        }
        API.setChanged( saveable);
        return value;
    } // UD_ressources.setEditorAttrPermanently()

    setLiveEditorAttrs( elementOrId) {
        // Find textra
        // Loop throught values UDE_attributeValues
            // remove data-ude
            // Set values directly not saved
    }
    
    refreshResource( resourceName) {
       if ( resourceName == "UD_tagAndClassInfo") this.info = API.json.parse( "UD_tagAndClassInfo");  
    }
  
  /**
    * @api {JS} API.updateClassMap(objectOrJSON) Update class map with provided data
    * @apiParam {mixed} objectOrJSON Object data or JSON 
    * @apiSuccess {string} return text or HTML for images
    * @apiError {object} return null
    * @apiGroup Parameters   
    */       
   /**
    * Update class map
    * @param {string} tagOrStyle  The value to be labellised
    * @return {string} The displayable label
    */    
    updateClassMap( json) {
        // DEPRECTED
        console.error( "Call to deprecated updateClassMap() in udresources.js");
        API.json.merge( this.classMap, json);
        let mapHolder = API.dom.element( "UD_classMap");
        if ( mapHolder) { mapHolder.textContent = JSON.stringify( this.classMap);}
    } // UD_ressources.updateClassMap()
    
    updateResource( resourceOrName, json) {     
    /* DEPRECATED #2222007
        let holder = API.dom.element( resourceName);
        if ( resourceName == "class map") { holder = API.dom.element( 'UD_classMap');}
        if ( !holder) return;
        //!!! 2DO Extract fro data/value        
        */        
        json = API.json.value( json, 'resource', "", "delete");
        let resource = ( typeof resourceOrName == "object") ? resourceOrName : API.json.parse( resourceOrName);
        resource = API.json.merge( resource, json);
        return resource;
        //this.info = API.json.parse( "UD_tagAndClassInfo");  
        /*
        let mapHolder = API.dom.element( "UD_classMap");
        if ( mapHolder) { mapHolder.textContent = JSON.stringify( this.classMap);}
        */
    } // UD_ressources.updateResource()

   /**
    * @api {JS} API.loadRessourceFile(filepath) Load ressources from a file
    * @apiParam {string} filepath URL of file
    * @apiSuccess {string} return true
    * @apiError {object} return null
    * @apiGroup Parameters 
    */       
   /**
    * Load ressources from a file
    * @param {string} tagOrStyle  The value to be labellised
    * @return {string} The displayable label
    */    
    loadResourceFile( filepath) {
        // Get file name and assume variable will be created with this name
        let name = "standalone";
        // Prepare onload call
        let onload = "API.loadRessources( name);"
        // Load script
        API.loadScript( filepath, onload);
    } // UD_ressources.loadRessourcesFromFile()

   /**
    * @api {JS} API.loadRessources(ressources) Load ressources defined in an object
    * @apiParam {object} ressources Ressources to laod with action & data
    * @apiSuccess {string} return true
    * @apiError {object} return null
    * @apiGroup Parameters 
    */       
   /**
    * Load ressources from a file
    * @param {string} tagOrStyle  The value to be labellised
    * @return {string} The displayable label
    */    
    loadResources( ressources) {
        // Run through the list of ressources and add them as defined by action
        for ( let ressourceKey in ressources) {
            let ressource = ressources[ ressourceKey];
            let action = ressource.action;
            let dataSet = ressource.data;
            for ( let dataKey in dataSet) {
                let data = dataSet[ dataKey];
                switch ( action) {
                    case 'insertRule' :
                    
                    case 'insertCSSmap' :
                    
                    case 'insertClassMap' :
                    
                    case 'insertTerm' :
                    
                    case 'putElement ' :
                    
                    case 'createUserFunction' :
                    
                    case 'loadFile' :
                }
            }
        }
    } // UD_ressources.loadRessources()
        
} // JS class UD_ressources

/**
 * Setup UD_ressources module
 * Called by UDapi which is the first module loaded by UD.js
 */
function UD_ressources_init( ud, api) {
    // console.log( new Error().stack);
    let module = new UD_ressources( ud, api);
    return module;
}
if ( typeof process != 'object') {
   // setTimeout( function() { UD_ressources_init();}, 1500); 
   // UD_ressources_init();
} else {
    // Testing under node.js 
    module.exports = { class:UD_ressources, init:UD_ressources_init};
    //let ressources = UD_ressources_init();    
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined" && typeof ModuleUnderTest == "undefined") {
        // Auto test
        console.log( 'Syntax:OK');    
        console.log( 'Start of UD_ressources class test program');
        console.log( "Setting up browser (client) test environment"); 
        ModuleUnderTest = "udressources";
        let path = "..";
        const testMod = require( path+'/tests/testenv.js');      
        testMod.load( []);
        let ud = new UniversalDoc( 'document', true, 133); 
        // Pure local tests
        {
            let test = "1 - availableClassesForExtag";
            let classes = API.availableClassesForExtag( "p");
            testResult( test, classes.indexOf( "standard") > -1, classes);
        }
        {
            let test = "2 - availableClasses";
            let classes = API.availableClasses( "B0100000001000000M");
            testResult( test, classes.indexOf( "standard") > -1, classes);
        }
        {
            let test = "3 - insertables";
            let types = API.insertables( "B0100000001000000M");
            testResult( test, types[ "field"], types);
        }

        // End of auto-test        
        console.log( "Test completed");
        process.exit();        
    }
}