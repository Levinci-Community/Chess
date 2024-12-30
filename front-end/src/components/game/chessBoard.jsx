import {
  Button,
  Center,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Chessground from "@react-chess/chessground";
import { Chess } from "chess.js";
import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";
import { Fragment, useCallback, useEffect, useState } from "react";
import BBISHOP from "../../assets/images/chess/piece/bB.svg";
import BKNIGHT from "../../assets/images/chess/piece/bN.svg";
import BQUEEN from "../../assets/images/chess/piece/bQ.svg";
import BROOK from "../../assets/images/chess/piece/bR.svg";
import WBISHOP from "../../assets/images/chess/piece/wB.svg";
import WKNIGHT from "../../assets/images/chess/piece/wN.svg";
import WQUEEN from "../../assets/images/chess/piece/wQ.svg";
import WROOK from "../../assets/images/chess/piece/wR.svg";
import { getUserData } from "../../lib/auth";
import { toast_error } from "../../lib/hooks/toast";
import socket from "../../lib/socket";
import { CHESS_FEN } from "../../settings/game";

export default function ChessBoard({
  game,
  setGameStatus,
  toggleBaseTurn,
  isViewer,
}) {
  const user = getUserData() ?? { id: "" };
  const toast = useToast();
  const [chess, setChess] = useState(new Chess(CHESS_FEN));
  const [fen, setFen] = useState("");
  const [lastMove, setLastMove] = useState([]);
  const [isMovable] = useState(false);
  const [turn, setTurn] = useState("white");
  const [orientation, setOrientation] = useState("white");
  const [isCheck, setIsCheck] = useState(false);
  const [isGameOver] = useState(false);
  const [pendingMove, setPendingMove] = useState(null);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const toggleTurn = useCallback(() => {
    setTurn(turn === "white" ? "black" : "white");
    toggleBaseTurn();
  }, [toggleBaseTurn, turn]);

  useEffect(() => {
    setOrientation(user.id === game.black ? "black" : "white");
  }, [game, user.id]);

  useEffect(() => {
    if (!game || !game.fen) return;

    setFen(game.fen);
    setChess(new Chess(game.fen));

    const turn = game.fen.includes("w") ? "white" : "black";
    setTurn(turn);
  }, [game]);

  const findMovableDests = (square) => {
    const moves = chess.moves({ square: square, verbose: true });
    moves.forEach((move) => {
      if (config.movable.dests.has(square)) {
        config.movable.dests.get(square).push(move.to);
      } else {
        config.movable.dests.set(square, [move.to]);
      }
    });
  };

  const isValidMove = (orig, dest) => {
    const moves = chess.moves({ square: orig, verbose: true });
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].to === dest) {
        return true;
      }
    }
    return false;
  };

  const handleSendMove = (from, to, promotion) => {
    const nextState = new Chess(chess.fen());
    nextState.move({ from, to, promotion });
    socket.emit("send_move", {
      game_id: game._id,
      move: { from, to, promotion },
      fen: nextState.fen(),
      blackTime: 0,
      whiteTime: 0,
    });
    console.log("send_move");
  };

  const config = {
    fen: fen,
    orientation: orientation,
    turnColor: turn,
    lastMove: lastMove,
    check: isCheck,
    autoCastle: true,
    viewOnly: isGameOver,
    highlight: {
      lastMove: true,
      check: true,
      custom: [],
    },
    animation: {
      enabled: true,
      duration: 0.5,
    },
    movable: {
      free: isMovable,
      color: turn,
      dests: new Map(),
      events: {
        after: () => {},
        afterNewPiece: () => {},
      },
      rookCastle: true,
    },
    events: {
      change: () => {},
      move: (from, to) => {
        if (isViewer) {
          return;
        }
        // Promotion move
        const moves = chess.moves({ verbose: true });
        for (let i = 0, len = moves.length; i < len; i++) {
          if (moves[i].flags.indexOf("p") !== -1 && moves[i].from === from) {
            setPendingMove({ from, to });
            onOpen();
            return;
          }
        }
        if (!isValidMove(from, to)) {
          console.log("Invalid move.");
          return;
        }

        handleSendMove(from, to, null);
      },
      dropNewPiece: () => {},
      select: (key) => {
        if (turn === orientation) {
          config.selected = key;
          findMovableDests(key);
        }
      },
      insert: () => {
        const board = chess.board();
        board.forEach((row) => {
          row.forEach((piece) => {
            if (piece) {
              findMovableDests(piece.square);
            }
          });
        });
      },
    },
    drawable: {
      enabled: true,
      visible: true,
    },
  };

  useEffect(() => {
    const handleReceiveMove = (data) => {
      (() => {
        if (data && data.game_id === game._id) {
          const { from, to, promotion } = data.move;
          try {
            chess.move({ from, to, promotion });
          } catch {
            toast(toast_error("Invalid Move"));
          }
          toggleTurn();
          setFen(chess.fen());
          setIsCheck(chess.inCheck());
          setLastMove([from, to]);

          if (chess.isCheckmate()) {
            const winner_id = game.fen.includes("b") ? game.white : game.black;
            socket.emit("checkmate", { game_id: game._id, winner_id });
            setGameStatus("ended");
          }
        }
      })();
    };

    socket.connect();
    socket.on("receive_move", handleReceiveMove);

    return () => {
      socket.off("receive_move", handleReceiveMove);
      if (socket.readyState === 1) {
        socket.disconnect();
      }
    };
  }, [
    game,
    chess,
    toggleTurn,
    setFen,
    setIsCheck,
    setLastMove,
    setGameStatus,
    toast,
  ]);

  return (
    <Fragment>
      {/* Promotion modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Center>
              <Button
                onClick={() => {
                  handleSendMove(pendingMove.from, pendingMove.to, "q");
                  setTimeout(onClose, 100);
                }}
                mr={2}
                w={100}
                h={100}
              >
                <Image
                  src={turn === "w" ? WQUEEN : BQUEEN}
                  alt="QUEEN"
                  w={"100%"}
                  h={"100%"}
                />
              </Button>
              <Button
                onClick={() => {
                  handleSendMove(pendingMove.from, pendingMove.to, "r");
                  setTimeout(onClose, 100);
                }}
                mr={2}
                w={100}
                h={100}
              >
                <Image
                  src={turn === "w" ? WROOK : BROOK}
                  alt="ROOK"
                  w={"100%"}
                  h={"100%"}
                />
              </Button>
              <Button
                onClick={() => {
                  handleSendMove(pendingMove.from, pendingMove.to, "b");
                  setTimeout(onClose, 100);
                }}
                mr={2}
                w={100}
                h={100}
              >
                <Image
                  src={turn === "w" ? WBISHOP : BBISHOP}
                  alt="BISHOP"
                  w={"100%"}
                  h={"100%"}
                />
              </Button>
              <Button
                onClick={() => {
                  handleSendMove(pendingMove.from, pendingMove.to, "n");
                  setTimeout(onClose, 100);
                }}
                mr={2}
                w={100}
                h={100}
              >
                <Image
                  src={turn === "w" ? WKNIGHT : BKNIGHT}
                  alt="KNIGHT"
                  w={"100%"}
                  h={"100%"}
                />
              </Button>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* Chess board md */}
      <Flex
        display={{ base: "none", sm: "none", md: "none", lg: "flex" }}
        mb={4}
      >
        <Chessground width={600} height={600} config={config} />
      </Flex>

      {/* Chess board md */}
      <Flex
        display={{ base: "none", sm: "none", md: "flex", lg: "none" }}
        mb={4}
      >
        <Chessground width={500} height={500} config={config} />
      </Flex>

      {/* Chess board sm */}
      <Flex
        display={{ base: "none", sm: "flex", md: "none", lg: "none" }}
        mb={4}
      >
        <Chessground width={400} height={400} config={config} />
      </Flex>

      {/* Chess board base */}
      <Flex
        display={{ base: "flex", sm: "none", md: "none", lg: "none" }}
        mb={4}
      >
        <Chessground width={300} height={300} config={config} />
      </Flex>
    </Fragment>
  );
}
