import { useState, useEffect } from "react";
import { getDatabase, ref, off, onValue } from "firebase/database";
import Board from "../components/Board";

const GamePage = () => {
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");

  useEffect(() => {
    const database = getDatabase();
    const username1Ref = ref(database, "game1/username1");
    const username2Ref = ref(database, "game1/username2");

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

    // Cleanup the subscription when the component is unmounted
    return () => {
      // Unsubscribe from the listeners
      off(username1Ref);
      off(username2Ref);
    };
  }, []); // Empty dependency array means this effect will run only once on mount

  return (
    <>
      <h2>Play the game here</h2>
      <div>
        <label>Player 1: {player1Name}</label>
      </div>
      <div>
        <label>Player 2: {player2Name}</label>
      </div>
      <Board />
    </>
  );
};

export default GamePage;
