
let UDE_attributeValues = {
    "data-ude-edit" : {
        "on" : "All editing enabled (*default*)",
        "off"  : "No editing",
        "a CSV list" : {
            title: "Selected editing",
            items : {
                "delete" : "Enable deletion of complete element",
                "text" : "Enable text editing",
                "image" : "Enable image insertion an deletion",
                "field" : "Enable insertion, editing & deleting of fields"
            }
        }
    },
    "data-ude-menu" : {
        "on" : "All tools enabled (*default*)",
        "off"  : "No tools enabled",
        "a CSV list" : {
            title: "Selected tools",
            items : {
                "style" : "Enable deletion of complete element",
                "config" : "Enable text editing",
                "web" : "Enable image insertion an deletion",
                "ideas" : "Enable insertion, editing & deleting of fields"
            }
        }
    },
    "data-ude-autosave" : {
        "on" : "Enable auto saving of element (*default*)",
        "off" : "Disable auto saving",
    }
    /*
    defaultsByType : {
        p : { "data-ude-menu" : "on",},
        "div.css" : { "data-ude-autosave" : "off"},
    }
    */

}

let UDE_availableActions = { 
    "styler":{ apiFct:"displayStyle", icon:"/upload/smartdoc/resources/images/brush.png", label:"style", isDefault:true}, // Styler
    "config":{ apiFct:"configureElement", icon:"/upload/smartdoc/resources/images/tools.png", label:"config", isDefault:true},
    "cloud":{ apiFct:"displayCloud", icon:"/upload/smartdoc/resources/images/cloud-download-outline.png", label:"web", isDefault:true}, 
    "ideas":{ apiFct: "displayIdeas", icon:"/upload/smartdoc/resources/images/lightbulb-on-30.png", label: "ideas", isDefault:true},
    /*
    "config":{ apiFct:"configureElement", icon:"Config", label:"config", isDefault:true},
    "cloud":{ apiFct:"displayCloud", icon:"Cloud", label:"web", isDefault:true}, 
    "ideas":{ apiFct: "displayIdeas", icon:"Idea", label: "ideas", isDefault:true},
    */
    //"source":{ apiFct: "HTMLeditor", icon:"", isDefault:true, onlyTypes:[ "div.zoneToFill", "div.html"]},
    // "web":{ apiFct: "displayCloud", icon:"Cloud", isDefault:false},
    "expand" : { apiFct:"expand", label:"expand", onlyClasses:["collapsable"]},
    "collapse" : { apiFct:"collapse", label:"collapse", onlyClasses:["collapsable"]},
    "update" : { apiFct: "setChanged", icon:"Update", label:"update", args:"1", onlyTypes:[ "div.text", "div.css", "div.json", "div.html", "div.js"]},
    "restore" : { apiFct: "initialiseElement", icon:"Restore", label:"restore", onlyTypes:[ "div.text", "div.css", "div.json", "div.html", "div.js"]},
};

// let UDE_textEditTypes = ['linetext', 'server', 'css', 'json', 'js', 'api', 'resource'];
/*
let UDE_appAttributes = [  // Used by value()  improbe thru attr fct ? 
    'ude_datasrc', 'ude_formula', 'ude_bind', 'ude_editZone',
    'ude_autosave', '_datadest', 'udc_step'
];
*/

if ( typeof process == 'object') { 
    module.exports = { 
        UDE_attributeValues:UDE_attributeValues, 
        UDE_availableActions:UDE_availableActions, 
    };
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined") {
        console.log( "Syntax : OK");
        console.log( "Test completed");
    }
}
