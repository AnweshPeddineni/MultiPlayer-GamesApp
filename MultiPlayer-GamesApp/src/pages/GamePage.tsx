import { useState, useEffect } from "react";
import {
  getDatabase,
  ref,
  update,
  set,
  get,
  off,
  push,
  onValue,
  child,
} from "firebase/database";
import Board from "../components/Board";
import { useCurrentUser } from "../components/CurrentUserProvider.tsx";
import { getAuth } from "firebase/auth";
import firebaseApp from "../FirebaseConfig.ts";
import { useLocation } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { useOnMountUnsafe } from "../onMountUnsafe";

const GamePage = () => {
  const location = useLocation();
  const name = location.state?.name || "";

  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");

  const { setCurrentUser } = useCurrentUser();
  const auth = getAuth(firebaseApp);
  const user = auth.currentUser;

  const [gameId, setGameId] = useState(""); // Initialize with an empty string
  const [gameGridSize, setGameGridSize] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [newGameGridSize, setNewGameGridSize] = useState(3);
  async function changeGridSize() {
    const isChangingGridSizeAllowed =
      gameId && player1Name && player2Name && !gameStarted;
    if (!isChangingGridSizeAllowed) {
      return;
    }
    const database = getDatabase();
    const gameGridSizeRef = ref(database, `fullGame/${gameId}/gameGridSize`);
    const squaresRef = ref(database, `fullGame/${gameId}/squares`);
    await set(gameGridSizeRef, newGameGridSize);
    await set(
      squaresRef,
      JSON.stringify(
        Array(gameGridSize)
          .fill("")
          .map(() => Array(gameGridSize).fill(""))
      )
    );
  }

  useEffect(() => {
    if (gameId) {
      const database = getDatabase();
      const username1Ref = ref(database, `fullGame/${gameId}/username1`);
      const username2Ref = ref(database, `fullGame/${gameId}/username2`);
      const gameGridSizeRef = ref(database, `fullGame/${gameId}/gameGridSize`);

      // Subscribe to changes in username1 and update player1Name
      onValue(username1Ref, (snapshot) => {
        const username1 = snapshot.val();
        setPlayer1Name(username1 || "");
      });

      // Subscribe to changes in username2 and update player2Name
      onValue(username2Ref, (snapshot) => {
        const username2 = snapshot.val();
        setPlayer2Name(username2 || "");
      });

      onValue(gameGridSizeRef, (snapshot) => {
        setGameGridSize(snapshot.val() || 3);
      });

      // Cleanup the subscription when the component is unmounted
      return () => {
        // Unsubscribe from the listeners
        off(username1Ref);
        off(username2Ref);
        off(gameGridSizeRef);
      };
    }
  }, [gameId]); // So, the useEffect will run both when the component initially mounts 
               //and whenever gameId changes its value during the component's lifecycle. 

  // function clearDb() {
  //   const database = getDatabase();
  //   set(ref(database, "/"), {});
  // }

  useOnMountUnsafe(() => {
    console.log("useEffect");
    const a = async () => {
      if (user) {
        const database = getDatabase();
        const freeGameRef = ref(database, "freeGame");

        // Get the list of game IDs from the freeGameRef
        const snapshot = await get(freeGameRef);
        const val = snapshot.val();
        console.log({ val });

        if (snapshot.exists() || gameId) {
          alert("you are user2");
          const gameIds = Object.keys(val); // Get an array of game IDs
          // const gameIds = [val]
          console.log({ gameIds });

          // Check if there are available game IDs
          if (gameIds.length > 0) {
            const selectedGameId = val[gameIds[0]]; // Choose the first game ID from the list
            setGameId(selectedGameId as string); // Update the gameId state

            // Join the selected fullGame using the chosen game ID
            const userRef2 = ref(
              database,
              `fullGame/${selectedGameId}/userid2`
            );
            const usernameRef2 = ref(
              database,
              `fullGame/${selectedGameId}/username2`
            );

            // Join the free lobby as userid2
            await set(userRef2, user.uid);
            await set(usernameRef2, name);

            // Remove the selected game ID from the list of free games
            await set(child(freeGameRef, gameIds[0] as string), null);
            setCurrentUser("O");
          }
        } else {
          // Create a new lobby and set the user as userid1
          const newGameId = uuid();
          let n = 3;

          // Perform a batch update
          const updates: any = {};
          updates[`fullGame/${newGameId}/userid1`] = user.uid;
          updates[`fullGame/${newGameId}/username1`] = name;
          updates[`fullGame/${newGameId}/xIsNext`] = true;
          updates[`fullGame/${newGameId}/fullGameId`] = newGameId;
          updates[`fullGame/${newGameId}/gameGridSize`] = 3;
          updates[`fullGame/${newGameId}/squares`] = JSON.stringify(
            Array(n)
              .fill("")
              .map(() => Array(n).fill(""))
          );

          await update(ref(database), updates);

          // Push a new freeGame
          const newFreeGameRef = push(freeGameRef);
          await set(newFreeGameRef, newGameId);

          setCurrentUser("X");
          setGameId(newGameId);
        }
      }
    };
    a();
  }); // Empty dependency array means this effect will run only once on mount
  // Actually, the above is not quite true. Check the file `src/useOnMountUnsafe.ts` for more info

  return (
    <>
      <h2>Play the game here</h2>
      <div>
        <label>Player 1: {player1Name}</label>
      </div>
      <div>
        <label>Player 2: {player2Name}</label>
      </div>
      {gameId ? (
        <Board
          gameGridSize={gameGridSize}
          gameId={gameId}
          onGameStarted={() => {
            console.log("CB CALLED");
            setGameStarted(true);
          }}
        />
      ) : (
        <p>Making / joining game.. please wait</p>
      )}

      {gameId && player1Name && player2Name && !gameStarted ? (
        <>
          <p>
            Currently the game grid is {gameGridSize} by {gameGridSize}
          </p>
          <p>You can change it if the game has not started yet.</p>
          <input
            type="number"
            placeholder="Enter game grid size: "
            onChange={(e) => {
              setNewGameGridSize(parseInt(e.target.value));
            }}
            value={newGameGridSize}
          />
          <button onClick={changeGridSize}>Change!</button>
        </>
      ) : (
        <></>
      )}

      {/* TODO: Remove this button and associated code after development is completed.
      <button
        onClick={() => {
          clearDb();
        }}
      >
        clear
      </button> */}
    </>
  );
};

export default GamePage;
