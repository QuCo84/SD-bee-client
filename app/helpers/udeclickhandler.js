/**
 * udeclickhandler.js - handler of click events for UD editor
 */ 
 /*
   2DO disptachEvent shortcut
 */

// const ud = require('../ud-view-model/ud.js');
  
class UDEclickHandler {
    
    editor = null;
    dom = null;
    topDocument = null;
    
    constructor( editor) {
        this.editor = editor;
        this.dom = editor.dom;
        this.topElement = this.dom.topElement;
        this.setupEventListeners();
        this.setupShortcuts();    
    }
    
    /**
    * Setup event listeners on editor's top element
    */
    setupEventListeners() {
        let me = this;
        this.topElement.addEventListener( "click", function (event) { me.event( event);});
        this.topElement.addEventListener( "mousedown", function (event) { me.event( event);});
        this.topElement.addEventListener( "mouseup", function (event) { me.event( event);});
        this.topElement.addEventListener( "touchstart", function (event) { me.event( event);});
        this.topElement.addEventListener( "touchend", function (event) { me.event( event);});
    }
    
    /**
    * Setup direct links to useful functions available via the $$$ function hub for performance
    */
    setupShortcuts() {
        this.requires2stageEditing = $$$.getShortcut( 'requires2stageEditing');
        this.testEditorAttr = $$$.getShortcut( 'testEditorAttr');
        this.clearClasses = $$$.getShortcut( 'clearClasses');
        this.getSaveableParent = this.dom.getSaveableParent.bind( this.dom);
        this.getEditableParent = this.dom.getEditableParent.bind( this.dom);
        this.cursor = this.dom.cursor;
        this.contextualMenuOn = $$$.getShortcut( 'displayMenu');
        this.contextualMenuOff = $$$.getShortcut( 'hideMenu');
        this.element = this.dom.element;
        this.attr = this.dom.attr.bind( this.dom);
        this.parentAttr = this.dom.parentAttr.bind( this.dom);
        this.udjson = this.dom.udjson;
        this.dispatchEvent = this.editor.dispatchEvent.bind( this.editor);
        this.toggleClass = $$$.getShortcut( 'toggleClass');
    }
    
   /**
    * Handle click events
    * @param {object} e The click event
    * @return {boolean} True if processed
    */
    event( e) {
        // Find clicked element and check its inside document
        let element = this.clickedElement(e);
        if ( !element) return;  
        // Process click
        let processed = false;
        // Clear element being watched
        this.editor.watchElementForChange = null;
        // Do nothing if the element is to be handled by browser
        if ( this.handledByBrowser( element)) return; 
        // See if element is editable
        let editable = this.isEditable( element, false);        
        // Monitor event timing for virtual keyboard detection and filter unuseful events
        if (!this.monitorAndFilter( e, editable, element)) return;  
        // Process event 
        if ( this.insideActionBox( element)) {
            // PROCESS A CLICK IN UI
            if ( !processed && this.editor.requires2stageEditing( element)) element = this.editor.editingElement;
        } else if ( editable) {
            // PROCESS A CLICK ON AN EDITABLE ELEMENT
            // Update cursor shadow
            this.cursor.fetch();
            // Give element's editor module a chance to handle the event
            processed = this.editor.dispatchEvent( e, element);
            // Activate 2-stage editing if required and eventually change element
            if ( !processed && this.editor.requires2stageEditing( element)) element = this.editor.editingElement;
            // Display menu if required  
            if ( !processed && $$$.testEditorAttr( element, 'ude_menu')) processed = this.displayMenu( element);
            // Handle mouse-driven mobile emulation
            if ( !processed) processed = this.emulateMobile( e);
            // Update element DISACTIVATED            
            // if( element.getAttribute('_updatecall')) this.dataSource.fetchElement( element);
        } else /*if ( !clickable) */{ 
            // NOT UI, NOT EDITABLE -  LET ELEMENT KNOW ABOUT THE CLICK, RESTORE CURSOR, AND DISPLAY MENU FOR COLLAPSABLE ELEMENTS
            // Give element a chance to do something
            e.ud_clickable = false;
            e.ud_editable = false;
            if ( !processed) processed = this.dispatchEvent( e, element);
            // Restore cursor to last known position
            this.cursor.set();
            // Menu on collapsable elements 
            if ( !processed) processed = this.displayMenuOnNonClickable( element);            
       // } else if ( element.tagName != "INPUT") {
       //     this.stopEditing();
        }
        // Disable browser processing if click processed
        if ( processed && e.type != "touchend") e.preventDefault(); 
    }  // UDE.clickEvent()  

