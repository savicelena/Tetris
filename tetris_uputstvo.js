

$(document).ready(function(){
    elemColors = ["grey", "blue", "red", "yellow", "purple", "green", "orange", "palevioletred"]

    elements = [
        [
            [0, 0, 0],
            [2, 0, 0],
            [2, 2, 2]
        ],
        [
            [0, 0, 0],
            [0, 0, 3],
            [3, 3, 3]

        ],
        [
            [0, 0, 0],
            [0, 5, 5],
            [5, 5, 0]
        ],
        [   
            [0, 0, 0],
            [0, 6, 0],
            [6, 6, 6]
        ],
        [
            [0, 0, 0],
            [7, 7, 0],
            [0, 7, 7]
        ],
        [
            [0, 0, 0, 0],
            [0, 4, 4, 0],
            [0, 4, 4, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 1]
        ]
    ]

    var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
    welcome = $(".welcome");
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

    var tableDiv = $("#shapes");

    
    for(let i = 0; i < elements.length; i++){
        let currentElem = elements[i];
        let table = $("<table></table>").css({
            "border-width": "1px",
            "display": "inline",
            "border-collapse": "collapse"
        });
        
        for(let r = 0; r < currentElem.length; r++){
            let row = $("<tr></tr>");
            for(let c = 0; c < currentElem[r].length; c++){
                row.append(
                    $("<td></td>").css({
                        "background-color": elemColors[currentElem[r][c]],
                        "width": "25px",
                        "height": "25px",
                        "border": "solid 2px black"
                    })
                );
                
            }
            table.append(row);
        }
        table.attr("id", i);
        tableDiv.append(table);
        //tableDiv.append("&nbsp;")
        table.click(function(){
            $(this).css("border-collapse", "separate");
            console.log('usao');
            let id = $(this).attr("id");
            console.log(id);
            console.log(localStorage.getItem("elements"))
            if(localStorage.getItem("elements") == null){
                let elements = [parseInt(id)];
                console.log(elements);
                localStorage.setItem("elements", JSON.stringify(elements));
            }else{
                elements = JSON.parse(localStorage.getItem("elements"));
                if (elements.includes(parseInt(id)) == false){
                    elements.push(parseInt(id));
                    localStorage.setItem("elements", JSON.stringify(elements));
                }
                
            }
        });
        
        if (i == elements.length - 3 || i == elements.length - 2){
            tableDiv.append("<br>");
        }
    }

    $(".radios").change(function(){
        let val = parseInt($(this).val());
        if(localStorage.getItem("mode") == true){
            localStorage.removeItem("mode");
        }
        localStorage.setItem("mode", val);

    });



    $("#playGame").click(function(){
        window.location = 'tetris-igra.html';
    })
    $("#seeResults").click(function(){
        window.location = 'tetris-rezultati.html';
    })

});