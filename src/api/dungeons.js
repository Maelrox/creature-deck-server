import dungeonsDB from "../db/dungeonsCollection.js";
import { handleError } from "../utils/errorHandler.js"; // Import as a named import

// Set a dungeon level as completed for a specific userId
async function completeDungeon(userId, dungeonName, level) {
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
