/** 
 * testsandbox.js -- Test Sandbox on node.js
 */
 
 
 class API {
  evaluate( expr) { return eval( expr);}
}
const myAPI = new API();
function sandbox() {
  let eval = function() { return "unauthorised function";};
  let require = function(mod, fct) { return "unauthorised require";};
  let XMLHttpRequest = function() { return {};};
  let API = {};
  let sandbox = "";
  let count=0;
  let env = { myVar:"myVal"};
  "use strict"
  function myFct1(a) {       
     let b= 5;
     let r = a + b + count++;
     let r2 = eval ( "a + b");
     let r3 = myAPI.evaluate( "3 + 5");
     return r + " "+ r2 + " "+ r3;
  }
  function myFct2() {
     console.log( require( 'fs', function() {console.log( "can't require"); fs.openFile;}));
     let a = 3 + count++;
     let b = 5;
     let r = a * b;
     let r2 = new XMLHttpRequest("myurl.com");
     console.log( API, sandbox);
     return r + " "+ r2.timeout;
  }
  
    function myFct3() {
        let err = new Error();
        console.log( "ERROR"); //, "kk", err);
        // myAPI = this.myFct2; // throw's error)
        return err.stack;
    }

  return { myFct1:myFct1, myFct2:myFct2, myFct3:myFct3};
}

let path = ".";
const testMod = require( path+'/testenv.js');      
testMod.load( []);
let ud = new UniversalDoc( 'document', true, 133); 

let sand = sandbox();
console.log( sand.myFct1(3));
console.log( sand.myFct1(10));
console.log( sand.myFct2());
console.log( sand.myFct2());
try {
    console.log( sand.myFct3());
} catch (err) {
    console.log( "caught", err);
}

console.log( myAPI.evaluate( "3 + 5"));
// console.log( new XMLHttpRequest().timeout);
console.log( "Test completed\n");
process.exit(0);