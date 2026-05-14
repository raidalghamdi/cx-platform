import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { PageHeader } from "@/components/brand/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { COPILOT_RESPONSES } from "@/lib/seed";
import { Sparkles, ShieldAlert, Send, FileText, MessageSquareText, Languages, BookOpen, BarChart3, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { id: number; from: "user" | "ai"; text: string };

const QUICK = [
  { Icon: FileText, key: "copilot.quick.summarise", action: "summarise" },
  { Icon: MessageSquareText, key: "copilot.quick.reply", action: "reply" },
  { Icon: BookOpen, key: "copilot.quick.kb", action: "kb" },
  { Icon: Languages, key: "copilot.quick.translate", action: "translate" },
  { Icon: BarChart3, key: "copilot.quick.sentiment", action: "sentiment" },
];

export default function Copilot() {
  const { t, lang, pick, isRTL } = useLocale();
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 0,
      from: "ai",
      text:
        lang === "ar"
          ? "أهلاً! يمكنني تلخيص الحالات، اقتراح ردود، أو ترجمة بين العربية والإنجليزية. ماذا تحتاج؟"
          : "Hello! I can summarise cases, suggest replies, or translate between Arabic and English. How can I help?",
    },
  ]);
  const [draft, setDraft] = useState("");

  function runAction(action: string, label: string) {
    const id = Date.now();
    const userMsg: Msg = { id, from: "user", text: label };
    const aiMsg: Msg = { id: id + 1, from: "ai", text: pick(COPILOT_RESPONSES[action]) };
    setMessages((m) => [...m, userMsg, aiMsg]);
  }

  function send() {
    if (!draft.trim()) return;
    const id = Date.now();
    const userMsg: Msg = { id, from: "user", text: draft };
    const aiMsg: Msg = {
      id: id + 1,
      from: "ai",
      text:
        lang === "ar"
          ? "تم استلام طلبك. هذا رد توضيحي تجريبي — راجعه قبل الاعتماد."
          : "Got it. This is an illustrative draft — please review before acting.",
    };
    setMessages((m) => [...m, userMsg, aiMsg]);
    setDraft("");
  }

  return (
    <div>
      <PageHeader
        Icon={Brain}
        title={t("copilot.title")}
        subtitle={t("copilot.subtitle")}
        actions={
          <span className="inline-flex items-center gap-1.5 text-[11px] rounded-full bg-amber-50 text-amber-800 ring-1 ring-amber-200 px-2.5 py-1">
            <ShieldAlert size={12} />
            {t("copilot.oversight")}
          </span>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-4 h-[calc(100vh-220px)] min-h-[560px]">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              {lang === "ar" ? "إجراءات سريعة" : "Quick actions"}
            </p>
            <div className="space-y-1.5">
              {QUICK.map((q) => (
                <button
                  key={q.action}
                  onClick={() => runAction(q.action, t(q.key))}
                  data-testid={`copilot-${q.action}`}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted transition-colors text-start"
                >
                  <span className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <q.Icon size={14} />
                  </span>
                  <span>{t(q.key)}</span>
                </button>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-border text-[11px] text-muted-foreground space-y-2">
              <p className="flex items-start gap-1.5">
                <Sparkles size={12} className="text-accent mt-0.5 shrink-0" />
                {lang === "ar"
                  ? "كل الردود توضيحية ولا تستبدل القرار البشري."
                  : "All outputs are illustrative and do not replace human judgment."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-muted/20">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-soft leading-relaxed",
                    m.from === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border",
                  )}
                >
                  {m.from === "ai" && (
                    <p className="text-[10px] uppercase tracking-wider mb-1.5 flex items-center gap-1 text-accent font-semibold">
                      <Sparkles size={11} /> {lang === "ar" ? "المساعد" : "Copilot"}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  {m.from === "ai" && (
                    <p className="text-[10px] mt-2 inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded ring-1 ring-amber-200">
                      <ShieldAlert size={10} /> {t("copilot.oversight")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border p-3 bg-card flex items-end gap-2">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={2}
              placeholder={t("copilot.placeholder")}
              className="resize-none"
              dir={isRTL ? "rtl" : "ltr"}
              data-testid="input-copilot"
            />
            <Button size="icon" onClick={send} data-testid="button-copilot-send" aria-label="Send">
              <Send size={16} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
