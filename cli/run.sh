echo "Stop container"
docker-compose down

echo "Remove last images"
docker rmi leetun2k2/chess_frontend:latest
docker rmi leetun2k2/chess_backend:latest
docker rmi leetun2k2/stockfish:latest
docker rmi leetun2k2/pikafish:latest

echo "Pull images"
docker pull leetun2k2/chess_frontend:latest
docker pull leetun2k2/chess_backend:latest
docker pull leetun2k2/stockfish:latest
docker pull leetun2k2/pikafish:latest

echo "Start new container"
docker-compose up -d

echo "Deploy ute-chess-club project completely"