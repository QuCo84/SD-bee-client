/** 
 *  udapiset3.js - $$$ methods set 3
 */
class UDapiSet3
{
    // Parameters
    // Modules
    moduleName = "apiset3.js";
    ud = null;
    dom = null;
    
    // setup UDapi
    constructor( udOrAPI = null)
    {
        if ( typeof API == "undefined") {
            // Just testing this set of methods
            this.ud = udOrAPI;
            if ( typeof this.ud.ude != "undefined") this.ude = this.ud.ude; else this.ude = ud;
            this.dom = this.ud.dom;
			this.udajax = this.ud.udajax;
            this.calc = this.ude.calc;
			this.udeTable = this.ude.modules[ "div.table"]["instance"];
		} else if ( udOrAPI == API) {
            // Called by API
            this.ud = API.ud;
            this.dom = API.dom;
            this.udajax = API.udajax;            
            this.utilities = API.utilities;
            API.addFunctions( this, [
                'getProgressSVG'
            ]);            
        }
       // if ( typeof process == 'object') global.API = this;            


    } // UDapi.construct()

    getProgressSVG( currentStep, stepDatas, progress, width) {
        // Get target type
        let steps = Object.keys( stepDatas).length;        
        // Build SVG
        let xRatio = 1;
        let yRatio = 1;
        let color = 'green';
        let template = [ [30,0],[60,15],[60,45],[30,60],[0,45],[0,15]];
        let svgNS = 'http://www.w3.org/2000/svg';
        let w = Math.round( 60 * xRatio);
        let w2 = w * steps * 3;
        let h = Math.round( 60 * yRatio);
        let marginH=10;
        // Get space between steps
        let arrowWidth = ( width - steps * w - 2*marginH) / (steps-1);
        // Create SVG element
        let posX = marginH; // Math.round( w/2);
        let posY = 20;
        let sysColor = "rgba( 120, 120, 120, 1)";
        let svgEl = document.createElementNS( svgNS, 'svg');
        svgEl.setAttribute('fill', 'none');
        svgEl.setAttribute('viewBox', '0 0 ' + width + ' ' + ( h + posY));
        svgEl.setAttribute('stroke', 'black');
        svgEl.setAttribute( 'width', width);
        svgEl.setAttribute( 'height', h + posY);
        // Add Arrow marker
        let marker = document.createElementNS( svgNS, 'marker');
        marker.id = 'triangle-' + currentStep;
        marker.setAttribute( 'viewBox', "0 0 10 10");
        marker.setAttribute( 'refX', "0");
        marker.setAttribute( 'refY', "5");        
        marker.setAttribute( 'markerWidth', "4");
        marker.setAttribute( 'markerHeight', "3");
        marker.setAttribute( 'orient', "auto");
        marker.setAttribute( 'stroke', sysColor);
        marker.setAttribute( 'fill', sysColor);
        let markerPath = document.createElement( 'path');
        markerPath.setAttribute( 'd', "M 0 0 L 10 5 L 0 10 z");
        markerPath.setAttribute( 'fill', "context-stroke");
        marker.appendChild( markerPath);
        svgEl.appendChild( marker);
        let stepi= 1;
        for ( let step in stepDatas) { //i=1; stepi <= steps; stepi++) {
            let stepData  = stepDatas[ step];
            // Draw hexagon to represent this step            
            let polygon = document.createElementNS( svgNS, 'polygon');            
            polygon.setAttribute( 'width', w);
            polygon.setAttribute( 'height', h);
            for ( let i=0; i < template.length; i++) {
                let point = svgEl.createSVGPoint();
                point.x = Math.round( template[i][0] * xRatio) + posX;
                point.y = Math.round( template[i][1] * yRatio) + posY;
                polygon.points.appendItem( point);                
            }
            // Select color based on current progress and step
            if ( progress >= stepData[ 'progress-end']) color = "rgba( 0,250,0,1)";
            else if ( progress < stepData[ 'progress-start']) color = "rgba( 220,220,220,1)";
            else color = "rgba( 240,240,100,1)";
            polygon.setAttribute( 'fill', color);
            polygon.setAttribute( 'stroke', color);
            svgEl.appendChild( polygon);
            // Add text
            // Add step label if not current            
            let no = document.createElementNS("http://www.w3.org/2000/svg","text");
            no.setAttribute( "x", posX + w*8/20);
            no.setAttribute( "y", posY + h*12/20); //posY*0.75);
            no.setAttribute( "width", 20);
            no.setAttribute( "height", 20);
            no.setAttribute( "font-family","Arial");
            no.setAttribute( "font-size","20");
            no.setAttribute( "fill",sysColor);
            no.setAttribute( "stroke",sysColor);
            no.setAttribute( "stroke-width",0.25);            
            no.appendChild( document.createTextNode( stepi));
            svgEl.appendChild( no);            
            if ( stepi != currentStep) {
                // Add step label if not current
                let label = document.createElementNS("http://www.w3.org/2000/svg","text");
                label.setAttribute( "x", Math.round( posX + w/2 - stepData.label.length*4.5));
                label.setAttribute( "y", posY - 2); //posY*0.75);
                label.setAttribute( "width", 2 * w);
                label.setAttribute( "height", posY);
                label.setAttribute( "font-family","Arial");
                label.setAttribute( "font-size","18");
                label.setAttribute( "fill",sysColor);
                label.setAttribute( "stroke",sysColor);
                label.setAttribute( "stroke-width",0.25);
                label.setAttribute( "spellcheck", "false");
                label.appendChild( document.createTextNode( stepData.label));
                svgEl.appendChild( label);
            }
            if ( stepi < steps) {
                // Add arrow to next step
                let line = document.createElementNS( svgNS, 'line');
                let y = Math.round( h/2) + posY;
                line.setAttribute( 'x1', posX + w);
                line.setAttribute( 'y1', y );
                line.setAttribute( 'x2', posX + w + arrowWidth - 10);
                line.setAttribute( 'y2', y );
                line.setAttribute( 'stroke', "rgba( 160, 160, 160, 1)");
                line.setAttribute( 'fill', "rgba( 160, 160, 160, 1)");
                line.setAttribute( 'stroke-width', 3);
                line.setAttribute( 'marker-end', "url(#triangle-" + currentStep + ")");
                svgEl.appendChild( line);
            }            
            posX += w + arrowWidth;
            stepi++;
        }
        svgEl.innerHTML = svgEl.innerHTML;
        return svgEl;
    }
    /*
<marker xmlns="http://www.w3.org/2000/svg" id="triangle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="4" markerHeight="3" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z"/>
    </marker>
    */
}