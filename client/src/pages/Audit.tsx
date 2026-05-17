import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { PageHeader } from "@/components/brand/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { COMPLAINTS } from "@/lib/seed";
import { ScrollText, ShieldCheck, AlertTriangle, Copy, Link2 } from "lucide-react";
import { InitialsAvatar } from "@/components/brand/InitialsAvatar";
import {
  buildChain,
  verifyChain,
  shortHash,
  type ChainedAuditEvent,
  type VerifyResult,
} from "@/lib/auditChain";

export default function Audit() {
  const { t, lang, pick } = useLocale();

  // Flatten timeline events oldest-first so the chain hashes are deterministic.
  const rawEvents = useMemo(
    () =>
      COMPLAINTS.flatMap((c) => c.timeline.map((ev) => ({ ref: c.ref, ...ev }))).sort((a, b) =>
        a.at < b.at ? -1 : 1,
      ),
    [],
  );

  const [chain, setChain] = useState<ChainedAuditEvent[]>([]);
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);
  const [verifying, setVerifying] = useState(false);

  // Build the chain once when the component mounts.
  useEffect(() => {
    buildChain(rawEvents).then(setChain);
  }, [rawEvents]);

  // Display newest-first in the table (chain is stored oldest-first for hashing).
  const display = useMemo(() => [...chain].reverse(), [chain]);

  async function handleVerify() {
    setVerifying(true);
    setVerifyResult(null);
    const res = await verifyChain(chain);
    setVerifyResult(res);
    setVerifying(false);
  }

  const copyHash = (h: string) => {
    navigator.clipboard?.writeText(h).catch(() => {});
  };

  return (
    <div>
      <PageHeader
        Icon={ScrollText}
        title={t("nav.audit")}
        subtitle={
          lang === "ar"
            ? "سجل تدقيق متسلسل مرتبط بالتجزئة (Hash-chained) لكل إجراء على الحالات"
            : "Hash-chained, tamper-evident audit ledger of every case action"
        }
      />

      {/* Blockchain ET — chain integrity panel */}
      <Card className="mb-4 p-4 sm:p-5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-[#0069A7]/10 text-[#0069A7] p-2">
              <Link2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">
                {lang === "ar" ? "نزاهة السجل (Blockchain)" : "Ledger Integrity (Blockchain)"}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
                {lang === "ar"
                  ? `كل قيد يحتوي على SHA-256 لمحتواه مرتبط بتجزئة القيد السابق. تغيير أي بايت في التاريخ يُبطل كل القيود اللاحقة. عدد القيود: ${chain.length}.`
                  : `Each entry stores SHA-256(prev_hash + payload). Modifying any byte invalidates every subsequent entry. Total entries: ${chain.length}.`}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={handleVerify}
              disabled={verifying || chain.length === 0}
              className="bg-[#0069A7] hover:bg-[#005897] text-white"
            >
              <ShieldCheck className="h-4 w-4 me-2" />
              {verifying
                ? lang === "ar"
                  ? "جارٍ التحقق…"
                  : "Verifying…"
                : lang === "ar"
                ? "التحقق من السلسلة"
                : "Verify chain"}
            </Button>
          </div>
        </div>

        {verifyResult && verifyResult.ok && (
          <div
            className="mt-3 rounded-lg border border-[#0069A7]/30 bg-[#0069A7]/5 text-[#005897] px-3 py-2 text-sm flex items-center gap-2"
            role="status"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>
              {lang === "ar"
                ? `السلسلة سليمة — تم التحقق من ${verifyResult.verified} قيد.`
                : `Chain is intact — verified ${verifyResult.verified} entries.`}
            </span>
          </div>
        )}
        {verifyResult && !verifyResult.ok && (
          <div
            className="mt-3 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 px-3 py-2 text-sm flex items-start gap-2"
            role="alert"
          >
            <AlertTriangle className="h-4 w-4 mt-0.5" />
            <span>
              {lang === "ar"
                ? `تم اكتشاف عبث عند القيد رقم ${verifyResult.brokenAt}.`
                : `Tampering detected at entry #${verifyResult.brokenAt}.`}
            </span>
          </div>
        )}
      </Card>

      <Card className="shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[860px]">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
              <tr>
                <th className="text-start px-4 py-3 font-medium">#</th>
                <th className="text-start px-4 py-3 font-medium">
                  {lang === "ar" ? "الوقت" : "Timestamp"}
                </th>
                <th className="text-start px-4 py-3 font-medium">{t("ref")}</th>
                <th className="text-start px-4 py-3 font-medium">
                  {lang === "ar" ? "الإجراء" : "Action"}
                </th>
                <th className="text-start px-4 py-3 font-medium">
                  {lang === "ar" ? "المنفّذ" : "Actor"}
                </th>
                <th className="text-start px-4 py-3 font-medium">
                  {lang === "ar" ? "تجزئة القيد" : "Entry hash"}
                </th>
                <th className="text-start px-4 py-3 font-medium">
                  {lang === "ar" ? "السابق" : "Prev"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {display.map((e) => (
                <tr key={e.entryHash} className="hover:bg-muted/40">
                  <td className="px-4 py-2.5 font-mono text-[12px] text-muted-foreground tabular-nums">
                    {e.index}
                  </td>
                  <td
                    className="px-4 py-2.5 font-mono text-[12px] text-muted-foreground tabular-nums"
                    dir="ltr"
                  >
                    {e.at}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[12px]">{e.ref}</td>
                  <td className="px-4 py-2.5">{pick(e.action)}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <InitialsAvatar name={pick(e.actor)} size={20} />
                      <span className="truncate">{pick(e.actor)}</span>
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[11px]" dir="ltr">
                    <button
                      onClick={() => copyHash(e.entryHash)}
                      title={e.entryHash}
                      className="inline-flex items-center gap-1.5 text-[#0069A7] hover:underline"
                      aria-label={`Copy hash ${e.entryHash}`}
                    >
                      <span>{shortHash(e.entryHash)}</span>
                      <Copy className="h-3 w-3" />
                    </button>
                  </td>
                  <td
                    className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground"
                    dir="ltr"
                    title={e.prevHash}
                  >
                    {shortHash(e.prevHash)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
