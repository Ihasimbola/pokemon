import mongoose from "mongoose";

export interface IUser {
  id?: string;
  username: string;
  password: string;
  email: string;
  cachedPokemon?: Array<string>;
}

export interface ICatergory {
  name: string;
  userId: mongoose.Schema.Types.ObjectId;
  count?: number;
}

export interface ITecno {
  name: string;
  topics: Array<string>;
  userId: mongoose.Schema.Types.ObjectId;
  icon: string;
  total_spent_time: string;
  category: string;
  count?: number;
}

export interface Spent_TimeType {
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export interface ITopic {
  title: string;
  description: string;
  userId: mongoose.Schema.Types.ObjectId;
  spent_time: Object;
  tecno: string;
  isDone: boolean;
  count?: number;
}

export interface IQuery {
  sort?: string;
  filter?: string;
}
