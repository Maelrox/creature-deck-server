import { jest } from "@jest/globals";
import cardDB from "../src/db/cardsCollection.js";
import mongoConnector from "../src/db/mongoConnector.js";
import cardAPI from "../src/api/cards.js";
import { ObjectId } from "mongodb";

cardDB.getCardsOfUser = jest.fn().mockImplementation((userId) => {
  return Promise.resolve(
    {
      _id: new ObjectId("6636657680527768e73629a1"),
      userId: new ObjectId(userId),
      cardId: "Bear",
      xp: 1,
    },
    {
      _id: new ObjectId("6636657680527768e73629a2"),
      userId: new ObjectId(userId),
      cardId: "Carrot",
      xp: 1,
    }
  );
});

cardDB.updateCardExperience = jest.fn().mockImplementation((userId) => {
  return Promise.resolve(
    {
      _id: new ObjectId("6636657680527768e73629a1"),
      userId: new ObjectId(userId),
      cardId: "Bear",
      xp: 2,
    },
    {
      _id: new ObjectId("6636657680527768e73629a2"),
      userId: new ObjectId(userId),
      cardId: "Carrot",
      xp: 2,
    }
  );
});

cardDB.savePlayerDeck = jest.fn().mockImplementation((userId, cards) => {
  return Promise.resolve(
    {
      _id: new ObjectId("6636657680527768e73629a1"),
      userId: new ObjectId(userId),
      cardId: "Bear",
    },
    {
      _id: new ObjectId("6636657680527768e73629a2"),
      userId: new ObjectId(userId),
      cardId: "Carrot",
    }
  );
});

describe("Cards API", () => {
  beforeAll(async () => {
    await mongoConnector.connectToDatabase();
  });
  afterAll(async () => {
    await mongoConnector.closeDatabaseConnection();
  });
  describe("Get the cards of one user", () => {
    it("should return all the user cards", async () => {
      const userId = "6636657680527768e73629a0";
      const result = await cardAPI.getCardsOfUser(userId);
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(cardDB.getCardsOfUser).toHaveBeenCalledTimes(1);
    });
  });
  describe("Update cards experience for the player", () => {
    it("should return success", async () => {
      const userId = "6636657680527768e73629a0";
      const experience = 1;
      const result = await cardAPI.updateCardExperience(userId, experience);
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(cardDB.updateCardExperience).toHaveBeenCalledTimes(1);
    });
  });
  describe("Save selected cards for player conforming his deck", () => {
    it("should store player deck preference", async () => {
      const userId = "6636657680527768e73629a0";
      const cards = ["Bear", "Carror"];
      const result = await cardAPI.savePlayerDeck(userId, cards);
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(cardDB.savePlayerDeck).toHaveBeenCalledTimes(1);
    });
    it("should fail storing a player deck", async () => {
      const userId = "6636657680527768e73629a0";
      const cards = undefined;
      const result = await cardAPI.savePlayerDeck(userId, cards);
      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(cardDB.savePlayerDeck).toHaveBeenCalledTimes(1);
    });
  });
});
