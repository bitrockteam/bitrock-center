"use client";
import { supabase } from "../(config)/supabase";
import { IUser } from "@bitrock/types";
import { Session } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { getUserInfo, loginUser } from "../(services)/api";
import { api } from "../(config)/client";

const AuthContext = createContext({
  user: undefined as IUser | undefined,
  login: () => {},
  logout: () => {},
  loading: true as boolean,
  isLogged: false as boolean,
  session: undefined as Session | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUser: (user: IUser | undefined) => {},
});

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [session, setSession] = useState<Session>();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUser>();

  const token = useMemo(() => session?.access_token, [session]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
      setLoading(true);
      setSession(session ?? undefined);
      try {
        if (session && !user) {
          await getUserInfo({ token: session.access_token })
            .then((res) => setUser(res))
            .catch(() => setUser(undefined));
        }
      } catch (e) {
        toast.error("Uh oh! Something went wrong.");
        console.info(e);
      } finally {
        setLoading(false);
      }
    });
    return () => data.subscription.unsubscribe();
  }, [user]);

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
      user,
      login: () => loginUser(),
      logout: () => loginUser(),
      isLogged: !!session,
      session,
      loading,
      setUser,
    }),
    [loading, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};
