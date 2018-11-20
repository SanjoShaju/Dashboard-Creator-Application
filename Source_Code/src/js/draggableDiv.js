
$( ".draggable" ).draggable({
    grid: [ 10, 10 ],
    containment: "#canvas_container",
    scroll: true
    //handle: ".canvas_head",
});
$( ".resizable" ).resizable({
    containment: "#canvas_container",
    grid: 10,
  
    resize: function(event, ui) {
        // handle fontsize here // gives you the current size of the div
        var size = ui.size;

        // something like this change the values according to your requirements
        //$(this).find('.total_text').css("font-size", ((size.height)/3 + "px"));


        $(this).find('.sortable_list').css("height",((size.height -47) + "px"));


        //Fixing the height and width of canvas according to the resize
        $(this).find('canvas').css("width", size.width + "px");
        $(this).find('canvas').css("height", (size.height -47) + "px");
    },
    stop: function( event, ui ) {
        var stop_size = ui.size;
        $(this).find('canvas').css("height", (stop_size.height -47) + "px");
    }

});
//}); 

//$("div").disableSelection();

$( ".sortable_list" ).sortable();
//$( ".sortable_list" ).disableSelection();