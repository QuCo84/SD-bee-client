/* ***********************************************************************************
 * debug.js
 *
 */

/** 
 * SECURITY HOTSPOT Run onload instructions provided in AJAX calls. 
 * This is to have a single security hotspot on sonarqube
 * Ideas to remove this security hotspot : hash validation, code filtering,  hard-coding, prefixing function calls
 */
 function doOnload( onload) {
    if ( onload && typeof onload == "string") {
        let r = "";
        try {
            r = eval( onload);
        } catch ( error) {
            console.error( error, onload);            
        }
        return r;
    }
 }
 
/** 
 * SECURITY HOTSPOT Run onupdate instructions when an element is updated 
 * This is to have a single security hotspot on sonarqube
 * Ideas to remove this security hotspot : hard-coding / specific functions
 */
 function doOnupdate( onupdate) {
     if ( onupdate && typeof onupdate == "string") return eval( onupdate);
 }
 
 /** 
 * SECURITY HOTSPOT Run ud_content instructions when an element is to be saved
 * This is regroup security hotspot on sonarqube
 * Ideas to remove this security hotspot : hard-coding / specific functions
 */
 function doOnsave( onsave) {
     if ( onsave && typeof onsave == "string") return eval( onsave);
 }
 
 /** 
 * SECURITY HOTSPOT convert attr-friendly string to obj using eval
 * This is to have a single security hotspot on sonarqube
 * Ideas to remove this security hotspot : hard-coding / specific functions
 */ 
 function convertToObject( attrFriendlyStr) { return (attrFriendlyStr) ? eval( '(' + attrFriendlyStr + ')') : {dummy:"dummy"};}
 
/** 
 * SECURITY HOTSPOT Run a control on variable
 * This is to have a single security hotspot on sonarqube
 * Ideas to remove this security hotspot : hard-coding / specific functions
 */
 function doControl( test, args) {
     if ( test && typeof test == "string") return eval( test);
 } 
 
/** 
 * SECURITY HOTSPOT Debug function
 * This is to have a single security hotspot on sonarqube
 * Ideas to remove this security hotspot : hard-coding / specific functions
 */ 
 function Confirm( prompt) { confirm( prompt);}
 
 
/** 
 * SECURITY HOTSPOT Get type of return from an API fct
 * This is to have a single security hotspot on sonarqube
 * Ideas to remove this security hotspot : hard-coding / specific functions
 */
 function APIreturnType( fctName) {
     if ( fctName && typeof fctName == "string") return typeof eval( "API." + fctName + "();");
 }
 
 function stripScripts( html, element = null) {
    let ps1 = 0;
    let safe = 5;
    let changed = false;
    while( (ps1 = html.indexOf( "<script", ps1)) > -1 && safe--) {
        let ps2 = html.indexOf( "</script>");
        if ( ps2) html = html.substr( 0, ps1) + html.substr( ps2 + 9);
        else html = html.substr( 0, ps1);
        changed = true;
    }
    if ( !safe) {
        alert( "<script> sequenciencies not allowed here. Please remove for element to be saved.");
        return false;
    } else if ( changed && element) {
        // Update element's content with scripts removed
        element.innerHTML = html;
    }
    return html;
 }
 
  function stripStyles( html, element = null) {
    let ps1 = 0;
    let safe = 5;
    let changed = false;
    while( (ps1 = html.indexOf( "<style", ps1)) > -1 && safe--) {
        let ps2 = html.indexOf( "</style>");
        if ( ps2) html = html.substr( 0, ps1) + html.substr( ps2 + 9);
        else html = html.substr( 0, ps1);
        changed = true;
    }
    if ( !safe) {
        alert( "<style> sequenciencies not allowed here. Please remove for element to be saved.");
        return false;
    } else if ( changed && element) {
        // Update element's content with scripts removed
        element.innerHTML = html;
    }
    return html;
 }
 
 function stripScriptsAndStyles( html, element = null) {
    return stripStyles( stripScripts( html, element), element);
 }
  
 // #2226001 retrieved from ude.js 
 function htmlEntities(str, reverse = false) {
    if ( reverse)
        return String(str).replace(/&quote/g, '"').replace(/&gt;/g, '>;').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
    else    
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
 }
 
 /* 
 * 2DO need to change all < > associated with script & style
 */
 function htmlEntities2( str, element = null) {
    let changedStr = String(str)
    .replace(/<script/g, '&lt;script')
    .replace(/<style/g, '&lt;style');
    //.replace( />/g, '&gt;')
    //.replace(/"/g, '&quot;');
    // replace(/&/g, '&amp;').
    if ( changedStr != String(str) && element) element.innerHTML = changedStr;
    return changedStr;
 }    
 
// Need a special fct for new for tests
function L_new( classVar, className)
{
    let args = arguments;
    args.shift();
    args.shift();
    if ( typeof process == 'object')
    {
        // Testing under node.js
        let classVar2 = window[classVar];       
        return new classVar2( args);
    }
    else
    {
        return new classVar( args);
    }    
} // L_new()

