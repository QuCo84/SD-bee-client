/**
 * UD constants
 */
 
 // 2DO Probably need  a class
 // 2DO Build a single table with all type info, with functions to access
 // 2DO make the generatable in PHP
 
let UD_exTagAndClassInfo = {};

let elementTypesByExTag = null;

function TEST_getElementType( element) {
    if ( !elementTypesByExTag) {
        for ( let typeLabel in elementTypes) {
            let elementType = elementTypes[ typeLabel];
            elementTypesByExTag[ elementType.exTag] = elementType;
        }
    }
    return elementTypesByExTag[ ud.dom.attr( element, 'exTag')].label;
}

let  UD_defaultContentByExTag = {
    "div.page":"",
    "div.part":"",
    "div.zone":"",
    h1: "...",                            // Titles
    h2: "...", 
    h3:"...", 
    h4:"...", 
    h5: "...", 
    h6: "...",      
    p: "...",
    li: "...",
    td: "...",
    th: "...",
    "p.sub_paragraph": "...",
    "div.table": "Table{AutoIndex_table}",
    "div.list": "List{AutoIndex_list}", 
    "div.graphic": "Illustration{AutoIndex_graphic}", 
    "div.linetext": "Text{AutoIndex_text}", 
    "div.server": "Server{AutoIndex_server}", 
    "div.css": "Style{AutoIndex_style}", 
    "div.js": "Javascript{AutoIndex_js}", 
    "div.json": "JSON{AutoIndex_json}",
    "div.connector": "Connector{AutoIndex_connector}",
    "div.zoneToFill": "zone{id}",
    "span.field": "...", 
    "span.button": "..."        
};

let UD_moduleLabels = {
    'siteExtract':"modules/connectors/udcsiteextract.js"
}
// List of viewTypes/Classes
// 2DO could be generated from class map 
/*
const UD_viewClasses = [
        "unconfigured", // Newly created view
        "doc", // Final user content 
        "app", // Not used replaced by public could be comments 
        "model", // Model data & ideas
        "language", // Terms and data for translation. Other parts can be declined by language 
        "data", // Data, connectors
        "clipboard", // Clips for clipboard initilaisation
        "system", // System styles, commands & programs 
        "page", // Paging information & styles
        "middleware", // Middleware styles, commands & programs
        "style", // App styles
        "program", // App programs
        "public"  // Public content for models
];
*/
const UD_insignificantWords = { 
    EN: [
        "and", "if", "but", "a", "an", "the", "of"
    ],
    FR : [
        "et", "si", "mais", "un", "une", "le", "la", "les", "du", "de", "des", "dans", "sont", "pour", "en", "type",
    ]
};

const UD_wellKnownClasses = {
    active : "active",
    hidden: "hidden",
    editing : "editing",    
}

const UD_wellKnownElements = {
    botlog : "BVU00000002200000M",
    docNameHolder : "BVU0000000810{userId_base32}_texts",
    UD_docParams: "UD_docParams_object"    
}

