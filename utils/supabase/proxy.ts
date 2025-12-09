import { createUserInfo } from "@/app/server-actions/user/createUserInfo";
import { getUserInfo, type UserInfo } from "@/app/server-actions/user/getUserInfo";
import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { jwtDecode } from "jwt-decode";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supbaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supbaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supbaseUrl || !supbaseAnonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined");
  }

  const supabase = createServerClient(supbaseUrl, supbaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathNames = ["login", "auth", "error", "auth/callback"];

  if (!user && !pathNames.some((path) => request.nextUrl.pathname.startsWith(`/${path}`))) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  // 🔑 Add custom user info from token
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  if (token) {
    const decodedToken = jwtDecode(token) as { email: string };
    let userInfo: UserInfo | null = null;
    try {
      userInfo = await getUserInfo(decodedToken.email);
      // Option 2: Or alternatively, a header (less secure)
    } catch (err) {
      console.error("Failed to fetch userInfo:", err);
      userInfo = await createUserInfo(user ?? undefined);

      // const url = request.nextUrl.clone();
      // url.pathname = "/login";
      // return NextResponse.redirect(url);
    } finally {
      // Option 1: Add to a secure cookie
      supabaseResponse.cookies.set("x-user-info", JSON.stringify(userInfo), {
        httpOnly: true,
        secure: true,
        path: "/",
      });
    }
  }

  return supabaseResponse;
}
