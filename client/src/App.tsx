/*import React, { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [backendData, setBackendData] = useState({users: []})

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, [])
  return (
    <div>
      {(typeof backendData.users === 'undefined') ? (
        <p>Loading...</p>
      ): (
        backendData.users.map((user, i) => (
          <p key={i}>{user}</p>
        ))
      )}
    </div>
  );
}

export default App;
*/
import React, { useState } from 'react';
import Lobbies from './Lobbies';
import Game from './Game';

const App: React.FC = () => {
  const [lobbyCode, setLobbyCode] = useState<string | null>(null);

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh' }}>
      <Lobbies onJoinLobby={setLobbyCode} />
      <Game lobbyCode={lobbyCode} />
    </div>
  );
};

export default App;