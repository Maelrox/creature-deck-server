import mongoConnector from "./mongoConnector.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const SECRET_KEY = "2=A=b&SXf:v=inX";

async function registerUser(userId, password) {
  const db = await mongoConnector.connectToDatabase();
  try {
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
    });
    const insert = { userId: userId, password: hashedPassword };
    const result = await db.collection("users").insertOne(insert);
    console.log(result);
    if (result.acknowledged) {
      await setInitialCards(result.insertedId, db);
      return result;
    } else {
      throw new Error("Error registering user");
    }
  } catch (error) {
    throw new Error(error);
  }
}

async function userExists(userId) {
  const db = await mongoConnector.connectToDatabase();
  const existingUser = await db.collection("users").findOne({ userId: userId });
  return existingUser != null;
}

async function loginUser(userId, password) {
  const db = await mongoConnector.connectToDatabase();
  try {
    const user = await db.collection("users").findOne({ userId: userId });
    if (user && (await argon2.verify(user.password, password))) {
      const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
        expiresIn: "48h",
      });
      return { token };
    } else {
      throw new Error("Authentication failed");
    }
  } catch (error) {
    throw new Error(error);
  }
}

async function setInitialCards(userObjectId, db) {
  db.collection("cards").insertMany([
    {
      userId: userObjectId,
      cardId: "Bear",
      xp: Number(1),
    },
    {
      userId: userObjectId,
      cardId: "Carrot",
      xp: Number(1),
    },
  ]);
}

export default {
  registerUser,
  loginUser,
  userExists,
};
