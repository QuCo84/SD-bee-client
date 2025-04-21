<?php
$NOTEST = true;
global $LF;
// Get data from Base
$requests_string = '{"0":"332","id":"332","1":"localhost_webdesk","nname":"localhost_webdesk","2":"_NODATA","ndatalabel":"_NODATA","3":"","nscope":"","4":"","ttable":"","5":"","tfields":"","6":"","tselect":"","7":"","tcode":"","8":"owns","tlabel":"owns","9":1,"bread":1,"10":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk--3-332--UD|3|AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$requests_string = '{"0":"121","id":"121","1":"www@6rfolks@6com_all_all_all_footer","nname":"www@6rfolks@6com_all_all_all_footer","2":"body@3main@3p9","ndatalabel":"body@3main@3p9","3":"","nscope":"","4":"","ttable":"","5":"","tfields":"","6":"","tselect":"","7":"","tcode":"","8":"public","tlabel":"public","9":1,"bread":1,"10":0,"bdelete":0,"oid":"LINKS_request-www@6rfolks@6com_all_all_all_footer--3-121--UD|3|AL|1"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$requests_string = '{"0":"344","id":"344","1":" includes","nname":" includes","2":"1","_nname":"1","3":"_NODATA","ndatalabel":"_NODATA","4":"","nscope":"","5":"","ttable":"","6":"","tfields":"","7":"","tselect":"","8":"","tcode":"","9":"owns","tlabel":"owns","10":1,"bread":1,"11":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-[{1}] includes--3-332-3-344--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$requests_string = '{"0":"333","id":"333","1":"all_all","nname":"all_all","2":"_NODATA","ndatalabel":"_NODATA","3":"","nscope":"","4":"","ttable":"","5":"","tfields":"","6":"","tselect":"","7":"","tcode":"","8":"owns","tlabel":"owns","9":1,"bread":1,"10":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_all--3-332-3-333--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$requests_string = '{"0":"343","id":"343","1":"home_default","nname":"home_default","2":"@3body@3main@3content@3middleColumn@3scroll@3document","ndatalabel":"@3body@3main@3content@3middleColumn@3scroll@3document","3":"USER","nscope":"USER","4":"* tlabel","ttable":"* tlabel","5":"","tfields":"","6":"","tselect":"","7":"","tcode":"","8":"owns","tlabel":"owns","9":1,"bread":1,"10":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-home_default--3-332-3-343--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$requests_string = '{"0":"334","id":"334","1":"session","nname":"session","2":"1","_nname":"1","3":"@3body@3main","ndatalabel":"@3body@3main","4":"USER","nscope":"USER","5":"SetOfValues","ttable":"SetOfValues","6":"*","tfields":"*","7":"","tselect":"","8":"","tcode":"","9":"owns","tlabel":"owns","10":1,"bread":1,"11":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_all-LINKS_request-[{1}]session--3-332-3-333-3-334--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$requests_string = '{"0":"338","id":"338","1":"Image loader","nname":"Image loader","2":"2","_nname":"2","3":"_images","ndatalabel":"_images","4":"USER","nscope":"USER","5":"Media-Webdesk media-Media","ttable":"Media-Webdesk media-Media","6":"*","tfields":"*","7":"","tselect":"","8":"","tcode":"","9":"owns","tlabel":"owns","10":1,"bread":1,"11":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_all-LINKS_request-[{2}]image loader--3-332-3-333-3-338--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$requests_string = '{"0":"374","id":"374","1":"Tips loader","nname":"Tips loader","2":"2b","_nname":"2b","3":"@3body@3tips","ndatalabel":"@3body@3tips","4":"USER","nscope":"USER","5":"SimpleArticle--5-241-5--UD|2-nname|Help and tips {lang}|CD|3","ttable":"SimpleArticle--5-241-5--UD|2-nname|Help and tips {lang}|CD|3","6":"*","tfields":"*","7":"","tselect":"","8":"","tcode":"","9":"owns","tlabel":"owns","10":1,"bread":1,"11":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_all-LINKS_request-[{2b}]tips loader--3-332-3-333-3-374--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$requests_string = '{"0":"335","id":"335","1":"layout","nname":"layout","2":"3","_nname":"3","3":"_STYLES","ndatalabel":"_STYLES","4":"","nscope":"","5":"SetOfValues-WebDesk-{template}","ttable":"SetOfValues-WebDesk-{template}","6":"*","tfields":"*","7":"","tselect":"","8":"","tcode":"","9":"owns","tlabel":"owns","10":1,"bread":1,"11":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_all-LINKS_request-[{3}]layout--3-332-3-333-3-335--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$requests_string = '{"0":"342","id":"342","1":"Home","nname":"Home","2":"4","_nname":"4","3":"_NODATA","ndatalabel":"_NODATA","4":"","nscope":"","5":"","ttable":"","6":"","tfields":"","7":"","tselect":"","8":"","tcode":"","9":"owns","tlabel":"owns","10":1,"bread":1,"11":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_all-LINKS_request-[{4}]home--3-332-3-333-3-342--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$requests_string = '{"0":"347","id":"347","1":"Local functions","nname":"Local functions","2":"5","_nname":"5","3":"_NODATA","ndatalabel":"_NODATA","4":"","nscope":"","5":"","ttable":"","6":"","tfields":"","7":"","tselect":"","8":"","tcode":"","9":"owns","tlabel":"owns","10":1,"bread":1,"11":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_all-LINKS_request-[{5}]local functions--3-332-3-333-3-347--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$requests_string = '{"0":"349","id":"349","1":"leftTools","nname":"leftTools","2":"@3body@3main@3content@3leftColumn","ndatalabel":"@3body@3main@3content@3leftColumn","3":"","nscope":"","4":"","ttable":"","5":"","tfields":"","6":"","tselect":"","7":"","tcode":"","8":"owns","tlabel":"owns","9":1,"bread":1,"10":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_all-LINKS_request-lefttools--3-332-3-333-3-349--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$requests_string = '{"0":"355","id":"355","1":"meta","nname":"meta","2":"@3head","ndatalabel":"@3head","3":"","nscope":"","4":"","ttable":"","5":"","tfields":"","6":"","tselect":"","7":"","tcode":"","8":"owns","tlabel":"owns","9":1,"bread":1,"10":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_all-LINKS_request-meta--3-332-3-333-3-355--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$requests_string = '{"0":"364","id":"364","1":"terms","nname":"terms","2":"@3body@3terms","ndatalabel":"@3body@3terms","3":"","nscope":"","4":"","ttable":"","5":"","tfields":"","6":"","tselect":"","7":"","tcode":"","8":"owns","tlabel":"owns","9":1,"bread":1,"10":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_all-LINKS_request-terms--3-332-3-333-3-364--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$requests_string = '{"0":"336","id":"336","1":"[{1}]header","nname":"[{1}]header","2":"","_nname":"","3":"@3body@3main@3header","ndatalabel":"@3body@3main@3header","4":"","nscope":"","5":"","ttable":"","6":"","tfields":"","7":"","tselect":"","8":"","tcode":"","9":"owns","tlabel":"owns","10":1,"bread":1,"11":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_all-LINKS_request-[{3}]layout-LINKS_request-[{}][{1}]header--3-332-3-333-3-335-3-336--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$requests_string = '{"0":"337","id":"337","1":"content","nname":"content","2":"2","_nname":"2","3":"@3body@3main@3content","ndatalabel":"@3body@3main@3content","4":"","nscope":"","5":"","ttable":"","6":"","tfields":"","7":"","tselect":"","8":"","tcode":"","9":"owns","tlabel":"owns","10":1,"bread":1,"11":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_all-LINKS_request-[{3}]layout-LINKS_request-[{2}]content--3-332-3-333-3-335-3-337--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$requests_string = '{"0":"384","id":"384","1":"footer","nname":"footer","2":"3","_nname":"3","3":"@3body@3main@3footer","ndatalabel":"@3body@3main@3footer","4":"","nscope":"","5":"","ttable":"","6":"*","tfields":"*","7":"","tselect":"","8":"","tcode":"","9":"owns","tlabel":"owns","10":1,"bread":1,"11":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_all-LINKS_request-[{3}]layout-LINKS_request-[{3}]footer--3-332-3-333-3-335-3-384--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$requests_string = '{"0":"339","id":"339","1":"Left tools","nname":"Left tools","2":"1","_nname":"1","3":"leftColumn","ndatalabel":"leftColumn","4":"","nscope":"","5":"","ttable":"","6":"","tfields":"","7":"","tselect":"","8":"","tcode":"","9":"owns","tlabel":"owns","10":1,"bread":1,"11":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_all-LINKS_request-[{3}]layout-LINKS_request-[{2}]content-LINKS_request-[{1}]left tools--3-332-3-333-3-335-3-337-3-339--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$requests_string = '{"0":"340","id":"340","1":"Document","nname":"Document","2":"2","_nname":"2","3":"middleColumn","ndatalabel":"middleColumn","4":"","nscope":"","5":"","ttable":"","6":"","tfields":"","7":"","tselect":"","8":"","tcode":"","9":"owns","tlabel":"owns","10":1,"bread":1,"11":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_all-LINKS_request-[{3}]layout-LINKS_request-[{2}]content-LINKS_request-[{2}]document--3-332-3-333-3-335-3-337-3-340--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$requests_string = '{"0":"341","id":"341","1":"Right tools","nname":"Right tools","2":"3","_nname":"3","3":"rightColumn","ndatalabel":"rightColumn","4":"","nscope":"","5":"","ttable":"","6":"","tfields":"","7":"","tselect":"","8":"","tcode":"","9":"owns","tlabel":"owns","10":1,"bread":1,"11":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-all_all-LINKS_request-[{3}]layout-LINKS_request-[{2}]content-LINKS_request-[{3}]right tools--3-332-3-333-3-335-3-337-3-341--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$links->close();
unset( $links); $links = null;
// End of data retrieval

// localhost_webdesk on data from ;
$data = $DATA = $data_all["_NODATA"];
$OUTPUT=array();
$LF->currentBlock = '';
ob_start();
LF_env("request_siblings","");
LF_env("request_children","_NODATA:_NODATA _NODATA:_NODATA @3body@3main@3content@3middleColumn@3scroll@3document:@3body@3main@3content@3middleColumn@3scroll@3document ");

LF_debug( "Start of HTTP GET", "WebDesk", 9);
$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// Debug js;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = 'head';
ob_start();
$OUTPUT['head']="<script langage='JavaScript' type='text/javascript' src='/upload/smartdoc_prod/debug/debug.js'></script>";


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'head');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// DOM class;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = 'head';
ob_start();
$OUTPUT['head']="<script langage='JavaScript' type='text/javascript' src='/upload/smartdoc_prod/browser/dom.js'></script>";


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'head');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// DOMcalc class;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = 'head';
ob_start();
$OUTPUT['head']="<script langage='JavaScript' type='text/javascript' src='/upload/smartdoc_prod/ude-view/udecalc.js'></script>";


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'head');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// Dropzone styles;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = 'head';
ob_start();
$OUTPUT['head']="<link id='ext_css' rel='stylesheet' type='text/css' href='/upload/GabAY0a0a_dropzone.css'/>";


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'head');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// dropzonejs;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = 'head';
ob_start();
$OUTPUT['head']="<script langage='JavaScript' type='text/javascript' src='/upload/F1g10141q_dropzone.js'></script>";


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'head');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// jQuery v3@63;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = 'head';
ob_start();
$OUTPUT['head']="<script langage='JavaScript' type='text/javascript' src='/upload/xnFm1NAn8_jquery-3.3.1.min.js'></script>";


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'head');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// UD_AJAX js class;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = 'head';
ob_start();
$OUTPUT['head']="<script langage='JavaScript' type='text/javascript' src='/upload/smartdoc_prod/browser/udajax.js'></script>";


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'head');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// UDAPI JS class;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = 'head';
ob_start();
$OUTPUT['head']="<script langage='JavaScript' type='text/javascript' src='/upload/smartdoc_prod/ud-view-model/udapi.js'></script>";


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'head');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// UDE JS class;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = 'head';
ob_start();
$OUTPUT['head']="<script langage='JavaScript' type='text/javascript' src='/upload/smartdoc_prod/ude-view/ude.js'></script>";


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'head');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// UI JS lib;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = 'head';
ob_start();
$OUTPUT['head']="<script langage='JavaScript' type='text/javascript' src='/upload/G131faG0q_form.js'></script>";


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'head');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// UniversalDoc JS class;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = 'head';
ob_start();
$OUTPUT['head']="<script langage='JavaScript' type='text/javascript' src='/upload/smartdoc_prod/ud-view-model/ud.js'></script>";


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'head');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// HTML library;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = 'head';
ob_start();
global $_SCRIPTFILE;
$_SCRIPTFILE="upload/L0e3t3g2m_html.php";
include_once("upload/L0e3t3g2m_html.php");


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'head');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// UniversalDocElement PHP class;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = 'head';
ob_start();
global $_SCRIPTFILE;
$_SCRIPTFILE="upload/smartdoc/ud-view-model/ud.php";
include_once("upload/smartdoc_prod/ud-view-model/ud.php");


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'head');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
//  includes on data from ;
$data = $DATA = $data_all["_NODATA"];
$OUTPUT=array();
$LF->currentBlock = '';
ob_start();
LF_env("request_siblings","_NODATA:_NODATA _NODATA:_NODATA @3body@3main@3content@3middleColumn@3scroll@3document:@3body@3main@3content@3middleColumn@3scroll@3document ");
LF_env("request_children","");

