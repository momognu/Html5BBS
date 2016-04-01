var WBSin = function(data){
	var self = this;
	if(!data)
		return null;
	self.data = data;
	self.cb = new Object;
	self.opid = 1000;
	return self;
}
var qqcustomercb=null;
function qqloginCallback(d){
	if(qqcustomercb)
		qqcustomercb(d);
}
WBSin.prototype={
	login : function(cb){
		var self = this;	
		qqcustomercb=cb;
		uexWidget.startWidget("10058920",0,"qqloginCallback",JSON.stringify(self.data));
		//uexWidget.startWidget("3845409824",0,"qqloginCallback",JSON.stringify(self.data));
	},
	logout : function(){
		if(localStorage.sinaacctoken){
			localStorage.removeItem("sinaacctoken");
			localStorage.removeItem("sinatokenexp");
		}
	},
	checkLogin : function(){
		if(!localStorage.sinaacctoken){
			return false;
		}
		var cut =  parseInt((new Date().getTime())/1000);
		var lt = parseInt(localStorage.sinatokenexp)+parseInt(localStorage.sinacurrentime) - cut;
		if(lt<50){
			return false;
		}
		else
			return true;
	},
	request : function(url,cbfun,params,method){
		var self = this;
		if(!localStorage.sinaacctoken){
			self.login();
			return;
		}
		var cut =  parseInt((new Date().getTime())/1000);
		var lt = parseInt(localStorage.sinatokenexp)+parseInt(localStorage.sinacurrentime) - cut;
		if(lt<50){
			self.login();
			return;
		}
		self.opid++;
		self.cb[self.opid] = cbfun;
		var rurl = "https://api.weibo.com/2/"+url;
		rurl +=".json?access_token="+localStorage.sinaacctoken;
		for(var i in params){
			rurl +="&"+i+"="+params[i];
		}	
		uexLog.sendLog(rurl);
		self.xmlHttp(self.opid,method,rurl);
	},
	onDataFun : function(opId,status,data){
		var self = uexWindow.obj;

		if(status==1){
			self.cb[opId](data);
			delete self.cb[opId];
			
		}
	},
	xmlHttp : function(inXmlHttpID,inMethods,inUrl){
    	var self = this;
    	uexWindow.obj = self;
		uexXmlHttpMgr.onData = self.onDataFun;
		inMethods = inMethods.toLowerCase();
		if(inMethods=="post"){
	  		var pars = self.urlParse(inUrl);
	  		var urls = inUrl.split("?");
	  		uexXmlHttpMgr.open(inXmlHttpID,inMethods,urls[0],"60000");
	  		for(var i in pars.keys){
	  			if(pars.keys[i]=='pic')
	  				uexXmlHttpMgr.setPostData(inXmlHttpID,'1',pars.keys[i],pars[pars.keys[i]]);
	  			else
	  				uexXmlHttpMgr.setPostData(inXmlHttpID,'0',pars.keys[i],pars[pars.keys[i]]);
	  		}
	  	}
	  	else
	  		uexXmlHttpMgr.open(inXmlHttpID,inMethods,inUrl,"6000");
	  	uexXmlHttpMgr.send(inXmlHttpID);
    },
    urlParse : function(url){
		var params = {};
		var loc = String(url);
		//console.log(url);
		var pieces = loc.substr(loc.indexOf('?') + 1).split('&');
		params.keys = [];
		for (var i = 0; i < pieces.length; i += 1) {
			var keyVal = pieces[i].split('=');
			params[keyVal[0]] = decodeURIComponent(keyVal[1]);
			params.keys.push(keyVal[0]);
		}
		return params;
	}
}