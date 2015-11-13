/*global define*/
define([], function () {

    'use strict';

    return {

        'pie': {
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
            },
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

        },
        'timeseries': {
            chart: {
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
            },
            exporting: {
                enabled: true
            },
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
                            },
                            select: {
                                stroke: '#666666',
                                fill: '#e6e6e6'
                            }
                        }
                    }
                }
            },
            legend: {
                enabled: true,
                floating: false,
                backgroundColor: '#FFFFFF',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 0,
                symbolPadding: 10,
                itemStyle: {
                    cursor: 'pointer',
                    color: '#666666',
                    fontSize: '11px',
                    fontWeight: 300
                },
                itemHiddenStyle: {
                    color: '#eeeeee'
                },
                itemHoverStyle: {
                    color: '#3ca7da'
                },
                navigation: {
                    activeColor: '#3ca7da',
                    inactiveColor: '#666666',
                    arrowSize: 8,
                    animation: true,
                    style: {
                        color: '#666666',
                        fontSize: '10px'
                    }
                }
            },
            plotOptions: {
                series: {
                    allowPointSelect: true,
                    pointPlacement: "on",
                    animation: {
                        duration: 1000,
                        easing: 'swing'
                    },
                    connectNulls: true,
                    cropThreshold: 3,
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    fillColor: {
                        linearGradient: [0, 0, 0, 350],
                        stops: [
                            [0, 'rgba(55, 155, 205,0.5)'],
                            [1, 'rgba(255,255,255,0)']
                        ]
                    }

                }
            },
            title: {
                enabled: false,
                text: null,
                x: -20
            },
            subtitle: {
                text: null,
                x: -20
            },
            xAxis: {
                gridLineWidth: 1,
                lineColor: '#e0e0e0',
                tickColor: '#e0e0e0',
                gridLineColor: '#eeeeee',
                minTickInterval: 5,
                tickmarkPlacement: 'on',
                labels: {
                    y: 25,
                    style: {
                        color: '#666666',
                        fontWeight: '300',
                        fontSize: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderWidth: 1,
                shadow: false,
                shared : true,
                crosshairs: true,
                valueDecimals: 2,
                valuePrefix: '',
                valueSuffix: ''
            },
        }
    }


});
