import { initializeApp } from "firebase/app";


const FirebaseConfig = {
    apiKey: "AIzaSyAp62IfdS-kxrzRpvU0ZjqJaYFLNN4Mk2Q",
    authDomain: "game-app-ae486.firebaseapp.com",
    databaseURL: "https://game-app-ae486-default-rtdb.firebaseio.com",
    projectId: "game-app-ae486",
    storageBucket: "game-app-ae486.appspot.com",
    messagingSenderId: "779615861127",
    appId: "1:779615861127:web:4e5af165d513408e0bbb22"
};

const firebaseApp = initializeApp(FirebaseConfig);

export default firebaseApp;
