import {
  users,
  journeys,
  kpis,
  consultations,
  beforeAfter,
  initiatives,
  adminUsers,
} from "@shared/schema";
import type {
  User,
  InsertUser,
  JourneyRow,
  InsertJourney,
  Kpi,
  InsertKpi,
  Consultation,
  InsertConsultation,
  BeforeAfter,
  InsertBeforeAfter,
  Initiative,
  InsertInitiative,
  AdminUser,
  InsertAdminUser,
} from "@shared/schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq } from "drizzle-orm";

const sqlite = new Database("data.db");
sqlite.pragma("journal_mode = WAL");

// Auto-migrate: drizzle-kit isn't run at runtime, so create tables if missing.
// This keeps storage zero-config for the demo deployment.
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    function_en TEXT NOT NULL DEFAULT '',
    function_ar TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'active'
  );
  CREATE TABLE IF NOT EXISTS journeys (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS kpis (
    id TEXT PRIMARY KEY,
    label_en TEXT NOT NULL,
    label_ar TEXT NOT NULL,
    value TEXT NOT NULL,
    delta TEXT NOT NULL DEFAULT '',
    unit TEXT NOT NULL DEFAULT '',
    target TEXT NOT NULL DEFAULT '',
    inverted INTEGER NOT NULL DEFAULT 0,
    category TEXT NOT NULL DEFAULT 'experience'
  );
  CREATE TABLE IF NOT EXISTS consultations (
    id TEXT PRIMARY KEY,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    summary_en TEXT NOT NULL DEFAULT '',
    summary_ar TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'open',
    opens_at TEXT NOT NULL DEFAULT '',
    closes_at TEXT NOT NULL DEFAULT '',
    participants INTEGER NOT NULL DEFAULT 0,
    responses INTEGER NOT NULL DEFAULT 0,
    url TEXT NOT NULL DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS before_after (
    id TEXT PRIMARY KEY,
    service_en TEXT NOT NULL,
    service_ar TEXT NOT NULL,
    before_en TEXT NOT NULL DEFAULT '',
    before_ar TEXT NOT NULL DEFAULT '',
    after_en TEXT NOT NULL DEFAULT '',
    after_ar TEXT NOT NULL DEFAULT '',
    improvement_pct TEXT NOT NULL DEFAULT '',
    metric_en TEXT NOT NULL DEFAULT '',
    metric_ar TEXT NOT NULL DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS initiatives (
    id TEXT PRIMARY KEY,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    owner_en TEXT NOT NULL DEFAULT '',
    owner_ar TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'planned',
    priority TEXT NOT NULL DEFAULT 'medium',
    progress INTEGER NOT NULL DEFAULT 0,
    start_date TEXT NOT NULL DEFAULT '',
    end_date TEXT NOT NULL DEFAULT ''
  );
`);

export const db = drizzle(sqlite);

/* ─────────────────────────── Storage interface ─────────────────────────── */
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Admin users
  listAdminUsers(): Promise<AdminUser[]>;
  getAdminUser(id: string): Promise<AdminUser | undefined>;
  upsertAdminUser(u: InsertAdminUser): Promise<AdminUser>;
  deleteAdminUser(id: string): Promise<{ changes: number }>;

  // Journeys (full JSON blob per row)
  listJourneys(): Promise<JourneyRow[]>;
  getJourney(id: string): Promise<JourneyRow | undefined>;
  upsertJourney(j: InsertJourney): Promise<JourneyRow>;
  deleteJourney(id: string): Promise<{ changes: number }>;
  bulkReplaceJourneys(rows: InsertJourney[]): Promise<number>;

  // KPIs
  listKpis(): Promise<Kpi[]>;
  upsertKpi(k: InsertKpi): Promise<Kpi>;
  deleteKpi(id: string): Promise<{ changes: number }>;
  bulkReplaceKpis(rows: InsertKpi[]): Promise<number>;

  // Consultations
  listConsultations(): Promise<Consultation[]>;
  upsertConsultation(c: InsertConsultation): Promise<Consultation>;
  deleteConsultation(id: string): Promise<{ changes: number }>;

  // Before / After
  listBeforeAfter(): Promise<BeforeAfter[]>;
  upsertBeforeAfter(b: InsertBeforeAfter): Promise<BeforeAfter>;
  deleteBeforeAfter(id: string): Promise<{ changes: number }>;

  // Initiatives
  listInitiatives(): Promise<Initiative[]>;
  upsertInitiative(i: InsertInitiative): Promise<Initiative>;
  deleteInitiative(id: string): Promise<{ changes: number }>;
}

export class DatabaseStorage implements IStorage {
  /* Users */
  async getUser(id: number) {
    return db.select().from(users).where(eq(users.id, id)).get();
  }
  async getUserByUsername(username: string) {
    return db.select().from(users).where(eq(users.username, username)).get();
  }
  async createUser(insertUser: InsertUser) {
    return db.insert(users).values(insertUser).returning().get();
  }

  /* Admin users */
  async listAdminUsers() {
    return db.select().from(adminUsers).all();
  }
  async getAdminUser(id: string) {
    return db.select().from(adminUsers).where(eq(adminUsers.id, id)).get();
  }
  async upsertAdminUser(u: InsertAdminUser) {
    const existing = await this.getAdminUser(u.id);
    if (existing) {
      return db.update(adminUsers).set(u).where(eq(adminUsers.id, u.id)).returning().get();
    }
    return db.insert(adminUsers).values(u).returning().get();
  }
  async deleteAdminUser(id: string) {
    return db.delete(adminUsers).where(eq(adminUsers.id, id)).run();
  }

  /* Journeys */
  async listJourneys() {
    return db.select().from(journeys).all();
  }
  async getJourney(id: string) {
    return db.select().from(journeys).where(eq(journeys.id, id)).get();
  }
  async upsertJourney(j: InsertJourney) {
    const row = { ...j, updatedAt: Date.now() };
    const existing = await this.getJourney(j.id);
    if (existing) {
      return db.update(journeys).set(row).where(eq(journeys.id, j.id)).returning().get();
    }
    return db.insert(journeys).values(row).returning().get();
  }
  async deleteJourney(id: string) {
    return db.delete(journeys).where(eq(journeys.id, id)).run();
  }
  async bulkReplaceJourneys(rows: InsertJourney[]) {
    db.delete(journeys).run();
    const now = Date.now();
    for (const r of rows) db.insert(journeys).values({ ...r, updatedAt: now }).run();
    return rows.length;
  }

  /* KPIs */
  async listKpis() {
    return db.select().from(kpis).all();
  }
  async upsertKpi(k: InsertKpi) {
    const existing = db.select().from(kpis).where(eq(kpis.id, k.id)).get();
    if (existing) {
      return db.update(kpis).set(k).where(eq(kpis.id, k.id)).returning().get();
    }
    return db.insert(kpis).values(k).returning().get();
  }
  async deleteKpi(id: string) {
    return db.delete(kpis).where(eq(kpis.id, id)).run();
  }
  async bulkReplaceKpis(rows: InsertKpi[]) {
    db.delete(kpis).run();
    for (const r of rows) db.insert(kpis).values(r).run();
    return rows.length;
  }

  /* Consultations */
  async listConsultations() {
    return db.select().from(consultations).all();
  }
  async upsertConsultation(c: InsertConsultation) {
    const existing = db.select().from(consultations).where(eq(consultations.id, c.id)).get();
    if (existing) {
      return db.update(consultations).set(c).where(eq(consultations.id, c.id)).returning().get();
    }
    return db.insert(consultations).values(c).returning().get();
  }
  async deleteConsultation(id: string) {
    return db.delete(consultations).where(eq(consultations.id, id)).run();
  }

  /* Before / After */
  async listBeforeAfter() {
    return db.select().from(beforeAfter).all();
  }
  async upsertBeforeAfter(b: InsertBeforeAfter) {
    const existing = db.select().from(beforeAfter).where(eq(beforeAfter.id, b.id)).get();
    if (existing) {
      return db.update(beforeAfter).set(b).where(eq(beforeAfter.id, b.id)).returning().get();
    }
    return db.insert(beforeAfter).values(b).returning().get();
  }
  async deleteBeforeAfter(id: string) {
    return db.delete(beforeAfter).where(eq(beforeAfter.id, id)).run();
  }

  /* Initiatives */
  async listInitiatives() {
    return db.select().from(initiatives).all();
  }
  async upsertInitiative(i: InsertInitiative) {
    const existing = db.select().from(initiatives).where(eq(initiatives.id, i.id)).get();
    if (existing) {
      return db.update(initiatives).set(i).where(eq(initiatives.id, i.id)).returning().get();
    }
    return db.insert(initiatives).values(i).returning().get();
  }
  async deleteInitiative(id: string) {
    return db.delete(initiatives).where(eq(initiatives.id, id)).run();
  }
}

export const storage = new DatabaseStorage();
