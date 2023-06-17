import "react-router-dom";

import './App.css';
import DisplayPlayers from './components/DisplayPlayers';
import AddTournament from './components/AddTournament';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { useRef } from "react";

function App() {
  const leaderboardRef = useRef(null);

  return (
    <div className="App">
      <BrowserRouter>
      <Header leaderboardRef={leaderboardRef} />
    
        <Routes>
          <Route path="/" element={<DisplayPlayers ref={leaderboardRef} />} />
          <Route path="/add" element={<AddTournament />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
