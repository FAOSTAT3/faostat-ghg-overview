define([
    'jquery',
    'i18n!nls/i18n',
    'libs/jshashtable'
], function ($, i18n) {

    'use strict';

    function TABLE() {

        var CONFIG = {
            prefix: null,
            placeholder: 'id',
            export_id: '',
            decimal_values: 0,
            add_first_column: true
        };


        function init(config, years, json) {

            CONFIG = $.extend(true, {}, CONFIG, config);
            if (CONFIG.prefix === null) {
                CONFIG.prefix = CONFIG.placeholder;
            }

            CONFIG.rows_content = countRows(json);

            createHtmlTable(CONFIG.placeholder, years, json);
            fillTable(json);

            CONFIG.export_id = CONFIG.export_id || CONFIG.prefix + '_export';
            $('#' + CONFIG.export_id).on('click', function() {
                exportTableToCSV($('#' + CONFIG.prefix), CONFIG.title.toLocaleLowerCase() + ' data.csv');
            });

        }

        function createHtmlTable(id, years) {

            var s = '<div style="overflow: auto; padding-top:10px; width:100%">';
            s += '<table class="dataTable">';

            // Headers
            s += "<thead>";
            s += "<tr>";
            if (CONFIG.add_first_column) {
                s += "<th>" + CONFIG.header.column_0 + "</th>";
            }
            s += "<th>" + CONFIG.header.column_1 + "</th>";
            // Average
            s += "<th>" + i18n.avg + " " + years[0] + "-" + years[years.length - 1] + "</th>";
            years.forEach(function (y) {
                s += "<th>" + y + "</th>"
            });
            s += "</tr>";
            s += "</thead>";


            // Rows
            s += "<tbody>";
            var count = 0;
            for (var i = 0; i < CONFIG.rows_content; i++) {
                var classDiv = "hor-minimalist-b_row" + ((i % 2) + 1);
                s += "<tr>";
                if (CONFIG.add_first_column) {
                    s += "<td class='" + classDiv + "' id='" + CONFIG.prefix + "_" + i + "_0'>-</td>";
                }
                s += "<td class='" + classDiv + "' id='" + CONFIG.prefix + "_" + i + "_1'>-</td>";
                s += "<td class='" + classDiv + "' id='" + CONFIG.prefix + "_avg_" + i + "'>-</td>";
                years.forEach(function (y) {
                    s += "<td class='" + classDiv + "' id='" + CONFIG.prefix + "_" + i + "_" + y + "'>-</td>"
                });
                s += "</tr>";
                count++;
            }

            // Total
            var classDiv = "hor-minimalist-b_row" + ((count % 2) + 1) + " hor-minimalist-b_row-bold";

            s += "<tr>";
            if (CONFIG.add_first_column) {
                s += "<td class='" + classDiv + "' id='" + CONFIG.prefix + "_total_0'>" + CONFIG.total.column_0 + "</td>";
            }
            s += "<td class='" + classDiv + "' id='" + CONFIG.prefix + "_total_1'>" + CONFIG.total.column_1 + "</td>";
            s += "<td class='" + classDiv + "' id='" + CONFIG.prefix + "_total_avg'>-</td>";
            years.forEach(function (y) {
                s += "<td class='" + classDiv + "' id='" + CONFIG.prefix + "_total_" + y + "'>-</td>"
            });
            s += "</tr>";
            s += "</tbody>";
            s += "</table>";
            s += "</div>";
            $("#" + id).append(s);

        }

        function fillTable(json) {

            // first column is gave
            var row = 0;
            var sumRow = 0.0;
            var totalValuesRow = 0.0;

            var columnsValues = {};
            var totalValuesColumns = 0.0;

            var totalAvg = 0.0; //It's a SUM of the AVG

            // if add_first_column
            var index = (CONFIG.add_first_column ) ? 1 : 0;
            var first_column_value = (CONFIG.add_first_column ) ? json[0][0] : null;

            // the first serie
            var serie = json[0][index];

            for (var i = 0; i < json.length; i++) {
                // Update Row
                if (serie != json[i][index]) {

                    addRow(row, serie, sumRow, totalValuesRow, first_column_value);
                    totalAvg += sumRow / totalValuesRow;

                    // Reset Values
                    serie = json[i][index];
                    first_column_value = ( CONFIG.add_first_column) ? json[i][index - 1] : null;
                    row++;
                    totalValuesRow = 0;
                    sumRow = 0;
                }

                var value = Number((parseFloat(json[i][index + 2])).toFixed(CONFIG.decimal_values));

                // Insert Year value
                $("#" + CONFIG.prefix + "_" + row + "_" + json[i][index + 1]).html(value);

                // Row Count (For the Avg)
                sumRow += value;
                totalValuesRow += 1;

                // Column Count ( for Avg and Yearly Avg)
                totalValuesColumns += value;
                columnsValues[json[i][index + 1]] = ( columnsValues[json[i][index + 1]]) ? columnsValues[json[i][index + 1]] += value : value;
            }

            // add The last row
            var first_column_value = (CONFIG.add_first_column)? json[json.length - 1][index - 1] : null;
            addRow(row, serie, sumRow, totalValuesRow, first_column_value);

            // add Totals
            totalAvg += sumRow / totalValuesRow;
            addTotals(columnsValues, totalAvg)
        }

        function addRow(row, serie, sumRow, totalValuesRow, first_column_value) {

            if (first_column_value) {
                $("#" + CONFIG.prefix + "_" + row + "_0").html(first_column_value);
            }
            $("#" + CONFIG.prefix + "_" + row + "_1").html(serie);
            $("#" + CONFIG.prefix + "_avg_" + row + "").html(Number(sumRow / totalValuesRow).toFixed(CONFIG.decimal_values));

        }

        function addTotals(columnsValues, totalAvg) {

            // Add Yearly Totals
            for (var year in columnsValues) {
                $("#" + CONFIG.prefix + "_total_" + year).html(Number(columnsValues[year]).toFixed(CONFIG.decimal_values));
            }
            $("#" + CONFIG.prefix + "_total_avg").html(Number(totalAvg).toFixed(CONFIG.decimal_values));

        }

        /**
         * The first column (or if add_first_column is enabled is the serie)
         * @param json
         * @returns {number}
         */
        function countRows(json) {
            var index = (CONFIG.add_first_column ) ? 1 : 0;
            var serie = json[0][index];
            var rows = 0;
            for (var i = 0; i < json.length; i++) {
                // Update Row
                if (serie != json[i][index]) {
                    serie = json[i][index];
                    rows++;
                }
            }
            rows++;
            return rows;
        }

        function exportTableToCSV($table, filename) {
            var $headers = $table.find('tr:has(th)'),
                $rows = $table.find('tr:has(td)')

                // Temporary delimiter characters unlikely to be typed by keyboard
                // This is to avoid accidentally splitting the actual contents
                ,tmpColDelim = String.fromCharCode(11) // vertical tab character
                ,tmpRowDelim = String.fromCharCode(0) // null character

                // actual delimiter characters for CSV format
                ,colDelim = '","'
                ,rowDelim = '"\r\n"';

            // Grab text from table into CSV formatted string
            var csv = '"';
            csv += formatRows($headers.map(grabRow));
            csv += rowDelim;
            csv += formatRows($rows.map(grabRow)) + '"';

            // Data URI
            //var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

            var a = document.createElement('a');
            // a.href = 'data:text/csv;charset=utf-8,\n' + encodeURIComponent(csv);
            a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
            a.target = '_blank';
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            //------------------------------------------------------------
            // Helper Functions
            //------------------------------------------------------------
            // Format the output so it has the appropriate delimiters
            function formatRows(rows) {
                return rows.get().join(tmpRowDelim)
                    .split(tmpRowDelim).join(rowDelim)
                    .split(tmpColDelim).join(colDelim);
            }

            // Grab and format a row from the table
            function grabRow(i, row) {

                var $row = $(row);
                //for some reason $cols = $row.find('td') || $row.find('th') won't work...
                var $cols = $row.find('td');
                if (!$cols.length) $cols = $row.find('th');

                return $cols.map(grabCol)
                    .get().join(tmpColDelim);
            }

            // Grab and format a column from the table
            function grabCol(j, col) {
                var $col = $(col),
                    $text = $col.text();
                return $text.replace('"', '""'); // escape double quotes
            }
        }

        return {
            init: init
        };
    }

    return TABLE;
});