/**
 * Test the ude-view module
 *
 */
TEST_serverSaving = false;
TEST_verbose = false;
loadTestEnvironment();
// Continue after 1 second
console.log( "Test start");
setTimeout( DoTests, 2000);

function nextTest( ud) {
    switch ( ud.testNo) {
        case 1 : // GET test document
            let url = 'webdesk/UniversalDocElement--21-725-21--UD|3|NO|OIDLENGTH|CD|5/show/tusername|demo/tpassword|demo/';
            //console.log( "GET from server", url);
            ud.udajax.serverRequest( url, 'GET', '', { ud:ud, action: "reload"});
            //console.log( ud.udajax.pending);            
            testPage = ud.domjs;
            break;
        case 2 :
            break;
        case 3 : 
            if ( Object.keys( ud.udajax.pending).length > 0) ud.testNo--; // Test doc not loaded yet so loop
            else {
                // Test doc is loaded
                // console.log( document.getElementById( 'document').innerHTML);
                DOMtest();
                saveableParentTest();
                blockIdTest();  
                TEST_context = insertListTest();
            }                
            break;
        case 4 :
            if ( !ud.ude.modules['div.list'].instance) ud.testNo--; // wait for list editor to be loaded
            break;
        case 6 : // Insert a list
            insertListTest2( TEST_context);
            TEST_context = insertTableTest();
        case 7 : 
            if ( !ud.ude.modules['div.table'].instance) ud.testNo--; // wait for list editor to be loaded
            break;
        case 8 : // Insert a table
            insertTableTest2( TEST_context);
            break;
        case 9 : // Insert a text div
            insertTextTest();
            break;
        case 10 : // Simulate a key eve
            eventTest();
            break;
        case 12 : // Insert a view
            addViewTest();            
            break;
        case 13 : // Click & menu test
            API.switchView( 'Doc');
            clickAndMenuTest( 'B01000000B0000000M');
            break;
        case 15 : 
            EndTest();
            break;
    }
    ud.testNo++;
} // nextTest()


function loadTestEnvironment()
{
    // DOM emulation
    const envMod = require( './testenv.js');
    envMod.load();
    // Setup our UniversalDoc object
    ud = new UniversalDoc( 'document', true, 133);
    console.log( "UD loaded");
    ud.Zone = Zone;
    ud.UDapiRequest = UDapiRequest; 
    ud.domjs = domjs;
    ud.testNo = 1;
    return true;
}  // loadTestEnvironment

function getJSfromHTML( html)
{
    let js = "";
    let p = html.indexOf('window.onload');
    if (p > 50)
    {
        let str = '<script type="text/javascript" lang="javascript">';
        let p1 = p - str.length - 3;
        //this.html = response.substr(0, p1);
        p1 = p + 13+3+9+2;
        let p2 = html.substr(p1).indexOf('</script>');
        //console.log( p1+' '+p2);
        js = html.substr(p1, p2-2);
        //this.js = this.js.replace(/LFJ_openAcco/g, '{');
        //this.js = this.js.replace(/LFJ_closeAcco/g, '}'); 
            // 2DO security check on js
    }
    return js;
}      
function DOMtest()
{
    let top = ud.dom.element( 'document');
    if ( !ud.dom.attr( top, 'ud_oid') == "UniversalDocElement--21-725") {
        console.log( "DOMtest : KO", ud.dom.attr( top, 'ud_oid'), "UniversalDocElement--21-725");
        return false;
    }
    let dom = ud.dom;
    let cursor = dom.cursor;
    cursor.fetch();
    let partId = "B010000000000000M_docA4text";
    let part = document.getElementById( partId);
    let pages = part.childNodes; // dom.children( part) ignores pages  
    let lastPage = null;
    for ( let i=0; i< pages.length; i++) {
        //console.log( pages[i].tagName, pages[i].className);
        if ( pages[i].nodeType == 1 &&  pages[i].classList.contains('page')) lastPage = pages[i];
    }
    if ( !lastPage) lastPage = part; //return debug( { level:1, return:false}, "DOMtest : KO - no page found", pages);
    //console.log( lastPage);
    let elements = lastPage.childNodes;
    let lastElement = elements[ elements.length -1];
    cursor.HTMLelement = lastElement;
    cursor.textElement = cursor.HTMLelement.firstChild;
    cursor.HTMLoffset = 0;
    cursor.textOffset = 0;
    cursor.set();
    if ( cursor.fetch().HTMLelement.tagName.toLowerCase() == "p") console.log( "DOMtest : OK"); else console.log( "DOMtest : KO", cursor.HTMLelement.tagName);
    return true;
}
function saveableParentTest() {
    let parentId = "B010000000000000M_docA4text"; //"BVV000000081000045_texts"; //"BVV00000100000000M_texts";
    let parent = ud.dom.element( parentId); //document.getElementById( parentId);
    if ( !parent) console.log( "saveableParentTest:KO", parent, parentId, ud.dom.element( 'document').innerHTML);
    let children = ud.dom.childElements( parent); // = parent.getElementsByTagName('p')[0];
    let target = children[0];
    let grandChildren = ud.dom.unpagedChildElements( target);
    let saveableParent = ud.dom.getSaveableParent( target);
    if ( grandChildren.length) {
        target = grandChildren[0];
        saveableParent = ud.dom.getSaveableParent( grandChildren[0]);
    }
    if (  saveableParent == target) console.log( "saveableParentTest:OK");
    else console.log( "saveableParentTest:KO", saveableParent, target);
    //setTimeout( EndTest, 2000);
    return true;
} // saveableParentTest()

