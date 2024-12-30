import { ONLINE, OFFLINE, CHESS } from "../../settings/game";

const player1 = {
  user_id: "id213123",
  username: "leetun2k2",
  chess_rating: 1500,
  xiangqi_rating: 1600,
  chess_puzzle_rating: 1700,
  xiangqi_puzzle_rating: 1800,
  status: ONLINE,
  assetURL:
    "https://www.google.com/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F6%2F6f%2FChessSet.jpg%2F800px-ChessSet.jpg&tbnid=3EEHCGFhY1PYeM&vet=12ahUKEwj589exn4eEAxVioK8BHTcEB-IQMygAegQIARBJ..i&imgrefurl=https%3A%2F%2Fvi.wikipedia.org%2Fwiki%2FC%25E1%25BB%259D_vua&docid=MT-1l8dm1SWX6M&w=800&h=736&q=chess&ved=2ahUKEwj589exn4eEAxVioK8BHTcEB-IQMygAegQIARBJ",
};

const player2 = {
  user_id: "i1233123",
  username: "tung",
  chess_rating: 1400,
  xiangqi_rating: 1200,
  chess_puzzle_rating: 1600,
  xiangqi_puzzle_rating: 1800,
  status: OFFLINE,
  assetURL:
    "https://www.google.com/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F6%2F6f%2FChessSet.jpg%2F800px-ChessSet.jpg&tbnid=3EEHCGFhY1PYeM&vet=12ahUKEwj589exn4eEAxVioK8BHTcEB-IQMygAegQIARBJ..i&imgrefurl=https%3A%2F%2Fvi.wikipedia.org%2Fwiki%2FC%25E1%25BB%259D_vua&docid=MT-1l8dm1SWX6M&w=800&h=736&q=chess&ved=2ahUKEwj589exn4eEAxVioK8BHTcEB-IQMygAegQIARBJ",
};

const gameSettings = {
  time: 5 * 60,
  bonus: 6,
};

export const game = {
  gameId: "12124124",
  variant: CHESS,
  player1: player1,
  player2: player2,
  settings: gameSettings,
};
