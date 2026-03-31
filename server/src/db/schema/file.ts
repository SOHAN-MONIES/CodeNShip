import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";

/* FILE TYPE ENUM */
export const fileTypeEnum = pgEnum(
    "file_type",
    ["file", "folder"]
);

/* FILE TABLE */
export const files = pgTable("files", {
    id: uuid("id")
        .primaryKey()
        .defaultRandom(),

    projectId: uuid("project_id")
        .notNull(),

    parentId: uuid("parent_id"),

    name: varchar("name", {
        length: 255,
    }).notNull(),

    type: fileTypeEnum("type")
        .notNull(),

    content: text("content"),

    language: varchar("language", {
        length: 50,
    }),

    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
});
