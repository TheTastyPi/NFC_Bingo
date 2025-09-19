var board = [];
var boardActive = Array(25).fill(false);
boardActive[12] = true;
var boardDisp = [];
var boardDispText = [];
var theme = "nwero";
const contestID = 5;

function randomizeBoard() {
    board = [...promptList];
    for (let i = 0; i < 24; i++) {
        let nextIndex = randomInt(board.length - i) + i;
        let temp = board[i];
        board[i] = board[nextIndex];
        board[nextIndex] = temp;
    }
    board.length = 24;
    board.splice(12, 0, freeList[randomInt(freeList.length)] + " (Free space)");
}

function displayBoard() {
    for (let i = 0; i < 25; i++) {
        boardDispText[i].textContent = board[i];
        boardDispText[i].style.fontSize = "1px";
        while (boardDispText[i].clientWidth <= boardDisp[i].clientWidth && boardDispText[i].clientHeight <= boardDisp[i].clientHeight) {
            let currSize = parseInt(boardDispText[i].style.fontSize);
            currSize++;
            boardDispText[i].style.fontSize = currSize+"px";
        }
        let currSize = parseInt(boardDispText[i].style.fontSize);
        currSize *= 0.8;
        boardDispText[i].style.fontSize = currSize+"px";
    }
    updateActive();
}

function updateActive() {
    for (let i = 0; i < 25; i++) {
        if (boardActive[i]) {
            boardDisp[i].classList.add("active");
        } else {
            boardDisp[i].classList.remove("active");
        }
    }
}

function checkCompletedRow(index) {
    let valid = true;
    let rowStart = index - (index % 5);
    for (let i = 0; i < 5; i++) {
        if (!boardActive[rowStart+i]){
            valid = false;
            break;
        }
    }
    if (valid) flashTiles(rowStart, 5, 1);

    valid = true;
    let colStart = index % 5;
    for (let i = 0; i < 5; i++) {
        if (!boardActive[colStart+5*i]){
            valid = false;
            break;
        }
    }
    if (valid) flashTiles(colStart, 5, 5);

    if (rowStart/5 == colStart) {
        valid = true;
        for (let i = 0; i < 5; i++) {
            if (!boardActive[6*i]){
                valid = false;
                break;
            }
        }
        if (valid) flashTiles(0, 5, 6);
    }

    if (rowStart/5 == 4-colStart) {
        valid = true;
        for (let i = 1; i < 6; i++) {
            if (!boardActive[4*i]){
                valid = false;
                break;
            }
        }
        if (valid) flashTiles(4, 5, 4);
    }
}

function toggleSquare(index) {
    boardActive[index] = !boardActive[index];
    updateActive();
    saveBoard();
    checkCompletedRow(index);
}

function setupBoardDisplay() {
    for (let i = 0; i < 25; i++) {
        boardDisp[i] = document.createElement("div");
        document.getElementById("bingoBoard").appendChild(boardDisp[i]);
        boardDisp[i].className = "bingoSquare";

        boardDispText[i] = document.createElement("div");
        boardDisp[i].appendChild(boardDispText[i]);
        boardDispText[i].className = "bingoText";

        boardDisp[i].addEventListener("click", function() {
            toggleSquare(i);
        });
    }
}

function clearBoard() {
    boardActive = Array(25).fill(false);
    boardActive[12] = true;
    displayBoard();
    saveBoard();
}

function regenerateBoard() {
    clearBoard()
    randomizeBoard();
    displayBoard();
    saveBoard();
}

function saveBoard() {
    let str = JSON.stringify(board);
    localStorage.setItem("NFC_Bingo_Board", str);
    str = JSON.stringify(boardActive);
    localStorage.setItem("NFC_Bingo_Board_Active", str);
    localStorage.setItem("NFC_Bingo_Board_Theme", theme);
    localStorage.setItem("NFC_Bingo_ContestID", contestID);
}

function loadBoard() {
    let str = localStorage.getItem("NFC_Bingo_Board");
    let storedID = localStorage.getItem("NFC_Bingo_ContestID");
    if (str && storedID && storedID == contestID) {
        board = JSON.parse(str);
        str = localStorage.getItem("NFC_Bingo_Board_Active");
        boardActive = JSON.parse(str);
        for (let i = 0; i < 25; i++) {
            if (boardActive[i]) {
                boardDisp[i].classList.toggle("active");
            }
        }
    } else {
        randomizeBoard();
        saveBoard();
    }
    str = localStorage.getItem("NFC_Bingo_Board_Theme");
    if (str) {
        theme = str;
        updateTheme(false);
    }
}

function updateTheme(fade = true) {
    let stylesheet = document.getElementById("styleTheme");
    stylesheet.setAttribute("href", `style/${theme}.css`);
    if (fade) {
        document.body.classList.add("themeTransition");
        setTimeout(function() {
            document.body.classList.remove("themeTransition");
        }, 500);
    }
    saveBoard();
}

function toggleTheme() {
    theme = theme == "nwero" ? "eliv" : "nwero";
    updateTheme();
}

function flashTile(index) {
    if (boardDisp[index].classList.contains("flashAnim")) return;
    boardDisp[index].classList.add("flashAnim");
    setTimeout(function(){
        boardDisp[index].classList.remove("flashAnim");
    }, 1000);
}

function flashTiles(index, toFlash, offset) {
    flashTile(index);
    let nextIndex = index + offset;
    if (nextIndex > board.length) return;
    if (toFlash == 1) return; 
    setTimeout(flashTiles, 66, nextIndex, toFlash-1, offset);
}

function randomInt(n) {
    return Math.floor(Math.random()*n);
}

setupBoardDisplay();
loadBoard();
displayBoard();