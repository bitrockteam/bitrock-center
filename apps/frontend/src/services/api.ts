import { REDIRECT_URL, SERVERL_BASE_URL } from "@/config";
import { IUser } from "@bitrock/types";
import { jwtDecode } from "jwt-decode";
import { supabase } from "../config/supabase";

interface IToken {
  user_metadata: {
    custom_claims: {
      hd: string;
    };
  };
  user: {
    email: string;
  };
}

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
  return res as IUser;
}

export function verifyBitrockToken({ token }: { token: string }) {
  const tokenInfo: IToken = jwtDecode(token);

  if (tokenInfo.user_metadata.custom_claims.hd === "bitrock.it") return true;

  if (tokenInfo.user.email.endsWith("@bitrock.it")) return true;

  return false;
}
