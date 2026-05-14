// Static seed for Governance & Compliance module.
// All content bilingual. Saudi-government context.

export type Bi = { en: string; ar: string };

// ── Vision 2030 themes ─────────────────────────────────────────────
export const VISION_2030_THEMES: {
  id: string;
  title: Bi;
  description: Bi;
  contribution: Bi;
}[] = [
  {
    id: "vibrant-society",
    title: { en: "A Vibrant Society", ar: "مجتمع حيوي" },
    description: {
      en: "Strong roots, fulfilling lives, and engaged citizens.",
      ar: "جذور راسخة، حياة عامرة، وعميلون مشاركون.",
    },
    contribution: {
      en: "Accessible, fair, bilingual services for every citizen — including persons with disabilities (WCAG 2.2 AA), with closed-loop feedback that drives continuous improvement.",
      ar: "خدمات ميسّرة وعادلة وثنائية اللغة لكل مواطن — بما في ذلك ذوو الإعاقة (WCAG 2.2 AA)، مع حلقة تغذية راجعة تدفع التحسين المستمر.",
    },
  },
  {
    id: "thriving-economy",
    title: { en: "A Thriving Economy", ar: "اقتصاد مزدهر" },
    description: {
      en: "Rewarding opportunities and an attractive investment environment.",
      ar: "فرص مجزية وبيئة استثمارية جاذبة.",
    },
    contribution: {
      en: "Lower cost-to-serve, faster complaint cycle times, and self-service deflection that frees capacity for high-value casework.",
      ar: "خفض تكلفة الخدمة، تسريع زمن دورة الشكاوى، وتحويل الطلبات للخدمة الذاتية يحرّر القدرات للحالات ذات القيمة العالية.",
    },
  },
  {
    id: "ambitious-nation",
    title: { en: "An Ambitious Nation", ar: "وطن طموح" },
    description: {
      en: "Effective government and responsible citizenry.",
      ar: "حكومة فاعلة ومواطنة مسؤولة.",
    },
    contribution: {
      en: "API-first, auditable, AI-enabled operations aligned to DGA digital maturity; evidence-ready for regulators (PDPL, NCA ECC).",
      ar: "عمليات مرتبطة بواجهات برمجية، قابلة للتدقيق، ومدعومة بالذكاء الاصطناعي بما يتوافق مع نضج التحول الرقمي (DGA)، مع جاهزية الأدلة للجهات الرقابية (PDPL، NCA ECC).",
    },
  },
];

// ── DGA Digital Maturity (5 dimensions) ─────────────────────────────
export const DGA_MATURITY: {
  dimension: Bi;
  current: number; // 1-5
  target: number;
  fullMark: number;
}[] = [
  { dimension: { en: "Strategy & Governance", ar: "الاستراتيجية والحوكمة" }, current: 3.6, target: 4.5, fullMark: 5 },
  { dimension: { en: "Customer Experience", ar: "تجربة المستفيد" }, current: 3.2, target: 4.6, fullMark: 5 },
  { dimension: { en: "Operations", ar: "العمليات" }, current: 3.0, target: 4.2, fullMark: 5 },
  { dimension: { en: "Technology & Data", ar: "التقنية والبيانات" }, current: 3.4, target: 4.5, fullMark: 5 },
  { dimension: { en: "People & Culture", ar: "الموارد البشرية والثقافة" }, current: 2.9, target: 4.0, fullMark: 5 },
];

