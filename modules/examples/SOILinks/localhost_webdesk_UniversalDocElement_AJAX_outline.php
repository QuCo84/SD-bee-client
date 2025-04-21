<?php
$NOTEST = true;
global $LF;
$requests_string = '{"0":"357","id":"357","1":"all_AJAX_outline","nname":"all_AJAX_outline","2":"__XML","ndatalabel":"__XML","3":"","nscope":"","4":"","ttable":"","5":"","tfields":"","6":"","tselect":"","7":"","tcode":"","8":"owns","tlabel":"owns","9":1,"bread":1,"10":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_ajax_outline--3-332-3-357--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$links->close();
unset( $links); $links = null;
// CVSandXMLparser;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = '__XML';
ob_start();
global $_SCRIPTFILE;
$_SCRIPTFILE="upload/VNxNTnvne_xmlparser.php";
include_once("upload/VNxNTnvne_xmlparser.php");


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '__XML');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// DICO;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = '__XML';
ob_start();
global $_SCRIPTFILE;
$_SCRIPTFILE="upload/bUmvxU1vC_dico.php";
include_once("upload/bUmvxU1vC_dico.php");


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '__XML');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// jQuery v1@68;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = '__XML';
ob_start();
$OUTPUT['head']="<script langage='JavaScript' type='text/javascript' src='/upload/Bw7wBvZUy_jquery180min.js'></script>";


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '__XML');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// jqueryUIStyle_1.10.2;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = '__XML';
ob_start();
$OUTPUT['head']="<link id='ext_css' rel='stylesheet' type='text/css' href='/upload/wmSMINNNu_jquery-ui-1.10.2.custom.min.css'/>";


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '__XML');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// JQueryUI_1.10.2;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = '__XML';
ob_start();
$OUTPUT['head']="<script langage='JavaScript' type='text/javascript' src='/upload/wmSM0MrM8_jquery-ui-1.10.2.custom.min.js'></script>";


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '__XML');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// UI JS lib;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = '__XML';
ob_start();
$OUTPUT['head']="<script langage='JavaScript' type='text/javascript' src='/upload/G131faG0q_form.js'></script>";


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '__XML');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// UI_form;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = '__XML';
ob_start();
global $_SCRIPTFILE;
$_SCRIPTFILE="upload/L0d2p2b3m_form.php";
include_once("upload/L0d2p2b3m_form.php");


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '__XML');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// UI_multipartForm;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = '__XML';
ob_start();
global $_SCRIPTFILE;
$_SCRIPTFILE="upload/FaRapaJ04_UI_multipartForm.php";
include_once("upload/FaRapaJ04_UI_multipartForm.php");


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '__XML');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// HTML library;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = '__XML';
ob_start();
global $_SCRIPTFILE;
$_SCRIPTFILE="upload/L0e3t3g2m_html.php";
include_once("upload/L0e3t3g2m_html.php");


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '__XML');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// UniversalDocElement PHP class;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = '__XML';
ob_start();
global $_SCRIPTFILE;
$_SCRIPTFILE="upload/smartdoc/ud-view-model/ud.php";
include_once("upload/smartdoc_prod/ud-view-model/ud.php");


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '__XML');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// all_AJAX_outline on data from UniversalDocElement--21-109-21--UD|3|NO|OIDLENGTH|CD|5;
$data = $DATA = $data_all["__XML"];
$OUTPUT=array();
$LF->currentBlock = '__XML';
ob_start();
LF_env("request_siblings","");
LF_env("request_children","");

if (LF_env('e') == "load")
  $LF->out( "Parts ready");
