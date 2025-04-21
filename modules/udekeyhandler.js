/**
 * udekeyhandler.js - handler of key events for UD editor
 * Copyright (C) 2023  Quentin CORNWELL
 *  
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
/**
 * PROJECT UNDER DEV
 */
class UDEkeyHandler {
    
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
        this.topElement.addEventListener('keypress', function (event) { me.event( event);});
        this.topElement.addEventListener('keydown', function (event) { me.event( event);});
        this.topElement.addEventListener('keyup', function (event) { me.event( event);});
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
    * Handle keyboard events
    * @param {object} e The keyboard event
    * @return {boolean} True if processed
    */
    event( e) {
        let processed = false;
        let element = this.cursor.fetch().HTMLelement;
        if ( element && element.id && element.id.indexOf( '_TMP') == 0) return false;
        let textElement = this.cursor.textElement;
        debug( { level:6}, "Key " + e.key, e, element);
        if ( !element || this.editor.menuManager.click( element)) return false;
        let exTag = this.dom.attr( element, 'exTag');
        let saveable = this.dom.getSaveableParent( element);
        let displayable = this.dom.getDisplayableParent( element);        
        // In some cases events on invisible elements are coming here, we have to filter
        if ( !this.testing && !this.dom.isInViewport( element)) return false;
        // Detect virtual keyboard and force stage editing if virtuel
        this.detectVirtualKeyboard( e.type);
        // Ignore false keys
        // if ( typeof e.key == "undefined" || ["Shift", "Control","Alt"].indexOf(e.key) > -1) return false;
        // Process real key  
        let key = e.key;
        if ( e.ctrlKey) { 
            key += "_ctrl";
            if ( e.shiftKey) { key += "_shift";}
        }
        let editEvent = "";   
        // Key specific processing     
        switch( key) {            
            case "Escape" :       
                // Abandon current operation
                // 2DO 2stageEditing( key) all the time like command line manager
                if (   this.leave2stageEditing( false) || this.inlineCommandManager( key)) processed = true;
                this.dom.cursor.clear();
                // else Let module have it        
                break;
            case "Backspace":
            case "Delete":
                if ( exTag == "input")  break;
                let elem = element;            
                if ( e.type == "keydown" || e.type == "keypress" ) {
                    // Delete selected text and merge if required
                    this.delEvent( element, key, cursor);                    
                }
                processed = true;
                break;
                
            case "Enter" : case "Enter_shift" :
            case "\n" :
            case "\r" :
                if ( element.tagName.toLowerCase() == "input") { break;}
                if ( !this.dom.isEditable( element)) { processed = true; break;}
                // TEST bug with 2-stage editing solved by use keyup rather than keydown UNCLEAR WHY
                if ( e.type == "keydown" || e.type == "keypress") { e.preventDefault(); break;}
                let ev = { event:"newline", type:"newline", HTMLoffset:this.dom.cursor.HTMLoffset};
                if ( e.shiftKey) {
                    // Insert <br> in current HTML element
                    // Prepare BR element
                    let newLine = document.createElement( 'br');
                    let newText = document.createTextNode( '...');
                    // Get current text element & offset
                    let textEl = this.dom.cursor.textElement;
                    let textOffset = this.dom.cursor.textOffset;
                    let currentText = textEl.textContent;
                    if ( textOffset < currentText.length) {
                        // Split existing text element
                        newText.textContent = currentText.substr( textOffset);
                        textEl.textContent = currentText.substr( 0, textOffset);
                    }
                    // Insert new BR and text element
                    let siblings = Array.from( element.childNodes);
                    let textIndex = siblings.indexOf( textEl);
                    if ( textIndex < 0) break;
                    textIndex++;
                    if ( textIndex >= siblings.length) {
                        element.appendChild( newLine);
                        element.appendChild( newText);
                    } else {
                        element.insertBefore( newLine, siblings[ textIndex]); 
                        element.insertBefore( newText, siblings[ textIndex]); 
                    }
                    this.dom.cursor.textElement = newText;
                    this.dom.cursor.textOffset = 0;
                    this.dom.cursor.set();
                    this.setChanged( element);
                    processed = true;
                    // processed = ( this.dom.insertElementAtCursor('br', "") != null);
                } else  if ( 
                    !( processed = this.leave2stageEditing( true))
                    && ( element.classList.contains('caption')  // Captions handled here
                         || !( processed = this.dispatchEvent( ev, element))) 
                ) processed = this.editEventDefault( ev, element);
                break;   
            case "Tab" :
                if ( e.type == "keyup") { processed = true; break;}  
                // 2DO dispatchEvent "next" or "previous" and move to udetable
                let cursorTo = null;
                switch ( exTag) {
                    case 'th' :
                    case 'td':
                        // 2DO if shift inverse, if ctrl insertColumn event
                        if ( e.shiftKey) {
                            if ( element.previousSibling) cursorTo = element.previousSibling;
                            else {
                                // Go to previoust row
                                let row = element.parentNode;
                                if ( row) row = row.previousSibling;
                                if (row)  cursorTo = row.cells[ row.cells.length-1];
                            } 
                        } else {
                            if ( element.nextSibling) cursorTo = element.nextSibling;
                            else if ( exTag == "th") editEvent = "insert column"; 
                            else {
                                // Go to next row
                                let row = element.parentNode;
                                if ( row) row = row.nextSibling;
                                if (!row) editEvent = "newline";
                                else  cursorTo = row.cells[0];
                            } 
                        }
                        // Set cursor
                        if ( cursorTo) {
                            this.dom.cursor.setAt( cursorTo);
                            this.leave2stageEditing( true);
                            this.requires2stageEditing( cursorTo);
                            processed = true;
                        } else if ( editEvent) { 
                            if ( this.dispatchEvent( {event:editEvent, saveable:saveable, displayable:displayable}, element)) processed = true;
                            else processed = this.editEventDefault( { type:editEvent, textEl:textElement}, element);
                        }
                        break; 
                }
                break;
            //case "Tab_ctrl"
            case "Insert" :
            case "Shift":
                processed = true;
                break;            
            case "c_ctrl" : case "C_ctrl" : case "c_ctrl_shift" : case "C_ctrl_shift" :
                //processed = this.dispatchEvent( { event:"copy", type:"copy"}, element);
                //break;            
           case "v_ctrl" : case "V_ctrl" : case "v_ctrl_shift" : case "V_ctrl_shift" :
                //let data = window.clipboardData.getData('text/plain');
                //let html = window.clipboardData.getData('text/html');
                //if ( !e.shiftKey && html) { data = html;}
                //processed = this.dispatchEvent( { event:"paste", type:"paste", data:data}, element);
                //break;            
            case "x_ctrl" : case "X_ctrl" : case "x_ctrl_shift" : case "X_ctrl_shift" :
                //processed = this.dispatchEvent( { event:"cut", type:"cut"}, element);
                // processed = true;
                if ( e.type != "keydown") processed = true;
                break;            
            case "shift": case "Shift" : case "shift_shift" : case "Shift_shift" :
            case "control": case "Control" : case "Control_ctrl" : case "control_ctrl" :
            case "altGraph" : case "AltGraph" :
                processed = true;
                break;
            case "ArrowLeft" :
                if ( this.editingElement == element) {
                    if ( this.dom.cursor.textOffset <= 0) {
                        this.leave2stageEditing( true);
                        element = element.previousSibling;
                        if ( element) {
                            /*this.dom.cursor.HTMLelement = element;
                            this.dom.cursor.textElement = element.firstChild;
                            this.dom.cursor.textOffset = element.firstChild.textContent.length-1;*/
                            this.dom.cursor.setAt( element, 10000);
                            this.requires2stageEditing( element);
                        }
                    }
                    break;
                }    
                // 2DO better if element is inside menuManagerBox box  
                if ( 
                    element.classList.contains( 'objectName')
                    && this.dom.cursor.textOffset == 0  
                ) {
                    // Drown event 
                    processed = true;
                    break;
                }  
            case "ArrowRight" :
                if ( this.editingElement == element) {
                    if ( this.dom.cursor.textOffset >= (element.textContent.length - 1)) {
                        this.leave2stageEditing( true);
                        element = element.nextSibling;
                        if ( element) {
                            /*
                            this.dom.cursor.HTMLelement = element;
                            this.dom.cursor.textElement = element.firstChild;
                            this.dom.cursor.textOffset = 0;
                            this.dom.cursor.HTMLoffset = 0;
                            */
                            this.dom.cursor.setAt( element, 0);
                            this.requires2stageEditing( element);
                        }
                    }
                    break;
                }    
                // 2DO regroup Left & right, leaveStageEditing & always processed if in menuBox
                if ( 
                    key == "ArrowRight"
                    && element.classList.contains( 'objectName')
                    && this.dom.cursor.textOffset == element.textContent.length
                ) {
                    // Drown event 
                    processed = true;
                    break;
                }              
            case "ArrowUp" :
            case "ArrowDown" :
                this.leave2stageEditing( true);            
                if (e.type == "keyup" && !this.menuManager.box && !this.floaterActionPending) {
                    processed = this.edit(); // Setup editing on element at cursor
                } else {
                    let arrowEvent = { event:key, type:key, saveable:saveable, displayable:displayable};
                    processed = this.dispatchEvent( arrowEvent, element);                    
                    if ( processed) {
                        element = this.dom.cursor.fetch().HTMLelement;
                        this.requires2stageEditing( element);
                    }
                }
                break;
            case "PageUp" :
            case "PageDown" :
                if (e.type == "keyup" && !this.menuManager.box && !this.floaterActionPending) {
                    let step = 5;
                    let page = saveable.parentNode;
                    if ( this.dom.attr( page, 'exTag') == "div.page") {
                        if ( key == "PageDown") { page = page.nextSibling.nextSibling;}
                        else { page = page.previousSibling.previousSibling;}
                        let first = page.childNodes[ 0];
                        if ( first) { 
                            this.dom.cursor.setAt( first);
                            this.dom.makeVisible( first);
                        }
                    }
                    processed = true;
                    // processed = this.edit(); // Setup editing on element at cursor
                }
                break; 
            // case "<":, case ">" : 
            case "Unidentified" :
            default :
                // console.log( key);
                if ( exTag == "input") {
                    // Input element - check key is accepted, filter if not
                    let charFilter = this.dom.attr( element, 'ude_accept');
                    let validateExpr = charFilter.replace( /this/g, key);
                    if ( validateExpr && !this.calc.eval( validateExpr)) { processed = true;}
                } else if ( this.inlineCommandManager( key)) {
                    // Inline commands
                    e.preventDefault();
                } else {
                    if ( !this.editingElement) {                    
                        // Enter 2 stage editing if required or just mark as changed
                        if ( key == "Unidentified" || !this.requires2stageEditing( element)) {
                            // Update Rollback function
                            if ( window.rollbacker) window.rollbacker.inputEvent( {event:"change", content:element.innerHTML}, element);            
                            
                            // Mark element as modified
                            if ( (this.lastChangeElement && element != this.lastChangeElement) || [ ";"].indexOf( key) > -1 ) {
                                if ( this.dom.getParentAttribute( "", "ude_autosave", element) != "off") {
                                    this.setChanged( element);
                                } else {
                                    saveable.classList.add( 'modified');
                                }
                                this.lastChangeElement = null;
                            }
                            this.lastChangeElement = element;
                            this.lastChangeTicks = this.ticks;
                        }
                        if ( element.tagName == "P" && element.classList.contains( "undefined") && element.textContent.length > 20) {
                            element.classList.remove( "undefined");
                            element.classList.add( "standard");
                            this.dataSource.viewEvent( "changeTag", element); // recompute id
                        }
                    }                
                    // Event 
                    this.lastChar = key;      
                    if ( this.hasDefaultContent( element)) {
                        if ( key == "Unidentified") {
                            element.innerHTML = "";
                        } else {
                            element.innerHTML = key;
                            this.dom.cursor.textElement = element.firstChild;
                            this.dom.cursor.textOffset = 1;
                            this.dom.cursor.HTMLoffset = 1;
                            this.dom.cursor.set();
                            processed = true;
                        }
                        //if ( element.classList.contains( 'undefined')) this.changeTag( 'p', element.id);
                        //element.classList.remove( 'initialcontent');
                    }   
                }
                break; 
        }
        if ( processed) {
            debug( { level:6}, "Stopping propagation");
            this.ignoreKeyup = true;
            e.preventDefault();
            if ( typeof e.stopPropagation != "undefined") e.stopPropagation();
            if ( saveable && this.menuManager) this.menuManager.updatePosition( saveable);
            if ( !this.is2stageEditing( element)) { // && window.rollbacker) 
                // $$$.rollbackEvent()
                if ( window.rollbacker) window.rollbacker.inputEvent( {event:"change", content:element.innerHTML}, element); 
                this.setChanged( element); 
            }
        }
        return processed;
    }

