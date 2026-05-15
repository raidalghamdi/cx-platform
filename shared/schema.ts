import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/* ─────────────────────────── Users (auth-light) ─────────────────────────── */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});
export const insertUserSchema = createInsertSchema(users).pick({ username: true, password: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

/* ─────────────────────────── Admin / platform users ─────────────────────────── */
// Mirrors client/src/lib/seed.ts ADMIN_USERS so Admin > Users can be edited.
export const adminUsers = sqliteTable("admin_users", {
  id: text("id").primaryKey(),
  name_en: text("name_en").notNull(),
  name_ar: text("name_ar").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),               // executive | supervisor | agent | quality | customer | admin
  function_en: text("function_en").notNull().default(""),
  function_ar: text("function_ar").notNull().default(""),
  status: text("status").notNull().default("active"), // active | leave
});
export const insertAdminUserSchema = createInsertSchema(adminUsers);
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

/* ─────────────────────────── Service Journeys ─────────────────────────── */
// SQLite has no array column → store full Journey object as JSON text.
// `data` is the Journey object from client/src/lib/seedJourneys.ts (bilingual).
export const journeys = sqliteTable("journeys", {
  id: text("id").primaryKey(),
  data: text("data").notNull(),               // JSON.stringify(Journey)
  updatedAt: integer("updated_at").notNull(),
});
export const insertJourneySchema = z.object({
  id: z.string().min(1),
  data: z.string().min(1),                    // raw JSON string
});
export type InsertJourney = z.infer<typeof insertJourneySchema>;
export type JourneyRow = typeof journeys.$inferSelect;

/* ─────────────────────────── KPIs ─────────────────────────── */
export const kpis = sqliteTable("kpis", {
  id: text("id").primaryKey(),                // e.g. "csat", "nps", "ces", "fcr", "sla", "open"
  label_en: text("label_en").notNull(),
  label_ar: text("label_ar").notNull(),
  value: text("value").notNull(),             // store as text — flexible (e.g. "82.1%", "+6")
  delta: text("delta").notNull().default(""), // e.g. "+1.2", "-0.3"
  unit: text("unit").notNull().default(""),
  target: text("target").notNull().default(""),
  inverted: integer("inverted", { mode: "boolean" }).notNull().default(false),
  category: text("category").notNull().default("experience"),
});
export const insertKpiSchema = createInsertSchema(kpis);
export type InsertKpi = z.infer<typeof insertKpiSchema>;
export type Kpi = typeof kpis.$inferSelect;

/* ─────────────────────────── Public Consultations ─────────────────────────── */
export const consultations = sqliteTable("consultations", {
  id: text("id").primaryKey(),
  title_en: text("title_en").notNull(),
  title_ar: text("title_ar").notNull(),
  summary_en: text("summary_en").notNull().default(""),
  summary_ar: text("summary_ar").notNull().default(""),
  status: text("status").notNull().default("open"),       // open | closed | published
  opensAt: text("opens_at").notNull().default(""),
  closesAt: text("closes_at").notNull().default(""),
  participants: integer("participants").notNull().default(0),
  responses: integer("responses").notNull().default(0),
  url: text("url").notNull().default(""),
});
export const insertConsultationSchema = createInsertSchema(consultations);
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;

/* ─────────────────────────── Before / After service redesign ─────────────────────────── */
export const beforeAfter = sqliteTable("before_after", {
  id: text("id").primaryKey(),
  service_en: text("service_en").notNull(),
  service_ar: text("service_ar").notNull(),
  before_en: text("before_en").notNull().default(""),
  before_ar: text("before_ar").notNull().default(""),
  after_en: text("after_en").notNull().default(""),
  after_ar: text("after_ar").notNull().default(""),
  improvementPct: text("improvement_pct").notNull().default(""),
  metric_en: text("metric_en").notNull().default(""),
  metric_ar: text("metric_ar").notNull().default(""),
});
export const insertBeforeAfterSchema = createInsertSchema(beforeAfter);
export type InsertBeforeAfter = z.infer<typeof insertBeforeAfterSchema>;
export type BeforeAfter = typeof beforeAfter.$inferSelect;

/* ─────────────────────────── CX Improvement Initiatives ─────────────────────────── */
export const initiatives = sqliteTable("initiatives", {
  id: text("id").primaryKey(),
  title_en: text("title_en").notNull(),
  title_ar: text("title_ar").notNull(),
  owner_en: text("owner_en").notNull().default(""),
  owner_ar: text("owner_ar").notNull().default(""),
  status: text("status").notNull().default("planned"),    // planned | in-progress | completed | on-hold
  priority: text("priority").notNull().default("medium"), // low | medium | high | urgent
  progress: integer("progress").notNull().default(0),     // 0..100
  startDate: text("start_date").notNull().default(""),
  endDate: text("end_date").notNull().default(""),
});
export const insertInitiativeSchema = createInsertSchema(initiatives);
export type InsertInitiative = z.infer<typeof insertInitiativeSchema>;
export type Initiative = typeof initiatives.$inferSelect;
