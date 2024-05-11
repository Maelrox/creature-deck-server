import usersDB from "../db/userCollection.js";
import validator from "validator";
import { handleError } from "../utils/errorHandler.js"; // Import as a named import
import userCollection from "../db/userCollection.js";

// Register a new user if it doesn't exist
async function registerUser(userId, password) {
  try {
    if (!userId || !password) {
      throw new Error("User ID and password must not be empty.");
    }
    userId = validator.trim(userId);
    if (!validator.isLength(userId, { min: 3 })) {
      throw new Error("User ID must be at least 3 characters long.");
    }
    userId = validator.escape(userId);
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error(
        "Password must be at least 8 characters long, include uppercase, lowercase letters, numbers, and special characters."
      );
    }
    if (await userCollection.userExists(userId)) {
      throw new Error("User already exist");
    }
    const result = await usersDB.registerUser(userId, password);
    result.success = true;
    return result;
  } catch (error) {
    return handleError(error);
  }
}

// Login a new user if it username and password match
async function loginUser(userId, password) {
  try {
    if (!userId || !password) {
      throw new Error("User ID and password must not be empty.");
    }
    userId = validator.trim(userId);
    userId = validator.escape(userId);
    const result = await usersDB.loginUser(userId, password);
    result.success = true;
    return result;
  } catch (error) {
    return handleError(error);
  }
}

export default { registerUser, loginUser };
