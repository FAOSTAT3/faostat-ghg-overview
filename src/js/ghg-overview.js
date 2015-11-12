define([
    'jquery',
    'handlebars',
    'text!html/template.html',
    'config/queries.js',
    'i18n!nls/i18n',
    'libs/pivot-table',
    'libs/f3-ghg-chart',
    'chosen',
    'highcharts',
    'highcharts_exporting'
], function ($, Handlebars, template, queries, i18n, Table, Chart) {

    'use strict';

    function GHG_OVERVIEW() {

        this.CONFIG = {

            placeholder: 'container',
            lang: 'E',

            // DATASOURCE
            datasource: 'faostatdb',

            // Values used in the queries
            domaincode: 'GT',
            itemcode: ['1709','5066','5067','5058','5059','5060'],
            elementcode: ['7231'],
            selected_aggregation: "AVG",

            // Default URLs
            baseurl: 'http://faostat3.fao.org',
            baseurl_data: '/wds/rest/table/json',
            baseurl_countries: '/wds/rest/procedures/countries',
            baseurl_years: '/wds/rest/procedures/years',

            // Default Values of the comboboxes
            selected_areacodes: [],
            selected_from_year: [1990],
            selected_to_year: [2012],
            timerange:[1990, 2012],

            decimal_values: 2,
            colors: {
                itemcode: {
                    5058: '#9B2335',
                    5059: '#E15D44',
                    1709: '#5B5EA6',
                    5060: '#EFC050',
                    5066: '#DD4124',
                    5067: '#C3447A'
                }
            },

            alternative_colors: ['#1f678a','#92a8b7','#5eadd5','#6c79db','#a68122','#ffd569','#439966','#800432','#067dcc',
                '#1f678a','#92a8b7','#5eadd5','#6c79db','#a68122','#ffd569','#439966','#800432','#067dcc'
            ],

            // selectors
            s: {
                country_list: "#fs_country_list",
                from_year_list: "#fs_from_year_list",
                to_year_list: "#fs_to_year_list",
                sectors_list: "#fs_sectors_list",

                domains: "#fs_overview_domains",
                table: "#fs-overview-tables",
                table_button: "#fs-overview-tables-button",
                overview_panel: "#fs_overview_panel",
                world_total: '#fs_world_total',
                country_total_name: '#fs_country_total_name',
                note: '#fs_overview_note',

            }
        };

        return this;

    };

    GHG_OVERVIEW.prototype.init = function(config){

        // get configuration changes
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        // Load UI
        this.$CONTRAINER = $(this.CONFIG.placeholder);

        this.initTemplate();
        this.initVariables();
        this.initUI();

    };

    GHG_OVERVIEW.prototype.initTemplate = function() {

        var t = Handlebars.compile(template);
        this.$CONTRAINER.html(t(i18n));

    };

    GHG_OVERVIEW.prototype.initVariables = function() {

        this.$COUNTRY_LIST = this.$CONTRAINER.find(this.CONFIG.s.country_list);
        this.$FROM_YEAR = this.$CONTRAINER.find(this.CONFIG.s.from_year_list);
        this.$TO_YEAR = this.$CONTRAINER.find(this.CONFIG.s.to_year_list);
        this.$SECTOR_LIST = this.$CONTRAINER.find(this.CONFIG.s.sectors_list);

        this.$TABLE_BUTTON = this.$CONTRAINER.find(this.CONFIG.s.table_button);
        this.$OVERVIEW_PANEL =  this.$CONTRAINER.find(this.CONFIG.s.overview_panel);
        this.$COUNTRY_TOTAL_NAME =  this.$CONTRAINER.find(this.CONFIG.s.country_total_name);
        this.$NOTE =  this.$CONTRAINER.find(this.CONFIG.s.note);

    };

    GHG_OVERVIEW.prototype.initUI = function() {

        // Populate DropDowns
        this.populateCountriesDD({disable_search_threshold: 10});
        this.populateYearsDD(this.$FROM_YEAR, this.CONFIG.selected_from_year, {disable_search_threshold: 10});
        this.populateYearsDD(this.$TO_YEAR, this.CONFIG.selected_to_year, {disable_search_threshold: 10});

        this.$SECTOR_LIST.chosen();

        // show/hide table
        var self = this;
        this.$TABLE_BUTTON.on('click', function() {
            $(self.CONFIG.s.table).toggle();
        });

    };

    GHG_OVERVIEW.prototype.populateCountriesDD = function(chosen_parameters) {

        var self = this,
            defaultCodes = this.CONFIG.selected_areacodes,
            url = this.CONFIG.baseurl + this.CONFIG.baseurl_countries + "/" + this.CONFIG.datasource + "/" + this.CONFIG.domaincode + "/" + this.CONFIG.lang;

        $.ajax({
            url: url,
            type: 'GET',
            dataType:'json',
            success: function (response) {

                self.$COUNTRY_LIST.append(self.populateDD(response, defaultCodes));
                self.$COUNTRY_LIST.on('change', function() {
                    self.updateView();
                });

                self.$COUNTRY_LIST.chosen(chosen_parameters);

                if (defaultCodes.length > 0) {
                    self.updateView();
                }

            },
            error: function (a, b, c) {console.error(a, b, c);}
        });

    };

    GHG_OVERVIEW.prototype.populateDD = function(values, defaultCodes) {

        var options = [];
        for(var i=0; i < values.length; i++) {
            if( defaultCodes.indexOf(values[i][0]) > -1) {
                options.push('<option selected value="' + values[i][0] + '">' + values[i][1] + '</option>')
            }else{
                options.push('<option value="' + values[i][0] + '">' + values[i][1] + '</option>')
            }
        }
        return options.join();

    };

    GHG_OVERVIEW.prototype.populateYearsDD = function($DD, defaultCodes, chosen_parameters) {

        var fromyear = this.CONFIG.timerange[0],
            toyear = this.CONFIG.timerange[1];

        var options = [];
        for(var year = toyear; year >= fromyear; year--) {
            if( defaultCodes.indexOf(year) > -1 ) {
                options.push('<option selected value="' + year + '">' + year + '</option>');
            }else{
                options.push('<option value="' + year + '">' + year + '</option>');
            }
        }

        // add html
        $DD.append(options.join());

        var self = this;
        $DD.on('change', function() {
            self.updateView();
        });

        $DD.chosen(chosen_parameters);

    };

    GHG_OVERVIEW.prototype.updateView = function() {

        this.CONFIG.selected_areacodes = this.$COUNTRY_LIST.val();
        this.CONFIG.selected_from_year = this.$FROM_YEAR.val();
        this.CONFIG.selected_to_year = this.$TO_YEAR.val();

        if (this.CONFIG.selected_areacodes !== null) {
            // show panel
            this.$NOTE.hide();
            this.$OVERVIEW_PANEL.show();

            // update views
            this.updateCountryBoxes(queries);
            this.updateWorldBoxes(queries);
            this.updateContinentBoxes(queries);
            this.updateSubRegionBoxes(queries);

            this.updateChartsByCountries(queries);
        }
        else{
            this.$NOTE.show();
            this.$OVERVIEW_PANEL.hide();
        }

    };

    GHG_OVERVIEW.prototype.updateWorldBoxes = function(json) {

        var obj = this.getConfigurationObject(),
            // world code
            arecode = ['5000'],
            query_total = json.world_total;

        // total
        var total_obj = obj;
        total_obj.areacode = arecode;
        query_total = this.replaceValues(query_total, total_obj);
        this.createTitle("fs_world_total", query_total.sql);

        // chart
        var query_chart = json.byarea_chart;
        var chart_obj = obj;
        chart_obj.areacode = arecode;
        query_chart = this.replaceValues(query_chart, chart_obj);

        this.createChart("fs_world_chart", query_chart.sql, "pie");
        this.updateTableWorld(queries);

    };

    GHG_OVERVIEW.prototype.updateContinentSubRegionBoxes = function(json, query, config) {

        var self = this,
            query_total = query,
            total_obj = this.getConfigurationObject(),
            updateTimeserieAgricultureTotal = config.updateTimeserieAgricultureTotal;

        // Getting Area Codes
        total_obj.areacode = this.getQueryAreaCodes();
        query_total = this.replaceValues(query_total, total_obj);

        var data = {};
        data.datasource = this.CONFIG.datasource;
        data.json = JSON.stringify(query_total.sql);
        $.ajax({
            type : 'POST',
            url : this.CONFIG.baseurl + this.CONFIG.baseurl_data,
            data : data,
            success : function(response) {

                var codes = [];
                var labels = [];
                for ( var i=0; i < response.length; i++) {
                    codes.push(response[i][0]);
                    labels.push(response[i][1]);
                }

                self.createChartAreaBox(json, config.id, codes.join(","), labels.join(','));
                self.updateAreasTable(config, json.byarea_table, codes.join(","));

                if ( updateTimeserieAgricultureTotal ) {
                    self.updateTimeserieAgricultureTotal(json, codes.join(","));
                }

            },
            error: function (a, b, c) {
                console.error(a, b, c);
            }

        });
    };

    GHG_OVERVIEW.prototype.updateContinentBoxes = function(json) {

        this.updateContinentSubRegionBoxes(json, json.query_regions, {
                id: "fs_continent",
                placeholder: "fs_continent_table",
                title: i18n.by_continent,
                header: {
                    column_0: i18n.region,
                    column_1: i18n.category
                },
                content: {
                    column_0: ""
                },
                total: {
                    column_0: i18n.total,
                    column_1:  i18n.agriculture_total
                },
                add_first_column: true
        });

    };

    GHG_OVERVIEW.prototype.updateSubRegionBoxes = function(json) {

        this.updateContinentSubRegionBoxes(json, json.query_sub_regions, {
            id: "fs_region",
            placeholder: "fs_region_table",
            title: i18n.by_region,
            header: {
                column_0: i18n.region,
                column_1: i18n.category
            },
            content: {
                column_0: ""
            },
            total: {
                column_0:i18n.total,
                column_1: i18n.agriculture_total
            },
            add_first_column: true,
            updateTimeserieAgricultureTotal: true
        });

    };

    GHG_OVERVIEW.prototype.updateChartsByCountries = function(json) {

        var obj = this.getConfigurationObject(),
            areacodes = this.getQueryAreaCodes();

        // Create Charts by item
        var query_total = json.byitem_chart;
        var total_obj = obj;
        total_obj.areacode = areacodes;
        total_obj.itemcode = ['5058'];
        query_total = this.replaceValues(query_total, total_obj);
        this.createChart("fs_chart_0", query_total.sql, 'timeserie', ['#9B2335']);

        var query_total = json.byitem_chart;
        var total_obj = obj;
        total_obj.areacode = areacodes;
        total_obj.itemcode = ['5059'];
        query_total = this.replaceValues(query_total, total_obj);
        this.createChart("fs_chart_1", query_total.sql, 'timeserie', ['#E15D44']);

        var query_total = json.byitem_chart;
        var total_obj = obj;
        total_obj.areacode = areacodes;
        total_obj.itemcode = ['1709'];
        query_total = this.replaceValues(query_total, total_obj);
        this.createChart("fs_chart_2", query_total.sql, 'timeserie', ['#5B5EA6']);

        var query_total = json.byitem_chart;
        var total_obj = obj;
        total_obj.areacode = areacodes;
        total_obj.itemcode = ['5060'];
        query_total = this.replaceValues(query_total, total_obj);
        this.createChart("fs_chart_3", query_total.sql, 'timeserie', ['#EFC050']);

        var query_total = json.byitem_chart;
        var total_obj = obj;
        total_obj.areacode = areacodes;
        total_obj.itemcode = ['5066'];
        query_total = this.replaceValues(query_total, total_obj);
        this.createChart("fs_chart_4", query_total.sql, 'timeserie', ['#DD4124']);

        var query_total = json.byitem_chart;
        var total_obj = obj;
        total_obj.areacode = areacodes;
        total_obj.itemcode = ['5067'];
        query_total = this.replaceValues(query_total, total_obj);
        this.createChart("fs_chart_5", query_total.sql, 'timeserie', ['#C3447A']);

    };

    GHG_OVERVIEW.prototype.updateCountryBoxes = function(json) {

      var codes = this.getQueryAreaCodes(),
          id = "fs_country",
          id_table = id + "_table",
          config = {
            placeholder : id_table,
            title: i18n.by_country,
            header: {
                column_0: i18n.country,
                column_1: i18n.category
            },
            content: {
                column_0: ""
            },
            total: {
                column_0:i18n.total,
                column_1: i18n.agriculture_total
            },
            add_first_column: true
        };

        this.updateCountryListNames();
        this.createChartAreaBox(json, id, codes, null);
        this.updateAreasTable(config, json.byarea_table, codes);

    };

    GHG_OVERVIEW.prototype.updateCountryListNames = function() {

        var values = this.$COUNTRY_LIST.find("option:selected");
        var labels = [];
        if ( typeof values == "object") {
            for (var i = 0; i < values.length; i++) {
                labels.push(values[i].text);
            }
        }
        this.$COUNTRY_TOTAL_NAME.html(labels.join(", "));

    };

    GHG_OVERVIEW.prototype.createChartAreaBox = function(json, id, areacode, areanames) {

        var obj = this.getConfigurationObject(),
            query_total = json.byarea_total,
            total_obj = obj;

        total_obj.areacode = areacode;
        query_total = this.replaceValues(query_total, total_obj);

        if ( areanames ) {
            $("#" + id + "_total_name").html(areanames);
        }

        // Create Pie
        var query_chart = json.byarea_chart;
        var chart_obj = obj;
        chart_obj.areacode = areacode;
        query_chart = this.replaceValues(query_chart, chart_obj);

        this.createTitle(id + "_total", query_total.sql);
        this.createChart(id + "_chart", query_chart.sql, "pie");

    };

    GHG_OVERVIEW.prototype.updateTimeserieAgricultureTotal = function(json, regions) {

        var total_obj = this.getConfigurationObject(),
            areacodes = this.getQueryAreaCodes() + ',' + regions,
            query_total = json.agriculture_total_chart;

        total_obj.areacode = areacodes;
        query_total = this.replaceValues(query_total, total_obj);
        this.createChart("fs_agriculture_total_chart", query_total.sql, 'timeserie');

    };

    GHG_OVERVIEW.prototype.createTitle = function(id, sql) {

        var data = {};
        data.datasource = this.CONFIG.datasource;
        data.json = JSON.stringify(sql);
        var self = this;
        $.ajax({
            type : 'POST',
            url : this.CONFIG.baseurl + this.CONFIG.baseurl_data,
            data : data,
            success : function(response) {
                $("#" + id + "_element").html(response[0][0]);
                var value = Number(parseFloat(response[0][1]).toFixed(self.CONFIG.decimal_values)).toLocaleString();
                $("#" + id + "_value").html(value)
            },
            error : function(err, b, c) {}
        });

    };

    GHG_OVERVIEW.prototype.createChart = function(id, sql, type, colors) {

        $(id).show();
        var data = {};
        data.datasource = this.CONFIG.datasource;
        data.json = JSON.stringify(sql);

        var chartObj = {renderTo: id, title: "title"};
        var self = this;
        $.ajax({
            type : 'POST',
            url : this.CONFIG.baseurl + this.CONFIG.baseurl_data,
            data : data,
            success : function(response) {

                if (response.length > 0) {

                    // get colors
                    chartObj.colors = colors || null;

                    var c = new Chart();
                    switch (type) {
                        case "pie" :
                            chartObj.serie = {
                                name: i18n.pie_mu
                            };
                            chartObj.colors = colors || self.getColorsPie(response) || null;
                            c.createPie(chartObj, response);
                            break;
                        case "timeserie" :
                            c.createTimeserie(chartObj, 'line', [response]);
                            break;
                    }
                }
                else {
                    $('#' + id).html(i18n.no_data_to_display);
                }
            },
            error : function(a, b, c) {
                console.log(a, b, c);
            }
        });
    };

    GHG_OVERVIEW.prototype.getColorsPie = function(data) {

        var colors = [];
        for(var i=0; i< data.length; i++) {
            if (this.CONFIG.colors.itemcode[data[i][4]]) {
                colors.push(this.CONFIG.colors.itemcode[data[i][4]]);
            }
            else {
                colors.push(this.CONFIG.alternative_colors[i]);
            }
        }
        return colors;

    };

    GHG_OVERVIEW.prototype.updateTableWorld = function(json) {

        this.updateAreasTable(
            {
                placeholder : "fs_world_table",
                title: i18n.world,
                header: {
                    column_0: "",
                    column_1: i18n.continent
                },
                content: {
                    column_0: i18n.world
                },
                total: {
                    column_0: i18n.world,
                    column_1: i18n.grand_total
                },
                add_first_column: false
            },
            json.world_table
        );

    };

    GHG_OVERVIEW.prototype.updateAreasTable = function(config, query, areacode) {

        var years = [],
            fromYear = this.$FROM_YEAR.val(),
            toYear = this.$TO_YEAR.val(),
            obj = this.getConfigurationObject();

        for(var year = fromYear; year <= toYear; year++) {
            years.push(year);
        }

        // Create Title
        if (areacode) {
            obj.areacode = areacode;
        }
        var query = this.replaceValues(query, obj);

        this.createTable(query.sql, years, config);

    };

    GHG_OVERVIEW.prototype.createTable = function(sql, years, config) {

        var data = {};
        data.datasource = this.CONFIG.datasource;
        data.json = JSON.stringify(sql);
        $.ajax({
            type : 'POST',
            url : this.CONFIG.baseurl + this.CONFIG.baseurl_data,
            data : data,
            success : function(response) {
                $('#' + config.placeholder).empty();
                var table = new Table();
                table.init(config, years, response);
            },
            error : function(err, b, c) {}
        });

    };

    GHG_OVERVIEW.prototype.getConfigurationObject = function() {

        return {
            lang: this.CONFIG.lang.toUpperCase(),
            elementcode: this.CONFIG.elementcode,
            itemcode: this.CONFIG.itemcode,
            fromyear: this.CONFIG.selected_from_year,
            toyear: this.CONFIG.selected_to_year,
            domaincode: "'" + this.CONFIG.domaincode + "'",
            aggregation: this.CONFIG.selected_aggregation
        }

    };

    GHG_OVERVIEW.prototype.getQueryAreaCodes = function() {

        return this.CONFIG.selected_areacodes.join(",");
    };

    GHG_OVERVIEW.prototype.replaceValues = function(data, obj) {

        var json = (typeof data == 'string') ? data : JSON.stringify(data);
        for (var key in obj) {
            json = this.replaceAll(json, "{{" + key.toUpperCase() + "}}", obj[key]);
        }
        return  $.parseJSON(json);

    };

    GHG_OVERVIEW.prototype.replaceAll = function(text, stringToFind, stringToReplace) {

        try {
            var temp = text;
            var index = temp.indexOf(stringToFind);
            while (index != -1) {
                temp = temp.replace(stringToFind, stringToReplace);
                index = temp.indexOf(stringToFind);
            }
            return temp;
        }catch (e) {
            return text;
        }

    };

    return GHG_OVERVIEW;
});