import { IUser } from "@bitrock/types";
import { supabase } from "../(config)/supabase";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const REDIRECT_URL =
  process.env.NEXT_PUBLIC_REDIRECT_URL ?? "http://localhost:8080/";

// *** AUTH

const getURL = () => {
  let url = REDIRECT_URL;
  url = url.startsWith("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
};

export async function loginUser() {
  const res = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getURL(),
    },
  });

  return res;
}

export async function logoutUser() {
  const res = await supabase.auth.signOut();
  return res;
}

export async function getUserInfo({ token }: { token: string }) {
  const res = await fetch(`${BASE_URL}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
  return res as IUser;
}
