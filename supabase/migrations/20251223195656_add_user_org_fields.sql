-- Migration: Add organizational fields to user table
-- This migration adds title, posizione, area, societa, and altri_ruoli fields to the user table
-- and creates supporting tables for area and societa

-- Create area table
CREATE TABLE IF NOT EXISTS "public"."area" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  "name" TEXT NOT NULL UNIQUE
);

-- Create societa table
CREATE TABLE IF NOT EXISTS "public"."societa" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  "name" TEXT NOT NULL UNIQUE
);

-- Add new columns to user table
ALTER TABLE "public"."user"
  ADD COLUMN IF NOT EXISTS "title" TEXT,
  ADD COLUMN IF NOT EXISTS "posizione" TEXT,
  ADD COLUMN IF NOT EXISTS "area_id" UUID,
  ADD COLUMN IF NOT EXISTS "societa_id" UUID,
  ADD COLUMN IF NOT EXISTS "altri_ruoli" TEXT[] DEFAULT '{}';

-- Add foreign key constraints
ALTER TABLE "public"."user"
  ADD CONSTRAINT "user_area_id_fkey" 
    FOREIGN KEY ("area_id") 
    REFERENCES "public"."area"("id") 
    ON DELETE SET NULL 
    ON UPDATE NO ACTION;

ALTER TABLE "public"."user"
  ADD CONSTRAINT "user_societa_id_fkey" 
    FOREIGN KEY ("societa_id") 
    REFERENCES "public"."societa"("id") 
    ON DELETE SET NULL 
    ON UPDATE NO ACTION;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "user_area_id_idx" ON "public"."user"("area_id");
CREATE INDEX IF NOT EXISTS "user_societa_id_idx" ON "public"."user"("societa_id");

-- Add comments for documentation
COMMENT ON COLUMN "public"."user"."title" IS 'Main role/title (e.g., "CEO", "Head of Engineering", "Manager", "SE", "SSE", "JSE")';
COMMENT ON COLUMN "public"."user"."posizione" IS 'Position code/level (e.g., "SE", "SSE", "JSE", "FE", "SFE", "DE", "SQAE", "ME", "SME")';
COMMENT ON COLUMN "public"."user"."area_id" IS 'Reference to business area/unit';
COMMENT ON COLUMN "public"."user"."societa_id" IS 'Reference to company (ProActivity, Fortitude, Bitrock, Waterstream)';
COMMENT ON COLUMN "public"."user"."altri_ruoli" IS 'Additional roles array';

