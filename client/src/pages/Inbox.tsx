import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { PageHeader } from "@/components/brand/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChannelChip,
  SentimentChip,
} from "@/components/brand/StatusChips";
import { CONVERSATIONS, SUGGESTED_REPLIES } from "@/lib/seed";
import { Send, Sparkles, Paperclip, Inbox as InboxIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Inbox() {
  const { t, lang, pick, isRTL } = useLocale();
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [draft, setDraft] = useState("");
  const [mobilePane, setMobilePane] = useState<"queue" | "thread" | "customer">("queue");
  const active = CONVERSATIONS.find((c) => c.id === activeId)!;

  return (
    <div>
      <PageHeader
        Icon={InboxIcon}
        title={t("nav.inbox")}
        subtitle={lang === "ar" ? "محادثات نشطة عبر القنوات" : "Active conversations across channels"}
      />

      {/* Mobile pane switcher — only visible <lg */}
      <div className="lg:hidden mb-3">
        <Tabs value={mobilePane} onValueChange={(v) => setMobilePane(v as any)}>
          <TabsList className="w-full justify-start overflow-x-auto no-scrollbar">
            <TabsTrigger value="queue" className="whitespace-nowrap shrink-0">{lang === "ar" ? "قائمة الانتظار" : "Queue"}</TabsTrigger>
            <TabsTrigger value="thread" className="whitespace-nowrap shrink-0">{lang === "ar" ? "المحادثة" : "Conversation"}</TabsTrigger>
            <TabsTrigger value="customer" className="whitespace-nowrap shrink-0">{t("tab.customer360")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)_300px] gap-4 lg:h-[calc(100vh-220px)] lg:min-h-[640px]">
        {/* Queue */}
        <div className={cn(
          "rounded-xl border border-border bg-card shadow-card overflow-hidden flex flex-col h-[calc(100vh-260px)] min-h-[420px] lg:h-auto lg:min-h-0",
          mobilePane !== "queue" && "hidden lg:flex"
        )}>
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold">{lang === "ar" ? "قائمة الانتظار" : "Queue"}</h3>
            <span className="text-[11px] text-muted-foreground">{CONVERSATIONS.length}</span>
          </div>
          <ul className="flex-1 overflow-y-auto divide-y divide-border">
            {CONVERSATIONS.map((c) => {
              const isActive = c.id === activeId;
              return (
                <li key={c.id}>
                  <button
                    onClick={() => setActiveId(c.id)}
                    data-testid={`conv-${c.id}`}
                    className={cn(
                      "w-full text-start px-4 py-3 hover:bg-muted/50 transition-colors",
                      isActive && "bg-muted/60",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-semibold shrink-0">
                        {c.customer.initials}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[13px] font-semibold truncate">{pick(c.customer.name)}</p>
                          <span className="text-[10px] text-muted-foreground tabular-nums">{c.updated}</span>
                        </div>
                        <p className="text-[12px] text-muted-foreground truncate mt-0.5">{pick(c.preview)}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <ChannelChip ch={c.channel} compact />
                          <SentimentChip s={c.sentiment} withLabel={false} />
                          {c.unread > 0 && (
                            <span className="ms-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
                              {c.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Thread */}
        <div className={cn(
          "rounded-xl border border-border bg-card shadow-card overflow-hidden flex flex-col h-[calc(100vh-260px)] min-h-[520px] lg:h-auto lg:min-h-0",
          mobilePane !== "thread" && "hidden lg:flex"
        )}>
          <div className="px-5 py-3 border-b border-border flex items-center gap-3">
            <span className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-semibold">
              {active.customer.initials}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{pick(active.customer.name)}</p>
              <p className="text-[11px] text-muted-foreground truncate">
                {pick(active.customer.segment)}
              </p>
            </div>
            <ChannelChip ch={active.channel} />
            <SentimentChip s={active.sentiment} />
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3 bg-muted/20">
            {active.messages.map((m) => {
              const mine = m.from === "agent";
              return (
                <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm shadow-soft",
                      mine
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-card border border-border rounded-bl-sm",
                      isRTL && (mine ? "rounded-bl-sm rounded-br-2xl" : "rounded-br-sm rounded-bl-2xl"),
                    )}
                  >
                    <p className="leading-snug whitespace-pre-wrap">{pick(m.body)}</p>
                    <p className={cn("text-[10px] mt-1.5 tabular-nums", mine ? "text-primary-foreground/70" : "text-muted-foreground")}>
                      {m.at}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-border p-3 space-y-2.5 bg-card">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1">
                <Sparkles size={11} className="text-accent" />
                {lang === "ar" ? "اقتراحات الذكاء الاصطناعي" : "AI suggestions"}
              </span>
              {SUGGESTED_REPLIES.map((r, i) => (
                <button
                  key={i}
                  onClick={() => setDraft(pick(r))}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-background hover:bg-muted text-foreground transition-colors truncate max-w-[280px]"
                  data-testid={`suggestion-${i}`}
                >
                  {pick(r)}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2">
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={2}
                placeholder={lang === "ar" ? "اكتب ردك…" : "Write your reply…"}
                className="resize-none"
                data-testid="input-reply"
              />
              <div className="flex flex-col gap-1.5">
                <Button variant="ghost" size="icon" aria-label="Attach">
                  <Paperclip size={16} />
                </Button>
                <Button size="icon" aria-label="Send" data-testid="button-send">
                  <Send size={16} />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Button variant="ghost" size="sm" className="h-7 text-xs">{t("common.saveDraft")}</Button>
              <span className="ms-auto">{lang === "ar" ? "النغمة: محايد · رسمي" : "Tone: neutral · formal"}</span>
            </div>
          </div>
        </div>

        {/* Customer 360 */}
        <div className={cn(
          "rounded-xl border border-border bg-card shadow-card overflow-hidden flex flex-col h-[calc(100vh-260px)] min-h-[420px] lg:h-auto lg:min-h-0",
          mobilePane !== "customer" && "hidden lg:flex"
        )}>
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">{t("tab.customer360")}</h3>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto">
            <div className="flex items-center gap-3">
              <span className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                {active.customer.initials}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{pick(active.customer.name)}</p>
                <p className="text-[11px] text-muted-foreground" dir="ltr">ID · {active.customer.nationalId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg border border-border p-2.5">
                <p className="text-[10px] text-muted-foreground">{lang === "ar" ? "تفاعلات" : "Interactions"}</p>
                <p className="font-semibold mt-0.5 tabular-nums">{active.customer.interactions}</p>
              </div>
              <div className="rounded-lg border border-border p-2.5">
                <p className="text-[10px] text-muted-foreground">CSAT</p>
                <p className="font-semibold mt-0.5 tabular-nums">{active.customer.csat.toFixed(1)}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {lang === "ar" ? "الوسوم" : "Tags"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {active.tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center text-[11px] rounded-full bg-muted px-2 py-0.5">
                    {pick(tag)}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {lang === "ar" ? "آخر تفاعلات" : "Recent interactions"}
              </p>
              <ul className="space-y-2 text-[12px]">
                <li className="flex items-center gap-2">
                  <ChannelChip ch="email" compact />
                  <span className="truncate text-muted-foreground">CX-2148 · {lang === "ar" ? "قبل ٤ أيام" : "4 days ago"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChannelChip ch="walkin" compact />
                  <span className="truncate text-muted-foreground">CX-2154 · {lang === "ar" ? "قبل أسبوعين" : "2 weeks ago"}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
