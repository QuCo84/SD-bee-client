//const { UDEclickHandler } = require("../app/helpers/udeclickhandler.js");

function loadTestEnvironment( requiredModules=[], testPage="") {
    TEST_verbose = false;
    TEST_serverSaving = false;
    Node = { TEXT_NODE:3, ELEMENT_NODE: 1};
    const jsdom = require( "jsdom");
    JSDOM = jsdom.JSDOM;
    // Setup a page
    if ( testPage == "") {
        const fsmod = require('fs');
        try {
            testPage = fsmod.readFileSync( __dirname + '/test.html', { encoding: 'utf8', flag:'r' });
        } catch (err) {
            console.log(err + " in " + __dirname);
            process.exit(1);
        }
    }
    domjs = new JSDOM( testPage, {features : {QuerySelector: true}});
    window = domjs.window;
    window.topElement = window.document.getElementById( "document");                 
    document = window.document;
    window.udparams = {
        AutoIndex_element:1, 
        AutoIndex_table:10, AutoIndex_list:10, AutoIndex_text:10, AutoIndex_graphic:10 
    };
    // Insert parameters into page
    const fs = require( 'fs');
    const path = require( 'path');
    const data = fs.readFileSync( path.resolve( '../app/config/udconstants.json'));
    let config = JSON.parse( data);
    /* DEPRECATEDconst infoHolder = window.document.getElementById( "UD_tagAndClassInfo");
    infoHolder.textContent = JSON.stringify( config[ "UD_exTagAndClassInfo"]);*/
    //console.log( infoHolder.textContent.substr( 2000, 2000), infoHolder);
    // Setup app environment
    requirejs_app = "";
    var debugmod = require( '../app/helpers/debug.js');
    debug = debugmod.debug;
    dumpElement = debugmod.dumpElement;
    testResult = debugmod.testResult;
    debug_callerFct = debugmod.debug_callerFct;
    RegisterBlock = debugmod.RegisterBlock;
    ShowBlock = debugmod.ShowBlock;
    L_new = debugmod.L_new;
    doOnload = debugmod.doOnload;
    doOnupdate = debugmod.doOnupdate;
    doControl = debugmod.doControl;
    APIreturnType = debugmod.APIreturnType;
    convertToObject = debugmod.convertToObject;
    htmlEntities = debugmod.htmlEntities;
    htmlEntities2 = debugmod.htmlEntities2;
    stripScripts = debugmod.stripScripts;
    stripStyles = debugmod.stripStyles;
    stripScriptsAndStyles = debugmod.stripScriptsAndStyles;
    DEBUG_level = 5;
    window.DEBUG_level = DEBUG_level;
    const udconstants = require( "../app/config/udconstants.js");
    UD_defaultContentByExTag = udconstants.UD_defaultContentByExTag;
    UD_insignificantWords = udconstants.UD_insignificantWords;
    UD_viewClasses = udconstants.UD_viewClasses;
    UD_exTagAndClassInfo = udconstants.UD_exTagAndClassInfo;
    UD_appAttributes = udconstants.UD_appAttributes;
    UD_domAttributes = udconstants.UD_domAttributes;
    UD_styleAttributes = udconstants.UD_styleAttributes;
    UD_indexableTags = udconstants.UD_indexableTags;
    UD_lowerCaseAttr = udconstants.UD_lowerCaseAttr;
    UD_useComputedPrefix = udconstants.UD_useComputedPrefix;
    UD_wellKnownElements = udconstants.UD_wellKnownElements;
    UD_terms = udconstants.UD_terms;
    UD_moduleLabels = udconstants.UD_moduleLabels;
    const udregisterMod = require( "../app/config/udregister.js");
    UD_register = udregisterMod.UD_register;
    const udjsonMod = require( "../app/$$$/udjson.js");
    UDJSON = udjsonMod.UDJSON;
    const domvalueMod = require( "../app/helpers/domvalue.js");
    DOMvalue = domvalueMod.DOMvalue;
    const domMod = require( "../app/helpers/dom.js");
    DOM = domMod.DOM;
    DOM_cursor = domMod.DOM_cursor;
    DOMvalue = domMod.DOMvalue;
    JSONparse = domMod.JSONparse;
    JSONvalue = domMod.JSONvalue;
    const udajaxMod = require( "../app/helpers/udajax.js");
    UDAJAX = udajaxMod.UDAJAX;
    // Load editor UDE
    const udeconstants = require( "../app/config/udeconstants.js");
    UDE_attributeValues = udeconstants.UDE_attributeValues; 
    UDE_availableActions = udeconstants.UDE_availableActions; 
    UDE_textEditTypes = udeconstants.UDE_textEditTypes;
    const udeClickMod = require( '../app/helpers/udeclickhandler.js');
    UDEclickHandler = udeClickMod.UDEclickHandler;
    const udeMod = require( "../app/ude.js");
    UDE = udeMod.UDE;
    UDEcalc = udeMod.CALC;
    // API extensions
    API = null;
    // Load Utilities API    
    const udutilities = require( "../app/$$$/udutilities.js");
    UDutilities = udutilities.class;
    // Load Resource API    
    const udresources = require( "../app/$$$/udresources.js");
    UD_ressources = udresources.class;
    UD_ressources_init = udresources.init;
    // Load Content API        
    const udcontent = require( "../app/$$$/udcontent.js");
    UD_content = udcontent.class;
    UD_content_init = udcontent.init;
    const apiMod = require( "../app/$$$/udapi.js");
    UDapi = apiMod.class;
    const modMod = require( "../app/$$$/udmodule.js");
    UDmodule = modMod.class;
    const udMod = require( "../app/ud.js");
    UniversalDoc = udMod.UniversalDoc;
    UDapiRequest = udMod.UDapiRequest;
    UDapiBuffer_requests = udMod.UDapiBuffer_requests;    
    setupAPI = apiMod.init;
    UDapiSet1 = apiMod.SET1;
    const zoneMod = require( "../app/tools/zone.js");
    Zone = zoneMod.class;
    const textMod = require( "../app/elements/udetext.js");
    UDEtext = textMod.UDEtext;
    const menuMod = require( "../app/helpers/udemenu.js");
    UDE_menu = menuMod.class; 
    const layoutMod = require( "../app/helpers/udelayout.js");
    UDE_layout = layoutMod.class; 
    DOM_lastAccessedValues = [];    
    k_terms_close="close";
    window.lang = "FR"; // document.getElementById( 'UD_lang').textContent;
    window.scroll = function() {};
    module = {};
    const htmlMod = require( "../app/elements/udehtml.js");
    UDEhtml = htmlMod.UDEhtml;
    ejs = require("ejs/ejs.min.js");
    const request = require( 'request');
    window.request = request;
    const UDincludePath = "https://www.sd-bee.com/upload/";
    window.UDincludePath = UDincludePath;
    return window;
}
function extendAPI( requiredModules=[]) {
}

