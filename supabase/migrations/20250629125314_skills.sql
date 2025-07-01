create type "public"."SeniorityLevel" as enum ('junior', 'middle', 'senior');

create type "public"."SkillCategory" as enum ('hard', 'soft');

create table "public"."skill" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "category" "SkillCategory" not null,
    "description" text,
    "icon" text not null,
    "active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."user_skill" (
    "user_id" uuid not null,
    "skill_id" uuid not null,
    "seniorityLevel" "SeniorityLevel" not null
);


CREATE UNIQUE INDEX skill_pkey ON public.skill USING btree (id);

CREATE UNIQUE INDEX user_skill_pkey ON public.user_skill USING btree (user_id, skill_id);

alter table "public"."skill" add constraint "skill_pkey" PRIMARY KEY using index "skill_pkey";

alter table "public"."user_skill" add constraint "user_skill_pkey" PRIMARY KEY using index "user_skill_pkey";

alter table "public"."user_skill" add constraint "user_skill_skill_id_fkey" FOREIGN KEY (skill_id) REFERENCES skill(id) ON DELETE CASCADE not valid;

alter table "public"."user_skill" validate constraint "user_skill_skill_id_fkey";

alter table "public"."user_skill" add constraint "user_skill_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE not valid;

alter table "public"."user_skill" validate constraint "user_skill_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."skill" to "anon";

grant insert on table "public"."skill" to "anon";

grant references on table "public"."skill" to "anon";

grant select on table "public"."skill" to "anon";

grant trigger on table "public"."skill" to "anon";

grant truncate on table "public"."skill" to "anon";

grant update on table "public"."skill" to "anon";

grant delete on table "public"."skill" to "authenticated";

grant insert on table "public"."skill" to "authenticated";

grant references on table "public"."skill" to "authenticated";

grant select on table "public"."skill" to "authenticated";

grant trigger on table "public"."skill" to "authenticated";

grant truncate on table "public"."skill" to "authenticated";

grant update on table "public"."skill" to "authenticated";

grant delete on table "public"."skill" to "service_role";

grant insert on table "public"."skill" to "service_role";

grant references on table "public"."skill" to "service_role";

grant select on table "public"."skill" to "service_role";

grant trigger on table "public"."skill" to "service_role";

grant truncate on table "public"."skill" to "service_role";

grant update on table "public"."skill" to "service_role";

grant delete on table "public"."user_skill" to "anon";

grant insert on table "public"."user_skill" to "anon";

grant references on table "public"."user_skill" to "anon";

grant select on table "public"."user_skill" to "anon";

grant trigger on table "public"."user_skill" to "anon";

grant truncate on table "public"."user_skill" to "anon";

grant update on table "public"."user_skill" to "anon";

grant delete on table "public"."user_skill" to "authenticated";

grant insert on table "public"."user_skill" to "authenticated";

grant references on table "public"."user_skill" to "authenticated";

grant select on table "public"."user_skill" to "authenticated";

grant trigger on table "public"."user_skill" to "authenticated";

grant truncate on table "public"."user_skill" to "authenticated";

grant update on table "public"."user_skill" to "authenticated";

grant delete on table "public"."user_skill" to "service_role";

grant insert on table "public"."user_skill" to "service_role";

grant references on table "public"."user_skill" to "service_role";

grant select on table "public"."user_skill" to "service_role";

grant trigger on table "public"."user_skill" to "service_role";

grant truncate on table "public"."user_skill" to "service_role";

grant update on table "public"."user_skill" to "service_role";

CREATE TRIGGER trigger_skill_updated_at BEFORE UPDATE ON public.skill FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


