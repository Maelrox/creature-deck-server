import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

import mongoConnector from "../src/db/mongoConnector.js";
import response from "./utils/response.js";
import {
  handleCreateGame,
  handleCompleteDungeon,
  handleGetCards,
  handleGetDungeons,
  handleEndBattle,
  handleRewardCard,
  handleRegisterUser,
  handleLoginUser,
  handleSavePlayerDeck,
} from "./utils/messageHandler.js";

const SECRET_KEY = "2=A=b&SXf:v=inX";
const server = new WebSocketServer({ port: 3000 });
const sessions = new Map();

server.on("connection", function (ws) {
  ws.on("message", async function (message) {
    try {
      const data = JSON.parse(message);
      let decoded = null;

      if (data.token) {
        decoded = jwt.verify(data.token, SECRET_KEY);
      }

      manageSession(decoded, ws);

      if (!isAuthorized(data, ws)) {
        return;
      }
      console.log(data);
      handleMessage(data, decoded, ws);
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        ws.send(response.formatResponse("authenticationFailure", {}));
        return;
      }
      ws.send(response.formatResponse("authenticationFailure", {}));
    }
  });
  ws.on("close", () => handleDisconnect(ws));
});

function manageSession(decoded, ws) {
  if (decoded) {
    sessions.set(decoded.userId, ws);
  }
}

function isAuthorized(data, ws) {
  if (
    data.type !== "registerUser" &&
    data.type !== "loginUser" &&
    data.type != "createGame" &&
    (!data.token || !verifyToken(data.token))
  ) {
    ws.send(
      response.formatResponse("authenticationFailure", {
        message: "Invalid or missing token",
      })
    );
    return false;
  }
  return true;
}

function handleMessage(data, decoded, ws) {
  switch (data.type) {
    case "createGame":
      handleCreateGame(ws);
      break;
    case "completeDungeon":
      handleCompleteDungeon(decoded, data, ws);
      break;
    case "getCards":
      handleGetCards(decoded, ws);
      break;
    case "getDungeons":
      handleGetDungeons(data, ws);
      break;
    case "endBattle":
      handleEndBattle(decoded, ws);
      break;
    case "rewardCard":
      handleRewardCard(decoded, data, ws);
      break;
    case "registerUser":
      handleRegisterUser(data, ws);
      break;
    case "loginUser":
      handleLoginUser(data, ws);
      break;
    case "savePlayerDeck":
      handleSavePlayerDeck(decoded, data, ws);
      break;
  }
}

function handleDisconnect(ws) {
  sessions.forEach((value, key) => {
    if (value === ws) {
      sessions.delete(key);
    }
  });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await mongoConnector.closeDatabaseConnection();
  server.close(() => {
    console.log("WebSocket server closed.");
  });
  process.exit(0);
});

process.on("uncaughtException", (err) => {
  console.error("Unhandled Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
