/**
 * In-doc menu or floating menu client-side class
 */
class UDE_ideas {
    parent;
    dom;
    ideaFcts = {};
    
    constructor( menu) {
        this.parent = menu;
        this.dom = menu.dom;
        
        // Add API fcts
        if ( API) { API.addFunctions( this, [ 
            "registerIdeasFunction", "getIdeas", "fillIdeasBox"
        ]);}
                  
    }
    
    registerIdeasFunction( selector, fct) {        
        if ( typeof this.ideaFcts[ selector] == "undefined")
            this.ideaFcts[ selector] = [fct];
        else
            this.ideaFcts[ selector].push( fct);
        return true;
    } // UDE_menu_ideas.registerIdeas()
    
    getIdeas( keywords, elementOrId, target = 'UD_spare') {
        let element = this.dom.element( elementOrId);
        let ideas = [];
        let content = element.textContent;
        // 2DO add surrounding content let content = ideas.textContent;
        let name = this.dom.attr( element, 'name');
        if ( !name) {
            let saveable = this.dom.getSaveableParent( element);
            name = this.dom.attr( saveable, 'name');
        }
        // Build list of ideas fcts
        let fcts = [];
        // Look for fcts registered for element's extended tag
        let exTag = this.dom.attr( element, 'exTag');
        // Based on exTag
        fcts = this.addIdeasFctToList( exTag, fcts);
        // Based on name
        if ( name) {
            // Look for fcts registered under element's name 
            fcts = this.addIdeasFctToList( name, fcts);
        }
        // Based on class
        let classes = this.dom.keepPermanentClasses( element.className);
        for ( let classi = 0; classi < classes.length; classi++) {
            // Look for fcts registered under element's user-chosen classes
            fcts = this.addIdeasFctToList( exTag + '.' + classes[ classi] , fcts);
        }        
        // Call ideas fcts and concat results
        for ( let fcti=0; fcti < fcts.length; fcti++) {
            let fct = fcts[ fcti];
            fct.fct( content, target, fct.selector);
            let ideas2 = fct.fct( content, target, fct.selector);
            if ( ideas2) ideas = ideas.concat( ideas2);
        }        
        return ideas;
    } // UDE_ideas.getIdeas()

    fillIdeasBox( prompt, targetId) {
        String.prototype.hashCode = function() {  
            var hash = 0;var i, chr;  
            if (this.length === 0) return hash;  
            for ( i = 0; i < this.length; i++) {
                chr = this.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0;
            }  
            return hash;
        }
        let params = {
            provider: "GooseAi",
            action: "complete",
            text:prompt,
            cacheTag:'textgen_'+prompt.hashCode(),
            nb:5,
            lang:'fr',
            engine : 'gpt-neo-20b',
            dataSource : 'gentext',
            dataTarget : 'UD_spare'
        };
        let servicePr = $$$.servicePromise( 'textgen', params);
        servicePr.then( () => {
            let display = "";
            let ideas = $$$.json.parse( $$$.dom.element( 'UD_spare').textContent);
            for ( let ideai = 0; ideai < ideas.length; ideai++) { 
                let idea =  ideas[ ideai].replace( /\'/g, "\\'");
                let ideaClick = "$$$.insertTextAtCursor( '" + idea + "');";            
                display += '<a class="idea" onclick="' + ideaClick +'">'+ideas[ ideai]+'</a>';
            }
            $$$.dom.element( targetId).innerHTML = display;
        })
    }
    
    addIdeasFctToList( ideaFctSelect, fcts) {
        if ( typeof this.ideaFcts[ ideaFctSelect] != "undefined" ) {
            let fctsToUse = this.ideaFcts[ ideaFctSelect];
            for ( let fcti=0; fcti < fctsToUse.length; fcti++) fcts.push( { selector: ideaFctSelect, fct: fctsToUse[ fcti]});
        }
        return fcts;
    }

} // JS class UDE_menu_ideas

function UDE_ideas_init() {
    if ( typeof window.MENU == "object") {
        window.MENU.ideasHandler = new UDE_ideas( window.MENU);
        return window.MENU.ideasHandler;
    } else {
        // Try again later
        // 2DO use a global variable to stop after afew tries, or increase time between tries
        setTimeout( function() { UDE_ideas_init();}, 1000);
    }
    return null;
}
if ( typeof process != 'object') {
   UDE_ideas_init(); // !!! Not initialised by ude
} else {
    // Testing under node.js 
    module.exports = { class:UDE_ideas};
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined" && typeof ModuleUnderTest == "undefined") {
        // Auto test
        console.log( 'Syntax:OK');            
        console.log( 'Start of UDE_ideas class test program');
        console.log( "Setting up browser (client) test environment"); 
        ModuleUnderTest = "udeideas";
        let path = "..";
        const testMod = require( path+'/tests/testenv.js');      
        testMod.load( []);
        let ud = new UniversalDoc( 'document', true, 133); 
        const menuMod = require( path+'/ude-view/udemenu.js'); 
        let menuManager = menuMod.init();
        let ideasHandler = UDE_ideas_init();
        let test = "Test 1 calling ideas fct";
        window.test1 = false;
        let myFct = function( element) { console.log( "MyFct called"); window.test1 = true; return [];}
        ideasHandler.registerIdeasFunction( 'h2', myFct);
        ideasHandler.getIdeas( "", 'source_h2a');
        testResult(test, window.test1, window.test1);
        // End of auto-test        
        console.log( "Test completed");
        process.exit();        
    }
}