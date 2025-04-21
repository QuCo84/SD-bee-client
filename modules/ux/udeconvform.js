/**
 * Conversation form replaced by resources/questionnaire.js
 */
 
 class UDE_conversationalForm {
    
    ude;
    
    constructor( ude) {
        this->ude = ude;
        this.dom = ude->dom;
    }
 
   /**
    * @api {JS} API.convForm(groupName, source) Setup a conversational form
    */
    convForm( groupName, action) {
        // Find all zones with id = groupName_*
            // Setup if no source
            // Next if input and validate, Submit if button
    }
    
    setup( zones) {
        // Make 1st zone visible
        
    }
    
    validate( input, zones) {
    }
    
    next( zones) {
        // Test input
            // Display error message
        // Timing
        // Display next zone
        // Last zone, submit
    }
    
    submit( zones) {
        // Compile all input fields
        // Send to server with zone to update
        // Display final zone (waiting)
    }
 
 } // JS class UDE_conversationalForm
 
 // Auto-test
if ( typeof process == 'object') {    
    // Testing under node.js 
    module.exports = { convForm:UDE_conversationalForm};
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined" && typeof ModuleUnderTest == "undefined") {
        console.log( 'Syntax:OK');            
        console.log( 'Start of test program');
        console.log( "Setting up browser (client) test environment"); 
        let path = "..";
        const testMod = require( path+'/tests/testenv.js');      
        testMod.load( []);
        let dom = new DOM( 'document', null);
        let udjson = new UDJSON( dom);
        console.log( "start testing");
        let test = "";
        {
            test = "Empty";
            testResult( test, true);
        }
        
        // End of auto-test
        console.log( "Test completed");     
    }
}