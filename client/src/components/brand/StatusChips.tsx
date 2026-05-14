import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/LocaleContext";
import type {
  ComplaintStatus,
  SlaStatus,
  Channel,
  Priority,
  Sentiment,
} from "@/lib/seed";
import {
  Mail,
  Globe,
  MessageCircle,
  Phone,
  Twitter,
  Smartphone,
  MapPin,
  Smile,
  Meh,
  Frown,
} from "lucide-react";

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  const { t } = useLocale();
  const map: Record<ComplaintStatus, { cls: string; key: string }> = {
    new: { cls: "bg-blue-50 text-blue-700 ring-blue-200", key: "status.new" },
    acknowledged: { cls: "bg-violet-50 text-violet-700 ring-violet-200", key: "status.acknowledged" },
    investigating: { cls: "bg-amber-50 text-amber-700 ring-amber-200", key: "status.investigating" },
    awaiting: { cls: "bg-slate-50 text-slate-600 ring-slate-200", key: "status.awaiting" },
    resolved: { cls: "bg-emerald-50 text-emerald-700 ring-emerald-200", key: "status.resolved" },
    closed: { cls: "bg-slate-50 text-slate-500 ring-slate-200", key: "status.closed" },
    escalated: { cls: "bg-rose-50 text-rose-700 ring-rose-200", key: "status.escalated" },
  };
  const m = map[status];
  return (
    <span
      data-testid={`status-${status}`}
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset", m.cls)}
    >
      {t(m.key)}
    </span>
  );
}

export function SlaBadge({ sla }: { sla: SlaStatus }) {
  const { t } = useLocale();
  const map: Record<SlaStatus, { cls: string; key: string; dot: string }> = {
    onTrack: { cls: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500", key: "sla.onTrack" },
    atRisk: { cls: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-500", key: "sla.atRisk" },
    breached: { cls: "bg-rose-50 text-rose-700 ring-rose-200", dot: "bg-rose-500", key: "sla.breached" },
  };
  const m = map[sla];
  return (
    <span
      data-testid={`sla-${sla}`}
      className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset", m.cls)}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} />
      {t(m.key)}
    </span>
  );
}

export function PriorityBadge({ p }: { p: Priority }) {
  const { t } = useLocale();
  const map: Record<Priority, string> = {
    low: "bg-slate-50 text-slate-600 ring-slate-200",
    medium: "bg-blue-50 text-blue-700 ring-blue-200",
    high: "bg-amber-50 text-amber-700 ring-amber-200",
    urgent: "bg-rose-50 text-rose-700 ring-rose-200",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset", map[p])}>
      {t("priority." + p)}
    </span>
  );
}

export function SentimentChip({ s, withLabel = true }: { s: Sentiment; withLabel?: boolean }) {
  const { t } = useLocale();
  const map: Record<Sentiment, { Icon: any; cls: string; key: string }> = {
    positive: { Icon: Smile, cls: "bg-emerald-50 text-emerald-700 ring-emerald-200", key: "sentiment.positive" },
    neutral: { Icon: Meh, cls: "bg-amber-50 text-amber-700 ring-amber-200", key: "sentiment.neutral" },
    negative: { Icon: Frown, cls: "bg-rose-50 text-rose-700 ring-rose-200", key: "sentiment.negative" },
  };
  const { Icon, cls, key } = map[s];
  return (
    <span
      data-testid={`sentiment-${s}`}
      className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset", cls)}
    >
      <Icon size={12} strokeWidth={2.2} />
      {withLabel && t(key)}
    </span>
  );
}

const CHANNEL_ICONS: Record<Channel, any> = {
  web: Globe,
  email: Mail,
  whatsapp: MessageCircle,
  phone: Phone,
  twitter: Twitter,
  app: Smartphone,
  walkin: MapPin,
};

export function ChannelChip({ ch, compact = false }: { ch: Channel; compact?: boolean }) {
  const { t } = useLocale();
  const Icon = CHANNEL_ICONS[ch];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon size={14} strokeWidth={2} className="text-foreground/70" />
      {!compact && <span>{t("channel." + ch)}</span>}
    </span>
  );
}
