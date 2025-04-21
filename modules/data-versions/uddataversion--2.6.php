<?php
/**
 * uddataversions--2-6.php -- align data from version -2.6 with current version
 * loaded ifa document or model indicates dataversion -2.6
 */

 
/**
 *  Look at an element's data and adjust of needed. 
 *  Must be called after UDutilities->analyseContent
 */ 
function UD_alignContent( &$elementData, $version="-2.7") {
    $content = val( $elementData, 'tcontent');
    /* Composte element is characterised by 
    *     1 span with class "caption" 
    *     1 div with a class somethingObject
    */
    $spans = HTML_getContentsByTag( $content, "span");
    $divs = HTML_getContentsByTag( $content, "div");
    if ( 
           ( LF_count( $spans) == 1 && strpos( $content, "caption"))
        && ( LF_count( $divs) == 1 && $divs[0][0] == '{')
    )
        convert2dot6CompositeToJSON( $elementData);    
} // UD_alignContent()

 /**
 *  Convert content with caption spans and JSON div to 100% JSON format 
 */ 
 function convert2dot6CompositeToJSON( &$elementData) {
    $json_dest = [ "meta"=>[], "data"=>[], "changes"=>[]]; 
    $content = val( $elementData, 'tcontent');
    $spans = HTML_getContentsByTag( $content, "span");
    $subSpans = HTML_getContentsByTag( $spans[0], "span");
    $divs = HTML_getContentsByTag( $content, "div");    
    // Decode JSON
    $json_src = JSON_decode( $divs[0], true);
    // Get type
    if ( val( $json_src, '_list')) { $json_dest['meta']['type'] = "list";}
    elseif ( val( $json_src, '_table')) { $json_dest['meta']['type'] = "table";}
    if ( !val( $json_dest, 'meta/type')) { return;}
    // Get name
    if ( LF_count( $subSpans)) $json_dest['meta']['name'] = $subSpans[0]; 
    else $json_dest['meta']['name'] = $spans[0]; 
    $json_dest['meta']['zone'] = $json_dest['meta']['name']."editZone"; 
    // Get caption
    $json_dest['meta']['caption'] = HTML_stripTags( $spans[0]); 
    $json_dest['meta']['captionPosition'] = "top";
    // Transfert data
    switch ( val( $json_dest, 'meta/type')) {
        case "list" : convert2dot6list( $json_src, $json_dest); break;
        case "table": convert2dot6table( $json_src, $json_dest); break;
        default : return;
    }
    // Set JSON content
    $elementData['_JSONcontent'] = $json_dest;
    $elementData['tcontent'] = JSON_encode( $json_dest);
 } // convert2dot6CompositeToJSON()

function convert2dot6list( $json_src, &$json_dest) {
    $json_dest['data'] = [ "tag"=>"ul", "value"=>[]];    
    if ( val( $json_src, '_list/_classList')) {
        $json_dest['meta']['class'] = val( $json_src, '_list/_classList'); 
        $json_dest['data']['class'] = val( $json_src, '_list/_classList'); 
    }
    foreach( $json_src as $key=>$item) {
        if ( $key[0] == "_") { continue;}
        $json_dest['data']['value'][ $key] = [ "tag"=>"li", "value"=>$item['value']];
        if ( isset( $item[ "_classList"])) { $json_dest['data']['value'][ $key]['class'] = $item[ "_classList"];}
        if ( isset( $item[ "ude_formula"])) { $json_dest['data']['value'][ $key]['formula'] = $item[ "ude_formula"];}
    }   
} 
function convert2dot6table( $json_src, &$json_dest) {
    $json_dest['data'] = [ "tag"=>"table", "value"=>[]];
        // Get class
    if ( val( $json_src, '_table/_classList')) {
        $json_dest['meta']['class'] = val( $json_src, '_table/_classList');
        $json_dest['data']['class'] = val( $json_src, '_table/_classList');
    }
    foreach( $json_src as $key=>$item) {
        if ( $key[0] == "_") { continue;}
        $part = [];
        $row_out = [];
        foreach( $item as $row) {
            foreach( $row as $cellKey=>$cell) {                
                if ( $cellKey[0] == '_') continue;
                $cell_out = [];                
                if ( val( $cell, 'tag')) { $cell_out['tag'] = val( $cell, 'tag');}
                else { $cell_out['tag'] = "td";}
                if ( isset( $cell[ "_classList"])) { $cell_out['class'] = $cell[ "_classList"];}
                elseif ( isset( $cell[ "_class"])) { $cell_out['class'] = $cell[ "_class"];}
                if ( isset( $cell[ "ude_formula"])) { $cell_out['formula'] = $cell[ "ude_formula"];}
                $cell_out[ 'value'] = val( $cell, 'value');
                $row_out[ $cellKey] = $cell_out;
            }
            if ( isset( $row[ "_class"])) { $part[] = [ "tag"=>"tr", "class"=>$row[ "_class"], "value"=>$row_out];}      
            else { $part[] = [ "tag"=>"tr", "value"=>$row_out];}
        }    
        $json_dest['data']['value'][ $key] = [ "tag"=>$key, "value"=>$part];         
    }   
}


