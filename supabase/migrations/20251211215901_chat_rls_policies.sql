-- Function to get the current user's id from the public.user table
-- This maps auth.users.id (from auth.uid()) to public.user.id via email
create or replace function public.get_current_user_id()
returns uuid
language plpgsql
security definer
stable
as $$
declare
  user_email text;
  user_id uuid;
begin
  -- Get the email from the authenticated user
  user_email := (select email from auth.users where id = auth.uid());
  
  if user_email is null then
    return null;
  end if;
  
  -- Get the user id from the public.user table
  select id into user_id from public.user where email = user_email;
  
  return user_id;
end;
$$;

-- RLS policies for chat_session table
create policy "Enable insert for authenticated users"
on "public"."chat_session"
as permissive
for insert
to authenticated
with check (public.get_current_user_id() = user_id);

create policy "Enable select for authenticated users on own sessions"
on "public"."chat_session"
as permissive
for select
to authenticated
using (public.get_current_user_id() = user_id);

create policy "Enable update for authenticated users on own sessions"
on "public"."chat_session"
as permissive
for update
to authenticated
using (public.get_current_user_id() = user_id)
with check (public.get_current_user_id() = user_id);

create policy "Enable delete for authenticated users on own sessions"
on "public"."chat_session"
as permissive
for delete
to authenticated
using (public.get_current_user_id() = user_id);

-- RLS policies for message table
create policy "Enable insert for authenticated users on own sessions"
on "public"."message"
as permissive
for insert
to authenticated
with check (
  exists (
    select 1
    from "public"."chat_session"
    where "chat_session"."id" = "message"."chat_session_id"
    and "chat_session"."user_id" = public.get_current_user_id()
  )
);

create policy "Enable select for authenticated users on own sessions"
on "public"."message"
as permissive
for select
to authenticated
using (
  exists (
    select 1
    from "public"."chat_session"
    where "chat_session"."id" = "message"."chat_session_id"
    and "chat_session"."user_id" = public.get_current_user_id()
  )
);

create policy "Enable update for authenticated users on own sessions"
on "public"."message"
as permissive
for update
to authenticated
using (
  exists (
    select 1
    from "public"."chat_session"
    where "chat_session"."id" = "message"."chat_session_id"
    and "chat_session"."user_id" = public.get_current_user_id()
  )
)
with check (
  exists (
    select 1
    from "public"."chat_session"
    where "chat_session"."id" = "message"."chat_session_id"
    and "chat_session"."user_id" = public.get_current_user_id()
  )
);

create policy "Enable delete for authenticated users on own sessions"
on "public"."message"
as permissive
for delete
to authenticated
using (
  exists (
    select 1
    from "public"."chat_session"
    where "chat_session"."id" = "message"."chat_session_id"
    and "chat_session"."user_id" = public.get_current_user_id()
  )
);