// ── EFQM 7 criteria ────────────────────────────────────────────────
export const EFQM_CRITERIA: {
  id: string;
  title: Bi;
  description: Bi;
  score: number; // 0-100
}[] = [
  {
    id: "purpose",
    title: { en: "Purpose, Vision & Strategy", ar: "الغاية والرؤية والاستراتيجية" },
    description: {
      en: "Mission, vision, and strategy connect platform outcomes to Vision 2030.",
      ar: "ربط الرسالة والرؤية والاستراتيجية بمخرجات المنصة ورؤية 2030.",
    },
    score: 78,
  },
  {
    id: "culture",
    title: { en: "Organisational Culture & Leadership", ar: "الثقافة المؤسسية والقيادة" },
    description: { en: "CX-first culture, leadership engagement, ethics.", ar: "ثقافة محورها المستفيد، التزام القيادة، الأخلاقيات." },
    score: 72,
  },
  {
    id: "stakeholders",
    title: { en: "Engaging Stakeholders", ar: "إشراك أصحاب المصلحة" },
    description: { en: "Citizen co-design, employee voice, partner alignment.", ar: "تصميم تشاركي مع المستفيدين، وصوت الموظف، ومواءمة الشركاء." },
    score: 70,
  },
  {
    id: "value",
    title: { en: "Creating Sustainable Value", ar: "خلق قيمة مستدامة" },
    description: { en: "Service portfolio that delivers measurable outcomes.", ar: "حقيبة خدمات تقدم نتائج قابلة للقياس." },
    score: 74,
  },
  {
    id: "transformation",
    title: { en: "Driving Performance & Transformation", ar: "قيادة الأداء والتحول" },
    description: { en: "Operational excellence, change management, ET adoption.", ar: "التميز التشغيلي، إدارة التغيير، تبني التقنيات الناشئة." },
    score: 68,
  },
  {
    id: "perceptions",
    title: { en: "Stakeholder Perceptions", ar: "إدراكات أصحاب المصلحة" },
    description: { en: "CSAT, NPS, employee engagement, partner satisfaction.", ar: "رضا المستفيدين، صافي المروّجين، تفاعل الموظفين، رضا الشركاء." },
    score: 76,
  },
  {
    id: "performance",
    title: { en: "Strategic & Operational Performance", ar: "الأداء الاستراتيجي والتشغيلي" },
    description: { en: "Outcomes tied to strategic KPIs and SLAs.", ar: "نتائج مرتبطة بمؤشرات الأداء الاستراتيجية واتفاقيات الخدمة." },
    score: 73,
  },
];

// ── ISO families ───────────────────────────────────────────────────
export const ISO_FAMILIES: { code: string; title: Bi; status: "compliant" | "in-progress" | "planned" }[] = [
  { code: "ISO 9001:2015", title: { en: "Quality Management Systems", ar: "نظم إدارة الجودة" }, status: "compliant" },
  { code: "ISO 10002:2018", title: { en: "Complaint Handling", ar: "معالجة الشكاوى" }, status: "compliant" },
  { code: "ISO/IEC 27001:2022", title: { en: "Information Security Mgmt", ar: "إدارة أمن المعلومات" }, status: "in-progress" },
  { code: "ISO 9241-11", title: { en: "Usability — Effectiveness/Efficiency", ar: "قابلية الاستخدام" }, status: "in-progress" },
];

// ── Compliance scorecards ──────────────────────────────────────────
export type ComplianceStandard = {
  id: string;
  code: string;
  title: Bi;
  scope: Bi;
  version: string;
  compliance: number; // 0-100
  lastAudit: string;
  nextReview: string;
  evidence: number;
  owner: Bi;
  findings: { severity: "high" | "medium" | "low"; title: Bi }[];
};

