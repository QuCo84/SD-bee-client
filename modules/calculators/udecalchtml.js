/**
 * udecalchtml.js
 *  HTML functions for DOM calculator and UD editor API
 *    
 */
 
 class UDEcalc_HTML {
 
    constructor( calc) {
        let fcts = [ 'getLinks'];
        if ( calc) calc.addFunctions( fcts, this);    
    }
    
   /** 
    * @api {formula} =getLinks(htmlOrArray) Return URL/URIs present in an HTML string or an array of HTML strings
    * @apiParam {integer} type The type of document or page: 1-model, 2-instance
    * @apiParam {string} oid DB's full path with parameters 
    * @apiParam {string} target Id of element to be filled with server's response
    * @apiSuccess {string} return JS to place in an onclick atribute
    * @apiGroup Elements
    *    
    */    
    getLinks( htmlOrArray) {
        let links = [];
        let htmls = [];
        if ( typeof htmlOrArray == "string") htmls = [ htmlOrArray]; else htmls = htmlOrArray;
        
        for ( let htmli=0; htmli < htmls.length; htmli++) {
            let html = htmls[ htmli];
            let tempDiv = document.createElement( 'div');
            tempDiv.innerHTML = html;
            // Extract URLs from anchors
            let anchors = tempDiv.querySelectorAll( 'a');
            for ( let anchi=0; anchi < anchors.length; anchi++) {
                links.push( anchors[ anchi].href);
            }
            // 2DO onclicks
        }
        return links;
    }
 
 } // UDEcalc_HTML JS class

// Initialise
function udecalchtml_init() {
    if ( typeof windows != "undefined" && typeof windows.ude != "undefined" && typeof windows.ude.calc != "undefined") {
        let udecalchtml = new UDEcalc_html( windows.ude.calc);
    }
}
udecalchtml_init();

// Auto-test 
if ( typeof process == 'object')
{
    // Testing under node.js
    module.exports = { UDEcalc_HTML: UDEcalc_HTML};
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined")
    {
        console.log( 'Syntax : OK');
        const envMod = require( '../tests/testenv.js');
        envMod.load();        
        let calcHTML = new UDEcalc_HTML( null);
        let test = "TEST 1 - getLinks()";
        let links = calcHTML.getLinks( '<a href="mylink">Link example</a>');
        testResult( test, links.indexOf( "mylink") > -1, links);
        console.log( "Program's trace checksum: "+debug( "__CHECKSUM__"));    
        console.log( 'Test completed');
    }    
} // Auto-test