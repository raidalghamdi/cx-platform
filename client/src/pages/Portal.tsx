import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/contexts/LocaleContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { MY_REQUESTS } from "@/lib/seed";
import { StatusBadge } from "@/components/brand/StatusChips";
import {
  FileText,
  Search,
  BookOpen,
  MessageSquare,
  Send,
  CheckCircle2,
  Paperclip,
} from "lucide-react";

export default function Portal() {
  const { user } = useAuth();
  const { t, lang, pick } = useLocale();

  const tiles = [
    { Icon: FileText, key: "portal.tiles.submit", color: "from-emerald-600 to-green-700" },
    { Icon: Search, key: "portal.tiles.track", color: "from-blue-500 to-indigo-500" },
    { Icon: BookOpen, key: "portal.tiles.browseKB", color: "from-amber-500 to-orange-500" },
    { Icon: MessageSquare, key: "portal.tiles.feedback", color: "from-rose-500 to-pink-500" },
  ];

  return (
    <div>
      {/* Hero — citizen portal feels lighter and more brand-forward */}
      <div className="rounded-2xl overflow-hidden border border-border mb-8 shadow-card">
        <div
          className="px-8 py-8 lg:px-12 lg:py-10"
          style={{
            background:
              "linear-gradient(135deg, hsl(152 64% 26%) 0%, hsl(152 65% 31%) 60%, hsl(46 99% 49% / 0.85) 140%)",
          }}
        >
          <p className="text-[12px] uppercase tracking-wider text-white/70 font-semibold">{t("portal.welcome")}</p>
          <h1 className="text-2xl font-semibold text-white mt-1.5">
            {user ? (lang === "ar" ? user.name_ar : user.name_en) : ""}
          </h1>
          <p className="text-sm text-white/85 mt-2 max-w-2xl">
            {lang === "ar"
              ? "كل خدماتك في مكان واحد. قدم طلباً، تابع حالة، أو تواصل معنا في أي وقت."
              : "All your services in one place. Submit a request, track its status, or reach out anytime."}
          </p>
        </div>
      </div>

      {/* Action tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {tiles.map((tile) => {
          const Tile = (
            <button
              key={tile.key}
              className="text-start rounded-xl border border-border bg-card p-5 hover:shadow-card-hover transition-shadow group w-full h-full"
              data-testid={`tile-${tile.key}`}
            >
              <span className={`inline-flex h-10 w-10 rounded-xl items-center justify-center text-white bg-gradient-to-br ${tile.color}`}>
                <tile.Icon size={18} />
              </span>
              <p className="text-sm font-semibold mt-3">{t(tile.key)}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {lang === "ar" ? "اضغط للبدء" : "Tap to begin"}
              </p>
            </button>
          );

          if (tile.key === "portal.tiles.submit") {
            return (
              <Dialog key={tile.key}>
                <DialogTrigger asChild>{Tile}</DialogTrigger>
                <NewRequestDialog />
              </Dialog>
            );
          }
          return Tile;
        })}
      </div>

      {/* My requests */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold">{t("portal.myRequests")}</h3>
            <Button variant="ghost" size="sm" className="text-xs">{t("common.viewAll")}</Button>
          </div>
          <ul className="divide-y divide-border">
            {MY_REQUESTS.map((r) => (
              <li key={r.id} className="px-5 py-4 hover:bg-muted/40 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText size={16} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[11px] text-muted-foreground">{r.ref}</span>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-sm font-medium mt-1">{pick(r.subject)}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{pick(r.agency)} · {r.opened}</p>

                    {/* Mini timeline */}
                    <div className="mt-3 flex items-center gap-1.5 text-[10px]">
                      <Step active label={lang === "ar" ? "تم الاستلام" : "Received"} />
                      <Connector />
                      <Step active={r.status !== "new"} label={lang === "ar" ? "قيد المعالجة" : "Processing"} />
                      <Connector />
                      <Step active={["resolved", "closed"].includes(r.status)} label={lang === "ar" ? "تم" : "Done"} />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function Step({ active, label }: { active: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${active ? "text-emerald-700" : "text-muted-foreground"}`}>
      <CheckCircle2 size={12} className={active ? "fill-emerald-100" : "opacity-50"} />
      {label}
    </span>
  );
}

function Connector() {
  return <span className="h-px w-4 bg-border" />;
}

function NewRequestDialog() {
  const { t, lang } = useLocale();
  const [sent, setSent] = useState(false);

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>{t("common.newRequest")}</DialogTitle>
        <DialogDescription>
          {lang === "ar" ? "أكمل البيانات وسنوافيك برقم مرجعي." : "Fill in the details and you will receive a reference number."}
        </DialogDescription>
      </DialogHeader>

      {!sent ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="cat">{t("common.category")}</Label>
            <Select defaultValue="services">
              <SelectTrigger id="cat"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="services">{lang === "ar" ? "خدمات حكومية" : "Government services"}</SelectItem>
                <SelectItem value="billing">{lang === "ar" ? "الفواتير والرسوم" : "Billing & fees"}</SelectItem>
                <SelectItem value="account">{lang === "ar" ? "الحساب" : "Account"}</SelectItem>
                <SelectItem value="technical">{lang === "ar" ? "تقني" : "Technical"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ch">{t("common.channel")}</Label>
            <Select defaultValue="web">
              <SelectTrigger id="ch"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="web">{t("channel.web")}</SelectItem>
                <SelectItem value="email">{t("channel.email")}</SelectItem>
                <SelectItem value="whatsapp">{t("channel.whatsapp")}</SelectItem>
                <SelectItem value="phone">{t("channel.phone")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subj">{t("common.subject")}</Label>
            <Input id="subj" placeholder={lang === "ar" ? "اكتب موضوع الطلب" : "Brief subject"} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="desc">{t("common.description")}</Label>
            <Textarea id="desc" rows={4} placeholder={lang === "ar" ? "وصف تفصيلي…" : "Detailed description…"} required />
          </div>
          <div>
            <Button type="button" variant="outline" size="sm">
              <Paperclip size={14} className="me-1.5" />
              {lang === "ar" ? "إرفاق ملف" : "Attach file"}
            </Button>
          </div>
          <Button type="submit" className="w-full">
            <Send size={14} className="me-1.5" /> {t("common.submit")}
          </Button>
        </form>
      ) : (
        <div className="py-6 text-center">
          <span className="inline-flex h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 items-center justify-center mb-3">
            <CheckCircle2 size={24} />
          </span>
          <p className="font-semibold">{lang === "ar" ? "تم إرسال طلبك" : "Your request has been submitted"}</p>
          <p className="text-sm text-muted-foreground mt-1">{lang === "ar" ? "رقم المرجع" : "Reference"}: <span dir="ltr" className="font-mono">CX-2160</span></p>
        </div>
      )}
    </DialogContent>
  );
}
