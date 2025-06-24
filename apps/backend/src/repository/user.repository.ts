import { user } from "@bitrock/db";
import { db } from "../config/prisma";
import { supabase } from "../config/supabase";

// GET

export async function getUserByEmail(email: string) {
  return db.user.findFirst({
    where: { email },
  });
}
export async function getUserById(id: string) {
  const res = await db.user.findUnique({
    where: { id },
  });
  console.log({ res2: res });
  if (!res) return null;

  return {
    id: res.id,
    name: res.name,
    email: res.email,
    avatar_url: res.avatar_url ?? undefined,
    role: res.role,
    referent_id: res.referent_id ?? undefined,
  };
}

export async function getUsers(params?: string) {
  return db.user.findMany({
    include: { allocation: true },
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

export async function createUserManually(
  user: Omit<user, "id" | "created_at">,
) {
  return db.user.create({
    data: {
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url ?? undefined,
      role: user.role,
      referent_id: user.referent_id ?? undefined,
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

export async function updateUser(id: string, user: Partial<user>) {
  return db.user.update({
    where: { id },
    data: {
      name: user.name ?? undefined,
      avatar_url: user.avatar_url ?? undefined,
      role: user.role ?? undefined,
      referent_id: user.referent_id ?? undefined,
    },
  });
}