   /**
    * Return true if element is clickable and to be handled by browser
    */ 
    handledByBrowser( element) {
        // 2DO look up to document or saveable for a
        return (
            this.dom.parentAttr( element, 'onclick') != ""
            || ( element.tagName == "A" && ( element.parentNode.tagName != "SPAN" || !$$$.testEditorAttr( element, 'ude_edit'))) //test221125
            || ( element.parentNode && element.parentNode.tagName == "A")
            || element.tagName == "INPUT" 
        )
   }

   /**
    * Return true if element is inside an action box (or User Interface)
    */ 
   insideActionBox( element) {
        let container = this.dom.getParentWithAttribute( 'ud_type', element,);
        return (( container) ? container.classList.contains( 'actionBox') : false);
   }

   /**
    * Return true if element is editable
    */
    isEditable ( element, clickable) {
        let exTag = this.attr( element, 'exTag');
        return !(
            !element
            || element.id == "document"
            || this.parentAttr( element, 'contenteditable') == "false"
            || exTag == "div.page"
            || ( !$$$.testEditorAttr( element, 'ude_edit') && !$$$.testEditorAttr( element, 'ude_stage') && exTag != "input")
            || ( clickable && this.attr( element.parentNode, 'ud_type') != "link")
        )
    }

   /**
    * Monitor timing & sequence of events and filter unuseful events
    * @param {object} e Click event
    * @param {boolean} editable True if object is editable
    * @param {object} element The clicked element
    * @returns {boolean} Process event
    */ 
    monitorAndFilter ( e, editable, element) {
        if ( element.tagName == "INPUT" || this.attr( element, 'onclick')) return true;
        switch ( e.type) {
            case "mousedown" :
                this.mouseDownTime = this.editor.ticks;
                if ( !editable)  e.preventDefault();
                return false;                
            case "mouseup" :
                this.mouseUpTime = this.editor.ticks;
                if ( !editable) e.preventDefault();
                return false;
            case "touchstart" :
                this.editor.touchMove = false;
                if ( !editable) e.preventDefault();
                return false; 
            case "touchend" :
                if (this.editor.touchMove) return false;
                ///*if ( !editable)*/ e.preventDefault();                
                return false;

                break;
        }
        // Ignore events on UI elements
        if ( this.editor.menuManager.click( element, e)) return false;     
        return true;
    }

   /**
    * Return clicked element or null
    * @param {object} e Click event 
    */ 
    clickedElement( e) {
        let element = e.target;
        if ( !element && typeof e.composedPath != "undefined") {
            // Check click is not inside a No EDIT element
            let clickedElements = e.composedPath();
            for (let eli=0; eli < clickedElements.length; eli++) {
                let clickedElement = clickedElements[ eli];
                if (clickedElement.className.indexOf( "Noedit") > -1) {
                    // Cursor back to last position
                    this.dom.cursor.set(); 
                    element = null;
                }
                if ( clickedElement.id == "document") break;
            }
        }         
        if ( element == this.topDocument) {
            // Neutralise clicks on container element
            e.preventDefault(); 
            return null;
        }  
        return element;      
    } 

   /**
    * Hide menu
    */
   stopEditing() {
        if ( this.editor.editElement) {
            this.clearClasses( this.editor.editElement, 'editing,edcontainer,edinside');
            this.editor.editElement = null;
            this.contextualMenuOff();
            this.editor.leave2stageEditing( true);
            this.cursor.clear();
        }
   } 

