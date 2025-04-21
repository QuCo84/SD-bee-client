/**
 * sdbee-client.js -- loader for SD bee client
 * Copyright (C) 2023  Quentin CORNWELL
 *  
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * To load the SD bee client-side code, include the following instruction in the pages header (automatically done if you are using SD bee on the server),
 * with {base_url} replaced with the URL to reach the root directory of your sdbee-client project.
 *  <script>
 *      require(['{base_url}/app/config/requireconfig.js'], function() { app_load; });
 *  </script>           
 */

require.config({
    baseUrl:'app/',
    paths: {
        'moment': "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js",
        'dayjs' : "https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.7/dayjs.min",
        'dayjscdn' : "https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.7",
        'ejs' : "https://cdn.jsdelivr.net/npm/ejs@3.1.9/ejs.min.js",
        'min-core' : 'https://www.sd-bee.com/upload/ude-min-v-0-3-1.js',
    },
    waitSeconds : 25
});

/*
function requireMany () {
    return Array.prototype.slice.call(arguments).map(function (value) {
        try {
            return require(value)
        }
        catch (event) {
            return console.log(event)
        }
    })
}
*/
function app_load_do() {
    let ud = window.ud;
    // ud.ude.calc.redoDependencies();
    leftColumn = new Zone('leftColumn', 'rightColumn'); 
    rightColumn = new Zone('rightColumn', 'leftColumn');
    if ( typeof window.onloadapp != "undefined") window.onloadapp();
    setTimeout( () => leftColumn.manageButtons(), 3000);
}
function app_load( pathToRegister) {
    // Get version file suffix to avoid JS cache issues
    let versionHolder = document.getElementById( 'UD_version');
    if ( versionHolder) version = versionHolder.textContent;
    else version = "";
    // Set up SERVER and SERVICE
    $url = window.location.href;
    $urlParts = $url.split( '/');
    window.UD_SERVER = $urlParts[ 0]+"//"+$urlParts[ 2]; 
    window.UD_SERVICE = "sdbee";  
    window.version = version; 
    window.global = window;
    // Catch require errors
    require.onError = function(e) {
        console.log( e.stack);
        alert( "Loading error Please reload page " + e.message);
    };
    // !!! Uodate standard modules in udconstants.php when changing loaded modules under modules/
    // Using inidividual files
    modules = [
        'app/config/udregister'+version,
        'app/helpers/debug'+version,
        'app/config/udconstants'+version, 
        'app/$$$/udjson'+version, 
        'app/helpers/domcursor'+version, 'app/helpers/domvalue'+version, 'app/helpers/dom'+version, 'app/helpers/udajax'+version,
        'app/config/udeconstants'+version, 'app/calculator/udecalc'+version, /*'app/calculator/udecalc_css'+version,*/
        'app/helpers/udemenu'+version, 'app/helpers/udelayout'+version, 
        'app/helpers/udeclickhandler'+version, 'app/ude'+version, 
        'app/modules-autoload/udetext'+version,
        'app/$$$/apiset1'+version, 'app/$$$/apiset2'+version, 'app/$$$/udapi'+version, 
        'app/$$$/udmodule'+version, 'app/$$$/udutilities'+version,
        'app/$$$/udresources'+version,'app/$$$/udcontent'+version,
        'app/modules-autoload/zone'+version,
        'app/ud'+version, 
        'dayjs', 
        'dayjscdn/plugin/relativeTime', 
        'dayjscdn/plugin/customParseFormat',
        'dayjscdn/plugin/weekOfYear',
        'dayjscdn/locale/fr',
        'moment', // has to be here until we configure chart.js to use dayjs or don't add v string
    ];
    // Turn busy LED on
    let led = document.getElementById( 'STATUS_busy');
    if (led) {
        led.setAttribute( 'stroke', "pink");    
        led.setAttribute( 'fill', "pink");          
    }    
    // Hide footer during initi
    let footer = document.getElementById( 'footer');
    if ( footer) { footer.classList.add( 'hidden');}
    if ( typeof requirejs_app != "undefined") app_load_do();
    else {
        requirejs_app = "loading";    
        require( modules, function() {
            let modeHolder = document.getElementById( 'UD_mode');
            if ( modeHolder) {
                let mode = modeHolder.textContent;
                let langHolder = document.getElementById( 'UD_lang');
                window.lang = ( langHolder) ? langHolder.textContent : "FR";
                let editable = true;
                if ( mode == "model" || mode == "public" || mode == "display") editable = false;
                window.ud = new UniversalDoc( 'document', editable, user);
                app_load_do(); 
            }
            let debugLevelHolder = document.getElementById( 'UD_debug');
            if ( debugLevelHolder) {
                DEBUG_level = 10 - ( parseInt( debugLevelHolder.textContent) % 10);
            }
            // window.onload();
            requirejs_app = "loaded";
            debug( {level:5}, "Finished require");
        });
    }
}
