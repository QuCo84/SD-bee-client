/*
 * Encapsulate all calls to DOM in 2 classes
 *   DOM_cursor - manage cursor mouvements and cusor display, used (only) by DOM
 *   DOM - operations on the DOM
 */
class DOM_cursor {
	topElement = null; // cursor can't move outisde this element
	parent;
    dom;
	topHTMLoffset;
	HTMLelement;
	HTMLoffset;
	textElement;
	textOffset;
	selectionMultiNode = false;
	selectionInNode = false;
	focusElement;
	focusOffset;
	display;
	savedValues = [];
	outlineCurrentElementCSS = null;
	noIdTags = ['tr', 'td', 'th', 'tbody', 'thead', 'table', 'div', 'span', 'ul', 'ol', 'li'];
  
   /**
    * Cursor object has the following main properties :
	*   <li>HTMLelement   - The HTML element within which the caret is placed</li>
	*   <li>HTMLoffset    - The offset of the carte with the HTML's inner HTML</li>
	*   <li>textElement   - The child text element of HTML elemnt with the caret</li>
	*   <li>textOffset    - The offset of the caret within text element's text content</li>
	*   <li>selectionMultiNode - True if a selection spans mutiple elements</li>
	*   <li>selectionInNode - True if there is a selection of text within a single element</li> 
	*/
	constructor( topElement, parent) {
		// Initialise DOM_cursor object
		this.topElement = topElement;
		this.parent = parent;
        this.dom = parent;
		this.HTMLelement = null; // this.dom.element( '*', topElement);
		// debug( {level:5}, "cursor at ", window.getSelection(), document.selection);    
		// if CE caret = anchorNode and anchorOffset
	} // constructeur()
  
