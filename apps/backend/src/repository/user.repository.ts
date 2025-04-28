import { ICreateUser, IUpdateUser, IUser } from "@bitrock/types";
import { sql } from "../config/postgres";
import { supabase } from "../config/supabase";

// GET

export async function getUserByAuthId(id: string): Promise<IUser | null> {
  const res = await sql`SELECT * FROM public."USERS" WHERE auth_id = ${id}`;
  if (!res) return null;
  return res[0] as IUser;
}

export async function getUserByEmail(email: string): Promise<IUser | null> {
  const res = await sql`SELECT * FROM public."USERS" WHERE email = ${email}`;
  if (!res) return null;
  return res[0] as IUser;
}
export async function getUserById(id: string): Promise<IUser | null> {
  const res =
    await sql`SELECT u.id,u.email,u.name,u.avatar_url,u.auth_id,u.role_id, r.label FROM public."USERS" u LEFT OUTER JOIN public."ROLES" r ON u.role_id = r.id WHERE u.id = ${id}`;
  if (!res) return null;
  if (res.length === 0) return null;
  if (res.length > 1) {
    console.error("More than one user found with the same id");
    console.error(res);
    throw new Error("More than one user found with the same id");
  }
  return res.map((row) => ({
    id: row.id,
    auth_id: row.auth_id,
    name: row.name,
    email: row.email,
    avatar_url: row.avatar_url,
    role: {
      id: row.role_id,
      label: row.label,
    },
  }))[0];
}

export async function getUsers(params?: string): Promise<IUser[]> {
  if (params) {
    const res =
      await sql`SELECT u.id,u.email,u.name,u.avatar_url,u.auth_id,u.role_id, r.label FROM public."USERS" u LEFT OUTER JOIN public."ROLES" r ON u.role_id = r.id WHERE u.name LIKE '%' || ${params} || '%' OR u.email LIKE '%' || ${params} || '%'`;
    if (!res) return [];
    return res.map((row) => ({
      id: row.id,
      auth_id: row.auth_id,
      name: row.name,
      email: row.email,
      avatar_url: row.avatar_url,
      role: {
        id: row.role_id,
        label: row.label,
      },
    }));
  }

  const res =
    await sql`SELECT u.id,u.email,u.name,u.avatar_url,u.auth_id,u.role_id, r.label FROM public."USERS" u LEFT OUTER JOIN public."ROLES" r ON u.role_id = r.id`;

  return res.map((row) => ({
    id: row.id,
    auth_id: row.auth_id,
    name: row.name,
    email: row.email,
    avatar_url: row.avatar_url,
    role: {
      id: row.role_id,
      label: row.label,
    },
  }));
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

export async function uploadFileAvatar(
  userId: string,
  mimetype: string,
  buffer: Buffer,
) {
  const avatarId = crypto.randomUUID();
  // Generate a unique file name
  const filePath = `${userId}/${avatarId}`;

  // Upload file to Supabase Storage
  const { error } = await supabase.storage
    .from("avatars") // Storage bucket name
    .upload(filePath, buffer, {
      contentType: mimetype || "image/png",
      upsert: true,
    });

  if (error) throw error;

  const avatarPublicUrl = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath).data.publicUrl;

  return avatarPublicUrl;
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
