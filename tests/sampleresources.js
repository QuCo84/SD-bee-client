/**
  * Sample ressource file
  * !!! IMPORTANT - variable name must be the same as file name
  */
const sampleresources = {
   /**
    * 1st level key values are free
    * data structure depends on action. Consult the corresponding API function for details
    */
   /**
    * Adding styles example. Defines summary and body style for paragraphs
    */   
    css : {
        action : "insert CSS rule",
        apiFct : "insertCssrule",    
        data : {
            "p.summary" : { map: "classes to add", width:"200px", height:"500px"},
            "p.body" : { map: "bold"}
        }
    },
    cssMap :{
        apiFct: "addCSSmap",
        data : { emphasized: "bootstrap-bold"}
    },
    load : {
        "action" : "loadFile",
        data : { src: "/bootstrap.css"}
    },
    elements : 
    {
        "action" : "putElement",
        "data" : {
            "meta": { "name": "UD_ressources"},
            "data" : {}
        }
    },
    functions : {
        "action" : "createUserFunction",
        "data" : {
            "name" : "myFct",
            "lines" : [
            ]
        }
    }
    
    classMap : {
        action : "add to class Map",
        apiFct : "updateClassMap",
        data : { 
            "div.part.doc": { "p" : [ "summary", "body", "knowMore"]}
        }
    }
};