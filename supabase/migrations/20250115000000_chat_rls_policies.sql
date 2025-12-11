-- RLS policies for chat_session table
create policy "Enable insert for authenticated users"
on "public"."chat_session"
as permissive
for insert
to authenticated
with check (auth.uid()::text = user_id::text);

create policy "Enable select for authenticated users on own sessions"
on "public"."chat_session"
as permissive
for select
to authenticated
using (auth.uid()::text = user_id::text);

create policy "Enable update for authenticated users on own sessions"
on "public"."chat_session"
as permissive
for update
to authenticated
using (auth.uid()::text = user_id::text)
with check (auth.uid()::text = user_id::text);

create policy "Enable delete for authenticated users on own sessions"
on "public"."chat_session"
as permissive
for delete
to authenticated
using (auth.uid()::text = user_id::text);

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
    and "chat_session"."user_id"::text = auth.uid()::text
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
    and "chat_session"."user_id"::text = auth.uid()::text
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
    and "chat_session"."user_id"::text = auth.uid()::text
  )
)
with check (
  exists (
    select 1
    from "public"."chat_session"
    where "chat_session"."id" = "message"."chat_session_id"
    and "chat_session"."user_id"::text = auth.uid()::text
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
    and "chat_session"."user_id"::text = auth.uid()::text
  )
);
