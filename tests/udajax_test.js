/*
* NODEJS ENVIRONMENT
*/
// GET request when running under nodejs 
nodejs_get( uri, context={}, successCallback= null, errorCallback=null)
{
    // Get request class
    var request = window.request;
    // Build URL
    this.server = "http://dev.rfolks.com";
    if ( uri.charAt(0) == '/') this.url = this.server+uri;
    else this.url = this.server+'/'+uri;                
    // Set cookie
    var cookieJar = request.jar();
    if ( this.PHPcookie)
        cookieJar.setCookie( { "key":"PHPSESSID", "value":this.PHPcookie}, "http://dev.rfolks.com"); // this.server
    this.pending[ ++this.serverRequestId] = { method: "GET", url: this.url, context:context};         
    // Make the request
    let r = request(
      this.url,          
      { jar: true},
      ( error, response, body) => {
            process.ud = global.ud;
            let me = global.ud.udajax;
            let replyContext = null;
            // console.log( "GET RESPONSE", body, error);
            // process.exit(0);
            // Clear request from pending
            if ( typeof me.pending[ me.serverRequestId] != "undefined" ) {
                replyContext = me.pending[ me.serverRequestId].context;
                delete me.pending[ me.serverRequestId];
            }
            
            // Patch for RegisterBlock() 
            let html = body.replace( /RegisterBlock/g, "console.log");
            //Get PHPSESSID cookie from response
            let responseCookies = response.headers['set-cookie'];
            if ( responseCookies) {    
                for( let cookiei=0; cookiei < responseCookies.length; cookiei++)
                {
                    let cookie = responseCookies[ cookiei];
                    cookie = cookie.split(';');
                    // console.log( "cookie", cookie);
                    if ( cookie[0] == "PHPSESSID") this.PHPcookie = cookie[1];
                }
            } 
            me.nodejs_processResponse( body, 'get', context, successCallback); 
            if ( context.promise) {
                context.resolve();
            }
            /*                
            if ( me.url.indexOf('AJAX_') > -1) {
                // AJAX call
                // console.log( "AJAX", this.url);                    
                me.splitResponseIntoHTMLandJS( html);
                // console.log( ud.udajax.html);
                if ( successCallback) successCallback( context, me.html, me.js); // Only 1 at a time 
                // Use default callback
                else me.getSuccess( context, me.html, me.js);
            }
            else
            {
                // Non AJAX call
                let p1 = html.indexOf('<body');
                let p2 = html.indexOf('window.onloadapp');
                // console.log( "Non AJAX", p2);
                if (p2 > 50)
                {
                    var str = '<script type="text/javascript" lang="javascript">';
                    let p3 = p2 - str.length - 3;
                    ud.udajax.html = html.substr(0, p3);                    
                    document.body.innerHTML = ud.udajax.html.substring( p1+8, p3-1);
                    // console.log( p1, ud.udajax.html.substr( 0, 5000));   
                    let p4 = p2 + 16+3+9+2;
                    let jspart = html.substring( p4);
                    let p5 = jspart.indexOf('</script>');
                    // console.log( "abc", jspart.substr( 0, 10), jspart.length, p5); 
                    me.js = jspart.substring(0, p5-2);
                    //console.log( jspart);
                }
                else document.body.innerHTML = html.substring( p1+6, html.indexOf('</body>')-1);

            }
            ud.topElement = ud.dom.topElement = ud.dom.element( "document");
            if ( me.js) { 
                // var requirejs = require( '../../r.js');
                let p1 = me.js.indexOf( 'require(');
                const reqMod = require( '../tests/testenv.js');
                if ( p1) {                                              
                    me.js = me.js.replace( /require\(/g, 'reqMod.require(');
                    // process.exit( 0);
                }
                let js = "try {"+me.js+"} catch( e) {\n";
                js += "let lines = me.js.split( \"\\n\");\n";
                js += 'console.log( e, e.message);'+"\n";
                js += '}';
                //console.log( js);
                eval( js);
                me.js = "";
               // setTimeout( function() { eval( me.js);}, 700);
            }  
            */                
        }
    );
} //udajax.nodejs_get()

