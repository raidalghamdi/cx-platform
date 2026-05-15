import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useLocale } from "@/contexts/LocaleContext";
import { useJourneys } from "@/contexts/JourneyContext";
import { PageHeader } from "@/components/brand/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, NewJourneyDialog, SENTIMENT_META } from "@/components/journeys/JourneyBits";
import { Plus, ChevronRight, ChevronLeft, Trash2, Compass, ArrowUpRight } from "lucide-react";
import { HeroPattern } from "@/components/brand/HeroPattern";
import { CoDesignTracker } from "@/components/journeys/CoDesignTracker";
import type { Sentiment } from "@/lib/seedJourneys";

function dominantSentiment(scores: number[]): Sentiment {
  if (scores.length === 0) return "neutral";
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  if (avg >= 1.5) return "delighted";
  if (avg >= 0.5) return "satisfied";
  if (avg <= -1.5) return "frustrated";
  if (avg <= -0.5) return "confused";
  return "neutral";
}

export default function Journeys() {
  const { t, lang, pick, isRTL } = useLocale();
  const { journeys, deleteJourney } = useJourneys();
  const [filter, setFilter] = useState<string | null>(null);

  const Chev = isRTL ? ChevronLeft : ChevronRight;

  const owners = useMemo(() => {
    const set = new Map<string, { ar: string; en: string }>();
    journeys.forEach((j) => set.set(pick(j.owner), j.owner));
    return Array.from(set.entries()).map(([k, v]) => ({ key: k, label: v }));
  }, [journeys, lang]);

  const filtered = filter ? journeys.filter((j) => pick(j.owner) === filter) : journeys;

  return (
    <div>
      <PageHeader
        Icon={Compass}
        title={t("journeys.title")}
        requirementIds={["FR-41", "FR-42", "FR-72", "FR-73"]}
        standards={["ISO 9241-210", "DGA 5.18.3", "EFQM 2025 — Stakeholder Engagement"]}
        subtitle={`${journeys.length} ${t("journeys.count")} · ${t("journeys.subtitle")}`}
        actions={
          <NewJourneyDialog
            trigger={
              <Button data-testid="button-new-journey" className="gap-1.5">
                <Plus size={15} /> {t("journeys.newJourney")}
              </Button>
            }
          />
        }
      />

      <CoDesignTracker />

      {/* Owner filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter(null)}
          className={cn(
            "h-8 px-3 rounded-full text-xs font-medium border transition-colors",
            !filter
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card border-border text-muted-foreground hover:bg-muted",
          )}
          data-testid="filter-all"
        >
          {t("journeys.allEntities")} · {journeys.length}
        </button>
        {owners.map((o) => {
          const count = journeys.filter((j) => pick(j.owner) === o.key).length;
          return (
            <button
              key={o.key}
              onClick={() => setFilter(o.key)}
              className={cn(
                "h-8 px-3 rounded-full text-xs font-medium border transition-colors",
                filter === o.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:bg-muted",
              )}
            >
              {pick(o.label)} · {count}
            </button>
          );
        })}
      </div>

      {/* Journey grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((j) => {
          const sent = dominantSentiment(j.stages.map((s) => s.emotionScore));
          const sm = SENTIMENT_META[sent];
          const entityCount = new Set(
            j.stages.flatMap((s) => s.entities.map((e) => pick(e.label))),
          ).size;
          return (
            <Link key={j.id} href={`/journeys/${j.id}`}>
              <Card className="shadow-card card-lift cursor-pointer group h-full overflow-hidden relative">
                <div className="relative h-1.5 bg-gradient-to-r from-primary via-primary/70 to-amber-400/70" />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center ring-1 ring-primary/15">
                      <LucideIcon name={j.icon} size={24} />
                    </span>
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset", sm.bg, sm.color, sm.ring)}>
                      <sm.Icon size={11} />
                      {t(sm.key)}
                    </span>
                  </div>
                  <h3 className="mt-3 text-[15px] font-semibold leading-snug text-foreground line-clamp-2">
                    {pick(j.title)}
                  </h3>
                  <p className="mt-1 text-[12px] text-muted-foreground line-clamp-2 leading-snug">
                    {pick(j.subtitle)}
                  </p>
                  <p className="mt-2 text-[11px] font-medium text-primary">
                    {pick(j.owner)}
                  </p>

                  <div className="mt-4 pt-3 border-t border-border grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[15px] font-semibold tabular-nums">{j.stages.length}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("journeys.stages")}</p>
                    </div>
                    <div className="border-x border-border">
                      <p className="text-[15px] font-semibold tabular-nums">{entityCount}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("journeys.entitiesInvolved")}</p>
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold tabular-nums">{j.types.length}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("journeys.journeyType")}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[12px] font-medium text-primary opacity-90 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1"><ArrowUpRight size={13} />{t("journeys.openDetail")}</span>
                    <Chev size={15} className="transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
