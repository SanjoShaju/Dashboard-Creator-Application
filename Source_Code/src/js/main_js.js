//sending msg to main.js to create chart,table etc opt browser window
function open_opt_dialog() {
    var { ipcRenderer, remote } = require('electron');
    ipcRenderer.send('createChartDialog', 1);
}

//sending msg to main.js to create open_new browser window
function open_new_dialog() {
    var { ipcRenderer, remote } = require('electron');
    ipcRenderer.send('createOpenNewDialog', 1);
}

const { ipcRenderer } = require('electron');//the data obj recieved from main.js
ipcRenderer.on('gotData', function (event, arg) {
    create_canvas(arg);
});

//when open dashboard btn is clicked this is called
ipcRenderer.on('open_dashboard', function (event, arg) {
    count_canvas = 0;
    $('#canvas_container').empty();
    const sequelize = new Sequelize('database', 'username', 'password', {
        dialect: 'sqlite',
        storage: './Dashboards/'+arg+'.sqlite'
    })
    sql = 'SELECT canvas FROM saved_canvas'
    sequelize.query(sql).then(myTableRows => {
        arr = myTableRows[0];
        for (var i = 0; i < arr.length; i++) {
            $('#canvas_container').append(arr[i].canvas);
        };

        sql = 'SELECT canvas_pos FROM saved_canvas_pos';
        sequelize.query(sql).then(myTableRows => {
            arr = myTableRows[0];
            console.log(arr[0].canvas_pos);
            $('#canvas_container').append(arr[0].canvas_pos);
        });
    });
});


var count_canvas =0;
//creates the canvas for any request
function create_canvas(recieved_data) {
    create_data_opt_string(recieved_data, count_canvas);
    canvas_id = 'chartcanvas_' + count_canvas;//for naming the different canvas differently
    draggable_id = 'draggable_' + count_canvas;//for naming the different draggable div differently

    var append_html = '<div id="' + draggable_id + '" class="ui-widget-content draggable resizable ">' +
        '<i id="close_drag" class="ui-icon ui-icon-close"></i>' +
        '<i id="edit_drag" class="ui-icon ui-icon-gear"></i>' +
        '<div class="canvas_head">';

    if (recieved_data.data_abt == 'chart') {
        if (recieved_data.title_text !== '')
            append_html += '<span style="width: 100%; font-size: 25px; font-weight: bold;">' + recieved_data.title_text + '</span>';
        if (recieved_data.sub_title_text !== '')
            append_html += '<br><span style="width: 100%; font-size: 15px;">' + recieved_data.sub_title_text + '</span>';

        append_html += '</div><canvas id="' + canvas_id + '"></canvas></div>' +
            '<script>var url = "js/draggableDiv.js";$.getScript(url);</script>' +
            '<script>var count_canvas = ' + (count_canvas + 1) + ';</script>';
            console.log(append_html);
        $('#canvas_container').append(append_html);
        chart_canvas(recieved_data, canvas_id);
    }
    else if (recieved_data.data_abt == 'table') {
        if (recieved_data.table_title_text !== '')
            append_html += '<span style="width: 100%; font-size: 25px; font-weight: bold;">' + recieved_data.table_title_text + '</span>';
        if (recieved_data.table_sub_title_text !== '')
            append_html += '<br><span style="width: 100%; font-size: 15px;">' + recieved_data.table_sub_title_text + '</span>';

        append_html += '</div><table id="' + canvas_id + '" style="width: 100%; margin: 0 auto; text-align: left;"></table></div>' +
            '<script>var url = "js/draggableDiv.js";$.getScript(url);</script>' +
            '<script>var count_canvas = ' + (count_canvas + 1) + ';</script>';
        $('#canvas_container').append(append_html);
        table_canvas(recieved_data, canvas_id);

    }
    else if (recieved_data.data_abt == 'total') {
        append_html += '<div style="text-align: center">';
        if (recieved_data.total_title_text !== '')
            append_html += '<span style="width: 100%; margin: 0 auto; text-align: center; font-size: 25px; font-weight: bold;">' + recieved_data.total_title_text + '</span>';
        if (recieved_data.total_sub_title_text !== '')
            append_html += '<br><span style="width: 100%; padding-right: 25px; margin: 0 auto; text-align: center; font-size: 15px;">' + recieved_data.total_sub_title_text + '</span>';
        append_html += '</div></div><span id="' + canvas_id + '" style="width: 100%; margin: 0 auto; text-align: center;font-family:Impact, Charcoal, sans-serif; font-size: ' + recieved_data.total_font_size + 'px;';
        if (recieved_data.total_make_bold == '1') {
            append_html += 'font-weight: bold;';
        }
        append_html += '"></span></div>' +
            '<script>var url = "js/draggableDiv.js";$.getScript(url);</script>' +
            '<script>var count_canvas = ' + (count_canvas + 1) + ';</script>';
        $('#canvas_container').append(append_html);
        total_canvas(recieved_data, canvas_id);
    }
}

