import mongoConnector from "./mongoConnector.js";
import { ObjectId } from "mongodb";

async function getCardsOfUser(userId) {
  const db = await mongoConnector.connectToDatabase();
  const dungeons = await db
    .collection("cards")
    .find({ userId: new ObjectId(userId) })
    .toArray();
  return dungeons;
}

async function updateCardExperience(userId, experience) {
  const db = await mongoConnector.connectToDatabase();
  return db
    .collection("cards")
    .updateMany({ userId: new ObjectId(userId) }, { $inc: { xp: experience } });
}

async function insertCard(userId, card, level) {
  const db = await mongoConnector.connectToDatabase();
  return db.collection("cards").insertOne({
    userId: new ObjectId(userId),
    cardId: card,
    xp: Number(level),
  });
}

async function savePlayerDeck(userId, cards) {
  const db = await mongoConnector.connectToDatabase();
  const cardDocuments = cards.cards.map((card) => ({
    userId: new ObjectId(userId),
    cardId: card,
  }));
  await db.collection("decks").deleteMany({ userId: new ObjectId(userId) });
  return db.collection("decks").insertMany(cardDocuments);
}

export default {
  getCardsOfUser,
  updateCardExperience,
  insertCard,
  savePlayerDeck,
};
