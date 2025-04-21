define({ "api": [
  {
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>Id of element to show</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "hideOthers",
            "description": "<p>If true hide all other elements of the same class as element id</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "api/udapi.js",
    "group": "C:\\Users\\Quentin\\Documents\\GitHub\\smartdoc\\api\\udapi.js",
    "groupTitle": "C:\\Users\\Quentin\\Documents\\GitHub\\smartdoc\\api\\udapi.js",
    "name": ""
  },
  {
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "index",
            "description": "<p>Index simple or list to a member of data</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "group": "C:\\Users\\Quentin\\Documents\\GitHub\\smartdoc\\ude-view\\udecalc.js",
    "groupTitle": "C:\\Users\\Quentin\\Documents\\GitHub\\smartdoc\\ude-view\\udecalc.js",
    "name": ""
  },
  {
    "type": "JS",
    "url": "API.dom.keepPermannetClasses(classStrList,saving=false)",
    "title": "Return className string with temporary classes removed and * in first character removed (to avoid this being removed)",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "classStrList",
            "description": "<p>Space or comma seperated list of classes (className attribute)</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "saving",
            "description": "<p>Remove also ud_type classes if list is to be saved to DB</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>The filtered space or comma seperated list</p>"
          }
        ]
      }
    },
    "group": "Classes_management",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Classes_management",
    "name": "JsApiDomKeeppermannetclassesClassstrlistSavingFalse"
  },
  {
    "type": "JS",
    "url": "dom.cursor.fetch()",
    "title": "",
    "group": "Cursor",
    "version": "0.0.0",
    "filename": "browser/domcursor.js",
    "groupTitle": "Cursor",
    "name": "JsDomCursorFetch"
  },
  {
    "type": "JS",
    "url": "dom.cursor.set()",
    "title": "",
    "group": "Cursor",
    "version": "0.0.0",
    "filename": "browser/domcursor.js",
    "groupTitle": "Cursor",
    "name": "JsDomCursorSet"
  },
  {
    "type": "JS",
    "url": "API.dom.value(path)",
    "title": "Read a value from DOM",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "path",
            "description": "<p>A path to the value with format: element.[index1.][index2.][attribute]</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "Array.HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>An array of HTML elements or null if not found</p>"
          }
        ]
      }
    },
    "group": "DOM",
    "version": "0.0.0",
    "filename": "browser/domvalue.js",
    "groupTitle": "DOM",
    "name": "JsApiDomValuePath"
  },
  {
    "type": "",
    "url": "API.json.merge(",
    "title": "target, source) Merge values in source with the target",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "target",
            "description": "<p>Object, JSON string or name of JSON string holder where to merge to</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "source",
            "description": "<p>Object, JSON string or name of JSON string holder with data to merge</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "Merged",
            "description": "<p>data as object or JSON string (same as target)</p>"
          }
        ]
      }
    },
    "group": "Data",
    "version": "0.0.0",
    "filename": "ud-utilities/udjson.js",
    "groupTitle": "Data",
    "name": "ApiJsonMerge"
  },
  {
    "type": "formula",
    "url": "column()",
    "title": "Convert  a date string to/from time-from-now",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "expr",
            "description": "<p>Expression to convert date or [today, tomorrow, yesterday, 1 month ago ...]</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>Converted expression [today, tomorrow, yesterday, 1 month ag ...] or date</p>"
          }
        ]
      }
    },
    "group": "Data",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Data",
    "name": "FormulaColumn"
  },
  {
    "type": "formula",
    "url": "multiCalc(json)",
    "title": "Resolve formulae in a JSON string",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "json",
            "description": "<p>Object or JSON representation</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "return",
            "description": "<p>Object with formula resolved or JSON reprsentation</p>"
          }
        ]
      }
    },
    "group": "Data",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Data",
    "name": "FormulaMulticalcJson"
  },
  {
    "type": "JS",
    "url": "API.checkAndWriteValue(path,value,expr)",
    "title": "Check and write a value",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "path",
            "description": "<p>The dotted expression where valid value is to be written</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "value",
            "description": "<p>The value to  be written</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "expr",
            "description": "<p>The expression to evaluate if value is valid</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "True",
            "description": "<p>if validated</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "string",
            "optional": false,
            "field": "Error",
            "description": "<p>message</p>"
          }
        ]
      }
    },
    "group": "Data",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Data",
    "name": "JsApiCheckandwritevaluePathValueExpr"
  },
  {
    "type": "JS",
    "url": "API.findAndUseModel(",
    "title": "json) Convert JSON to HTML",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>HTML</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Data",
    "version": "0.0.0",
    "filename": "ude-view/udemenu.js",
    "groupTitle": "Data",
    "name": "JsApiFindandusemodel"
  },
  {
    "type": "JS",
    "url": "API.json(jsonString,attrPath,value)",
    "title": "Read or write a value in a JSON representation",
    "description": "<p>Placed in a cell's formula, gives the cell's column index</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "jsonString",
            "description": "<p>JSON representation of data</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "attrPath",
            "description": "<p>Path to requested value using '/' ex level1/level2/level3</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "value",
            "description": "<p>Value to write, NULL if reading</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "return",
            "description": "<p>Written or read value or NULL if path not found</p>"
          }
        ]
      }
    },
    "group": "Data",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Data",
    "name": "JsApiJsonJsonstringAttrpathValue"
  },
  {
    "type": "js",
    "url": "API.json.parse(json)",
    "title": "Parse a JSON string, return null if syntax error",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "json",
            "description": "<p>JSON value to parse</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "object",
            "optional": false,
            "field": "Resulting",
            "description": "<p>object or null if error</p>"
          }
        ]
      }
    },
    "group": "Data",
    "version": "0.0.0",
    "filename": "ud-utilities/udjson.js",
    "groupTitle": "Data",
    "name": "JsApiJsonParseJson"
  },
  {
    "type": "js",
    "url": "API.json.read(jsonOrObject,key,postOp)",
    "title": "Read a value in an object",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "jsonOrObject",
            "description": "<p>JSON string or an object</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "key",
            "description": "<p>Name of attribute in object</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "postOp",
            "description": "<p>Empty string (default) for no op, otherwose incrementAfter, incrementAfterBase32, delete</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "Value",
            "description": "<p>read or modified (incrementAfter)</p>"
          }
        ]
      }
    },
    "group": "Data",
    "version": "0.0.0",
    "filename": "ud-utilities/udjson.js",
    "groupTitle": "Data",
    "name": "JsApiJsonReadJsonorobjectKeyPostop"
  },
  {
    "type": "js",
    "url": "API.json.readFromDiv(holderId,key,postOp)",
    "title": "Read a value from a JSON string stored n a container",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "holderId",
            "description": "<p>Id of an element containing the JSON string to read from</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "key",
            "description": "<p>Name of attribute in object</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "postOp",
            "description": "<p>Empty string (default) for no op, otherwose incrementAfter, incrementAfterBase32, delete</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "Value",
            "description": "<p>read or modified (incrementAfter)</p>"
          }
        ]
      }
    },
    "group": "Data",
    "version": "0.0.0",
    "filename": "ud-utilities/udjson.js",
    "groupTitle": "Data",
    "name": "JsApiJsonReadfromdivHolderidKeyPostop"
  },
  {
    "type": "js",
    "url": "API.json.value(jsonOrObjectOrId,key,value,operation)",
    "title": "Read, write or perfom an operation on a value in an object",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "jsonOrObjectOrId",
            "description": "<p>JSON string, object or id of a JSON string holder</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "key",
            "description": "<p>Name of attribute in object</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "value",
            "description": "<p>Null (default) for reading, otherwise value to write to attribute in object. When writing, holder is updated if id provided</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "operation",
            "description": "<p>Null (default) for simple reading or writing, set, delete, addToCSV, removeFromCSV, add (in array), remove (from array), incrementAfter, incrementAfterBase32</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "Value",
            "description": "<p>read or modified (incrementAfter) or object if an attriute was written value</p>"
          }
        ]
      }
    },
    "group": "Data",
    "version": "0.0.0",
    "filename": "ud-utilities/udjson.js",
    "groupTitle": "Data",
    "name": "JsApiJsonValueJsonorobjectoridKeyValueOperation"
  },
  {
    "type": "JS",
    "url": "API.json.valueByPath(jsonString,attrPath,value)",
    "title": "Read or write a value in a JSON representation",
    "description": "<p>Placed in a cell's formula, gives the cell's column index</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "jsonOrId",
            "description": "<p>JSON representation of data</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "attrPath",
            "description": "<p>Path to requested value using '/' ex level1/level2/level3</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "jsonOrObjectOrId",
            "description": "<p>JSON representation of data, an object or the id of an element holding the JSON respresentation</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "return",
            "description": "<p>Read value or NULL if not found</p>"
          }
        ]
      }
    },
    "group": "Data",
    "version": "0.0.0",
    "filename": "ud-utilities/udjson.js",
    "groupTitle": "Data",
    "name": "JsApiJsonValuebypathJsonstringAttrpathValue"
  },
  {
    "type": "js",
    "url": "API.json.write(jsonOrObject,key,value,operation)",
    "title": "Read, write or perfom an operation on a value in an object",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "jsonOrObject",
            "description": "<p>JSON string or an object</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "key",
            "description": "<p>Name of attribute in object</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "value",
            "description": "<p>Null (default) for reading, otherwise value to write to attribute in object.</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "operation",
            "description": "<p>Null (default) or set for simple writing, delete, addToCSV, removeFromCSV, add (in array), remove (from array), incrementAfter, incrementAfterBase32</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "Value",
            "description": "<p>read or modified (incrementAfter) or object if an attriute was written value</p>"
          }
        ]
      }
    },
    "group": "Data",
    "version": "0.0.0",
    "filename": "ud-utilities/udjson.js",
    "groupTitle": "Data",
    "name": "JsApiJsonWriteJsonorobjectKeyValueOperation"
  },
  {
    "type": "js",
    "url": "API.json.writeToDiv(holderId,key,value,operation)",
    "title": "Read, write or perfom an operation on a value in an object",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "holderId",
            "description": "<p>Id of element containing the JSON string to write to</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "key",
            "description": "<p>Name of attribute in object</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "value",
            "description": "<p>Value to write to attribute in object</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "operation",
            "description": "<p>Null (default) or set for simple writing, delete, addToCSV, removeFromCSV, add (in array), remove (from array), incrementAfter, incrementAfterBase32</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "Value",
            "description": "<p>read or modified (incrementAfter) or object if an attriute was written value</p>"
          }
        ]
      }
    },
    "group": "Data",
    "version": "0.0.0",
    "filename": "ud-utilities/udjson.js",
    "groupTitle": "Data",
    "name": "JsApiJsonWritetodivHolderidKeyValueOperation"
  },
  {
    "type": "JS",
    "url": "API.valueList(tableId,columnName)",
    "title": "Get values from table",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tableId",
            "description": "<p>Id of table</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "columnName",
            "description": "<p>Label of column</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "[string]",
            "optional": false,
            "field": "return",
            "description": "<p>List of text contents</p>"
          }
        ]
      }
    },
    "group": "Data",
    "version": "0.0.0",
    "filename": "modules/editors/udetable.js",
    "groupTitle": "Data",
    "name": "JsApiValuelistTableidColumnname"
  },
  {
    "type": "JS",
    "url": "checkValue(checkExpr,value)",
    "title": "true if value passes",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "checkFct",
            "description": "<p>The function to use for checking</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "value",
            "description": "<p>The text representation of the value to check</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "True",
            "description": "<p>if value passes</p>"
          }
        ]
      }
    },
    "group": "Data",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Data",
    "name": "JsCheckvalueCheckexprValue"
  },
  {
    "type": "JS",
    "url": "inBetween(value,min,max)",
    "title": "true if value in between min and max",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "value",
            "description": "<p>Numbe to check</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "min",
            "description": "<p>Lower boundary</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "max",
            "description": "<p>Higher boundary</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "True",
            "description": "<p>if value passes</p>"
          }
        ]
      }
    },
    "group": "Data",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Data",
    "name": "JsInbetweenValueMinMax"
  },
  {
    "type": "JS",
    "url": "inList(value,val1,val2,val3)",
    "title": "true if value is val1,val2 or val3",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "value",
            "description": "<p>Value to check</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "arguments",
            "description": "<p>List of allowed values</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "True",
            "description": "<p>if value found</p>"
          }
        ]
      }
    },
    "group": "Data",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Data",
    "name": "JsInlistValueVal1Val2Val3"
  },
  {
    "type": "JS",
    "url": "API.addToHistory(url)",
    "title": "Add to URL history",
    "description": "<p>Add a new page to the history of loaded URLs (for single-page mode)</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "url",
            "description": "<p>The URL to add to history. By default the url of current UD</p>"
          }
        ]
      }
    },
    "group": "Documents",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Documents",
    "name": "JsApiAddtohistoryUrl"
  },
  {
    "type": "JS",
    "url": "API.back()",
    "title": "Go back to previous page",
    "group": "Documents",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Documents",
    "name": "JsApiBack"
  },
  {
    "type": "JS",
    "url": "API.buildPartEditing(targetId)",
    "title": "Build part names editing zone from outline in ressources",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "targetId",
            "description": "<p>Id of View where editing names is to be placed</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "optional": false,
            "field": "Part",
            "description": "<p>names editing zone</p>"
          }
        ]
      }
    },
    "group": "Documents",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Documents",
    "name": "JsApiBuildparteditingTargetid"
  },
  {
    "type": "JS",
    "url": "API.configureElement(",
    "title": "name) Generate a \"configure\" event on an element and provide default processing of this event",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>Name of element to configure</p>"
          }
        ]
      }
    },
    "group": "Documents",
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "True",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Documents",
    "name": "JsApiConfigureelement"
  },
  {
    "type": "JS",
    "url": "API.createDocument(name=\"\")",
    "title": "Create a document in current directory",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>The document's name, default = New document</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "model",
            "description": "<p>The document's model</p>"
          }
        ]
      }
    },
    "group": "Documents",
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "Return",
            "description": "<p>The value set</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Documents",
    "name": "JsApiCreatedocumentName"
  },
  {
    "type": "JS",
    "url": "API.displayDocInPanel(docOID,panelName)",
    "title": "Display doc in side panel",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "docOID",
            "description": "<p>OID (DB identifier) of document</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "panelName",
            "description": "<p>Name of the panel to use (left or right)</p>"
          }
        ]
      }
    },
    "group": "Documents",
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "True",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Documents",
    "name": "JsApiDisplaydocinpanelDocoidPanelname"
  },
  {
    "type": "JS",
    "url": "API.env(key,",
    "title": "var) Set an ENViromental variable",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "style",
            "description": "<p>Style name</p>"
          }
        ]
      }
    },
    "group": "Documents",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Documents",
    "name": "JsApiEnvKey"
  },
  {
    "type": "JS",
    "url": "API.goTo(anchorId)",
    "title": "Center anchor",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "anchorIdOrNameOrPage",
            "description": "<p>Id or name of anchor</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "viewOrId",
            "description": "<p>Id of View</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "documentOid",
            "description": "<p>of Document</p>"
          }
        ]
      }
    },
    "group": "Documents",
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "True",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Documents",
    "name": "JsApiGotoAnchorid"
  },
  {
    "type": "JS",
    "url": "API.loadDocument(url)",
    "title": "Load an UD",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "url",
            "description": "<p>The URL of the UD</p>"
          }
        ]
      }
    },
    "group": "Documents",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Documents",
    "name": "JsApiLoaddocumentUrl"
  },
  {
    "type": "JS",
    "url": "API.ownerId()",
    "title": "Return 5 base 32 digits representing doc owner.",
    "group": "Documents",
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "Owner",
            "description": "<p>id in base 32, needed to access elements added at creation</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Documents",
    "name": "JsApiOwnerid"
  },
  {
    "type": "JS",
    "url": "API.reload(useAJAX=true,env=\"\")",
    "title": "Reload the current UD",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "useAJAX",
            "description": "<p>Default TRue. Use AJAX request of true else change page's location</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "env",
            "description": "<p>Optional string for ENViromental variable settings</p>"
          }
        ]
      }
    },
    "group": "Documents",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Documents",
    "name": "JsApiReloadUseajaxTrueEnv"
  },
  {
    "type": "JS",
    "url": "API.reloadView(viewId)",
    "title": "Reload a view",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "viewId",
            "description": "<p>Name of view</p>"
          }
        ]
      }
    },
    "group": "Documents",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Documents",
    "name": "JsApiReloadviewViewid"
  },
  {
    "type": "JS",
    "url": "API.setModel(modelName)",
    "title": "Set current UD's model, update server (in nstyle field) and refresh page with waiting message",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "modelName",
            "description": "<p>Name of model</p>"
          }
        ]
      }
    },
    "group": "Documents",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Documents",
    "name": "JsApiSetmodelModelname"
  },
  {
    "type": "JS",
    "url": "API.setStyle(style)",
    "title": "Set current element's style (in nstyle field)",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "style",
            "description": "<p>Style name</p>"
          }
        ]
      }
    },
    "group": "Documents",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Documents",
    "name": "JsApiSetstyleStyle"
  },
  {
    "type": "JS",
    "url": "API.setSystemParamaters(params)",
    "title": "Set system parameters of current UD",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "params",
            "description": "<p>List of attribute values</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "True",
            "description": ""
          }
        ]
      }
    },
    "group": "Documents",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Documents",
    "name": "JsApiSetsystemparamatersParams"
  },
  {
    "type": "JS",
    "url": "API.setUDparam(param,value)",
    "title": "Set parameter on current UD",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "param",
            "description": "<p>The name of the parameter</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "value",
            "description": "<p>The value to set</p>"
          }
        ]
      }
    },
    "group": "Documents",
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "Return",
            "description": "<p>The value set</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Documents",
    "name": "JsApiSetudparamParamValue"
  },
  {
    "type": "JS",
    "url": "API.switchView(name)",
    "title": "Switch displayed view",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>Name of view to display</p>"
          }
        ]
      }
    },
    "group": "Documents",
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "True",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Documents",
    "name": "JsApiSwitchviewName"
  },
  {
    "type": "JS",
    "url": "API.userId()",
    "title": "Return 5 base 32 digits representing user",
    "group": "Documents",
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "User",
            "description": "<p>id in base 32</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Documents",
    "name": "JsApiUserid"
  },
  {
    "type": "Formula",
    "url": "getLengthOfText(text)",
    "title": "Length of text",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "text",
            "description": "<p>Text to measure</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "integer",
            "optional": false,
            "field": "return",
            "description": "<p>Length of text</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "FormulaGetlengthoftextText"
  },
  {
    "type": "formula",
    "url": "=getLinks(htmlOrArray)",
    "title": "Return URL/URIs present in an HTML string or an array of HTML strings",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "integer",
            "optional": false,
            "field": "type",
            "description": "<p>The type of document or page: 1-model, 2-instance</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "oid",
            "description": "<p>DB's full path with parameters</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "target",
            "description": "<p>Id of element to be filled with server's response</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>JS to place in an onclick atribute</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "ude-view/udecalchtml.js",
    "groupTitle": "Elements",
    "name": "FormulaGetlinksHtmlorarray"
  },
  {
    "type": "formula",
    "url": "substituteFormulaeInElement(elementOrId)",
    "title": "Remove formulae from an element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "return",
            "description": "<p>HTML element without formulae in children</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Elements",
    "name": "FormulaSubstituteformulaeinelementElementorid"
  },
  {
    "type": "JS",
    "url": "API.clearClasses(elementOrId,clearClassesCSV)",
    "title": "Clear 1 or more classes",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "elementId",
            "description": "<p>Id of the element</p>"
          },
          {
            "group": "Parameter",
            "type": "[string]",
            "optional": false,
            "field": "classesCSV",
            "description": "<p>CSV list of classes to clear</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "return",
            "description": "<p>True if added</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "ude-view/ude.js",
    "groupTitle": "Elements",
    "name": "JsApiClearclassesElementoridClearclassescsv"
  },
  {
    "type": "JS",
    "url": "API.concatIf(tableId,valueToAdd,rowMatch)",
    "title": "Concatenation of a column for selected rows",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tableId",
            "description": "<p>Id of HTML table</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "valueToAdd",
            "description": "<p>Column name of value</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "rowMatch",
            "description": "<p>Reguar expression to select rows ow</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>Concantenation</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "modules/editors/udetable.js",
    "groupTitle": "Elements",
    "name": "JsApiConcatifTableidValuetoaddRowmatch"
  },
  {
    "type": "JS",
    "url": "API.dom.changeTag(elementOrId,",
    "title": "exTag) Change an element's tag",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its id or name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "exTag",
            "description": "<p>Extended tag syntax p or div.table</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>The filled HTML element</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomChangetagElementorid"
  },
  {
    "type": "JS",
    "url": "API.dom.childElements(elementOrId)",
    "title": "Get an HTML element's children",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "Array.HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>An array of HTML elements</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomChildelementsElementorid"
  },
  {
    "type": "JS",
    "url": "API.dom.childElements(elementOrId)",
    "title": "Get an HTML element's children",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "Array.HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>An array of HTML elements</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomChildelementsElementorid"
  },
  {
    "type": "JS",
    "url": "API.dom.childElements(elementOrId)",
    "title": "Get pages of document or view",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "Array.HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>An array of HTML elements</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomChildelementsElementorid"
  },
  {
    "type": "JS",
    "url": "API.dom.childElements(elementOrId)",
    "title": "Get the document's views",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "Array.HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>An array of HTML elements</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomChildelementsElementorid"
  },
  {
    "type": "JS",
    "url": "API.dom.children(elementOrId)",
    "title": "Get an element's saveable children",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "Array.HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>An array of HTML elements</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomChildrenElementorid"
  },
  {
    "type": "JS",
    "url": "API.dom.childrenOfClass(elementOrId,className)",
    "title": "Get children of a class",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "className",
            "description": "<p>Class of requested children</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "Array.HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>Array of HTML elements</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomChildrenofclassElementoridClassname"
  },
  {
    "type": "JS",
    "url": "API.dom.clearAttr(elementOrId,attrName)",
    "title": "Clear an attribute in a HTML element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "element",
            "description": "<p>The HTML element whose attribute is to be written or its id</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "value",
            "description": "<p>Read if null, clear attribute if &quot;<strong>CLEAR</strong>&quot;, otherwise set attribute</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "return",
            "description": "<p>Attribute's value, &quot;&quot; if element or attribute not found</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomClearattrElementoridAttrname"
  },
  {
    "type": "JS",
    "url": "API.dom.element(query,parentOrId=null)",
    "title": "Get an HTML element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "query",
            "description": "<p>The HTML element's Id, a selection query or an HTMLelement (returned as is)</p>"
          },
          {
            "group": "Parameter",
            "type": "HTMLelement",
            "optional": false,
            "field": "parent",
            "description": "<p>If not provided, query is Id otherwise query is query select</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "return",
            "description": "<p>The HTML element or null if not found</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomElementQueryParentoridNull"
  },
  {
    "type": "JS",
    "url": "API.dom.elements(query,parentOrId)",
    "title": "Get a set of HTML elements",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "query",
            "description": "<p>A selection query</p>"
          },
          {
            "group": "Parameter",
            "type": "HTMLelement",
            "optional": false,
            "field": "parent",
            "description": "<p>Where to look</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "afterId",
            "description": "<p>Only return elements with an id higher than this value</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "beforeId",
            "description": "<p>Only return elements with an id lower that this value</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "Array.HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>An array of HTML elements or null if not found</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomElementsQueryParentorid"
  },
  {
    "type": "JS",
    "url": "API.dom.extrAttr(elementOrId,attrName,value=null)",
    "title": "Read an \"extra\" attribute of an HTML element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "element",
            "description": "<p>The HTML element whose attribute is to be written or its id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "attrName",
            "description": "<p>Name of the attribute, special cases: starts with &quot;computed_&quot; use computed style, &quot;exTag&quot; = tag.ud_type</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "return",
            "description": "<p>Attribute's value, &quot;&quot; if element or attribute not found</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomExtrattrElementoridAttrnameValueNull"
  },
  {
    "type": "JS",
    "url": "API.dom.fillElement(elementOrId,html)",
    "title": "Set an element's contents",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its id or name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "html",
            "description": "<p>HTML or text</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>The filled HTML element</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomFillelementElementoridHtml"
  },
  {
    "type": "JS",
    "url": "API.dom.getBindedParent(elementOrId)",
    "title": "Get parent binded to another element (ude_bind attribute)",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>The displayeable HTML element</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomGetbindedparentElementorid"
  },
  {
    "type": "JS",
    "url": "API.dom.getDisplayableParent(elementOrId)",
    "title": "Get displayable parent of element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>The displayeable HTML element</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomGetdisplayableparentElementorid"
  },
  {
    "type": "JS",
    "url": "API.dom.getSaveableParent(elementOrId)",
    "title": "Get HTML elements with a selection query",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>The saveable HTML element</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomGetsaveableparentElementorid"
  },
  {
    "type": "JS",
    "url": "API.dom.getWidthAndHeightOfText(text)",
    "title": "{width, height}",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "text",
            "description": "<p>Text to measure</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>Length of text</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomGetwidthandheightoftextText"
  },
  {
    "type": "JS",
    "url": "API.dom.increment(elementOrId,attribute,amount=1)",
    "title": "",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>The HTML element or its id</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "attribute",
            "description": "<p>The name of the value to increment</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>Length of text</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomIncrementElementoridAttributeAmount1"
  },
  {
    "type": "JS",
    "url": "API.dom.insertElement(tag,data,attributes={},at=null,beforeOrAfter=false,inside=false)",
    "title": "Insert an element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tag",
            "description": "<p>Tag of HTML element</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "data",
            "description": "<p>Content of element as string, an element to copy or attributes</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "attributes",
            "description": "<p>Attributes with values  to set in element</p>"
          },
          {
            "group": "Parameter",
            "type": "HTMLelement",
            "optional": false,
            "field": "at",
            "description": "<p>Where to insert, null = cursor</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "beforeOrAfter",
            "description": "<p>Insert before (false, default) or After( true)</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "inside",
            "description": "<p>Insert inside at if true</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>Inserted element</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomInsertelementTagDataAttributesAtNullBeforeorafterFalseInsideFalse"
  },
  {
    "type": "JS",
    "url": "API.dom.insertPreparedElement(tag,data,attributes={})",
    "title": "Insert a prepared element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tag",
            "description": "<p>Tag of HTML element</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "data",
            "description": "<p>Content of element as string, an element to copy or attributes</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "attributes",
            "description": "<p>Attributes with values  to set in element</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>Unattached element</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomInsertpreparedelementTagDataAttributes"
  },
  {
    "type": "JS",
    "url": "API.dom.isInViewport(elementOrId)",
    "title": "True if view port",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "return",
            "description": "<p>True if visible</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomIsinviewportElementorid"
  },
  {
    "type": "JS",
    "url": "API.dom.isVisible(elementOrId,",
    "title": "containerTag) True if visible",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "return",
            "description": "<p>True if visible</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomIsvisibleElementorid"
  },
  {
    "type": "JS",
    "url": "API.dom.makeVisible(elementOrId,",
    "title": "containerTag) True if made visible",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "return",
            "description": "<p>True if visible</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomMakevisibleElementorid"
  },
  {
    "type": "JS",
    "url": "API.dom.parentAttr(elementOrId,attrName)",
    "title": "Get an attribute from an element or its context",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "attrName",
            "description": "<p>The attribute's name</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>The attribute's vale</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomParentattrElementoridAttrname"
  },
  {
    "type": "JS",
    "url": "API.dom.prepareToInsert(tag,data,attributes={})",
    "title": "Create an element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tag",
            "description": "<p>Tag of HTML element</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "data",
            "description": "<p>Content of element as string, an element to copy or attributes</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "attributes",
            "description": "<p>Attributes with values  to set in element</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>Unattached element</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomPreparetoinsertTagDataAttributes"
  },
  {
    "type": "JS",
    "url": "API.dom.removeClassFromChildren(elementOrId,",
    "title": "className) Remove class from descendance",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its id or name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "className",
            "description": "<p>Class to remove</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>The filled HTML element</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomRemoveclassfromchildrenElementorid"
  },
  {
    "type": "JS",
    "url": "API.dom.removeStylesFromHTML(html,matchToClass)",
    "title": "Remove styles from HTML",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "html",
            "description": "<p>HTML to process</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "matchToClass",
            "description": "<p>Match to a loaded CSS class if true</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>Cleasned HTML</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomRemovestylesfromhtmlHtmlMatchtoclass"
  },
  {
    "type": "JS",
    "url": "API.dom.siblings(elementOrId)",
    "title": "Get an element's siblings",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "return",
            "description": "<p>An array of HTML elements</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomSiblingsElementorid"
  },
  {
    "type": "JS",
    "url": "API.dom.siblings(elementOrId)",
    "title": "Empty an element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>The empty HTML element</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomSiblingsElementorid"
  },
  {
    "type": "JS",
    "url": "API.dom.textContent(elementsOrIds)",
    "title": "Get text content from 1 or more elements",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed[]",
            "optional": false,
            "field": "elementsOrIds",
            "description": "<p>Array of elements</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "return",
            "description": "<p>The Text content of the elements</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiDomTextcontentElementsorids"
  },
  {
    "type": "JS",
    "url": "API.findFirstRow(tableId,selector)",
    "title": "Get 1st matching row's index",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tableId",
            "description": "<p>Id of HTML table</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "selector",
            "description": "<p>Regular expression to match concanted row</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "integer",
            "optional": false,
            "field": "return",
            "description": "<p>Index of first matching row</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "modules/editors/udetable.js",
    "groupTitle": "Elements",
    "name": "JsApiFindfirstrowTableidSelector"
  },
  {
    "type": "JS",
    "url": "API.findRows(tableId)",
    "title": "Get matching rows' no",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tableId",
            "description": "<p>Id of HTML table</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "selector",
            "description": "<p>Regular expression to match concanted row</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "[integer]",
            "optional": false,
            "field": "return",
            "description": "<p>List of row nos</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "modules/editors/udetable.js",
    "groupTitle": "Elements",
    "name": "JsApiFindrowsTableid"
  },
  {
    "type": "JS",
    "url": "API.focus(elementOrId)",
    "title": "Put focus on an element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID ofelement to get focus</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>ELement with focus</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "ude-view/ude.js",
    "groupTitle": "Elements",
    "name": "JsApiFocusElementorid"
  },
  {
    "type": "JS",
    "url": "API.focus(elementOrId)",
    "title": "Put focus on an element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>ID ofelement to get focus</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>ELement with focus</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "ude-view/ude.js",
    "groupTitle": "Elements",
    "name": "JsApiFocusElementorid"
  },
  {
    "type": "JS",
    "url": "API.getFirstMatchingItem(listId,selector)",
    "title": "Get first list item that matches",
    "description": "<p>Get first item from an HTML list that matches a regular expression</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "listId",
            "description": "<p>Id of HTML list</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "selector",
            "description": "<p>Regular expression to match items</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "[string]",
            "optional": false,
            "field": "Return",
            "description": "<p>value Text content of selected items</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "modules/editors/udelist.js",
    "groupTitle": "Elements",
    "name": "JsApiGetfirstmatchingitemListidSelector"
  },
  {
    "type": "JS",
    "url": "API.getMatchingItems(listId,selector)",
    "title": "Get list items that match",
    "description": "<p>Get items from an HTML list that match a regular expression</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "listId",
            "description": "<p>Id of HTML list</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "selector",
            "description": "<p>Regular expression to match items</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "[string]",
            "optional": false,
            "field": "Return",
            "description": "<p>value Text content of selected items</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "modules/editors/udelist.js",
    "groupTitle": "Elements",
    "name": "JsApiGetmatchingitemsListidSelector"
  },
  {
    "type": "JS",
    "url": "API.getOIDbyName(elementName)",
    "title": "Get the OID where a named element is stored",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "elementName",
            "description": "<p>The name of the element</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "OID",
            "description": ""
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Elements",
    "name": "JsApiGetoidbynameElementname"
  },
  {
    "type": "JS",
    "url": "API.getRow(tableId,rowIndex)",
    "title": "Get a row",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tableId",
            "description": "<p>Id of table</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "columnName",
            "description": "<p>Label of column</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>Object with columnName:value</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "modules/editors/udetable.js",
    "groupTitle": "Elements",
    "name": "JsApiGetrowTableidRowindex"
  },
  {
    "type": "JS",
    "url": "API.getSelector(element)",
    "title": "Return a selector (ie path to) to find an element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "element",
            "description": "<p>The element to point too</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements",
    "name": "JsApiGetselectorElement"
  },
  {
    "type": "JS",
    "url": "API.inertText(text,type=\"plain\")",
    "title": "Insert a text element at cursor position",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "text",
            "description": "<p>Text content</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "type",
            "description": "<p>MIME type of content, default plain</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Elements",
    "name": "JsApiInerttextTextTypePlain"
  },
  {
    "type": "JS",
    "url": "API.insertElement(elementTag,data,attributes)",
    "title": "Insert and save an HTML element at cursor position",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "elementTag",
            "description": "<p>Extended tag of element to insert</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "data",
            "description": "<p>Content (text, html, JSON) of element's content</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "attributes",
            "description": "<p>List of attribute/values of element</p>"
          },
          {
            "group": "Parameter",
            "type": "HTMLelement",
            "optional": false,
            "field": "at",
            "description": "<p>HTML element where to insert</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "insertAfter",
            "description": "<p>Insert after at if true, before if false</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "inside",
            "description": "<p>Insert inside at if true</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Elements",
    "name": "JsApiInsertelementElementtagDataAttributes"
  },
  {
    "type": "JS",
    "url": "API.insertElement(tag,data,attributes={},at=null,beforeOrAfter=false,inside=false)",
    "title": "Insert an element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tag",
            "description": "<p>Tag of HTML element</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "data",
            "description": "<p>Content of element as string, an element to copy or attributes</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "attributes",
            "description": "<p>Attributes with values  to set in element</p>"
          },
          {
            "group": "Parameter",
            "type": "HTMLelement",
            "optional": false,
            "field": "at",
            "description": "<p>Where to insert, null = cursor</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "beforeOrAfter",
            "description": "<p>Insert before (false, default) or After( true)</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "inside",
            "description": "<p>Insert inside at if true</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>Inserted element known by MODEL-VIEW</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "ude-view/ude.js",
    "groupTitle": "Elements",
    "name": "JsApiInsertelementTagDataAttributesAtNullBeforeorafterFalseInsideFalse"
  },
  {
    "type": "JS",
    "url": "API.insertHTML(html,at)",
    "title": "Insert HTML",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "html",
            "description": "<p>HTML code to insert</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "at",
            "description": "<p>Id of element where to insert after or the HTML element itself</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Elements",
    "name": "JsApiInserthtmlHtmlAt"
  },
  {
    "type": "JS",
    "url": "API.insertHTMLAtCursor(html)",
    "title": "Insert HTML at cursor and mark element as changed",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "html",
            "description": "<p>HTML code to insert</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "at",
            "description": "<p>Id of element where to insert after or the HTML element itself</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "ude-view/ude.js",
    "groupTitle": "Elements",
    "name": "JsApiInserthtmlatcursorHtml"
  },
  {
    "type": "JS",
    "url": "API.insertTable(id)",
    "title": "Setup editing zone of an element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>Id of element to initialise</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Elements",
    "name": "JsApiInserttableId"
  },
  {
    "type": "JS",
    "url": "API.insertTable(params,at)",
    "title": "Insert a table",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "params",
            "description": "<p>List of key/values</p>"
          },
          {
            "group": "Parameter",
            "type": "HTMLelement",
            "optional": false,
            "field": "at",
            "description": "<p>insert after this element. If null tne after cursor.</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Elements",
    "name": "JsApiInserttableParamsAt"
  },
  {
    "type": "JS",
    "url": "API.insertTextAtCursor(html)",
    "title": "Insert text at cursor and mark element as changed",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "html",
            "description": "<p>HTML code to insert</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "at",
            "description": "<p>Id of element where to insert after or the HTML element itself</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "ude-view/ude.js",
    "groupTitle": "Elements",
    "name": "JsApiInserttextatcursorHtml"
  },
  {
    "type": "JS",
    "url": "API.lookup(tableName,nameField,content)",
    "title": "Build lookup from table",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tableName",
            "description": "<p>Id of table (which is also the name of the div.table element)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "nameField",
            "description": "<p>Label of the column to use as key</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "content",
            "description": "<p>Label of column to use as value</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>A named list</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Elements",
    "name": "JsApiLookupTablenameNamefieldContent"
  },
  {
    "type": "JS",
    "url": "API.matchItem(listId)",
    "title": "True if item matches",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "item",
            "description": "<p>The &lt;LI&gt; element</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "expr",
            "description": "<p>The regular expression to test item</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "return",
            "description": "<p>True if item matches</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "modules/editors/udelist.js",
    "groupTitle": "Elements",
    "name": "JsApiMatchitemListid"
  },
  {
    "type": "JS",
    "url": "API.onTrigger(element,trigger,fct,once=true)",
    "title": "Set an application-level trigger on an element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "HTMLelement",
            "optional": false,
            "field": "element",
            "description": "<p>The element on which the trigger is placed</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "trigger",
            "description": "<p>The triggers name : update - element is updated by server</p>"
          },
          {
            "group": "Parameter",
            "type": "function",
            "optional": false,
            "field": "fct",
            "description": "<p>The function to call</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "once",
            "description": "<p>If tru, trigger is disabled after use</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Elements",
    "name": "JsApiOntriggerElementTriggerFctOnceTrue"
  },
  {
    "type": "JS",
    "url": "API.removeElement(elementId)",
    "title": "Remove an HTML element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "elementId",
            "description": "<p>ID of HTML element</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Elements",
    "name": "JsApiRemoveelementElementid"
  },
  {
    "type": "JS",
    "url": "API.removeElement(elementOrId,html)",
    "title": "Remove an element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>The HTML element to update or its id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>Updated element known by MODEL-VIEW</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "ude-view/ude.js",
    "groupTitle": "Elements",
    "name": "JsApiRemoveelementElementoridHtml"
  },
  {
    "type": "JS",
    "url": "API.tableColumns(tableId)",
    "title": "Get matching rows' no",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tableId",
            "description": "<p>Id of HTML table</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "[integer]",
            "optional": false,
            "field": "return",
            "description": "<p>List of row nos</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "modules/editors/udetable.js",
    "groupTitle": "Elements",
    "name": "JsApiTablecolumnsTableid"
  },
  {
    "type": "JS",
    "url": "API.toggleClass(elementOrId,classes)",
    "title": "Toggle presence of class on element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "elementId",
            "description": "<p>Id of the element or the element itself</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "className",
            "description": "<p>Name of class to toggle</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "return",
            "description": "<p>True if added</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "ude-view/ude.js",
    "groupTitle": "Elements",
    "name": "JsApiToggleclassElementoridClasses"
  },
  {
    "type": "JS",
    "url": "API.toggleClasses(elementOrId,classes)",
    "title": "Toggle presence of multiple classes on element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "elementId",
            "description": "<p>Id of the element</p>"
          },
          {
            "group": "Parameter",
            "type": "[string]",
            "optional": false,
            "field": "classes",
            "description": "<p>Names of classes to toggle</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "return",
            "description": "<p>True if added</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "ude-view/ude.js",
    "groupTitle": "Elements",
    "name": "JsApiToggleclassesElementoridClasses"
  },
  {
    "type": "JS",
    "url": "API.updateElement(elementOrId,html)",
    "title": "Update an element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>The HTML element to update or its id</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "html",
            "description": "<p>HTML content to place in element</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>Updated element known by MODEL-VIEW</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "ude-view/ude.js",
    "groupTitle": "Elements",
    "name": "JsApiUpdateelementElementoridHtml"
  },
  {
    "type": "JS",
    "url": "API.writeCell(tableId,row,col)",
    "title": "Write a cell's value",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tableId",
            "description": "<p>Id of HTML table</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "[integer]",
            "optional": false,
            "field": "return",
            "description": "<p>List of row nos</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "modules/editors/udetable.js",
    "groupTitle": "Elements",
    "name": "JsApiWritecellTableidRowCol"
  },
  {
    "type": "onclick",
    "url": "API.displayOIDcall(type,oid,targetId)",
    "title": "Fetch element from server and display",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "integer",
            "optional": false,
            "field": "type",
            "description": "<p>The type of document or page: 1-model, 2-instance</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "oid",
            "description": "<p>DB's full path with parameters</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "target",
            "description": "<p>Id of element to be filled with server's response</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>JS to place in an onclick atribute</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Elements",
    "name": "OnclickApiDisplayoidcallTypeOidTargetid"
  },
  {
    "type": "JS",
    "url": "API.dom.attr(elementOrId,attrName,value=null)",
    "title": "attr() - read/write an attribute of an HTML element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "element",
            "description": "<p>The HTML element whose attribute is to be written or its id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "attrName",
            "description": "<p>Name of the attribute, special cases: starts with &quot;computed_&quot; use computed style, &quot;exTag&quot; = tag.ud_type</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "value",
            "description": "<p>Read if null, clear attribute if &quot;<strong>CLEAR</strong>&quot;, otherwise set attribute</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "return",
            "description": "<p>Attribute's value, &quot;&quot; if element or attribute not found</p>"
          }
        ]
      }
    },
    "group": "Elements",
    "name": "attr",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Elements"
  },
  {
    "type": "JS",
    "url": "API.isLongClick(maxMS)",
    "title": "True of last click was longer that maxMS",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "integer",
            "optional": false,
            "field": "maxMS",
            "description": "<p>Maximum duration in ms of a short click</p>"
          }
        ]
      }
    },
    "group": "Events",
    "version": "0.0.0",
    "filename": "ude-view/ude.js",
    "groupTitle": "Events",
    "name": "JsApiIslongclickMaxms"
  },
  {
    "type": "Formula",
    "url": "array(val1,val2)",
    "title": "Return an array with provided values",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "val",
            "description": "<p>A value</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "The",
            "description": "<p>array</p>"
          }
        ]
      }
    },
    "group": "Formulas",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Formulas",
    "name": "FormulaArrayVal1Val2"
  },
  {
    "type": "Formula",
    "url": "content(elementIdOrName)",
    "title": "Return element's HTML with modified ids",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "elementIdOrName",
            "description": "<p>Element to grab</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "HTML",
            "description": ""
          }
        ]
      }
    },
    "group": "Formulas",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Formulas",
    "name": "FormulaContentElementidorname"
  },
  {
    "type": "Formula",
    "url": "formatList(list,sep,format)",
    "title": "",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "list",
            "description": "<p>The list</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sep",
            "description": "<p>The seperator to place between name and value</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "format",
            "description": "<p>The format string for each value</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "The",
            "description": "<p>formatted list as a string</p>"
          }
        ]
      }
    },
    "group": "Formulas",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Formulas",
    "name": "FormulaFormatlistListSepFormat"
  },
  {
    "type": "Formula",
    "url": "formatList(list,sep,format)",
    "title": "",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "list",
            "description": "<p>The list</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sep",
            "description": "<p>The seperator to place between name and value</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "format",
            "description": "<p>The format string for each value</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "The",
            "description": "<p>formatted list as a string</p>"
          }
        ]
      }
    },
    "group": "Formulas",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Formulas",
    "name": "FormulaFormatlistListSepFormat"
  },
  {
    "type": "Formula",
    "url": "isDate(text)",
    "title": "Return true if text can be a date or part of a date",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "text",
            "description": "<p>A single character or the completed text to validate</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "True",
            "description": "<p>if character or text accepted</p>"
          }
        ]
      }
    },
    "group": "Formulas",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Formulas",
    "name": "FormulaIsdateText"
  },
  {
    "type": "Formula",
    "url": "isName(text)",
    "title": "Return true if text can be a name",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "text",
            "description": "<p>The character or completed text to validate</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "True",
            "description": "<p>if character or text accepted</p>"
          }
        ]
      }
    },
    "group": "Formulas",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Formulas",
    "name": "FormulaIsnameText"
  },
  {
    "type": "Formula",
    "url": "item(data,index)",
    "title": "",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "data",
            "description": "<p>An array or object</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "index",
            "description": "<p>Index simple or list to a member of data</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "The",
            "description": "<p>item in data</p>"
          }
        ]
      }
    },
    "group": "Formulas",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Formulas",
    "name": "FormulaItemDataIndex"
  },
  {
    "type": "Formula",
    "url": "listNames(list)",
    "title": "",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "list",
            "description": "<p>The list</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string[]",
            "optional": false,
            "field": "Array",
            "description": "<p>of names in list</p>"
          }
        ]
      }
    },
    "group": "Formulas",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Formulas",
    "name": "FormulaListnamesList"
  },
  {
    "type": "Formula",
    "url": "listValues(list)",
    "title": "",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "list",
            "description": "<p>The list</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string[]",
            "optional": false,
            "field": "Array",
            "description": "<p>of names in list</p>"
          }
        ]
      }
    },
    "group": "Formulas",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Formulas",
    "name": "FormulaListvaluesList"
  },
  {
    "type": "Formula",
    "url": "removeAccentsAndLower(text)",
    "title": "",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "text",
            "description": "<p>Initial text</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "Text",
            "description": "<p>without accents</p>"
          }
        ]
      }
    },
    "group": "Formulas",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Formulas",
    "name": "FormulaRemoveaccentsandlowerText"
  },
  {
    "type": "Formula",
    "url": "textReplace(search,replace,source)",
    "title": "Return a source with search replaced by replace",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "search",
            "description": "<p>String to search</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "Modified",
            "description": "<p>string</p>"
          }
        ]
      }
    },
    "group": "Formulas",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Formulas",
    "name": "FormulaTextreplaceSearchReplaceSource"
  },
  {
    "type": "Formula",
    "url": "uround(numberOrArray,decimals)",
    "title": "Return rounded values",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "numberOrArray",
            "description": "<p>Element to grab</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "numberOrArray",
            "description": "<p>with all values rounded</p>"
          }
        ]
      }
    },
    "group": "Formulas",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Formulas",
    "name": "FormulaUroundNumberorarrayDecimals"
  },
  {
    "type": "Formula",
    "url": "value(elementid,",
    "title": "index1, index2) Return a value (useful when dynamic expression needed)",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "elementid",
            "description": "<p>Element where value is stored</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "numberOrArray",
            "description": "<p>Value found in element</p>"
          }
        ]
      }
    },
    "group": "Formulas",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Formulas",
    "name": "FormulaValueElementid"
  },
  {
    "type": "formula",
    "url": "metricTag(",
    "title": "type, id, value, params) Return a mini SVG graph display of a value",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "type",
            "description": "<p>type of display</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>Id of field</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "value",
            "description": "<p>value to display</p>"
          },
          {
            "group": "Parameter",
            "type": "Array.number",
            "optional": false,
            "field": "param",
            "description": "<p>parameters for red zones, green zones etc</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "The",
            "description": "<p>&lt;input&gt; tag</p>"
          }
        ]
      }
    },
    "group": "HTML",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "HTML",
    "name": "FormulaMetrictag"
  },
  {
    "type": "JS",
    "url": "API.checkContent(elementOrId)",
    "title": "Update an element's content after an editing event",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>An element, an id or a query selector object</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "True",
            "description": "<p>if content was changed</p>"
          }
        ]
      }
    },
    "group": "HTML",
    "version": "0.0.0",
    "filename": "ud-utilities/udcontent.js",
    "groupTitle": "HTML",
    "name": "JsApiCheckcontentElementorid"
  },
  {
    "type": "JS",
    "url": "API.copyElements(sourceIdOrName,targetIdOrName,containerId)",
    "title": "Create a copy of elements in a view's or a zone",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sourceIdOrName",
            "description": "<p>Id or name of the set of elements to copy</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "targetIdOName",
            "description": "<p>Id or nameof where to place created copy of elements</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "containerId",
            "description": "<p>Id of element containing source &amp; target. Default = document</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "Success",
            "description": "<p>or Failure</p>"
          }
        ]
      }
    },
    "group": "HTML",
    "version": "0.0.0",
    "filename": "ud-utilities/udutilities.js",
    "groupTitle": "HTML",
    "name": "JsApiCopyelementsSourceidornameTargetidornameContainerid"
  },
  {
    "type": "JS",
    "url": "API.createTextEditor(lines,name,style,mime)",
    "title": "Create an HTML table for editing lined text",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array.string",
            "optional": false,
            "field": "lines",
            "description": "<p>Text to edit as an array of strings</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>Table's name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "style",
            "description": "<p>Table's style</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "mime",
            "description": "<p>MIME type (text/text(default), text/css, text/javascrpt, text/json, text/html)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "The",
            "description": "<p>HTML table</p>"
          }
        ]
      }
    },
    "group": "HTML",
    "version": "0.0.0",
    "filename": "ud-utilities/udjson.js",
    "groupTitle": "HTML",
    "name": "JsApiCreatetexteditorLinesNameStyleMime"
  },
  {
    "type": "JS",
    "url": "API.extractDataFromContent(html,model)",
    "title": "Extract data substituted into HTML",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "html",
            "description": "<p>An HTML string</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "model",
            "description": "<p>Name of an HTML model</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "True",
            "description": "<p>if content was changed</p>"
          }
        ]
      }
    },
    "group": "HTML",
    "version": "0.0.0",
    "filename": "ud-utilities/udcontent.js",
    "groupTitle": "HTML",
    "name": "JsApiExtractdatafromcontentHtmlModel"
  },
  {
    "type": "JS",
    "url": "API.hasDefaultContent(elementOrId)",
    "title": "Return true if element has default content",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "HTMLelement",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>The HTML element or its id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "True",
            "description": "<p>if content is 'placeholder'</p>"
          }
        ]
      }
    },
    "group": "HTML",
    "version": "0.0.0",
    "filename": "ude-view/ude.js",
    "groupTitle": "HTML",
    "name": "JsApiHasdefaultcontentElementorid"
  },
  {
    "type": "JS",
    "url": "API.HTMLeditor(elementOrId)",
    "title": "Open an HTML editor on an element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its Id</p>"
          }
        ]
      }
    },
    "group": "HTML",
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "True",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "HTML",
    "name": "JsApiHtmleditorElementorid"
  },
  {
    "type": "JS",
    "url": "API.json.createTable(rows,name,content)",
    "title": "Create an HTML table from an object",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array.object",
            "optional": false,
            "field": "rows",
            "description": "<p>Array of rows or named array of rows</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>Table's name</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "content",
            "description": "<p>Contains table's parameters</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "The",
            "description": "<p>HTML table</p>"
          }
        ]
      }
    },
    "group": "HTML",
    "description": "<p>The &quot;rows&quot; argument takes 2 forms : <ul></p> <li> an array of named lists (objects) [{col1:val1,col2;val2}, {col1:val1,col2;val2}]</li> <li> or a named list of named lists { row1id:{col1:val1, col2:val2}, row2id:{col1:val1, col2:val2}}</li> </ul> The model row is the 1st list if rows is an array and the row with id = \"model\" if it's a named list. <br>The JSON representation of the table (getElement(), putElement()) is  { tag: \"jsontable\", class:classname, value:rows}",
    "version": "0.0.0",
    "filename": "ud-utilities/udjson.js",
    "groupTitle": "HTML",
    "name": "JsApiJsonCreatetableRowsNameContent"
  },
  {
    "type": "JS",
    "url": "API.json.getElement(element)",
    "title": "Get JSON representation of an HTML element set",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "HTMLelement",
            "optional": false,
            "field": "element",
            "description": "<p>The HTML element</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>The JSON representation</p>"
          }
        ]
      }
    },
    "group": "HTML",
    "description": "<p>The JSON representation is as follows : <li>meta:{ type, name, zone, caption, captionPosition}</li> <li>data:{ tag, class, value [</li><ul> <li>  subelement1: { tag, class, attr, value:{subsubelement1a: { value, tag, class, formula}}, subelement1b: { value ....}}}</li> <li>  subelement2: {value, tag, class, formula}</li> </ul><li>]}</li> <li>changes:{changeindex : { section, index1, index2, value}}</li> <li>Subelement tags are HTML tags or <ul> <li>&quot;textedit&quot; - converts an array of strings to a text editing table</li> <li>&quot;jsontable&quot; - converts an (named) array of objects to a table<li> </ul></li></p>",
    "version": "0.0.0",
    "filename": "ud-utilities/udjson.js",
    "groupTitle": "HTML",
    "name": "JsApiJsonGetelementElement"
  },
  {
    "type": "JS",
    "url": "API.json.putElement(element)",
    "title": "Create element set from JSON",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "json",
            "description": "<p>The JSON representation</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sourceId",
            "description": "<p>Bind the element to another HTML element</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>An unattached HTML element</p>"
          }
        ]
      }
    },
    "group": "HTML",
    "description": "<p>The JSON representation is as follows : meta:{ type, name, zone, caption, captionPosition} data:{ tag, class, value [ subelement1: { subsubelement1a: { value, tag, class, formula}}, subelement1b: { value ....}} subelement2: {value, tag, class, formula} ]} cache: changes:{ changeindex : { section, index1, index2, value} } caption is added as SPAN element with class caption containg a SPAN element of class objectName with name</p>",
    "version": "0.0.0",
    "filename": "ud-utilities/udjson.js",
    "groupTitle": "HTML",
    "name": "JsApiJsonPutelementElement"
  },
  {
    "type": "JS",
    "url": "API.json.toHTML(obj)",
    "title": "Convert an object to HTML",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "obj",
            "description": "<p>Object to convert to HTML</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "Converted",
            "description": "<p>HTML</p>"
          }
        ]
      }
    },
    "group": "HTML",
    "version": "0.0.0",
    "filename": "ud-utilities/udjson.js",
    "groupTitle": "HTML",
    "name": "JsApiJsonTohtmlObj"
  },
  {
    "type": "JS",
    "url": "API.readTable(table)",
    "title": "Grab an HTML table as an object",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>Table's name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "style",
            "description": "<p>Table's style</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "object",
            "optional": false,
            "field": "The",
            "description": "<p>table as an object</p>"
          }
        ]
      }
    },
    "group": "HTML",
    "version": "0.0.0",
    "filename": "ud-utilities/udjson.js",
    "groupTitle": "HTML",
    "name": "JsApiReadtableTable"
  },
  {
    "type": "JS",
    "url": "API.readTextEditor(name,mime)",
    "title": "Create an HTML table for editing lined text",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>Table's name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "mime",
            "description": "<p>MIME type (text/css, text/javascrpt, text/json, text/html)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "Array",
            "description": "<p>of lines or object</p>"
          }
        ]
      }
    },
    "group": "HTML",
    "version": "0.0.0",
    "filename": "ud-utilities/udjson.js",
    "groupTitle": "HTML",
    "name": "JsApiReadtexteditorNameMime"
  },
  {
    "type": "JS",
    "url": "API.replaceModelInElement(elementOrId,currentModel,newModel)",
    "title": "Update an element's content based on models",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>An element, an id or a query selector object</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "currentModel",
            "description": "<p>Name of element's current model</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "newModel",
            "description": "<p>Name of model to use</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "True",
            "description": "<p>if content was changed</p>"
          }
        ]
      }
    },
    "group": "HTML",
    "version": "0.0.0",
    "filename": "ud-utilities/udcontent.js",
    "groupTitle": "HTML",
    "name": "JsApiReplacemodelinelementElementoridCurrentmodelNewmodel"
  },
  {
    "type": "JS",
    "url": "API.updateContentAfterEvent(elementOrId,event)",
    "title": "Update an element's content after an editing event",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>An element, an id or a query selector object</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "event",
            "description": "<p>object with eventType and parameters for ex eventType:&quot;changeTag&quot;, oldTag:&quot;tag&quot;</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "True",
            "description": "<p>if content was changed</p>"
          }
        ]
      }
    },
    "group": "HTML",
    "version": "0.0.0",
    "filename": "ud-utilities/udcontent.js",
    "groupTitle": "HTML",
    "name": "JsApiUpdatecontentaftereventElementoridEvent"
  },
  {
    "type": "JS",
    "url": "copyPortion(sourceIdOrName,targetIdOrName,headerId=\"\",map=null)",
    "title": "Copy a portion of HTML",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sourceIdOrName",
            "description": "<p>Source of portion's id or name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "targetIdOrName",
            "description": "<p>Target element's id or name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "headerId",
            "description": "<p>Manadatory, id of element where to copy source's H1 title</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tagListStr",
            "description": "<p>CSV string of tags to include in portion</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "HTML",
            "description": "<p>with UL element</p>"
          }
        ]
      }
    },
    "group": "HTML",
    "version": "0.0.0",
    "filename": "api/udapi.js",
    "groupTitle": "HTML",
    "name": "JsCopyportionSourceidornameTargetidornameHeaderidMapNull"
  },
  {
    "type": "js",
    "url": "egaliseHeightOfClass(className)",
    "title": "equalise height of all elements with class to highest element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "className",
            "description": "<p>id of container element</p>"
          }
        ]
      }
    },
    "group": "HTML",
    "version": "0.0.0",
    "filename": "ud-utilities/udutilities.js",
    "groupTitle": "HTML",
    "name": "JsEgaliseheightofclassClassname"
  },
  {
    "type": "JS",
    "url": "grabFromTable(targetOrId,tableOrId,field)",
    "title": "Fill an element with content from a table column",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "targetOrId",
            "description": "<p>Target element or it's id</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "tableOrId",
            "description": "<p>Table or it's id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "field",
            "description": "<p>Label of column</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "Target",
            "description": "<p>element filled</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "NTMLelement",
            "optional": false,
            "field": "null",
            "description": ""
          }
        ]
      }
    },
    "group": "HTML",
    "version": "0.0.0",
    "filename": "api/udapi.js",
    "groupTitle": "HTML",
    "name": "JsGrabfromtableTargetoridTableoridField"
  },
  {
    "type": "JS",
    "url": "grabPortionList(sourceIdOrName,targetIdOrName,params)",
    "title": "Return HTML list of available portions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sourceIdOrName",
            "description": "<p>Source of portion's id or name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "targetIdOrName",
            "description": "<p>Target element's id or name</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "params",
            "description": "<p>Named list of parameters with headerId:id of header zone, tagListStr:CSV list of tags to copy</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tagListStr",
            "description": "<p>CSV string of tags to include in portion</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "HTML",
            "description": "<p>with UL element</p>"
          }
        ]
      }
    },
    "group": "HTML",
    "version": "0.0.0",
    "filename": "api/udapi.js",
    "groupTitle": "HTML",
    "name": "JsGrabportionlistSourceidornameTargetidornameParams"
  },
  {
    "type": "js",
    "url": "API.listAPI(elementOrId)",
    "title": "List API functions",
    "group": "Help",
    "version": "0.0.0",
    "filename": "api/udapi.js",
    "groupTitle": "Help",
    "name": "JsApiListapiElementorid"
  },
  {
    "type": "JS",
    "url": "API.showBotlog(targetOrId)",
    "title": "Show Botlog",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "targetOrId",
            "description": "<p>Element or its id where to place display, default = system popup</p>"
          }
        ]
      }
    },
    "group": "Hooks",
    "version": "0.0.0",
    "filename": "api/apiset2.js",
    "groupTitle": "Hooks",
    "name": "JsApiShowbotlogTargetorid"
  },
  {
    "type": "formula",
    "url": "if(test,trueReturn,falseReturn)",
    "title": "Get a cell's column index",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "test",
            "description": "<p>True of False expression</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "trueReturn",
            "description": "<p>Value to return if test is true</p>"
          },
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "falseReturn",
            "description": "<p>Value to return if test is false</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "The",
            "description": "<p>appropriate return value</p>"
          }
        ]
      }
    },
    "group": "Logic",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Logic",
    "name": "FormulaIfTestTruereturnFalsereturn"
  },
  {
    "type": "JS",
    "url": "API.dataEVent(event,id)",
    "title": "Load a module",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "src",
            "description": "<p>URI of module to load</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "return",
            "description": "<p>True if loaded</p>"
          }
        ]
      }
    },
    "group": "Modules",
    "version": "0.0.0",
    "filename": "ude-view/ude.js",
    "groupTitle": "Modules",
    "name": "JsApiDataeventEventId"
  },
  {
    "type": "JS",
    "url": "API.loadModule(moduleName,args,source)",
    "title": "Load and initiate a module",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "moduleName",
            "description": "<p>Name of module</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "args",
            "description": "<p>List of arguments</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "source",
            "description": "<p>Not used</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "object",
            "optional": false,
            "field": "The",
            "description": "<p>loaded module</p>"
          }
        ]
      }
    },
    "group": "Modules",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Modules",
    "name": "JsApiLoadmoduleModulenameArgsSource"
  },
  {
    "type": "JS",
    "url": "API.postForm(formId,uri,prompt)",
    "title": "Post a form",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "formId",
            "description": "<p>Id of form or a containing div</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "uri",
            "description": "<p>Set form's action attribute of present</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "prompt",
            "description": "<p>Empty (by defaumt) or text of confirmation prompt</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "False",
            "description": "<p>to stop onsubmit from sending form</p>"
          }
        ]
      }
    },
    "group": "Modules",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Modules",
    "name": "JsApiPostformFormidUriPrompt"
  },
  {
    "type": "JS",
    "url": "API.availableClasses(elementOrId)",
    "title": "Return an array of available classes for an element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "extag",
            "description": "<p>The extended tag</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string[]",
            "optional": false,
            "field": "Array",
            "description": "<p>of class names</p>"
          }
        ]
      }
    },
    "group": "Parameters",
    "version": "0.0.0",
    "filename": "ud-utilities/udresources.js",
    "groupTitle": "Parameters",
    "name": "JsApiAvailableclassesElementorid"
  },
  {
    "type": "JS",
    "url": "API.availableClassesForExtag(extag)",
    "title": "Return an array of available classes for the specified extended tag",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "extag",
            "description": "<p>The extended tag</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string[]",
            "optional": false,
            "field": "Array",
            "description": "<p>of class names</p>"
          }
        ]
      }
    },
    "group": "Parameters",
    "version": "0.0.0",
    "filename": "ud-utilities/udresources.js",
    "groupTitle": "Parameters",
    "name": "JsApiAvailableclassesforextagExtag"
  },
  {
    "type": "JS",
    "url": "API.availableLayouts(elementOrId)",
    "title": "Return an array of available layouts for an element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "extag",
            "description": "<p>The extended tag</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string[]",
            "optional": false,
            "field": "Array",
            "description": "<p>of class names</p>"
          }
        ]
      }
    },
    "group": "Parameters",
    "version": "0.0.0",
    "filename": "ud-utilities/udresources.js",
    "groupTitle": "Parameters",
    "name": "JsApiAvailablelayoutsElementorid"
  },
  {
    "type": "JS",
    "url": "API.availableLayouts(elementOrId)",
    "title": "Return an array of available layouts for an element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "extag",
            "description": "<p>The extended tag</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string[]",
            "optional": false,
            "field": "Array",
            "description": "<p>of class names</p>"
          }
        ]
      }
    },
    "group": "Parameters",
    "version": "0.0.0",
    "filename": "ud-utilities/udresources.js",
    "groupTitle": "Parameters",
    "name": "JsApiAvailablelayoutsElementorid"
  },
  {
    "type": "JS",
    "url": "API.availableStylesForSelection(elementOrId)",
    "title": "Return an array of styles for a selection in an element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "extag",
            "description": "<p>The extended tag</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string[]",
            "optional": false,
            "field": "Array",
            "description": "<p>of class names</p>"
          }
        ]
      }
    },
    "group": "Parameters",
    "version": "0.0.0",
    "filename": "ud-utilities/udresources.js",
    "groupTitle": "Parameters",
    "name": "JsApiAvailablestylesforselectionElementorid"
  },
  {
    "type": "JS",
    "url": "API.availableTags(elementOrId)",
    "title": "Return an array of available extended tags for an element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "extag",
            "description": "<p>The extended tag</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string[]",
            "optional": false,
            "field": "Array",
            "description": "<p>of class names</p>"
          }
        ]
      }
    },
    "group": "Parameters",
    "version": "0.0.0",
    "filename": "ud-utilities/udresources.js",
    "groupTitle": "Parameters",
    "name": "JsApiAvailabletagsElementorid"
  },
  {
    "type": "JS",
    "url": "API.defaultAttrValue(exTag,attr)",
    "title": "Return the default value of an attribute",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "extag",
            "description": "<p>The extended tag</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "attr",
            "description": "<p>Attribute name</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "values",
            "description": "<p>Use for recurrent calls</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "default",
            "description": "<p>value, &quot;&quot; if none</p>"
          }
        ]
      }
    },
    "group": "Parameters",
    "version": "0.0.0",
    "filename": "ud-utilities/udresources.js",
    "groupTitle": "Parameters",
    "name": "JsApiDefaultattrvalueExtagAttr"
  },
  {
    "type": "JS",
    "url": "API.getEditorAttr(elementOrId,attr)",
    "title": "Return the value of an editing attribute of an element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>The element, its id or selection query</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "attr",
            "description": "<p>Attribute name</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "attribute",
            "description": "<p>'s value, &quot;&quot; if none</p>"
          }
        ]
      }
    },
    "group": "Parameters",
    "version": "0.0.0",
    "filename": "ud-utilities/udresources.js",
    "groupTitle": "Parameters",
    "name": "JsApiGeteditorattrElementoridAttr"
  },
  {
    "type": "JS",
    "url": "API.getTagOrStyleLabel(tagOrStyle)",
    "title": "Get label for a tag or style",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>text or HTML for images</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Parameters",
    "version": "0.0.0",
    "filename": "ud-utilities/udresources.js",
    "groupTitle": "Parameters",
    "name": "JsApiGettagorstylelabelTagorstyle"
  },
  {
    "type": "JS",
    "url": "API.listTypeClasses()",
    "title": "Return an array of types used as classes",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "extag",
            "description": "<p>The extended tag</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string[]",
            "optional": false,
            "field": "Array",
            "description": "<p>of class names</p>"
          }
        ]
      }
    },
    "group": "Parameters",
    "version": "0.0.0",
    "filename": "ud-utilities/udresources.js",
    "groupTitle": "Parameters",
    "name": "JsApiListtypeclasses"
  },
  {
    "type": "JS",
    "url": "API.loadRessourceFile(filepath)",
    "title": "Load ressources from a file",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "filepath",
            "description": "<p>URL of file</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>true</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Parameters",
    "version": "0.0.0",
    "filename": "ud-utilities/udresources.js",
    "groupTitle": "Parameters",
    "name": "JsApiLoadressourcefileFilepath"
  },
  {
    "type": "JS",
    "url": "API.loadRessources(ressources)",
    "title": "Load ressources defined in an object",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "ressources",
            "description": "<p>Ressources to laod with action &amp; data</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>true</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Parameters",
    "version": "0.0.0",
    "filename": "ud-utilities/udresources.js",
    "groupTitle": "Parameters",
    "name": "JsApiLoadressourcesRessources"
  },
  {
    "type": "JS",
    "url": "API.setEditorAttr(elementOrId,attr,value)",
    "title": "Set the value of an editing attribute of an element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>The element, its id or selection query</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "attr",
            "description": "<p>Attribute name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "value",
            "description": "<p>ATtribute value</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "attribute",
            "description": "<p>'s value, &quot;&quot; if none</p>"
          }
        ]
      }
    },
    "group": "Parameters",
    "version": "0.0.0",
    "filename": "ud-utilities/udresources.js",
    "groupTitle": "Parameters",
    "name": "JsApiSeteditorattrElementoridAttrValue"
  },
  {
    "type": "JS",
    "url": "API.testEditorAttr(elementOrId,attr,value)",
    "title": "Return true if attibute is on or contains value",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elemetOrId",
            "description": "<p>The element, its id or selection query</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "attr",
            "description": "<p>Attribute name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "value",
            "description": "<p>Use for recurrent calls</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "mixed",
            "optional": false,
            "field": "default",
            "description": "<p>value, &quot;&quot; if none</p>"
          }
        ]
      }
    },
    "group": "Parameters",
    "version": "0.0.0",
    "filename": "ud-utilities/udresources.js",
    "groupTitle": "Parameters",
    "name": "JsApiTesteditorattrElementoridAttrValue"
  },
  {
    "type": "JS",
    "url": "API.updateClassMap(objectOrJSON)",
    "title": "Update class map with provided data",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "objectOrJSON",
            "description": "<p>Object data or JSON</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>text or HTML for images</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Parameters",
    "version": "0.0.0",
    "filename": "ud-utilities/udresources.js",
    "groupTitle": "Parameters",
    "name": "JsApiUpdateclassmapObjectorjson"
  },
  {
    "type": "JS",
    "url": "$$$.getTagOrStyleInfo(tagOrStyle,attr)",
    "title": "Return the info on a class or style",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tagOrStyle",
            "description": "<p>The tag or style</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "attr",
            "description": "<p>The required attribute, &quot;&quot; for all</p>"
          }
        ]
      }
    },
    "group": "Parameters",
    "version": "0.0.0",
    "filename": "ud-utilities/udresources.js",
    "groupTitle": "Parameters",
    "name": "JsGettagorstyleinfoTagorstyleAttr"
  },
  {
    "type": "js",
    "url": "API.getShortcut(fctName)",
    "title": "Return a function to call an API function directly",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "fctName",
            "description": "<p>Name of the function</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "function",
            "optional": false,
            "field": "The",
            "description": "<p>binded function to call</p>"
          }
        ]
      }
    },
    "group": "Programs",
    "version": "0.0.0",
    "filename": "api/udapi.js",
    "groupTitle": "Programs",
    "name": "JsApiGetshortcutFctname"
  },
  {
    "type": "js",
    "url": "$$$.ignoreErrors()",
    "title": "Disactivates reporting of errors in calls to library",
    "group": "Programs",
    "version": "0.0.0",
    "filename": "api/udapi.js",
    "groupTitle": "Programs",
    "name": "JsIgnoreerrors"
  },
  {
    "type": "js",
    "url": "$$$.raiseErrors()",
    "title": "Activates reporting of errors in calls to library",
    "group": "Programs",
    "version": "0.0.0",
    "filename": "api/udapi.js",
    "groupTitle": "Programs",
    "name": "JsRaiseerrors"
  },
  {
    "group": "Register",
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "ud-utilities/udresources.js",
    "groupTitle": "Register",
    "name": ""
  },
  {
    "type": "JS",
    "url": "API.botlogUpdate(action,id,status,details)",
    "title": "Perform an operation on botlog",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "action",
            "description": "<p>The required action on botlog: get, set, busy</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>Id of botlog entry, null if new</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "status",
            "description": "<p>Status of entry</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "details",
            "description": "<p>Details of operation</p>"
          }
        ]
      }
    },
    "group": "Robots",
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "True",
            "description": "<p>if at least one botlog entry has open status</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Robots",
    "name": "JsApiBotlogupdateActionIdStatusDetails"
  },
  {
    "type": "JS",
    "url": "service(service,params_json,responseMap)",
    "title": "Call a web service and place content in DOM",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "service",
            "description": "<p>Name of the service</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "params_json",
            "description": "<p>JSON-coded parameters</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "responseMap",
            "description": "<p>Descibes how to map service response to DOM elements</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "True",
            "description": "<p>if request sent</p>"
          }
        ]
      }
    },
    "group": "Services",
    "version": "0.0.0",
    "filename": "api/udapi.js",
    "groupTitle": "Services",
    "name": "JsServiceServiceParams_jsonResponsemap"
  },
  {
    "type": "JS",
    "url": "serviceEmail(action,campaignOrId,subject,contactListId,body)",
    "title": "Call the email service",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "subject",
            "description": "<p>Subject field of campaign</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "action",
            "description": "<p>Send|Setup campaign|Stats|</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "contactListId",
            "description": "<p>Id of contactl ist for campaign</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "body",
            "description": "<p>HTML of message</p>"
          }
        ]
      }
    },
    "group": "Services",
    "version": "0.0.0",
    "filename": "api/udapi.js",
    "groupTitle": "Services",
    "name": "JsServiceemailActionCampaignoridSubjectContactlistidBody"
  },
  {
    "type": "JS",
    "url": "activateOneClass(elementOrId,disactivateOthers)",
    "title": "",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>Id of element to show</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "hideOthers",
            "description": "<p>If true hide all other elements of the same class as element id</p>"
          }
        ]
      }
    },
    "group": "Styles",
    "version": "0.0.0",
    "filename": "api/udapi.js",
    "groupTitle": "Styles",
    "name": "JsActivateoneclassElementoridDisactivateothers"
  },
  {
    "type": "JS",
    "url": "API.addStyleRules(rules)",
    "title": "Add a set of style rules",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "css",
            "description": "<p>CSS of rules</p>"
          }
        ]
      }
    },
    "group": "Styles",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Styles",
    "name": "JsApiAddstylerulesRules"
  },
  {
    "type": "JS",
    "url": "API.dom.hasClass(elementOrId,className)",
    "title": "True if class present",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its Id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "className",
            "description": "<p>A class to test</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "True",
            "description": "<p>if class present</p>"
          }
        ]
      }
    },
    "group": "Styles",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Styles",
    "name": "JsApiDomHasclassElementoridClassname"
  },
  {
    "type": "JS",
    "url": "API.dom.setStyleAttr(elementName,attrName,value)",
    "title": "Set a style attribute in a named element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "elementName",
            "description": "<p>Name of a saveable element</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "attrName",
            "description": "<p>Attribute's name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "value",
            "description": "<p>Value to set</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>The HTML element whose style was modified</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Styles",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Styles",
    "name": "JsApiDomSetstyleattrElementnameAttrnameValue"
  },
  {
    "type": "JS",
    "url": "API.dom.styleSelection(selection)",
    "title": "Set a style attribute in a named element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "elementName",
            "description": "<p>Name of a saveable element</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "attrName",
            "description": "<p>Attribute's name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "value",
            "description": "<p>Value to set</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>The HTML element whose style was modified</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Styles",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Styles",
    "name": "JsApiDomStyleselectionSelection"
  },
  {
    "type": "formula",
    "url": "column()",
    "title": "Get a cell's column index",
    "description": "<p>Placed in a cell's formula, gives the cell's column index</p>",
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>the cell's row index else -1</p>"
          }
        ]
      }
    },
    "group": "Tables",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Tables",
    "name": "FormulaColumn"
  },
  {
    "type": "formula",
    "url": "row()",
    "title": "Get a cell's row index",
    "description": "<p>Place in a cell's formula, gives the cell's row index</p>",
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>the cell's row index else -1</p>"
          }
        ]
      }
    },
    "group": "Tables",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Tables",
    "name": "FormulaRow"
  },
  {
    "type": "JS",
    "url": "API.sumsBy(tableId,valueToAdd,firstRow,lastRow)",
    "title": "Column sums by a column value",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tableId",
            "description": "<p>Id of HTML table</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "key",
            "description": "<p>Column name of key</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "valueToAdd",
            "description": "<p>Column name of value</p>"
          },
          {
            "group": "Parameter",
            "type": "integer",
            "optional": false,
            "field": "index",
            "description": "<p>of first row</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>Named list of sums</p>"
          }
        ]
      }
    },
    "group": "Tables",
    "version": "0.0.0",
    "filename": "modules/editors/udetable.js",
    "groupTitle": "Tables",
    "name": "JsApiSumsbyTableidValuetoaddFirstrowLastrow"
  },
  {
    "type": "JS",
    "url": "API.sumsIf(tableId,valueToAdd,rowMatch)",
    "title": "Column sum of selected rows",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tableId",
            "description": "<p>Id of HTML table</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "valueToAdd",
            "description": "<p>Column name of value</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "rowMatch",
            "description": "<p>Reguar expression to select rows ow</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "integer",
            "optional": false,
            "field": "return",
            "description": "<p>Sum</p>"
          }
        ]
      }
    },
    "group": "Tables",
    "version": "0.0.0",
    "filename": "modules/editors/udetable.js",
    "groupTitle": "Tables",
    "name": "JsApiSumsifTableidValuetoaddRowmatch"
  },
  {
    "type": "JS",
    "url": "API.dom.isHTML(text)",
    "title": "True if text is HTML",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "text",
            "description": "<p>Text to test</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "boolean",
            "optional": false,
            "field": "return",
            "description": "<p>True if HTML</p>"
          }
        ]
      }
    },
    "group": "Text",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Text",
    "name": "JsApiDomIshtmlText"
  },
  {
    "type": "JS",
    "url": "API.getLabel(tagOrStyle)",
    "title": "Get label",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>text or HTML for images</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Text",
    "version": "0.0.0",
    "filename": "ude-view/udemenu.js",
    "groupTitle": "Text",
    "name": "JsApiGetlabelTagorstyle"
  },
  {
    "type": "JS",
    "url": "API.getTagOrStyleLabel(tagOrStyle)",
    "title": "Get label for a tag or style",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>text or HTML for images</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Text",
    "version": "0.0.0",
    "filename": "ude-view/udemenu.js",
    "groupTitle": "Text",
    "name": "JsApiGettagorstylelabelTagorstyle"
  },
  {
    "type": "formula",
    "url": "checkboxTag(value,id,updateId,text)",
    "title": "Get a <input type=\"checkbox\"> tag",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "value",
            "description": "<p>Initial value</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>Id of field</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "updateId",
            "description": "<p>Id of field to update</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "text",
            "description": "<p>Text to display</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>The &lt;input&gt; tag</p>"
          }
        ]
      }
    },
    "group": "Text_or_HTML",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Text_or_HTML",
    "name": "FormulaCheckboxtagValueIdUpdateidText"
  },
  {
    "type": "formula",
    "url": "imageTag(url,alt,width,height)",
    "title": "Get an image tag",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "url",
            "description": "<p>URL/URI of image</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "alt",
            "description": "<p>ALT and TITLE of image</p>"
          },
          {
            "group": "Parameter",
            "type": "integer",
            "optional": false,
            "field": "width",
            "description": "<p>Width of image with units or &quot;auto&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "integer",
            "optional": false,
            "field": "height",
            "description": "<p>Height of image with unit or &quot;auto&quot;</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>The <img> tag</p>"
          }
        ]
      }
    },
    "group": "Text_or_HTML",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Text_or_HTML",
    "name": "FormulaImagetagUrlAltWidthHeight"
  },
  {
    "type": "formula",
    "url": "linkJStag(js,alt,text)",
    "title": "Get an <a> tag with onclick attribute",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "js",
            "description": "<p>onclick code</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "alt",
            "description": "<p>ALT and TITLE of image</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "text",
            "description": "<p>HTML inside link</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>The &amp;lt:a onclick=&quot;&quot;&gt; tag</p>"
          }
        ]
      }
    },
    "group": "Text_or_HTML",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Text_or_HTML",
    "name": "FormulaLinkjstagJsAltText"
  },
  {
    "type": "formula",
    "url": "linkTag(url,alt,text)",
    "title": "Get an <a> tag",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "url",
            "description": "<p>URL/URI of target</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "alt",
            "description": "<p>ALT and TITLE of image</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "text",
            "description": "<p>HTML inside link</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>The &amp;lt:a&gt; tag</p>"
          }
        ]
      }
    },
    "group": "Text_or_HTML",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Text_or_HTML",
    "name": "FormulaLinktagUrlAltText"
  },
  {
    "type": "formula",
    "url": "selectorTag(options,id,updateId,text)",
    "title": "Get a <select><option > tag",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string[]",
            "optional": false,
            "field": "options",
            "description": "<p>List of options</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>Id of field</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "updateId",
            "description": "<p>Id of field to update</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "text",
            "description": "<p>Text to display</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>The &lt;input&gt; tag</p>"
          }
        ]
      }
    },
    "group": "Text_or_HTML",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Text_or_HTML",
    "name": "FormulaSelectortagOptionsIdUpdateidText"
  },
  {
    "type": "formula",
    "url": "substitute(elementOrId)",
    "title": "Remove formulae from an element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "original",
            "description": "<p>Original text or HTML</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "values",
            "description": "<p>Named list of values to substitute</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>String with substitutions</p>"
          }
        ]
      }
    },
    "group": "Text_or_HTML",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Text_or_HTML",
    "name": "FormulaSubstituteElementorid"
  },
  {
    "type": "formula",
    "url": "switchTag(bind,model,alt)",
    "title": "Get a switch controled checkbox",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "variable",
            "description": "<p>Path to variable (domValue)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "model",
            "description": "<p>For future use</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "alt",
            "description": "<p>Rollover text (future use)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>The HTML</p>"
          }
        ]
      }
    },
    "group": "Text_or_HTML",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Text_or_HTML",
    "name": "FormulaSwitchtagBindModelAlt"
  },
  {
    "type": "formula",
    "url": "switchTagCallback(callback,event,model,",
    "title": "alt) Get a switch controled checkbox",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "callback",
            "description": "<p>Function to call with event &amp; clicked element as arguments</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "event",
            "description": "<p>Argument passed to callback with the click element</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "model",
            "description": "<p>For future use</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "alt",
            "description": "<p>Rollover text (future use)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>The HTML</p>"
          }
        ]
      }
    },
    "group": "Text_or_HTML",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Text_or_HTML",
    "name": "FormulaSwitchtagcallbackCallbackEventModel"
  },
  {
    "type": "JS",
    "url": "API.substr(str,index,length)",
    "title": "Extract text",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "str",
            "description": "<p>Text</p>"
          },
          {
            "group": "Parameter",
            "type": "integer",
            "optional": false,
            "field": "index",
            "description": "<p>Start of extraction</p>"
          },
          {
            "group": "Parameter",
            "type": "integer",
            "optional": false,
            "field": "length",
            "description": "<p>Characters to extract</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>Extracted text</p>"
          }
        ]
      }
    },
    "group": "Text_or_HTML",
    "version": "0.0.0",
    "filename": "ude-view/ude.js",
    "groupTitle": "Text_or_HTML",
    "name": "JsApiSubstrStrIndexLength"
  },
  {
    "type": "JS",
    "url": "API.translateTerm(term)",
    "title": "Translate a term to current language",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "term",
            "description": "<p>The term to translate</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "translateEverything",
            "description": "<p>If true (default) translate as phrase, otherwise translate terms between {! and !}</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "setTranslation",
            "description": "<p>Store translated value for future use</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "Translated",
            "description": "<p>term</p>"
          }
        ]
      }
    },
    "group": "Text_or_HTML",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Text_or_HTML",
    "name": "JsApiTranslatetermTerm"
  },
  {
    "type": "onclick",
    "url": "API.style(str,className)",
    "title": "Get HTML code to stylise a litteral",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "integer",
            "optional": false,
            "field": "type",
            "description": "<p>The type of document or page: 1-model, 2-instance</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "str",
            "description": "<p>Value to stylise</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "className",
            "description": "<p>Class to apply to SPAN</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>HTML code</p>"
          }
        ]
      }
    },
    "group": "Text_or_HTML",
    "version": "0.0.0",
    "filename": "ude-view/udecalc.js",
    "groupTitle": "Text_or_HTML",
    "name": "OnclickApiStyleStrClassname"
  },
  {
    "type": "JS",
    "url": "API.addTool(divName,name,icon,call,help)",
    "title": "Add a tool to a tool set",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "divName",
            "description": "<p>Id of tool set name where tool is to be added</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>Tool's name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "icon",
            "description": "<p>URL of tool's icon</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "call",
            "description": "<p>URL of web service or a JS file</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "help",
            "description": "<p>Rollover text (icon's title)</p>"
          }
        ]
      }
    },
    "group": "Tools_and_tool_sets",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Tools_and_tool_sets",
    "name": "JsApiAddtoolDivnameNameIconCallHelp"
  },
  {
    "type": "JS",
    "url": "API.clearTools(setDivId,iconDivId)",
    "title": "Clear all tools in a set and place empty icon",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "setDivId",
            "description": "<p>Id of div used for tool set</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "iconDivId",
            "description": "<p>Id of div with tool's icon</p>"
          }
        ]
      }
    },
    "group": "Tools_and_tool_sets",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Tools_and_tool_sets",
    "name": "JsApiCleartoolsSetdividIcondivid"
  },
  {
    "type": "JS",
    "url": "API.loadTool(clikcedElement,setDiv,call,zoneId)",
    "title": "Load a tool's User Interface to a specified zone",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "HTMLelement",
            "optional": false,
            "field": "clickedElement",
            "description": "<p>Tool container div that has been clicked</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "setDiv",
            "description": "<p>Id of Tool set</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "call",
            "description": "<p>URL of web service or a JS file</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "zoneId",
            "description": "<p>Id of div to use for interface</p>"
          }
        ]
      }
    },
    "group": "Tools_and_tool_sets",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Tools_and_tool_sets",
    "name": "JsApiLoadtoolClikcedelementSetdivCallZoneid"
  },
  {
    "type": "JS",
    "url": "API.createUser(username)",
    "title": "Create a user",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "username",
            "description": "<p>The name to give to user</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>The user's email</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "idHolderId",
            "description": "<p>The id of the where the user's id is to be stored</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "homeOID",
            "description": "<p>DB address of home directory to give this user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>The View HTMLelement</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Users",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Users",
    "name": "JsApiCreateuserUsername"
  },
  {
    "type": "JS",
    "url": "API.dom.getView(elementOrId)",
    "title": "Get View element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>The View HTMLelement</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Views",
    "version": "0.0.0",
    "filename": "api/apiset1.js",
    "groupTitle": "Views",
    "name": "JsApiDomGetviewElementorid"
  },
  {
    "type": "JS",
    "url": "API.dom.getView(elementOrId)",
    "title": "Get View element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "HTMLelement",
            "optional": false,
            "field": "return",
            "description": "<p>The View HTMLelement</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "object",
            "optional": false,
            "field": "return",
            "description": "<p>null</p>"
          }
        ]
      }
    },
    "group": "Views",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Views",
    "name": "JsApiDomGetviewElementorid"
  },
  {
    "type": "JS",
    "url": "API.dom.getViewType(elementOrId)",
    "title": "Get View element",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "mixed",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>HTML element or its Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success": [
          {
            "group": "Success",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>The View type</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "string",
            "optional": false,
            "field": "return",
            "description": "<p>&quot;&quot;</p>"
          }
        ]
      }
    },
    "group": "Views",
    "version": "0.0.0",
    "filename": "browser/dom.js",
    "groupTitle": "Views",
    "name": "JsApiDomGetviewtypeElementorid"
  },
  {
    "type": "JS",
    "url": "API.addMenuOption(menuName,optionName,label,action)",
    "title": "Add a menu option and force menu display",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "menuName",
            "description": "<p>Name of the menu where the option is to be added</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "option",
            "description": "<p>Name of the option</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "label",
            "description": "<p>Displayed label of the option</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "action",
            "description": "<p>Onclick JS code for menu option</p>"
          }
        ]
      }
    },
    "group": "Web_pages",
    "version": "0.0.0",
    "filename": "api/apiset2.js",
    "groupTitle": "Web_pages",
    "name": "JsApiAddmenuoptionMenunameOptionnameLabelAction"
  },
  {
    "type": "JS",
    "url": "API.floatConfig(elementOrId,configZone=null)",
    "title": "Open or close a configuration zone before an element and adjust floating menu",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "elementOrId",
            "description": "<p>The element being configured or its id</p>"
          },
          {
            "group": "Parameter",
            "type": "HTMLelement",
            "optional": false,
            "field": "configZone",
            "description": "<p>The configuration zone or absent/null for closing</p>"
          }
        ]
      }
    },
    "group": "Web_pages",
    "version": "0.0.0",
    "filename": "ude-view/udemenu.js",
    "groupTitle": "Web_pages",
    "name": "JsApiFloatconfigElementoridConfigzoneNull"
  },
  {
    "type": "JS",
    "url": "API.toggleMenu(menuName)",
    "title": "Display/hide menu",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "menuName",
            "description": "<p>Name of the menu to display/hide</p>"
          }
        ]
      }
    },
    "group": "Web_pages",
    "version": "0.0.0",
    "filename": "api/apiset2.js",
    "groupTitle": "Web_pages",
    "name": "JsApiTogglemenuMenuname"
  }
] });
