import cardsDB from "../db/cardsCollection.js";
import validator from "validator";
import { handleError } from "../utils/errorHandler.js";

// Get all user cards
async function getCardsOfUser(userId) {
  try {
    userId = validator.trim(userId);
    userId = validator.escape(userId);
    if (!userId || userId === "") {
      throw new Error("User ID must not be empty.");
    }
    const result = await cardsDB.getCardsOfUser(userId);
    result.success = true;
    return result;
  } catch (error) {
    return handleError(error);
  }
}

// Increment all the player cards experience
async function updateCardExperience(userId, experience) {
  try {
    userId = validator.trim(userId);
    userId = validator.escape(userId);
    if (!userId || userId === "") {
      throw new Error("User ID must not be empty.");
    }
    if (!experience || experience === "") {
      throw new Error("Experience must not be empty.");
    }
    const result = await cardsDB.updateCardExperience(userId, experience);
    result.success = true;
    return result;
  } catch (error) {
    return handleError(error);
  }
}

// Save player deck
async function savePlayerDeck(userId, cards) {
  try {
    if (!cards) {
      throw new Error("No cards to save");
    }
    const result = await cardsDB.savePlayerDeck(userId, cards);
    result.success = true;
    return result;
  } catch (error) {
    return handleError(error);
  }
}

export default { getCardsOfUser, updateCardExperience, savePlayerDeck };
