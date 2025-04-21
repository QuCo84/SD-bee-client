/* **************************************************************************
 *   udecalc_css.js
 *      calculator fuctions for handling css
 */
 
 class UDEcalc_css
 {
 
    // Returns string list of available classes for tag
    classesByTag( tag)
    {
        var styleSheets = window.document.styleSheets;
        var styleSheetsLength = styleSheets.length;
        var rarr = [];
        for(var i = 0; i < styleSheetsLength; i++)
        {
            let styleSheet = styleSheets[i];
            // Loading fonts from google fails on ".rules". What about a loaded style sheet ? 
            if ( styleSheet.href) continue; // && typeof styleSheet.rules == "undefined") continue;
            var rules = styleSheets[i].rules || styleSheets[i].cssRules;
            if (!rules) continue;
            var rulesLength = rules.length;
            for (var x = 0; x < rulesLength; x++) 
            {
                var rule = rules[x];
                // 2DO Multiple selectors ,
                if (typeof rule.selectorText != "undefined")
                {
                    let selTxts = rule.selectorText.split( ',');    
                    for ( var sti=0; sti < selTxts.length; sti++)
                    {
                        let selTxt = selTxts[ sti].trim();
                        let p1 = selTxt.indexOf( tag+'.');
                        let p2 = selTxt.indexOf( ' ');
                        if ( p1 > -1 && p2 == -1)
                        {
                            let stylename = selTxt.substr( p1 + tag.length + 1);
                            // if ( p2 > -1) stylename = selTxt.substring( p1 + tag.length + 1, p2);
                            // Filter system styles
                            if ( stylename.indexOf('_') == -1) rarr.push( stylename);
                        }    
                    }
                }
            }
        }    
        return rarr.join(",");
    } // UDEcalc_css.classesByTag()
 
 } // JS class UDEcalc_css

if ( typeof process != 'object') {
 // Need calc loaded first   window.ud.ude.calc.cssCalc = new UDEcalc_css( window.ud.ude.calc);    
} else {
    // Testing under node.js
    module.exports = { class : UDEcalc_css};     
    //console.log( typeof global.JSDOM);
    if ( typeof global.JSDOM == "undefined" && typeof window == "undefined")
    {
        // Test this module
        console.log( 'Syntax OK');
        console.log( "Test completed");
    }
    /*
    else
    {
        window.DOM = DOM;
    }
    */
} // End of nodejs stuff
