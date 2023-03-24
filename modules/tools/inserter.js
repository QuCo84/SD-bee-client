/* *****************************************************************************************
 * inserter.js    2DO rename tagger.js
 *   Tool for setting HTML tag of elements and inserting new elements
 *
 * 2020-03-17 - creation
 *
 * (C) Quentin Cornwell 2020
 */
 
 // 2DO Rename tagger
 class Inserter
 {
   // Parameters
   serverResponseTime = 3000;                   // time to send an element to server
   defaultLabelMap = { 
        'h1':'chapter',
        'h2':'section', 
        'h3':'sub_section', 
        'h4':'sub_sub_section', 
       // paragraph_group: 'h5', 
       // sub_paragraph_group: 'h6',      
        'p':'paragraph', 
        'div.connector' : 'connector',
        'div.connector.csv':'csv',
        'div.connector.googleCalendar':'G Cal',
        'div.connector.site':'site',
        'div.connector.document':'document',
        'div.connector.service':'service',
        'div.connector.dataGloop':'gloop',
    }
    $icons = [];
    primaryTags = {}                            // List of labels to tags handled by editor (tag or tag.class format)
    modelTags = {
        style_sheet:'div.css', 
        javascript:'div.js', 
        zone:'div.zone'              
    }
    insertableTags = {                       // Insertable elements by primary tag label OBSOLETE
        paragraph: { field:'span.field', button:'span.button', link:'span.link', styled:'span'}, 
        list: { field:'span.field', button:'span.button', link:'span.link'},
        li: { field:'span.field', button:'span.button', link:'span.link'},
        table: { field:'span.field', button:'span.button', link:'span.link'}, 
        spread: { spread:'span.spread'},
        page : { paragraph:'p'}
    };
    convertPtoTags = {
        chapter:'h1', section:'h2', sub_section:'h3'    
    };
    attachedClasses = {};                    // Classes to attach to tag (built at start-up)
    viewClasses = [                          // Lst to detect the class of a view. 2DO build automatically from classMap
        "doc", "synopsis", "model", "language", "data", "clipboard", 
        "system", "middleware", "style", "program", "public"
    ];
    // 2DO use constants
    /*
    defaultContent = {
        page:"",
        subpart:"",
        chapter: "...",                            // Titles
        section: "...", 
        sub_section:"...", 
        sub_sub_section:"...", 
        paragraph_group: "...", 
        sub_paragraph_group: "...",      
        paragraph: "...",  
        sub_paragraph: "...",
        table: "Table{AutoIndex_table}",
        list: "List{AutoIndex_list}", 
        illustration: "Illustration{AutoIndex_graphic}", 
        linetext: "Text{AutoIndex_text}", 
        server: "Server{AutoIndex_server}", 
        css: "Style{AutoIndex_style}", 
        js: "Javascript{AutoIndex_js}", 
        json: "JSON{AutoIndex_json}",
        connector: "Connector{AutoIndex_connector}",
        zone: "zone{id}",
        field: "...", 
        button: "..."        
    };
    insertModelTags = {
        'div.page': "Page model",
        'div.subpart' : "Subpart model",
        'div.zone' : "Zone model"
    }
    */
    // Pointers
    ud;
    ude;
    dom;
    cursor;
    calc;
    displayElement;
    
    // Cache
    classMap = null;
 
    
    // Reminder - fixed parameter set for tools
    constructor( ud, displayId)
    {
        this.ud = ud;
        if (ud)
        {
            // Set pointers to other useful instances
            this.ude = ud.ude;
            if ( ud.ude) this.calc = this.ude.calc;
            this.dom = ud.dom;
            // Build list of tags
            let exTags = this.ud.exTagMap;
            for ( let exTagKey in exTags)
            {
                let exTag = exTags[ exTagKey];
                let exTagParts = exTag.split( '.');
                let tagLabel = "";
                if ( typeof this.defaultLabelMap[ exTag] != "undefined") tagLabel = this.defaultLabelMap[ exTag];
                else if ( exTagParts.length > 1) tagLabel = exTagParts[ exTagParts.length - 1];
                else tagLabel = exTag;
                this.primaryTags[ tagLabel] = exTag;
            }
            if (this.dom)
            {
                this.cursor = this.dom.cursor;
                // Build list of available tags according to mode
                let modeHolder = this.dom.element('UD_mode');
                if ( modeHolder && modeHolder.textContent == "edit3") this.primaryTags = Object.assign( this.primaryTags, this.modelTags);
            }
        }
        // Where do we display ?
        this.displayElement = document.getElementById( displayId);
        // Retrieve icons
        let iconHolder = this.dom.element( 'UD_icons');
        if ( iconHolder) { this.icons = this.dom.udjson.parse( iconHolder.textContent);}
        // Global variable pointing here
        window.Inserter = this;
    }
    
    event( eventName)
    {
        switch (eventName)
        {
            case "open" :
                var list = this.getList();
                this.displayElement.innerHTML = list;
                break;
        }
    } // Inserter.event()

    // Return a p html string with list of insertable elements
    getList( elementId = 0)
    {
        let current = null;
        let saveable = null;
        if (!elementId && !this.cursor.HTMLelement) return;
        if ( !elementId) current = this.dom.getDisplayableParent( this.cursor.HTMLelement); 
        else current = this.dom.getDisplayableParent( this.dom.element( elementId));
        saveable = this.dom.getSaveableParent( current);
        if (!current) return;
        if ( this.dom.cursor.selectionInNode || this.dom.cursor.selectionMultiNode)
        {
            console.log( "Spread detected", this.dom.cursor);
            // 2DO if selectionInNode then spread. possible to insert 
        }
        if (!elementId) elementId = current.id;
        let currentTag = "";
        let currentTagLabel = "";
        let w;
        //if (!current) return;
        if ( saveable)
        {
            currentTag = saveable.tagName.toLowerCase();
            if ( ( w = this.dom.attr( saveable, 'ud_type'))) currentTag += "."+w;
            // 2DO se if para is recent or empty
        }
        // Get list of elements required for part based on part's class
        // 2DO get childClassesByTag div.part   p block etc if none then no selection
        // Build list for display  
        let display = "";
        let radio = '<input name="Tagger_mode" id="tagger_insert" type="radio" value="Insertion" /><span>Insert</span>';
        radio += '<input name="Tagger_mode" id="tagger_replace" type="radio" checked value="Replacement" /><span>Replace</span>';
        // Always insert display += "<p><span>Select tag for : </span>"+radio+"<br>";
        display += '<p><span>Select element to insert after current element :</span><br>'; 
        display += "<ul>";                
        // Display available tags and styled tags
        let viewType = API.dom.getViewType( saveable);
        let tags = API.availableTags( saveable);
        if ( !tags) return "";        
        for ( let tagi=0; tagi < tags.length; tagi++)
        {
            let tag = tags[ tagi];
            let tagLabel = API.getTagOrStyleLabel( tag);
            if ( tag == currentTag) currentTagLabel = tagLabel;
            // Get available styles
            let classList = API.availableClassesForExtag( tag, viewType);
            // 2DO experiment only display tags with available class, or class in this div
            if ( classList && classList.length)
            {    
            // Display element type with default insert
            // 2DO saveable or displayable 
            let onclick = "window.Inserter.insertElement( null, '"+tag+"', '"+elementId+"', 'default');";            
            display += '<li><a href="javascript:" onclick="'+onclick+'", ude_p1="'+elementId+'">';
            display += tagLabel;
            display += '</a><ul>';            
            for( var classi=0; classi < classList.length; classi++)
            {                
                let className = classList[ classi];
                if ( className == "") continue;
                // var onclick = "window.Inserter.replaceTag( '"+tagLabel+"', '"+elementId+"');";
                onclick = "window.Inserter.insertElement( null, '"+tag+"', '"+elementId+"', '"+className+"');";
                display += '<li><a href="javascript:" onclick="'+onclick+'", ude_p1="'+elementId+'">';
                if (this.ud) display += API.translateTerm( className);
                else display += /*tagLabel+'.'+*/className;
                display += '</a></li>';
            }    
            display +='</ul></li>';
            }
        }
        /*
        if ( typeof ( tags = this.insertableTags[ currentTagLabel]) != "undefined")
        {
            //var tags = this.insertableTags[ currentTagLabel];
            for ( tagLabel in tags)
            {
                var tag = tags[ tagLabel];
                var onclick = "window.Inserter.insertElement( '"+currentTagLabel+"', '"+tagLabel+"', this.getAttribute( 'ude_p1'));";
                display += '<li><a href="javascript:" onclick="'+onclick+'", ude_p1="'+elementId+'">';
                if (this.ud) display += API.translateTerm( tagLabel);
                else display += tagLabel;
                display += '</a></li>';
            } 
        }
*/        
        display += '</ul>';
        if ( currentTag == "p")
        {
            display += '<p><span>Convert current paragraph to :</span><br>'; 
            display += "<ul>";                
            for ( let tagi=0; tagi < tags.length; tagi++)
            {
                let tag = tags[ tagi];
                let tagLabel = API.getTagOrStyleLabel( tag);
                if ( tag == currentTag) currentTagLabel = tagLabel;
                var onclick = "window.Inserter.replaceTag( '"+tag+"', '"+elementId+"');";
                display += '<li><a href="javascript:" onclick="'+onclick+'", ude_p1="'+elementId+'">';
                if (this.ud) display += API.translateTerm( tagLabel);
                else display += tagLabel;
                display += '</a></li>';           
            }
            display += "</ul>";
            display += '</p>';
            // 2DO More link for para groups etc
        }
        // 2DO if spread (selection) show spread styles
        return display;
    } // Inserter.list()
    
    // Replace an element's tag
    replaceTag( tagLabel, elementId = null)
    {
        let radio = document.getElementsByName( 'Tagger_mode');
        if ( !radio) return;
        let replaceOrInsert = "";        
        for (var i=0; i < radio.length; i++)
            if ( radio[i].checked) replaceOrInsert = radio[i].value;
        if ( replaceOrInsert == "Insertion") return this.insertElement( null, tagLabel, elementId);
        if (!elementId) elementId = this.cursor.HTMLelement.id;
        if (!elementId) return debug( { level:2}, "No cursor element");
        var tag = this.primaryTags[ tagLabel];
        var tagName = tag;
        var typeName = "";
        var p1;
        if ( ( p1 = tag.indexOf('.')) > 0)
        {
            var className = tag.substr( p1);
            var typeName = tag.substr( 0, p1-1);
        }
        // Find index of authorised tag 
        var tagIndex = this.dom.availableTags.indexOf( tag);
        if ( tagIndex < 0) return ( {level:2, return: false}, "Can't find tag ", tag);
        this.ude.changeTag( tagIndex, elementId);
        /* Obsolete
        var apiRequest ={ caller:'Inserter', command:'changeTag('+tagIndex+', /'+elementId+'/);', quotes:'//'};
        // var apiRequest ={ caller:'Inserter', command:'changeTag(/'+elementId+'/, /'+tagName+'/, /'+typeName+'/);', quotes:'//'};
        new UDapiRequest( apiRequest);
        */
    } // Inserter.replaceTag()
    
    // Insert an element
    insertElement( tagLabel, insertableTagLabel, elementId = 0, className="")
    {
        // 2DO add beforeFalseAfterTrue
        // 2DO if inserting "spread" then seperate  fct
        
        // Get element where to insert
        let element = null;
        if ( elementId) element = this.dom.element( elementId);
        else element = this.cursor.HTMLelement;
        if (!element) return debug( { level:2}, "Can't find element or no cursor", elementId);
        // Get extended tag 
        let exTag = insertableTagLabel;
        if ( tagLabel && typeof this.insertableTags[ tagLabel][ insertableTagLabel] != "undefined") {
            exTag = this.insertableTags[ tagLabel][ insertableTagLabel];
        } // else if ( exTag.indexOf( '.') == -1) { exTag = this.primaryTags[ insertableTagLabel];}
        // Divide into tagName and attributes
        let tag = exTag.split('.')[0];
        let type = "";
        let subType = "";
        if ( exTag.indexOf('.') > 0)
        {
            let exTagParts = exTag.split( '.');
            tag = exTagParts[0];
            type = exTagParts[1];
            if ( exTagParts.length > 2) subType = exTagParts[2];
        }
        // Prepare attributes
        let attributes = {};
        if ( className == "default") className = "";
        if ( type)
        {
            className = type + ' '+ className;
            attributes = { ud_type: type, class: className};
        }            
        else if ( className) attributes = { class: className}; 
        if ( subType) attributes.ud_subtype = subType;
        if ( tag == 'span') attributes['ude_stage'] = "on";        
        // Prepare insertion
        let dbElement = this.dom.getSaveableParent( element);
        let domElement = this.dom.getDisplayableParent( element);
        let at = dbElement;
        let beforeFalseAftertrue = true;       
        let inside = false;
        if ( 
            ( tagLabel && typeof this.insertableTags[ tagLabel][ insertableTagLabel] != "undefined")
            || tag == "span"
        ) {
            at = domElement;
            inside = true;
        }
        let content = API.defaultContent( exTag);
        // Adjust where to insert
        // if exTag == div.page and element's parent is page with id, then insert after page
        // if type and element's parent is this type then insert after parent        
        // Insert element
        // 2DO if inside && spam then use API.insertHTMLatCursor
        // INSERT 
        if ( tag == "span" && inside) {
            // Use insertHTMLatCursor to insert content in existing element
            let html = '<span class="' + type + '" ud_type="' + type + '" ude_stage="on">';
            html += "...";
            html += "</span>";
            API.insertHTMLatCursor( html);
        } else {
            let newElement = this.dom.insertElement( tag, content, attributes, at, beforeFalseAftertrue, inside);
            if ( newElement)
            {
                // New element is created in DOM
                // Use inside to determine weither newElement is saveable, elements in page always
                let newIsSaveable = true;
                if ( inside && tagLabel != "page") newIsSaveable = false;
                // Prepare new element for saving or set change on parent
                if ( newIsSaveable)
                {
                    // New element is a distinct saveable element
                    this.ud.viewEvent( "create", newElement);
                    if ( className) this.ude.initialiseElement( newElement.id);                
                }
                else
                {
                    // New element is inside an existing saveable element
                    // 2DO Add an id anyway use parent id+time or ticks 
                    this.ud.viewEvent( "change", element);
                    // newElement = element;
                }
                // Detect if child elements are required under new element
                if ( typeof this.insertModelTags[ exTag] != "undefined")
                {
                    // Look for model
                    let model = this.dom.element( 'div[name="'+this.insertModelTags[ exTag]+'"]', this.ud.topElement);
                    // Prepare insert call for children
                    let fct = null;
                    if ( model) fct = function() { window.ud.api.utilities.deepCopy( model.id, newElement.id);};
                    else fct = function() { window.Inserter.insertElement( 'page', 'paragraph', newElement.id);};
                    // Trigger on newt update of the new element
                    this.ud.onTrigger( newElement, 'update', fct);
                }
            }
        }
    } // Inserter.insertElement()
    
    // 2DO use fct now in utilities.js
    /*
    deepCopy( source, destination, level = 0)
    {
        var children = this.dom.children( source);
        for ( var i=0; i < children.length; i++)
        {
            let child = children[ i];
            let childTag = child.tagName.toLowerCase();
            let childType = this.dom.attr( child, 'ud_type');
            let childClass = child.className;
            let attributes = {};
            let data = child.innerHTML
            if ( ['page'].indexOf( childType) > -1) continue;
            if ( ['subpart', 'zone'].indexOf( childType) > -1) data = ""; // child.textContent;
            if ( this.dom.attr( child, 'ud_oid') == "") continue;
            if ( childType) attributes = { ud_type: childType, class: childType};
            if ( childClass) attributes['class'] = childClass;
            if ( childTag == 'span') attributes['ude_stage'] = "on";
            // attributes['ud_extra'] = '{"origin":"deepCopy of "+source.id}';            
            // Look at OID to get depth
            // 2DO detect end of zone pr subpart by oidlengt, at becomes parent
            // Insert element in DOM
            let newElement = null;
            newElement = this.dom.prepareToInsert( childTag, data, attributes);
            newElement = destination.appendChild( newElement);
            this.ud.viewEvent( "create", newElement); // inform VIEW-MODEL of new element
            if ( childType)
            {
                switch ( childType)
                {
                    case "zone" :
                    case "subpart" :
                        // Use recurrence to copy lower levels
                        // Delay so parent ud_oid is set by server
                        let me = this;
                        setTimeout( function () { me.deepCopy( child, newElement, level+1)}, 7000);
                        break;
                    default :
                        this.ude.initialiseElement( newElement.id);
                        break;
                }
            }
        }
    } // UDutilities.deepCopy()
    */

    
    // Build attachedClasses
    buildAttachedClasses()
    {
        var tags = this.primaryTags;
        for ( label in tags)
        {
            var tag = tags[label];
            var p1 = -1;
            if ( ( p1 = tag.indexOf('.')) > 0)
            {
                var typeName = tag.substr( p1);
                var tagName = tag.substr( 0, p1-1);
                if ( typeof this.attachedClasses[ tagName] == "undefined") this.attachedClasses[ tagName] = [];
                this.attachedClasses[ tagName].push( typeName);
            }
        } // end label loop
    } // Inserter.buildATtachedClasses()
  
    defaultContentByClass( exTag, className) {
        if ( exTag == "p" && className == "break") { return "break";}
        return "...";
    }
 } // JS class Inserter
 
