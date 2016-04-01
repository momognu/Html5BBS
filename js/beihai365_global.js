/**
 * 这个文件写共用函数
 * 整理时间：2015年6月5日 10:48:45
 */

var $BS = {
    inArray : function(needle, haystack) {
        var length = haystack.length;
        for (var i = 0; i < length; i++) {
            if (haystack[i] == needle)
                return true;
        }
        return false;
    }
}

var Util = {
    //回到顶部
    moveTop : function() {
        if (document.documentElement.scrollTop) {
            document.documentElement.scrollTop = 0;
        } else {
            document.body.scrollTop = 0;
        }
    }
}

//APPCAN有提供接口 uexWidgetOne.
var os = {
    __init__ : function() {
        var deviceAgent = navigator.userAgent.toLowerCase();
        return deviceAgent.match(/(iphone|ipod|android|chrome|ipad)/);
    },
    android : function() {
        var agentID = this.__init__();
        return agentID.indexOf("chrome") >= 0 || agentID.indexOf("android") >= 0;
    },
    iphone : function() {
        var agentID = this.__init__();
        return agentID.indexOf("iphone") >= 0 || agentID.indexOf("ipod") >= 0 || agentID.indexOf("ipad") >= 0;
    }
}

/**
 * 打开新窗口
 */
function newOpenWin(winname, url, falg) {
    if (falg) {
        uexWindow.open(winname, '0', url, '2', '', '', falg, 360);
    } else {
        uexWindow.open(winname, '0', url, '2', '', '', '4', 360);
    }

}

/**
 * 打开我们DIY的浏览器
 */
function openbrower(url) {
    var ifIOS9 = false;
    var ifip = uexWidgetOne.getPlatform();
    if( !ifip ){
         if( uexWidgetOne.platformVersion.split('.')[0] > 8 ){
             ifIOS9  =  true
         }
    }
    if( !ifIOS9 ){
        localStorage.goOpenUrl = url;
        uexWindow.open('goOpenURL', '0', 'link.html', '2', '', '', '4', 360);        
    }else{//如果是iso9就直接默认浏览器打开
        openUrl(url)
    }
}

/**
 * 打开图片浏览
 */
function xImageBrowser(u, i, k) {
    uexImageBrowser.open(u, i, k);
}

/**
 * 打开浏览器
 * @param {Object} url
 */
function openUrl(url) {
    var ifip = uexWidgetOne.getPlatform();
    if ( !ifip ) {
        //IOS设备
        uexWidget.loadApp(url, '', '');
    } else {
        //android设备
        uexWidget.loadApp('android.intent.action.VIEW', 'text/html', url);
    }
}

/**
 * 阻止冒泡函数
 * @param {Object} e
 */
function stopPP(e) {
    var evt = e || window.event;
    evt.stopPropagation ? evt.stopPropagation() : (evt.cancelBubble = true);
}

/**
 * 同步ajax
 * @param {Object} aphonia
 */
function app_update(aphonia) {
    aphonia && uexWindow.toast('1', '5', '请稍等...', '');
    $.ajax({
        type : 'GET',
        url : beihai365_url + '/index.php?jsoncallback=?&version=' + version + '&c=threads&m=msg',
        dataType : 'json',
        success : function(data) {
            var msg = data.msg;
            //一些开关
            localStorage.isAdShow = data.adShow;
            //升级代码
            aphonia && uexWindow.closeToast();
            beihai365_app_update(aphonia, msg);
        }
    });
}

/**
 * app更新
 */
