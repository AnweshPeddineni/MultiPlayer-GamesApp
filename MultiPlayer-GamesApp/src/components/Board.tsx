import { useState } from "react";
import Square from "./Square";


export default function Board() {
    
    let n = 3;
    const [xIsNext, setXIsNext] = useState(true);
    const [squares, setSquares] = useState(Array(n).fill("").map(() => Array(n).fill("")));

    const [gameStatus, setGameStatus] = useState("Game ongoing")
    
  
    function handleClick(row: number, col: number) {
      if(squares[row][col] || calculateWinner(squares)) {
        return;
      }
      const newSquares = [...squares]; // Create a copy of the squares array
      if (xIsNext) {
        newSquares[row][col] = "X";
      } 
      else {
        newSquares[row][col] = "O";
      }

      setXIsNext(!xIsNext);
      setSquares(newSquares);

      const winner = calculateWinner(squares);
      console.log(winner);
      if(winner){
        setGameStatus("winner: " + winner);
      }else{
        setGameStatus("Next Player: " + (xIsNext? "X" : "O"));
        //  how to fix the problem of next player shown incorrectly
      }
    }
  
    const renderedSquares = [];
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < n; j++) {
        row.push(
          <Square
            key={`${i}-${j}`}
            value={squares[i][j]}
            onSquareClick={() => handleClick(i, j)}
          />
        );
      }
      renderedSquares.push(<div key={i}>{row}</div>);
      // check the proper way ofrendering a list in react, the above is not the best way
    }
  
    return(
        <>
        <div>{gameStatus}</div>
        {renderedSquares}
        </>
    )
}

interface Square {
    value: string;
}

// TODO: Explain the better way to do this type magic?
function calculateWinner(squares: string[][]): string | null{

    let n = squares.length;

    // row win

    for(let i=0; i<n; i++){
        if(squares[i].every((square)=> square === "X")){
            return "X";
        }else if(squares[i].every((square)=> square === "O")){
            return "O";
        }else if(squares[i].every((square)=> square === null)){
            return null;
        }
    }

    // col win

    for(let i=0; i<n; i++){
        if(squares.every((row) => row[i] === "X")){
            return "X";
        }else if(squares.every((row) => row[i] === "O")){
            return "O";
        }else if(squares.every((row) => row[i] === null)){
            return null;
        }
    }

    // diagonal win
    let hasDiagonalWin = true;
    for(let i=0; i<n; i++){
        if(squares[i][i] !== squares[0][0]){
            hasDiagonalWin = false;
            break;
        }
    }
    if (hasDiagonalWin) {
        return squares[0][0];
    }

    // anti-diagonal win
    let hasAntiDiagonalWin = true;
    for (let i = 0; i < n; i++) {
        if (squares[i][n - 1 - i] !== squares[0][n - 1]) {
            hasAntiDiagonalWin = false;
            break;
        }
    }
    if (hasAntiDiagonalWin) {
    return squares[0][n - 1];
    }

    // tie
    if(squares.every((row) => row.every((square) => square !== ""))){
        return "Tie";
    }

    return null;
}