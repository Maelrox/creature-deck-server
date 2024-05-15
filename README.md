# Create Deck Card Server

Light Creature Deck Server in NodeJs

## Installation

Run `npm install` to install dependencies.

## Usage

Run `npm start` to start the server.

## Test

npm run test to run ste of tests using jest

## This server uses wss it requires a path with valid certificates

In case you don't have the certificates create them using openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

## On ubuntu server

install nodejs 21
install mongodb 4.4
install docker
install docker compose 2.3.3

## Get certificates from certbot container

docker run -it --rm --name certbot \
 -v ~/docker/certbot/conf:/etc/letsencrypt \
 -v ~/docker/certbot/www:/var/www/certbot \
 certbot/certbot certonly --standalone \
 -d creature-deck.mooo.com \
 --non-interactive --agree-tos -m oscarquiroz@gmail.com

## Standalone run

docker-compose -f docker-compose-certbot.yml run --rm certbot certonly --standalone -d creature-deck.mooo.com --non-interactive --agree-tos -m oscarquiroz@gmail.com

## Deploy it using Docker

docker build -t creature-deck-server .
docker run -p -d externalPort:internalPort tag