$LF->out( '<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Titillium Web">', "head");
$LF->out( '<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Dancing Script">', "head");
$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// all_all on data from ;
$data = $DATA = $data_all["_NODATA"];
$OUTPUT=array();
$LF->currentBlock = '';
ob_start();
LF_env("request_siblings","_NODATA:_NODATA _NODATA:_NODATA @3body@3main@3content@3middleColumn@3scroll@3document:@3body@3main@3content@3middleColumn@3scroll@3document ");
LF_env("request_children","@3body@3main:@3body@3main _images:_images @3body@3tips:@3body@3tips _STYLES:_STYLES _NODATA:_NODATA _NODATA:_NODATA @3body@3main@3content@3leftColumn:@3body@3main@3content@3leftColumn @3head:@3head @3body@3terms:@3body@3terms ");

global $cache_oid;
$cache_oid["21-0"] = "UniversalDocElement";
//$LF->out( "first main");
$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();

// Session Management on data from SetOfValues;
$data = $DATA = $data_all["body/main"];
$OUTPUT=array();
$LF->currentBlock = 'body/main';
ob_start();
LF_env("request_siblings","@3body@3main:@3body@3main _images:_images @3body@3tips:@3body@3tips _STYLES:_STYLES _NODATA:_NODATA _NODATA:_NODATA @3body@3main@3content@3leftColumn:@3body@3main@3content@3leftColumn @3head:@3head @3body@3terms:@3body@3terms ");
LF_env("request_children","");

// Language
$lang = LF_env('lang');
// echo "LANG : $lang";
if ( !$lang || $lang == "none") LF_env( 'lang', "FR");
$lang = LF_env('lang'); 

// 2DO just once
LF_env( 'ProjectLabel', "WebDesk");
LF_env( 'WEBDESK_Images', []); 
$reservedNames = [
  "oid", "oidata", "oiddata", "project", "action",
  "ProjectLabel", "WEBDESK_Images", "lang"
];
if ( ( $lovC = LF_count($data)) > 1)
{
  for( $i=1; $i<$lovC; $i++)
  {
     // Write parameters to ENVironment (Session)
     $lov = JSON_decode( $data[$i]['tvalues'], true);
     if( $lov)
     {
     	foreach ($lov as $key=>$value) 
      	    if ( !in_array( $key, $reservedNames)) LF_env( $key, $value);
     }
  }

}

