
var repository = '//fenixrepo.fao.org/cdn/';

require.config({

    waitSeconds: 3,

    paths: {
        'jquery':  repository + 'js/jquery/1.10.2/jquery-1.10.2.min',
        'highcharts': repository + 'js/highcharts/4.0.4/js/highcharts',
        'highcharts-exporting' : repository + 'js/highcharts/4.0.4/js/modules/exporting',
        'f3-ghg-chart': repository + 'faostat3/f3-ghg-chart/f3-ghg-chart',
        'wide-table': repository + 'faostat3/wide-table/0.0.1/wide-table-min',
        'handlebars': repository + 'js/handlebars/2.0.0/handlebars',
        'chosen': repository + 'js/chosen/1.2.0/chosen.jquery.min',
        'jshashtable': repository + 'js/jshashtable/0.0.1/jshashtable',
        'ghg-overview': 'src/js/ghg-overview',

        // commmons requirejs libraries
        'text': 'libs/text',
        'i18n': 'libs/i18n',
        'domReady': 'libs/domReady'

    },

    shim: {

        'highcharts': ['jquery'],
        'highcharts-exporting': ['highcharts'],
        'f3-ghg-chart': ['highcharts'],
        'chosen': ['jquery'],
        'handlebars': ['jquery']

    }
});

var locale = "E"; //S, F

require.config({'locale': locale});

/* Bootstrap the application. */
require([
    'ghg-overview',
    'domReady!'
], function (GHG_OVERVIEW) {

    var m = new GHG_OVERVIEW();
    m.init({
            lang: locale,
            placeholder: '#module',
            datasource: 'faostat' //'faostatdb'
        });
});