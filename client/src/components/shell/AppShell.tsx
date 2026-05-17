import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useRolePerms } from "@/lib/rolePermissionsStore";
import { useNotifications, markRead, markAllRead } from "@/lib/notificationsStore";
import {
  DropdownMenu as NotifMenu,
  DropdownMenuContent as NotifContent,
  DropdownMenuTrigger as NotifTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "@/contexts/LocaleContext";
import { Logo } from "@/components/brand/Logo";
import { AccessibilityPanel } from "@/components/shell/AccessibilityPanel";
import {
  LayoutDashboard,
  Inbox,
  MessageSquareText,
  BookOpen,
  Users,
  Sparkles,
  Settings,
  HeartHandshake,
  ScrollText,
  Route as RouteIcon,
  Menu,
  Globe,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Info,
  ShieldCheck,
  ClipboardList,
  Bot,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = { href: string; key: string; Icon: any };
type NavGroup = { titleKey: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    titleKey: "nav.overview",
    items: [
      { href: "/about", key: "nav.about", Icon: Info },
    ],
  },
  {
    titleKey: "nav.operate",
    items: [
      { href: "/dashboard", key: "nav.dashboard", Icon: LayoutDashboard },
      { href: "/journeys", key: "nav.journeys", Icon: RouteIcon },
      { href: "/complaints", key: "nav.complaints", Icon: MessageSquareText },
      { href: "/inbox", key: "nav.inbox", Icon: Inbox },
      { href: "/voc", key: "nav.voc", Icon: HeartHandshake },
      { href: "/kb", key: "nav.kb", Icon: BookOpen },
      { href: "/portal", key: "nav.portal", Icon: Users },
      { href: "/copilot", key: "nav.copilot", Icon: Sparkles },
    ],
  },
  {
    titleKey: "nav.govern",
    items: [
      { href: "/governance", key: "nav.governance", Icon: ShieldCheck },
      { href: "/architecture", key: "nav.architecture", Icon: Layers },
      { href: "/programme", key: "nav.programme", Icon: ClipboardList },
      { href: "/audit", key: "nav.audit", Icon: ScrollText },
    ],
  },
  {
    titleKey: "nav.system",
    items: [
      { href: "/automation", key: "nav.automation", Icon: Bot },
      { href: "/admin", key: "nav.admin", Icon: Settings },
    ],
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const { t, lang, toggle, isRTL } = useLocale();
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const perms = useRolePerms();
  const notifs = useNotifications();
  const unread = notifs.filter((n) => !n.read).length;

  if (!user) return null;
  const allowedSet = user.role === "admin"
    ? new Set<string>(Object.keys(perms.admin))
    : new Set<string>(
        Object.entries(perms[user.role] || {})
          .filter(([, v]) => v)
          .map(([k]) => k),
      );
  const allowed = allowedSet;
  // For dynamic routes, mark journeys active even on /journeys/:id
  const visibleGroups = NAV_GROUPS
    .map((g) => ({ ...g, items: g.items.filter((n) => allowed.has(n.href)) }))
    .filter((g) => g.items.length > 0);
  const activeFor = (href: string) =>
    location === href || (href === "/journeys" && location.startsWith("/journeys"));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 z-30 h-screen w-64 border-border bg-sidebar text-sidebar-foreground transition-transform",
          isRTL ? "right-0 border-l" : "left-0 border-r",
          mobileOpen ? "translate-x-0" : isRTL ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center gap-3 px-5 border-b border-sidebar-border">
          <Logo size={32} />
          <div className="flex flex-col leading-tight">
            <span className="text-[14px] font-semibold text-foreground tracking-tight">{t("brand.name")}</span>
            <span className="eyebrow text-muted-foreground">
              {lang === "ar" ? "حكومي" : "Government"}
            </span>
          </div>
        </div>

        <nav className="px-3 py-4 space-y-3 overflow-y-auto max-h-[calc(100vh-10rem)]">
          {visibleGroups.map((group, gi) => (
            <div key={group.titleKey} className={cn(gi > 0 && "pt-2 border-t border-sidebar-border") }>
              <p className={cn("eyebrow px-3 pt-1 pb-1.5 text-muted-foreground", isRTL && "text-right")}>
                {t(group.titleKey)}
              </p>
              <div className="space-y-0.5">
                {group.items.map((n) => {
                  const active = activeFor(n.href);
                  return (
                    <Link
                      key={n.href}
                      href={n.href}
                      data-testid={`nav-${n.href.slice(1)}`}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      <n.Icon size={18} strokeWidth={2} className="shrink-0" />
                      <span className="truncate">{t(n.key)}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 inset-x-0 p-4 border-t border-sidebar-border bg-sidebar">
          <div className="rounded-lg bg-muted/60 px-3 py-2.5 text-[11px] text-muted-foreground leading-snug">
            {lang === "ar"
              ? "بيئة تجريبية. البيانات افتراضية لأغراض العرض."
              : "Demo environment. Data is illustrative only."}
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-foreground/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Main column */}
      <div className={cn(isRTL ? "lg:mr-64" : "lg:ml-64")}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-16 border-b border-border bg-card/95 backdrop-blur">
          <div className="flex h-full items-center gap-3 px-4 lg:px-6">
            <button
              className="lg:hidden p-2 rounded-md hover:bg-muted"
              onClick={() => setMobileOpen(true)}
              data-testid="button-mobile-menu"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            <div className="relative flex-1 max-w-xl min-w-0">
              <Search size={16} className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground", isRTL ? "right-3" : "left-3")} />
              <input
                type="search"
                placeholder={t("common.search") + "…"}
                className={cn(
                  "h-9 w-full rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring",
                  isRTL ? "pr-9 pl-3 text-right" : "pl-9 pr-3",
                )}
                data-testid="input-global-search"
              />
            </div>

            <button
              onClick={toggle}
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border bg-background text-xs font-medium hover:bg-muted"
              data-testid="button-toggle-language"
              aria-label="Toggle language"
            >
              <Globe size={14} />
              {lang === "ar" ? "EN" : "العربية"}
            </button>

            <AccessibilityPanel />

            <NotifMenu>
              <NotifTrigger asChild>
                <button
                  className="relative p-2 rounded-md hover:bg-muted"
                  data-testid="button-notifications"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center ring-2 ring-card">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </button>
              </NotifTrigger>
              <NotifContent align={isRTL ? "start" : "end"} className="w-80 p-0">
                <div className="px-3 py-2.5 border-b border-border flex items-center justify-between">
                  <span className="text-sm font-semibold">{t("notif.title")}</span>
                  {unread > 0 && (
                    <button
                      onClick={() => markAllRead()}
                      className="text-[11px] text-primary hover:underline"
                      data-testid="button-mark-all-read"
                    >
                      {t("notif.markAll")}
                    </button>
                  )}
                </div>
                <ul className="max-h-[360px] overflow-y-auto">
                  {notifs.length === 0 ? (
                    <li className="px-3 py-6 text-center text-xs text-muted-foreground">{t("notif.empty")}</li>
                  ) : (
                    notifs.map((n) => (
                      <li key={n.id}>
                        <button
                          onClick={() => { markRead(n.id); if (n.href) navigate(n.href); }}
                          className={cn(
                            "w-full text-start px-3 py-2.5 flex items-start gap-2 hover:bg-muted/50 transition-colors",
                            !n.read && "bg-primary/5",
                          )}
                          data-testid={`notif-${n.id}`}
                        >
                          <span className={cn(
                            "h-2 w-2 rounded-full mt-1.5 shrink-0",
                            n.severity === "warn" && "bg-rose-500",
                            n.severity === "info" && "bg-sky-500",
                            n.severity === "ok" && "bg-emerald-500",
                          )} />
                          <span className="flex-1 min-w-0">
                            <span className={cn("block text-[12.5px] leading-snug", !n.read && "font-semibold")}>
                              {t(n.titleKey)}
                            </span>
                            <span className="block text-[10.5px] text-muted-foreground tabular-nums mt-0.5">{n.at}</span>
                          </span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </NotifContent>
            </NotifMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 h-9 px-2 rounded-md hover:bg-muted"
                  data-testid="button-user-menu"
                >
                  <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-semibold">
                    {user.initials}
                  </span>
                  <span className="hidden md:flex flex-col items-start leading-tight">
                    <span className="text-[12px] font-semibold">{lang === "ar" ? user.name_ar : user.name_en}</span>
                    <span className="text-[10px] text-muted-foreground">{t("role." + user.role)}</span>
                  </span>
                  <ChevronDown size={14} className="text-muted-foreground hidden md:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{lang === "ar" ? user.name_ar : user.name_en}</span>
                    <span className="text-xs text-muted-foreground">{lang === "ar" ? user.title_ar : user.title_en}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  {t("nav.preferences")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggle}>
                  <Globe size={14} className="me-2" /> {lang === "ar" ? "English" : "العربية"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    signOut();
                    navigate("/login");
                  }}
                  data-testid="button-sign-out"
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut size={14} className="me-2" /> {t("common.signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="h-px gold-rule opacity-60" />
        </header>

        <main className="px-4 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto">{children}</main>
      </div>
    </div>
  );
}
