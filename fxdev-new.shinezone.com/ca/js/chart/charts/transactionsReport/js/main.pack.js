define("transactionsReport/events/transactionsReportEvents", [], function () {
    var a = {};
    a.BASE = "transactionsReport:";
    a.DATA_READY = a.BASE + "chartTypeSelected";
    a.DATA_ERROR = a.BASE + "dataError";
    return a;
});
define("transactionsReport/models/transactions", ["jquery", "underscore", "backbone", "backbonenested", "d3", "chartutil/dateUtils_CET"], function (e, c, g, b, d, f) {
    var a = g.Model.extend({
        defaults: {name: "Transactions", values: []}, parse: function (i) {
            var h = c.clone(i);
            h.values = [];
            c.each(i.values, function (k) {
                var j = {
                    date: k.date,
                    truedate: k.truedate,
                    period: h.name,
                    rate: {description: "", name: "", value: parseInt(k.txs)}
                };
                h.values.push(j);
            });
            return h;
        }
    });
    return a;
});
define("transactionsReport/collections/transactionsReportData", ["jquery", "lodash", "backbone", "d3", "transactionsReport/models/transactions", "chartlib/events/appstateevents", "chartutil/stringutils", "chartutil/d3utils", "chartutil/dateUtils_CET", "chartutil/backbone/CollectionUtils", "chartlib/chartBaseEvents", "timeline/events/timelineEvents", "timeline/util/timelineConstants", "transactionsReport/events/transactionsReportEvents", "chartutil/numberutils"], function (c, l, k, o, h, d, a, p, b, e, j, n, g, i, f) {
    var m = k.Collection.extend({
        model: h,
        hasData: false,
        baseUrl: "ca/data/transactions/summary.php?",
        stubUrl: "/chart/charts/transactionsReport/dummy-data/transactions_report_live_NL_weeks.json?",
        initialize: function () {
            l.bindAll(this, "loadData", "onLoaded", "onError");
            k.on(d.STATE_CHANGED, this.loadData);
            this.listenTo(this, "error", function () {
                this.trigger(j.DATA_FAILED);
                this.trigger(i.DATA_ERROR);
            });
            this.comparator = "utcdate";
            this.volumeFormat = o.format(",d");
            this.dateFormat = o.time.format("%Y-%m-%d");
        },
        loadData: function (q) {
            this.granularity = q.get("granularity");
            this.hasData = false;
            this.loaded = c.Deferred();
            this.fetch({reset: true}, q);
        },
        fetch: function (q, s) {
            if (s.get("stub")) {
                this.url = adyen.jsbase + this.stubUrl + new Date().getTime();
            } else {
                this.url = adyen.base + this.baseUrl + new Date().getTime();
            }
            this.startDateSel = s.get("bdate");
            this.endDateSel = s.get("edate");
            var r = this.getPreviousPeriodDates(this.startDateSel, this.endDateSel, this.granularity);
            this.startDatePrev = r.start;
            this.endDatePrev = r.end;
            q || (q = {});
            q.success = this.onLoaded;
            q.error = this.onError;
            q.type = "POST";
            q.data = {
                formHash: adyen.formHash,
                granularity: this.granularity,
                startdate: s.get("bdate"),
                enddate: s.get("edate"),
                shopperInteraction: s.get("sis"),
                previousPeriod: true
            };
            this._super(q);
            k.trigger(j.REGISTER_DEFERRED, this.loaded, "txsData", this);
        },
        parse: function (r) {
            var s = this.granularity;
            this.convertAllDatesToAmsTime(r);
            this.fillAllGaps(r);
            if (r.selectedPeriod !== null && r.previousPeriod !== null) {
                r = this.convertDate(r, s);
                var q = this;
                this.hasData = true;
                this.scaleDataArray = [];
                this.totalVolume = 0;
                this.barchartData = [];
                this.selectedLineLabel = this.getSelectedLineLabel(r, this.granularity);
                this.previousLineLabel = this.getPreviousLineLabel(r, this.granularity);
                l.each(r.selectedPeriod, function (t) {
                    q.scaleDataArray.push({date: t.date});
                    q.totalVolume = (q.totalVolume + parseInt(t.txs));
                    l.each(r.previousPeriod, function (w) {
                        if (w.date === t.date) {
                            var u = t.txs - w.txs;
                            var v = (w.txs === 0) ? 0 : (u / w.txs) * 100;
                            q.barchartData.push({
                                prevDate: w.truedate,
                                prevRate: w.txs,
                                selDate: t.truedate,
                                selRate: t.txs,
                                percentDiff: f.decimalFormatter(v, 2) + "%",
                                isImproved: (t.txs > w.txs) ? true : false
                            });
                        }
                    });
                });
                this.totalVolume = this.volumeFormat(this.totalVolume);
                return l.map(r, function (u, t) {
                    return {
                        name: t,
                        period: (t === "selectedPeriod") ? q.selectedLineLabel : q.previousLineLabel,
                        values: u
                    };
                });
            } else {
                if (window.console && console.log) {
                    console.log("This data doesn't exist / is invalid");
                }
                return {};
            }
        },
        convertAllDatesToAmsTime: function (r) {
            var q;
            if (r.selectedPeriod) {
                q = (r.selectedPeriod === "[]") ? [] : r.selectedPeriod;
                this.convertDatesToAmsTime(q, "selectedPeriod");
            }
            if (r.previousPeriod) {
                q = (r.previousPeriod === "[]") ? [] : r.previousPeriod;
                this.convertDatesToAmsTime(q, "previousPeriod");
            }
        },
        convertDatesToAmsTime: function (r, s) {
            var q = this;
            l.each(r, function (v) {
                var u = new Date(v.date);
                var t = q.convertDateToAMS(u, s, v.date);
                v.date = t.getTime();
            });
        },
        convertDateToAMS: function (q, u, s) {
            var t = b.getAmsterdamDSTOffsetTime(q, true);
            var r = b.timezoneShiftDate(q, b.__BACK, t, "startDate", 0, 0);
            return r;
        },
        fillAllGaps: function (q) {
            if (!l.isArray(q.selectedPeriod)) {
                q.selectedPeriod = [];
            }
            if (!l.isArray(q.previousPeriod)) {
                q.previousPeriod = [];
            }
            q.selectedPeriod = this.fillGaps(q.selectedPeriod, this.startDateSel, this.endDateSel, this.granularity);
            q.previousPeriod = this.fillGaps(q.previousPeriod, this.startDatePrev, this.endDatePrev, this.granularity, true);
        },
        fillGaps: function (r, q, t, v, x) {
            var u = this.createDateSequence(q, t, v);
            var w = 0;
            for (var s = 0; s < u.length; s++) {
                if (window.console && console.log && s < w) {
                    console.log("\n\n### transactionsReportData::fillGaps:: count=", s);
                }
                var y = l.find(r, function (z) {
                    if (window.console && console.log && s < w) {
                        console.log("\n### transactionsReportData:: d.date as date:: ", new Date(z.date), " as timestamp=", z.date);
                        console.log("### transactionsReportData:: dateSequence[i]:: ", u[s], " as timestamp=", u[s].getTime());
                        console.log("### transactionsReportData:: MATCH:: ", u[s].getTime() === z.date);
                    }
                    return u[s].getTime() === z.date;
                });
                if (window.console && console.log && s < w) {
                    console.log("### transactionsReportData::fillGaps:: foundPoint=", y);
                }
                if (!y) {
                    if (window.console && console.log && s < w) {
                        console.log("### transactionsReportData::fillGaps:: PUSHING POINT:", u[s], " as timestamp=", u[s].getTime());
                    }
                    r.push({date: u[s].getTime(), txs: 0});
                }
            }
            return l.sortBy(r, "date");
        },
        createDateSequence: function (r, v, y) {
            var x = [];
            var t = new Date();
            var z = new Date(), w = new Date();
            r = (l.isString(r)) ? Date.parse(r) : r;
            v = (l.isString(v)) ? Date.parse(v) : v;
            z.setTime(r);
            w.setTime(v);
            var u, A, B, s;
            switch (y) {
                case"month":
                    var q = w.getMonth() - z.getMonth();
                    A = (q <= 0) ? q + 12 : q;
                    for (u = 0; u < A; u++) {
                        t = new Date();
                        t.setTime(z.getTime());
                        t.setMonth(z.getMonth() + u);
                        x.push(b.roundToMonth(t));
                    }
                    break;
                case"week":
                    A = Math.ceil(b.getNumDays(w, z) / 7);
                    for (u = 0; u < A; u++) {
                        t = new Date();
                        t.setTime(z.getTime() + (u) * g.__MSECS_PER_WEEK);
                        B = b.roundToWeek(t);
                        s = b.roundToDay(B, true);
                        x.push(s);
                    }
                    break;
                case"day":
                    A = b.getNumDays(w, z);
                    for (u = 0; u < A; u++) {
                        t = new Date();
                        t.setTime(z.getTime() + (u) * g.__MSECS_PER_DAY);
                        x.push(b.roundToDay(t));
                    }
                    break;
                case"hour":
                    A = b.getNumHours(w, z);
                    for (u = 0; u < A; u++) {
                        t = new Date();
                        t.setTime(z.getTime() + (u) * g.__MSECS_PER_HOUR);
                        x.push(b.roundToHour(t));
                    }
                    break;
                case"minute":
                    A = b.getNumMinutes(w, z);
                    for (u = 0; u < A; u++) {
                        t = new Date();
                        t.setTime(z.getTime() + (u) * g.__MSECS_PER_MINUTE);
                        x.push(b.roundToMinute(t));
                    }
                    break;
            }
            return x;
        },
        getPreviousPeriodDates: function (t, H, s) {
            var q = new Date(t), v = new Date(H);
            switch (s) {
                case"month":
                    var I = new Date();
                    var E = new Date();
                    I.setTime(q.getTime());
                    I.setMonth(I.getMonth());
                    b.roundToMonth(I);
                    var w = v.getMonth() - q.getMonth();
                    w = (w <= 0) ? w + 12 : w;
                    E.setTime(I.getTime());
                    b.roundToMonth(E);
                    E.setMonth(I.getMonth() - w);
                    return {start: E, end: I};
                case"week":
                    var J = new Date();
                    J.setTime(q.getTime());
                    var x = new Date();
                    var B = Math.ceil(b.getNumDays(v, q) / 7);
                    x.setTime(J.getTime() - B * g.__MSECS_PER_WEEK);
                    var y = b.trueRoundToDay(x, true);
                    return {start: y, end: J};
                case"day":
                    var z = new Date();
                    z.setTime(q.getTime());
                    var F = new Date();
                    F.setTime(z.getTime() - b.getNumDays(v, q) * g.__MSECS_PER_DAY);
                    var C = b.assessDates(F, z, false);
                    var D = F;
                    if (C.tzOffsetDiff !== 0) {
                        D = b.adjustTime(F, (-C.tzOffsetDiff * g.__MSECS_PER_MINUTE));
                    }
                    var y = D;
                    return {start: y, end: z};
                case"hour":
                    var G = new Date();
                    G.setTime(q.getTime());
                    G.setHours(q.getHours());
                    var A = new Date();
                    A.setTime(G.getTime() - b.getNumHours(v, q) * g.__MSECS_PER_HOUR);
                    return {start: A, end: G};
                case"minute":
                    var r = new Date();
                    r.setTime(q.getTime());
                    var u = new Date();
                    u.setTime(r.getTime() - b.getNumMinutes(v, q) * g.__MSECS_PER_MINUTE);
                    return {start: u, end: r};
            }
        },
        getSelectedLineLabel: function (q, r) {
            return this.prettifyDate(q.selectedPeriod[0].date, r) + " to " + this.prettifyDate(q.selectedPeriod[q.selectedPeriod.length - 1].date, r);
        },
        getPreviousLineLabel: function (q, r) {
            return this.prettifyDate(q.previousPeriod[0].truedate, r) + " to " + this.prettifyDate(q.previousPeriod[q.previousPeriod.length - 1].truedate, r);
        },
        prettifyDate: function (q, s) {
            var r = (s === "hour" || s === "minute") ? l.rest(l.last(q.toFormattedTimeString().split("T")).split(":")).join(":") : "";
            return f.zeroPad(q.getDate()) + "-" + f.zeroPad((q.getMonth() + 1)) + ((r === "") ? ("-" + f.zeroPad(q.getFullYear())) : ("@" + r));
        },
        convertDate: function (s, t) {
            for (var u in s) {
                for (var r = 0;
                     r < s[u].length; r++) {
                    s[u][r].date = new Date(s[u][r].date);
                    s[u][r].truedate = s[u][r].date;
                    try {
                        if (u === "previousPeriod") {
                            s[u][r].date = s.selectedPeriod[r].date;
                        }
                    } catch (q) {
                        if (window.console && console.log) {
                            console.log("### transactionsReportData::convertDate:: ERROR! ", q);
                        }
                    }
                }
            }
            return s;
        },
        onError: function (t, s, q) {
            this.trigger(i.DATA_ERROR);
            if (window.console && console.log) {
                console.log("responseTimeData load error: ", t, s.getResponseHeader("content-type"), q);
            }
        },
        onLoaded: function (q) {
            k.trigger("DATALOADED", this);
            this.trigger("reset");
            this.loaded.resolve();
        },
        getGranularity: function () {
            return this.granularity;
        },
        getDateExtent: function () {
            return this.dateExtent;
        }
    });
    return m;
}, function (a) {
    if (window.console && console.log) {
        console.log("APP JS ERROR = " + a);
    }
});
define("transactionsReport/views/transactionsLineChart", ["jquery", "underscore", "backbone", "d3", "chartlib/chartBaseEvents", "chartlib/timeVertBarChart", "chartlib/linechart2", "chartlib/events/appstateevents", "chartutil/d3utils"], function (c, g, f, j, e, b, a, d, i) {
    var h = a.extend({
        el: '[data-view="txsReport"]',
        defaults: {
            margin: {top: 40, left: 120, bottom: 30, right: 180},
            xAttr: "date",
            yAttr: "values",
            joinAttr: "name",
            percentile: false,
            yScale: "linear",
            barPadding: 0
        },
        granularityFormats: {},
        initialize: function () {
            g.bindAll(this, "updateLabel");
            this.granularityFormats.day = "%d";
            this.granularityFormats.day_start = "%b %d";
            this.granularityFormats.week = "wk %U";
            this.granularityFormats.week_start = "%Y wk %U";
            this.granularityFormats.month = "%b";
            this.granularityFormats.month_start = "%Y %b";
            this.granularityFormats.hour = "%H";
            this.granularityFormats.hour_start = "%d-%m %H";
            this.granularityFormats.minute = "%M";
            this.granularityFormats.minute_start = "%d-%m %H";
            this._super(arguments);
        },
        addListeners: function () {
            f.on(d.RENDER_CHARTS, this.render);
            f.on(d.RENDER_CHARTS, this.updateLabel);
        },
        setXScale: function () {
            this.scales.x = j.time.scale().range([0, this.width], this.options.barPadding);
        },
        formatYAxis: function () {
            var l = this, k = this.axes.y;
            k.ticks(5).tickFormat(function (n, m) {
                return i.thousandsFormatter(n, m, l.scales.y);
            });
        },
        getLabel: function (k) {
            return this._getDatumValue(k, "period");
        },
        updateLabel: function () {
            this.$el.find(".chart-program-label.previousperiod").text(this.collection.previousLineLabel + " \u2611");
            this.$el.find(".chart-program-label.selectedperiod").text(this.collection.selectedLineLabel + " \u2611");
        }
    });
    return h;
}, function (a) {
    if (window.console && console.log) {
        console.log("APP JS ERROR = " + a);
    }
});
define("transactionsReport/views/totalVolumeModule", ["jquery", "underscore", "backbone", "d3", "chartlib/chartBaseEvents", "chartlib/events/appstateevents", "text!chart/charts/transactionsReport/app/views/templates/totalVolume.html", "hogan"], function (a, g, f, i, e, c, h, d) {
    var b = f.View.extend({
        initialize: function () {
            f.on(c.RENDER_CHARTS, this.render, this);
            this.totalVolumeTemplate = window.Hogan.compile(h);
            this._super();
        }, render: function () {
            this.setElement(this.totalVolumeTemplate.render({
                totalVolume: this.collection.totalVolume,
                granularity: this.collection.granularity
            }));
            a('[data-view="txs-report-totalvolume"]').html(this.$el);
        }
    });
    return b;
}, function (a) {
    if (window.console && console.log) {
        console.log("APP JS ERROR = " + a);
    }
});
define("transactionsReport/models/appstate", ["jquery", "underscore", "backbone", "chartlib/models/appstate", "chartlib/events/appstateevents"], function (d, b, f, e, c) {
    var a = e.extend({
        notifyStateChange: function (g) {
            f.trigger(c.REQUEST_STATE_CHANGE, g);
        }, addTimeValues: function (j) {
            var i;
            i = this.timeline.getDates();
            var h = "%Y-%m-%d %H:%M:%S";
            var g = this.timeline.getGranularity();
            j.set("bdate", d3.time.format(h)(i[0]));
            j.set("edate", d3.time.format(h)(i[1]));
        }, addMapValues: function () {
        }, addConfigValues: function (h, g) {
            if (g.shopperInteraction !== "") {
                h.set("sis", g.shopperInteraction);
            }
        }, setStubValues: function (g) {
            g.set("stub", this.get("stub"));
        }
    });
    return a;
}, function (a) {
    if (window.console && console.log) {
        console.log("APP JS ERROR =", a);
    }
});
define("transactionsReport/views/errorDisplayModule", ["jquery", "backbone", "transactionsReport/events/transactionsReportEvents", "timeline/events/timelineEvents"], function (b, e, c, d) {
    var a = e.View.extend({
        el: b('[data-view="txsReportError"]'), initialize: function () {
            this.listenTo(this.collection, c.DATA_ERROR, this.showError);
            this._super();
        }, showError: function (f) {
            setTimeout(function () {
                b("#timelineLoader").hide();
            }, 200);
            this.$el.fadeTo(200, 1).find("span").html(f);
        }, hideError: function () {
            this.$el.fadeTo(200, 0);
        }, showDataError: function () {
            this.showError(' Data error, please <a onclick="location.reload();">reload the page.</a>');
        }
    });
    return a;
}, function (a) {
    if (window.console && console.log) {
        console.log("APP JS ERROR = " + a);
    }
});
define("transactionsReport/views/transactionsBarChartRollover", ["jquery", "underscore", "backbone", "d3", "chartlib/chartBaseEvents", "chartlib/timeVertBarChart", "chartlib/events/appstateevents", "text!chart/charts/transactionsReport/app/views/templates/tooltip.html", "hogan", "chartutil/d3utils", "chartutil/numberutils"], function (c, j, i, l, h, b, e, a, f, k, g) {
    var d = b.extend({
        el: '[data-view="txsReportRollover"]',
        defaults: {
            margin: {top: 40, left: 120, bottom: 30, right: 180},
            xAttr: "selDate",
            yAttr: "highestRate",
            joinAttr: "highestRate",
            percentile: false,
            tooltip: true,
            yScale: "linear",
            totalLabelOffset: 5
        },
        monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        initialize: function () {
            var m = this;
            this.volumeFormat = l.format(",d");
            this.tooltipTemplate = window.Hogan.compile(a);
            this._super(arguments);
            c(document).mousemove(function (n) {
                m.updateTooltipPos(n.pageY);
            });
        },
        addListeners: function () {
            if (this.collection) {
                this.listenTo(this.collection, "sort", this.render);
            }
            i.on(e.RENDER_CHARTS, this.render);
        },
        renderXAxis: function () {
        },
        renderYAxis: function () {
        },
        setXScale: function () {
            this.scales.x = l.time.scale().range([0, this.width], this.options.barPadding);
        },
        calibrateXScale: function () {
            var m = this, n = this.collection.granularity;
            this.scales.x.ticks(l.time[n], 1);
            this.scales.x.tickFormat(m.granularityFormats[n]);
        },
        setYAxis: function () {
            var m = this;
            this._super(arguments);
            this.axes.y.tickFormat(function (o, n) {
                return k.thousandsFormatter(o, n, m.scales.y);
            });
        },
        calibrateYScale: function () {
            this.scales.y.domain([0, l.max(this.collection.barchartData.pluck(this.options.yAttr))]);
        },
        renderData: function () {
            var s = this, u = this.scales.x, t = this.scales.y, q = (this.width / (s.collection.barchartData.length - 1)), v = q * (1 - this.options.barPadding), n = ".bar";
            var r = this.svg.selectAll(n).data(s.collection.barchartData, this.joinData);
            var p = r.enter().append("g").attr("class", "bar").attr("transform", function (x, w) {
                return "translate(" + ((q * (w + 0.5)) - (q / 2)) + ",0)";
            }).append("rect").attr("width", v).attr("height", function (w) {
                return 0;
            }).attr("y", function (w) {
                return s.height;
            }).attr("transform", function (x, w) {
                return "translate(-" + (v / 2) + ",0)";
            });
            var o = r.transition().duration(500).attr("transform", function (x, w) {
                return "translate(" + ((q * (w + 0.5)) - (q / 2)) + ",0)";
            });
            o.select("rect").attr("width", v).attr("height", function (w) {
                return s.height;
            }).attr("y", function (w) {
                return 0;
            }).attr("transform", function (x, w) {
                return "translate(-" + (v / 2) + ",0)";
            });
            if (this.options.tooltip) {
                p.on("mouseover", function (w) {
                    s.showTooltip(w, this, false);
                }).on("mouseout", this.tip.hide).classed("active", true);
            }
            var m = r.exit().transition();
            m.attr("transform", function (w) {
                return "translate(0,0)";
            }).select("rect").attr("width", 0);
            m.remove();
        },
        renderTooltipContent: function (t) {
            this.tip.attr("class", "d3-tip");
            this.tip.direction("n");
            this.tip.offset([-20, 0]);
            var q = {
                percentDiff: t.percentDiff,
                isImproved: t.isImproved,
                prevDate: g.zeroPad(t.prevDate.getDate()),
                prevMonth: this.monthNames[(t.prevDate.getMonth())],
                prevYear: t.prevDate.getFullYear(),
                prevRate: this.volumeFormat(t.prevRate),
                selDate: g.zeroPad(t.selDate.getDate()),
                selMonth: this.monthNames[(t.selDate.getMonth())],
                selYear: t.selDate.getFullYear(),
                selRate: this.volumeFormat(t.selRate)
            };
            var s = this.collection.getGranularity();
            if (s === "hour" || s === "minute") {
                q.timeGranularity = true;
                var o = t.prevDate.getHours();
                var n = t.prevDate.getMinutes();
                var m = t.selDate.getHours();
                var r = t.selDate.getMinutes();
                q.prevTime = ((o < 10) ? "0" + o : o) + ":" + ((n < 10) ? "0" + n : n);
                q.selTime = ((m < 10) ? "0" + m : m) + ":" + ((r < 10) ? "0" + r : r);
            }
            var p = this.tooltipTemplate.render(q);
            this.tip.html(p);
        },
        updateTooltipPos: function (m) {
            this.tip.style("top", (m - 120) + "px");
        }
    });
    return d;
}, function (a) {
    if (window.console && console.log) {
        console.log("APP JS ERROR = " + a);
    }
});
define("transactionsReport/views/ui/reportConfigUI", ["jquery", "underscore", "backbone", "chartlib/events/appstateevents"], function (c, a, e, b) {
    var d = e.View.extend({
        el: '[data-view="TransactionReportConfigUi"]',
        events: {"change #shopperInteraction": "onShopperInteractionChange"},
        initialize: function () {
            this._super(arguments);
            this.shopperInteraction = this.$("#shopperInteraction").val();
        },
        onShopperInteractionChange: function (f) {
            this.shopperInteraction = c(f.currentTarget).val();
            this.sendConfigData();
        },
        sendConfigData: function (f) {
            e.trigger(b.CHANGE_REQUESTED);
        },
        getConfigObject: function () {
            return {shopperInteraction: this.shopperInteraction};
        }
    });
    return d;
});
define("transactionsReport/views/app", ["jquery", "underscore", "backbone", "d3", "chartutil/backbone/r2d3app", "transactionsReport/models/appstate", "transactionsReport/collections/transactionsReportData", "chartlib/events/appstateevents", "chartlib/chartBaseEvents", "transactionsReport/events/transactionsReportEvents", "timeline/views/timelineFacade", "timeline/util/timelineConstants", "chartlib/chartLoadQueue", "transactionsReport/views/transactionsLineChart", "transactionsReport/views/transactionsBarChartRollover", "transactionsReport/views/totalVolumeModule", "transactionsReport/views/errorDisplayModule", "timeline/events/timelineEvents", "transactionsReport/views/ui/reportConfigUI"], function (e, s, a, r, m, g, f, q, k, n, b, h, t, o, j, d, c, i, l) {
    var p = m.extend({
        el: e('[data-view="txsReportContainer"]'), hasLoadQueue: true, initialize: function () {
            this._super();
            a.on(k.REGISTER_DEFERRED, this.registerDeferred, this);
            a.on(q.CHANGE_REQUESTED, this.changeState, this);
            if (this.hasLoadQueue) {
                a.on(q.RENDER_CHARTS, this.hideCover, this);
            }
            this.initModels();
            this.initCollections();
            this.initViews();
        }, initModels: function () {
            this.appState = new g();
        }, initCollections: function () {
            if (this.hasLoadQueue) {
                this.loadQueue = new t();
            }
            this.transactionsReportData = new f();
        }, initViews: function () {
            var v = {
                version: 7,
                timeCollectionMode: h.__LATEST,
                formatPeriod: h.__DAY_FORMAT,
                baseGranularity: h.__MINUTE_GRANULARITY,
                calendar: true,
                loadQueue: this.hasLoadQueue,
                controls: true,
                presets: [h.__PRESET_LAST_7_DAYS, h.__PRESET_LAST_4_WEEKS, h.__PRESET_LAST_YEAR],
                allowDynamicPresets: true,
                config: true,
                chartGranularity: h.__DAY_FORMAT,
                forceCET: true
            };
            e("#timelineChartGranularity").find("[value=hour], [value=minute]").remove();
            this.timeline = new b(v);
            this.configUI = new l();
            this.appState.addConfig({timeline: this.timeline, config: this.configUI, hasMap: false});
            var x = new o({collection: this.transactionsReportData});
            var u = new j({collection: this.transactionsReportData});
            var y = new d({collection: this.transactionsReportData});
            var w = new c({collection: this.transactionsReportData});
            this.listenTo(this.transactionsReportData, n.DATA_ERROR, this.hideCover);
        }, changeState: function () {
            this.$el.css("pointer-events", "none").fadeTo(0, 0.35).find("svg rect", "svg text").css("pointer-events", "none");
            this.deferredArray = [];
        }, registerDeferred: function (w, u, v) {
            var y = this.deferredArray;
            y.push(w);
            var x = this;
            w.done(function (A, z) {
                x.checkDeferredsCallback(y);
            }).fail(function (A, z) {
                x.checkDeferredsCallback(y);
            });
        }, checkDeferredsCallback: function (u) {
            var v = s.every(u, function (w) {
                return w.state() === "resolved" || w.state() === "rejected";
            });
            if (v) {
                this.dataAttempted(u);
            }
        }, dataAttempted: function (u) {
            var v = this;
            if (!this.hasLoadQueue) {
                setTimeout(function () {
                    a.trigger(k.DATA_LOADED);
                    v.hideCover();
                }, 10);
            } else {
                a.trigger(k.DATA_LOADED);
            }
        }, hideCover: function () {
            this.$el.css("pointer-events", "auto").fadeTo(500, 1).find("svg rect", "svg text").css("pointer-events", "auto");
            if (typeof window.SVGElement === "undefined") {
                e("#ie8_d3CanvasCover").css("display", "none");
            }
        }
    });
    return p;
}, function (a) {
    if (window.console && console.log) {
        console.log("APP JS ERROR = " + a);
    }
});
define("transactionsReport/models/state", ["jquery", "underscore", "backbone"], function (c, b, d) {
    var a = d.Model.extend({defaults: {url: "", granularity: "", bdate: "", edate: "", chartGranularity: ""}});
    return a;
});