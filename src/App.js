import { useState } from 'react';
import './App.css';



export default function Game() {
	const [history, setHistory] = useState([Array(9).fill(null)]);
	const [currentMove, setCurrentMove] = useState(0);
	const xIsNext = currentMove % 2 === 0;
	const currentSquares = history[currentMove];
    

	function handlePlay(nexSquares) {
		const nextHistory = [...history.slice(0, currentMove + 1), nexSquares];
		setHistory(nextHistory);
		setCurrentMove(nextHistory.length - 1);
	}
    

	function jumpTo(nextMove) {
		setCurrentMove(nextMove);
	}

	const moves = history.map((squares, move) => {
		let description;

		if (move > 0) {
			description = "Go to move #" + move;
		} else {
			description = "Go to game start";
		}
         
		if (move !== history.length - 1) {

			return (
				<li key={move}>
					<button
						onClick={() => jumpTo(move)}
					>
						{description}
					</button>
				</li>
			)
		} else {
			return (
				<li
					key={move}
					className="sentence"
				>				
					<p> {`${move ?"You are at move #" + description.split("#").at(-1): description}`}</p>		
									
				</li>
			);
		}
	});

	return (
		<div className="game center">
			<div className='game-board'>
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
			</div>
			<div className="game-info">
				<ol>{moves}</ol>
			</div>
		</div>
	);
}




function Board({xIsNext, squares, onPlay}) {

	function handleClick(i) {

		if (squares[i] || calculateWinner(squares)) {
			return;
		}

		const copySqures = squares.slice();

		if (xIsNext) {
		    copySqures[i] = 'X';			
		} else {
			copySqures[i] = 'O';
		}

		onPlay(copySqures);
	}
    
	let check = calculateWinner(squares);
	let winner, indices;
	let status;

	if (check !== true && check !== false) {
		[winner, indices] = check;
	} 
	
	
	if (winner) {
		status = `Winner : ${winner}`;

	} else {
		status = check === true? "Game Tie": `Next Player : ${xIsNext ? 'X' : 'O'}`;
	}

	return (
		<>
			<div className={"status" + (winner || check === true? " highlight1": "")}>{status}</div>

			{
				Array(3).fill(null).map((_, row) => {
					return (
						<div
							className="board-row"
							key={row}
						>
							{Array(3).fill(null).map((_, column) => {
								let index = row * 3 + column;
								
								return (
									<Square
										value={squares[index]}
										onSquareClick={() => handleClick(index)}
										key={index}
										highlight={indices && indices.includes(index)}
									/>
								);							
							})}
						</div>
					);				
				})
			}
		</>
    );

}



function Square({value, onSquareClick, highlight}) {

	return (
		<button
			className={"square"+ (highlight? " highlight": "")}
			onClick={onSquareClick}
		>
			{value}
		</button>
	);
}



function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
	
  for (let i = 0; i < lines.length; i++) {
	const [a, b, c] = lines[i];
	  
    if (squares[a] && (squares[a] === squares[b]) && (squares[a] === squares[c])) {
		return [squares[a], lines[i]];
    }
  }
	
	let check = true;

	for (let i = 0; i < 9; i++) {
		if (!squares[i]) {
			check = false;
		}
	}	
	
  return check;
}



