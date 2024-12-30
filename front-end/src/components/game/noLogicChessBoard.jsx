import { Flex } from "@chakra-ui/react";
import Chessground from "@react-chess/chessground";
import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";
import { Fragment } from "react";
import { CHESS_FEN } from "../../settings/game";

export default function NoLogicChessBoard({ isFree }) {
  const config = {
    fen: CHESS_FEN,
    movable: {
      free: isFree,
    },
  };

  return (
    <Fragment>
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
