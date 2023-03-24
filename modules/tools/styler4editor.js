/* *****************************************************************************************
 * styler4editor.js
 *   Tool for setting styles
 *
 * 2020-3-04 - creation
 */
 
 
 class Styler
 {
    ud;
    ude;
    dom;
    cursor;
    calc;
    displayElement;
    classList;
    clearStrList = '';
    tag;
    attachToTag = [ "graphicStyle", "textContent", "drawstyle", "zone", "selection"];
     
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
        window.styler = this;
        // Load css calc
        if ( !this.calc.cssCalc && typeof UDEcalc_css != "undefined") {
            // this.ude.loadScript( "ude-view/udecalc_css.js", "window.ud.ude.calc.cssCalc = new UDEcalc_css( window.ud.ude.calc);");
            this.calc.cssCalc = new UDEcalc_css( window.ud.ude.calc);
        }
    }
    
    event( eventName)
    {
        switch (eventName)
        {
            case "open" :
              //$LF->onload("requestEditor('setAttribute', 'outlineCurrentElementCSS', 'StylerTool_outline');");
              this.displayStyles();
              break;
        }
    } // Styler.event()
    
    // Return a p html string with list of classes for element of type this.tag
    listStyles( classList, elementId)
    {
        var display = "";
        if( classList.length && classList[0] != "")  
        {
            // Offset for class Index
            var indexOffset = this.classList.length - classList.length;
            // Display available classes for cursor element
            display += "<p>Available styles for "+this.tag+"<br>";            
            display += '<ul>';
            for( var i=0; i < classList.length; i++)
            {
                var onclick = "window.styler.changeStyle( '"+(i+indexOffset)+"', this.getAttribute( 'ude_p1'));";
                display += '<li><a href="javascript:" onclick="'+onclick+'", ude_p1="'+elementId+'">';
                display += classList[i];
                display += '</a></li>';
            }  
            display += '</ul>';
            display += '</p>';
        }
        return display;
    } // Styler.listStyles()
    
    // Display styles for current element or selection and its parents
    displayStyles()
    {
        // Get current selection
        let selection = null;
        if ( this.cursor.selectionInNode) selection = { start: this.cursor.textOffset, end: this.cursor.focusOffset};
        // Get current
        let current = this.cursor.HTMLelement;
        if (!current) return;
        // Get extended tag
        let tag = current.tagName.toLowerCase();
        if ( this.dom.attr( current, 'ud_type') != "")
        {
            tag += '.' + this.dom.attr( current, 'ud_type');
            this.tag = this.dom.attr( current, 'ud_type');
        }
        else
        {            
            // Obsolete ?
            let classes = current.classList;
            for (var i=0; i < classes.length; i++)
                if ( this.attachToTag.indexOf( classes.item(i)) > -1)  tag += '.'+classes.item(i);
        }    
        if ( selection) tag = "span.selection";
        // Current typed element classes
        let classListStr = this.calc.exec( "classesByTag( '"+tag+"')");
        let classList = classListStr.split(",");
        let display = "";        
        this.classList = classList;
        this.tag = tag;
        if ( selection) display += this.listStyles( classList, current.id+".selection");
        else display += this.listStyles( classList, current.id);
        this.clearStrList = classListStr;
        // Current untyped element classes
        // 2DO
        // Typed parent element classes
        let parent = current.parentNode;
        if ( selection) parent = current;
        while ( parent && parent.id && parent.id !="document")
        {
            tag = parent.tagName.toLowerCase();
            this.tag = tag;
            if ( this.dom.attr( parent, 'ud_type') != "")
            {
                // Parent is typed so add styles for this exTag
                tag += '.' + this.dom.attr( parent, 'ud_type');
                this.tag = this.dom.attr( parent, 'ud_type');
            }
            classList = this.calc.exec( "classesByTag( '"+tag+"')").split(",");
            this.classList = this.classList.concat( classList);  
            display += this.listStyles( classList, parent.id);    
            // Next parent
            parent = parent.parentNode;
        }
        classList = this.calc.exec( "classesByTag( '#document')").split(","); 
        this.classList = this.classList.concat( classList);         
        this.tag = "document";        
        display += this.listStyles( classList, 'document');   
        // Tag change
        this.displayElement.innerHTML = display;   
    } // Styler.displayStyles()
    
    // Display available tag changes
    displayTags( currentTag)
    {
    } // Styler.displayTags()
    
    // Change an element's class to an indexed class
    changeStyle( classIndex, elementId="")
    {
        // Parameter check
        if ( typeof classIndex == "string") classIndex = parseInt( classIndex);
        if (!elementId) elementId = this.cursor.HTMLelement.id;
        if (!elementId || isNaN( classIndex)) return debug( { level:2}, "Index not a number or no cursor element", classIndex);
        // Detect selection
        let selection = false;
        if ( elementId.indexOf( '.selection') > -1)
        {
            selection = true;
            elementId = elementId.replace( '.selection', '');
        }
        // Get requested class name
        let className = this.classList[ classIndex];
        if ( selection) // or span and elementId is not a span
        {
            // Change of style concerns a selection within an element
            // ATTENTION direct DOM access. Fct to do for DOM class
            // Check cursor is set
            selection = { start: this.cursor.textOffset, end: this.cursor.focusOffset, textNode: this.cursor.textElement};            
            // Split and insert a span
            let text = selection.textNode.textContent;
            let spanText = text.substring( selection.start, selection.end);
            selection.textNode.textContent = text.substring( 0, selection.start)+text.substring( selection.end);
            let span = this.dom.insertElementAtCursor( 'span', spanText, { class: "selection "+className});
            this.ud.viewEvent( "change", elementId);
        }
        else
        {
            // Build list of classes to clear 
            /*
            let len = this.classList.length;
            let clearList = [];
            // Pass 1 find common part, Pass 2 remove un common parts
            for ( var i=0; i < len; i++) 
                if ( this.classList[i] != "") clearList.push( this.classList[i]);
            */
            /*{    
                  let clasW = this.classList.item( i).split('.');
                clearStrList.push( clasW[ clasW.length -1]);
            }*/
            //let clearStrList = clearList.join( ',');       
            // Change style via API
            this.ude.changeClass( className, elementId, this.clearStrList); // or API.changeClass
            /*
            var apiRequest ={ caller:'Styler', command:'changeClass(/'+className+'/,/'+elementId+'/, /'+this.clearStrList+'/);', quotes:'//'};
            new UDapiRequest( apiRequest);
            */
        }
        return true;
    } // Styler.changeStyle()
  
 } // JS class Styler
 
if ( typeof process != 'object') {
    // define( function() { return { class : Styler, src: document.currentScript.src};});  
} else { 
    // Testing under node.js
    if ( typeof exports === 'object') module.exports = { class : Styler};
    else window.Styler = Styler;    
    //console.log( typeof global.JSDOM);
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined")
    {
        // Test this module
        console.log( 'Syntax OK');        
        console.log( "Test completed");
    }
    /*
    else
    {
        window.DOM = DOM;
    }
    */
} // End of nodejs stuff
