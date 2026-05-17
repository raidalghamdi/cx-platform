import { useMemo, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { PageHeader } from "@/components/brand/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useChannels } from "@/lib/channelsStore";
import { useInbox, addReply, markOpen, markClosed, type InboxThread, type InboxStatus, type InboxPriority } from "@/lib/inboxStore";
import { type AdapterChannel } from "@/lib/channelAdapters";
import { useToast } from "@/hooks/use-toast";
import {
  Info,
  Inbox as InboxIcon,
  Mail,
  MessageCircle,
  MessagesSquare,
  Send,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CHANNEL_ICONS: Record<AdapterChannel, typeof Mail> = {
  email: Mail,
  whatsapp: MessageCircle,
  chat: MessagesSquare,
};

const STATUS_TONE: Record<InboxStatus, string> = {
  new: "bg-[#0069A7]/10 text-[#0069A7] ring-[#0069A7]/20",
  open: "bg-amber-50 text-amber-700 ring-amber-200",
  replied: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  closed: "bg-slate-100 text-slate-700 ring-slate-200",
};

const PRIORITY_DOT: Record<InboxPriority, string> = {
  low: "bg-slate-400",
  normal: "bg-sky-500",
  high: "bg-rose-500",
};

function formatRelative(iso: string, lang: "en" | "ar"): string {
  const now = Date.now();
  const t = new Date(iso).getTime();
  const diffMin = Math.round((now - t) / 60000);
  if (diffMin < 1) return lang === "ar" ? "الآن" : "just now";
  if (diffMin < 60) return lang === "ar" ? `قبل ${diffMin} د` : `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return lang === "ar" ? `قبل ${diffHr} س` : `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  return lang === "ar" ? `قبل ${diffDay} ي` : `${diffDay}d ago`;
}

export default function Inbox() {
  const { t, lang, isRTL } = useLocale();
  const { toast } = useToast();
  const channels = useChannels();
  const threads = useInbox();

  const [channelFilter, setChannelFilter] = useState<AdapterChannel | "all">("all");
  const [statusFilter, setStatusFilter] = useState<InboxStatus | "all">("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = useMemo(() => threads.find((x) => x.id === activeId) ?? null, [threads, activeId]);

  // Reply form state — channel-specific (email gets subject; whatsapp gets char counter)
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);

  function openThread(t: InboxThread) {
    setActiveId(t.id);
    setReplySubject(t.subject ? `Re: ${t.subject}` : "");
    setReplyBody("");
  }

  async function onSend() {
    if (!active) return;
    if (!replyBody.trim()) return;
    setSending(true);
    const res = await addReply(active.id, {
      subject: active.channel === "email" ? replySubject : undefined,
      body: replyBody.trim(),
    });
    setSending(false);
    if (res.ok) {
      toast({ title: t("inbox.reply.sent"), description: active.channel.toUpperCase() });
      setReplyBody("");
    } else {
      toast({ title: t("inbox.reply.failed"), description: res.error ?? "" });
    }
  }

  const filtered = useMemo(() => {
    return threads
      .filter((t) => (channelFilter === "all" ? true : t.channel === channelFilter))
      .filter((t) => (statusFilter === "all" ? true : t.status === statusFilter))
      .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
  }, [threads, channelFilter, statusFilter]);

  const counts = useMemo(() => {
    const by = (fn: (x: InboxThread) => boolean) => threads.filter(fn).length;
    return {
      all: threads.length,
      email: by((x) => x.channel === "email"),
      whatsapp: by((x) => x.channel === "whatsapp"),
      chat: by((x) => x.channel === "chat"),
      new: by((x) => x.status === "new"),
      open: by((x) => x.status === "open"),
      replied: by((x) => x.status === "replied"),
      closed: by((x) => x.status === "closed"),
    };
  }, [threads]);

  return (
    <div>
      <PageHeader
        Icon={InboxIcon}
        title={t("nav.inbox")}
        subtitle={lang === "ar" ? "محادثات نشطة عبر القنوات" : "Active conversations across channels"}
      />

      {/* Data-sources banner (preserved from Round 2) */}
      <div className="mb-4 rounded-[10px] border border-sky-200 bg-sky-50/60 p-3 flex items-start gap-2.5">
        <Info size={16} className="text-sky-700 mt-0.5 shrink-0" />
        <div className="flex-1 text-[12.5px] text-sky-900 leading-relaxed">
          <p>{t("inbox.channelsBanner")}</p>
          <p className="text-[11px] text-sky-800/80 mt-1 font-mono" dir="ltr">
            {channels.email} · {channels.whatsapp} · {channels.hours}
          </p>
        </div>
      </div>

      {/* Channel pills */}
      <div className="flex flex-wrap gap-2 mb-2">
        <FilterPill active={channelFilter === "all"} onClick={() => setChannelFilter("all")} label={t("inbox.channels.all")} count={counts.all} />
        <FilterPill active={channelFilter === "email"} onClick={() => setChannelFilter("email")} label={t("inbox.channels.email")} count={counts.email} Icon={Mail} />
        <FilterPill active={channelFilter === "whatsapp"} onClick={() => setChannelFilter("whatsapp")} label={t("inbox.channels.whatsapp")} count={counts.whatsapp} Icon={MessageCircle} />
        <FilterPill active={channelFilter === "chat"} onClick={() => setChannelFilter("chat")} label={t("inbox.channels.chat")} count={counts.chat} Icon={MessagesSquare} />
      </div>

      {/* Status pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <FilterPill subtle active={statusFilter === "all"} onClick={() => setStatusFilter("all")} label={t("common.all")} />
        <FilterPill subtle active={statusFilter === "new"} onClick={() => setStatusFilter("new")} label={t("inbox.status.new")} count={counts.new} />
        <FilterPill subtle active={statusFilter === "open"} onClick={() => setStatusFilter("open")} label={t("inbox.status.open")} count={counts.open} />
        <FilterPill subtle active={statusFilter === "replied"} onClick={() => setStatusFilter("replied")} label={t("inbox.status.replied")} count={counts.replied} />
        <FilterPill subtle active={statusFilter === "closed"} onClick={() => setStatusFilter("closed")} label={t("inbox.status.closed")} count={counts.closed} />
      </div>

      <Card className="shadow-card overflow-hidden">
        <ul className="divide-y divide-border">
          {filtered.map((th) => {
            const ChIcon = CHANNEL_ICONS[th.channel];
            return (
              <li key={th.id}>
                <button
                  onClick={() => openThread(th)}
                  data-testid={`thread-${th.id}`}
                  className="w-full text-start px-4 py-3 hover:bg-muted/40 transition-colors flex items-start gap-3"
                >
                  <span className={cn("h-2 w-2 rounded-full mt-2 shrink-0", PRIORITY_DOT[th.priority])} aria-label={t("inbox.priority." + th.priority)} />
                  <span className="h-9 w-9 rounded-full bg-[#0069A7]/10 text-[#0069A7] flex items-center justify-center shrink-0">
                    <ChIcon size={16} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate">{th.fromName}</span>
                      <span className="text-[11px] text-muted-foreground truncate" dir="ltr">{th.from}</span>
                      <span className="ms-auto text-[11px] text-muted-foreground tabular-nums whitespace-nowrap">{formatRelative(th.receivedAt, lang)}</span>
                    </div>
                    {th.subject && (
                      <p className="text-[12.5px] font-medium text-foreground mt-0.5 truncate">{th.subject}</p>
                    )}
                    <p className="text-[12px] text-muted-foreground mt-0.5 line-clamp-1">{th.body}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-medium ring-1 ring-inset", STATUS_TONE[th.status])}>
                        {t("inbox.status." + th.status)}
                      </span>
                      <span className="text-[10.5px] text-muted-foreground capitalize">{th.channel}</span>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="px-4 py-12 text-center text-sm text-muted-foreground">{t("inbox.empty")}</li>
          )}
        </ul>
      </Card>

      {/* Reply drawer */}
      <Sheet open={!!active} onOpenChange={(o) => !o && setActiveId(null)}>
        <SheetContent side={isRTL ? "left" : "right"} className="w-full sm:max-w-[640px] p-0 flex flex-col">
          {active && (
            <>
              <SheetHeader className="px-4 sm:px-6 pt-6 pb-4 border-b border-border">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-medium ring-1 ring-inset", STATUS_TONE[active.status])}>
                    {t("inbox.status." + active.status)}
                  </span>
                  <span className="text-muted-foreground capitalize">{active.channel}</span>
                  <span className="ms-auto inline-flex items-center gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => markOpen(active.id)} data-testid="button-thread-open">
                      {t("inbox.markOpen")}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => markClosed(active.id)} data-testid="button-thread-closed">
                      <Lock size={12} className="me-1" />
                      {t("inbox.markClosed")}
                    </Button>
                  </span>
                </div>
                <SheetTitle className="text-lg font-semibold leading-snug pt-1.5">
                  {active.subject ?? `${active.fromName} · ${active.channel}`}
                </SheetTitle>
                <SheetDescription className="text-sm">
                  <span className="font-medium text-foreground">{active.fromName}</span>
                  <span className="mx-1.5">·</span>
                  <span dir="ltr">{active.from}</span>
                  <span className="mx-1.5">·</span>
                  {new Date(active.receivedAt).toLocaleString(lang === "ar" ? "ar-SA" : "en-GB")}
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Original message */}
                  <div className="rounded-[10px] border border-border bg-card p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      {lang === "ar" ? "الرسالة الأصلية" : "Original message"}
                    </p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{active.body}</p>
                  </div>

                  {/* Existing reply if any */}
                  {active.replyBody && (
                    <div className="rounded-[10px] border border-emerald-200 bg-emerald-50/40 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 mb-2 flex items-center gap-1.5">
                        <CheckCircle2 size={12} />
                        {t("inbox.reply.yourReply")} · {active.repliedAt && new Date(active.repliedAt).toLocaleString(lang === "ar" ? "ar-SA" : "en-GB")}
                      </p>
                      {active.replySubject && (
                        <p className="text-sm font-medium mb-1">{active.replySubject}</p>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{active.replyBody}</p>
                    </div>
                  )}

                  {/* Reply form — channel-specific */}
                  <div className="rounded-[10px] border border-border bg-card p-4 space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {lang === "ar" ? "صياغة رد" : "Compose reply"}
                    </p>

                    {active.channel === "email" && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">{t("inbox.reply.subject")}</label>
                        <Input
                          value={replySubject}
                          onChange={(e) => setReplySubject(e.target.value)}
                          placeholder="Re: …"
                          data-testid="input-reply-subject"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">{t("inbox.reply.body")}</label>
                      <Textarea
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                        rows={5}
                        placeholder={lang === "ar" ? "اكتب الرد…" : "Write your reply…"}
                        maxLength={active.channel === "whatsapp" ? 4096 : undefined}
                        dir={lang === "ar" ? "rtl" : "ltr"}
                        data-testid="input-reply-body"
                      />
                      {active.channel === "whatsapp" && (
                        <p className="text-[10.5px] text-muted-foreground tabular-nums text-end" dir="ltr">
                          {replyBody.length} / 4096 {t("inbox.charCount")}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <Button onClick={onSend} disabled={!replyBody.trim() || sending} data-testid="button-send-reply">
                        <Send size={14} className="me-1.5" />
                        {sending ? t("inbox.reply.sending") : t("inbox.reply.send")}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  count,
  Icon,
  subtle = false,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
  Icon?: typeof Mail;
  subtle?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[100px] px-3 h-8 text-xs font-medium ring-1 transition-colors",
        active
          ? subtle
            ? "bg-foreground text-background ring-foreground"
            : "bg-[#0069A7] text-white ring-[#005897]"
          : "bg-card text-foreground ring-border hover:bg-muted/60",
      )}
    >
      {Icon && <Icon size={13} />}
      <span>{label}</span>
      {typeof count === "number" && (
        <span className={cn("tabular-nums text-[10.5px] rounded-full px-1.5", active ? "bg-white/20" : "bg-muted")}>{count}</span>
      )}
    </button>
  );
}
