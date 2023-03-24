/**
 * In-doc menu or floating menu client-side class
 */
class UDE_menu {
    /* Parameters */
    minWidthFloater = 500;
    usePanel = true;
    /* variables */
    ude;
    dom;
    ud;
    box;                        // Element used for current action    
    icons;
    border = null;              // Border div
    floater = null;             // Menu holder
    useSide = false;
    elementInSide = null;
    ticker = 0;                 // Interval for ticks
    ticks = 0;                  // Nb of ticks since menu atcivtaed    
    cursorSave = -1;            // Cursor save index before action box changed it
    editElement = null;         // Element being edited
    saveSideBar = "";           // Save side bar's content when using it for menu
    ideasHandler = null;        // Pointer to class which provides data for Ideas fct   

      
    constructor( ude) {
        this.ude = ude;
        this.dom = ude.dom;
        this.ud = ude.dataSource;
        // Add API ftcs
        if ( API) { API.addFunctions( this, [ 
            "displayMenu", "hideMenu", 
            "collapse", "expand", "closeBox", 
            "displayCode", "displayConfig", "displayStyle", "displayLayout", "displayIdeas", "displayCloud", 
            "displayCloudWeb", "displayCloudConnector", 
            "actionTableClick", "useActionData",
           //"getTagOrStyleLabel",
            "clearCursor", "rearmFloaterTO","classChangeInMenu", "getName"
        ]);}
        // Retrieve icons
        let iconHolder = this.dom.element( 'UD_icons');
        if ( iconHolder) { this.icons = this.dom.udjson.parse( iconHolder.textContent);}
        // Global handler
        window.MENU = this;
        // Find floater menu        
        this.border =  ( true || window.innerWidth > this.minWidthFloater) ? this.dom.element( 'floating-menu') : null;
        this.floater = ( true || window.innerWidth > this.minWidthFloater) ? this.dom.element( 'fmenu') : this.dom.element( 'leftColumn');
        //this.useSide = ( window.innerWidth <= this.minWidthFloater);
    } 
    
    // 2DO would be better off grouped with changeClass
    collapse( elementOrSelector) {  API.changeClass( 'collapsed', elementOrSelector, "collapsed,expanded");}    
    expand( elementOrSelector) {  API.changeClass( 'expanded', elementOrSelector, "collapsed,expanded");}    
   /**
    * Display menu for an element
    */    
    display( elementOrId, selection = null) {
        let element = ( elementOrId) ? this.dom.element( elementOrId) : this.dom.cursor.fetch().HTMLelement;
        if ( !element) return;
        let saveable = this.dom.getSaveableParent( element);
        if ( API.getEditorAttr( saveable, 'ude_menu') == "off") return false;
        if ( this.dom.getSaveableParent( this.editElement) == saveable) {
            if ( this.editElement != element) {
                // Regenerate menu or box
                if ( this.box) {
                    switch ( this.box.id) {
                        case '_TMPstyle' :
                            this.closeZone( this.box);
                            this.position( this.border, saveable);
                            this.displayStyle( element);
                        break;
                        case '_TMPconfig' :
                            this.closeZone( this.box);
                            this.position( this.border, saveable);
                            this.displayConfig( element);
                        break;
                        case '_TMPideas' :
                        case '_TMPwebextract' :
                        break;
                    }
                    this.editElement = this.getEditable( element);
                    return true; 
                } /*else {
                    this.fill( element);
                }*/
                
            }                       
        }        
        if ( this.box) { this.closeZone( this.box);} 
        if ( this.editElement) { this.hide();}
        // Get floating menu & element
        let floater = this.floater;
        if ( !floater || !element) { return false;}        
        // Save cursor
        this.cursorSave = this.dom.cursor.save( this.cursorSave); 
        // Clear menu
        if ( !this.useSide) {
            floater.innerHTML = "";
            this.position( this.border, element);
            if ( !this.ticker) { this.ticker = setInterval( function() { window.MENU.tick();}, 100);}
            this.ticks = 0;
        } else {
            this.saveSideBar = this.floater.innerHTML;
            this.floater.scrollTo(0,0);
            floater.innerHTML = "<h2>Editer un élément</h2>";
        }
        // Fill menu                
        if ( selection) this.fillForSelection( element); else this.fill( element);
        // Copy element when using sidebar and display
        if ( this.useSide) { 
            // Copy element
            this.copyElement( element);
            // Cancel & Validate button to close
            let action = "window.MENU.hide();";
            let label = "Annuler";
            API.dom.insertElement( 
                'span', 
                label, 
                { class:"button", onclick:action, title:label},
                this.floater,
                false,
                true
            );            
            action = "window.MENU.updateElement('"+element.id+"'); leftColumn.switchDisplayMode();";
            label = "Valider";
            API.dom.insertElement( 
                'span', 
                label, 
                { class:"button", onclick:action, title:label},
                this.floater,
                false,
                true
            );
            // Insert a new element after
            action = "window.MENU.hide();leftColumn.switchDisplayMode();";
            action += "API.insertElement( 'p', '', { class:'undefined'}, 'element.id', true);";
            action += "API.displayMenu( UDE_lastInsertId)";
            label = "Insert";
            API.dom.insertElement( 
                'span', 
                label, 
                { class:"rightButton", onclick:action, title:label},
                this.floater,
                false,
                true
            );

            this.floater.classList.add( 'floating-menu');
            this.floater.style.width = window.getComputedStyle( this.floater)['max-width'];
        }
        this.editElement = this.getEditable( element);
        return true;
    } // UDE_menu.display()
    displayMenu( elementOrId, selection = null) { return this.display( elementOrId, selection);}
    
   /**
    * Fade out menu after TO
    */
    tick() {
        // Auto-close menu or box with fade out
        if ( 
            ( this.floater && this.floater.style.display != "none")
            || this.box 
        ) {
            let floatTO = ( this.box) ? 1000 : 100;
            let floatOp = 0.5;
            if ( this.floater.style.opacity && !isNaN( this.floater.style.opacity)) floatOp = this.floater.style.opacity;
            if ( this.useSide) {
                // Close side panel
            } else if ( this.ticks++ > floatTO) { 
                this.closeBox( true);
                this.border.style.opacity = 0;
                let me = this;
                setTimeout( function() { me.hide();}, 1000); 
                clearInterval( this.ticker);
                this.ticker = 0;
            }
        }
    } // UDE_menu.tick()
    rearmFloaterTO() { this.ticks = 0;}

    getEditable( elementOrId, canBeMe = true) {
        let element = this.dom.element( elementOrId);
        let saveable = this.dom.getSaveableParent( element);
        if ( element.classList.contains( 'caption')) return saveable;
        /*
           Look up editable param
        */
        return element;
    }
   /**
    * Process click - return true if click processed or using browser's processing, false otherwise
    */
    click( elementOrId, e) {
        let element = this.dom.element( elementOrId);
        let step = 10;
        // this.dom.parentAttr( element, 'id').indexOf( '_TMP') == 0
        let walk = element;
        while ( walk && this.dom.attr( walk, "exTag") != "div.configurator" && walk.id != "document") { walk = walk.parentNode;}
        if ( 
            this.dom.attr( walk, "exTag") == "div.configurator"
            && this.dom.attr( element, 'onclick') 
            ) { 
            // !!! if processed here, don't forget to e.preventDEfault();
            return true;
        }
        return false;
    } // UDE_menu.click()
    
    scroll( e) {
        if ( this.border && this.border.style.display == "block" && this.editElement) {
            // Adjust border position
            this.positionBorderTop();
            // let bounds = this.editElement.getBoundingClientRect();
            /*
            let saveable = this.dom.getSaveableParent( this.editElement);
            let scrollTop = e.target.scrollTop;
            let height = this.dom.attr( this.floater, 'computed_height');
            let floatTop = saveable.offsetTop - scrollTop - 0.5*height;
            if ( this.box) floatTop = this.box.offsetTop  - scrollTop - 0.5*height;
            if ( this.editElement.offsetParent) floatTop += this.editElement.offsetParent.offsetTop;
            this.border.style.top = floatTop+"px";
            */
            // floater.style.left = ( this.editElement.offsetLeft - 10)+"px";
        }
    }
    
    positionBorderTop() {
        let scrollTop = this.dom.element( 'scroll').scrollTop;
        let saveable = this.dom.getSaveableParent( this.editElement);
        let height = this.dom.attr( this.floater, 'computed_height');
        let floatTop = saveable.offsetTop - scrollTop - 0.5*height;
        if ( saveable.offsetParent) floatTop += saveable.offsetParent.offsetTop;
        if ( this.box) floatTop = this.box.offsetTop  - scrollTop - 0.5*height;
        this.border.style.top = floatTop+"px";
    }
    
    clearCursor() { this.cursorSave = -1;}

    
   /**
    * Hide menu
    */
    hide() {
        if ( this.useSide) {
            // Close side bar
            this.floater.style.width = "0px";
            this.floater.classList.remove( 'floating-menu');
            if ( this.saveSideBar) { this.floater.innerHTML = this.saveSideBar;}
            this.saveSideBar = "";
        } else if ( this.border){
            // Hide floating menu        
            this.border.style.display = "none";
            // Patch for field editng trial 2DO fct
            if ( this.editElement && this.editElement.classList.contains( "edinside")) {
                this.editElement.classList.remove( "edinside");
                this.editElement.parentNode.classList.remove( 'edcontainer');
            }
        }
        if ( this.box) { this.closeZone( this.box, true); this.box = null;} 
        this.editElement = null;        
    } // UDE_menu.hide()   
    hideMenu() { return this.hide();}
    