// ( uri, method="GET", postdata="", context={}, successCallback= null, errorCallback=null)
/*
* POST request on node.js
*/     
nodejs_post( uri, postdata, context={}, successCallback= null, errorCallback=null)
{
    // Get request class
    let request = window.request;
    // Build URL
    this.server = "http://dev.rfolks.com"; // Temp
    if ( uri.charAt(0) == '/') this.url = this.server+uri;
    else this.url = this.server+'/'+uri;
    let dataObj = postdata;
    if ( typeof postdata != "object") {
        // Convert postdata to object
        dataObj = {};
        let data = postdata.split( '&');
        for (let datai=0; datai<data.length; datai++) 
        {
            let keyValue = data[ datai].split('=');
            dataObj[ keyValue[0]] = decodeURIComponent( keyValue[1]); 
        }            
    }
    // Set cookie
    let cookieJar = request.jar();
    if ( this.PHPcookie)
        cookieJar.setCookie( { "key":"PHPSESSID", "value":this.PHPcookie}, "http://dev.rfolks.com"); // this.server
    this.pending[ ++this.serverRequestId] = { method: "POST", url: this.url, context:context};    
   /* IDEA To simulate saving withiut actually posting to server
    *  if !TEST_serverSaving setTimeout to simulate response  
    * JSON response has { nname, stype, nstyle, tcontent, textra, modifiableBy, you, result, users, newElements}
    */
    // Make the request
    // console.log( "here", this.url, dataObj, postdata);  //             { jar: true, myData:"mydata"},      
    request.post({
        url:this.url,
        //json : true,
        // method: 'POST',           
        form: dataObj,
        // body: postdata,
        // headers: { "content-type": "application/text"},
        jar: true
    },            
    (error, response, body) => {
        // function ( error, response, body) {
            // Response
            let me = global.ud.udajax;
            let replyContext = null;
            if ( typeof me.pending[ me.serverRequestId] != "undefined" ) {
                replyContext = me.pending[ me.serverRequestId].context;
                delete me.pending[ me.serverRequestId];                   
            }                
            if (error) {
                console.error( "nodejs_post", error)
                return
            }
            //Get PHPSESSID cookie from response
            let responseCookies = response.headers['set-cookie'];
            if ( responseCookies) {    
                for( let cookiei=0; cookiei < responseCookies.length; cookiei++)
                {
                    let cookie = responseCookies[ cookiei];
                    cookie = cookie.split(';');
                    // console.log( "cookie", cookie);
                    if ( cookie[0] == "PHPSESSID") this.PHPcookie = cookie[1];
                }
            } 

            // Split HTML and JS
            // console.log( response);
            // console.log( "RESPONSE NODEJS POST", body, me.url, dataObj); process.exit(0);
            me.nodejs_processResponse( body, 'post', replyContext, successCallback);
            if ( replyContext && replyContext.promise) {
                replyContext.resolve();
            }
            // me.splitResponseIntoHTMLandJS( body);
            // console.log( me.js); process.exit(0);
            // if ( successCallback) successCallback( context, me.html, me.js);
            // else me.postSuccess( context, me.html, me.js);                
            // console.log(`statusCode: ${res.statusCode}`)
            // console.log(body)
        }
    )        

} // UDAJAX.nodejs_post()

nodejs_processResponse( html, method, context, successCallback = null) {
    if ( typeof this.url == "undefined") this.url = context.url;
    if ( this.url.indexOf('AJAX_') > -1) {
        // AJAX call
        // console.log( "AJAX", this.url);                    
        this.splitResponseIntoHTMLandJS( html);
        if ( successCallback) successCallback( context, this.html, this.js); // Only 1 at a tithis 
        // Use default callback
        else {
            if ( method = "get") this.getSuccess( context, this.html, this.js);
            else if ( method == "post") this.postSuccess( context, this.html, this.js);
        }
    }
    else
    {
        // Non AJAX call
        let p1 = html.indexOf('<div id="main"'); // body
        let p1b = html.indexOf('</div> <!-- main -->');
        let p2 = html.indexOf('window.onloadapp');
        // console.log( "Non AJAX", p2);
        if (p2 > 50)
        {
            var str = '<script type="text/javascript" lang="javascript">';
            let p3 = p2 - str.length - 3;
            this.html = html.substr(0, p3);    
            // console.log( p1, p3, this.dom.element( 'document'), document.body);
            let main = document.getElementById( 'main');
            main.innerHTML = html.substring( p1+6, p1b);             
            // document.body.innerHTML = html.substring( p1+8, p3-1)+"</body>";
            // document = domjs.window.document;
            // console.log( "2ND", document.getElementById( 'document'), document.body);
            // console.log( p1, ud.udajax.html.substr( 0, 5000));   
            let p4 = p2 + 16+3+9+2;
            let jspart = html.substring( p4);
            let p5 = jspart.indexOf('</script>');
            // console.log( "abc", jspart.substr( 0, 10), jspart.length, p5); 
            this.js = jspart.substring(0, p5-2);
            //console.log( jspart);
        }
        else document.body.innerHTML = html.substring( p1+6, html.indexOf('</body>')-1);
        ud.topElement = ud.dom.topElement = document.getElementById( "document");
        if ( this.js) { 
            // var requirejs = require( '../../r.js');
            let p1 = this.js.indexOf( 'require(');
            const reqMod = require( '../../tests/testenv.js');              
            if ( p1) {                                              
                this.js = this.js.replace( /require\(/g, 'reqMod.require(');
                // process.exit( 0);
            }
            let js = "try {"+this.js+"} catch( e) {\n";
            js += "let lines = this.js.split( \"\\n\");\n";
            js += 'console.log( e, e.message);'+"\n";
            js += '}';
            eval( js);
            this.js = "";
           // setTimeout( function() { eval( me.js);}, 700);
        }                 
    }
} // UDAJAX.nodejs_processResponse()

if ( typeof process == 'object')
{
    // Running under node.js
    module.exports = { UDAJAX: UDAJAX};  
    // Load https
  // 2DO use request      npm install request@2.81.0   latest 2.88.2
    //window.UDAJAX = UDAJAX;    
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined")
    {
        console.log( 'Syntax udajax.js:OK');
        console.log( "Setup test environment");
        var envMod = require( '../tests/testenv.js');
        envMod.load();
        window.request = require( 'request');
        async function testGet( url, ud) {
            let test = "Async get test" 
            await ud.udajax.serverRequestPromise( url, 'GET', '', { ud:ud, action: "reload"});
            if(  ud.dom.value( "B01000000B0000000M...textContent") == "Text") console.log( test+" : OK");
            else console.log( test + " : KO");//, ud.topElement.innerHTML);
            console.log( "Test completed");
            process.exit(0);
        }
        // Setup our UniversalDoc object
        ud = new UniversalDoc( 'document', true, 133);
        console.log( 'Start of test program');
        let url = 'webdesk/UniversalDocElement--21-725-21--UD|3|NO|OIDLENGTH|CD|5/show/tusername|demo/tpassword|demo/';
        testGet( url, ud);
        // testGet.then() => nextTest();
        
        //process.exit(0);
    }    
    else
    {
        window.request = require( 'request');

    }
} // End of test routine