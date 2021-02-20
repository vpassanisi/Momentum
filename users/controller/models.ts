import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../util/envValidator";
import type { WithId, ObjectID } from "mongodb";

export interface UserType {
  name: string;
  email: string;
  password: string;
  createdAt: number;
  lastLogin: number;
}

export interface TokenPayload {
  name: string;
  email: string;
  issuedAt: number;
}

export class NewUser {
  name: string;
  email: string;
  password: string;
  createdAt: number;
  lastLogin: number;
  constructor({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = Math.trunc(Date.now() / 1000);
    this.lastLogin = Math.trunc(Date.now() / 1000);
  }

  /**
   * encrypt the user password
   */
  async encrypt(rounds: number) {
    const salt = await bcrypt.genSalt(rounds);
    const encrypted = await bcrypt.hash(this.password, salt);
    this.password = encrypted;
  }

  /**
   * get an object of the users information for adding to db
   */
  getNewUser() {
    const user: UserType = {
      name: this.name,
      email: this.email,
      password: this.password,
      createdAt: this.createdAt,
      lastLogin: this.lastLogin,
    };
    return user;
  }
}

export class MongoUser {
  _id: ObjectID;
  name: string;
  email: string;
  password: string;
  createdAt: number;
  lastLogin: number;
  constructor(user: WithId<UserType>) {
    this._id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.createdAt = user.createdAt;
    this.lastLogin = user.lastLogin;
  }

  /**
   * return an object for responding the graphql query
   */
  userResponse() {
    if (typeof this._id === "undefined") {
      throw Error("id undefined");
    }

    const payload: TokenPayload = {
      name: this.name,
      email: this.email,
      issuedAt: Date.now(),
    };
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "30d" });

    return {
      token,
      _id: this._id.toHexString(),
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
    };
  }

  /**
   * returns user without a token
   */
  meRes() {
    return {
      _id: this._id.toHexString(),
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
    };
  }

  /**
   * return boolean describing if the password is correct
   */
  async checkPassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  updateLastLogin() {
    this.lastLogin = Math.trunc(Date.now() / 1000);
  }
}
