<?php
/* *******************************************************************************************
 *  UDtext.php
 *
 *    Handle UniversalDoc Model-View server side for Text elements
 *   
 *
 *   23/12/2019 QUCO - création from universaldoc.php as breakdown/factorising
 */
if ( !class_exists( 'UDelement')) require_once( __DIR__."/../../tests/testenv.php");    
    

class UDtext extends UDelement
 {
    protected $caption;
    protected $elementName;    
    // private $content;
    protected $saveable;
    protected $textContent; 
    protected $JSONcontent;
    protected $MIMEtype;
    
    function __construct( &$datarow)
    {
        parent::__construct( $datarow);
        $this->caption = val( $datarow, '_caption');
        $this->elementName = val( $datarow, '_elementName');
        $this->content =  val( $datarow, '_cleanContent'); 
        $this->saveable = val( $datarow, '_saveable');
        $this->textContent = val( $datarow, '_textContent');
        $this->JSONcontent = val( $datarow, '_JSONcontent');
        if ( $this->JSONcontent && isset( $this->JSONcontent[ "meta"])) $this->MIMEtype = "text/json";
        else $this->MIMEtype = "text/text";
        if ( $this->textContent == []) $this->textContent = [ $this->content, "...", "..."];        
    } // UDtext->construct()
    
    function renderAsHTMLandJS( $active=true)
    {
       $r = $h = $js = "";
       // Generate visible HTML
       $r .= "<div ";
       // Determine ud_type  2DO map
       $udtype = "linetext";
       if ( $this->type == UD_commands) $udtype = "server";
       elseif ( $this->type == UD_css) $udtype = "css";
       elseif ( $this->type == UD_js) $udtype = "js";
       elseif ( $this->type == UD_json) $udtype = "json";
       elseif ( $this->type == UD_apiCalls) $udtype = "apiCalls"; 
       elseif ( $this->type == UD_resource) $udtype = "resource";         
       elseif ( $this->type == UD_HTML) $udtype = "html";
       if ( $udtype == "linetext")
       {
            // Generic text editor, determine ud_type from first line
            $firstLine = $this->textContent[0];
            if ($firstLine == "SERVER") $udtype = "server";
            elseif ($firstLine == "CSS") $udtype = "css";
            elseif ($firstLine == "JSON") $udtype = "json";
            elseif ($firstLine == "JS" || $firstLine == "JAVASCRIPT") $udtype = "js";
            elseif ($firstLine == "APICALLS" ) $udtype = "apiCalls";
       }    
       // Add generic attributes
       $r .= " ".$this->getHTMLattributes();
       // Add specif attributes
       // #2125008 $r .= " ud_type=\"{$udtype}\" ud_mime=\"{$this->MIMEtype}\"";  // UD_hidden=\"{$this->elementName}\"
       $r .= "data-ud-mime=\"{$this->MIMEtype}\"";  // UD_hidden=\"{$this->elementName}\"
       $r .= ">";
        if ( $this->MIMEtype == "text/json") { // $this->content[0] == '{' && strpos( $this->content, "meta") && $this->textContent) // $this->MIMEtype == "text/json")
               $r .= "<div id=\"{$this->JSONcontent[ 'meta']['name']}_object\" class=\"object hidden\">{$this->content}</div>";
        } else {
            // ?DO Why not just send element's content ?
            $r .= "<span class=\"caption\">{$this->caption}</span>";
            $r .= "<input type=\"button\" value=\"Save\" onclick=\"new UDapiRequest('UDtext','setChanged(/".$this->elementName."editZone/, 1);', event);\"  udapi_quotes=\"//\"/>";
            if ( $udtype == "css")
                $r .= "<input type=\"button\" value=\"Load\" onclick=\"new UDapiRequest( 'udtext', 'loadStyle(%value1)', this);\" udapi_value1=\"{$this->elementName}\"/>";
            // Generate hidden HTML (data)
            $content = htmlentities( $this->content);
            // if ( $udtype == "html") $content = htmlentities( $content);
            // 2DO use $h on next 2 lines when universaldoc.js and AJAX_fetch is ready for 2 streams to avoid line jumps when editing caption
            $r .= "<div id=\"{$this->elementName}\" class=\"object textObject\" ud_type=\"textobject\" style=\"display:none;\"";
            // 2DO replace \n which disturbs contenteditable
            $content = str_replace( "\n", '<br data-ud-type="linebreak">', $content);
            $r .= ">{$content}</div>";  
           // Setup edition client-side
           //$js = "window.ud.initialiseElement('{$this->name}');\n";              
        }
        $r .= "</div>";         
/*       
       $r .= "<div id=\"{$this->elementName}editzone\" ude_bind=\"{$this->elementName}\" ude_autosave=\"Off\" class=\"table\">";

       // 2DO TEMPORARY to be done client-side for multi-user       
       $this->lineTextEditor( $r, $h, $js);
       // 2DO See if a br is required
       $r .= "...</div>";
*/            
       return [ "content"=>$r, "program"=>$js];
    } // UDtext->renderAsHTMLandJS()
    
    // TEMPRORAY needs to be on client side for refreshing an element (multi-user)
    function lineTextEditor( &$r, &$h, &$js)
    {
       // Build table-based text editor      
       $lines = $this->textContent;
       $tableId = "{$this->elementName}edittable";
       $r .= "<table id=\"{$tableId}\" class=\"textContent\" ude_bind=\"{$this->elementName}\">";
       $r .= "<thead>";
       $r .=    "<tr contenteditable=false><th class=\"rowNo\">Row</th><th class=\"linetext\">Line</th></tr>";
       $r .=    "<tr class=\"rowModel\">";
       $r .=        "<td class=\"rowNo\" ude_formula=\"row()\" contenteditable=\"false\">=row()</td>";
       $r .=        "<td class=\"linetext\">...</td>";
       $r .=    "</tr>";
       $r .= "</thead>";
       $r .= "<tbody>";
       for ($line=0; $line < LF_count($lines); $line++)
       {
            // $text  = str_replace( '&nbsp;', ' ', val( $lines, $line)); 
            $text = val( $lines, $line);
            $text  = str_replace( ['&amp;nbsp;', ' '],['&nbsp;', '&nbsp;'], $text);   // Temp solution    
            $r .=  "<tr>";
            $r .=     "<td contenteditable=\"false\" ude_formula=\"row()\" class=\"rowNo\">{$line}</td>";
            $r .=     "<td class=\"linetext\">{$text}</td>"; 
            $r .=  "</tr>";
       } 
       $r .= "</tbody>";
       $r .= "</table>";
       $js .=  "ud.updateTable( '{$tableId}');\n";
       return true; 
    } // UniversalDoc->lineTextEditor()
  
    
 } // PHP class UDtext
 
 // PHP class UDjson
