// Programme module seed: roadmap, RAID, TCO, change/training.
import type { Bi } from "./governanceData";

// ── Roadmap ────────────────────────────────────────────────────────
export type Phase = {
  id: string;
  name: Bi;
  start: string; // YYYY-MM
  end: string;
  status: "complete" | "in-progress" | "upcoming";
  deliverables: Bi[];
  gates: Bi[];
};

export const ROADMAP_PHASES: Phase[] = [
  {
    id: "discovery",
    name: { en: "1. Discovery", ar: "1. الاكتشاف" },
    start: "2025-04", end: "2025-06",
    status: "complete",
    deliverables: [
      { en: "Stakeholder interviews (42 sessions)", ar: "مقابلات أصحاب المصلحة (42 جلسة)" },
      { en: "Current-state journey baseline", ar: "خط الأساس للرحلات الحالية" },
      { en: "Blueprint + RFP package", ar: "كراسة الشروط والمخطط" },
    ],
    gates: [
      { en: "Steering Committee sign-off", ar: "موافقة اللجنة التوجيهية" },
      { en: "Baseline KPI dataset accepted", ar: "اعتماد بيانات خط الأساس" },
    ],
  },
  {
    id: "foundation",
    name: { en: "2. Foundation (MVP)", ar: "2. التأسيس (الحد الأدنى)" },
    start: "2025-07", end: "2026-01",
    status: "in-progress",
    deliverables: [
      { en: "Omnichannel core: web, app, WhatsApp, email", ar: "النواة متعددة القنوات" },
      { en: "Case + complaint workflow (ISO 10002)", ar: "دورة الحالات والشكاوى ISO 10002" },
      { en: "Bilingual KB + portal", ar: "قاعدة المعرفة والبوابة ثنائية اللغة" },
      { en: "Executive scorecard + VoC v1", ar: "لوحة القيادة وصوت المستفيد" },
      { en: "RBAC + SSO via Nafath", ar: "صلاحيات وتسجيل دخول موحد عبر نفاذ" },
      { en: "AI copilot (agent) — HITL", ar: "مساعد الموظف بتدخل بشري" },
    ],
    gates: [
      { en: "Architecture Board approval", ar: "موافقة مجلس المعمارية" },
      { en: "Security & PDPL readiness", ar: "جاهزية الأمن وحماية البيانات" },
      { en: "Operational readiness review", ar: "مراجعة الجاهزية التشغيلية" },
    ],
  },
  {
    id: "scale",
    name: { en: "3. Scale (Phase 2)", ar: "3. التوسع (المرحلة الثانية)" },
    start: "2026-02", end: "2026-09",
    status: "upcoming",
    deliverables: [
      { en: "Journey analytics + funnel insights", ar: "تحليلات الرحلات ومسارات الانسحاب" },
      { en: "AI-assisted QA on 100% of eligible volume", ar: "تقييم جودة آلي" },
      { en: "Predictive risk + next-best-action", ar: "التنبؤ بالمخاطر والإجراء التالي" },
      { en: "Workforce management module", ar: "وحدة إدارة القوى العاملة" },
      { en: "ET sandbox + first IoT/AR PoCs", ar: "بيئة تقنيات ناشئة وتجارب IoT/AR" },
    ],
    gates: [
      { en: "Phase 1 KPI realisation", ar: "تحقيق مؤشرات المرحلة الأولى" },
      { en: "AI Governance Board re-approval", ar: "اعتماد مجلس حوكمة الذكاء الاصطناعي" },
    ],
  },
  {
    id: "optimise",
    name: { en: "4. Optimise & Roll-out", ar: "4. التحسين والانتشار" },
    start: "2026-10", end: "2027-03",
    status: "upcoming",
    deliverables: [
      { en: "Multi-entity roll-out (4 entities)", ar: "نشر متعدد الجهات (4 جهات)" },
      { en: "AI tuning + content quality drive", ar: "ضبط الذكاء الاصطناعي وجودة المحتوى" },
      { en: "EFQM external assessment", ar: "تقييم EFQM خارجي" },
      { en: "ISO 9001 re-certification", ar: "تجديد شهادة ISO 9001" },
    ],
    gates: [
      { en: "Adoption ≥ 80% per role", ar: "تبني ≥ 80٪ لكل دور" },
      { en: "Audit closure ≥ 90% on time", ar: "إغلاق التدقيقات ≥ 90٪ ضمن الموعد" },
    ],
  },
];

