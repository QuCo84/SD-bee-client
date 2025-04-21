/*
 * clipboarder.js
 *   A client-side clipboard & gallery manager with temporary and permenant saving of items on a user or document basis,
 *   which works with the server-side endpoint AJAX_clipboardTool/
 *   Items are stored in a user's clipboard or (planned) in a specific view of the document for sharing amongst users. 
 *   Each clip is stored as a DIV with a cb_type attribute indicating the type of content :
 *     "image", "text", "table", "json"
 *   Items are added to the clipboard with the copyTo() method and inserted from the clipboard with the insert() method.
 *   The insert() method is automatically invoked when a user clicks on a clip displayed in the clipboard tool zone. 
 *   The copyToClipboard() method is automatically invoked when a cut or copy event is relayed by the View software using
 *   the viewEvent() method. This method can also be invoked with API.copyToClipboard()
 *   The interface contains controls to save the item permenently, until it is used or just for the current session.
 *   When the user clicks on an item a paste with this 
 * 
 *  
 * 2020-04-19 - creation
 */
 
 class Clipboarder {
    // Parameters
    server="http://dev.rfolks.com/webdesk/";             // URL for saving and retrieving clipboards
    actionRoot = "/AJAX_clipboardTool/";                 // 
    valSep = "%7C";
    // Variables
    ud;
    ude;
    dom;
    displayId;
    display = null;
    bufferId;
    id;
    ude;
    newPasteOid='';
    clipSeqNo = 1;
    cache = null;
    cacheUpdateTime = 50; // 15*60*100;   
  
    constructor( ud, displayId)
    {
        // Make local copy of modules
        this.ud = ud;      
        this.ude = ud.ude;
        this.dom = ud.dom;
        // Find display
        this.displayId = displayId;
        this.display = document.getElementById( displayId);
        // Register with UD
        ud.setClipboardHandler( this);
        // and global
        window.clipboarder = this;
        let rules = "";
        rules += "div.CLIPBOARD{ display:grid; grid-template-columns: auto auto auto; width: 95%; height:50vh; overflow-y:auto;}\n";
        rules += "div.CLIPBOARD_clip { display:inline-grid; padding:2%; margin:2%; text-align:center; height:80px; overflow-x:hidden; overflow-y:hidden; transform: scale(0.8); cursor:pointer;}\n"; // 2DO add grab
        rules += "div.CLIPBOARD_options{padding: 2%; margin: 2%;  text-align:left; font-size:0.8em; overflow:hidden; }\n";
        rules += "div.CLIPBOARD_options label input{vertical-align:middle;}\n";
        rules += "span#ClipboardPasteZone, div.Dropzone{ width: 100%; cursor:crosshair; background-color: #e6ddba;}\n"; // height: 50px; 24/04/23
        rules += "div.CLIPBOARD_clip img.CLIPBOARD{ width:auto; height:50px;}\n";
        rules += "div.CLIPBOARD_clip div.cb_tags{ font-size:0.8em; text-align:left; display:inline-block;}\n";
        this.ud.addStyleRules( rules);
        // Setup storage for clipboard
        let resources = this.dom.element( "UD_resources");
        if ( resources)
        {
            let clipboardCache = document.createElement( 'div');
            clipboardCache.id = "CLIPBOARD_cache";
            this.dom.attr( clipboardCache, 'ud_dupdated', 0);
            this.cache = resources.appendChild( clipboardCache);
        }    
        else debug( { level: 2}, "No cache for clipboard" );
        // API fcts
        if ( typeof API != "undefined") {
            API.addFunctions( this, ["copyToClipboard"]);
        }
    }
    
    // UD event handler for direct handling
    event( eventName, e)
    {
        switch (eventName)
        {
            case "open" :
                this.getClips();
                break;
            case "receiveClip" :
                let clip = null;
                /* focus pb needs further debugging*/
                if ( typeof navigator.clipboard != "undefined") {
                   let data = "";
                   navigator.clipboard.readText().then(
                       clipText => {
                            data = clipText;
                            console.log( clipText);
                            clip = window.clipboarder.createClip( 'text', data);
                            if ( clip) this.saveClip( clip);
                        }
                   );
                } else if ( typeof e.clipboardData != "undefined") {
                    let types = e.clipboardData.types;    
                    if (((types instanceof DOMStringList) && types.contains("text/html")) 
                        || (types.indexOf && types.indexOf('text/html') !== -1)
                    )
                    { 
                        // Clip is HTML
                        let html =  e.clipboardData.getData('text/html');
                        html = this.dom.removeStylesFromHTML( html);
                        let images = this.getImages( html);
                        let saveables = this.getSaveableElements( html);
                        if ( images && images.length == 1) clip = this.createClip( "image", images[0]);
                        else if ( saveables.length > 1) clip = this.createClip( "multihtml", html);
                        else clip = this.createClip( "html", html);                    
                    } 
                    else if  (((types instanceof DOMStringList) && types.contains("text/plain")) 
                        || (types.indexOf && types.indexOf('text/plain') !== -1)
                    )
                    { 
                        // Clip is text
                        let text = e.clipboardData.getData('text/plain');                   
                        // Text can be JSON, HTML (needs conversion) or just text
                        let json = API.dom.udjson.parse( text);                   
                        if ( json) {
                            clip = this.createClip( "json", json);
                        } else if ( this.dom.isHTML( text)) {
                            let temp = document.createElement( 'textarea');
                            temp.textContent = text;
                            let htmledit = temp.innerHTML.replace( /<br>/g, "\n");                             
                            clip = this.createClip( "text", htmledit);
                        } else {                        
                            clip = this.createClip( "text", text);
                        }
                    }
                }
                // Save clip
                if ( clip) this.saveClip( clip);
                break;
                case "keydown" :
                    console.log( e); 
                    {
                        let key = e.key;
                        if ( key == "Enter") {
                            // Save clip
                            let saveable = this.dom.getSaveableParent( e.target);
                            this.saveClip( saveable);  
                            e.preventDefault();                          
                        } else if ( key == "Escape") {
                            // Restore
                            // e.target.textContent = this.dom.attr( e.target, ud_save);
                            // this.dom.attr( e.target, ud_save, "")
                            e.preventDefault();    
                        } else {
                            // if ( !this.dom.attr( e.target, ud_save)) this.dom.attr( e.target, ud_save, e.target.textContent)
                        }
                    }
                    break;
        }
    } // Clipboarder.event()
    
    // Handle events from UDE-view
    inputEvent( e, element)
    {
        let types = e.clipboardData.types;
        let pastedData = "";
        let type = "";         
        if (((types instanceof DOMStringList) && types.contains("text/html")) 
             || (types.indexOf && types.indexOf('text/html') !== -1)
        )
        { 
            // HTML 
            type = 'html';
            pastedData = e.clipboardData.getData('text/html');
            // Remove Styling spans or best match to existing styles
            pastedData = this.dom.removeStylesFromHTML( pastedData);
            // Look for images
            let images = pastedData.match( /(<img[^>]*>)/g)
            if ( images)
            {
                type = "image";
                pastedData = images[0];
            }
            else
            {
                if (  ((types instanceof DOMStringList) && types.contains("text/plain")) 
                      || (types.indexOf && types.indexOf('text/plain') !== -1)
                )
                { 
                    type = 'text';
                    pastedData = e.clipboardData.getData('text/plain');
                }                
                // 2DO Detect html with multiple elements
                // type = "multihtml"
            }
        } 
        else if  (((types instanceof DOMStringList) && types.contains("text/plain")) 
                   || (types.indexOf && types.indexOf('text/plain') !== -1)
        )
        { 
            type = 'text';
            pastedData = e.clipboardData.getData('text/plain');
        }
        let clip = null;
        switch (e.event)
        {
            case "paste":
                // Create clip from system clipboard data
                clip = this.createClip( type, pastedData);
                this.saveClip( clip);
                break;
            case "cut":
            case "copy":
                // Create clip from document element
                clip = this.copyToClipboard( this.dom.cursor.HTMLelement)
                // this.saveClip( clip);
                // Copy to clipboard
                break;
        }
        return true;
    } // Clipboarder.inputEvent()
    
    openClipboard() {
        if ( rightColumn.mode.toLowerCase() == "reduced" ) rightColumn.switchDisplayMode();
        let clipboardIcon = this.dom.element( 'Clipboarder-icon');
        this.ud.loadTool( clipboardIcon,'right-tool-selector', 'tools/clipboarder.js', 'right-tool-zone');
        clipboardIcon.classList.add( 'selected');
    }
    
    getImages( html)
    {
        let images = html.match( /(<img[^>]*>)/g);
        return images;
    } // Clipboarder.getImages
    getSaveableElements( html)
    {
        let paras = html.match( /(<p[^>]*>)/g);
        let titles = html.match( /(<h[^>]*>)/g);
        let divs = html.match( /(<div[^>]*>)/g);
        let res = [];
        if ( paras) res = res.concat( paras);
        if ( titles) res = res.concat( titles);
        if ( divs) res = res.concat( divs);
        return res;
    } // Clipboarder.getImages

   /**
    *  INSERT FROM CLIPBOARD
    */
    insert( clipId, target = null)
    {
        // Find clip
        let clip = document.getElementById( clipId);
        // 2DO Check parent is CLIPBOARD
        // Make array of elements to insert
        let clipElements = [];
        let type = this.dom.attr( clip, 'cb_type');
        // Get paste events        
        let pasteEvents = [];
        // Get target and useAs
        if ( !target) { target = this.dom.cursor.fetch().HTMLelement;}
        if ( !target) return debug( {level:5, return:false}, "No element to insert at", target);
        let useAs = API.getEditType( target);
        // Leave stage editing and assume validate
        //this.ude.leave2stageEditing( true);        
        // API.dom.clearPlaceholder( target);
        let placeHolder = API.dom.attr( target, 'ude_place');
        if ( ( !placeHolder && target.textContent == "...") || target.textContent == placeHolder) {
            target.textContent = "";
        }
        if ( type.indexOf("element ") == 0) {
            // Insert a new saveable element
            let exTagA = type.replace( "element ", "").split( '.');
            let attr = ( exTagA.length > 2) ? { ud_type: exTagA[1], class:exTag[ exTagA.length-1]} : {class:exTag[ exTagA.length-1]};
            let newElement = API.insertElement( exTagA[0], clip.innerHTML, attr, target);
            this.dataSource.viewEvent( "create", newElement);            
        } else if ( type != "multihtml") {
            // 2DO remove clipboard class
            let clipObj = { type:type, content:clip.innerHTML};
            pasteEvents = this.preparePasteEvents( clipObj, useAs);                           
            for ( let evi=0; evi < pasteEvents.length; evi++) { this.ude.dispatchEvent( pasteEvents[ evi], target);}
        } else {
            // Paste multiple HTML elements into target
            let html = "";
            clipElements = this.analyseHTML( clip); // clipElements.concat( this.analyseHTML( child));                
            for ( let i=0; i < clipElements.length; i++) {
                let clipObj = { type: type, content:clipElements[ i]};            
                pasteEvents = this.preparePasteEvents( clipObj, useAs);
                for ( let evi=0; evi < pasteEvents.length; evi++) { this.ude.dispatchEvent( pasteEvents[ evi], target);}
            }
        }        
        // if ( target.textContent == "" && placHolder) target.textContent = placeHolder;
    } // Clipboard.insert()

   /**
    * Analyse HTML
    *   @return clipElements[]
    */
    analyseHTML( element)
    {
        let clipElements = [];
        let children = element.childNodes;
        let parentTag = element.tagName.toLowerCase();
        for ( let childi=0; childi < children.length; childi++)
        {
            let child = children[ childi];
            if ( child.nodeType == Node.ELEMENT_NODE)
            {
                let tag = child.tagName.toLowerCase();
                switch ( tag)
                {
                    case "h1" :
                    case "h2" :
                    case "h3" :
                    case "h4" :
                    case "h5" :
                    case "p" :
                        clipElements.push( { type: "html", tag:tag, data: child.innerHTML});
                        break;
                    case "ul" :
                        // If preceeded by small paragraph, use as caption
                        let caption = "";
                        let previous = clipElements[ clipElements.length -1];
                        if ( previous && previous.tag == "p" && previous.data.length < 240)
                        {
                              caption = previous.data;
                              clipElements.pop();
                        }
                        // Find list editor
                        let editor = this.ude.modules[ 'div#list'];
                        if ( editor && editor.instance)
                        {                            
                            // Convert list to JSON and put in composite element                        
                            let data = editor.instance.convertHTMLtoObjectDiv( child.outerHTML, caption);
                            // Push to list
                            clipElements.push( { type: "html", tag:'div#list', data: data});
                        }
                        // 2DO standard/default composite mecanisme
                        break;
                    case "table" :
                        break;
                    case "img" :
                        break;
                    case "div" :
                        clipElements = clipElements.concat( this.analyseHTML( child));
                        break;
                    default :
                } // End switch
            } // end ELEMENT_NODE
            else if ( child.nodeType == Node.TEXT_NODE)
            {            
                if ( clipElements.length)
                    // Add text to previous node
                    clipElements[ clipElements.length - 1].data += child.textContent;
                else clipElements.push( {type:"text", data: child.textContent});
                // clipElements.push( { type: "html", tag: parentTag, data: child.textContent});
            }
        } // end child loop
        return clipElements;
    } // Clipboard.analyseHTML()
    
    /*
     * Copy an element to clipboard
     * @param string elementIdOrName id or name of element to copy to a clip
     * @return string id of clic
     */
    clipElement( elementId) { return this.copyToClipboard( elementId);}
    copyTo( elementIdOrName = "", deleteCopied = false) { return this.copyToClipboard( elementIdOrName, deleteCopied);}
    copyToClipboard( elementIdOrName = "", deleteCopied = false)
    {
        // Prepare content to copy
        let clipContent = "";
        let clipType = "";
        let clipGroup = "";
        // Find element
        let cursor = this.dom.cursor;
        let source = null;
        if ( elementIdOrName == "")
        {
            // No element specified, use cursor                       
            source = cursor.HTMLelement;
            if ( cursor.selectionInNode) {
                clipContent = this.dom.cursor.getSelectedText(); 
                clipType = "text";
            }
        }
        else
        {
            source = this.dom.element( elementIdOrName);
            if ( !source)
            {
                // No element with corresponding id, try name without and with edit/view zone suffix
                let sourceCandidates = document.getElementsByName( elementIdOrName);
                // 2DO try this.ud.constants.editZoneSuffix;
                if  ( sourceCandidates.length = 0) sourceCandidates = document.getElementsByName( elementIdOrName+"editZone");
                if  ( sourceCandidates.length = 0) sourceCandidates = document.getElementsByName( elementIdOrName+"viewZone");
                if ( sourceCandidates.length = 0 || sourceCandidates.length > 1)
                    return debug( {level:2, return:''}, "can't find unique", elementIdOrName);
                source = sourceCandidates[0];
            }
        }        
        // Get saveable and displayable elements (can be the same, and can be the same as source)
        let saveable = this.dom.getSaveableParent( source);
        let displayable = this.dom.getDisplayableParent( source);
        // Determine type 2DO of saveable/displayable
        let exTagSaveable = this.dom.attr( saveable, 'exTag');
        let exTagDisplayable = this.dom.attr( displayable, 'exTag');
        // Copy method depends on displayable element type
        switch ( exTagDisplayable)
        {
            case 'h1' :
            case 'h2' :
            case 'h3' :
            case 'h4' :
            case 'h5' :
            case 'h6' :            
            case 'p'  :
                if ( !clipContent) {
                    clipContent = displayable.innerHTML;                    
                    if ( clipContent == displayable.textContent) clipType = 'text'; 
                    else clipType = 'html';
                    // #2223004
                    let classList = this.dom.keepPermanentClasses( displayable.className);
                    if ( !classList) classList = "standard";
                    clipType = 'element ' + exTagDisplayable + '.' + classList;
                }
                break;

            case 'li' :
            case 'td' :      
                if ( !clipContent) {
                    clipContent = displayable.innerHTML;
                    if ( clipContent == displayable.textContent) clipType = 'text';
                    else clipType = 'html';
                }
                break;
            case 'div.list'    :
            case 'div.table'   :
            case 'div.graphic' :
                // 2DO look for DIV or use module fct 
                clipContent = saveable.getElementsByTagName( 'div')[0].textContent;
                let json = JSON.parse( clipContent);
                json['_label'] = saveable.getElementsByTagName( 'span')[0].textContent;
                json['_extag'] = exTagSaveable;
                clipContent = JSON.stringify( json);
                clipType = 'json';
                break
            case 'div.linetext' :
            case 'div.server' :
            case 'div.style' :
            case 'div.js' :
            case 'div.json' :
                // 2DO look for DIV or use module fct
                // Default look for binded element
                if ( source.classList.contains( 'textObject')) clipContent = source.textContent;
                else clipContent = saveable.getElementsByTagName( 'div')[0].textContent;  // Assume 1st div
                clipType = 'text';
                break
            case 'div.textObject' :
                clipContent = source.textContent; // 2DO use displayable
                clipType = 'text';
                break;
            case 'div.jsonObject' :
                clipContent = source.textContent;
                clipType = 'json';
                break;
            case 'div.zone' :
                clipContent = source.innerHTML;
                clipType = 'html';
                break;
            case 'div.editZone' :
            case 'div.viewZone' :
                // Dispatch Copy or Cut event to corresponding module
                let tempObj = { clipContent: "", clipType: "text"};
                if ( this.ude.dispatchEvent( { event:"copy", target:tempObj}, saveable))
                {
                    clipContent = tempObj.clipContent;
                    clipType = tempObj.clipType;
                }
                else
                {
                    // Default action
                    
                }     
                
                // Default action
                break;
        }
        // Quit if no clip
        if ( !clipContent) return null;
        // Open clipboard
        this.openClipboard();
        if ( deleteCopied) clipGroup = "VIEW_" + this.dom.getView( saveable) + '_' + this.dom.textContent( 'UD_dbName');
        // Create clip
        let clip = this.createClip( clipType, clipContent, clipGroup);
        // Save clip
        this.saveClip( clip, deleteCopied); // save in base if element is being deleted
        if ( deleteCopied) {
            if ( elementIdOrName || !cursor.selectionInNode) {
                // Delete complete element
                this.removeElement( saveable);
            } else {
                // Delete text within element
                this.dom.cursor.getSelectedText( true);                
            }
        }
        // Return clip's id
        return clip.id;
    } // Clipboard.copyToClipboard()
    
    
    // Save a clip in clipboard
    paste( type, content) { this.createClip( type, content);}
    createClip( type, content, group="")
    {
        // Process content
        if ( type == "html") { content = this.preparePastedData( type, content).content;}
        // 2DO prepare name
        // 2DO abandon if exists already
        // Create clip
        let clip = document.createElement( 'div');
        if ( group) { 
            clip.id = group+this.clipSeqNo+''+this.ud.ticks+'_'+type;
            this.clipSeqNo++;
        } else { clip.id = "LastClip";} // group = this.dom.element( 'UD_docTitle').textContent;
        clip.className = "CLIPBOARD_clip";
        clip.setAttribute( 'onclick', "window.clipboarder.insert( '"+clip.id+"');");
        this.dom.attr( clip, 'cb_type', type);
        clip.innerHTML = content;
        return clip;
    } // Clipboard.createClip()
    
   /**
    * Prepare pasted data 
    *   @param {string} type MIME type
    *   @param {string} pastedData Data being pasted
    *   @return {object} Ready for saving as clip
    */
    preparePastedData( mime, data)
    {
        let content = data;
        let type = "text";
        if ( mime == "text/html" || mime == "html" || this.dom.isHTML( content)) {
            let p1 = content.indexOf( "<!--StartFragment-->");
            let p2 = content.indexOf( "<!--EndFragment-->");
            if ( p1 > -1 && p2 > -1) { content = content.substring( p1+20, p2);}
            type = "html";
            // Detect image and multihtml types
            content = this.dom.removeStylesFromHTML( content);
            let images = this.getImages( content);
            let saveables = this.getSaveableElements( content);
            if ( images && images.length == 1) {
                type = "image";
                content = images[0];
            } else if ( saveables.length > 1) {
                type = "multihtml"; 
            } else { 
                // Force to text 
                type = "text";
                let work = document.createElement( 'div');
                work.innerHTML = content;
                content = work.textContent;                
            }  
        } 
        return { content:content, type:type};
    } // Clipboard.preparePastedData()
 
   /**
    * Prepare clip for pasting
    *   @param {object} clipObj Type & content of clip
    *   @param {string} useAs Type of use text, html, ... TBC
    *   @return {string} Text to insert
    */
    preparePasteEvents( clipObj, useAs)
    {
        let events = [];
        if ( useAs == "text") {
            // 2DO if just an image, insert src            
            if ( clipObj.type == "html") {
                // Build TEXT representation of HTML, split lines on <  .
                let temp = document.createElement( 'textarea');
                temp.textContent = clipObj.content.replace( /\n/g, '');
                let htmledit = temp.innerHTML;  
                let work = htmledit.split( '&lt;');                
                let firstInsert = true;
                for ( let linei=0; linei < work.length; linei++) {
                    let line = work[ linei];
                    line = line.replace( /\"/g, '\"');                 
                    if ( line == "") { firstInsert = false; continue;}
                    if ( linei != 0) { line  = "&lt;" + line;}
                    let event = { event: "newline", type:"newline", data:line, update:false};
                    if ( firstInsert) { event = { event: "paste", type:"paste", data:line, update:false};}
                    firstInsert = false; 
                    events.push( event);
                }
            } else if ( clipObj.type == "image") {
                // Send Image src field to text element
                let srcExtract = /src="([^"]+)"/;
                let imgData = srcExtract.exec( clipObj.content)[1]; // IDEA {src: srcExtract.exec( clipObj.content)[1], class:""};                                    
                events.push( { event: "paste", type:"paste", last:true, data:imgData}); 
            } else if ( clipObj.type == "text") {
                let work = clipObj.content.split( "\n");                
                let firstInsert = true;
                for ( let linei=0; linei < work.length; linei++) {
                    let line = work[ linei];                    
                    if ( line == "") { firstInsert = false; continue;}
                    let event = { event: "newline", type:"newline", data:line, update:false, last:false};
                    if ( firstInsert) { event = { event: "paste", type:"paste", data:line, update:false, last:false};}
                    if ( linei == (work.length - 1)) { event.last = true;}
                    firstInsert = false; 
                    events.push( event);
                }                
            } else{ events.push( { event: "paste", type:"paste", data:clipObj.content});}
        } else if (useAs == "html") { 
            events.push( { event: "paste", type:"paste", data:clipObj.content}); //.replace( 'class="CLIPBOARD"', '')});
        }
        // Add endPaste event 
        if ( events.length) { events.push( { event: "endPaste", type: "endPaste"});}
        return events;
    } // Clipboard.preparePasteEvents()
 
   /**
    * Method to delete clips for a group
    *   @param string group Group's prefix
    *   @return integer nb of items deleted  
    */
    deleteGroupClips( group)
    {
        if ( !this.cache) return false;
        let nbOfClips = 0;
        let clipboard = this.cache.childNodes[1];
        if ( clipboard) {   
            let displayed = false;
            if ( this.display.innerHTML == this.cache.innerHTML) displayed = true;;
            let clips =  clipboard.childNodes;
            let nbOfClips = clips.length;
            for ( let clipi=nbOfClips; clipi > 0; clipi--) {
                // Delete from page
                let clip = clips[ clipi - 1];
                let clipId = clip.id;
                if ( group == "_ALL_" || clipId.indexOf( group) == 0) clip.remove();
/*            {  
                // clip.remove;
                // Send delete instruction to server
                this.deleteClip( clip);
            }  */  
            }
            // Update display if displayed
            if ( displayed) this.display.innerHTML = this.cache.innerHTML;
        }
        // Tell server to delete too
        let postData = "form=INPUT_pasteForm&input_oid=OID&nname="+group;
        postData += "&ttext=_DELETEGROUP_";     
        // Send to server
        let uri = "/webdesk/{oid}/AJAX_clipboardTool/";
        let context = { action:"ignore"};
        this.ud.udajax.serverRequest( uri, "POST", postData, context);
        // Return nb of clips deleted
        return nbOfClips;
    } // Clipboard.deleteGroupClips
       
   /**
    *  SERVER EXCHANGE
    */

   /**
    * Fetch clips from server
    */
    getClips()
    {
        // 2DO Use ressources if recent
        if ( this.cache && parseInt( this.dom.attr( this.cache, 'ud_dupdated')) > Math.max( 0, ( this.ud.ticks - this.cacheUpdateTime)) ) 
        {
            let html = this.cache.textContent;
            this.display.innerHTML = html;
            return null;
        }
        // 2DO Prepare list of clips provided by model 
        let modelClipboardHTML = "";
        let clipViews = this.dom.elements( 'div.part.clipboard', 'document');
        for ( let viewi=0; viewi < clipViews.length; viewi++) {
            let view = clipViews[ viewi];
            let clips = this.dom.children( view);
            for ( let clipi=0; clipi < clips.length; clipi++) {
                let clip = clips[ clipi];
                let exTag = this.dom.attr( clip, 'exTag');
                let clipHTML = "";
                if ( exTag == "div.image") {                    
                    let imgEl = this.dom.element( 'img', clip);
                    let imgURL = (imgEl) ? imgEl.src : "";
                    let tagsEl = this.dom.element( 'span', clip);
                    let tags = ( tagsEl) ? tagsEl.textContent : "";
                    clipHTML += '<div id="'+clip.id+'_copycb'+'" class = "CLIPBOARD_clip" ';
                    clipHTML += 'draggable="true" ondragstart="window.ude.dataActionEvent( event);" onclick="window.clipboarder.insert( \'20220207080254_image\');" ';
                    clipHTML += 'cb_type="image" cb_tags="'+tags+'">';
                    clipHTML += '<img class="CLIPBOARD" src="'+imgURL+'" width="100%" height="auto">';
                    //clipHTML += ' <div class="cb_tags" contenteditable="true" onkeydown="clipboarder.event( 'keydown', event);">coach digital</div>';
                    clipHTML += '</div>';
                }
                modelClipboardHTML += clipHTML;
            }
        }
        /*
        <div id="20220207080254_image" class="CLIPBOARD_clip" draggable="true" ondragstart="window.ude.dataActionEvent( event);" onclick="window.clipboarder.insert( '20220207080254_image');" 
        cb_type="image" ud_oid="SimpleArticle-clipboard techdir-SimpleArticle-20220207080254_image--5-278-5-376--AL|7" cb_tags="coach digital"><img class="CLIPBOARD" src="/upload/CUwUyUMvi_Business-Documentation-feat-image.jpg" width="100%" height="auto">
        <div class="cb_tags" contenteditable="true" onkeydown="clipboarder.event( 'keydown', event);">coach digital</div></div>
        */
        // Prepare endpoint
        let uri = "/webdesk/"+this.dom.attr( 'document', 'ud_oid')+"/AJAX_clipboardTool/e|open/";
        // Call displayAll on server's response
        let me = this;
        let callback = function( context, serverHTML, js) {
            // 2DO Get clips from div.part.clipboard
            let html = serverHTML.replace( '{insertClips}', modelClipboardHTML);
            me.displayAll( context, html, js);
            if ( context.promise) context.resolve( context);
        }
        // Send request to server 
        return this.ud.udajax.serverRequestPromise( uri, "GET", "", {}, callback);
    } // Clipboard.getClips
    
    getClipsByKeywordAndType( keywords="", type="") {
        if ( !this.cache) {
            // Fill cache
            this.getClips();
            return [];
        }
        // Extract clips from cache
        // Setup temporary clipboard
        let clipboardContent = this.cache.textContent;
        let tempClipboard = document.createElement( 'div');
        tempClipboard.innerHTML = clipboardContent;
        let clips = this.dom.elements( "div.CLIPBOARD_clip", tempClipboard);
        let filterWords = keywords.split( ' ');
        let filteredClips = [];
        for ( let clipi=0; clipi<clips.length; clipi++) {
            let clip = clips[ clipi];            
            if ( 
                (!type || this.dom.attr( clip, 'cb_type') == type)
                // && ( !keywords || clip)
            ) { 
                filteredClips.push( clip);
            }
        }
        return filteredClips;
    } // Clipboarder.getClipsByKeywordAndType()
    
   /**
    * Save content in clipboard
    */
    saveClip( clip, saveInDB=false)
    {
        // 2DO Find tool zone (to refresh) or reply with js to refresh if open
     
        // Prepare URL parameters
        let oid = this.dom.attr( clip, 'ud_oid');
        if ( !oid && saveInDB) oid = this.newPasteOid;    
        let action = this.actionRoot+"e"+this.valSep+"paste/";
        // Prepare post data
        let postData = "";
        // 2DO document name needs to be somewhere in UD
        let name = clip.id;
        postData += "form=INPUT_pasteForm&input_oid="+oid+"&nname="+name;
        if ( name == "LastClip") { postData += "_"+this.dom.attr( clip, "cb_type");}
        postData += "&ttext="+encodeURIComponent( clip.innerHTML);
        if ( saveInDB) postData += "&bsave=1";
        // Send to server
        let uri = "/webdesk//AJAX_clipboardTool/";
        let context = { action:"fill zone", zone: this.displayId};
        this.ud.udajax.serverRequest( uri, "POST", postData, context);
    } // Clipboard.save()
  
   /**
    * Delete a clip on server
    */
    deleteClip( clip)
    {
        // 2DO Find tool zone (to refresh) or reply with js to refresh if open
     
        // Prepare URL parameters
        let oid = this.newPasteOid; 
        if ( this.dom.attr( clip, 'ud_oid'))
        {
            // SPLIT 
        }            
        let action = this.actionRoot+"e"+this.valSep+"paste/";

        // Prepare post data
        let postData = "";
        // 2DO document name needs to be somewhere in UD
        let name = clip.id;
        postData += "form=INPUT_pasteForm&input_oid=OID&nname="+name;
        postData += "&ttext=";
     
        // Send to server
        let uri = "/webdesk//AJAX_clipboard/";
        let context = { action:"ignore", element:clip};
        this.ud.udajax.serverRequest( uri, "POST", postData, context);
        clip.remove();
    } // Clipboard.deleteClip()
    
   /**
    * Delete all temporary clips
    */
    deleteAllClips( group = "")
    {
        let clipboard = this.dom.element( displayId);
        let clips = this.dom.children( clipboard);
        for ( let clipi = 0; clipi < clips.length; clipi++)
        {
            // 2DO group = a DIV maybe 
            this.deleteClip( clips[ clipi]);
        }
        
    } // Clipboard.deleteAllClips()
    /**
     *  Add a clip to the display zone
     */
    displayClip( clipHTMLelement, className)
    {
        // Prepare insert action (clip's onlick)
        let insert = "";
        if ( clipHTMLelement.nodeType == 3)
        {
            // Text
        }
        else if ( clipHTMLelement.nodeType == 1)
        {
            // HTML element
            switch ( clipHTMLelement.tagName.toLowerCase())
            {
                
            }
        }
        // Create DIV with clip element in it
        let clip = document.createElement( 'div');
        clip.className = "CLIPBOARD_clip";
        clip.setAttribute( 'onclick', insert);
        clip.appendChild( clipHTMLelement);
        // Add to display
        this.display.appendChild( clip);
    } // Clipboard.displayClip()

    /**
     *  Clipboard server getSuccess callback = Display all clips returned by server
     */    
    displayAll( context, html, js)
    {
        this.display.innerHTML = html;
        // Store in cache        
        if ( this.cache)
        {
            this.cache.textContent = html;
            this.dom.attr( this.cache, 'ud_dupdated', this.ud.ticks);
        }
        if ( js) { 
            doOnload( js);
            this.cache.textContent = html;          
        }
        /* JSON version
        // Check response is JSON
        // Clear displayn
            // For each clip
            let clip = clips[i];
            this.displayClip( clip);
             // Display elements selected for this document
        */
    }   // Clipboard.displayAll()
   
  /*
  deleteClip
  */
  /*
  copy()
  cut()
  
  setClipboardGrab()
  {
    // Change document (maybe with save)
    // Paste clicked objects
    // 
  }
*/
} // JS Clipboard class
if ( typeof process != 'object') {
    // define( function() { return { class : Clipboarder, src: document.currentScript.src};});  
} else { 
    // Testing under node.js
    if ( typeof exports === 'object') module.exports = { class: Clipboarder};
    else window.Clipboarder = Clipboarder;
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined")
    {
        console.log( 'Syntax:OK');
        //console.log ('Clipboard JS class test');
        console.log( 'Test completed');
    }        
} // End of test routine