   /* 
    * Position floating menu border div on an element
    */    
    position( border, element) {
        if ( !border) border = this.border;
        if ( !element)  {
            // No element provided so just hide floating menu
            border.style.display = "none";
            // And remove pending action
            if ( this.floaterActionPending) { API.closeBox();} // this.floatConfig( this.floaterActionPending);}
            this.editElement = null;
        } else { // if (  window.innerWidth > this.minWidthFloater) {
            // Element provided & screen big enough to show floating menu
            // Display menu on top of saveable element
            let saveable = this.dom.getSaveableParent( element);
            if ( saveable) { 
                // Positioning border
                let bounds = saveable.getBoundingClientRect();
                // 2DO use bounds for top & left
                // 2DO copy transform from View
                let height = this.dom.attr( this.floater, 'computed_height');
                let floatTop = saveable.offsetTop - this.dom.element( 'scroll').scrollTop - 0.5*height;
                if ( saveable.offsetParent) floatTop += saveable.offsetParent.offsetTop;
                border.style.top = floatTop+"px";
                border.style.left = ( saveable.offsetLeft - 10)+"px";
                border.style.width = ( bounds.width + 20)+"px";
                border.style.height = ( bounds.height + 20)+"px";
                //border.style.width = this.dom.attr( element, 'computed_width')+"px";
                border.style.display = "block";
                border.style.opacity = 1;
            }
            
        }
    } // UDE_menu.position()
    
    updatePosition ( element) {
        if ( element && element == this.editElement) this.position (this.border, element);
    }
   
   /**
    * Add an action button to menu
    */    
    addButton( label, leftRight, onOff, action, icon = "") {
        let buttonClass = ( this.useSide) ? "tool-icon" : "FMicon";
        buttonClass += " "  + leftRight + " button is-small " + onOff;        
        if ( !icon) {
            // Return inserted text button
            return API.dom.insertElement( 
                'span', 
                label, 
                { class:buttonClass, onclick:action, title:label},
                this.floater,
                false,
                true);
        } else {
            // Retrieve icons
            let src = "";
            if ( icon.indexOf( '/') > -1) {
                // icon is a path to image
                if ( icon.indexOf( 'resources') == 0 && typeof UDincludePath != "undefined") icon = UDincludePath + icon;                
                src = icon;                
            } else {
                // icon is a name to lookup in images provide in resource
                let iconHolder = API.dom.element( 'UD_icons');
                if ( !iconHolder) { return null;}
                let icons = API.dom.udjson.parse( iconHolder.textContent);
                src = icons[ icon].replace( "W15H15", "W50H50");
            }
            // Return inserted icon
            return API.dom.insertElement( 
                'img', 
                "", 
                { src:src, class:buttonClass, onclick:action, title: label}, 
                this.floater, 
                false, 
                true);
        }
    } // UDE_menu.addAction()

    
    copyElement( element) {
        let div = this.dom.element( "MenuCopy");
        if ( !div) {
            div = document.createElement( 'div');
            div.id = "MenuCopy";
        }
        div.innerHTML = element.innerHTML;
        this.dom.attr( div, "contenteditable", "true");
        this.floater.appendChild( div);
        this.elementInSide = div;
        return div;
    } // UDE_menu.copyElement()
    
    updateElement( elementOrId) {
        let div = this.dom.element( "MenuCopy");
        let element = this.dom.element( elementOrId);
        if ( element.innerHTML != div.innerHTML) {
            element.innerHTML = div.innerHTML;
            API.setChanged( element);
        }
        return div;
    } // UDE_menu.copyElement()

    
    fill( elementOrSelector) {       
        // Get & check elements
        let element = this.dom.element( elementOrSelector);
        let displayable = this.dom.getEditableParent( element);
        let saveable = this.dom.getSaveableParent( element);
        //if ( !this.floater) this.floater = this.dom.element( "fmenu");        
        if ( !saveable || !displayable || !this.floater) return;
        // Initialise variables used for menu building
        let selector = this.dom.getSelector( displayable);
        let button = null;
        let availableClasses = $$$.availableClasses( displayable);
        let currentClass = availableClasses.filter( classw => displayable.classList.contains( classw));
        currentClass = (currentClass.length) ? currentClass[ 0] : "";
        let currentClassLabel = this.getLabel( currentClass);
        let elementType = API.dom.attr( displayable, 'exTagType');
        let elementTypeLabel = this.getLabel( elementType);
        // Clear floater
        let floater = this.floater;
        //floater.innerHTML = "";
        /*
        {
            // Left-hand buttons
            if ( element.classList.contains( 'collapsable')) {
                // Expand / collapse
                let action = "expand(" + selector + ");";
                // if ( expanded) action = "collapse(" + selector + ");";
                this.addButton( "panel", "left", "on", action, "resources/images/arrow-split-horizontal.png"); 
            }
            if ( $$$.getTagOrStyleInfo( exTag, 'useTextEditor') == 1) {
                // Update / restore
            }

        }
        */
        {
            // Panel
            let action = "$$$.displayStyle(" + selector + ");";
            let exTag = this.dom.attr( displayable, 'exTag');
            if ( [ 'div.html', 'div.filledZone', 'div.zoneToFill'].indexOf( exTag) > -1) action = "$$$.displayCode(" + selector +");";
            this.addButton( "panel", "centered", "on", action, "resources/images/arrow-split-horizontal.png");
        }
        // Add right hand side buttons : class, element type & delete
        {
            /* #2223004 del 5 lines may still need it for tables etc*/
            let action = "API.removeElement(" + selector + ");API.dom.element( 'floating-menu').style.display='none'; window.ud.ude.editElement=null;";
            let delLabel = API.translateTerm( "delete");
            this.addButton( "effacer", "right pos1", "off", action, "resources/images/delete-variant.png");        
            //button = this.dom.insertElement( 'span', '<img src="/upload/smartdoc/resources/images/delete-variant.png" title="effacer" />', { class:"rightSmallButton warning", onclick:action, title:delLabel}, floater, false, true); 
            //*/
            let moveAction = "window.ude.dataActionEvent(event);"; 
            let moveLabel = API.translateTerm( "move");
            button = this.addButton( "effacer", "right pos2", "off", '', "resources/images/arrow-all.png"); 
            this.dom.attr( button, 'ondragstart', moveAction);
            this.dom.attr( button, 'draggable', 'true');
            button.id = 'move' + saveable.id;
            //button = this.dom.insertElement( 'span', '<img src="/upload/smartdoc/resources/images/arrow-all.png" title="déplacer" />', { id:"move"+saveable.id, class:"rightSmallButton", ondragstart:moveAction, draggable:"true", title:moveLabel}, floater, false, true); 
            /*
            // Element type - link to config   
            if ( elementTypeLabel) {            
                // let action = "API.changeTag( 'p.undefined', "+selector+");"; 
                let action = "API.configureElement(" + selector + ");";
                // Remove sub type
                button = this.addButton( elementTypeLabel, "right", "on", action);
            }            
            // Class - link to style
            if ( currentClassLabel) {
                // let action ="API.changeClass( '"+currentClass+"', " + selector + ");"; // remove class
                let action ="API.displayStyle( " + selector + ");"; 
                button = this.addButton( currentClassLabel, "right", "on", action);
            }
            */
        }
        return floater;
        // Left hand side buttons - tools
        {
            // Actions
            let availableActions = UDE_availableActions;
            let mode = API.dom.element( 'UD_mode').textContent; 
            let extra = API.dom.parentAttr( saveable, 'ud_extra');                       
            let actions = (API.json.value( extra, 'ude_menu')) ? 
                API.json.value( extra, 'ude_menu') 
                : ( mode.indexOf( "display") == 0) ?
                    [] 
                    : Object.keys( availableActions).filter( key => (
                        API.testEditorAttr( element, "ude_menu", availableActions.label)
                        /*availableActions[ key].isDefault*/
                        && ( 
                            API.json.value( availableActions[ key], 'onlyTypes') == ""
                            || API.json.value( availableActions[ key], 'onlyTypes').indexOf( elementType) > -1
                        )
                        && (
                            API.json.value( availableActions[ key], 'onlyClasses') == ""
                            || API.json.value( availableActions[ key], 'onlyClasses').indexOf( saveable.classList.item( 0))> -1                         
                        )
                    ));
            if ( typeof actions == "string") actions = [ actions];
            /*
            // Add Expand/collapse for collapsable elements
            // 2DO integrate in UD_availableActions onlyClasses
            if ( displayable.classList.contains( "collapsable")) {
                actions = actions.concat( ( displayable.classList.contains( 'collapsed')) ? 'expand' : 'collapse');
            }
            */
            for ( let acti=0; acti < actions.length; acti++) {
                let actionName = actions[ acti];
                if ( actionName == "off") { break;}
                let actionData = UDE_availableActions[ actionName.toLowerCase()];
                let actionLabel = API.translateTerm( actionName);
                let callArgs = API.json.value( actionData, 'args');
                if ( callArgs && callArgs[0] != ",") callArgs = ", " + callArgs;
                let action = "API." + actionData.apiFct + "(" + selector + callArgs + ");";
                button = this.addButton( actionLabel, 'left', 'off', action, actionData.icon);
            }
            if ( [ 'div.zoneToFill', 'div.html'].indexOf( this.dom.attr( saveable, 'exTag')) > -1 && this.ude.textEd) {
                // Add Edit button
                let editClick = " API.HTMLeditor( '"+saveable.id+"');API.rearmFloaterTO( '"+saveable.id+"');";
                button = this.addButton( 'Source', 'left', 'off', editClick); // "Toggle editor"
            }
        }
        return floater;
    }
   /**
    * Display panel for a selction
    * @param {*} elementOrSelector 
    * @returns 
    */
    panelOnSelection( elementOrSelector) {
        // 2DO Check if selection is span and action is remove
        let element = this.dom.element( elementOrSelector);
        let boxName = "panel-on-selection";
        let id = element.id + this.dom.childElements( element).length;
        let services = {};
        if ( this.dom.textContent( 'UD_mode') == "edit3") services[ 'config'] = { tag:"a", onclick:"$$$.displayConfig('"+element.id+"');", value:"Config"};
        services[ 'style'] = { tag:"a", onclick:"$$$.dom.styleSelection( null, 'styled', id);$$$.displayStyle( '');", value:"Style"};
        services[ 'button'] = { tag:"a", onclick:"$$$.dom.styleSelection( null, 'button', id);$$$.clickOn( '');", value:"Action"};
        services[ 'field'] = {tag:"a", onclick:"$$$.dom.styleSelection( null, 'field', id);$$$.clickOn( '');", value:"Champ"};
        services[ 'link'] = { tag:"a", onclick:"$$$.dom.styleSelection( null, 'link', id);$$$.clickOn( '');", value:"Lien"};
        services[ 'image'] = { tag:"a", onclick:"$$$.dom.styleSelection( null, 'image', id);$$$.clickOn( '');", value:"Image"};
        let tabs = { 
            tag:"div",
            class:"panel-tabs",
            value: services
        }                
        let contentData = {
            tag:"div", type:"configurator", class:"panel ", name:boxName, edit:"off", value:{
                heading : { tag:"p", class:"panel-heading", onclick:"API.closeBox();", value:"Actions sur une sélection"},
                tabs : tabs            
            }          
        }; 
        let content = API.json.putElement( contentData, false);
        // Display action box
        if ( typeof process != 'object') { this.addActionBox( elementOrSelector, boxName, boxName, content);}
        else { return content.innerHTML;}
    }
    
