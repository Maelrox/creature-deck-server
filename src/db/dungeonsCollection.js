import mongoConnector from "./mongoConnector.js";
import { ObjectId } from "mongodb";

async function updateDungeon(playerId, dungeonName, level) {
  if (!level) {
    level = 1;
  }
  const db = await mongoConnector.connectToDatabase();
  if (!dungeonName) {
    return;
  }
  const filter = { userId: new ObjectId(playerId), dungeon: dungeonName };
  const update = { $set: { level: Number(level) } };
  const options = {
    returnOriginal: false,
    upsert: true,
  };

  try {
    const result = await db
      .collection("dungeons")
      .findOneAndUpdate(filter, update, options);
    if (result) {
      return result;
    }
  } catch (error) {
    throw new Error("Unable to update or insert dungeon: " + error.message);
  }
}

async function getDungeonsOfUser(userId) {
  const db = await mongoConnector.connectToDatabase();
  const dungeons = await db
    .collection("dungeons")
    .find({ userId: new ObjectId(userId) })
    .toArray();
  if (!dungeons || dungeons.length === 0) {
    return [];
  }
  return dungeons;
}

export default {
  updateDungeon,
  getDungeonsOfUser,
};