function create_data_opt_string(recieved_data, count_canvas) {
    var data_from_canvas_func = recieved_data;

    data_opt_html = '<script>'
    if (data_from_canvas_func.data_abt == 'chart') {

        data_opt_html += 'data_to_send = {};' +
            'data_to_send.data_abt = \'' + data_from_canvas_func.data_abt + '\';' +
            'data_to_send.chart_type = \'' + data_from_canvas_func.chart_type + '\';' +
            'data_to_send.chart_object = \'' + data_from_canvas_func.chart_object + '\';' +
            'data_to_send.title_text = \'' + data_from_canvas_func.title_text + '\';' +
            'data_to_send.sub_title_text = \'' + data_from_canvas_func.sub_title_text + '\';' +
            'data_to_send.chart_key = \'' + data_from_canvas_func.chart_key + '\';' +
            'data_to_send.show_top_n_grp = \'' + data_from_canvas_func.show_top_n_grp + '\';' +
            'data_to_send.sort_desc = \'' + data_from_canvas_func.sort_desc + '\';' +
            'data_to_send.chart_data_1 = \'' + data_from_canvas_func.chart_data_1 + '\';' +
            'data_to_send.chart_data_2 = \'' + data_from_canvas_func.chart_data_2 + '\';' +
            'data_to_send.chart_data_3 = \'' + data_from_canvas_func.chart_data_3 + '\';' +
            'data_to_send.chart_data_4 = \'' + data_from_canvas_func.chart_data_4 + '\';' +
            'data_to_send.chart_data_5 = \'' + data_from_canvas_func.chart_data_5 + '\';' +
            'data_to_send.chart_data_opt_1 = \'' + data_from_canvas_func.chart_data_opt_1 + '\';' +
            'data_to_send.chart_data_opt_2 = \'' + data_from_canvas_func.chart_data_opt_2 + '\';' +
            'data_to_send.chart_data_opt_3 = \'' + data_from_canvas_func.chart_data_opt_3 + '\';' +
            'data_to_send.chart_data_opt_4 = \'' + data_from_canvas_func.chart_data_opt_4 + '\';' +
            'data_to_send.chart_data_opt_5 = \'' + data_from_canvas_func.chart_data_opt_5 + '\';' +
            'data_to_send.chart_data_roll_1 = \'' + data_from_canvas_func.chart_data_roll_1 + '\';' +
            'data_to_send.chart_data_roll_2 = \'' + data_from_canvas_func.chart_data_roll_2 + '\';' +
            'data_to_send.chart_data_roll_3 = \'' + data_from_canvas_func.chart_data_roll_3 + '\';' +
            'data_to_send.chart_data_roll_4 = \'' + data_from_canvas_func.chart_data_roll_4 + '\';' +
            'data_to_send.chart_data_roll_5 = \'' + data_from_canvas_func.chart_data_roll_5 + '\';' +
            'data_to_send.show_legend = \'' + data_from_canvas_func.show_legend + '\';' +
            'data_to_send.show_grid = \'' + data_from_canvas_func.show_grid + '\';' +
            'data_to_send.show_values = \'' + data_from_canvas_func.show_values + '\';' +
            'data_to_send.no_of_chart_data = \'' + data_from_canvas_func.no_of_chart_data + '\';' +
            'ipcRenderer.send(\'sentData\', data_to_send);</script>';
    }
    else if (data_from_canvas_func.data_abt == 'table') {
        data_opt_html += 'data_to_send = {};' +
            'data_to_send.data_abt = \'' + data_from_canvas_func.data_abt + '\';' +
            'data_to_send.table_title_text = \'' + data_from_canvas_func.table_title_text + '\';' +
            'data_to_send.table_sub_title_text = \'' + data_from_canvas_func.table_sub_title_text + '\';' +
            'data_to_send.table_object = \'' + data_from_canvas_func.table_object + '\';' +
            'data_to_send.show_whole_table = \'' + data_from_canvas_func.show_whole_table + '\';' +
            'data_to_send.col_name = \'' + data_from_canvas_func.col_name + '\';' +
            'ipcRenderer.send(\'sentData\', data_to_send);</script>';
    }

    else if (data_from_canvas_func.data_abt == 'total') {
        data_opt_html += 'data_to_send = {};' +
            'data_to_send.data_abt = \'' + data_from_canvas_func.data_abt + '\';' +
            'data_to_send.total_title_text = \'' + data_from_canvas_func.total_title_text + '\';' +
            'data_to_send.total_sub_title_text = \'' + data_from_canvas_func.total_sub_title_text + '\';' +
            'data_to_send.total_object = \'' + data_from_canvas_func.total_object + '\';' +
            'data_to_send.total_col_name = \'' + data_from_canvas_func.total_col_name + '\';' +
            'data_to_send.total_font_size = \'' + data_from_canvas_func.total_font_size + '\';' +
            'data_to_send.total_make_bold = \'' + data_from_canvas_func.total_make_bold + '\';' +
            'ipcRenderer.send(\'sentData\', data_to_send);</script>';
    }
    sql_create_table = "CREATE TABLE IF NOT EXISTS `saved_canvas`(id integer PRIMARY KEY, canvas TEXT);";
    sequelize.query(sql_create_table).then(myTableRows => {
        sql_insert = "INSERT INTO saved_canvas (id, canvas) VALUES(\""+ count_canvas +"\", \"" + data_opt_html + "\");";
        sequelize.query(sql_insert).then(myTableRows => {
        });//end of insert table sequelize;
    });//end of create table sequelize;
}

