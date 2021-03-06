define("chart/widgetFramework/core/mixins/barDrawingUtils",["jquery","d3","lodash","chartutil/d3utils","chartutil/stringutils","util/Functional"],function(f,e,b,d,g,c){var a={};
a.chartWidth=500;a.chartHeight=200;a.transitionTime=500;a.delayTime=0;a.delayStackedTime=500;a.barSelectorStr=".bar";a.barClassStr="bar";
a.offsetVerticalBars=true;a.offsetHorizontalBars=true;a.containerBarsHorizontal=function(k,i,p,h){var r=this.transitionTime;
var n=this.delayTime;var j;if(typeof p==="function"){j=p;}else{j=function(s){return s[p];};}var q=k.selectAll(this.barSelectorStr).data(i,j);
var l=q.transition().duration(r).delay(n).attr("transform",function(u,s){var t=h(u,s);return"translate(0,"+t+")";});var o=q.enter().append("g").attr("class",this.barClassStr).attr("transform",function(u,s){var t=h(u,s);
return"translate(0,"+t+")";});var m=q.exit();m.selectAll("rect").transition().duration(r).attr("width",0).style("opacity",0);
m.transition().duration(0).delay(r).remove();this.bars={bar:q,enter:o,update:l,exit:m};return this;};a.barHorizontal=function(n,k,i,j,l){var h=this.transitionTime;
var m=this.delayTime;if(!l){l=this.bars;}l.update.select("rect").each(function(o){e.select(this).classed({"--negative":(o[n]<0),"--positive":o[n]>=0});
}).transition().duration(h).delay(m).attr("x",function(o){return k(Math.min(0,o[n]));}).attr("height",i).attr("width",function(o){return Math.abs(k(o[n])-k(0));
});l.enter.append("rect").attr("class",function(o){if(j&&j!==""){return g.lowerCaseReplaceSpace(o[j],"-");}else{if(o.name){return g.lowerCaseReplaceSpace(o.name,"-");
}}}).each(function(o){e.select(this).classed({"--negative":(o[n]<0),"--positive":o[n]>=0});}).attr("x",function(o){return k(0);
}).attr("width",0).attr("height",i).transition().duration(h).delay(2*m).attr("x",function(o){return k(Math.min(0,o[n]));}).attr("width",function(o){return Math.abs(k(o[n])-k(0));
});l.exit.select("rect").transition().duration(h).attr("width",0).style("opacity",0).remove();};a.stackHorizontal=function(i,q,u,j,l,o){var t=this.transitionTime;
var s=this.delayStackedTime;var p=this.delayTime;var w;if(typeof i==="function"){w=i;}else{w=function(x){return x[i];};}var k;
if(typeof q==="function"){k=q;}else{k=function(x){return x[q];};}var m=(this.offsetHorizontalBars===true)?-j/2:0;if(!o){o=this.bars.bar;
}var r=o.selectAll("rect").data(w,k);var n=r.transition("resize").duration(t).delay(p).attr("height",j).attr("transform",function(){return"translate(0,"+m+")";
}).attr("x",function(x){return u(x.startX);}).attr("y",0).attr("width",function(x){return u(x.endX)-u(x.startX);});var v=r.enter().append("rect").attr("class",function(x){if(l&&l!==""){return"stack "+g.lowerCaseReplaceSpace(x[l],"-");
}else{if(x.name){return"stack "+g.lowerCaseReplaceSpace(x.name,"-");}else{return"stack";}}}).style("fill",function(x){return x.color;
}).attr("transform",function(){return"translate(0,"+m+")";}).attr("height",j).attr("x",function(x){return u(x.startX);}).attr("y",0).attr("width",0).transition().duration(t).delay(function(y,x){return 2*p+(x*s);
}).attr("width",function(x){return u(x.endX)-u(x.startX);});var h=r.exit().transition().duration(t).attr("width",0).style("opacity",0).remove();
this.stacks={stack:r,enter:v,update:n,exit:h};return this;};a.fullBarHorizontal=function(h,i,k){var j=this;if(!k){k=this.bars;
}k.update.select("rect").attr("height",h).attr("width",j.chartWidth);k.enter.append("rect").attr("data-id",function(l){if(typeof l[i]!=="undefined"){return g.lowerCaseReplaceSpace(l[i],"-");
}}).attr("height",h).attr("width",j.chartWidth);k.exit.select("rect").remove();return this;};a.containerBarsVertical=function(k,i,p,h){var r=this.transitionTime;
var n=this.delayTime;var j;if(typeof p==="function"){j=p;}else{j=function(s){return s[p];};}var q=k.selectAll(this.barSelectorStr).data(i,j);
var l=q.transition().duration(r).delay(n).attr("transform",function(t,s){var u=h(t,s);return"translate("+u+",0)";});var o=q.enter().append("g").attr("class",this.barClassStr).attr("transform",function(t,s){var u=h(t,s);
return"translate("+u+",0)";});var m=q.exit();m.selectAll("rect").transition().duration(r).attr("height",0).attr("y",this.chartHeight).style("opacity",0);
m.transition().duration(0).delay(r).remove();this.bars={bar:q,enter:o,update:l,exit:m};return this;};a.barVertical=function(o,h,p,i,k){var m=this;
var n=this.transitionTime;var l=this.delayTime;var j=(this.offsetVerticalBars===true)?-p/2:0;if(!k){k=this.bars;}k.update.select("rect").each(function(q){e.select(this).classed({"--negative":(q[o]<0),"--positive":q[o]>=0});
}).transition().duration(n).delay(l).attr("width",p).attr("transform","translate("+j+",0)").attr("y",function(q){return h(Math.max(0,q[o]));
}).attr("height",function(q){return Math.abs(h(q[o])-h(0));});k.enter.append("rect").attr("class",function(q){if(i&&i!==""){return g.lowerCaseReplaceSpace(q[i],"-");
}else{if(q.name){return g.lowerCaseReplaceSpace(q.name,"-");}}}).each(function(q){e.select(this).classed({"--negative":(q[o]<0),"--positive":q[o]>=0});
}).attr("width",p).attr("transform","translate("+j+",0)").attr("y",function(q){return h(0);}).attr("height",0).transition().duration(n).delay(2*l).attr("y",function(q){return h(Math.max(0,q[o]));
}).attr("height",function(q){return Math.abs(h(q[o])-h(0));});k.exit.select("rect").transition().duration(n).attr("height",0).attr("y",m.chartHeight).style("opacity",0).remove();
return this;};a.stackVertical=function(i,q,j,w,l,o){var t=this.transitionTime;var p=this.delayTime;var s=this.delayStackedTime;
var v;if(typeof i==="function"){v=i;}else{v=function(x){return x[i];};}var k;if(typeof q==="function"){k=q;}else{k=function(x){return x[q];
};}var m=(this.offsetVerticalBars===true)?-w/2:0;if(!o){o=this.bars.bar;}var r=o.selectAll("rect").data(v,k);var n=r.transition("resize").duration(t).delay(p).attr("width",w).attr("transform","translate("+m+",0)").attr("x",0).attr("y",function(x){return j(x.endY);
}).attr("height",function(x){return j(x.startY)-j(x.endY);});var u=r.enter().append("rect").attr("class",function(x){if(l&&l!==""){return"stack "+g.lowerCaseReplaceSpace(x[l],"-");
}else{if(x.name){return"stack "+g.lowerCaseReplaceSpace(x.name,"-");}else{return"stack";}}}).attr("transform","translate("+m+",0)").attr("width",w).attr("height",0).attr("x",0).attr("y",function(x){return j(x.startY);
}).transition().duration(t).delay(function(y,x){return 2*p+(x*s);}).attr("y",function(x){return j(x.endY);}).attr("height",function(x){return j(x.startY)-j(x.endY);
});var h=r.exit().transition().duration(t).attr("height",0).attr("x",0).attr("y",function(x){return j(x.startY);}).style("opacity",0).remove();
this.stacks={stack:r,enter:u,update:n,exit:h};return this;};a.multiBarVertical=function(i,q,j,x,l,o){var v=this.transitionTime,p=this.delayTime,u=this.delayStackedTime,r=this,m=(this.offsetVerticalBars===true)?-x/2:0;
var w;if(typeof i==="function"){w=i;}else{w=function(y){return y[i];};}var k;if(typeof q==="function"){k=q;}else{k=function(y){return y[q];
};}if(!o){o=this.bars.bar;}var n=o.selectAll(".multi-bar").data(w,k);var t=n.transition("move").duration(v).delay(p).attr("width",function(y){return y.barWidth*(1-l);
}).attr("transform",function(C,y){var z=C.barWidth;var A=(z-(z*(1-l)))/2;var B=(-(x/2)+A)+(y*z);return"translate("+B+",0)";
});n.transition("grow").duration(v).delay(function(z,y){return p+(y*u);}).attr("y",function(y){return j(y.value);}).attr("height",function(y){return r.chartHeight-j(y.value);
});var s=n.enter().append("rect").attr("class",function(y){return"multi-bar "+y.name;}).attr("transform",function(C,y){var z=C.barWidth;
var A=(z-(z*(1-l)))/2;var B=(-(x/2)+A)+(y*z);return"translate("+B+",0)";}).attr("width",function(y){return y.barWidth*(1-l);
}).attr("height",0).attr("y",r.chartHeight).transition().duration(v).delay(function(z,y){return 2*p+(y*u);}).attr("y",function(y){return j(y.value);
}).attr("height",function(y){return r.chartHeight-j(y.value);});var h=n.exit().transition().duration(v).attr("y",r.chartHeight).attr("height",0).style("opacity",0).remove();
this.multiBars={multiBars:n,enter:s,update:t,exit:h};return this;};a.fullBarVertical=function(j,i,m,l){var n=l||this.chartHeight;
var k=(this.offsetVerticalBars===true)?-j/2:0;if(!m){m=this.bars;}var h=(i&&typeof i!=="undefined"&&i!=="")?"rect."+i:"rect";
m.update.select(h).each(function(q){if(typeof q[i]!=="undefined"){var o=f(e.select(this).node());var p=g.lowerCaseReplaceSpace(q[i],"-");
o.attr("data-id",p);}}).attr("width",j).attr("height",n).attr("y",0).attr("transform","translate("+k+",0)");m.enter.append("rect").each(function(q){if(typeof q[i]!=="undefined"){var o=f(e.select(this).node());
var p=g.lowerCaseReplaceSpace(q[i],"-");o.attr("data-id",p);}}).attr("class",function(){return(i&&typeof i!=="undefined"&&i!=="")?i:null;
}).attr("width",j).attr("height",n).attr("y",0).attr("transform","translate("+k+",0)");m.exit.select("rect").remove();return this;
};a.barPosition=function(j,i,h,k){if(j){if(typeof i!=="number"){if(window.console&&console.log){console.error("### Renders::barPosition:: you are trying to center bars but haven't provided a value for bandWidth");
}return null;}this.offsetVerticalBars=true;this.offsetHorizontalBars=true;return function(m,l){return((i*l)+(i/2));};}else{if(typeof h!=="function"){if(window.console&&console.log){console.error("### Renders::barPosition:: you are trying to place bars along an axis but haven't provided a value for the scale");
}return null;}this.offsetHorizontalBars=false;this.offsetVerticalBars=false;return function(l){return h(l[k]);};}};a.setBarSelectorStr=function(i){this.barSelectorStr=i;
var h=/\./gi;this.barClassStr=i.substring(1).replace(h," ");};return function(){return Object.create(a);};});