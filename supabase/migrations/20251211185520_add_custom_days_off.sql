-- Add custom days off fields to user table
ALTER TABLE "public"."user" 
ADD COLUMN IF NOT EXISTS "custom_days_off_left" smallint,
ADD COLUMN IF NOT EXISTS "custom_days_off_planned" smallint;

COMMENT ON COLUMN "public"."user"."custom_days_off_left" IS 'Custom override for days off left (user-editable)';
COMMENT ON COLUMN "public"."user"."custom_days_off_planned" IS 'Custom override for days off planned (user-editable)';
