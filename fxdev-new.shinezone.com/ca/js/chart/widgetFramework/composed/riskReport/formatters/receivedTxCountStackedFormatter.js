define("chart/widgetFramework/composed/riskReport/formatters/receivedTxCountStackedFormatter", ["jqueryExtended", "underscore", "d3", "chart/widgetFramework/core/constants/DataConstants", "chartutil/dateUtils_CET", "chartutil/d3utils", "chart/widgetFramework/composed/riskReport/constants/riskConstants", "chartutil/domUtils"], function (a, g, h, e, d, i, b, f) {
    var c = function (m, j, l, n) {
        var k = {};
        k.data = m;
        k.options = j;
        k.formattedData = {};
        k.comparator = null;
        k.reverseDirection = false;
        k.sortKey = null;
        k.timeline = l;
        k.id = n;
        k.currentCountry = "";
        k.formatData = function () {
            if (this.currentCountry !== "") {
                return [];
            }
            this.formattedData = this.calculateMetaData(this.data);
            if (this.sortKey) {
                this.reverseDirection = !this.reverseDirection;
                this.sortData(this.sortKey, true);
            }
            return {chartData: this.formattedData};
        };
        k.fetchNewDataAction = function (o) {
            this.currentCountry = o.countryFilter;
        };
        k.calculateMetaData = function (o) {
            g.map(o, function (p) {
                p[b.RECEIVED_TX_TOTAL] = p.totalCount;
                p[b.RECEIVED_TX_REVPRO_TOTAL] = p.riskTransactionCount;
                p[b.RECEIVED_TX_GPM_TOTAL] = p.totalCount - p.riskTransactionCount;
                if (p[b.RECEIVED_TX_GPM_TOTAL] < 0) {
                    p[b.RECEIVED_TX_GPM_TOTAL] = 0;
                }
                p.rates = [{
                    name: "revenue-protect",
                    value: p[b.RECEIVED_TX_REVPRO_TOTAL],
                    startY: 0,
                    endY: p[b.RECEIVED_TX_REVPRO_TOTAL]
                }, {
                    name: "guaranteed-pm",
                    value: p[b.RECEIVED_TX_GPM_TOTAL],
                    startY: (p[b.RECEIVED_TX_REVPRO_TOTAL] > p[b.RECEIVED_TX_TOTAL]) ? p[b.RECEIVED_TX_TOTAL] : p[b.RECEIVED_TX_REVPRO_TOTAL],
                    endY: p[b.RECEIVED_TX_TOTAL]
                }];
            });
            return this.data;
        };
        k.sortData = function (o, q) {
            this.sortKey = o;
            this.reverseDirection = !this.reverseDirection;
            var p = g.sortBy(this.formattedData, o);
            if (this.reverseDirection) {
                p.reverse();
            }
            this.formattedData = p;
            if (q === true) {
                return;
            }
            this.$el.trigger(e.FORMATTER_INFORM_WIDGET, {type: e.SORTED_DATA, data: this.formattedData});
        };
        k.compareFunction = function (o) {
            return o[this.sortKey];
        };
        k.downloadCSV = function () {
            var o = ["dateStr", "receivedTxTotal", "receivedTxRevProTotal", "receivedTxGpmTotal"];
            var p = ["Date", "Total Received Tx", "Routed through RevenueProtect", "Guaranteed payment method"];
            f.createCSV(this.formattedData, o, p, "ReceivedTransactionCount");
        };
        k.getData = function () {
            return (this.data) ? this.data : this.formatData();
        };
        k.setRawData = function (o) {
            this.data = o;
        };
        k.retrieveData = function (o) {
            return this.data[o];
        };
        k.setOptions = function (o) {
            this.options = o;
        };
        return k;
    };
    return c;
});