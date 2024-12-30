python ./app/generator/generator.py --engine ./pikafish > positions.epd
python ./app/generator/puzzler.py --engine ./pikafish positions.epd > puzzles.epd
python ./app/generator/pgn.py puzzles.epd > puzzles.pgn