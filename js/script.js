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

	const startGame = (player1Name, player2Name) => {
		players = [Player(player1Name, 'X'), Player(player2Name, 'O')];

		currentPlayerIndex = 0;
		isGameOver = false;
		gameBoard.resetBoard();
	};

	const getCurrentPlayer = () => players[currentPlayerIndex];

	const switchPlayer = () => {
		currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
	};

	const playTurn = (row, column) => {
		if (
			!isGameOver &&
			gameBoard.updateBoard(row, column, getCurrentPlayer().marker)
		) {
			if (checkWin()) {
				console.log(`${getCurrentPlayer().name} wins!`);
				isGameOver = true;
			} else if (checkDraw()) {
				console.log(`It's a draw!`);
				isGameOver = true;
			} else {
				switchPlayer();
			}
		}
		console.log(gameBoard.getBoard());
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