// Workstreams (gantt rows)
export const WORKSTREAMS: { id: string; name: Bi; start: string; end: string; phase: string }[] = [
  { id: "platform", name: { en: "Platform core", ar: "نواة المنصة" }, start: "2025-07", end: "2026-01", phase: "foundation" },
  { id: "integrations", name: { en: "Integrations (IdP, Pay, Comms)", ar: "التكاملات" }, start: "2025-08", end: "2026-03", phase: "foundation" },
  { id: "ai", name: { en: "AI / Copilot", ar: "الذكاء الاصطناعي" }, start: "2025-09", end: "2026-06", phase: "scale" },
  { id: "governance", name: { en: "Governance & Compliance", ar: "الحوكمة والامتثال" }, start: "2025-07", end: "2026-12", phase: "foundation" },
  { id: "change", name: { en: "Change & Adoption", ar: "التغيير والتبني" }, start: "2025-08", end: "2026-09", phase: "foundation" },
  { id: "training", name: { en: "Training & Enablement", ar: "التدريب والتمكين" }, start: "2025-10", end: "2026-12", phase: "foundation" },
];

// ── RAID Log ──────────────────────────────────────────────────────
export type Likelihood = 1 | 2 | 3 | 4 | 5;
export type Impact = 1 | 2 | 3 | 4 | 5;

export type Risk = {
  id: string;
  title: Bi;
  category: Bi;
  likelihood: Likelihood;
  impact: Impact;
  mitigation: Bi;
  owner: Bi;
  status: Bi;
  target: string;
};

