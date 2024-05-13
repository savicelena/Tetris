

$(document).ready(function(){
    colors = ["grey", "blue", "red", "yellow", "purple", "green", "orange", "palevioletred"]
    var currentRow = 0;
    var currentCol;
    var numElem = 7;
    var currentElem = null;
    var game;
    var elemNum = 1;
    var elemId;
    var maxElem = 50;

    elements = [
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 1]
        ],
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
            [4, 4],
            [4, 4]
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
        ]
    ]

    var numRows = 0;
    var numCols = 10;
    var gameTable = [];

    fieldTable = $("#gameTable");
    fieldHeight = fieldTable.height();
    fieldWidth = fieldTable.width();
    cellWidth = fieldWidth/numCols;
    
    


    currentHeight = 0;
    fieldTable.css("background-color", "grey");
    
    i = 0;
    do{
        row = $("<tr></tr>").attr("id", i);
        gameRow = [];

        for (let j = 0; j < numCols; j++){
            cell = $("<td></td>").attr("id", i+"c"+j).css("background-color", "f").css({
                "width": cellWidth,
                "height": "40px"
            });
            row.append(cell);
            gameRow.push(0);
            
        }
        
        gameTable.push(gameRow);
        $("#gameTable").append(row);
        currentHeight += row.height();
        i++;
        numRows++;
        
    }while (currentHeight < fieldHeight);

    //vraca broj koji se vezuje sa bojom elementa
    function getColor(elem){
        for (let i = 0; i < elem.length; i++){
            for(let j = 0; j < elem[i].length; j++){
                if(elem[i][j] != 0) return elem[i][j];
            }
        }
    }

    //vraca broj praznih kolona
    function getColZeros(elem){
        let cnt = 0;
        let all = 0;
        for(let j = 0; j < elem[0].length; j++){
            all = 0;
            for(let i = 0; i < elem.length; i++){
                if (elem[i][j] == 0){
                    all += 1;
                }
            }
            if (all == elem.length){
                cnt += 1;
            }
        }
        return cnt;
    }

    function deleteAll(elem){
        let row = currentRow - 1;
        
        for(let i = elem.length - 1; i >= 0; i--){
            if(row < 0) break;
            for(let j = currentCol; j < currentCol + elem[0].length; j++){
                if(elem[i][j-currentCol] != 0){
                    $("#"+row+"c"+j).css("background-color", "grey");
                    gameTable[row][j] = 0;
                }
                
            }
            row -= 1;
    
        }
    }

    function move(elem){
        for(let i = 0; i < elem.length; i++){
            let row = currentRow - elem.length + i;
            if (row < 0) continue;
            for(let j = 0; j < elem[i].length; j++){
                
                let col = currentCol + j;
                if(elem[i][j] != 0){
                    $("#"+row+"c"+col).css("background-color", colors[elem[i][j]]);
                    gameTable[row][col] = elemId;
                    //colored.push(row*numCols+col);
                }
                
            }
            
        }

    }

    //vraca koliko redova brojeci otpozadi ima sve nule
    function getPopulated(elem){
        let cnt = 0;
        for(let i = elem.length-1; i >= 0; i--){
            let pop = elem[i].every(function(elem){
                return elem == 0;
            })
            if (pop == true){
                cnt += 1;
            }else{
                return cnt;
            }
        }
    }

    function getNext(){
        
        let nextElem = Math.floor(Math.random() * numElem);
        elem = elements[nextElem];
        do{
            currentCol = Math.floor(Math.random() * numCols);
        }while (currentCol + elem[0].length > numCols);
        currentElem = nextElem;
       
        return elem;
    }

    function hasRight(elem){
        let row = currentRow - elem.length;
        let col = currentCol + elem[0].length - getColZeros(elem);
        for(let i = row; i < currentRow; i++){
            if(i < 0) continue;
            if(gameTable[i][col] != 0) return true;
        }
        return false;
    }

    function hasLeft(elem){
        let row = currentRow - elem.length;
        let col = currentCol - 1;
        for(let i = row; i < row + elem.length; i++){
            if( i < 0) continue;
            if(gameTable[i][col] != 0) return true;
        }
        return false;
    }
    

    function hasBeneath(elem, column){
        
        if(column + elem[0].length - getColZeros(elem) > numCols) return true;
        
        let firstPopulated = getPopulated(elem);
        let row;
        if(firstPopulated > 0){
            //ukoliko smo dosli do kraja nakon rotiranja
            if (currentRow - firstPopulated >= numRows) return true;
            let allZeros = true;
            //gledamo da li su sve nule u narednom redu
            for(let j = currentCol; j < currentCol + elem[0].length; j++){
                if(gameTable[currentRow-firstPopulated][j] != 0){
                    allZeros = false;
                    break;
                }
            }
            if (allZeros == true) return false;
            row = currentRow - elem.length + 1;
        }else{
            if (currentRow >= numRows) return true;
            row = currentRow - elem.length + 1;
        }
        
    
        
        
        //moze da se desi da je naredni red prazan, ali da su popunjene neke celije unutar jednog elementa drugim elementom
        //u tom slucaju ne mozemo da ga spustimo, pa vrsimo provere
       
        for(let i = 0; i < elem.length - firstPopulated; i++){
            if(row < 0){
                row += 1;
                continue;
            }
            for(let j = 0; j < elem[i].length; j++){
                let col = currentCol + j;
                if (col > numCols) break;
                console.log('row'+row);
                
                console.log("val" + elem[i][j]);
                console.log("next" +gameTable[row][col]);
                console.log("id"+elemId);
                //kada proveravamo prve redove moze da ide dole ako je ispod celija iste boje ili prazna
                if (elem[i][j] != 0 && gameTable[row][col] != 0 && gameTable[row][col] != elemId){
                    console.log('o');
                    return true;
                }
                // //ako je poslednji red ne moze da ide dole iako je ispod ista boja
                // if(elem[i][j] != 0 && gameTable[row][col] != 0 && i == (elem.length - 1 - firstPopulated)) {
                //     console.log('e');
                //      return true;
                //  }
                // if(elem[i][j] == 0 && (row-1) >= 0 && gameTable[row-1][col] != 0 && i != (elem.length-1-firstPopulated)){
                //     return true;
                // }
                
            }
            row += 1;
        }
        console.log('l');
        return false;
    }

    function nextPosition(elem){
        //let newColored = [];
        let row = currentRow;
        let colorNum = getColor(elem);
        //idemo odozdo nagore i kopiramo celije iznad
        for (let i = elem.length-1; i >= 0 && row >= 0; i--){
            if(row >= numRows){
                row -= 1;
                continue;
            }
            for (let j = 0; j < elem[i].length; j++){
                let col = currentCol + j;
                if(col >= numCols) break;
                
                //ukoliko je element razlicit od nule bojimo tu celiju
                //ako je element nula i celija je bila obojena njegovom bojom, onda vracamo celiju na inicijalno stanje
                if (elem[i][j] != 0){
                    $("#"+row+"c"+col).css("background-color", colors[elem[i][j]]);
                    gameTable[row][col] = elemId;
                    //newColored.push(row*numCols+col);
                }else if (row != currentRow && gameTable[row][col] == elemId){
                    
                    
                    $("#"+row+"c"+col).css("background-color", "grey");
                    gameTable[row][col] = 0;
                }

                
                
            }
            row -= 1;
        }
        currentRow += 1;
        //colored = newColored;

        
    }

    function checkForPoints(){
        let row = currentRow - 1 >= numRows ? numRows-1 : currentRow - 1;
        if (row < 0) return;
        
        
        wholeRow = gameTable[row].every(function(elem){
            return elem != 0;
        })
        
        //sve dok red ima sve elemente razlicite od 0, vrse se provere i elementi se povlace nanize
        while(wholeRow == true){
            let allZeros;
            do{
                
                
                for(let j = 0; j < numCols; j++){
                    $("#"+row+"c"+j).css("background-color", colors[gameTable[row-1][j]%maxElem])
                    gameTable[row][j] = gameTable[row-1][j];
                }
                row -= 1;
                if (row > 0){
                    allZeros = gameTable[row].every(function(elem){
                        return elem == 0;
                    })
                }
                
                
            }while(row > 0 && allZeros == false);

            row = currentRow - 1;
            wholeRow = gameTable[row].every(function(elem){
                return elem != 0;
            })
            
        }
    }

    //currentElem = getNext();
    //initialPosition(elem);
    //nextPosition(currentElem);

    function startInterval(){
        
        game = setInterval(function(){
            
            if (currentElem == null){
                currentElem = getNext();
                elemId = elemNum*maxElem + getColor(currentElem);
                elemNum++;
                nextPosition(currentElem);
            }
            
            if (hasBeneath(currentElem, currentCol)){
                checkForPoints();
    
                //proveravamo da li je popunjen prvi red i ako jeste igra je gotova
                let zeros = gameTable[0].every(function(elem){
                    return elem == 0;
                })
                if (zeros == false){
                    clearInterval(game);
                    alert('KRAJ')
                    return;
                }
                currentElem = getNext();
                elemId = elemNum*maxElem + getColor(currentElem);
                elemNum++;
                currentRow = 0;
                rowsPassed = 0;
                
                //initialPosition(currentElem);
                nextPosition(currentElem);
                return;
                
            }
    
            //brisemo celije koje element zauzima u prvom redu zato sto ga povlacimo u red ispod
            if (currentRow - currentElem.length >= 0){
                
                for(let j = currentCol; j < (currentCol + currentElem[0].length); j++){
                    let row = currentRow - currentElem.length;
                    if (gameTable[row][j] == elemId){
                        $("#"+row+"c"+j).css("background-color", "grey");
                        gameTable[row][j] = 0;
                    }
                    
                }
            }
    
            nextPosition(currentElem);
            
    
        },200);

    }

    startInterval();
    

    

    $(document).keydown(function(key){
        clearInterval(game);
        if (key.keyCode == 39){
            
            if (currentCol + currentElem[0].length - getColZeros(currentElem) < numCols && hasBeneath(currentElem, currentCol+1) == false && hasRight(currentElem) == false){
                
                deleteAll(currentElem);
                currentCol += 1;
                move(currentElem);
                
                
            }
            
        }else if (key.keyCode == 37){
            if (currentCol - 1 >= 0 && hasBeneath(currentElem, currentCol-1) == false && hasLeft(currentElem) == false){
                
                deleteAll(currentElem);
                currentCol -= 1;
                move(currentElem);
                
            }
        }else if (key.keyCode == 38){
            
            
            let prev = currentElem;
            
            let newElem = [];
            for(let i = 0; i < prev.length; i++){
                let row = [];
                for(let j = 0; j < prev[i].length; j++){
                    row.push(prev[i][j])
                }
                newElem.push(row);
            }
        
            //rotiranje matrice
            let rows = newElem.length;
            for(let i = 0; i < rows / 2; i++){
                for (j = i; j < rows - 1 - i; j++){
                    let help = newElem[i][j];
                    newElem[i][j] = newElem[rows-1-j][i];
                    newElem[rows-1-j][i] = newElem[rows-1-i][rows-1-j];
                    newElem[rows-1-i][rows-1-j] = newElem[j][rows-1-i];
                    newElem[j][rows-1-i] = help;
                }
            }

            let realCols = newElem[0].length - getColZeros(newElem);
            if (currentCol + realCols <= numCols){
                for(let i = 0; i < rows; i++){
                    let row = currentRow - rows + i;
                    if (row < 0) continue;
                    for(let j = 0; j < newElem[i].length; j++){
                        let col = currentCol + j;
                        if (col >= numCols) break;
                        if(prev[i][j] != 0 && gameTable[row][col] == elemId){
                            $("#"+row+"c"+col).css("background-color", "grey");
                            gameTable[row][col] = 0;
                        }
                        if(newElem[i][j] != 0){
                            $("#"+row+"c"+col).css("background-color", colors[newElem[i][j]]);
                            gameTable[row][col] = elemId;
                        }
                    }
                }
                currentElem = newElem;
            }
            
            
            
        }else if (key.keyCode == 32){
            return;
        }
        

        startInterval();
    })
    

    
  

});