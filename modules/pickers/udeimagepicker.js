//const clipboarder = require('../tools/clipboarder.js');

//const { resolve } = require('ejs/ejs.min.js');

/**
 *  udeimagepicker.js
 * 
 *  This is the client-side part of the Image Picker component and works with the server-side udimagepicker.php.
 *  
 *  As with other UD modules, methods are grouped in 4 blocks as listed below :
 *    
 *     1 - UD-VIEW-MODEL - Preparing data received from server for editing
 *     2 - UD-VIEW-MODEL - Preparing edited data for saving
 *     3 - UDE-VIEW      - Editing functions
 *     4 - CALUCLATOR    - Calculator functions
 *
 */
 class UDEimagePicker {
    dom;
    ude;
    imageCache = {};
    queryCache = {};
    
    // Set up table editor
    constructor( dom, ude)  {
        this.dom = dom;
        this.ude = ude;
        if ( typeof API != "undefined" && API) {
            API.addFunctions( this, [ 
                'setImage', 'getImagePicker', 'getImageSelection', 'setImageFilter', 'getMatchingImages', 'getBestMatchingImage',
                'fetchImagesForMatching'
            ]);
        }
    } // UDEimagePicker.construct()
    
    inputEvent( e, element){
        let processed = false;
        let source = element; // e.source;
        let saveable = this.dom.getSaveableParent( element);
        let displayable = this.dom.getParentWithAttribute( 'ude_bind', element);
        let event = e.event;
        switch (event) {
            case "use":
                // 2DO // Look for link API.getFirstLink( e.data);
                // 2DO // Look for image API.getFirstImage( e.data);
                // 2DO Replace link if link already set
                // 2DO remove link if link is empty
                let dataToUse = e.data;
                if ( dataToUse.indexOf( 'http') == 0) {
                    // Add link over image
                    let html = saveable.innerHTML;
                    if ( html.indexOf( '<img ') > -1) {
                        html = '<a href="'+dataToUse+'" target="_blank">'+html+'</a>';
                        saveable.innerHTML = html;
                        this.ude.setChanged( saveable);
                    }
                }
                processed = true;
                break;
            case "configure" :
                if ( e.action == "enter" && saveable.innerHTML != "") {
                    if ( this.saveImage) debug( { level:1}, "image not restored", this.saveImage);
                    // Save contents before showing selection
                    this.saveImage = saveable.innerHTML;
                    this.saveImageElement = saveable;
                    // Show selecton of images
                    this.showImageSelection( saveable);
                } else if ( e.action == "leave") {
                    if ( this.saveImageElement) {
                        this.saveImageElement.innerHTML = this.saveImage;
                        this.saveImageElement = "";
                        this.saveImage = "";
                    }
                }
                break;
        }
        return processed;
    }
    
    prepareToSave() {
    }
    
    initialise( saveableId) {
        let saveable = this.dom.element( saveableId);
        if ( saveable.innerHTML == "" || API.hasDefaultContent( saveable)) {
            // Show selecton of images
            if ( typeof clipboarder != "undefined") {
                let clipPromise = clipboarder.getClips();
                if ( !clipPromise) this.showImageSelection( saveable);
                else clipPromise.then( () => { 
                    // 2DO check nb in selection and if filter exists
                    this.showImageSelection( saveable);
                });
            } else this.showImageSelection( saveable);
        } else {
            // Already has an image
        }
    }
    
    configure( saveableId) {
        // Filter selector
    }
    
    setImage( saveableOrId, src, mselect = false) {
        let saveable = this.dom.element( saveableOrId);
        if ( mselect) {
           // Use multi-selection mode
           // Set class of continer to display checkboxes 
           // Check selected image (nextSIbling)
           // Save selection as-is
        } else {
           // Fill element with single selected image
           let html = '<img src="' + src + '" class="standard" /><span class="tags" data-ude-place="Tags">Tags</span>';
           if ( saveable) saveable.innerHTML = html;
           this.ude.setChanged( saveable);
        }
    } // UDEimagePicker.setImage()
    
    setFilter( saveableId, filter) {
        
    }
    
    showImageSelection( saveableOrId) {
        // Get element and its ud_selection attribute
        let saveable = this.dom.element( saveableOrId);
        if  ( !saveable) return;
        //let selection = this.getImageSelection( saveable);
        let html = this.getImagePicker( saveable);
        saveable.innerHTML = html;
    } // UDEimagePicker.showImageSelection()
    
    getImageSelection( elementOrId, keywords) {
        // Get element and its ud_selection attribute
        let element = this.dom.element( elementOrId);
        if  ( !element) return [];
        let selection = [];
        let all = [];
        let selectionStr = this.dom.attr( element, 'ud_selection');
        let filter = this.dom.attr( element, 'ud_filter');
        if (!filter) {
            // Build filter from surrounding text
            if ( typeof keywords.element != "undefined") filter += keywords.element.join( ' ');
            if ( typeof keywords.section != "undefined") filter += keywords.section.join( ' ');
        }
        if (!selectionStr && typeof clipboarder != "undefined") {
            // 2DO Get surrounding text
            let context = "";
            let walk = element;
            for ( let previ=0; previ < 3; previ++) {
                walk = walk.previousSibling;
                if (!walk) break;
                context += walk.textContent;
            }
            walk = element;
            for ( let nexti=0; nexti < 3; nexti++) {
                walk = walk.nextSibling;
                if (!walk) break;
                context += walk.textContent;
            }
            selection = this.getMatchingImages( context);
            // 2DO store selection in element & save

        } else {
            selection = selectionStr.split( ',');
        }
        /*
        // For each selection, refilter ?
        let selection = [];
        for ( let seli=0; seli < selection.length; seli++) {
            let src = selection[ seli];
            selection.push( src);
        }
        */
        return selection;
    } // UDEimagePicker.getImageSelection()

   /**
    * {JS} $$$.fetchImagesFortMatching(text) Return a promise that resolves when images are loaded
    * @param {*} text 
    * @returns 
    */
    fetchImagesForMatching( text) {
        // Get clipboard images
        let prom1 = clipboarder.getClips(); 
        let prom2d = { promise:Promise.resolve()};
        let prom3d = new Deferred();
        if ( typeof this.queryCache[ text] == "undefined") {
            prom2d = this.getImageSearchQuery( text);            
        } 
        prom2d.promise.then( (query) => {
            if ( typeof this.imageCache[ query] == "undefined") {
                // Get images for this request
                let prom3 = this._getMatchingImagesFromService( query, "UD_spare");
                prom3.then ( (selection) => prom3d.resolve(selection))
            } else prom3d.resolve( query);
        });
        return Promise.allSettled( [ prom1, prom2d.promise, prom3d.promise]);
    }

   /**
    * {JS} $$$.getImageSearchQuery(text) Return a search query optimised for image search
    * @param {string} text 
    * @returns {string} The optimised query
    */
    getImageSearchQuery( text, targetName="UD_spare") { //}, service="shutterstock") {
        // Use keywords extract service 
        let action ="extract";
        // Prepare service request
        let request = {
            service:"keywords",
            provider : "default",
            action: action,
            text: text, //query if analyse
            n:3,
            nbResults:5,
            cacheTag : "keywords_" + action + "_" + text.replace( / /g, '').substring(0,30),            
            dataSource:"keywords", //posWords for analyse
            dataTarget:targetName
        }
        // Send request and return with promise
        let servicePr = $$$.servicePromise( 'keywords', request);
        let deferred = new Deferred();
        servicePr.then( () => {
            let query = "";
            if ( action == "extract") {
                let keywords = $$$.json.parse( targetName);
                if ( keywords.length) query = keywords[0].keyword;
            } else if ( action == "analyse") {    
                let posWords = $$$.json.parse( targetName);                
                if ( posWords && typeof posWords['VERB'] != "undefined") {
                    query = posWords.VERB[0] + ' ' + posWords.NOUN[0] + ' ' + posWords.ADJ[0];
                    $$$.dom.element( targetName).textContent = query;                    
                }
            }
            if (query) this.queryCache[ text] = query;
            deferred.resolve( query);
        });
            // Word frequency
        //return 1St verb 1 noun 1 adjectif adverb
        return deferred;
    }


   /**
    * {JS} $$$.getMatchingImages(text) Return an array of images matching prvided text with best match first
    * @param {*} text 
    * @returns 
    */
    getMatchingImages( text) {
        let selection = {};
        let all = {};
        if ( typeof clipboarder == "undefined") return [""];
        let filterWords = $$$.getKeywords( text);        
        let clips = clipboarder.getClipsByKeywordAndType("", "image");
        for ( let clipi=0; clipi<clips.length; clipi++) {
            let clip = clips[ clipi];
            let img = this.dom.element( "img", clip);
            if (img) {
                let src = img.src;
                if ( !src) continue;
                if ( true) {
                    let tags = this.dom.parentAttr( img, 'cb_tags');
                    let imageKeywords = $$$.getKeywords( img.src + ' ' + tags);
                    let wordi = 0;
                    for ( wordi = 0; wordi < filterWords.length; wordi++) {
                        if ( imageKeywords.indexOf( filterWords[ wordi]) > -1) {
                            //selection.push( src);
                            //break;                        
                            if ( typeof selection[ src] == "undefined") selection[src]=0;
                            selection[src]++;
                        }
                    }
                } 
                all[src]=0;
            }
        }
        if ( !Object.keys( selection).length) selection = all;
        // Look at fetched images
        /*
        let fetched = cacheImages[ text];
        if ( fetched && !selection.length) selection = fetched;
        comment out getMatching below
        */
        // Sort by keyword match score
        // Prepare array for sort
        let selTuples =  [];    
        for ( let selKey in selection) selTuples.push( {src:selKey, score:selection[ selKey]});
        selection = [];
        // Sort by score
        selTuples.sort( (a,b) => ( (a.score < b.score) ? 1 : (a.score == b.score) ? 0 : -1));  
        for ( let seli=0; seli < selTuples.length; seli++) selection.push( selTuples[ seli].src);   
        if ( selection.length == 0 && this.imageCache) {
            // if ( text.indexOf( "vêtements") > -1) text = "vêtements usés";
            let query = $$$.json.value( this.queryCache,  text);
            if ( query) selection = $$$.json.value( this.imageCache, query);
        }  
        return selection;
    }
    
    getBestMatchingImage(text) {
        return this.getMatchingImages( text)[0];
    }

    _getMatchingImagesinClipboard( text) {

    }
    async _getMatchingImagesFromService( text, targetName="UD_spare") {
        // 2DO if text is array loop & merge top 3, resolve on last
        // if ( text.indexOf( "vêtements") > -1) text = "vêtements usés";
        if ( this.imageCache[ text]) return new Promise( (resolve)=>resolve( this.imageCache[ text]));
        // Prepare service request
        let request = {
            service:"images",
            provider : "default",
            action: "search",
            query: text,
            dataSource:"images",
            dataTarget:targetName
        }
        // Send request and return with promise
        let servicePr = $$$.servicePromise( 'images', request);
        let deferred = new Deferred();
        servicePr.then( () => {
            // let selection = $$$.dom.textContent( targetName).split( ',');
            let selection = $$$.json.parse( targetName);
            this.imageCache[ text] = selection;
            deferred.resolve( selection);
        });
        return deferred.promise;  
    }
    
    getImagePicker( saveableOrId, onclick="", keywords={}) {
        // Get element and its ud_selection attribute
        let saveable = this.dom.element( saveableOrId);
        if  ( !saveable) return;
        let selection = this.getImageSelection( saveable, keywords);
        // Build HTML code
        let html = '<span class="caption">No images found </span>';
        // Container
        if ( selection.length) {
            // Prompt
            html = '<span class="caption">';
            html += API.translateTerm( "Click to select") + '. ';
            html += API.translateTerm( "Long click for multiple selection") + ".";
            html += '</span>';
            html += '<div style="width:100%; height: 300px; overflow-y:scroll">';
            // For each selection, display image as thumbnail
            for ( let seli=0; seli < selection.length; seli++) {
                let src = selection[ seli];
                // Select image on click
                let onclickimg = "API.setImage( '" + saveable.id + "', '" + src + "', API.isLongClick());";
                onclickimg += onclick;
                html += '<img src="'+ src +'" class="thumbnail" onclick="'+ onclickimg + '"/>';
                // Add invisible tick box for multi-selection
            }
            html += '</div>';
        }
        return html;
    } 
 
    licenceImage( url) {
        // Extract image id
        // use service to licence this image
    }
    
 } // JS class UDEimagePicker

if ( typeof process != 'object') {
    let exTag = "div.image";    
    {
        // Initialise
        let module = new UDEimagePicker( window.ud.dom, window.ud.ude);
        window.ud.ude.modules[ exTag] = {instance:module, state:"loaded"};
    }
} else {
    // Testing under node.js
    module.exports = { class: UDEimagePicker};
    if ( typeof window == "undefined")
    {
        console.log( 'Syntax:OK');            
        console.log( 'Start of test program');
        var envMod = require( '../../tests/testenv.js');
        envMod.load();
        // Setup our UniversalDoc object
        ud = new UniversalDoc( 'document', true, 133);
        let ip = new UDEimagePicker( ud.dom, ud.ude);
        console.log( ip.getBestMatchingImage( 'sd bee'));
        console.log( 'Test completed');
        process.exit(0);
    }
} 