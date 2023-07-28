
import Authentication from "./pages/Authentication";
import { CurrentUserProvider } from "./components/CurrentUserProvider";
import GamePage from "./pages/GamePage";


import { Routes, Route } from "react-router-dom";
function App() {
  return ( 
    <CurrentUserProvider>
      <h1>Start Playign Tic-Tac-Toe</h1>
      <div>
        <Routes>
          <Route path="/auth" element={<Authentication />} />
          <Route path="/" element={<GamePage />} />
        </Routes>
      </div>
      </CurrentUserProvider>
  );
}

export default App;