function blockIdTest()
{
    // Get last block of main part
    let partId = "B010000000000000M_docA4text";
    let pages = ud.dom.childrenOfClass( ud.dom.element( partId), 'page');
    let lastPage = null;
    for ( let i=0; i< pages.length; i++)
        if ( pages[i].nodeType == 1 &&  pages[i].classList.contains('page')) lastPage = pages[i];
    let elements = lastPage.childNodes;
    let lastElement = elements[ elements.length -1];
    let lastBlockNo = parseInt( lastElement.id.substring( 3, 13), 30);
    // Insert after
    let dom = ud.dom;
    let newElement = dom.prepareToInsert( 'p', 'test insert at end', {});
    newElement = lastPage.appendChild( newElement);
    // Inform VIEW-MODEL of new element
    ud.viewEvent( "create", newElement);
    // Get block n° of inserted element
    let newBlockNo = parseInt( newElement.id.substring( 3, 13), 30);
    let diff = newBlockNo - lastBlockNo;
    if ( diff >= 280 && diff <= 300*16) console.log( "blockIdTest:OK");
    else console.log( "blockIdTest:KO", diff+ " must be between 280 & 4800", lastBlockNo, newBlockNo);
}

function insertListTest()
{
    let dom = window.ud.dom;
    let ude = window.ud.ude;
    // Get 2nd element of first page
    let partId = "B010000000000000M_docA4text";
    let pages = ud.dom.childrenOfClass( ud.dom.element( partId), 'page');
    let page = pages[0];
    let elements = ud.dom.unpagedChildElements( page);
    let nbElements = elements.length;
    let element = elements[ 1];
    if ( !element) {
        console.log( "insertListTest:KO", nbElements+" found, 2 needed", page, pages.length);
        return false;
    }
    let newElement = ud.dom.insertElement( 'div', 'Test new list', { class:'list', name: "listInsert1", ud_type:'list', ud_mime:"text/json"}, element, true);
    // Inform VIEW-MODEL of new element
    ud.viewEvent( "create", newElement);
    // Initialise new element
    if ( !newElement) { console.log( "insertListTest:KO", element); return false;}
    ude.initialiseElement( newElement);
    // 2DO Wait for loading
    //NextTest( 'insertList');
    return { page:page, nbElements:nbElements, newElement:newElement};
}
function insertListTest2( context){
    let page = context.page;
    let nbElements = context.nbElements;
    elements = ud.dom.unpagedChildElements( page); 
    let diff = elements.length - nbElements;
    element = elements[ 2];
    // for ( let eli=0; eli < elements.length; eli++) dumpElement( elements[ eli]);
    let content = element.innerHTML;
    if ( diff == 1 && content.indexOf( 'item') > -1) console.log( "insertListTest:OK");
    else console.log( "insertListTest:KO", diff, content, page.textContent);
    //dumpElement( element);
}

