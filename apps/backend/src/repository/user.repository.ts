import { ICreateUser, IUpdateUser, IUser } from "@bitrock/types";
import { sql } from "../config/postgres";
import { db } from "../config/prisma";
import { supabase } from "../config/supabase";

// GET

export async function getUserByEmail(email: string) {
  return db.user.findFirst({
    include: { role: true },
    where: { email },
  });
}
export async function getUserById(id: string): Promise<IUser | null> {
  const res = await db.user.findUnique({
    include: { role: true },
    where: { id },
  });
  if (!res) return null;
  return {
    id: res.id,
    name: res.name,
    email: res.email,
    avatar_url: res.avatar_url ?? undefined,
    ...(res.role?.id && {
      role: { id: res.role.id, label: res.role.label },
    }),
  };
}

export async function getUsers(params: string) {
  return db.user.findMany({
    include: { role: true },
    where: {
      OR: [
        { name: { contains: params, mode: "insensitive" } },
        { email: { contains: params, mode: "insensitive" } },
      ],
    },
  });
}

// POST

export async function createUserFromAuth(
  authId: string,
  user: ICreateUser,
): Promise<IUser> {
  const res = user.avatar_url
    ? await sql`INSERT INTO public."user" (name, email, avatar_url) VALUES (${user.name}, ${user.email}, ${user.avatar_url}) RETURNING *`
    : await sql`INSERT INTO public."user" (name, email) VALUES (${user.name}, ${user.email}) RETURNING *`;
  return res[0] as IUser;
}

export async function createUserManually(user: ICreateUser) {
  return db.user.create({
    data: {
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url ?? undefined,
    },
  });
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
    await sql`UPDATE public."user" SET ${sql(user)} WHERE id = ${id} RETURNING *`;
  if (!res) return null;
  return res[0] as IUser;
}