    fillForSelection( elementOrSelector) {
        return this.panelOnSelection( elementOrSelector);
        // Get & check elements
        let element = this.dom.element( elementOrSelector);
        let displayable = this.dom.getEditableParent( element);
        if ( !this.floater) this.floater = this.dom.element( "fmenu");
        if ( !displayable || !this.floater) return;
        // Initialse variables for menu building
        let classes = API.availableStylesForSelection( displayable);
        if ( !classes || !classes.length) { classes = [ 'emphasized', 'citation', 'unemphasized'];}
        let selector = API.dom.getSelector( displayable);
        let button = null;
        let lang = this.dom.element( 'UD_lang').textContent;
        // Clear floater
        let floater = this.floater;
        // floater.innerHTML = "";
        // Show Insertable classes available        
        if ( true) {
            // Display classes
            for ( let classi=0; classi < classes.length; classi++) {
               let className = classes[classi];
               let classLabel = this.getLabel( className);
               let action = "API.dom.styleSelection( null, '"+ classLabel + "');"; 
               action += "API.clickOn( '');"; //  + selector + ");";
               if ( className == "styled") action += "API.displayStyle( '');"; // + selector + ");";               
               if ( lang != "EN") classLabel = API.translateTerm( classLabel);               
               button = this.dom.insertElement( 'span', classLabel, { class:"leftSmallButton buttonOff", onclick:action, title:classLabel}, floater, false, true);                
            }
        } 
        return floater;
    }
    
    // Box
    
   /**
    * @api {JS} API.floatConfig(elementOrId,configZone=null) Open or close a configuration zone before an element and adjust floating menu
    * @apiParam {string} elementOrId The element being configured or its id
    * @apiParam {HTMLelement} configZone The configuration zone or absent/null for closing
    * @apiGroup Web pages
    */    
   /**
    * Add a configuration zone before an element and adjust floating menu
    * @param {string} elementOrId The element being configured or its id
    * @param {HTMLelement} configZone The configuration zone or absent/null for closing
    */    
    addZone( configZone, elementOrId = null) {
        // return this.ude.floatConfig( configZone, elementOrId);
        // Floating menu must be visible
        if ( !this.border) { 
            return debug( { level:1, return:false}, "floatConfig() can't add config as there is no border");
        }
        if ( elementOrId) {
            // Add action box
            /*
            if ( !this.dom.isVisible( this.floater, 'div')) { 
                return debug( { level:1, return:false}, "floatConfig() can't add config when floater invisible");
            }
            */
            let border = this.border;
            let element = this.dom.element( elementOrId);
            // 2DO if JSON or object putElemen
            if ( this.usePanel) {
                border.style.display = "none";
                element.classList.add( 'menu-on');
            }
            // if copiedElement insertBefore
            configZone = element.parentNode.insertBefore( configZone, element);
            let marginTop = this.dom.attr( element, 'computed_marginTop');
            let floatHeight = this.dom.attr( border, 'computed_height');
            let configHeight = this.dom.attr( configZone, 'computed_height');
            configZone.style.marginTop = marginTop + "px";
            configZone.style.width = ( this.dom.attr( element, 'computed_width')- 5) + "px";
            configZone.style.marginLeft = this.dom.attr( element, 'computed_marginLeft') + "px";
            let deltaOffsetTop = element.offsetTop - configZone.offsetTop;    
            border.style.height = ( floatHeight + deltaOffsetTop - marginTop/2 /*marginTop  configHeight*/) + "px"; 
            this.cursorSave = this.dom.cursor.save( this.cursorSave);            
            // this.dom.cursor.setAt( configZone);
            this.box = configZone;
            // Panel
            if (  window.innerWidth > this.minWidthFloater) {
                // Container =  panel-block to reduce height of panel
                let panelBlockHolder = this.dom.element( '.panel-block-holder', configZone);
                if ( panelBlockHolder) {
                    panelBlockHolder.classList.add( 'panel-block');
                    panelBlockHolder.classList.remove( 'panel-block-holder');
                }
            }
            this.dom.attr( this.box, 'ude_menu', 'off');
            this.dom.makeVisible( element.previousSibling); //this.floater
            let page = element.parentNode;
            if ( this.dom.attr( page, 'exTag') == "div.page") {
                // Increment page size
                page.style.height = ( parseInt( this.dom.attr( page, 'ud_pageHeight')) + configHeight) + "px";
            }       
            // Hide menu
            if ( !this.useSide) { this.floater.style.display = "none";}                
        } 
        return true;
    } // UDE.addZone()   
  
   /**
    * Close a configuration zone before an element and adjust floating menu
    * @param {string} elementOrId The element being configured or its id
    * @param {HTMLelement} configZone The configuration zone or absent/null for closing
    */    
    closeZone( configZone, restoreCursor=false) {
        // return this.ude.floatConfig( configZone);
        if ( configZone.id == "_TMPconfig") {
            // Let element know it's leaving config mode
            let controlEvent = { event: "configure", type: "configure", action:"leave"};
            this.ude.dispatchEvent( controlEvent, this.editElement);
        }
        this.floater.style.display = "block";
        let page = configZone.parentNode;
        if ( this.dom.attr( page, 'exTag') == "div.page") {
            // Restore page size
            page.style.height = this.dom.attr( page, 'ud_pageHeight') + "px";
        }            
        if ( this.editElement && !this.useSide) {
            let bounds = this.editElement.getBoundingClientRect();
            this.border.style.height = ( bounds.height + 20) + "px";
        }    
        configZone.remove();
        this.box = null;
        if ( restoreCursor && this.cursorSave) this.dom.cursor.restore( this.cursorSave, true);
        if ( this.usePanel && this.editElement) {
            this.border.style.display = "block";
            this.editElement.classList.remove( 'menu-on');
        }
        //this.cursorSave = -1;
        // this.dom.cursor.setAt( element);
    } // UDE_menu.closeZone()
 
   /**    
    * Add zone to act on element being edited. Insert zone before the element and adjust floating menu
    * @param string action Name of action used to generate box id and class
    * @param mixed content Text content or collection of HTML elements 
    * @param object params Parameters are placed in a hidden div and allow communication between module and menu     
    */    
    addActionBox( elementOrId, boxName, boxClass, content="", params = {}) {
        let element = this.dom.element( elementOrId);
        let saveable = this.dom.getSaveableParent( element);
        this.actionElement = element;
        if ( this.dom.element( boxName)) {
            // Already open so close
            this.closeZone( this.dom.element( boxName));
            this.ude.floaterActionPending = null;
            this.box = null;
        } 
        if ( content) {
            this.closeBox();
            // Setup box before element
            let attr = { 
                id: boxName, class:"actionBox " + boxClass, type:"configurator", ude_stage:"on", 
                ude_bind: "next", // previous
                // style: "height:50px; z-index:200;display:block;"
            };
            let zone = null;
            if ( typeof content == "object" && typeof content.tagName != "undefined") { zone = content;}
            else { zone = this.dom.prepareToInsert( 'div', content, attr);}
            /*
            {
                // Add parameters zone
                let attr = { id:boxName + "_parameters", class:'hidden', ud_type: "parameters", ude_bind:name, edit:"off"};
                let paramHolder = zone.appendChild( API.dom.prepareToInsert( 'div', JSON.stringify( params), attr)); 
            }
            */
            // let nameZone = this.dom.insertElement( 'span', currentName, attr, element, true, -1);
            if ( this.useSide && this.elementInSide) { this.floater.insertBefore( zone, this.elementInSide);}
            else { this.addZone( zone, saveable);} // 2DO position
            this.box = zone;
            // this.dom.cursor.setAt( nameZone);
            // Hide keyboard
            if (  window.innerWidth < this.minWidthFloater) {
                this.box.focus();
                this.dom.makeVisible( boxName, 'scroll', 'top');
            }
        } else {
            this.dom.cursor.restore( this.cursorSave, true);  
        }
    } // UDEmenu_actionBox()
    
    useActionData( boxName, dataHolderId) {
        let box = API.dom.element( boxName);
        let dataHolder = API.dom.element( dataHolderId);
        let data = ( dataHolder) ? dataHolder.value : "";
        if ( !data) { return;}
        let replaceContents = false;
        let json = API.json.parse( data);
        if ( json) {
            // Data is JSON so get model-based HTML
            let html = this.findAndUseModel( json);
            if ( html) {
                replaceContents = true;
                let target = box.nextSibling;
                API.changeTag( 'div.filledZone', target.id);
                data = html;
            }
            // Model found, data = model
            // Flag to clear data
        }
        if ( boxName == "_TMPwebextract_config" && parseInt( API.dom.attr( box, 'udc_step')) < 5) {
            // Web extraction box : adjust data to make full URL in some cases
            // 2DO add domain name if relative path
            // Add protocole
            data = "https://"+data;
        }
        this.dom.cursor.restore( this.cursorSave, true);
        let r = this.ude.dispatchEvent( { event:"use", type: "use", data:data}, this.actionElement); // this.dom.element( boxName).nextSibling.id);
        if ( !r) { 
            // Default Use action
            let target = this.dom.cursor.HTMLelement;
            let saveable = this.dom.getSaveableParent( target);
            let bounds = saveable.getBoundingClientRect();
            let heightBefore = bounds.height;
            let isHTML = this.dom.isHTML( data);
            if ( this.dom.hasDefaultContent( target)) { target.textContent = data;}
            else if ( isHTML) { this.ude.insertHTMLatCursor( data);}
            else { this.ude.insertTextAtCursor( data);}
            // Adjust Floater height
            bounds = saveable.getBoundingClientRect();
            let heightAfter = bounds.height;
            bounds = this.ude.floater.getBoundingClientRect();
            this.ude.floater.style.height = ( bounds.height + heightAfter - heightBefore) + "px"; 
            if ( !this.ude.requires2stageEditing( this.dom.cursor.HTMLelement)) {
                // Mark element as modified
                this.ude.setChanged( this.dom.cursor.HTMLelement);
            } 
            r = true;            
        } 
        this.ticks = 0;
        return r;
    }  // UDE_menu.useActionData()
    
