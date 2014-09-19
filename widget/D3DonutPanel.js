//noinspection JSUnusedLocalSymbols
/**
 * Created by JetBrains WebStorm.
 * User: Joshua McDonald
 * To change this template use File | Settings | File Templates.
 */
Ext.define('widget.D3Donutpanel', {

    extend          : 'Ext.panel.Panel',
    dataUrl         : '',                       // url of json data for the chart, json should be in the
                                                // following format, label and value are required, any attached
                                                // data points will get passed to the click event i.e. primary keys etc .. :

                                                //{'results': 1, 'data':[{'some_value': 'not required', 'label': 'Required', 'value': 17}]}

    localData       : '',                       // placeholder so that data can be stored for faster resize
    layout          : 'fit',
    chartTitle      : '',                       // chart title displayed above the chart
    tooltipAppend   : '',                       // text to append to the tooltip value
    alias           : 'widget.D3Donutpanel',
    showTotal       : false,                    // show total in the center of the chart
    totalType       : 'sum',                    // sum or avg
    showChartlabels : true,
    initComponent : function(){

        this.on({
            resize:function(me){
                me.refreshSize(me,this.getSize().width,this.getSize().height);
            }
        });

        Ext.applyIf(this,{
            plain   : true,
            layout  : 'fit',
            html    : '<donutchart></donutchart>',
            border  : false
        });

        this.callParent();
    },

    refreshSize: function(me, width, height){
        me.drawChart(me, width, height)
    },

    /*
       reload the json from the server and refresh the chart
    */
    reloadData: function(params){
        var me = this;

        d3.text(me.dataUrl,'text/plain', function(error) {
            if (error) return console.warn(error);
        }).on("load", function(data) {
                var decodedData = Ext.JSON.decode(data);
                me.localData = decodedData.data;
                me.drawChart(me,me.getSize().width,me.getSize().height);
            });
    },

    /*
        Data includes the full JSON record that is passed
        to the chart slice, not just the key value pair.
     */
    onChartClick: function(record){
        console.log(record);
    },

    drawChart: function(me, width, height){

        if(me.dataUrl){
            if(me.localData === ''){
                /*
                 Done to ensure that the standard JSON that
                 is used with extjs does not trip up teh json decode that
                 D3.js does.
                 */
                d3.text(me.dataUrl,'text/plain', function(error) {
                    if (error) return console.warn(error);
                }).on("load", function(data) {
                        var decodedData = Ext.JSON.decode(data);
                        me.localData = decodedData.data;
                        setupChart(me.localData);
                    });
            } else {
                setupChart(me.localData);
            }
        } else {
            throw 'dataUrl is required';
        }

        function setupChart(data){

            var chartTooltip = function(key, y, e) {
                return '<h3>' + key + '</h3><p>' + e.value + ' ' + me.tooltipAppend + '</p>';
            };

            var sum         = 0;
            var oldSum      = 0;
            var subtract    = 0;


            var calculateCenterValue = function(){
                subtract    = 0;

                d3.selectAll("." + me.getId().toString() + "-total-text")
                    .transition()
                    .delay(300)
                    .tween( 'text', function(d) {

                        oldSum = sum;
                        sum = 0;

                        d.forEach(function(e){
                            sum += e.value;
                        });

                        d3.selectAll("#" + me.getId().toString() + " donutchart svg .disabled").each(function(pd){
                            subtract += pd.value;
                        });

                        if(me.totalType == 'avg'){
                            sum = (sum - subtract) / d.length;
                        } else {
                            sum = (sum - subtract);
                        }

                        var interpolator = d3.interpolateRound( oldSum, sum );

                        return function(t) {
                            // set new value to current text element
                            this.textContent = interpolator( t );
                        };
                    });
            };

            var selector = "#" + me.getId().toString() + " donutchart svg";

                d3.select(selector).remove();
                selector = "#" + me.getId().toString() + " donutchart";

                d3.select(selector).append("svg")
                .attr("width", width)
                .attr("height", height - 35);

            selector = "#" + me.getId().toString() + " donutchart svg";

            var chart = nv.models.pieChart()
                .x(function(d) { return d.label  })
                .y(function(d) { return d.value })
                .showLabels(me.showChartlabels)       //Display pie labels
                .labelThreshold(.05)    //Configure the minimum slice size for labels to show up
                .labelType("key")       //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                .donut(true)            //Turn on Donut mode. Makes pie chart look tasty!
                .donutRatio(0.35);

            chart.tooltipContent(chartTooltip);

            chart.legend.margin({
                top     : 20,
                bottom  : -5,
                left    : 0,
                right   : 0
            });

            d3.select(selector)
                .datum(data)
                .transition().duration(350)
                .call(chart);

            d3.selectAll("#" + me.getId().toString() + " donutchart svg .nv-slice")
                .on('click', function(d){
                    me.onChartClick(d.data);
                });

            d3.selectAll("#" + me.getId().toString() + " donutchart svg .nv-series")
                .on('click.legend', function(){
                    if( me.showTotal == true){
                        Ext.Function.defer(calculateCenterValue,500,this);
                    }
                });

            d3.select(selector)
                .append("text")
                .attr("x", width / 2 )
                .attr("y", 20)
                .attr("text-anchor", "middle")
                .style("font-size", "14px")
                .style("font-weight", "bold")
                .text(me.chartTitle);

            if( me.showTotal == true){

                d3.selectAll("#" + me.getId().toString() + " donutchart svg .nv-pie g .nv-pie")
                    .append("text",0)
                    .attr("text-anchor", "middle")
                    .style("font-size", "28px")
                    .attr("class", me.getId().toString() + "-total-text")
                    .style("font-weight", "bold")
                    .attr("transform", function() {
                            return "translate(0," + (28/3) + ")";
                    });

                calculateCenterValue();
            }
        }
    }
});