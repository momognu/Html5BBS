/**
 * 登录功能JS文件
 *
 */

/**
 * API Host
 */
var regPhone = beihai365_root + "/register.php?jsoncallback=?&version=" + version + "&action=phonecheck&regmobile=";
var regGdcode = beihai365_root + "/register.php?jsoncallback=?&version=" + version + "&action=regcheck&type=mobilegdcode";
var _regUser = beihai365_root + "/register.php?jsoncallback=?&version=" + version + "&step=2";
var _jihuo = beihai365_root + "/register.php?jsoncallback=?&version=" + version + "&vip=activating";

/*登陆*/
var apiLoginHost = beihai365_url + "/index.php?jsoncallback=?&version=" + version + "&c=users&m=signin"

var isWait = true;
var wait = 60;

var regOne = $("#regOne");
var regTwo = $("#regTwo");

var sMobile = $("#phone");
var sGdcode = $("#gdcode");
var regBtn = $("#regBtn");

var regUser = $("#regUser");
var regPword = $("#regPword");
var regBtnSu = $("#regBtnSu");

/*获取验证码*/
function getPhone() {

    if (!(/^1[3-8][0-9]\d{8}$/.test(sMobile.val()))) {
        uexWindow.toast("0", "5", "请填写正确的手机号", "2000");
        return false;
    } else {
        if (isWait) {
            var getGdcodeBtn = $("#getGdcodeBtn");
            time(getGdcodeBtn);
            $.getJSON(regPhone + sMobile.val(), function(data) {
                //alert(data == 100)
                if (data == 100) {
                    uexWindow.toast("0", "5", "您的验证码将以短信发到：" + sMobile.val(), "2000");
                } else {
                    //alert(data);
                    uexWindow.toast("0", "5", "" + data, "2000");
                }
            });

        }
    }
}

function getGdcode() {

    if (!(/^1[3-8][0-9]\d{8}$/.test(sMobile.val()))) {
        uexWindow.toast("0", "5", "请填写正确的手机号", "2000");
        return false;
    } else if (!(/\d{4}$/.test(sGdcode.val()))) {
        uexWindow.toast("0", "5", "验证码是4位数字", "2000");
        return false;
    } else {
        //alert(regGdcode + "&gdcode=" + sGdcode + "&mobile=" + sMobile)
        console.log(regGdcode + "&mogdcode=" + sGdcode.val() + "&regmobile=" + sMobile.val())
        regBtn.addClass("regBtnColorNone");
        $.getJSON(regGdcode + "&mogdcode=" + sGdcode.val() + "&regmobile=" + sMobile.val(), function(data) {
            if (data == "ok") {
                //成功跳转
                //alert("成功跳转");
                regOne.hide();
                regTwo.show();
            } else {
                regBtn.removeClass("regBtnColorNone");
                uexWindow.toast("0", "5", "" + data, "2000");
            }
        });

    }

}

function getUser() {
    regBtn.addClass("regBtnColorNone");
    uexWindow.toast("0", "5", "正在注册请稍等...", "0");
    $.getJSON(_regUser + "&mogdcode=" + sGdcode.val() + "&regmobile=" + sMobile.val() + "&regpwd=" + regPword.val() + "&regname=" + regUser.val(), function(data) {
        //alert(data.uid)
        if (data.uid) {
            //成功跳转
            uexWindow.toast("0", "5", "注册成功，正在为您激活帐号，请稍等...", "0");
            getJihuo(data.uid, data.pwd);
            //alert("成功跳转");
        } else {
            regBtn.removeClass("regBtnColorNone");
            uexWindow.toast("0", "5", "" + data, "2000");
        }
    });
}

function getJihuo(uid, pwd) {
    //alert(_jihuo + "&r_uid=" + uid + "&pwd=" + pwd);
    $.getJSON(_jihuo + "&r_uid=" + uid + "&pwd=" + pwd, function(data) {
        //alert(data == "regsuccess")
        uexWindow.closeToast();
        if (data == "regsuccess") {
            //激活成功，去登陆
            uexWindow.toast("0", "5", "激活成功正在为您登陆，请稍等...", "0");
            getLogin();
        } else {
            uexWindow.toast("0", "5", "" + data, "2000");
        }
    });
}

function getLogin() {

    var username = regUser.val();
    var password = regPword.val();
    _username = encodeURIComponent(username)
    _password = encodeURIComponent(password);
    
    var loginURL = apiLoginHost + '&u=' + _username + '&p=' + _password;
    //alert(loginURL)
    $.getJSON(loginURL, function(data) {
       // alert("登陆成功")
        uexWindow.closeToast();
        //alert("登陆成功")
        if (data.uid) {
            uexWindow.toast("0", "5", "登录成功！", "2000");
            localStorage.uid = data.uid;
            localStorage.username = data.username;
            localStorage.save_code = data.save_code;
            uexWindow.evaluatePopoverScript("root","index_content","location.reload()");
            
            setTimeout(function () {
                uexWindow.close(-1);
            }, 2000);

        } else {
            uexWindow.toast("0", "5", "登录失败，帐号或密码错误…", "2000");
        }
    });
}

function time(o) {
    if (wait == 0) {
        o.html("获取验证码").removeClass("getGdcodeBtnColor");
        wait = 60;
        isWait = true;
    } else {
        o.html(wait + "秒后可重发").addClass("getGdcodeBtnColor");
        ;
        isWait = false;
        wait--;
        setTimeout(function() {
            time(o)
        }, 1000)
    }
}

/**
 * HTML5 localStorge.getItem 函数的封装
 * @param {Object} key
 */
function getLocalStorge(key) {
    var item = localStorage.getItem(key);
    if (item == '' || item == null || typeof (item) == "undefined") {
        return false;
    } else {
        return item;
    }
}