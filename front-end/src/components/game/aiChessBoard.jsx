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
import { useTranslation } from "react-i18next";
import BBISHOP from "../../assets/images/chess/piece/bB.svg";
import BKNIGHT from "../../assets/images/chess/piece/bN.svg";
import BQUEEN from "../../assets/images/chess/piece/bQ.svg";
import BROOK from "../../assets/images/chess/piece/bR.svg";
import WBISHOP from "../../assets/images/chess/piece/wB.svg";
import WKNIGHT from "../../assets/images/chess/piece/wN.svg";
import WQUEEN from "../../assets/images/chess/piece/wQ.svg";
import WROOK from "../../assets/images/chess/piece/wR.svg";
import { getUserData } from "../../lib/auth";
import axios from "../../lib/axios";
import { toast_error } from "../../lib/hooks/toast";
import appSettings from "../../settings/appSettings";
import { CHESS_FEN } from "../../settings/game";

export default function AiChessBoard({
  game,
  setGameStatus,
  toggleBaseTurn,
  gameStatus,
}) {
  const { t } = useTranslation();
  const user = getUserData() ?? { id: "" };
  const toast = useToast();
  const [chess] = useState(new Chess(CHESS_FEN));
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
    const fetchAIMove = async () => {
      if (game._id && user.id === game.black) {
        try {
          const response = await axios.post(
            `${appSettings.API_PROXY}/ai-game/${game._id}/request_ai_move`,
            {
              fen: CHESS_FEN,
            },
          );
          const { move } = response.data;
          console.log({ move });
          const from = move[0] + move[1];
          const to = move[2] + move[3];
          chess.move({ from, to });
          toggleTurn();
          setFen(chess.fen());
          setIsCheck(chess.inCheck());
          setLastMove([from, to]);
        } catch (error) {
          toast(toast_error(t("common.error")));
        }
      }
    };

    fetchAIMove();
  }, [game?._id, user?.id, game?.black, t, toast, chess, toggleTurn]);

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

  const handleSendMove = async (fen) => {
    try {
      const response = await axios.post(
        `${appSettings.API_PROXY}/ai-game/${game._id}/request_ai_move`,
        {
          fen: fen,
        },
      );
      const { move: aiMove } = response.data;
      console.log({ aiMove });
      const from = aiMove[0] + aiMove[1];
      const to = aiMove[2] + aiMove[3];
      chess.move({ from, to });
      setFen(chess.fen());
      setIsCheck(chess.inCheck());
      setLastMove([from, to]);
    } catch (error) {
      toast(toast_error(t("common.error")));
    }
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
        if (gameStatus !== "started") return;

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

        chess.move({ from, to });
        handleSendMove(chess.fen());
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
