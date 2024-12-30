import { Flex, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
export default function DatetimePicker({ value, onChange }) {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [date, setDate] = useState("");

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      date.setHours(date.getHours() - 7);
      setDate(formatDate(date));
      setHour(date.getHours());
      setMinute(date.getMinutes());
    }
  }, [value]);

  return (
    <Flex align={"center"}>
      <Input
        type="number"
        w={16}
        placeholder="hh"
        value={hour}
        onChange={(e) => {
          const input = e?.target?.value?.length > 0 ? e.target.value : "0";
          const value = parseInt(input);
          if (value < 0 || value > 23) return;
          setHour(value);
          onChange(value, minute, date);
        }}
      />
      <Text px={2}>:</Text>
      <Input
        type="number"
        w={16}
        placeholder="mm"
        value={minute}
        onChange={(e) => {
          const input = e?.target?.value?.length > 0 ? e.target.value : "0";

          const value = parseInt(input);
          if (value < 0 || value > 59) return;
          setMinute(value);
          onChange(hour, value, date);
        }}
      />
      <Input
        type="date"
        value={date}
        onChange={(e) => {
          const input = e?.target?.value;
          setDate(input);
          onChange(hour, minute, input);
        }}
        onKeyPress={(e) => {
          e.preventDefault();
          return false;
        }}
        w={48}
        ml={2}
      />
    </Flex>
  );
}
