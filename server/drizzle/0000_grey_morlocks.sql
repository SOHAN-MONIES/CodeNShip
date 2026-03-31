CREATE TYPE "public"."project_type" AS ENUM('Web', 'C++', 'C', 'Python', 'Java');--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"name" varchar(120) NOT NULL,
	"type" "project_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