    getOrAddTextNode( htmlElement) {
        if ( !htmlElement) { return null;}
        let textNode = null; //htmlElement.childNodes[0];
        let children = htmlElement.childNodes;
        for ( let childi=0; childi < children.length; childi++) {
           if ( children[ childi].nodeType == Node.TEXT_NODE) { 
                textNode = children[ childi];
                break;
            }
        }
       if ( !textNode) {
           let txt = this.dom.attr( htmlElement, 'ude_place');
           textNode = document.createTextNode( (txt) ? txt : "");
           textNode = htmlElement.appendChild( textNode);
       } else if ( textNode.nodeType != Node.TEXT_NODE) { textNode = null;}
       return textNode;
   }
   /**
    * Update and return the cursor object with the anchor node
    * @api {JS} dom.cursor.fetch()
	* @apiGroup Cursor
    */	
	fetch()	{
		debug( {level:9, coverage:0}, "Fetching cursor");
        // Get cursor & selection info
		let sel = window.getSelection();        
		if (!sel.anchorNode) return this; // Do nothing if no selection anchor
		// Get HTML element as parent of anchor text node
		let element = sel.anchorNode.parentNode;
		if ( sel.anchorNode.nodeType != Node.TEXT_NODE) {
            element = sel.anchorNode;
            let active = document.activeElement;
            if ( active.tagName == "INPUT") {
                this.HTMLelement = active;
                this.HTMLOffset = 1;
                this.textElement = null;
                return this;
            }    
        }
		// Check element with saveable is saveable 
		let saveable = this.parent.getSaveableParent( element);
        let view = this.parent.getView( element);
        if ( !saveable && this.parent.attr( view, 'name') != "App") return this;
        if (saveable) {
        /*
            * Only keep track of cursor in UD's document element and certain tags
            * 2DO faster solution : find element in document.elemnts and also cache OK elements
            */        
            // Get extended tag of saveable and decide if all element tags are accepted
            let exTag = this.parent.attr( saveable, 'exTag');
            let controlTags = true;
            if ( [ 'div.zoneToFill', 'div.filledZone'].indexOf( exTag) > -1) controlTags = false;
            // Walk up DOM till id='document' checking elements have id 
            let walk = element;
            let safe = 20;
            while ( walk && ( !walk.id || walk.id != "document") && safe--) {
                if (walk == saveable) controlTags = false;
                if ( controlTags && !walk.id && this.noIdTags.indexOf( walk.tagName.toLowerCase()) == -1) return this;
                walk = walk.parentNode;
            }
            if ( !walk || walk.id != "document") return this;
        }    
		// Update cursor
		this.textElement = sel.anchorNode;
		this.textOffset = sel.anchorOffset;
		if ( sel.anchorNode.nodeType != Node.TEXT_NODE) {
            // Anchor node is not text
			this.textElement = this.getOrAddTextNode( element);
            let txt = this.textElement;
			this.HTMLelement = sel.anchorNode;
			this.HTMLoffset = this.computeHTMLoffset( txt.textContent, txt.textContent.length, element.innerHTML);
		} else {  
            // Anchor node is text
			this.HTMLelement = this.textElement.parentNode;
			// 2DO get children and loop to count HTMLoffset
            let children = this.HTMLelement.childNodes;
            let htmlOffset = 0;
            for ( let childi = 0; childi < children.length; childi++) {
                let child = children[ childi];
                if ( child == this.textElement) break;
                if ( child.nodeType == Node.TEXT_NODE) { htmlOffset += this.computeHTMLoffset( child.textContent, child.textContent.length);}
                else if ( child.nodeType == Node.ELEMENT_NODE) { htmlOffset += child.outerHTML.length;}
            }
			this.HTMLoffset = htmlOffset + this.computeHTMLoffset( this.textElement.textContent, this.textOffset);
		}
		// Detect selection
		this.selectionMultiNode = this.selectionInNode = false;
        let focusNode = sel.focusNode;
        if ( focusNode.nodeType != Node.TEXT_NODE) { focusNode = this.getOrAddTextNode( focusNode);}
        if ( !sel.isCollapsed && focusNode && this.textElement) { 
            this.focusElement = focusNode;
            this.focusOffset = sel.focusOffset;
           /*
            * !!! IMPORTANT Don't let selection overflow from editable element to non editable element
            */
            let anchorEditable = this.dom.attr( sel.anchorNode.parentNode, 'editable');
            let focusEditable = this.dom.attr( focusNode.parentNode, 'editable');
            if ( !anchorEditable || !focusEditable) {
                if ( !focusEditable) {
                    // Move focus to start of anchor node
                    focusNode = sel.anchorNode;
                    this.focusElement = focusNode;
                    this.focusOffset = 0;
                }                
            }
            if ( sel.anchorNode != focusNode) {               
                this.selectionMultiNode = true;
                // Ensure anchor is always displayed before focus
                let bound1 = this.textElement.parentNode.getBoundingClientRect();
                let bound2 = this.focusElement.parentNode.getBoundingClientRect();
                if ( bound1.y > bound2.y) {
                    // Switch
                    this.HTMLelement = this.focusElement.parentNode;
                    this.HTMLoffset = this.focusOffset; // Incorrect 
                    this.textElement = this.focusElement;
                    this.textOffset = this.focusOffset;
                    this.focusElement = sel.anchorNode;
                    this.focusOffset = sel.anchorOffset;
                }                
            } else if ( sel.anchorOffset != sel.focusOffset) { 
                this.selectionInNode = true;
                // Ensure textOffset is before focus.Offset
                if ( this.focusOffset < this.textOffset) {
                    this.textOffset = this.focusOffset;
                    this.focusOffset = sel.anchorOffset;
                }
            }    
        }
        // Update text version of cursor in DOM
		let cursorInfo = document.getElementById( 'UDEcursorInfo');
        let txt = "";
		if ( cursorInfo) {
			txt += "{";
			txt += "element: '"+this.dom.getSelector( this.HTMLelement)+"',";
			txt += "offset:"+ this.textOffset+",";
			txt += "tagName:"+this.HTMLelement.tagName+"," 
			txt += "classes:'"+ this.HTMLelement.classList+"'";
			txt +=  "selectionMultiNode:'"+this.selectionMultiNode+"'";
			txt +=  "selectionInNode:'"+this.selectionInNode+"'";      
			txt += "}"
			cursorInfo.textContent = txt;
		}
	    // Set outlining class on selected element (DEPRECTED with floating menu)
		if (this.outlineCurrentElementCSS) {
			this.parent.removeCSSfromAll( this.outlineCurrentElementCSS, this.topElement);
			this.HTMLelement.classList.add( this.outlineCurrentElementCSS);
		}
		debug( {level:8, coverage:'DOM_cursor.fetch'}, "Cursor info updated", txt);
		return this; 
  } // DOM_cursor.fetch()
    
