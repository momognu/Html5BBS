// JavaScript Document
/*
 var sina = new WBSin({key:"1183699041",redirectUrl:"http://www.beihai365.com/tiaozhuan/index.html"});
 var qq = new WB({clientip:"127.0.0.1",key:"801303729",redirectUrl:"http://www.beihai365.com/tiaozhuan/index.html"});
 */
function showActionSheet() {
    //var value = "短信分享;邮件分享;腾讯微博;新浪微博";

    var value = "分享给微信好友;分享到朋友圈;短信分享;邮件分享";
    uexWindow.cbActionSheet = actionSheetSuccess;
    var mycars = value.split(";");
    uexWindow.actionSheet("", "取消", mycars);
}

/*
function sina_sendtext(){
var title = LS.get('subject');
var url = 'http://m.beihai365.com/read.php?tid%3D'+LS.get('tid');
var text = '我正在看北海365网的帖子《'+title+'》觉得不错，分享给大家。详情：'+url+' #北海365网#';
sina.request("statuses/update",function(data){
var json = JSON.parse(data);
if(json.error_code){
uexWindow.toast("0","5","分享到新浪微博失败",2000);
}else{
uexWindow.toast("0","5","分享到新浪微博成功",2000);
}

},{
status: text
},"post");

}
function qq_sendtext(){
var title = LS.get('subject');
var url = 'http://m.beihai365.com/read.php?tid%3D'+LS.get('tid');
var text = '我正在看北海365网的帖子《'+title+'》觉得不错，分享给大家。详情：'+url+' #北海365网#';
qq.request("t/add",function(data){
var json = JSON.parse(data);
if(json.ret == 0){
uexWindow.toast("0","5","分享到腾讯微博成功",2000);
}else{
uexWindow.toast("0","5","分享到腾讯微博失败",2000);
}

},{
format:"json",
content: text
},"post");
}
*/
// 短信发送
function sms_share() {
    var fUrl = 'http://m.beihai365.com/thread.php?fid=' + localStorage.fid;
    var iphone_number = '';
    var SMScontent = '我正在使用北海365网手机客户端看【' + localStorage.form_name + '】的帖子，感觉不错哦，你也来看看吧！查看链接：' + fUrl;
    uexSMS.open(iphone_number, SMScontent);
}

// 邮件发送
function mail_share() {
    var fUrl = 'http://m.beihai365.com/thread.php?fid=' + localStorage.fid;
    var mail = '';
    var MAILtitle = '亲，来我一起泡' + localStorage.form_name + '版吧~';
    var MAILcontent = '我正在使用北海365网手机客户端看【' + localStorage.form_name + '】的帖子，感觉不错哦，你也来看看吧！查看链接：' + fUrl;
    //alert("进入邮件分享");
    uexEmail.open(mail, MAILtitle, MAILcontent, '');
}

function wx_share(n) {
    var fUrl = 'http://m.beihai365.com/thread.php?fid=' + localStorage.fid;
    var title = '亲，来我一起泡' + localStorage.form_name + '版吧~';
    var content = '我正在使用北海365网手机客户端看【' + localStorage.form_name + '】的帖子，感觉不错哦，你也来看看吧！查看链接：' + fUrl;

    var JsonData = '{"thumbImg":"res://shareicon.png","wedpageUrl":"' + fUrl + '","scene":' + n + ',"title":"' + title + '","description":"' + content + '"}';
    uexWeiXin.shareLinkContent(JsonData);
}

//收藏帖子
function collect_post() {
    var tid = localStorage.tid;
    //当前帖子id
    var uid = localStorage.uid;
    //当前登录的用户id
    //if(!uid) alert('请先登录');
    //var uid = 234079; //登录测试
    var collect_url = beihai365_url + "/index.php?jsoncallback=?&version=" + version + "&c=threads&m=collect";

    $.getJSON(collect_url + '&uid=' + uid + '&tid=' + tid, function(data) {
        if (data.result == 'success') {
            localStorage.is_collect = 1;
            uexWindow.toast("0", "5", "帖子已收藏成功", "3000");
        } else {
            uexWindow.toast("0", "5", "操作失败，请重试！", "3000");
        }
    });
}

//取消收藏
function collect_delete() {
    var tid = localStorage.tid;
    //当前帖子id
    var uid = localStorage.uid;
    //当前登录的用户id
    var collect_url = beihai365_url + "/index.php?jsoncallback=?&version=" + version + "&c=threads&m=delete_collect";
    $.getJSON(collect_url + '&uid=' + uid + '&tid=' + tid, function(data) {
        if (data.result == 'success') {
            localStorage.is_collect = 0;
            uexWindow.toast("0", "5", "帖子已取消收藏", "3000");
        } else {
            uexWindow.toast("0", "5", "操作失败，请重试！", "3000");
        }
    });
}

function actionSheetSuccess(opId, dataType, data) {

    if (data == 0) {
        wx_share(0);
        setTimeout(function() {
            uexWindow.evaluatePopoverScript("listwin", "listcontent", "openshareTips()");
        }, 500);
    } else if (data == 1) {
        wx_share(1)
        setTimeout(function() {
            uexWindow.evaluatePopoverScript("listwin", "listcontent", "openshareTips()");
        }, 500);
    } else if (data == 2) {
        sms_share();
    } else if (data == 3) {
        mail_share()
    }
    /*
     else if (data == '2')
     {
     if(qq.checkLogin()){
     qq_sendtext();
     return;
     }
     qq.login(function(d)
     {
     if(parseInt(d)==1)
     qq_sendtext();
     });
     }
     else if (data == '3')
     {
     if(sina.checkLogin()){
     //alert("sddd");
     sina_sendtext();
     }else{
     sina.login(function(d)
     {
     if(parseInt(d)==1)
     sina_sendtext();
     });
     }
     }*/
}

