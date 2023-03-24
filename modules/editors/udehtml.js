/* -------------------------------------------------------------------------------------------
 *  udehtml.js
 * 
 *  This is the client-side part of the HTML module and works with the server-side udhtml.php
 *  
 *  As with other UD modules, methods are grouped in 4 blocks as listed below :
 *    
 *     1 - UD-VIEW-MODEL - Preparing data received from server for editing
 *     2 - UD-VIEW-MODEL - Preparing edited data for saving
 *     3 - UDE-VIEW      - Editing functions
 *     4 - CALUCLATOR    - Calculator functions on tables 
 *
 */
 
 class UDEhtml
 {
    ud;
    dom;
    ude;
    zoneNameSuffixes = {
        active:"activeZone",
        edit:"editZone",
        view:"viewZone"
    };

    // Set up HTML display and parameter editor module
    constructor( ude)
    {
        this.ude = ude;
        this.dom = ude.dom;
        this.ude.modules['div.html'].instance = this;
        //if ( typeof ud.ude != "undefined") this.ude = ud.ude; else this.ude = ud;

    } // UDEhtml.construct()
    
   /**
    *  UDE-VIEW Interface                                                 
    */
    
    // User-generated event 
    inputEvent( e, element)
    {
        let processed = false;
        let source = element;
        let content = source.textContent;
        let event = e.event;
        let saveable = this.dom.getSaveableParent( source);
        let saveableId = saveable.id;
        // Process event  
        switch ( event)
        {
            case "create" :
            case "changeTag" :
                processed = this.initialise( saveableId);
                break;
            case "newline" :
                processed = this.ude.textEd.inputEvent( e, element)
                break;
            case "save" :
                processed = this.prepareToSave( element, e.target);
                break;
            case "remove" :
                break;
            case "insert" :
                break;
            case "change":
                 // 2DO Reverse Grap HTML code from viewZone split it (difficult) and place in object
            case "copy" : 
            case "cut" : 
            case "paste" : case "endPaste" :
            case "merge up" :
            case "merge down" :
                let binded = API.dom.getParentWithAttribute( 'ude_bind', element);
                let bindedType = API.dom.attr( binded, 'ud_type');
                if ( binded.id.indexOf( "editZone") > -1 || [ 'text', 'editZone'].indexOf( bindedType) > -1) {
                // if ( this.dom.attr( this.dom.getParentWithAttribute( 'ude_bind', element), 'ud_type') == "editzone") {
                    processed = this.ude.textEd.inputEvent( e, element);
                }
                break;
            case "setValue" :
                break;
        }   
        return processed;
    
    } // UDEhtml.inputEVent()
    
   /**
    *  UD-VIEW-MODEL Interface
    */


    // Initialise an HTML block - setup viewing and editing zone
    initialise( saveableId) {
        // Default values for HTML display       
        let values = {
            ntitle : "Titre de l'article",
            gimage : "https://placekitten.com/g/480/300",
            nteaser : "Texte de l'article",
            firstTeaserLine : "Texte de l'article",
            butFirstTeaserLines : "a second line",
            nlink : "https://www.sd-bee.com",
            ntag: "Cat",
            //oid : this.dom.element( "UD_oid").textContent,
            oidNew : this.dom.element( "UD_oidNew").textContent, 
            title : "Title",
            sections : [ "Section 1", "Section 2", "Section 3"],
            image :  "https://placekitten.com/g/480/300", 
            details : [  "details 1", "details 2", "details 3"],
            articles : [
                { 
                    ntitle: "A Title", 
                    gimage:"https://placekitten.com/g/480/300",
                    nteaser : "Texte de l'article",
                    nlink : "https://www.sd-bee.com",
                    ntag : "Categorie"
                },
                { 
                    ntitle: "Another Title", 
                    gimage:"https://placekitten.com/g/480/300",
                    nteaser : "Texte de 2e article",
                    nlink : "https://www.sd-bee.com",
                    ntag : "Categorie"
                }
            ],
            rindex:1,
            width:"50%"  
        }        
        // Find dataHolder and json data
        let saveable = this.dom.element( saveableId);
        if (!saveable) return debug( {level:2, return:false}, "Can't find ", saveableId);
        let dataChildren = saveable.childNodes;
        let dataHolder = saveable.getElementsByTagName( 'div')[0];
        let json = null;
        let bind = "";
        let html = "";
        let htmledit = "";
        // Get data according to MIME        
        let mimeType = saveable.getAttribute( 'ud_mime');  
        if ( !mimeType) mimeType = "text/json";   
        switch ( mimeType) {
            case "text/json" :
            // JSON100 method
                if ( dataHolder) {
                    json = JSONparse( dataHolder.innerHTML);
                    bind = dataHolder.id;
                }
                if ( !json) {
                    // Uninitialised JSON
                    let suggestedName = this.dom.attr( saveable, 'name');;
                    // Delete all children
                    this.dom.emptyElement( saveable);
                    // Add new object to element
                    let newElement = saveable.appendChild( this.newHTMLobject( suggestedName));
                    saveable.appendChild( newElement);
                    bind = newElement.id;
                    this.dom.attr( saveable, 'name', suggestedName);
                    this.dom.attr( saveable, 'ud_mime', "text/json");
                    json = JSONparse( newElement.innerHTML);
                }
                let activeZoneId = this.dom.udjson.valueByPath( json, 'meta/zone');
                let activeZone = this.dom.element( activeZoneId);
                if (!activeZone) { 
                    activeZone = this.dom.udjson.putElement( json, bind);
                    activeZone = saveable.appendChild( activeZone);
                }
                // Get zones
                let name = this.dom.udjson.valueByPath( json, 'meta/name');
                let viewZoneId = name+"viewZone"; 
                let editZoneId = name+"editZone"; 
                let viewZone = this.dom.element( viewZoneId);   
                let editZone =  this.dom.element( editZoneId);      
                console.log( viewZoneId, editZoneId);
                viewZone.classList.remove( 'hidden');
                editZone.classList.add( 'hidden');
                // Update viewZone
                let lines = json.data.edit.value.value;
                if ( lines[0].indexOf( "HTML") == 0) lines.shift();
                let txt = "";
                for (let linei in lines) txt += lines[ linei].trim();
                let area = document.createElement( 'textarea');
                area.innerHTML = txt;
                html = area.value;
                // HTML can not contain scripts
                //html = stripScripts( html);
                // Substitute values into HTML
                 // Detect EJS 
                let useEJS = ( html.indexOf( '<%') > -1);
                // Render HTML with EJS or in-built substitution
                try { 
                    html = (useEJS && ejs) ? ejs.render( html, values) : this.ude.calc.substitute( html, values);
                } catch ( error) {
                    console.log( error);
                }        
                viewZone.innerHTML = html;   
                return true;
            case "text/text" :  //(or csv) 
                break;
            case "text/html" :
                // Direct transfer -- do nothing hiddenId attribute will assure text including in saving               
                break;
        }       
        // Old code
        if ( dataHolder)
        {
            // Initialised element, extract name and json
            // Get name
            let name = dataChildren[0].textContent;
            name = name.replace(/ /g, '_').replace(/'/g,'_').replace(/"/g, '');            
            // Get HTML in edit form
            htmledit = dataHolder.textContent;
            // Build html for display
            let lines = htmledit.split( "\n");
            if ( lines[0].indexOf( "HTML") == 0) lines.shift();
            let txt = "";
            for (let linei in lines) txt += lines[ linei].trim();
            let area = document.createElement( 'textarea');
            area.innerHTML = txt;
            html = area.value;
        }
        else
        {
            // Uninitialised element
            // Get name to use as dataholder and in editzone elements
            let content = saveable.textContent;
            if ( content == "" || content == "...") content = "HTML_"+saveableId;
            name = content.replace(/ /g, '_').replace(/'/g,'_').replace(/"/g, '');
            // Get initial HTML for edition and view
            html = "{edit}"; // this.defaultJSON;          
            htmledit = "HTML\n{edit}\n";
            // Look up model 
            let modelId = "Model_"+subType;
            let model = this.dom.element( '#'+modelId, this.dom.element( 'document'));
            if ( model)
            {
                // Get model's data holder
                let modelDataHolder = model.getElementsByTagName( 'div')[0];
                // Get model HTML and get editable version
                html = modelDataHolder.innerHTML;
                let area = document.createElement( 'textarea');
                area.textContent = txt;
                htmledit = area.innerHTML;                
            }
            shtml += '<span class="caption">'+name+'</span>';
            shtml += '<div id="'+name+'" class="HTMLobject hidden" ude_editZone="'+name+'viewZone"';
            shtml += '>'+html+'</div>';
            // 2DO waiting GIF
            saveable.innerHTML = shtml;
            // Set dataHolder
            dataHolder = saveable.getElementsByTagName( 'div')[0];                      
        }
        // Get names of edit and view zones
        let name = this.dom.attr( saveable, 'name');
        let viewZoneId = name+"viewZone"; 
        let editZoneId = name+"editZone"; 
        // Find existing viewZone
        let viewZone = this.dom.element( viewZoneId);   
        let editZone =  this.dom.element( editZoneId);      
        if ( !viewZone)  {
            // Build display and edit zones
            // editZone, inviisble, for editing HTML source
            let newEditZone = document.createElement( 'div');
            this.dom.attr( newEditZone, "id", editZoneId);
            this.dom.attr( newEditZone, "class", "linetext hidden");
            this.dom.attr( newEditZone, "ud_type", "editzone");
            this.dom.attr( newEditZone, "ud_subtype", "htmltext");
            this.dom.attr( newEditZone, "ude_autosave", "off");
            this.dom.attr( newEditZone, "ude_bind", dataHolder.id);
            // Add HTML edition
            let edTable = this.ude.textEd.convertTextToHTMLtable( htmledit, dataHolder.id, "");
            newEditZone.appendChild( edTable);
            saveable.appendChild( newEditZone);             
            // viewZone, visible, display HTML
            let newViewZone = document.createElement( 'div');
            viewZoneId = dataHolder.id+"viewZone"; 
            this.dom.attr( newViewZone, "id", viewZoneId);
            this.dom.attr( newViewZone, "class", "htmlView");
            this.dom.attr( newViewZone, "ud_type", "viewzone");
            this.dom.attr( newViewZone, "ud_subtype", "html");            
            this.dom.attr( newViewZone, "ude_autosave", "off");
            this.dom.attr( newViewZone, "ude_bind", dataHolder.id);
            // Substitute values into HTML
            html = this.ude.calc.substitute( html, values);
            newViewZone.innerHTML = html; //html.replace( "{edit}", editButton);
            saveable.appendChild( newViewZone);
            // Update local pointers to zone sfor later processing
            editZone = newEditZone;
            viewZone = newViewZone;            
        }
        else
        {
            // Update viewZone
            html = this.convertEditable2HTML( dataHolder.textContent);
            html = this.ude.calc.substitute( html, values);
            viewZone.innerHTML = html;          
            // Hide editzone
            if ( !editZone.classList.contains( 'hidden')) editZone.classList.add( 'hidden');
            // Show viewZone
            if ( viewZone.classList.contains( 'hidden')) viewZone.classList.remove( 'hidden');
        }    
        return true;
    } //UDEhtml.initialise()

   /**
    * setup an empty HTML onject in JSON100 format
    */    
    newHTMLobject( suggestedName, subtype="", htmlArray=[]) {
        // Name
        let name = suggestedName.replace(/ /g, '_').replace(/'/g,'_').replace(/"/g, '');
        let objectName = name + "_object";
        // Data
        if ( !htmlArray.length) { htmlArray =  [ "HTML "+subtype.toUpperCase(), "...", "..."]}
        let objectData = { 
            meta:{ type:"activezone", subtype:subtype, name:name, zone:name+"activeZone", caption:suggestedName, captionPosition:"top", autosave:"off"}, 
            data:{                 
                edit:{"tag":"div","name":name+"editZone","type":"text", 'bind':objectName, "value":
                  { tag:"textedit", name:name+"editTable", class:"html", value:htmlArray}
                },
                display:{ tag:"div", name:name+"viewZone", class:"htmlView", type:"viewzone", subType:"html", 'bind':objectName, autosave:"off", follow:"off", value:""}
            },
            changes: []
        };
        // Create object div and append to element
        let objectAttributes = {id:objectName, class:"object textObject hidden", ud_mime:"text/json"};
        let object = this.dom.prepareToInsert( 'div', JSON.stringify( objectData), objectAttributes);
        this.dom.attr( object, 'ud_mime', "text/json"); 
        return object;
    } // UDEtext.newHTMLobject()    
    
    // Update an HTML block
    update( saveableId)
    {
    } // UDEchart.update()
    
    // Update binded saveable element with HTML element's content
    prepareToSave( editorZone, dataHolder)
    {
        let saveable = dataHolder.parentNode;  
        // Detect change in object's name and update other elements as required
        API.dispatchNameChange( saveable); 
        // Always save
        let save = true;
        // Process according to MIME type
        let mime = this.dom.attr( saveable, "ud_mime");
        /*
        if ( mime != "text/json") {
            // Convert from mixed format
            let name = dataHolder.id; // editorZone.id.replace( 'editZone', '');
            let subType = "" ; 
            dataHolder = this.newHTMLObject( name, subType);
            let children = saveable.childNodes;
            dataHolder = saveable.insertBefore( dataHolder, children[0]);
            this.dom.attr( editorZone, 'ud_type', "text"); // Important for getElement to detect linetext 
            mime = "text/json";
        }
        */        
        switch ( mime)
        {
            case "text/json" :
                // 2DO if zone is view then copy to data 
                let jsonAPI = API.json;
                let name = this.dom.attr( saveable, 'name');
                let activeZone = this.dom.element( name + this.zoneNameSuffixes.active); 
                if ( editorZone == activeZone) {
                    editorZone = this.dom.element( 'div', activeZone);
                    if ( !editorZone) return false;
                }
                // Redisplay view zone on saving
                editorZone.classList.add( 'hidden');
                editorZone.nextSibling.classList.remove( 'hidden');
                // Update edit & display in JSON100 object
                let json = this.dom.udjson.parse( dataHolder.textContent);
                jsonAPI.valueByPath( json, "data/edit", this.dom.udjson.getElement( editorZone, false));
                jsonAPI.valueByPath( json, "data/display", this.dom.udjson.getElement( editorZone.nextSibling, false));
                // Detect name change & update meta if required
                let oldName = jsonAPI.value( json.meta, 'name');
                let newName = this.dom.attr( saveable, 'name');
                if ( oldName != newName) {
                    jsonAPI.value( json.meta, 'name', newName);
                    jsonAPI.value( json.meta, 'zone', [ oldName, newName], 'replace');
                    jsonAPI.value( json.meta, 'caption', [ oldName, newName], 'replace');
                    let captionElement = this.dom.element( 'span.caption', activeZone);
                    if ( captionElement) captionElement.textContent = captionElement.textContent.replace( oldName, newName)
                }
                dataHolder.innerHTML = JSON.stringify( json); // !!! IMPORTANT textContent will convert <>
               /* 
                * Alternative to try - just grab the whold active zone
                let name = this.dom.attr( saveable, 'name');
                let activeZone = this.dom.element( name + this.zoneNameSuffixes.active); 
                dataHolder.textContent = JSON.stringify( this.dom.udjson.getElement( activeZone, true));
                */
                break;
            default :
                // Find table that holds text
                var table = editorZone.getElementsByTagName( 'table')[0];
                if (!table) return debug( {level:1, return: null}, "can't find table in ", editorZoneId);
                var rows = table.getElementsByTagName( 'tbody')[0].rows;
                // Get data
                let text = "";
                for( let rowi=0; rowi < rows.length; rowi++)
                {
                    let line = rows[rowi].cells[1].innerHTML;
                    text += line+"\n"; 
                }
                if ( save) { dataHolder.textContent = text;}
                break;
        }
        if ( save) { this.initialise( dataHolder.parentNode.id);}
        return save;
    } // UDEhtml.prepareToSave()
    
   /*
    * UTILITIES
    */
    convertEditable2HTML( editable)
    {
        let lines = editable.split( "\n");
        if ( lines[0] == "HTML") lines.shift();
        let txt = "";
        for (let linei in lines) txt += lines[ linei].trim();
        let area = document.createElement( 'textarea');
        area.innerHTML = txt;
        return area.value;
    }   // UDEhtml.convertEditableToHTML() 
    
} // JS class UDEhtml
if ( typeof process != 'object') { 
    let mod = new UDEhtml( window.ude);
}
 
if ( typeof process == 'object')
{
    // Testing under node.js
    module.exports = { class: UDEhtml, UDEhtml:UDEhtml};
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined")
    {
        console.log( 'Start of test program');
        console.log( 'Syntax:OK');
        let path = "../..";
        const testMod = require( path+'/tests/testenv.js');
        testMod.load( []);
        let ud = new UniversalDoc( 'document', true, 133);   
        let ude = ud.ude;      
        let HTMLeditor = new UDEhtml( ude);
        let view = HTMLeditor.dom.element( "div.part[name='myView']", HTMLeditor.dom.element( 'document'));        
        // Test 1 - JSON100 HTML
        {
            // Create object div.listObject and append to element            
            // Data
            name = "myHTML";
            let lines = [
            "HTML",
            '&lt;span class="emphasized"&gt;Hello World&lt;/span&gt;'            
            ];            
            let object = HTMLeditor.newHTMLobject( name, "", lines);
            // Create container div.list
            let id = "B0100000005000000M";            
            let attributes = {id:id, class:"html", ud_mime:"text/json"};
            let element = HTMLeditor.dom.prepareToInsert( 'div', object.outerHTML, attributes);
            // element.appendChild( object);
            // Append list to view
            view.appendChild( element);   
            // Initialise list
            HTMLeditor.initialise( id);
            console.log( element.innerHTML);
        }       
        // Test 2 - HTML list with caption
        /*
        {
            // Create list with HTML            
            // Data
            name = "myList";
            let objectData = '<span>My List 2 <span class="objectName">myList2></span></span>';
            objectData += '<ul id="myList2" class="listStyle1"><li>Item 1</li><li>Item 2</li></ul>';            
            // Create container div.list
            let listId = "B0100000007000000M";            
            let listAttributes = {id:listId, class:"list", ud_mime:"text/html"};
            let listElement = listEditor.dom.prepareToInsert( 'div', objectData, listAttributes);
            // Append list to view
            view.appendChild( listElement);   
            // Initialise list
            listEditor.initialise( listId);
            console.log( view.innerHTML);
        } 
        */
        console.log( 'Test completed');
        process.exit();
    }        
} // End of test routine