// HTML header for streaming objects
$LF->header = "Accept-Ranges: bytes"; // 2DO LinksAPI do a header for each line. Add \n
$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'body/main');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// Image loader on data from Media-Webdesk media-Media;
$data = $DATA = $data_all["_images"];
$OUTPUT=array();
$LF->currentBlock = '';
ob_start();
LF_env("request_siblings","@3body@3main:@3body@3main _images:_images @3body@3tips:@3body@3tips _STYLES:_STYLES _NODATA:_NODATA _NODATA:_NODATA @3body@3main@3content@3leftColumn:@3body@3main@3content@3leftColumn @3head:@3head @3body@3terms:@3body@3terms ");
LF_env("request_children","");


// Load ready to display images 
$images = new Dataset( new DynamicOid("#DCNC", 3, "Media", "Webdesk media", "Media"));
//$images = new Dataset();
//$images->load( $data);
$images->sort('nname');
// 2DO Dataset->lookup->fieldValue( 'fthumbnail') or lookupField or just 2nd arg to lookup
$imagesToUse = [
  'Logo' => FILE_getImage( $images->lookup('Logo')[1]['fthumbnail'], 50, 50),
  'Tools' =>FILE_getImage( $images->lookup('Tools icon')[1]['fthumbnail'], 50, 50),
  'logswitch' => FILE_getImage( $images->lookup('logswitch')[1]['fthumbnail'], 100, 50),
  'defaultTemplateImage' => FILE_getImage( $images->lookup('DefaultTemplateImage')[1]['fimage'], 324, 170),
];

// Add generic Action icons
$images = new Dataset( new StaticOid("#DCNC", 3, "Media", "Action icons", "Media"));
$images->sort('nname');
//var_dump($images);
// 2DO Dataset->lookup->fieldValue( 'fthumbnail') or lookupField or just 2nd arg to lookup
$imagesToUse['Styler'] = FILE_getImageFile( $images->lookup('Styler icon')[1]['fthumbnail'], 64, 64);
$imagesToUse['Highlighter'] = FILE_getImageFile( $images->lookup('Stabilo icon')[1]['fthumbnail'], 64, 64);
$imagesToUse['Lock'] = FILE_getImageFile( $images->lookup('Lock icon')[1]['fthumbnail'], 50, 50);
$imagesToUse['Id'] = FILE_getImageFile( $images->lookup('Id icon')[1]['fthumbnail'], 50, 50);

// Add webdesk Action icons
$images = new Dataset( new StaticOid("#DCNNC", 3, "Media", "Action icons", "webdesk icons", "Media"));
$images->sort('nname');
// 2DO extensible by models
$imagesToUse['AddDir'] = FILE_getImageFile( $images->lookup('Add folder')[1]['fthumbnail'], 64, 64);
$imagesToUse['AddDoc'] = FILE_getImageFile( $images->lookup('Add file')[1]['fthumbnail'], 64, 64);
$imagesToUse['Clipboarder'] = FILE_getImageFile( $images->lookup('Clipboard')[1]['fthumbnail'], 64, 64);
$imagesToUse['Rollbacker'] = FILE_getImageFile( $images->lookup('Rollback')[1]['fthumbnail'], 64, 64);
$imagesToUse['Tagger'] = FILE_getImageFile( $images->lookup('Tagger')[1]['fthumbnail'], 64, 64);
$imagesToUse['Inserter'] = FILE_getImageFile( $images->lookup('Tagger')[1]['fthumbnail'], 64, 64);
$imagesToUse['Parts'] = FILE_getImageFile( $images->lookup('Parts')[1]['fthumbnail'], 64, 64);
$imagesToUse['Outline'] = FILE_getImageFile( $images->lookup('Outline')[1]['fthumbnail'], 64, 64);
$imagesToUse['Views'] = FILE_getImageFile( $images->lookup('Parts')[1]['fthumbnail'], 64, 64);
$imagesToUse['Share'] = FILE_getImageFile( $images->lookup('Share')[1]['fthumbnail'], 64, 64);
$imagesToUse['Config'] = FILE_getImageFile( $images->lookup('Config')[1]['fthumbnail'], 64, 64);
$imagesToUse['Config_s'] = FILE_getImageFile( $images->lookup('Config')[1]['fthumbnail'], 20, 20);
$imagesToUse['Generic tool icon'] = FILE_getImageFile( $images->lookup('Add file')[1]['fthumbnail'], 64, 64);
$imagesToUse['Robots'] = FILE_getImageFile( $images->lookup( 'Robot icon')[1]['fthumbnail'], 64, 64);
$imagesToUse['DB'] = FILE_getImageFile( $images->lookup( 'DB icon')[1]['fthumbnail'], 50, 50);
$imagesToUse['Wifi'] = FILE_getImageFile( $images->lookup( 'Wifi icon')[1]['fthumbnail'], 50, 50);

LF_env( 'WEBDESK_images', $imagesToUse);

// Fetch language flags
$flags = LF_env('LOGIN_flags');
if (!$flags) // TOD use StaticDataset
{
  $flags = LF_fetchNode("Media-Country flags-Media--14-10-14");
  LF_env('LOGIN_flags', $flags);
}  

$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// Tips loader on data from SimpleArticle--5-241-5--UD|2-nname|Help and tips {lang}|CD|3;
$data = $DATA = $data_all["body/tips"];
$OUTPUT=array();
$LF->currentBlock = 'body/tips';
ob_start();
LF_env("request_siblings","@3body@3main:@3body@3main _images:_images @3body@3tips:@3body@3tips _STYLES:_STYLES _NODATA:_NODATA _NODATA:_NODATA @3body@3main@3content@3leftColumn:@3body@3main@3content@3leftColumn @3head:@3head @3body@3terms:@3body@3terms ");
LF_env("request_children","");

$lang = LF_env( 'lang');
$tips = LF_env( "SD_tips");
$nbOfTips = LF_count( $data);
//if (!$tips)
{
  // Initialise
  $tips = [];
  for ( $i=1; $i<$nbOfTips; $i++)
  {
     $tip = $data[$i];
     $tipName = LF_preDisplay( 'n', val( $tip, 'nname'));
     $tipText = LF_preDisplay( 't', val( $tip, 'ttext'));
     $tips[ $tipName] = $tipText;
  }
  LF_env( 'SD_tips', $tips);
} 
$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'body/tips');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// layout on data from SetOfValues-WebDesk-{template};
$data = $DATA = $data_all["_STYLES"];
$OUTPUT=array();
$LF->currentBlock = '';
ob_start();
LF_env("request_siblings","@3body@3main:@3body@3main _images:_images @3body@3tips:@3body@3tips _STYLES:_STYLES _NODATA:_NODATA _NODATA:_NODATA @3body@3main@3content@3leftColumn:@3body@3main@3content@3leftColumn @3head:@3head @3body@3terms:@3body@3terms ");
LF_env("request_children","@3body@3main@3header:@3body@3main@3header @3body@3main@3content:@3body@3main@3content @3body@3main@3footer:@3body@3main@3footer ");

// Get datbased or dynamic styles
LF_env( 'CORE_usingCache', 0);
LF_env( 'CORE_regenerateStyles', 0);
$mobileModeMaxWidth = 480;

if ( LF_env( 'CORE_regenerateStyles') || !LF_env('CORE_usingCache') )
{
  $displayParams = LF_env('WEBDESK_displayParams');
  //$contentHeight = 768 - $displayParams->headerHeight - $displayParams->footerHeight;
  
  // Set styles
  $CSSvalues = [
    '%color0' => "#eeeeee",
    '%color1' => "#fff8dc",  /*#d92bd7*/ //#ffec9f
    '%color2' => "#ffffff",
    '%color3' => "#000000",
    '%color4' => "#555555",
    '%color5' => "#eee7cb",
    '%color6' => "#333333",
    '%color7' => "#ddd6ba",
    '%color8' => "#fffadb",
    '%color9' => "#f3f3ca"
  ];
  $GLOBALS['CSSvalues'] = $CSSvalues;
  
  // 2DO  Put into style file
  $sectionStyles = <<<EOT
  #main {
    min-width: 300px;
    max-width: 1900px;
    width:100%;
    margin:0px auto;
    font-size:14pt;
  }
  #header { 
    width:100%; 
    height: 50px;
    background-color:white;
    position:sticky;
    top:0px;
    padding:10px 0px 10px 0px;
    z-index:200;
  }
  #header div{ 
    float: left; 
    margin : 0px 5px 0px 5px;
    padding: 0px 7px 0px 7px;
    min-width: 6%;
  }
