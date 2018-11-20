var color_array = ['#3366cc','#dc3912','#ff9900','#109618','#990099','#0099c6','#dd4477','#66aa00',
'#b82e2e','#316395','#994499','#22aa99','#aaaa11','#6633cc','#e67300','#8b0707',
'#651067','#329262','#5574a6','#3b3eac','#b77322','#16d620','#b91383','#f4359e',
'#9c5935','#a9c413','#2a778d','#668d1c','#bea413','#0c5922','#743411','#FF4136'];

var count_canvas = 0;

Chart.defaults.scale.gridLines.display = false;//setting gridLines OFF by default

function chart_canvas(chart_data, canvas_id){
    var sql = "";
    sql = "SELECT "+ chart_data.chart_key + " as CKEY, "+ chart_data.chart_data_roll_1 +"("+ chart_data.chart_data_1 +") AS CDATA1";
    
    other_chart_data_check();

    sql+= " From " + chart_data.chart_object + " group by CKEY";
    
    if(chart_data.show_top_n_grp > 0){
        sql+= " ORDER BY CDATA1 LIMIT " + chart_data.show_top_n_grp;
    }
    if(chart_data.sort_desc == 1){
        sql = "SELECT * FROM ("+ sql +")  ORDER BY CKEY DESC";
    }else
        sql = "SELECT * FROM ("+ sql +")  ORDER BY CKEY ASC";

    sequelize.query(sql).then(myTableRows => {
        arr = myTableRows[0];
        var CKEY = [];
        var CDATA1 = [];
        var CDATA2 = [];
        var CDATA3 = [];
        var CDATA4 = [];
        var CDATA5 = [];
        for(var i = 0; i < arr.length; i++) {
            CKEY.push(arr[i].CKEY);
            CDATA1.push(arr[i].CDATA1);
            if(chart_data.chart_data_2 !== 'Choose an option')
                CDATA2.push(arr[i].CDATA2);
            if(chart_data.chart_data_3 !== 'Choose an option')
                CDATA3.push(arr[i].CDATA3);
            if(chart_data.chart_data_4 !== 'Choose an option')
                CDATA4.push(arr[i].CDATA4);
            if(chart_data.chart_data_5 !== 'Choose an option')
                CDATA5.push(arr[i].CDATA5);
        }

        switch(chart_data.chart_type){
            case 'Bar Chart':{
                type_of_chart = 'horizontalBar';
                graph_bar_col_chart(chart_data, CKEY, CDATA1, CDATA2, CDATA3, CDATA4, CDATA5,type_of_chart);
                break;
            }
            case 'Column Chart':{
                type_of_chart = 'bar';
                graph_bar_col_chart(chart_data, CKEY, CDATA1, CDATA2, CDATA3, CDATA4, CDATA5,type_of_chart);
                break;
            }
            case 'Line Chart':{
                graph_line_chart(chart_data, CKEY, CDATA1, CDATA2, CDATA3, CDATA4, CDATA5);
                break;
            }
            case 'Pie Chart':{
                graph_pie_chart(chart_data, CKEY, CDATA1);
                break;
            }
        }
    });//end of sequelize
    
    //function to add the extra data to sql query
    function other_chart_data_check(){
        if(chart_data.chart_data_2 !== 'Choose an option')
            sql += ", " + chart_data.chart_data_roll_2 +"("+ chart_data.chart_data_2 +") AS CDATA2";
        if(chart_data.chart_data_3 !== 'Choose an option')
            sql += ", " + chart_data.chart_data_roll_3 +"("+ chart_data.chart_data_3 +") AS CDATA3";
        if(chart_data.chart_data_4 !== 'Choose an option')
            sql += ", " + chart_data.chart_data_roll_4 +"("+ chart_data.chart_data_4 +") AS CDATA4";
        if(chart_data.chart_data_5 !== 'Choose an option')
            sql += ", " + chart_data.chart_data_roll_5 +"("+ chart_data.chart_data_5 +") AS CDATA5";
    }

    function graph_bar_col_chart(chart_data, CKEY, CDATA1, CDATA2, CDATA3, CDATA4, CDATA5,type_of_chart){
        var result = switch_for_data_opt(chart_data, CDATA1, CDATA2, CDATA3, CDATA4, CDATA5);
   
        sample_data_sets = [
            {
                label: chart_data.chart_data_1,
                backgroundColor: '#3366cc',
                data: result.arr1
            },
            {
                label: chart_data.chart_data_2,
                backgroundColor: '#dc3912',
                data: result.arr2
            },
            {
                label: chart_data.chart_data_3,
                backgroundColor: '#ff9900',
                data: result.arr3
            },
            {
                label: chart_data.chart_data_4,
                backgroundColor: '#109618',
                data: result.arr4
            },
            {
                label: chart_data.chart_data_5,
                backgroundColor: '#990099',
                data: result.arr5
            }
        ];

        var data_sets = [];
        for(var j=0;j<=chart_data.no_of_chart_data;j++){
            data_sets.push(sample_data_sets[j]);
        }

        var chartdata = {
            labels: CKEY,
            datasets : data_sets
        };

        var ctx = $("#"+ canvas_id);
        var myBarChart = new Chart(ctx, {
            type: type_of_chart,
            data: chartdata,
            options: {
                legend: { 
                    display: (chart_data.show_legend) == 1 ? true : false,
                    position: 'right', 
                },
                scales: {
                    xAxes: [{
                        gridLines:{ display: (chart_data.show_grid) == 1 ? true : false }
                    }],
                    yAxes: [{
                            gridLines:{ display: (chart_data.show_grid) == 1 ? true : false }
                      }]                               
                },
                plugins: {//plugin to add chart labels
                    datalabels: {
                        display: (chart_data.show_values) == 1 ? true : false ,
                        backgroundColor: function(context) {
                            return context.dataset.backgroundColor;
                        },
                        color: 'white',
                        font: {
                            weight: 'bold'
                        },
                        formatter: Math.round
                    }
                }
            }
        });
    }//end of bar_chart

    function graph_line_chart(chart_data, CKEY, CDATA1, CDATA2, CDATA3, CDATA4, CDATA5){
        var result = switch_for_data_opt(chart_data, CDATA1, CDATA2, CDATA3, CDATA4, CDATA5);
   
        sample_data_sets = [
            {
                label: chart_data.chart_data_1,
                backgroundColor: '#3366cc',
                data: result.arr1
            },
            {
                label: chart_data.chart_data_2,
                backgroundColor: '#dc3912',
                data: result.arr2
            },
            {
                label: chart_data.chart_data_3,
                backgroundColor: '#ff9900',
                data: result.arr3
            },
            {
                label: chart_data.chart_data_4,
                backgroundColor: '#109618',
                data: result.arr4
            },
            {
                label: chart_data.chart_data_5,
                backgroundColor: '#990099',
                data: result.arr5
            }
        ];

        var data_sets = [];
        for(var j=0;j<=chart_data.no_of_chart_data;j++){
            data_sets.push(sample_data_sets[j]);
        }

        var chartdata = {
            labels: CKEY,
            datasets : data_sets
        };

        var ctx = $("#"+ canvas_id);
        var lineGraph = new Chart(ctx, {
            type: 'line',// change here to change the graph type
            data: chartdata,
            options: {
                legend: { 
                    display: (chart_data.show_legend) == 1 ? true : false,
                    position: 'right', 
                },
                scales: {
                    xAxes: [{
                        gridLines:{ display: (chart_data.show_grid) == 1 ? true : false }
                    }],
                    yAxes: [{
                            gridLines:{ display: (chart_data.show_grid) == 1 ? true : false }
                    }]                               
                },
                elements: {
                    line: {
                        fill: false,
                        tension: 0,
                    }
                },
                plugins: {
                    datalabels: {
                        display: (chart_data.show_values) == 1 ? true : false ,
                        backgroundColor: function(context) {
                            return context.dataset.backgroundColor;
                        },
                        borderRadius: 4,
                        color: 'white',
                        font: {
                            weight: 'bold'
                        },
                        formatter: Math.round
                    }
                }
            }
        });
    }//end of line_chart

    function graph_pie_chart(chart_data, CKEY, CDATA1){
        var background_color = [];
        for (var i = 0; i <= ((CKEY.length/32)); i++) {
            $.merge( background_color, color_array );
        }
        var result = switch_for_data_opt(chart_data, CDATA1);
   
        data_sets = [
            {
                label: CKEY,
                backgroundColor: background_color,
                borderColor: 'rgba(0, 0, 0, 0.3)',
                borderWidth: 1,
                hoverBackgroundColor: background_color,
                hoverBorderColor: 'rgba(0, 0, 0, 1)',
                hoverBorderWidth: 3,
                data: result.arr1
            }
        ];
        var chartdata = {
            labels: CKEY,
            datasets : data_sets
        };
        var ctx = $("#"+ canvas_id);
        var pieGraph = new Chart(ctx, {
            type: 'pie',// change here to change the graph type
            data: chartdata,
            options: {
                legend: {
                    display: (chart_data.show_legend) == 1 ? true : false,
                    position: 'right',
                },
                plugins: {//plugin to add chart labels
                datalabels: { 
                        display: (chart_data.show_values) == 1 ? true : false ,
                        backgroundColor: function(context) {
                            return context.dataset.backgroundColor;
                        },
                        color: 'white',
                        font: {
                            weight: 'bold'
                        },
                        formatter: Math.round
                    }
                }
            },
        });
    }//end of pie_chart

    //need examples to do this ----- NOT WORKING-------
    function graph_bubble_chart(chart_data, CKEY, CDATA1, CDATA2, CDATA3, CDATA4){
        var background_color = [];
        for (var i = 0; i <= ((CKEY.length/32)); i++) {
            $.merge( background_color, color_array );
        }
        var result = switch_for_data_opt(chart_data, CDATA1, CDATA2, CDATA3);
   
        data_sets = [
            {
                label: CDATA4,
                backgroundColor: background_color,
                borderColor: 'rgba(0, 0, 0, 0.3)',
                borderWidth: 1,
                hoverBackgroundColor: background_color,
                hoverBorderColor: 'rgba(0, 0, 0, 1)',
                hoverBorderWidth: 3,
                data: [{
                    x: result.arr1,
                    y: result.arr2,
                    r: result.arr3
                  }]
            }
        ];
        var chartdata = {
            labels: CKEY,
            datasets : data_sets
        };
        var ctx = $("#"+ canvas_id);
        var pieGraph = new Chart(ctx, {
            type: 'bubble',// change here to change the graph type
            data: chartdata,
            options: {
                legend: {
                    display: (chart_data.show_legend) == 1 ? true : false,
                    position: 'right',
                },
                plugins: {//plugin to add chart labels
                datalabels: { 
                        display: (chart_data.show_values) == 1 ? true : false ,
                        backgroundColor: function(context) {
                            return context.dataset.backgroundColor;
                        },
                        color: 'white',
                        font: {
                            weight: 'bold'
                        },
                        formatter: Math.round
                    }
                }
            },
        });
    }//end of bubble_chart

    //function to do the data options part
    function switch_for_data_opt(chart_data, CDATA1, CDATA2, CDATA3, CDATA4, CDATA5){
        switch(chart_data.chart_data_opt_1){
            case 'Percent':
                CDATA1 = percentage(CDATA1);
                break;
            case 'Cumulative':
                CDATA1 = cumulative(CDATA1);
                break;
        }
        switch(chart_data.chart_data_opt_2){
            case 'Cumulative':
                CDATA2 = cumulative(CDATA2);
                break;
            case 'Percent':
                CDATA2 = percentage(CDATA2);
                break;
        }
        switch(chart_data.chart_data_opt_3){
            case 'Cumulative':
                CDATA3 = cumulative(CDATA3);
                break;
            case 'Percent':
                CDATA3 = percentage(CDATA3);
                break;
        }
        switch(chart_data.chart_data_opt_4){
            case 'Cumulative':
                CDATA4 = cumulative(CDATA4);
                break;
            case 'Percent':
                CDATA4 = percentage(CDATA4);
                break;
        }
        switch(chart_data.chart_data_opt_5){
            case 'Cumulative':
                CDATA5 = cumulative(CDATA5);
                break;
            case 'Percent':
                CDATA5 = percentage(CDATA5);
                break;
        }
        var result = {};
        result.arr1 = CDATA1;
        result.arr2 = CDATA2;
        result.arr3 = CDATA3;
        result.arr4 = CDATA4;
        result.arr5 = CDATA5;
        return result
    }//end of switch_for_data_opt

    //cumulative function
    function cumulative(CDATA){
        for(var i=1; i< CDATA.length;i++){
            CDATA[i] += CDATA[i-1];
        }
        return CDATA
    }//end of cumulative

    //percentage function
    function percentage(CDATA){
        var sum = CDATA.reduce(add, 0);
        function add(a, b) {
            return a + b;
        }
        var percentage_array=[];
        CDATA.forEach(item => {
            percentage_array.push(Math.floor((item/sum)*100));
            });
        return percentage_array
    }//end of percentage
}