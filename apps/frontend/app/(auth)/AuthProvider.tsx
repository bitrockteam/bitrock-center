"use client";
import { Loader } from "@/components/custom/Loader";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { api } from "../(config)/client";
import { getUserInfo } from "../(services)/api";

const AuthContext = createContext({
  loading: true as boolean,
  session: undefined as Session | undefined,
});

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [session, setSession] = useState<Session>();
  const [loading, setLoading] = useState(true);
  const redirect = useRouter();

  const token = useMemo(() => session?.access_token, [session]);

  const supabase = createClient();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
      setLoading(true);
      setSession(session ?? undefined);
      try {
        if (session) {
          await getUserInfo({ token: session.access_token })
            .then((res) => {
              console.log({ res });

              if (!res) redirect.push("/register");
            })
            .catch(() => {
              redirect.push("/register");
            });
        }
      } catch (e) {
        toast.error("Uh oh! Something went wrong.");
        console.info(e);
      } finally {
        setLoading(false);
      }
    });
    return () => data.subscription.unsubscribe();
  }, [redirect, supabase.auth]);

  useEffect(() => {
    api.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }, [token]);

  useEffect(() => {
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        toast.error("Uh oh! Something went wrong.");
        throw error;
      },
    );

    return () => {
      api.interceptors.response.eject(api.interceptors.response.use());
    };
  }, [token]);

  const value = useMemo(
    () => ({
      session,
      loading,
    }),
    [loading, session],
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};
