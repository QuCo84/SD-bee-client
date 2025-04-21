let exTag = "div.table";    ;    
console.log( 'Start of test program');
console.log( 'Syntax:OK');
console.log( 'Start of test program');
console.log( "Setting up browser (client) test environment");
let path = "../..";        
const testMod = require( './testenv.js');
testMod.load( []);
const tableMod = require( '../modules/editors/udetable.js');
UDEtable = tableMod.UDEtable;
// TEST_verbose = true;
let ud = new UniversalDoc( 'document', true, 133);
let ude = ud.ude; // new UDE( window.topElement, null); 
// Initialise
let tableEditor = new UDEtable( ud.dom, ude);
ude.modules[ exTag].instance = tableEditor;
ude.modules[ exTag].state = "loaded";
ude.tableEd = tableEditor;        
let view = tableEditor.dom.element( "div.part[name='myView']", tableEditor.dom.element( 'document'));   
let test = "";        
// Test 1 - JSON table
{
    // Create object div.listObject and append to element            
    // Data
    name = "myTable";
    let objectData = {"meta":{"type":"table","class":"tableStyle1", "name":"Table1","zone":"Table1editZone","caption":"Table1","captionPosition":"top"},"data":{"tag":"table", "name":"Table1", "class":"tableStyle1","value":{"thead":{"tag":"thead","value":[{"tag":"tr","value":{"row":{"tag":"th","value":"row"},"A":{"tag":"th","value":"A"},"B":{"tag":"th","value":"B"},"C":{"tag":"th","value":"C"}}},{"tag":"tr", "class":"rowmodel", "value":{"row":{"tag":"td","value":"","formula":"row()"},"A":{"tag":"td","value":"",},"B":{"tag":"td","value":""},"C":{"tag":"td","value":"",}}}]},"tbody":{"tag":"tbody","value":[{"tag":"tr","value":{"row":{"tag":"td","value":"1"},"A":{"tag":"td","value":"Labradors"},"B":{"tag":"td","value":"Labradors"},"C":{"tag":"td","value":"100"}}},{"tag":"tr","value":{"row":{"tag":"td","formula":"row()","value":"2"},"A":{"tag":"td", "value":"Retrievers"},"B":{"tag":"td", "value":""},"C":{"tag":"td","value":"95"}}},{"tag":"tr","value":{"row":{"tag":"td","formula":"row()","value":"3"},"A":{"tag":"td","value":"Setters"},"B":{"tag":"td","value":""},"C":{"tag":"td", "value":"86"}}},{"tag":"tr","value":{"row":{"tag":"td","formula":"row()","value":"4"},"A":{"tag":"td", "value":"Pointers"},"B":{"tag":"td", "value":""},"C":{"tag":"td", "value":"72"}}},{"tag":"tr","value":{"row":{"tag":"td","formula":"row()","value":"5"},"A":{"tag":"td", "value":"Hounds"},"B":{"tag":"td", "value":""},"C":{"tag":"td", "value":"96"}}},{"tag":"tr","value":{"row":{"tag":"td","formula":"row()","value":""},"A":{"tag":"td", "value":"Hounds"},"B":{"tag":"td","value":""},"C":{"tag":"td","value":"10"}}}]}}},"changes":[]};
    let objectAttributes = {id:name+"_object", class:"tableObject, hidden", ud_mime:"text/json"};
    let objectElement = tableEditor.dom.prepareToInsert( 'div', JSON.stringify( objectData), objectAttributes);
    // Create container div.table
    let tableElementId = "B0100000005000000M";            
    let tableAttributes = {id:tableElementId, class:"table", ud_mime:"text/json"};
    let tableElement = tableEditor.dom.prepareToInsert( 'div', "...", tableAttributes);
    tableElement.appendChild( objectElement);
    // Append list to view
    view.appendChild( tableElement);   
    // Initialise list
    tableEditor.initialise( tableElementId);
    // Check nb of tables
    if (ude.dom.elements( "#Table1", view).length == 1) console.log( "Test 1 : OK");
    else console.log( "Test 1  : KO", ude.dom.elements( "table", view).length);
}       
// Test 2 - Text as caption
{
    // Create table with text           
    // Data
    test = "Test 2 - create empty table";
    let objectData = "myTable";
    let name = 'My Table 3';          
    // Create container div.list
    let tableId = "B010000000900000M";            
    let tableAttributes = {id:tableId, name:name, class:"table", ud_mime:"text/json"};
    let tableElement = tableEditor.dom.prepareToInsert( 'div', objectData, tableAttributes);
    // Append list to view
    view.appendChild( tableElement);   
    // Initialise list
    let nbOfTables = ude.dom.elements( "table", view).length;
    tableEditor.initialise( tableId);
    if ( ude.dom.elements( "table", view).length > nbOfTables) console.log( test + " : OK");
    else console.log( test + " : KO", ude.dom.elements( "table", view).length); 
}        
// Test 4 - sumsBy
{
    test = "3 - sumsBy";
    // Find table with text  
    let tableId = "Table1"; // "B0100000005000000M";              
    let sumsBy = tableEditor.sumsBy( tableId, 'A', 'C', "");;             
    testResult( test, ( Object.keys( sumsBy).length == 5 && sumsBy['Hounds'] == 106), Object.keys( sumsBy) + ' ' + sumsBy['Hounds']); 
}        


console.log( 'Test completed');
process.exit();
