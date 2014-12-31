Ext.define('widget.D3GridColumnBar', {
    extend          : 'Ext.sparkline.Base',
    alias           : 'widget.D3GridColumnBar',
    chartBarColor   : '#175f90',

    constructor: function(config) {
        // Initializes our element from the template, and calls initConfig().

        this.callParent([config]);
        // After calling the superclass constructor, the Element is available and
        // can safely be manipulated.  Reference Elements are instances of
        // Ext.Element, and are cached on each Widget instance by reference name.
    },

    element : {
        tag         : 'canvas',
        reference   : 'element',
        style   : {
            display         : 'inline-block',
            verticalAlign   : 'top'
        },
        listeners   : {
            mouseenter  : 'onMouseEnter',
            mouseleave  : 'onMouseLeave',
            mousemove   : 'onMouseMove',
            onmousedown : 'onBarClick'
        },
        width: 0,
        height: 0
    },

    onBarClick : function (e, target) {

    },

    getBarColor : function(){
        return this.chartBarColor;
    },

    onMouseEnter: function(e) {
        this.onMouseMove(e);
    },

    onMouseMove: function (e) {
        var me = this,
            tooltip;

        me.currentPageXY = e.getPoint();

        tooltip = me.tooltip;
        if (me.$widgetColumn.disableTooltips) {
            tooltip.setTarget('invisible-tip');
        } else {
            if (me.values > 0) {
                tooltip.update(me.$widgetColumn.text + ' : ' + me.values );
            }
        }
        if (me.values > 0) {
            me.renderGraph(true);
        }
    },

    onMouseLeave: function (e) {
        var me = this;
        me.currentPageXY = me.targetX = me.targetY = null;

        if (me.values > 0) {
            this.renderGraph(false);
        }
    },

    calcHighlightColor: function(color) {
        return d3.rgb(color).darker(1);
    },

    renderBar: function(highlight) {
        var x               = d3.scale.linear().domain([this.$widgetRecord.store.min(this.dataIndex), this.$widgetRecord.store.max(this.dataIndex)]).range([0, this.getWidth() - 40]),
            targettop       = Math.round(this.getHeight() * 0.10),
            targetheight    = this.getHeight() - (targettop * 10),
            color           = this.getBarColor(),
            targetWidth     = parseInt(x(parseInt(this.values)));

        if (highlight) {
            color = this.calcHighlightColor(color);
        }

        return this.canvas.drawRect(0, targetheight, targetWidth, this.getHeight(), color, color);
    },

    renderLabel: function(){
        var x = d3.scale.linear().domain([this.$widgetRecord.store.min(this.dataIndex), this.$widgetRecord.store.max(this.dataIndex)]).range([0,this.getWidth() - 40]);
        var b_canvas = document.getElementById(this.element.dom.id);
        var b_context = b_canvas.getContext("2d");

        b_context.font = "12px Arial";
        b_context.fillStyle = "#000";
        b_context.fillText(this.values, parseInt(x(parseInt(this.values))) + 10 ,  (this.getHeight() / 2.10));
    },

    renderGraph: function(highlight){

        var me = this,
            canvas = me.canvas,
            shape,
            shapes = me.shapes || (me.shapes = {}),
            valueShapes = me.valueShapes || (me.valueShapes = {});

            shape = me.renderBar(highlight).append();

            shapes[shape.id] = 't0';
            valueShapes.t0 = shape.id;


        // If mouse is over, apply the highlight
        if (me.currentPageXY && me.el.getRegion().contains(me.currentPageXY)) {
            me.updateDisplay();
        }

        canvas.render();
        me.renderLabel();
    }
});