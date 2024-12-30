import React, { useEffect, useRef } from "react";

function ChessBoard() {
  const boardContainerRef = useRef(null);

  return (
    <div>
      <div ref={boardContainerRef}></div>
    </div>
  );
}

export default ChessBoard;
