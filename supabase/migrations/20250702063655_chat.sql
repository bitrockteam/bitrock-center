create table "public"."chat_session" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "title" text not null,
    "last_message" text,
    "last_updated" timestamp with time zone not null default now()
);


create table "public"."message" (
    "id" uuid not null default gen_random_uuid(),
    "chat_session_id" uuid not null,
    "type" text not null,
    "content" text not null,
    "timestamp" timestamp with time zone not null default now(),
    "is_json" boolean default false,
    "json_data" jsonb,
    "confirmed" boolean
);


CREATE UNIQUE INDEX chat_session_pkey ON public.chat_session USING btree (id);

CREATE INDEX idx_message_chat_session_id ON public.message USING btree (chat_session_id);

CREATE UNIQUE INDEX message_pkey ON public.message USING btree (id);

alter table "public"."chat_session" add constraint "chat_session_pkey" PRIMARY KEY using index "chat_session_pkey";

alter table "public"."message" add constraint "message_pkey" PRIMARY KEY using index "message_pkey";

alter table "public"."chat_session" add constraint "chat_session_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE not valid;

alter table "public"."chat_session" validate constraint "chat_session_user_id_fkey";

alter table "public"."message" add constraint "message_chat_session_id_fkey" FOREIGN KEY (chat_session_id) REFERENCES chat_session(id) ON DELETE CASCADE not valid;

alter table "public"."message" validate constraint "message_chat_session_id_fkey";

alter table "public"."message" add constraint "message_type_check" CHECK ((type = ANY (ARRAY['user'::text, 'bot'::text]))) not valid;

alter table "public"."message" validate constraint "message_type_check";

grant delete on table "public"."chat_session" to "anon";

grant insert on table "public"."chat_session" to "anon";

grant references on table "public"."chat_session" to "anon";

grant select on table "public"."chat_session" to "anon";

grant trigger on table "public"."chat_session" to "anon";

grant truncate on table "public"."chat_session" to "anon";

grant update on table "public"."chat_session" to "anon";

grant delete on table "public"."chat_session" to "authenticated";

grant insert on table "public"."chat_session" to "authenticated";

grant references on table "public"."chat_session" to "authenticated";

grant select on table "public"."chat_session" to "authenticated";

grant trigger on table "public"."chat_session" to "authenticated";

grant truncate on table "public"."chat_session" to "authenticated";

grant update on table "public"."chat_session" to "authenticated";

grant delete on table "public"."chat_session" to "service_role";

grant insert on table "public"."chat_session" to "service_role";

grant references on table "public"."chat_session" to "service_role";

grant select on table "public"."chat_session" to "service_role";

grant trigger on table "public"."chat_session" to "service_role";

grant truncate on table "public"."chat_session" to "service_role";

grant update on table "public"."chat_session" to "service_role";

grant delete on table "public"."message" to "anon";

grant insert on table "public"."message" to "anon";

grant references on table "public"."message" to "anon";

grant select on table "public"."message" to "anon";

grant trigger on table "public"."message" to "anon";

grant truncate on table "public"."message" to "anon";

grant update on table "public"."message" to "anon";

grant delete on table "public"."message" to "authenticated";

grant insert on table "public"."message" to "authenticated";

grant references on table "public"."message" to "authenticated";

grant select on table "public"."message" to "authenticated";

grant trigger on table "public"."message" to "authenticated";

grant truncate on table "public"."message" to "authenticated";

grant update on table "public"."message" to "authenticated";

grant delete on table "public"."message" to "service_role";

grant insert on table "public"."message" to "service_role";

grant references on table "public"."message" to "service_role";

grant select on table "public"."message" to "service_role";

grant trigger on table "public"."message" to "service_role";

grant truncate on table "public"."message" to "service_role";

grant update on table "public"."message" to "service_role";