const UD_appAttributes = [ 
    'data-ud-iheight', 'data-ud-pageHeight', 'data-ud-offset', 'data-ud-cursor', 'data-ud-debug', 'data-ud-refresh', 'data-ud-mode',
    'data-ud-dupdated', 'data-ud-dchanged', 'data-ud-oid', 'data-ud-oidchildren', 'data-ud-dsent', 'data-ud-fields', 'data-ud-saveId',
    'data-ud-type', 'data-ud-subtype',  'data-ud-mime', 'data-ud-key', 'data-ud-extra', 'data-ud-attr', 'data-ud-hidden',
    'data-ud-onupdate', 'data-ud-onevent', 'data-ud-prepost', 'data-ud-model',
    'data-ud-content', 'data-ud-display', 'data-ud-follow', 'data-ud-dbaction',
    'data-ud-defaultPart', 'data-ud-quotes', 'data-ud-selection', 'data-ud-filter', 'data-ud-saveid',
    'data-ude-datasrc', 'data-ude-formula', 'data-ude-bind', 'data-ude-edit', 'data-ude-menu', 'data-ude-input', 
    'data-ude-stage', 'data-ude-mode', 'data-ude-autosave', 'data-ude-source', 'data-ude-onclick', 'data-ude-noedit', 
    'data-ude-place', 'data-ude-onclickformula', 'data-ude-rowidformula', 'data-ude-updateaction', 'data-ude-validate',
    'data-ude-editzone', 'data-ude-autoplay', 'data-ude-onvalid', 'data-ude-oninvalid',
    'data-ude-accept', 'data-ude-pageno', 'data-ude-check', 'data-ude-input', 'data-ude-form', 'data-ude-ui','data-ude-editzone',
    'data-ude-selection', 'data-ude-filter',
    'data-udc-step', 'data-udc-scenario',
    'data-udapi-quotes', 'data-udapi-callbackid', 'data-udapi-value1',
    'data-cb-type', 'data-cb-tags',
    'data-rb-time', 'data-rb-action',
    'data-ud-lang', 'data-from-model',
    //'_editable', '_dataset', '_add', 'target_id', '_onclick', '_type'
    /* legacy */
    'ud_iheight', 'ud_pageHeight', 'ud_offset', 'ud_cursor', 'ud_debug', 'ud_refresh', 'ud_mode',
    'ud_dupdated', 'ud_dchanged', 'ud_oid', 'ud_oidchildren', 'ud_dsent', 'ud_fields', 'ud_saveId', 
    'ud_type', 'ud_subtype',  'ud_mime', 'ud_key', 'ud_extra', 'ud_attr', 'ud_hidden', 
    'ud_onupdate', 'ud_onevent', 'ud_prepost', 'ud_model', 
    'ud_content', 'ud_display', 'ud_follow', 'ud_dbaction',
    'ud_defaultPart', 'ud_quotes', 'ud_selection', 'ud_filter', 'ud_saveid',
    'ude_datasrc', 'ude_formula', 'ude_bind', 'ude_edit', 'ude_menu', 'ude_edit',
    'ude_stage', 'ude_mode', 'ude_autosave', 'ude_source', 'ude_onclick', 'ude_noedit',
    'ude_place', 'ude_onclickformula', 'ude_rowidformula', 'ude_updateaction', 'ude_validate', 
    'ude_editZone', 'ude_autoplay', 'ude_onvalid', 'ude_oninvalid',
    'ude_accept', 'ude_pageno', 'ude_check', 'ude_input', 'ude_form', 'ude_ui', 'ude_editzone',
    'ude-selection', 'ude-filter',
    'udc_step',  'udc_scenario', 
    'udapi_quotes', 'udapi_callbackid', 'udapi_value1',
    'cb_type', 'cb_tags',
    'RB_time', 'RB_action',
    'ud_lang', 'fromModel',   

];
const UD_domAttributes = [
    'onclick', 'contenteditable', 'onchange', 'draggable', 'ondragstart', 'ondragend', 'ondrop', 
    'class', 'id', 'name', 'src', 'onscroll',
    'width', 'height', 'href', 'placeholder', 'title', 'tagName', 'style', 'type',
    '_editable', '_datadest', '_add', 'target_id', '_onclick', '_type', /* replaced with ude_datasrc 'datasrc',*/
    'x', 'y', "onmouseover", "onmousenter", "onmouseout", "value", "checked",
    "sandbox", "spellcheck", "max"
];

const UD_styleAttributes = [ // Style attributes to read via computedStyle
   'marginTop', 'marginLeft', 'marginBottom', 'marginRight',
];
/** 
 *  Doc on attributes of individual HTML elements. It is planned that they be prefixed with "data-"
 *  DEPRECATED - see UD_appAttributes above
 */