class UDjson extends UDtext
{ 
    // UDjs construct just get textContext
    function __construct( &$datarow)
    {
        parent::__construct( $datarow);
        $len = LF_count( $this->JSONcontent);
        LF_debug( "JSON element with $len element(s)", "UDelement", 5);
        if ( !$this->JSONcontent) $this->JSONcontent = ["defaultPart"=>"", "copyParts"=>""];
        $this->content = JSON_encode( $this->JSONcontent);
    } // UDjson construct

    // Return array with content( HTML) and Javascript 
    function renderAsHTMLandJS( $active=true) {
        $params = val( $this->JSONcontent, 'data/value');
        if( $params[ "module"]) {            
            // Get module relative path in resources
            $module = $params[ "module"];
            // Analyse
            $modParts = explode( '/', $module);
            $modLastPart = $modParts[ count( $modParts) - 1];
            $modFile = "ud".strtolower( $modLastPart).".php";
            // Display JSON element with class = module
            $this->style = $modLastPart;            
            $r = parent::renderAsHTMLandJS( $active);
            // Load module server-side or client-side
            if ( file_exists( $modFile)) {
                // OS version load from same directory
                include_once( $modFile);
                $el = new $module( $params);
                $w = $el->renderAsHTMLandJS( $r, $active);                 
            } elseif ( file_exists( __DIR__."/../".strToLower( $module)."php")) {
                // SOILinks load from modules/xx/xxx
                include_once( __DIR__."/../".strToLower( $module)."php");
                // Create class & get module's content
                $el = new $module( $params);
                $w = $el->renderAsHTMLandJS( $r, $active);     
            } else {
                // No PHP module so load JS module directly
                $jsModFile = strToLower( $module);
                $this->requireModules( [ 
                    "resources/{$jsModFile}"
                ]);  
            }
        } else {
            $r = parent::renderAsHTMLandJS( $active);
        }
        return $r;
    } // UDjson->renderAsHTMLandJS()   
  
} // UDjson PHP class
 
if ( isset( $argv) && strpos( $argv[0], "udtext.php") !== false)
{
    // CLI launched for tests
    echo "Syntax OK\n";
    $data = [ 'nname'=>"B01000000001000000M", "stype"=>14, "tcontent"=>"line1\nline2\nline3"];
    $text = new UDtext( $data);
    echo $text->renderAsHTMLandJS()['content']."\n";
    echo "Test completed";    
}