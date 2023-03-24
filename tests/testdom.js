const testMod = require( '../tests/testenv.js');
testMod.load( []);    
// Setup our DOM object
var dom = new DOM( document.getElementById( 'document'), null);
// Tests
let test = "";
{
    test = "Test 1";
    console.log( dom.value( "B0100000001000000M...textContent"));
    let element = dom.element( "B0100000000000000M");
    // dumpElement( element);
    let children = dom.children( element);
    // console.log( children);
    let firstChild = children[ 0];
    if ( dom.parentAttr( firstChild, 'data-ud-extra') == "attribVal") console.log( test+" : OK"); else console.log( test+": KO", firstChild, dom.parentAttr( firstChild, 'data-ud-attr'));
}
{
    // JSON<-->HTML test 2DO move to JSON            
    test = "Test 2";
    let data = { tag:"ul", name:"myul", defaults:{ tag:{1:"li"}}, "value":{ 0:{ value:"item1", tag:"li"}, 1:{ value:"item2", tag:"li"}}};
    //json = { value:[ { tag:"span", value:"My caption"}, json]};
    let json = { 
        meta:{ type:"list", name:"mylist", zone:"myListeditZone", caption:"My list", captionPosition:"top"}, 
        data:data, changes:{}
    };        
    //console.log( json);
    let element = dom.JSONput( json);
    //dumpElement( element); // console.log( element, element.childNodes[0].tagName);
    let rjson = dom.JSONget( element); //, true);
    //console.log( rjson);
    if ( JSONvalue( rjson, 'meta').type == "list") console.log( test+" : OK"); else console.log( test+": KO");
}
{
    // Text
    test = "3 - text editor";
    let data = { tag:"textedit", "mime":"text/text", "value":["line1", "line2", "line3"]};
    //json = { value:[ { tag:"span", value:"My caption"}, json]};
    let json = { meta:{ type:"text", name:"mytextD", zone:"mytextDeditZone", caption:"My text", captionPosition:"top"}, data:data, changes:{}};
    let element = dom.JSONput( json);
    // dumpElement( element);
    let rjson = JSON.stringify(  dom.JSONget( element));
    testResult( test, rjson.indexOf( 'textedit') > -1 && rjson.indexOf( 'line1') > -1, rjson);
    // console.log( rjson);
}
{
   // Views & pages
   test = "4 - views";
   let views = dom.views();          
   let pages = dom.pages( "myView");
   testResult( test, views.length == 4 && pages.length == 1, views.length + " views and " + pages.length + " pages in myView");         
}
{
    //console.log( dom.attr( 'B0100000000000000M', 'name'));
}
{
    test = "Test 6 - default content";
    testResult( test, dom.hasDefaultContent( "B0100000009000000M"));         
}
{
    test = "Test 7 - data- prefix read only";
    let element = dom.element( "B0100000000000000M");
    dom.attr( element, 'data-ud-model', "test"); // write directly as data-
    let model = dom.attr( element, 'ud_model'); // read with bad format
    testResult( test, model=="test");         
}

// End of auto-test
console.log( "Program checksum : ", debug( '__CHECKSUM__'));
console.log( "Program coverage : ", debug( '__COVERAGE__'));
console.log( "Test completed");     