export const RISKS: Risk[] = [
  { id: "R-01", title: { en: "Scope creep across phases", ar: "تمدد النطاق عبر المراحل" }, category: { en: "Delivery", ar: "التسليم" }, likelihood: 4, impact: 4, mitigation: { en: "Strict MVP definition, formal change control, monthly trade-off review.", ar: "نطاق محدد، ضبط رسمي للتغيير، مراجعة شهرية." }, owner: { en: "Programme Director", ar: "مدير البرنامج" }, status: { en: "Active mitigation", ar: "تخفيف نشط" }, target: "2026-01" },
  { id: "R-02", title: { en: "Legacy CRM/telephony API gaps", ar: "ثغرات في واجهات CRM/الهاتف القديمة" }, category: { en: "Integration", ar: "تكامل" }, likelihood: 4, impact: 5, mitigation: { en: "Adapter layer + iPaaS + fallback queues; vendor contractual commitments.", ar: "طبقة محولات + iPaaS + طوابير احتياطية." }, owner: { en: "Chief Architect", ar: "رئيس المعمارية" }, status: { en: "Active mitigation", ar: "تخفيف نشط" }, target: "2026-03" },
  { id: "R-03", title: { en: "Data quality at migration", ar: "جودة البيانات عند الترحيل" }, category: { en: "Data", ar: "بيانات" }, likelihood: 4, impact: 4, mitigation: { en: "DQ baseline, cleansing rules, golden-record stewardship.", ar: "خط أساس للجودة، قواعد تنظيف، سجل ذهبي." }, owner: { en: "Data Owner", ar: "مالك البيانات" }, status: { en: "Active mitigation", ar: "تخفيف نشط" }, target: "2025-12" },
  { id: "R-04", title: { en: "AR-RTL defects discovered late", ar: "اكتشاف خلل اليمين لليسار متأخراً" }, category: { en: "Localization", ar: "تعريب" }, likelihood: 3, impact: 4, mitigation: { en: "Pseudo-localization, AR in CI, native QA per release.", ar: "ترجمة تجريبية، اختبار في CI، مراجعة محلية." }, owner: { en: "UX Lead", ar: "قائد تجربة المستخدم" }, status: { en: "Under control", ar: "تحت السيطرة" }, target: "2026-01" },
  { id: "R-05", title: { en: "Low agent adoption of copilot", ar: "ضعف تبني الموظفين للمساعد الذكي" }, category: { en: "Adoption", ar: "التبني" }, likelihood: 3, impact: 4, mitigation: { en: "Champions, role-based training, copilot acceptance KPI.", ar: "أبطال تغيير، تدريب لكل دور، مؤشر قبول." }, owner: { en: "Change Lead", ar: "قائد التغيير" }, status: { en: "Active mitigation", ar: "تخفيف نشط" }, target: "2026-04" },
  { id: "R-06", title: { en: "Hallucination or bias in generative replies", ar: "هلوسة أو تحيز في الردود التوليدية" }, category: { en: "AI", ar: "ذكاء اصطناعي" }, likelihood: 3, impact: 5, mitigation: { en: "RAG grounding, HITL, weekly bias audits, kill switch.", ar: "تثبيت بالمعرفة، مراجعة بشرية، تدقيق أسبوعي." }, owner: { en: "AI Owner", ar: "مالك الذكاء الاصطناعي" }, status: { en: "Active mitigation", ar: "تخفيف نشط" }, target: "Ongoing" },
  { id: "R-07", title: { en: "PDPL breach or over-collection", ar: "خرق نظام حماية البيانات أو جمع مفرط" }, category: { en: "Privacy", ar: "الخصوصية" }, likelihood: 2, impact: 5, mitigation: { en: "Privacy by design, DPIA gates, data minimization, training.", ar: "خصوصية بالتصميم، بوابات DPIA، تقليل البيانات." }, owner: { en: "DPO", ar: "مسؤول حماية البيانات" }, status: { en: "Under control", ar: "تحت السيطرة" }, target: "Ongoing" },
  { id: "R-08", title: { en: "Bilingual content shortfall", ar: "نقص المحتوى ثنائي اللغة" }, category: { en: "Content", ar: "محتوى" }, likelihood: 4, impact: 3, mitigation: { en: "Translation memory, dedicated bilingual editors, content backlog SLA.", ar: "ذاكرة ترجمة، محررون متخصصون." }, owner: { en: "Content Lead", ar: "قائد المحتوى" }, status: { en: "Active mitigation", ar: "تخفيف نشط" }, target: "2026-06" },
  { id: "R-09", title: { en: "Cross-border data transfer", ar: "نقل البيانات عبر الحدود" }, category: { en: "Regulatory", ar: "تنظيمي" }, likelihood: 2, impact: 5, mitigation: { en: "Residency contractual + technical controls, encryption with KMS-bound keys.", ar: "ضوابط تعاقدية وتقنية للإقامة." }, owner: { en: "DPO + CISO", ar: "حماية البيانات + الأمن" }, status: { en: "Under control", ar: "تحت السيطرة" }, target: "Ongoing" },
  { id: "R-10", title: { en: "Vendor lock-in", ar: "اعتماد مفرط على مورد" }, category: { en: "Procurement", ar: "مشتريات" }, likelihood: 3, impact: 3, mitigation: { en: "Open standards, data export rights, multi-vendor strategy.", ar: "معايير مفتوحة، حقوق تصدير البيانات." }, owner: { en: "Procurement Lead", ar: "قائد المشتريات" }, status: { en: "Monitoring", ar: "مراقبة" }, target: "Ongoing" },
  { id: "R-11", title: { en: "Hypercare gap after go-live", ar: "فجوة الرعاية الفائقة بعد الإطلاق" }, category: { en: "Operations", ar: "عمليات" }, likelihood: 3, impact: 4, mitigation: { en: "Dedicated 8-week hypercare, L2/L3 readiness, war-room cadence.", ar: "8 أسابيع رعاية مكثفة." }, owner: { en: "Ops Manager", ar: "مدير العمليات" }, status: { en: "Planned", ar: "مخطط" }, target: "2026-02" },
  { id: "R-12", title: { en: "Channel partner SLAs slip", ar: "إخلال الشركاء بمستوى الخدمة" }, category: { en: "Integration", ar: "تكامل" }, likelihood: 3, impact: 3, mitigation: { en: "Contractual SLAs, dual-path channels where possible.", ar: "مستويات خدمة تعاقدية، قنوات بديلة." }, owner: { en: "Programme Director", ar: "مدير البرنامج" }, status: { en: "Monitoring", ar: "مراقبة" }, target: "Ongoing" },
];

