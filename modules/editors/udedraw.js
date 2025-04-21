/* -------------------------------------------------------------------------------------------
 *  UDEdraw.js
 *    image and drawing edition
 *
 * 2DO replace var with let
 * 2DO : images - gallery start by loading an image in holder
 * 2DO : connectors
 * 2DO : text
 * 2DO : rotation of elements or larger choix
 * 2DO : form preference determines order ?
 * 2DO : arrow styles
 * 2DO : polygons
 * 2DO : alignement when moving
 * 2DO : back front
 * 2DO : formulas
 * 2DO : non modifiable elements (for ex slide templates) 
 *
 * 2019-11-16 Creation from POC canvasDraw
 *
 *
*/

function UDE_draw_fctmove(event) { window.ud.ude.draw.inputEvent( event, event.target);}

class UDEdraw
{
  map;
  ude;
  dom;
  calc;
  maxNbPoints = 10;
  formList =['line', 'triangle', 'rectangle', 'pentagon', 'hexagon', 'circle'];
  formIndex = 0;                              
  calcElements = {};
  cursorMap = {
      "TopLeft" : "nw-resize",
      "MiddleLeft" : "w-resize",
      "BottomLeft" : "sw-resize",
      "TopMiddle" : "n-resize",
      "BottomMiddle" : "s-resize",
      "TopRight" : "ne-resize",
      "MiddleRight" : "e-resize",
      "BottomRight" : "se-resize"     
  };
  
  constructor( dom, ude)
  {
    this.dom = dom;
    this.ude = ude;
    if (ude) this.calc = ude.calc;
    window.graphicEditor = this;
  }
  
