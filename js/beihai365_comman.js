/**
 * 这个文件写静态变量
 * 整理时间：2015年6月5日 10:48:45
 */

//var  beihai365_url = "http://192.168.10.191/pw8/phone";
var beihai365_url = "http://www.beihai365.com/phone";
//1.0 使用14
var version = "16";

/*注册验证码*/
var beihai365_root = "http://www.beihai365.com";
//目前用于注册

function $id(id) {
    return document.getElementById(id);
}

function close_window() {
    uexWindow.close('-1');
}

var isOL = true;
// 判断是否正式线上版本，调试的时候false，上线的时候true