<?php
/**
* udstatusprogress.php - service-side class for element to display the status & progress of a task
*/

class UD_statusProgress {

    private $json;

    function __construct( $jsonEl)
    {
        $this->name = $jsonEL->name;
        $this->json = $jsonEL->JSONcontent;
        $this->requireModules( [ 
            'modules/ux/udestatusprogress.js'
        ]);      
    }

    function renderAsHTMLandJS( $contentArray, $active=true) {
        $contentArray[ 'program'] .= "$$$.buildDefaultViewHeader('{$this->name}');";
        return;
    }
}