    closeBox( restoreCursor = true) {
        if ( this.box) {
            // Close box
            this.closeZone( this.box, restoreCursor);
            // Redisplay menu
            this.display( this.editElement);
        }        
    } // UDE_menu.closeBox()

    _getTabs( elementOrId, activeLabel="") {
        let element = this.dom.element( elementOrId);
        let saveable = this.dom.getSaveableParent( element);
        let selector = this.dom.getSelector( element);
        // 2DO isLayoutable, isInsertable, hasIdeas, hasCloud
        // Build list of available services
        let services= {};
        if ( this.displayConfig( element, true) || activeLabel == 'config') 
            services[ 'config'] = { tag:"a", onclick:"$$$.displayConfig("+selector+");", value:"Config"};
        if ( this.displayStyle( element, true) || activeLabel == 'styles')
            services[ 'styles'] = { tag:"a", onclick:"$$$.displayStyle("+selector+");", value:"Styles"};
        if ( this.displayLayout( element, true) || activeLabel == 'layouts')
            services[ 'layouts'] = { tag:"a", onclick:"$$$.displayLayout("+selector+");", value:"Dispositions"};
        if ( this.displayCloud( element, true) || activeLabel == 'cloud')    
            services[ 'cloud'] = {tag:"a", onclick:"$$$.displayCloud("+selector+");", value:"Cloud"};
        if ( this.displayIdeas( element, true) || activeLabel == 'ideas')    
            services[ 'ideas'] = { tag:"a", onclick:"$$$.displayIdeas("+selector+");", value:"Idées"};
        if ( ([ 'div.zoneToFill', 'div.html'].indexOf( this.dom.attr( saveable, 'exTag')) > -1 || activeLabel == 'code') && this.ude.textEd) {
            // Add Code source button
            // let editClick = " API.HTMLeditor( '"+saveable.id+"');$$$.hideMenu();"; //( '"+saveable.id+"');";
            services[ 'code'] = { tag:"a", onclick:"$$$.displayCode("+selector+");", value:"Code"};
        }
        if ( activeLabel) services[ activeLabel].className = "is-active";
        // Build object form (JSON100) of panel-tabs div
        let tabs = { 
            tag:"div",
            class:"panel-tabs",
            value: services
        }                
        return tabs;
    }

    displayCode( elementOrId, checkForContent = false, boxName = '_TMPcode', boxClass='styleBox') {
        // Check element
        let element = ( elementOrId) ? this.dom.element( elementOrId) : this.dom.cursor.fetch().HTMLelement;        
        let saveable = this.dom.getSaveableParent( element);
        if ( !element || !saveable) { return false;}
        if ( checkForContent) return false;        
        element = this.dom.getEditableParent( element);     
        // Display Code
        $$$.HTMLeditor( saveable.id);
        this.rearmFloaterTO( saveable.id);
        // Display Panel   
        let selector = API.dom.getSelector( element);
        let codePanel = {};
        codePanel[ 'upload'] = { tag:"a", class:'panel-block', onclick: "$$$.setChanged(" + selector + ");", title:"update", value:"update"};
        codePanel[ 'restore'] = { tag:"a", class:'panel-block', onclick: "$$$.initialiseElement(" + selector + ");", title:"restore", value:"restore"};
        // Compile panel JSON100 object and generate HTML
        let contentData = {
            tag:"div", type:"configurator", class:"panel "+boxClass, name:boxName, edit:"off", value:{
                heading : { tag:"p", class:"panel-heading", onclick:"API.closeBox();", value:"Code"},
                tabs : this._getTabs( element, 'code'),
                styles : { tag:"p", class:"panel-block-holder is-wrapped", value:codePanel},
            }          
        }; 
        let content = API.json.putElement( contentData, false); //createHTMLElementsFromJSON
        if ( [ 'div.zoneToFill', 'div.html'].indexOf( this.dom.attr( saveable, 'exTag')) > -1) {
            $$$.HTMLeditor( '"+saveable.id+"');
            //$$$.hideMenu();
        }
        // Display action box
        if ( typeof process != 'object') { this.addActionBox( saveable, boxName, boxClass, content);}
        else { return content.innerHTML;}

    }
   
   /**
    * {JS} $$$.displayStyle( elementOrId,checkForContent=false,panelName='_TMPstyle',panelClass='styleBox') Display CSS class selection panel
    * @param {*} elementOrId Element or its id
    * @param {*} checkForContent Default false to return panel, true just to check if there's anything to choose
    * @param {string} panelName Id to give to the panel
    * @param {string} panelClass CSS class of the panel
    * @returns {string} HTML of panel in test mode 
    */
    displayStyle( elementOrId, checkForContent = false, boxName = '_TMPstyle', boxClass='styleBox') {
        // Check element
        let element = ( elementOrId) ? this.dom.element( elementOrId) : this.dom.cursor.fetch().HTMLelement;        
        let saveable = this.dom.getSaveableParent( element);
        if ( !element || !saveable) { return false;}
        if ( checkForContent) return true;
        element = this.dom.getEditableParent( element);
        let selector = API.dom.getSelector( element);
        // Get CSS classes available for this element
        let availableClasses = $$$.availableClasses( element);
        let clearClassesStr = availableClasses.join( ',');
        // Build class selector panel using JSON100 format and Bulma panel        
        let classSelectorPanel = {};
        let classList = element.classList;
        for ( let classi=0; classi < availableClasses.length; classi++) {
            // Get class's name and label
           let className = availableClasses[classi];
           let classLabel = $$$.getStyleLabel( className, element);
            // Set link attributes for adding class
           let title = $$$.translateTerm( "add") + ' ' +classLabel;
           let linkClass = "panel-block";           
           let action = "$$$.classChangeInMenu( '"+ className + "', " + selector + ", '" + clearClassesStr + "');$$$.closeBox();";           
           let iconAndLabel = classLabel;
           if ( classList.contains( className)) { 
                // Current class so adapt attributes for removing class
                linkClass += " is-active";               
                iconAndLabel = [{ "tag":"span", "class":"panel-icon", "value":{ "tag":"i", "class":"fa fa-thumbs-up"}}, { "value":iconAndLabel}];
                title = API.translateTerm( "remove") + ' ' +classLabel;
                action = action.replace( 'closeBox();', "displayStyle( '" + element.id + "');");
            }
            classSelectorPanel[ classLabel] = { tag:"a", class:linkClass, onclick: action, title:title, value:iconAndLabel};
        }
        // Compile panel JSON100 object and generate HTML
        let contentData = {
            tag:"div", type:"configurator", class:"panel "+boxClass, name:boxName, edit:"off", value:{
                heading : { tag:"p", class:"panel-heading", onclick:"API.closeBox();", value:"Styles"},
                tabs : this._getTabs( element, 'styles'),
                styles : { tag:"p", class:"panel-block-holder is-wrapped", value:classSelectorPanel},
            }          
        }; 
        let content = API.json.putElement( contentData, false); //createHTMLElementsFromJSON
        // Display action box
        if ( typeof process != 'object') { this.addActionBox( saveable, boxName, boxClass, content);}
        else { return content.innerHTML;}
    } // $$$.displayStyle()

   /**
    * {JS} $$$.displayLayout( elementOrId) Display CSS classs for handling layouts in elements combing image and text
    * @param {*} elementOrId Element or its id
    * @param {*} checkForContent Default false to return panel, true just to check if there's anything to choose
    * @returns 
    */ 
    displayLayout( elementOrId, checkForContent = false, boxName = '_TMPstyle', boxClass='styleBox') {
        let element = ( elementOrId) ? this.dom.element( elementOrId) : this.dom.cursor.fetch().HTMLelement;        
        let saveable = this.dom.getSaveableParent( element);
        if ( !element || !saveable) { return;}
        element = this.dom.getEditableParent( element);
        let selector = this.dom.getSelector( element);        
        let layoutable = ( this.dom.elements( '*', element).length > 0);
        if ( checkForContent && !layoutable) return false;
        // Build class-based layout selections
        let classSelectorPanel = {};    
        let classList = element.classList;
        let availableLayouts = $$$.availableLayouts( element);
        if ( checkForContent) return (availableLayouts.length > 0);  
        let clearLaysStr = availableLayouts.join( ',');        
        for ( let layi=0; layi < availableLayouts.length; layi++) {
            let layoutName = availableLayouts[ layi];
            let layoutLabel = $$$.getStyleLabel( layoutName, element);
            // Set attributes for adding class
            let title = $$$.translateTerm( "add") + ' ' +layoutLabel;
            let linkClass = "panel-block";
            let action = "$$$.classChangeInMenu( '"+ layoutName + "', " + selector + ", '" + clearLaysStr + "');API.closeBox();";  
            let iconAndLabel = layoutLabel;         
            if ( classList.contains( layoutName)) { 
                // Current class so adapt attributes for removing class
                linkClass += " is-active";
                iconAndLabel = [{ "tag":"span", "class":"panel-icon", "value":{ "tag":"i", "class":"fa fa-thumbs-up"}}, { "value":iconAndLabel}];
                title = $$$.translateTerm( "remove") + ' ' +layoutLabel;
                action = action.replace( 'closeBox();', "displayLayout( '" + element.id + "');");
            }                       
            classSelectorPanel[ layoutLabel] = { tag:"a", class:linkClass, onclick: action, title:title, value:iconAndLabel};    
        } 
        // Add available Templates (ie HTML with inserted fields)
        // Get current template from ud_model in 1st element of content
        /*
        let cmodel = API.dom.attr( element.childNodes[0], 'ud_model');
        if ( cmodel) { 
            // Get data keys & find models
            let keys = Object.keys( $$$.extractDataFromContent( element.innerHTML, cmodel));
            let models = this.findModels( keys);
            // Add each model to layoutSelector left / right if current
            for ( let modi=0; modi < models.length; modi++) {
                let model = models[ modi].replace( 'viewZone', '');
                let blinkClass = "panel-block";
                let action = "$$$.replaceModelInElement( " + selector + ", '" + cmodel + "', '" + model + "');$$$.closeBox();";  
                if ( model == cmodel) {
                    // Current model
                    buttonClass += " is-active";
                }
                classSelectorPanel[ layoutLabel] = { tag:"a", class:"panel-block"+active, onclick: action, title:classLabel, value:iconAndLabel};   
            }
        } 
        */
        // Compile panel JSON100 object and generate HTML
        let contentData = {
            tag:"div", type:"configurator", class:"panel "+boxClass, name:boxName, edit:"off", value:{
                heading : { tag:"p", onclick:"API.closeBox();", class:"panel-heading", value:"Dispositions"},
                tabs : this._getTabs( element, "layouts"),
                layouts : { tag:"p", class:"panel-block-holder", value:classSelectorPanel},
            }          
        }; 
        let content = API.json.putElement( contentData, false);
        // Display action box
        if ( typeof process != 'object') { this.addActionBox( saveable, boxName, boxClass, content);}
        else { return content.innerHTML;}
    } // $$$.displayLayout()

