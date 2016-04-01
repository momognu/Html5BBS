function showActionSheet() {
    var value = uexWidgetOne.platformName == 'android' ? "分享给微信好友;分享到朋友圈;短信分享;邮件分享;复制标题+链接;复制地址" : "分享给微信好友;分享到朋友圈;短信分享;邮件分享";
    uexWindow.cbActionSheet = actionSheetSuccess;
    var mycars = value.split(";");
    uexWindow.actionSheet("", "取消", mycars);
}

// 短信发送
function sms_share() {
    var title = LS.get('subject');
    var url = 'http://m.beihai365.com/read.php?tid=' + LS.get('tid');
    var fUrl = 'http://m.beihai365.com/thread.php?fid=' + LS.get('fid');
    var iphone_number = '';
    var SMScontent = '我正在使用北海365网手机客户端看帖子：\n' + title + '\n' + url;
    uexSMS.open(iphone_number, SMScontent);
}

// 邮件发送
function mail_share() {
    var url = 'http://m.beihai365.com/read.php?tid=' + LS.get('tid');
    var fUrl = 'http://m.beihai365.com/thread.php?fid=' + LS.get('fid');
    var mail = '';
    var MAILtitle = localStorage.subject;
    var MAILcontent = '我正在使用北海365网手机客户端看帖子：' + localStorage.subject + ' ' + url;
    //alert("进入邮件分享");
    uexEmail.open(mail, MAILtitle, MAILcontent, '');
    //uexEmail.open('','i is mail','mail content','');
}

function wx_share(n) {
    var url = 'http://m.beihai365.com/read.php?tid=' + LS.get('tid');
    var fUrl = 'http://m.beihai365.com/thread.php?fid=' + LS.get('fid');
    var content = '我正在使用北海365网手机客户端看【' + localStorage.subject + '】写得很好，你也来看看吧！' + url;
    var JsonData = '{"thumbImg":"res://shareicon.png","wedpageUrl":"'+url+'","scene":' + n + ',"title":"'+localStorage.subject+'","description":"'+content+'"}';
    uexWeiXin.shareLinkContent(JsonData);
}

function actionSheetSuccess(opId, dataType, data) {
    //alert(data)
    if (data == 0) {
        //微信好友
        wx_share(0);
        setTimeout(function(){
            uexWindow.evaluatePopoverScript("reads", "content", "openshareTips()");   
        },500);  
        
    } else if (data == 1) {
        //朋友圈
        wx_share(1);
        setTimeout(function(){
            uexWindow.evaluatePopoverScript("reads", "content", "openshareTips()");   
        },500);  
    } else if (data == 2) {
        //短信
        sms_share();
    } else if (data == 3) {
        //邮件
        mail_share()
    } else if (data == 4) {
        if (uexWidgetOne.platformName == 'android') {
            //复制
            var url = 'http://m.beihai365.com/read.php?tid=' + LS.get('tid');
            uexClipboard.copy('' + localStorage.subject + ' ' + url);
            uexWindow.alert("复制成功！", "你可粘贴到微信、微博、QQ、短信发给朋友", "我知道了")
        }
    } else if (data == 5) {
        var url = 'http://m.beihai365.com/read.php?tid=' + LS.get('tid');
        uexClipboard.copy(url);
        uexWindow.alert("复制成功！", "你可以把帖子地址粘贴到微信、微博、QQ、短信发给朋友", "我知道了")
    }
}	