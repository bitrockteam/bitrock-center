alter type "public"."Permissions" rename to "Permissions__old_version_to_be_dropped";

create type "public"."Permissions" as enum ('CAN_CREATE_CLIENT', 'CAN_EDIT_CLIENT', 'CAN_CREATE_WORK_ITEM', 'CAN_EDIT_WORK_ITEM', 'CAN_EDIT_WORKING_DAY', 'CAN_APPROVE_PERMIT', 'CAN_CREATE_PROJECT', 'CAN_EDIT_PROJECT', 'CAN_SEE_OTHERS_TIMESHEET', 'CAN_ALLOCATE_RESOURCE', 'CAN_CREATE_USER', 'CAN_EDIT_USER', 'CAN_SEE_CLIENT', 'CAN_SEE_WORK_ITEM', 'CAN_SEE_PERMISSIONS', 'CAN_DEAL_PERMISSIONS');

alter table "public"."permission" alter column id type "public"."Permissions" using id::text::"public"."Permissions";

alter table "public"."user_permission" alter column permission_id type "public"."Permissions" using permission_id::text::"public"."Permissions";

drop type "public"."Permissions__old_version_to_be_dropped";

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
to authenticated
using (true);


create policy "Enable read access for all users"
on "public"."user_permission"
as permissive
for select
to public
using (true);



