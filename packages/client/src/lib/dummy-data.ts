export interface Game {
  id: number;
  title: string;
  imageUrl: string;
  players: number;
  category: string;
  rating: number;
}

export interface Lobby {
  id: number;
  name: string;
  players: number;
  maxPlayers: number;
  game: string;
  status: "open" | "full" | "in-progress";
}

export interface GameHistoryItem {
  id: number;
  date: string;
  result: string;
  duration: string;
}

export const games: Game[] = [
  { id: 1, title: "Epic Adventure", imageUrl: "/placeholder.svg?height=150&width=280", players: 1243, category: "RPG", rating: 4.8 },
  { id: 2, title: "Space Explorers", imageUrl: "/placeholder.svg?height=150&width=280", players: 876, category: "Strategy", rating: 4.5 },
  { id: 3, title: "Racing Champions", imageUrl: "/placeholder.svg?height=150&width=280", players: 2341, category: "Racing", rating: 4.2 },
  { id: 4, title: "Battle Royale", imageUrl: "/placeholder.svg?height=150&width=280", players: 5432, category: "Action", rating: 4.7 },
  { id: 5, title: "Puzzle Master", imageUrl: "/placeholder.svg?height=150&width=280", players: 654, category: "Puzzle", rating: 4.3 },
  { id: 6, title: "Fantasy World", imageUrl: "/placeholder.svg?height=150&width=280", players: 1876, category: "MMORPG", rating: 4.6 },
];

export const lobbies: Lobby[] = [
  { id: 1, name: "Pro Players Only", players: 3, maxPlayers: 4,  game: "Epic Adventure",  status: "open" },
  { id: 2, name: "Casual Fun",      players: 2, maxPlayers: 6,  game: "Space Explorers", status: "open" },
  { id: 3, name: "Tournament",       players: 8, maxPlayers: 8,  game: "Battle Royale",   status: "full" },
  { id: 4, name: "Beginners",        players: 3, maxPlayers: 5,  game: "Racing Champions", status: "open" },
];

export const histories: { [gameId: number]: GameHistoryItem[] } = {
  1: [
    { id: 1, date: "2025-05-30", result: "Win", duration: "25m" },
    { id: 2, date: "2025-05-29", result: "Lose", duration: "18m" },
  ],
  2: [
    { id: 3, date: "2025-05-31", result: "Win", duration: "30m" },
    { id: 4, date: "2025-05-30", result: "Win", duration: "22m" },
  ],
};