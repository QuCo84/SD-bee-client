<?php
$NOTEST = true;
global $LF;
$requests_string = '{"0":"368","id":"368","1":"all_AJAX_share","nname":"all_AJAX_share","2":"__XML","ndatalabel":"__XML","3":"USERTOOID","nscope":"USERTOOID","4":"","ttable":"","5":"id","tfields":"id","6":"","tselect":"","7":"","tcode":"","8":"owns","tlabel":"owns","9":1,"bread":1,"10":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_ajax_share--3-332-3-368--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$links->close();
unset( $links); $links = null;
// all_AJAX_share on data from ;
$data = $DATA = $data_all["__XML"];
$OUTPUT=array();
$LF->currentBlock = '__XML';
ob_start();
LF_env("request_siblings","");
LF_env("request_children","");

// 
$LF->out( "<h3>Share with ..</h3>");

// Doc id
$oid = LF_stringToOid( LF_env( 'oid'));
if (!LF_isInstance( $oid)) array_pop( $oid); 
$docId = $oid[ LF_count( $oid) - 1];
//$docOID = LF_oidToString( $oid);
$docOID = "UniversalDocELement--".implode($oid, '-');
// Get list of currently sharing users
$shared=[];
for ($i=1; $i<count($data); $i++) {
  $oid = $data[$i]['oid'];
  $oid = LF_stringToOid($oid);
  if (  $oid[ LF_count( $oid) - 1] != $docId) continue;
  $userId = $oid[1];
  $user = LF_fetchNode( "LINKS_user--2-{$userId}--UD|3");
  $userName = $user[1]['nname'];
  $shared[] = $userName;
}
// Prepare list of users
$users = $more = "";
$userdata = LF_fetchNode( "LINKS_user--2--CD|2", "id nname tdomain stype");
for ($i=1; $i<count($userdata); $i++) {
  if ( $userdata[$i]['tdomain'] != "localhost_webdesk") continue;
  if ( $userdata[$i]['stype'] != 1) continue;
  // Must have write acess so only pseudos in fact. Each user creates a public writeable pseudo 
  $oidLen = LF_count( LF_stringToOid( $userdata[$i]['oid']));
  $userName = $userdata[$i]['nname'];
  $userId = $userdata[$i]['id'];
  $user = "";
  $user .= "<input type=\"checkbox\" onchange=\"share('{$userId}', '{$docOID}');\"";
  if ( in_array( $userName, $shared) !== false) $user .= " checked=\"true\"";
  $user .= ">";
  $user .= " ".$userName;
  if( !$userName || strpos( $users, $userName) !== false || strpos( $more, $userName) !== false) continue;
  if ( $oidLen > 2) $more .= $user."<br>";
  else $users .= $user."<br>";
}
$users .= "<a href=\"javascript:\" onclick=\"document.getElementById('more').style.display='block';\">More</a>";
$users .= "<div id=\"more\" style=\"display:none;\">$more</div>";
// Display with share status and more links
$LF->out( $users);
$js = <<<EOT
if ( typeof share == "undefined")
{
   window.share = function( userId, oid)
   {
      let woid = oid.split('--')[1];
      woid = "UniversalDocElement--2-"+userId+'-'+woid+"--SP|1";
      let inp = window.ud.dom.element( 'share_oid');
      window.ud.dom.attr( inp, "value", woid);
      window.ud.udajax.postForm( "share_formZone", "/webdesk/AJAX_share/");
   }
} 
EOT;
// Prepare form for share commands
$form = <<<EOT
<div id="share_formZone" style="display:none;">
<form id="share">
  <input name="form" value="INPUT_share"/>
  <input id= "share_oid" name="input_oid" value="$inputoid"/><br>
  <input name="iaccess" value="7"/><br>
  <input name="tlabel" value="share"></br>
</form>
</div>
EOT;
/* Example of sending a signal
  $scr .= <<<EOT
  // Write PostIt
  \$inp = \$INPUT_DATA;
  \$postit = LF_createNode("", "Postit", \$inp);
  //\\$postit = LF_oidToString(array(17, \\$posit));
  // Write signal with link to postit1
  include_once('$signalsScript');
  \$signal = array();
  \$signal[0] = array( "nname", "tmsg", "stype", "tparams");
  \$signal[1] = array();
  // TODO make unique(
  \$w = LINKSAPI::startTerm."Postit written by".LINKSAPI::endTerm.' $username '.date('dmYhi');
  //\\$w = "Message from ".LF_env('username');
  \$signal[1][0] = \$signal[1]['nname']=\$w;
  \$signal[1][1] = \$signal[1]['tmsg']=\$INPUT_DATA[1]['ttext'];
  \$signal[1][2] = \$signal[1]['stype']=SIGNAL_message;
  \$w = array( 
     'ddate'=>\$inp[1]['ddatetime'], 
     'ntype'=>\$inp[1]['stype'],
     'personId'=>$personId
   );
   \$signal[1][3] = \$signal[1]['tparams']=JSON_encode(\$w);      
   \$input_oid = "";
   \$INPUT_DATA = Null;
   \$_FILES = array(); // Put this in LF_do
   //"--2-31-2-30-2-$who"
   SIGNALS_create(\$signal, "$personOid" , "Postit-new--17-".\$postit);
   if (\$INPUT_RESULT == "") \$INPUT_RESULT = "Your message has been posted";
   \$input_oid = "";
   \$INPUT_DATA = Null;
EOT;

*/
$scr = <<<EOT
  return true;
EOT;
$_SESSION["INPUT_share"] = "return true;";
$LF->onload( $js);
$LF->out( $form);
$LF->out( "{on"."load}");
$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '__XML');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
?>
