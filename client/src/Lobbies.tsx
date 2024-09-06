import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const Lobbies: React.FC<{ onJoinLobby: (lobbyCode: string) => void }> = ({ onJoinLobby }) => {
  const [lobbies, setLobbies] = useState<any[]>([]);
  const [searchCode, setSearchCode] = useState<string>('');
  const [newLobby, setNewLobby] = useState({ name: '', username: '', isPublic: true });
  const socket = socketIOClient('http://localhost:4000');

  const refreshLobbies = () => {
    socket.emit('getPublicLobbies', (publicLobbies: any[]) => {
      setLobbies(publicLobbies);
    });
  };

  useEffect(() => {
    refreshLobbies();
    socket.on('lobbyUpdated', refreshLobbies);
  }, []);

  const joinLobby = (lobbyCode: string) => {
    const username = prompt('Enter your username (max 16 characters):');
    if (username && username.length <= 16) {
      socket.emit('joinLobby', { lobbyCode, username }, (lobby: any) => {
        if (lobby) {
          onJoinLobby(lobbyCode);
        }
      });
    }
  };

  const createLobby = () => {
    const { name, username, isPublic } = newLobby;
    if (name && username) {
      socket.emit('createLobby', { lobbyName: name, username, isPublic }, (lobbyCode: string) => {
        onJoinLobby(lobbyCode);
      });
    }
  };

  return (
    <div style={{ width: '300px', borderLeft: '1px solid black' }}>
      <div>
        <input
          type="text"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          placeholder="Enter lobby code"
        />
        <button onClick={refreshLobbies}>Refresh</button>
      </div>
      <div style={{ overflowY: 'scroll', maxHeight: '400px' }}>
        {lobbies.map((lobby, index) => (
          <div key={index}>
            <p>{lobby.lobbyName} ({lobby.lobbyCode}) - {lobby.users.length} users</p>
            <button onClick={() => joinLobby(lobby.lobbyCode)}>Join Lobby</button>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="Lobby Name"
          value={newLobby.name}
          onChange={(e) => setNewLobby({ ...newLobby, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Username"
          value={newLobby.username}
          onChange={(e) => setNewLobby({ ...newLobby, username: e.target.value })}
        />
        <label>
          Public:
          <input
            type="checkbox"
            checked={newLobby.isPublic}
            onChange={(e) => setNewLobby({ ...newLobby, isPublic: e.target.checked })}
          />
        </label>
        <button onClick={createLobby}>Create Lobby</button>
      </div>
    </div>
  );
};

export default Lobbies;