from services.glicko2.glicko2 import Glicko2
from datetime import datetime

# Instantiate the Glicko2 rating system
glicko2 = Glicko2()

def rate_1vs1(player1_data, player2_data, status: float):
    """Update ratings for two players based on a 1 vs 1 match.

    Args:
        player1_data (dict): Dictionary containing player 1's rating data.
        player2_data (dict): Dictionary containing player 2's rating data.
        status (float): The status of the match: 1.0 for player 1 win, 0.5 for draw, 0.0 for player 2 win.

    Returns:
        Tuple: Updated rating data for player 1 and player 2.
    """
    # Create Rating objects for player 1 and player 2
    player1 = glicko2.create_rating(
        mu=player1_data["mu"], 
        phi=player1_data["phi"], 
        sigma=player1_data["sigma"], 
        ltime=player1_data["ltime"]
    )

    player2 = glicko2.create_rating(
        mu=player2_data["mu"], 
        phi=player2_data["phi"],
        sigma=player2_data["sigma"],
        ltime=player2_data["ltime"]
    )

    # Determine match outcome and update ratings accordingly
    if status == 0.5:  # Draw
        updated_player1, updated_player2 = glicko2.rate_1vs1(player1, player2, drawn=True)
    elif status == 1.0:  # Player 1 wins
        updated_player1, updated_player2 = glicko2.rate_1vs1(player1, player2)
    else:  # Player 2 wins
        updated_player2, updated_player1 = glicko2.rate_1vs1(player2, player1)

    return updated_player1, updated_player2
