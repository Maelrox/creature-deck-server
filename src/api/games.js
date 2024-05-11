import cardsDB from "../db/cardsCollection.js";

function createGame() {
  return 21;
}

function endBattle(playerId) {
  cardsDB.updateCardExperience(playerId, 1000);
}

export default {
  createGame,
  endBattle,
};
