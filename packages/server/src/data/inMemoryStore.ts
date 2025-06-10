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
  lobbyType: 'normal' | 'event';
  password?: string;
  eventStartsAt?: Date;
  eventEndsAt?: Date;
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
      "Bir sırayı tamamlayan 'Çinko', tüm kartı tamamlayan 'Tombala' yapar."
    ],
    gameComponent: "TombalaBoard"
  },
];

export const lobbies: Lobby[] = [];

export function createLobby(
  data: Omit<Lobby, 'id' | 'players' | 'playerUsernames' | 'status' | 'createdAt'>,
  creatorUsername: string,
): Lobby {
  const newLobby: Lobby = {
    id: uuidv4(),
    name: data.name,
    gameId: data.gameId,
    maxPlayers: data.maxPlayers,
    players: 1,
    playerUsernames: [creatorUsername],
    status: data.maxPlayers === 1 ? "full" : "open",
    createdAt: new Date(),
    lobbyType: data.lobbyType,
    password: data.password,
    eventStartsAt: data.eventStartsAt,
    eventEndsAt: data.eventEndsAt,
  };
  lobbies.push(newLobby);
  return newLobby;
}