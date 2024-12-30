from stockfish import Stockfish

CHESS_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
def get_stockfish(fen= CHESS_FEN, depth=15, threads=1, hash=16, multiPV=1, minThinkingTime=20):
    stockfish = Stockfish(path="./stockfish", depth=depth, parameters={
        "Debug Log File": "./app/log.txt",
        "Threads": threads,
        "Min Split Depth": 0,
        "Hash": hash,
        "MultiPV": multiPV,
        "Minimum Thinking Time": minThinkingTime,
    })
    stockfish.set_fen_position(fen)
    return stockfish