   /**
    * Set cursor
    * @api {JS} dom.cursor.set()
	* @apiGroup Cursor
    */	
	set() {
    if ( !this.textElement) {
		// No text element set, so get first text element under HTML element
		if ( !this.HTMLelement) return false; // Do nothing if no HTML element set
		let walkElement = this.HTMLelement;
		let safe = 5;
		while ( walkElement && walkElement.nodeType != Node.TEXT_NODE && --safe) walkElement = walkElement.firstChild;
		if ( !walkElement || walkElement.nodeType != Node.TEXT_NODE) { return false;} // Do nothing if text element not found
	    this.textElement = walkElement;
		this.HTMLelement = walkElement.parentNode;
		this.textOffset = 0;
    }  
    if (this.textElement.createTextRange) 
    {
       let range = this.textElement.createTextRange();
       range.move('character', this.textOffset);
       range.select();
    } else if (this.textElement.selectionStart) {
       this.HTMLelement.focus();
       this.textElement.setSelectionRange(caretPos, caretPos);
    } else {
        let sel = window.getSelection();
        if (sel.rangeCount > 0) sel.removeAllRanges();
        let tbody = this.dom.getParentWithTag( this.HTMLelement, 'tbody');
        // If in scrollable container, move scroll to make visible
        if ( tbody) {
            let safe = 20;
            while ( !this.dom.isVisible( this.HTMLelement, 'tbody') && --safe) { tbody.scrollTop += 2;}
        }
        if ( this.HTMLelement && this.textElement) {
            this.HTMLelement.focus();
            let range = document.createRange(); // sel.getRangeAt(0);
            if ( this.textElement && typeof this.textElement.parentNode != "undefined" && this.textElement.parentNode) {
                    range.selectNode( this.textElement);
            }
            if ( this.textOffset > this.textElement.textContent.length) {
                debug( {level:4}, "DOM_cursor auto-correcting invalid textOffset", this.textElement, this.textOffset);
                this.textOffset = this.textElement.textContent.length;
            }    
            range.setStart( this.textElement, this.textOffset);
            // range.setEnd( this.textElement, this.textOffset);
            range.collapse( true);
            sel.addRange( range);   
        }       
    }
  } // DOM_cursor.set()
    
   /**
    * Clear cursor
    * @param {mixed} elementOrId An HTML elemnt or its Id
    */

    clear() {
        let sel = window.getSelection();
        sel.removeAllRanges();
    }
   /**
    * Set cursor in an element, choosing input or editable text child
    * @param {mixed} elementOrId An HTML elemnt or its Id
    */
    setAt( elementOrId, offset=0) {        
        let element = this.dom.element( elementOrId);
        if ( !element) return;
        let children = this.dom.childNodes( element).concat( this.dom.elements( "*", element)); // query * not getting text nodes
        let text = this.getOrAddTextNode( element);
        for ( let childi = 0; childi < children.length; childi++) {
            let child = children[ childi];
            if ( child.nodeType == Node.TEXT_NODE) { 
                text = child;
                break;
            } else if ( child.tagName.toLowerCase() == "input") { 
                child.focus();
                this.HTMLelement = child;
                child.setSelectionRange( offset, offset);
                return;
            } else  {
                if ( !text && this.dom.attr( child, "editable")) { 
                    let grandChildren = child.childNodes; 
                    for ( let gchildi = 0; gchildi < grandChildren.length; gchildi++) {
                        let gchild = grandChildren[ gchildi];
                        if ( gchild.nodeType == Node.TEXT_NODE) { 
                            text = gchild;
                            break;
                        }
                    }
                }
            }
        }
        if ( text) {
            this.textElement = text;
            this.HTMLelement = text.parentNode;
            if ( offset > this.textElement.textContent.length) { offset = this.textElement.textContent.length;}
            this.HTMLoffset = this.computeHTMLoffset( this.textElement.textContent, offset, this.HTMLelement.innerHTML);        
            this.textOffset = offset;
            if ( this.HTMLelement && this.textElement) this.set();
        } else { this.set();}
        return this;
    } // DOM_cursor.setAt()
  
  save( index=-1) {
    if ( !this.HTMLelement || this.HTMLelement.nodeType != Node.ELEMENT_NODE) return -1;
    if ( index == "") index = -1;
    else if ( typeof index == "string") index = parseInt( index);
    // Build cursor entry
    let save = {};
    save.scroll = this.dom.element( 'scroll').scrollTop;
    save.free = false;
    if ( this.HTMLelement && this.HTMLelement.nodeType == Node.ELEMENT_NODE) {
        let selector = this.dom.getSelector( this.HTMLelement); // debug
        if ( !selector) return index;
        save.HTMLelementId = convertToObject( selector); //.id;
        save.HTMLoffset = this.HTMLoffset;
        let children = this.HTMLelement.childNodes;
        save.textElementIndex = 0;
        for ( let i=0; i<children.length; i++)
          if ( children[i] == this.textElement) save.textElementIndex = i;
        save.textOffset = this.textOffset;
    }
    if ( index == -1) {
        for ( let stacki=this.savedValues-1; stacki >=0; stacki--) { 
            if ( this.savedValues[ stacki].free) {
                index = stacki+1;
                break;
            }
        }
        if ( index == -1) {
            this.savedValues.push( save);
            index = this.savedValues.length;
        }
    }
    this.savedValues[ index - 1] = save;
    debug( {level:4}, "Saved cursor", save, index);
    return index; // 2DO stack position
  } // DOM_cursor.save()
  
