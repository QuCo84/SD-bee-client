// Poll command inputs - called by UD heartbeat
poll ( allowedTime = 5)
{
    //var maxTicks = this.ude.ticks+allowedTime;
    // Obsolete if ( window.clipboarder && !this.clipboardFctsAdded) this.addFunctions( window.clipboarder, this.clipboard_cmds);
    // Obsolete if ( this.utilties && !this.utilityFctsAdded) this.addFunctions( this.utilities, this.utility_cmds);
    // Loop through requests using ; and . as seperators
    var request;
    var reply = "";
    while ( /*this.ude.ticks < maxTicks &&*/ ( request = this.getNextRequest()))
    {
        debug( { level:2}, "API request",request);
        if ( request.indexOf(';'))
        {
            // Ends with ;(semi-colon) so it's a JS instruction
            // Extract ref
            request = request.split('|');
            let ref = request[0];
            let command = request[1].replace( /@8/g, ':').replace(/@1/g, '@');
            let callbackId = request[2];
            // Run the command
            reply += this.run( [ command]);
            // Send back reply
            if ( callbackId && isNaN( callbackId))
                document.getElementById( callbackId).textContent += ref+":"+reply+"\n"; 
            this.processAfterClick( ref);
        }
        else if ( request.indexOf('.'))
        {                
            // ends with .(period) so its a natural language command 
            /*
            let phrase = requests.substr( 0, requests.indexOf( '.'));
            */
        }
    }
    return reply;
} // UDapi.poll()

// INTERNAL
// Execute a set of commands
getNextRequest()
{
    if ( !this.buffer) return "";
    var requests = this.buffer.textContent;
    var p1;
    if ( ( p1 = requests.indexOf( '\n')) >= 0)
    {
        // There's a request - extract it
        var request = requests.substr( 0, p1);
        requests = requests.substr(p1+1);
        this.buffer.textContent = requests; 
        return request;
    }
    else return "";
} // UDapi.getRequest()

run( commands)
{
    var r="";
    for( var cmdi in commands)
    {
        var command = commands[cmdi];
        this.order = "";
        this.state = this.initial_state;
        this.prepareForExec( command);
        if ( this.order.indexOf( "ERR:") > -1) return "ERR";
        // r += "OK";
        r += eval( this.order); // Order has been parsed and is secure
        // 2DO HOw to send an anwser
        debug( {level:4}, "Ran ", this.order);
        return r;
    }    
    
} // UDapi.run()

// Evaluate a term
eval( term)
{        
    // This test is non redundant with calc.exec but useful for tests
    if ( term == "" || !isNaN( term)
        || ( this.expr.charAt(0) == "'" && this.expr.charAt( this.expr.length-1) == "'") 
        || ( this.expr.charAt(0) == '"' && this.expr.charAt( this.expr.length-1) == '"') 
    ) return term;
    // Compute value of term via the DOM calculator
    var v = this.calc.exec( this.expr);
    // Return quoted if not numercial
    if ( isNaN( v)) return '"'+v+'"';
    else return v;
} // UDapi.eval()

// Add a token to current order
// state = initial, litteral, argument, argumentFct; 2DO comment
addTokenToOrder( token, delimiter)
{
    var c = delimiter;
    if ( this.state == this.litteral_state)
    {
        this.expr += token + c;
        if ( c == this.litteral) this.state = this.stateStack.pop(); 
    }
    else if ( this.state == this.argument_state)
    {
        if ( c == '(')
        {
            this.expr += token + c;
            this.stateStack.push( this.state);
            this.state = this.argumentFct_state;
        }
        else if (c == ')')
        {
            // End of function call or order arguments
            this.expr += ""+token;
            this.order += this.eval( this.expr)+c;
            this.expr = "";
            this.state = this.stateStack.pop();
        }
        else if ( c == ',')
        {
            // Argument seperator
            this.expr += ""+token;
            this.order += this.eval( this.expr)+c;
            this.expr = "";
            
        }
        else if (c == '{')
        {
            // Start of Value set (ie JSON notation)
            if (this.state != this.valueSet_state) this.order += "JSON.parse('{";
            this.stateStack.push( this.state);
            this.state = this.valueSet_state;
            this.expr = "";
        }
        else if ( c == "'" || c == '"')
        {
            // Litteral
            this.stateStack.push( this.state);
            this.state = this.litteral_state;
            this.litteral = c;
            this.expr = c;
        }
        else this.expr += "" + token + c;
    }        
    else if ( this.state == this.initial_state)
    {
        if ( c == '(')
        {
            // Token is a command - use API to redirect to correct class
            this.order += "API."+token+c;
            // Pass to argument state
            this.stateStack.push( this.state);
            this.state = this.argument_state;
            this.expr = "";
        }
        else this.order += c;
    }
    else if ( this.state = this.valueSet_state)
    {    
        // Value set state - close on }, evaluate after :
        if ( c == '}')
        {
            this.expr += token;
            this.order += this.eval( this.expr)+c;
            this.state = this.stateStack.pop();
            if (this.state != this.valueSet_state) this.order += "')";
            this.expr = "";
        }
        else if (c == ':')
        {
            this.order += '"'+token+'"'+ c;
        }
        else if (c == '(')
        {
            this.valueSetFctLevel++;
            this.expr += token+c;    
        }
        else if (c ==')')
        {
            this.expr += ""+token+c;
            if ( --this.valueSetFctLevel == 0)
            {
                this.order += this.eval( this.expr);
                this.expr = "";
            }
        }
        else if ( c == ',')
        {
            this.expr += ""+token;
            if ( this.valueSetFctLevel == 0)
            {    
                this.order += this.eval( this.expr)+c;
                this.expr = "";
            } 
            else this.expr += c;                
        }
        else this.expr += token + c;
    }
    else if ( this.state == this.argumentFct_state)
    {
        this.expr += ""+token + c;
        if ( c == '(') this.stateStack.push( this.state);
        else if (c == ')') this.state = this.stateStack.pop();             
    } // end switch state    
    return "";
} // UDapi.addTokenToOrder()

// prepare an instruction for execution -- same as calc for the moment
prepareForExec( expr)
{
 this.expr = this.order = "";
 var token = "";
 this.state = this.initial_state;
 this.valueSetFctLevel = 0;
 for (var i=0; i < expr.length; i++)
 {
   var c = expr[i];
   if ( this.delimiters.indexOf(c) > -1) token = this.addTokenToOrder( token, c);
   else token += c;         
 }
 if (token) this.addTokenToOrder( token, null);
 if ( this.stateStack.length) debug( { level:1}, "Order incomplete" + expr);
 return true;
} // UDapi.prepareForExec()