import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Role = "executive" | "supervisor" | "agent" | "quality" | "customer" | "admin";

export type DemoAccount = {
  email: string;
  password: string;
  role: Role;
  name_en: string;
  name_ar: string;
  title_en: string;
  title_ar: string;
  initials: string;
  landing: string;
};

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: "executive@cx.gov.sa",
    password: "demo",
    role: "executive",
    name_en: "Raid Al-Ghamdi",
    name_ar: "رائد الغامدي",
    title_en: "Chief of Strategy & Business Excellence",
    title_ar: "رئيس الاستراتيجية والتميز المؤسسي",
    initials: "RA",
    landing: "/dashboard",
  },
  {
    email: "supervisor@cx.gov.sa",
    password: "demo",
    role: "supervisor",
    name_en: "Fatima Al-Otaibi",
    name_ar: "فاطمة العتيبي",
    title_en: "CX Supervisor",
    title_ar: "مشرفة تجربة المستفيد",
    initials: "FA",
    landing: "/dashboard",
  },
  {
    email: "agent@cx.gov.sa",
    password: "demo",
    role: "agent",
    name_en: "Ahmed Al-Harbi",
    name_ar: "أحمد الحربي",
    title_en: "Service Agent",
    title_ar: "موظف خدمة المستفيدين",
    initials: "AH",
    landing: "/inbox",
  },
  {
    email: "quality@cx.gov.sa",
    password: "demo",
    role: "quality",
    name_en: "Layla Al-Qahtani",
    name_ar: "ليلى القحطاني",
    title_en: "Quality Officer",
    title_ar: "مسؤولة الجودة",
    initials: "LA",
    landing: "/complaints",
  },
  {
    email: "customer@cx.gov.sa",
    password: "demo",
    role: "customer",
    name_en: "Khalid Al-Mutairi",
    name_ar: "خالد المطيري",
    title_en: "Citizen",
    title_ar: "عميل",
    initials: "KA",
    landing: "/portal",
  },
  {
    email: "admin@cx.gov.sa",
    password: "demo",
    role: "admin",
    name_en: "Nour Al-Saud",
    name_ar: "نور آل سعود",
    title_en: "System Administrator",
    title_ar: "مسؤولة النظام",
    initials: "NA",
    landing: "/admin",
  },
];

type AuthCtx = {
  user: DemoAccount | null;
  signIn: (email: string, password: string) => DemoAccount | null;
  signOut: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoAccount | null>(null);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      signIn: (email: string, password: string) => {
        const found = DEMO_ACCOUNTS.find(
          (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password,
        );
        if (found) setUser(found);
        return found ?? null;
      },
      signOut: () => setUser(null),
    }),
    [user],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}

// Per-role module access for sidebar visibility and route guarding.
export const ROLE_NAV: Record<Role, string[]> = {
  executive: ["/about", "/dashboard", "/voc", "/kb", "/journeys", "/governance", "/programme"],
  supervisor: ["/about", "/dashboard", "/complaints", "/inbox", "/voc", "/kb", "/copilot", "/journeys", "/governance", "/programme"],
  agent: ["/about", "/inbox", "/complaints", "/kb", "/copilot", "/journeys"],
  quality: ["/about", "/complaints", "/voc", "/kb", "/audit", "/journeys", "/governance"],
  customer: ["/about", "/portal", "/kb"],
  admin: [
    "/about",
    "/dashboard",
    "/complaints",
    "/inbox",
    "/voc",
    "/kb",
    "/portal",
    "/copilot",
    "/admin",
    "/audit",
    "/journeys",
    "/governance",
    "/programme",
  ],
};