@media screen and (max-width: 550px)
{
  #header div{ 
    float: left; 
    margin : 0px 3px 0px 3px;
    padding: 0px 5px 0px 5px;
    min-width: 6%;
  }
  #main
  {
    font-size:10pt;
  }
  
  #logo, #rightToolIcon { display:none;}

}  
  
  #header span{
    line-height: 50px;
  }
 
  #banner {
    text-align: center;
    vertical-align: middle;
    height: 100%;
    width: 60%; 
    font-size:1.4em;
    background-color: {%color0};
    color: {%color4};
    white-space:pre-wrap;
  }  
  #titleBanner {
    width : 50%;
  }
  
  @media screen and (max-width: 550px)
  {
     #main {font-size:7pt;background-color:red;}
     #banner {font-size:0.7em;}
  }

  @media screen and (max-width: 850px)
  {
     #main {font-size:7pt;background-color:red;}
     #banner {font-size:0.8em; width:50%;}
  }    
  
  #content {
    width: 100%;
    display: block;
    /*margin: 10px 0px 5px 0px;*/
    height: 820px;
    position: relative;

    /*display:inline-block;*/
  }
  #leftColumn {
    width: 0px;
    max-width: 350px;
    padding-left: 15px;
    height: 100%;
    background-color: {%color1};
    color:{%color4};
    font-size: 0.8em;
    /*float:left;*/
    position: absolute;
    opacity: 95%;
    top: 0px;
    left: 0px;
    z-index : 5;
    overflow-x: hidden;
  }
  
  #leftColumn h1 {
    text-align: center;
  }
  #leftColumn a {
    text-decoration : none;
    color: {%color4};
  }
  div.toolset-title{
    background-color: {%color5};
    color: {%color6};
    text-align:center;
    width:100%;
    display: none;
  }  
  div.toolset-selector {
    display: grid;
    grid-template-columns: repeat( 2, 1fr);
    width:100%;
  }
  div.tool-icon{
    display: inline-grid;
    min-width: 80px;
    min-height : 80px;
    text-align: center;
  }  
  div.tool-icon.selected{
    background-color:{%color7};
  }
  .tool-zone{
    margin-top:20px;
  }
  #content div .closed{ width:20px;}
  
  #middleColumn {
   /* flex-grow:100;
    float:left;*/
    height:100%;
    Width :100%;
    background-color:{%color0};
    position: absolute;
    left:0px;
    top:0px;
  }
  #rightColumn
  {
    width:0px;
    max-width: 230px;
    padding-left:15px;
   /* float:right;*/
    height:100%;
    background-color: {%color1};
    color:#555;
    position: absolute;
    right:0px;
    top:0px;
    z-index: 6;
    overflow-x: hidden;

  }
  #rightColumn h1 {
    text-align: center;
  }
  #rightColumn a {
    text-decoration : none;
    color: {%color4};
  }
  #footer {
    width: 100%;
    min-height : 30px;
    background-color: #57577d;
    color : #e7e7fd;
    font-size:0.7em;
    position:sticky;
    bottom:0px;
    z-index:200;
    display:none;
  }
  
  #footer a {
    color : inherit;
    text-decoration:inherit;
  }
  
  #footer span.footerItem {
    vertical-align:middle;
    text-align:center;
    display:inline-block;
    width:250px;
    margin-top: 0.4em;
  }
  
  #UD_resources {
    display:none;
  } 
  
  /* Remove default bullets */
ul #outline {
  list-style-type: none;
}


/* Style the caret/arrow */
.caret {
  cursor: pointer;
  user-select: none; /* Prevent text selection */
}

/* Create the caret/arrow with a unicode, and style it 25B6*/
/*
.caret::before {
  content: "\B6";
  color: black;
  display: inline-block;
  margin-right: 6px;
}
*/
/* Rotate the caret/arrow icon when clicked on (using JavaScript) */
.caret-down::before {
  transform: rotate(90deg);
}

/* Hide the nested list */
.nested {
  display: block;
}

/* Show the nested list when the user clicks on the caret/arrow (with JavaScript) */
.active {
  display: block;
}

table.textContent tbody tr:nth-child(odd)
{
  background-color: {%color8};
  display:block; 
  width:100%
}
table.textContent tbody tr:nth-child(even)
{
  background-color: {%color9};
  display:block; 
  width:100%
}

EOT;


  if ( LF_env( 'CORE_regenerateStyles'))
  {
    // Write style to file
    // 2DO may need to check deletion not needed first in FILE_write
    FILE_write( "tmp", LF_env('ProjectLabel')."_layout.css", -1, $sectionStyles); 
    // Could append @import in main css passed in LF_env
  }
  else
  {
    // Write style to head section
    $sectionStyles = LF_substitute( $sectionStyles, $CSSvalues);
    $LF->out( $sectionStyles, "head/style"); // 2DO only run if not cache ie dev 
  }
  // 2DO Module 
  // 2DO ud.addToolSet()  with ud.addTool() already written
  // 2DO allow each tool to be a seperate class, may be an extension of an UDE_tool class
  // 2DO tool state = active, sleeping, inactive, closed
  // 2DO basic class has fcts for cleaning up, removing classes etc in document
  // 2DO zone becomes UDE_toolSet attached to elements in the page design
  $script = <<<EOT
    // jquery equivalent use ES5
    function Zone( name1, name2)
    {
    /*
      this.name; // zone name
      element; // HTML element
      mode;
      saveContent;
      params; // min max width etc
   
      constructor = function( name1, name2) {
      */
        this.stayOpenTime = 180000;
        this.getStyle1 = function(attributeName, type)
        {
           var r = getComputedStyle(this.element1)[attributeName];
           if (type == "nb") return parseInt(r);
           return r;
        } // getStyle()      
        this.getStyle2 = function(attributeName, type)
        {
           var r = getComputedStyle(this.element2)[attributeName];
           if (type == "nb") return parseInt(r);
           return r;
        } // getStyle()      
        this.name1 = "#"+name1;
        this.element1 = document.getElementById( name1);
        this.name2 = "#"+name2;
        this.element2 = document.getElementById( name2);
        this.mode = "";
        this.saveContent = "";
        this.params = "";
        if ( this.getStyle1( 'width', 'nb') == 0) 
        {
          this.mode = "Reduced";
          // 2DO retrieve content  (maye be decline Zone)
          // 2DO Show open button
        }  
        this.toolZone1 = this.element1.childNodes[3];
        //this.toolZone2 = this.element2.childNodes[3];
        //var me = this;
        this.toolZone1.setAttribute( 'onclick', "leftColumn.closeIfAnchor(event.target, true);");
        //this.toolZone2.setAttribute( 'onclick', "rightColumn.closeAll( true);");

        this.switchDisplayMode = function()
        {
           let w1 = getComputedStyle(this.element1)['width'];
           let w2 = getComputedStyle(this.element2)['width'];
           let scrollY = window.scrollY;
           let screenWidth = screen.innerWidth;
           if (!screenWidth) screenWidth = screen.availWidth;
           console.log( "window.scrollY:"+scrollY+", screenWidth:"+screenWidth);
           if ( w1 == "0px" && ( screenWidth > $mobileModeMaxWidth|| w2 == "0px") )
           {
             this.element1.style.width = getComputedStyle(this.element1)['max-width'];
             this.element1.style.top = scrollY+"px";
             var toolZone  = this.element1.querySelector( "div.tool-zone");
             toolZone.style.display = "block";
             setTimeout( function(){leftColumn.closeAll( true);}, this.stayOpenTime);
           }             
           else if ( w1 != "0px" && ( screenWidth >= $mobileModeMaxWidth || w2 == "0px"))
           {
             if ( screenWidth < $mobileModeMaxWidth)
             {
                 this.element2.style.width = getComputedStyle(this.element2)['max-width'];
                 var toolZone  = this.element2.querySelector( "div.tool-zone");
                 toolZone.style.display = "block";
		 setTimeout( function(){rightColumn.closeAll( true);}, this.stayOpenTime);                 
             }
             this.element1.style.width = "0px";
             var toolZone  = this.element1.querySelector( "div.tool-zone");
             toolZone.style.display = "none";
             // Clean up current tool stuff (sleep)
             // 2DO save stuff for when you awaken tool
             // Quick fix trial for disabling outline
             requestEditor('setAttribute', 'outlineCurrentElementCSS', '');
             var div = document.getElementById( "document");
             for (var child in div.childNodes) 
             {
               // 2DO only 1 element stylised ...break afterwards ?             
               if ( typeof div.childNodes[child] == "object" && div.childNodes[child].classList) 
                 div.childNodes[child].classList.remove('StylerTool_outline');
             }             
           }          
           else if ( w1 == "0px" && w2 != "0px")
           {
             this.element2.style.width = "0px";
             var toolZone  = this.element2.querySelector( "div.tool-zone");
             toolZone.style.display = "none"           
           }
       } // changeDisplayMode

       this.closeAll = function ( resetZone = false)
       {
       	   this.element1.style.width = "0px";
           this.element2.style.width = "0px";
           if ( resetZone)
           {
              // Empty zone on content refresh
              this.element1.childNodes[3].innerHTML = "";
              this.element2.childNodes[3].innerHTML = "";
           }

       } //Zone.closeAll()
       
       this.closeIfAnchor = function( target, resetZone=false)
       {
           if (target.tagName.toLowerCase() == 'a' /*!= "input"*/) this.closeAll( resetZone);
       }
 } // Class zone     
