/**
 *  udcontent.js
 *    API functions to initialise content 
 *
 */


class UD_content {
    info;
    constructor() {
        this.info = UD_exTagAndClassInfo;
        if ( typeof window.API != "undefined") { 
            window.API.addFunctions( this, [ 
                "updateContentAfterEvent", "checkContent", "replaceModelInElement", "extractDataFromContent", 
                "getUndefinedElementContent"
            ]);
        }

    }
    
    getUndefinedElementContent( elementOrId) {
        let dom = $$$.dom;
        let val = $$$.json.value;
        let element = dom.element( elementOrId);
        let saveable = dom.getSaveableParent( element);
        if ( !element || !saveable) { return;}
        let editable = dom.getEditableParent( element);
        let selector = dom.getSelector( element);
        let exTag = dom.attr( element, 'exTag');
        let exTagA = exTag.split( '.');
        // Get extended tags and sub-types
        let availableTags = $$$.availableTags( editable);
        // Build tag selector content as object
        let tagSelectorPanel = {};
        let active = "";
        let filter = "";
        if ( exTagA.length == 2) filter = exTagA[1];
        for ( let tagi=0; tagi < availableTags.length; tagi++) {
            let tag = availableTags[ tagi];
            if ( tag == "p.undefined") continue;
            let tagInfo = $$$.getTagOrStyleInfo( tag);
            let tagLabel = ( lang != "EN") ? val( tagInfo, "label_" + lang) : "";
            if ( !tagLabel) tagLabel = val( tagInfo, 'label');
            let tagIcon = val( tagInfo, 'icon');
            let size = 2;
            if (tag == "h1") size = 3; else if ( tag =="h2") size = 2.5;
            // let iconAndLabel = [{ "tag":"span", "class":"panel-icon", "value":{ "tag":"img", "src":tagIcon}}, { "value":tagLabel}];
            let iconAndLabel = ( tagIcon) ? 
                [{ "tag":"img", "src":UDincludePath + 'resources/images/'+ tagIcon, "style":"width:"+size+"em;"}, { "value":" "}]
                : { "value":tagLabel}
            let tagParts = tag.split( '.');
            if ( (filter && ( tagParts[1] != filter || tagParts.length < 3)) || (!filter && tagParts.length > 2)) continue;
            let nExTag = tagParts.slice( 0, 2).join( '.');
            let nSubtype = ( tagParts.length > 2) ? tagParts[ 2] : "";
            let action = "let el = $$$.changeTag( '"+ nExTag + "', " + selector + ", '" + nSubtype + "'); $$$.displayMenu( el);";           
            tagSelectorPanel[ tagLabel] = { tag:"a", class:"panel-block"+active, onclick: action, title:tagLabel, value:iconAndLabel};
        }
         // Compile box         
        let contentData = { "tag":"div", "class":"panel-block is-wrapped", "value":tagSelectorPanel};
        let contentEl = API.json.putElement( contentData, false);
        let content = contentEl.outerHTML;
        //this.dom.attr( content, 'contenteditable', "false");
        //this.dom.attr( this.dom.element( "span.objectName", content), 'contenteditable', "true");
        return content;
    }



    
   /**
    * @api {JS} API.updateContentAfterEvent(elementOrId,event) Update an element's content after an editing event
    * @apiParam {mixed} elementOrId An element, an id or a query selector object
    * @apiParam {object} event object with eventType and parameters for ex eventType:"changeTag", oldTag:"tag"    
    * @apiSuccess {boolean} True if content was changed
    * @apiGroup HTML
    */    
    updateContentAfterEvent( elementOrId, event=null) {
        // Shortcuts for API.dom & API.json.value
        let dom = API.dom;
        let gval = API.json.value;
        // Check parameters
        let element = dom.element( elementOrId);
        let saveable = dom.getSaveableParent( element);
        if ( !saveable) return;
        let exTag = dom.attr( saveable, 'exTag');
        let eventType = (event) ? event.eventType : "";
        let update = false;
        // Check if element is to be updated
        if ( eventType == "emptyView" || eventType == "update") update = true;
        else {
            // OK if it has default content
            update = (
                ( event.wasUndefined)
                ||
                ( eventType == "changeTag" && API.hasDefaultContent( saveable, event.oldTag))
                ||
                ( eventType == "changeClass" && API.hasDefaultContent( saveable, exTag, event.oldClass))
            );
        }
        if (update) {
            // Update element with default content corresponding to the event
            // Get element's layout class
            let layout = "";
            let classes = element.classList;
            for ( let classi=0; classi < classes.length; classi++) { 
                let className = classes.item( classi);
                if ( className.indexOf( 'LAY_') == 0) { 
                    layout=className;
                    break;
                }
            }
            let processed = false;
            let info = gval( this.info, exTag);
            if ( exTag == "div.part") info = gval( this.info, exTag + '.' + dom.attr( element, 'ud_subtype'));
            // 2DO Move some of this to defaultContentByPath 
            let pathContent =  gval( info, 'defaultContentPath');
            if ( pathContent) {
                // DefaultContentPath is set. This is for changing a value inside a JSON100 object
                let classname = dom.keepPermanentClass( saveable.className);
                if ( classname) {
                    // Get default content for this class
                    let info2 =  gval( info, 'defaultContentByClassOrViewType');
                    let defaultContent = gval( info2, classname);
                    if ( defaultContent) {
                        // Set content & initialise
                        let name = dom.attr( saveable, 'name');
                        let holder = name+'_object', element;
                        //let obj = this.dom.element( '#'+name+'_object', element);
                        dom.udjson.valueByPath( holder, pathContent, defaultContent);
                        $$$.initialiseElement( saveable);
                        processed = true;
                    }
                }
            }
            if ( !processed) {
                // Get default content         
                let defaultContent = gval( info, 'defaultContent');
                if ( defaultContent == "__UNDEFINED__") {
                    defaultContent = this.getUndefinedElementContent( saveable);
                }                
                /*
                // use Layout class
                if ( layout) { 
                    // Get default content for specific layout
                    let info2 = gval( info, 'defaultContentByClassOrViewType');
                    info2 = gval( info2, layout);
                    if ( info2) defaultContent = info2;
                }*/ 
                if ( event.newClass) { 
                    // Get default content for specific class
                    let info2 = gval( info, 'defaultContentByClassOrViewType');
                    info2 = gval( info2, event.newClass);
                    if ( info2) defaultContent = info2;
                }                    
                // console.log( exTag, layout, info, defaultContent);
                if ( !defaultContent) defaultContent = { "para": {"tag":"p","value":"..."}};
                // Write default content
                // BUG confusion between old and new default content
                if ( exTag == "div.part" || exTag == "div.zone") { 
                    return this.setViewContent( element, defaultContent);
                } else { 
                    element.innerHTML = API.json.toHTML( defaultContent);
                    $$$.dom.attr( element, 'ude_place', element.textContent);
                }
            }
        } // end of update
    } // UD_content.updateContentAfterEvent()

