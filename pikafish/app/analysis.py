from app.pikafish import get_pikafish

def get_evaluation(fen):
    pikafish = get_pikafish(fen=fen)
    return pikafish.get_evaluation()


def classify_move(evaluation_before, evaluation_after):
    return "Good move."

def get_evaluation_game(fen, moves):
    if not fen or not moves:
        return None
    
    # Initialize pikafish engine
    pikafish = get_pikafish(fen=fen)

    evaluations = []
    evaluation_before = get_evaluation(fen=fen)["value"]
    if not evaluation_before:
        evaluation_before = 40

    for move in moves:
        # Make the move on the board
        pikafish.make_moves_from_current_position([move])

        # Get evaluation for the current position after the move
        evaluation = pikafish.get_evaluation()
        evaluation_current = evaluation["value"]

        # Classify move
        classsified = classify_move(evaluation_before, evaluation_current)
        evaluation_before = evaluation_current

        # Append evaluation to the list
        evaluations.append((move, evaluation_current, classsified))

    return evaluations
