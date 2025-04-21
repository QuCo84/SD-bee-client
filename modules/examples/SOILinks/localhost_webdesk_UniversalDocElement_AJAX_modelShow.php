<?php
$NOTEST = true;
global $LF;
$requests_string = '{"0":"358","id":"358","1":"all_AJAX_modelShow","nname":"all_AJAX_modelShow","2":"__XML","ndatalabel":"__XML","3":"","nscope":"","4":"","ttable":"","5":"","tfields":"","6":"","tselect":"","7":"","tcode":"","8":"owns","tlabel":"owns","9":1,"bread":1,"10":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_ajax_modelshow--3-332-3-358--AL|5"}';
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
// all_AJAX_modelShow on data from UniversalDocElement--21-2119-21--UD|3|NO|OIDLENGTH|CD|5;
$data = $DATA = $data_all["__XML"];
$OUTPUT=array();
$LF->currentBlock = '__XML';
ob_start();
LF_env("request_siblings","");
LF_env("request_children","");


if (LF_env( 'action') == "AJAX_modelShow")
{
  DICO_setTerms(["UniversalDocElement"]);

  $banner = "Home";
  if ( LF_env( 'lang') == "FR") $banner = "Accueil";
  // 2DO get model from LF_env
  $model = 'Basic model for home directories';
  $models = [ "DirListing", 'Basic model for home directories'];
  
   $oid = LF_env('oid');
  
  // Find name of current Directory (could use a find in current data)
  $useFTP = false;
  if ( LF_env( 'ReqCurrentFTPdir'))
  {
     $currentName = LF_env( 'ReqCurrentFTPdir');
     // $LF->out( "WoW".$currentName.' '.LF_env( 'currentDirName'));
     if ( $currentName == "_REPEAT")
     {
         $currentPath = explode( '/', LF_env( 'currentDirName'));
         $currentName = $currentPath[ LF_count( $currentPath) - 1];
         // $LF->out(  $currentName.' '.LF_env( 'currentDirName'));
     }
     else
     {
     	$previous = str_replace( "FTP", "", LF_env( 'currentDirName'));
     	$currentPathStr = $currentName;
    	if ( $currentName != "FTP" &&  $previous) $currentPathStr = $previous.'/'.$currentName;
    	else $currentPathStr = $currentName;
    	LF_env( 'currentDirName', $currentPathStr);
     } 	 
     LF_env( 'ReqCurrentFTPdir', "");
     // $LF->out( "WoW".$currentName.' '.LF_env( 'currentDirName'));     
     $useFTP = true;     
  }
  else
  {
     // Get oid & data of current directory
     $w = LF_stringToOid( $oid);
     if ( LF_count( $w) > 1)
     {
       array_pop( $w);
       $currentOid = LF_oidToString( $w);
       $dirData = LF_fetchNode( $currentOid);
       $currentOId = $dirData[1]['oid']; 
       // Get name and write to ENVironment
       $currentName = $dirData[1]['nname'];
       $dirContent = LF_preDisplay( 't', $dirData[1]['tcontent']);
       if ( strpos( $dirContent, '<span') !== false) $currentName = HTML_getContentsByTag( $dirContent, 'span')[0]; 
       else $currentName = $dirContent;
       $currentPath = $currentName;
       $previous = LF_env( 'currentDirName');
       if ( $currentPath != "FTP" && $previous) $currentPath = $previous.'/'.$currentName;
       // echo $currentName.' '.$currentPath;
       LF_env( 'currentDirName', $currentPath);
       $banner = $currentName;
     }  
  }
  // Generate document with UD class
  if ( $oid == "") LF_env('oidData', "UniversalDocElement--21");
  else LF_env('oidData', LF_oidToString( LF_stringToOid( $oid))); // --UD|1");  
  $ud = new UniversalDoc( [ "mode"=>"model", "displayPart" => "default"]); 
  // 2DO Get list of FTP directories
  $ftpDirs = [ "BULLETINS", "CERTIFICAT TRAVAIL", "CERTIFICATS TRAVAIL", "FTP"];
  //if (in_array( $currentName, $ftpDirs)) $LF->OUT( "Yess");
  //if ( strpos( $currentName, "Espace_FTP")) $ud->loadModel( $models);
  if ( $useFTP || in_array( $currentName, $ftpDirs)) 
  {
     $banner = "Espace FTP";   
     $ud->loadModel( $models);
     $useFTP = true;
  }   
  else
  {  
     // Load directory data for manage view  
     if ( $dirData) $ud->loadData( $currentOid, $dirData, true);
     // Load directlory listing model to display contents
     $ud->loadModel( $model);
  }  
  $LF->onload( "new UDapiRequest( LFJ_openAcco ref:'AJAX_show', command:'pageBanner(/set/,/$banner/);', quotes:'//' LFJ_closeAcco);");
  $ud->initialiseClient();  

  if ($useFTP)
  {
      // Display navigation
      $currentDir = LF_env( 'currentDirName');
      $ftpSpaceName = LF_env( 'ftpSpaceName'); 
      $linkToFTPhome = "/webdesk/".LF_env('oid')."/modelShow/ReqCurrentFTPdir|/";
      if ( !$ftpSpaceName) $ftpSpaceName= LINKSAPI::startTerm."Private FTP space".LINKSAPI::endTerm;
      $navigation = "<h1>{$ftpSpaceName}</h1>"; // Param
      if ( $currentDir && $currentDir != "FTP") $navigation .= "<h2>{$currentDir}</h2><a href=\"{$linkToFTPhome}\">Home</a>";
      else $navigation .= "<h2>Home</h2>";
      // JS to fill navigation zone 
      $js  =  "";
      $js .=  "let navElement = document.getElementsByName( 'FTP navigation')[0];";
      $js .=  "navElement.innerHTML = '{$navigation}';";
      $LF->onload( $js);
  } 
  $LF->out( "\n{"."onload"."}"); 
}
/*
  LF_env('oidData', "UniversalDocElement--21"); // --UD|1");
  $model = 'Basic model for home directories';
  // 2D0 get parameters and go to/open last displayed  
}
LF_debug( "Loading Welcome page $model", "webdesk", 9);
$ud = new UniversalDoc( ['mode'=>"model", 'displayPart'=>"default"]);
$ud->loadModel( $model);
$ud->initialiseClient(); 
*/
$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '__XML');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
?>
