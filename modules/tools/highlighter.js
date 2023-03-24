/**
 * highlighter.js
 *   Tool for searching text in a web page and highlighting it.
 *   Designed to work with the UniversalDocEditor.
 *
 * 2020-04-20 - creation
 */
 
 
 class Highlighter
 {
    // Parameters
    cleanContentAttr = "ud_content";             // Attribute to use for pre-save function
    prepareDisplayAttr = "ud_display";          // Attribute to use for post-fetch function

    // Variables
    ud;
    ude;
    dom;
    cursor;
    displayId;
    displayElement = null;
       
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
        this.displayId = displayId;
        this.displayElement = document.getElementById( displayId);
        // Publish
        window.highlighter = this;
    }
    
    // UD event handler - load, open, close
    event( eventName)
    {
        switch (eventName)
        {
            case "open" :
                //$LF->onload("requestEditor('setAttribute', 'outlineCurrentElementCSS', 'StylerTool_outline');");
                this.displayHighlighters();
                // this.displayStack();
                break;
            case "saveElement" :
                // Remove temporary spams
                break;
        }
    } // Highlighter.event()
    
    // UDE-view event handler - 
    inputEvent( e, element)
    {
        var processed = false;
        return processed;        
    } // Highlighter.inputEvent()
    
   /**
    * Interface
    */
    displayHighlighters()
    {
        if ( !this.displayElement) return false;
        // Clear display
        this.displayElement.innerHTML = "";
        // Pen 1 - standard
        this.displayHighlighter( '/upload/N210k0r2m_HLpen1.png', 'HL_standard', 'background-color:#ffff00;');
        
    } // Highlighter.displayControls()
    
    // Display 1 highlighter
    displayHighlighter( icon, style, css)
    {
        let onclick = "window.highlighter.doPart( document.getElementById( 'HL_text_"+style+"').value, '"+style+"');";
        let onclick2 = "window.highlighter.undoPart( document.getElementById( 'HL_text_"+style+"').value, '"+style+"' );";
        let html = "";
        html += '<img src="'+icon+'" class="HL_penIcon" />';
        html += '<input id="HL_text_'+style+'" type="text" style="width:20em;" />';
        html += '<span class="button" onclick="'+onclick+'">Highlight</span> ';
        html += '<span class="button" onclick="'+onclick2+'">Clear</span>';
        this.displayElement.innerHTML += html;
        let rule = "span."+style+"{"+css+"}";
        ud.addStyleRules( rule);
        
    }
   /**
    * Actions on document
    */
    
    // Highlight in visible part
    doPart( text, style="HL_standard", partId = 0)
    {
        if ( !text) return false;
        let part = null;
        if ( partId) part = document.getElementById( partId);
        else part = document.querySelector("div.part:not(.hidden)");
        if ( !part) return debug( {level:2, return:false}, "No visible part");
        let textLen = text.length;
        let matches = this.searchText( text, part.id);
        // For each match
        for( let i=0; i<matches.length; i++)
        {
            // Highlight in this element
            let elementId = matches[i];
            this.doElement( text, style, elementId)
        }  
        return true;
    } // Highlighter.doPart()
    
    // Highlight in visible part
    undoPart( text, style="HL_standard", partId = 0)
    {
        if ( !text) return false;
        let part = null;
        if ( partId) part = document.getElementById( partId);
        else part = document.querySelector("div.part:not(.hidden)");
        if ( !part) return debug( {level:2, return:false}, "No visible part");
        let textLen = text.length;
        let matches = this.searchText( text, part.id);
        // For each match
        for( let i=0; i<matches.length; i++)
        {
            // Highlight in this element
            let elementId = matches[i];
            this.cleanContent( elementId, style)
        }  
        return true;
    } // Highlighter.undoPart()

    
    // Highlight in element
    doElement( text, style, elementId)
    {
        // Get element
        let element = document.getElementById( elementId);
        if ( !element) return debug( {level:2, return:false}, "can't find", elementId);        
        // Find offset(s) of each occurence of text
        let html = element.innerHTML;
        let htmll = html.toLowerCase();
        let offset = 0;
        let textLen = text.length;
        let textl = text.toLowerCase();
        let offsetFromSpans = 0;
        while ( ( offset = htmll.indexOf( textl, offset)) > -1)
        {
            // Surround text with styled span
            let added = this.addStyleToSegment( style, element, offset + offsetFromSpans, textLen);
            // Add clean-up call before saving
            this.dom.attr( element, this.cleanContentAttr, "window.highlighter.cleanContent('"+element.id+"');");
            // Add treatement on fetched data
            this.dom.attr( element, this.prepareDisplayAttr, "window.highlighter.doElement('"+text+"','"+style+"','"+element.id+"');");
            // Move on for next segment
            offset += textLen+added;
            offsetFromSpans += added;
        }
    } // Highlighter.doElement()
    
    // Add a style to a segment of text
    addStyleToSegment( style, element, offset, length)
    {
        let html = element.innerHTML;
        let newhtml = "";
        newhtml = html.substr( 0, offset);
        newhtml += '<span class="'+style+'">';
        newhtml += html.substr( offset, length);
        newhtml += '</span>';
        newhtml += html.substr( offset+length);
        element.innerHTML = newhtml;
        return ( newhtml.length - html.length);
    } // Highlighter.addStyle()
    
    // Clear Highlighted spans in 1 element
    cleanContent( saveableId, style = "HL_standard")
    {
        // Get element
        let saveable = document.getElementById( saveableId);
        if ( !saveable) return debug( {level:2, return:false}, "can't find", saveableId);
        // Content before cleanup
        let html = saveable.innerHTML;
        // Find highlighted segments
        let highlights = saveable.querySelectorAll( "span.HL_standard");
        // Remove each highlighted segment
        for ( let i=0; i < highlights.length; i++)
        {   
            // Get highlighted element, its content and outer html    
            let highlight = highlights[ i];
            let content = highlight.textContent;
            let hl_html = highlight.outerHTML;
            // Find position of highlighted text in saveable element
            let offset = html.indexOf( hl_html);
            // Regenerate saveable element's HTML
            let newhtml = "";
            newhtml = html.substr( 0, offset);
            newhtml += content;
            newhtml += html.substr( offset+hl_html.length);
            html = newhtml;
        }
        return html;
    } // Highlighter.cleanContent()
    
    // Clear all highlighter styles
    undoPart( partId = 0)
    {
        // Get part
        let part = null;
        if ( partId) part = document.getElementById( partId);
        else part = document.querySelector("div:part:not([hidden])");
        if ( !part) return debug( {level:2, return:false}, "No visible part");
        // Get Highlight spans
        let highlights = part.querySelectorAll( "span.HL_standard");
        for ( let i=0; i < highlights.length; i++)
        {
            // Get highlighted element, its content and outer html
            let highlight = highlights[i];
            // Get saveable parent
            let saveable = this.dom.getSaveableParent( highlight);
            // Update saveable with cleaned content
            saveable.innerHTML = this.cleanContent( saveable.id);
            // Clear the attributes
            this.dom.attr( saveable, this.cleanContentAttr, "");
            this.dom.attr( saveable, this.prepareDisplayAttr, "");            
        }
        return true;
    } // Highlighter.clearStyles()
    
    searchTexts( texts)
    {
        
    } // Highlighter.searchTexts()

    // Return array of ids of the elements containing text
    searchText( text, containerId)
    {
        let textl = text.toLowerCase();
        let container = containerId;
        // 2DO use dom.element and let element test for element or id
        if (typeof containerId == 'string') container = document.getElementById( containerId);
        if ( !container) return debug( {level:2, return:[]}, "can't find", containerId);
        // Get innerHTML
        let elements = container.childNodes;
        // Find matches
        let matches = [];
        for ( let i=0; i < elements.length; i++)
        {
            let element = elements[i];
            if ( element.nodeType != 1) continue;
            if ( ['subpart','page', 'zone'].indexOf( this.dom.attr( element, 'ud_type')) > -1)
                matches = matches.concat( this.searchText( text, element));
            else
            {
                let content = element.innerHTML;
                if ( content.toLowerCase().indexOf( textl) > -1 && element.id && !element.classList.contains('hidden')) 
                    matches.push( element.id);
            }        
        }
        return matches;
    } // Highlighter.searchText()

    
} // JS Highlighter class 

if ( typeof process != 'object') {
   // define( function() { return { class : Highlighter, src: document.currentScript.src};});  
} else { 
    // Testing under node.js
    if ( typeof exports === 'object') module.exports = { class: Highlighter};
    else window.Highlighter = Highlighter;
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined")
    {
        console.log( 'highlighter.js syntax:OK');
        //console.log ('Clipboard JS class test');
        console.log( 'Test completed');
    }        
} // End of test routine