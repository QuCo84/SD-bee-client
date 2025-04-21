<?php
$NOTEST = true;
global $LF;
$requests_string = '{"0":"354","id":"354","1":"all_AJAX_addDirOrFile","nname":"all_AJAX_addDirOrFile","2":"__XML","ndatalabel":"__XML","3":"USER","nscope":"USER","4":"UniversalDocElement--21-0-21--NO|NO-stype|EQ3","ttable":"UniversalDocElement--21-0-21--NO|NO-stype|EQ3","5":"*","tfields":"*","6":"","tselect":"","7":"","tcode":"","8":"owns","tlabel":"owns","9":1,"bread":1,"10":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_ajax_adddirorfile--3-332-3-354--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$links->close();
unset( $links); $links = null;
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
// all_AJAX_addDirOrFile on data from UniversalDocElement--21-0-21--NO|NO-stype|EQ3;
$data = $DATA = $data_all["__XML"];
$OUTPUT=array();
$LF->currentBlock = '__XML';
ob_start();
LF_env("request_siblings","");
LF_env("request_children","");

if ( LF_env('e') == "load")
  $LF->out( "Container ready");
else  
{
  global $INPUT_RESULT;
  global $INPUT_DATA;
 // $LF->out( "Test input");
 // $LF->out( print_r( "zzz", TRUE)); 
 
  if ( $INPUT_RESULT)
  {  
     $id = substr( $INPUT_RESULT, strpos( $INPUT_RESULT, ":")+1);
     if ( (int) $id > 0) 
     {
        // Node created succesfully, compute OID of new node
        $oid = explode( '--', LF_env('oid'))[1];
        $oid = str_replace( "-0", "-".$id, $oid);
        $LF->out( "id = $id");
        // If doc and model, initialise doc from model
        if ( (int)  val( $_REQUEST, 'stype') == 2 || (int)  val( $_REQUEST, 'stype') == 3) // && val( $_REQUEST, 'nstyle'))
        {
           $model = val( $_REQUEST, 'nstyle');
           LF_debug( "Copying model $model to $oid", "Ctrl addDirOrFile", 6); 
           $LF->out( "Copying model $model into $oid<br>");
           $oid = "UniversalDoc--$oid";
           $res = UD_utilities::copyModelIntoUD( $model, $oid);
           if (!$res)
           {
             // oops doc not initialised
             LF_debug( "Error copying model $model to $oid", "Ctrl addDirOrFile", 6);
             $LF->out( "Error copying model $model <br>");           
           }
        }
      }
      // Needs parent in request
      $LF->onload( "leftColumn.closeAll( true);\n");
      $LF->onload( "window.ud.fetchElement( window.ud.topElement, 'AJAX_modelShow');\n");
      // and reshow current
   } // End of Input processing
 

  // Display form
  $mode = LF_env('p1');
  $oid = LF_env( 'oid');
  if ( !$oid) $oid = "UniversalDocElement--21-0";
  else  $oid = LF_mergeOid( LF_env('oid'), array( 0));
  $url = "/webdesk/$oid/AJAX_addDirOrFile/e|create/";
  $css = "form";
  // Terms (2DO use dictionary)
  $modeLabel = $mode;
  if ( $mode == "file") $modeLabel = "page";
  elseif ( $mode == "model") $modeLabel = "template";
  $formLabel = "Add a {$modeLabel}";
  $nameLabel = "{$modeLabel} name";
  $decriptionLabel = "description";
  $marketplaceLabel = "Choose later from Marketplace";
  if ( LF_env( 'lang') == "FR")
  {
      if ( $mode == "dir") $modeLabel = "un repertoire";
      elseif ( $mode == "file") $modeLabel = "une page";
      elseif ( $mode == "model") $modeLabel = "un modèle";
      if ( $mode == "dir") $modeLabel2 = "du repertoire";
      elseif ( $mode == "file") $modeLabel2 = "de la page";
      elseif ( $mode == "model") $modeLabel2 = "du modèle";
      $formLabel = "Ajouter {$modeLabel}";
      $nameLabel = "nom {$modeLabel2}";
      $decriptionLabel = "description";      
      $marketplaceLabel = "Choisir plus tard"; 
  }
  // Create form for naming directory or document
  $form = new Form( $formLabel, $oid, $css, form::verticalForm);
  $form->setParam( 'usePlaceholder', true);
  $form->addFieldType("name", "text", 20, array( "filter"=>"/"));
  // Input script combines user-given name and description in tcontent
  $scr = <<<EOT
    // name is autoname_givenname
    \$givenForLabel = LF_postInput( 'n', str_replace( " ", "_", \$INPUT_DATA[1]['tgivenname']));
    \$INPUT_DATA[1]['nname'] = \$INPUT_DATA[1]['_nname'].'_'.substr( \$givenForLabel, 0, 10);
    unset( \$INPUT_DATA[1]['_nname']);
    // content is 2 spans with give name and short description
    \$content = '<span class="title">'.\$INPUT_DATA[1]['tgivenname'].'</span>';
    \$content .= ' - <span class="subtitle">'.\$INPUT_DATA[1]['tcontent'].'</span>';
    \$INPUT_DATA[1]['tcontent'] = \$content;
    \$INPUT_DATA[1]['textra'] = '{"system":{"state":"new"}}';
    // Save nname, tcontent, stype and nstyle
    \$INPUT_DATA[0] = array( "nname", "tcontent", "stype", "nstyle", "textra");
    return true;
EOT;
  // Build model selection
  $models = [ $marketplaceLabel => ""];
  $localCount = LF_count( $data);
  for ( $i = 1; $i < $localCount; $i++)
  {
     $name = HTML_getContentsByQuerySelect( LF_preDisplay( 't', $data[$i]['tcontent']), "span .title")[0];
     if ( !$name) $name =  LF_preDisplay( 't', $data[$i]['tcontent']);
     $fullName = LF_preDisplay( 'n', $data[$i]['nname']); 
     $models[ $name] = $fullName;
  }
  
  // Use utilities for name of new dir, file or model
  $name = UD_utilities::getContainerName();
  $form->addInputScript( $scr); 
  if ( $mode == "dir") $type = "1";
  else
  {
      if ($mode == "file")  $type = "2";
      if ($mode == "model") $type= "3";
   
//    $models = [ "choose later"=>"", "A4 text"=>"A4 text", /*"Calculs"=>"Calculs", "A5 slides"=>"A5 slides",*/ "Health expenses"=>"ATTTTTT000125_HealthExpenses", "Welcome"=>"A000000002OS350000M_LoggedWelc"];
   if ( LF_env('cache') > 10) $form->addFieldType( "model", "select", 10, array( "selection"=>$models));
  }

  
  // Add block's id in (n)name and (s)type as hidden fields
  $form->addField("_nname", $name, [ "label"=>"", "htmlType"=>"hidden"]);
  $form->addField("_stype", $type, []);   
  // User given name and decription
  $form->addField("tgivenname", $nameLabel, [ "label"=>"", "type"=>"name"]);
  $form->addField("tcontent", $decriptionLabel, [ "label"=>""]);
  // Add Model or Style selection if set
  if ($models) $form->addField( "nstyle", "", ["label"=>"", "type"=>"model"]);
  //if ($models) $form->addField( "_nstyle", "A4 text", ["label"=>"", "type"=>"model"]);
  $form->setParam('AJAX_back_close', "none");
  $form->setParam('AJAX_use', True);
  // Extra div to protect tool zone class
  $LF->out( "<div id=\"addA{$mode}Form\">");
  $htmlForm = $form->renderAsHTML("return window.ud.udajax.postForm( 'left-tool-zone', '$url');");
  // Activate UDE for functions
 // $htmlForm = str_replace( "<input ", "<input class=\"initialField\" onkeydown=\"window.ud.ude.formInputChange( this, event);\" ", $htmlForm);
//  $htmlForm = str_replace( "<textarea ", "<textarea class=\"initialField\" onkeydown=\"window.ud.ude.formInputChange( this, event);\" ", $htmlForm);  
  $LF->out( $htmlForm);
  //$LF->out( $form->renderAsHTML("return window.ud.udajax.postForm( 'left-tool-zone');"));
  $LF->out( "</div>");
 // echo val( $_SESSION, 'INPUT_addAfile');
  // $LF->out( htmlentities( val( $_SESSION, 'INPUT_addAfile')));
  $LF->out( "{on"."load}");
}  
 
$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '__XML');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
?>