   /**
    * @api {JS} API.checkContent(elementOrId) Update an element's content after an editing event
    * @apiParam {mixed} elementOrId An element, an id or a query selector object
    * @apiSuccess {boolean} True if content was changed
    * @apiGroup HTML
    */
    checkContent( elementOrId) { return this.updateContentAfterEvent( elementOrId, { eventType:'update'});}

    
    setViewContent( viewOrId, defaultContent) {
        let view = API.dom.element( viewOrId);
        let page = view;
        let dom = API.dom;
        // Look if structure is the same
        let children = view.childNodes;
        if ( API.dom.attr( children[ 0], 'exTag') == "div.page") {
            page = children[ 0]; // 2DO multiple pages
            children = page.childNodes;
        }
        let childi = 0;
        let structureOK = true;
        for ( let key in defaultContent) {
            let el = defaultContent[ key];
            if ( childi >= children.length || (el.tag + '.' + el.type) != API.dom.attr( children[ childi], 'exTag')) {
                structureOK = false;
                break;
            }
            childi++;
        }
        if ( !structureOK) {
            // Append default content and transfert content
            for ( let key in defaultContent) {
                // Append element to view (2DO or page)
                // 2DO Substitutions in defaultContent values or maybe in json substitute( json, variables)
                let el = API.json.putElement( defaultContent[ key], false);
                page.appendChild( el);
                if ( dom.attr( el, 'exTag') == "span") continue;
                if ( typeof process != "object") { window.ud.viewEvent( 'create', el);}
                // Assume ( if) el is div.zone create each child
                let elChildren = dom.children( el);
                let onUpdate = null;
                if ( elChildren.length) {
                    onUpdate = function( parent) {
                        let dom = window.ud.dom;
                        let children = parent.childNodes;
                        for ( let childi=0; childi < children.length; childi++) {
                            let child = children[ childi];
                            if ( dom.attr( child, 'exTag') == "span.caption") continue;
                            if ( typeof process != "object") { window.ud.viewEvent( 'create', child);}
                        }
                    }
                }
                console.log( "Update", el.id, onUpdate);
                if ( onUpdate) { API.dom.attr( el, 'ud_onupdate', API.onTrigger( el.id, 'update', onUpdate));}
            }               
            // Delete existing content
            for ( let childi=0; childi < children.length; childi++) {
                let child = children[ childi];
                if ( child.nodeType == Node.TEXT_NODE) child.remove();
                else window.ud.viewEvent( 'remove', children[ childi]);
            }
        }
    } // UD_content.setViewContent()

