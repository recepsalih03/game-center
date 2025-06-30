import api from '../api/axios';

export interface Lobby {
  id: string;
  name: string;
  gameId: number;
  players: number;
  maxPlayers: number;
  playerUsernames: string[];
  status: "open" | "full" | "in-progress";
  lobbyType: 'normal' | 'event';
  password?: string;
  eventStartsAt?: Date;
  eventEndsAt?: Date;
  createdAt: Date;
}

export const getAllLobbies = async (): Promise<Lobby[]> => {
  const response = await api.get('/lobbies');
  return response.data;
}

export const getLobbiesByGameId = async (gameId: string): Promise<Lobby[]> => {
  const response = await api.get(`/lobbies?gameId=${gameId}`);
  return response.data;
};

export const createLobby = async (data: Partial<Lobby>): Promise<Lobby> => {
  const response = await api.post('/lobbies', data);
  return response.data;
};

export const joinLobby = async (lobbyId: string, password?: string): Promise<Lobby> => {
  const response = await api.put(`/lobbies/${lobbyId}/join`, { password });
  return response.data;
}

export const leaveLobby = async (lobbyId: string): Promise<Lobby> => {
  const response = await api.put(`/lobbies/${lobbyId}/leave`);
  return response.data;
}