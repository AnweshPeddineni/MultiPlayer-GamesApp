import { useState } from "react";
import Square from "./Square";


export default function Board() {
    
    let n = 5;
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

    return (
      <div className="container mt-4">
        {gameWinner ? (
          <p className="lead">Winner is {gameWinner}</p>
        ) : (
          <p className="lead">{xIsNext ? "X turn" : "O turn"}</p>
        )}
        <div className="row justify-content-center">
          <div className="row-3">
            <div className="row border border-dark">
              {squares.map((row, rowIndex) => (
                <div className="col-5 border border-dark" key={rowIndex}>
                  {row.map((element, colIndex) => (
                    <Square
                      key={`${rowIndex}-${colIndex}`}
                      value={element}
                      onSquareClick={() => handleClick(rowIndex, colIndex)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }




function calculateWinner(squares: string[][]): string | null{

    let n = squares.length;
    let l;

    if(n<4){
      l = n;
    }else{
      l = 4;
    }

    // row win

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - l + 1; j++) {
        const consecutiveSquares = squares[i].slice(j, j + l);
        if (consecutiveSquares.every((square) => square === "X")) {
          return "X";
        } else if (consecutiveSquares.every((square) => square === "O")) {
          return "O";
        } else if (consecutiveSquares.every((square) => square === null)) {
          return null;
        }
      }
    }

    // col win

    for(let i=0; i<n; i++) {
      for(let j = 0; j < n - l + 1; j++){
        const consecutiveSquares = squares.slice(j, j + l);
        if(consecutiveSquares.every((row) => row[i] === "X")){
            return "X";
        }else if(consecutiveSquares.every((row) => row[i] === "O")){
            return "O";
        }else if(consecutiveSquares.every((row) => row[i] === null)){
            return null;
        }
      }
    }

    // diagonal win
    for (let i = 0; i < n - l + 1; i++) {
      const consecutiveSquares = squares.slice(i, i + l).map((row, idx) => row[i + idx]);
      if (consecutiveSquares.every((square) => square === "X")) {
        return "X";
      } else if (consecutiveSquares.every((square) => square === "O")) {
        return "O";
      } else if (consecutiveSquares.every((square) => square === null)) {
        return null;
      }
    }

    // anti-diagonal win
   for (let i = 0; i < n - l + 1; i++) {
  const consecutiveSquares = squares.slice(i, i + l).map((row, idx) => row[n - 1 - i - idx]);
  if (consecutiveSquares.every((square) => square === "X")) {
    return "X";
  } else if (consecutiveSquares.every((square) => square === "O")) {
    return "O";
  } else if (consecutiveSquares.every((square) => square === null)) {
    return null;
  }
  }

    // tie
    if(squares.every((row) => row.every((square) => square !== ""))){
        return "Tie";
    }

    return null;
}