import gamesAPI from "../api/games.js";
import dungeonsAPI from "../api/dungeons.js";
import cardAPI from "../api/cards.js";
import userAPI from "../api/users.js";
import response from "../utils/response.js";

export async function handleCreateGame(ws) {
  const gameId = gamesAPI.createGame();
  ws.send(response.formatResponse("gameCreated", { gameId }));
}

export async function handleCompleteDungeon(data, ws) {
  dungeonsAPI.completeDungeon(data.playerId, data.dungeonName, data.level);
  ws.send(response.formatResponse("dungeonComplete", true));
}

export async function handleGetCards(decoded, ws) {
  const cardsResponse = await cardAPI.getCardsOfUser(decoded.userId);
  console.log(cardsResponse);
  ws.send(response.formatResponse("getCards", cardsResponse));
}

export async function handleGetDungeons(data, ws) {
  const dungeonsResponse = await dungeonsAPI.getDungeonsOfUser(data.playerId);
  ws.send(response.formatResponse("getDungeons", dungeonsResponse));
}

export async function handleEndBattle(data, ws) {
  await cardAPI.updateCardExperience(data.playerId, 1000);
  ws.send(response.formatResponse("endBattle", true));
}

export async function handleRewardCard(data, ws) {
  await cardAPI.insertCard(data.playerId, data.card, data.level);
  ws.send(response.formatResponse("insertCard", true));
}

export async function handleRegisterUser(data, ws) {
  const registerUserResponse = await userAPI.registerUser(
    data.userId,
    data.password
  );
  if (registerUserResponse.insertedId) {
    ws.send(response.formatResponse("registerUserResponse", "User registered"));
  } else {
    ws.send(
      response.formatResponse(
        "registerUserResponse",
        registerUserResponse.message
      )
    );
  }
}

export async function handleLoginUser(data, ws) {
  const loginUserResponse = await userAPI.loginUser(data.userId, data.password);
  if (!loginUserResponse.message) {
    ws.send(response.formatResponse("loginUserResponse", loginUserResponse));
  } else {
    ws.send(
      response.formatResponse(
        "authenticationFailure",
        loginUserResponse.message
      )
    );
  }
}

export async function handleSavePlayerDeck(decoded, data, ws) {
  const savePlayerCardsResponse = await cardAPI.savePlayerDeck(
    decoded.userId,
    data.cards
  );
  console.log(savePlayerCardsResponse);
  if (!savePlayerCardsResponse.message) {
    ws.send(response.formatResponse("savePlayerDeck", savePlayerCardsResponse));
  } else {
    ws.send(
      response.formatResponse(
        "savePlayerDeckFailure",
        savePlayerCardsResponse.message
      )
    );
  }
}
