<?php
    $PATH = "PathToSave\\upload\\";
    
    function mergeFile($fp,$end,$path,$filemd5)
    {
        for($i=1 ; $i<=$end ; $i++)
        {
            $filename = $path.$i."$".$filemd5;
            $ftmp = fopen($filename,"rb");
            while(!feof($ftmp))
            {
                $data = fread($ftmp,4096);
                fwrite($fp,$data);
            }
            fclose($ftmp);
            unlink($filename);
        }
    }
    
    
    $headers = apache_request_headers();
    foreach ($headers as $header => $value) {
        if($header == "header_isSlice")
        {    
            $isSlice = filter_var($value, FILTER_VALIDATE_BOOLEAN);
        }
        elseif($header == "header_isResume")
        {
            $isResume = filter_var($value, FILTER_VALIDATE_BOOLEAN);
        }
        elseif($header == "current_chunk")
        {
            $msg_current_chunk = (int)$value;
        }
        elseif($header == "header_filename")
        {
            $msg_header_filename = $value;
        }
        elseif($header == "header_isEend")
        {
            $msg_header_end = filter_var($value, FILTER_VALIDATE_BOOLEAN);
        }
        elseif($header == "token")
        {
            $token_file = $value;
        }
        elseif($header == "desc")
        {
            $decs_file = $value;
        }
    }
    
    echo "header_isSlice->".$isSlice."\n";
    echo "header_isResume->".$isResume."\n";
    echo "current_chunk->".$msg_current_chunk."\n";
    echo "header_filename->".$msg_header_filename."\n";
    echo "header_isEend->".$msg_header_end."\n";

    $filemd5 = md5($msg_header_filename);
    
    if($isResume)
    {
        echo "續傳\n";
        /**續傳***/
        $filename=$PATH.$msg_current_chunk."$".$filemd5;  
        move_uploaded_file($_FILES['file']['tmp_name'],$filename);
    }
    else
    {
        if($isSlice)
        {
            echo "大檔切割\n";
            /***大檔切割***/
            //$filename=tempnam($PATH,$msg_current_chunk+"$"+$msg_header_filename+"$"+"_qzupload_");
            $filename=$PATH.$msg_current_chunk."$".$filemd5;
            echo "filename".$filename."\n";
            move_uploaded_file($_FILES['file']['tmp_name'],$filename);
            
        }
        else
        {
            echo "小檔直接傳\n";
            /***小檔直接傳***/
            move_uploaded_file($_FILES['file']['tmp_name'],$PATH.$_FILES['file']['name']);
        }
    }
    
    if($msg_header_end && isSlice)
	{   
        echo "合併檔案\n";
        /***合併檔案***/ 
        $fp = fopen($PATH.$msg_header_filename,"wb");
        mergeFile($fp,$msg_current_chunk,$PATH,$filemd5);
        fclose($fp);
    }
?>