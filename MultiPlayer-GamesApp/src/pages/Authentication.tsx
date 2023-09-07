import { getAuth, signInAnonymously } from "firebase/auth";
import firebaseApp from "../FirebaseConfig.ts";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";


const Authentication = () => {
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
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

        navigate("/", { state: { name: name } });

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
