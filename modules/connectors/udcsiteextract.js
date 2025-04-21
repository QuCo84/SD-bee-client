/**
 * udcsiteextractconfig.js
 * Client-side configurator for siteextract service connector
 *
 *
 * catModels/modelname/field   articles or pages ?
 * pageModels/modelname/field
 * cats/name/uri and model
 * pages/name/uri and model
 
 */
 class UDC_siteExtract {
    dataByElement = {};
    parent = null;
    configSuffix = "_config";
    lastSite = "";
    steps = { 
        site:2, getSite:3, page:4, selection:5, getPageOrSelection: 6, 
        title:7, image:8, text:9, link:10, author:11, category:12, price:13,        
        element:20
    };
    
    constructor( parent) {
        // 2DO doen't need UDE as API used systematically for access to dom and other fcts
        if ( parent) this.parent = parent;
        window.udc_siteextract = this;
        if ( typeof API != "undefined") API.addFunctions( this, [ 'siteExtractConfig']);
        debug( {level:5}, "UDC_siteExtract constructor");
    }
    
    paramGet( name, param) {
        let saveable = API.dom.element( "[name='"+name+"']", "document");
        if ( saveable && API.dom.attr( saveable, 'ud_type') == "connector") return API.connectorGet( name, param);
        else return API.json.valueByPath( name + "_config_parameters", param);
    }
    
    paramSet( name, param, value) {
        let saveable = API.dom.element( "[name='"+name+"']", "document");
        if ( saveable && API.dom.attr( saveable, 'ud_type') == "connector") return API.connectorSet( name, param, value);
        else return API.json.valueByPath( name + "_config_parameters", param, value);       
    }
    
    buildConfigZone( name) {
        debug( {level:5}, "UDC_siteExtract buildConfigZone");        
        // lookfor JSON100 object
        let json = $$$.dom.udjson.parse( name + '_object');
        let params = null;
        if ( json) {
            // JSON100 object
            params = json.data.config.value.value;
        } else {
            // !JSON100, parameters stored in seperate div       
            let paramHolder = API.dom.element( name+"_parameters");
            params = API.udjson.parse( paramHolder.textContent);
        }
        let configZoneId = name + this.configSuffix;
        let configZone = API.dom.element( configZoneId);
        if ( !configZone || !params) return debug( { level:5, return:false}, "No config zone to fill or no params in", name, configZone, params);
        // Fill config zone if needed
        let frame = API.dom.element( configZoneId+"_frame");
        if ( !frame) {
            debug( {level:5}, "Creating ", configZoneId);
            let baseName = configZoneId;
            API.dom.emptyElement( configZone);
            let label  = API.translateTerm( "Entrez l'adresse de votre site", 'FR');
            let para = API.dom.insertElement( "p", label, {id:baseName+"_label"}, configZone, false, true);
            let attr = { type:"text", id:baseName+"_input", value:"https://"};
            API.dom.insertElement( "input", "", attr, para, configZone, false, true);
            attr = { id: baseName+"_ok", class:"button", 'onclick':"API.siteExtractConfig('"+name+"');"};
            API.dom.insertElement( "span.button", "OK", attr, configZone, false, true);
            let sandbox = "allow-top-navigation allow-scripts allow-same-origin";
            attr = { id: baseName+"_frame", src:"", class:"siteExtractConfig", sandbox:sandbox};
            API.dom.insertElement( "iframe", "", attr, configZone, false, true);            
        } else { API.dom.attr( frame, 'src', "");}
        let site = API.udjson.valueByPath( params, 'site');
        let uriList = API.udjson.valueByPath( params, 'uriList');
        let step = 2;
        if ( !site) step = 1;
        else if ( !uriList) step = 2;
        API.dom.attr( configZone, 'udc_step', step);
        this.selectSite( name); 
    } //UDC_siteExtract.buildConfig()
    
    // Modified buildConfigZone for cloud fct
    buildConfigZone2( elementOrId, scenario=2) {
        debug( {level:5, coverage:"udcsiteextract"}, "UDC_siteExtract buildConfigZone");        
        // Get container and find existing configZone
        let container = null;
        let configZone = null;
        let baseName = "";
        let name = "";
        if ( typeof elementOrId == "object") {
            // HTML element
            container = elementOrId;
            name = container.id;
            baseName = container.id + this.configSuffix;
        } else {
            // String
            name = elementOrId;
            container = API.dom.element( elementOrId);
            baseName = elementOrId + this.configSuffix;
            configZone = API.dom.element( baseName);
        }
        if ( !container && !configZone) { return debug( { level:5, return:false}, "No where to setup siteExtract", name);}
        if ( !configZone) { 
            let attr = { id:baseName, class:'configurator', ud_type: "configZone", ude_bind:name, ude_edit:"off"};
            configZone = container.appendChild( API.dom.prepareToInsert( 'div', '', attr));
        }
        let paramHolder = API.dom.element( name+"_parameters");
        if ( !paramHolder) {
            let attr = { id:baseName + "_parameters", class:'hidden', ud_type: "parameters", ude_bind:name, ude_edit:"off"};
            paramHolder = container.appendChild( API.dom.prepareToInsert( 'div', '{"site":"www."}', attr));            
        }
        //let params = API.udjson.parse( paramHolder.textContent);
        let frame = API.dom.element( baseName+"_frame");
        if ( !frame) {        
            let label  = API.translateTerm( "Entrez l'adresse de votre site", 'FR');
            let para = API.dom.insertElement( "p", label, {id:baseName+"_label", class:"prompt"}, configZone, false, true);
            let onkey = ""; // "this.nextSibling.classList.remove( 'hidden');"; "2DO intermediate div relative
            let attr = { type:"text", id:baseName+"_input", class:"input", onclick:onkey, value:"www."};
            API.dom.insertElement( "input", "", attr, configZone, false, true);
            /*
            attr = { class:"hidden dropdown-content"};
            let onclick = "API.dom.element( '" + baseName + '_input'+"').value = this.textContent; this.parentNode.parentNode.classList.add( 'hidden');";
            let choices = '<ul><li onclick="'+onclick+'">www.sd-bee.com</li><li onclick="'+onclick+'">www.retraite.com</li><ul>';
            API.dom.insertElement( "div", choices, attr, configZone, false, true);
            */
            attr = { id: baseName+"_ok", type:"button", class:"button", 'onclick':"API.siteExtractConfig('"+container.id+"');"};
            API.dom.insertElement( "span", API.translateTerm( "Suite"), attr, configZone, false, true);
            let click = "API.useActionData('" + baseName + "', '" + baseName + "_input');";
            attr = { id: baseName+"_ok2", type:"button", class:"button", 'onclick':click};
            API.dom.insertElement( "span", API.translateTerm( "Use"), attr, configZone, false, true);
            let sandbox = "allow-top-navigation allow-scripts allow-same-origin";
            attr = { id: baseName+"_frame", src:"", class:"siteExtractConfig", sandbox:sandbox};
            API.dom.insertElement( "iframe", "", attr, configZone, false, true);            
        } else { API.dom.attr( frame, 'src', "");}
        let step = 2;
        API.dom.attr( configZone, 'udc_step', step);
        API.dom.attr( configZone, 'udc_scenario', scenario);
        this.selectSite( container.id); 
    } //UDC_siteExtract.buildConfig2()
    
   /*
    * Process user's action
    */    
    next( name) {
        // Rearm floating menu's TO on each user action
        API.rearmFloaterTO();
        // Setup pointers to useful zones
        let configZoneId = name+this.configSuffix;
        let configZone = API.dom.element( configZoneId);
        let saveable = API.dom.getSaveableParent( configZone); 
        let input = API.dom.element( configZoneId+"_input");          
        let label = API.dom.element( configZoneId+"_label");
        let frame = API.dom.element( configZoneId+"_frame");  
        // Read current step & scenario        
        let step = parseInt( API.dom.attr( configZone, 'udc_step'));
        let scenario = parseInt( API.dom.attr( configZone, 'udc_scenario'));
        // Read data validated by user
        let value = input.value;
        //
        let site = this.paramGet( name, 'site'); // API.json.valueByPath( name)
        if ( !site) { site = this.lastSite;}
        let reqsite = site.replace( "https://", ""); // .replace( /\./g , "_");
        // Process user's data according to step & wait for server response if required
        let wait = 0;
        switch ( step) {
            case 2 : 
                // User just entered site URL
                // set site param and display site
                this.paramSet( name, 'site', value);
                this.lastSite = value;
                reqsite = value.replace( "https://", "");
                //.replace( /\./g , "_");                
                API.dom.attr( frame, 'src', "/net//AJAX_get/?reqsite="+reqsite+"/");
                wait = 2000;
                break;
            case 4 :
            case 5 :
                // User selected a page
                if ( value == "") {
                    if (step == 5) { step = 3;}
                    else { label.textContent = "Affichez l'article à inclure";}
                    break;
                }
                if ( value == "home" || value == this.lastSite) { value = "";}
                else {
                    // Update frame to display URI
                    API.dom.attr( frame, 'src', "/net//AJAX_get/?reqsite="+reqsite+"/"+encodeURIComponent( value));
                    wait = 2000;
                }
                if ( scenario == 2) { 
                  step = 3; // just stay here this.steps.element - 1;
                } else {
                    // Detect if exiting models can cope with this page
                    // 2DO Redo test for existing model, just query json
                    // Build server request
                    let service = this.paramGet( name, 'service');
                    let oid = API.dom.attr( saveable, 'ud_oid');
                    let uri = "/"+service+"/"+oid+"//?uri="+encodeURIComponent( value)+"&format=table";
                    // Use UDEreply to hold server reply 2DO Buid a new element
                    API.dom.emptyElement( "UDEreply");
                    let context = { zone: "UDEreply", action: "fill zone"};
                    // Send request
                    window.ud.udajax.serverRequest( uri, "GET", "", context);
                    // 2DO Update uriList or selectionList
                    if ( step == 4) { step++;} // Skip a  step if URI selection
                }
                break;
            case 6 :   
                // Server has replied to model request 2DO: make a function and move to nextPart2
                let serverResponse = API.dom.element( "UDEreply").textContent;
                if ( serverResponse == "") {
                    step--;
                    break;
                }
                serverResponse = API.udjson.parse( serverResponse);
                let model = "";
                if ( 
                    !serverResponse
                    || serverResponse.length < 2 
                    || serverResponse[1].gimage == "" || serverResponse[1].nteaser == ""
                ) {  
                    // Need a new model
                    let models = this.paramGet( name, 'pageModels');
                    model = "model1";
                    if ( models) {  model = "model" + ( Object.keys( models).length + 1);}
                    API.dom.attr( configZone, 'udc_model', model);                  
                } else { 
                    model = serverResponse[1]['nmodel'];
                    step = 3;
                }
                if ( model) {
                    // 2DO Look at uriIndex and pages, update where value found
                    let uriIndex = this.paramGet( name, 'uriIndex');
                    let uriOffset = 0;
                    if ( uriIndex) { 
                        if ( ( uriOffset = uriIndex.indexOf( value)) == -1) { uriOffset = uriIndex.length;}
                    }
                    this.paramSet( name, 'uriIndex/'+uriOffset, value);
                    this.paramSet( name, 'modelsByURI/'+uriOffset, model);
                }
                break;
            case 7 : // Title
            case 8 : // Image
            case 9 : // Text
            case 10 : // Link
            case 11 : // Author
            case 12 : // Category
            case 13 : // Price
                // User just validated a path to an element containing identified information 
                if ( value) {
                    let cmodel = API.dom.attr( configZone, 'udc_model');
                    let field = [ 'ntitle', 'gimage', 'nteaser', 'nlink', 'nauthor', 'ncategory', 'nprice'][ step-7];
                    this.paramSet( name, 'pageModels/'+cmodel+'/'+field, value, 'set');
                }
                break;
            case this.steps.element : 
                // User just validated a piece of information to copy
                // Grab content from any element
                // 2DO 
                step--;
                break;
        }        
        step++;
        // Update step
        API.dom.attr( configZone, 'udc_step', step);
        // Go to next step, waiting for server response if required
        let me = this;
        if (wait) { setTimeout( function() { me.nextPart2( step, name);}, wait);}
        else { me.nextPart2( step, name, scenario);}
    }
    
   /*
    * Process server reply and prepare step
    */    
    nextPart2( step, name, scenario) {
        let result = false;
        let configZoneId = name+this.configSuffix;        
        let configZone = API.dom.element( configZoneId);
        //let saveable = API.dom.getSaveableParent( configZone); 
        let input = API.dom.element( configZoneId+"_input");          
        let label = API.dom.element( configZoneId+"_label");
        if ( step > 3 && scenario == 2) {
            result = this.selectAny( name, scenario);

        }
        switch ( step) {
            case 2 : result = this.selectSite( name); break;
            case 3 : step++; /*setTimeout( function() { API.siteExtractConfig( name);}, 500);*/ break;
            case 4 : result = this.selectURI( name); break;
            case 5 : result = this.selectSelection( name); break;
            case 6 : result = true; break;
            case 7 : result = this.selectTitle( name, arguments[1], arguments[2]); break;
            case 8 : 
            case 9 : // Text
            case 10 : // Link
            case 11 : // Author
            case 12 : // Category
            case 13 : // Price
                let labels = [
                    "Cliquer sur le titre d'un article",
                    "Cliquer sur l'image d'un article",
                    "Cliquer sur le text d'un article",
                    "Cliquer sur le lien d'un article",
                    "Cliquer sur l'author d'un article",
                    "Cliquer sur la catégorie d'un article",
                    "Cliquer sur le prix d'un article",
                ];
                // 2DO set input type
                label.textContent = labels[ step - 7];
                input.value = "";
                result = true;
                break;
            case 14 : 
                // Mark as changed
                API.updateElement( configZoneId,  "Bravo. Cliquer 3 fois sur Configure pour ajouter d'autres elements");
                result = true;
                break;
            case this.steps.element :
               // result = this.selectAny( name, scenario);
                break;
        }
        if ( !result) {
            API.dom.attr( configZone, 'udc_step', step - 1);
            setTimeout( function() { API.siteExtractConfig( name);}, 500);
        }
    }
    /**
     * @api {JS} API.siteExtractConfig( name); Step-based processing of OK or next button
     */
    siteExtractConfig( name) { return this.next( name);}
    
    selectSite( name) {
        let baseName = name+this.configSuffix;
        let label  = API.translateTerm( "Entrez l'adresse du site", 'FR');
        let para = API.dom.element( baseName+"_label");
        if ( !para) return false;
        let input = API.dom.element( baseName+"_input");
        para.textContent = label;
        //API.dom.attr( input, 'placeholder', "www.");
        let site = this.paramGet( name, 'site');
        input.value = "www.";
        if ( site && site != "www.") { input.value = site;}            
        else if ( this.lastSite) {
            input.value = this.lastSite;
            this.paramSet( name, 'site', this.lastSite);
        }
        /*
        let paramHolder = API.dom.element( name+"_parameters");
        if ( !paramHolder) { paramHolder = API.dom.element( baseName+"_parameters");}
        if ( paramHolder) {
            let params = API.udjson.parse( paramHolder.textContent);
            let site = API.udjson.valueByPath( params, 'site');
            if ( site && site != "www.") { input.value = site;}            
            else if ( this.lastSite) {
                input.value = this.lastSite;
                this.paramSet( name, 'site', this.lastSite);
            }
        }  else if ( this.lastSite) input.value = this.lastSite;    
*/        
        return true;
    }
    
    selectURI( name) {        
        let baseName = name+this.configSuffix;
        // Display site
        let frame = API.dom.element( baseName+"_frame");
        let input = API.dom.element( baseName+"_input");
        API.dom.attr( input, 'placeholder', "__CLEAR__");        
        // Set label
        let label = API.dom.element( baseName+'_label');
        label.textContent = "Affichez l'article à inclure";
        // Setup click
        if (!frame.contentDocument) {
            label.textContent += " ERR";
            return false;
        }        
        /* 2DO TRy this
        // Make input ready for use
        let title = API.getTitle( 'title', this.innerHTML);
        input.value = '<a href="'+ input.value + '" class="sthg">'+title+'</a>';
        */
        frame.contentDocument.addEventListener( "click", function(event) {
            // !!! this = frame
            if ( event.cancelBubble) return;
            let sel = this.getSelection();
            console.log( event, sel, event.target, event.target.parentNode);     
            event.preventDefault(); 
            event.stopPropagation();
            // Extract URI
            let uri = API.dom.attr( event.target, "href");
            if ( !uri && event.target) { uri = API.dom.attr( event.target.parentNode, "href");}
            window.siteExtractInstance.paramSet( name, 'lastData', uri);
            let site = window.siteExtractInstance.paramGet( name, 'site');
            uri = uri.replace( "https://"+site, "").replace( site, "");
            if ( !uri) { uri = "/home";}
            // 2DO use a variable and call next to go straight to page
            input.value =  uri.substring( 1);
        });
        return true;
    }
    
    selectSelection( name) {
        let baseName = name+this.configSuffix;
        let label  = API.translateTerm( "Cliquer sur le lien d'une sélection d'articles à inclure", 'FR');
        let para = API.dom.element( baseName+"_label");
        let input = API.dom.element( baseName+"_input");
        let frame = API.dom.element( baseName+"_frame");
        para.textContent = label;
        API.dom.attr( input, 'placeholder', "...");
        //let paramHolder = API.dom.element( name+"_parameters");
        //let params = API.udjson.parse( paramHolder.textContent);
        frame.contentDocument.addEventListener( "click", function(event) {
            if ( event.cancelBubble) return;
            let sel = this.getSelection();
            console.log( event, sel, event.target, event.target.parentNode);     
            event.preventDefault(); 
            event.stopPropagation();
            // Extract URI
            let uri = API.dom.attr( event.target, "href");
            if ( !uri && event.target) { uri = API.dom.attr( event.target.parentNode, "href");}
            let site = window.siteExtractInstance.paramGet( name, 'site');
            uri = uri.replace( "https://"+site+'/', "");
            if ( !uri) { uri = "home";}
            input.value =  uri.trim(); // uri.substring( 1);
        });
        return true;        
    }

    selectTitle( name/*, uri*/) {
        let baseName = name+this.configSuffix;
        let input = API.dom.element( baseName+"_input");
        let frame = API.dom.element( baseName+"_frame");  
        // Set label
        let label = API.dom.element( baseName+'_label');
        label.textContent = "Cliquer sur une titre";
        API.dom.attr( input, 'value', "");
        let me = this;
        /*
        frame.contentDocument.addEventListener( "mouseup", function(event) {
            let sel = this.getSelection();
            console.log( event, sel, event.target, event.target.parentNode);     
            event.preventDefault(); 
            event.stopPropagation();
            // Extract URI
            let expr = me.analyseDOM( event.target, event.target.innerHTML, frame.contentDocument);
            input.value = expr;
        });
        */
        frame.contentDocument.addEventListener( "click", function(event) {
            let sel = this.getSelection();
            console.log( event, sel, event.target, event.target.parentNode);     
            event.preventDefault(); 
            event.stopPropagation();
            // Extract URI
            let target = event.target;
            let targetTags = "p,h1,h2,h3,h3,span";
            let targetTagsStep4 = "a";
            let labelText = label.textContent;
            // 2DO use an attribute in label or input set in next
            if ( labelText.indexOf( 'image') > -1) { targetTags = "img";}
            if ( labelText.indexOf( 'link') > -1) { targetTags = "a";}
            target = me.find( event.target, targetTagsStep4);
            if (target) {
                // Clicked element is a link
                let uri = API.dom.attr( target, "href");  
                window.siteExtractInstance.paramSet( name, 'lastData', uri);
                input.value = uri;
                API.dom.attr( baseName, 'udc_step', 4);
            } else {
                // Clicked element is not a link
                target = me.find( event.target, targetTags);
                if ( target) {
                    // Compute querySelect-like expression to find this element
                    let expr = me.analyseDOM( target, target.innerHTML, frame.contentDocument);
                    // Last caputred data is element's inner HTML
                    window.siteExtractInstance.paramSet( name, 'lastData', target.innerHTML);
                    input.value = expr;
                }
            }
        });

        return true;
    }
    
    selectImage() {
    }
    selectText() {
    }
     
    selectImage() {
    }
    
    selectRubrique() {
    }
    
    selectLink() {
    }
    
    selectPrice() {
    }
    
    selectAny( name, scenario=1) {
        let baseName = name+this.configSuffix;
        let input = API.dom.element( baseName+"_input");
        let frame = API.dom.element( baseName+"_frame");  
        // Set label
        let label = API.dom.element( baseName+'_label');
        label.textContent = "Cliquer sur un élément";
        // Set up click processor on iframe
        frame.contentDocument.addEventListener( "click", function(event) {
            let sel = this.getSelection();
            console.log( event, sel, event.target, event.target.parentNode);     
            event.preventDefault(); 
            event.stopPropagation();
            // Extract URI
            let target = event.target;
            let targetTags = "p,h1,h2,h3,h3,a,span,img";
            target = window.siteExtractInstance.find( event.target, targetTags);
            if (target) {
                // Write summary of element to input
                if ( target.tagName.toLowerCase() == "img") {
                    input.value = "image";
                    // and full HTML to last caputured data
                    window.siteExtractInstance.paramSet( name, 'lastData', target.outerHTML);
                } else if ( target.tagName.toLowerCase() == "a") {
                    let uri = API.dom.attr( event.target, "href");
                    let site = window.siteExtractInstance.paramGet( name, 'site');
                    uri = uri.replace( "https://"+site, "").replace( "http://"+site, "");
                    if ( !uri) { uri = "/home";}
                    input.value =  uri.substring( 1);
                    window.siteExtractInstance.paramSet( name, 'lastData', input.value);
                    API.dom.attr( API.dom.element( baseName), 'udc_step', window.siteExtractInstance.steps.page);
                } else {
                    input.value = target.textContent.substr( 0, 32);
                    // and full text to last caputured data
                    window.siteExtractInstance.paramSet( name, 'lastData', target.textContent);
                }
                if ( scenario != 2) {
                    // Set button to use
                    let button = API.dom.element( baseName + "_ok");
                    button.textContent = API.translateTerm( 'Use');
                    API.dom.attr( button, "onclick", "API.useActionData('" + name + "', '" + button.id+ "');")
                }
                if ( input) { input.classList.add( 'capture');}
                event.preventDefault(); 
                event.stopPropagation();
            }
        });
        return true;
    }
    
    
    findModel() {
        
    }
    
    save() {
    }
 
   /**
    * Find a path for the HTML library that points to the content of DOM element.
    * <p>For details on the HTML library's query() see ...</p>
    * @param element The HTML element to access
    * @param content The complete DOM
    * @param container 
    * @return string The querySelect expression
    */    
    analyseDOM( element, content, container, lastElement=null) {
        let expr = "";
        let tag = element.tagName.toLowerCase();
        // Some tags are ignored by siteExtract service
        if ( [ 'strong', 'br'].indexOf( tag) > -1) return expr; 
        if ( lastElement) {
            // Skip elements between this and last
            let childTags = this.listOfTags( element, lastElement);
            if ( childTags.length > 2) { expr = "|" + expr;} // use split
            else {
                for ( let childi = 0; childi < childTags.length; childi++) {
                    let childTag = childTags[ childi];
                    if ( !childTag) break;
                    expr = "^"+childTag + ' ' + expr;
                }
            }
        }
        // Add this tag 
        if ( element.id) {            
            expr = tag + " #" + element.id + expr;
        } else if ( element.className) {
            expr = tag + " ." + element.className.replace( / /g, '_SP_') + expr;
            // let similar = content.getElementsByClassName( element.className);
            // return similar.length+","+analyseDOM( element.parentNode, content);
            if ( element.parentNode != container && ( element.parentNode.id != "" || element.parentNode.parentNode.id != "")) { 
                expr = this.analyseDOM( element.parentNode, "", container, element)+ " "+expr;
            }
        } else if ( API.dom.attr( element, "style")) {
            let style = API.dom.attr( element, "style");
            expr = tag + " :" + style.replace( / /g, '_SP_') + expr;    
            if ( element.parentNode != container 
                 && ( element.parentNode.id != "" || element.parentNode.className != "" || element.parentNode.parentNode.id != "")) { 
                expr = this.analyseDOM( element.parentNode, "", container, element)+ " "+expr;
            }
            
        } else {
            expr = tag + ' ' + expr;
            if ( element.parentNode != container) expr = this.analyseDOM( element.parentNode, "", container, element)+" "+expr;
        }
        if ( tag == "img" && !lastElement) { expr += " =src";}
        return expr.trim();
    } // UDC_siteExtract.analyseDOM()
   
   /**
    *  Find an element near a point in the DOM
    */ 
    find( startEl, tagStr) {
        let tags = tagStr.split( ",");
        // startEl is searched tag
        if ( tags.indexOf( startEl.tagName.toLowerCase()) > -1) return startEl;
        // Find in startEl
        let target = null;
        for ( let tagi=0; tagi < tags.length; tagi++) {
            let found = startEl.getElementsByTagName( tags[ tagi]);
            if ( found.length) {
                target = found[ 0];
                // 2DO score found
                break;
            }    
        }
        if ( target) { return target;}
        let parent = startEl.parentNode;
        for ( let parenti=0; parenti < 3; parenti++) {
            if ( tags.indexOf( parent.tagName.toLowerCase()) > -1) { return parent;}
            parent = parent.parentNode;
        }        
        return target;
    }
   /**
    *  Return list of tags in element
    */ 
    listOfTags( element, lastElement) {
        let r = "";
        let tree = this.treeOfTags( element, lastElement);
        for ( let key in tree) {
            let w = key.split( '_');
            let tag = w[ 0];
            r += tag + ",";
            let branch = tree[ key];
            if ( branch) { r += this.listOfTags;}
        }
        return r.split( ',');
    }

    treeOfTags( element, lastElement = null, no=1) {
        let r = {};
        let children = element.childNodes;
        for ( let childi = 0; childi < children.length; childi++) {
            let child = children[ childi];
            if ( child.nodeType != 1) continue;
            if ( lastElement && child == lastElement) break;
            let tag = child.tagName.toLowerCase();
            r[ tag + '_' + no++] = this.treeOfTags( child); 
        }
        if ( Object.keys( r).length == 0) { return null;}
        return r;
    }
    
    
    
 } // JS class UDC_siteExtract
 
 function UDC_siteExtract_init() {
    let exTag = "modules/connectors/udcsiteextract.js";
    if ( window.ud /*&& !window.ud.ude.modules[ exTag].instance*/) {
        // Initialise modules library
        let udc = window.ud.ude.modules[ 'div.connector'].instance;
        let module = new UDC_siteExtract( udc);
        let modEntry = { instance:module, state:"loaded", extags:"div.connector.site", className:"UDC_siteExtract"};
        window.ud.ude.modules[ exTag] = modEntry;
        window.siteExtractInstance = module;
        if( udc) { udc.siteExtract = module;}
    }
 }
