define("chart/widgetFramework/composed/chargebackReport/countryBarChart",["jquery","underscore","d3","chart/widgetFramework/core/mixins/formats","hogan","util/Functional","util/ObjectSuper","chartutil/numberutils","chart/widgetFramework/core/constants/UIConstants","chart/widgetFramework/chartTypes/barChart"],function(c,i,k,b,f,a,g,j,h,e){function d(q,l,o){var n;
var p={};var m=i.defaults(p,q);n=e(m,l,o);var s=g(n);var r=false;n.init=function(){s.init();n.maxRowsForBrush=(this.options.numBars&&this.options.numBars>0)?this.options.numBars:10;
};n.initRender=function(){s.initRender();setTimeout(function(){if(!r&&n.options.ranked){n.chartGroup.classed("barchart-ranked",true);
}r=true;},100);n.textScale=k.scale.linear().domain([8,50]).range([11,5]).clamp(true);var t=n.mainGroup.append("defs");t.append("clipPath").attr("id","clip-bars-country").append("rect").attr("width",n.options.width-n.options.margin.left-n.options.margin.right).attr("height",n.options.height-n.options.margin.top-n.options.margin.bottom);
t.append("clipPath").attr("id","clip-y-axis-country").append("rect").attr("clipPathUnits","objectBoundingBox").attr("x","-100%").attr("width","100%").attr("height",((n.options.height-n.options.margin.top-n.options.margin.bottom)/(n.options.height)*100)+"%");
};n.render=function(){n.showCharts();n.doBrush=n.data.length>n.maxRowsForBrush;n.barUtils.transitionTime=n.doBrush?0:500;
n.barUtils.delayTime=n.doBrush?0:500;var u=this.$el.width();n.height=n.options.height-(n.options.margin.top+n.options.margin.bottom);
var t=n.height+n.options.margin.top+n.options.margin.bottom;n.topSVG.attr("width",u+"px").attr("height",t+"px");k.select("#"+n.$el[0].id).transition().duration(500).style("height",t+"px");
if(n.doBrush){n.chartGroup.attr("clip-path","url(#clip-bars-country)").style("clip-path","url(#clip-bars-country)");n.axisGroup.select(".y.axis").attr("clip-path","url(#clip-y-axis-country)").style("clip-path","url(#clip-y-axis-country)");
}else{n.scales[n.options.yAttr].rangeBands([n.height,0],n.options.barPadding);n.axisGroup.selectAll(".y.axis text").style("font-size",null);
}this.update();};n.scrolling=function(){var t=n.options.variation==="horizontal"?k.event.deltaY:k.event.deltaX;this.$el.trigger(h.CHART_TO_VIEW_EVENT,{type:"countryBarChartScroll",data:t});
};n.updateScale=function(t){n.scales[n.options.yAttr].rangeBands(t.newScale,n.options.barPadding);n.axisGroup.selectAll(".y.axis text").style("font-size",n.textScale(t.numSelected));
var u=k.max(n.data,function(v){return t.selected.indexOf(v[n.options.yAttr])>-1?v[n.options.xAttr]:0;});this.maxXScale=u;
n.update();};n.setBandSizes=function(){if(n.doBrush){n.barSize=n.vertBarSize=n.scales[n.options.yAttr].rangeBand();n.bandSize=n.barSize*(1+n.options.barPadding);
}else{s.setBandSizes();}};return n;}return d;});