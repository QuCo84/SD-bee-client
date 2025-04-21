/**
 * udehooks.js -- $$$ function calls and hooks used by Universal Doc Editor
 *  Copyright (C) 2023  Quentin CORNWELL
 *  
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const { getSyntheticLeadingComments } = require("typescript");

class UDEhooks {
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
    } 
/*
    // DOM access
    topElement() {}
    *element(ById)() {}
    *elementByName() {}
    *attr() {}   isEditable() {}
    *choose 1 getParentAttribute() {} parentAttr() {} getParentWithAttribute() {}
    elements() {} only used in ude once ?
    // Need when adding a new element
    insertElement() {}
    prpareForInsert() {}
    styleSelection() {} = menu

    // Ghost cursor
    *fetchCursor() {}
    *setCursor() {}
    setAt() {}
    saveCursor() {}
    restoreCursor() {}

    // Scroll
    *makeVisible() {}

    // UD structure
    *getSaveableParent() {}
    *getEditableParent() {}
    getDisplayableParent() {}
    *children() {}   childrenOfClass() {}    
    switchView() {}
    getView() {}
    getViewType() {}
    getViewClass() {}
    getSelector() {}

    // Value
    value() {}
    json.valueByPath() {}
    json.parse merge 

    // JSON100
    *putElement() {}
    *getElement() {}



    *translateTerm()
    
    // Variables
    autoHome
    autoIndex1, 2


    buildManagePart (udutilities.js)   .... buildView hook auto view fill
    preDocPostName   ... specific to managePart

    // these are app specific 
    copy
    deepCopy
    concatHTML
    getInlineHTML
    egaliseHeightOfClass
    arrangeTables, arrangeTable

    // Needed when editing model ... can wait for a name change
    nameChange
    dispatchNameChange
    dispatchClassChange
    
    */
}