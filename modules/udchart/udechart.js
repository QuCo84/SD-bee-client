/* -------------------------------------------------------------------------------------------
 *  UDEchart.js
 * 
 *  This is the client-side part of the Graph module and works with the server-side udgraph.php
 *  
 *  As with other UD modules, methods are grouped in 4 blocks as listed below :
 *    
 *     1 - UD-VIEW-MODEL - Preparing data received from server for editing
 *     2 - UD-VIEW-MODEL - Preparing edited data for saving
 *     3 - UDE-VIEW      - Editing functions
 *     4 - CALUCLATOR    - Calculator functions on tables 
 *
 */
 
 class UDEchart
 {
    ud;
    dom;
    ude;
    defaultJSON = {
        "type": "bar", 
        "data":{         
            "labels": "A,B,C", 
            "datasets": [{
                "label": "# of Votes", 
                "data":[10,12,25],
                "backgroundColor": ["rgba(255, 99, 132, 0.2)","rgba(54, 162, 235, 0.2)","rgba(255, 206, 86, 0.2)"], 
                "borderColor": ["rgba(255, 99, 132, 1)","rgba(54, 162, 235, 1)","rgba(255, 206, 86, 1)"],
                "borderWidth": 1
            }]
        },
        "options": {
            "scales": {
                "yAxes": [{"ticks":{"beginAtZero": "true"}}],
                "xAxes":"" 
            }
        }
    };
    editZoneSuffix = "editZone"; // 2DO use systematically
    viewZoneSuffix = "viewZone"; // Idem

    // Set up Chart display and parameter editor module
    constructor( ude)
    {
        this.ude = ude; 
        this.ud = ude.dataSource;
        this.dom = ude.dom;
        /* obsolete
        if ( typeof ud.ude != "undefined") this.ude = ud.ude; 
        else { 
            this.ude = ud;        
            this.ud = this.ude.dataSource;
        }
        */
        if ( typeof Chart == "undefined" && this.ude && typeof process != 'object')
        {
            require(
                [ "vendor/chart.js/Chart", "moment",], //!!!IMPORTANT order
                function ( Chart, moment) { window.Chart=Chart;}
            );           
            // Load css
            // "new UDEchart( window.ud);"
        }          
    } // UDEchart.construct()
    
   /**
    *  UDE-VIEW Interface                                                 
    */
    
    // User-generated event 
    inputEvent( e, element)
    {
        let processed = false;
        let source = element;
        let content = source.textContent;
        let event = e.event;
        let saveable = this.dom.getSaveableParent( source);
        let saveableId = saveable.id;
        // Process event  
        switch ( event)
        {
            case "create" :
                this.initialise( saveableId);
                processed = true;
                break;
            case "change":
                break;
            case "newline" :
                // Determine if event is in data table or paramater table
                let bind = this.dom.getParentWithAttribute( 'ude_bind', element);
                let isData = ( bind.id.indexOf( 'dataeditZone') > -1);
                // Call appropriate editor
                if ( isData) { processed = this.dispatchEvent( e, element, "data");}
                else { processed = this.dispatchEvent( e, element, "param");}            
                break;
            case "save" :
                processed = this.prepareToSave( element, e.target);
                break;
            case "remove" :
                break;
            case "insert" :
                break;
            case "copy" : 
            case "cut" : 
            case "paste" :
            case "merge up" :
            case "merge down" :
                let displayable = this.dom.getParentWithAttribute( 'ude_bind', source);
                //if ( displayable.id.indexOf( "_parameters") > -1)
                processed = this.dispatchEvent( e, element, "param");
                break;
            case "configure" :
                let name = this.dom.attr( saveable, 'name');
                if (name) { API.showNextInList( [ name+'editZone', name+'viewZone']);}
                processed = true;
                break;
                
        }   
        return processed;
    
    } // UDEchart.inputEvent()
    
    dispatchEvent( e, element, ed) {
        let editor = null;
        if ( ed == "param") {
           editor = this.ude.modules[ 'div.linetext'].instance;
        } else if ( ed == "data") {}
        if ( editor) return editor.inputEvent( e, element);
        return false;
    } // UDEchart.dispatchEvent()
    
   /**
    *  UD-VIEW-MODEL Interface
    */


    // Initialise a graph - setup viewing zone
    initialise( saveableId)
    {
        // Check Chart.js is loaded
        if ( typeof Chart == "undefined" || typeof UDEtable == "undefined") {
           // Try again later
           let me = this;  
           setTimeout( function(){ me.initialise( saveableId);}, 1000); 
           return false;
        }        
        // Find dataHolder and json data
        let saveable = this.dom.element( saveableId);
        if (!saveable) return debug( {level:2, return:false}, "Can't find ", saveableId);
        let dataChildren = saveable.childNodes;
        let dataHolder = saveable.getElementsByTagName( 'div')[0];
        let json = "";
        let jsonChart = "";
        let name = "";
        let bind = "";
        // Get data according to MIME    
        let viewZone = "";
        let editZone = "";
        let mimeType = saveable.getAttribute( 'ud_mime');  
        if ( !mimeType) mimeType = "text/json";   
        switch ( mimeType) {
            case "text/json" :
                // JSON100 method
                if ( dataHolder) {
                    json = JSONparse( dataHolder.innerHTML);
                    bind = dataHolder.id;
                }
                if ( !json) {
                    // Uninitialised JSON
                    let suggestedName = "chart{AutoIndex_chart}".replace( "{AutoIndex_chart}", window.udparams['AutoIndex_chart']++);
                    // Delete all children
                    this.dom.emptyElement( saveable);
                    // Add new object to element
                    let newElement = saveable.appendChild( this.newChartObject( suggestedName));
                    this.dom.attr( saveable, 'name', suggestedName);
                    this.dom.attr( saveable, 'ud_mime', "text/json");
                    json = JSONparse( newElement.innerHTML);
                    bind = newElement.id;
                }
                let activeZone = this.dom.udjson.putElement( json, bind);
                if ( saveable.childNodes.length > 1) { saveable.childNodes[ 1].remove();}
                activeZone = saveable.appendChild( activeZone);
                jsonChart = this.dom.udjson.valueByPath( json, "data/edit/value/value");
                let chartName = json.meta.name;
                editZone = this.dom.element( '#'+chartName+this.editZoneSuffix, activeZone);
                if ( editZone) editZone.classList.add( 'hidden');
                viewZone = this.dom.element( '#'+chartName+this.viewZoneSuffix, activeZone); //activeZone.childNodes[ activeZone.childNodes.length - 1];
                break;
            case "text/text" :  //(or csv) 
                break;
            case "text/mixed" : case "text/html" :
                if ( dataHolder) {
                    // Initialised element, extract name and json
                    // Get name
                    name = dataChildren[0].textContent;
                    name = name.replace(/ /g, '_').replace(/'/g,'_').replace(/"/g, '');            
                    // Get JSON
                    let jsonContent = dataHolder.textContent;
                    if ( jsonContent && jsonContent != "null") json = JSON.parse( jsonContent);
                    else
                    {
                        json = this.defaultJSON;
                        dataHolder.textContent = JSON.stringify( json);          
                    }    
                    // 2DO Get waiting GIF
                } else {
                    // Uninitialised element
                    // Get name to use as dataholder and in editzone elements
                    let content = saveable.textContent;
                    if ( content == "" || content == "...") content = "Chart_"+saveableId;
                    name = content.replace(/ /g, '_').replace(/'/g,'_').replace(/"/g, '');
                    // Get initial JSON
                    json = this.defaultJSON;
                    // Build initial HTML for saveable            
                    let html = '';
                    html += '<span class="caption">'+name+'</span>';
                    // 2DO add ude_formula="multiCalc( name)" ude_updateaction="chart.initialise();"
                    html += '<div id="'+name+'" class="chartObject hidden" ude_editZone="'+name+'viewZone"';
                    html += 'ude_formula="multiCalc()" ude_updateaction="chart.initialise"';
                    html += '>'+JSON.stringify( json)+'</div>';
                    // 2DO waiting GIF
                    saveable.innerHTML = html;
                    // Set dataHolder & json for suite
                    dataHolder = saveable.getElementsByTagName( 'div')[0];                      
                }
                jsonChart = json;
                // Find or create viewZone with canvas 
                let viewZoneId = this.dom.attr( dataHolder, "ude_editZone");
                if ( viewZoneId) viewZone = this.dom.element( viewZoneId);        
                if ( !viewZone)
                {
                    // Build display and edit zones
                    // Add new zones to same container as saveable
                    let container = saveable.parentNode;  
                    // Build editZone for configuration as invisble
                    let newEditZone = document.createElement( 'div');
                    let editZoneId = dataHolder.id+"editZone"; 
                    this.dom.attr( newEditZone, "id", editZoneId);
                    this.dom.attr( newEditZone, "class", "linetext hidden");
                    this.dom.attr( newEditZone, "ude_autosave", "off");
                    this.dom.attr( newEditZone, "ude_bind", dataHolder.id);
                    // Add parameter edition
                    let params = this.getEditableParamsAsText( json);
                    let edTable = this.ude.textEd.convertTextToHTMLtable( params, dataHolder.id, "");
                    newEditZone.appendChild( edTable);
                    // Insert into doc
                    saveable.appendChild( newEditZone);
                    //if ( saveable.nextSibling) container.insertBefore( newEditZone, saveable.nextSibling);
                    //else container.appendChild( newEditZone);                        
                    // Build view zone
                    let newViewZone = document.createElement( 'div');
                    viewZoneId = dataHolder.id+"viewZone"; 
                    this.dom.attr( newViewZone, "id", viewZoneId);
                    this.dom.attr( newViewZone, "class", "chartView");
                    this.dom.attr( newViewZone, "ude_autosave", "off");
                    this.dom.attr( newEditZone, "ude_bind", dataHolder.id);
                    // Insert into doc
                    saveable.appendChild( newViewZone);
                    viewZone = newViewZone;
                }   
                break;
        }     
        if ( viewZone) {
            // Setup graph            
            let chartData = this.ude.calc.multiCalc( jsonChart);
            // Handlle callbacks
            if ( this.dom.udjson.value( chartData, 'labelFct')) {
                // Hover label function
                let fctName = this.dom.udjson.value( chartData, 'labelFct');
                let fct = window[ fctName];
                console.log( fct);
                let fctCall = function( context) { fct( context);}
                // v 3 this.dom.udjson.valueByPath( chartData, 'options/plugins/tooltip/callbacks/label', fct);
                // v 2.9
                this.dom.udjson.valueByPath( chartData, 'options/tooltips/callbacks/label', fct);
            }
            let tickFctName = this.dom.udjson.value( chartData, 'tickFct');
            if ( tickFctName) {
                // Tick label function                
                let fctCall = null;
                if ( tickFctName == "maxTickLabelLength") {
                    let me = this;
                    fctCall = function( value) { 
                        return me.maxTickLabelLength( value, me.dom.attr( viewZone.id, 'computed_width'));
                    }
                }
                if ( fctCall) this.dom.udjson.valueByPath( chartData, 'options/scales/xAxes/0/ticks/callback', fctCall);
            }
            // Get view dimensions
            // 2DO zone or use element width this.dom.attr( saveable, 'computed_width')
            let canvasWidth = viewZone.clientWidth;
            let canvasHeight = viewZone.clientHeight;
            // Add canvas child assuming 100% width
            let canvas = document.createElement( 'canvas');
            this.dom.attr( canvas, "width", canvasWidth );            
            this.dom.attr( canvas, "height", canvasHeight) ;            
            viewZone.appendChild( canvas);
            // Adjust labels to available size
            if ( canvasWidth < 500) {
                let labels = chartData.data.labels;
                if ( Array.isArray( labels)) {
                    for ( let labeli=0; labeli < labels.length; labeli++) {
                        labels[ labeli] = labels[labeli].substr( 0, 5)+"...";
                    }
                }
                chartData.data.labels = labels;
            }
            // Get 2D context
            let ctx = canvas.getContext("2d");
            // Draw chart in canvas
            console.log( chartData);            
            let myChart = new Chart(ctx, chartData);
            console.log( myChart);
        }
        return true;
    } //UDEchart.initialise()
    
    newChartObject( suggestedName) {
        // Name
        let name = suggestedName.replace(/ /g, '_').replace(/'/g,'_').replace(/"/g, '');
        let objectName = name + "_object";
        let subtype = "std";
        // Data
        let objectData = { 
            meta:{ type:"chart", subtype:subtype, name:name, zone:name+"activeZone", caption:suggestedName, captionPosition:"top", autosave:"off"}, 
            data:{    
                edit:{"tag":"div","name":name+"editZone", class:"hidden", "type":"text", 'bind':objectName, "value":
                  { tag:"textedit", name:name+"editTable", class:"html", value:this.defaultJSON}
                },
                display:{ tag:"div", name:name+"viewZone", class:"chartView", type:"viewzone", subType:"html", 'bind':objectName, autosave:"off", follow:"off", value:""}
            },
            changes: []
        };
        // Create object div and append to element
        let objectAttributes = {id:objectName, class:"object textObject hidden", ud_mime:"text/json"};
        let object = this.dom.prepareToInsert( 'div', JSON.stringify( objectData), objectAttributes);
        this.dom.attr( object, 'ud_mime', "text/json"); 
        return object;
        // button1:{ tag:"span", class:"rightButton", value:{ tag:"img", src:"/tmp/W20H20_H0Cad0n1q_config.png", onclick:"API.showNextInList( ['"+name+"editZone', '"+name+"viewZone']);", value:""}}, 
    }
    
    // Update a graph
    update( saveableId)
    {
    } // UDEchart.initialise()
    
    // Prepare editable paramters as text
    getEditableParamsAsText( json)
    {
        let text = "";
        text += API.translateTerm("Chart parameters")+"\n";
        text += API.translateTerm("Chart type")+":"+JSON.stringify( json.type)+"\n";
        text += API.translateTerm("Labels")+":"+JSON.stringify( json.data.labels)+"\n";
        text += API.translateTerm("Data1")+":"+JSON.stringify( json.data.datasets[0].data)+"\n";
        text += API.translateTerm("Color1")+":"+JSON.stringify( json.data.datasets[0].backgroundColor)+"\n";
        text += API.translateTerm("Legend")+":"+JSON.stringify( json.data.datasets[0].label)+"\n";
        return text;
    }
    // Update binded saveable element with table's content
    prepareToSave( editorZone, dataHolder)
    {
        let saveable = dataHolder.parentNode;  
        // Detect change in object's name and update other elements as required
        API.dispatchNameChange( saveable); 
        let save = true;
        // Process according to MIME type
        let mime = this.dom.attr( saveable, "ud_mime");
        let json = null;
        switch ( mime) {
            case "text/json" :
                // 2DO if zone is view then copy to data 
                editorZone.classList.add( 'hidden');
                editorZone.nextSibling.classList.remove( 'hidden');
                json = this.dom.udjson.parse( dataHolder.innerHTML);
                // Update edit part
                let editjson = this.dom.udjson.getElement( editorZone, false);
                this.dom.udjson.valueByPath( json, "data/edit", editjson);
                // this.dom.udjson.valueByPath( json, "data/display", this.dom.udjson.getElement( editorZone.nextSibling, false));
                // Update caption
                let meta = json.meta;
                let captionHolder = this.dom.element( 'span.caption', editorZone.parentNode)                              
                // Detect name change
                let name = this.dom.attr( saveable, 'name');
                if ( name != meta.name) {
                    // Name has changed
                    if ( captionHolder && captionHolder.textContent == meta.name) {
                        captionHolder.textContent = name;
                    }
                    meta.name = name;
                    meta.zone = name + "activeZone";  
                    this.dom.udjson.valueByPath( json, "data/display/name", name + "viewZone");
                }
                // Update caption in meta
                if ( captionHolder) meta.caption = captionHolder.textContent;
                // Update meta in json
                this.dom.udjson.valueByPath( json, "meta", meta);                
                dataHolder.innerHTML = JSON.stringify( json); // !!! IMPORTANT textContent will convert <>
                //dataHolder.textContent = JSON.stringify( this.dom.udjson.getElement( editorZone.parentNode, true));
                break;
            default :
                // Find table that holds text OBSOLETE
                var table = editorZone.getElementsByTagName( 'table')[0];
                if (!table) return debug( {level:1, return: null}, "can't find table in ", editorZoneId);
                var rows = table.getElementsByTagName( 'tbody')[0].rows;
                // Get data
                json = this.dom.udjson.parse( dataHolder.textContent);
                for( let rowi=0; rowi < rows.length; rowi++)
                {
                    let save = true; // 2DO only true if a value has changed
                    let row = rows[ rowi];
                    let rowText = row.cells[1].textContent.split(':');          
                    if ( rowText.length <= 1) continue; 
                    let key = rowText[0];
                    let value = rowText[1];
                    for ( let texti = 2; texti < rowText.length; texti++) value += ':'+rowText[ texti];
                    //if ( value.charAt(0) == '=') value = '"'+value+'"';
                    let jsonValue = null;
                    if ( value) { jsonValue = this.dom.udjson.parse( value);}
                    switch ( key)
                    {
                        case API.translateTerm( "Chart type") :
                            if ( jsonValue) json.type = jsonValue;
                            else json.type = value;
                            break;
                        case API.translateTerm("Labels") :
                            if ( jsonValue) json.data.labels = jsonValue;
                            else json.labels = value;
                          break;
                        case API.translateTerm("Data1") :
                            if ( jsonValue) json.data.datasets[0].data = JSON.parse( value);
                            else json.data.datasets[0].data = value;
                          break;
                        case API.translateTerm( "Color1") :
                            if ( jsonValue)
                            {
                                if ( json.type == "line") json.data.datasets[0].backgroundColor = "rgba( 0, 0, 0, 0.1)";
                                else json.data.datasets[0].backgroundColor = jsonValue;
                                json.data.datasets[0].borderColor = jsonValue;
                            }    
                            else 
                            {
                                if ( json.type == "line") json.data.datasets[0].backgroundColor = "rgba( 0, 0, 0, 0.1)";
                                else json.data.datasets[0].backgroundColor = value;
                                json.data.datasets[0].borderColor = value;
                            }
                            break;
                        case API.translateTerm("Legend") :
                            if ( jsonValue) json.data.datasets[0].label = JSON.parse( value);
                            else json.data.datasets[0].label = value;
                            break;
                        case API.translateTerm("xAxes") :
                            if ( jsonValue) json.options.scales.xAxes = JSON.parse( value);
                            else json.options.scales.xAxes = value;
                            break;
                        case API.translateTerm("yAxes") :
                            if ( jsonValue) json.options.scales.yAxes = JSON.parse( value);
                            else json.options.scales.yAxes = value;
                            break;
                    }
                }
                dataHolder.textContent = JSON.stringify( json);
                break;
        }
        if ( save)
        {            
            this.initialise( dataHolder.parentNode.id);
        }
        return save;
    } // UDEchart.prepareToSave()
    
    maxTickLabelLength( value, width) {
        let maxLength = Math.floor( width/20);
        if ( value.length > maxLength) return value.substr( 0, maxLength) + '...';
        return value;
    } // maxTickLabelLength()
    
} // JS class UDEchart
 
if ( typeof process != 'object') {
    let exTag = "div.chart";
    if ( window.ud && !window.ud.ude.modules[ exTag].instance) {
        // Initialise
        let module = new UDEchart( window.ud.ude);
        window.ud.ude.modules[ exTag].instance = module;
        window.ud.ude.modules[ exTag].state = "loaded";
    }
} else {
    // Testing under node.js
    module.exports = { class: UDEchart};
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined")
    {
        console.log( 'Start of test program');
        console.log( 'Syntax:OK');
        let path = "../..";
        const testMod = require( path+'/tests/testenv.js');
        testMod.load( []);
        let ud = new UniversalDoc( 'document', true, 133);   
        let ude = ud.ude;      
        let chart = new UDEchart( ude);
        let view = chart.dom.element( "div.part[name='myView']", chart.dom.element( 'document'));        
        // Test 1 - JSON100 Chart
        {
            // Create object div.listObject and append to element            
            // Data
            name = "myTestChart";          
            let object = chart.newChartObject( name);
            // Create container div.list
            let id = "B0100000005000000M";            
            let attributes = {id:id, class:"chart", ud_mime:"text/json"};
            let element = chart.dom.prepareToInsert( 'div', object.outerHTML, attributes);
            // element.appendChild( object);
            // Append list to view
            view.appendChild( element);   
            // Initialise list
            chart.initialise( id);
            console.log( element.innerHTML);
        }         
        console.log( 'Test completed');
        process.exit();
    }        
} // End of test routine
