var inOpCode = 1;
var inOpUrl = "";
var inOpName = "";

function AppDownload(opid,opurl,opname) {
    AppDownloadCb();
    
    inOpCode = opid; // 创建一个下载ID
    inOpUrl = opurl;
    inOpName = opname;
    clearAppDownloadInfo(); // 下载之前先清空一下下载缓存
    uexDownloaderMgr.createDownloader(inOpCode);
}

function AppDownloadCb() {
    uexDownloaderMgr.onStatus = function(opCode, fileSize, percent, status) {
        switch (status) {
        case 0:
            document.getElementById('percentage').style.display = "block";
            
            
            document.getElementById('percentage').innerHTML = '<div class="downTipsBoxBg"></div>'+
                    '<div class="downTipsBox">'+
                        '<h1 id="downTipsBoxTitle">正在下载</h1>'+
                        '<div class="downTipsBoxsize">'+
                            '文件大小:<span>'+(parseInt(fileSize)/1024/1024).toFixed(2)+'</span>MB'+
                        '</div>'+
                        '<div class="downTipsBoxper">'+
                            '进度:'+
                            '<div class="jingdutiao">'+
                                '<span style="width:'+percent+'%"></span>'+
                                '<p>'+percent+'%</p>'+
                            '</div>'+
                        '</div>'+
                        '<div class="downTipsBoxin">'+
                            '下载完成后会自动帮您安装<span>请勿关闭此页面</span>'+
                        '</div>'+
                    '</div>';

            break;

        case 1:
            document.getElementById('percentage').style.display = "none";
            uexDownloaderMgr.closeDownloader(opCode);
            uexWidget.installApp('wgt://data/down/'+inOpName+'');
            break;
        case 2:
            alert("下载失败");
            uexDownloaderMgr.closeDownloader(opCode);
            break;
        case 3:
            alert("已取消下载");
            break;
        }

    }
    var cText = 0;
    var cJson = 1;
    var cInt = 2;
    uexDownloaderMgr.cbCreateDownloader = function(opCode, dataType, data) {
        switch(dataType) {
        case cText:
            alert("uex.cText");
            break;
        case cJson:
            alert("uex.cJson");
            break;
        case cInt:
            if (data == 0) {
                uexDownloaderMgr.download(inOpCode, inOpUrl, 'wgt://data/down/'+inOpName+'', '1');
            } else {
                alert("创建失败");
            }
            break;
        default:
            alert("error");
        }

    }

    uexWidgetOne.cbError = function(opCode, errorCode, errorInfo) {
        alert(errorInfo);
    }
    uexDownloaderMgr.cbGetInfo = function(opCode, dataType, data) {
        switch(dataType) {
        case cText:
            alert("uex.cText");
            break;
        case cJson:
            if (data == null || data.length == 0) {
                alert("无数据");
                return;
            }
            //alert(data);
            var info = eval('(' + data + ')');
            alert("文件路径：" + info.savePath + "<br>文件大小：" + info.fileSize + "<br>已下载：" + info.currentSize + "<br>下载时间：" + info.lastTime);
            break;
        case cInt:
            alert("uex.cInt");
            break;
        default:
            alert("error");
        }

    }
}

function closeAppDownload() {
    uexDownloaderMgr.closeDownloader(inOpCode);
}

function getAppDownloadInfo() {
    uexDownloaderMgr.getInfo(inOpUrl);
}

function clearAppDownloadInfo() {
    uexDownloaderMgr.clearTask(inOpUrl, "1");
}
