

$(document).ready(function(){
    //vraca broj koji se vezuje sa bojom elementa
    function getColor(elem){
        for (let i = 0; i < elem.length; i++){
            for(let j = 0; j < elem[i].length; j++){
                if(elem[i][j] != 0) return elem[i][j];
            }
        }
    }

    //vraca broj praznih kolona
    function getColZerosLeft(elem){
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
            }else{
                break;
            }
        }
        return cnt;
    }

    function getColZerosRight(elem){
        let cnt = 0;
        let all = 0;
        for(let j = elem[0].length-1; j >= 0; j--){
            all = 0;
            for(let i = 0; i < elem.length; i++){
                if (elem[i][j] == 0){
                    all += 1;
                }
            }
            if (all == elem.length){
                cnt += 1;
            }else{
                break;
            }
        }
        return cnt;
    }

    //brise ceo element iz tabele
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

    //ubrzavanje figure
    function faster(){
        down = true;
        clearInterval(game);
        velocity -= moreVelocity;
        startInterval(velocity);
    }

    //pomera element levo ili desno
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

    //vraca sledeci element
    function getNext(){
        let nextElem = Math.floor(Math.random() * availableElements.length);
        elem = elements[availableElements[nextElem]];
        let column;
        do{
            column = Math.floor(Math.random() * numCols);
        }while (column + elem[0].length > numCols);
        //currentElem = nextElem;

        data = {
            'elem': elem,
            'column': column
        }
       
        return data;
    }

    //vraca da li vec postoji neki element desno, pa onda ne mozemo da se pomerimo
    function hasRight(elem){
        let row = currentRow - elem.length;
        let col = currentCol + elem[0].length - getColZerosRight(elem);
        for(let i = row; i < currentRow; i++){
            if(i < 0) continue;
            if(gameTable[i][col] != 0) return true;
        }
        return false;
    }

    //vraca da li vec postoji neki element levo, pa onda ne mozemo da se pomerimo
    function hasLeft(elem){
        let row = currentRow - elem.length;
        let col = currentCol - 1 + getColZerosLeft(elem);
        let len = row + elem.length;
        for(let i = row; i < len; i++){
            if( i < 0) continue;
            if(gameTable[i][col] != 0) return true;
        }
        return false;
    }
    

    //proverava da li postoji neki element ispod
    //zaustavlja se ako postoji
    //nastavlja dalje ako ne postoji
    function hasBeneath(elem, column){
        
        if(column + elem[0].length - getColZerosRight(elem) > numCols) return true;
        
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
                //kada proveravamo prve redove moze da ide dole ako je ispod celija iste boje ili prazna
                if (elem[i][j] != 0 && gameTable[row][col] != 0 && gameTable[row][col] != elemId){
                    //console.log('o');
                    return true;
                }
                
            }
            row += 1;
        }
        //console.log('l');
        return false;
    }

    //postavljanje elementa na sledecu poziciju
    function nextPosition(elem){
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
                }else if (row != currentRow && gameTable[row][col] == elemId){
                    $("#"+row+"c"+col).css("background-color", "grey");
                    gameTable[row][col] = 0;
                }
                
            }
            row -= 1;
        }
        currentRow += 1;
        
    }

    //provera da li je neki red pun da bismo ga sklonili i povecali poene
    function checkForPoints(){
        let row = currentRow - 1 >= numRows ? numRows-1 : currentRow - 1;
        let saveRow = row;
        //let row = numRows - 1;
        if (row < 0) return;
        
        for(let i = 0; i < elem.length && row > 0; i++){
            wholeRow = gameTable[row].every(function(elem){
                return elem != 0;
            })
            
            //sve dok red ima sve elemente razlicite od 0, vrse se provere i elementi se povlace nanize
            while(wholeRow == true){
                let allZeros;

                result += points;
                $("#result").text("Result: " + result);
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

            row = saveRow - i - 1;
        }
        
    }

    //postavljanje sledeceg elementa
    function setNextElem(){
        let data = getNext();
        nextElemData['nextElem'] = data['elem'];
        let nextElem = nextElemData['nextElem'];
        nextElemData['nextColumn'] = data['column'];
        nextElemData['nextElemId'] = elemNum*maxElem + getColor(nextElem);
        elemNum++;
        $("#nextElemTable").remove();
        let table = $("<table></table>");
        for(let r = 0; r < nextElem.length; r++){
            let row = $("<tr></tr>");
            for(let c = 0; c < nextElem[r].length; c++){
                row.append(
                    $("<td></td>").css({
                        "background-color": colors[nextElem[r][c]],
                        "width": "25px",
                        "height": "25px",
                        "border": "solid 2px black"
                    })
                );
                
            }
            table.attr("id", "nextElemTable");
            table.append(row);
        }
        //table.attr("id", i);
        $("#nextTableDiv").append(table);
    }

    //pokretanje igre
    function startInterval(time){
        
        game = setInterval(function(){

            //postavljanje pocetnog elementa
            if (currentElem == null){
                data = getNext();
                currentElem = data['elem'];
                currentCol = data['column'];
                elemId = elemNum*maxElem + getColor(currentElem);
                elemNum++;
                nextPosition(currentElem);
                setNextElem();
            }
            
            //kada element stigne do kraja proveravamo poene i da li je igra gotova
            //ukoliko igra nije gotova uzimamo sledeci element
            if (hasBeneath(currentElem, currentCol)){
                checkForPoints();
    
                //proveravamo da li je popunjen prvi red i ako jeste igra je gotova
                let zeros = gameTable[0].every(function(elem){
                    return elem == 0;
                })
                if (zeros == false){
                    clearInterval(game);
                    clearInterval(accelerate);
                    let name = prompt('Enter your name:')
                    let info = {
                        "name": name,
                        "result": result
                    };
                    let players = localStorage.getItem('players');
                    if (players == null){
                        let playersArr = [info];
                        localStorage.setItem("players", JSON.stringify(playersArr));
                    }else{
                        let playersArr = JSON.parse(players);
                        playersArr.push(info);
                        localStorage.setItem("players", JSON.stringify(playersArr));
                    }
                    window.location = 'tetris-rezultati.html';
                    return;
                }
                currentElem = nextElemData['nextElem'];
                elemId = nextElemData['nextElemId'];
                currentCol = nextElemData['nextColumn'];
                setNextElem();
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
            
    
        }, time);

    }

    colors = ["grey", "blue", "red", "yellow", "purple", "green", "orange", "palevioletred"]
    var currentRow = 0;
    var currentCol;
    var numElem = 7;
    var currentElem = null;
    var game;
    var elemNum = 1;
    var elemId;
    var maxElem = 50;
    var velocity;
    var startVelocity;
    var down = false;
    var moreVelocity;
    var nextElemData = {
        'nextElem': 0,
        'nextColumn': 0,
        'nextElemId': 0
    }
    var result = 0;
    var points = 10;
    

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
            [4, 4],
            [4, 4]
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 1]
        ]
    ]

    var numRows = 0;
    var numCols = 10;
    var gameTable = [];

    fieldTable = $("#gameTable");
    fieldHeight = fieldTable.height();
    fieldWidth = fieldTable.width();
    cellWidth = fieldWidth/numCols;
    var availableElements = localStorage.getItem('elements');
    if(availableElements != null){
        availableElements = JSON.parse(availableElements);
        localStorage.removeItem("elements");
    }else{
        availableElements = [0, 1, 2, 3, 4, 5, 6];
    }
    let mode = localStorage.getItem("mode");
    if(mode != null){
        if (mode == 1){
            startVelocity = 500;
            velocity = 500;
        }else if (mode == 2){
            startVelocity = 300;
            velocity = 300;
        }else{
            startVelocity = 200;
            velocity = 200;
        }
        localStorage.removeItem("mode");
        moreVelocity = startVelocity * 0.8;
       
    }else{
        startVelocity = 500;
        velocity = 500;
        moreVelocity = startVelocity * 0.8;
        mode = 1;
    }
    $("#level").text("Level: " + mode);
    
    


    currentHeight = 0;
    fieldTable.css("background-color", "grey");
    
    i = 0;
    do{
        row = $("<tr></tr>").attr("id", i);
        gameRow = [];

        for (let j = 0; j < numCols; j++){
            cell = $("<td></td>").attr("id", i+"c"+j).css("background-color", "grey").css({
                "width": cellWidth,
                "height": "40px",
                "border": "solid 1px black"
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

    maxElem = numRows*numCols/3;

    startInterval(velocity);

    let accelerate = setInterval(function(){
        clearInterval(game);
        startVelocity -= 10;
        velocity = startVelocity;
        moreVelocity = startVelocity * 0.8;
        down = false;
        startInterval(velocity);
        console.log("sv"+startVelocity);

    }, 5000);
    

    $(document).keydown(function(key){
        //desna strelica - element ide desno za jednu kolonu
        if (key.keyCode == 39){
            
            //&& hasBeneath(currentElem, currentCol+1) == false
            if (currentCol + currentElem[0].length - getColZerosRight(currentElem) < numCols  && hasRight(currentElem) == false){
                
                deleteAll(currentElem);
                currentCol += 1;
                move(currentElem);
                
                
            }
        //leva strelica - element ide levo za jednu kolonu
        }else if (key.keyCode == 37){
            //&& hasBeneath(currentElem, currentCol-1) == false
            console.log(hasLeft(currentElem));
            if (currentCol - 1 + getColZerosLeft(currentElem) >= 0  && hasLeft(currentElem) == false){
                
                deleteAll(currentElem);
                currentCol -= 1;
                move(currentElem);
                
            }
        //gornja strelica - rotacija
        }else if (key.keyCode == 38){
            clearInterval(game);
            
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

            //brisanje starih polja i upisivanje novih
            //ukoliko dodje do kolizije vracamo na prethodno stanje
            let realCols = newElem[0].length - getColZerosRight(newElem);
            let collision = false;
            
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
                        if(newElem[i][j] != 0 && gameTable[row][col] == 0){
                            $("#"+row+"c"+col).css("background-color", colors[newElem[i][j]]);
                            gameTable[row][col] = elemId;
                        }else if(newElem[i][j] != 0 && gameTable[row][col] != 0){
                            collision = true;
                            break;
                        }
                    }
                    
                    if (collision == true) break;
                    
                }
                if (collision == true){
                    
                    for(let i = 0; i < rows; i++){
                        let row = currentRow - rows + i;
                        if (row < 0) continue;
                        for(let j = 0; j < newElem[i].length; j++){
                            let col = currentCol + j;
                            if (col >= numCols) break;
                            if(prev[i][j] != 0){
                                $("#"+row+"c"+col).css("background-color", colors[getColor(currentElem)]);
                                gameTable[row][col] = elemId;
                            }
                            
                        }
                    }
                }else{
                    currentElem = newElem;
                }
                startInterval(velocity);
            }
            
            
            
        }else if (key.keyCode == 32){
            return;
        //donja strelica - ubrzanje
        }else if(key.keyCode == 40){
            //dok je pritisnut taster down figura ide brze
            //ovaj deo koda se izvrsava sve dok je taster pritisnut i zbog toga moramo da obezbedimo da se brzina smanji samo jednom
            if (down == false){
                faster();
            }
            
        }
    })

    $(document).keyup(function(key){
        //kada se pusti taster down postavljamo flag na false i vraca brzinu na pocetnu
        if (key.keyCode == 40){
            down = false;
            clearInterval(game);
            velocity = startVelocity;
            console.log('upsv'+startVelocity);
            startInterval(velocity);
        }
    })

});