EOT;
  // $LF->out( $script, "head/script"); // 2DO only run if not cache ie dev 
   // Onload code
   $onload = "";
   $onload .= "leftColumn = new Zone('leftColumn', 'rightColumn');\n"; 
   $onload .= "rightColumn = new Zone('rightColumn', 'leftColumn');\n";
   // Compute height of content div dymanically 
   // $onload .= "let contentHeight = (window.innerHeight - 64 - 32 -16);\n";  
   // $onload .= "document.getElementById('content').style.height=contentHeight+'px';\n";
   // Position footer
   // $onload .= "let contentHeight = window.innerHeight-16;\n";
   // $onload .= "document.getElementById( 'footer').style.top = ( contentHeight+0) +'px';";
   $LF->onload( $onload);
} // end of style re-generation
else
{
  // NOT REQUIRED if project has 1 global style with @imports in it 
  $LF->out( '<link rel="stylesheet" href="/tmp/'.LF_env('ProjectLabel').'_layout.css" />', "head");
}
$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// [{1}]header on data from ;
$data = $DATA = $data_all["body/main/header"];
$OUTPUT=array();
$LF->currentBlock = 'body/main/header';
ob_start();
LF_env("request_siblings","@3body@3main@3header:@3body@3main@3header @3body@3main@3content:@3body@3main@3content @3body@3main@3footer:@3body@3main@3footer ");
LF_env("request_children","");

//if (LF_env( 'is_Anonymous'))
{
   // Get permissions on current OID
   $oid = LF_env( 'oid');
   $oid = LF_stringToOid( $oid);
   array_pop( $oid);
   $oid = LF_oidToString( $oid);
   $docData = LF_fetchNode( $oid, "id nname");
   $permissions = OID_RDENABLE & OID_WRENABLE;
   if ( LF_count( $docData) > 1)
   {
   	$params = LF_stringToOidParams( $docData[ 1][ 'oid']);
        $permissions = (int) $params[0]['AL'];
   }   
   // Build language selector
   $flags = LF_env( 'LOGIN_flags');
   $project = LF_env( 'project');
   $lang = LF_env('lang');
   for($i=1;$i<LF_count($flags);$i++) if ($flags[$i]['nname'] == $lang) break;
   $langUI = "<select id=\"lang\" onchange=\"document.location.href='/$project///lang|'+$('#lang').val()+'/';\" style=\"background:url('/".$flags[$i]['fthumbnail']."') no-repeat;text-align:top;\">\n";
    for($i=1;$i<LF_count($flags);$i++)
    {
      if ($flags[$i]['nname'] == $lang)
        $langUI .= "<option selected=\"selected\" value=\"".$flags[$i]['nname']."\" style=\"background:url('/".$flags[$i]['fthumbnail']."') no-repeat;text-align:top;\">&nb"."sp;&nb"."sp;".$flags[$i]['nname']."</option>\n";
     else    
       $langUI .= "<option value=\"".$flags[$i]['nname']."\" style=\"background:url('/".$flags[$i]['fthumbnail']."') no-repeat;text-align:top;\">&nb"."sp;&nb"."sp;".$flags[$i]['nname']."</option>\n";
    }
    $langUI .="</select>";
}

// Generate logout and green switch
$logSwitch = "<a href=\"/webdesk//logout/\">".LF_env( 'WEBDESK_images')['logswitch']."</a>";
if ( LF_env( 'logoutHome')) 
  $logSwitch = str_replace( "/webdesk/", "/".LF_env( 'logoutHome')."/", $logSwitch);

// Generate header HTML
/*if (!$LF->isMobile)*/
$logo = '<div id="logo"><a href="javascript:" onclick="window.ud.back();">';
$logo .= LF_env( 'WEBDESK_images')['Logo'].'</a></div>';
$LF->out( $logo);
$LF->out( '<div id="leftToolIcon" onclick="leftColumn.switchDisplayMode();">'.LF_env( 'WEBDESK_images')['Tools'].'</div>');
$editorExchange = <<<EOT
  <div id="UDErequest" style="display:none;"></div>
  <div id="UDEreply" style="display:none;"></div>
  <div id="UDEcursorInfo" style="display:none;"></div>
  <div id="UDEclipboard" style="display:none;"></div>
EOT;
// Manage click on title action
$simulateEsc = "window.ud.ude.keyEvent( null, '', 'Escape', false, false, false);";
$simulateCloseTab = "window.close();";
$titleClick = $simulateCloseTab;
if ( $permissions && OID_WRENABLE) $titleClick = $simulateEsc;
// Display title
$LF->out( '<div id="banner" onclick="'.$titleClick.'" ontouch="'.$simulateEsc.'">');
$LF->out( '<span id="bannerMessage">Banner zone</span>'.$editorExchange.'</div>');
/*if (!$LF->isMobile)*/
{
   $LF->out( '<div id="rightToolIcon" onclick="rightColumn.switchDisplayMode();">'.LF_env( 'WEBDESK_images')['Tools'].'</div>');
}
   if (LF_env( 'is_Anonymous')) $LF->out( "<div>$langUI</div>");
   else $LF->out( "<div>$logSwitch</div>");
// Clock
$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'body/main/header');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// content on data from ;
$data = $DATA = $data_all["body/main/content"];
$OUTPUT=array();
$LF->currentBlock = 'body/main/content';
ob_start();
LF_env("request_siblings","@3body@3main@3header:@3body@3main@3header @3body@3main@3content:@3body@3main@3content @3body@3main@3footer:@3body@3main@3footer ");
LF_env("request_children","leftColumn:leftColumn middleColumn:middleColumn rightColumn:rightColumn ");


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'body/main/content');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// Left tools on data from ;
$data = $DATA = $data_all["body/main/content/leftColumn"];
$OUTPUT=array();
$LF->currentBlock = 'body/main/content/leftColumn';
ob_start();
LF_env("request_siblings","leftColumn:leftColumn middleColumn:middleColumn rightColumn:rightColumn ");
LF_env("request_children","");

