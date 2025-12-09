import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { login } from "./actions";

export default async function LoginPage() {
  const supabase = await createClient();
  const session = await supabase.auth.getSession();
  console.log({ session });

  if (session.data.session) redirect("/");
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md bg-transparent border-2 border-primary/50 text-center">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Please use your Google account to login.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Image
            src={"/logo-reverse.png"}
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto mb-4"
          />
        </CardContent>

        <CardFooter className="flex justify-center">
          <form>
            <Button formAction={login}>Log in</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

export const dynamic = "force-dynamic";
