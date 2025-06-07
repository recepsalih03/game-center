import api from '../api/axios';

export interface Lobby {
  id: string;
  name: string;
  gameId: number;
  players: number;
  maxPlayers: number;
  status: "open" | "full" | "in-progress";
}

export const getLobbiesByGameId = async (gameId: string): Promise<Lobby[]> => {
  const response = await api.get(`/lobbies?gameId=${gameId}`);
  return response.data;
};

export const createLobby = async (name: string, gameId: number, maxPlayers: number): Promise<Lobby> => {
  const response = await api.post('/lobbies', { name, gameId, maxPlayers });
  return response.data;
};