function convertTextToJSON() {
    
}

// Auto-test
if ( isset( $argv) && strpos( $argv[0], "uddataversion--2.6.php") !== false) {
    // Launched with php.ini so run auto-test
    echo "Syntax OK\n";
    // Create test environment
    require_once( __DIR__."/../../testenv.php");
    LF_env( 'cache', 8);
    // Test composite list
    {
        $element = [
            'nname' => 'B01000000020A0000M',
            'stype' => 13,
            'tcontent' => '<span class="caption">My list<span class="objectName" ude_bind="List1_object">MyList1</span></span><div id="MyList1_object" class="listObject, hidden" ud_mime="text/json">{"0":{"value":"itedm 1"},"1":{"value":"item 2"},"_list":{"_id":"MyList1","_classList":"list","_ud_bind":null}}</div>',        
        ];        
        UD_alignContent( $element);
        if ( $element[ '_JSONcontent']['data']['value'][1]['value'] == "item 2")  { echo "Test composite list : OK\n";}
        else { echo "Test composite list : KO\n";}
    }
    {
        $element = [
            'nname' => 'B01000000050A0000M',
            'stype' => 12,
            'tcontent' => '<span class="caption">Table1</span><div id="Table1" class="tableObject" style="display:none;">{"_table":{"_id":"Table1edittable","_classList":"tableStyle1","_ud_bind":null},"thead":[{"row":{"value":"row","tag":"th"},"A":{"value":"A","tag":"th"},"B":{"value":"B","tag":"th"},"C":{"value":"C","tag":"th"}},{"_class":"rowModel","row":{"value":"","ude_formula":"row()"},"A":{"value":""},"B":{"value":""},"C":{"value":""}}],"tbody":[{"row":{"value":"1"},"A":{"value":"Labradors"},"B":{"value":"..."},"C":{"value":"100<br>"}},{"row":{"value":"2","ude_formula":"row()"},"A":{"value":"Retrievers"},"B":{"value":""},"C":{"value":"95"}},{"row":{"value":"3","ude_formula":"row()"},"A":{"value":"Setters"},"B":{"value":""},"C":{"value":"86"}},{"row":{"value":"4","ude_formula":"row()"},"A":{"value":"Pointers"},"B":{"value":""},"C":{"value":"72"}},{"row":{"value":"5","ude_formula":"row()"},"A":{"value":"Hounds"},"B":{"value":""},"C":{"value":"96"}},{"row":{"value":"<br>","ude_formula":"row()"},"A":{"value":""},"B":{"value":""},"C":{"value":""}}]}</div>    ',        
        ];        
        UD_alignContent( $element);
        if ( $element[ '_JSONcontent']['data']['value']['tbody']['value'][1]['value']['C']['value'] == "95")  {
            echo "Test composite table : OK\n";
        } else {
            echo "Test composite table : KO ".$element[ '_JSONcontent']['data']['value']['tbody']['value'][1]['C']['value']."\n";
        }
    }



    global $debugTxt;
    $check = crc32( $debugTxt);
    echo "Program's trace checksum:$check\n";
    echo "Test completed";
    exit(0);
} // Auto-test

?>