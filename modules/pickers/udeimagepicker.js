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
    dzTemplate = `
<div style="position:relative;height:340px;">
    <div id="{name}-imagezone" style="position:absolute; top:0; left:0; width:100%; z-index:1">{content}</div>
    <div id="{name}-dropzone" class="Dropzone" ud_type="Dropzone" style="position:absolute; top:0; left:0; z-index:10; height:300px; background-color:unset;">           
        <form id="{name}-drop-form" method="post" enctype="multipart/form-data" accept-charset="UTF-8" name="INPUT_LINKS_script" action="" class="dropzone" style="width:100%;height:300px;">
            <input type ="hidden" name="form" value="INPUT_dropImage" />  
            <input type ="hidden" name="input_oid" value="{oid}" />       
            <input type ="hidden" name="nname" value="{name}" />               
            <input type ="hidden" name="domainAndPath" value="{domainAndPath}" /> 
        </form>
    </div>
</div>
`;
    
    // Set up table editor
    constructor( dom, ude)  {
        this.dom = dom;
        this.ude = ude;
        if ( typeof API != "undefined" && API) {
            API.addFunctions( this, [ 
                'setImage', 'getImagePicker', 'getImageSelection', 'setImageFilter', 'getMatchingImages', 'getBestMatchingImage',
                'fetchImagesForMatching', 'licenseImage', 'updateSelection', 'getImageAndLink', 'addLinkToImage'
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
                    /*
                    // Save contents before showing selection
                    this.saveImage = saveable.innerHTML;
                    this.saveImageElement = saveable;
                    // Show selecton of images
                    this.showImageSelection( saveable);
                    */
                    // Setup dropbox
                    this.dropbox( saveable, true);
                    processed = true;
                } else if ( e.action == "leave") {
                    /*
                    if ( this.saveImageElement) {
                        this.saveImageElement.innerHTML = this.saveImage;
                        this.saveImageElement = "";
                        this.saveImage = "";
                    }
                    */
                    // Close drop box
                    this.dropbox( saveable, false);
                    processed = true;
                }
                break;
            case "change" :
                let tagHolder = this.dom.element( 'span.field.image-tags', element);
                let tagPlace = this.dom.attr( tagHolder, 'ude_place');
                let tags = this.dom.textContent( tagHolder);
                if ( tags != tagPlace && tags !=  this.dom.attr( element, 'ud_filter')) {
                    // Rebuild selection
                    /* Idea for using a hook. Not needed for FTP source
                    // Try hook can return Promise or Array
                    let selection = $$$.appGetImageSelection( element, tags);
                    let selectionPr = null:
                    if ( selection && typeof selection == "object" && Array.isarray( selection)) {
                        // Is a selection
                        this.setupSelection( element, tags, selection);
                        break;
                    } else if ( selection && typeof selection == "object") {
                        // Is a promise of a selection
                        selectionPr = selection;
                    } else {
                        // No hook response
                        selectionPr = this._getMatchingImagesFromService( tags, $$$.dom.attr( element, 'ud_lang'));
                    }
                    selectionPr.then ( (selection) => { this.setupSelection( element, selection);}));
                    // Remove below
                    */
                    let pr = this._getMatchingImagesFromService( tags, $$$.dom.attr( element, 'ud_lang'));
                    pr.then( ( selection) => {
                        this.dom.attr( element, 'ud_selection', selection.join( ','));
                        // if ( selection.indexOf( currentImage) == -1) 
                        this.setImage( element, selection[0]);                                               
                        // Update filter & selection
                        let selectionStr = selection.join( ',');
                        this.dom.attr( element, 'ud_filter', tags); 
                        this.dom.attr( element, 'ud_selection', selectionStr);     
                        // 2DO updateTextra( )  
                        let textraS = this.dom.attr( element, 'ud_extra');                   
                        let textra = this.dom.udjson.parse( textraS);
                        textra[ 'filter'] = tags;
                        textra[ 'selection'] = selectionStr;
                        this.dom.attr( element, 'ud_extra', JSON.stringify( textra));
                        // Save element
                        $$$.setChanged( element);                        
                    });                    
                }
                processed = true;
                break;
            case 'paste':
                element.textContent = e.data;
                this.ude.setChanged( saveable);
                processed = true;
                break;
        }
        return processed;
    }

    /**
     * Activate dropbow on an image picker
     * @param {object} element The image picker
     * @param {bool} setup True to add dropbox, false
     */
    dropbox( element, setup) {
        // Look for drop form
        let dropFormId = element.id + "-drop-form";
        let dropForm = this.dom.element( '#' + dropFormId, element);
        if ( setup) {
            // Setup drop box            
            if ( !dropForm) {
                // Add required HTML for drop zone
                let vals = { content:element.innerHTML, name:element.id, domainAndPath: $$$.getUDparam( 'image-source'), oid:'not used'};
                let html = this.ude.calc.substitute( this.dzTemplate, vals);
                element.innerHTML = html;
                dropForm = this.dom.element( dropFormId);
            } else {
                // Open dropbox
                dropForm.dropzone.element.style.cursor = "crosshair";
                dropForm.dropzone.hiddenFileInput.style.cursor = "crosshair";
                dropForm.dropzone.hiddenFileInput.disabled = false;
            }
            if ( dropForm && typeof Dropzone == "undefined") {
                let src = "/upload/smartdoc/vendor/dropzone.css";
                let styleTag = document.createElement( 'style');
                styleTag.id = "dropzone_css";                
                styleTag.onerror = function() { debug( {level:2}, src, ' is not available'); }
                styleTag.onload = function() { debug( {level:2}, src, "loaded"); }
                styleTag.src = src;  
            }
            require( ['vendor/dropzone/dropzone'], function()  {
                let dropForm = API.dom.element( dropFormId);
                if ( dropForm && typeof dropForm.dropzone == "undefined") {
                    let myDropzone = new Dropzone(
                        "#"+dropFormId, 
                        { 
                            url: UD_SERVICE + "/", //webdesk//AJAX_clipboardTool/e|paste/", 
                            paramName: "gimage", 
                            dictDefaultMessage: '' //Glisser vos fichiers images ici',
                            //dictDefaultMessage: "Â Â Â Â Â <br />Â Â <br />Â "
                        }
                    );
                    myDropzone.on( "complete", function( file) {
                        // Analyse file name
                        let fileParts = file.name.split( '.');
                        let tag = fileParts[0];
                        // Update image
                        let picker = $$$.dom.element( element.id);
                        if ( picker) {
                            let img = $$$.dom.element( 'img', picker); 
                            let tagHolder = $$$.dom.element( 'span.image-tags', picker);
                            if ( img) {
                                // Set existing image's src attribute
                                let p = $$$.getUDparam( 'image-source');
                                p = p.replace( 'www/', '');
                                if ( p) img.src = 'https://' + p + '/' + file.name;  
                                // Set file name without extension as tag
                                if ( tagHolder) tagHolder.textContent = tag;
                            }
                            // Remove dropzone
                            let imageZone = $$$.dom.element( '#' + element.id + "-imagezone", element);
                            element.innerHTML = imageZone.innerHTML;
                            // Close menu
                            $$$.closeBox();
                            /*
                            // Remove dropzone preview
                            let msg = $$$.dom.element( 'div.dz-message', picker);
                            if ( msg) msg.remove();
                            let preview = $$$.dom.element( 'div.dz-preview', picker);
                            if ( preview) preview.remove();
                            */
                            // Save picker
                            $$$.setChanged( element);
                        }
                    }); 
                }
            });   // end of require
        } else {
            if ( dropForm) {
                // Remove dropzone
                let imageZone = this.dom.element( '#' + element.id + "-imagezone", element);
                element.innerHTML = imageZone.innerHTML;
                /*
                // Close dropbox
                dropForm.dropzone.element.style.cursor = "pointer";
                dropForm.dropzone.hiddenFileInput.style.cursor = "pointer";
                dropForm.dropzone.hiddenFileInput.disabled = true;
                */
            }
        }
    }

    setupSelection( elementOrId, selection) {
        let element = this.dom.element( elementOrId);
        if ( !element || !selection) return;
        // Show 1st image with filter field and link
        this.setImage( element, selection[0]);       
        // Update filter & selection
        let tagHolder = this.dom.element( 'span.field.image-tags', element);
        let linkHolder = this.dom.element( 'span.field.image-link', element);
        let selectionStr = selection.join( ',');
        if ( tagHolder && !$$$.hasDefaultContent( tagHolder)) this.dom.attr( element, 'ud_filter', tagHolder.textContent); 
        this.dom.attr( element, 'ud_selection', selectionStr);                           
        let textra = { filter:tags, selection:selectionStr};
        this.dom.attr( element, 'ud_extra', JSON.stringify( textra));
    }
    
    updateSelection( elementOrId, tagHolderOrId=null) {
        let element = $$$.dom.element( elementOrId);
        let tags = ( tagHolderOrId) ? $$$.dom.textContent( tagHolderOrId) : this.dom.attr( element, 'ud_filter');
        if ( !element || !tags) return;
        /*
        Check clipboard
        Check FTP
        if none use service
        */
        let pr = this._getMatchingImagesFromService( tags, $$$.dom.attr( element, 'ud_lang'));
        pr.then( ( selection) => {
            this.dom.attr( element, 'ud_selection', selection.join( ','));
            this.setImage( element, selection[0]);
            // Update filter & selection
            let selectionStr = selection.join( ',');
            this.dom.attr( element, 'ud_filter', tags); 
            this.dom.attr( element, 'ud_selection', selectionStr);                           
            let textra = { filter:tags, selection:selectionStr};
            this.dom.attr( element, 'ud_extra', JSON.stringify( textra));
            // Save element
            $$$.setChanged( element);                        
        });                  
    }

    updateTextra( element, key, value) {
        let json = this.dom.attr( element, 'ud_extra');
        let textra = this.dom.udjson.parse( json);
        textra[ key] = value;
        this.dom.attr( element, 'ud_extra', JSON.stringify( textra));
    }

    prepareToSave() {
    }
    
    initialise( saveableId) {
        let saveable = this.dom.element( saveableId);
        // 2DO if :ud_filter just display ud_filter input field
        if ( saveable.innerHTML == "" || API.hasDefaultContent( saveable)) {
            // Empty element
            let filter = this.dom.attr( saveable, 'ud_filter');
            if ( filter) {
                // With filter parameter so show selecton of images based on filter
                if ( typeof clipboarder != "undefined") {
                    let clipPromise = clipboarder.getClips();
                    if ( !clipPromise) this.showImageSelection( saveable);
                    else clipPromise.then( () => { 
                        // 2DO check nb in selection and if filter exists
                        this.showImageSelection( saveable);
                    });
                } else this.showImageSelection( saveable);
            } else {
                // No filter so display default content
                saveable.innerHTML = $$$.defaultContent( saveable, "", true);                
            }
        } else {
            // Element has an image
            // Check tag & link field present
            let tag = $$$.dom.element( 'span.field.image-tags', saveable);
            if ( !tag) {
                // Look for deprecated format
                tag = $$$.dom.element( 'span.tags', saveable);
                if ( tag) {
                    // Update
                    this.dom.attr( tag, 'ud_type', 'field');
                    tag.className = "field image-tags";
                }
            }
            if ( !tag) {
                saveable.innerHTML += $$$.defaultContent( saveable, "" , true);
            }
            let link = $$$.dom.element( 'span.field.image-link', saveable);
            if ( !link) {
                let tagText = tag.textContent;
                tag.remove();
                saveable.innerHTML += $$$.defaultContent( saveable, "", true);
                tag = $$$.dom.element( 'span.field.image-tags', saveable);
                tag.textContent = tagText;
            }
            // Hide tag field if not editing
            let mode = $$$.dom.textContent( 'UD_mode');
            if ( mode.indexOf( 'edit') == -1 && tag) {
                tag.classList.add( 'hidden');
                link.classList.add( 'hidden');
            }
        }
    }
    
    configure( saveableId) {
        // Filter selector
    }
    
    /**
    * @api {JS} $$$.setImage(saveableOrid,src,mselect) Set image
    * @apiParam {string} name The name of the div.image element 
    * @apiSuccess {object} Named array with src and link
    */
    setImage( saveableOrId, src, mselect = false) {
        let saveable = this.dom.element( saveableOrId);
        if ( mselect) {
           // Use multi-selection mode
           // Set class of container to display checkboxes 
           // Check selected image (nextSIbling)
           // Save selection as-is
        } else {
           // Fill element with single selected image
           let filter = $$$.getEditorAttr( saveable, 'ud_filter');
           if (!filter) filter = 'tags';
           let img = this.dom.element( 'img', saveable); 
           if ( img) {
                // Set existing image's src attribute
                img.src = src;  
                /*
                let link = $$$.getImageLink( src, filter);
                if ( link && linkHolder) {
                    this.addLinkToImage( link);
                    linkHolder.textContent = link;
                }
                */
           } else {
                // Default content if element is empty
                if ( !saveable.innerHTML) saveable.innerHTML = $$$.defaultContent( saveable, '', true);
                // Add image
                img = document.createElement( 'img');
                let ref = saveable.firstChild; // caption
                if ( ref && ref.nextSibling) {
                    ref = ref.nextSibling;
                    saveable.insertBefore( img, ref);
                }
           }            
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
        // Get element
        let element = this.dom.element( elementOrId);
        if  ( !element) return [];
        // Initialise variables
        let selection = [];
        let selectionStr = "";        
        let pr = new Deferred();
        let filter = this.dom.attr( element, 'ud_filter');
        // Detect if filter has changed
        let tagHolder = this.dom.element( 'span.field.image-tags', element);
        if ( tagHolder && tagHolder.textContent != filter) {
            // Filter has changed
            filter = tagHolder.textContent;
            this.dom.attr( element, 'ud_filter', filter);
            this.dom.attr( element, 'ud_selection', selectionStr);                       
        } else {
            // Filter unchaged so getr current selection
            selectionStr = this.dom.attr( element, 'ud_selection');
        }
        if ( !selectionStr) {
            // No current image selection   
            if ( !filter) {
                // No filter so build use keywords if provided
                if ( typeof keywords.element != "undefined") filter += keywords.element.join( ' ');
                if ( typeof keywords.section != "undefined") filter += keywords.section.join( ' ');
            }
            if ( !filter) {
                // Still no filter, so lets use surrounding text
                let walk = element;
                for ( let previ=0; previ < 3; previ++) {
                    walk = walk.previousSibling;
                    if (!walk) break;
                    filter += walk.textContent;
                }
                walk = element;
                for ( let nexti=0; nexti < 3; nexti++) {
                    walk = walk.nextSibling;
                    if (!walk) break;
                    filter += walk.textContent;
                }
            }
            if ( filter) {
                // Search for images
                let selectPr = this.fetchImagesForMatching( filter);
                selectPr.then( ( setOfPromises) => {
                    let query = setOfPromises[1].value;
                    let selection = setOfPromises[2].value;
                     // selection = selection.concat( $$$.getMatchingImages( query));
                    this.dom.attr( element, 'ud_selection', selection.join( ','));
                    this.dom.attr( element, 'ud_filter', query); 
                    pr.resolve();
                });
                /*
                selection = this.getMatchingImages( filter);
                if ( selection) {
                    this.dom.attr( element, 'ud_selection', selection.join(','));
                    this.ude.setChanged( element);
                }
                */
                
            }
        } else {
            selection = selectionStr.split( ',');
            pr.resolve(); 
        }
        /*
        * 2DO Rematch with filter
        // For each selection, refilter ?
        let selection = [];
        for ( let seli=0; seli < selection.length; seli++) {
            let src = selection[ seli];
            selection.push( src);
        }
        */
        // return selection;
        return pr;
    } // UDEimagePicker.getImageSelection()

   /**
    * {JS} $$$.fetchImagesFortMatching(text) Return a promise that resolves when images are loaded
    * @param {*} text 
    * @returns 
    */
    fetchImagesForMatching( text, lang = "") {
        // Get clipboard images
        let prom1 = clipboarder.getClips(); 
        let prom2d = null; 
        let prom3d = new Deferred();
        if ( text && text.split( ' ').length < 5) this.queryCache[ text] = text;
        if ( text && typeof this.queryCache[ text] == "undefined") {
            prom2d = this.getImageSearchQuery( text, lang);            
        } else prom2d = { promise:Promise.resolve( this.queryCache[ text])};
        prom2d.promise.then( (query) => {
            if ( typeof this.imageCache[ query] == "undefined") {
                // Get images for this request
                let prom3 = this._getMatchingImagesFromService( query, 'en', "UD_spare"); // lang keywords returned in english
                prom3.then ( (selection) => prom3d.resolve(selection))
                /*
                {
                    let clips = this.getMatchingImages( text, false);//From cli^pboard
                    selection.concat( clips);
                    if ( !selection.length) selection = this.getMatchingImages( text); // will provide all clips
                    prom3d.resolve( selection);
                }

                */
            } else prom3d.resolve( this.imageCache[ query]);
        });
        return Promise.allSettled( [ prom1, prom2d.promise, prom3d.promise]);
    }

   /**
    * @api {JS} $$$.getImageSearchQuery(text) Return a search query optimised for image search
    * @apiParam {string} text 
    * @apiSuccess {string} The optimised query
    */
    getImageSearchQuery( text, lang = "", targetName="UD_spare") { //}, service="shutterstock") {
        // Use keywords extract service 
        let action ="extract";
        if ( !lang) lang = $$$.getLang( $$$.dom.textContent( 'UD_lang'));
        // Prepare service request
        let request = {
            service:"keywords",
            provider : "default",
            action: action,
            lang : lang.toLowerCase(),
            translate : 'en',
            text: text, //query if analyse
            n:3,
            nbResults:5,
            cacheTag : "keywords_" + action + "_" + text.replace( / /g, '').substring(0,30)+lang,            
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
                if ( keywords.length) query = keywords.map( (kw) => { return kw.keyword;}).join( ' ').split( ' ').slice( 0, 4).join( ' ');
                //if ( keywords.length) query = keywords[0].keyword; //keywords.slice( 0, 3).map( (kw) => { return kw.keyword;}).join( ' '); //keywords[0].keyword;
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
    * {JS} $$$.getMatchingImages(text) Return an array of images matching provided text with best match first
    * @param {*} text 
    * @returns 
    */
    getMatchingImages( text, allIfNone = true) {
        let selection = {}; // image url : keyword count
        let all = {};
        if ( typeof clipboarder == "undefined") return [""];
        let filterWords = $$$.getKeywords( text);    
        // Look for matching iùmage in clipboard gallery    
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
         // If no selection use all clipboard images
         if ( !Object.keys( selection).length && allIfNone) selection = all;
         if ( !Object.keys( selection).length) return [];

        // Look at images retrived via image service
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
        // Transfert to simple array
        for ( let seli=0; seli < selTuples.length; seli++) {
            let src = selTuples[ seli].src;
            selection.push( src);   
        }
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
    async _getMatchingImagesFromService( text, lang, targetName="UD_spare") {
        if ( this.imageCache[ text]) return new Promise( (resolve)=>resolve( this.imageCache[ text]));        
        let fromKey = 'from ';
        let fromIndex = text.toLowerCase().indexOf( fromKey);
        let provider = "default";
        let source = "";
        // Set source and provider
        if ( fromIndex > -1) {
            source = text.substring( fromIndex + fromKey.length);
            text = text.substring( 0, fromIndex - 1);            
        } else source = $$$.getUDparam( 'image-source');
        if ( source && source != "shutterstock") {
            //provider = "FTPimages";
            let local = UD_SERVER.replace( 'https://', ''). replace( 'http://', '');
            local = local.replace( 'dev.rfolks.com', 'www.sd-bee.com'); // Patch
            provider = ( source.indexOf( local) > -1) ? "fileImages" : "FTPimages";
        }
        // Prepare service request
        let request = {
            service:"images",
            provider : provider,
            source : source,
            action: "search",
            lang: lang,
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
        let selectionPr = this.getImageSelection( saveable, keywords);
        // IDEA could test string or object
        selectionPr.promise.then( () => {
            let filter = this.dom.attr( saveable, 'ud_filter'); 
            let selection = this.dom.attr( saveable, 'ud_selection').split( ',');
            let htmlSel = "";           
            // Container
            if ( selection.length) {
                // Prompt            
                for ( let seli=0; seli < selection.length; seli++) {
                    let src = selection[ seli];
                    // Select image on click
                    let onclickimg = "API.setImage( '" + saveable.id + "', '" + src + "', API.isLongClick());";
                    onclickimg += onclick;
                    htmlSel += '<img src="'+ src +'" class="thumbnail" onclick="'+ onclickimg + '"/>';
                    // Add invisible tick box for multi-selection                
                }
                $$$.dom.element( saveable.id + 'Selection').innerHTML = htmlSel;

            } else {               
                htmlSel = '<span class="caption">No images found </span>';
            }
            let selHolder = $$$.dom.element( saveable.id + 'Selection')
            if ( selHolder) selHolder.innerHTML = htmlSel;
        });
        // Build & return HTML code empty (or waiting) selection
        let updateSel = "$$$.updateSelection('" + saveable.id + "', '" + saveable.id+"Tags');";
        let cfilter = this.dom.attr( saveable, 'ud_filter'); 
        let html = "";
        /*
        html += '<span class="caption">';
        html += API.translateTerm( "Click to select") + '. ';
        html += API.translateTerm( "Long click for multiple selection") + ".";
        html += '</span>';
        html += '<span id="' + saveable.id + 'Tags" class="tags" data-ude-stage="on"  data-ude-onvalid="' + updateSel + '">' + cfilter + '</span>';
        */
        html += '<div id="' + saveable.id + 'Selection" style="width:100%;">';
        html += '</div>';
        return html;
    } 
 
    licenseImage( elementOrId) {
        let element = this.dom.element( elementOrId);
        let image = this.dom.element( 'img', element);
        let url = image.src;

        // Extract image id
        /*
        * Example of Shutterstock URL
        * https:\/\/image.shutterstock.com\/display_pic_with_logo\/301518489\/1717280833\/
        * stock-photo-businesspeople-on-city-background-and-social-network-interface-and-glowing-human-resource-concept-1717280833.jpg
        *
        // Get last part fo path
        let urlParts = url.split( '/');
        // Seperate file name & extension
        let fileNameParts = urlParts.pop().split( '.');
        // Split file name elements
        let imageNameParts = fileNameParts[0].split( '-');
        // Id is last part of image name
        let imageId = imageNameParts[ imageNameParts.length - 1];
        */
        let imageIdb = url.split( '/').pop().split( '.')[0].split('-').pop(); 
        // use service to licence this image
        let req = {
            service : 'images',
            action : 'license',
            imageId : url,
            dataSource : 'url',
            dataTarget : 'UD_spare'
        }
        let servicePr = $$$.servicePromise( 'images', req);
        servicePr.then( () => {
            image.src = this.dom.textContent( 'UD_spare');
            $$$.setChanged( element);
        });

    }

    /**
    * @api {JS} $$$.getImageAndLink(name Return image src and link
    * @apiParam {string} name The name of the div.image element 
    * @apiSuccess {object} Named array with src and link
    */
    getImageAndLink( name) {
        let el = this.dom.elementByName( name);
        let img = this.dom.element( "img",  el);
        /*
         * 2DO use src name to guess link
        */
        let link = "";
        let linkHolder = this.dom.element( "a", el);
        if ( linkHolder) {
            link = this.dom.attr( linkHolder, 'href');
        } else {
            linkHolder = this.dom.element( 'span.image-link', el);
            if ( linkHolder) link = linkHolder.textContent;
        } 
        return { src:img.src, link:link};     
    }

    /**
    * @api {JS} $$$.addLinkToImage(name) Return true
    * @apiParam {string} name The name of the div.image element 
    * @apiSuccess {object} Named array with src and link
    */
    addLinkToImage( name) {
        let el = this.dom.elementByName( name);
        let linkHolder = this.dom.element( 'span.image-link', el);
        let link = linkHolder.textContent;
        // 2DO option onclick ?
        if ( !link) return false;
        // Look for existing anchor
        let a = this.dom.element( 'a', el);
        if ( a) {
            a.href = link;
        } else {
            // Replace existing image with a containing anchor and image
            let img = this.dom.element( 'img', el);                    
            let i2 = document.createElement( 'img');
            i2.src = img.src;
            let a = document.createElement( 'a');
            a.href = link;
            a.appendChild( i2);
            el.insertBefore( a, img);
            img.remove();
        }
        $$$.setChanged( el);
        return true;
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