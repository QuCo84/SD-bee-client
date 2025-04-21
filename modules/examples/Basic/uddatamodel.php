<?php
 /**
  * Provide a DataModel class that UniversalDoc will use to exchange data with the server.
  */
 class DataModel
 {
    public  $size = 5;
    private $index = 0;
    private $head = "";
    private $style = "";
    private $script = "";
    private $document = "";
    private $onload = "";
    private $data = /* Order important (nname) so we can call UD with noSort=true*/
    [
        [
            "id"=>1,
            "oid"=>"UniversalDocElement--21-1", // Doit devenir libre. Pour l'instant il faut suivre la logique de SOILinks, 
            // càd les OID fournit un chemin pour arriver à un élément 21-1 = l'élémént 1 de type UniversalDocElement, 
            // 21-1-21-2 sera l'élément 2 enfant de l'élémént 1.
            "nname" => "A01000000010012345", // All digits base 32, càd 0-9A-V B01 viewid, 0123456789 blockno 12345 userid
            "stype" => 2, // (a UD_document element) see udconstants.php
            "nstyle" => "NONE", // On documents and models (Axx) indicates a modl to load, on elements (Bxx...) incates CSS class to apply to element
            "tcontent" =>"Hello world Doc",
            "textra" => '{ "system":{ "defaultPart":"Doc"}}', // JSON coded parameters 
            "nlang" => "FR", // Element's language           
            "taccessRequests" => "", // JSON data qui mémorise qui veut accéder à l'élément et qui aura accès           
            "dcreated" => 0, // Creation date, this is not exactly timestamp more info later
            "dmodified" =>0, // Modified date, this is not exactly timestamp more info later            
        ],
        [
            "id"=>2,
            "oid"=>"UniversalDocElement--21-1-21-2",            
            "nname" => "B01000000000012345", // All digits base 32, càd 0-9A-V B01 viewid, 0123456789 blockno 12345 userid
            "stype" => 4, // (a UD_part = View element) see udconstants.php
            "nstyle" => "", // On documents and models (Axx) indicates a model to load, on elements (Bxx...) indicates CSS class to apply to element
            "tcontent" =>"Doc",
            "textra" => "", // JSON coded parameters 
            "nlang" => "FR", // Element's language            
            "taccessRequests" => "", // permet de mémoriser qui veut accéder à l'élément et qui aura accès             
            "dcreated" => 0, // Creation date, this is not exactly timestamp more info later
            "dmodified" =>0, // Modified date, this is not exactly timestamp more info later
        ],   
        [
            "id"=>3,
            "oid"=>"UniversalDocElement--21-1-21-2-21-3",            
            "nname" => "B01000000100012345", // All digits base 32, càd 0-9A-V B01 viewid, 0123456789 blockno 12345 userid
            "stype" => 10, // (a UD_paragraph) see udconstants.php
            "nstyle" => "", // On documents and models (Axx) indicates a modl to load, on elements (Bxx...) incates CSS class to apply to element
            "tcontent" =>"Hello world",
            "textra" => "", // JSON coded parameters 
            "nlang" => "FR", // Element's language 
            "taccessRequests" => "", // JSON data qui mémorise qui veut accéder à l'élément et qui aura accès            
            "dcreated" => 0, // Creation date, this is not exactly timestamp more info later
            "dmodified" =>0, // Modified date, this is not exactly timestamp more info later
        ], 
        [
            "id"=>4,
            "oid"=>"UniversalDocElement--21-1-21-4",            
            "nname" => "B02000000200012345", // All digits base 32, càd 0-9A-V B01 viewid, 0123456789 blockno 12345 userid
            "stype" => 4, // (a UD_part) see udconstants.php
            "nstyle" => "", // On documents and models (Axx) indicates a modl to load, on elements (Bxx...) incates CSS class to apply to element
            "tcontent" =>"Local styles",
            "textra" => "", // JSON coded parameters 
            "nlang" => "FR", // Element's language 
            "taccessRequests" => "", // JSON data qui mémorise qui veut accéder à l'élément et qui aura accès            
            "dcreated" => 0, // Creation date, this is not exactly timestamp more info later
            "dmodified" =>0, // Modified date, this is not exactly timestamp more info later
        ],    
        [
            "id"=>5,
            "oid"=>"UniversalDocElement--21-1-21-4-21-5",            
            "nname" => "B020000002000123456", // All digits base 32, càd 0-9A-V B01 viewid, 0123456789 blockno 12345 userid
            "stype" => 17, // (a UD_css) see udconstants.php
            "nstyle" => "", // On documents and models (Axx) indicates a modl to load, on elements (Bxx...) incates CSS class to apply to element
            "tcontent" =>"<span class=\"caption\">Style1</span><div id=\"style1_object\">CSS\n.hidden { display:none;}\n</div>",
            "textra" => "", // JSON coded parameters 
            "nlang" => "FR", // Element's language     
            "taccessRequests" => "", // JSON data qui mémorise qui veut accéder à l'élément et qui aura accès
            "dcreated" => 0, // Creation date, this is not exactly timestamp more info later
            "dmodified" =>0, // Modified date, this is not exactly timestamp more info later
        ],    
        
    ];
    private $children = [];
    
    function __construct()
    {
        // 2DO set some styles
    } // DataModel()
    
  /**
    * fetch a new data set
    */
    function fetchData( $oid, $columns, $new)
    {
        $newDm = new DataModel();
        $newDm->fetchData;
        return $newDm;
    } // DataModel->fetchData()
    
  /**
    * Rewind index to top of data set
    */
    function top()
    {
        $this->index = 0;
    } // DataModel->top()    
    
   /**
    * Get next record in current dataset
    * @ return array with named elements id, oid, nname, stype, nstyle, tcontent, textra, nlang, dmodified, dcreated
    */
    function next()
    {
        if ( $this->index >= $this->size) return [];
        $r = $this->data[ $this->index];
        $this->index++;
        return $r;
    } // DataModel->nextRecord()

   /**
    * Return if end of data
    * @ return boolean true if no more data
    */
    function eof()
    {
        if ( $this->index >= $this->size) return true;
        return false;    
    } // DataModel->eof()
    
   /**
    * Output HTML
    *   @param string $html HTML code to output
    *   @param string $block head, style, script, document         
    */
    function out( $html, $block="document")
    {
        switch ( $block)
        {
            case "head" : $this->head .= $html; break;
            case "head/style" : case "style" : $this->style .= $html; break;
            case "head/script" : case "script" : $this->script .= $html; break;
            case "document" : $this->document .= $html; break;
            case "body/main/UD_resources" : $this->document .= "<div id=\"UD_resources\" class=\"hidden\">{$html}</div>"; break;
        }
    } // DataModel->out()    

   /**
    * Onload JS
    *   @param string $js JS code to include in a windows.onload block
    */
    function onload( $js)
    {
        $this->onload .= $js;
    } // DataModel->out()    
    
   /**
    * Flush output indicates that UD has finished output
    */
    function flush()
    {
        // 2DO compile children
        // Generate output
        echo "<html>\n  <head>\n";
        echo "<script langage='JavaScript' type='text/javascript' src='/upload/smartdoc/ud-view-model/ud.js'></script>\n";        
        echo "<script langage='JavaScript' type='text/javascript' src='/upload/smartdoc/debug/debug.js'></script>\n";
        echo "<script langage='JavaScript' type='text/javascript' src='/upload/smartdoc/browser/dom.js'></script>\n";
        echo "<script langage='JavaScript' type='text/javascript' src='/upload/smartdoc/ude-view/udecalc.js'></script>\n";
        echo "<script langage='JavaScript' type='text/javascript' src='/upload/smartdoc/browser/udajax.js'></script>\n";
        echo "<script langage='JavaScript' type='text/javascript' src='/upload/smartdoc/ude-view/ude.js'></script>\n";
        echo $this->head;
        if ( $this->script) echo "<script language=\"javascript\">\n".$this->script."\n</script>\n";
        if ( $this->style) echo "<style>\n".$this->style."\n</style>\n";        
        echo "</head>\n  <body>\n      <div id=\"document\">";
        // 2DO Term substitution
        echo $this->document;
        echo "</div> <!-- end of document -->\n";
        $onload = "<script>\nwindow.onload = function() {\n";
        $onload .= $this->onload; // 2DO substitue {} > LFJ_openAcco LFJ_closeAcco
        $onload .= "}\n</script>\n";
        echo $onload; 
        echo "</body>\n</html>\n";   
    } // DataModel->flush()
    
   /**
    * Get hidden fields to include in Input form
    *  @param string formName : UDE_fetch (updating and fetching an element), ... to be completed
    *  @retun array of named elements field name => value
    */    
    function getHiddenFieldsForInput()
    {
        return [];
    } // DataModel->getHiddenFieldsForInput()
 
   /**
    * Read or store a Session variable 
    */
    function env( $key, $value = null)
    {
        if ( $value) $_SESSION[ $key] = $value;
        else return $_SESSION[ $key];
    } // DataModel->env()    
    
   /**
    * Get level of OID (ie Doc = 1st level, View/Part = 2nd level, etc)
    */
    function OIDlevel( $oid)
    {
        return (int) ( LF_count( LF_stringToOid( $oid))/2);
    } // DataModel->newOID()    

   /**
    * Get peremissions on a element
    */
    function permissions( $oid)
    {
        return 7;
    } // DataModel->newOID()    

 
   /**
    * Get the OID of a new element
    */
    function newOID( $parentOID)
    {
        return $parentOID."-0";
    } // DataModel->newOID()    

   /**
    * Get the OID of a model
    */
    function getModelOID( $model)
    {
        return "UniversalDocElement--21-200";
    } // DataModel->newOID()    
 
 } // PHP class DataModel
 
 // Fcts
 function LF_debug( $msg, $module, $level)
 {

 }
 
 // Horrible ! will be replaced by call to DataModel->permissions( oid)
 define( "OID_RDENABLE", 1);
 define( "OID_WRENABLE", 2);
 define( "OID_DLENABLE", 4);
 function  LF_stringToOidParams( $oid)
 {
     return [ ['AL'=>7]];
 }
 
 function LF_preDisplay( $field, $text)  // for ud, or udelement
 {
     return $text;
 }
 /*
 function LF_count( $arr) 
 {
     if ( is_array( $arr)) return count( $arr);
     return 0;
 }
 */
 
 function LF_stringToOid( $oid) // for udelement.php and utilities
 {
     $w = explode( '--', $oid);
     $r = explode( '-', $w[1]);
     return $r;
 }
  function LF_oidToString( $oid, $params="") // udutilities.php
 {
     $w = implode( '-', $oid);
     $r = "UniversalDocElement--".$w;
     if ( $params) $r .= "--{$params}";
     return $r;
 }
 
 function LF_env( $key, $value = null)
 {
     return "FR";
 }
 
 Class LinksAPI {

  const    startTerm = "{!";
  const    endTerm = "!}";
 }
 
 function LF_getToken()
 {
    return "12345";
 }
 
 function LF_mergeShortOid( $oid1, $oid2)
 {
     $w = LF_oidToString( LF_stringToOid( $oid1));
     return $w.'-21';
 }
 
 function LF_registerInputScript( $name, $script)
 {
     
 }
 
 
 include_once __DIR__."/../upload/L0e3t3g2m_html.php";
 include_once __DIR__."/../core/dev/LF_PHP_lib.php";
 
 ?>