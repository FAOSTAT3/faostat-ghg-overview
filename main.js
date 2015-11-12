/* URLs with repository and static files */
var repository = '//fenixrepo.fao.org/cdn/js/';

require.config({

    waitSeconds: 1,

    paths: {
        'jquery':  repository + 'jquery/1.10.2/jquery-1.10.2.min',
        'highcharts': repository + 'highcharts/4.0.4/js/highcharts',
        'highcharts_exporting' : repository + 'highcharts/4.0.4/js/modules/exporting',

        // commmons requirejs libraries
        'text': 'libs/text',
        'i18n': 'libs/i18n',
        'domReady': 'libs/domReady',

        'handlebars': repository + 'handlebars/2.0.0/handlebars',
        'chosen': repository + 'chosen/1.2.0/chosen.jquery.min',

        'ghg-overview': 'src/js/ghg-overview'
    },

    shim: {

        'highcharts': ['jquery'],
        'highcharts_exporting': ['highcharts'],
        'FENIXChartsLibrary': ['highcharts'],
        'bootstrap': ['jquery'],
        'chosen': ['jquery'],

        'underscore': {
            deps :['jquery'],
            exports: '_'
        }

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
            placeholder: 'body',
            datasource: 'faostat' //'faostatdb'
        });
});