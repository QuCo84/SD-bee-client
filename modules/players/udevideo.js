/* -------------------------------------------------------------------------------------------
 *  udevideo.js
 * 
 *  This is the client-side part of the video module and works with the server-side udvideo.php
 *  
 *  As with other UD modules, methods are grouped in 5 blocks as listed below :
 *    
 *     1 - UD-VIEW-MODEL reception  - preparing received data for editing
 *     2 - UDE-VIEW                 - editing functions
 *     3 - UD-VIEW-MODEL saving     - preparing edited data for saving
 *     4 - CALCULATOR               - calculator functions (need to be declared in udecalc.js)
 *     5 - UTILITIES                - local methods 
 *
 */
 
 class UDEvideo
 {
    ud;
    dom;
    ude;
    videos = {};
    ratio = 854/480;
    inverseRatio = 480/854;
    marginWidth = 0.05;
    marginHeight = 0.05;
    
    // Set up video display and parameter editor module
    constructor( ud)
    {
        this.ud = ud;
        this.dom = ud.dom;
        if ( typeof ud.ude != "undefined") this.ude = ud.ude; else this.ude = ud;
    } // UDEvideo.construct()
    
   /**
    *  2 - UD-VIEW-MODEL reception
    */
    // Initialise an HTML block - setup viewing and editing zone
    initialise( saveableId)
    {
        // Find dataHolder and json data
        let saveable = this.dom.element( saveableId);
        if (!saveable) return debug( {level:2, return:false}, "Can't find ", saveableId);
        let dataChildren = saveable.childNodes;
        let dataHolder = saveable.getElementsByTagName( 'div')[0];
        let data = "";
        let jsonData = null;
        let name = "";
        let subType = this.dom.attr( saveable, 'ud_subtype');
        if ( dataHolder)
        {
            // Initialised element, extract name and data
            // Get name
            name = dataChildren[0].textContent;
            name = name.replace(/ /g, '_').replace(/'/g,'_').replace(/"/g, '');            
            // Get data as JSON
            data = dataHolder.textContent;
            jsonData = JSON.parse( data);
        }
        else
        {
            // Uninitialised element
            // Get name to use as dataholder and in editzone elements
            let content = saveable.textContent;
            if ( content == "" || content == "...") content = "Video_"+saveableId;
            name = content.replace(/ /g, '_').replace(/'/g,'_').replace(/"/g, '');
            // Get initial data
            data = '{ "src":"/upload/street.webm", "poster":"", "mode":"controls ", "width":"auto", "height":"450"}'; 
            // 2DO waiting GIF
            // Set dataHolder
            dataHolder = saveable.getElementsByTagName( 'div')[0];                      
        }
        //this.videos[ name][ 'src'] = jsonData.src.split( ','); // 2DO No use element's attributes
        //this.videos[ name][ 'mode'] = jsonData.mode;
        // Get names of edit and view zones
        let viewZoneId = dataHolder.id+"_viewZone"; 
        let video = null;
        let editZoneId = dataHolder.id+"_editZone"; 
        // Get default values for substitution
        let editClick = "window.ud.ude.changeClass( 'hidden', '"+editZoneId+"'); window.ud.ude.changeClass( 'hidden', '"+viewZoneId+"');";        
        // Find existing viewZone
        let viewZone = this.dom.element( viewZoneId);   
        let editZone =  this.dom.element( editZoneId);
        if ( !viewZone) {
            // Build view zone
             /* 2DO done in PHP for the moment
            let video !newViewZone = document.createElement( 'video');
            viewZoneId = dataHolder.id+"viewZone"; 
            this.dom.attr( newViewZone, "id", viewZoneId);
            this.dom.attr( newViewZone, "class", "htmlView");
            this.dom.attr( newViewZone, "ude_autosave", "off");
            // let editButton = "<span class=\"discrete\"><a href=\"javascript:\" onclick=\""+editClick+"\">edit</a></span>";
            html = this.ude.calc.substitute( html, values);
            newViewZone.innerHTML = html; //html.replace( "{edit}", editButton);
            // Insert into doc
            if ( saveable.nextSibling) container.insertBefore( newViewZone, saveable.nextSibling);
            else container.appendChild( newViewZone);            
            viewZone = newViewZone;
         */            
        }
        let mode = this.dom.attr( saveable, "ud_mode");        
        if ( !editZone && mode.indexOf( 'edit') == 0) {
            // Build display and edit zones
            // Add new zones to same container as saveable
            let container = saveable.parentNode;          
            // Build editZone for configuration as invisble
            let newEditZone = document.createElement( 'div');
            this.dom.attr( newEditZone, "id", editZoneId);
            this.dom.attr( newEditZone, "class", "linetext hidden");
            this.dom.attr( newEditZone, "ude_autosave", "off");
            this.dom.attr( newEditZone, "ude_bind", dataHolder.id);
            // Add HTML edition
            let edTable = this.ude.textEd.convertTextToHTMLtable( htmledit, dataHolder.id, "");
            newEditZone.appendChild( edTable);            
            // Insert into doc
            if ( saveable.nextSibling) container.insertBefore( newEditZone, saveable.nextSibling);
            else container.appendChild( newEditZone);
            editZone = newEditZone;
        }

        // Get video element
        video = viewZone;
        // Update viewZone
        // viewZone.innerHTML = html; //html.replace( "{edit}", editButton);            
        // Hide editzone
        if ( editZone && !editZone.classList.contains( 'hidden')) editZone.classList.add( 'hidden');
        // Show viewZone
        if ( viewZone.classList.contains( 'hidden')) viewZone.classList.remove( 'hidden');
  
        if ( video)
        {
            // Get alert at end of video
            let me = this;
            video.addEventListener( 'ended', function ( event) { me.inputEvent( event, this);},false);
            if ( !saveable.classList.contains( 'collapsed')) {
                setTimeout( function() { me.inputEvent( {type:"scroll"}, video);}, 200);
                //video.setAttribute( "autoplay", "on");video.load();}, 3000);
            }
        }
        
        return true;
    } //UDEvideo.initialise()
        
    
   /**
    *  2 - UDE-VIEW Interface                                                 
    */
    
    // User-generated event 
    inputEvent( e, element)
    {
        let processed = false;
        let source = element;
        let content = source.textContent;
        let event = e.type;
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
            case "ended" :
                // Video has ended
                let sourceList = this.dom.attr( element, 'ud_srclist').split( ',');
                let sourceIndex = parseInt( this.dom.attr( element, 'ud_srcindex'));
                if ( sourceIndex < sourceList.length)
                {
                    // Get next video and move index
                    let sources = this.dom.children( element);
                    let nextVideo = sourceList[ sourceIndex];
                    sourceIndex++;
                    this.dom.attr( element, 'ud_srcindex', sourceIndex+'');                    
                    // Display poster
                    this.dom.attr( element, 'autoplay', "__CLEAR__");
                    this.dom.attr( sources[0], 'src', "__CLEAR__");    
                    element.load();
                    // Display next video in 1.5 secs
                    let me = this;
                    setTimeout( function() {                    
                        me.dom.attr( sources[0], 'src', nextVideo);
                        me.dom.attr( element, 'autoplay', "autoplay");
                        element.load();
                    }, 1500);
                }
                else
                {
                    // 2DO restart in n secs
                    let sources = this.dom.children( element);
                    this.dom.attr( element, 'autoplay', "__CLEAR__");
                    this.dom.attr( sources[0], 'src', "__CLEAR__");   
                    this.dom.attr( element, 'ud_srcindex', '0');                    
                    element.load();
                }
                processed = true;                
                break;
            case "classAdded" :
                let className = e.class;
                if ( [ 'collapsed', 'expanded'].indexOf( className) > -1) { return this.inputEvent( { type:"scroll"}, element);}
                break;    
            case "scroll" :
                // Screen has moved
                // Find a video that has become completely visible
                // Start play if required
                // Stop if not visible
                // Adjust dimensions of video to fit parent
                let maxWidth = ud.dom.attr( saveable, 'computed_width') * (1 - this.marginWidth);
                let maxHeight = ud.dom.attr( saveable, 'computed_height') * ( 1 - this.marginHeight);
                //let maxHeight = API.dom.attr( saveable, 'ud_iheight') * ( 1 - this.marginHeight);
                let video = element;
                if ( maxHeight > maxWidth*this.inverseRatio)
                {
                    // Width of container determines video size
                    this.dom.attr( video, 'width', maxWidth);
                    this.dom.attr( video, 'height', maxWidth*this.inverseRatio); // 2DO use ratio parameter

                }
                else
                { 
                    // Height of container determines video site}
                    this.dom.attr( video, 'width', maxHeight * this.ratio);
                    this.dom.attr( video, 'height', maxHeight ); // 2DO use ratio parameter
                }
                if ( this.dom.attr( element, "ude_autoplay"))
                {
                    video.setAttribute( "autoplay", "autoplay");
                    video.load();
                }
                processed = true;
                break;
            case "touchstart" :
            case "click" :
                /* ACtivate when video element has name 
                let editZone =  this.dom.element( this.dom.attr( saveable, 'name')+"editZone");
                if ( editZone) {                    
                    this.ude.toggleClass( editZone, 'hidden');
                    this.ude.toggleClass( element, 'hidden');
                } else*/ 
                if ( element.tagName == "VIDEO" && !this.dom.attr( element, 'autoplay'))
                {
                    let sources = this.dom.children( element);
                    let sourceList = this.dom.attr( element, 'ud_srclist').split( ',');
                    this.dom.attr( element, 'ud_srcindex', 1);                    
                    let nextVideo = sourceList[ 0];
                    let me = this;
                    me.dom.attr( sources[0], 'src', nextVideo);
                    me.dom.attr( element, 'autoplay', "autoplay");
                    element.load();
                    // this.inputEvent( { type:'scroll'}, element);
                     processed = true;    
                }
                break;
            case "newline" :
                this.ude.textEd.inputEvent( e, element)
                break;
            case "save" :
                processed = this.prepareToSave( element, e.target);
                break;
            case "remove" :
                break;
            case "insert" :
                break;
        }   
        return processed;
    
    } // UDEvideo.inputEvent()
    
   /**
    *  3 - UD-VIEW-MODEL saving
    */
    
    // Update an HTML block
    update( saveableId)
    {
    } // UDEchart.update()
    
    // Update binded saveable element with table's content
    prepareToSave( editorZone, dataHolder)
    {
        let save = false;
        /* 2DO edition of JSON parameters
        // Find table that holds text
        var table = editorZone.getElementsByTagName( 'table')[0];
        if (!table) return debug( {level:1, return: null}, "can't find table in ", editorZoneId);
        var rows = table.getElementsByTagName( 'tbody')[0].rows;
        // Get data
        let text = "";
        for( let rowi=0; rowi < rows.length; rowi++)
        {
            let line = rows[rowi].cells[1].innerHTML;
            text += line+"\n"; 
        }
        if ( save)
        {
            dataHolder.textContent = text;
            this.initialise( dataHolder.parentNode.id);
        }
        */
        return save;
    } // UDEvideo.prepareToSave()

   /*
    * 4 - CALUCLATOR functions
    */
    
   /*
    * 5 - UTILITIES
    */
    
} // JS class UDEvideo

// Auto initialise
function initialiseUDEvideo( ud = window.ud) {
    let object = new UDEvideo( ud);
    let modules = ud.ude.modules;
    if ( modules && typeof  modules[ 'div.video'] != "undefined") {
        modules[ 'div.video'].instance = object;
    }
} 

if ( typeof process == 'undefined') initialiseUDEvideo();

if ( typeof process == 'object')
{
    // Testing under node.js
    module.exports = { class: UDEvideo};
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined")
    {
        console.log( 'Start of test program');
        console.log( 'Syntax:OK');    
        console.log( 'Test completed');
    }        
} // End of test routine