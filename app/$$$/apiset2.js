/** 
 *  UD API class UDapi - commands accessible via externalExchange DOM element.
 */
class UDapiSet2 {
    // Parameters
    moduleName = "apiSet2";
    // Modules    
    ud = null;
    dom = null;
	udajax = null;
    ude = null;
    calc = null;
    udeTable = null;
    udeList = null;	
    udeDraw = null;
    utilities = null;
    // Menu variables - might move to udemenu.js
    openMenu = null;
    menuOffsets = [
        { top:0, left: 0},
        { top: 15, left: 5 - 40},
        { top: 0, left: 10}        
    ];
    appEventHandlers = {};
    
    // setup UDapi
    constructor( udOrAPI) {
        if ( typeof API == "undefined") {
            // Just testing this set of methods
            this.ud = udOrAPI;
            if ( typeof this.ud.ude != "undefined") this.ude = this.ud.ude; else this.ude = ud;
            this.dom = this.ud.dom;
			this.udajax = this.ud.udajax;
            this.calc = this.ude.calc;
			this.udeTable = this.ude.modules[ "div.table"]["instance"];
		} else if ( udOrAPI == API) {
            // Called by API
            this.ud = API.ud;
            this.dom = API.dom;
            this.udajax = API.udajax;            
            this.utilities = API.utilities;
            API.addFunctions( this, [
                "addMenuOption", "toggleMenu", "showBotlog", "getKeywords", "updateZone", "deleteDoc",
                "appEvent", "listenAppEvent"
            ]);            
        }
    } // UDapiSet2.construct()

   /**
    * @api {JS} API.addMenuOption(menuName,optionName,label,action) Add a menu option and force menu display  
    * @apiParam {string} menuName Name of the menu where the option is to be added
    * @apiParam {string} option Name of the option
    * @apiParam {string} label Displayed label of the option
    * @apiParam {string} action Onclick JS code for menu option
    * @apiGroup Web pages    
    */
    addMenuOption( menuName, optionName, label, action) {
        // Find main menu
        let mainMenu = this.dom.element( "mainMenu");
        if ( !mainMenu) return false;
        let displayed = this.dom.attr( mainMenu, 'computed_display');
        if ( mainMenu.classList.contains( 'hidden')) {
            // If not displayed, display and hide banner            
            this.dom.element( 'banner').style.display = "none";
            mainMenu.classList.remove( 'hidden');
        }
        // Find menu
        let menu = this.dom.element( menuName+"Menu");
        if ( !menu) return false;   
        // Find menu level
        let level = 1;
        let walk = menu;
        let safe = 5;
        while ( walk != mainMenu && safe--) {
            walk = walk.parentNode; 
            level++;
        }
        // Adjust div.menuOption styles to number of options
        let forceWidth = "";
        if ( menuName == "main") {
            let options = this.dom.elements( 'div.menuOption', mainMenu);            
            if ( options.length >= 3) {
                let len = options.length + 2;                
                forceWidth = Math.floor( (100 - 2.4 - len) /(len))+"%";
                for ( let opti=0; opti < options.length; opti++) {
                    options[ opti].style.width = forceWidth;
                }
            }
            // Add sub-menu in main
            let main = this.dom.element( 'main');            
            let attr = { id:optionName+"Menu", class: "hidden optionLevel"+level+" "+optionName+"Option"};
            let option = this.dom.insertElement( 'div', "", attr, main, true, true);
        } else {
            // Tell main menu menu has options
            // 2DO for multi-levels, search parent in attr
            let parentOption = this.dom.element( 'main'+menuName);
            if ( parentOption) parentOption.classList.add("hasSubMenu");
        }
        // Add option to menu
        let attr = ( menuName == "NEVERmain") ? { class: "menuOption", onmouseenter: action, onmouseout: action  }
            : { id: menuName+optionName, class: "menuOption", onclick:action};
        if ( forceWidth) attr.style = "width:"+forceWidth+";";
        let useLabel = API.translateTerm( label);
        this.dom.insertElement( 'div', useLabel, attr, menu, true, true);
       

        return true;
    }
    
   /**
    * @api {JS} API.toggleMenu(menuName) Display/hide menu  
    * @apiParam {string} menuName Name of the menu to display/hide  
    * @apiGroup Web pages      
    */
    toggleMenu( menuName, selector=null) {
        let menu = this.dom.element( menuName+"Menu");
        if ( !menu) return false;   
        if ( menu.classList.contains( 'hidden')) {
            // Hide open menu
            if ( this.openMenu) this.toggleMenu( this.openMenu.id.replace( "Menu", ""));
            // Determine menu's level
            let optionLevel = -1;
            menu.className.split( ' ').forEach( className => {
                if ( className.indexOf( 'optionLevel') == 0) {
                    optionLevel = parseInt( className.replace( 'optionLevel', ''));
                }
            });
            // Position menu below selector            
            console.log( "toggle", selector.offsetTop, selector.offsetLeft);
            menu.style.top = (selector.offsetTop + this.menuOffsets[ optionLevel].top)+"px";
            menu.style.left = (selector.offsetLeft + this.menuOffsets[ optionLevel].left)+"px";
            menu.style.width = selector.clientWidth;
            menu.classList.remove( 'hidden');
            // Change menu selector's style 2DO use selector
            menu.parentNode.classList.add( 'menuOpen');
            this.openMenu = menu;
        } else {
            menu.parentNode.classList.remove( 'menuOpen');
            menu.classList.add( 'hidden');
            this.openMenu = null;
        }
    }
    /**
    * @api {JS} API.showBotlog(targetOrId) Show Botlog   
    * @apiParam {string} targetOrId Element or its id where to place display, default = system popup 
    * @apiGroup Hooks  
    */
    // 2DO Mobe to botlogUpdate( get)
    showBotlog( targetOrId="system-message-popup") {
        let target = this.dom.element( targetOrId);
        let botlog = this.dom.element( UD_wellKnownElements[ 'botlog']);
        // alsp let botlog = window.ud.botlog;
        if ( !target || !botlog) return false;
        // Copy botlog contents
        // 2DO last entries 
        if ( target.innerHTML == botlog.innerHTML) {
            target.innerHTML = "";
        } else {
            target.innerHTML = botlog.innerHTML;
            let lineCount = this.dom.elements( "br", target).length;
            // Display 
            // 2DO position and style
            // 2DO manual close
            // target.style.display = "block";
            target.scrollTop = ( lineCount-6)*20;
            target.classList.add( 'botlogDisplay');
            // Setup auto close
            setTimeout( function() { 
                let target = API.dom.element( targetOrId);
                target.classList.remove( 'botlogDisplay');
                // target.style.display="none";
                target.style.top = "50%";
            }.bind( null, targetOrId), 50000);
        }    
    }

