import { Server, Socket } from "socket.io";
import { lobbies } from "../data/inMemoryStore";

interface TombalaGameState {
  drawnNumbers: Set<number>;
  players: string[];
  cinko1: string | null;
  cinko2: string | null;
  tombala: string | null;
}
interface Cell { value: number | null; }

const activeTombalaGames = new Map<string, TombalaGameState>();

export function handleTombalaEvents(io: Server, socket: Socket) {
  
  const startGame = (lobbyId: string) => {
    if (activeTombalaGames.has(lobbyId)) return;
    const lobby = lobbies.find(l => l.id === lobbyId);
    if (!lobby) return;

    lobby.status = 'in-progress';
    io.emit('lobby_updated', lobby);

    const newGameState: TombalaGameState = {
      drawnNumbers: new Set(),
      players: lobby.playerUsernames,
      cinko1: null,
      cinko2: null,
      tombala: null,
    };
    activeTombalaGames.set(lobbyId, newGameState);
    io.to(lobbyId).emit('navigate_to_game', { gameId: lobby.gameId, lobbyId: lobby.id });
    io.to(lobbyId).emit('game_state_update', newGameState);
  };

  const drawNumber = ({ lobbyId, number }: { lobbyId: string, number: number }) => {
    const gameState = activeTombalaGames.get(lobbyId);
    if (gameState) {
      gameState.drawnNumbers.add(number);
      io.to(lobbyId).emit('tombala_number_drawn', { lobbyId, number });
    }
  };

  const claimWin = ({ lobbyId, username, claimType, board }: { lobbyId: string, username: string, claimType: 'cinko1' | 'cinko2' | 'tombala', board: Cell[][] }) => {
    const gameState = activeTombalaGames.get(lobbyId);
    if (!gameState) return;
    
    let isClaimAllowed = true;
    if (claimType === 'cinko1' && gameState.cinko1) isClaimAllowed = false;
    if (claimType === 'cinko2' && (gameState.cinko2 || !gameState.cinko1)) isClaimAllowed = false;
    if (claimType === 'tombala' && (gameState.tombala || !gameState.cinko2)) isClaimAllowed = false;
    if (!isClaimAllowed) return;

    let isWinValid = false;
    const drawnNumbers = gameState.drawnNumbers;
    if (claimType === 'tombala') {
      const allNumbersOnBoard = board.flat().filter(c => c.value !== null).map(c => c.value);
      isWinValid = allNumbersOnBoard.every(num => num !== null && drawnNumbers.has(num));
    } else {
      let completedRows = 0;
      for (const row of board) {
        const numbersInRow = row.filter(c => c.value !== null).map(c => c.value);
        if (numbersInRow.length === 5 && numbersInRow.every(num => num !== null && drawnNumbers.has(num))) {
          completedRows++;
        }
      }
      if (claimType === 'cinko1' && completedRows >= 1) isWinValid = true;
      if (claimType === 'cinko2' && completedRows >= 2) isWinValid = true;
    }

    if (isWinValid) {
      (gameState as any)[claimType] = username;
      io.to(lobbyId).emit('win_verified', { winnerUsername: username, claimType });
      io.to(lobbyId).emit('game_state_update', gameState);
      
      if (claimType === 'tombala') {
        io.to(lobbyId).emit('game_over', { winnerUsername: username });
        activeTombalaGames.delete(lobbyId);
        const lobbyIndex = lobbies.findIndex(l => l.id === lobbyId);
        if (lobbyIndex > -1) {
          lobbies.splice(lobbyIndex, 1);
          io.emit('lobby_deleted', { id: lobbyId });
        }
      }
    }
  };

  socket.on('start_game', startGame);
  socket.on('tombala_number_drawn', drawNumber);
  socket.on('claim_win', claimWin);
}