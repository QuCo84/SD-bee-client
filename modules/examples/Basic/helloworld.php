<?php
/**
 * basicsample.php
 * Basic sample of using the UniversalDoc editor directly in PHP with no underlying platform or MVC structue
 */
 
 /**
  * Includes
  */
  // UniversalDoc class (UD)
 include_once( __DIR__."/../upload/smartdoc/ud-view-model/ud.php");
  // DataModel class of which an instance will be used bu UD 
 include_once( __DIR__."/uddatamodel.php");

if ( count( $_POST))
{
    // Input processing
    /* $_POST contains
     *    your hidden fields returned by datamodel->getHiddenFieldsForInput()
     *    input_oid = OID of element to update or create
     *    one or more of the following values to be saved nname, stype, nstyle, tcntent, textra
     * do not update absent values
     */     
     /*
      * Reply with JSON-coded named array with
      *  if creation updateCall, oid, modifiableBy, newElement="1"
      *  if update nname, stype, nstyle, tcontent, textra, modifiableBy
      *  always you, result, users, newElements
      */      
} // end of input processing
elseif ( count ($_REQUEST))
{
    // AJAX GET request (Fetch an element)
    // 2DO
}
else
{
    /**
    * MAIN REQUEST (Non AJAX)
    *  Setup editor
    */
    $dm = new DataModel();
    $ud = new UniversalDoc( [ "mode"=>"edit", "displayPart" => "default"], $dm);
    $ud->loadData( "UniversalDocElement--21-1", $dm, true);
    $ud->initialiseClient();
    $dm->flush();
}
 
?> 