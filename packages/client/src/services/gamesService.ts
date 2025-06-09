import api from '../api/axios';

export interface Game {
  id: number;
  title: string;
  imageUrl: string;
  players: number;
  category: string;
  rating: number;
  howToPlaySteps: string[];
  gameComponent: string;
}

export const getGames = async (): Promise<Game[]> => {
  const response = await api.get('/games');
  return response.data;
};

export const getGameById = async (id: string): Promise<Game> => {
  const response = await api.get(`/games/${id}`);
  return response.data;
};