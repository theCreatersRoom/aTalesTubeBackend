import { NextFunction, Request, Response } from "express";
import { parseJwt } from "../utils/helper";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const { exp } = parseJwt(token) || {};

    if (Date.now() >= exp * 1000) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.userId = (decoded as JwtPayload).userId;
    next();
  } catch (err) {
    console.log("🚀 ~ err:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