   /**
    * @api {JS} API.replaceModelInElement(elementOrId,currentModel,newModel) Update an element's content based on models
    * @apiParam {mixed} elementOrId An element, an id or a query selector object
    * @apiParam {string} currentModel Name of element's current model
    * @apiparam {string} newModel Name of model to use
    * @apiSuccess {boolean} True if content was changed
    * @apiGroup HTML
    */        
    replaceModelInElement( elementOrId, currentModel, newModel) {
        // Get HTML
        let element = API.dom.element( elementOrId);
        let html = element.innerHTML;
        // Extract data from html
        let data = this.extractDataFromContent( html, currentModel);
        if ( Object.keys( data).length == 0) return html;
        // Find new model
        let templateHolder = API.dom.element( newModel + 'viewZone');
        let template = templateHolder.innerHTML; // API.calc.textContent2HTML
        // Substitute data into new model       
        let newHTML = API.calc.substitute( template, data);
        // Update element
        element.innerHTML = newHTML;
        API.setChanged( element);
        return newHTML;        

    } // UD_content.replaceModelInELement(), API.replaceModelInELement()
    
   /**
    * @api {JS} API.extractDataFromContent(html,model) Extract data substituted into HTML
    * @apiParam {string} html An HTML string
    * @apiparam {string} model Name of an HTML model
    * @apiSuccess {boolean} True if content was changed
    * @apiGroup HTML
    */        
    extractDataFromContent( html, model) {
        let markers = [];
        let fieldNames = [];
        let viewZoneId = model + "viewZone"
        let modelContent = API.dom.element( viewZoneId).innerHTML;
        // Find HTML code markets that seperate substituted fields
        {
            let p1 = 0;
            let p2 = modelContent.indexOf( '{', p1);
            while ( p2 > -1) {
                let p3 = modelContent.indexOf( '}', p2);
                if ( p3 <= 0) { break;}
                fieldNames.push( modelContent.substring( p2+1, p3));
                let p4 = modelContent.indexOf( '{', p3);
                markers.push( modelContent.substring( p1, p2));
                if ( p4 > -1) markers.push( modelContent.substring( p3+1, p4)); else markers.push( modelContent.substring( p3+1));
                p2 = p4;
                p1 = p3+1;
            }
        }
        // Use markers to extract fields
        let data = {};        
        for ( let fieldi=0; fieldi < fieldNames.length; fieldi++) {
            let m1 = markers[ 2 * fieldi];
            let p1 = html.indexOf( m1);
            let p2 = html.indexOf( markers[ 2 * fieldi + 1]);
            if ( p1 > -1 && p2 > -1) { data[ fieldNames[ fieldi]] = html.substring( p1 + m1.length, p2);}
            else { data[ fieldNames[ fieldi]] = "";}           
        }
        return data;        
    }  // UD_content.extractDataFromContent(), API.extractDataFromContent() 
    
    // 2DO buildContentFromModelAndData
    
    isDefaultContent( elementOrId) { return API.hasDefaultContent( elementOrId);}
} // JS class UD_content

function UD_content_init() {
    let module = new UD_content( window.ud);
    return module;
}
if ( typeof process != 'object') {
   // setTimeout( function() { UD_content_init();}, 1500);
    // UD_content_init();   
} else {
    // Testing under node.js 
    module.exports = { class:UD_content, init:UD_content_init};
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined" && typeof ModuleUnderTest == "undefined") {
        // Auto test
        console.log( 'Syntax:OK');    
        console.log( 'Start of UD_ressources class test program');
        console.log( "Setting up browser (client) test environment"); 
        ModuleUnderTest = "udcontent";
        let path = "..";
        const testMod = require( path+'/tests/testenv.js');      
        testMod.load( []);
        let ud = new UniversalDoc( 'document', true, 133); 
        //let contentManager = UD_content_init();
        // Pure local tests
        {
            let test = "1 - view setup with checkContent";
            // Find or add view
            let view = API.dom.elementByName( "view2");
            if ( view) {           
                // Set class to LAY_thirds
                view.classList.add( 'LAY_thirds');
                // Check content
                API.checkContent( view);
            }
            console.log( view.innerHTML);
            testResult( test, view && view.innerHTML.indexOf( 'zone') > -1, view);
        }
        // 2DO HTML extractData etc
        /*
        {
            let test = "2 - availableClasses";
            let classes = API.availableClasses( "B0100000001000000M");
            testResult( test, classes.indexOf( "summary"), classes);
        }
        {
            let test = "3 - insertables";
            let types = API.insertables( "B0100000001000000M");
            testResult( test, types.indexOf( "field"), types);
        }
        */
        // End of auto-test        
        console.log( "Test completed");
        process.exit();        
    }
}