export const ASSUMPTIONS: { id: string; title: Bi; owner: Bi; status: Bi }[] = [
  { id: "A-01", title: { en: "Nafath OIDC remains the national IdP standard", ar: "نفاذ يبقى المعيار الوطني" }, owner: { en: "IAM Team", ar: "فريق إدارة الهوية" }, status: { en: "Holding", ar: "ثابتة" } },
  { id: "A-02", title: { en: "Cloud hosting permitted in approved KSA zone", ar: "السماح بالاستضافة السحابية في منطقة معتمدة" }, owner: { en: "Compliance", ar: "الامتثال" }, status: { en: "Holding", ar: "ثابتة" } },
  { id: "A-03", title: { en: "Executive sponsorship sustained quarterly", ar: "استمرار الرعاية التنفيذية ربعياً" }, owner: { en: "Programme Director", ar: "مدير البرنامج" }, status: { en: "Holding", ar: "ثابتة" } },
  { id: "A-04", title: { en: "Bilingual content team capacity available", ar: "توفر طاقم محتوى ثنائي اللغة" }, owner: { en: "Content Lead", ar: "قائد المحتوى" }, status: { en: "At risk", ar: "تحت الخطر" } },
];

export const ISSUES: { id: string; title: Bi; severity: "high" | "medium" | "low"; owner: Bi; opened: string }[] = [
  { id: "I-01", title: { en: "SMS gateway throttling on peak Friday traffic", ar: "تقييد بوابة الرسائل أوقات الذروة" }, severity: "medium", owner: { en: "Comms Platform", ar: "منصة الاتصالات" }, opened: "2025-11-12" },
  { id: "I-02", title: { en: "Search no-result rate higher than target in AR", ar: "ارتفاع نسبة لا توجد نتائج بالعربية" }, severity: "medium", owner: { en: "Knowledge Lead", ar: "قائد المعرفة" }, opened: "2025-11-05" },
  { id: "I-03", title: { en: "QA calibration backlog (8 sessions)", ar: "تراكم جلسات معايرة الجودة" }, severity: "low", owner: { en: "Quality Officer", ar: "مسؤول الجودة" }, opened: "2025-10-28" },
];

export const DEPENDENCIES: { id: string; title: Bi; on: Bi; due: string; status: "on-track" | "at-risk" | "blocked" }[] = [
  { id: "D-01", title: { en: "Production tenant provisioning", ar: "تجهيز بيئة الإنتاج" }, on: { en: "Cloud Operations", ar: "عمليات السحابة" }, due: "2025-12-15", status: "on-track" },
  { id: "D-02", title: { en: "Nafath production endpoint", ar: "نقطة إنتاج نفاذ" }, on: { en: "IAM Team", ar: "فريق إدارة الهوية" }, due: "2025-12-01", status: "on-track" },
  { id: "D-03", title: { en: "CRM identity feed", ar: "تغذية هوية CRM" }, on: { en: "Enterprise Apps", ar: "تطبيقات المؤسسة" }, due: "2026-01-20", status: "at-risk" },
  { id: "D-04", title: { en: "PDPL DPIA sign-off", ar: "اعتماد تقييم الأثر للخصوصية" }, on: { en: "DPO", ar: "مسؤول حماية البيانات" }, due: "2026-01-10", status: "on-track" },
];

// ── TCO ───────────────────────────────────────────────────────────
export const TCO_YEARLY: { year: string; build: number; license: number; operate: number; change: number; training: number }[] = [
  { year: "Year 1", build: 11.2, license: 4.8, operate: 3.2, change: 1.6, training: 0.9 },
  { year: "Year 2", build: 3.4, license: 5.2, operate: 4.6, change: 1.2, training: 0.6 },
  { year: "Year 3", build: 1.8, license: 5.6, operate: 5.1, change: 0.8, training: 0.4 },
];
// Values in SAR millions.

export const COST_LINES: { line: Bi; range: Bi; notes: Bi }[] = [
  { line: { en: "Platform build (vendor + internal)", ar: "بناء المنصة (المورد والداخلي)" }, range: { en: "9–13 M SAR / yr 1", ar: "9–13 م.ر.س / السنة 1" }, notes: { en: "Tapers to maintenance from yr 2.", ar: "ينخفض إلى صيانة من السنة الثانية." } },
  { line: { en: "License + cloud", ar: "ترخيص وسحابة" }, range: { en: "4–6 M SAR / yr", ar: "4–6 م.ر.س / سنة" }, notes: { en: "Scales with users + AI inference.", ar: "يتغير حسب المستخدمين والاستدلال." } },
  { line: { en: "Operate (run team)", ar: "التشغيل" }, range: { en: "3–5 M SAR / yr", ar: "3–5 م.ر.س / سنة" }, notes: { en: "L2/L3 + SRE + content ops.", ar: "L2/L3 + SRE + إدارة المحتوى." } },
  { line: { en: "Change management", ar: "إدارة التغيير" }, range: { en: "1–2 M SAR / yr", ar: "1–2 م.ر.س / سنة" }, notes: { en: "Comms, champions, surveys.", ar: "اتصالات وأبطال واستبيانات." } },
  { line: { en: "Training & enablement", ar: "التدريب والتمكين" }, range: { en: "0.5–1 M SAR / yr", ar: "0.5–1 م.ر.س / سنة" }, notes: { en: "Role curricula + simulator.", ar: "مناهج لكل دور + محاكي." } },
  { line: { en: "Compliance & audit", ar: "الامتثال والتدقيق" }, range: { en: "0.6–1.2 M SAR / yr", ar: "0.6–1.2 م.ر.س / سنة" }, notes: { en: "PDPL, NCA, ISO recerts.", ar: "PDPL وNCA وتجديد ISO." } },
];

