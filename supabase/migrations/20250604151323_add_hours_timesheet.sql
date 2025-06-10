alter table "public"."timesheet" add column "hours" smallint not null;

alter table "public"."timesheet" add constraint "timesheet_hours_check" CHECK ((hours > 0)) not valid;

alter table "public"."timesheet" validate constraint "timesheet_hours_check";


