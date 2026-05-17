import { useMemo, useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/brand/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  useArticles,
  addArticle,
  updateArticle,
  deleteArticle,
  getCategories,
  type KbArticle,
} from "@/lib/kbStore";
import {
  Search,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  ThumbsUp,
  ThumbsDown,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type DraftArticle = {
  id?: string;
  title: { en: string; ar: string };
  category: { en: string; ar: string };
  body: { en: string; ar: string };
  tags: string;
};

const EMPTY: DraftArticle = {
  title: { en: "", ar: "" },
  category: { en: "Services", ar: "الخدمات" },
  body: { en: "", ar: "" },
  tags: "",
};

export default function KB() {
  const { t, lang, pick, isRTL } = useLocale();
  const { user } = useAuth();
  const { toast } = useToast();
  const articles = useArticles();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [active, setActive] = useState<KbArticle | null>(null);
  const [editing, setEditing] = useState<DraftArticle | null>(null);
  const [newCatOpen, setNewCatOpen] = useState(false);
  const [newCat, setNewCat] = useState({ en: "", ar: "" });

  const canEdit = user?.role === "admin" || user?.role === "quality";
  const Chev = isRTL ? ChevronLeft : ChevronRight;

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (cat && a.category.en !== cat) return false;
      if (q) {
        const hay = `${a.title.ar} ${a.title.en} ${a.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [q, cat, articles]);

  const categories = useMemo(() => getCategories(), [articles]);

  function openNew() {
    setEditing({ ...EMPTY, category: categories[0] ?? EMPTY.category });
  }

  function openEdit(a: KbArticle) {
    setEditing({
      id: a.id,
      title: { ...a.title },
      category: { ...a.category },
      body: { ...a.body },
      tags: a.tags.join(", "),
    });
  }

  function saveDraft() {
    if (!editing) return;
    const tagsArr = editing.tags.split(",").map((s) => s.trim()).filter(Boolean);
    if (editing.id) {
      updateArticle(editing.id, {
        title: editing.title,
        category: editing.category,
        body: editing.body,
        tags: tagsArr,
      });
      toast({ title: lang === "ar" ? "تم التحديث" : "Updated" });
    } else {
      addArticle({
        title: editing.title,
        category: editing.category,
        body: editing.body,
        tags: tagsArr,
      });
      toast({ title: lang === "ar" ? "تمت الإضافة" : "Created" });
    }
    setEditing(null);
  }

  function confirmDelete(a: KbArticle) {
    if (!confirm(lang === "ar" ? "حذف المقال؟" : "Delete article?")) return;
    deleteArticle(a.id);
    if (active?.id === a.id) setActive(null);
    toast({ title: lang === "ar" ? "تم الحذف" : "Deleted" });
  }

  if (active) {
    return (
      <div>
        <PageHeader
          title={pick(active.title)}
          subtitle={pick(active.category) + " · " + active.updatedAt}
          actions={
            <>
              {canEdit && (
                <Button size="sm" variant="outline" onClick={() => openEdit(active)}>
                  <Pencil size={14} className="me-1.5" />
                  {t("kb.edit")}
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setActive(null)}>
                {lang === "ar" ? "العودة للقائمة" : "Back to list"}
              </Button>
            </>
          }
        />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <article className="prose prose-slate max-w-none text-[15px] leading-relaxed">
            <p style={{ whiteSpace: "pre-wrap" }}>{pick(active.body)}</p>
            {active.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {active.tags.map((t) => (
                  <span key={t} className="inline-flex items-center text-[11px] rounded-full bg-muted px-2 py-0.5">#{t}</span>
                ))}
              </div>
            )}
          </article>
          <aside className="space-y-4">
            <Card className="shadow-card">
              <CardContent className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">{t("kb.rateArticle")}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1"><ThumbsUp size={14} className="me-1.5" />{t("kb.yes")}</Button>
                  <Button variant="outline" size="sm" className="flex-1"><ThumbsDown size={14} className="me-1.5" />{t("kb.no")}</Button>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-lg font-semibold tabular-nums">{active.views.toLocaleString()}</p>
                  <p className="text-[11px] text-muted-foreground">{t("kb.views")}</p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        {editing && (
          <EditDialog
            editing={editing}
            setEditing={setEditing}
            saveDraft={saveDraft}
            categories={categories}
            newCatOpen={newCatOpen}
            setNewCatOpen={setNewCatOpen}
            newCat={newCat}
            setNewCat={setNewCat}
            onConfirmNewCat={() => {
              if (!newCat.en.trim()) return;
              setEditing({ ...editing, category: newCat });
              setNewCat({ en: "", ar: "" });
              setNewCatOpen(false);
            }}
            t={t}
            lang={lang}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        Icon={BookOpen}
        title={t("nav.kb")}
        subtitle={lang === "ar" ? "أدلة وسياسات للمستفيدين والموظفين" : "Guides and policies for customers and staff"}
        actions={
          canEdit ? (
            <Button size="sm" onClick={openNew} data-testid="button-new-article">
              <Plus size={14} className="me-1.5" />
              {t("kb.new")}
            </Button>
          ) : undefined
        }
      />

      <Card className="shadow-card mb-6 overflow-hidden">
        <CardContent
          className="p-8 lg:p-12 text-center relative"
          style={{
            background:
              "linear-gradient(135deg, hsl(144 56% 94%) 0%, hsl(46 99% 96%) 100%)",
          }}
        >
          <h2 className="text-xl font-semibold mb-2">{t("kb.heroTitle")}</h2>
          <p className="text-sm text-muted-foreground mb-5">{t("kb.heroSub")}</p>
          <div className="max-w-xl mx-auto relative">
            <Search size={18} className={cn("absolute top-1/2 -translate-y-1/2", isRTL ? "right-4" : "left-4", "text-muted-foreground")} />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("kb.searchPlaceholder")}
              className={cn("h-12 text-base bg-card border-border shadow-sm", isRTL ? "pr-12" : "pl-12")}
              data-testid="input-kb-search"
            />
          </div>
        </CardContent>
      </Card>

      {/* Dynamic category tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <button
          onClick={() => setCat(null)}
          className={cn(
            "rounded-xl border bg-card p-4 text-start hover:shadow-card-hover transition-shadow",
            !cat ? "border-primary ring-1 ring-primary/30" : "border-border",
          )}
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
            {t("common.all")}
          </span>
          <span className="text-sm font-medium">{lang === "ar" ? "كل المقالات" : "All articles"}</span>
        </button>
        {categories.map((c) => {
          const count = articles.filter((a) => a.category.en === c.en).length;
          return (
            <button
              key={c.en}
              onClick={() => setCat(c.en)}
              className={cn(
                "rounded-xl border bg-card p-4 text-start hover:shadow-card-hover transition-shadow",
                cat === c.en ? "border-primary ring-1 ring-primary/30" : "border-border",
              )}
            >
              <p className="text-sm font-semibold">{pick(c)}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{count} {lang === "ar" ? "مقالات" : "articles"}</p>
            </button>
          );
        })}
      </div>

      <Card className="shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40">
              <tr>
                <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "العنوان" : "Title"}</th>
                <th className="text-start px-4 py-3 font-medium">{t("common.category")}</th>
                <th className="text-start px-4 py-3 font-medium">{t("kb.views")}</th>
                <th className="text-start px-4 py-3 font-medium">{t("common.lastUpdated")}</th>
                <th className="text-start px-4 py-3 font-medium">{lang === "ar" ? "وسوم" : "Tags"}</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3 font-medium cursor-pointer" onClick={() => setActive(a)}>{pick(a.title)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{pick(a.category)}</td>
                  <td className="px-4 py-3 tabular-nums">{a.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums">{a.updatedAt}</td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground truncate max-w-[180px]">{a.tags.join(", ")}</td>
                  <td className="px-2 py-3 text-end">
                    {canEdit ? (
                      <div className="inline-flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(a)} data-testid={`button-edit-article-${a.id}`}>
                          <Pencil size={14} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => confirmDelete(a)}>
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                    ) : (
                      <Chev size={16} className="text-muted-foreground inline-block" />
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">{t("table.empty")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {editing && (
        <EditDialog
          editing={editing}
          setEditing={setEditing}
          saveDraft={saveDraft}
          categories={categories}
          newCatOpen={newCatOpen}
          setNewCatOpen={setNewCatOpen}
          newCat={newCat}
          setNewCat={setNewCat}
          onConfirmNewCat={() => {
            if (!newCat.en.trim()) return;
            setEditing({ ...editing, category: newCat });
            setNewCat({ en: "", ar: "" });
            setNewCatOpen(false);
          }}
          t={t}
          lang={lang}
        />
      )}
    </div>
  );
}

function EditDialog({
  editing, setEditing, saveDraft, categories, newCatOpen, setNewCatOpen,
  newCat, setNewCat, onConfirmNewCat, t, lang,
}: {
  editing: DraftArticle;
  setEditing: (d: DraftArticle | null) => void;
  saveDraft: () => void;
  categories: { en: string; ar: string }[];
  newCatOpen: boolean;
  setNewCatOpen: (v: boolean) => void;
  newCat: { en: string; ar: string };
  setNewCat: (v: { en: string; ar: string }) => void;
  onConfirmNewCat: () => void;
  t: (k: string) => string;
  lang: "ar" | "en";
}) {
  return (
    <Dialog open onOpenChange={(o) => !o && setEditing(null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing.id ? t("kb.edit") : t("kb.new")}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">{t("kb.title.en")}</Label>
            <Input value={editing.title.en} onChange={(e) => setEditing({ ...editing, title: { ...editing.title, en: e.target.value } })} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">{t("kb.title.ar")}</Label>
            <Input dir="rtl" value={editing.title.ar} onChange={(e) => setEditing({ ...editing, title: { ...editing.title, ar: e.target.value } })} />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label className="text-xs">{t("common.category")}</Label>
            <div className="flex gap-2">
              <Select value={editing.category.en} onValueChange={(v) => {
                const c = categories.find((x) => x.en === v);
                if (c) setEditing({ ...editing, category: c });
              }}>
                <SelectTrigger className="flex-1"><SelectValue>{lang === "ar" ? editing.category.ar : editing.category.en}</SelectValue></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.en} value={c.en}>{lang === "ar" ? c.ar : c.en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={() => setNewCatOpen(true)}>{t("kb.newCat")}</Button>
            </div>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label className="text-xs">{t("kb.body.en")}</Label>
            <Textarea rows={4} value={editing.body.en} onChange={(e) => setEditing({ ...editing, body: { ...editing.body, en: e.target.value } })} />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label className="text-xs">{t("kb.body.ar")}</Label>
            <Textarea rows={4} dir="rtl" value={editing.body.ar} onChange={(e) => setEditing({ ...editing, body: { ...editing.body, ar: e.target.value } })} />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label className="text-xs">{t("kb.tags")}</Label>
            <Input value={editing.tags} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} placeholder="onboarding, services" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setEditing(null)}>{t("common.cancel")}</Button>
          <Button onClick={saveDraft}>{t("common.save")}</Button>
        </DialogFooter>

        <Dialog open={newCatOpen} onOpenChange={setNewCatOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t("kb.newCat")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">EN</Label>
                <Input value={newCat.en} onChange={(e) => setNewCat({ ...newCat, en: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">AR</Label>
                <Input dir="rtl" value={newCat.ar} onChange={(e) => setNewCat({ ...newCat, ar: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewCatOpen(false)}>{t("common.cancel")}</Button>
              <Button onClick={onConfirmNewCat}>{t("common.save")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
