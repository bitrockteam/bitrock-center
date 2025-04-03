import { ICreateUser, IUpdateUser, IUser } from "@bitrock/types";
import { sql } from "../config/postgres";

// GET

export async function getUserByAuthId(id: string): Promise<IUser | null> {
  const res = await sql`SELECT * FROM public."USERS" WHERE auth_id = ${id}`;
  if (!res) return null;
  return res[0] as IUser;
}

export async function getUserById(id: string): Promise<IUser | null> {
  const res = await sql`SELECT * FROM public."USERS" WHERE id = ${id}`;
  if (!res) return null;
  if (res.length === 0) return null;
  if (res.length > 1) {
    console.error("More than one user found with the same id");
    console.error(res);
    throw new Error("More than one user found with the same id");
  }
  return res[0] as IUser;
}

export async function getUsers(): Promise<IUser[]> {
  const res = await sql`SELECT * FROM public."USERS"`;
  return [...res] as IUser[];
}

// POST

export async function createUserFromAuth(
  authId: string,
  user: ICreateUser,
): Promise<IUser> {
  const res = user.avatar_url
    ? await sql`INSERT INTO public."USERS" (auth_id, name, email, avatar_url) VALUES (${authId}, ${user.name}, ${user.email}, ${user.avatar_url}) RETURNING *`
    : await sql`INSERT INTO public."USERS" (auth_id, name, email) VALUES (${authId}, ${user.name}, ${user.email}) RETURNING *`;
  return res[0] as IUser;
}

export async function createUserManually(user: ICreateUser): Promise<IUser> {
  const res =
    await sql`INSERT INTO public."USERS" (name, email) VALUES (${user.name}, ${user.email}) RETURNING *`;
  return res[0] as IUser;
}

// PATCH

export async function updateUser(
  id: string,
  user: Partial<IUpdateUser>,
): Promise<IUser | null> {
  const res =
    await sql`UPDATE public."USERS" SET ${sql(user)} WHERE id = ${id} RETURNING *`;
  if (!res) return null;
  return res[0] as IUser;
}