const UD_attributes = [       
    "ud_dupdated",          // The tick count when HTML element was updated from server. Set to 0 by server on initial loading, updated here
    "ud_dchanged",          // The tick count when HTML element was changed in browser. Set to 0 by server on initial loading, updated here
    "ud_oid",               // Unique Object Identifier in database for the HTML element. Set by server, read by ude.js.
    "ud_oidchildren",       // Unique Object Identifier in database for the HTML element with its children
    "ud_dsent",             // The tick count when an update was sent to server or a fetch requested. Set and cleared by ude.js.
    "ud_fields",            // List of fields to be saved fr this element. (Default absent = all)
    "ud_iheight",           // The height of the HTML element as known by the server. Set by the server. Not used yet
    "ud_textra",            // JSON-coded parameters that must be sent during updates. Set by the server, read by ude.hs.
    "ud_type",              // Qualifier for DIV elements used to dispatch processing
    "ud_content",           // JS call to get content to be saved (removes ude styles such as highlighting) 
    "ud_display",           // JS call to prepare content for display (resets ude styles such as highlighting)
    "ud_onupdate",          // Index to trigger action for update
    "ud_onevent",           // IDEA Group content, display & onupdate as 'content:1, update:2' 
    "ud_refresh",           // Boolean to control if element needs updating from server (achieved by a view event)   
];

const UD_indexableTags = ['table', 'ul'];
const UD_lowerCaseAttr = ['tagName', 'contenteditable'];

const UD_useComputedPrefix = "computed_"; // ex computed_height - get an element's computed style height

const UD_layoutPrefix = "LAY_";
const UD_themePrefix = "THEME_";
const UD_viewPrefix = "view";
if ( typeof process == 'object') { 
    global.UD_layoutPrefix = "LAY_";
    global.UD_themePrefix = "THEME_";
    global.UD_viewPrefix = "view";
}

const UD_dateFormats = [
    "YYYY-MM-DD",
    "YYYY-MM-DD hh:mm",
    "YYYY-MM-DD HH:mm",
    "YYYY-MM-DD HH:mm:ii",
    "DD/MM/YYYY",
    "MM/DD/YYYY",
    "DD/MM/YY",
    "MM/DD/YY"
];

// Quick solution for translated terms . Preference use DictionaryEntry. Used by API.translateTerm() (apiset1.js)
const UD_terms = {                          
        "This screen": "Cet écran",
        "genericMobile": "Mobile en portrait",
        "genericTabletLandscape" : "Tablette en paysage",
        "INPUT_addApage" : "INPUT_ajouterUnePage",
        "INPUT_addAdir" : "INPUT_ajouterUnRepertoire",
        "INPUT_addAtemplate" : "INPUT_ajouterUnModèle",
        "list": "liste",
        "emphasized": "faire sortir",
        "quoted": "citation",
        "chapter" : "chapitre",
        "sub-section" : "sous-section",
        "graphic": "illustration",
        "collapse": "réduire",
        "expand": "ouvrir",
        "delete": "effacer",
        "Available styles": "Styles disponibles",
        "Current style": "Style actuelle",
        "Available layouts": "Dispositions possibles",
        "Current layout": "Disposition actuelle",
        "Insertable elements": "Insérer un élément",
        "Click on an idea to add to your text": "Cliquez sur une idée pour l'insérer dans votre texte",
        "Use" : "Utiliser",
        "Back" : "Retour"
     };

const LINKSUSER_login = 1;

const UD_before = 0;
const UD_after = 1;
const UD_inside = 1;

if ( typeof process == 'object') { 
    module.exports = { 
        UD_defaultContentByExTag:UD_defaultContentByExTag, 
        UD_insignificantWords:UD_insignificantWords, 
        // UD_viewClasses:UD_viewClasses,
        UD_exTagAndClassInfo:UD_exTagAndClassInfo,
        UD_appAttributes:UD_appAttributes,
        UD_domAttributes:UD_domAttributes,        
        UD_styleAttributes:UD_styleAttributes,
        UD_indexableTags:UD_indexableTags,
        UD_lowerCaseAttr:UD_lowerCaseAttr,
        UD_useComputedPrefix:UD_useComputedPrefix,
        UD_wellKnownElements:UD_wellKnownElements,
        UD_terms:UD_terms,
        UD_moduleLabels:UD_moduleLabels
    };
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined") {
        console.log( "Syntax : OK");
        console.log( "Test completed");
    }
}