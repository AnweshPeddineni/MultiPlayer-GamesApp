import { getAuth, signInAnonymously } from "firebase/auth";
import firebaseApp from "../FirebaseConfig.ts";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";


const Authentication = () => {

  const navigate = useNavigate();
  const handleSignInAnonymously = () => {
    const auth = getAuth(firebaseApp);

    // Get the name value from the input field
    const nameInput = document.getElementById("name");
    const nameErrorElement = document.getElementById("name-error");

    const username = (nameInput as HTMLInputElement)?.value;
    let errormessage = (nameErrorElement as HTMLInputElement)?.value;
    if (nameErrorElement instanceof HTMLLabelElement) {
      if (username.length < 4) {
        errormessage = "Name must be at least 4 characters long!";
        nameErrorElement.textContent = errormessage;
      } else {
        errormessage = "";
      }
      
    }

    if(errormessage === ""){
      signInAnonymously(auth)
      .then((userCredential) => {
        // Sign-in successful
        const user = userCredential.user;
        console.log("Signed in anonymously:", user);

        // Store the username and anonymous user ID in the RT database
        const database = getDatabase();
        const userRef = ref(database, 'game1/userid1');
        const usernameRef = ref(database, 'game1/username1');

        // Update the database with the username and anonymous user ID
        set(userRef, user.uid);
        set(usernameRef, username);
        
        navigate("/");
        // Redirect the user to the desired page (Game.tsx)
      })
      .catch((error) => {
        // Sign-in unsuccessful
        console.error("Error signing in anonymously:", error);
        // Display an error message to the user
      });
    }
    
  };

  return (
    <div>
     <div>
      <label>Name:</label>
      <input type="text" id="name"/>
      <label id="name-error"></label>
    </div>
      <button onClick={handleSignInAnonymously}>Sign In Anonymously</button>
    </div>
  );
};

export default Authentication;