function insertTableTest() {
    let dom = window.ud.dom;
    let ude = window.ud.ude;
    // Get 2nd element of first page
    let partId = "B010000000000000M_docA4text";
    let pages = ud.dom.childrenOfClass( ud.dom.element( partId), 'page');
    let page = pages[0];
    let elements = ud.dom.unpagedChildElements( page);
    let nbElements = elements.length;
    let element = elements[ 1];
    let newElement = dom.insertElement( 'div', 'Test new table', { class:'table', name:"tableinsert1", ud_type:'table', ud_mime:"text/json"}, element, true);
   // Inform VIEW-MODEL of new element
    window.ud.viewEvent( "create", newElement);
    // Initialise new element
    ude.initialiseElement( newElement.id);
    return { page:page, nbElements:nbElements, newElement:newElement};
}
function insertTableTest2( context) {
    let page = context.page;
    let nbElements = context.nbElements;
    let newElement = context.newElement;
    elements = ud.dom.unpagedChildElements( page);
    let diff = elements.length - nbElements;
    element = elements[ 2];
    let content = element.innerHTML;
    if ( diff == 1 && content.indexOf( '<td') > -1) console.log( "insertTableTest:OK");
    else console.log( "insertTableTest:KO", diff, content);
    
}
function insertTextTest()
{
    let dom = window.ud.dom;
    let ude = window.ud.ude;
    // Get 2nd element of first page
    let partId = "B010000000000000M_docA4text";
    let pages = ud.dom.childrenOfClass( ud.dom.element( partId), 'page');
    let page = pages[0];
    let elements = ud.dom.unpagedChildElements( page);
    let nbElements = elements.length;
    let element = elements[ 1];
    let newElement = dom.insertElement( 'div', 'Test new text', { class:'text', ud_type:'linetext'}, element, true);
   // Inform VIEW-MODEL of new element
    window.ud.viewEvent( "create", newElement);
    // Initialise new element
    ude.initialiseElement( newElement.id);
    elements = ud.dom.unpagedChildElements( page);
    let diff = elements.length - nbElements;
    let compLength = newElement.childNodes.length;
    element = elements[ 2];
    let content = element.textContent;
    if ( diff == 1 && compLength == 2 && content.indexOf( 'text') > -1) console.log( "insertTextTest:OK");
    else console.log( "insertTextTest:KO", diff, compLength, content);
    // 2DO look for rowmodel or insert new row
    // console.log( page.innerHTML);
    //NextTest( 'insertTable');
}

function eventTest()
{
    let ude = ud.ude;
    let cursor = ud.dom.cursor;
    let partId = "B010000000000000M_docA4text";
    let pages = ud.dom.childrenOfClass( ud.dom.element( partId), 'page');
    let lastPage = null;
    for ( let i=0; i< pages.length; i++)
        if ( pages[i].nodeType == 1 &&  pages[i].classList.contains('page')) lastPage = pages[i];
    let elements = lastPage.childNodes;
    let elementsInPage = elements.length;
    let element = elements[ elementsInPage - 1];
    cursor.HTMLelement = element;
    cursor.textElement = cursor.HTMLelement.firstChild;
    cursor.HTMLoffset = 3;
    cursor.textOffset = 3;
    cursor.set();
    let event = { 
        type:'keyup', key: 'Enter', shiftKey:false, ctrlKey:false, altKey:false,
        preventDefault:function(){}, 
    };
    ude.keyEvent( event);
    if ( lastPage.childNodes.length == ( elementsInPage +1)) console.log( "Event:OK");
    else console.log( "Event:KO", elementsInPage, lastPage.childNodes.length );
}

function addViewTest() {
    // Setup new view form
    let view = API.addView();
    // Get new view elemnts id prefix
    let id = view.id;
    // Fill it    
    API.dom.element( id + "name").textContent = "test view";
    API.dom.element( id + "describe").textContent = "This is for testing";
    API.dom.element( 'select', API.dom.element(id + "type")).value = "doc";
    API.dom.element( 'select', API.dom.element(id + "layout")).value = "standard"
    API.setupView();
    if ( view.textContent == "") console.log( "AddView:OK");
    else console.log( "AddView:KO", view, view.textContent);
}

function clickAndMenuTest( elId)
{
    let ude = ud.ude;
    let cursor = ud.dom.cursor;
    let dom = ud.dom;
    cursor.HTMLelement = dom.element( elId);
    cursor.textElement = cursor.HTMLelement.firstChild;
    cursor.HTMLoffset = 0;
    cursor.textOffset = 0;
    cursor.set();
    let event = { 
        type:'click', 
        target: cursor.HTMLelement,
        preventDefault:function(){}, 
    };
    ude.clickHandler.event( event);
    //$$$.displayMenu( cursor.HTMLelement);
    let menu = dom.element( 'fmenu');
    console.log( menu.innerHTML);
    if ( $$$.dom.elements( 'img', menu).length > 1) console.log( "Menu:OK"); else {console.log( "Menu:KO", menu.childNodes); dumpElement( menu);}
    //else console.log( "Menu:KO", menu.innerHTML);
}

function EndTest()
{
    console.log( "Debug checksum: "+debug( "__CHECKSUM__"));
    console.log( "Test completed");
    process.exit();
}


function DoTests()
{    
    nextTest( ud);
    setInterval( function() { nextTest( ud);}, 500);
}


