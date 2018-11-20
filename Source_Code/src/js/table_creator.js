function table_canvas(table_data, canvas_id){
    var sql = "SELECT ";
    var table_row = "<tr>";
    if(table_data.show_whole_table == '0'){
        table_data.col_name.forEach(function(item, index) {
            if(index == (table_data.col_name.length-1)){
                sql+= "`" +item + "` AS COL" + index + " ";
                table_row += "<th>"+ item + "</th>";
            }else{
                sql+= "`" +item + "` AS COL" + index + ", ";
                table_row += "<th>"+ item + "</th>";
            }
        });
    }else if(table_data.show_whole_table == '1'){
        sql+= "* ";
    }
    sql+= "FROM "  + table_data.table_object;
    table_row += "</tr>";
    $("#"+ canvas_id).append(table_row); 

    var no_of_col = table_data.col_name.length;

    sequelize.query(sql).then(myTableRows => {
        arr = myTableRows[0];
        var arr_single_row = [];
        for(var i=0;i<arr.length;i++)
        {
            arr_single_row = arr[i];
            var j=0;
            table_row ="<tr>";
            while(j < no_of_col){
                table_row += "<td>"+ arr_single_row["COL"+ j] +"</td>";
                j+=1;
            }
            table_row += "</tr>";
            $("#"+ canvas_id).append(table_row); 
        }
    });

    var table = $("#"+ canvas_id);
    
    //below function requires a plugin viz., jquery.sortElements.js used to give sort by clicking header
    $('th')
        .wrapInner('<span title="sort this column"/>')
        .each(function(){
            var th = $(this),
                thIndex = th.index(),
                inverse = false;
            th.click(function(){
                table.find('td').filter(function(){
                    return $(this).index() === thIndex;
                }).sortElements(function(a, b){
                    return $.text([a]) > $.text([b]) ?
                        inverse ? -1 : 1
                        : inverse ? 1 : -1;
                }, function(){
                    // parentNode is the element we want to move
                    return this.parentNode; 
                });
                inverse = !inverse;
            });
        });//end of plugin
}


function total_canvas(total_data, canvas_id){
    var sql = "SELECT SUM("+ total_data.total_col_name + ") AS total FROM "+ total_data.total_object;
    sequelize.query(sql).then(myTableRows => {
        arr = myTableRows[0];
        $("#"+ canvas_id).append(arr[0].total); 
    });
}