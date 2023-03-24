class UDmodule {
    constructor() {
        let props = Object.getOwnPropertyNames( Object.getPrototypeOf(this));
        let fcts = props.filter(( e, i, arr) => { 
            if ( e!=arr[i+i] && typeof this[e] == "function" && e != "constructor" && e[0] != "_") return true;
        });

        if ( typeof $$$ != "undefined") {
            $$$.addFunctions( this, fcts);
        }
    }
}

// Auto-test of modules
if ( typeof process == 'object') {
    module.exports = { class:UDmodule, UDmodule: UDmodule};  
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined" && typeof ModuleUnderTest == "undefined") {  
        ModuleUnderTest = "udmodule.js";
        console.log( "Syntax OK");
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
        //console.log( "Test completed");
        //process.exit(0);
    }
}