    initialise( elementId) {
        let element = this.dom.element( elementId);
        let saveable = this.dom.getSaveableParent( element);
        let dataHolder = saveable.getElementsByTagName('div')[0];
        let json = "";
        let jsonDraw = "";
        let bind = "";
        let editZoneId = "";
        let dataHolderId = "";
        // Get data according to MIME  
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
                    let suggestedName = this.dom.attr( element, 'name');
                    // Delete all children
                    this.dom.emptyElement( saveable);
                    // Add new object to element
                    let newElement = saveable.appendChild( this.newGraphicObject( suggestedName));
                    this.dom.attr( saveable, 'name', suggestedName);
                    this.dom.attr( saveable, 'ud_mime', "text/json");
                    json = JSONparse( newElement.innerHTML);
                    bind = newElement.id;
                }
                let editZone = this.dom.udjson.putElement( json, bind);
                editZone = saveable.appendChild( editZone);
                editZoneId = editZone.id;                
                dataHolderId = editZone.getElementsByTagName( 'div')[0].id;
                // this.dom.attr( editZone, 'ude_bind', dataHolderId);
                let canvasContainer = this.dom.element( editZoneId + "_canvases");
                let canvases = canvasContainer.getElementsByTagName( 'canvas');
                /*
                let bounding = canvasContainer.getBoundingClientRect();
                let width = bounding.width;
                let height = bounding.height;
                */
                let width = this.dom.attr( editZone, "computed_width"); // canvasContainer
                if ( width == "100%") width = this.dom.attr( canvasContainer.parentNode, "computed_width");
                let height = this.dom.attr( editZone, "computed_height");
                for ( let canvi=0; canvi < canvases.length; canvi++) { 
                    this.dom.attr( canvases[ canvi], 'width', width);
                    this.dom.attr( canvases[ canvi], 'height', height);
                }
                break;
            case "text/text" :  //(or csv) 
                break;
            case "text/mixed" : case "text/html" :
                // if ( !dataHolder) element.appendChild( newGraphicObject);
                dataHolderId = dataHolder.id;
                editZoneId = this.dom.attr( dataHolder, 'ude_editzone'); // thisdataHolder1Id+"editZone";
                break;
        }
        if ( dataHolderId && editZoneId && typeof process != "object") {
            this.renderToCanvas( dataHolderId, editZoneId);
            let canvasContainer = this.dom.element( editZoneId+"_canvases");        
            // canvasContainer.addEventListener('mousemove', function (event) { window.graphicEditor.inputEvent( event);});
            canvasContainer.addEventListener('mouseout', function (event) { window.graphicEditor.inputEvent( event);});
            canvasContainer.addEventListener('mousedown', function (event) { window.graphicEditor.inputEvent( event);});
            canvasContainer.addEventListener('mouseup', function (event) { window.graphicEditor.inputEvent( event);}); 
            canvasContainer.addEventListener('touchstart', function (event) { window.graphicEditor.inputEvent( event);}); 
            canvasContainer.addEventListener('touchmove', function (event) { window.graphicEditor.inputEvent( event);});  
            canvasContainer.addEventListener('touchend', function (event) { window.graphicEditor.inputEvent( event);});             
        }
    }
    
    newGraphicObject( suggestedName, width=800) {
        // Name
        let name = suggestedName.replace(/ /g, '_').replace(/'/g,'_').replace(/"/g, '');
        let objectName = name + "_object";
        // Default data
        // 2DO Fancy text in box with name
        let drawData = {
            width: width,
            height:600,
            x:[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            y:[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            style:{ 
                guide: { color:"#AAAAAA", fillColor: "#ffffff", backColor: "#ffffff", width: 1},
                default:{ color:"#000000", fillColor: "#ffffff", backColor: "#ffffff"}
            },
            currentId : 0,
            currentForm: 'none',
            currentStyle: 'default',
            forms:[]
        };
        let objectData = { 
            meta:{ type:"graphic", name:name, class:"graphicStyle1", zone:name+"editZone", caption:suggestedName, captionPosition:"top", autosave:"off"}, 
            data:{ 
                data : { tag:"datadiv", name:name+"editZone_drawData", class:"hidden", value:drawData},
                buttons : { tag:"span", class:"rightButton", onclick:"API.setChanged('"+name+"editZone_drawData')", ui:"yes", value:"save"},
                style : { tag:"div", name:name+"editZone_styles", class:"graphicStyle1 drawStyles", value:""},
                canvas: { tag:"div", name:name+"editZone_canvases", class:"graphicStyle1 graphic", bind:name+"editZone_drawData", value:[
                    { tag: "canvas", class:"canvas", style:"z-index:1;", value:" "},
                    { tag: "canvas", class:"canvas", style:"z-index:2;", value:" "},
                    { tag: "canvas", class:"canvas", style:"z-index:3;", value:" "},
                    { tag: "canvas", class:"canvas", style:"z-index:4;", value:" "},
                ]}
            },
            changes: []
        };
        // Create object div and append to element
        let objectAttributes = {id:objectName, class:"object textObject, hidden", ud_mime:"text/json"};
        let object = this.dom.prepareToInsert( 'div', JSON.stringify( objectData), objectAttributes);
        this.dom.attr( object, 'ud_mime', "text/json"); 
        return object;
    }
    
    
    initialize( dataHolderId, canvasContainerId) 
    {
    // 2DO keep map of ids to dataholder and canvas
    // 2DO get width and height for canvascontainer
    
    let width = this.dom.attr( this.dom.element( canvasContainerId), "computed_width");
    if ( width == "") width = 800;
    var draw = 
    {
      width: width,
      height:600,
      x:[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      y:[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      style:{ 
       guide: { color:"#AAAAAA", fillColor: "#ffffff", backColor: "#ffffff", width: 1},
       default:{ color:"#000000", fillColor: "#ffffff", backColor: "#ffffff"}
      },
      currentId : 0,
      currentForm: 'none',
      currentStyle: 'default',
      forms:[]
    };
    document.getElementById( dataHolderId).textContent = JSON.stringify( draw);
    
    // 2DO set width and height attributes on canvas
    // 2DO TRIAL Get values from style or computed ones (so you can use 100%)
    
  } // DOMdraw.initialize()
  
    // Update drawing
    reRender( dataHolderId, editZoneId)
    {
        var styleZoneId = editZoneId+"_styles";
        var calcElements = this.calcElements[ styleZoneId];
        if ( !calcElements) return;
        for ( var i=0; i< calcElements.length; i++) this.calc.markToUpdate( calcElements[i]);
        this.renderToCanvas( dataHolderId, editZoneId);
    }
  
  // Input event on an element handled by graphic editor
  inputEvent( e, element = null) {
    debug( {level:4}, "draw event in", e);        
    let processed = false;
    if ( !element) { element = e.target;}
    /*
        element = this.dom.cursor.fetch().HTMLelement;
        let path = null;
        if ( typeof e.composedPath != "undefined") path = e.composedPath();
        else path = e.path;       
        if ( path && path[0].tagName.toLowerCase() == "canvas") element = path[0];
    }
    */
    // Get context
    let editZone = null;
    let dataHolderId = "";
    if ( element.tagName.toLowerCase() == "span") {
        // Event from style editing span element
        editZone = element.parentNode;
        dataHolderId = editZone.id + "_drawData"; 
    } else if ( element.tagName.toLowerCase() == "canvas") {
        // Event from canvas
        editZone = element.parentNode.parentNode;
        dataHolderId = this.dom.attr( element.parentNode, 'ude_bind'); 
        // Deprecated : in non JSON100 elements, only the edit zone points to data holder
        if ( !dataHolderId) dataHolderId = this.dom.attr( editZone, 'ude_bind'); 
    } else { 
        editZone = element;
        dataHolderId = editZone.id + "_drawData";         
    }
    if ( !editZone) { return debug( {level:2, return:false}, "Can't fin editZone from", element);}
    if ( element.tagName.toLowerCase() == "canvas") { editZone = element.parentNode.parentNode;}
    var canvasContainerId = editZone.id+"_canvases";
    var canvasContainer = this.dom.element( canvasContainerId);
    var styleZoneId = editZone.id+"_styles";
    var styleZone = this.dom.element( styleZoneId);
    if ( !canvasContainer || !styleZone) 
        return debug( {level:2, return:false}, "Can't fin canvasContainer or styleZone from", element, canvasContainerId, styleZoneId);
   

    var w = canvasContainer.childNodes;
    var guide = w[3].getContext("2d");
    var workC = w[1];
    var work = w[1].getContext("2d");
    var dataHolder = document.getElementById( dataHolderId);
    var drawJSON = dataHolder.textContent;
    var draw = JSON.parse( drawJSON);
    
    var redraw = false;
    
    //var ratio_width = 2.35;
    //var ratio_height = 1.60;
    
    // Adjust x and y provided by event
    let rect = canvasContainer.getBoundingClientRect();
    let x = -1;
    let y = -1;
    if ( ['touchstart', 'touchend', 'touchmove'].indexOf( e.type) > -1) {
        // 2DO handle double touches
        let touch = e.targetTouches[0];
        if ( !touch) return false; // 2DO Debug
        x = touch.clientX - Math.floor(rect.left);
        y = touch.clientY - Math.floor(rect.top);        
    } else {
        x = e.clientX - Math.floor(rect.left);
        y = e.clientY - Math.floor(rect.top);
    }
    // Process interpreted event
    var event = e.type;
    // Check for generated event
    if ( typeof e.event != "undefined") {      
       event = e.event;
       element = e.source;
    }   
    switch( event) {
        case 'change' :
            if ( element.classList.contains ('drawstyle')) {
                console.log( "Style element has changed", element);
                draw = this.updateFromHTMLelement( dataHolder, element);
            } else { redraw = true;}
            processed = true;
            break;      
        case 'touchstart' :
        case 'mousedown' :
            // 2DO Test for existing form
            draw.mousedown = true;
            this.ude.drawMouse = element;
            let forms = draw.forms;
            let clickedForm = null;
            draw.clickedForm = -1;
            let handle = "";
            for ( let formi = 0; formi < forms.length; formi++) {
                if ( this.inForm( forms[ formi], x, y))  {
                    clickedForm = forms[ formi];
                    break;
                }              
            }
            canvasContainer.addEventListener('mousemove', UDE_draw_fctmove);    
            canvasContainer.addEventListener('touchmove', UDE_draw_fctmove);                
            if ( clickedForm && ( draw.selectedForm == -1 || clickedForm != draw.forms[ draw.selectedForm])) {
                // Click is inside an existing form so show form as selected            
                element.style.cursor = "move";
                this.handles( clickedForm, guide, draw, true);
                if ( clickedForm.htmlId) {
                    // Display HTML styler element
                    let displayElement = this.dom.element( "#"+clickedForm.htmlId, styleZone)
                    let siblings = this.dom.siblings( displayElement);
                    for  ( var i = 0; i < siblings.length; i++) siblings[i].classList.add( "hidden");                
                    displayElement.classList.remove ("hidden");
                    let me = this;                
                   // 2DO Update styles and text
                }
                // Store starting position
                draw.lastClick = {x:x, y:y};
                draw.selectedForm = clickedForm.id;
                draw.selectedHandle = "";
            } else if ( draw.selectedForm > -1 && ( handle = this.isHandle( draw.forms[ draw.selectedForm], x, y))) {
                // SelectedForm's Handle has been clicked
                console.log( handle);
                draw.selectedHandle = handle;
                // Store starting position
                draw.lastClick = {x:x, y:y};
                element.style.cursor = this.cursorMap[ handle]; 
                //canvasContainer.addEventListener('mousemove', UDE_draw_fctmove);
               // this.handles( clickedForm, guide, draw, true);            
            } else if ( !clickedForm) {
                // New work form
                // Save current work form if chosen
                if ( draw.currentForm != 'none') {
                    let formx = [];
                    let formy = [];
                    for (let pointi=0; pointi < this.maxNbPoints; pointi++) { 
                        formx.push( draw.x[ pointi]);
                        formy.push( draw.y[ pointi]);
                    }     
                    let form = { id:draw.currentId, type:draw.currentForm, style:draw.currentStyle, x:formx, y:formy};
                    draw.forms.push( form);      
                    draw.currentId++;
                    draw.currentForm = 'none';
                    this.formIndex = 0;
                    work.clearRect(0, 0, draw.width, draw.height); 
                    redraw = true;  
                }
                // Delete current guide and selection
                if ( draw.selectedForm > -1)
                {
                    let styleElement = this.dom.element( "#"+draw.forms[ draw.selectedForm].htmlId, styleZone);
                    styleElement.classList.add( "hidden");                
                }
                draw.selectedForm = -1;            
                //if ( draw.x[1] > -1)
                //{
                    // Delete previous rectangle
                    this.clearGuide( guide, draw);  
                    //guide.strokeStyle = draw.style.default.backColor;
                    //guide.clearRect(draw.x[0]-1, draw.y[0]-1, draw.x[1]-draw.x[0]+2, draw.y[1]-draw.y[0]+2); 
                    //for (var i=0; i< this.maxNbPoints; i++) draw.x[i] = draw.y[i] = -1;   
                    console.log( "cleared guide", draw);               
                //}
                // Save new point
                draw.x[0] = x;
                draw.y[0] = y;
                // 2DO Draw a point
            }    
            processed = true;
            break;
        case 'touchend' :
        case 'mouseup' :
            draw.mousedown = false;
            if ( draw.selectedForm == -1 && draw.x[0] > -1)
            {
                element.style.cursor = "pointer";       
                canvasContainer.removeEventListener('mousemove', UDE_draw_fctmove);           
                canvasContainer.removeEventListener('touchmove', UDE_draw_fctmove);           
                if ( draw.x[0] == -1) break;
                draw.x[1] = x;
                draw.y[1] = y;
                // Draw guide
                //guide.scale(0.5, 0.5);
                guide.imageSmoothingEnabled = true;
                guide.strokeStyle = draw.style.guide.color;
                guide.strokeRect( draw.x[0], draw.y[0], draw.x[1]-draw.x[0], draw.y[1]-draw.y[0]);    
                           
                //ctx.stroke();
            }    
            processed = true;
           break;
        case 'touchmove' :   
        case 'move' :
        case 'mousemove' :
            if ( draw.selectedForm > -1 && draw.mousedown) { // 
                console.log( "move event");
                // New object guide
                // Compute mouvement
                let ix = x - draw.lastClick.x;
                let iy = y - draw.lastClick.y;
                draw.lastClick = {x:x, y:y};
                // Get selected form
                let form = draw.forms[ draw.selectedForm];
                if ( draw.selectedHandle) {
                    // Move handle
                    switch( draw.selectedHandle)
                    {
                        case "TopLeft" :
                            form.x[0] += ix;
                            form.y[0] += iy;
                            break;                      
                        case "TopRight" :
                            form.x[1] += ix;
                            form.y[0] += iy;
                            break;                      
                        case "BottomLeft" :
                            form.x[0] += ix;
                            form.y[1] += iy;
                            break;            
                        case "BottomRight" :
                            form.x[1] += ix;
                            form.y[1] += iy;
                            break;
                        case "TopMiddle" :
                            form.y[0] += iy;
                            break;                      
                        case "BottomMiddle" :
                            form.y[1] += iy;
                            break;
                        case "MiddleLeft" :
                            form.x[0] += ix;
                            break;                      
                        case "MiddleRight" :
                            form.x[1] += ix;
                            break;
                    }               
                    this.handles( form, guide, draw, true);                  
                    redraw = true;
                    processed = true;                
                }
                else
                {    
                    // Move current form
                    form.x[0] += ix;
                    form.x[1] += ix;
                    form.y[0] += iy;
                    form.y[1] += iy;
                    redraw = true;
                    // Redraw handles
                    this.handles( form, guide, draw, true);                
                    processed = true;
                }    
            }
            // 2DO if outside current rectangle
            // 2DO if form chosen validate, remove rectangle
            // else  
            // 2DO Draw a dynamic line or rectangle
            break;
        case 'mousewheel' :
           // Draw forms sequentially in Guide (line, triangle, rectangle, polygons, circle)
          // work.fillStyle = "#FFFFFF";
           // Clear work
           work.clearRect(0, 0, 800, 600);
           if ( this.formIndex >= this.formList.length) this.formIndex = 0;
           draw.currentForm = this.formList[ this.formIndex];
           var workForm = [{
             type: this.formList[ this.formIndex++],
             style: "default",
             x: Array.from( draw.x),
             y: Array.from( draw.y)
           }];
            this.drawToCanvas( workForm, workC, draw.style);
            processed = true;
            break;
        case "shift" : 
            // 2DO Force square mode  
            break;
            
        case "save" :
            let target = e.target;
            let displayable = editZone;
            if ( typeof target != "undefined" && typeof displayable != "undefined")
                processed = this.prepareToSave( displayable, dataHolder);
            break;
            
        default :
            console.log( event, "not captured");
            break;

  }
   //$("#debug").append(e.changedTouches[0].clientX+' ');
   // Save draw
   var s = JSON.stringify(draw);
   /*
       JSONparse object
       set json.data.value
   */
   dataHolder.textContent = s;
   if (redraw) this.renderToCanvas( dataHolderId, editZone.id);
   //e.preventDefault();
   debug( {level:4}, "draw event out", e, draw);   
    return processed;
  } // DOMdraw.inputEvent()
  
    // Test wether a point is in form
    inForm( form, x, y)
    {
        if ( 
            x >= form.x[0] && x <= form.x[1]
            && y >= form.y[0] && y <= form.y[1]      
        )
            return true;
        return false;
    } // DOMDraw.inForm()
  
// Determines if click is on a handle. @return "" or "TopLeft", "MiddleLeft", "BottomLeft," "TopMiddle", "TopRight" etc
    isHandle( form, x, y) {
        let handleSize = 10*3;
        var fx = form.x[0]-handleSize;
        var fy = form.y[0]-handleSize;
        var wx = Math.round( Math.abs( form.x[1] - form.x[0]) + handleSize) / 2;
        var wy = Math.round( Math.abs( form.y[1] - form.y[0]) + handleSize) / 2;
        if ( ( x < fx || x > fx +2*wx) &&  ( y < fy || y > fy+2*wy)) return "";
        else if ( ( x >=fx && x <= fx+handleSize) &&  ( y >= fy && y <= fy+handleSize)) return "TopLeft";
        else if ( ( x >= fx && x <= fx+handleSize) &&  ( y >= fy+wy && y <= fy+wy+handleSize)) return "MiddleLeft";
        else if ( ( x >= fx && x <= fx+handleSize) &&  ( y >= fy+2*wy && y <= fy+2*wy+handleSize)) return "BottomLeft";
        else if ( ( x >= fx+wx && x <= fx+wx+handleSize) &&  ( y >= fy && y <= fy+handleSize)) return "TopMiddle";
        else if ( ( x >= fx+wx && x <= fx+wx+handleSize) &&  ( y >= fy+2*wy && y <= fy+2*wy+handleSize)) return "BottomMiddle";
        else if ( ( x >= fx+2*wx && x <= fx+2*wx+handleSize) &&  ( y >= fy && y <= fy+handleSize)) return "TopRight";
        else if ( ( x >= fx+2*wx && x <= fx+2*wx+handleSize) &&  ( y >= fy+wy && y <= fy+wy+handleSize)) return "MiddleRight";
        else if ( ( x >= fx+2*wx && x <= fx+2*wx+handleSize) &&  ( y >= fy+2*wy && y <= fy+2*wy+handleSize)) return "BottomRight";
        return "";
    } // UDEdraw.isHandle()
    
    // Draw or rubout handles on  a form
    handles( form, guide, draw, add = true, selected = "") {
        let handleSize = 10;
        this.clearGuide( guide, draw);
        let x = form.x[0]-handleSize;
        let y = form.y[0]-handleSize;
        let wx = Math.round( ( Math.abs( form.x[1] - form.x[0]) + handleSize) / 2);
        let wy = Math.round( ( Math.abs( form.y[1] - form.y[0]) + handleSize) / 2);
        guide.strokeStyle = draw.style.guide.color;
        guide.fillStyle = draw.style.guide.fillColor;
        guide.strokeRect( x, y, handleSize, handleSize);
        // Rewrite with switch
        if ( selected == "TopLeft") { guide.fillRect( x, y, handleSize, handleSize);}    
        guide.strokeRect( x+wx, y, handleSize, handleSize);
        if ( selected == "TopMiddle") { guide.fillRect( x+wx, y, handleSize, handleSize);}      
        guide.strokeRect( x+2*wx, y, handleSize, handleSize);
        if ( selected == "TopRight") guide.fillRect( x+2*wx, y, handleSize, handleSize);       
        guide.strokeRect( x, y+wy, handleSize, handleSize);
        if ( selected == "MiddleLeft") guide.fillRect( x, y+wy, handleSize, handleSize);       
        guide.strokeRect( x, y+2*wy, handleSize, handleSize);
        if ( selected == "BottomLeft") guide.fillRect( x, y+2*wy, handleSize, handleSize);               
        guide.strokeRect( x+wx, y+2*wy, handleSize, handleSize);
        if ( selected == "BottomMiddle") guide.fillRect( x+wx, y+2*wy, handleSize, handleSize);               
        guide.strokeRect( x+2*wx, y+2*wy, handleSize, handleSize);
        if ( selected == "BottomRight") guide.fillRect( x+2*wx, y+2*wy, handleSize, handleSize);               
        guide.strokeRect( x+2*wx, y+wy, handleSize, handleSize);
        if ( selected == "MiddleRight") guide.fillRect( x+2*wx, y+wy, handleSize, handleSize);               
        //draw.x = [ form.x[0] - handleSize, form.x[1] + 2*handleSize];
        //draw.y = [ form.y[0] - handleSize, form.y[1] + 2*handleSize];
   } // DOMdraw.handles()
  
    clearGuide( guide, draw) {
        guide.strokeStyle = draw.style.default.backColor;
        //guide.clearRect(draw.x[0]-1, draw.y[0]-1, draw.width, draw.height); 
        guide.clearRect(0, 0, draw.width, draw.height); 
        for (var i=0; i< this.maxNbPoints; i++) draw.x[i] = draw.y[i] = -1;   
    } // DOMdraw.clearGuide()
    
  renderToCanvas( dataHolderId, editZone) {
    // Get context
    let canvasContainerId = editZone+"_canvases";
    let styleZoneId = editZone+"_styles";
    let w = document.getElementById( canvasContainerId).childNodes;
    let layers = [ w[0], w[2]];
    let dataHolder = this.dom.element( dataHolderId);
    let drawJSON = dataHolder.textContent;
    if ( drawJSON.charAt(0) != "{" || drawJSON == "{}")
        {
            this.initialize( dataHolderId, canvasContainerId);
            drawJSON = document.getElementById( dataHolderId).textContent;
        }
    var draw = JSON.parse( drawJSON);
    // Clear layers
    for (var i=0; i < layers.length; i++)
    {
      var ctx = layers[i].getContext("2d");
      ctx.clearRect( 0, 0, draw.width, draw.height);
      // Set scale
      //ctx.scale(0.5, 0.5);
      ctx.imageSmoothingEnabled = true;
    }  
    this.setupStyleZone( draw.forms, styleZoneId);
    dataHolder.textContent = JSON.stringify( draw);
    this.drawToCanvas( draw.forms, layers[0], draw.style, canvasContainerId);
  } // renderToCanvas()
  
  // Add HTML elements for style selection and text input
  setupStyleZone( forms, styleZoneId)
  {
    let styleZone = this.dom.element( styleZoneId);
    let dataHolderId = styleZoneId.replace( '_styles', '_drawData');
    for (let formi=0; formi < forms.length; formi++)
    {
       let form = forms[ formi];

       // Create an HTML p element if required
       if ( typeof form.htmlId == "undefined") form.htmlId = "box"+form.id;
       if ( typeof form.htmlId != "undefined")
       {
           let htmlId = form.htmlId;
           if ( styleZone && !this.dom.element( '#'+htmlId, styleZone))
           {
                // Create element
                let para = document.createElement("span"); 
                let txt = form.text;
                let formula = form.formula;
                if ( typeof txt == "undefined") txt = "...";                
                let newText = document.createTextNode( txt);   
                para.appendChild( newText);
                para.className = "drawstyle hidden "+form.style;  // hidden 
                this.dom.attr( para, 'ud_type', "drawstyle");
                // Insert element
                let newElement = styleZone.appendChild( para);
                newElement.id = htmlId;              
                this.dom.attr( newElement, "ude_onvalid", "window.ud.ude.draw.updateFromHTMLelement( '"+dataHolderId+"', '"+htmlId+"');"); 
                this.dom.attr( newElement, "ude_form", form.id); 
                if ( formula)
                {
                    this.dom.attr( newElement, "ude_formula", formula);
                    this.ude.calc.updateElement( newElement);
                    if ( typeof this.calcElements[styleZoneId] == "undefined") this.calcElements[styleZoneId]= [newElement];
                    else this.calcElements[styleZoneId].push( newElement);
                }
                this.dom.attr( newElement, "ude_stage", "on");                
            }
       }
    } // end form loop
  } // UDEdraw.setupStyleZone()
  
  // Draw forms to canvases
  drawToCanvas( forms, canvas, stylesSet, containerId)
  {  
    
    // Draw Back and front 
    debug({level:1}, "Drawing "+forms.length+" forms.");
    for (var i=0; i < forms.length; i++)
    {
       var form = forms[i];
       debug({level:5}, "Drawing ("+i+")",form);
       // Decide which layer
      // layerIndex = 0;
      // if (form.id >= (draw.currentId)) layerIndex = 1;
       var ctx = canvas.getContext("2d");
       // Style
       var style = form.style; 
        if ( typeof style == "string") style = stylesSet[form.style];
        ctx.strokeStyle = style.color.toUpperCase();
        ctx.lineWidth = style.width;
        ctx.fillStyle = style.fillColor;    
       // Draw form (fcts to write)
       // 2DO if form has HTMLid create element if needed
       switch ( form.type)
       {
         case 'line':       
           ctx.beginPath();
           ctx.moveTo(form.x[0], form.y[0]);
           ctx.lineTo(form.x[1], form.y[1]);
           ctx.stroke();
           break;
        case 'triangle' :
            form.x[2] = form.x[0];
            form.y[2] = form.y[1];
            this.drawPolygon( form, ctx, style);
            break;
        case 'rectangle':
            // Rectangle draw
            ctx.strokeRect( form.x[0], form.y[0], form.x[1]-form.x[0], form.y[1]-form.y[0]); 
            if (style.fillColor && style.fillColor != 'none')
                ctx.fillRect( form.x[0], form.y[0], form.x[1]-form.x[0], form.y[1]-form.y[0]);           
          break;
        case 'pentagon' :
            form.x[2] = Math.round( form.x[0] + 2*(form.x[1]-form.x[0])/3);
            form.y[2] = form.y[1];
            form.x[3] = Math.round( form.x[0] + (form.x[1]-form.x[0])/3);
            form.y[3] = form.y[1];
            form.x[4] = form.x[0];
            form.y[4] = Math.round( form.y[0] + (form.y[1]-form.y[0])/3);
            //form.x[1] = form.x[1];
            form.y[1] = Math.round( form.y[0] + (form.y[1]-form.y[0])/3);
            form.x[0] = Math.round( form.x[0] + (form.x[1]-form.x[0])/2);
            //form.y[0] = form.y[0];
            this.drawPolygon( form, ctx, style);
            break;
         case 'hexagon' :
            form.x[2] = form.x[1]
            form.y[2] = Math.round( form.y[0] + 2 * (form.y[1]-form.y[0])/3);
            form.x[3] = Math.round( form.x[0] + (form.x[1]-form.x[0])/2);
            form.y[3] = form.y[1];
            form.x[4] = form.x[0];
            form.y[4] = Math.round( form.y[0] + 2 * (form.y[1]-form.y[0])/3);
            form.x[5] = form.x[0]
            form.y[5] = Math.round( form.y[0] + (form.y[1]-form.y[0])/3);
            //form.x[1] = form.x[1];
            form.y[1] = Math.round( form.y[0] + (form.y[1]-form.y[0])/3);
            form.x[0] = Math.round( form.x[0] + (form.x[1]-form.x[0])/2);
            //form.y[0] = form.y[0];
            this.drawPolygon( form, ctx, style);
            break;
/*       case 'polygon':
            // Polygon drawing
            / *
            if( typeof form.x[2] == "undefined" || form.x[2] == -1 )
            {
                // Define 4 points
                form.x[2] = form.x[1];
                form.y[2] = form.y[1];
                form.x[3] = form.x[0];
                form.y[3] = form.y[1];
                form.y[1] = form.y[0]; 
            }
            * /
            ctx.beginPath();
            ctx.moveTo( form.x[0], form.y[0]);
            ctx.lineTo( form.x[1], form.y[1]);
            ctx.lineTo( form.x[2], form.y[2]);
            ctx.lineTo( form.x[3], form.y[3]);
            ctx.closePath();
            ctx.stroke();
            if (style.fillColor && style.fillColor != 'none')
            {
                ctx.fillColor- style.fillColor;
                ctx.fill();
            }
           break;*/
        case 'circle':
          var centre = [(form.x[0]+form.x[1])/2, (form.y[0]+form.y[1])/2];
          // 2DO Compute radius a and b
          ctx.beginPath();
          ctx.arc(centre[0], centre[1], (form.x[1]-form.x[0]+form.y[1]-form.y[0])/4, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.stroke();
          if (style.fillColor && style.fillColor != 'none') ctx.fill();
          break;
        case 'image':   
          // 2DO image resizing
          ctx.drawImage(form.image, form.x[0], form.y[0]);
          break;
        case 'text' : 
          break;
       }
       // Text
       if ( API.json.value( form, 'text'))
       {
            // Write text
            let fontSize = API.json.value( form, 'fontSize');
            let center = [(form.x[0]+form.x[1])/2, (form.y[0]+form.y[1])/2]; 
            if ( API.json.value( form, 'font')) ctx.font = API.json.value( form, 'font'); 
            let charsByLine = Math.round( ( form.x[1] - form.x[0]) / ctx.measureText("a").width);
            // Split text into lines
            let text = form.text;
            let texts = [];
            while ( text.length > charsByLine) {
                let maxLine = text.substr( 0, charsByLine);
                let lineEnd = maxLine.lastIndexOf( ' ');
                if ( maxLine.lastIndexOf( '.') > lineEnd) lineEnd = maxLine.lastIndexOf( '.');
                texts.push ( text.substring( 0, lineEnd));
                text = text.substring( lineEnd + 1);
            }
            texts.push ( text);
            // Display text according to align
            let align = API.json.value( form, 'align');
            if (  align == "center" || align == "") {                
                for ( let texti=0; texti < texts.length; texti++) {
                    text = texts[ texti];
                    let width = ctx.measureText(text);
                    let centerX = center[0] - Math.round( width.width/2);
                    if ( centerX < form.x[0]) centerX = form.x[0];
                    ctx.fillText( text, centerX, center[1]+texti*1.5*fontSize);
                }
            } else if ( align == "left") {                
                for ( let texti=0; texti < texts.length; texti++)
                    ctx.fillText( texts[ texti], form.x[0], form.y[0] + texti*1.5*fontSize);
            }
       }
    } // end form loop
  } // DOMdraw.render()
  
   /**
    * drawPolygon( form)
    */
    drawPolygon( form, ctx, style) {
        ctx.beginPath();
        ctx.moveTo( form.x[0], form.y[0]);
        for ( let i=1; i < this.maxNbPoints; i++)
            if ( form.x[i] > -1 && form.y[i] > -1) ctx.lineTo( form.x[ i], form.y[ i]);
        ctx.closePath();
        ctx.stroke();
        
        if (style.fillColor && style.fillColor != 'none') {
            ctx.fillColor = style.fillColor;
            ctx.fill();
        }
    } // UDEdraw.drawPolygon()
    
    // Update 1 form from an HTML element
    updateFromHTMLelement( dataHolderOrId, elementOrId) {
        // Get context        
        let dataHolder = this.dom.element( dataHolderOrId);
        let element = this.dom.element( elementOrId);
        let id = element.id;
        let draw = JSON.parse( dataHolder.textContent);
        let forms = draw.forms;
        // Find which form is attached to this id 
        let formi;
        for ( formi=0; formi < forms.length; formi++) 
            if ( forms[ formi].htmlId == id) break;
        if ( formi == forms.length) return false;
        let form = forms[ formi];
        // Tranfert class and CSS attributes of class
        let styles = draw.style;
        let classes = element.classList;
        for ( let classi = 0; classi < classes.length; classi++) {
            let className = classes[ classi];
            // Ignore system styles
            if ( [ "drawstyle", "hidden", "editing"].indexOf( className) == -1)
            {
                // Set form to this style
                form.style = className;
                // Add CSS attributes of class to Draw styles
                if ( typeof styles[ className] == "undefined")
                {
                    // Add style of element to draw object under the class name
                    var newStyle = {};
                    newStyle[ 'color'] = this.dom.attr( element, "computed_color");
                    newStyle[ 'fillColor'] = this.dom.attr( element, "computed_background-color");
                    newStyle[ 'width'] = this.dom.attr( element, "computed_border-width");
                    // 2DO grab font and size
                    styles[ className] = newStyle;
                }
            }
        } // end of class loop
        // Transfert content
        form.text = element.textContent; // 2DO use innerHTML for line breaks
        // Transfert formula
        let formula = this.dom.attr( element, "ude_formula");
        if ( formula) form.formula = formula;
        // Update dataHolder
        dataHolder.textContent = JSON.stringify( draw);
        // Redraw
        this.renderToCanvas( dataHolder.id, element.parentNode.parentNode.id);
        return draw; // UDEdraw.updateFromHTMLelement()
    }
  
    prepareToSave( editZone, dataHolder)
    {
        // Fill data holder with JSONfied graphs instructions
        let draw = this.dom.udjson.parse( dataHolder.textContent);
        for (var i=0; i< 10; i++) draw.x[i] = draw.y[i] = -1;
        draw.currentForm = "none";        
        if ( dataHolder.parentNode == editZone) {
            // JSON100 format
            let objectHolder = editZone.previousSibling;
            let json = this.dom.udjson.parse( objectHolder.textContent);;
            json = this.dom.udjson.valueByPath( json, "data/data/value", draw);
            objectHolder.textContent = JSON.stringify( json);
        } else {
            dataHolder.textContent = JSON.stringify( draw);
        }
        // Return true to go ahead with saving     
        return true;
    } // UDEdraw.prepareToSave()
  
    renderAsSVG()
    {
    }
   /*
    * API functions
    */
    addSVGforms( dataHolderId, svgJSON)
    {
        // Get context
        let dataHolder = this.dom.element( dataHolderId);
        let drawJSON = dataHolder.textContent;
        let draw = JSON.parse( drawJSON);
        let editZoneId = this.dom.attr( dataHolder, "ude_editzone");
        let editZone = this.dom.element( editZoneId);
        // Convert JSON-encode SVG to SVG ( [ tag: "polyline", fill:....) ==> <polyline fill=""   />
        // 2DO Make a function
        let svgObject = svgJSON;
        if ( typeof svgJSON == "string") { svgObject = JSON.parse( svgJSON);} 
        let svgHTML = "";
        for (let objIndex in svgObject)
        {
            let obj = svgJSON[ objIndex];
            svgHTML += '<'+obj.tag+' ';
            for ( let arg in obj)
            {
                if ( arg == "tag") continue;
                svgHTML += arg+'="'+obj[arg]+'" ';
            }
            svgHTML += '/>';            
        }    
        // Convert SVG to UDEdraw forms
        let svg = document.createElement( 'svg');
        svg.innerHTML = svgHTML;
        let svgForms = this.dom.children( svg);
        let forms = [];
        for ( let formi=0; formi < svgForms.length; formi++)
        {
            let svgForm = svgForm[ formi];
            let form = {};
            switch ( form.tagName.toLowerCase())
            {
                case "line" : // line x1="20" y1="100" x2="100" y2="100" stroke-width="2" stroke="black"/>
                    // Get coordinates
                    form.x[0] = this.dom.attr( svgForm, "x1");
                    form.x[1] = this.dom.attr( svgForm, "x2");
                    form.y[0] = this.dom.attr( svgForm, "y0");
                    form.y[1] = this.dom.attr( svgForm, "y1");
                    // Get style
                    // form.style = this.matchOrCreateStyle()
                    // Type
                    form.type = "line";
                    forms.push( form);
                    break;
                case "path" :
                case "polyline" : // <polyline fill="none" stroke="black" points="20,100 40,60 70,80 100,20"/>
                  break;
                case "rect" :
                case "circle" :
                case "ellipse" : 
                case "polygon" :
                case "image" :
            } // End of single form conversion
            forms.push( form);
        } // End of SVG to UDEdraw form loop
        // Add forms
        draw.forms = draw.forms.concat( forms);
        dataHolder.textContent = JSON.Stringify( draw);
        // Redraw
        this.renderToCanvas( dataHolderId, editZone);
        return true;
    } // UDEdraw.addSVGforms()
    
    textWidth( text) {
        // re-use canvas object for better performance
        const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
        const context = canvas.getContext("2d");
        context.font = font;
        const metrics = context.measureText(text);
        return metrics.width;
    }
  
} // Class UDEdraw()

if ( typeof process != 'object') {
    let exTag = "div.graphic";
    if ( window.ud && !window.ud.ude.modules[ exTag].instance) {
        // Initialise
        let module = new UDEdraw( window.ud.dom, window.ud.ude);
        window.ud.ude.modules[ exTag].instance = module;
        window.ud.ude.modules[ exTag].state = "loaded";
        window.ud.ude.draw = module;
    }
} else {
    // Testing under node.js
    if( typeof module != "undefined") module.exports = { class: UDEdraw, UDEdraw:UDEdraw};    
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined") {
        console.log( 'Start of test program');
        console.log( 'Syntax:OK');
        let path = "../..";
        const testMod = require( path+'/tests/testenv.js');
        testMod.load( []); 
        let ud = new UniversalDoc( 'document', true, 133);   
        let ude = ud.ude;    
        //let ude = new UDE( window.topElement, null);        
        let editor = new UDEdraw( ude.dom, ude);
        let view = editor.dom.element( "div.part[name='myView']", editor.dom.element( 'document'));        
        // Test 1 - JSON100
        {
            // Create object div.listObject and append to element            
            // Data
            name = "myTestGraphic";          
            let object = editor.newGraphicObject( name);
            // Create container
            let id = "B0100000005000000M";            
            let attributes = {id:id, class:"graphic", ud_mime:"text/json"};
            let element = editor.dom.prepareToInsert( 'div', object.outerHTML, attributes);
            // element.appendChild( object);
            // Append component to view
            view.appendChild( element);   
            // Initialise
            editor.initialise( id);
            testResult( "udedraw 1 JSON100", element.innerHTML.indexOf( "myTestGraphic") && element.innerHTML.indexOf( "<canvas"));
        }         
        console.log( 'Test completed');
        process.exit();
    } else {
        let exTag = "div.graphic";
        if ( window.ud && window.ud.ude && !window.ud.ude.modules[ exTag].instance) {
            // Initialise
            let modulel = new UDEdraw( window.ud.dom, window.ud.ude);
            window.ud.ude.modules[ exTag].instance = modulel;
            window.ud.ude.modules[ exTag].state = "loaded";
            window.ud.ude.draw = modulel;
        }
    }       
} // End of test routine
