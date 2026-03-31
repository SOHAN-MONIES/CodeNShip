import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";


export const projectTypeEnum = pgEnum("project_type", [
    "Web",
    "C++",
    "C",
    "Python",
    "Java",
]);

export const projects = pgTable("projects", {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: varchar("user_id", { length: 255 }).notNull(),

    name: varchar("name", { length: 120 }).notNull(),

    type: projectTypeEnum("type").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
});