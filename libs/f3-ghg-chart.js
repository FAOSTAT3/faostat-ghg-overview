define([
    'jquery',
    'config/highcharts_config'
], function ($, HighchartsConfig) {

    'use strict';

    function F3_CHART() {

        var COLORS = [
            '#379bcd',
            '#76BE94',
            '#744490',
            '#E10079',
            '#2D1706',
            '#F1E300',
            '#F7AE3C',
            '#DF3328'
        ];

        var FENIX_COLORS = ['#1f678a','#92a8b7','#5eadd5','#6c79db','#a68122','#ffd569','#439966','#800432','#067dcc',
            '#1f678a','#92a8b7','#5eadd5','#6c79db','#a68122','#ffd569','#439966','#800432','#067dcc'
        ];

        function createPie(obj, data) {

            var colors = obj.colors || FENIX_COLORS,
                series = [],
                serie = {};

            serie.name = obj.serie.name;
            serie.type = 'pie';
            serie.data = [];
            serie.showInLegend = true;
            for (var i = 0; i < data.length; i++) {
                serie.data.push([data[i][0], parseFloat(parseFloat(data[i][1]).toFixed(2))]);
            }
            series.push(serie);

            var chart = {
                chart: {
                    renderTo: obj.renderTo
                },
                colors: colors,
                series: series
            };

            var c = new Highcharts.Chart($.extend(true, {}, HighchartsConfig.pie, chart));

        }

        function createTimeserie(chart, type, s) {

            /* colors */
            var colors = chart.colors || COLORS;

            var data = [];
            for (var i = 0; i < s.length; i++) {
                var obj = s[i];
                if (typeof s[i] == 'string') {
                    obj = $.parseJSON(s[i]);
                }
                for (var j = 0; j < obj.length; j++) {
                    data.push(obj[j]);
                }
            }
            if (data.length <= 0) {
            }
            else {
                var series = [];
                var yAxis = [];

                /** Initiate variables */
                var check = [];
                var mus = [];
                var ind = data[0][1];
                var count = 0;
                var maxLength = 0;
                var maxLengthIND = data[0][1];
                var maxLengthIDX = "";

                /** Re-shape data into 'vectors' */
                var vectors = {};
                vectors[ind] = {};
                vectors[ind].dates = [];
                vectors[ind].mus = [];
                vectors[ind].values = new Hashtable();


                /** Create a vector for each indicator */
                for (var i = 0; i < data.length; i++) {
                    if (data[i][1] == ind) {
                        count++;
                        vectors[ind].dates.push(data[i][0]);
                        vectors[ind].mus.push(data[i][3]);
                        vectors[ind].values.put(data[i][0], data[i][2]);
                    } else {
                        check.push(count);
                        if (count > maxLength) {
                            maxLength = count;
                            maxLengthIDX = check.length - 1;
                            maxLengthIND = ind;
                        }
                        ind = data[i][1];
                        vectors[ind] = [];
                        vectors[ind].dates = [];
                        vectors[ind].mus = [];
                        vectors[ind].values = new Hashtable();
                        count = 1;
                        vectors[ind].dates.push(data[i][0]);
                        vectors[ind].mus.push(data[i][3]);
                        vectors[ind].values.put(data[i][0], data[i][2]);
                    }
                }
                check.push(count);

                /** Collect all the years */
                var y = new Hashtable();
                var yearsList = [];
                for (var key in vectors) {
                    for (var i = 0; i < vectors[key].dates.length; i++) {
                        if (y.get(vectors[key].dates[i]) == null) {
                            y.put(vectors[key].dates[i], vectors[key].dates[i]);
                            yearsList.push(parseInt(vectors[key].dates[i]));
                        }
                    }
                }

                /** TODO: get min year, get max year. check if the years are always sorted**/
                yearsList = yearsList.sort();
                var years = [];
                for (var i = yearsList[0]; i <= yearsList[yearsList.length - 1 ]; i++) {
                    years.push(i.toString());
                }

                // check if it's just one year (X-axis), in that case force to bar chart (if it's not column/bar)
                if (years.length <= 1 && type != 'bar' && type != 'column') {
                    type = 'column';
                }

                /** TODO: Collect the MUs in the other cycle, Collect measurement units */
                $.each(vectors, function (k, v) {
                    if ($.inArray(vectors[k].mus[0], mus) < 0)
                        mus.push(vectors[k].mus[0]);
                });

                var index = 0;
                $.each(vectors, function (k, v) {

                    var s = {};
                    s.name = k;
                    s.type = type;
                    s.yAxis = $.inArray(vectors[k].mus[0], mus);

                    // data should be the same length of the years
                    s.data = [];
                    // if the data is contained in the hashmap
                    for (var i = 0; i < years.length; i++) {
                        if (vectors[k].values.get(years[i]) != null) {
                            s.data.push(parseFloat(vectors[k].values.get(years[i])));
                        }
                        else
                            s.data.push(null);
                    }
                    s.marker = {
                        enabled: true,
                        symbol: 'circle',
                        radius: 2,
                        lineWidth: 1,
                        lineColor: colors[index],
                        fillColor: '#FFFFFF',
                        states: {
                            hover: {
                                enabled: true,
                                symbol: 'circle',
                                fillColor: '#FFFFFF',
                                radius: 3,
                                lineWidth: 2
                            }
                        }
                    }
                    index++;
                    series.push(s);
                });

                /** Create a Y-Axis for each measurement unit */
                for (var i = 0; i < mus.length; i++) {
                    var a = {};
                    a.title = {};
                    a.title.text = mus[i];
                    a.title.style = {};
                    a.title.style.color = colors[i];
                    if (i > 0)
                        a.opposite = true;
                    a.labels = {};
                    a.labels.style = {
                        color: '#666666',
                        fontWeight: '300',
                        fontSize: 11
                    };
                    a.labels.style.color = colors[i];
                    a.gridLineWidth =  1;
                    yAxis.push(a);
                }
            }

            var chart = {
                chart: {
                    type: type,
                    renderTo: chart.renderTo
                },
                colors: colors,
                xAxis: {
                    categories: years
                },
                yAxis: yAxis,
                series: series
            }

            var c = new Highcharts.Chart($.extend(true, {}, HighchartsConfig.timeseries, chart));
        }

        return {
            createPie: createPie,
            createTimeserie: createTimeserie
        };

    }

    return F3_CHART;
});

