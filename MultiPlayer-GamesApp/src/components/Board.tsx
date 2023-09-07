import { useEffect, useState } from "react";
import { getDatabase, ref, set, off, onValue } from "firebase/database";
import { useCurrentUser } from "./CurrentUserProvider";
import Square from "./Square";

interface BoardProps {
  gameId: string;
  onGameStarted: () => any;
  gameGridSize: number;
}

export default function Board({
  gameGridSize,
  gameId,
  onGameStarted,
}: BoardProps) {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(
    Array(gameGridSize)
      .fill("")
      .map(() => Array(gameGridSize).fill(""))
  );

  const [gameWinner, setGameWinner] = useState("");

  // Get the currentUser value using the useCurrentUser hook
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    const database = getDatabase();
    const xIsNextRef = ref(database, `fullGame/${gameId}/xIsNext`);
    const squaresRef = ref(database, `fullGame/${gameId}/squares`);

    onValue(xIsNextRef, (snapshot) => {
      const xturn = snapshot.val();
      setXIsNext(xturn);
    });

    onValue(squaresRef, (snapshot) => {
      const squaresStateJson = snapshot.val();
      const squaresState = JSON.parse(squaresStateJson);
      console.log({ squaresState });
      let acc = 0;
      squaresState.flat().forEach((sq: string) => {
        if (sq !== "") {
          acc += 1;
        }
      });
      if (acc > 0) {
        onGameStarted();
      }
      const winner = calculateWinner(squaresState);
      console.log(winner);
      if (winner) {
        setGameWinner(winner);
      } else {
        setGameWinner("");
      }
      setSquares(squaresState);
    });

    // Cleanup the subscription when the component is unmounted
    return () => {
      // Unsubscribe from the listeners
      off(xIsNextRef);
      off(squaresRef);
    };
  }, []);

  function handleClick(row: number, col: number) {
    const database = getDatabase();
    const xIsNextRef = ref(database, `fullGame/${gameId}/xIsNext`);
    const squaresRef = ref(database, `fullGame/${gameId}/squares`);

    console.log({ currentUser });
    console.log(gameId);

    if (squares[row][col] || calculateWinner(squares)) {
      return;
    }
    const newSquares = [...squares]; // Create a copy of the squares array

    const userTurn = xIsNext;
    const thisUser = currentUser;

    if (userTurn == true && thisUser == "X") {
      newSquares[row][col] = "X";
      set(xIsNextRef, false);
    } else if (userTurn == false && thisUser == "O") {
      newSquares[row][col] = "O";
      set(xIsNextRef, true);
    } else {
      return;
    }
    set(squaresRef, JSON.stringify(newSquares));
  }

  function handleResetClick() {
    const database = getDatabase();
    const squaresRef = ref(database, `fullGame/${gameId}/squares`);

    // Create an empty 2D array representing an empty board
    const emptyBoard = Array(gameGridSize)
      .fill("")
      .map(() => Array(gameGridSize).fill(""));

    // Convert the 2D array to a JSON string and set it in Firebase
    set(squaresRef, JSON.stringify(emptyBoard));
  }

  return (
    <>
      {gameWinner ? (
        <p>Winner is {gameWinner} </p>
      ) : (
        <p> {xIsNext ? "X turn" : "O turn"} </p>
      )}
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
      <button onClick={handleResetClick}>Reset Board</button>
    </>
  );
}

function calculateWinner(squares: string[][]): string | null {
  let n = squares.length;
  let l;

  if (n < 4) {
    l = n;
  } else {
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

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - l + 1; j++) {
      const consecutiveSquares = squares.slice(j, j + l);
      if (consecutiveSquares.every((row) => row[i] === "X")) {
        return "X";
      } else if (consecutiveSquares.every((row) => row[i] === "O")) {
        return "O";
      } else if (consecutiveSquares.every((row) => row[i] === null)) {
        return null;
      }
    }
  }

  // diagonal win
  for (let i = 0; i < n - l + 1; i++) {
    const consecutiveSquares = squares
      .slice(i, i + l)
      .map((row, idx) => row[i + idx]);
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
    const consecutiveSquares = squares
      .slice(i, i + l)
      .map((row, idx) => row[n - 1 - i - idx]);
    if (consecutiveSquares.every((square) => square === "X")) {
      return "X";
    } else if (consecutiveSquares.every((square) => square === "O")) {
      return "O";
    } else if (consecutiveSquares.every((square) => square === null)) {
      return null;
    }
  }

  // tie
  if (squares.every((row) => row.every((square) => square !== ""))) {
    return "Tie";
  }

  return null;
}
