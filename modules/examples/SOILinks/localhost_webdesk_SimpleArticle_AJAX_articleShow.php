<?php
$NOTEST = true;
global $LF;
$requests_string = '{"0":"361","id":"361","1":"SimpleArticle_AJAX_articleShow","nname":"SimpleArticle_AJAX_articleShow","2":"__XML","ndatalabel":"__XML","3":"","nscope":"","4":"SimpleArticle","ttable":"SimpleArticle","5":"id nname ttext gimage nname.access.UniversalDocElement","tfields":"id nname ttext gimage nname.access.UniversalDocElement","6":"","tselect":"","7":"","tcode":"","8":"owns","tlabel":"owns","9":1,"bread":1,"10":1,"bdelete":1,"oid":"LINKS_request-localhost_webdesk-LINKS_request-simplearticle_ajax_articleshow--3-332-3-361--AL|5"}';
$request = JSON_decode( $requests_string, true);
 if ( !$request) { echo 'help!'.substr( $requests_string, 0, 1000); die();}
$data_all[ L_getLabel( $request)] = get_requested_data( $links, $oid_str, $request);
$links->close();
unset( $links); $links = null;
// SimpleArticle_AJAX_articleShow on data from SimpleArticle;
$data = $DATA = $data_all["__XML"];
$OUTPUT=array();
$LF->currentBlock = '__XML';
ob_start();
LF_env("request_siblings","");
LF_env("request_children","");

$defaultTemplateImage = LF_env( 'WEBDESK_images')['defaultTemplateImage'];
global $INPUT_RESULT;
// $LF->out( "Input: ".$INPUT_RESULT);
for ($i=1;$i<LF_count($data);$i++)
{
  $article = $data[$i];
  $name = LF_preDisplay( 'n', val( $article, 'nname'));
  $text = HTML_stripTags( LF_preDisplay( 't', val( $article, 'ttext')));
  $r = "<div id=\"\" class=\"model-thumb\">";
  $r .= "<h2>{$name}</h2>";
  if ( val( $article, 'gimage')) $r .= "<img src=\"/{$article['gimage']}\"/>";
  else $r .= "{$defaultTemplateImage}";
  $r .= "<p>{$text}</p>";
  $model = $article['nname.access.UniversalDocElement'];
  //if ( strpos( $model, "}]")) $model = substr( $model, strpos( $model, "}]")+2);
  $r .= "<a href=\"javascript:\" onclick=\"new UDapiRequest( { ref:'SimpleArticle', command:'setModel(#$model#);', quotes:'##'});\">";
  //$r .= LINKSAPI::startTerm."Use".LINKSAPI::endTerm." ".$name;
  $r .= "{!Use!} {$name}";
  $r .= "</a>";
  $r.= "</div>";
  $data[$i]['thtml'] = $r;
}
$LF->out( JSON_encode( $data));
$d = ob_get_clean();
if ( trim( $d) != '') $LF->out($d, '__XML');
foreach ($OUTPUT AS $key=>$content) $LF->out( $content, $key);
if (val( $OUTPUT, 'STOP')) return true;$OUTPUT=array();
?>
