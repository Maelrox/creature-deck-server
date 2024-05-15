FROM node:21

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Ensure the certificates are copied to the correct location
COPY cert.pem /app/cert.pem
COPY key.pem /app/key.pem

CMD ["node", "src/server.js"]