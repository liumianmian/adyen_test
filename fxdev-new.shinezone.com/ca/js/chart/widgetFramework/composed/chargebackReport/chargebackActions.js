define("chart/widgetFramework/composed/chargebackReport/chargebackActions",["jqueryExtended"],function(b){var c=b;var a={actions:[{source:"issuerCountry",event:"change",target:["fetcher","fetcherCountrybar","fetcherPaymentMethodBar"],callMethod:"fetchNewDataAction",getterMethod:function(d){c("#timeline1").find("#timelineLoader").css("display","block");
var e=d.val();return{countryFilter:e};}},{source:"paymentMethod",event:"change",target:["fetcher","fetcherCountrybar","fetcherPaymentMethodBar"],callMethod:"fetchNewDataAction",getterMethod:function(d){c("#timeline1").find("#timelineLoader").css("display","block");
var e=d.val();return{paymentMethod:e};}},{source:"shopperInteraction",event:"change",target:["fetcher","fetcherCountrybar","fetcherPaymentMethodBar"],callMethod:"fetchNewDataAction",getterMethod:function(d){c("#timeline1").find("#timelineLoader").css("display","block");
var e=d.val();return{shopperInteraction:e};}},{source:"transaction-toggle",event:"click",target:["fetcher","fetcherCountrybar","fetcherPaymentMethodBar"],callMethod:"fetchNewDataAction",getterMethod:function(){c("#timeline1").find("#timelineLoader").css("display","block");
c(".report-description h2 span").text("transaction");c('[data-toggle-id="chargeback"]').addClass("active");c('[data-toggle-id="transaction"]').removeClass("active");
return{chargebackDateParameter:"transaction"};}},{source:"chargeback-toggle",event:"click",target:["fetcher","fetcherCountrybar","fetcherPaymentMethodBar"],callMethod:"fetchNewDataAction",getterMethod:function(){c("#timeline1").find("#timelineLoader").css("display","block");
c(".report-description h2 span").text("Chargeback / Notifications of fraud");c('[data-toggle-id="transaction"]').addClass("active");
c('[data-toggle-id="chargeback"]').removeClass("active");return{chargebackDateParameter:"chargeback"};}},{source:"amountToggle",event:"click",target:["cfnBarFormatter","cfnLineFormatter","cfnRolloverFormatter","countryBarFormatter","paymentMethodBarFormatter","chargebackMediator"],callMethod:"reformatData",getterMethod:function(){c("#countAmountText").text("amount");
c(".cfn-header.count-amount").text("Amount");setTimeout(function(){c('[data-toggle-id="count"]').removeClass("active");c('[data-toggle-id="amount"]').addClass("active");
},10);c("#cfnBarChart")[0].__axisVertical.graphOptions.tickFormat="euroFormatSmartRoundingSI";return"amount";}},{source:"countToggle",event:"click",target:["cfnBarFormatter","cfnLineFormatter","cfnRolloverFormatter","countryBarFormatter","paymentMethodBarFormatter","chargebackMediator"],callMethod:"reformatData",getterMethod:function(){c("#countAmountText").text("count");
c(".cfn-header.count-amount").text("Count");setTimeout(function(){c('[data-toggle-id="amount"]').removeClass("active");c('[data-toggle-id="count"]').addClass("active");
},10);c("#cfnBarChart")[0].__axisVertical.graphOptions.tickFormat="thousandsLinearFormat";return"count";}},{source:["#chargebacksCountryToggle","#nofCountryToggle"],event:"click",target:["chargebackMediator","countryBarFormatter"],callMethod:"reformatDataChargebacksNof",toggle:"issuer-country-toggle",getterMethod:function(d){var e=d.attr("data-toggle-id");
return{type:e,source:"issuerCountry"};}},{source:["#chargebacksPMToggle","#nofPMToggle"],event:"click",target:["chargebackMediator","paymentMethodBarFormatter"],callMethod:"reformatDataChargebacksNof",toggle:"pm-country-toggle",getterMethod:function(d){var e=d.attr("data-toggle-id");
return{type:e,source:"paymentMethod"};}},{source:"chargebackFraudDownload",event:"click",target:"cfnRolloverFormatter",callMethod:"downloadCSV"},{source:"atvDownload",event:"click",target:"atvLineFormatter",callMethod:"downloadCSV"},{source:"countryBarDownload",event:"click",target:"countryBarFormatter",callMethod:"downloadCSV"},{source:"pmBarDownload",event:"click",target:"paymentMethodBarFormatter",callMethod:"downloadCSV"},{source:"countryBrushBarChart",event:"brushableBarChartData",target:["countryCountBarChart","countryAmountBarChart","countryRateBarChart","countryGroupedBarRollover"],callMethod:"updateScale"},{source:"paymentMethodBrushBarChart",event:"brushableBarChartData",target:["paymentMethodCountBarChart","paymentMethodAmountBarChart","paymentMethodRateBarChart","paymentMethodGroupedBarRollover"],callMethod:"updateScale"},{source:"countryCountTitle",event:"click",target:["chargebackMediator","countryBrushBarChart","countryBarFormatter"],callMethod:"sortData",data:"chargebackCount",toggle:"sort-toggle-country"},{source:"countryAmountTitle",event:"click",target:["chargebackMediator","countryBrushBarChart","countryBarFormatter"],callMethod:"sortData",data:"chargebackEurAmount",toggle:"sort-toggle-country"},{source:"countryRateTitle",event:"click",target:["chargebackMediator","countryBrushBarChart","countryBarFormatter"],callMethod:"sortData",data:"chargebackRate",toggle:"sort-toggle-country"},{source:"paymentMethodCountTitle",event:"click",target:["chargebackMediator","paymentMethodBarFormatter"],callMethod:"sortData",data:"chargebackCount",toggle:"sort-toggle-pm"},{source:"paymentMethodAmountTitle",event:"click",target:["chargebackMediator","paymentMethodBarFormatter"],callMethod:"sortData",data:"chargebackEurAmount",toggle:"sort-toggle-pm"},{source:"paymentMethodRateTitle",event:"click",target:["chargebackMediator","paymentMethodBarFormatter"],callMethod:"sortData",data:"chargebackRate",toggle:"sort-toggle-pm"},{source:"timeline1",event:"timelineTimespanSet",target:["fetcher","fetcherCountrybar","fetcherPaymentMethodBar","issuerCountriesFetcher","activePaymentMethodsFetcher","chargebackMediator"],callMethod:"onTimeData"}]};
return a;});