create table "public"."development_plan" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "created_date" date not null
);


create table "public"."goal" (
    "id" uuid not null default gen_random_uuid(),
    "development_plan_id" uuid not null,
    "title" text not null,
    "description" text not null
);


create table "public"."todo_item" (
    "id" uuid not null default gen_random_uuid(),
    "goal_id" uuid not null,
    "text" text not null,
    "completed" boolean not null default false
);


CREATE UNIQUE INDEX development_plan_pkey ON public.development_plan USING btree (id);

CREATE UNIQUE INDEX goal_pkey ON public.goal USING btree (id);

CREATE UNIQUE INDEX todo_item_pkey ON public.todo_item USING btree (id);

alter table "public"."development_plan" add constraint "development_plan_pkey" PRIMARY KEY using index "development_plan_pkey";

alter table "public"."goal" add constraint "goal_pkey" PRIMARY KEY using index "goal_pkey";

alter table "public"."todo_item" add constraint "todo_item_pkey" PRIMARY KEY using index "todo_item_pkey";

alter table "public"."development_plan" add constraint "development_plan_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE not valid;

alter table "public"."development_plan" validate constraint "development_plan_user_id_fkey";

alter table "public"."goal" add constraint "goal_development_plan_id_fkey" FOREIGN KEY (development_plan_id) REFERENCES development_plan(id) ON DELETE CASCADE not valid;

alter table "public"."goal" validate constraint "goal_development_plan_id_fkey";

alter table "public"."todo_item" add constraint "todo_item_goal_id_fkey" FOREIGN KEY (goal_id) REFERENCES goal(id) ON DELETE CASCADE not valid;

alter table "public"."todo_item" validate constraint "todo_item_goal_id_fkey";

grant delete on table "public"."development_plan" to "anon";

grant insert on table "public"."development_plan" to "anon";

grant references on table "public"."development_plan" to "anon";

grant select on table "public"."development_plan" to "anon";

grant trigger on table "public"."development_plan" to "anon";

grant truncate on table "public"."development_plan" to "anon";

grant update on table "public"."development_plan" to "anon";

grant delete on table "public"."development_plan" to "authenticated";

grant insert on table "public"."development_plan" to "authenticated";

grant references on table "public"."development_plan" to "authenticated";

grant select on table "public"."development_plan" to "authenticated";

grant trigger on table "public"."development_plan" to "authenticated";

grant truncate on table "public"."development_plan" to "authenticated";

grant update on table "public"."development_plan" to "authenticated";

grant delete on table "public"."development_plan" to "service_role";

grant insert on table "public"."development_plan" to "service_role";

grant references on table "public"."development_plan" to "service_role";

grant select on table "public"."development_plan" to "service_role";

grant trigger on table "public"."development_plan" to "service_role";

grant truncate on table "public"."development_plan" to "service_role";

grant update on table "public"."development_plan" to "service_role";

grant delete on table "public"."goal" to "anon";

grant insert on table "public"."goal" to "anon";

grant references on table "public"."goal" to "anon";

grant select on table "public"."goal" to "anon";

grant trigger on table "public"."goal" to "anon";

grant truncate on table "public"."goal" to "anon";

grant update on table "public"."goal" to "anon";

grant delete on table "public"."goal" to "authenticated";

grant insert on table "public"."goal" to "authenticated";

grant references on table "public"."goal" to "authenticated";

grant select on table "public"."goal" to "authenticated";

grant trigger on table "public"."goal" to "authenticated";

grant truncate on table "public"."goal" to "authenticated";

grant update on table "public"."goal" to "authenticated";

grant delete on table "public"."goal" to "service_role";

grant insert on table "public"."goal" to "service_role";

grant references on table "public"."goal" to "service_role";

grant select on table "public"."goal" to "service_role";

grant trigger on table "public"."goal" to "service_role";

grant truncate on table "public"."goal" to "service_role";

grant update on table "public"."goal" to "service_role";

grant delete on table "public"."todo_item" to "anon";

grant insert on table "public"."todo_item" to "anon";

grant references on table "public"."todo_item" to "anon";

grant select on table "public"."todo_item" to "anon";

grant trigger on table "public"."todo_item" to "anon";

grant truncate on table "public"."todo_item" to "anon";

grant update on table "public"."todo_item" to "anon";

grant delete on table "public"."todo_item" to "authenticated";

grant insert on table "public"."todo_item" to "authenticated";

grant references on table "public"."todo_item" to "authenticated";

grant select on table "public"."todo_item" to "authenticated";

grant trigger on table "public"."todo_item" to "authenticated";

grant truncate on table "public"."todo_item" to "authenticated";

grant update on table "public"."todo_item" to "authenticated";

grant delete on table "public"."todo_item" to "service_role";

grant insert on table "public"."todo_item" to "service_role";

grant references on table "public"."todo_item" to "service_role";

grant select on table "public"."todo_item" to "service_role";

grant trigger on table "public"."todo_item" to "service_role";

grant truncate on table "public"."todo_item" to "service_role";

grant update on table "public"."todo_item" to "service_role";


