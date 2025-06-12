import { IRole } from "./roles.types";

export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: IRole;
}

export interface ICreateUser {
  name: string;
  email: string;
  avatar_url?: string;
  roleId: string;
}

export interface IUpdateUser {
  name?: string;
  avatar_url?: string;
  roleId: string;
}
