"use client";
import { Loader } from "@/components/custom/Loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "../(auth)/AuthProvider";
import { loginUser } from "../(services)/api";

export default function RegisterPage() {
  const router = useRouter();
  const { session, loading } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    loginUser()
      .then(async () => {
        // Here you would typically send the data to your backend
        toast.success("Login successful");
      })
      .then(() => {
        router.push("/");
      });
  };

  useEffect(() => {
    if (loading) return;
    if (session) {
      console.info("User not logged in", session);
      router.push("/");
    }
  }, [loading, router, session]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      {loading ? (
        <Loader />
      ) : (
        <Card className="w-full max-w-md bg-transparent border-2 border-primary/50 text-center">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Please use your Google account to login.
            </CardDescription>
          </CardHeader>

          <>
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
              <Button onClick={handleSubmit}>Login with Google</Button>
            </CardFooter>
          </>
        </Card>
      )}
    </div>
  );
}
