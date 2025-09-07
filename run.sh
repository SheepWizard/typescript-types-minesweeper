docker stop ts-minesweeper
docker rm ts-minesweeper
docker build -t ts-minesweeper --network=host .
docker run -d --network nginxproxymanager_default --name=ts-minesweeper --restart unless-stopped -d ts-minesweeper