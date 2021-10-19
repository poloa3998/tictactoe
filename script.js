
//Module for game functionality
const game = (() => {
    //Factory for player objects
    const player = (name, mark, turn) => {
        return { name, mark, turn};
    }
    const playerOne = player ("player 1", "x", true);
    const playerTwo = player ("player 2", "o", false)
    let board = new Array(9).fill(null);
    
    const switchTurns = () => {
        playerOne.turn = !playerOne.turn;
        playerTwo.turn = !playerTwo.turn;
        console.log(game.playerOne.turn)
        console.log(game.playerTwo.turn)

    }

    const placeMark = (index) => {

        if (!draw) {
            return;
        }

        if (playerOne.turn === true && playerTwo.turn === false) {
            board[index] = playerOne.mark;
        }
        else if (playerOne.turn === false && playerTwo.turn === true) {
            board[index] = playerTwo.mark;
        }
        switchTurns();
    }
    const checkWin = () => {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && (board[a] === board[b] && board[a] === board[c])) {
                return combination;
            }
        }

        return null;

    }

    const draw = () => {
        return board.every((element) => {
            return element !== null;
        })
    }
    const restartGame = () => {
        playerOne.turn = true
        playerTwo.turn = false
        for (let i = 0; i < board.length; i++) {
            board[i] = null;
        }
    }
  
    console.log(playerOne.turn)
    console.log(playerTwo.turn)
    return {
        playerOne,
        playerTwo,
        switchTurns,
        placeMark,
        board,
        checkWin,
        draw,
        restartGame,
    }

})();

//Module for DOM Display:
const displayGame = (() => {
    const gameBoard = document.querySelector(".gameboard");
    const gridElements = document.querySelectorAll(".cell");
    const winningScreen = document.querySelector(".winning-screen");
    const winningScreenText = document.querySelector(".winning-screen-text");
    const restartButton = document.querySelector(".winning-screen-button");
    const setGameBoardHover = () => {
        gameBoard.classList.remove(game.playerOne.mark)
        gameBoard.classList.remove(game.playerTwo.mark)
        if (game.playerOne.turn === true) {
            gameBoard.classList.add(game.playerOne.mark)
        }
        else if (game.playerTwo.turn === true) {
            gameBoard.classList.add(game.playerTwo.mark)
        } if(game.checkWin() || game.draw()) {
            gameBoard.classList.remove(game.playerOne.mark)
            gameBoard.classList.remove(game.playerTwo.mark)
            gameBoard.classList.add(game.playerOne.mark)
        }
    }
    const displayWinScreen = () => {

        if (game.checkWin && !game.draw()) {
            winningScreenText.textContent = `${game.playerOne.turn ? "O's": "X's"} wins!`
        }
        else if (game.draw()) {
            winningScreenText.textContent = "Its a draw!"
        }
    winningScreen.classList.add("show")
    }
    const onBoardClick =  (i) => {
        game.placeMark(i)
    }

    const startGame = () => {
        setGameBoardHover();
        gridElements.forEach(cell => {
            cell.addEventListener("click", () => {
                if (cell.classList.contains(game.playerOne.mark) || cell.classList.contains(game.playerTwo.mark)) {
                    return;
                }
                else {
                    onBoardClick(cell.dataset.index)
                    cell.classList.add(game.board[cell.dataset.index])
                    setGameBoardHover();
                    if (game.checkWin() || game.draw()) {
                        displayWinScreen();
                        setGameBoardHover();
                    }
                }
                
            }, {once: true })
        });

    }
    const restartDisplay = () => {
        gridElements.forEach(cell => {
            cell.classList.remove(game.playerOne.mark)
            cell.classList.remove(game.playerTwo.mark)
        });
        winningScreen.classList.remove("show");
        startGame();
        game.restartGame();
    }
    restartButton.addEventListener("click", restartDisplay)
 startGame();

    

})();
