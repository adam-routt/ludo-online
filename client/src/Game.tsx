import React from 'react';

const Game: React.FC<{ lobbyCode: string | null }> = ({ lobbyCode }) => {
  return (
    <div style={{ flex: 1, padding: '20px' }}>
      {!lobbyCode ? (
        <h1>Waiting for game to start...</h1>
      ) : (
        <h1>Game started in lobby {lobbyCode}</h1>
      )}
    </div>
  );
};

export default Game;