function beihai365_app_update(aphonia, msg) {
    var flag_sdcard = 1;
    var updateurl = '';
    //下载新apk文件地址
    var filepath2 = "/sdcard/";
    //保存到sd卡
    var fileName = '';
    //新版本文件名
    var platform = '';
    //平台版本
    //var update_msg = "当前有新版本，是否更新?\n阿什顿发速度萨拉丁萨都剌\n艾什顿发生地方艾什顿艾什顿速度";  //提示文字

    //安卓版 ，显示下载进度 （step:7）
    uexDownloaderMgr.onStatus = function(opId, fileSize, percent, status) {
        if (status == 0) {
            // 下载中...
            //alert('download percent ' + percent + '%');
            uexWindow.toast('1', '5', '下载进度：' + percent + '%', '');
        } else if (status == 1) {// 下载完成.
            uexWindow.closeToast();
            uexDownloaderMgr.closeDownloader('14');
            //关闭下载对象
            localStorage.clear();
            uexWidget.installApp(filepath2 + fileName);
            // 安装下载apk文件
        } else {
            uexWindow.toast('1', '5', '请确保SD卡可正常使用.', '');
        }
    };
    //安卓版 ，创建下载对象回调函数（step:6）
    uexDownloaderMgr.cbCreateDownloader = function(opId, dataType, data) {
        //alert('uexDownloaderMgr.cbCreateDownloader data='+data);
        if (data == 0) {
            //updateurl是通过调用cbCheckUpdate回调后，放入全局变量的
            uexDownloaderMgr.download('14', updateurl, filepath2 + fileName, '0');
            //开始下载apk文件
        } else if (data == 1) {
            ;
        } else {
            ;
        }
    };

    //提示更新模态框按钮事件回调函数，判断用户选择更新还是取消 （step:5）
    uexWindow.cbConfirm = function(opId, dataType, data) {
        //alert('uexWindow.cbConfirm ');
        //调用对话框提示函数
        if (data == 1) {
            //用户点击稍后按钮，不进行更新
            sessionStorage.setItem("update", "false");
            //不更新标记
        } else {
            //用户点击确定按钮，进行更新
            if (platform == 1) {
                //安卓版更新，通过创建下载对象进行下载
                uexDownloaderMgr.createDownloader("14");
            } else if (platform == 0) {
                //苹果更新
                uexWidget.loadApp("", "", updateurl);
            }
        }
    };

    //调用检查更新回调函数，请求成功后，弹出模态框让用户选择是否现在更新（step:4）
    uexWidget.cbCheckUpdate = function(opCode, dataType, jsonData) {
        //alert('jsonData='+jsonData);
        var obj = eval('(' + jsonData + ')');
        if (obj.result == 0) {
            // tips = "更新地址是：" + obj.url + "<br>文件名：" + obj.name + "<br>文件大小：" +
            // obj.size + "<br>版本号：" + obj.version;
            updateurl = obj.url;
            fileName = obj.name + ".apk";
            var value = "更新;稍后";
            var mycars = value.split(";");

            uexWindow.confirm('', msg, mycars);
            //弹出提示框，是否确定更新
        } else if (obj.result == 1) {
            aphonia && alert("目前已经是最新版本");
            ;// tips = "当前版本是最新的";alert(tips);
        } else if (obj.result == 2) {
            aphonia && alert("目前已经是最新版本");
        } else if (obj.result == 3) {
            aphonia && alert("升级异常");
            ;// tips = "参数错误";alert(tips);
        }
    };

    //检查是否已经存在sd卡的回调函数（step:3）
    uexFileMgr.cbIsFileExistByPath = function(opCode, dataType, data) {
        //alert('uexFileMgr.cbIsFileExistByPath flag_sdcard='+flag_sdcard+' , data='+data);
        if (flag_sdcard == 0) {
            if (data == 0) {
                aphonia && alert('请检查手机的sd卡是否正常');
            } else {
                //执行检查更新
                uexWidget.checkUpdate();
                //根据config.xml里面配置的检查更新地址发起http请求
            }
            flag_sdcard = 1;
        }
    };
    //获取平台版本回调函数，确定是客户端是那个平台的客户端 （step:2）
    uexWidgetOne.cbGetPlatform = function(opId, dataType, data) {
        //alert('b');
        //获取系统版本信息回调函数
        platform = data;
        //alert(platform);
        if (data == 1) {
            // 是android
            flag_sdcard = 0;
            uexFileMgr.isFileExistByPath('/sdcard/');
            //先判断是否存在sd卡，再调用checkUpdate来进行更新
        } else if (data == 0) {
            //alert("我是IOS");
            uexWidget.checkUpdate();
        } else {
            aphonia && alert("您手机暂不支持");
        }
    };
    uexWidgetOne.getPlatform();
    //获取平台版本 （step:1）
}

