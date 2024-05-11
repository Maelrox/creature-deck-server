// Import the module
import dungeonsDB from "../src/db/dungeonsCollection";
import { jest } from "@jest/globals";
import mongoConnector from "../src/db/mongoConnector";
import { ObjectId } from "mongodb";
import dungeonAPI from "../src/api/dungeons";

dungeonsDB.updateDungeon = jest
  .fn()
  .mockImplementation((userId, dungeonName, level) => {
    if (userId === "errorUserId") {
      throw new Error("Database Error");
    }
    return Promise.resolve({
      userId: new ObjectId(userId),
      dungeon: dungeonName,
      level: level,
    });
  });

dungeonsDB.getDungeonsOfUser = jest.fn().mockImplementation((userId) => {
  if (userId === "errorUserId") {
    throw new Error("Database Error");
  }
  return Promise.resolve([
    {
      userId: "6636657680527768e73629a0",
      dungeon: "Mystic Cave",
      level: 3,
    },
    {
      userId: "6636657680527768e73629a0",
      dungeon: "Crystal Lake",
      level: 2,
    },
  ]);
});

beforeAll(async () => {
  await mongoConnector.connectToDatabase();
});

afterAll(async () => {
  await mongoConnector.closeDatabaseConnection();
});

describe("Dungeon API", () => {
  describe("Complete Dungeon", () => {
    it("should complete an existing dungeon or create a new one if it does not exist, returns the updated or created document", async () => {
      const userId = "6636657680527768e73629a0";
      const dungeonName = "Mystic Cave";
      const level = 1;
      const result = await dungeonAPI.completeDungeon(
        userId,
        dungeonName,
        level
      );
      expect(result).toBeDefined();
      expect(result.userId).toStrictEqual(new ObjectId(userId));
      expect(result.dungeon).toBe(dungeonName);
      expect(result.level).toBe(level);
      expect(result.success).toBe(true);
      expect(dungeonsDB.updateDungeon).toHaveBeenCalledTimes(1);
    });
  });
  describe("Get Dungeons", () => {
    it("it should return a list of dungeons for an user", async () => {
      const userId = "6636657680527768e73629a0";
      const result = await dungeonAPI.getDungeonsOfUser(userId);
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result.success).toBe(true);
      expect(dungeonsDB.getDungeonsOfUser).toHaveBeenCalledTimes(1);
    });
  });
  describe("Complete Dungeon with Error", () => {
    it("should handle errors when updating a dungeon fails", async () => {
      const userId = "errorUserId";
      const dungeonName = "ErrorCase";
      const level = 1;

      await expect(
        dungeonAPI.completeDungeon(userId, dungeonName, level)
      ).rejects.toThrow("Database Error");

      expect(dungeonsDB.updateDungeon).toHaveBeenCalledTimes(2);
    });
  });
  describe("Get Dungeons with Error", () => {
    it("should handle errors when updating a dungeon fails", async () => {
      const userId = "errorUserId";
      await expect(dungeonAPI.getDungeonsOfUser(userId)).rejects.toThrow(
        "Database Error"
      );
      expect(dungeonsDB.getDungeonsOfUser).toHaveBeenCalledTimes(2);
    });
  });
});