export const COMPLIANCE_STANDARDS: ComplianceStandard[] = [
  {
    id: "dga",
    code: "DGA",
    title: { en: "Digital Government Authority Maturity", ar: "نضج الحكومة الرقمية" },
    scope: { en: "Digital maturity across 5 dimensions", ar: "النضج الرقمي عبر 5 أبعاد" },
    version: "2024",
    compliance: 78,
    lastAudit: "2025-09-12",
    nextReview: "2026-03-15",
    evidence: 142,
    owner: { en: "Digital Transformation Office", ar: "مكتب التحول الرقمي" },
    findings: [
      { severity: "medium", title: { en: "AI explainability documentation incomplete", ar: "نقص في توثيق قابلية تفسير نماذج الذكاء الاصطناعي" } },
      { severity: "low", title: { en: "API metric dashboards lack p99 view", ar: "لوحات مؤشرات الواجهات لا تشمل P99" } },
    ],
  },
  {
    id: "efqm",
    code: "EFQM",
    title: { en: "European Foundation for Quality Management", ar: "المؤسسة الأوروبية لإدارة الجودة" },
    scope: { en: "EFQM 2025 model — 7 criteria", ar: "نموذج EFQM 2025 — 7 معايير" },
    version: "2025",
    compliance: 73,
    lastAudit: "2025-07-22",
    nextReview: "2026-01-20",
    evidence: 96,
    owner: { en: "Excellence & Strategy Department", ar: "إدارة التميز والاستراتيجية" },
    findings: [
      { severity: "medium", title: { en: "Co-design forums not extended to all service lines", ar: "ورش التصميم التشاركي لم تشمل كل خطوط الخدمة" } },
    ],
  },
  {
    id: "iso9001",
    code: "ISO 9001",
    title: { en: "Quality Management Systems", ar: "نظم إدارة الجودة" },
    scope: { en: "Customer focus and continual improvement", ar: "التركيز على المستفيد والتحسين المستمر" },
    version: "2015",
    compliance: 92,
    lastAudit: "2025-11-04",
    nextReview: "2026-05-10",
    evidence: 218,
    owner: { en: "Quality Department", ar: "إدارة الجودة" },
    findings: [
      { severity: "low", title: { en: "Annual management review minutes missing one period", ar: "محضر المراجعة الإدارية ينقصه ربع واحد" } },
    ],
  },
  {
    id: "iso10002",
    code: "ISO 10002",
    title: { en: "Complaint Handling", ar: "معالجة الشكاوى" },
    scope: { en: "End-to-end complaint workflow", ar: "دورة شكاوى متكاملة" },
    version: "2018",
    compliance: 95,
    lastAudit: "2025-10-28",
    nextReview: "2026-04-18",
    evidence: 312,
    owner: { en: "Customer Experience Office", ar: "مكتب تجربة المستفيد" },
    findings: [],
  },
  {
    id: "iso27001",
    code: "ISO/IEC 27001",
    title: { en: "Information Security Management", ar: "إدارة أمن المعلومات" },
    scope: { en: "ISMS controls and Annex A 2022", ar: "ضوابط نظام إدارة أمن المعلومات والملحق أ 2022" },
    version: "2022",
    compliance: 81,
    lastAudit: "2025-08-15",
    nextReview: "2026-02-10",
    evidence: 187,
    owner: { en: "Chief Information Security Officer", ar: "الرئيس التنفيذي لأمن المعلومات" },
    findings: [
      { severity: "medium", title: { en: "Two SoA controls awaiting evidence refresh", ar: "ضابطان في بيان الانطباق ينتظران تحديث الأدلة" } },
      { severity: "low", title: { en: "Backup restore drill cadence to quarterly", ar: "تواتر تمارين استعادة النسخ الاحتياطي إلى الربعي" } },
    ],
  },
  {
    id: "wcag",
    code: "WCAG 2.2 AA",
    title: { en: "Web Content Accessibility Guidelines", ar: "إرشادات الوصول إلى محتوى الويب" },
    scope: { en: "All public-facing surfaces", ar: "كل الواجهات العامة" },
    version: "2.2 AA",
    compliance: 88,
    lastAudit: "2025-10-02",
    nextReview: "2026-04-01",
    evidence: 64,
    owner: { en: "UX & Accessibility Lead", ar: "مسؤول تجربة المستخدم وإمكانية الوصول" },
    findings: [
      { severity: "medium", title: { en: "Focus order issues on 3 forms", ar: "ترتيب التركيز معطوب في 3 نماذج" } },
    ],
  },
  {
    id: "pdpl",
    code: "PDPL",
    title: { en: "Personal Data Protection Law (SA)", ar: "نظام حماية البيانات الشخصية" },
    scope: { en: "Saudi PDPL — privacy by design across the platform", ar: "نظام حماية البيانات الشخصية السعودي — الخصوصية بالتصميم" },
    version: "2023",
    compliance: 84,
    lastAudit: "2025-09-30",
    nextReview: "2026-03-25",
    evidence: 156,
    owner: { en: "Data Protection Officer", ar: "مسؤول حماية البيانات" },
    findings: [
      { severity: "high", title: { en: "DSAR workflow needs purpose-limitation field", ar: "سير عمل طلبات أصحاب البيانات يفتقر لحقل تقييد الغرض" } },
      { severity: "medium", title: { en: "Consent revocation propagation delay > 24h on 1 channel", ar: "تأخر انتشار سحب الموافقة > 24 ساعة على قناة واحدة" } },
    ],
  },
  {
    id: "nca",
    code: "NCA ECC",
    title: { en: "National Cybersecurity Authority — Essential Controls", ar: "الهيئة الوطنية للأمن السيبراني — الضوابط الأساسية" },
    scope: { en: "ECC-1:2018 + CCC where applicable", ar: "الضوابط الأساسية 2018 + ضوابط السحابة عند الاقتضاء" },
    version: "ECC-1:2018",
    compliance: 86,
    lastAudit: "2025-08-22",
    nextReview: "2026-02-25",
    evidence: 203,
    owner: { en: "CISO Office", ar: "مكتب الرئيس التنفيذي لأمن المعلومات" },
    findings: [
      { severity: "medium", title: { en: "Privileged access reviewed semi-annually — move to quarterly", ar: "مراجعة الصلاحيات الإدارية نصف سنوية — نقلها إلى ربعية" } },
    ],
  },
];

