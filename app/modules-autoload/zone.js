    /*if ( typeof getComputedStyle == "undefined")
    {
        function getComputedStyle( element)
        {
            return window.getComputedStyle( element);
        }
    }*/
   /**
    * Zone JS class -- manage the visibility of 2 zones according to screen size
    * @param {string} name1 Name of first zone
    * @param {string} name2 Name of sencod zone    
    */    
    function Zone( name1, name2) {
    /*
      this.name; // zone name
      element; // HTML element
      mode;
      saveContent;
      params; // min max width etc
   
      constructor = function( name1, name2) {
      */
        this.stayOpenTime = 180000;
        this.mobileModeMaxWidth = 480;
        this.getStyle1 = function(attributeName, type)
        {
           var r = window.getComputedStyle(this.element1)[attributeName];
           if (type == "nb") return parseInt(r);
           return r;
        } // getStyle()      
        this.getStyle2 = function(attributeName, type)
        {
           var r = window.getComputedStyle(this.element2)[attributeName];
           if (type == "nb") return parseInt(r);
           return r;
        } // getStyle()      
        this.element1 = document.getElementById( name1);
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

        this.manageButtons = function() {
          let b1 = document.getElementById( 'leftToolIcon');
          let b2 = document.getElementById( 'rightToolIcon');
          let c1 = ( this.element1.textContent.length > 25);
          let c2 = ( this.element2.textContent.length > 25);
          if ( !c1 && b1)  b1.classList.add( 'hidden');
          else if ( c1 && b1) b1.classList.remove( 'hidden');
          if ( !c2 && b2) b2.classList.add( 'hidden');
          else if ( c2 && b2) b2.classList.remove( 'hidden');
        }

        this.switchDisplayMode = function( forceBigScreen=false)
        {
           // Ignore if nothing to show
           let c1 = ( this.element1.textContent.length > 25);
           let c2 = ( this.element2.textContent.length > 25);
           // Get width of sister zones
           let w1 = window.getComputedStyle(this.element1)['width'];
           let w2 = window.getComputedStyle(this.element2)['width'];
           let scrollY = window.scrollY;
           let screenWidth = ( forceBigScreen) ? 1200 : screen.innerWidth;
           if (!screenWidth) screenWidth = screen.availWidth;
           console.log( "window.scrollY:"+scrollY+", screenWidth:"+screenWidth);
           if ( w1 == "0px" && ( screenWidth > this.mobileModeMaxWidth || w2 == "0px") && c1)
           {
             this.element1.style.width = window.getComputedStyle(this.element1)['max-width'];
             this.element1.style.top = scrollY+"px";
             if ( scrollY) {
                 let me = this;
                 window.addEventListener( 'scroll', function( event) { me.scrollMove( event, me.element1);});
             }
             var toolZone  = this.element1.querySelector( "div.tool-zone");
             toolZone.style.display = "block";
             setTimeout( function(){leftColumn.closeAll( true);}, this.stayOpenTime);
           }             
           else if ( w1 != "0px" && ( screenWidth >= this.mobileModeMaxWidth || w2 == "0px") && c2)
           {
             if ( screenWidth < this.mobileModeMaxWidth)
             {
                 this.element2.style.width = window.getComputedStyle(this.element2)['max-width'];
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
             API.setAttribute('outlineCurrentElementCSS', '');
             var div = document.getElementById( "document");
             for (var child in div.childNodes) 
             {
               // 2DO only 1 element stylised ...break afterwards ?             
               if ( typeof div.childNodes[child] == "object" && div.childNodes[child].classList) 
                 div.childNodes[child].classList.remove('StylerTool_outline');
             }             
           }  else if ( w1 != "0px" && w2 == "0px") {
             this.element1.style.width = "0px";
             var toolZone  = this.element1.querySelector( "div.tool-zone");
             toolZone.style.display = "none"           
           } else if ( w1 == "0px" && w2 != "0px") {
             this.element2.style.width = "0px";
             var toolZone  = this.element2.querySelector( "div.tool-zone");
             toolZone.style.display = "none"           
           }
       } // changeDisplayMode

       this.closeAll = function ( resetZone = false)
       {
           // 2DO don't close if iframe, restart timer instead
       	   this.element1.style.width = "0px";
           this.element2.style.width = "0px";
           if ( resetZone)
           {
              // Empty zone on content refresh
              this.element1.childNodes[3].innerHTML = "";
              this.element2.childNodes[3].innerHTML = "";
           }

       } //Zone.closeAll()
       
        this.scrollMove = function ( event, element) {
            let scrollY = window.scrollY;
            let contentHeight = parseInt( window.getComputedStyle( document.getElementById( 'content'))['height'].slice( 0, -2));           
            let w1 = window.getComputedStyle(this.element1)['width'];
            let w2 = window.getComputedStyle(this.element2)['width'];
            if ( w1) { 
                this.element1.style.top = scrollY+"px";
                this.element1.style.height = ( contentHeight - scrollY)+"px";
                //this.element1.style.overflowY = "scroll";
            }    
            if ( w1) { 
                this.element2.style.top = scrollY+"px";
                this.element2.style.height = ( contentHeight - scrollY)+"px";
                //this.element1.style.overflowY = "scroll";
            }    
           if ( !w1 && !w2) window.removeEventListener( 'scroll', function( event) { me.scrollMove( event, element);});
        }
       this.closeIfAnchor = function( target, resetZone=false)
       {
           if (target.tagName.toLowerCase() == 'a' /*!= "input"*/) this.closeAll( resetZone);
       }
    } // Class zone     
    
    if ( typeof process == 'object') {
        // Export    
        module.exports = { class:Zone};
        
    }
