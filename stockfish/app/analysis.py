from app.stockfish import get_stockfish

def get_evaluation(fen):
    stockfish = get_stockfish(fen=fen)
    return stockfish.get_evaluation()

def classify_move(evaluation_before, evaluation_after):
    return "Good move."

def get_evaluation_game(fen, moves):
    if not fen or not moves:
        return None
    
    # Initialize Stockfish engine
    stockfish = get_stockfish(fen=fen)

    evaluations = []
    evaluation_before = get_evaluation(fen=fen)["value"]
    if not evaluation_before:
        evaluation_before = 40

    for move in moves:
        # Make the move on the board
        stockfish.make_moves_from_current_position([move])

        # Get evaluation for the current position after the move
        evaluation = stockfish.get_evaluation()
        evaluation_current = evaluation["value"]

        # Classify move
        classsified = classify_move(evaluation_before, evaluation_current)
        evaluation_before = evaluation_current

        # Append evaluation to the list
        evaluations.append((move, evaluation_current, classsified))

    return evaluations