function dumpElement( element, prefix="")  {
    if ( !element) console.log( "null");
    else if ( typeof process == "undefined") console.log( element);
    else {        
        console.log( prefix, element, element.id, element.getAttribute('name'), element.className, element.getAttribute('ud_type')); 
        let children = element.childNodes;
        for ( let i=0; i < children.length; i++) {
            let child = children[ i];
            if ( child.nodeType == 1) dumpElement( child, prefix+"   ");
            else if ( child.nodeType == 3) console.log( prefix+"    Text node: " + child.textContent);
       }
    } 
} // dumpElement()

function testResult( functionName, test, printIfFalse="") {
    if (test) ok = "OK"; else ok = "KO " + printIfFalse; 
    console.log( "Test "+functionName + " : " +ok);    
}


DEBUG_alwaysNull = { level:2, returnValue: null};
DEBUG_alwaysFalse = { level:2, returnValue: false};
if ( typeof DEBUG_level == "undefined") var DEBUG_level = 5;
DEBUG_time = -1;
DEBUG_stringifyCount = 1;
DEBUG_checksum=0;
DEBUG_poly=202020192018; 
TEST_ENVIRONMENT = false;
TEST_verbose = false; // authorised global variable for testing
COVERAGE = {};
if ( typeof process == 'object') { TEST_ENVIRONMENT = true;}

function stringifyHelper( key, value) 
{
  if (typeof value === "object" && window.DEBUG_stringifyCount-- <= 0) {
    return "object";
  }
  if (typeof value === "array") {
    return "array";
  }

  return value;
}
function debug() {
  // return returnValue if level < arguments[0].level or 5 if not set	
  let arg0 = arguments[0];
  if ( typeof arg0 != "object"  || !( 'level' in arg0)) {
    if ( DEBUG_level >= 5) {
        if ( arg0 == "__CHECKSUM__") { return DEBUG_checksum;}
        else if (arg0 == "__COVERAGE__") { return COVERAGE;}
        else { return "Level, arg "+window.DEBUG_level+arg0;}
    } else { return;}
  } else if ( arg0.level > window.DEBUG_level) { 
	if ( 'return' in arg0)  return arguments[0].return;
    else if ( 'returnValue' in arg0)  return arg0.returnValue;
	else return;
  }	
  if ( 'ctrl' in arg0) {
	// Code monitoring : run controls or detect run time errors
  }
  if ( arguments.length > 1) {
	// Tracing and trace checksum
	let v = [];
	// Initialise start time
	if (window.DEBUG_time == -1) window.DEBUG_time = Date.now() % 10000000;
	for ( let argi = 1; argi < arguments.length; argi++) v.push( arguments[ argi]);
    // Generate debug output
	let msg = "";
	let err = Error();
	if (typeof err.stack != "undefined") {
		// Use available stack info to add infos to msg
		let stack = err.stack.split("\n");
		if ( stack[0].indexOf(':') == -1) stack.shift();
		if ( stack[0].indexOf(':') == -1) stack.shift();
        if ( stack[0].indexOf('debug.js') > -1) stack.shift();
        // if ( TEST_ENVIRONMENT) stack.shift();
		let line = stack[1];
		let p1 = line.indexOf('(')
		let p2 = line.indexOf( ')');
		if ( p1 > 0 && p2 > 0) { line = line.substring( p1+1, p2);}
		line = line.split(':');
		// Get script name (default trace)
		if ( line.length < 2) { return;}        
        let script = line[1];
        let lineNo = line[2];

		// Shorten script name if possible
		if (script.indexOf('_') > -1) { script = script.substr( script.indexOf('_')+1);}
		let scriptParts = script.split( "\\");
		script = scriptParts[ scriptParts.length-1];
		if ( 'coverage' in arg0) {  
			// Compute coverage     
            if ( typeof COVERAGE[ script] == "undefined") { COVERAGE[ script] = {};}
			let coverageTag = arg0.coverage;
            let addOn = 0;
            if ( 'coverageDetail' in arg0) { coverageTag += '/'+arg0.coverageDetail;}
            else { coverageTag += '/global'; addOn = 3}
            if ( typeof COVERAGE[ script][ coverageTag] == "undefined") { 
                COVERAGE[ script][ coverageTag] = parseInt( line[ 2]);
            } else if ( typeof COVERAGE[ script][ coverageTag] == "number") {
                COVERAGE[ script][ coverageTag] = ""+( parseInt( line[2]) - COVERAGE[ script][ coverageTag] + addOn);
 			}	
		}
        if ( arguments.length > 1) {    
            // Generate debug line
            if (TEST_ENVIRONMENT) { msg = script + " line " + lineNo;}
            else {    
                let timeStr = ("0000000"+((Date.now() % 10000000) - window.DEBUG_time));
                let memStr = "0000000";
                if ( typeof window.performance.memory != "undefined")
                    memStr = "0000000"+ window.performance.memory.totalJSHeapSize; //jsHeapSizeLimit = 2172649472
                msg = timeStr.substring( timeStr.length-7) + ' ' + memStr.substring( memStr.length - 7) + ' ' + script +" line "+line[2];        
            }   
            // Add variables
            for (var i = 0; i < v.length; i++) {
                window.DEBUG_stringifyCount = 2;
                msg += ' '+JSON.stringify( v[i], stringifyHelper);
            }  
            if ( arg0.error) {
                if ( !TEST_ENVIRONMENT) console.error( msg, arg0.error, v);
                else console.log( "ALERT " + arg0.error, msg, v ); //, v);
            } else if ( !TEST_ENVIRONMENT || TEST_verbose) {
                 console.log( msg, v); 
            }
            // Checksum
            DEBUG_checksum += crc32_compute_string( DEBUG_poly, msg); 
        } 
    } else console.log( v);
  // 2DO send message to server
  } // end of tracing
  if ( 'return' in arg0) return arg0.return;
  else if ( 'returnValue' in arg0) return arg0.returnValue;
  else return;
} // debug()