//模式
function pattern() {
    var u = '';
    if (localStorage.pattern == 'small_pic') {
        u = '&pattern=small_pic';
    } else if (localStorage.pattern == 'none_pic') {
        u = '&pattern=none_pic';
    } else if (localStorage.pattern == 'big_pic') {
        u = '&pattern=big_pic';
    }
    return u;
}

//JS模拟in_array
Array.prototype.in_array = function(e) {
    for ( i = 0; i < this.length && this[i] != e; i++);
    return !(i == this.length);
}
//数组去重
Array.prototype.del = function() {
    var a = {},
        c = [],
        l = this.length;
    for (var i = 0; i < l; i++) {
        var b = this[i];
        var d = ( typeof b) + b;
        if (a[d] === undefined) {
            c.push(b);
            a[d] = 1;
        }
    }
    return c;
}
/**
 * 请问地址 函数的封装
 * 方便在地址上统计加参数(UID、版本号、手机唯一标识、安全码)
 * @param {Object} s
 */
function reLink(s) {

    s = beihai365_url + s + "&version=" + version + "&uid=" + getLocalStorge('uid') + "&deviceid=" + getLocalStorge('macAddress') + "&save_code=" + getLocalStorge('save_code') + "&cpuinfo=" + getLocalStorge('cpuinfo') + "&osver=" + getLocalStorge('osver') + "&manufacturer=" + getLocalStorge('manufacturer') + "&keyboard=" + getLocalStorge('keyboard') + "&bluetooth=" + getLocalStorge('bluetooth') + "&wifi=" + getLocalStorge('wifi') + "&camera=" + getLocalStorge('camera') + "&gps=" + getLocalStorge('gps') + "&gprs=" + getLocalStorge('gprs') + "&touch=" + getLocalStorge('touch') + "&imei=" + getLocalStorge('imei') + "&deviceToken=" + getLocalStorge('deviceToken') + "&softToken=" + getLocalStorge('softToken') + "&connectStatus=" + getLocalStorge('connectStatus') + "&restDiskSize=" + getLocalStorge('restDiskSize') + "&mobileOperatorName=" + getLocalStorge('mobileOperatorName') + "&macAddress=" + getLocalStorge('macAddress') + "&deviceToken=" + getLocalStorge('model') + "&resolutionRatio=" + getLocalStorge('resolutionRatio');
    //alert(s)
    return encodeURI(s);
}

/**
 * HTML5 localStorge.getItem 函数的封装
 * @param {Object} key
 */
function getLocalStorge(key) {
    var item = localStorage.getItem(key);
    if (item == 'undefined' || item == '' || item == null || typeof (item) == "undefined") {
        return "";
    } else {
        return item;
    }
}

function getKey(item) {
    if (item == 'undefined' || item == '' || item == null || typeof (item) == "undefined") {
        return "";
    } else {
        return item;
    }
}

function getLs(key) {
    var item = localStorage.getItem(key);
    if (item == '' || item == null || typeof (item) == "undefined") {
        return false;
    } else {
        return item;
    }
}

/**
 * 腾讯统计 函数的封装
 * @param {Object} key
 */
function isMTA(key) {
    if (os.android()) {
        uexQQ.startMTA();
        //启动统计
        uexQQ.trackCustomEvent(key);
        //启动统计自定义事件
    }
}

/**
 *用于解决用户意外多次点击问题
 *用法 setClick(function(){
 *     您的方法
 * })
 */
