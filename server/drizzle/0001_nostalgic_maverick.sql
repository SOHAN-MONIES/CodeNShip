CREATE TYPE "public"."file_type" AS ENUM('file', 'folder');--> statement-breakpoint
CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"parent_id" uuid,
	"name" varchar(255) NOT NULL,
	"type" "file_type" NOT NULL,
	"content" text,
	"language" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL
);
