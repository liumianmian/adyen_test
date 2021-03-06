define("charts/acquirerConversion/js/collections/acquirerData",["jquery","underscore","backbone","charts/acquirerConversion/js/models/conversion","chartlib/events/appstateevents","chartlib/chartBaseEvents","chartutil/numberutils"],function(f,b,h,a,d,g,e){var c=h.Collection.extend({model:a,reverseDirection:true,conversionTypes:["Authorised","Refused"],hasParsedData:false,hasData:false,statsType:"CONVERSION_PER_ACQUIRER",initialize:function(j,i){b.bindAll(this,"parse","loadData","onLoaded","onError","getReverseDirection");
h.on(d.STATE_CHANGED,this.loadData);this.listenTo(this,"error",function(){this.trigger(g.DATA_FAILED);});this.comparator=this.compareFunction;
this.sortKey="percentage";},loadData:function(i){this.loaded=f.Deferred();this.hasParsedData=false;this.hasData=false;this.url=this.getUrl(i);
this.url+="&cb="+new Date().getTime();this.fetch({reset:true});},getUrl:function(k){var i=b.pick(k.attributes,"statsType","region","ccs","granularity","bdate","edate","pmms","sis","threed");
i.statsType=this.statsType;var j=k.get("label").toLowerCase();if(j.length){j=j+"/";}if(k.get("stub")){return adyen.jsbase+"/chart/charts/acquirerConversion/dummy-data/"+j+"conversion_per_acquirer.xml?"+new Date().getTime();
}else{return k.get("url")+f.param(i);}},fetch:function(i){i||(i={});i.dataType="xml";i.success=this.onLoaded;i.error=this.onError;
this._super(i);h.trigger(g.REGISTER_DEFERRED,this.loaded,"AcquirerConversionChartData",this);},parse:function(m){this.xmlData=m;
var j=f(this.xmlData).find("set");this.volDict={};var l=this,k;var i=0;j.each(function(p,s){var r=f(s);var o=r.attr("toolText").match(/,\s([^)]+),/)[1];
var n=r.attr("toolText").match(/([^,]+)/)[0].toLowerCase();var q=r.attr("toolText").match(/\(([^)]+)\)/)[0];q=Number(q.match(/\d+/g)[0]);
i=i+q;l.volDict[o]||(l.volDict[o]=new a());l.volDict[o].set("name",o);l.volDict[o].set("total",l.volDict[o].get("total")+Math.max(0,+q));
l.volDict[o].get("conversionRates").push({name:n,value:Math.max(0,+q)});l.volDict[o].set("percentInArray",[]);});b.each(this.volDict,function(p,n){p.set("percentage",(p.get("total")/i));
var o=p.get("percentInArray");o.push({percText:e.decimalFormatter((p.get("total")/i)*100,2)+"%"});});this.volDict=b.toArray(this.volDict);
this.hasParsedData=true;if(this.volDict.length){this.hasData=true;this.sortBy("percentage");}else{this.trigger(g.DATA_FAILED);
return null;}return this.volDict;},onError:function(k,i,j){this.loaded.reject(i);},onLoaded:function(){this.loaded.resolve();
},getReverseDirection:function(){return this.reverseDirection;},sortBy:function(j,i){var k=this;this.sortKey=j;this.sortSubKey=i;
this.comparator=this.compare;this.reverseDirection=!this.reverseDirection;if(this.sortSubKey){f(this.models).each(f.proxy(function(n,m){var o=m.get(k.sortKey);
var p=b.findWhere(o,{name:k.sortSubKey});var l=o.indexOf(p);o.splice(0,0,o.splice(l,1)[0]);},this));}this.sort();},compare:function(k,i){var l=k.get(this.sortKey),j=i.get(this.sortKey);
if(this.sortSubKey){var n=b.findWhere(l,{name:this.sortSubKey});var m=b.findWhere(j,{name:this.sortSubKey});var l=n.value/k.get("total");
var j=m.value/i.get("total");}if(this.reverseDirection){if(l>j){return -1;}if(j>l){return 1;}return 0;}else{if(l<j){return -1;
}if(j<l){return 1;}return 0;}}});return c;});