// ── Governance forums ──────────────────────────────────────────────
export const GOVERNANCE_FORUMS: {
  id: string;
  name: Bi;
  cadence: Bi;
  chair: Bi;
  members: Bi;
  mandate: Bi;
}[] = [
  {
    id: "steering",
    name: { en: "CX Executive Steering Committee", ar: "اللجنة التنفيذية لتوجيه تجربة المستفيد" },
    cadence: { en: "Monthly", ar: "شهرياً" },
    chair: { en: "Chief of Strategy & Business Excellence", ar: "رئيس الاستراتيجية والتميز المؤسسي" },
    members: { en: "CIO · CDO · CISO · COO · CX Owner · DPO", ar: "الرئيس التقني · رئيس البيانات · رئيس الأمن · رئيس العمليات · مالك تجربة المستفيد · مسؤول حماية البيانات" },
    mandate: { en: "Strategy, outcomes, investment decisions, escalations.", ar: "الاستراتيجية، النتائج، قرارات الاستثمار، التصعيدات." },
  },
  {
    id: "ops",
    name: { en: "CX Operations Council", ar: "مجلس عمليات تجربة المستفيد" },
    cadence: { en: "Weekly", ar: "أسبوعياً" },
    chair: { en: "CX Director", ar: "مدير تجربة المستفيد" },
    members: { en: "Service Owners · Supervisors · Quality · Knowledge", ar: "ملاك الخدمات · المشرفون · الجودة · المعرفة" },
    mandate: { en: "Operations, SLAs, complaints triage, weekly performance.", ar: "العمليات، اتفاقيات مستوى الخدمة، فرز الشكاوى، الأداء الأسبوعي." },
  },
  {
    id: "arch",
    name: { en: "Architecture Review Board", ar: "مجلس مراجعة المعمارية" },
    cadence: { en: "Bi-weekly", ar: "كل أسبوعين" },
    chair: { en: "Chief Architect", ar: "رئيس المعمارية" },
    members: { en: "Domain Architects · Security Architect · Data Architect", ar: "معماريو المجالات · معماري الأمن · معماري البيانات" },
    mandate: { en: "Solution and integration design decisions, standards.", ar: "قرارات تصميم الحلول والتكامل، المعايير." },
  },
  {
    id: "data",
    name: { en: "Data Governance Council", ar: "مجلس حوكمة البيانات" },
    cadence: { en: "Monthly", ar: "شهرياً" },
    chair: { en: "Chief Data Officer", ar: "رئيس البيانات" },
    members: { en: "Data Owners · DPO · Quality · CISO delegate", ar: "ملاك البيانات · مسؤول حماية البيانات · الجودة · مفوض الأمن" },
    mandate: { en: "Data quality, classification, retention, PDPL compliance.", ar: "جودة البيانات، التصنيف، الاحتفاظ، الامتثال لنظام حماية البيانات." },
  },
  {
    id: "cab",
    name: { en: "Change Advisory Board", ar: "مجلس استشارة التغيير" },
    cadence: { en: "Weekly", ar: "أسبوعياً" },
    chair: { en: "Release Manager", ar: "مدير الإطلاق" },
    members: { en: "Ops · Security · QA · Service Owners", ar: "العمليات · الأمن · ضمان الجودة · ملاك الخدمات" },
    mandate: { en: "Release governance, change risk, deployment windows.", ar: "حوكمة الإطلاق، مخاطر التغيير، نوافذ النشر." },
  },
  {
    id: "ai",
    name: { en: "AI & ET Governance Board", ar: "مجلس حوكمة الذكاء الاصطناعي والتقنيات الناشئة" },
    cadence: { en: "Monthly", ar: "شهرياً" },
    chair: { en: "Head of AI / Data Science", ar: "رئيس الذكاء الاصطناعي وعلم البيانات" },
    members: { en: "Ethics rep · Legal · CISO · DPO · Business sponsor", ar: "ممثل الأخلاقيات · القانوني · الأمن · حماية البيانات · راعي الأعمال" },
    mandate: { en: "Model approvals, ethics, ET stage gates, kill-switch.", ar: "اعتماد النماذج، الأخلاقيات، بوابات التقنية الناشئة، آليات الإيقاف." },
  },
];

// ── RACI ───────────────────────────────────────────────────────────
export type RaciCell = "R" | "A" | "C" | "I" | "";
export const RACI_ROLES: Bi[] = [
  { en: "Executive Sponsor", ar: "الراعي التنفيذي" },
  { en: "CX Director", ar: "مدير تجربة المستفيد" },
  { en: "Quality Officer", ar: "مسؤول الجودة" },
  { en: "Data Owner", ar: "مالك البيانات" },
  { en: "CISO", ar: "رئيس أمن المعلومات" },
  { en: "Architect", ar: "المعماري" },
  { en: "Legal / DPO", ar: "القانوني / حماية البيانات" },
  { en: "Operations Mgr", ar: "مدير العمليات" },
  { en: "Agent", ar: "موظف الخدمة" },
];

