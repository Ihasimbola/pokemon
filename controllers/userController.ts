import { NextFunction, Request, Response } from "express";
import Users from "../entity/userEntity";
import { IUser } from "../types/types";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export class UserController {
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!(req.body.username && req.body.email && req.body.password)) {
        return res.status(400).json({
          message: "Verify your credentials",
        });
      }

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
    } catch (err: any) {
      return next(err);
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
      return next(err);
    }
  }
}
