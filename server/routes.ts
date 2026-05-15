import type { Express, Request, Response } from "express";
import { createServer } from "node:http";
import type { Server } from "node:http";
import { storage } from "./storage";
import {
  insertJourneySchema,
  insertKpiSchema,
  insertConsultationSchema,
  insertBeforeAfterSchema,
  insertInitiativeSchema,
  insertAdminUserSchema,
} from "@shared/schema";
import { z } from "zod";

/* ─────────────────────── Helper: wrap async handlers ─────────────────────── */
function asyncH<T>(fn: (req: Request, res: Response) => Promise<T>) {
  return (req: Request, res: Response) => {
    fn(req, res).catch((err) => {
      console.error("[api error]", err);
      res.status(500).json({ error: err?.message ?? "Internal error" });
    });
  };
}

function parse<T extends z.ZodTypeAny>(schema: T, body: unknown): z.infer<T> {
  return schema.parse(body);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  /* ────────────── Health ────────────── */
  app.get("/api/health", (_req, res) =>
    res.json({ ok: true, ts: Date.now() }),
  );

  /* ────────────── Journeys ────────────── */
  app.get(
    "/api/journeys",
    asyncH(async (_req, res) => {
      const rows = await storage.listJourneys();
      // Parse JSON blob server-side so clients receive ready-to-use objects.
      const out = rows.map((r) => ({
        id: r.id,
        updatedAt: r.updatedAt,
        ...JSON.parse(r.data),
      }));
      res.json(out);
    }),
  );

  app.get(
    "/api/journeys/:id",
    asyncH(async (req, res) => {
      const row = await storage.getJourney(req.params.id);
      if (!row) return res.status(404).json({ error: "not found" });
      res.json({ id: row.id, updatedAt: row.updatedAt, ...JSON.parse(row.data) });
    }),
  );

  app.post(
    "/api/journeys",
    asyncH(async (req, res) => {
      // Accept either { id, data } where data is already a JSON string,
      // or { id, ...journey } where the rest is the journey object.
      const body = req.body ?? {};
      const id = String(body.id ?? "").trim();
      if (!id) return res.status(400).json({ error: "id required" });
      const data =
        typeof body.data === "string"
          ? body.data
          : JSON.stringify({ ...body, id });
      const row = await storage.upsertJourney(parse(insertJourneySchema, { id, data }));
      res.json(row);
    }),
  );

  app.put("/api/journeys/:id", asyncH(async (req, res) => {
    const id = req.params.id;
    const body = req.body ?? {};
    const data =
      typeof body.data === "string" ? body.data : JSON.stringify({ ...body, id });
    const row = await storage.upsertJourney(parse(insertJourneySchema, { id, data }));
    res.json(row);
  }));

  app.delete("/api/journeys/:id", asyncH(async (req, res) => {
    const r = await storage.deleteJourney(req.params.id);
    res.json(r);
  }));

  // Bulk import — accepts an array of full Journey objects.
  app.post("/api/import/journeys", asyncH(async (req, res) => {
    const items = Array.isArray(req.body) ? req.body : req.body?.items;
    if (!Array.isArray(items)) return res.status(400).json({ error: "array body required" });
    const rows = items
      .filter((j) => j && typeof j.id === "string")
      .map((j) => ({ id: j.id, data: JSON.stringify(j) }));
    const n = await storage.bulkReplaceJourneys(rows);
    res.json({ imported: n });
  }));

  /* ────────────── KPIs ────────────── */
  app.get("/api/kpis", asyncH(async (_req, res) => res.json(await storage.listKpis())));
  app.post("/api/kpis", asyncH(async (req, res) => {
    const k = parse(insertKpiSchema, req.body);
    res.json(await storage.upsertKpi(k));
  }));
  app.put("/api/kpis/:id", asyncH(async (req, res) => {
    const k = parse(insertKpiSchema, { ...req.body, id: req.params.id });
    res.json(await storage.upsertKpi(k));
  }));
  app.delete("/api/kpis/:id", asyncH(async (req, res) => res.json(await storage.deleteKpi(req.params.id))));

  app.post("/api/import/kpis", asyncH(async (req, res) => {
    const items = Array.isArray(req.body) ? req.body : req.body?.items;
    if (!Array.isArray(items)) return res.status(400).json({ error: "array body required" });
    const rows = items.map((i) => parse(insertKpiSchema, i));
    const n = await storage.bulkReplaceKpis(rows);
    res.json({ imported: n });
  }));

  /* ────────────── Consultations ────────────── */
  app.get("/api/consultations", asyncH(async (_req, res) => res.json(await storage.listConsultations())));
  app.post("/api/consultations", asyncH(async (req, res) => {
    const c = parse(insertConsultationSchema, req.body);
    res.json(await storage.upsertConsultation(c));
  }));
  app.put("/api/consultations/:id", asyncH(async (req, res) => {
    const c = parse(insertConsultationSchema, { ...req.body, id: req.params.id });
    res.json(await storage.upsertConsultation(c));
  }));
  app.delete("/api/consultations/:id", asyncH(async (req, res) =>
    res.json(await storage.deleteConsultation(req.params.id)),
  ));

  /* ────────────── Before / After ────────────── */
  app.get("/api/before-after", asyncH(async (_req, res) => res.json(await storage.listBeforeAfter())));
  app.post("/api/before-after", asyncH(async (req, res) => {
    const b = parse(insertBeforeAfterSchema, req.body);
    res.json(await storage.upsertBeforeAfter(b));
  }));
  app.put("/api/before-after/:id", asyncH(async (req, res) => {
    const b = parse(insertBeforeAfterSchema, { ...req.body, id: req.params.id });
    res.json(await storage.upsertBeforeAfter(b));
  }));
  app.delete("/api/before-after/:id", asyncH(async (req, res) =>
    res.json(await storage.deleteBeforeAfter(req.params.id)),
  ));

  /* ────────────── Initiatives ────────────── */
  app.get("/api/initiatives", asyncH(async (_req, res) => res.json(await storage.listInitiatives())));
  app.post("/api/initiatives", asyncH(async (req, res) => {
    const i = parse(insertInitiativeSchema, req.body);
    res.json(await storage.upsertInitiative(i));
  }));
  app.put("/api/initiatives/:id", asyncH(async (req, res) => {
    const i = parse(insertInitiativeSchema, { ...req.body, id: req.params.id });
    res.json(await storage.upsertInitiative(i));
  }));
  app.delete("/api/initiatives/:id", asyncH(async (req, res) =>
    res.json(await storage.deleteInitiative(req.params.id)),
  ));

  /* ────────────── Admin users ────────────── */
  app.get("/api/admin-users", asyncH(async (_req, res) => res.json(await storage.listAdminUsers())));
  app.post("/api/admin-users", asyncH(async (req, res) => {
    const u = parse(insertAdminUserSchema, req.body);
    res.json(await storage.upsertAdminUser(u));
  }));
  app.put("/api/admin-users/:id", asyncH(async (req, res) => {
    const u = parse(insertAdminUserSchema, { ...req.body, id: req.params.id });
    res.json(await storage.upsertAdminUser(u));
  }));
  app.delete("/api/admin-users/:id", asyncH(async (req, res) =>
    res.json(await storage.deleteAdminUser(req.params.id)),
  ));

  return httpServer;
}