// UNIT-TEST
if ( typeof process != 'object') {
    // define( function() { return { class : Inserter, src: document.currentScript.src};});  
} else {
    // Testing under node.js
    if ( typeof exports === 'object') module.exports = { Inserter:Inserter, class : Inserter};
    else window.Inserter = Inserter; 
    // module.exports = { Inserter:Inserter, class : Inserter};
    //console.log( typeof global.JSDOM);
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined")
    {
        // Test this module
        console.log( 'Syntax OK');        
        console.log( 'Start of Inserter/Tagger test program');
        // Setup browser emulation with page
        let path = "../..";
        const testMod = require( path+'/tests/testenv.js');
        testMod.load( []);
        console.log( 'Creating Tagger/inserter');
        var myDoc = document.getElementById( "document");
        //var myDom = new DOM( myDoc, this);
        let ud = new UniversalDoc( "document", true, 22);
        testMod.load2();
        // Get options
        var myInserter = new Inserter( ud, null); // { dom:myDom, ude:{ calc:null}}
        if ( myInserter.getList( "B0100000001000000M").indexOf( 'h1')> -1) console.log( 'Test getList: OK');
        else  console.log( 'Test getList: KO', myInserter.getList( "B0100000001000000M"));
        console.log( "Test completed"); 
        process.exit();        
    } else {
        // { Inserter:Inserter, class : Inserter};
    }
} // End of test routine
