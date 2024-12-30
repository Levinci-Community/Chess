import { CHESS_FEN } from "../../settings/game";
import { Chess } from "chess.js";

const chess = new Chess(CHESS_FEN);

const findMovableDests = (square) => {
  const moves = chess.moves({ square: square, verbose: true });
  moves.forEach((move) => {
    if (!config.movable.dests.has(square)) {
      config.movable.dests.set(square, [move.to]);
    } else {
      config.movable.dests.get(square).push(move.to);
    }
  });
};

const validateMove = (orig, dest) => {
  const moves = chess.moves({ squar: orig, verbose: true });
  for (let i = 0; i < moves.length; i++) {
    if (moves[i].to === dest) {
      return true;
    }
  }
  return false;
};

const config = {
  fen: CHESS_FEN, // chess position in Forsyth notation
  orientation: "white", // board orientation. white | black
  turnColor: "white", // turn to play. white | black
  check: false, // true for current color, false to unset
  lastMove: [], // squares part of the last move ["c3", "c4"]
  selected: null, // square currently selected "a1"
  coordinates: true, // include coords attributes
  autoCastle: true, // immediately complete the castle by moving the rook after king move
  viewOnly: false, // don't bind events: the user will never be able to move pieces around
  disableContextMenu: true, // because who needs a context menu on a chessboard
  addPieceZIndex: false, // adds z-index values to pieces (for 3D)
  addDimensionsCssVarsTo: null, // add --cg-width and --cg-height CSS vars containing the board's dimensions to this element
  blockTouchScroll: true, // block scrolling via touch dragging on the board, e.g. for coordinate training
  pieceKey: true, // add a data-key attribute to piece elements
  trustAllEvents: false, // disable checking for human only input (e.isTrusted)
  highlight: {
    lastMove: true, // add last-move class to squares
    check: true, // add check class to squares
    custom: [], // array of custom highlighted squares
  },
  animation: {
    enabled: true,
    duration: 0.5,
  },
  movable: {
    free: false, // all moves are valid - board editor
    color: "both", // color that can move. white | black | both | undefined
    dests: new Map(), // valid moves. {"e2" ["e4" "e3"] "e7" ["e5" "e6"]
    showDests: true, // whether to add the move-dest class on squares
    events: {
      after: (orig, dest, metadata) => {}, // called after the move has been played
      afterNewPiece: (role, key, metadata) => {}, // called after a new piece is dropped on the board
    },
    rookCastle: true, // castle by moving the king to the rook
  },
  premovable: {
    enabled: true, // allow premoves for color that can not move
    showDests: true, // whether to add the premove-dest class on squares
    castle: true, // whether to allow king castle premoves
    dests: [], // premove destinations for the current selection
    customDests: new Map(), // use custom valid premoves. {"a2" ["a3" "a4"] "b1" ["a3" "c3"]}
    events: {
      set: (orig, dest, metadata) => {}, // called after the premove has been set
      unset: () => {}, // called after the premove has been unset
    },
  },
  predroppable: {
    enabled: true, // allow predrops for color that can not move
    events: {
      set: (role, key) => {}, // called after the predrop has been set
      unset: () => {}, // called after the predrop has been unset
    },
  },
  draggable: {
    enabled: true, // allow moves & premoves to use drag'n drop
    distance: 0, // minimum distance to initiate a drag; in pixels
    autoDistance: true, // lets chessground set distance to zero when user drags pieces
    showGhost: true, // show ghost of piece being dragged
    deleteOnDropOff: true, // delete a piece when it is dropped off the board
  },
  selectable: {
    enabled: true, // disable to enforce dragging over click-click move
  },
  events: {
    change: () => {}, // called after the position changes
    move: (orig, dest, capturedPiece) => {
      // No logic for free mode
      if (config.movable.free) {
        return;
      }

      // validate move
      if (!validateMove(orig, dest)) {
        console.log("Invalid move");
        return;
      }

      // Make move
      chess.move({ from: orig, to: dest });

      // Update board status
      config.fen = chess.fen();

      // Update turn
      const nextTurn = chess.turn() === "w" ? "white" : "black";
      config.turnColor = nextTurn;
      config.movable.color = nextTurn;

      // Update check
      config.check = chess.inCheck();

      // Update last move
      config.lastMove = [orig, dest];

      // Update game over
      config.viewOnly = chess.isGameOver();

      // Debug
      console.log(chess);
      console.log(config);
    }, // called after the move has been played
    dropNewPiece: (piece, key) => {
      // console.log("dropNewPiece", piece, key);
    }, // called after a piece has been dropped on the board
    select: (key) => {
      config.selected = key;
      findMovableDests(key);
    }, // called when a square is selected
    insert: (elements) => {
      const board = chess.board();
      board.forEach((row) => {
        row.forEach((piece) => {
          if (piece) {
            findMovableDests(piece.square);
          }
        });
      });
    }, // Call when initial or insert piece
  },
  drawable: {
    enabled: true, // can draw
    visible: true, // can view
    defaultSnapToValidMove: true,
    // false to keep the drawing if a movable piece is clicked.
    // Clicking an empty square or immovable piece will clear the drawing regardless.
    eraseOnClick: true,
    shapes: [],
    autoShapes: [],
    brushes: {},
    onChange: (shapes) => {}, // called after drawable shapes change
  },
};

export { config, chess };
