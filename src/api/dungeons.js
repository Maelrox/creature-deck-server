import dungeonsDB from "../db/dungeonsCollection.js";
import { handleError } from "../utils/errorHandler.js"; // Import as a named import

const maxLevelAllowed = 3;

// Set a dungeon level as completed for a specific userId
async function completeDungeon(userId, dungeonName, level) {
  if (level > maxLevelAllowed) {
    let result = {
      success: false,
      level: 3,
      dungeon: dungeonName,
      message: "Dungeon is already completed",
    };
    return result;
  }
  return dungeonsDB
    .updateDungeon(userId, dungeonName, level)
    .then((result) => {
      result.success = true;
      return result;
    })
    .catch((error) => {
      return handleError(error);
    });
}

// Get all dungeons by user
async function getDungeonsOfUser(userId) {
  return dungeonsDB
    .getDungeonsOfUser(userId)
    .then((result) => {
      result.success = true;
      return result;
    })
    .catch((error) => {
      return handleError(error);
    });
}

export default { completeDungeon, getDungeonsOfUser };
