<?php
$NOTEST = true;
global $LF;
$requests_string = '{"0":"376","id":"376","1":"all_AJAX_robotmanager","nname":"all_AJAX_robotmanager","2":"__XML","ndatalabel":"__XML","3":"","nscope":"","4":"","ttable":"","5":"","tfields":"","6":"","tselect":"","7":"","tcode":"","8":"owns","tlabel":"owns","9":1,"bread":1,"10":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_ajax_robotmanager--3-332-3-376--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$links->close();
unset( $links); $links = null;
// all_AJAX_robotmanager on data from UniversalDocElement--21-109-21--UD|3|NO|OIDLENGTH|CD|5;
$data = $DATA = $data_all["__XML"];
$OUTPUT=array();
$LF->currentBlock = '__XML';
ob_start();
LF_env("request_siblings","");
LF_env("request_children","");


$LF->out( LINKSAPI::startTerm."Robot Manager".LINKSAPI::endTerm);

// Display Robots

// Display current operation and/or recorder

// Display scheduler

$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '__XML');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
?>
