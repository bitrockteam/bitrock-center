import { SERVERL_BASE_URL } from "@/config";
import { user } from "@bitrock/db";

// *** AUTH

export async function getUserInfo({ token }: { token: string }) {
  const res = await fetch(`${SERVERL_BASE_URL}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (res.status !== 200) throw Error("Error fetching user info");
    return res.json();
  });
  return res as user;
}
