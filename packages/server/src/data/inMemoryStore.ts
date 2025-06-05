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
}

export const games: Game[] = [
  { id: 1, title: "Epic Adventure", imageUrl: "/placeholder.svg", players: 1243, category: "RPG", rating: 4.8 },
  { id: 2, title: "Space Explorers", imageUrl: "/placeholder.svg", players: 876, category: "Strategy", rating: 4.5 },
  { id: 3, title: "Racing Champions", imageUrl: "/placeholder.svg", players: 2341, category: "Racing", rating: 4.2 },
  { id: 4, title: "Battle Royale", imageUrl: "/placeholder.svg", players: 5432, category: "Action", rating: 4.7 },
  { id: 5, title: "Puzzle Master", imageUrl: "/placeholder.svg", players: 654, category: "Puzzle", rating: 4.3 },
  { id: 6, title: "Fantasy World", imageUrl: "/placeholder.svg", players: 1876, category: "MMORPG", rating: 4.6 },
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