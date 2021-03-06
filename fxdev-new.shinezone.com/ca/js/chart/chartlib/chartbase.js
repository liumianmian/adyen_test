define("chartlib/chartbase", ["jquery", "underscore", "backbone", "d3", "d3tip", "chartlib/chartBaseEvents", "chartutil/domUtils"], function (f, b, h, c, a, g, e) {
    var d = h.View.extend({
        chartDefaults: {
            joinAttr: null,
            barHeight: null,
            barPadding: 0,
            margin: {top: 0, right: 0, bottom: 0, left: 0},
            xAttr: "x",
            xValid: b.isFinite,
            xScale: "linear",
            yAttr: "y",
            yValid: b.isFinite,
            yScale: "linear",
            tooltip: false,
            showTipFromText: false,
            isClickable: false,
            clickFromText: false
        }, __DEFAULT_WIDTH: 500, __DEFAULT_HEIGHT: 50, initialize: function () {
            b.bindAll(this, "joinData", "initTooltip");
            this.options = b.defaults(this.options, b.defaults(this.defaults, this.chartDefaults));
            this._super(arguments);
            this.initRender();
            if (this.collection) {
                this.listenTo(this.collection, g.DATA_FAILED, this.dataLoadError);
            }
        }, dataLoadError: function () {
            this.$el.find(".no-data-text").remove();
            var k = this.height / 2;
            var j = this.width / 2;
            var i = f('<div class="no-data-text"><text style="color: #ccc; font-size: 14px; position: relative; top:' + k + "px; left:" + j + 'px;">no data to display</text></div>');
            this.$el.not(this.$el.has(".no-data-text")).prepend(i);
            this.$el.children().not(".no-data-text").hide();
            i.show();
        }, initRender: function () {
            var j = this;
            var k = this.options.margin;
            var i = e.getComputedProperties(this.$el);
            this.width = this.$el.width() > 0 ? this.$el.width() : i.computedWidth;
            this.width -= (k.left + k.right);
            this.height = this.$el.height() > 0 ? this.$el.height() : i.computedHeight;
            this.height -= (k.top + k.bottom);
            if (this.width <= 0) {
                this.width = this.__DEFAULT_WIDTH;
            }
            if (this.height <= 0) {
                if ((this.$el.parent().height() - (k.top + k.bottom)) > 0) {
                    this.height = this.$el.parent().height() - (k.top + k.bottom);
                    this.$el.height(this.$el.parent().height());
                } else {
                    this.height = this.__DEFAULT_HEIGHT;
                }
            }
            this.topSVG = this.topSVG || c.select(this.el).append("svg").attr("class", "chartbase-svg");
            this.svg = this.svg || this.topSVG.append("g").attr("class", "chartbase-holder").attr("transform", "translate(" + k.left + "," + k.top + ")");
            this.xAxis = this.xAxis || this.svg.append("g").attr("class", "x axis").attr("transform", "translate(0,0)");
            this.yAxis = this.yAxis || this.svg.append("g").attr("class", "y axis");
            this.setScales();
            this.setAxes();
            if (this.options.tooltip) {
                this.$el.toggleClass("interactive-chart", true);
                this.initTooltip();
            }
        }, render: function () {
            if (this.collection.hasData === false) {
                return;
            }
            var i = this.options.margin;
            if (this.options.barHeight !== null) {
                this.height = (this.collection.length * this.options.barHeight);
            }
            this.topSVG.attr("width", this.width + i.left + i.right + "px").attr("height", this.height + i.top + i.bottom + "px");
            this.$el.find(".no-data-text").remove();
            this.$el.children().not(".no-data-text").show();
            this.update();
            return this;
        }, update: function () {
            this.calibrateScales();
            this.renderXAxis();
            this.renderYAxis();
            this.renderData();
        }, initTooltip: function () {
            if (typeof d.prototype.tip === "undefined") {
                d.prototype.tip = c.tip().attr("class", "d3-tip").offset([-10, 0]);
                this.svg.call(this.tip);
            }
        }, setScales: function () {
            this.scales = {};
            this.setXScale();
            this.setYScale();
        }, calibrateScales: function () {
            this.calibrateXScale();
            this.calibrateYScale();
        }, setAxes: function () {
            this.axes = {};
            this.setXAxis();
            this.setYAxis();
            this.formatXAxis();
            this.formatYAxis();
        }, getX: function (i) {
            return this._getDatumValue(i, this.options.xAttr);
        }, getY: function (i) {
            return this._getDatumValue(i, this.options.yAttr);
        }, _getDatumValue: function (j, i) {
            if (j instanceof h.Model) {
                return j.get(i);
            }
            return j ? j[i] : null;
        }, joinData: function (l, k) {
            var j = this.options.joinAttr;
            if (j && l instanceof h.Model) {
                return l.get(j);
            } else {
                if (j && b(l).has(j)) {
                    return l[j];
                } else {
                    return k;
                }
            }
        }, setXScale: function () {
        }, setYScale: function () {
        }, calibrateXScale: function () {
        }, calibrateYScale: function () {
        }, setXAxis: function () {
        }, setYAxis: function () {
        }, formatXAxis: function () {
        }, formatYAxis: function () {
        }, renderXAxis: function () {
        }, renderYAxis: function () {
        }, renderData: function () {
        }
    });
    return d;
});