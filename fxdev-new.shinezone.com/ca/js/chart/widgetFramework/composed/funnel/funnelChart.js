define("chart/widgetFramework/composed/funnel/funnelChart", ["jquery", "underscore", "d3", "hogan", "util/Functional", "chartutil/d3utils", "util/ObjectSuper", "chart/widgetFramework/chartTypes/barChart"], function (b, f, h, d, a, i, e, c) {
    var g = function (p, j, n, l) {
        var m;
        var o = {};
        var k = f.defaults(o, p);
        m = c(k, j);
        var q = e(m);
        m.init = function () {
            q.init();
            this.stripLabel = "spacer";
        };
        m.calibrateXScale = function () {
            if (a.falsy(this.data)) {
                return;
            }
            var u = f.find(this.data, function (A) {
                return A.journaltypecode.toLowerCase() === "received";
            });
            var r = f.find(this.data, function (A) {
                return A.journaltypecode.toLowerCase() === "abandoned";
            });
            var x = u.count;
            if (r) {
                x += r.count;
            }
            var y = f.pluck(this.data, this.options.xAttr);
            y = f.map(y, function (A) {
                if (f.isArray(A)) {
                    return f.pluck(A, "value");
                }
                return A;
            });
            y = f.flatten(y);
            var w = h.min(y);
            var v = (w < -1) ? w : 0;
            y.push(x);
            var z = f.pluck(this.data, "start");
            z = f.map(z, function (A) {
                if (f.isArray(A)) {
                    return f.pluck(A, "value");
                }
                return A;
            });
            z = f.flatten(z);
            var s = h.min(z);
            var t = Math.min(s, v);
            this.scales[this.options.xAttr].domain([t, h.max(y)]);
            if (this.options.niceScaleX) {
                this.scales[this.options.xAttr].nice();
            }
        };
        m.renderData = function () {
            if (a.falsy(this.data)) {
                this.hideCharts("no data to display");
                return;
            }
            var s = this, u = this.scales[this.options.xAttr];
            var r = this.barUtils.containerBarsHorizontal(this.chartGroup, this.getData(), this.getPrimaryDataJoin(), this.barPositioningFn, true);
            var t = r.bars;
            t.update.select("rect").transition().duration(500).delay(function (v) {
                return (v.main.toLowerCase() === "true") ? 750 : 1250;
            }).ease("cubic-in-out").attr("x", function (w) {
                var v = w[s.options.xAttr];
                if (v < 0 && w.journaltypecode.indexOf("spacer") === -1) {
                    return u(v);
                }
                return u(w.start);
            }).attr("width", function (A) {
                var x = 0, v = 1, z, y = A[s.options.xAttr];
                if (y > 0) {
                    z = (u(A.start) + (u(A.end) - u(A.start))) - u(A.start);
                    x = Math.max(z, v);
                } else {
                    if (y < 0) {
                        if (A.journaltypecode.indexOf("spacer") === -1) {
                            z = u(A.start) - u(y);
                            x = Math.max(z, v);
                        }
                    }
                }
                return x;
            });
            t.enter.append("rect").attr("class", function (v) {
                return i.getJoinAttrNoSpaces.call(s, v, "-");
            }).attr("height", this.barSize).attr("width", 0).transition().duration(500).delay(function (v) {
                return (v.main.toLowerCase() === "true") ? 750 : 1250;
            }).ease("cubic-in-out").attr("x", function (w) {
                var v = w[s.options.xAttr];
                if (v < 0 && w.journaltypecode.indexOf("spacer") === -1) {
                    return u(v);
                }
                return u(w.start);
            }).attr("width", function (A) {
                var x = 0, v = 1, z, y = A[s.options.xAttr];
                if (y > 0) {
                    z = (u(A.start) + (u(A.end) - u(A.start))) - u(A.start);
                    x = Math.max(z, v);
                } else {
                    if (y < 0) {
                        if (A.journaltypecode.indexOf("spacer") === -1) {
                            z = u(A.start) - u(y);
                            x = Math.max(z, v);
                        }
                    }
                }
                return x;
            });
            t.exit.select("rect").transition().duration(500).attr("width", 0).style("opacity", 0).remove();
        };
        return m;
    };
    return g;
});