    displayConfig( elementOrId, checkForContent = false, boxName='_TMPconfig', boxClass='configBox') {
        let element = this.dom.element( elementOrId);
        let saveable = this.dom.getSaveableParent( element);
        if ( !element || !saveable) { return;}
        let editable = this.dom.getEditableParent( element);
        let selector = API.dom.getSelector( element);
        let exTag = this.dom.attr( element, 'exTagType');
        if ( checkForContent) 
            return ( (this.dom.textContent( 'UD_mode') == "edit3") || ( exTag == "p.undefined"))
        let exTagParts = exTag.split( '.');
        if ( this.dom.element( boxName)) { this.closeBox();}
        // Get element's name
        let { name, placeholder} = this.getName( editable);
        // Get extended tags and sub-types
        let availableTags = $$$.availableTags( editable);
        if ( element != saveable) availableTags = API.availableTagsForSelection( saveable);
        // Build config action box using JSON conversion so attribute names are standard
        // Build tag selector
        let isUndefined = element.classList.contains( "undefined");
        let tagSelector = { systemLabel:{ tag:"span", class:"label", value:API.translateTerm( 'Element type & sub-type :')}};
        let tagSelectorPanel = {};
        let active = "";
        let tagLabel = this.getLabel( exTag);
        for ( let tagi=0; tagi < availableTags.length; tagi++) {
            let tag = availableTags[ tagi];
            let tagLabel = this.getLabel( tag);
            let tagParts = tag.split( '.');
            let nExTag = tagParts.slice( 0, 2).join( '.');
            let nSubtype = ( tagParts.length > 2) ? tagParts[ 2] : "";
            let buttonClass = "button";
            let action = "";
            if ( isUndefined) {
                if ( typeof tagSelector[ tagLabel] != "undefined") { continue;}
                action = "let el = API.changeTag( '"+ nExTag + "', " + selector + ", '" + nSubtype + "');";
                // action +=  "API.displayConfig( el);";
            } else {
                if ( tag == exTag) {
                    // Matches current element 
                    buttonClass += " rightButton";
                    if ( tagParts.length == 3) { 
                        // Button to remove sub type
                        action = "API.changeTag( '" + nExTag + "', " + selector + ");API.displayConfig( '" + element.id + "');";
                        active = "is-active";
                    } else { 
                        // Button to remove exTag
                        action = "API.changeTag( 'p.undefined', " + selector + ");API.displayConfig( '" + element.id + "');";
                        active = " is-active";
                    }
                } else if ( exTagParts.length == 2 && tagParts[1] == exTagParts[1]) { 
                    action = "API.changeSubType( '"+ nSubtype + "', " + selector + "); API.closeBox();";
                } else { continue;}
            }         
            let iconAndLabel = tagLabel;
            tagSelector[ tagLabel] = { tag:"span", class:buttonClass, onclick: action, title:tagLabel, value:tagLabel};
            tagSelectorPanel[ tagLabel] = { tag:"a", class:"panel-block"+active, onclick: action, title:tagLabel, value:iconAndLabel};
        }
        
        // Build flag controls
        let flagControls = "";
        // TEMP calculator doesn't accept {} syntax for elements
        if ( true || selector[0] == "'") { // ( element == saveable) { //this.dom.udjson.parse(selector)) {
            flagControls += '<span class="label">Options: </span>';
            // Toogle switch for editable
            let valueSelector = this.ude.calc.attrPath( selector, 'ude_edit');
            // let valueSelector = "'" + saveable.id + '...ude_edit' + "'";            
            flagControls += $$$.calculate( "switchTag( " + valueSelector + ", 'configSwitch', 'editable', 'CFG_editable');");
        }
        // Build specifc actions
        let actionSelector = { systemLabel:{ tag:"span", class:"label", value:API.translateTerm( 'Tools :')}};        
        {
            let buttonClass = "button";
            // Copy a view
            let targetView = API.dom.getView( element);
            let targetName = API.dom.attr( targetView, 'name');            
            let sourceName = targetName.replace( ' TBC', '').replace( ' FR', '').replace( ' EN', ''); 
            if ( sourceName != targetName) {
                let actionLabel = this.getLabel( "Copy original");             
                let action = "API.copyElements( '" + sourceName + "', '" + targetName + "');";
                actionSelector[ tagLabel] = { tag:"span", class:buttonClass, onclick: action, title:actionLabel, value:actionLabel};
            }
        }
        // Build link to parent
        let parentLink = {};
        if ( element != saveable) {
            // Link
            parentLink = { tag:"span", class:"parentLink", value:{ 
                tag: "a",
                onclick : "API.hideMenu(); API.displayMenu( '"+saveable.id+"');API.displayConfig('"+saveable.id+"');",
                value: " parent"
                }
            };
        }
        // Compile box         
        let contentData = {
            tag:"div", type:"configurator", class:"actionBox "+boxClass, name:boxName, value:{
                name: { tag:"div", class:"nameEdit", value:[
                    { tag: "a", onclick:"API.closeBox();", class:"actionIcon", value:{ tag:"img", src:this.icons['Config']}},
                    { tag:"span", class:"firstlabel", edit:"off", value: API.translateTerm( "Element name :")},
                    { 
                        tag:"span", class:"objectName", stage:"on", placeholder: placeholder,
                        valid:"if ( API.changeName( " + selector + ")) API.closeBox();", value: name
                    },
                    parentLink
                ]},
                tags : { tag:"div", class:"tagSelect", value:tagSelector}, 
                flags : { tag:"div", class:"flagControl", value:flagControls},
                actions : { tag:"div", class:"actionSelect", value:actionSelector}, 
          }          
        };  
        let content = API.json.putElement( contentData, false);
        this.dom.attr( content, 'contenteditable', "false");
        this.dom.attr( this.dom.element( "span.objectName", content), 'contenteditable', "true");
        // Using a Panel (Bulma)    
        tagSelectorPanel[ 'name'] = { tag:"p", class:"panel-block", value:{
                tag:"span", class:"objectName", stage:"on", placeholder: placeholder,
                valid:"if ( API.changeName( " + selector + ")) API.closeBox();", value: name
            },
            parentLink
        };
        actionSelector[ 'systemLabel'] = '';
        let panelContentData = {
            tag:"div", type:"configurator", class:"panel", name:boxName, edit:"off", value:{
                heading : { tag:"p", onclick:"API.closeBox();", class:"panel-heading", value:"Configuration"},
                tabs : this._getTabs( element, "config"),
                config : { tag:"div", value:{                
                    tags : { tag:"div", class:"panel-block-holder", value:tagSelectorPanel}, 
                    flags : { tag:"div", class:"flagControl", value:flagControls},
                    actions : { tag:"div", class:"actionSelect", value:actionSelector}, 
                    }          
                }          
            }    
        }; 
        content = API.json.putElement( panelContentData, false);

        // Display action box
        this.addActionBox( element, boxName, boxClass, content);
       /* // Let element know it is in control mode
        let controlEvent = { event: "configure", type: "configure", action:"enter"};
        API.dispatchEvent( saveable, controlEvent);*/
        // Return generated content for test purposes
        return content.innerHTML;
    }
    
