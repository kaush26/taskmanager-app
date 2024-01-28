import { User } from "../models/User.js";
import { decode } from "../utils.js";

export default async function auth(req, res, next) {
  try {
    const authToken =
      req.get("Authorization")?.split?.(" ")?.at?.(-1);

    if (!authToken) {
      throw new Error("⚠️ Auth Token is Required!");
    }

    const { userId } = decode(authToken);
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      throw new Error("⚠️ User doesn't exists!");
    }

    req.token = authToken;
    req.userId = userId;
    next();
  } catch (err) {
    next(err);
  }
}