var board = [];
var boardActive = Array(25).fill(false);
var boardDisp = [];
var boardDispText = [];
var theme = "nwero";

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

function setupBoardDisplay() {
    for (let i = 0; i < 25; i++) {
        boardDisp[i] = document.createElement("div");
        document.getElementById("bingoBoard").appendChild(boardDisp[i]);
        boardDisp[i].className = "bingoSquare";

        boardDispText[i] = document.createElement("div");
        boardDisp[i].appendChild(boardDispText[i]);
        boardDispText[i].className = "bingoText";

        boardDisp[i].addEventListener("click", function() {
            boardActive[i] = !boardActive[i];
            updateActive();
            saveBoard();
        });
    }
}

function clearBoard() {
    boardActive = Array(25).fill(false);
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
}

function loadBoard() {
    let str = localStorage.getItem("NFC_Bingo_Board");
    if (str) {
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
    str = localStorage.getItem("NFC_Bingo_Board_Theme")
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

function randomInt(n) {
    return Math.floor(Math.random()*n);
}

setupBoardDisplay();
loadBoard();
displayBoard();