export const BENEFITS: { kpi: Bi; baseline: string; target: string; npv: Bi }[] = [
  { kpi: { en: "First Contact Resolution", ar: "الحل من أول تواصل" }, baseline: "62%", target: "78%", npv: { en: "≈ 28 M SAR / 3 yrs", ar: "≈ 28 م.ر.س / 3 سنوات" } },
  { kpi: { en: "Average Handle Time", ar: "متوسط زمن المعالجة" }, baseline: "7m 40s", target: "5m 20s", npv: { en: "≈ 22 M SAR / 3 yrs", ar: "≈ 22 م.ر.س / 3 سنوات" } },
  { kpi: { en: "Complaint cycle time", ar: "زمن دورة الشكوى" }, baseline: "14 days", target: "8 days", npv: { en: "Trust + retention", ar: "ثقة واحتفاظ" } },
  { kpi: { en: "Self-service deflection", ar: "تحويل للخدمة الذاتية" }, baseline: "18%", target: "38%", npv: { en: "≈ 31 M SAR / 3 yrs", ar: "≈ 31 م.ر.س / 3 سنوات" } },
  { kpi: { en: "CSAT", ar: "رضا المستفيدين" }, baseline: "74", target: "88", npv: { en: "Reputational", ar: "سمعة" } },
  { kpi: { en: "Cost-to-serve / interaction", ar: "تكلفة الخدمة لكل تفاعل" }, baseline: "31 SAR", target: "23 SAR", npv: { en: "≈ 24 M SAR / 3 yrs", ar: "≈ 24 م.ر.س / 3 سنوات" } },
];

// ── ADKAR ─────────────────────────────────────────────────────────
export const ADKAR_GROUPS: { group: Bi; awareness: number; desire: number; knowledge: number; ability: number; reinforcement: number }[] = [
  { group: { en: "Executives", ar: "التنفيذيون" }, awareness: 95, desire: 88, knowledge: 80, ability: 76, reinforcement: 72 },
  { group: { en: "Supervisors", ar: "المشرفون" }, awareness: 90, desire: 82, knowledge: 78, ability: 74, reinforcement: 68 },
  { group: { en: "Agents", ar: "موظفو الخدمة" }, awareness: 84, desire: 70, knowledge: 65, ability: 62, reinforcement: 55 },
  { group: { en: "Quality Officers", ar: "مسؤولو الجودة" }, awareness: 92, desire: 86, knowledge: 84, ability: 78, reinforcement: 74 },
  { group: { en: "IT Support", ar: "دعم تقنية المعلومات" }, awareness: 88, desire: 80, knowledge: 76, ability: 72, reinforcement: 70 },
];