function TEST_requireSetup( mods, fct=null) {
    // let baseURL = "C:/Users/Quentin/Documents/GitHub/smartdoc/";   
    let baseURL = "D:/GitHub/smartdoc/";   
    requirejs = require( '../../r.js');    
    requirejs.config({
        baseUrl:baseURL,
        paths: {
            vendor: "../vendor"
        },
        nodeRequire: require
    });
    /*
    let modD = requirejs( 'vendor/dayjs/dayjs.min');
    requirejs( 'vendor/dayjs/plugin/relativeTime');
    requirejs( 'vendor/dayjs/plugin/customParseFormat');
    requirejs( 'vendor/dayjs/locale/fr');
    */
    /*
    let modD = requirejs( baseURL+'../node_modules/dayjs.min');
    requirejs( baseURL+'../node_modules/dayjs/plugin/relativeTime');
    requirejs( baseURL+'../node_modules/dayjs/plugin/customParseFormat');
    requirejs( baseURL+'../node_modules/dayjs/locale/fr');
    */
    // 2DO need dynamic version here
    let modD = {};
    for ( modi in mods) {  
        if ( false) {    
            let mod = mods[ modi].replace( "-v-0-1", "");        
            modD = requirejs( mod);
        } else {
            let version = document.getElementById( 'UD_version').textContent;
            if ( !version) version = "-v-0-1";
            let mod = baseURL+mods[ modi].replace( version, "");
            modD = require( mod);
            // console.log( modD);
        }
    }
    // setTimeout( function() { console.log( Inserter)}, 200);
    return fct(); // requirejs( mods, fct);
}                                  

function TEST_export( exportObj, useDefine) {   
    if ( useDefine) {
        // requirejs called over nodejs - use AMD for declaring moduke
        define ( function() { return function() { return exportObj;}});
    } else {
        // use node's module
        module.exports = { class: UDElist};
    }
}                
module.exports = { load: loadTestEnvironment, load2: extendAPI, require:TEST_requireSetup, exporter:TEST_export};