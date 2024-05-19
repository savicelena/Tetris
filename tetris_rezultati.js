
$(document).ready(function(){

    let playersArr = localStorage.getItem('players');
    if(playersArr == null){
        $("#yourResult").text("You haven't played the game");
    }else{
        playersArr = JSON.parse(playersArr);
        let lastPlayer = playersArr[playersArr.length-1];
        $("#yourResult").text(lastPlayer['name'] + " has won " + lastPlayer['result'] + " points in the last game");

        playersArr.sort(function(elem1, elem2){
            return elem2['result'] - elem1['result'];
        })
        let toRemove = [];
        for(let i = 5; i < playersArr.length; i++){
            toRemove.push(playersArr[i]);
        }
        console.log(toRemove);
        for(let i = 0; i < toRemove.length; i++){
            playersArr.pop(toRemove[i]);
        }

        let value = [1, 'name', 'result'];

        let numPlayers = playersArr.length;
        let resultTable = $("#resultTable");
        let trs = resultTable.find("tr:gt(0)");
        trs.each(function(index){
            let tds = $(this).find("td");
            if (index >= numPlayers) return;
            let player = playersArr[index];
            console.log(player);
            tds.each(function(index){
                if(index == 0){
                    $(this).text(value[index]+".");
                    value[0]++;
                }else{
                    $(this).text(player[value[index]]);
                }
                
            })
            
        })

        localStorage.setItem("players", JSON.stringify(playersArr))
    }

    $("#mainPage").click(function(){
        window.location = 'tetris-uputstvo.html'
    });

});