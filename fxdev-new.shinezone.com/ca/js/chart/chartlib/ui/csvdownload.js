define("chartlib/ui/csvdownload",["jquery","underscore","backbone","chartlib/events/appstateevents","map/collections/mapdata"],function(e,b,f,c,d){var a=f.View.extend({baseURL:adyen.base+"ca/download/reports/chartCSV.shtml",targetURL:"",events:{click:"onClick"},urlParamProps:["region","ccs","granularity","bdate","edate"],initialize:function(){b.bindAll(this,"setDownloadURL","onClick");
f.on(c.STATE_CHANGED,this.setDownloadURL);},setDownloadURL:function(h){var g=b.pick(h.attributes,this.urlParamProps);if(this.collection instanceof d){g.statsType=h.get("statsType");
}else{g.statsType=this.collection.statsType;}g.exportcsv=true;this.targetURL=this.baseURL+"?"+e.param(g);},onClick:function(g){window.location=this.targetURL;
},addUrlParamProps:function(g){this.urlParamProps=this.urlParamProps.concat(g);}});return a;});