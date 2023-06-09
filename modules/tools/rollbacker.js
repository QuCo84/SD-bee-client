/**
 * rollbacker.js
 *   Tool for rollbacking and redoing document modifications
 *   The module is informed of all changes on the documents. It saves the element, before change, in the UD_rollback
 *   zone, associated with a timestamp. The rollback method then dpositions the currentState pointer on the previous
 *   saved state and restores the elements. 
 *  
 * 2020-04-19 - creation
 */
 
 
 class Rollbacker
 {
    // Parameters
    maxChangeTime = 50;
    stackId = "UD_rollback";
    // Variables
    ud;
    ude;
    dom;
    cursor;
    currentStateIndex;
    displayElement;
    stack = null;
    stackPointer = -1;
       
    constructor( ud, displayId)
    {
        this.ud = ud;
        if (ud)
        {
            this.ude = ud.ude;
            this.dom = ud.dom;
            this.cursor = ud.dom.cursor;
            this.calc = ud.ude.calc;
        }
        this.displayElement = document.getElementById( displayId);
        this.stack = document.getElementById( this.stackId);
        window.rollbacker = this;
    }
    
    // UD event handler
    event( eventName)
    {
        switch (eventName)
        {
            case "open" :
              //$LF->onload("requestEditor('setAttribute', 'outlineCurrentElementCSS', 'StylerTool_outline');");
              this.displayControl();
              // this.displayStack();
              break;
        }
    } // Rollbacker.event()
    
    // Handle events from UDE-view
    inputEvent( e, element)
    {
        var processed = false;
        // FInd saveable element
        let saveable = this.dom.getSaveableParent( element);
        if ( !saveable) 
        {
            let binded = this.dom.parentAttr( element, 'ude_bind');
            if ( binded) saveable = this.dom.element( binded);
        }
        if (!saveable) return debug( {level:3, return:false}, "Can't rollback un saveable elements", element);
        
        let event = e.event;
        // Get last stack item
        let last = null;
        let stackItems  = this.stack.childNodes;
        if ( stackItems.length) last = stackItems[ this.stackPointer];
        let stackItem = null;
        if ( 
            !last
            || saveable.id != last.id.split('_')[2]
            || ( this.ude.ticks - this.dom.attr( last, 'RB_time')) > this.maxChangeTime
        ) {    
            while ( ++this.stackPointer < stackItems.length) {
                // Clean up stack Redo 
                stackItems[ this.stackPointer].remove();
                /*
                stackItem.innerHTML = saveable.innerHTML;
                stackItem.className = saveable.className;
                stackItem.id = "_COPY_"+saveable.id+"_"+this.stackPointer;*/
            } 
            {
                // Add new stack entry
                stackItem = saveable.cloneNode( true);
                this.dom.attr( stackItem, 'name', "__CLEAR__"); // to avoid name exists
                if ( typeof e.content != "undefined") stackItem.innerHTML = e.content;
                stackItem.id = "_COPY_"+stackItem.id+"_"+stackItems.length;
                this.stack.appendChild( stackItem);
                this.stackPointer = this.stack.childNodes.length - 1;
            }                
        } else {
            stackItem = last;
            stackItem.innerHTML = saveable.innerHTML;
            // copy content
        }   
        // if stack already has item then remove
        let action = "change";      
        // if element is new action = remove
        this.dom.attr( stackItem, 'RB_time', this.ude.ticks);
        this.dom.attr( stackItem, 'RB_action', action);
        //this.stackPointer++;        
        return processed;        
    } // Rollback.inputEvent()
    
    // rollback()
    rollback()
    {
        let stackItems = this.stack.childNodes;
        if ( this.stackPointer >= stackItems.length) return;
        let stackItem = stackItems[ this.stackPointer -1];
        let action = this.dom.attr( stackItem, 'RB_action');
        let item  = stackItem;
        switch( action)
        {
            case "change" :
                // copy content, class and 
                let targetId = item.id.split('_')[2];
                // let targetId = item.id.replace('_COPY_', '');
                let target = this.dom.element( targetId);
                if ( target)
                {                    
                    target.innerHTML = item.innerHTML;
                    target.className = item.className;                    
                    //this.ide.initialiseElement( targetId);
                    this.ud.viewEvent( "change", target);
                }                
                break;
            case "restore" :
                // remove exsiting, attach stacked
                break;
            case "remove" :
                // remove existing
                // break;
        }
        if ( this.stackPointer) this.stackPointer--;
        // stackItem.remove();
    } // Rollback.rollback()
    
    // Display control
    displayControl()
    {
        // Clear display zone
        this.displayElement.innerHTML = "";
        // Prepare link
        let rollback_a = document.createElement('a');
        rollback_a.setAttribute( 'onclick', "window.rollbacker.rollback();");
        rollback_a.setAttribute( 'href', "javascript:");
        // Prepare icon
        let rollback_img = document.createElement('img');
        rollback_img.src = "/upload/XMGmRM7Ne_rollback.png";
        rollback_a.appendChild( rollback_img);
        this.displayElement.appendChild( rollback_a);        
        
    } // Rollbacker.displayControl()
    
 } // End of JS class Rollbacker
 
if ( typeof process != 'object') {
   // define( function() { return { class : Rollbacker, src: document.currentScript.src};});  
} else {    
    // Testing under node.js
    if ( typeof exports === 'object') module.exports = { class: Rollbacker};
    else window.Rollbacker = Rollbacker;
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined")
    {
        console.log( 'rollbacker.js Syntax:OK');
        //console.log ('Clipboard JS class test');
        console.log( 'Test completed');
    }        
} // End of test routine