export const VARIANTS = {
  chess: {
    name: "chess",
    description: "Chess, unmodified, as it's played by FIDE standards.",
    startFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    icon: "M",
    boardFamily: "standard8x8",
    pieceFamily: "standard",
    pieceRow: ["k", "q", "r", "b", "n", "p"],
    colors: { first: "White", second: "Black" },
  },
  xiangqi: {
    name: "xiangqi",
    description:
      "Chinese Chess, one of the oldest and most played board games in the world.",
    startFen:
      "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1",
    icon: "|",
    boardFamily: "xiangqi9x10",
    pieceFamily: "xiangqi",
    pieceRow: ["k", "a", "c", "r", "b", "n", "p"],
    colors: { first: "Red", second: "Black" },
  },
};
