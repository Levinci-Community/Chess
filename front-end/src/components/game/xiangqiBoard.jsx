import { Flex } from "@chakra-ui/react";
import XiangqiGround from "../../lib/xiangqiboardjs/XiangqiGround";
import { Fragment } from "react";

export default function XiangqiBoard({ game, setGameStatus, toggleBaseTurn }) {
  const config = {};
  return (
    <Fragment>
      {/* Chess board md */}
      <Flex
        display={{ base: "none", sm: "none", md: "none", lg: "flex" }}
        mb={4}
      >
        <XiangqiGround width={600} height={600} config={config} />
      </Flex>

      {/* Chess board md */}
      <Flex
        display={{ base: "none", sm: "none", md: "flex", lg: "none" }}
        mb={4}
      >
        <XiangqiGround width={500} height={500} config={config} />
      </Flex>

      {/* Chess board sm */}
      <Flex
        display={{ base: "none", sm: "flex", md: "none", lg: "none" }}
        mb={4}
      >
        <XiangqiGround width={400} height={400} config={config} />
      </Flex>

      {/* Chess board base */}
      <Flex
        display={{ base: "flex", sm: "none", md: "none", lg: "none" }}
        mb={4}
      >
        <XiangqiGround width={300} height={300} config={config} />
      </Flex>
    </Fragment>
  );
}
