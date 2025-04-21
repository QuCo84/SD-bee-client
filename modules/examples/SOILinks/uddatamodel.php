<?php
 /**
  * Provide a DataModel class for SOILink platform that UniversalDoc will use to exchange data with the server.
  */
 class DataModel
 {
    public  $size = 5;
    public  $isMobile;
    public  $browser;
    public  $browserVersion;    
    
    // private $index = 0; handled by $dataset
    // private $head = ""; handled by $LF->out
    // private $style = ""; handled by $LF->out
    // private $script = ""; handled by $LF->onload
    // private $document = ""; handled by $LF->out
    // private $onload = ""; handled by $LF->onload
    // private $data = []; handled by $dataset
    private $children = [];
    
    private $LF;     // Links API
    private $dataset;
    private $UDelementClassId = 21;
    
    function __construct()
    {
        // 2DO set some styles
        global $LF;
        $this->LF = $LF;
        $this->isMobile = $LF->isMobile;
        $this->browser = $LF->browser;
        $this->browserVersion = $LF->browserVersion;
    } // DataModel()
    
  /**
    * Fetch a new data set.
    */
    function fetchData( $oid)
    {
        $data = LF_fetchNode( $oid_d, "* tlabel");
        // Determine level of top element
        $targetLevel = self::computeTargetLevel( $oid);
        // Decide type of display (Dir or Doc) and which records to use
        $keepChildren = false;
        // Build new data array by looping through records
        $data2 = [$data[0]];        
        for ($i=1; $i< count($data); $i++)
        { 
            $level = (int) (LF_count( LF_stringToOid( $data[$i]['oid']))/2);
            $access = (int) LF_stringToOidParams( $data[$i]['oid'])[0]['AL'];
            if ( $level < $targetLevel || $data[$i]['tlabel'] == "Select") continue; 
            elseif ( !$keepChildren && $level == $targetLevel && (int) $data[$i]['stype'] >= UD_part)
            {
                $keepChildren = true; 
                $data2[] = $data[ $i-1]; // include previous record as this is the top element of the document
            }   
            // Keep records at target level
            if ( $level == $targetLevel) $data2[] = $data[$i];
            // Keep records under target level if not directory
            elseif ( $keepChildren && $level > $targetLevel) $data2[] = $data[$i];
        } // end of record loop
        $dataset = new Dataset();
        $dataset->load( $data2 );
        // Re-order data
        //   from children abc / grand-children abc / grand-grand-children abc 
        //   to children a grand-children a grand-grand-children a / children b grand-children b grand-grand-children b         
        $dataset->sort( 'nname'); 
        $this->dataset = $dataset;        
        return $dataset;
    } // DataModel->fetchRawData()
    
  /**
    * Rewind dataset's index to top
    */
    function top() { $this->dataset->top(); }    
    
   /**
    * Get next record in current dataset
    * @ return array with named elements id, oid, nname, stype, nstyle, tcontent, textra, nlang, dmodified, dcreated
    */
    function next() { $this->dataset->next();}

   /**
    * Return if end of data
    * @ return boolean true if no more data
    */
    function eof() { $this->dataset->eof();}

   /**
    * Output HTML
    *   @param string $html HTML code to output
    *   @param string $block head, style, script, document         
    */
    function out( $html, $block="") { $this->LF->out( $html, $block);} 

   /**
    * Onload JS
    *   @param string $js JS code to include in a windows.onload block
    */
    function onload( $js) { $this->LF->onload( $js);}
    
   /**
    * Flush output indicates that UD has finished output
    */
    function flush() {}
    
   /**
    * Get hidden fields to include in Input form
    *  @param string formName : UDE_fetch (updating and fetching an element), ... to be completed
    *  @retun array of named elements field name => value
    */    
    function getHiddenFieldsForInput()
    {
        return [ ];
    } // DataModel->getHiddenFieldsForInput()
 
   /**
    * Read or store a Session variable 
    */
    function env( $key, $value = null) { LF_env( $key, $value);}
    
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
        $res = "";
        // Get language
        $lang = LF_env('lang');
        if ( !$lang) $lang = "EN";
        
        // Accept array with alternative names
        if ( !is_array( $modelNames)) $modelNames = [ $modelNames];
        
        // Look for local mode if not anonymous
        if ( !LF_env( 'is_Anonymous'))
        {
            // Look locally for each name
            for ( $i=0; $i<LF_count( $modelNames); $i++)
            {
                // Name of model to look for
                $modelName = $modelNames[$i];
                // Look in locally
                $modelOid = "UniversalDocElement--21-0-21--UD|1-stype|EQ3|nname|*{$modelName}";
                $modelData = LF_fetchNode( $modelOid, "id nname");
                LF_debug( "Local model candidates ".LF_count( $modelData)." with $modelName", "UD_utilities", 5);            
                //$modelOid = new DynamicOID( "#DCNN", 1, "UniversalDocElement", "*LocalModels", "*{$modelName}");
                $dataset = new Dataset(); // $modelOid);
                $dataset->load( $modelData);
                // If elements in data then model has been found 
                // $found = $dataset->size;
                if ( $dataset->size)
                {
                    // Model name will be an Atag with name after _ 
                    if ( strpos( $modelName, "_") === false) $modelSearch = "_".$modelName;
                    else $modelSearch = $modelName;
                    $modelName = $modelsDir = "";
                    // Loop through found elements to find searched model 
                    while ( !$dataset->eof())
                    {
                        $w = $dataset->next();
                        $name = val( $w, 'nname');
                        // Grab full name of "LocalModels" directory
                        if ( stripos( $name, "_LocalModel")) $modelsDir = $name;
                        // Test for searched model
                        if ( stripos( ' '.$name, $modelSearch) !== false)
                        {
                            $modelName = $name;
                            if ( !$modelsDir)
                            {
                                // If localModels directory not yet determined, grab from OID
                                // Assume 1 level of directory
                                $oid = explode( '--', val( $w, 'oid'));
                                $oidNames = explode( '-', $oid[0]);
                                $modelsDir = $oidNames[ 1];
                            }                   
                        }  
                        // If both LocalModels directory and model found then quit loop
                        if ( $modelName && $modelsDir) break;
                    } // end of found elements loop  
                    // Define exact OID to model
                    if ( $modelName && $modelsDir)
                    {
                        // Local model found
                        $found = true;
                        $modelOid = new StaticOID( "#DCNND", 1, "UniversalDocElement", $modelsDir, $modelName, 3);
                        LF_debug( "Found local model $modelsDir $modelName", "UD_utilities", 5); 
                        break;                        
                    }     
                } 
            } // end of local search loop
        }
        // Default search if not multiple choices = Models dir by language and exact model name
        if ( !$found)
        {
           // Look for last model in Marketplace with exact name
           $modelName = $modelNames[ LF_count( $modelNames) -1 ];
           $modelOid = new StaticOID( "#DCNND", 1, "UniversalDocElement", self::$modelDirectory[$lang], $modelName, 3);      
        }
        // Return name and oid
        return [ 'name' => $modelName, 'oid' => $modelOid];

    } // DataModel->getModelOID()

   /**
    * Create an element directly in DB
    */
    function createElementInDB( $targetOID, $nodeData) { return LF_createNode( $targetOID, $this->UDelementClassId, $nodeData);}

        
 
 } // PHP class DataModel
 

 ?>