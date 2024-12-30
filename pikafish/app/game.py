from app.pikafish import get_pikafish

def is_fen_valid(fen):
    pikafish = get_pikafish()
    return pikafish.is_fen_valid(fen)

def is_movable(fen, move):
    pikafish = get_pikafish(fen=fen)
    return pikafish.is_move_correct(move)

def get_parameters(pikafish=None):
    if not pikafish:
        pikafish = get_pikafish()
        return pikafish.get_parameters()
    return None

def get_fen_position(pikafish):
    return pikafish.get_fen_position()

def get_board_visual(pikafish=None):
    if not pikafish:
        pikafish = get_pikafish()
        return pikafish.get_board_visual()
    return None

def get_piece(fen, square):
    pikafish = get_pikafish(fen=fen)
    return pikafish.get_what_is_on_square(square)
