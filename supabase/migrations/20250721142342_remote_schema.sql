alter table "public"."timesheet" drop constraint "timesheet_work_item_id_fkey";

alter table "public"."allocation" disable row level security;

alter table "public"."permit" disable row level security;

alter table "public"."project" disable row level security;

alter table "public"."timesheet" drop column "work_item_id";

alter table "public"."timesheet" add column "project_id" uuid not null;

alter table "public"."timesheet" disable row level security;

alter table "public"."timesheet" add constraint "timesheet_project_id_fkey" FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE not valid;

alter table "public"."timesheet" validate constraint "timesheet_project_id_fkey";

create policy "Enable insert for authenticated users only"
on "public"."user"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."user"
as permissive
for select
to public
using (true);



