from app.model import Pikafish

XIANGQI_FEN = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR  w - - 0 1"
def get_pikafish(fen= XIANGQI_FEN):
    pikafish = Pikafish(path="../../pikafish")
    pikafish.set_fen_position(fen)
    return pikafish

