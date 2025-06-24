"use server";
import { SERVERL_BASE_URL } from "@/config";
import { checkSession } from "@/utils/supabase/server";

export async function uploadFile({ file }: { file: FormData }) {
  const session = await checkSession();

  return fetch(`${SERVERL_BASE_URL}/user/avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    body: file,
  })
    .then((res) => res.json())
    .then((data) => data);
}
