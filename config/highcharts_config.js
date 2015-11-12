/*global define*/
define([], function () {

    'use strict';

    return {
        chart: {
            type: 'pie',
            alignTicks: false,
            backgroundColor: '#FFFFFF',
            spacing: [20, 1, 1, 1],
            plotBorderColor: '#ffffff',
            plotBorderWidth: 0,
            style: {
                fontFamily: 'Roboto',
                fontSize: '12px',
                fontWeight: 300
            },
            zoomType: 'xy',
            resetZoomButton: {
                position: {
                    align: 'right',
                    x: -10
                },
                theme: {
                    fill: '#FFFFFF',
                    stroke: '#666666',
                    width: 60,
                    style: {
                        textAlign: 'center',
                        fontSize: 10
                    },
                    states: {
                        hover: {
                            fill: '#e6e6e6',
                            stroke: '#666666'
                        }
                    }
                }
            }
        },
        credits: {
            enabled: false
        }
        ,
        exporting: {
            enabled: true
        }
        ,
        navigation: {
            buttonOptions: {
                theme: {
                    'stroke-width': 1,
                    stroke: '#666666',
                    r: 0,
                    states: {
                        hover: {
                            stroke: '#666666',
                            fill: '#e6e6e6'
                        }
                        ,
                        select: {
                            stroke: '#666666',
                            fill: '#e6e6e6'
                        }
                    }
                }
            }
        }
        ,
        legend: {
            align: 'right',
            verticalAlign: 'middle',
            layout: 'vertical',

            itemMarginTop: 5,
            itemMarginBottom: 5,
            itemStyle: {
                cursor: 'pointer',
                color: '#666666',
                fontSize: '11px',
                fontWeight: 300
            }
            ,
            itemWidth: 150,
            itemHiddenStyle: {
                color: '#eeeeee'
            }
            ,
            itemHoverStyle: {
                color: '#3ca7da'
            }
        }
        ,
        plotOptions: {
            pie: {
                borderWidth: 1,
                startAngle: -45,
                dataLabels: {
                    enabled: false,
                    softConnector: false
                }
            }
        }
        ,
        title: {
            enabled: true,
            text: null,
            x: -20
        }
        ,
        subtitle: {
            text: null,
            x: -20
        }
        ,
        tooltip: {
            shadow: true
        }

    };
});
