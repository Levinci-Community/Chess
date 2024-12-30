from app.model import Pikafish

XIANGQI_FEN = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR  w - - 0 1"
def get_pikafish(fen= XIANGQI_FEN, depth=15, threads=1, hash=16, multiPV=1, minThinkingTime=20):
    pikafish = Pikafish(path="./pikafish", depth=depth, parameters={
        "Debug Log File": "./app/log.txt",
        "Threads": threads,
        "Min Split Depth": 0,
        "Hash": hash,
        "MultiPV": multiPV,
        "Minimum Thinking Time": minThinkingTime,
    })
    pikafish.set_fen_position(fen)
    return pikafish

