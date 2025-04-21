console.log( 'Start of test program');
console.log( 'Syntax:OK');
let path = "../..";
const testMod = require( './testenv.js');
testMod.load( []);
const htmlMod = require( '../modules/editors/udehtml.js');
UDEhtml = htmlMod.UDEhtml;
let ud = new UniversalDoc( 'document', true, 133);   
let ude = ud.ude;      
let HTMLeditor = new UDEhtml( ude);
let view = HTMLeditor.dom.element( "div.part[name='myView']", HTMLeditor.dom.element( 'document'));   
let test = "";     
// Test 1 - JSON100 HTML
{
    // Create object div.listObject and append to element   
    test = "Test 1  - create HTML";
    // Data
    let name = "myHTML";
    let lines = [
    "HTML",
    '&lt;span class="emphasized"&gt;Hello World&lt;/span&gt;'            
    ];            
    let object = HTMLeditor.newHTMLobject( name, "", lines);
    // Create container div.list
    let id = "B0100000005000000M";            
    let attributes = {id:id, class:"html", ud_mime:"text/json"};
    let element = HTMLeditor.dom.prepareToInsert( 'div', object.outerHTML, attributes);
    // element.appendChild( object);
    // Append list to view
    view.appendChild( element);   
    // Initialise list
    HTMLeditor.initialise( id);
    if ( element.innerHTML.indexOf( 'Hello World') > -1) console.log( test + ":OK");
    else console.log( test + ":KO", element.innerHTML);
}       
// Test 2 - HTML list with caption
/*
{
    // Create list with HTML            
    // Data
    name = "myList";
    let objectData = '<span>My List 2 <span class="objectName">myList2></span></span>';
    objectData += '<ul id="myList2" class="listStyle1"><li>Item 1</li><li>Item 2</li></ul>';            
    // Create container div.list
    let listId = "B0100000007000000M";            
    let listAttributes = {id:listId, class:"list", ud_mime:"text/html"};
    let listElement = listEditor.dom.prepareToInsert( 'div', objectData, listAttributes);
    // Append list to view
    view.appendChild( listElement);   
    // Initialise list
    listEditor.initialise( listId);
    console.log( view.innerHTML);
} 
*/
console.log( 'Test completed');
process.exit();