export const RACI_ACTIVITIES: { activity: Bi; cells: RaciCell[] }[] = [
  { activity: { en: "Approve platform roadmap", ar: "اعتماد خارطة الطريق" }, cells: ["A", "R", "C", "C", "C", "C", "C", "I", ""] },
  { activity: { en: "Approve new channel onboarding", ar: "اعتماد إضافة قناة جديدة" }, cells: ["A", "R", "C", "C", "C", "R", "C", "I", ""] },
  { activity: { en: "Define and publish SLA targets", ar: "تحديد ونشر أهداف اتفاقيات الخدمة" }, cells: ["A", "R", "C", "I", "I", "I", "I", "C", ""] },
  { activity: { en: "Sign off vendor RFP", ar: "اعتماد كراسة الشروط" }, cells: ["A", "C", "C", "C", "C", "R", "C", "I", ""] },
  { activity: { en: "Close major complaint (Tier 3)", ar: "إغلاق شكوى حرجة (الفئة 3)" }, cells: ["I", "A", "R", "C", "I", "I", "C", "R", "I"] },
  { activity: { en: "Approve KPI targets", ar: "اعتماد مستهدفات المؤشرات" }, cells: ["A", "R", "C", "I", "I", "I", "I", "C", ""] },
  { activity: { en: "Approve AI model release", ar: "اعتماد إطلاق نموذج ذكاء اصطناعي" }, cells: ["A", "C", "C", "C", "R", "R", "R", "I", ""] },
  { activity: { en: "Approve knowledge article", ar: "اعتماد مقال معرفة" }, cells: ["I", "A", "R", "C", "I", "I", "C", "C", "I"] },
  { activity: { en: "Respond to PDPL data-subject request", ar: "الاستجابة لطلب صاحب البيانات" }, cells: ["I", "C", "C", "R", "C", "I", "A", "C", "I"] },
  { activity: { en: "Approve emergency change", ar: "اعتماد تغيير طارئ" }, cells: ["I", "A", "I", "I", "C", "C", "I", "R", ""] },
  { activity: { en: "Audit response (ISO/regulator)", ar: "الاستجابة للتدقيق (ISO/جهة تنظيمية)" }, cells: ["I", "C", "R", "C", "C", "C", "C", "A", "I"] },
  { activity: { en: "Approve DPIA for new high-risk use", ar: "اعتماد تقييم الأثر للخصوصية" }, cells: ["I", "C", "C", "R", "C", "C", "A", "I", ""] },
];

// ── Decision rights ────────────────────────────────────────────────
export const DECISION_RIGHTS: { decision: Bi; decider: Bi; escalation: Bi }[] = [
  { decision: { en: "Add a public channel (e.g. new social network)", ar: "إضافة قناة عامة (مثلاً شبكة اجتماعية)" }, decider: { en: "CX Director with Architecture Board concurrence", ar: "مدير تجربة المستفيد بموافقة مجلس المعمارية" }, escalation: { en: "Executive Steering", ar: "اللجنة التنفيذية" } },
  { decision: { en: "Change retention policy for a data class", ar: "تغيير سياسة الاحتفاظ لفئة بيانات" }, decider: { en: "Data Owner + DPO", ar: "مالك البيانات + مسؤول حماية البيانات" }, escalation: { en: "Data Governance Council", ar: "مجلس حوكمة البيانات" } },
  { decision: { en: "Deploy generative model to citizens", ar: "نشر نموذج توليدي للمستفيدين" }, decider: { en: "AI Governance Board (HITL required)", ar: "مجلس حوكمة الذكاء الاصطناعي (يلزم تدخل بشري)" }, escalation: { en: "Executive Steering", ar: "اللجنة التنفيذية" } },
  { decision: { en: "Major release on production", ar: "إطلاق رئيسي إلى الإنتاج" }, decider: { en: "Change Advisory Board", ar: "مجلس استشارة التغيير" }, escalation: { en: "CIO", ar: "الرئيس التقني" } },
  { decision: { en: "Suspend an integration partner", ar: "تعليق شريك تكامل" }, decider: { en: "CISO + Procurement", ar: "رئيس الأمن + المشتريات" }, escalation: { en: "Executive Steering", ar: "اللجنة التنفيذية" } },
];
