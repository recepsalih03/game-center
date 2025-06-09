import { v4 as uuidv4 } from "uuid";

export interface Lobby {
  id: string;
  name: string;
  gameId: number;
  players: number;
  maxPlayers: number;
  playerUsernames: string[];
  status: "open" | "full" | "in-progress";
  createdAt: Date;
}

export interface Game {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  howToPlaySteps: string[];
  gameComponent: string;
}

export const games: Game[] = [
  { 
    id: 1, 
    title: "Tombala", 
    imageUrl: "/tombala.jpg",
    description: "Klasik tombala oyunu. Kartınızdaki tüm sayıları ilk siz tamamlayın ve kazanın!",
    howToPlaySteps: [
      "Her oyuncu bir veya daha fazla kart alır.",
      "Sayılar çekilir ve oyuncular kartlarındaki sayıları işaretler.",
      "Bir sırayı tamamlayan 'Çinko', tüm kartı tamamlayan 'Tombala' yapar.",
      "Tombala yapan oyuncu oyunu kazanır.",
    ],
    gameComponent: "TombalaBoard"
  },
];

export const lobbies: Lobby[] = [];

export function createLobby(
  name: string,
  gameId: number,
  maxPlayers: number,
  creatorUsername: string,
): Lobby {
  const newLobby: Lobby = {
    id: uuidv4(),
    name,
    gameId,
    players: 1,
    maxPlayers,
    playerUsernames: [creatorUsername],
    status: maxPlayers === 1 ? "full" : "open",
    createdAt: new Date(),
  };
  lobbies.push(newLobby);
  return newLobby;
}