$LF->out('<div id="left-tool-title" class="toolset-title">Home tool set left</div>');
$LF->out('<div id="left-tool-selector" class="toolset-selector"></div>');
$LF->out('<div id="left-tool-zone" class="tool-zone"></div>');
//$LF->onload( "LFJ_ajaxZone( '/webdesk//AJAX_homeTools/', 'left-tool-selector');\n");
$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'body/main/content/leftColumn');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// Document on data from ;
$data = $DATA = $data_all["body/main/content/middleColumn"];
$OUTPUT=array();
$LF->currentBlock = 'body/main/content/middleColumn';
ob_start();
LF_env("request_siblings","leftColumn:leftColumn middleColumn:middleColumn rightColumn:rightColumn ");
LF_env("request_children","");

// Draw box with shadow
// According to documentForm (default A4) box-shadow
//$LF->out( "\n".'  #middleColumn { height: 540px; background-color:#eeddee; margin:10;}', 'head/style');
$LF->out( "\n".'  #document {width:464px;  box-shadow : 2px 2px 5px black; background-color:white; margin:10px auto; padding:18px;}', 'head/style');
// height: 450px;
$LF->out( ' ');
$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'body/main/content/middleColumn');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// Right tools on data from ;
$data = $DATA = $data_all["body/main/content/rightColumn"];
$OUTPUT=array();
$LF->currentBlock = 'body/main/content/rightColumn';
ob_start();
LF_env("request_siblings","leftColumn:leftColumn middleColumn:middleColumn rightColumn:rightColumn ");
LF_env("request_children","");

$LF->out('<div id="right-tool-title" class="toolset-title">Home tool set right</div>');
$LF->out('<div id="right-tool-selector" class="toolset-selector"></div>');
$LF->out('<div id="right-tool-zone" class="tool-zone"></div>');
$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'body/main/content/rightColumn');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// footer on data from ;
$data = $DATA = $data_all["body/main/footer"];
$OUTPUT=array();
$LF->currentBlock = 'body/main/footer';
ob_start();
LF_env("request_siblings","@3body@3main@3header:@3body@3main@3header @3body@3main@3content:@3body@3main@3content @3body@3main@3footer:@3body@3main@3footer ");
LF_env("request_children","");


/**
 * L_LED () -- display a LED indicater
 */
function L_LED( $id, $size, $color)
{
   $size2 = (int) $size/5;
   $cx = $cy = (int) $size/2;
   $strokeFill = "stroke=\"$color\" stroke-width=\"1\" fill=\"$color\"";
   $r = "";
   $r .= "<svg width=\"$size\" height=\"$size\">";
   $r .= "<circle id=\"$id\" cx=\"$cx\" cy=\"$cy\" r=\"$size2\"  $strokeFill/>";
   $r .= "</svg>";
   return $r;
}


$imagesToUse = LF_env( 'WEBDESK_images');

$wifiIcon = val( $imagesToUse, 'Wifi');
$network = "<img src=\"/$wifiIcon\" width=\"30\" height=\"30\" />";
$network .= L_LED( "STATUS_network", 30, "lightgreen");
$dbIcon = val( $imagesToUse, 'DB');
$database = "<img src=\"/$dbIcon\" width=\"30\" height=\"30\">";
$database .= L_LED( "STATUS_db", 30, "lightgreen");


$LF->out( "<span class=\"footerItem\">@(ou)rsmartdoc</span>");
$LF->out( "<span class=\"footerItem\"><a href=\"javascript:\" onclick=\"window.open('/webdesk/UniversalDocElement--21-38-21-1124-21--{OIDPARAM}/show/', 'rgpd')\">RGPD - Privacy</a></span>");
$LF->out( "</span>");
$LF->out( "<span style=\"vertical-align:middle;display:inline-block;margin-left:20px;float:right\">$database</span>");
$LF->out( "<span style=\"vertical-align:middle;display:inline-block;float:right;\">$network</span>");

$LF->onload( "setTimeout( function() {document.getElementById( 'footer').style.display = 'block';}, 2000);");


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'body/main/footer');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// Home on data from ;
$data = $DATA = $data_all["_NODATA"];
$OUTPUT=array();
$LF->currentBlock = '';
ob_start();
LF_env("request_siblings","@3body@3main:@3body@3main _images:_images @3body@3tips:@3body@3tips _STYLES:_STYLES _NODATA:_NODATA _NODATA:_NODATA @3body@3main@3content@3leftColumn:@3body@3main@3content@3leftColumn @3head:@3head @3body@3terms:@3body@3terms ");
LF_env("request_children","");

// DisplayPage( template, data);
$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// Local functions on data from ;
$data = $DATA = $data_all["_NODATA"];
$OUTPUT=array();
$LF->currentBlock = '';
ob_start();
LF_env("request_siblings","@3body@3main:@3body@3main _images:_images @3body@3tips:@3body@3tips _STYLES:_STYLES _NODATA:_NODATA _NODATA:_NODATA @3body@3main@3content@3leftColumn:@3body@3main@3content@3leftColumn @3head:@3head @3body@3terms:@3body@3terms ");
LF_env("request_children","");

// OBSOLETE
function L_computeTargetLevel( $requestedOid)
{
  $oidRoot = LF_stringToOid( $requestedOid);
  array_pop( $oidRoot); 
  $targetLevel = (int) ((LF_count( $oidRoot)+2)/2);
  $oidRoot = LF_oidToString(  $oidRoot);
  $oidData = LF_mergeOid( $oidRoot, "UniversalDocumentElement--21");
  LF_env( 'oidData', $oidData);
  return $targetLevel;
} // L_computeTargetLevel()

function L_filterRawData( $data, $targetLevel)
{
  // Decide type of display (Dir or Doc) and which records to use
  $dir = true; 
  $keep = false;
  $data2 = [$data[0]];
  $style = "";
  $savd = null;
  // Loop through records
  for ($i=1; $i< LF_count($data); $i++)
  { 
    $level = (int) (LF_count( LF_stringToOid( $data[$i]['oid']))/2);
    
    if ( $level < $targetLevel  && $data[$i]['nstyle'] <> "" ) $style = $data[$i]['nstyle'];

    if ( $level < $targetLevel)
    {
      $savd = $data[$i];
      continue; // ignore parents
    }   
    elseif ( $dir && $level == $targetLevel && (int) $data[$i]['stype'] >= 3)
    {
      // We have a document element at right level
      $dir = false; // detect content in direct children
      $data2[] = $savd; // include previous record as this is the top element of the document with model
    }   
    if ( $dir && $level == $targetLevel) $data2[] = $data[$i]; // keep for directory 
    elseif ( !$dir && $level >= $targetLevel) $data2[] = $data[$i]; // keep for file
  }
  $data2[0]['_dir'] = $dir;
  $data2[0]['_style'] = $style;
  return $data2;
} // L_filterRawData()



 
$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// leftTools on data from ;
$data = $DATA = $data_all["body/main/content/leftColumn"];
$OUTPUT=array();
$LF->currentBlock = 'body/main/content/leftColumn';
ob_start();
LF_env("request_siblings","@3body@3main:@3body@3main _images:_images @3body@3tips:@3body@3tips _STYLES:_STYLES _NODATA:_NODATA _NODATA:_NODATA @3body@3main@3content@3leftColumn:@3body@3main@3content@3leftColumn @3head:@3head @3body@3terms:@3body@3terms ");
LF_env("request_children","");

$thisZone = "leftColumn";
$styler = LinksAPI::startTerm."Styler".LinksAPI::endTerm;
$highlighter = LinksAPI::startTerm."Highlighter".LinksAPI::endTerm;
$out=<<<EOT
<a href="javascript:" onclick="LFJ_ajaxZone( '/webdesk//AJAX_styleTool/', '$thisZone');">$styler</a><br />
<a href="javascript:" onclick="LFJ_ajaxZone( '/webdesk//AJAX_highlightTool/', '$thisZone');">$highlighter</a><br />
EOT;
//$LF->out( $out);
$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'body/main/content/leftColumn');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// meta on data from ;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = 'head';
ob_start();
LF_env("request_siblings","@3body@3main:@3body@3main _images:_images @3body@3tips:@3body@3tips _STYLES:_STYLES _NODATA:_NODATA _NODATA:_NODATA @3body@3main@3content@3leftColumn:@3body@3main@3content@3leftColumn @3head:@3head @3body@3terms:@3body@3terms ");
LF_env("request_children","");


