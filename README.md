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

install mongodb 4.4
install docker
install docker compose 2.3.3

## Get certificates from certbot container standalone

docker run -it --rm -p 80:80 --name certbot -v ~/docker/certbot/conf:/etc/letsencrypt -v ~/docker/certbot/www:/var/www/certbot certbot/certbot certonly
--standalone -d creature-deck.mooo.com --non-interactive --agree-tos -m oscarquiroz@gmail.com

or it using docker compose certbot
docker compose -f docker-compose-standalone.yml up --build

## Run service keeps certificate updated

docker compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot -d creature-deck.mooo.com --non-interactive --agree-tos -m oscarquiroz@gmail.com

## Deploy it using docker compose

docker compose up --build -d

## Clean

docker-compose rm -f
