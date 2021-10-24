
//Module for game functionality
const game = (() => {
    //Factory for player objects
    const player = (name, mark, turn, winner) => {
        return { name, mark, turn, winner };
    }
    const playerOne = player ("player 1", "x", true, false);
    const playerTwo = player ("player 2", "o", false, false)
    let board = [0,1,2,3,4,5,6,7,8]
    

    const switchTurns = () => {
        playerOne.turn = !playerOne.turn;
        playerTwo.turn = !playerTwo.turn;
        console.log(minimax(board, playerTwo.mark).index)
        console.log(board)
        console.log(draw())

    }
    
    const placeMark = (i) => {
        
        if (!draw) {
            return;
        }
        
        if (playerOne.turn === true && playerTwo.turn === false) {
            board[i] = playerOne.mark;
        }
        else if (playerOne.turn === false && playerTwo.turn === true) {
            board[i] = playerTwo.mark;
        }
        switchTurns();
    }
    const checkWin = (board, player) => {
        if (
            (board[0] == player && board[1] == player && board[2] == player) ||
            (board[3] == player && board[4] == player && board[5] == player) ||
            (board[6] == player && board[7] == player && board[8] == player) ||
            (board[0] == player && board[3] == player && board[6] == player) ||
            (board[1] == player && board[4] == player && board[7] == player) ||
            (board[2] == player && board[5] == player && board[8] == player) ||
            (board[0] == player && board[4] == player && board[8] == player) ||
            (board[2] == player && board[4] == player && board[6] == player)
            ) {
            return true;
            } else {
            return false;
        }
    }
    
    const draw = () => {
        return board.every((element) => {
            if (typeof element !== "number" && checkWin(board,playerOne.mark) || checkWin(board, playerTwo.mark)) {
                return false;
            }
            else if (typeof element !== "number" ) {

                return true;
            }
        })
    }
    const restartGame = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = i;
        }
    }
    const emptyBoardIndex = () => {
        return board.filter(spaces => spaces != playerOne.mark && spaces != playerTwo.mark);
    }
    
    const minimax = (board, player) => {
        var availSpots = emptyBoardIndex(board);
        if (checkWin(board, playerOne.mark)) {
            return { score: -10 };
        }
        else if (checkWin(board, playerTwo.mark)) {
            return {score: 10 };
        }
        else if (availSpots.length === 0) {
            return { score: 0 };
        }
        var moves = [];
        for (var i = 0; i < availSpots.length; i++) {
            var move = {};
            move.index = board[availSpots[i]];
            board[availSpots[i]] = player;
            if (player == playerTwo.mark) {
                var result = minimax(board, playerOne.mark);
                move.score = result.score;
            }
            else {
                var result = minimax(board, playerTwo.mark)
                move.score = result.score
            }
            board[availSpots[i]] = move.index;
            moves.push(move);
        }
        var bestMove;
        if(player === playerTwo.mark) {
            var bestScore = -10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        else {
            var bestScore = 10000;
            for (var i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }
    return {
        player,
        playerOne,
        playerTwo,
        switchTurns,
        placeMark,
        board,
        checkWin,
        draw,
        restartGame,
        minimax,
    }

})();



//Module for DOM Display:
const displayGame = (() => {
    const gameBoard = document.querySelector(".gameboard");
    const gridElements = document.querySelectorAll(".cell");
    const winningScreen = document.querySelector(".winning-screen");
    const winningScreenText = document.querySelector(".winning-screen-text");
    const restartButton = document.querySelector(".winning-screen-button");
    const titleScreen = document.querySelector(".title-screen")
    const computerButton = document.querySelector(".computer-btn");
    const twoPlayerButton = document.querySelector(".two-player-btn")
    const playerTwoInfo = document.querySelector(".playerTwo-info")
    const playerOneName = document.querySelector(".player-one-name")
    const playerTwoName = document.querySelector(".player-two-name")
    const mainGameArea = document.querySelector(".main-game")
    const playerInfo = document.querySelector(".player-info")
    const submitButton = document.querySelector(".submit")
    const xButton = document.querySelector(".x-symbol")
    const oButton = document.querySelector(".o-symbol")
    const setGameBoardHover = () => {
        gameBoard.classList.remove(game.playerOne.mark)
        gameBoard.classList.remove(game.playerTwo.mark)
        if (game.playerOne.turn === true) {
            gameBoard.classList.add(game.playerOne.mark)
        }
        else if (game.playerTwo.turn === true) {
            gameBoard.classList.add(game.playerTwo.mark)
        } if(game.checkWin(game.board, game.playerOne.mark) || game.checkWin(game.board, game.playerTwo.mark)|| game.draw()) {
            gameBoard.classList.remove(game.playerOne.mark)
            gameBoard.classList.remove(game.playerTwo.mark)
            gameBoard.classList.add(game.playerOne.mark)
        }
    }
    const displayWinScreen = () => {

        if (game.checkWin && !game.draw()) {
            winningScreenText.textContent = `${game.playerOne.turn ? game.playerTwo.name: game.playerOne.name} wins!`
        }
        else if (game.draw()) {
            winningScreenText.textContent = "Its a draw!"
        }
        winningScreen.classList.add("show");
    
    }
    const onBoardClick =  (i) => {
        game.placeMark(i)
    }
    const computerClick = () => {
        index = game.minimax(game.board, game.playerTwo.mark).index
        if (game.draw()) {
            return;
        }
        else {
            game.placeMark(index)
            test = document.querySelector(`.cell[data-index = "${index}"]`)
            test.classList.add(game.playerTwo.mark)
        }
    }
    const startGame = () => {
        setGameBoardHover();
        if(oButton.classList.contains("selected") && !mainGameArea.classList.contains("two-player-game")) {
            game.playerOne.mark = "o"
            game.playerOne.turn = false
            game.playerTwo.mark = "x"
            game.playerTwo.turn = true
            computerClick();
            setGameBoardHover();

        }
        if(xButton.classList.contains("selected")) {
            game.playerOne.mark = "x"
            game.playerTwo.mark = "o"
            game.playerOne.turn = true
            game.playerTwo.turn = false
            setGameBoardHover();
        }
        gridElements.forEach(cell => {
            cell.addEventListener("click", () => {
                if (cell.classList.contains(game.playerOne.mark) || cell.classList.contains(game.playerTwo.mark)) {
                    return;
                }
                else {
                    onBoardClick(cell.dataset.index)
                    cell.classList.add(game.board[cell.dataset.index])
                    if (mainGameArea.classList.contains("two-player-game")) {
                        setGameBoardHover();
                    }
                    else {
                        computerClick();
                        setGameBoardHover();

                    }
                    if (game.checkWin(game.board, game.playerOne.mark) || game.checkWin(game.board, game.playerTwo.mark)|| game.draw()) {
                        
                        displayWinScreen();
                        setGameBoardHover();
                        if (game.checkWin(game.board, game.playerOne.mark)) {
                            
                            cell.classList.add("winner");
                        }
                    }
                }
            }, {once: true })
        });
    }
    const restartDisplay = () => {
        gridElements.forEach(cell => {
            cell.classList.remove(game.playerOne.mark)
            cell.classList.remove(game.playerTwo.mark)
            cell.classList.remove("winner");
        });
        winningScreen.classList.remove("show");
        game.restartGame();
        startGame();
    };
    restartButton.addEventListener("click", restartDisplay)
    computerButton.addEventListener("click", () => {
        playerOneName.value = ""
        oButton.classList.remove("selected")
        xButton.classList.add("selected")
        playerTwoInfo.classList.remove("show")
        mainGameArea.classList.remove("two-player-game")
        mainGameArea.classList.add("computer-game")
        restartDisplay();
        playerInfo.classList.add("show")
        titleScreen.style.animationPlayState = "running";
        mainGameArea.classList.remove("show")
    });
    twoPlayerButton.addEventListener("click", () => {
        oButton.classList.remove("selected")
        xButton.classList.add("selected")
        mainGameArea.classList.remove("computer-game")
        mainGameArea.classList.add("two-player-game")
        restartDisplay();
        titleScreen.style.animationPlayState = "running";
        playerTwoInfo.classList.add("show")
        playerInfo.classList.add("show")
        mainGameArea.classList.remove("show")
    });
    submitButton.addEventListener("click", () => {
        playerInfo.classList.remove("show")
        mainGameArea.classList.add("show")
        startGame();
    });
    playerInfo.addEventListener("submit", (e) => {
        e.preventDefault();
        if (playerOneName.value.length == 0) {
            game.playerOne.name = "Player 1"
        }
        else {
            game.playerOne.name = playerOneName.value
            
        }
        if (mainGameArea.classList.contains("two-player-game")) {
            if (playerTwoName.value.length == 0) {
                game.playerTwo.name = "Player 2"
            }
            else {

                game.playerTwo.name = playerTwoName.value
            }

        }
        else {
            game.playerTwo.name = "Computer"
        }
    })
    xButton.addEventListener ("click", () => {
        xButton.classList.add("selected")
        oButton.classList.remove("selected")
        game.playerOne.mark = "x"
        game.playerTwo.mark = "o"
        game.playerOne.turn = true
        game.playerTwo.turn = false

    })
    oButton.addEventListener ("click", () => {
        oButton.classList.add("selected")
        xButton.classList.remove("selected")
        game.playerOne.mark = "o"
        game.playerOne.turn = false
        game.playerTwo.mark = "x"
        game.playerTwo.turn = true
    })
})();
