/**
 * In-doc menu or floating menu client-side class
 */
class UDE_ideas {
    parent;
    dom;
    ude;
    ideaFcts = {};
    unfinishedSentence = "";
    currentGPT = "";
    currentId = "";
    
    constructor( menu) {
        this.parent = menu;
        this.dom = menu.dom;
        this.ude = menu.ude;
        // Add API fcts
        if ( API) { API.addFunctions( this, [ 
            "registerIdeasFunction", "getIdeas", "fillIdeasBox"
        ]);}
                  
    }

    event( e) {
        if ( e.event == 'open') {
            // Ideas panel just opened
            this.currentGPT = "";
            this.currentId = "";
        }
    }
    
    registerIdeasFunction( selector, fct) {        
        if ( typeof this.ideaFcts[ selector] == "undefined")
            this.ideaFcts[ selector] = [fct];
        else
            this.ideaFcts[ selector].push( fct);
        return true;
    } // UDE_menu_ideas.registerIdeas()
    
    getIdeas( keywords, elementOrId, checkForContent = false, target = 'UD_spare') {
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
        let classes = this.dom.keepPermanentClasses( element.className).split( ' ');
        for ( let classi = 0; classi < classes.length; classi++) {
            // Look for fcts registered under element's user-chosen classes
            fcts = this.addIdeasFctToList( exTag + '.' + classes[ classi] , fcts);
        } 
        // Check for content true if fcts to call
        if ( checkForContent) return (fcts.length > 0);
        // Call ideas fcts and concat results
        for ( let fcti=0; fcti < fcts.length; fcti++) {
            let fct = fcts[ fcti];
            let ideas2 = fct.fct( element, fct.selector);
            if ( ideas2) ideas = ideas.concat( ideas2);
        }        
        return ideas;
    } // UDE_ideas.getIdeas()

