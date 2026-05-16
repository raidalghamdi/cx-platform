// =============================================================================
// auditChain.ts — Blockchain-style hash-chained audit ledger
// -----------------------------------------------------------------------------
// Implements the DGA Emerging Tech "Blockchain" use case for a single-tenant
// government platform: each audit entry stores a SHA-256 hash of (payload +
// previous entry's hash), forming an append-only chain that is cryptographically
// tamper-evident without the operational overhead of a distributed ledger.
//
// Mirrors the Estonia e-Health Record pattern referenced in DGA-1-2-5-208 §5.1.3.
// =============================================================================

export type AuditEvent = {
  ref: string;           // Case reference (e.g. CMP-2024-018)
  at: string;            // ISO timestamp
  action: { ar: string; en: string };
  actor: { ar: string; en: string };
};

export type ChainedAuditEvent = AuditEvent & {
  index: number;         // Position in the chain (0-based, genesis = 0)
  prevHash: string;      // Hash of the previous entry (or "0".repeat(64) for genesis)
  entryHash: string;     // SHA-256(prevHash + canonical(payload))
};

// Canonical JSON serialisation — keys are stringified in a stable order so
// the same payload always produces the same hash. This is the minimum
// requirement for a verifiable hash chain.
function canonical(ev: AuditEvent): string {
  return JSON.stringify({
    ref: ev.ref,
    at: ev.at,
    action_en: ev.action.en,
    action_ar: ev.action.ar,
    actor_en: ev.actor.en,
    actor_ar: ev.actor.ar,
  });
}

// SHA-256 via the Web Crypto API. Available in every modern browser and in
// the Node 20 runtime used by Vite SSR — no external dependency required.
async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const GENESIS_HASH = "0".repeat(64);

// Build the chain from an ordered list of audit events (oldest first).
// Each entry's hash depends on the previous hash, so a single byte changed
// anywhere in the history invalidates every subsequent entry.
export async function buildChain(events: AuditEvent[]): Promise<ChainedAuditEvent[]> {
  const out: ChainedAuditEvent[] = [];
  let prevHash = GENESIS_HASH;
  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    const entryHash = await sha256(prevHash + canonical(ev));
    out.push({ ...ev, index: i, prevHash, entryHash });
    prevHash = entryHash;
  }
  return out;
}

export type VerifyResult =
  | { ok: true; verified: number }
  | { ok: false; brokenAt: number; expected: string; found: string };

// Re-derive every hash and compare against what's stored. Returns the index
// of the first broken link if tampering is detected.
export async function verifyChain(chain: ChainedAuditEvent[]): Promise<VerifyResult> {
  let prevHash = GENESIS_HASH;
  for (let i = 0; i < chain.length; i++) {
    const entry = chain[i];
    if (entry.prevHash !== prevHash) {
      return { ok: false, brokenAt: i, expected: prevHash, found: entry.prevHash };
    }
    const expected = await sha256(prevHash + canonical(entry));
    if (entry.entryHash !== expected) {
      return { ok: false, brokenAt: i, expected, found: entry.entryHash };
    }
    prevHash = entry.entryHash;
  }
  return { ok: true, verified: chain.length };
}

// Convenience: shorten a 64-char hash for UI display.
export function shortHash(h: string): string {
  if (!h || h.length < 12) return h;
  return `${h.slice(0, 6)}…${h.slice(-4)}`;
}
