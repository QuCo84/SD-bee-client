<?php

function LF_fileServer() {
    $uri = $_SERVER[ 'REQUEST_URI'];
    if ( substr( $uri, 0 ,2) == "/?") return false;
    $uriParts = explode( '/', $uri);
    array_shift( $uriParts);
    $topDir = $uriParts[0];
    if ( !in_array( $topDir, ["editor-view-model", "editor-view", "upload", "tmp", "download", "fonts", "favicon.ico"])) return false;
    $filename = $uriParts[ count( $uriParts) - 1];
    $fileParts = explode( '.', $filename);
    $ext = $fileParts[ count( $fileParts) - 1];    
    if ( count( $fileParts) < 2) return false;    
    if ( $ext != 'js' || !in_array( $filename, [ 'requireconfig.js', 'udajax.js'])) {
        // Get from SD bee
        //header( 'Location: https://www.sd-bee.com/'.$uri);
        //return true;
        $path = 'https://www.sd-bee.com/'.implode( '/', $uriParts); // LF_env( 'UD_rootPath')
    } else {
        // Available locally
        array_shift( $uriParts); // upload
        array_shift( $uriParts); // smartdoc
        $path = implode( '/', $uriParts);
    }
    return LF_sendFile( $path, $ext);
}

function LF_sendFile( $path, $ext) { 
    // Filename processing
    if ( $ext == "js" && ($p1 = strpos( $path, "-v-"))) {
        // Remove version from JS files
        $p2 = strpos( $path, ".", $p1);
        $path = substr( $path, 0, $p1).substr( $path, $p2);
    } 
    if ( file_exists( $path)) {    
        // File read
        $fileContents = file_get_contents( $path);
        // Set header
        switch ($ext) {
            case "jpg"  :
            case "jpeg" : 
                header("Content-type: image/jpeg");
                break;
            case "png"  :
            case "gif"  :                
                header("Content-type: image/".$ext);
             break;
            case "gif"  :                
                header("Content-type: image/x-icon");
                break;
            case "wav" :
                header("Content-type: audio/x-wav");
                break;
            case "js" :
                header("Content-type: application/javascript");
                break;
            case "pdf" :
                header("Content-type: application/pdf; Content-Disposition:inline;");
                break;
            case "html" :
                header("Content-type: text/html");
                break;
            case "css" :
                header("Content-type: text/css");
                break;
            case "manifest" :
                header("Content-type: text/cache-manifest");
                break;
            case "mp4" :
            case "webm" :
                header("Content-type: video/{$ext}");	
                break;
            case "ogg" :
                header("Content-type: video/ogg");	
                break;
            case "xml" :
                header("Content-type: application/xml");	
                // echo "www".$path.' '.$requestedFile; die();
                break;
            case "ttf" :
                header("Content-type: application/x-font-ttf");	
                break;
            case "otf" :
                header("Content-type: application/x-font-opentype");	
                break;
            default:
            header("Content-type: application/octet-stream");
            header('Content-Disposition: attachment; filename="' .$requestedFile. '"');
            break;
        }        
        /*if (!$fileContents)  header("Content-Length: ". filesize($path.$oid_str));
        else*/ 
        header("Content-Length: ". strlen($fileContents));
        //header("Last-Modified: ".gmdate('D, d M Y H:i:s \G\M\T', time() + 3600));
        /*
        // ETag 2DO keep version no discarded above
        $w = explode("_", $oid_str);
        if ($cache && count($w))  header("Etag: ".$w[0]."1");
        elseif ( count($w))  header("Etag: ".$w[0]."0");
        */
        if ( true /* $cache==0 || $fileContents*/) {
            $life =  15552000; // 180*24*60*60 
            header("Vary: Accept-Encoding");
            header("Cache-Control: max-age={$life}, public");
            header("Pragma:");
            header("Expires: ".gmdate('D, d M Y H:i:s \G\M\T', time() + $life));
        } else {
            //session_cache_limiter("nocache");
            /* header("Cache-Control: no-cache, must-revalidate"); 
            header("Pragma: cache"); */
            $life = ($ext == "js") ? 2 : 60;
            header("Vary: Accept-Encoding");
            header("Cache-Control: max-age={$life}, public");
            header("Pragma:");
            header("Expires: ".gmdate('D, d M Y H:i:s \G\M\T', time() + $life));
        }

        // f. - send file contents
        // echo $path.$oid_str.' '.$ext;die();
        /*if (!$fileContents) {	
            // Get direct from file
            $file = fopen($path.$oid_str, "r");
            if ($file) 
            {
                while (!feof($file)) {
                    $c = fread($file, 10000);
                    echo $c;
                    flush();
                }
            }
        } else*/ { 
            // Use buffer
            echo $fileContents;
            flush();
        }          
        return true;
    }
    echo "var error = 'No file ".$path."';"; return true;
    return false;
}