import { env } from "@/env.mjs";
import { MongoCreateItem, MongoGetItem } from "@/types/mongo";
import mongoose from "mongoose";
import { initializeSchemas } from "./schema";
import { Document } from "mongodb";


initializeSchemas()

export class MongoDAL {
  private static instance: MongoDAL;
  private constructor() {
    this.init()
    // this.getItemList = this.getItemList.bind(this);
    this.createItem = this.createItem.bind(this);
  }

  async init(){
    await mongoose.connect(env.MONGODB_URI)
    initializeSchemas()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new MongoDAL();
    }
    return this.instance;
  }

  async createItem<T>({ data, resource }: MongoCreateItem): Promise<Document & T> {
    try {
      const model = mongoose.model(resource);
      const result = await model.create(data);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }


  async getItemList({  resource }:MongoGetItem) {
    try {
      const model = mongoose.model(resource);
      const result = await model.find({});
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

}

export const mongo =  MongoDAL.getInstance();

