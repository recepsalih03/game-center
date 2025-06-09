import api from '../api/axios';

export interface Game {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
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