    getName( element, reserve = false) {
        let name = this.dom.attr( element, 'name');
        let placeholder = "";
        if ( !name) {
            let indexName = this.dom.attr( element, 'ud_type');
            if ( !indexName || typeof window.udparams['AutoIndex_'+indexName] == "undefined") { indexName = "element";}
            let index = window.udparams['AutoIndex_'+indexName]; //++; // 2DO increment when used
            name = API.translateTerm( indexName) + '_' + index;
            placeholder = name;
            if ( reserve) window.udparams['AutoIndex_'+indexName]++;
        }
        return { name, placeholder};
    }
    /*
        let tempName = '_TMPnameEdition';
            if ( this.dom.element( tempName)) {
                this.ude.floatConfig( this.dom.element( tempName));
                this.ude.floaterActionPending = null;
            } else {
                let attr = { 
                    id: '_TMPnameEdition', class:"objectName", ude_stage:"on", 
                    ude_onvalid:"API.changeName( '{id}');window.ud.ude.floaterActionPending = null;", 
                    ude_oninvalid:"API.dom.remove('{id}');window.ud.ude.floaterActionPending = null;",
                    ude_bind: "next", // previous
                    style: "height:20px; z-index:200;display:block;"
                };
                let nameZone = this.dom.prepareToInsert( 'div', '<span class="objectName">'+currentName+'</span>', attr);
                // let nameZone = this.dom.insertElement( 'span', currentName, attr, element, true, -1);
                this.ude.floatConfig( nameZone, element);
                // this.dom.cursor.setAt( nameZone);                
            }
        }        

    }
    */
    /* elementOrSelector
    */
    displayCloud( elementOrId, checkForContent = false) {
        let element = this.dom.element( elementOrId);
        if ( !element) { return;}
        // Box name & class
        let boxName = '_TMPwebextract';
        let boxClass = "webBox";
        // Find siteExtract module
        let mod = window.ud.ude.modules[ UD_moduleLabels.siteExtract];
        let siteExtract = ( typeof mod == "object") ? mod.instance : null;
        // Find connectors
        // 2DO
        let connectors = API.dom.elements( "div.connector", API.dom.element( 'document'));
        // Prepare box content
        let content = '<a href="javascript:" onclick="API.closeBox();"><img src="'+this.icons['Cloud']+'"/></a>';
        content += '<span class="boxLabel">Choisir la source : </span>';
        let contentPanel = "";
        let selector = API.dom.getSelector( element);
        if ( siteExtract) {
            if ( checkForContent) return true;
            //let click = "'API.displayCloudWeb(" + selector + ");'";            
            //content += '<span class="cloud-source" onclick=' + click + '>Web</span>';
            let click = "API.displayCloudWeb(" + selector + ");";            
            content += '<span class="cloud-source" onclick="' + click + '">Web</span>';
            contentPanel += '<span class="cloud-source" onclick="' + click + '">Web</span>';            
        }
        // Add connectors
        for ( let conni = 0; conni < connectors.length; conni++) {
            if ( checkForContent) return true;
            let name = API.dom.attr( connectors[ conni], 'name');
            let click = "API.displayCloudConnector(" + selector + ", '" + name + "');";            
            content += '<span class="cloud-source" onclick="' + click + '">' + name + '</span>';   
            contentPanel += '<span class="cloud-source" onclick="' + click + '">' + name + '</span>';          
        }
        if ( checkForContent) return false;
        // Build action box
        let attr = { 
            id: boxName, class:"actionBox " + boxClass, type: "connector", ude_stage:"on", 
            ude_bind: "next", // previous
            /*style: "height:300px; z-index:200;display:block;"*/
        };        
        let useClick = "API.useAction( '" + boxName + "');"
        let box = this.dom.prepareToInsert( 'div', content, attr); // <span class="button" onclick="'+useClick+'">Use</span>
        // Bulma
        let contentData = {
            tag:"div", type:"configurator", class:"panel "+boxClass, name:boxName, edit:"off", value:{
                heading : { tag:"p", class:"panel-heading", onclick:"API.closeBox();", value:"Récupérer du cloud"},
                tabs : this._getTabs( element, "cloud"),
                content : { tag:"div", name:"_TMP_CLOUDcontent", value:contentPanel},
                // layouts : (layoutable) ? { tag:"div", class:"layoutSelect", value:layoutSelector} : { value:""},
                // inserts : (insertable) ? { tag:"div", class:"insertSelect", value:insertSelector} : { value:""},
            }          
        }; 
        box = API.json.putElement( contentData, false);;
        // Display action box
        if ( typeof process != 'object') { 
            this.addActionBox( element, boxName, boxClass, box);            
        } else { return content;}
        // If no connectors, go straight to web
        if ( !connectors.length) { return this.displayCloudWeb( elementOrId);}

    }
    
    displayCloudWeb( elementOrId) { 
        let element = this.dom.element( elementOrId);
        if ( !element) { return;}
        let panel = true;
        // Box name & class
        let boxName = '_TMPwebextract';
        let boxClass = "webBox";
        // Find siteExtract module
        let mod = window.ud.ude.modules[ UD_moduleLabels.siteExtract];
        let siteExtract = ( typeof mod == "object") ? mod.instance : null;
        if ( !siteExtract) { return;}
        // Setup box
        let box = API.dom.element( boxName);
        let box2 = $$$.dom.element( '_TMP_CLOUDcontent'); // Patch for Bulma
        let display = false;
        if ( !box2) {
            let attr = { 
                id: boxName, class:boxClass, type:"connector", ude_stage:"on", 
                ude_bind: "next", // previous
                /*style: "height:300px; z-index:200;display:block;"*/
            };        
            let useClick = "API.useAction( '" + boxName + "');"
            box2 = this.dom.prepareToInsert( 'div', '', attr); // <span class="boxLabel">Web</span>            
            display = true;
        } else { box2.innerHTML = '';}
        this.dom.attr( box, 'contenteditable', "false");
        // Fill box
        // And cloud control
        if ( !panel) API.dom.insertElement( 'a','<img src="'+this.icons['Cloud']+'"/>', { href:"javascript:", class:"actionIcon", onclick:"API.closeBox();"}, box, true, true);
        // Find and display link in element
        let children = this.dom.children( element);        
        let currentLink = "";
        for ( let childi=0; childi < children.length; childi++) {
            let child = children[ childi];
            if ( this.dom.attr( child, 'exTag') == 'a' && this.dom.attr( child, 'href')) {
                currentLink = this.dom.attr( child, 'href');
                break;
            } 
        }
        if ( currentLink) {
            let currentLinkText = API.translateTerm( "current link")+" is "+ currentLink + ".";
            API.dom.insertElement( 'span', currentLinkText, {}, box, UD_after, UD_inside);
            API.dom.insertElement( 'span', API.translateTerm( 'follow'), {ude_ui:"on", class:"button", onclick:"window.open('"+currentLink+"');"}, box, UD_after, UD_inside);
            // 2DO Add button to remove link API.dom.insertElement( 'span', API.translateTerm( 'clear'), {ud_type:"button", onclick:"API.removeLink('"+element.id'+"');"}, box, UD_after, UD_inside);
            // Select a new one and don't buildConfigZone2
        }
        // Existing information
        // idea API.dom.insertElement( 'p','Lien actuel : xxxx, Image actuel: iii', {}, box, true, true);
        // With site extractor interface
        siteExtract.buildConfigZone2( box2);       
        // And cloud control and existing information
        //API.dom.insertElement( 'a','<img src="'+this.icons['Cloud']+'"/>', { href:"javascript:", class:"actionIcon", onclick:"API.closeBox();"}, box.childNodes[0].childNodes[0], false);
       
        // Display action box
        if ( typeof process != 'object' && display) { 
            this.addActionBox( element, boxName, boxClass, box);
            this.dom.cursor.setAt( this.box);
        } else {
            this.dom.cursor.setAt( this.box);            
            return content;
        }
    }
  
    displayCloudConnector( elementOrId, connectorName) {
        let element = this.dom.element( elementOrId);
        if ( !element) { return;}
        // Box name & class
        let boxName = '_TMPwebextract';
        let boxClass = "webBox";
        // Find connector
        let connectorData = API.dom.element( connectorName); // Saveable parent's name is data table's id
        if ( !connectorData) { return;}
        let box = API.dom.element( boxName);
        let display = false;
        if ( !box) {
            let attr = { 
                id: boxName, class:boxClass, type:"connector", ude_stage:"on", 
                ude_bind: "next", // previous
                /*style: "height:300px; z-index:200;display:block;"*/
            };        
            let useClick = "API.useActionData( '" + boxName + "', '_TMPwebInput');"
            box = this.dom.prepareToInsert( 'div', '', attr); // <span class="boxLabel">Web</span>
            display = true;
        } else { box.innerHTML = '';}
        // Fill box
        API.dom.insertElement( 'a','<img src="'+this.icons['Cloud']+'"/>', { href:"javascript:", class:"actionIcon", onclick:"API.closeBox();"}, box, false, true);
        let attr = { id:"_TMPwebPrompt", class:"webPrompt", edit:"off"};
        API.dom.insertElement( 'span', 'Cliquer sur une cellule', attr, box, false, true);
        attr = { id:"_TMPwebInput", class:"webInput", type: "text"};
        let input = API.dom.insertElement( 'input', '', attr, box, false, true);
        attr = { id:"_TMPwebUse", class:"button", onclick:"API.useActionData( '" + boxName + "', '" + input.id + "');"};
        API.dom.insertElement( 'span', API.translateTerm( 'Use'), attr, box, false, true);
        let copyData = connectorData.cloneNode( true);
        copyData.id = "TMP_" + copyData.id;
        let body = API.dom.element( 'tbody', copyData);
        let head = API.dom.element( 'thead', copyData);
        let usedHeight = 22 + 50 + 20;
        body.style.height = ( API.dom.attr( box, "computed_height") - usedHeight) + "px"; // Height of prompt + thead + margins and table padding
        // Add click listerner
        API.dom.attr( copyData, "onclick", "API.actionTableClick( event, '" + input.id + "');");
        box.appendChild( copyData);
        // Display action box
        if ( typeof process != 'object' && display) { this.addActionBox( element, boxName, boxClass, box);}
        else { return content;}
        // Redo height after display
        usedHeight = 22 + API.dom.attr( 'head', 'computed_height') + 20;
        body.style.height = ( API.dom.attr( box, "computed_height") - usedHeight) + "px";
       
    }
   
