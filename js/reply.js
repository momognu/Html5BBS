/**
 * 回复功能JS文件
 * 
 */
/**
 * 用于多个confirm的识别
 */
var confirmTag = 0;
/**
 * API Host
 */
var forumHost = beihai365_url+"/index.php?jsoncallback=?&version="+version+"&c=threads&m=reply"
/**
 * 回复
 */
/**
 * 帖子回复
 */
function postNewReply(){
	
	localStorage.replies=Number(Number(localStorage.replies)+1);
	var uid = getLocalStorge('uid');
	uexWindow.toast("1","5","回复内容正在发布…","0");
	
	var img = $$('img').value;
	var content = $.trim($('#message').val());
	var fid = getLocalStorge('fid');
	var tid = getLocalStorge('tid');

	//var fid = 2;
	//var tid = 1;
	var save_code = getLocalStorge('save_code');
	if(content.length <= 2){
		uexWindow.closeToast();
		uexWindow.toast("0","5","提交失败，内容太短了些吧…","2000");
		return false;
	}
	
	if(content.length >= 1500){
		uexWindow.closeToast();
		uexWindow.toast("0","5","兄弟真佩服你，删掉一些字再回复吧！","2000");
		return false;
	}
	
	if(!fid){
		uexWindow.closeToast();
		uexWindow.toast("0","5","提交失败，没有找到对应板块…","2000");
		return false;
	}
	
	if(!tid){
		uexWindow.closeToast();
		uexWindow.toast("0","5","提交失败，帖子ID信息丢失…","2000");
		return false;
	}
	
	if(!uid){
		uexWindow.closeToast();
		uexWindow.toast("0","5","提交失败，用户UID缺失…","2000");
		return false;
	}
	//把message存起来，拼装回复用
	
	localStorage.setItem('message',content.replace(/\n|\r\n/,"<br>"));
	//
	_content = encodeURIComponent(content);
	_img = encodeURIComponent(img);
	var RequestUrl = forumHost + '&uid='+uid+'&fid='+fid+'&tid='+tid+'&content='+_content+encodeURIComponent('\n')+_img+'&save_code='+save_code;
	//alert(RequestUrl);
	xmlHttp(RequestUrl,replyCallBack);

}
/**
 * confirm控件监控函数
 * 暂时废弃
 */
/*
function ConfirmSuccess(opId,dataType,data){
　　if(confirmTag == 3){
		if (data == 0) {
			uexWindow.open('login','0','login.html','1','100%','100%','0');
		}
	}	
}
*/
/**
 * 网络访问函数
 * @param {Object} url	请求的网络地址
 * @param {Object} callback	回调函数
 */
function xmlHttp(url,callback){
	if(url == ''){
		uexWindow.alert('参数错误','请求地址不能为空！','返回');
	}else{
		$.getJSON(url,callback);
	}
}

/**
 * 回复帖子中的回调处理函数
 * @param {Object} data
 */
function replyCallBack(data){
	uexWindow.closeToast();
	if(data.result == 'success'){
		
		localStorage.tmp_reply_post = '';
		$('#message').val('');
		
		//将回复追加到
		uexWindow.evaluatePopoverScript("reads","content","appendNewReply()");
		//setTimeout(function () {
			closeWindow();
		//}, 1000);
	}else{
		//alert(data.result);
		uexWindow.toast("0","5","发布失败，请稍后重试…","3000");
	}
	
//	$("#list_re_btn").show();
//	$("#list_re_btn_hui").hide();
}
/**
 * 关闭窗口
 */
function closeWindow(){
    var closeString = "uexWindow.close(-1);";
    uexWindow.evaluateScript('', '0', closeString);
}


/**
 * HTML5 localStorge.getItem 函数的封装
 * @param {Object} key
 */
function getLocalStorge(key){
	var item = localStorage.getItem(key);
	if(item=='' || item==null || typeof(item)=="undefined"){
		return "";
	}else{
		return item;
	}
}