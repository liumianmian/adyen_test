define("chart/widgetFramework/composed/funnel/funnelDataFormatter", ["jqueryExtended", "underscore", "d3", "chart/widgetFramework/core/constants/DataConstants", "chartutil/dateUtils_CET", "chartutil/d3utils"], function (a, g, i, f, d, j) {
    function e(n, k, m) {
        this.data = n;
        this.options = k;
        this.formattedData = {};
        this.comparator = this.compareFunction;
        this.reverseDirection = false;
        this.sortKey = "order";
        this.timeline = m;
        this.showSessionsTotal = false;
        var l = (this.showSessionsTotal) ? 5 : 4;
        this.dataSpacers = [{insertPoint: [15, l]}, {insertPoint: [12, 2]}, {insertPoint: [8, 4]}, {insertPoint: [1, 2]}];
    }

    e.prototype.formatData = function () {
        this.formattedData = this.data.PaymentFunnelResults;
        //console.log(['this.data.PaymentFunnelResults', this.formattedData]);
        if (this.sortKey) {
            this.reverseDirection = !this.reverseDirection;
            this.sortData(this.sortKey, true);
        }
        this.formattedData = b(this.formattedData, this.dataSpacers);
        if (window.console && console.log) {
            console.log("### funnelDataFD::formatData:: this.formattedData=", this.formattedData);
        }
        if (this.showSessionsTotal) {
            var l = g.findIndex(this.formattedData, function (p) {
                return (p.registertype && p.registertype.toLowerCase() === "sessions");
            });
            var m = 0;
            for (var k = this.formattedData.length - 1; k >= l; k--) {
                m += this.formattedData[k].count;
            }
            var n = this.formattedData[l - 1];
            n.count = m;
            n.journaltypecode = "total";
            n.main = "true";
        }
        var o = c(this.formattedData);
        this.formattedData = g.filter(this.formattedData, function (p) {
            return (p.journaltypecode.toLowerCase().indexOf("awaiting") === -1 && p.journaltypecode.toLowerCase().indexOf("pre") === -1);
        });
        return {chartData: this.formattedData, extraData: o};
    };
    var b = function (k, l) {
        g.each(l, function (s) {
            var r = s.insertPoint[0];
            var p = s.insertPoint[1];
            var o = g.findIndex(k, "order", r);
            o += 1;
            if (o === k.length) {
                p = 0;
            }
            var n = h(p, o);
            for (var q = 0, m = n.length; q < m; q++) {
                k.splice(o, 0, n[q]);
            }
        });
        return k;
    };
    var h = function (l, o) {
        var k = [], m;
        for (var n = 0; n < l; n++) {
            m = {count: -1, order: -1, journaltypecode: "spacer" + (o + n), main: "false", start: 0};
            k.push(m);
        }
        return k;
    };
    var c = function (l) {
        //console.log(['l.filter', l]);
        var k = g.filter(l, function (n) {
            //console.log(['g.filter n', n]);
            return n.main.toLowerCase() === "true";
        });
        //console.log(['g.filter', k]);
        var m = g.map(k, function (n) {
            return n.journaltypecode;
        });
        //console.log(['g.filter', m]);
        return m;
    };
    e.prototype.sortData = function (k, m) {
        this.sortKey = k;
        this.reverseDirection = !this.reverseDirection;
        var l = g.sortBy(this.formattedData, k);
        if (this.reverseDirection) {
            l.reverse();
        }
        this.formattedData = l;
        if (m === true) {
            return;
        }
        this.$el.trigger(f.FORMATTER_INFORM_WIDGET, {type: f.SORTED_DATA, data: {chartData: this.formattedData}});
    };
    e.prototype.compareFunction = function (k) {
        return k[this.sortKey];
    };
    e.prototype.getData = function () {
        return (this.data) ? this.data : this.formatData();
    };
    e.prototype.setRawData = function (k) {
        this.data = k;
    };
    e.prototype.setOptions = function (k) {
        this.options = k;
    };
    return e;
});