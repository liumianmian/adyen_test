define("charts/acquirerConversion/js/views/app",["jquery","underscore","backbone","charts/acquirerConversion/js/models/appstate","chartlib/chartLoadQueue","chartlib/ui/collapsiblePanel","charts/acquirerConversion/js/collections/mapdata","charts/acquirerConversion/js/collections/acquirerData","charts/acquirerConversion/js/collections/acquirerAccountData","chartlib/ui/csvdownload","timeline/views/timelineFacade","timeline/util/timelineConstants","map/views/ui/mappanel","map/views/ui/mapui","map/views/charts/mapchart","charts/acquirerConversion/js/views/charts/requestsChart","charts/acquirerConversion/js/views/charts/requestsRollover","charts/acquirerConversion/js/views/charts/conversionChart","charts/acquirerConversion/js/views/ui/uiBtns","charts/acquirerConversion/js/views/ui/reportConfigUI","chartlib/events/appstateevents","chartlib/chartBaseEvents"],function(e,v,b,j,w,i,d,u,r,f,c,k,m,g,o,t,h,p,a,n,s,l){var q=b.View.extend({el:e("#d3canvas"),deferredArray:[],hasLoadQueue:true,initialize:function(){this._super();
b.on(l.REGISTER_DEFERRED,this.registerDeferred,this);b.on(s.CHANGE_REQUESTED,this.changeState,this);if(this.hasLoadQueue){b.on(s.RENDER_CHARTS,this.hideCover,this);
}this.initModels();this.initCollections();this.initViews();},initModels:function(){this.appState=new j();},initCollections:function(){if(this.hasLoadQueue){this.loadQueue=new w();
}this.mapData=new d();this.acquirerData=new u();this.acquirerAccountData=new r();},initViews:function(){var A=new m({collection:this.mapData,model:this.appState}).render();
var I=new g({collection:this.mapData});var z=new o({collection:this.mapData});var E=new i({el:this.$("[data-view='AcquirerOverview']")});
var y=new t({collection:this.acquirerData,el:e("[data-view='AcquirerRequestsChart']")});var H=new h({collection:this.acquirerData,el:e("[data-view='AcquirerRequestsRolloverChart']")});
var C=new p({collection:this.acquirerData,el:e("[data-view='AcquirerConversionChart']")});var x=new a({collection:this.acquirerData,el:e("[data-view='AcquirerUI']")});
var B=new i({el:this.$("[data-view='AcquirerAccountOverview']")});var G=new t({collection:this.acquirerAccountData,el:e("[data-view='AcquirerAccountRequestsChart']")});
var F=new h({collection:this.acquirerAccountData,el:e("[data-view='AcquirerAccountRequestsRolloverChart']")});var D=new p({collection:this.acquirerAccountData,el:e("[data-view='AcquirerAccountConversionChart']")});
var J=new a({collection:this.acquirerAccountData,el:e("[data-view='AcquirerAccountUI']")});new f({el:".world-csvdownload",collection:this.mapData});
new f({el:".acquirer-csvdownload",collection:this.acquirerData});new f({el:".acquirer-account-csvdownload",collection:this.acquirerAccountData});
this.timeline=new c({version:7,timeCollectionMode:k.__LAST_FULL,formatPeriod:k.__DAY_FORMAT,baseGranularity:k.__DAY_GRANULARITY,calendar:true,controls:true,presets:false,loadQueue:this.hasLoadQueue,config:false,chartGranularity:k.__MINUTE_FORMAT,forceCET:false});
this.configUI=new n();this.appState.addConfig({timeline:this.timeline,config:this.configUI,hasMap:true});},changeState:function(){this.coverFade(0,0.35);
this.deferredArray=[];},registerDeferred:function(z,x,y){var A=this;var B=this.deferredArray;B.push(z);z.done(function(D,C){A.checkDeferredsCallback(B);
}).fail(function(D,C){A.checkDeferredsCallback(B);});},checkDeferredsCallback:function(x){var y=v.every(x,function(z){return z.state()==="resolved"||z.state()==="rejected";
});if(y){this.dataAttempted(x);}},dataAttempted:function(x){var y=this;if(!this.hasLoadQueue){setTimeout(function(){b.trigger(l.DATA_LOADED);
y.hideCover();},10);}else{b.trigger(l.DATA_LOADED);}},hideCover:function(){this.coverFade(500,1);var x=(typeof window.SVGElement!=="undefined");
if(!x){e("#ie8_d3CanvasCover").hide();}},coverFade:function(x,y){this.$el.css("pointer-events","auto").fadeTo(x,y).find("svg rect","svg text").css("pointer-events","auto");
}});return q;},function(a){if(window.console&&console.log){console.log("APP JS ERROR =",a);}});