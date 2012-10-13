<?php
    $PATH = "PathToSave\\upload\\";
    $filemd5 = md5($_POST['filename']);
    $currentChunk = $_POST['currentChunk'];
    
    for($i=1 ; $i<=$currentChunk ; $i++)
    {
        $filename = $PATH.$i."$".$filemd5;
        unlink($filename);
    }
    
    $arr = array ('remove'=>"OK");
    echo json_encode($arr); 
?>