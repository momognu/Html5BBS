/**
 * 登录功能JS文件
 *
 */

/**
 * API Host
 */
var apiHost = beihai365_url + "/index.php?jsoncallback=?&version=" + version + "&c=users&m=signin"
/**
 * 登录
 */
function loginYY() {
    var username = $('#username').val();
    var password = $('#password').val();
    if (username.length < 1) {
        uexWindow.toast("0", "5", "登录失败，用户名不能为空…", "2000");
        return false;
    }
    if (password.length < 1) {
        uexWindow.toast("0", "5", "请输入正确密码。", "2000");
        return false;
    }
    uexWindow.toast("1", "5", "登录中，请稍后…", "0");
    _username = encodeURIComponent(username)
    _password = encodeURIComponent(password);
    var loginURL = apiHost + '&u=' + _username + '&p=' + _password;
    xmlHttp(loginURL, showLoginResult);
}

/**
 * 网络访问函数
 * @param {Object} url  请求的网络地址
 * @param {Object} callback 回调函数
 */
function xmlHttp(url, callback) {
    if (url == '') {
        uexWindow.alert('参数错误', '请求地址不能为空！', '返回');
    } else {
        $.getJSON(url, callback);
    }
}

/**
 * 登录回调函数
 * @param {Object} data
 */
var ___i = 0;
function showLoginResult(data) {
    uexWindow.closeToast();
    if (data.uid) {
        uexWindow.toast("0", "5", "登录成功！", "2000");
        //alert(data.uid)
        localStorage.uid = data.uid;
        localStorage.username = data.username;
        localStorage.save_code = data.save_code;
        var returnType = getLocalStorge("returnType");

        loginFenlei(data);
        

    } else {
        uexWindow.toast("0", "5", "登录失败，帐号或密码错误…", "2000");
    }
}
function loginFenlei(data){
    $.getJSON("http://www.beihai365.com/phoneapi/index.php?c=thread&m=baseInterface&ac=synlogininfo&uid="+ data.uid +"&save_code="+data.save_code, function(data){
        if(data.result == "success"){
            localStorage.tzwy = data.data.url;
            //登录改造后，统一使用回调方法
            //使用方法，open login.html的时候设置localStorage.loginType为当前窗口name即可回调
            uexWindow.evaluateScript(localStorage.loginType, 0, "loginCallback();");

        }
    });
}   
function colse(){
    uexWindow.close(-1);
}
