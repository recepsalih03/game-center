import { v4 as uuidv4 } from "uuid";

export interface Lobby {
  id: string;
  name: string;
  gameId: number;
  players: number;
  maxPlayers: number;
  status: "open" | "full" | "in-progress";
  createdAt: Date;
}

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

export const games: Game[] = [
  { 
    id: 1, 
    title: "Tombala", 
    imageUrl: "https://via.placeholder.com/280x150.png/007BFF/FFFFFF?Text=Tombala", 
    players: 0, 
    category: "Board Game", 
    rating: 4.5,
    howToPlaySteps: [
      "Her oyuncu bir veya daha fazla kart alır.",
      "Sayılar çekilir ve oyuncular kartlarındaki sayıları işaretler.",
      "Bir sırayı tamamlayan 'Çinko', tüm kartı tamamlayan 'Tombala' yapar."
    ],
    gameComponent: "TombalaBoard"
  },
];

export const lobbies: Lobby[] = [];

export function createLobby(
  name: string,
  gameId: number,
  maxPlayers: number
): Lobby {
  const newLobby: Lobby = {
    id: uuidv4(),
    name,
    gameId,
    players: 0,
    maxPlayers,
    status: "open",
    createdAt: new Date(),
  };
  lobbies.push(newLobby);
  return newLobby;
}