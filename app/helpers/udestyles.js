/**
 * udestyles.js - manage style mapping and other
 */


class UDE_styleManager {

    constructor() {
        // Grap style map

    }

    mapStylesOnAll() {   // for UDE initialisation
        for ( let map in this.maps) {
            let document = $$$.dom.element( 'document');
            let elements = $$$.dom.elements( "." + map, document);
            for ( let eli=0; eli < elements.length; eli++) {
                this.mapStyleOnElement( elements[ eli]);
            }
        }
    }

    mapStyleOnElement( element, newStyle="", oldStyle="") { // for $$$.changeclass
        if ( oldStyle) {
            // Remove existing mapped classes
        }
        if ( !newStyle) {
            // Grab new style from element's current style
        }
        if ( newstyle) {
            // Get mapped classes for class
            let mappedClasses = this.map[ newStyle];
            // Add mapped classes for class
            for (let mappedClass in mappedClasses)  element.classList.add( mappedClass)
        }
    } 
} // Class JS UDE_styleManager 

if ( typeof process == 'object')
{
    // Testing under node.js      
    module.exports = { UDE_styleManager: UDE_styleManager};  
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined")
    {
        // Auto-test module
        // Setup test environment
        /*
        var envMod = require( '../tests/testenv.js');
        envMod.load();
        // Load additionnal modules required for test
        const udedraw = require( "../mdules/editors/udedraw.js");
        const UDEdraw = udedraw.UDEdraw; 
        window.UDEdraw = udedraw.UDEdraw;    
        //console.log( typeof global.JSDOM);
        // Test this module
        console.log( 'Syntax OK');
        console.log( 'Start of UDE test program');
        // Setup browser emulation
        debug( {level:2}, "abd");
        console.log( 'Creating ude');
        var myude = new UDE( document.getElementById('document'), null, 0);
        */
        console.log( "Test completed");
    }

} // End of test routine