var clickNum = 0;
function setClick(callback) {
    clickNum++;
    if (clickNum == 1) {
        callback();
        setTimeout(function() {
            clickNum = 0;
        }, 300);
    }
}

/**
 * 用uexXmlHttpMgr封装AJAX方法
 * 解决uexXmlHttpMgr同时多次发起时，onData参数会被覆盖的问题（懂的人会懂的，不明白的人的话忽略 直接用即可。）
 */
window.AJAX = {
    callBack : {},
    index : 1,
    get : function(url, succCall, errCall, timeout) {
        var id = this.index++;
        this.callBack[id] = [succCall, errCall];
        uexXmlHttpMgr.open(id, 'get', url, (timeout || 0));
        this._send(id);
    },
    post : function(url, data, succCall, errCall, timeout) {
        var id = this.index++;
        this.callBack[id] = [succCall, errCall];
        uexXmlHttpMgr.open(id, 'post', url, (timeout || 0));
        if (data) {
            for (var k in data) {
                uexXmlHttpMgr.setPostData(id, 0, k, data[k]);
            }
        }
        this._send(id);
    },
    _send : function(id) {
        uexXmlHttpMgr.onData = this.onData;
        uexXmlHttpMgr.send(id);
    },
    onData : function(inOpCode, inStatus, inResult) {
        var that = AJAX,
            callBack = that.callBack[inOpCode] || [];
        if (inStatus == -1) {
            callBack[1] && callBack[1]();
            delete that.callBack[inOpCode];
        } else if (inStatus == 1) {
            callBack[0] && callBack[0](inResult);
            delete that.callBack[inOpCode];
        }

    }
};

/**
 *
 * 打开窗口方法封装
 */
var openWindow = {
    select : function(_s, _id, _sec) {
        var _this = this;
        var s = _s + "",
            id = _id + "",
            sec = _sec + "";
        switch(s) {
        case "1":
            //频道
            setClick(function() {
                _this.pindao(s, id)
            });
            break;
        case "2":
            //列表
            setClick(function() {
                _this.liebiao(s, id, sec)
            });
            break;
        case "3":
            //帖子
            setClick(function() {
                _this.tiezi(s, id)
            });
            break;
        case "4":
            //搜索
            setClick(function() {
                _this.sousuo(s, id, sec)
            });
            break;
        case "5":
            //外部链接(系统浏览器)
            setClick(function() {
                _this.waibu(s, id)
            });
            break;
        case "6":
            //贴单
            setClick(function() {
                _this.tiedan(s, id)
            });
            break;
        case "7":
            //贴单DEC
            setClick(function() {
                _this.tiedanDec(s, id)
            });
            break;
        case "8":
            //内部链接(我们的浏览器);
            setClick(function() {
                _this.neibu(s, id)
            });
            break;
        default:

        }
    },
    pindao : function(s, id) {
        localStorage.urlType = id;
        //自增windowId
        localStorage.pindaoWindowId = parseInt(parseInt(localStorage.pindaoWindowId) + 1);
        var pindaoWindowId = 'pindao' + localStorage.pindaoWindowId;
        uexWindow.open(pindaoWindowId, 0, 'pindao.html', 2, 0, 0, 1024, 360);
    },
    liebiao : function(s, id, sec) {
        localStorage.fid = id
        localStorage.sec_url = sec;
        localStorage.listWindowId = parseInt(parseInt(localStorage.listWindowId) + 1);
        var listWindowId = 'list' + localStorage.listWindowId;
        uexWindow.open(listWindowId, 0, 'list.html', 2, 0, 0, 1024, 360);
    },
    tiezi : function(s, id) {
        localStorage.tid = id;
        //自增windowId
        localStorage.detailWindowId = parseInt(parseInt(localStorage.detailWindowId) + 1);
        var detailWindowId = 'detail' + localStorage.detailWindowId;
        uexWindow.open(detailWindowId, 0, 'detail.html', 2, 0, 0, 1024, 360);

    },
    sousuo : function(s, id, type) {
        localStorage.searchKey = id;
        localStorage.soKeyType = type;
        uexWindow.open('search', 0, 'search.html', 2, 0, 0, 1024, 360);
    },
    waibu : function(s, id) {
        openUrl(id);
    },
    tiedan : function(s, id, use) {
        localStorage.tid = id;
        localStorage.ifcreate = use;

        localStorage.tiedanWindowId = parseInt(parseInt(localStorage.tiedanWindowId) + 1);
        var tiedanWindowId = 'single-list' + localStorage.tiedanWindowId;
        uexWindow.open(tiedanWindowId, 0, 'stick_single_list.html', 2, 0, 0, 1024, 360);

    },
    tiedanDec : function(s, id) {

        localStorage.singleCid = id;
        localStorage.ifCreatorInv = 'false';
        localStorage.tiedanDecWindowId = parseInt(parseInt(localStorage.tiedanDecWindowId) + 1);
        var tiedanDecWindowId = 'single-dec' + localStorage.tiedanDecWindowId;
        uexWindow.open(tiedanDecWindowId, 0, 'stick_single_dec.html', 2, 0, 0, 1024, 360);

    },
    neibu : function(s, id) {
        //内部链接
        openbrower(id);

    }
}

