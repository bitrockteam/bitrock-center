import { IRole } from "./roles.types";

export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: IRole;
  referent_id?: string;
}

export interface ICreateUser {
  name: string;
  email: string;
  avatar_url?: string;
  roleId: string;
  referent_id?: string;
}

export interface IUpdateUser {
  name?: string;
  avatar_url?: string;
  roleId: string;
  referent_id?: string;
}