$LF->out("<meta http-equiv=\"Content-Type\" content=\"text/html;charset=utf-8\" />\n");
$LF->out("<meta name=\"viewport\" content=\"width=device-width, minimum-scale=1, initial-scale=1\" />\n");

 
$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'head');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// CVSandXMLparser;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = 'head';
ob_start();
global $_SCRIPTFILE;
$_SCRIPTFILE="upload/VNxNTnvne_xmlparser.php";
include_once("upload/VNxNTnvne_xmlparser.php");


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'head');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// DICO;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = 'head';
ob_start();
global $_SCRIPTFILE;
$_SCRIPTFILE="upload/bUmvxU1vC_dico.php";
include_once("upload/bUmvxU1vC_dico.php");


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'head');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// terms on data from ;
$data = $DATA = $data_all["body/terms"];
$OUTPUT=array();
$LF->currentBlock = 'body/terms';
ob_start();
LF_env("request_siblings","@3body@3main:@3body@3main _images:_images @3body@3tips:@3body@3tips _STYLES:_STYLES _NODATA:_NODATA _NODATA:_NODATA @3body@3main@3content@3leftColumn:@3body@3main@3content@3leftColumn @3head:@3head @3body@3terms:@3body@3terms ");
LF_env("request_children","");


DICO_setTerms(["UniversalDocElement"]);
LF_debug( LF_env('K_Terms_General_FR')['Your directory listing will be dispayed shortly'], "rSmartdoc terms", 7);
$LF->onload("\n    k_terms_close='".LINKSAPI::startTerm."close".LINKSAPI::endTerm."';");
LF_debug(LF_env("K_Terms_UniversalDocElement_EN"), "rSmartDoc terms", 8);

$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'body/terms');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// home_default on data from * tlabel;
$data = $DATA = $data_all["body/main/content/middleColumn/scroll/document"];
$OUTPUT=array();
$LF->currentBlock = 'body/main/content/middleColumn/scroll/document';
ob_start();
LF_env("request_siblings","_NODATA:_NODATA _NODATA:_NODATA @3body@3main@3content@3middleColumn@3scroll@3document:@3body@3main@3content@3middleColumn@3scroll@3document ");
LF_env("request_children","");

//global $INPUT_RESULT; var_dump( $INPUT_RESULT); // Debug POST operations
// $LF->onload( "$('#bannerMessage').html( 'Directory listing');");
$msg = "";
LF_debug( "Welcome page anonymous:".LF_env( 'is_Anonymous'), "webdesk", 9);
if (LF_env( 'is_Anonymous'))
{
  // User not identified so display Welcome page
  $model = "A000000100000000M_Welcome";
  $models = ["A000000100000000M_Welcome"];
  if ( val( $_POST, 'tusername'))
  {
  	// Login failed display login part and adapt banner message
  	$LF->onload( 
 "setTimeout( function(){ window.ud.api.showOneOfClass( 'B050000000000000M_login', 1); window.ud.api.pageBanner('temp','<span class=\"error\">Invalid username or password</span>');}, 500);\n"
        );
  }
}
else
{
  // User identified so display home directory
  LF_env('oidData', "UniversalDocElement--21"); // --UD|1");
  $model = 'Basic model for home directories';
  $models = ['Basic model for home directories'];  /*"DirListing", */
  $userParamsData = LF_fetchNode( "SetOfValues");
  $userParams = JSON_decode( $userParamsData[1]['tvalues']);
  if ( LF_env( 'is_emptyPassword') && !( LF_env( 'useLink') == "Yes") && !($userParams->askForPassword == "no"))
  {
      $lang = LF_env( 'lang');
      // 2DO use a View in Welcome doc with a cmd insertNewPasswordForm and display this view
      // Prepare message      
      if ( $lang == "EN" || !$lang)
            $msg = "You are connected with a temporary link. Your user name is <span style=\"font-weight:bold;\">".LF_env('user')."</span>. Please complete your setup by entering and confirming a password.";
      elseif ( $lang == "FR")
          $msg = "Vous êtes connectés avec un lien temporaire. Votre nom utilisateur est <span style=\"font-weight:bold;\">".LF_env('user')."</span>. Merci de compléter la configuration de votre compte en précisant et en confirmant un mot de passe.";
      // Prepare icons
      $icons = LF_env( 'WEBDESK_images');
      $idIcon = "/".val( $icons, 'Id');
      $lockIcon = "/".val( $icons, 'Lock');
      $signinText = LinksAPI::startTerm."Login".LinksAPI::endTerm;
      $stayConnected = LinksAPI::startTerm."Stay connected".LinksAPI::endTerm;
      // Prepare OID of user 
      $userId = LF_env( 'user_id');
      $userOid = "LINKS_user--2-".$userId; // 2DO always ?
      // Prepare set password formula
      // use udcommands.php login("SET_PASSWORd_ON_NEW_ACCOUNT" or just copy
      $link = $_SERVER['REQUEST_URI']."/useLink|Yes/";
      $form =<<<EOT
<form class="signin" action="$link" id="setpasswordform" method="post">
<input type="hidden" name="form" value="INPUT_setpassword" />
<input type="hidden" name="input_oid" value="$userOid" />
<input type="hidden" name="action" value="default" />
<input type="hidden" name="tpasswd" id="passwd" value="" size =20 tabindex="2"/>
<img style="vertical-align:middle;" title="$enterPasswordText" src="$lockIcon" alt="$enterPasswordText" />
<input type="password" name="NEW_tpasswd" value="" size =20 tabindex="2"/>
<br />
<img style="vertical-align:middle;" title="$enterPasswordText" src="$lockIcon" alt="$enterPasswordText" />
<input type="password" name="NEW_CONFIRM_tpasswd" value="" size =20 tabindex="2"/>
<input type="checkbox" name="brememberMe" value="Yes">$stayConnected
<div style="display:none;"><input type="submit" value="ok" /></div>
<div onclick="$('#setpasswordform').submit();" class="WideButton">$signinText</div>
</form>
EOT;
      $msg .= $form;
      if ( $lang == "EN" || !$lang) // 2DO startTerm
        $msg .= "<a href=\"".$_SERVER['REQUEST_URI']."//useLink|Yes/\">I'll set my password later</a>";
      else if ($lang == "FR")
        $msg .= "<a href=\"".$_SERVER['REQUEST_URI']."//useLink|Yes/\">Je renseignerai mon mot de passe plus tard</a>";
      // Write INPUT_setpassword
      $scr = <<<EOT
         \$INPUT_DATA[0] = ["tpasswd", "NEW_tpasswd", "NEW_CONFIRM_tpasswd"];
         return true;
EOT;
      LF_registerInputScript("setpassword", $scr);
      // 2DO account page
      $LF->out( $msg);
      // Add some styles
      $style ="<style type=\"text/css\">";
      $style .= "form.signin{\nwidth:220px;\nmargin-right:auto;margin-left:auto\n\n}\n";
      $style .= "div.WideButton{width:200px;\nheight:25px;font-size:1.2em;text-align:center;\nvertical-align:middle;\n";
      $style .= "background-color:#559922;\ncolor:white;\nmargin:0 auto;\nborder-radius:15px;\ncursor:pointer;\n}\n";
      $style .= "h1,p{ margin-left:20px; margin-right:20px;}";
      $style .= "h1{text-align:center;}";
      $style .= "p{text-align:justify;}";
      $style .= "</style>";
      $LF->out( $style, 'head');
   } 
   
  // 2D0 get parameters and go to/open last displayed  
}

