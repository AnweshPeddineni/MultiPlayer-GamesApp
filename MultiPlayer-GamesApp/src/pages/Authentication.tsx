import { getAuth, signInAnonymously } from "firebase/auth";
import firebaseApp from "../FirebaseConfig.ts";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set, get } from "firebase/database";
import { ChangeEvent, useState } from "react";
import { useCurrentUser } from "../components/CurrentUserProvider.tsx";

const Authentication = () => {
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { setCurrentUser } = useCurrentUser();

  const navigate = useNavigate();

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setErrorMessage("");
  };

  const handleSignInAnonymously = () => {
    if (name.length < 4) {
      setErrorMessage("Name must be at least 4 characters long.");
      return;
    }

    const auth = getAuth(firebaseApp);
    signInAnonymously(auth)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Signed in anonymously:", user);

        const database = getDatabase();
        const userRef = ref(database, "game1/userid1");
        const usernameRef = ref(database, "game1/username1");


        // Check if the userRef exists
        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {

            // If userRef exists, get the current uid1 from database
            const uid1 = snapshot.val();

            // check if newly generated uid2 is different from uid1
            if(user.uid !== uid1){
               // If userRef exists and uid1 !== uid2 set userid2
            const userRef2 = ref(database, "game1/userid2");
            const usernameRef2 = ref(database, "game1/username2");


            set(userRef2, user.uid);
            set(usernameRef2, name);
            setCurrentUser("O");
            }
          } else {
            // If userRef does not exist, set userid1 and username1
            set(userRef, user.uid);
            set(usernameRef, name);
            setCurrentUser("X");
          }

          navigate("/");
        });
      })
      .catch((error) => {
        console.error("Error signing in anonymously:", error);
      });
  };

  return (
    <div>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={handleNameChange} />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
      <button onClick={handleSignInAnonymously}>Sign In Anonymously</button>
    </div>
  );
};

export default Authentication;
