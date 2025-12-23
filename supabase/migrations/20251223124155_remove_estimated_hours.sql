-- Drop the existing constraint that references estimated_hours
alter table "public"."work_items" drop constraint if exists "check_time_material_fields";

-- Drop the estimated_hours column
alter table "public"."work_items" drop column if exists "estimated_hours";

-- Recreate the constraint without estimated_hours
alter table "public"."work_items" add constraint "check_time_material_fields" CHECK (
  (
    (type = 'time-material'::work_item_type) AND 
    (hourly_rate IS NOT NULL) AND 
    (fixed_price IS NULL)
  ) OR 
  (
    (type = 'fixed-price'::work_item_type) AND 
    (fixed_price IS NOT NULL) AND 
    (hourly_rate IS NULL)
  )
) not valid;

alter table "public"."work_items" validate constraint "check_time_material_fields";

