// create the board
const gameBoard = (() => {
	let board = [
		[' ', ' ', ' '],
		[' ', ' ', ' '],
		[' ', ' ', ' '],
	];

	const getBoard = () => board;

	const updateBoard = (row, column, player) => {
		if (board[row][column] === ' ') {
			board[row][column] = player;
			return true;
		}
		return false;
	};

	const resetBoard = () => {
		board = [
			[' ', ' ', ' '],
			[' ', ' ', ' '],
			[' ', ' ', ' '],
		];
	};

	return { getBoard, updateBoard, resetBoard };
})();

// create the player
const Player = (name, marker) => {
	return { name, marker };
};

// create the game controller
const gameController = (() => {
	let players = [];
	let currentPlayerIndex = 0;
	let isGameOver = false;

	// start a new game
	const startGame = (player1Name, player2Name) => {
		players = [Player(player1Name, 'X'), Player(player2Name, 'O')];

		currentPlayerIndex = 0;
		isGameOver = false;
		gameBoard.resetBoard();
		displayController.renderBoard(gameBoard.getBoard());
		displayController.updateResult('Game started!');
		console.log('Game started!');
	};

	const getCurrentPlayer = () => players[currentPlayerIndex];

	const switchPlayer = () => {
		currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
	};

	// what happens when a player plays a turn
	const playTurn = (row, column) => {
		if (
			!isGameOver &&
			gameBoard.updateBoard(row, column, getCurrentPlayer().marker)
		) {
			if (checkWin()) {
				const winnerMessage = `${getCurrentPlayer().name} wins!`;
				displayController.updateResult(winnerMessage);
				console.log(winnerMessage);
				isGameOver = true;
			} else if (checkDraw()) {
				const drawMessage = `It's a draw!`;
				displayController.updateResult(drawMessage);
				console.log(drawMessage);
				isGameOver = true;
			} else {
				switchPlayer();
				displayController.updateResult(
					`${getCurrentPlayer().name}'s turn. Marker: ${
						getCurrentPlayer().marker
					}`
				);
			}
			console.log(gameBoard.getBoard());
			displayController.renderBoard(gameBoard.getBoard());
		} else {
			console.log('Invalid move. Try again.');
		}
	};

	const checkWin = () => {
		const board = gameBoard.getBoard();
		const winner = checkBoard(board);
		return winner !== undefined;
	};

	const checkDraw = () => {
		const board = gameBoard.getBoard();
		return board.every((row) => row.every((cell) => cell !== ' '));
	};

	return { startGame, playTurn, getCurrentPlayer };
})();

// check for winning combination
function checkBoard(board) {
	// diagonal
	if (
		board[0][0] === board[1][1] &&
		board[1][1] === board[2][2] &&
		board[0][0] !== ' '
	) {
		return board[0][0];
	}

	if (
		board[0][2] === board[1][1] &&
		board[1][1] === board[2][0] &&
		board[0][2] !== ' '
	) {
		return board[0][2];
	}

	// row and column
	for (let i = 0; i < 3; i++) {
		if (
			board[i][0] === board[i][1] &&
			board[i][1] === board[i][2] &&
			board[i][0] !== ' '
		) {
			return board[i][0];
		}

		if (
			board[0][i] === board[1][i] &&
			board[1][i] === board[2][i] &&
			board[0][i] !== ' '
		) {
			return board[0][i];
		}
	}

	return undefined;
}

// updates the webpage when playing
const displayController = (() => {
	const gameBoardElement = document.querySelector('.game-board');
	const resultElement = document.querySelector('.game-result');

	const renderBoard = (board) => {
		// reset the board
		gameBoardElement.innerHTML = '';

		// generate the new board
		board.forEach((row, rowIndex) => {
			row.forEach((cell, colIndex) => {
				const cellElement = document.createElement('div');
				cellElement.classList.add('cell');
				cellElement.textContent = cell;

				// add event listener for user action
				cellElement.addEventListener('click', () => {
					gameController.playTurn(rowIndex, colIndex);
				});

				gameBoardElement.appendChild(cellElement);
			});
		});
	};

	const updateResult = (message) => {
		resultElement.textContent = message;
	};

	return { renderBoard, updateResult };
})();

// Start game event listener
document.querySelector('.start-button').addEventListener('click', () => {
	const player1Name =
		document.querySelector('.player1-name').value || 'Player 1';
	const player2Name =
		document.querySelector('.player2-name').value || 'Player 2';
	gameController.startGame(player1Name, player2Name);
});