if ( !$msg)
{
    LF_debug( "Loading Welcome page $model", "webdesk", 9);
    $banner = "Home";
    if ( LF_env( 'lang') == "FR") $banner = "Accueil";
    $LF->onload( "new UDapiRequest( { ref:'Home', command:'pageBanner( /set/, /$banner/);', quotes:'//'});");  
  $ud = new UniversalDoc( ['mode'=>"model", 'displayPart'=>"default"]);
  $ud->loadModel( $model);
  $ud->initialiseClient(); 
}

$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'body/main/content/middleColumn/scroll/document');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// SIGNALS;
$data = $DATA = $data_all["head"];
$OUTPUT=array();
$LF->currentBlock = 'head';
ob_start();
global $_SCRIPTFILE;
$_SCRIPTFILE="upload/VNjn6njNe_signals_usp.php";
include_once("upload/VNjn6njNe_signals_usp.php");


$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'head');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
// www@6rfolks@6com_all_all_all_footer on data from ;
$data = $DATA = $data_all["body/main/p9"];
$OUTPUT=array();
$LF->currentBlock = 'body/main/p9';
ob_start();
LF_env("request_siblings","");
LF_env("request_children","");

$OUTPUT['head'] .= "<link rel=\"icon\"  type=\"image/x-icon\" href=\"/favicon.ico\" />";
$OUTPUT['head'] .= "<link rel=\"shortcut_icon\"  type=\"image/x-icon\" href=\"/favicon.ico\" />";
//$LF->out('<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />', "head");
// Module to create

// SIGNAL_Tickets
/*
 *  Using LINKS_signal nodes to report bugs and incidents
 *    Life cycle of a ticket
 */

define ('reportbuggroup', 9999);
define ('SIGNAL_tickets', 0x90000);
define ('SIGNAL_ticketOpened', SIGNAL_tickets+1);
define ('SIGNAL_ticketAcknowledge', SIGNAL_tickets+2);
define ('SIGNAL_ticketAnalyse', SIGNAL_tickets+3);
define ('SIGNAL_ticketTroubleShooting', SIGNAL_tickets+4);
define ('SIGNAL_ticketReleasing', SIGNAL_tickets+5);
define ('SIGNAL_ticketClosed', SIGNAL_tickets+6);

$appli = LF_env('request_namespace');
if ( 
  $appli != "localhost_ietbut"
  //&&
)
{
  

if (!function_exists('BUGREPORT_getForm')) {
function BUGREPORT_getForm() {
 /*
   $ldata = array (
     array( "id", "oid", "ddate", "npage", "naction", "iuser", sreply"),
     array( 0, 'oid' => "LINKS_signal-New--XX-0")
   ); 
  $bugreport = HTML_form($ldata, 1, "Report bug");
 */

  // Find webmaster who will receive messages
  $webmaster = LF_env("webmaster");
  if (!$webmaster) {
    // look for webmaster
  }
  if (!$webmaster) $webmaster = 2; // default

  $r = "";
  $msg = LF_env('user'). " reports a bug at ".LF_env('url');
  $r .= "<form method=\"post\" action=\"#\">\n
  <input type=\"hidden\" name=\"form\" value =\"BUGREPORT_form\" />\n
  <input type=\"hidden\" name=\"nname\" value =\"".LF_env('user')."BugReport\" />\n
  <input type=\"hidden\" name=\"stype\" value =\"".SIGNAL_inviteToOwn."\" />\n
  <input type=\"hidden\" name=\"tparams\" value =\"\" />\n
  <text"."area rows=\"5\" cols=\"40\" type=\"\" name=\"tmsg\">$msg</text"."area><br />\n
  <input type=\"hidden\" name=\"user\" value =\"".$webmaster /*LF_env('public_user')*/."\" />\n
  <input type=\"submit\" value=\"Report\" />\n
  </form>\n";
  $r .= "<u><a onclick=\"document.getElementById('bugreporter').style.display='none';\">Forgetit</a></u>\n";

  global $signals_usp;
  // Create input script
  $input_script = "
    include_once(\"$signals_usp\");
    SIGNALS_processAction();
    return true;
";
//echo $input_script;
  $_SESSION['BUGREPORT_form'] = $input_script;
  return $r;
}
} 
//$OUTPUT['head/style'] = "#bugreporter { display:none;}";
// style=\"display:none;\"

$bug = <<< EOT
<script langage="JavaScript" type="text/javascript">
// Global variables
var group_index = 0;
var block_indexes = new Array();
var blocks = new Array();           // block names

/* --------------------------------------------------------------------------------
 *   RegisterBlock( group, block)
 *     register a block for event manager
 */ 
function RegisterBlock( group, block) {
  var grp;
  if ( group < 10) { 
    // Create new group(s)
    while (group_index <= group) {
      grp = new Array();
      block_indexes[ group_index] = 0;
      blocks[ group_index++] = grp;
    }  
    grp = blocks[ group];
    grp[ block_indexes[ group]] = block;
    block_indexes[group]++;
    blocks[ group] = grp;    
  }
  return true;
} // RegisterBlock()

/* --------------------------------------------------------------------------------
 *   ShowBlock( group, name)
 *     make  a block visible and all others of the same group invisible
 */ 
function ShowBlock( group, name) {
  var o;
  var grp;
  grp = blocks[ group];
  for (var i in grp) {
    o = document.getElementById( grp[i]);
    if ( grp[i] == name) {
      // Make visible
      o.style.display='block'; 
      o.style.visibility = 'visible';
    } else {
      // Make invisible
      o.style.display = 'none'; 
      o.style.visibility = 'hidden';   
    }
  }
} // ShowBlock()
    // Reguster 3 blocks
    RegisterBlock( 9, 'corelog');
    RegisterBlock( 9, 'bugreporter');
    RegisterBlock( 9, 'values');
 </script> 
EOT;
$copyright = LF_env('Copyright');
if ($copyright && $copyright != "NONE")
  $bug .= "<span style=\"font-size:12;\">".$copyright."</span>";
/*
else
   $bug .= "<span style=\"font-size:12;\">(C) www.cornwell.fr 2013 </span>";
*/
$bug .= "<div style=\"display:inline;width:100px;font-size:10;color:#888888;\"><u><a onclick=\"ShowBlock( 9, 'corelog');\">Core log</a></u> </div>";
$bug .= "<div style=\"display:inline;width:100px;font-size:10;color:#888888;\"><u><a onclick=\"ShowBlock( 9, 'bugreporter');\">Report bugs</a></u> </div>";
$bug .= "<div style=\"display:inline;width:100px;font-size:10;color:#888888;\"> <u><a onclick=\"ShowBlock( 9, 'values');\">Values</a></u></div>";
$bug .= "<div id=\"corelog\" style=\"display:none;font-family:monospace;\">{"."LINKS_log"."}</div>";
$bug .= "<div id=\"bugreporter\" style=\"display:none;\">";
$bug .= BUGREPORT_getForm();
$bug .= "</div>";
/* WRITE IN YOUR VALUES
$bug .="<div id=\"values\" style=\"display:none;\"><br />Satisfy and Delight
Get applause or boos
<br />1. Focus on peopleï¿½their lives, their work, their dreams.
2. Every millisecond counts.
3. Simplicity is powerful.
4. Engage beginners and attract experts.
5. Dare to innovate.
6. Design for the world.
7. Plan for today's and tomorrow's business.
8. Delight the eye without distracting the mind.
9. Be worthy of people's trust.
10. Add a human touch.
</div>";
*/
$footer = '<span style="font-size:8pt; color:#aaaaaa;">powered by <a href="http://www.cornwell.fr/soilinks/" target="soilinks" style="text-decoration:none; color:#aaaaaa;">soilinks</a> <a href="javascript::" onclick="'."document.getElementById('debug').style.display = 'block';".'"  style="text-decoration:none; color:#aaaaaa;">.</a></span><div id="debug" style="display:none;">'.$bug.'</div>';

global $NO_FOOTER;
  if (!$NO_FOOTER && (LF_env("cache") %10) < 9) 
  {
    LF_echo($footer);
  }
}

$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, 'body/main/p9');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
?>
