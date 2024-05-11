import { jest } from "@jest/globals";
import userDB from "../src/db/userCollection.js";
import mongoConnector from "../src/db/mongoConnector.js";
import userAPI from "../src/api/users.js";
import { ObjectId } from "mongodb";

userDB.registerUser = jest.fn().mockImplementation((userId, password) => {
  return Promise.resolve({
    acknowledge: true,
    insertedId: new ObjectId("6636657680527768e73629a0"),
    userId: userId,
    password: "hash",
  });
});

userDB.loginUser = jest.fn().mockImplementation((userId, password) => {
  return Promise.resolve({
    _id: new ObjectId("6636657680527768e73629a0"),
    userId: userId,
    password:
      "$argon2id$v=19$m=65536,t=3,p=4$h/hAu+bkCZ5XbhFOR4cbsA$0iJT42/yyEPeEzcq9DpwczGvB4Ab2ENY+OHR31IXTjE",
  });
});

userDB.userExists = jest.fn().mockImplementation((userId, db) => {
  return Promise.resolve(userId === "DuplicatedUser");
});

describe("Games API", () => {
  beforeAll(async () => {
    await mongoConnector.connectToDatabase();
  });
  afterAll(async () => {
    await mongoConnector.closeDatabaseConnection();
  });
  describe("Register one user", () => {
    it("should create an user in the database", async () => {
      const userId = "Morgox";
      const password = "Nekierd2013%%";
      const result = await userAPI.registerUser(userId, password);
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.insertedId).toBeDefined();
      expect(result.acknowledge).toBe(true);
      expect(userDB.registerUser).toHaveBeenCalledTimes(1);
    });
  });
  describe("Register user with error in password", () => {
    it("should throw an error when the password doesn't meet the requirements", async () => {
      const userId = "Morgox";
      const password = "abc123";
      const result = await userAPI.registerUser(userId, password);
      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.message).toContain(
        "Password must be at least 8 characters long"
      );
      expect(userDB.registerUser).toHaveBeenCalledTimes(1);
    });
  });
  describe("Register user with error in userId", () => {
    it("should throw an error when the password doesn't meet the requirements", async () => {
      const userId = "AA";
      const password = "abc123";
      const result = await userAPI.registerUser(userId, password);
      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "User ID must be at least 3 characters long."
      );
      expect(userDB.registerUser).toHaveBeenCalledTimes(1);
    });
  });
  describe("Register a duplicated user", () => {
    it("should throw an error when the user already exist", async () => {
      const userId = "DuplicatedUser";
      const password = "Nekierd2013%%";
      const result = await userAPI.registerUser(userId, password);
      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.message).toBe("User already exist");
      expect(userDB.registerUser).toHaveBeenCalledTimes(1);
    });
  });
  describe("Login user", () => {
    it("should return success", async () => {
      const userId = "Morgox";
      const password = "test";
      const result = await userAPI.loginUser(userId, password);
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(userDB.loginUser).toHaveBeenCalledTimes(1);
    });
  });
});
