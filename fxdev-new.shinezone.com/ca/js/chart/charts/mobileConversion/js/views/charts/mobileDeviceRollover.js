define("charts/mobileConversion/js/views/charts/mobileDeviceRollover",["jquery","underscore","backbone","d3","chartlib/barchart","charts/mobileConversion/js/models/mobile","chartlib/events/appstateevents","chartutil/numberutils","chartutil/backbone/CollectionUtils","text!chart/charts/mobileConversion/js/views/templates/tooltip.html","hogan"],function(e,k,j,l,b,d,f,i,h,a,g){var c=b.extend({defaults:{yScale:"ordinal",totalLabelOffset:5,margin:{top:0,left:140,bottom:30,right:30},barPadding:0,xAttr:"avgTxVal",yAttr:"name",joinAttr:"name",tooltip:true},mobileTotal:0,tooltipTemplate:window.Hogan.compile(a),initialize:function(){var m=this;
this._super();this.$el.mousemove(function(n){m.updateTooltipPos(n.pageX);});},addListeners:function(){j.on(f.RENDER_CHARTS,this.render);
if(this.collection){this.listenTo(this.collection,"sort",this.render);}},calibrateXScale:function(){var m=[];this.collection.forEach(function(n){if(n.get("name").toLowerCase()!=="total"){m.push(Number(Number(n.get("avgTxVal")).toFixed(2)));
}});this.scales.x.domain([0,l.max(m)]).rangeRound([0,this.width]).nice();},setYScale:function(){this._super();this.scales.y.rangeRoundBands([this.height,0],this.options.barPadding);
},renderYAxis:function(){},renderXAxis:function(){},renderTooltipContent:function(n){this.tip.direction("n");this.tip.offset([-10,0]);
var m=this.tooltipTemplate.render({name:n.get("name"),percentage:(n.get("percentage")*100).toFixed(2),total:n.get("total"),avgTxVal:n.get("avgTxVal")});
this.tip.html(m);},renderData:function(){var o=this,m=this.scales.x,q=this.scales.y;var p=this._super();p.bar.select("rect").transition().duration(500).delay(500).ease("cubic-in-out").attr("width",function(){return o.width;
}).attr("height",function(){return q.rangeBand();});var n=this.svg.selectAll(".percentage-label").data(this.collection.models,this.joinData);
},updateTooltipPos:function(m){this.tip.style("left",(m-75)+"px");}});return c;});