    /**
    * Force stage editing if virtual keyboard is being used
    */
    detectVirtualKeyboard( keyEventType) {
    if ( keyEventType == "keydown") this.keyDownTime = new Date().getTime();
    if ( keyEventType == "keyup") {
        this.keyUpTime = new Date().getTime();
        let keybTime = this.keyUpTime - this.keyDownTime;
        this.averageKeyboardTime = Math.round( this.averageKeyboardTime + ( keybTime - this.averageKeyboardTime)/2);
        if ( keybTime < this.averageKeyboardTime) {
            debug( {level:5}, "New record keyboard time !: ",keybTime, this.averageKeyboardTime);
        }
        if ( this.averageKeyboardTime < this.virtualKeyboardMaxTime) this.forceStagedEditing = true;
        else this.forceStagedEditing = false;
    }        

    insert( element, key, cursor) {

    }
    /**
    * Character deletion
    */ 
    delEvent( element, key, cursor) {
        if ( exTag == "input")  break;
        let placeholder = API.getEditorAttr( element, 'ude_place');        
        this.ignoreKeyup = false;
        // Get selected text
        if ( cursor.selectionMultiNode) {
            // Multiple elements selected - let browser process and indicate element has changed afterwards
            let saveable = this.dom.getSaveableParent( element);
            setTimeout( function() { window.ud.ude.dispatchEvent( { event:"change", multinode:"true"}, element);}, 100);
        } else {
            // Handle deletion here so we can if merging is required
            if ( cursor.selectionInNode) {
                // Delete selection
                // 2DO Make HTML friendly
                if ( cursor.textElement) { 
                    let textEl = cursor.textElement;
                    let text = textEl.textContent;
                    let selStart = cursor.textOffset;
                    let selEnd = cursor.focusOffset;
                    textEl.textContent = text.substr( 0, cursor.textOffset) + text.substr( cursor.focusOffset);
                }
                cursor.selectionInNode = false;                    
            } else {
                // Delete single character       
                textEl.textContent = text.substr( 0, cursor.textOffset) + text.substr( cursor.textOffset + 1);
            }                
            cursor.set();
            if ( this.is2stageEditing( element)) {
                // 2-stage editing - force cursor to stay in same element
                if ( element.textContent && cursor.textOffset <= 1) {
                    element.textContent = element.textContent.substring( 1);
                    cursor.textElement = element.childNodes[0];                    
                    cursor.set();
                }          
            } else {
                // Inline editing - trigger element merging event if necessary
                let textElement = this.dom.cursor.textElement;
                let text = (textElement) ? textElement.textContent : "";
                if ( this.dom.cursor.textOffset == 0 && key == "Backspace") {
                    // Backspace on 1st character = merge up edit event        
                    editEvent = "merge up";
                } else if ( this.dom.cursor.textOffset == text.length && key == "Delete") {
                    // Delete on last character = merge down edit event
                    editEvent = "merge down";
                } else if ( element.innerHTML == "" || element.innerHTML == "<br>") {                    
                    // Delete last character = remove edit event
                    editEvent = "remove";
                }
                // Remove placeholder text before merging
                let contentToMerge = element.innerHTML;
                let placeholder = API.getEditorAttr( element, 'ude_place');//this.dom.attr( element, 'ude_place');
                if ( placeholder && contentToMerge == placeholder) { this.dom.cursor.textElement.textContent = "";}
                // Process edit event
                if ( editEvent) { 
                    // Give editor module a chance to process then default handler
                    if ( this.dispatchEvent( {event:editEvent, saveable:saveable, displayable:displayable}, element)) processed = true;
                    else this.editEventDefault( { type:editEvent, textEl:textElement}, element);
                }
            }
            processed = true;
            // Rollback hook
            //$$$.rollbackEvent();
            if ( !this.is2stageEditing( element) && window.rollbacker) 
                window.rollbacker.inputEvent( {event:"change", content:element.innerHTML}, element); 
        }
    }    

    navigate( element, key, cursor) {

    }

} // UDEkeyHandler