from app.stockfish import get_stockfish

def is_fen_valid(fen):
    stockfish = get_stockfish()
    return stockfish.is_fen_valid(fen)

def is_movable(fen, move):
    stockfish = get_stockfish(fen=fen)
    return stockfish.is_move_correct(move)

def get_parameters(stockfish=None):
    if not stockfish:
        stockfish = get_stockfish()
        return stockfish.get_parameters()
    return None

def get_fen_position(stockfish):
    return stockfish.get_fen_position()

def get_board_visual(stockfish=None):
    if not stockfish:
        stockfish = get_stockfish()
        return stockfish.get_board_visual()
    return None

def get_piece(fen, square):
    stockfish = get_stockfish(fen=fen)
    return stockfish.get_what_is_on_square(square)