  restore( n, keep = false)
  {
    debug( {level:4}, "Restoring cursor");
    if ( typeof n == "undefined") n = this.savedValues.length;
    else if ( typeof index == "string") index = parseInt( index);
    if ( n == "" || n <= 0) return;
    let saved = this.savedValues[ n - 1];
    if ( !keep) { saved.free = true;}
    // Restore scroll
    if ( saved.scroll) { this.dom.element( 'scroll').scrollTop = saved.scroll;}        
    if (typeof saved.HTMLelementId == "undefined" || saved.HTMLelementId == "" ) return false;    
    this.HTMLelement = this.dom.element( saved.HTMLelementId); //document.getElementById( this.savedValues.HTMLelementId);
    if (!this.HTMLelement)
    {
      debug( {level: 3}, "Cursor can't restore", saved.HTMLelementId);
      return;
    }
    this.HTMLoffset = saved.HTMLoffset;
    let children = this.HTMLelement.childNodes;
    this.textElement = this.HTMLelement.childNodes[saved.textElementIndex];
    this.textOffset = saved.textOffset;
    debug( {level:4}, "Restored cursor", this.savedValues, this.HTMLelement, this.textElement, this.textOffset);
    this.set();
    return true;
  } // DOM_cursor.restore()
  
    savedCursorAsString( n) {
        let saved = this.savedValues[ n - 1];
        return JSON.stringify( saved);
    }
  
  
  setCurrentCursorPosition(chars) 
  {
    if (chars >= 0) {
        var selection = window.getSelection();
        let range = createRange(document.getElementById("test").parentNode, { count: chars });
        if (range) {
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
  } // DOM_cursor.set()
  
  computeHTMLoffset( text, textOffset, html="") {
        let work = text.substr( 0, textOffset)+"__MARKER__";
        let workDiv = document.createElement( 'div');
        workDiv.textContent = work;
        let htmlOffset = workDiv.innerHTML.indexOf( "__MARKER__");
        if ( html) { htmlOffset += html.indexOf( text);}
        return htmlOffset;
  }
      
   /**
    * Get selected HTML
    */
    getSelectedText( del = false) {
        // Get selecton pointers
        let startElement = this.textElement;
        let endElement = this.focusElement; // 2DO check if these are textElements
        let startOffset = this.computeHTMLoffset( startElement.textContent, this.textOffset);
        let endOffset = this.computeHTMLoffset( endElement.textContent, this.focusOffset);
        
        // Loop to extract
        let walkElement = startElement;
        let safe = 1000;
        // 2DO undecorate() and getHTMLoffset
        let text = walkElement.textContent.substring( startOffset);
        if ( startElement == endElement) { text = walkElement.textContent.substring( startOffset, endOffset)}
        let toDel = [];
        if ( del) {
            if ( startOffset == 0) { toDel.push( walkElement);}
            else { walkElement.textContent = walkElement.textContent.substring( 0, startOffset);}
        }
        while ( walkElement && walkElement != endElement && safe--)
        {
            // Next element
            walkElement = walkElement.nextSibling;            
            if ( walkElement == endElement)
            {
                text += walkElement.textContent.substring( 0, endOffset);
                if (del) {
                    if ( cursor.focusOffset < walkElement.textContent.length) {
                        walkElement.textContent = walkElement.textContent.substring( endOffset);
                    } else { toDel.push( walkElement);}
                }    
            } else {
                text += walkElement.textContent;
                if ( del) { toDel.push( walkElement);}                    
            }    
                            
        }
        // Delete elements marked for delete
        for ( let deli = 0; deli < toDel.length; deli++) { toDel[ deli].remove();}
        return text;
    } // DOM_cursor.getSelection()
  
} // class DOM_cursor

if ( typeof process == 'object') {    
    // Running on node.js
    module.exports = { DOM_cursor:DOM_cursor};
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined") {
        console.log( "Syntax : OK");
        console.log( "Test completed");
    }
}