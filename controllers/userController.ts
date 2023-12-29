import { NextFunction, Request, Response } from "express";
import Users from "../entity/userEntity";
import { IUser } from "../types/types";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export class UserController {
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await Users.create(req.body);

      const accessToken = generateAccessToken({
        userId: doc.id || "",
        username: doc.username,
        email: doc.email,
      });
      const refreshToken = generateRefreshToken({
        userId: doc.id || "",
        username: doc.username,
        email: doc.email,
      });

      res.status(200).json({
        message: "Created successfully.",
        token: await accessToken,
        refreshToken: await refreshToken,
      });
    } catch (err) {
      throw Error("Error creating user" + err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await Users.authenticateUser(
        req.body.username,
        req.body.password
      );

      const accessToken = generateAccessToken({
        userId: user.id || "",
        username: user.username,
        email: user.email,
      });
      const refreshToken = generateRefreshToken({
        userId: user.id || "",
        username: user.username,
        email: user.email,
      });

      if (user) {
        res.status(200).json({
          token: await accessToken,
          refreshToken: await refreshToken,
        });
      }
    } catch (err: any) {
      console.log("Error authenticating user" + err);
      res.status(401).json({
        message: err.message,
      });
    }
  }
}
