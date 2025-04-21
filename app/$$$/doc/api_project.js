define({
  "name": "UD API",
  "version": "0.1.0",
  "description": "UD API Reference Beta version",
  "title": "UD API",
  "header": {
    "title": "UD api gen",
    "content": "<p>Functions listed in this document are available in JS scripts via API.fct</p>\n<p>If the return value is a string or a number, then the function is also available in formulae, =fct(arg1, arg2, ...)</p>\n"
  },
  "url": "",
  "src": [
    "./api",
    "./ude-view",
    "./modules/editors",
    "./modules/connectors",
    "./browser"
  ],
  "filter-exclude": [
    "main.js",
    "es5"
  ],
  "dest": "./api/doc",
  "apidoc": "0.3.0",
  "sampleUrl": false,
  "defaultVersion": "0.0.0",
  "generator": {
    "name": "apidoc",
    "time": "2022-07-26T12:55:34.775Z",
    "url": "https://apidocjs.com",
    "version": "0.25.0"
  }
});
