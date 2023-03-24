/** udelayout.js
 *
 *  Client-side layout module for Universal Editor
 */
 
class UDE_layout {
    ude;
    dom;
    ud;
    knownHeights = {};
    paginating = false;

    constructor( ude) {
        this.ude = ude;
        this.dom = ude.dom;
        this.ud = ude.dataSource;
        // Add API ftcs
        if ( API) { API.addFunctions( this, [ 
            "paginate", "checkPagination"
        ]);}        
    }
    
   
    paginate( viewOrName) {
        // Anti loop
        if ( this.paginating) return;
        this.paginating = true;
        // Find view
        let view = ( typeof viewOrName == "string") ? this.dom.element( '[name="' + viewOrName + '"]', 'document') : viewOrName;
        let pages = this.dom.elements( "div.page", view); //view.childNodes;
         // Local function to detect if page break is user-defined
         function L_isForced( page) {
            let pageId = page.id;
            return ( pageId.indexOf( '_') == -1 || pageId.indexOf( 'Forced_') == 0);
        }
        // Page loop
        let lastPageHeight = 0;
        let emptySpaceAbove = 0;       
        for ( let pagei=0; pagei < pages.length; pagei++) {
            let page = pages[ pagei];
            let pageHeight = 0;
            let pageHeightStr = this.dom.attr( page, 'ud_pageHeight');
            if ( pageHeightStr) pageHeight = lastPageHeight = parseInt( pageHeightStr)
            else if ( lastPageHeight) pageHeight = lastpageHeight;
            if ( !pageHeight) continue; 
            if ( L_isForced( page)) {
                emptySpaceAbove = 0;  // don't use any spare room in previous page
            }
            // Use actual sizes for paging
            pageHeight = this.dom.attr( page, 'computed_height');
            let pageWidth = page.clientWidth;
            // Check box-sizing
            let boxSizing = $$$.dom.attr( page, 'computed_boxSizing');
            if ( boxSizing == "border-box") {
                // Remove margins if we are in border-box sizing method
                pageHeight -= ( this.dom.attr( page, 'computed_marginTop') + this.dom.attr( page, 'computed_marginBottom'));
                pageHeight -= ( this.dom.attr( page, 'computed_paddingTop') + this.dom.attr( page, 'computed_paddingBottom'));
            }
            // Element loop and paging calculations
            let currentHeight = 0;
            let movedToNext = 0;
            let movedToPrevious = 0;
            let elements = this.dom.children( page);
            for ( let eli=0; eli < elements.length; eli++) {
                let element = elements[ eli];
                let elHeight = ( eli < (elements.length - 1)) ?
                    elements[ eli +1].offsetTop - element.offsetTop
                    : element.getBoundingClientRect().height;
                let elWidth = element.getBoundingClientRect().width;
                let elLeft = element.offsetLeft;
                //if ( (elLeft + elwidth) < pageWidth) continue;
                //console.log( "zone widths : page, el, left", pageWidth, elWidth, elLeft);
                // Avoid looping on elements that are bigger than page    
                if ( elHeight > pageHeight) elHeight = pageHeight -10;
                // Detect elements that need to change page
                if ( elHeight < emptySpaceAbove) {
                    // Move back to previous page
                    if ( pagei < 1) return debug( {level:1, return:false}, "No previous page to paginate");
                    this.moveToPreviousPage( element, pages[ pagei-1], movedToPrevious++);
                    emptySpaceAbove -= elHeight;
                    movedToNext = 0;
                }
                else if ( ( currentHeight + elHeight) > pageHeight || movedToNext) {
                    // Move to next page
                    // 2DO Or if next page has Block id
                    if ( pagei >= (pages.length - 1) || L_isForced( pages[pagei+1])) {
                        // Add a new page
                        let newPage = this.addPage( page);
                        if ( newPage) {
                            if ( pagei >= ( pages.length - 1)) pages.push( newPage);
                            else pages.splice( pagei + 1, 0, newPage);
                        }
                        else {
                            this.paginating = false;
                            return debug( {level:1, return:false}, "Can't create new page to paginate");
                        }
                    }
                    this.moveToNextPage( element, pages[ pagei+1], movedToNext++);
                    emptySpaceAbove = 0;
                } else {
                    // No change just add to current height
                    currentHeight += elHeight;
                    emptySpaceAbove = 0;
                }
            } // end of element loop
            emptySpaceAbove = pageHeight - currentHeight;
        } // end of page loop
        this.paginating = false;
    } // UDE_layout.paginate()
    
    addPage( previousPage, position) {
        let view = previousPage.parentNode;
        let pageNo = parseInt( this.dom.attr( previousPage, 'ude_pageno')) + 1;
        let followingPages = [];
        let walkPage = previousPage.nextSibling;
        while ( walkPage) {
            followingPages.push( walkPage);
            walkPage = walkPage.nextSibling;
        }
        let newPage = document.createElement( 'div');
        newPage.id = "Break_div_client_"+pageNo;
        newPage.className = "page";
        let sample = previousPage;
        this.dom.attr( newPage, 'ud_type', "page");
        this.dom.attr( newPage, 'ude_mode', this.dom.attr( sample, "ude_mode"));
        this.dom.attr( newPage, 'ude_edit', this.dom.attr( sample, "ude_edit"));
        this.dom.attr( newPage, 'ud_fields', this.dom.attr( sample, "ud_fields"));
        this.dom.attr( newPage, 'ude_pageno', pageNo++);
        this.dom.attr( newPage, 'ud_pageHeight', this.dom.attr( sample, "ud_pageHeight"));
        if ( followingPages.length == 0) {
            view.appendChild( newPage);
        } else {
            // Loop through nextSiblings to change page no
            for ( let sibli=0; sibli < followingPages.length; sibli++) {
                this.dom.attr( followingPages[ sibli], 'ude_pageno', pageNo++);
            }
            // Insert before next page
            view.insertBefore( newPage, followingPages[0]);
        }
        return newPage;
    } // UDE_layout.addPage()
    
    moveToNextPage( element, page, position) {
        let before = page.childNodes[ position];
        if ( before)  page.insertBefore( element, before); else page.appendChild( element);
    }
    
    moveToPreviousPage( element, page, position) {
        page.appendChild( element);
    }
    
    checkPagination( elementOrId) {
        // Compute Height
        let element = this.dom.element( elementOrId);
        element = this.dom.getSaveableParent( element);
        if ( !element) return;
        let nextOffset = 0;
        let nextEl = element.nextSibling;
        if ( nextEl) nextOffset = nextEl.offsetTop;
        else nextOffset = element.parentNode.scrollHeight;
        let height = nextOffset - element.offsetTop;
        // Get knownHeight
        let knownHeight = this.knownHeights[ element.id];
        if ( typeof knownHeight == "undefined") {
            this.knownHeights[ element.id] = height;
        } else if ( height != knownHeight) {
            this.paginate( API.getView( element));
        }
    } // UDE_layout.checkHeight()

} // End of JS class UDE_pager 
if ( typeof process != 'object') {
    // window.UDE_layoutInstance = new UDE_layout( )
} else {
    // Testing under node.js 
    module.exports = { class:UDE_layout};
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined" && typeof ModuleUnderTest == "undefined") {
        // Auto test
        console.log( 'Syntax:OK'); 
        console.log( "Test completed");
        process.exit();
    }
}
