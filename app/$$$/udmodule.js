class UDmodule {
    constructor() {
        // Load required functions        
        if ( typeof this._uses != "undefined") {
            let rep = $$$.loadFcts( this._uses);
            if ( typeof rep == "string") {
                // Some required fcts are not available
                console.error( 'Unknown fct $$$.' + rep);
                $$$.pageBanner( 'temp', $$$.translateTerm( 'Unknown fct')+ ' $$$.' + rep);            
                // return without adding functions
                return;
            } else if ( !rep) {
                // Modules being loaded
                // In module call $$$.loadFcts(this._uses) to see if loaded
            }
        }
        // Declare in $$$ all functions whose name doesn't start with _
        let props = Object.getOwnPropertyNames( Object.getPrototypeOf(this));        
        if ( typeof $$$ != "undefined") {
            let fcts = props.filter(( e, i, arr) => { 
                if ( e!=arr[i+i] && typeof this[e] == "function" && e != "constructor" && e[0] != "_") return true;
            });        
            $$$.addFunctions( this, fcts);
        }
    }
}

// Auto-test of modules
if ( typeof process == 'object') {
    module.exports = { class:UDmodule, UDmodule: UDmodule};  
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined" && typeof ModuleUnderTest == "undefined") {  
        ModuleUnderTest = "udmodule.js";
        if ( typeof  process.argv[2] == "undefined") {
            console.log( "Syntax OK");
            console.log( "Test completed");
            process.exit(0);
        }
        let testModule = "resources/" + process.argv[2];
        let ejsModule = '../node_modules/ejs/ejs.js';
        const envMod = require( '../tests/testenv.js');
        envMod.load();
        // Setup our UniversalDoc object
        global.ud = new UniversalDoc( 'document', true, 133);
        global.reqMod = envMod.require;
        envMod.require( [ ejsModule, testModule], function() {
            console.log( "Module tests returned");
        })
        
    }
}