define("chart/widgetFramework/core/ViewCreatorUpdateable",["jqueryExtended","json","chart/widgetFramework/core/constants/DataConstants","chart/widgetFramework/core/constants/UIConstants","underscore","util/Functional","chart/widgetFramework/core/drivers/observableCode","chart/widgetFramework/core/uiComponentsFetcher","chartutil/domUtils"],function(a,o,k,m,p,g,b,c,l){var e=false;
var n="color:blue;font-size:1em";var d=false;var i="color:green;font-size:1em";var j=false;var f=false;var h=function(q){var r={};
b(r,"viewCreator");r.init=function(){p.bindAll(this,"onNotifiedDataFormatted");this.$el=q.getNode();this.id=this.$el.attr("id");
if(!this.id){this.id=this.$el.attr("data-id");}var y=this.parameters=this.getParameters(q);this.chartOptions=this.parameters.options||{};
q.getNode()[0].__view=this;var v=this.$el.find('[data-widget="chart/widgetFramework/core/AxisComponentUpdateable"]');this.reconfigureAxesStr="";
if(v.length===2){this.reconfigureAxesStr="xy";}else{if(v.length===1){var u=o.parse(a(v[0]).attr("data-options"));this.reconfigureAxesStr=u.orientation;
}}if(this.reconfigureAxesStr.length===0){if(window.console&&console.log){console.warn("### ViewCreatorUpdateable::init:: YOU ARE USING AN 'UPDATEABLE' CHART TYPE WITHOUT ANY UPDATEABLE AXES - IS THIS CORRECT? ");
}}if(window.console&&console.log&&e){console.log("%c\n################",n);console.log("%c### INIT STAGE :: VizComp::"+this.id+":: INIT",n);
console.log("%c################",n);}var A=y.formatterName;var s=a("#"+A);s.widget().then(function(B){r.Formatter=B.instance;
if(window.console&&console.log&&f){console.log("### ViewCreator2:: registering observer on formatter:: ");}r.Formatter.registerObserver(r.onNotifiedDataFormatted,false,r.id);
},function(){if(window.console&&console.warn){console.warn("VizComp:: Error loading dataFormatter",arguments);}});var w=y.timeline;
var x=(w&&w.indexOf("#")===-1)?a("#"+w):a(w);if(x.length){if(window.console&&console.log&&f){console.log("### ViewCreator2::init:: getting timeline promise----");
}x.widget().then(function(B){var C=B.instance;C.renderPromise.done(function(){r.timeline=C.timeline;});},function(){if(window.console&&console.warn){console.warn("VizComp:: Error loading timelineObject",arguments);
}});}this.chartStore={};var t=this.parameters.options.type;var z=(this.parameters.options.template||"defaultTemplate")+".html";
r.resolvedRequire=false;r.hasData=false;this.currentChartType="noChartnoChartnoChart";if(g.notFalsy(t)){r.requireChartType(t,z);
}};r.requireChartType=function(y,w){if(window.console&&console.log&&e){console.log("### ViewCreatorUpdateable::requireChartType:: pChartType=",y);
console.log("### ViewCreatorUpdateable::requireChartType:: this.chartStore[this.currentChartType]=",this.chartStore[this.currentChartType]);
}var x,t,v=y.substring(y.lastIndexOf("/")+1);if(!this.chartStore[v]){x="."+this.currentChartType;t=this.$el.find(x);t.css("display","none");
this.resolvedRequire=false;require(["chart/widgetFramework/"+y,"text!chart/widgetFramework/"+w],function(z,A){if(window.console&&console.log&&e){console.log("%c\n################",n);
console.log("%c### INIT STAGE :: VizComp::"+r.id+"::REQUIRE Chart= "+y,n);console.log("%c### INIT STAGE :: VizComp::"+r.id+"::REQUIRE Template= "+w,n);
console.log("%c################",n);}r.chart=null;r.currentChartType=v;r.ChartRef=z;r.TemplateRef=A;r.resolvedRequire=true;
r.checkReady("require");if(r.requirePromise){r.requirePromise.resolve();}},function(z){if(window.console&&console.log){console.log("VizComp:: widget Require error: ",z);
}});}else{x="."+this.currentChartType;t=this.$el.find(x);t.css("display","none");this.currentChartType=v;var u="."+this.currentChartType;
var s=this.$el.find(u);s.css("display","inline");this.chart=this.chartStore[v];r.checkReady("require");if(r.requirePromise){this.requirePromise.resolve();
}}};r.invalidateData=function(){this.hasData=false;};r.getRequirePromise=function(){this.requirePromise=new a.Deferred();
return this.requirePromise;};r.checkReady=function(s){if(this.resolvedRequire&&this.hasData){this.createChart();}};r.onNotifiedDataFormatted=function(t,s){switch(t.changeObject.type){case k.DATA_FORMATTED:case k.RETRIEVED_DATA:case k.SORTED_DATA:case k.REFORMATTED_DATA:case k.NEW_DATA_AVAILABLE:if(g.falsy(t.changeObject.silentFormat)){this.data=t.changeObject.data;
this.hasData=true;this.checkReady("data");}break;}};r.createChart=function(){var s;if(!g.existy(this.chart)){var t=g.existy(this.timeline)?this.timeline:null;
this.chart=new this.ChartRef(this.chartOptions,this.$el[0],t,this.TemplateRef);this.chart.chartType=this.currentChartType;
this.chartStore[this.currentChartType]=this.chart;this.chart.init(this.chartOptions,this.$el[0]);s=this.chart.feedData(this.data);
this.$el.on(m.CHART_TO_VIEW_EVENT,p.bind(this.onChartToWidgetEvent,this));this.setProperty("changeObject",{type:m.CHART_INITIALISED,data:this.chart});
this.chart.initRender();this.chart.topSVG.classed("bounds",true);if(s!==k.HALT_RENDER_PROCESS){this.chart.render();}this.setProperty("changeObject",{type:m.CHART_FIRST_RENDER,data:this.chart});
var u=c(this.chartOptions,this.$el[0],function(y){for(var x=0;x<y.length;x++){if(y[x]&&y[x].type==="tooltip"){var w=y[x].module;
var v=y[x].options;r.chart.setupTooltip(w,v);}}});l.removeDataAtrributes(this.$el,["options"]);}else{s=this.chart.feedData(this.data);
if(this.reconfigureAxesStr.length>0){this.chart.createOptions(this.chartOptions);this.chart.createDimensionStorageObjects(this.reconfigureAxesStr);
this.setProperty("changeObject",{type:m.CHART_UPDATED,data:this.chart});this.chart.reset();}if(s!==k.HALT_RENDER_PROCESS){this.chart.render();
if(typeof this.chart.setTooltipsOnElements==="function"){this.chart.setTooltipsOnElements();}}}};r.getInstance=function(){return this.chart;
};r.onChartToWidgetEvent=function(t,s){if(window.console&&console.log&&j){console.log("\n################ ");console.log("### ViewCreator::"+this.id+" onChartEvent:: e=",t);
console.log("### ViewCreator::"+this.id+" onChartEvent:: pData=",s);console.log("################ ");}this.$el.trigger(s.type,s);
this.setProperty("changeObject",s);};r.getParameters=function(s){var v=s.getNode().data();var t;if(p.keys(v).length){t=v;
}else{s.parameters.options=a.parseJSON(s.parameters.options);t=s.parameters;}var u={};if(p.keys(t).length){u.formatterName=t.formatter;
u.options=t.options;if(!g.existy(u.options.margin)){u.options.margin={};}u.timeline=t.timeline;}else{throw"The parameters are not well defined"+t;
}return u;};r.init();if(window.console&&console.log&&f){console.log("\n### ViewCreator2::constructor:: calling pWidgetApi.ready()");
}q.ready();return r;};return h;});