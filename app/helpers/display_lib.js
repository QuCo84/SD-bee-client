 
     // ZONE here obsolete put in ud.js
    // jquery equivalent use ES5
    function getComputedStyle( element, attrName)
    {
        return [];
    }
    function Zone( name1, name2)
    {
    /*
      this.name; // zone name
      element; // HTML element
      mode;
      saveContent;
      params; // min max width etc
   
      constructor = function( name1, name2) {
      */
        this.stayOpenTime = 180000;
        this.getStyle1 = function(attributeName, type)
        {
           var r = getComputedStyle(this.element1)[attributeName];
           if (type == "nb") return parseInt(r);
           return r;
        } // getStyle()      
        this.getStyle2 = function(attributeName, type)
        {
           var r = getComputedStyle(this.element2)[attributeName];
           if (type == "nb") return parseInt(r);
           return r;
        } // getStyle()      
        this.name1 = "#"+name1;
        this.element1 = document.getElementById( name1);
        this.name2 = "#"+name2;
        this.element2 = document.getElementById( name2);
        this.mode = "";
        this.saveContent = "";
        this.params = "";
        if ( this.getStyle1( 'width', 'nb') == 0) 
        {
          this.mode = "Reduced";
          // 2DO retrieve content  (maye be decline Zone)
          // 2DO Show open button
        }  
        this.toolZone1 = this.element1.childNodes[3];
        //this.toolZone2 = this.element2.childNodes[3];
        //var me = this;
        this.toolZone1.setAttribute( 'onclick', "leftColumn.closeIfAnchor(event.target, true);");
        //this.toolZone2.setAttribute( 'onclick', "rightColumn.closeAll( true);");

        this.switchDisplayMode = function()
        {
           let w1 = getComputedStyle(this.element1)['width'];
           let w2 = getComputedStyle(this.element2)['width'];
           let scrollY = window.scrollY;
           console.log( scrollY);
           let screenWidth = screen.innerWidth;
           if (!screenWidth) screenWidth = screen.availWidth;
           if ( w1 == "0px" && ( screenWidth > 380 || w2 == "0px") )
           {
             this.element1.style.width = getComputedStyle(this.element1)['max-width'];
             this.element1.style.top = scrollY+"px";
             var toolZone  = this.element1.querySelector( "div.tool-zone");
             toolZone.style.display = "block";
             setTimeout( function(){leftColumn.closeAll( true);}, this.stayOpenTime);
           }             
           else if ( w1 != "0px" && ( screenWidth > 380 || w2 == "0px"))
           {
             if ( screenWidth < 380)
             {
                 this.element2.style.width = getComputedStyle(this.element2)['max-width'];
                 var toolZone  = this.element2.querySelector( "div.tool-zone");
                 toolZone.style.display = "block";
		 setTimeout( function(){rightColumn.closeAll( true);}, this.stayOpenTime);                 
             }
             this.element1.style.width = "0px";
             var toolZone  = this.element1.querySelector( "div.tool-zone");
             toolZone.style.display = "none";
             // Clean up current tool stuff (sleep)
             // 2DO save stuff for when you awaken tool
             // Quick fix trial for disabling outline
             requestEditor('setAttribute', 'outlineCurrentElementCSS', '');
             var div = document.getElementById( "document");
             for (var child in div.childNodes) 
             {
               // 2DO only 1 element stylised ...break afterwards ?             
               if ( typeof div.childNodes[child] == "object" && div.childNodes[child].classList) 
                 div.childNodes[child].classList.remove('StylerTool_outline');
             }             
           }          
           else if ( w1 == "0px" && w2 != "0px")
           {
             this.element2.style.width = "0px";
             var toolZone  = this.element2.querySelector( "div.tool-zone");
             toolZone.style.display = "none"           
           }
       } // changeDisplayMode

       this.closeAll = function ( resetZone = false)
       {
       	   this.element1.style.width = "0px";
           this.element2.style.width = "0px";
           if ( resetZone)
           {
              // Empty zone on content refresh
              this.element1.childNodes[3].innerHTML = "";
              this.element2.childNodes[3].innerHTML = "";
           }

       } //Zone.closeAll()
       
       this.closeIfAnchor = function( target, resetZone=false)
       {
           if (target.tagName.toLowerCase() == 'a' /*!= "input"*/) this.closeAll( resetZone);
       }
 } // Class zone     
 
 // Global variables
var group_index = 0;
var block_indexes = new Array();
var blocks = new Array();           // block names

/* --------------------------------------------------------------------------------
 *   RegisterBlock( group, block)
 *     register a block for event manager
 */ 
function RegisterBlock( group, block) {
  var grp;
  if ( group < 10) { 
    // Create new group(s)
    while (group_index <= group) {
      grp = new Array();
      block_indexes[ group_index] = 0;
      blocks[ group_index++] = grp;
    }  
    grp = blocks[ group];
    grp[ block_indexes[ group]] = block;
    block_indexes[group]++;
    blocks[ group] = grp;    
  }
  return true;
} // RegisterBlock()

/* --------------------------------------------------------------------------------
 *   ShowBlock( group, name)
 *     make  a block visible and all others of the same group invisible
 */ 
function ShowBlock( group, name) {
  var o;
  var grp;
  grp = blocks[ group];
  for (var i in grp) {
    o = document.getElementById( grp[i]);
    if ( grp[i] == name) {
      // Make visible
      o.style.display='block'; 
      o.style.visibility = 'visible';
    } else {
      // Make invisible
      o.style.display = 'none'; 
      o.style.visibility = 'hidden';   
    }
  }
} // ShowBlock()

if ( typeof process == 'object')
{
    // Testing/running under node.js
    // console.log( 'Declaring for nodejs');
    module.exports = { RegisterBlock: RegisterBlock, ShowBlock:ShowBlock, Zone:Zone}
} // End of test routine
