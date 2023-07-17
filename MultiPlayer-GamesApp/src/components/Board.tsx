import { useState } from "react";
import Square from "./Square";


export default function Board() {
    
    let n = 3;
    const [xIsNext, setXIsNext] = useState(true);
    const [squares, setSquares] = useState(Array(n).fill("").map(() => Array(n).fill("")));

    const [gameWinner, setGameWinner] = useState("")
    
  
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
        setGameWinner(winner);
      }else{
        setGameWinner("");
        //  how to fix the problem of next player shown incorrectly
      }
    }

    return(
        <>
        {gameWinner ? <p>Winner is {gameWinner} </p> : <p> {xIsNext ? "X turn" : "O turn" } </p>}
        {squares.map((row, rowIndex) => (
        <div key={rowIndex}>
        {row.map((element, colIndex) => (
          <Square
            key={`${rowIndex}-${colIndex}`}
            value={element}
            onSquareClick={() => handleClick(rowIndex, colIndex)}
          />
        ))}
      </div>
    ))}
        </>
    )
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