else  
{
 /**
  * DISPLAY VIEWS TOOL
  */
  // Load Terms for translation
  DICO_setTerms(["UniversalDocElement"]);
  // Get Tip and build tool zone title and intro
  $tips = LF_env( 'SD_tips');
  $titleAndIntro = "<h2>".LINKSAPI::startTerm."Views".LINKSAPI::endTerm."</h2>";
  $titleAndIntro .= "<p>".$tips['Views tip']."</p>";
  // Look for processed POST request
  global $INPUT_RESULT;  
  $LF->out( $INPUT_RESULT."<br>");
  if ( $INPUT_RESULT)
  {       
     // Input processing for new part/subpart creation
     // Get id of newly created UniversalDocElement node
     $id = substr( $INPUT_RESULT, strpos( $INPUT_RESULT, ":")+1);
     if ( (int) $id > 0) 
     {
       /*
        * A NEW VIEW WAS SUCCESSFULLY CREATED
        */
        // Node created succesfully, compute OID of new node
        $oid = explode( '--', LF_env('oid'))[1];
        $oid .="-21-$id"; // str_replace( "-0", "-".$id, $oid);
        $oid = "UniversalDocElement--".$oid;
        // If part add an element so as not empty
        if ( (int)  val( $_REQUEST, 'stype') == 4) //UD_part
        {
           // Add an element to new part
           $partId = substr( $_REQUEST['npartType'], 0, 2);
	   $partId = substr( "00".strToUpper( $partId), strlen( $partId));           
           $name = "B".$partId."0000010000".val( $_REQUEST, 'user');          
           $element = [ "nname"=>$name, "stype"=>10, "tcontent"=>"..."];
           $nodeData = [ ["nname", "stype", "tcontent"], $element];
           $id = LF_createNode( $oid, 21, $nodeData);
           if (!$id)
           {
             // oops Part not initialised
             LF_debug( "Error copying model $model to $oid", "Ctrl addDirOrFile", 6);
             $LF->out( "Error copying model $model <br>");           
           }
         }
         // Ask for reload of document and display newly created part
         $docoid = LF_stringToOid( LF_env( 'oid'));       
         $docid = $docoid[ LF_count( $docoid) - 1]; // array_pop( $docoid);
       	 $LF->onload( "leftColumn.closeAll();\n");      	
         $LF->onload( "window.location = '/webdesk/'+window.ud.dom.attr( window.ud.topElement, 'ud_oidchildren')+'/show/display{$docid}|{$_REQUEST['ngivenname']}/';");

      }
      
   } // End of Input processing
   
  /*
   * TOOL DISPLAY
   *    Device selector
   *    View selector
   *    Add view form if editing model
   */  
    
   // Device selector
   // Use JS to grab device list from available styles
   $deviceSelect = "window.ud.api.utilities.buildDisplayableDeviceList()";

   // View selector
   // list of views in current document are stored in UD_ressoucres>outline div
   $viewSelect = "document.getElementById('outline').outerHTML";   

   // Get editing mode
   // Get document id   
   $oid = LF_stringToOid( LF_env('oid'));
   $id = $oid[ LF_count( $oid) - 2];
   $mode = LF_env( 'mode'.$id);
   //$LF->out( "ici".$id.LF_env( 'mode'.$id));

   // Output is sent as JS   
   $js = "var formHTML = \"\";\n";
   // if ( $mode == "edit3")
   {
      // Prepare data for form for adding a view      
      //$oid = LF_mergeOid( LF_env('oid'), array( 0));
      $oid = LF_env('oid');
      $oid = LF_stringToOid( $oid);
      array_pop( $oid);
      $oid = LF_oidToString( $oid);
      $url = "/webdesk/$oid/AJAX_outline/e|add/"; 
      //$LF->out( $oid."<br>");
      $oid = LF_mergeShortOid( $oid, [21,0]);
      $css = "form";
      // next part id's by type
      $nextPartIds = [ 
        "default"=>"02", 
        "doc"=>"02", "synopsis"=>"30", "models"=>"40", "language"=>"50", "data"=>"60", "clipboard"=>"70",
        "system styles"=>"A0", "page formatting styles"=>"AA", "intermediate styles and program"=>"B0",
        "application styles and program"=>"D0"
      ];
      $nextPartIds = LF_env( "NextPartIds$id");
      // Create form for naming directory or document
      $form = new Form("Add a Part", $oid, $css, form::verticalForm);
      // Set form parameters
      $form->setParam( 'usePlaceholder', true);
      // Create specific field types for this form
      $form->addFieldType("name", "text", 20, array( "filter"=>"/"));
      $form->addFieldType( "partType", "select", 10, array( 
        "selection"=>[
        	"select part type"=>$nextPartIds['default'], 
        	"doc"=>$nextPartIds['doc'],
        	"synopsis"=>$nextPartIds['synopsis'],
        	"models"=>$nextPartIds['models'],
        	"translations"=>$nextPartIds['language'],
        	"data"=>$nextPartIds['data'],
        	"system styles"=>$nextPartIds['system styles'], 
        	"intermediate styles and program"=>$nextPartIds['intermediate styles and program'], 
        	"application styles and program"=>$nextPartIds['application styles and program']
         ]
      ));
      
      // Input script combines user-given name and description in tcontent
      $scr = <<<EOT
       // name is autoname_givenname
      /* \$partType = \$INPUT_DATA[1]['npartType'];
       \$nextPartIds = LF_env( "NextPartIds$id");
       \$partId = \$nextPartIds[\$partType];
       */
       \$partId = \$INPUT_DATA[1]['npartType'];       
       //\$partId = substr(  \$INPUT_DATA[1]['nname'], 0, 2);    
       \$partId = substr( "00".strToUpper( \$partId), strlen( \$partId));
       \$INPUT_DATA[1]['nname'] = 'B'.\$partId.'0000000000'.\$INPUT_DATA[1]['user'].'_'.substr( \$INPUT_DATA[1]['ngivenname'], 0, 10);
      // content is 2 spans with give name and short description
      \$content = '<span class="title">'.\$INPUT_DATA[1]['ngivenname'].'</span>';
      \$content .= ' - <span class="subtitle">'.\$INPUT_DATA[1]['tcontent'].'</span>';
      \$INPUT_DATA[1]['tcontent'] = \$content;
      // Save nname, tcontent, stype and nstyle
      \$INPUT_DATA[0] = array( "nname", "tcontent", "stype"); //, "nstyle");
      return true;
EOT;
    // Get user code for part id/nname
    $w = UD_utilities::getContainerName();// UD_part);
    $user = substr( $w, 13);
    // Models for new part
    // $models = [ "myModelPart"=>"myModelPart"] // At least an empty para 
    $form->addInputScript( $scr); 
    $type = "4";
    // Add block's id in (n)name and (s)type as hidden fields
    $form->addField("npartType", "", [ "label"=>"", "type"=>"partType"]);  
    $form->addField("_stype", $type, [ "label"=>""]);   
    $form->addField("_user", $user, [ "label"=>""]);   
    // User given name and decription
    $form->addField("ngivenname", "name", [ "label"=>"", "type"=>"name"]);
    $form->addField("tcontent", "description", [ "label"=>""]);
    if ($models) $form->addField( "nstyle", "A4 text", ["label"=>"", "type"=>"model"]);  
    $form->setParam('AJAX_back_close', "none");
    $form->setParam('AJAX_use', True);
    $formHTML = $form->renderAsHTML("return window.ud.udajax.postForm( 'left-tool-zone', '$url');");
   // $formHTML = str_replace( "<input ", "<input class=\"initialField\" onkeydown=\"window.ud.ude.formInputChange( this, event);\" ", $formHTML);
  //   $formHTML = str_replace( "<textarea ", "<textarea class=\"initialField\" onkeydown=\"window.ud.ude.formInputChange( this, event);\" ", $formHTML);  
    $formHTML = str_replace( array( "\n", '"'), array( "", "\\\""), $formHTML);
 
    
    // $jsAddPart = "<a href=\"javascript:\" onclick=\"\">Add a part</a>";
    $js .= "formHTML = \"$formHTML\";\n";
  }
  $js .= "document.getElementById('left-tool-zone').innerHTML = \"$titleAndIntro\"+$deviceSelect+document.getElementById('outline').outerHTML+formHTML;\n";
  $LF->onload( $js);
  $LF->out( "{onl"."oad}");
}
$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '__XML');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
?>
