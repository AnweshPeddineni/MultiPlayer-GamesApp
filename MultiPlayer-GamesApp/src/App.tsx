
import Authentication from "./pages/Authentication";
import GamePage from "./pages/GamePage";


import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <h1>Start Playign Tic-Tac-Toe</h1>
      <div>
        <Routes>
          <Route path="/auth" element={<Authentication />} />
          <Route path="/" element={<GamePage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
