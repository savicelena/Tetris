

$(document).ready(function(){

    var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
    welcome = $(".welcome");
    console.log(welcome[0]);
    let i = 0;
    welcome.each(function(){
        $(this).css({
            "color": colors[i%colors.length],
            "font-size": "35px",
            "font-weight": "bold",
            "font-family": "Comic Sans MS"
        })
        i++;
    })

});