/**
 * 加载框
 * 打开lodding.show(),关闭lodding.hide()
 */
var lodding = {
    show : function() {
        var showHtml = '<div id="pageLodding">' + '<div class="up ub ub-ver">' + '<div class="lodding up ub-ver ub ub-ac ub-pc">' + '<span></span>' + '<text>正在加载中</text>' + '</div>' + '</div>' + '</div>';
        $('body').append(showHtml);
    },
    hide : function() {
        $('#pageLodding').remove();
    }
}
/**
 * 全局状态保存（版本15已经放弃）
 */
var LS = {
    //帖子类
    __posts__ : ['fid', //当前板块id
    'form_name', //当前板块名字
    'order', //默认帖子列表排序
    'tid', //当前帖子id
    'p', //当前页
    'page_account', //页数
    'subject', //帖子标题
    'hits', //帖子点击量
    'replies' //帖子回复数
    ],
    //板块列表
    __forms__ : ['forms_love' //喜欢的板块列表
    ],

    posts : function(params) {
        for (var k in params) {
            if (!$BS.inArray(k, this.__posts__)) {
                alert(k + ' not allow!');
            }
            localStorage[k] = params[k];
        }
    },
    forms : function(params) {
        for (var k in params) {
            if (!$BS.inArray(k, this.__forms__)) {
                alert(k + ' not allow!');
            }
            localStorage[k] = params[k];
        }
    },
    get : function(param) {
        return localStorage[param];
    }
}

/*
 获取手机信息函数
 * */

