import { IRole } from "./roles.types";

export interface IUser {
  id: string;
  auth_id?: string; // authenticator provider ID
  name: string;
  email: string;
  avatar_url?: string;
  role?: IRole;
}

export interface ICreateUser {
  name: string;
  email: string;
  avatar_url?: string;
}

export interface IUpdateUser {
  name?: string;
  avatar_url?: string;
  auth_id?: string; // authenticator provider ID
}
