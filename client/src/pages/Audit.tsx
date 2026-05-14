import { useLocale } from "@/contexts/LocaleContext";
import { PageHeader } from "@/components/brand/PageHeader";
import { Card } from "@/components/ui/card";
import { COMPLAINTS } from "@/lib/seed";
import { ScrollText } from "lucide-react";
import { InitialsAvatar } from "@/components/brand/InitialsAvatar";

export default function Audit() {
  const { t, lang, pick } = useLocale();
  // Flatten timeline events
  const events = COMPLAINTS.flatMap((c) =>
    c.timeline.map((ev) => ({ ref: c.ref, ...ev })),
  ).sort((a, b) => (a.at < b.at ? 1 : -1));

  return (
    <div>
      <PageHeader
        Icon={ScrollText}
        title={t("nav.audit")}
        subtitle={lang === "ar" ? "سجل تدقيق متسلسل لكل إجراء على الحالات" : "Chronological audit trail of every case action"}
      />
      <Card className="shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
              <tr>
                <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "الوقت" : "Timestamp"}</th>
                <th className="text-start px-4 py-3 font-medium">{t("ref")}</th>
                <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "الإجراء" : "Action"}</th>
                <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "المنفّذ" : "Actor"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map((e, i) => (
                <tr key={i} className="hover:bg-muted/40">
                  <td className="px-4 py-2.5 font-mono text-[12px] text-muted-foreground tabular-nums" dir="ltr">{e.at}</td>
                  <td className="px-4 py-2.5 font-mono text-[12px]">{e.ref}</td>
                  <td className="px-4 py-2.5">{pick(e.action)}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <InitialsAvatar name={pick(e.actor)} size={20} />
                      <span className="truncate">{pick(e.actor)}</span>
                    </span>
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
