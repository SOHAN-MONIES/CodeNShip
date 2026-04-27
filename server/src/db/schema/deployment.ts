import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    text
} from "drizzle-orm/pg-core";

export const deployments = pgTable("deployments", {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").notNull(),
    fileId: uuid("file_id").notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    url: text("url"),
    content: text("content"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
