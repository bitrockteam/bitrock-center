create type "public"."PermitStatus" as enum ('PENDING', 'REJECTED', 'APPROVED');

create type "public"."PermitType" as enum ('VACATION', 'SICKNESS', 'PERMISSION');

alter table "public"."permit" alter column "status" drop default;

alter table "public"."permit" alter column "status" set data type "PermitStatus" using "status"::"PermitStatus";

alter table "public"."permit" alter column "type" drop default;

alter table "public"."permit" alter column "type" set data type "PermitType" using "type"::"PermitType";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.execute_sql(sql text)
 RETURNS SETOF jsonb
 LANGUAGE plpgsql
AS $function$
declare
  result jsonb;
begin
  for result in execute format('SELECT row_to_json(t) FROM (%s) t', sql)
  loop
    return next result;
  end loop;
end;
$function$
;