   /**
    * Display contextual menu for an element using menu hook if menu is enabled for element
    * @param { object} element The element 
    */ 
    displayMenu( element) {
        let processed = false;
        if ( this.testEditorAttr( element, 'ude_menu'))  {
            // Get element to associate with contextual menu
            let saveable = this.getSaveableParent( element);
            let editable = this.getEditableParent( element, this.dom.cursor.selectionInNode);
            if ( !saveable || !editable) return;
            let exTag = this.attr( editable, 'exTag');                
            // Clear editing classes
            this.clearClasses( saveable, 'editing edcontainer edinside');  
            this.clearClasses( editable, 'editing edcontainer edinside');  
            if (  exTag.indexOf( 'span') == 0 && !editable.classList.contains( 'caption')) { 
                // Setup styles for editing a span inside an element
                this.toggleClass( saveable, 'edcontainer');
                this.toggleClass( element, 'edinside');
            }
            //
            this.editor.editElement = saveable;
            // Display floatable menu
            if ( this.cursor.selectionInNode 
                && [ 'div.editzone'].indexOf( this.dom.attr( editable, 'exTag')) == -1
                && !editable.classList.contains( 'linetext')
            ) {
                // Display menu for a selection of text
                processed = this.contextualMenuOn( editable, this.cursor.selectionInNode);
            } else if ( !this.cursor.selectionMultiNode) {
                processed = this.contextualMenuOn( element);
            } else this.contextualMenuOff();
        }
        return processed;
    } // UDEclickHandler.displayMenu()

   /**
    * Display menu for non clicakable, collapsavle elements
    * @param {object} element The clicked element
    */
    displayMenuOnNonClickable( element) {
        let saveable = this.dom.getSaveableParent( element);
        if ( saveable.classList.contains( "collapsable")) {
            this.stopEditing();
            this.editor.editElement = saveable;
            this.contextualMenuOn( saveable);
            processed = true;
        }
    } 

   /**
    *  Emulate mobile screen navigation using mouse movements
    *  @param {object} e Event
    */
    emulateMobile ( e) {
        let processed = false;
        if ( this.emulateMobile) {
            // Follow mouse moves
            let me = this.editor;
            this.dom.topElement.addEventListener('mousemove', function (event) { me.pointEvent( event);});
            let x = e.clientX; // - Math.floor(rect.left);
            let y = e.clientY; // - Math.floor(rect.top);                
            this.editor.lastClickPosition.x = x;
            this.editor.lastClickPosition.y = y;
            processed = true;
        }
        return processed;
    } // UDEclickHandler.emulateMobile()

} // JS class UDEclickHandler

/**
 * AUTO TEST
 */
if ( typeof process == 'object') {
    // Running on node.js
    module.exports = { UDEclickHandler: UDEclickHandler};
    if ( typeof JSDOM == "undefined" && typeof window == "undefined")  {
        // Auto-test module
        // Setup test environment
        var envMod = require( '../../tests/testenv.js');
        envMod.load(); 
        //console.log( typeof global.JSDOM);
        // Test this module
        console.log( 'Syntax OK');
        console.log( 'Start of UDEclickHandler test program');
        ud = new UniversalDoc( 'document', true, 133);
        let handle = new UDEclickHandler( ud.ude);
        let test ="click";
        let el = $$$.dom.element( 'B010000000500000M');
        // This code is for nodejs iniEvent is deprecated for browsers not nodejs
        //let event = document.createEvent( 'Events'); //{ type:"click", target:el}        
        //event.initEvent( 'click', true, false);
        /* Browser code would be 
        let event = new Event( 'click');
        el.dispatchEvent( event);
        or $$$.clickOn( el);
        */      
        el.click();  
        let menu = $$$.dom.element( 'fmenu');
        let children = $$$.dom.children( menu);
        if ( children.length) console.log( test + " test: OK"); else console.log( test + " test:KO", menu);
        console.log( "Test completed");
        process.exit(0);
    }

} // End of test routine
