/** 
 *  UD API class UDapi - commands accessible via externalExchange DOM element.
 */
class UDapitest
{
    // Parameters
    // Modules
    ud = null;
    dom = null;
	udajax = null;
    ude = null;
    calc = null;
    udeTable = null;
    udeList = null;	
    udeDraw = null;
    utilities = null;
    
    // setup UDapi
    constructor( ud) {
        this.ud = ud;
        if (ud) {
            if ( typeof ud.ude != "undefined") this.ude = ud.ude; else this.ude = ud;
            this.dom = ud.dom;
			this.udajax = ud.udajax;
            this.calc = this.ude.calc;
			this.udeTable = this.ude.modules[ "div#table"].instance;
		}
        window.API = this;
        if ( typeof process == 'object') global.API = this;
    } // UDapi.construct()

    /* ---------------------------------------------------------------------------------------------------
     * API part 1 - included by udapi.js.
	 *
     * constructor and test code defined here for auto-testing methodes defined here.
     */

/* get file_include start */     

/* get file_include end*/    
}

if ( typeof process == 'object') {
    // Testing under node.js
    module.exports = { class: UDapi};    
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined") {  
        console.log( "Syntax OK");
        console.log( 'End of auto-test program'); 
    }        
} // End of test routine