export interface IUser {
  id: string;
  auth_id?: string; // authenticator provider ID
  name: string;
  email: string;
  avatar_url?: string;
  role_id?: string;
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