// Save the dashboard function
$('#saveDashboardBtn').click(function () {
    var append_html = '<script>';
    $("#canvas_container").children(".draggable").each(function (id) {
        var pos = $(this).position();
        var drag_id = $(this).attr('id');

        append_html += '$("#' + drag_id + '").css("top", "' + pos.top + 'px");' +
            '$("#' + drag_id + '").css("left", "' + pos.left + 'px");' +
            '$("#' + drag_id + '").css("width", "' + $(this).width() + 'px");' +
            '$("#' + drag_id + '").css("height", "' + $(this).height() + 'px");';
    });

    append_html += '</script>';//positions of draggables are added to this variable

    sql_create_table = "CREATE TABLE IF NOT EXISTS `saved_canvas_pos`(canvas_pos TEXT);";
    sequelize.query(sql_create_table).then(myTableRows => {
        sql_remove_prev_data = "DELETE FROM saved_canvas_pos;";
        sequelize.query(sql_remove_prev_data).then(myTableRows => {
            sql_insert = "INSERT INTO saved_canvas_pos (canvas_pos) VALUES('" + append_html + "');";
            sequelize.query(sql_insert).then(myTableRows => {
                var path = require("path");
                var dashboard_name = $('#save_name').val();
                var filepath = path.join(__dirname, '..');
                require('child_process').exec('cmd /c copy "' + filepath + '\\database.sqlite" "' + filepath + '\\Dashboards\\' + dashboard_name + '.sqlite"', (err, stdout, stderr) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                });
            });
        });//end of insert table sequelize;
    });//end of create table sequelize;
});

//Below closes the draggable canvas when close is clicked
//Had to write the button like this because the btn we are referencing here is 
//dynamically created and they have to be called like this
$('body').on('click', '#close_drag', function () {
    if (window.confirm("Enter OK to remove this item!")) {
        $(this).parents('.draggable').remove();
        var draggable_id = $(this).parents('.draggable').attr("id");
        console.log(draggable_id.substring(1, 4));
        sql = "DELETE FROM saved_canvas WHERE id = "+ draggable_id.substring(10) +";";
        sequelize.query(sql).then(myTableRows => {
        });
    }
});

// opens the tools dialog box
$('body').on('click', '#edit_drag', function () {
    open_opt_dialog();
});