export const TRAINING_CATALOGUE: { course: Bi; audience: Bi; format: Bi; duration: Bi; completion: number; status: Bi }[] = [
  { course: { en: "CX Platform fundamentals", ar: "أساسيات المنصة" }, audience: { en: "All roles", ar: "كل الأدوار" }, format: { en: "Self-paced + LMS", ar: "ذاتي + نظام إدارة التعلم" }, duration: { en: "2h", ar: "ساعتان" }, completion: 84, status: { en: "Live", ar: "مباشر" } },
  { course: { en: "Agent: copilot in flow of work", ar: "المساعد في سير العمل" }, audience: { en: "Agents", ar: "موظفو الخدمة" }, format: { en: "Instructor + simulator", ar: "مدرب + محاكي" }, duration: { en: "6h", ar: "6 ساعات" }, completion: 72, status: { en: "Live", ar: "مباشر" } },
  { course: { en: "ISO 10002 complaint handling", ar: "معالجة الشكاوى ISO 10002" }, audience: { en: "Agents, Quality", ar: "موظفون وجودة" }, format: { en: "Workshop", ar: "ورشة" }, duration: { en: "4h", ar: "4 ساعات" }, completion: 68, status: { en: "Live", ar: "مباشر" } },
  { course: { en: "PDPL essentials & DSAR", ar: "أساسيات نظام البيانات وطلبات الأصحاب" }, audience: { en: "All roles", ar: "كل الأدوار" }, format: { en: "Self-paced", ar: "ذاتي" }, duration: { en: "1h", ar: "ساعة" }, completion: 92, status: { en: "Live", ar: "مباشر" } },
  { course: { en: "Supervisor: SLA & wallboard ops", ar: "المشرف: SLA ولوحة الجدران" }, audience: { en: "Supervisors", ar: "المشرفون" }, format: { en: "Workshop", ar: "ورشة" }, duration: { en: "3h", ar: "3 ساعات" }, completion: 78, status: { en: "Live", ar: "مباشر" } },
  { course: { en: "Quality calibration & AI-assisted QA", ar: "معايرة الجودة و QA بالذكاء الاصطناعي" }, audience: { en: "Quality", ar: "الجودة" }, format: { en: "Workshop", ar: "ورشة" }, duration: { en: "4h", ar: "4 ساعات" }, completion: 56, status: { en: "Beta", ar: "تجريبي" } },
  { course: { en: "Bilingual content authoring (AR/EN)", ar: "كتابة المحتوى ثنائي اللغة" }, audience: { en: "Content authors", ar: "كتّاب المحتوى" }, format: { en: "Workshop + style guide", ar: "ورشة + دليل أسلوب" }, duration: { en: "3h", ar: "3 ساعات" }, completion: 64, status: { en: "Live", ar: "مباشر" } },
  { course: { en: "Executive scorecard literacy", ar: "قراءة لوحة القيادة" }, audience: { en: "Executives", ar: "التنفيذيون" }, format: { en: "Briefing", ar: "إحاطة" }, duration: { en: "1h", ar: "ساعة" }, completion: 88, status: { en: "Live", ar: "مباشر" } },
];

export const COMMS_PLAN: { date: string; activity: Bi; audience: Bi; channel: Bi }[] = [
  { date: "2025-10", activity: { en: "Programme kick-off town hall", ar: "اجتماع إطلاق البرنامج" }, audience: { en: "All staff", ar: "كل الموظفين" }, channel: { en: "Hybrid town hall", ar: "اجتماع هجين" } },
  { date: "2025-11", activity: { en: "Champions network launch", ar: "إطلاق شبكة الأبطال" }, audience: { en: "Identified champions", ar: "الأبطال المعتمدون" }, channel: { en: "In-person workshop", ar: "ورشة حضورية" } },
  { date: "2025-12", activity: { en: "Pre-launch readiness brief", ar: "إحاطة الجاهزية قبل الإطلاق" }, audience: { en: "Front-line", ar: "الخط الأول" }, channel: { en: "Team huddles + LMS", ar: "اجتماعات الفرق + LMS" } },
  { date: "2026-01", activity: { en: "Go-live + hypercare comms", ar: "تواصل الإطلاق والرعاية المكثفة" }, audience: { en: "All staff + leaders", ar: "كل الموظفين والقادة" }, channel: { en: "Daily standups + intranet", ar: "اجتماعات يومية + الشبكة الداخلية" } },
  { date: "2026-02", activity: { en: "First 30-day metrics readout", ar: "تقرير أول 30 يوماً" }, audience: { en: "Steering + leaders", ar: "اللجنة التنفيذية" }, channel: { en: "Executive briefing", ar: "إحاطة تنفيذية" } },
];

export const ADOPTION_METRICS: { metric: Bi; value: string; trend: number }[] = [
  { metric: { en: "Weekly active agents", ar: "الموظفون النشطون أسبوعياً" }, value: "92%", trend: 4 },
  { metric: { en: "Copilot acceptance rate", ar: "نسبة قبول مقترحات المساعد" }, value: "68%", trend: 7 },
  { metric: { en: "Feature adoption (top 10)", ar: "تبني الميزات (الأعلى 10)" }, value: "74%", trend: 5 },
  { metric: { en: "Internal NPS", ar: "صافي مروّجي الداخل" }, value: "+38", trend: 9 },
];
