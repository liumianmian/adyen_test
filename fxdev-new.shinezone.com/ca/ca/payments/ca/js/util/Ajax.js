define("util/Ajax",["jquery","util/Console","json"],function(i,h,l){var g=h.getLog("util/Ajax");var n={};var d=true;var b={};
try{var a="qWSUBfmto8MMyy3hr4rkqRqCSI6FnnsooZfs9PwEtRydLkzUytCpH2iFpYW2DI1";var m="rBM6Tnzv0DSO4gyHTve09twlffcbWjgQKYETygtJkgF2ZG1TRf8j95yadUVm4y7";
var j="facade://",f=4000;i.ajaxPrefilter(function(e,p,o){if(typeof p[a]==="undefined"){g.warn("Unfiltered ajax request to '"+e.url+"'");
}});i.ajaxTransport("+*",function(e,q,o){if(e.url.substring(0,j.length)!==j){return;}var p;return{send:function(y,v){var s=e.url.substring(j.length).split("?"),w=(s[0]||"").split("/"),x=s[1]||"",z,r;
r=w.pop();z=w.join("/");var t=setTimeout(function(){v(500,"error");},e.timeout||f);require(["util/QueryString",z],function(C,A){if(t){clearTimeout(t);
t=null;}try{e.urlParams=C.parse(x);var u=A[r].call(A,e,q,o);if(u.then&&u.done&&u.fail){u.then(function(D){v(200,"success",{json:D,text:JSON.stringify(D)});
},function(D){v(500,"error",{text:D});});}else{v(200,"success",{json:u,text:JSON.stringify(u)});}}catch(B){g.info("Error while calling function",B.message);
v(500,"error",{text:B.message});}},function(u){g.info("Unable to load class",u);});},abort:function(){if(p){clearTimeout(p);
}}};});var c=function(e,o){o=o||{};o.type=o.type||"GET";o.headers=o.headers||{};o.headers["Accept-Language"]=o.headers["Accept-Language"]||navigator.language;
if(typeof o.sanitation==="function"){var p=o.beforeSend,q=o.dataFilter;o.beforeSend=function(s,r){s[m]=m;if(typeof p==="function"){p(s,r);
}};o.dataFilter=function(s,r){if(typeof q==="function"){s=q(s,r);}return o.sanitation(s);};}o.hash=JSON.stringify([e,o]);
return o;};b.ajax=function(o,p){if(typeof o==="object"){p=o;o=null;}p=c(o,p);var q=p.hash;p[a]=new Date().getTime();if(d&&p.type.toUpperCase()==="GET"){if(typeof n[q]!=="undefined"&&p.datatype!=="script"){if(typeof n[q].cacheIndefinitely!=="undefined"&&n[q].cacheIndefinitely===true){g.warn("Throttle in effect: Repeated infiniteCached request to GET "+p.url);
}else{g.warn("Throttle in effect: Duplicated request to GET "+p.url);}if(typeof p.success==="function"&&typeof n[q]==="object"){n[q].done(p.success);
}return n[q];}}var e=n[q]=(o===null?i.ajax(p):i.ajax(o,p));if(typeof n[q]!=="undefined"){n[q].cacheIndefinitely=n[q].cacheIndefinitely||p.afpCache;
if(typeof n[q]!=="undefined"){n[q].complete(function(){if(typeof n[q]!=="undefined"&&n[q].cacheIndefinitely!==true){delete n[q];
}else{g.info("Infinite cache (afpCache=true) in place for "+(o||p.url));}});}if(typeof n[q]!=="undefined"){n[q].fail(function(){if(typeof n[q]!=="undefined"){delete n[q];
}}).error(function(){if(typeof n[q]!=="undefined"){delete n[q];}});}}else{delete n[q];}return e;};b.autoResponder=function(o,p,e){p=c(o,p);
e.cacheIndefinitely=true;n[p.hash]=e;};b.get=function(p,r,s,o,q,t,e){if(typeof r==="function"){o=s;s=r;r=null;}return b.ajax({url:p,data:r,success:s,dataType:o,sanitation:q,contentType:t,afpCache:e===true});
};b.post=function(p,r,s,o,q,t,e){if(typeof r==="function"){o=s;s=r;r=null;}return b.ajax({type:"POST",url:p,data:r,success:s,dataType:o,sanitation:q,contentType:t,afpCache:e===true});
};b.getScript=function(e,o){return b.ajax({url:e,dataType:"script",success:o});};b.getJSON=function(e,p,o){return b.ajax({url:e,dataType:"json",contentType:"application/json",success:p,sanitation:o});
};i.fn.ajaxLoad=function(r,t,p){var o=i(this),u,s=r.split(" "),q=s.shift(),e=s.join(" ");if(o.length<1){return;}if(typeof t==="function"){p=t;
t=null;}if(typeof t==="object"){u=b.ajax({url:q,method:"POST",data:t});}else{u=b.get(q);}u.then(function(v){if(e){o.html(i(v).find(e));
}else{o.html(v);}if(typeof p==="function"){o.each(p);}},function(v){g.warn("Error while loading data into element: "+v.message);
});return o;};b.isSanitized=function(e){return typeof e[m]!=="undefined";};}catch(k){g.warn(k.getMessage());}return b;});