function debug_callerFct() {
    let err = Error();
    let script = "Error stack unavailable";
	if (typeof err.stack != "undefined") {
		// Use available stack info to add infos to msg
		let stack = err.stack.split("\n");
		if ( stack[0].indexOf(':') == -1) stack.shift();
		if ( stack[0].indexOf(':') == -1) stack.shift();
		let line = stack[2];
		let p1 = line.indexOf('(')
		let p2 = line.indexOf( ')');
		if ( p1 > 0 && p2 > 0) { line = line.substring( p1+1, p2);}
		line = line.split(':');
		// Get script name (default trace)
		if ( line.length < 2) { return;}
        script = line[1];
		// Shorten script name if possible
		if (script.indexOf('_') > -1) { script = script.substr( script.indexOf('_')+1);}
		let scriptParts = script.split( "/");
		script = scriptParts[ scriptParts.length-1];   
        script += ' line'+ line[2]; 
        script += ' '+stack[3];         
    }
    return script;
}


/*
 * JavaScript CRC-32 implementation
 *  could go to calc
 */

function crc32_generate(reversedPolynomial) {
    var table = new Array()
    var i, j, n

    for (i = 0; i < 256; i++) {
        n = i
        for (j = 8; j > 0; j--) {
            if ((n & 1) == 1) {
                n = (n >>> 1) ^ reversedPolynomial
            } else {
                n = n >>> 1
            }
        }
        table[i] = n
    }

    return table
}

function crc32_initial() {
    return 0xFFFFFFFF
}

function crc32_add_byte(table, crc, byte) {
    crc = (crc >>> 8) ^ table[(byte) ^ (crc & 0x000000FF)]
    return crc
}

function crc32_final(crc) {
    crc = ~crc
    crc = (crc < 0) ? (0xFFFFFFFF + crc + 1) : crc
    return crc
}

function crc32_compute_string(reversedPolynomial, str) {
    var table = crc32_generate(reversedPolynomial)
    var crc = 0

    crc = crc32_initial()

    for ( let i = 0; i < str.length; i++)
        crc = crc32_add_byte(table, crc, str.charCodeAt(i))

    crc = crc32_final(crc)
    return crc
}

function crc32_compute_buffer(reversedPolynomial, data) {
    var dataView = new DataView(data)
    var table = crc32_generate(reversedPolynomial)
    var crc = 0

    crc = crc32_initial()

    for (let i = 0; i < dataView.byteLength; i++)
        crc = crc32_add_byte(table, crc, dataView.getUint8(i))

    crc = crc32_final(crc)
    return crc
}

function crc32_reverse(polynomial) {
    var reversedPolynomial = 0

    for ( let i = 0; i < 32; i++) {
        reversedPolynomial = reversedPolynomial << 1
        reversedPolynomial = reversedPolynomial | ((polynomial >>> i) & 1)
    }

    return reversedPolynomial
}

/* END of CRC 32 implementation */

if ( typeof process == 'object')
{
    // Testing under node.js
    // console.log( 'Declaring for nodejs');
    var displaylib = require( "../debug/display_lib.js");
    module.exports = { 
        debug: debug, L_new:L_new, dumpElement:dumpElement, testResult:testResult, debug_callerFct:debug_callerFct, 
        DEBUG_checksum:DEBUG_checksum, RegisterBlock:displaylib.RegisterBlock, ShowBlock:displaylib.ShowBlock, Zone:displaylib.Zone,
        doOnload:doOnload, doOnupdate:doOnupdate, doOnsave:doOnsave, doControl:doControl, APIreturnType:APIreturnType, convertToObject:convertToObject,
        htmlEntities:htmlEntities, htmlEntities2:htmlEntities2,
        stripScripts:stripScripts, stripStyles:stripStyles, stripScriptsAndStyles:stripScriptsAndStyles
    };
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined" && typeof ModuleUnderTest == "undefined")
    {
        // Test this module
        ModuleUnderTest = "debug.js";
        console.log( 'Syntax : OK');         
        console.log( 'Start of debug.js test program');        
        // Setup browser emulation
        console.log( "Setting up browser (client) test environment");    
        // console.log( Date.now());
        var envMod = require( '../tests/testenv.js');
        envMod.load();
        TEST_verbose = true;
        debug( {level:2, error:"DEPRECATED"}, "Value1", "Value2");
        console.log( "Test completed: OK");
    }     
} // End of test routine
