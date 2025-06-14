import { ICreateUser, IUpdateUser, IUser } from "@bitrock/types";
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

export async function getUsers(params?: string) {
  return db.user.findMany({
    include: { role: true, allocation: true },
    orderBy: { name: "asc" },
    where: params
      ? {
          OR: [
            { name: { contains: params, mode: "insensitive" } },
            { email: { contains: params, mode: "insensitive" } },
          ],
        }
      : undefined,
  });
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

export async function updateUser(id: string, user: Partial<IUpdateUser>) {
  const res = await db.user.update({
    where: { id },
    data: user,
  });
  if (!res) return null;
  return res as IUser;
}