    _getWords( text) {
        let words = [];
        let word = "";
        let lastCharIsUpper = false;
        // Remove accents
        text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        for ( let ci = 0; ci < text.length; ci++) {
            let char = text[ ci];
            let charIsUpper = (  char.toUpperCase() == char);
            if ( " .,;?!-_".indexOf( char) > -1) { 
                if (word) { words.push( word);}
                word = "";
            } else if ( charIsUpper && !lastCharIsUpper) {
                if (word) { words.push( word);}
                word = "" + char;
            } else { 
                word += "" + char;
            }
            lastCharIsUpper = charIsUpper
        }
        if ( word) { words.push( word);} //window.ud.ude.calc.removeAccentsAndLower(
        return words;
    }
    _isSignificant( word) {   
        let lang = API.dom.element( 'UD_lang').textContent;           
        if ( !word.trim() || UD_insignificantWords[ lang].indexOf( word) > -1) { return false;}
        return true;
    }
    getKeywords( text) {
        let result = [];
        let words = this._getWords( text);
        for ( let wordi = 0; wordi < words.length; wordi++) {
            let word = words[ wordi];
            /*
            let p1 = word.indexOf('[');
            if ( p1 > -1) {
                // Word has a POS attached
                let pos = word.substr( p1+1, word.indexOf(']')-p1-1);
                word = word.substr( 0, p1);
                if ( typeof keywords[ pos] == "undefined") keywords[ pos] = [];
                keywords[pos].push( word);                        
            }
            */
            word = window.ud.ude.calc.removeAccentsAndLower( word); 
            if ( this._isSignificant( word)) { result.push( word.toLowerCase());}
        }
        return result;
    }       
       
    updateZone( oid, zoneId) {
       return  this.ud.udajax.updateZone( oid, zoneId);
    }
    
    deleteDoc( oid = "") {
        if ( !oid) {
            // Secure check mode
            let mode = $$$.dom.textContent( 'UD_mode');
            if ( [ 'edit2', 'edit3'].indexOf( mode) == -1) return;
            // OK Delete in Manage doc page 
            oid = this.dom.attr( 'document', 'ud_oid');
        }
        let oidA = oid.split('--')[1].split('-');
        let oidStr = "UniversalDocElement--" + oidA.join('-') + "--SP|" + ( Math.round( oidA.length/2) - 1);// + "|WB|1";
        // Simulate form 
        let uri = "/webdesk/" + this.dom.attr( 'document', 'ud_oidchildren') + "/AJAX_modelShow/";
        let prompt = API.translateTerm( "Are you sure ?")
        if ( confirm(prompt)) {
            let postData = "form=INPUT_UDE_FETCH&input_oid="+oidStr+"&iaccess=0&tlabel=owns";
            let context = {zone: 'document', element: null, action:"fill zone", setCursor:false, ud:this.dataSource};
            this.ud.udajax.serverRequest( uri, "POST", postData, context);
        }
    }  

    appEvent( eventName, data={}) {
        let handler =  this.appEventHandlers[ eventName];
        if ( handler) {
            handler( data);
        }

    }

    listenAppEvent( eventName, fct) {
        this.appEventHandlers[ eventName] = fct;
        /* Multiple handlers would need a filter
        let handlers =  this.appEventHandlers[ eventName];
        if ( !handlers) this.appEventHandlers[ eventName] = [ fct];
        else this.appEventHandlers[ eventName].append( fct);
        */
    }
/*

   / **
	* Insert a new item into a list.
	* @param {string} elementId Id of <ul> element, 0 for cursor position
	* @param {integer] index Index of item to install after, -1 for top
	* @param {string} data Content of list item
	* /   
	insertItemInList( listId, index, data) {
		if ( !this.udeList) this.udeList = this.ude.modules[ "div#list"][instance];
		if ( !this.udeList) return "ERR:function unavailable";
		return this.udeList.insertItem( listId, index, data); 
	}	
	
  / **
	* Delete an item from a list.
	* @param {string} elementId Id of <ul> element, 0 for cursor position
	* @param {integer] index Index of item to delete
	* /
    deleteItemFromList( listId, index) {
		if ( !this.udeList) this.udeList = this.ude.modules[ "div#list"][instance];
		if ( !this.udeList) return "ERR:function unavailable";
		return this.udeList.deleteItem( listId, index); 
    }
*/    
}

if ( typeof process == 'object')
{
    // Testing under node.js
    module.exports = { class: UDapiSet2};    
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined") {  
        console.log( "Syntax OK");
        console.log( 'Test completed'); 
    }        
} // End of test routine