   /**
    * Process a clic on a table in an action box
    * @param {object} event The navigator's event
    * @param {string} inputId Id of the input element where to place clicked data
    */
    actionTableClick( event, inputId) {
        let input = API.dom.element( inputId);
        if ( !input) { return;}
        let element = event.target;
        let exTag = API.dom.attr( element, "exTag");
        if ( exTag == "td") {
            let row = element.parentNode;
            if ( element == row.cells[0]) {
                // First column so select complete row
                let tbody = row.parentNode;
                let rows = tbody.childNodes;
                let rowIndex = 1;
                while ( rowIndex <= rows.length && rows[ rowIndex -1] != row) { rowIndex++;}
                let rowData = API.getRow( row.parentNode.parentNode.id, rowIndex);
                input.value = JSON.stringify( rowData);
                if ( rowIndex) { rows[ rowIndex - 1].classList.add( 'selected');}
            } else { input.value = element.textContent;}
        } else if ( exTag == "tr") {
            // 2DO Get row values as object
        }
    }
    actionParamGet() {}
    actionParamSet() {}
   /**
    * Display Ideas tool in front of element
    */  
    displayIdeas( elementOrId, checkForContent = false) {
        let element = this.dom.element( elementOrId);
        if ( !element ) { return;}
        // Box name & class
        let boxName = '_TMPideas';
        let boxClass = "ideasBox";
        // Shortcuts
        let gval = this.dom.udjson.value;
        // Look for original text
        let original = "";
        let source = API.getEditorAttr( element, 'data-ude-datasrc');
        if ( source) {
            // Build selector to corresponding element in source as source id
            let srcSel = source;
            let selector = this.dom.getSelector( element);
            let selJSON = doOnload( "(" + selector + ")");           
            if ( typeof selJSON == "object") { 
                // Object selector required
                let parent = selJSON.parent;
                srcSel = { child:selJSON.child, tag:selJSON.tag, parent:parent};
                let srcPath = "parent/";
                let safe = 5;
                while ( parent && typeof parent != "string" && safe--) {
                    parent = parent.parent;
                    srcPath += "parent/";
                }
                if ( parent) {
                    // Change parent id to correspond with same tag in source
                    srcPath = srcPath.substring( 0, srcPath.length-1);
                    // 2DO use elements as could be 3rd span for example
                    let selElTag = this.dom.element( parent).tagName.toLowerCase();
                    let srcEl = this.dom.element( selElTag, this.dom.element( source));                    
                    srcSel = this.dom.udjson.valueByPath( srcSel, srcPath, srcEl.id);
                }
            }
            original = this.dom.element( srcSel).innerHTML;
            // PATCH trial Translate
            let params = {
                action : "translate",
                source : "en",
                target :  "fr",
                text : original,
                dataTarget : "_TMP_ideas_Google_translate",
                dataSource : "translation"
            }
            let rep = API.service( "GoogleTranslate", params);

           // original = this.dom.element( source).textContent;
        }
        let panel = true;
        let contentPanel = "";
        let content = '<a href="javascript:" class="actionIcon" onclick="API.closeBox();"><img src="'+this.icons['Idea']+'"/></a>';            
        
        // Present textual or visual ideas depending on element type
        let exTag = this.dom.attr( element, 'exTag');
        /*
        if ( exTag == "div.image") {
            content += API.getImagePicker( element, 'API.closeBox();');
        } else {
        */ 
        let ideas = [];
        let keywords = {}; 
        let texts = { element:"", sectionBefore:"", sectionAfter:"", view:""};        
        {
            // FIND IDEAS (2DO fct) 
            // Regroup texts and keywords
            {
                // 2DO fct move to udeideas or udeideasstandard
                // Get model's keywords standard fct               
                let keywordHolder = this.dom.elementByName( '_KEYWORDS');
                keywords.model = ( keywordHolder) ? keywordHolder.textContent.split( ',') : [];
                // Find keywords already entered
                // 2DO use api fct getKeywords
                let getWords = function( text) {
                    let words = [];
                    let word = "";
                    for ( let ci = 0; ci < text.length; ci++) {
                        let char = text[ ci];
                        if ( " .,;?!-_".indexOf( char) > -1) { 
                            if (word) { words.push( word);}
                            word = "";
                        } else { word += "" + char;}
                    }
                    if ( word) { words.push( word);} //window.ud.ude.calc.removeAccentsAndLower(
                    return words;
                }
                let isSignificant = function( word) {   
                    let lang = API.dom.element( 'UD_lang').textContent;           
                    if ( !word.trim() || UD_insignificantWords[ lang].indexOf( word) > -1) { return false;}
                    return true;
                }
                let getSignificant = function( text, keywords) {
                    let result = [];
                    let words = getWords( text);
                    for ( let wordi = 0; wordi < words.length; wordi++) {
                        let word = words[ wordi];
                        let p1 = word.indexOf('[');
                        if ( p1 > -1) {
                            // Word has a POS attached
                            let pos = word.substr( p1+1, word.indexOf(']')-p1-1);
                            word = word.substr( 0, p1);
                            if ( typeof keywords[ pos] == "undefined") keywords[ pos] = [];
                            keywords[pos].push( word);                        
                        }
                        word = window.ud.ude.calc.removeAccentsAndLower( word); 
                        if ( isSignificant( word)) { result.push( word);}
                    }
                    return result;
                }        
                keywords.element = getSignificant( element.textContent, keywords);
                texts.element = element.textContent;
                keywords.section = [];
                let walkElement = element;
                let step = 3;
                while ( (walkElement = walkElement.previousSibling) && step--) {
                    keywords.section = keywords.section.concat( getSignificant( walkElement.textContent, keywords));
                    texts.sectionBefore += walkElement.textContent+" ";
                }
                walkElement = element;
                step = 3;
                while ( (walkElement = walkElement.nextSibling) && step--) {
                    keywords.section = keywords.section.concat( getSignificant( walkElement.textContent, keywords));
                    texts.sectionAfter += walkElement.textContent+" ";
                }
                keywords.view = []; // 2DO add rest of view
                
                // Get ideas from Ideas handler
                if ( this.ideasHandler) {
                    // 2DO use promise/then
                    ideas = this.ideasHandler.getIdeas( keywords, element, '_TMPideas');
                } 
                // Add ideas available i ndoc
                // Classify keywords
                // 2DO in order of proximity, keywords.verbs, keywords.subjects, objects, articles
                // keywords.POSgroups
                // Fetch candidates
                let exTag = this.dom.attr( element, 'exTag');
                // let index =  this.getIndex() // nth H1 etc
                let modelsView = this.dom.element( "[name='Ideas']", this.dom.element( 'document'));
                if ( !modelsView) { modelsView = this.dom.element( "[name='Models']", this.dom.element( 'document'));}
                let h2Titles = this.dom.element( "h2", modelsView);
                let candidates = ( h2Titles) ? API.grabPortion() : API.dom.unpagedChildElements( modelsView);
                /*
                    Models view 
                    elements of target type with default content
                    elements of target type with suggested content (ideas)
                    Tables and connectors with target type in column
                    Headers that indicate content Defaults, Ideas  or Models view with specif use
                
                    Substitutable content : {subs} 
                    Find subs from instanced
                    Get subject, object, verb
                    
                    Get candidatePhrases
                    Get elementRules
                    Get elementFormulas
                */
                // Select relevant content and store as lookup table
                let matchKeywords = function( text, keywords) {
                    // Remove punctuation
                    // Split on spaces
                    let words = getSignificant( text);
                    let keywordHits = 0;
                    let hits = [];
                    for ( let wordi=0; wordi < words.length; wordi++) {
                        let cword = words[ wordi];
                        let before = keywordHits;
                        if ( keywords.model.indexOf( cword) > -1) keywordHits += 3;
                        else if ( keywords.element.indexOf( cword) > -1) keywordHits += 10;
                        else if ( keywords.section.indexOf( cword) > -1) keywordHits += 6;
                        else if ( keywords.view.indexOf( cword) > -1) keywordHits += 3;
                        if ( keywordHits > before) hits.push( cword);
                    }
                    if ( keywordHits > 6) { return true;}
                    return false;
                }
                let matchClass = function( classStr, element) {
                    if ( !classStr) return true;
                    let classes = classStr.split( ' ');
                    for ( let cli=0; cli<classes.length; cli++) {
                        if ( element.classList.contains( classes[ cli])) return true;
                    }
                    return false;
                }
                
                for ( let candi=0; candi < candidates.length; candi++) {
                    let candidate = candidates[ candi];                
                    let content = ( typeof candidate == 'object') ? candidate.innerHTML : candidate; 
                    if ( content.indexOf( '{verb}') > -1) {
                        // Idea contains jokers - try all variations of nouns, verbs etc
                        let verbs = gval( keywords, 'verb');
                        let nouns = gval( keywords, 'noun');
                        let articles = gval( keywords, 'article');
                        for ( let verbi=0; verbi < verbs.length; verbi++) {
                            let verb = verbs[ verbi];
                            for ( let nouni=0; nouni < nouns.length; nouni++) {
                                let noun = nouns[ nouni];
                                let article = articles[ nouni];
                                let substituted = content.replace( '{verb}', verb).replace( '{article}', article).replace( '{noun}', noun);
                                candidates.push( substituted);
                            }
                        }  
                        continue; 
                    }               
                    let match = 
                        ( typeof candidate == 'string' || (
                            this.dom.attr( candidate, 'exTag') == exTag
                            && matchClass( candidate.className, element)                        
                        )) 
                        && matchKeywords( content, keywords)                    
                        && ( ideas.indexOf( content) == -1)
                        && ( element.textContent.indexOf( content) == -1)
                    ;
                    if ( match) { ideas.push( content);}
                    // 2DO mode replace all / append
                    // 2DO if variables loop for sets of article, noun, verb
                    /*                
                    switch ( this.dom.attr( candidate, 'exTag')) {
                        default :
                            if ( matchKeywords( candidate.textContent, keywords)) { ideas.push( candidate.innerHTML);}
                            break;
                            
                    }
                    */
                }
            } 
        }
        if ( exTag == "div.image") {
            content += API.getImagePicker( element, 'API.closeBox();', keywords);
            contentPanel += API.getImagePicker( element, 'API.closeBox();', keywords);
        } else {
            let selector = this.dom.getSelector( element);
            let event = "{ event:'idea', type:'idea', data: '" + element.textContent.replace( /\'/g, "\\'") + "'};";
            let click = "API.dispatchEditEvent( " + event + ", " + selector + ");";
            // 2225012 trial  let click = "API.insertTextAtCursor( this.textContent);"            
            if ( original) {
                content += '<div id="_TMP_ideas_original" class="textExpand">';
                content += API.translateTerm( 'Original text') + ' : ';
                content += '<span class="UD_idea" ude_edit="off" onclick="' + click + '">'+original+'</span>';
                // content += original + '</span><br>'; '<span class="source" ude_edit="off">' +                
                content += '</div>';
                //let action = "API.validateElement('" + element.id + "');";
                //content += '<span class="button" action="' + action + '">' + API.translateTerm( 'Validate') + '</span>';
                contentPanel += '<a class="panel-block" onclick="' + click +'">'+original+'</a>';
            }        
            content += '<span class="UD_tip" ude_edit="off">' + API.translateTerm('Click on an idea to add to your text') + '</span><br>';
            if ( original) {
                content += '<div id="_TMP_ideas_translations" class="textExpand">';
                content += "Google Translate : ";
                content += '<span name="_TMP_ideas_Google_translate" class="textExpand translation" onclick="' + click + '">Translation comes here</span></div>';
                contentPanel += '<a name="_TMP_ideas_Google_translate" class="panel-block" onclick="' + click +'">Translation comes here/a>';
            }
            if ( checkForContent) return ( ideas.length > 0);
            // Generate paste event for each idea
            // IDEA 220603 if 3rd arg avaailable in dispatch use this            
            for ( let ideai = 0; ideai < ideas.length; ideai++) { 
                let selector = this.dom.getSelector( element);
                let event = "{ event:'idea', type:'idea', data: '" + ideas[ ideai].replace( /\'/g, "\\'") + "'}";
                let ideaClick = "API.dispatchEditEvent( " + event + ", " + selector + ");";
                /* 2225012 trial
                let editEvent = { type:"paste", event:"paste", data:ideas[ ideai]};
                let ideaClick = "API.dispatchEditEvent( JSON.stringify( editEvent), element.id);"; 
                */                
                content += '<span class="UD_idea" ude_edit="off" onclick="' + ideaClick + '">' + ideas[ ideai] + '</span><br>';
                contentPanel += '<a class="panel-block" onclick="' + ideaClick +'">'+ideas[ ideai]+'</a>';
            }
        }
        // Generate Panel content
        if ( panel) {
            let contentData = {
                tag:"div", type:"configurator", class:"panel", name:boxName, edit:"off", value:{
                    heading : { tag:"p", class:"panel-heading", onclick:"API.closeBox();", value:"Idées"},
                    tabs : this._getTabs( element, "cloud"),
                    content : { tag:"div", name:"_TMP_IDEAScontent", class:boxClass+'Bulma', value:contentPanel},
                    // layouts : (layoutable) ? { tag:"div", class:"layoutSelect", value:layoutSelector} : { value:""},
                    // inserts : (insertable) ? { tag:"div", class:"insertSelect", value:insertSelector} : { value:""},
                }          
            }; 
            content = API.json.putElement( contentData, false);
        }
        // Display action box
        if ( typeof process != 'object') { this.addActionBox( element, boxName, boxClass, content);}
        else { return content.textContent;}
        
  }
  
  find( elementOrId) {}
  
   /**
    * Return the label to use for a tag or style
    * @param {string} tagOrStyle  The value to be labellised
    * @return {string} The displayable label
    * @api {JS} API.getTagOrStyleLabel(tagOrStyle) Get label for a tag or style
    * @apiParam {mixed} elementOrId HTML element or its Id
    * @apiSuccess {string} return text or HTML for images
    * @apiError {object} return null
    * @apiGroup Text   
    */    
    getLabel( tagOrStyle, exTag="", viewType="", viewClass="") {
        if ( !tagOrStyle) return "";
        let label = "";
        let lang = window.lang;
        let info = null;
        let gval = API.json.value;
       /*
        *  Look for info block with decreasing precision
        */        
        if ( exTag && viewType && viewClass) 
            info = gval( UD_exTagAndClassInfo, "div.part."+viewType+" "+"."+viewClass+" "+exTag+"."+tagOrStyle);
        if ( !info && exTag && viewClass)
             info = gval( UD_exTagAndClassInfo, "div.part."+viewClass+" "+exTag+"."+tagOrStyle);
        if ( !info && exTag && viewType) 
            info = gval( UD_exTagAndClassInfo, "div.part."+viewType+" "+exTag+"."+tagOrStyle);
        if ( !info && viewType) info = gval( UD_exTagAndClassInfo, "div.part."+viewType+" "+tagOrStyle);
        if ( !info && exTag) info = gval( UD_exTagAndClassInfo, exTag+"."+tagOrStyle);
        if ( !info) info = gval( UD_exTagAndClassInfo, tagOrStyle);
        if ( info) {
            // Info block found so let's look for label
            label = ( lang == "EN") ? label = gval( info, 'label') : gval( info, "label_" + lang);
            if ( !label) { label = API.json.value( info, 'label');}            
        } 
        // If label not found try translating term
        if ( !label) label = API.translateTerm( tagOrStyle);
        // Fallback to term itself
        if ( !label) label = tagOrStyle;
        return label;
    } // getLabel()
    
    getTagOrStyleLabel( tagOrStyle) { return this.getLabel( tagOrStyle);}
  
   /**
    * Return the label to use for a tag or style
    * @param {string} tagOrStyle  The value to be labellised
    * @return {string} The displayable label
    * @api {JS} API.getLabel(tagOrStyle) Get label
    * @apiParam {mixed} elementOrId HTML element or its Id
    * @apiSuccess {string} return text or HTML for images
    * @apiError {object} return null
    * @apiGroup Text   
    */    
    getIcon( tagOrStyle, action, format="json100") {
        let icon = "";
        let lang = window.lang;
        let info = API.json.value( UD_exTagAndClassInfo, tagOrStyle);
        if ( info) { icon = API.json.value( info, "icon");}
        if ( !icon) { return tagOrStyle;}
        if ( format == "json100") { icon = { tag: "img", class:"LAY_icon", onclick:action, title:this.getLabel( tagOrStyle), src:"/tmp/W24H24_"+icon};}
        return icon;
    } // getLabel()
    
   /**
    * Find first model that matches a data set
    * @param {string} json  The data set in JSON formatvalue
    * @return {string} The HTML code with data substituted
    * @api {JS} API.findAndUseModel( json) Convert JSON to HTML
    * @apiParam {mixed} elementOrId HTML element or its Id
    * @apiSuccess {string} return HTML
    * @apiError {object} return null
    * @apiGroup Data
    */    
    findAndUseModel( data) {
        // Get fields in data
        let dataKeys = Object.keys( data);
        // Find matching models
        let models = this.findModels( dataKeys);
        if ( !models.length) { return "";}
        let model = models[0];
        let template = API.dom.element( model).innerHTML; // API.calc.textContent2HTML
        let html = API.calc.substitute( template, data);
        return html;
    } 
    
    findModels( dataKeys) {
        // Find and match models
        let matchModels = [];
        let models = API.dom.elements( "div.html", "document");
        for ( let modi = 0; modi < models.length; modi++) {
            let model = models[ modi];
            let viewZoneId = API.dom.attr( model, 'name') + "viewZone"
            let modelContent = API.dom.element( viewZoneId).innerHTML;
            let p1 = 0;
            let keysFound = 0;
            while ( ( p1 = modelContent.indexOf( '{', p1)) > -1) {
                let p2 = modelContent.indexOf( '}', p1);
                if ( p2 <= 0) { break;}
                let key = modelContent.substring( p1+1, p2);
                if ( dataKeys.indexOf( key) > -1) { keysFound++;}
                p1 = p2+1;
            }
            if ( keysFound >= ( dataKeys.length - 3)) { matchModels.push( viewZoneId);}            
        }
        return matchModels;
    } 
    /*
    replaceModelInElement( elementOrId, currentModel, newModel) {
        // Get HTML
        let element = API.dom.element( elementOrId);
        let html = element.innerHTML;
        // Extract data from html
        let data = this.extractDataFromModel( html, currentModel);
        // Find new model
        let templateHolder = API.dom.element( newModel + 'viewZone');
        let template = templateHolder.innerHTML; // API.calc.textContent2HTML
        // Substitute data into new model       
        let newHTML = API.calc.substitute( template, data);
        // Update element
        element.innerHTML = newHTML;
        this.ude.setChanged( element);
        return newHTML;        
    }
    
    extractDataFromModel( html, model) {        
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
    }
    */
    displayViewConfig( viewName, switchName) {
        let view = API.dom.element( '[name="'+viewName+'"]', 'middleColumn');
        if ( !view) { return null;}
        this.ude.displayFloatingMenu( view);
    }

   /**
    * To remove menu update in basic changeClass primitif
    */
    classChangeInMenu( className, selector, clearClasses) {
        // Get element & current class
        let element = $$$.dom.element( selector);
        let oldClass = element.className;
        element.classList.forEach( (value) => {
            if ( clearClasses.indexOf( value) > -1 || value.indexOf( 'LAY_') == 0) oldClass = value;
        });      
        // Change class
        $$$.changeClass( className, selector, clearClasses);
        // Update content hook        
        API.updateContentAfterEvent( element, { eventType:"changeClass", oldClass:oldClass, newClass:className});
        // Update menu
        this.display( this.dom.getSaveableParent( element));
        // Mark element as changed
        this.ud.viewEvent( "changeClass", element); 
        // Let editor module know about change
        this.ude.dispatchEvent( { event:"classAdded", type:"classAdded", class:className}, element);
    }
} // JS class UDE_menu

 function UDE_menu_init() {
    //let exTag = "ude-view/udemenu.js";
    let module = new UDE_menu( window.ud.ude);
    if ( window.ud.ude /*&& !window.ud.ude.modules[ exTag].instance*/) {
        // Initialise
        
        // let modEntry = { instance:module, state:"loaded", extags:"div.connector.site", className:"UDC_siteExtract"};
        window.ude.menuManager = module;
    }
    return module;
 }
if ( typeof process != 'object') {
   // UDE_menu_init(); // !!! No initialised by ude
} else {
    // Testing under node.js 
    module.exports = { class:UDE_menu, init:UDE_menu_init};
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined" && typeof ModuleUnderTest == "undefined") {
        // Auto test
        console.log( 'Syntax:OK');            
        console.log( 'Start of UDE_menu class test program');
        console.log( "Setting up browser (client) test environment"); 
        ModuleUnderTest = "udemenu";
        let path = "..";
        const testMod = require( path+'/tests/testenv.js');      
        testMod.load( []);
        let ud = new UniversalDoc( 'document', true, 133); 
        let menuManager = UDE_menu_init();
        //testMod.load2();
        menuManager.icons = { Style:"", Config:"", Idea:"", Cloud:""};
        let modelsViewData = { tag:"div", name:"B0A0000000100000M", label:"Models", type:"page", class:"page", value: [
                { tag:"p", value:"Hello brave world"},
                { tag:"p", value:"Hello cruel world"},
                { tag:"p", value:"Totally different"},
        ]};
        let modelsView = API.dom.udjson.putElement( modelsViewData);
        API.dom.element( 'document').appendChild( modelsView);
        // Pure local tests
        {
            let test = "1 - Ideas";
            let elName = "B0100000001000000M";
            ud.dom.cursor.setAt( ud.dom.element( elName));
            let ideas = menuManager.displayIdeas( elName);
            testResult( test, ideas.indexOf( "cruel") > -1, ideas);
        }
        {
            let test = "2 - Config";
            let config = menuManager.displayConfig( "B0100000001000000M");
            testResult( test, config.indexOf( "panel") > -1, config);
        }
        
        // End of auto-test        
        console.log( "Test completed");
        process.exit();        
    }
}