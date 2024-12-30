python ./app/generator/generator.py --engine ./stockfish > positions.epd
python ./app/generator/puzzler.py --engine ./stockfish positions.epd > puzzles.epd
python ./app/generator/pgn.py puzzles.epd > puzzles.pgn