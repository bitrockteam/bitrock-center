alter table "public"."user" add column "referentId" uuid;

alter table "public"."user" add constraint "user_referentId_fkey" FOREIGN KEY ("referentId") REFERENCES "user"(id) not valid;

alter table "public"."user" validate constraint "user_referentId_fkey";


