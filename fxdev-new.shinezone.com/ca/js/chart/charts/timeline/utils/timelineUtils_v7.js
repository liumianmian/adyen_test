define("timeline/util/timelineUtils_v7",["jquery","chartutil/dateUtils_CET","timeline/util/timelineConstants","chartutil/stringutils"],function(b,e,a,d){var c={};
c.calculateTimeline=function(n,r,u,v,p,g){if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("\n###----------------------------");
window.console.log("### calculateTimeline:: pSelectionStart (desired start date)=",n," ***");window.console.log("### calculateTimeline:: pRoundingFn=",r);
window.console.log("### calculateTimeline::pTimelineMax (max poss. amt)=",u);window.console.log("### calculateTimeline::pLatestMinutesException (undefined=0) =",v);
window.console.log("### calculateTimeline::pJumpPeriod (undefined=false) =",p);window.console.log("###----------------------------\n");
}var f=(typeof p!=="undefined")?p:false;var t=(typeof v!=="undefined")?v:0;var i=this.collection.getValue("formatPeriod");
var y=0;if(this.hasMinStartDates){switch(i){case a.__DAY_FORMAT:if(n<this.minStartDate_day){y=(this.minStartDate_day-n)/a.__MSECS_PER_MINUTE;
n=this.minStartDate_day;}break;case a.__WEEK_FORMAT:if(n<this.minStartDate_week){y=(this.minStartDate_week-n)/a.__MSECS_PER_MINUTE;
n=this.minStartDate_week;}break;}}var o=e[r](n,true,this.weekStartAdj);if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("### calculateTimeline:: timelineCalcReturnObj=",this.timelineCalcReturnObj);
window.console.log("### calculateTimeline:: ROUNDED (",r,") startDate=",o," ***");}var m=(this.collection&&typeof this.collection.getValue("forceCET")!=="undefined")?this.collection.getValue("forceCET"):true;
if(m){var s=this.processDatesForTimezone(o,o,a.__ONE_OFF_ADJUST,false);o=s[0];}this.timelineCalcReturnObj={};if(!f){this.timelineCalcReturnObj.startDate=o;
}else{var j=this.getExtent();var l=new Date(j[0]);var k=new Date(j[1]);var h=g;var w=(f===a.__BACK)?-(h-y):h;switch(f){case a.__END_EXTENT:l=o;
k=e.adjustTime(k,w*+(a.__MSECS_PER_MINUTE));break;case a.__FWD:case a.__BACK:l=e.adjustTime(l,w*+(a.__MSECS_PER_MINUTE));
k=e.adjustTime(k,w*+(a.__MSECS_PER_MINUTE));break;}this.timelineCalcReturnObj.endExtentDate=k;this.timelineCalcReturnObj.startDate=l;
}if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("### calculateTimeline::timelineCalcReturnObj=",this.timelineCalcReturnObj);
}var x=e.adjustTime(o,((u+t)*a.__MSECS_PER_MINUTE));if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("\n### ----------------------------------");
window.console.log("### calculateTimeline: TIMELINE START date=",o," ***");window.console.log("### calculateTimeline: TIMELINE END   date=",x," ***");
window.console.log("\n### calculateTimeline: TIMELINE START date (as utc)=",o.toUTCString());window.console.log("### calculateTimeline: TIMELINE END date (as utc)=",x.toUTCString());
window.console.log("### calculateTimeline: TIMELINE END (",(((u+t)))," minutes forward from start date)");window.console.log("### calculateTimeline: TIMELINE END (",(((u+t)/60))," hours forward from start date)");
window.console.log("### calculateTimeline: TIMELINE END (",(((u+t)/60)/24)," days forward from start date)");window.console.log("### ----------------------------------\n");
}var q=this.finaliseTimeline(o,x,r,u);this.timelineCalcReturnObj.timelineStart=q[0];this.timelineCalcReturnObj.timelineEnd=q[1];
if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("\n### ----------------------------------");
window.console.log("### calculateTimeline: RETURNING timelineCalcReturnObj=",this.timelineCalcReturnObj);window.console.log("### ----------------------------------\n");
}return this.timelineCalcReturnObj;};c.finaliseTimeline=function(i,l,h,g){var m=i;var f=l;var p=e[h](a.__THIS_MINUTE,true,this.weekStartAdj);
var k=this.timeCollectionMode||this.collection.getValue("timeCollectionMode");if(k===a.__LATEST){var j=this.formatPeriod||this.collection.getValue("formatPeriod");
switch(j){case a.__HOUR_FORMAT:p=e.adjustTime(p,(60*a.__MSECS_PER_MINUTE));break;case a.__DAY_FORMAT:p.setDate(p.getDate()+1);
break;case a.__WEEK_FORMAT:p.setDate(p.getDate()+7);break;}}if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("\n### ----------------------------------");
window.console.log("### finaliseTimeline timelineStart=",m," ***");window.console.log("### finaliseTimeline timelineEnd=",f," ***");
window.console.log("### *********** finaliseTimeline: timelineLimit=",p,"***********");window.console.log("### ----------------------------------\n");
}if(f>p){var o=Math.floor(e.getNumMinutes(f,p,false));if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("\n### ----------------------------------");
window.console.log('### finaliseTimeline Timeline end is IN FUTURE... "now" (timelineLimit) is: ',p);window.console.log("### finaliseTimeline Timeline end is IN FUTURE by: ",Math.floor(e.getNumMinutes(f,p,false))," minutes (with tz)");
window.console.log("### finaliseTimeline Timeline end is IN FUTURE by: ",Math.floor(e.getNumMinutes(f,p,true))," minutes (disregard tz)");
window.console.log("### finaliseTimeline Timeline diffTime amount used: ",o);window.console.log("### ----------------------------------\n");
}f=p;m=e.adjustTime(f,-(g*a.__MSECS_PER_MINUTE));if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("\n### ----------------------------------");
window.console.log("### CALCULATED by finaliseTimeline: TIMELINE START date       =",m," ***");window.console.log("### CALCULATED by finaliseTimeline: TIMELINE END date (+1 sec) =",f," ***");
window.console.log("### ----------------------------------\n");}if(this.getFormatPeriod()===a.__DAY_FORMAT||this.getFormatPeriod()===a.__WEEK_FORMAT){h="true"+d.capitaliseFirstLetter(h);
}m=e[h](m,true,this.weekStartAdj);if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("\n### ----------------------------------");
window.console.log("### CALCULATED by finaliseTimeline: (ROUNDED) TIMELINE START date       =",m," ***");window.console.log("### ----------------------------------\n");
}}var n=this.processDatesForTimezone(m,f,a.__FINALISE_TIMELINE,this.logTimelineCalcs,null,p);m=n[0];f=n[1];f.setTime(f.getTime()-1);
if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("\n### ----------------------------------");
window.console.log("### FINALISED by finaliseTimeline: TIMELINE START date       =",m," ***");window.console.log("### FINALISED by finaliseTimeline: TIMELINE END date (-1 sec)=",f," ***");
window.console.log("### ----------------------------------\n");}this.calibrateXScale([m,f]);return[m,f];};c.processDatesForTimezone=function(f,m,k,g,h,n){if(window.console&&window.console.log&&g){window.console.log("\n### ----------------------------------");
window.console.log("### processDatesForTimezone: ",k);}var l=this.getFormatPeriod();var i=e.assessDates(f,m,g);switch(k){case a.__ONE_OFF_ADJUST:if(this.lastFormatPeriod!==a.__HOUR_FORMAT&&this.lastFormatPeriod!==a.__MINUTE_FORMAT&&(l===a.__HOUR_FORMAT||l===a.__MINUTE_FORMAT)){var j=e.getAmsterdamDSTOffset_minusTZ(f);
f=e.timezoneShiftDate(f,e.__FWD,j,"startDate",0,0);if(window.console&&window.console.log&&g){window.console.log("\n### ################################");
window.console.log("### SPECIAL ADJUSTMENT TO TIMELINE - FIRST GRANULARITY JUMP ");window.console.log("### __HOUR_FORMAT adjusting startDate amsOffset = ",j);
window.console.log("### __HOUR_FORMAT adjusting adjusted startDate = ",f," ***");window.console.log("### ###############################\n");
}}break;case a.__FINALISE_TIMELINE:if(a.granularityDict[l]>a.__HOUR_GRANULARITY){if(i.tzOffsetDiff<0){m=e.adjustTime(m,(i.tzOffsetDiff*a.__MSECS_PER_MINUTE));
if(window.console&&window.console.log&&g){window.console.log("### processDatesForTimezone case:",k," (summer) corrected pEndDate=",m);
}}if(i.tzOffsetDiff>0&&m<n){m=e.adjustTime(m,(i.tzOffsetDiff*a.__MSECS_PER_MINUTE));if(window.console&&window.console.log&&g){window.console.log("### processDatesForTimezone case:",k," (winter) corrected pEndDate=",m);
}}}break;case a.__CALCULATE_EXTENT:if(l===a.__HOUR_FORMAT){if(i.startDstOffset<i.endDstOffset){if(h!==(a.__EXTENT_HOURS_DEFAULT_MAX*2)){m=e.adjustTime(m,(i.dstOffsetDiff*a.__MSECS_PER_MINUTE));
if(window.console&&window.console.log&&g){window.console.log("### processDatesForTimezone case:",k," corrected (winter) pEndDate=",m);
}}}else{if(!i.isSummerDST){m=e.adjustTime(m,(i.dstOffsetDiff*a.__MSECS_PER_MINUTE));if(window.console&&window.console.log&&g){window.console.log("### processDatesForTimezone case:",k," corrected (summer) pEndDate=",m);
}}}}break;case a.__BRUSHMOVE:case a.__BRUSHEND:case a.__JUMP_OUT:m=i.numMinutesTz;f=m;if(l===a.__HOUR_FORMAT||l===a.__MINUTE_FORMAT){if(i.tzOffsetDiff!==0){f=i.numMinutesNoTz;
}}break;}if(window.console&&window.console.log&&g){window.console.log("### end processDatesForTimezone: ",k);window.console.log("### ----------------------------------\n");
}return[f,m];};c.calculateExtent=function(i,k,j,g,n,h){var l=false;if(g){if(typeof g!=="undefined"){l=true;}}if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("\n### ----------------------------------");
window.console.log("### calculateExtent: pStartDate (for extent)=",i," ***");window.console.log("### calculateExtent: pRoundingFn=",k);
window.console.log("### calculateExtent: (default) pExtentLength=",j,"(",e.convertMinutesToUnit(j,this.getFormatPeriod()),")");
window.console.log("### calculateExtent: (suggested) pEndExtentDate=",g," ***");window.console.log("### calculateExtent: pTimelineEnd=",n);
window.console.log("### calculateExtent: (default) pMaxExtent=",h,"(",e.convertMinutesToUnit(h,this.getFormatPeriod()),")");
window.console.log("### ----------------------------------\n");}var p=i;var r=j;if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("\n### ----------------------------------");
window.console.log("### calculateExtent: extentLength=",r,"minutes (with tz)","(",e.convertMinutesToUnit(r,this.getFormatPeriod()),")");
window.console.log("### ----------------------------------\n");}if(l){r=Math.floor(e.getNumMinutes(g,p));if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("\n### ----------------------------------");
window.console.log("### calculateExtent: hasCalExtentEndDate=",l);window.console.log("### calculateExtent: RECALULATED extentLength=",r,"minutes (with tz)","(",e.convertMinutesToUnit(r,this.getFormatPeriod()),")");
window.console.log("### calculateExtent: RECALULATED extentLength=",Math.floor(e.getNumMinutes(g,p,true))," minutes (disregard tz)");
window.console.log("### ----------------------------------\n");}}var m=e.adjustTime(p,(r*a.__MSECS_PER_MINUTE));if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("\n### ----------------------------------");
window.console.log("### calculateExtent DESIRED endExtentDate=",m," ***");window.console.log("### ----------------------------------\n");
}if(m>n){var f=Math.floor(e.getNumMinutes(m,n));if(f>0){if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("\n### ----------------------------------");
window.console.log("### @start endExtentDate EXCEEDS pTimelineEnd ###");window.console.log("### calculateExtent EXTENT BREAKS - TOO FAR PAST END OF TIMELINE by ",f,"minutes (with tz)","(",e.convertMinutesToUnit(f,this.getFormatPeriod()),")");
window.console.log("### calculateExtent EXTENT BREAKS - TOO FAR PAST END OF TIMELINE by ",Math.floor(e.getNumMinutes(m,n,true))," minutes (disregard tz)");
window.console.log("### ----------------------------------\n");}m=e.adjustTime(m,-(f*a.__MSECS_PER_MINUTE));if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("\n### ----------------------------------");
window.console.log("### calculateExtent ADJUSTED endExtentDate=",m," ***");window.console.log("### @end endExtentDate EXCEEDS pTimelineEnd ###");
window.console.log("### ----------------------------------\n");}}if(!l){if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
window.console.log("!!!!!!!!!!!!!!!!!!!!!!!### NO CAL EXTENT!!!!!!!!!!!!!!!!");window.console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n");
}}else{var o=Math.floor(e.getNumMinutes(m,p));f=o-h;if(f>0){if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
window.console.log("!!!!!!!!!!!!!!!!!!!!!!!### HAS CAL EXTENT - endExtentDate > pTimelineEnd !!!!!!!!!!!!!!!!");window.console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n");
window.console.log("\n### ----------------------------------");window.console.log("### @start extentLength EXCEEDS max allowable (pMaxExtent) ###");
window.console.log("### calculateExtent ACTUAL extentLength (based on start & end dates)=",o,"(",e.convertMinutesToUnit(o,this.getFormatPeriod()),")");
window.console.log("### calculateExtent ACTUAL extentLength exceeds default max (pMaxExtent) by",f);window.console.log("### ----------------------------------\n");
}m=e.adjustTime(m,-(f*a.__MSECS_PER_MINUTE));if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("\n### ----------------------------------");
window.console.log("### calculateExtent ADJUSTED endExtentDate=",m," ***");window.console.log("### @end extentLength EXCEEDS max allowable (pMaxExtent) ###");
window.console.log("### ----------------------------------\n");}}}}if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("\n### ----------------------------------");
window.console.log("### calculateExtent final CALCULATED (prior to correction) startExtentDate=",p," ***");window.console.log("### calculateExtent final CALCULATED (prior to correction) endExtentDate=",m," ***");
window.console.log("### ----------------------------------\n");}var q=this.processDatesForTimezone(p,m,a.__CALCULATE_EXTENT,this.logTimelineCalcs,r);
p=q[0];m=q[1];if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("\n### ----------------------------------");
window.console.log("### calculateExtent FINALISED startExtentDate=",p," ***");window.console.log("### calculateExtent FINALISED endExtentDate=",m," ***");
window.console.log("### ----------------------------------\n");}if(this.collection){this.collection.setValue("extent",[p,m]);
}this.brush.extent([p,m]);if(window.console&&window.console.log&&this.logTimelineCalcs){window.console.log("\n### calculateExtent EXTENT=",this.getExtent(),"\n");
}};return c;});