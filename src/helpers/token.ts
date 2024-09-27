import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export class Token {
  static create(data: object) {
    const token = jwt.sign(data, process.env.SECRET as string, {
      expiresIn: "14d",
    });

    return token;
  };
};