if ( typeof process != 'object') {
    UDC_siteExtract_init();
} else {
    // Testing under node.js 
    module.exports = { UDC_siteExtract:UDC_siteExtract, class:UDC_siteExtract};
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined" && typeof ModuleUnderTest == "undefined") {
        // Auto test
        console.log( 'Syntax:OK');            
        console.log( 'Start of UDC_siteExtract class test program');
        console.log( "Setting up browser (client) test environment"); 
        ModuleUnderTest = "udcsiteextract";
        let path = "../..";
        const testMod = require( path+'/tests/testenv.js');      
        testMod.load( []);
        let ud = new UniversalDoc( 'document', true, 133); 
        const connectorMod = require( './udeconnector.js');
        UDEconnector = connectorMod.class;
        connectorMod.init();
        UDC_siteExtract_init();        
        {
            // Add UDEconnector
            let test = "connector : ";
            let name = "myConnector";
            let data = {
                meta:{ type:"connector", subType:"site", name:name, zone:name+"editZone", caption:test, captionPosition:"top"}, 
                data:{ 
                    button:{ tag:"span", class:"rightButton", value:{ tag:"a", href:"javascript:", onclick:"API.showNextInList( ['"+name+"_dataeditZone', '"+name+"_parametereditZone']);", value:"configurer"}},
                    config:{ tag:"div", type:"text", name:name+'_paramater_editZone', value: { tag:"textedit", name:name+"_parameter", class:"textContent", value:[ "json", "ready = no", 'param1 = "abc,def,ghi"']}}
                },
                cache:{ tag:"div", name:name+"_dataeditZone", class:"warning hidden", value:"Pas de données. Configurez le connecteur d'abord"},            
                changes: []  
            }
            let object = API.dom.prepareToInsert( 'div', JSON.stringify( data),{id:name+"_parameters", class:"object connectorObject hidden"});
            let attr = { 
                id:"B0100055555000000M", name:name, ud_oid:"UniversalDocElement--21-1-21-4-21-333", class:"connector", ud_type:"connector", ud_subtype:"site", ud_mime:"text/json"
            };
            let connector = API.dom.prepareToInsert( 'div', "", attr);
            connector.appendChild( object);
            let part = API.dom.element( "div.part[name='myView']", API.dom.element( 'document'));
            part.appendChild( connector);
            API.initialiseElement( connector.id);
            if ( connector.textContent.indexOf( "def")) console.log( test+"OK"); else console.log( test+"KO");
        }        
        // Test with server delays
        TEST_verbose = true;
        // TEST_verbose = false;
        let udc = ud.ude.modules[ 'div.connector'].instance;
        udc.testNo = 2;
        function nextTest( extract) {
            //let udc = extract;
            switch ( udc.testNo)
            {
                case 2 : // Wait for siteExtract module
                case 3 :
                case 4 :
                case 5 :
                case 6 :
                case 7 :
                    let siteExtract = udc.siteExtract; 
                    if ( siteExtract) { udc.testNo = 7; }
                    break;
                case 8 : // Configure
                    let connector = API.dom.element( "div.connector[name='myConnector']", API.dom.element( 'document'));
                    // debug( {level:5}, "Test debug", connector, API.dom.attr( connector, 'exTag'));
                    udc.ude.dispatchEvent( {event:"configure"}, connector);
                    let configZone = API.dom.element( "myConnector_config");
                    // dumpElement( connector);
                    testResult( "config setup", configZone && configZone.innerHTML.indexOf( 'iframe') > -1, connector);
                    break;
                case 9 : // Tag list & tree
                    let list = udc.siteExtract.listOfTags( API.dom.element( 'B0100000000000000M'));
                    testResult( "tag list & tree", list.length > 1);
                    break;
                case 10 :
                    // End of auto-test
                    console.log( "Program's trace checksum: "+debug ("__CHECKSUM__"));
                    console.log( "Test completed");
                    process.exit();
                    break;                
            }
            // Get HTML of Capteur_1_Bâtiment_AviewZone
            udc.testNo++;
        } // nextTest()
        
        // GET & POST test
        nextTest( udc);
        setInterval( function() { nextTest( udc);}, 500);
              
    }
}
 