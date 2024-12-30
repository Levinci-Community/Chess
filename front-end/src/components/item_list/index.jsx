import { Flex } from "@chakra-ui/react";
import Item from "./item";

const ItemList = ({ list }) => {
  return (
    <Flex direction="column" align="center">
      {list.map((item) => (
        <Item key={item._id} item={item} />
      ))}
    </Flex>
  );
};

export default ItemList;
