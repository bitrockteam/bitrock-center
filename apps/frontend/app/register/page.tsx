import { getUserInfoFromCookie } from "@/utils/supabase/server";
import RegisterPage from "./register-page";

export default async function Register() {
  const user = await getUserInfoFromCookie();
  return <RegisterPage user={user} />;
}
