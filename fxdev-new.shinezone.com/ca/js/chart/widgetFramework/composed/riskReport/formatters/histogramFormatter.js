define("chart/widgetFramework/composed/riskReport/formatters/histogramFormatter",["jqueryExtended","underscore","d3","util/Functional","chartutil/domUtils"],function(f,b,d,c,e){var a=function(j,g,i){var h={};
h.data=j;h.options=g;h.formattedData={};h.comparator=null;h.reverseDirection=false;h.sortKey=null;h.timeline=i;h.formatData=function(){if(c.falsy(this.data.fraudScoreDistribution)){return[];
}var q=this.data.fraudScoreDistribution;var s=[];var n=this.options.range[0];var l=this.options.range[1];var k=(l-n)/this.options.numBins;
var p=this.options.count;b.each(q,function(v){var u=v[h.options.accessor];if(u>=n&&u<=l){var t={dx:1,x:u,y:v[p]};s.push(t);
}});var o=d.range(n,l,k);var m=d.layout.histogram().range(h.options.range).bins(h.options.numBins)(o);var r=[];b.each(m,function(v){var t={x:v.x,dx:v.dx,y:0};
var w=v.x+v.dx;var u=v.x;b.each(s,function(x){if(x.x<w&&x.x>=u){t.y+=x.y;}});r.push(t);});this.formattedData=r;if(window.console&&console.log){console.log("### histogramFormatter::formatData:: this.formattedData=",this.formattedData);
}return{chartData:this.formattedData};};h.sortData=function(k){this.sortKey=k;this.reverseDirection=!this.reverseDirection;
var l=b.sortBy(this.formattedData,k);if(this.reverseDirection){l.reverse();}this.formattedData=l;return{chartData:this.formattedData};
};h.compareFunction=function(k){return k[this.sortKey];};h.downloadCSV=function(){var m=this.createObjectForCSV();var k=["fraudScore","chargebacks"];
var l=["Fraud score","Chargebacks (tx)"];e.createCSV(m,k,l,"FraudScoreDistributionOfChargebacks");};h.createObjectForCSV=function(){var k=b.map(this.formattedData,function(l){var m={chargebacks:l.y};
m.fraudScore=String(l.x)+" to "+String(l.x+(l.dx-1));return m;});return k;};h.getData=function(){return(this.data)?this.data:this.formatData();
};h.setRawData=function(k){this.data=k;};h.retrieveData=function(k){return this.data[k];};return h;};return a;});