    fillIdeasBox( elementOrId, selector) {
        // Find ideas box
        let element = this.dom.element( elementOrId);
        let panel = (element) ? element.previousSibling : null;
        if ( !panel) return;
        let ideasBox = this.dom.element( 'div.ideasBoxBulma', panel);
        if ( !ideasBox) return; 
        // Get existing ideas
        let existingIdeas = "";
        if ( element.id == this.currentId) existingIdeas = this.currentGPT;
        else { 
            this.currentId = element.id;
            this.currentGPT = "";
            this.unfinishedSentence= "";
            existingIdeas = "";
        }
        // Search for a model of prompts based on cass of element or previous siblings
        let promptIndex = 0;
        /*
        let prompts = this.getModelPrompts( element);       
        let prompt = prompts[ promptIndex];
        let topic = this.getTopic( element);
        let audience = this.getAudience( element);
        */
        let prompt = this.buildPrompt( element);
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
        let provider = "OpenAI";
        let cacheTag = 'textgen_'+(prompt+provider).hashCode()
        let params = {
            provider: provider,
            action: "complete",
            text:element.textContent,
            prompt : prompt,
            //modelPrompt : prompt,
            //topic : topic,
            //audience: audience,
            //cacheTag:'textgen_'+(prompt+topic+audience+existingIdeas).hashCode(),
            cacheTag: cacheTag,
            iterations:10,
            max_tokens : 50,
            lang:$$$.getLang( element).toLowerCase(),
            engine : 'gpt-neo-20b',
            dataSource : 'gentext',
            dataTarget : 'UD_spare'
        };
        let servicePr = $$$.servicePromise( 'textgen', params);
        servicePr.then( () => {
            let display = "";
            console.log( "Handling prompt " + promptIndex);
            // Get ideas returned by server
            let gpt = $$$.json.parse( $$$.dom.element( 'UD_spare').textContent);
            // Store generated text to use for searching further ideas
            this.currentGPT += gpt.join( '');
            // Build sentences, eliminate empty items etc
            let ideas = this.buildIdeas( gpt);
            // 2DO Launch new request based on answers
            // Inject ideas into suggestions box
            for ( let ideai = 0; ideai < ideas.length; ideai++) { 
                let idea =  ideas[ ideai].replace( /\'/g, "\\'");
                let ideaClick = "$$$.insertTextAtCursor( '" + idea + "');";            
                display += '<a class="idea" onclick="' + ideaClick +'">'+ideas[ ideai]+'</a>';
            }
            let panel = (element) ? element.previousSibling : null;
            if ( !panel) return;
            let ideasBox = this.dom.element( 'div.ideasBoxBulma', panel);
            if ( ideasBox.textContent.length < 20) ideasBox.innerHTML = "";
            ideasBox.innerHTML += display;
        })
    }

    isCode( text) {
        if ( text.indexOf( '<?') > -1 || text.indexOf( '?>') > -1) return true;
        if ( (text.match(/\$/g) || []).length > text.length/100) return true;
        let e = new RegExp( "\\([^\\)]*\\)/", 'g');
        if ( (text.match( e) || []).length > text.length/100) return true;
        return false;
    }
    
    buildIdeas( gpt) {       
        let ideas = [];        
        for ( let gpti=0; gpti < gpt.length; gpt++) {
            // Split on . and integrate / detect unfinished sentences            
            let sentences = gpt[ gpti].split( '.');
            if ( this.unfinishedSentence) {
                sentences[0] = this.unfinishedSentence + sentences[0];
                this.unfinishedSentence= "";
            }
            if ( gpt[ gpt.length-1] != '.') {
                this.unfinishedSentence = sentences.pop(); 
            }
            let lastWasNumber = false;
            let thereAreNumbers = false;
            for ( let senti=0; senti < sentences.length; senti++) {
                let sentence = sentences[ senti].trim();
                if ( !sentence) continue;
                if ( !isNaN( sentence)) {
                    // Detect then remove 1. 2.
                    lastWasNumber = true;
                    thereAreNumbers = true;
                    continue;
                }
                if ( sentence.length < 3) continue; // Remove A. B. etc
                if ( 
                    sentence.indexOf( 'http') > -1 || sentence.indexOf( 'more info') > -1 
                    || sentence.indexOf( 'download') > -1 || sentence.indexOf( '<|endoftext|>') > -1
                    || this.isCode( sentence)
                ) continue;
                if ( thereAreNumbers) {   
                    if ( lastWasNumber) ideas.push( sentence + '.<br>');
                    lastWasNumber = false;
                } else ideas.push( sentence + '.<br>');
            }
        }
        return ideas;
    }

    addIdeasFctToList( ideaFctSelect, fcts) {
        let currentFcts = fcts.map( (f) => f.fct.name);
        if ( typeof this.ideaFcts[ ideaFctSelect] != "undefined" ) {
            let fctsToUse = this.ideaFcts[ ideaFctSelect];
            for ( let fcti=0; fcti < fctsToUse.length; fcti++) {
                let fct = fctsToUse[ fcti];
                if ( currentFcts.indexOf( fct.name) == -1) fcts.push( { selector: ideaFctSelect, fct: fct});
            }
        }
        return fcts;
    }

    /**
     * Get model prompt from class info by examining classes of element and those that came before
     * @param {*} element 
     * @returns 
     */
    buildPrompt( element, current) {
        let prompt = "";
        let models = this.getModelPrompts( element);
        // if current
        // else 
        {
            let model = models[0];
            if ( model) {
                let v = { topic: this.getTopic( element), audience: this.getAudience( element)};
                prompt = this.ude.calc.substitute( model, v);
            } else prompt = element.textContent;
        }
        prompt += this.currentGPT;
        return prompt;
    }
    /**
     * Get model prompt from class info by examining classes of element and those that came before
     * @param {*} element 
     * @returns 
     */
    getModelPrompts( element) {
        // Walk through previous elements until we find a class that has a gpt-prompt attribute
        let walk = element;
        let safe = 10;
        while ( walk && walk != this.dom.topElement && safe--) {
            let classes = this.dom.keepPermanentClasses( walk.className).split( ' ');
            for ( let cli=0;cli < classes.length; cli++) {
                let exTag = this.dom.attr( walk, 'exTag');
                let prompt = $$$.getTagOrStyleInfo( exTag + '.' + classes[ cli], 'gpt-prompt');
                if ( !prompt) prompt = $$$.getTagOrStyleInfo( classes[ cli], 'gpt-prompt');
                if ( prompt) return prompt.split( '//');
            }
            if ( walk.tagName == "H1") walk = null;
            walk = walk.previousElement;
        }
        return [""];
    }

    getTopic( element, checkPrevious=true) {
        let topic = "";
        // Walk through child elements until we find the topic class or a class with isTopic
        if ( element.classList.contains( 'topic')) topic = element.textContent;
        if ( !topic) {
            let children = this.dom.children( element);
            for( let childi=0; childi < children.length; childi++) {
                let child = children[ childi];
                if ( child.classList.contains( 'topic')) {
                    topic = child.textContent;
                    break;
                }
            }
        }
        if ( !topic && checkPrevious) {
            let walk = element.previousSibling;
            let safe = 10;
            while ( !topic && walk && walk != this.dom.topElement && safe--) {
                topic = this.getTopic( walk, false);
                walk = walk.previousSibling;
            }
        }
        // Walk through previous elements until we find the topic class or a class with isTopic
        return topic;
    }

    getAudience( element, checkPrevious=true) {
        let audience = "";
        // Walk through child elements until we find the topic class or a class with isTopic
        if ( element.classList.contains( 'audience')) audience = element.textContent;
        if ( !audience) {
            let children = this.dom.children( element);
            for( let childi=0; childi < children.length; childi++) {
                let child = children[ childi];
                if ( child.classList.contains( 'audience')) {
                    audience = child.textContent;
                    break;
                }
            }
        }
        if ( !audience && checkPrevious) {
            let walk = element.previousSibling;
            let safe = 10;
            while ( !audience && walk && walk != this.dom.topElement && safe--) {
                audience = this.getAudience( walk, false);
                walk = walk.previousSibling;
            }
        }
        // Walk through previous elements until we find the topic class or a class with isTopic
        return audience;
    }

} // JS class UDE_menu_ideas

function UDE_ideas_init() {
    if ( typeof window.MENU == "object") {
        window.MENU.ideasHandler = new UDE_ideas( window.MENU);
        return window.MENU.ideasHandler;
    } else {
        // Try again later
        // 2DO use a global variable to stop after afew tries, or increase time between tries
        setTimeout( function() { UDE_ideas_init();}, 100);
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