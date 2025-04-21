<?php
$NOTEST = true;
global $LF;
$requests_string = '{"0":"366","id":"366","1":"UniversalDocElement_AJAX_getChanged","nname":"UniversalDocElement_AJAX_getChanged","2":"__XML","ndatalabel":"__XML","3":"","nscope":"","4":"UniversalDocElement","ttable":"UniversalDocElement","5":"* tlabel","tfields":"* tlabel","6":"","tselect":"","7":"","tcode":"","8":"owns","tlabel":"owns","9":1,"bread":1,"10":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-universaldocelement_ajax_getchanged--3-332-3-366--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$links->close();
unset( $links); $links = null;
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
// UniversalDocElement_AJAX_getChanged on data from UniversalDocElement;
$data = $DATA = $data_all["__XML"];
$OUTPUT=array();
$LF->currentBlock = '__XML';
ob_start();
LF_env("request_siblings","");
LF_env("request_children","");

// Get id of document
$oid = LF_stringToOid( LF_env( 'oid'));
$oidLen = LF_count( $oid);
if ( ( $oidLen % 2) == 0) $id = $oid[ LF_count( $oid) - 1];
else $id = $oid[ LF_count( $oid) - 2];

// 2DO Fct will be moved to udutilities
// Get timing info stored in ENV with id in name
//echo LF_env( "UD_{$id}_firstTime").' '.LF_env( "UD_{$id}_lastTime").'<br>';
$firstTime = (int) LF_env( "UD_{$id}_firstTime");
$lastTime = (int) LF_env( "UD_{$id}_lastTime")-1;
$lastTick = ( $lastTime - (int) LF_env( "UD_{$id}_firstTime")) *100;
// Get list of elements at initial sending or last getChanged
$previousElementList = LF_env( "UD_{$id}_elementList");
$deletedElements = $previousElementList;
$elementList = [];
$sortedDataset = UD_utilities::buildSortedAndFilteredDataset( LF_env( 'oid'), $data); 
// Build list of changed elements and always include current user to confirm session
$changedElements = [ "UD_user"=>[ "content"=>LF_env( 'user')]];
if ($previousElementList)
{
$elementCount = LF_count( $data);
// Run through each element and note those that have been changed
// and tick off element from previous list
$ignore = false;
$parent = [];
while( !$sortedDataset->eof())
{  
    $element = $sortedDataset->next(); // $data[$i];
    if ( $id == val( $element, 'id')) $ignore = false;
    if ( $ignore) continue;
    $name = val( $element, 'nname');
    $elementOid = LF_mergeShortOid( $element['oid'], []);   
    if ( $element['dmodified'] >= $lastTime)
    { 
        // Element has changed
        // Get id of next element
        $next = $sortedDataset->next();
        $sortedDataset->prev();
        $nextId = val( $next, 'nname');  
        $nextOidLen = LF_count( LF_stringToOId( val( $next, 'oid')));     
      	$changedElements[ $name] = [ 
           "oid"=>$elementOid,
           "ticks"=>((int) $element['dmodified'] - $firstTime)*100,
           "before"=>$nextId,
        ];
        // Indicate parent if lower level
        $level = (int) ((LF_count( LF_stringToOid( $elementOid)) - $oidLen) /2);
        if ( $level > 2) $changedElements[ $name]['parent'] =  $parent[ $level-1];
        else $parent[ $level] = $name;
    }
    // Remove this element from to Delete list  
    $keyDel = array_search( $name, $deletedElements);
    if ( $keyDel !== false) unset( $deletedElements[ $keyDel]); 
    $elementList[] = $name;  
}
// Elements not ticked off have been removed, so add to list of changed elements
$deletedElementCount = LF_count( $deletedElements);
for ( $i=0; $i < $deletedElementCount; $i++)
  $changedElements[ $deletedElements[$i]] = ["oid"=>"__DELETED", "tick"=>0];
}  
// Send list of changed elements as JSON
$LF->out( JSON_encode( $changedElements));
// Update timing info and element list

LF_env( "UD_{$id}_lastTime", LF_date());
LF_env( "UD_{$id}_elementList", $elementList);

header( "Access-Control-Allow-Origin: http://dev.cornwell.fr");

$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '__XML');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
?>
