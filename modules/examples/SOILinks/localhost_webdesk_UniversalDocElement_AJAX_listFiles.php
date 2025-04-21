<?php
$NOTEST = true;
global $LF;
$requests_string = '{"0":"365","id":"365","1":"all_AJAX_listFiles","nname":"all_AJAX_listFiles","2":"__XML","ndatalabel":"__XML","3":"","nscope":"","4":"OID:UniversalDocElement--21","ttable":"OID:UniversalDocElement--21","5":"*","tfields":"*","6":"","tselect":"","7":"","tcode":"","8":"owns","tlabel":"owns","9":1,"bread":1,"10":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_ajax_listfiles--3-332-3-365--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$links->close();
unset( $links); $links = null;
// all_AJAX_listFiles on data from OID:UniversalDocElement--21;
$data = $DATA = $data_all["__XML"];
$OUTPUT=array();
$LF->currentBlock = '__XML';
ob_start();
LF_env("request_siblings","");
LF_env("request_children","");

   //DICO_setTerms(["UniversalDocElement"]);
// $LF->out( JSON_encode( $data));
// Get FTP path
$ftpPath = LF_env( 'ftpPath');
$currentDir = LF_env( 'currentDirName');
if ($currentDir == "FTP") $currentDir = "";
// Get path to files
if ($currentDir) $fullPath = "upload/".$ftpPath."/".$currentDir;
else $fullPath = "upload/".$ftpPath;

// Get contents of directory
$files = FILE_listDir( $fullPath);
// echo $fullPath.' '.$currentDir; var_dump( $files); die();
if ( !is_array( $files))
{
   echo $fullPath.' '.$currentDir; var_dump( $files); die();
   return true;
}

// Display files with links to open PDF 
$hidden = LF_env( "hiddenFTPfiles");
$r = [$data[0]];
for ($i=0; $i<LF_count( $files); $i++)
{
   $filename = $files[ $i];
   if ( $hidden && strpos( ' '.$hidden, $filename)) continue; 
   // 2DO get infos for file such as date fileatime in FILES
   $dcreated = LF_date( date( "d/m/Y H:i", fileatime( "{$fullPath}/$filename")));
   $dmodified = LF_date( date( "d/m/Y H:i", filemtime( "{$fullPath}/$filename")));
   if ( $filename == '.' || $filename == '..') continue;   
   // Link when clicked
   $url = "/{$fullPath}/{$filename}";
   // File
   $type = "2";
   $textra = '{"system":{"externalURL":"'.$url.'"}}';
   // 2DO Use Numerological sum (vibration) of directory  
   $id = strlen( $currentDir)+$i+1;
   if ( strpos( $filename, '.') === false)
   {
      // Dir
      $type = "1";
      $url = "/webdesk/".LF_env('oid')."/AJAX_modelShow/ReqCurrentFTPdir|$filename/";
      $textra = '{"system":{"externalURL":"'.$url.'"}}';
      $id = 0; // means same page
   }
    $file = [
   	'id'=>$id, 'nname'=> $filename, 'stype'=>$type, 'nstyle'=>"", 'tcontent'=>$filename, 
   	'textra'=>$textra, 'nlanguage'=>"", 'dcreated'=>$dcreated, 'dmodified'=>$dmodified, 'taccessRequest'=>""
   ];
   $r[] = $file;
}
// Send as JSON
$LF->out( JSON_encode( $r));
$LF->out( "{on"."load}");
$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '__XML');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
?>
