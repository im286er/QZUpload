(function($) {

    var MAX = 10000000;
    var progressMaxLength;    
    var lookupTable;
    
    /*
    *   MD5 code from http://www.webtoolkit.info/javascript-md5.html
    */
    
    var MD5 = function (string) {
 
        function RotateLeft(lValue, iShiftBits) {
            return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
        }
     
        function AddUnsigned(lX,lY) {
            var lX4,lY4,lX8,lY8,lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }
     
        function F(x,y,z) { return (x & y) | ((~x) & z); }
        function G(x,y,z) { return (x & z) | (y & (~z)); }
        function H(x,y,z) { return (x ^ y ^ z); }
        function I(x,y,z) { return (y ^ (x | (~z))); }
     
        function FF(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };
     
        function GG(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };
     
        function HH(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };
     
        function II(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };
     
        function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1=lMessageLength + 8;
            var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
            var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
            var lWordArray=Array(lNumberOfWords-1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while ( lByteCount < lMessageLength ) {
                lWordCount = (lByteCount-(lByteCount % 4))/4;
                lBytePosition = (lByteCount % 4)*8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
            lWordArray[lNumberOfWords-2] = lMessageLength<<3;
            lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
            return lWordArray;
        };
     
        function WordToHex(lValue) {
            var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
            for (lCount = 0;lCount<=3;lCount++) {
                lByte = (lValue>>>(lCount*8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
            }
            return WordToHexValue;
        };
     
        function Utf8Encode(string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";
     
            for (var n = 0; n < string.length; n++) {
     
                var c = string.charCodeAt(n);
     
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
     
            }
     
            return utftext;
        };
     
        var x=Array();
        var k,AA,BB,CC,DD,a,b,c,d;
        var S11=7, S12=12, S13=17, S14=22;
        var S21=5, S22=9 , S23=14, S24=20;
        var S31=4, S32=11, S33=16, S34=23;
        var S41=6, S42=10, S43=15, S44=21;
     
        string = Utf8Encode(string);
     
        x = ConvertToWordArray(string);
     
        a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
     
        for (k=0;k<x.length;k+=16) {
            AA=a; BB=b; CC=c; DD=d;
            a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
            d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
            c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
            b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
            a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
            d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
            c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
            b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
            a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
            d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
            c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
            b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
            a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
            d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
            c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
            b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
            a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
            d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
            c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
            b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
            a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
            d=GG(d,a,b,c,x[k+10],S22,0x2441453);
            c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
            b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
            a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
            d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
            c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
            b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
            a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
            d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
            c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
            b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
            a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
            d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
            c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
            b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
            a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
            d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
            c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
            b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
            a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
            d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
            c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
            b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
            a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
            d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
            c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
            b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
            a=II(a,b,c,d,x[k+0], S41,0xF4292244);
            d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
            c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
            b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
            a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
            d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
            c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
            b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
            a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
            d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
            c=II(c,d,a,b,x[k+6], S43,0xA3014314);
            b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
            a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
            d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
            c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
            b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
            a=AddUnsigned(a,AA);
            b=AddUnsigned(b,BB);
            c=AddUnsigned(c,CC);
            d=AddUnsigned(d,DD);
        }
     
        var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
     
        return temp.toLowerCase();
    }
    
    
    function uniqid(){  
        var date = new Date;
        var id = ((new Date()).getTime() + "" + Math.floor(Math.random() * 1000000)).substr(0, 18);
        return id;
    }
    
    function fileSelected(target,options) {
        var msgtarget = "#"+options.infoID;
        
        $(msgtarget).empty();  //clean information
        var filelength = target.files.length;
        lookupTable = new Array(filelength); //設定hash table
        $(msgtarget).append("<table class='qztable'><thead><tr><th scope='col'>FileNmae</th><th scope='col'>Size</th><th scope='col'>Loading</th></tr></thead></table>");       
        var content = "<tbody>";
        
        for(var i=0 ; i<filelength ; i++){
            var file = target.files[i];
            //var id = i;
            var id = i;
            lookupTable[i] = i;    //設定uniqid 用來區別每個檔案用
            if (file) {
                var fileSize = 0;
                if (file.size > 1024 * 1024)
                fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
                else
                fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
                content += "<tr>";
                content += "<td>"+file.name+"</td>";
                content += "<td>"+fileSize+"</td>";
                content += "<td>";
                content += "<div id='"+id+"_progressMsg'></div>";
                content += "<div id='"+id+"_underprogressBar' class='underprogressBar'></div>";
                content += "<div id='"+id+"_progressBar' class='progressBar'></div>";
                content += "</td>";           
                content += "</tr>";       
            }
        }
        content += "</tbody>"
        $(msgtarget+" table thead").after(content)
        console.log("-----fileTable");
        console.log(lookupTable);
        /*if (file) {
          var fileSize = 0;
          if (file.size > 1024 * 1024)
            fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
          else
            fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
          
          document.getElementById('fileName').innerHTML = 'Name: ' + file.name;
          document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
          document.getElementById('fileChunk').innerHTML = 'File is splited of ' + Math.ceil((file.size)/MAXsize) + ' chunk';
        }*/
    }
    
    
    
    
    function init(target,options,setData){       

        var fileNumbs = target.files.length
        for(var i=0 ; i<fileNumbs ; i++){
            var pageInfo = new Object;  
            pageInfo.setParameter = function(options){
                var settings = {MAXSIZE : 10000000, progressBarLength : 355};      //init block size is 10M
                $.extend(settings, options);
                MAX = settings.MAXSIZE;
                progressMaxLength = settings.progressBarLength;
                
                //this.file = document.getElementById(settings.fileTarget).files[0];
                //this.totalChunk = Math.ceil((this.file.size)/MAX);
                
                this.currentChunk = 0;
                this.endFlage = false;
                this.isResume = false;
            };
            pageInfo.id = i;
            pageInfo.setParameter(options);
            pageInfo.data = setData;
            pageInfo.file = target.files[i];
            pageInfo.md5 = MD5(pageInfo.file.name);
            pageInfo.totalChunk = Math.ceil((pageInfo.file.size)/MAX);
            pageInfo.unitBarWidth = progressMaxLength/(pageInfo.totalChunk);
            uploadFile(pageInfo);
        }
        
    }
    
    function sliceFile(file, start, stop){
        var slicedfile;             
        
        if ($.browser.webkit) 
            slicedfile = file.webkitSlice(start, stop);  //chrome
        else if ($.browser.mozilla) 
            slicedfile = file.mozSlice(start, stop);     //firefox
        else                      
            slicedfile = file.slice(start, MAX);        //other browser
            
        return slicedfile;
    }
    
    /*
    * 要修改 自動產生
    */
    function uploadProgress(evt,id) {
        if (evt.lengthComputable) {
            
            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
            document.getElementById(id+'_progressMsg').innerHTML = percentComplete.toString() + '%';

            document.getElementById(id+'_progressBar').style.display = 'block';
            document.getElementById(id+'_progressBar').style.width = (percentComplete*progressMaxLength/100).toString() + 'px';
          
        }
        else {
          document.getElementById(id+'_progressNumber').innerHTML = 'unable to compute';
        }
    }
    
    
    function uploadFile(pageInfo){
        console.log("-----uploadFile");
        var resumeChunkNumb = resumeFile(pageInfo);
        
        if(resumeChunkNumb != 0){
            /*****resume upload file*****/
            console.log("resume upload file");
            pageInfo.isResume = true;
            pageInfo.currentChunk = resumeChunkNumb;
            
            var startIndex = (resumeChunkNumb - 1)*MAX;
            var stopIndex = MAX + startIndex;                       
            var partFile = sliceFile(pageInfo.file, startIndex, stopIndex);            
            reUpload(pageInfo,partFile,startIndex,stopIndex);
            
        }else{
            /*****first time upload file*****/          
            console.log("first time upload file");
            if(pageInfo.file.size > MAX){
                /*****slice file to upload******/
                console.log("slice file to upload");
                pageInfo.isResume = false;
                pageInfo.currentChunk = 1;
                
                var startIndex = 0;
                var stopIndex = MAX;                
                var partFile = sliceFile(pageInfo.file, startIndex, stopIndex);
                reUpload(pageInfo,partFile,startIndex,stopIndex);
                
            }else{
                /*****small file to upload*****/
                console.log("small file to upload");
                var formdata = new FormData();
			    formdata.append('file', pageInfo.file);
                
                /*****set progress bar*****/
                /*
                *  要修改
                */
                console.log("uid = " + pageInfo.id);
                var xhr_provider = function() {
			        var xhr = jQuery.ajaxSettings.xhr(); 
			        xhr.upload.addEventListener('progress', function(evt){var uid = pageInfo.id;uploadProgress(evt,uid);}, false);
			        return xhr;
			    };
                
                /*****ajax upload file*****/
                $.ajax({
					url : 'upload.php',
					type : 'post',
					cache : false,
					contentType : false,
					processData: false,
					data : formdata,
					xhr: xhr_provider,
					beforeSend: function(xhr) { 
						xhr.setRequestHeader("header_isSlice", false);
						xhr.setRequestHeader("header_isResume", false);
						xhr.setRequestHeader("current_chunk", 0);
			        	xhr.setRequestHeader("header_filename", pageInfo.file.name);
						xhr.setRequestHeader("header_isEnd", true);
						
                        for(key in pageInfo.data){
                            xhr.setRequestHeader(key, pageInfo.data[key]);
                        }

			        }, 
					success : function(data) {
						//write some message
					}		
				});
            }
        }
    }
    
    function reUpload(pageInfo,slice_file, start, stop){
        var formdata = new FormData();
        formdata.append('file', slice_file);
        
        if (pageInfo.currentChunk == pageInfo.totalChunk) 
            pageInfo.endFlage = true;	
        
        $.ajax({
            url: 'upload.php',
            type: 'post',
            cache: false,
            contentType: false,
            processData: false,
            data: formdata,
            beforeSend: function(xhr){
                if(pageInfo.isResume){
                    xhr.setRequestHeader("header_isSlice", true);
                    xhr.setRequestHeader("header_isResume", true);
                }else{
                    xhr.setRequestHeader("header_isSlice", true);
                    xhr.setRequestHeader("header_isResume", false);
                }	
                xhr.setRequestHeader("current_chunk", pageInfo.currentChunk);
                xhr.setRequestHeader("header_filename", pageInfo.file.name);
                xhr.setRequestHeader("header_isEend", pageInfo.endFlage);
                
                for(key in pageInfo.data){
                    xhr.setRequestHeader(key, pageInfo.data[key]);
                }

            },
            success: function(data){
                $("#"+pageInfo.id+"_progressMsg").html(Math.round((pageInfo.currentChunk/pageInfo.totalChunk)*100));
                document.getElementById(pageInfo.id+'_progressBar').style.display = 'block';
                document.getElementById(pageInfo.id+'_progressBar').style.width = (pageInfo.unitBarWidth * pageInfo.currentChunk).toString() + 'px';	
                localStorage[pageInfo.md5] = pageInfo.currentChunk;
                pageInfo.currentChunk = pageInfo.currentChunk + 1;
                start = stop;
                
                if (pageInfo.currentChunk <= pageInfo.totalChunk) {
                    stop = MAX + start;
                    var partFile = sliceFile(pageInfo.file, start, stop);
                    reUpload(pageInfo,partFile, start, stop);                   
                }
                else {
                    //resume upload finish
                    localStorage.removeItem(pageInfo.md5);
                }
            },
            complete: function(xhr, status){
                
            }
        });
    }
    
    function resumeFile(pageInfo){
        var filename = pageInfo.file.name;
        var resumChunkNumb = 0;
        var localstorageChunk = localStorage[pageInfo.md5];
        var nullstring;
        if ($.browser.webkit) 
            nullstring = "undefined";  //chrome
        else if ($.browser.mozilla) 
            nullstring = "object";     //firefox
        console.log(localstorageChunk);
        console.log(typeof(localstorageChunk));
        
        if(typeof(localstorageChunk)  != nullstring){
            console.log("in undefine");
            /****get chunk number from local storage****/
            resumChunkNumb = parseInt(localstorageChunk);
            
            /*****confirm delete file or not*****/
            var isRemove = confirm("Do you want to delete file you have been uploaded on server?");
            if(isRemove){
                if(removeFile(pageInfo.file.name,pageInfo.currentChunk)){
                    alert("File has been deleted");
                    localStorage.removeItem(pageInfo.md5);
                    resumChunkNumb = 0;
                }else{
                    alert("Delete error");    
                    // 要改錯誤後的處理方式
                }
            }else{
                resumChunkNumb = resumChunkNumb + 1;
            }
        }
        console.log(resumChunkNumb);
        return resumChunkNumb;
    }
    
    function removeFile(filename,currentChunk){
        var removestate = true;
	
        $.ajax({
            async : false,
            url : 'delete.php',
            type : 'post',
            cache : false,
            data : {"filename":name,"currentChunk":currentChunk},
            dataType: "json",
            success: function(data){
                if (data.remove != "OK")  
                    removestate = false;
            },
            error : function(){
                removestate = false;
            }
        });
        
        return removestate;
    }
       
       
    
    $.fn.extend({
        qzupload: function(options,data) {
            return this.each(function () {
                console.log("-----init");    
                init(this, options, data);
            });          
        },
        qzinfo: function(options){
            return this.each(function () {
                console.log("-----qzinfo");
                $(this).change(function(){
                    console.log("-----change");
                    fileSelected(this,options);
                });
            }); 
        }
    });
})(jQuery);