function getInfo() {
    //CPU信息
    uexDevice.getInfo('0');
    //系统版本
    uexDevice.getInfo('1');
    //厂商信息
    uexDevice.getInfo('2');
    //键盘信息
    uexDevice.getInfo('3');
    //蓝牙信息
    uexDevice.getInfo('4');
    //wifi信息
    uexDevice.getInfo('5');
    //摄像头信息
    uexDevice.getInfo('6');
    //GPS信息
    uexDevice.getInfo('7');
    //GPRS信息
    uexDevice.getInfo('8');
    //获取触屏信息
    uexDevice.getInfo('9');
    //IMEI信息
    uexDevice.getInfo('10');
    //网络状态
    uexDevice.getInfo('13');
    //硬盘空间
    uexDevice.getInfo('14');
    //运营商名称
    uexDevice.getInfo('15');
    //MAC地址
    uexDevice.getInfo('16');
    //设备token
    uexDevice.getInfo('11');
    //SoftToken
    uexDevice.getInfo('20');
    //硬件型号
    uexDevice.getInfo('17');
    //手机分辨率
    uexDevice.getInfo('18');

    uexDevice.onOrientationChange = function(mode) {
        if (mode == 1) {
            document.getElementById('data').innerHTML = "正竖屏";
        } else if (mode == 2) {
            document.getElementById('data').innerHTML = "左横屏";
        } else if (mode == 4) {
            document.getElementById('data').innerHTML = "倒竖屏";
        } else if (mode == 8) {
            document.getElementById('data').innerHTML = "右横屏";
        }
    };

    uexDevice.cbGetInfo = function(opCode, dataType, data) {
        var device = eval('(' + data + ')');

        var cpuFrequency = device.cpu;
        if (cpuFrequency != null && cpuFrequency.length > 0) {
            localStorage['cpuinfo'] = cpuFrequency;
        }

        var osVersion = device.os;
        if (osVersion != null && osVersion.length > 0) {
            localStorage['osver'] = osVersion;
        }
        var manufacturer = device.manufacturer;
        if (manufacturer != null && manufacturer.length > 0) {
            localStorage['manufacturer'] = manufacturer;
        }

        var keyboard = device.keyboard;
        if (keyboard != null && keyboard.length > 0) {
            localStorage['keyboard'] = keyboard;
        }

        var bluetooth = device.blueTooth;
        if (bluetooth != null && bluetooth.length > 0) {
            localStorage['bluetooth'] = bluetooth;
        }

        var wifi = device.wifi;
        if (wifi != null && wifi.length > 0) {
            localStorage['wifi'] = wifi;
        }
        var camera = device.camera;
        if (camera != null && camera.length > 0) {
            localStorage['camera'] = camera;
        }

        var gps = device.gps;
        if (gps != null && gps.length > 0) {
            localStorage['gps'] = gps;
        }
        var gprs = device.gprs;
        if (gprs != null && gprs.length > 0) {
            localStorage['gprs'] = gprs;
        }

        var touch = device.touch;
        if (touch != null && touch.length > 0) {
            localStorage['touch'] = touch;
        }

        var imei = device.imei;
        if (imei != null && imei.length > 0) {
            localStorage['imei'] = imei;
        }
        var deviceToken = device.deviceToken;
        if (deviceToken != null && deviceToken.length > 0) {
            localStorage['deviceToken'] = deviceToken;
        }

        var softToken = device.softToken;
        if (softToken != null && softToken.length > 0) {
            localStorage['softToken'] = softToken;
        }

        var connectStatus = device.connectStatus;
        if (connectStatus != null && connectStatus.length > 0) {
            if (connectStatus == -1) {
                localStorage['connectStatus'] = "0";
            } else if (connectStatus == 0) {
                localStorage['connectStatus'] = "1";
            } else if (connectStatus == 1) {
                localStorage['connectStatus'] = "3";
            } else if (connectStatus == 2) {
                localStorage['connectStatus'] = "2";
            }
        }
        var restDiskSize = device.restDiskSize;
        if (restDiskSize != null && restDiskSize.length > 0) {
            //alert("RestDiskSize:" + restDiskSize);
            localStorage['restDiskSize'] = restDiskSize;
        }
        var operatorName = device.mobileOperatorName;
        if (operatorName != null && operatorName.length > 0) {
            //alert("mobileOperatorName:" + operatorName);
            localStorage['mobileOperatorName'] = operatorName;
        }

        var macAddress = device.macAddress;
        if (macAddress != null && macAddress.length > 0) {
            localStorage['macAddress'] = macAddress;
        }

        var deviceToken = device.deviceToken;
        if (deviceToken != null && deviceToken.length > 0) {
            localStorage['deviceToken'] = deviceToken;
        }
        var model = device.model;
        if (model != null && model.length > 0) {
            localStorage['model'] = model;
        }
        var resolutionRatio = device.resolutionRatio;
        if (resolutionRatio != null && resolutionRatio.length > 0) {
            localStorage['resolutionRatio'] = resolutionRatio;
        }

    }
    uexWidgetOne.cbError = function(opCode, errorCode, errorInfo) {
        //alert(errorInfo);
    }
}
