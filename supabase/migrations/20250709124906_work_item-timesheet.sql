alter table "public"."timesheet" drop constraint "timesheet_project_id_fkey";

alter table "public"."timesheet" drop column "project_id";

alter table "public"."timesheet" add column "work_item_id" uuid not null;

alter table "public"."timesheet" add constraint "timesheet_work_item_id_fkey" FOREIGN KEY (work_item_id) REFERENCES work_items(id) not valid;

alter table "public"."timesheet" validate constraint "timesheet_work_item_id_fkey";


