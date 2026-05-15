// Seed data for the Service Journeys module.
// Real GAC (General Authority for Competition / الهيئة العامة للمنافسة)
// e-services pulled from gac.gov.sa and monafsa.gac.gov.sa.
// All 12 published services modeled as bilingual end-to-end journeys.
// State is held in-memory via JourneyContext — this file just bootstraps it.

export type Bi = { ar: string; en: string };

export type Sentiment = "delighted" | "satisfied" | "neutral" | "confused" | "frustrated";

export type StageItem = {
  id: string;
  label: Bi;
};

export type Stage = {
  id: string;
  name: Bi;
  icon: string; // lucide icon name
  sla: Bi; // duration / SLA chip
  sentiment: Sentiment;
  emotionScore: number; // -2..+2
  touchpoints: StageItem[];
  actions: StageItem[];
  entities: StageItem[];
  opportunities: StageItem[];
};

export type Journey = {
  id: string;
  title: Bi;
  subtitle: Bi;
  owner: Bi;
  icon: string;
  types: Bi[];
  outcomes: Bi[];
  stages: Stage[];
};

let __seq = 0;
const uid = () => `s${++__seq}-${Math.random().toString(36).slice(2, 7)}`;

// Common stages every regulated GAC e-service starts with — surfaced bilingually.
const nafathStage = (): Stage => ({
  id: uid(),
  icon: "ShieldCheck",
  name: { ar: "الدخول عبر نفاذ", en: "Sign-in via Nafath" },
  sla: { ar: "فوري", en: "Instant" },
  sentiment: "neutral",
  emotionScore: 0,
  touchpoints: [
    { id: uid(), label: { ar: "بوابة المنافسة (monafsa)", en: "GAC e-portal (monafsa)" } },
    { id: uid(), label: { ar: "تطبيق نفاذ", en: "Nafath app" } },
  ],
  actions: [
    { id: uid(), label: { ar: "اختيار تسجيل الدخول الموحد", en: "Choose single sign-on" } },
    { id: uid(), label: { ar: "تأكيد طلب الدخول من تطبيق نفاذ", en: "Approve push from Nafath" } },
  ],
  entities: [
    { id: uid(), label: { ar: "الهيئة العامة للمنافسة", en: "General Authority for Competition" } },
    { id: uid(), label: { ar: "هيئة الحكومة الرقمية", en: "Digital Government Authority" } },
  ],
  opportunities: [
    { id: uid(), label: { ar: "تسجيل دخول حيوي للأجهزة المتعددة", en: "Biometric SSO across devices" } },
    { id: uid(), label: { ar: "تذكير ذكي قبل انتهاء الجلسة", en: "Smart reminder before session expiry" } },
  ],
});

const ackStage = (slaAr: string, slaEn: string): Stage => ({
  id: uid(),
  icon: "BellRing",
  name: { ar: "الإقرار والتأكيد", en: "Acknowledgement & confirmation" },
  sla: { ar: slaAr, en: slaEn },
  sentiment: "satisfied",
  emotionScore: 1,
  touchpoints: [
    { id: uid(), label: { ar: "إشعار في البوابة", en: "Portal notification" } },
    { id: uid(), label: { ar: "بريد إلكتروني / SMS", en: "Email / SMS" } },
  ],
  actions: [
    { id: uid(), label: { ar: "استلام رقم مرجعي للطلب", en: "Receive request reference number" } },
    { id: uid(), label: { ar: "تتبّع الحالة عبر لوحة الطلبات", en: "Track via request dashboard" } },
  ],
  entities: [
    { id: uid(), label: { ar: "الهيئة العامة للمنافسة", en: "General Authority for Competition" } },
  ],
  opportunities: [
    { id: uid(), label: { ar: "تنبيهات استباقية عند تغيّر الحالة", en: "Proactive status-change alerts" } },
  ],
});

export const SEED_JOURNEYS: Journey[] = [
  // ───────────────────────── 1. Economic Concentration Notification ─────────────────────────
  {
    id: "j-gac-econ-concentration-notify",
    icon: "Network",
    title: {
      ar: "الإبلاغ عن تركز اقتصادي",
      en: "Economic Concentration Notification",
    },
    subtitle: {
      ar: "إخطار الهيئة بعمليات الاندماج والاستحواذ والمشاريع المشتركة قبل إتمامها",
      en: "Notify GAC of mergers, acquisitions and joint ventures before closing",
    },
    owner: { ar: "الهيئة العامة للمنافسة", en: "General Authority for Competition" },
    types: [
      { ar: "اندماج · ٩٠ يوماً", en: "Merger · 90 days" },
      { ar: "استحواذ · ٩٠ يوماً", en: "Acquisition · 90 days" },
      { ar: "مشروع مشترك", en: "Joint venture" },
    ],
    outcomes: [
      { ar: "موافقة", en: "Approved" },
      { ar: "موافقة مشروطة", en: "Conditional approval" },
      { ar: "رفض", en: "Rejected" },
    ],
    stages: [
      nafathStage(),
      {
        id: uid(),
        icon: "ClipboardEdit",
        name: { ar: "إعداد ملف التركز", en: "Prepare concentration file" },
        sla: { ar: "وتيرة المقدم", en: "Applicant-paced" },
        sentiment: "confused",
        emotionScore: -1,
        touchpoints: [
          { id: uid(), label: { ar: "نموذج الإبلاغ الإلكتروني", en: "Online notification form" } },
          { id: uid(), label: { ar: "حاسبة الرسوم", en: "Fee calculator" } },
        ],
        actions: [
          { id: uid(), label: { ar: "إدخال بيانات الأطراف والأرقام المالية", en: "Enter party & financial figures" } },
          { id: uid(), label: { ar: "رفع العقود والقوائم المالية", en: "Upload contracts & financials" } },
          { id: uid(), label: { ar: "إقرار صحة البيانات", en: "Accuracy declaration" } },
        ],
        entities: [
          { id: uid(), label: { ar: "الإدارة العامة للتركزات", en: "Concentrations Directorate" } },
          { id: uid(), label: { ar: "المستشار القانوني", en: "Legal counsel" } },
        ],
        opportunities: [
          { id: uid(), label: { ar: "قوالب جاهزة للقطاعات", en: "Sector-ready templates" } },
          { id: uid(), label: { ar: "مدقّق ذكي للوثائق الناقصة", en: "AI document-completeness checker" } },
        ],
      },
      {
        id: uid(),
        icon: "Send",
        name: { ar: "تقديم الإخطار", en: "Submit notification" },
        sla: { ar: "فوري", en: "Instant" },
        sentiment: "satisfied",
        emotionScore: 1,
        touchpoints: [{ id: uid(), label: { ar: "بوابة المنافسة", en: "GAC e-portal" } }],
        actions: [
          { id: uid(), label: { ar: "سداد المقابل المالي", en: "Pay the prescribed fee" } },
          { id: uid(), label: { ar: "تأكيد الإرسال", en: "Confirm submission" } },
        ],
        entities: [{ id: uid(), label: { ar: "سداد", en: "SADAD" } }],
        opportunities: [{ id: uid(), label: { ar: "حفظ تلقائي للمسودات", en: "Auto-save drafts" } }],
      },
      {
        id: uid(),
        icon: "Search",
        name: { ar: "الفحص الفني والاقتصادي", en: "Technical & economic review" },
        sla: { ar: "حتى ٩٠ يوماً", en: "Up to 90 days" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [
          { id: uid(), label: { ar: "غرفة بيانات الهيئة", en: "GAC data room" } },
          { id: uid(), label: { ar: "اجتماعات متابعة عن بُعد", en: "Remote review meetings" } },
        ],
        actions: [
          { id: uid(), label: { ar: "الرد على طلبات استكمال خلال ١٤ يوماً", en: "Respond to RFIs within 14 days" } },
          { id: uid(), label: { ar: "تقديم تعهدات سلوكية / هيكلية", en: "Offer behavioural/structural remedies" } },
        ],
        entities: [
          { id: uid(), label: { ar: "لجنة فحص التركزات", en: "Concentration review committee" } },
          { id: uid(), label: { ar: "إدارة الدراسات الاقتصادية", en: "Economic Studies Dept." } },
        ],
        opportunities: [
          { id: uid(), label: { ar: "غرفة بيانات شفافة مع تتبع لحظي", en: "Transparent data room with live tracking" } },
        ],
      },
      ackStage("خلال ٩٠ يوماً", "Within 90 days"),
    ],
  },

  // ───────────────────────── 2. Verification of Non-Obligation ─────────────────────────
  {
    id: "j-gac-non-obligation",
    icon: "BadgeCheck",
    title: {
      ar: "التحقق من عدم وجوب الإبلاغ",
      en: "Verification of Non-Obligation to Notify",
    },
    subtitle: {
      ar: "تأكيد رسمي بأن الصفقة دون عتبات الإبلاغ الإلزامي عن التركز الاقتصادي",
      en: "Formal confirmation that a transaction is below mandatory notification thresholds",
    },
    owner: { ar: "الهيئة العامة للمنافسة", en: "General Authority for Competition" },
    types: [{ ar: "صفقة دون العتبة · ١٥ يوماً", en: "Below-threshold deal · 15 days" }],
    outcomes: [
      { ar: "إقرار بعدم وجوب الإبلاغ", en: "Confirmation: not obligated" },
      { ar: "وجوب الإبلاغ", en: "Obligated to notify" },
    ],
    stages: [
      nafathStage(),
      {
        id: uid(),
        icon: "FileSearch",
        name: { ar: "إدخال بيانات الصفقة", en: "Enter transaction data" },
        sla: { ar: "وتيرة المقدم", en: "Applicant-paced" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [{ id: uid(), label: { ar: "نموذج التحقق", en: "Verification form" } }],
        actions: [
          { id: uid(), label: { ar: "تحديد الأطراف وحجم المبيعات", en: "Identify parties & turnover" } },
          { id: uid(), label: { ar: "إقرار بعدم تجاوز العتبات", en: "Declare below-threshold" } },
        ],
        entities: [{ id: uid(), label: { ar: "إدارة فحص التركزات", en: "Concentration screening unit" } }],
        opportunities: [
          { id: uid(), label: { ar: "تحقق فوري آلي من العتبات", en: "Instant automated threshold check" } },
        ],
      },
      {
        id: uid(),
        icon: "ScanLine",
        name: { ar: "المراجعة الأولية", en: "Initial screening" },
        sla: { ar: "حتى ١٥ يوماً", en: "Up to 15 days" },
        sentiment: "satisfied",
        emotionScore: 1,
        touchpoints: [{ id: uid(), label: { ar: "بوابة المنافسة", en: "GAC e-portal" } }],
        actions: [{ id: uid(), label: { ar: "متابعة حالة الطلب", en: "Track request status" } }],
        entities: [{ id: uid(), label: { ar: "لجنة الفحص", en: "Screening committee" } }],
        opportunities: [{ id: uid(), label: { ar: "إفادة آلية في حال اكتمال البيانات", en: "Auto-decision when data complete" } }],
      },
      ackStage("خلال ١٥ يوماً", "Within 15 days"),
    ],
  },

  // ───────────────────────── 3. No-Objection Certificate Inquiry ─────────────────────────
  {
    id: "j-gac-noc-inquiry",
    icon: "ScanSearch",
    title: { ar: "الاستعلام عن شهادة عدم ممانعة", en: "No-Objection Certificate Inquiry" },
    subtitle: {
      ar: "التحقق من صحة شهادة عدم الممانعة الصادرة عن الهيئة لطلبات التركز الاقتصادي",
      en: "Verify the authenticity of a GAC-issued no-objection certificate for an economic concentration",
    },
    owner: { ar: "الهيئة العامة للمنافسة", en: "General Authority for Competition" },
    types: [{ ar: "استعلام فوري", en: "Instant inquiry" }],
    outcomes: [
      { ar: "شهادة صالحة", en: "Certificate valid" },
      { ar: "شهادة غير موجودة", en: "Certificate not found" },
    ],
    stages: [
      {
        id: uid(),
        icon: "Hash",
        name: { ar: "إدخال الرقم المرجعي", en: "Enter reference number" },
        sla: { ar: "فوري", en: "Instant" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [
          { id: uid(), label: { ar: "بوابة المنافسة — استعلامات عامة", en: "GAC portal — public inquiries" } },
        ],
        actions: [
          { id: uid(), label: { ar: "لصق الرقم المرجعي للشهادة", en: "Paste certificate reference" } },
        ],
        entities: [{ id: uid(), label: { ar: "أمانة سر التركزات", en: "Concentrations registry" } }],
        opportunities: [{ id: uid(), label: { ar: "مسح QR من نسخة PDF للشهادة", en: "Scan QR from PDF certificate" } }],
      },
      {
        id: uid(),
        icon: "FileCheck",
        name: { ar: "عرض الشهادة والطباعة", en: "View & print certificate" },
        sla: { ar: "فوري", en: "Instant" },
        sentiment: "delighted",
        emotionScore: 2,
        touchpoints: [{ id: uid(), label: { ar: "البوابة الإلكترونية", en: "Online portal" } }],
        actions: [
          { id: uid(), label: { ar: "تأكيد البيانات الظاهرة", en: "Confirm displayed details" } },
          { id: uid(), label: { ar: "تنزيل أو طباعة الشهادة", en: "Download or print certificate" } },
        ],
        entities: [{ id: uid(), label: { ar: "الهيئة العامة للمنافسة", en: "General Authority for Competition" } }],
        opportunities: [
          { id: uid(), label: { ar: "ربط API مع الجهات الحكومية للتحقق التلقائي", en: "API hook for govt verification" } },
        ],
      },
    ],
  },

  // ───────────────────────── 4. NOC for Additional Car Dealership ─────────────────────────
  {
    id: "j-gac-car-dealership",
    icon: "Car",
    title: {
      ar: "طلب شهادة عدم ممانعة لتسجيل وكالة سيارات إضافية",
      en: "NOC for Additional Car Dealership Registration",
    },
    subtitle: {
      ar: "موافقة الهيئة على تسجيل وكالة سيارات إضافية أو نقل وكالة قائمة",
      en: "GAC approval to register an additional dealership or transfer a car agency",
    },
    owner: { ar: "الهيئة العامة للمنافسة", en: "General Authority for Competition" },
    types: [{ ar: "وكالة جديدة", en: "New dealership" }, { ar: "نقل وكالة قائمة", en: "Agency transfer" }],
    outcomes: [
      { ar: "موافقة", en: "Approved" },
      { ar: "موافقة مشروطة", en: "Conditional approval" },
      { ar: "رفض", en: "Rejected" },
    ],
    stages: [
      nafathStage(),
      {
        id: uid(),
        icon: "FileText",
        name: { ar: "تجهيز ملف الوكالة", en: "Prepare dealership file" },
        sla: { ar: "وتيرة المقدم", en: "Applicant-paced" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [{ id: uid(), label: { ar: "نموذج الطلب", en: "Application form" } }],
        actions: [
          { id: uid(), label: { ar: "إدخال بيانات الوكالة والصانع", en: "Enter dealer & OEM details" } },
          { id: uid(), label: { ar: "رفع عقد الوكالة", en: "Upload agency contract" } },
        ],
        entities: [
          { id: uid(), label: { ar: "الإدارة العامة للتراخيص", en: "Authorisations Directorate" } },
          { id: uid(), label: { ar: "صانع السيارات", en: "OEM" } },
        ],
        opportunities: [
          { id: uid(), label: { ar: "ربط آلي بسجلات وزارة التجارة", en: "Auto-link to MoCI registry" } },
        ],
      },
      {
        id: uid(),
        icon: "Search",
        name: { ar: "الدراسة الفنية", en: "Technical review" },
        sla: { ar: "حتى ٩٠ يوماً", en: "Up to 90 days" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [{ id: uid(), label: { ar: "بوابة المنافسة", en: "GAC e-portal" } }],
        actions: [
          { id: uid(), label: { ar: "الرد على طلبات الاستكمال خلال ١٤ يوماً", en: "Respond to RFIs within 14 days" } },
        ],
        entities: [{ id: uid(), label: { ar: "لجنة الفحص", en: "Review committee" } }],
        opportunities: [
          { id: uid(), label: { ar: "مؤشّر شفافية لحظي على مرحلة الفحص", en: "Live transparency indicator on review stage" } },
        ],
      },
      ackStage("خلال ٩٠ يوماً", "Within 90 days"),
    ],
  },

  // ───────────────────────── 5. Complaint Against Violating Establishment ─────────────────────────
  {
    id: "j-gac-anticompetitive-complaint",
    icon: "MessageSquareWarning",
    title: { ar: "تقديم شكوى ضد منشأة مخالفة", en: "Complaint Against a Violating Establishment" },
    subtitle: {
      ar: "الإبلاغ عن ممارسات مخلّة بالمنافسة كالاتفاقات السرّية وإساءة استخدام الوضع المهيمن",
      en: "Report anti-competitive practices such as cartels and abuse of dominance",
    },
    owner: { ar: "الهيئة العامة للمنافسة", en: "General Authority for Competition" },
    types: [
      { ar: "اتفاق مخل بالمنافسة", en: "Anti-competitive agreement" },
      { ar: "إساءة استخدام مركز مهيمن", en: "Abuse of dominance" },
      { ar: "تثبيت أسعار", en: "Price fixing" },
    ],
    outcomes: [
      { ar: "إحالة للجنة المخالفات", en: "Referred to violations committee" },
      { ar: "حفظ الشكوى", en: "Complaint dismissed" },
      { ar: "تسوية", en: "Settled" },
    ],
    stages: [
      nafathStage(),
      {
        id: uid(),
        icon: "PencilLine",
        name: { ar: "وصف المخالفة", en: "Describe the violation" },
        sla: { ar: "وتيرة المشتكي", en: "Complainant-paced" },
        sentiment: "frustrated",
        emotionScore: -2,
        touchpoints: [{ id: uid(), label: { ar: "نموذج الشكوى الإلكتروني", en: "Online complaint form" } }],
        actions: [
          { id: uid(), label: { ar: "اختيار نوع الممارسة المخلة", en: "Choose violation type" } },
          { id: uid(), label: { ar: "تحديد المنشأة محل الشكوى", en: "Identify the establishment" } },
          { id: uid(), label: { ar: "رفع الأدلة والمستندات", en: "Upload evidence" } },
        ],
        entities: [{ id: uid(), label: { ar: "إدارة استقبال البلاغات", en: "Complaints intake unit" } }],
        opportunities: [
          { id: uid(), label: { ar: "إخفاء هوية المبلّغ بشكل آمن", en: "Secure anonymous reporting" } },
          { id: uid(), label: { ar: "مساعد ذكي لاختيار التصنيف الصحيح", en: "AI assistant for correct classification" } },
        ],
      },
      {
        id: uid(),
        icon: "Search",
        name: { ar: "التحقيق والمعالجة", en: "Investigation & handling" },
        sla: { ar: "حتى ١٨٠ يوماً", en: "Up to 180 days" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [
          { id: uid(), label: { ar: "غرفة بيانات التحقيق", en: "Investigation data room" } },
          { id: uid(), label: { ar: "اتصال هاتفي من المحقق", en: "Investigator phone call" } },
        ],
        actions: [
          { id: uid(), label: { ar: "تزويد المحققين بأي بيانات إضافية", en: "Provide additional info to investigators" } },
        ],
        entities: [
          { id: uid(), label: { ar: "إدارة التحقيقات", en: "Investigations Directorate" } },
          { id: uid(), label: { ar: "لجنة المخالفات", en: "Violations committee" } },
        ],
        opportunities: [
          { id: uid(), label: { ar: "حالة لحظية للشكوى مع جدول زمني", en: "Live status with timeline" } },
        ],
      },
      ackStage("خلال ١٨٠ يوماً", "Within 180 days"),
    ],
  },

  // ───────────────────────── 6. Report Internal GAC Violations ─────────────────────────
  {
    id: "j-gac-internal-integrity",
    icon: "ShieldAlert",
    title: {
      ar: "الإبلاغ عن المخالفات المالية والإدارية في الهيئة",
      en: "Report Financial & Administrative Violations within GAC",
    },
    subtitle: {
      ar: "قناة آمنة للإبلاغ عن سلوك مخالف يصدر عن أيٍّ من منسوبي الهيئة",
      en: "A safe channel to report misconduct by any GAC staff member",
    },
    owner: { ar: "وحدة النزاهة - الهيئة العامة للمنافسة", en: "GAC Integrity Unit" },
    types: [
      { ar: "مخالفة مالية", en: "Financial violation" },
      { ar: "مخالفة إدارية", en: "Administrative violation" },
      { ar: "تعارض مصالح", en: "Conflict of interest" },
    ],
    outcomes: [
      { ar: "إحالة للتحقيق الداخلي", en: "Referred to internal audit" },
      { ar: "إجراء تأديبي", en: "Disciplinary action" },
      { ar: "حفظ", en: "Closed" },
    ],
    stages: [
      {
        id: uid(),
        icon: "DoorOpen",
        name: { ar: "فتح القناة الآمنة", en: "Open the secure channel" },
        sla: { ar: "فوري", en: "Instant" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [
          { id: uid(), label: { ar: "بوابة بلاغات النزاهة", en: "Integrity reporting portal" } },
        ],
        actions: [
          { id: uid(), label: { ar: "اختيار البلاغ المُسمَّى أو المجهول", en: "Choose named or anonymous" } },
        ],
        entities: [{ id: uid(), label: { ar: "وحدة النزاهة", en: "Integrity Unit" } }],
        opportunities: [
          { id: uid(), label: { ar: "تشفير من طرف إلى طرف", en: "End-to-end encryption" } },
        ],
      },
      {
        id: uid(),
        icon: "FileWarning",
        name: { ar: "تفاصيل المخالفة", en: "Violation details" },
        sla: { ar: "وتيرة المبلّغ", en: "Reporter-paced" },
        sentiment: "confused",
        emotionScore: -1,
        touchpoints: [{ id: uid(), label: { ar: "نموذج البلاغ", en: "Reporting form" } }],
        actions: [
          { id: uid(), label: { ar: "وصف الواقعة والشخص المعنيّ", en: "Describe incident & person" } },
          { id: uid(), label: { ar: "إرفاق أدلة (اختياري)", en: "Attach evidence (optional)" } },
        ],
        entities: [{ id: uid(), label: { ar: "وحدة النزاهة", en: "Integrity Unit" } }],
        opportunities: [
          { id: uid(), label: { ar: "تذكير ذاتي حول حقوق المبلّغ", en: "Built-in reminder of reporter rights" } },
        ],
      },
      {
        id: uid(),
        icon: "ShieldCheck",
        name: { ar: "التحقيق والإحالة", en: "Investigation & escalation" },
        sla: { ar: "بحسب الحالة", en: "Case-dependent" },
        sentiment: "satisfied",
        emotionScore: 1,
        touchpoints: [{ id: uid(), label: { ar: "إشعارات آمنة", en: "Secure notifications" } }],
        actions: [
          { id: uid(), label: { ar: "متابعة حالة البلاغ", en: "Track report status" } },
        ],
        entities: [
          { id: uid(), label: { ar: "إدارة التدقيق الداخلي", en: "Internal Audit" } },
          { id: uid(), label: { ar: "هيئة الرقابة ومكافحة الفساد", en: "Oversight & Anti-Corruption Authority" } },
        ],
        opportunities: [
          { id: uid(), label: { ar: "حماية واضحة لمن يبلّغ بحسن نية", en: "Clear protection for good-faith reporters" } },
        ],
      },
    ],
  },

  // ───────────────────────── 7. Exemption Request ─────────────────────────
  {
    id: "j-gac-exemption-request",
    icon: "FileBadge",
    title: {
      ar: "طلب الإعفاء من تطبيق النظام",
      en: "Exemption Request from Competition Law Provisions",
    },
    subtitle: {
      ar: "طلب إعفاء من تطبيق المواد ٥ أو ٦ أو ٧ من نظام المنافسة عند تحقّق منافع اقتصادية صافية",
      en: "Request a Board exemption from Articles 5, 6 or 7 of the Competition Law where net economic benefits exist",
    },
    owner: { ar: "مجلس إدارة الهيئة", en: "GAC Board of Directors" },
    types: [
      { ar: "المادة ٥ — اتفاقات", en: "Article 5 — agreements" },
      { ar: "المادة ٦ — مركز مهيمن", en: "Article 6 — dominance" },
      { ar: "المادة ٧ — تركز", en: "Article 7 — concentration" },
    ],
    outcomes: [
      { ar: "إعفاء كامل", en: "Full exemption" },
      { ar: "إعفاء مشروط", en: "Conditional exemption" },
      { ar: "رفض", en: "Rejected" },
    ],
    stages: [
      nafathStage(),
      {
        id: uid(),
        icon: "BookOpenCheck",
        name: { ar: "بناء الحجة الاقتصادية", en: "Build the economic case" },
        sla: { ar: "وتيرة المقدم", en: "Applicant-paced" },
        sentiment: "confused",
        emotionScore: -1,
        touchpoints: [{ id: uid(), label: { ar: "نموذج طلب الإعفاء", en: "Exemption application form" } }],
        actions: [
          { id: uid(), label: { ar: "تحديد المواد المطلوب الإعفاء منها", en: "Identify articles to exempt" } },
          { id: uid(), label: { ar: "تقديم تحليل المنافع الصافية", en: "Submit net-benefits analysis" } },
        ],
        entities: [
          { id: uid(), label: { ar: "المستشار الاقتصادي", en: "Economic consultant" } },
          { id: uid(), label: { ar: "إدارة الدراسات الاقتصادية", en: "Economic Studies Dept." } },
        ],
        opportunities: [
          { id: uid(), label: { ar: "قالب موحّد لتحليل المنافع", en: "Standard benefits-analysis template" } },
        ],
      },
      {
        id: uid(),
        icon: "Gavel",
        name: { ar: "اللجنة الفنية ثم المجلس", en: "Technical committee then Board" },
        sla: { ar: "متعدد المراحل", en: "Multi-stage" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [
          { id: uid(), label: { ar: "جلسات استماع", en: "Hearings" } },
          { id: uid(), label: { ar: "غرفة بيانات الإعفاءات", en: "Exemptions data room" } },
        ],
        actions: [
          { id: uid(), label: { ar: "تقديم توضيحات إضافية عند الطلب", en: "Provide clarifications on request" } },
        ],
        entities: [
          { id: uid(), label: { ar: "اللجنة الفنية للإعفاءات", en: "Technical exemptions committee" } },
          { id: uid(), label: { ar: "مجلس إدارة الهيئة", en: "GAC Board" } },
        ],
        opportunities: [
          { id: uid(), label: { ar: "جدول زمني واضح لكل مرحلة", en: "Clear timeline per stage" } },
        ],
      },
      ackStage("بحسب قرار المجلس", "Per Board decision"),
    ],
  },

  // ───────────────────────── 8. Settlement & Reconciliation ─────────────────────────
  {
    id: "j-gac-settlement",
    icon: "Handshake",
    title: { ar: "طلب التسوية والمصالحة", en: "Settlement & Reconciliation Request" },
    subtitle: {
      ar: "مسار للتسوية أو التساهل عند الإبلاغ المبكر عن الشركاء في المخالفة",
      en: "Settlement path or leniency for early reporting of co-violators",
    },
    owner: { ar: "الهيئة العامة للمنافسة", en: "General Authority for Competition" },
    types: [
      { ar: "تسوية مالية", en: "Financial settlement" },
      { ar: "تساهل (Leniency)", en: "Leniency programme" },
    ],
    outcomes: [
      { ar: "قبول التسوية", en: "Settlement accepted" },
      { ar: "تخفيف العقوبة", en: "Penalty reduced" },
      { ar: "رفض", en: "Rejected" },
    ],
    stages: [
      nafathStage(),
      {
        id: uid(),
        icon: "ClipboardSignature",
        name: { ar: "تقديم العرض", en: "Submit the offer" },
        sla: { ar: "وتيرة المقدم", en: "Applicant-paced" },
        sentiment: "frustrated",
        emotionScore: -2,
        touchpoints: [{ id: uid(), label: { ar: "نموذج التسوية / التساهل", en: "Settlement / leniency form" } }],
        actions: [
          { id: uid(), label: { ar: "وصف المخالفة بشفافية", en: "Disclose violation transparently" } },
          { id: uid(), label: { ar: "تقديم أدلة على شركاء المخالفة", en: "Provide evidence on co-violators" } },
        ],
        entities: [{ id: uid(), label: { ar: "إدارة التسويات", en: "Settlements unit" } }],
        opportunities: [
          { id: uid(), label: { ar: "ضمانات سرية صريحة في النظام", en: "Explicit confidentiality safeguards in-system" } },
        ],
      },
      {
        id: uid(),
        icon: "Scale",
        name: { ar: "التفاوض والشروط", en: "Negotiation & terms" },
        sla: { ar: "بحسب الحالة", en: "Case-dependent" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [{ id: uid(), label: { ar: "جلسات تفاوض رسمية", en: "Formal negotiation sessions" } }],
        actions: [
          { id: uid(), label: { ar: "الاتفاق على الشروط النهائية", en: "Agree final terms" } },
        ],
        entities: [{ id: uid(), label: { ar: "لجنة المخالفات", en: "Violations committee" } }],
        opportunities: [
          { id: uid(), label: { ar: "محرر شروط مشترك داخل المنصة", en: "In-platform terms editor" } },
        ],
      },
      ackStage("قرار المجلس", "Board decision"),
    ],
  },

  // ───────────────────────── 9. Concentration Fee Calculator ─────────────────────────
  {
    id: "j-gac-fee-calculator",
    icon: "Calculator",
    title: {
      ar: "حساب المقابل المالي لطلب التركز الاقتصادي",
      en: "Concentration Fee Calculator",
    },
    subtitle: {
      ar: "تقدير فوري للمقابل المالي بناءً على إجمالي المبيعات السنوية للأطراف",
      en: "Instant fee estimate based on the combined annual sales of the parties",
    },
    owner: { ar: "الهيئة العامة للمنافسة", en: "General Authority for Competition" },
    types: [{ ar: "حاسبة عامة — دون تسجيل", en: "Public calculator — no login" }],
    outcomes: [{ ar: "تقدير فوري للرسوم", en: "Instant fee estimate" }],
    stages: [
      {
        id: uid(),
        icon: "MousePointerClick",
        name: { ar: "فتح الحاسبة", en: "Open the calculator" },
        sla: { ar: "فوري", en: "Instant" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [
          { id: uid(), label: { ar: "صفحة الحاسبة في البوابة", en: "Calculator page on portal" } },
        ],
        actions: [{ id: uid(), label: { ar: "الوصول دون تسجيل دخول", en: "Access without login" } }],
        entities: [{ id: uid(), label: { ar: "الهيئة العامة للمنافسة", en: "General Authority for Competition" } }],
        opportunities: [
          { id: uid(), label: { ar: "حفظ السيناريوهات للمقارنة", en: "Save scenarios for comparison" } },
        ],
      },
      {
        id: uid(),
        icon: "Sigma",
        name: { ar: "إدخال المبيعات", en: "Enter sales figures" },
        sla: { ar: "فوري", en: "Instant" },
        sentiment: "satisfied",
        emotionScore: 1,
        touchpoints: [{ id: uid(), label: { ar: "حقول مبيعات الأطراف", en: "Party-sales fields" } }],
        actions: [
          { id: uid(), label: { ar: "إدخال إجمالي المبيعات السنوية", en: "Enter combined annual sales" } },
          { id: uid(), label: { ar: "عرض الرسوم المقدرة", en: "View estimated fee" } },
        ],
        entities: [{ id: uid(), label: { ar: "نظام الرسوم", en: "Fees engine" } }],
        opportunities: [
          { id: uid(), label: { ar: "تنزيل تقدير PDF موقّع رقمياً", en: "Digitally-signed PDF estimate" } },
        ],
      },
      {
        id: uid(),
        icon: "ArrowRightCircle",
        name: { ar: "الانتقال للإبلاغ", en: "Proceed to notification" },
        sla: { ar: "فوري", en: "Instant" },
        sentiment: "delighted",
        emotionScore: 2,
        touchpoints: [{ id: uid(), label: { ar: "رابط مباشر لخدمة الإبلاغ", en: "Direct link to notification service" } }],
        actions: [{ id: uid(), label: { ar: "بدء إخطار تركز اقتصادي", en: "Start economic concentration notification" } }],
        entities: [{ id: uid(), label: { ar: "خدمة الإبلاغ عن التركز", en: "Concentration notification service" } }],
        opportunities: [
          { id: uid(), label: { ar: "تعبئة مسبقة من بيانات الحاسبة", en: "Pre-fill from calculator data" } },
        ],
      },
    ],
  },

  // ───────────────────────── 10. Scholarship Programme ─────────────────────────
  {
    id: "j-gac-scholarship",
    icon: "GraduationCap",
    title: { ar: "التقديم على الابتعاث", en: "Scholarship Programme Application" },
    subtitle: {
      ar: "ابتعاث الكوادر السعودية في الاقتصاد والمالية والمحاسبة والرياضيات والهندسة الصناعية",
      en: "Scholarships for Saudi candidates in economics, finance, accounting, mathematics & industrial engineering",
    },
    owner: { ar: "إدارة الموارد البشرية - الهيئة العامة للمنافسة", en: "GAC Human Capital" },
    types: [
      { ar: "ماجستير", en: "Master's" },
      { ar: "دكتوراه", en: "PhD" },
    ],
    outcomes: [
      { ar: "قبول مبدئي", en: "Initial acceptance" },
      { ar: "قبول نهائي", en: "Final acceptance" },
      { ar: "اعتذار", en: "Decline" },
    ],
    stages: [
      {
        id: uid(),
        icon: "ListChecks",
        name: { ar: "التحقق من الأهلية", en: "Eligibility check" },
        sla: { ar: "ذاتي", en: "Self-serve" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [{ id: uid(), label: { ar: "صفحة شروط الابتعاث", en: "Eligibility page" } }],
        actions: [
          { id: uid(), label: { ar: "التحقق من الجنسية والمعدل واختبار IELTS", en: "Verify nationality, GPA & IELTS" } },
        ],
        entities: [{ id: uid(), label: { ar: "إدارة التطوير والابتعاث", en: "L&D and Scholarships unit" } }],
        opportunities: [
          { id: uid(), label: { ar: "مدقّق أهلية تفاعلي خلال ٦٠ ثانية", en: "60-second interactive eligibility checker" } },
        ],
      },
      nafathStage(),
      {
        id: uid(),
        icon: "UploadCloud",
        name: { ar: "تقديم الملف الأكاديمي", en: "Submit academic file" },
        sla: { ar: "حتى موعد الإقفال", en: "Until deadline" },
        sentiment: "confused",
        emotionScore: -1,
        touchpoints: [{ id: uid(), label: { ar: "نموذج الابتعاث", en: "Scholarship form" } }],
        actions: [
          { id: uid(), label: { ar: "رفع السجل الأكاديمي والشهادات", en: "Upload transcripts & certificates" } },
          { id: uid(), label: { ar: "رفع نتيجة IELTS وجواز السفر", en: "Upload IELTS and passport" } },
        ],
        entities: [{ id: uid(), label: { ar: "إدارة الموارد البشرية", en: "HR department" } }],
        opportunities: [
          { id: uid(), label: { ar: "تحقق آلي من معادلة الشهادات", en: "Auto-verify degree equivalency" } },
        ],
      },
      {
        id: uid(),
        icon: "Stethoscope",
        name: { ar: "الفحص الطبي والمفاضلة", en: "Medical & shortlisting" },
        sla: { ar: "حتى ٢٠ يوم عمل", en: "Up to 20 working days" },
        sentiment: "satisfied",
        emotionScore: 1,
        touchpoints: [
          { id: uid(), label: { ar: "مركز فحص معتمد", en: "Approved medical centre" } },
          { id: uid(), label: { ar: "إشعارات البريد والـ SMS", en: "Email / SMS notifications" } },
        ],
        actions: [
          { id: uid(), label: { ar: "إكمال الفحص الطبي", en: "Complete medical check" } },
          { id: uid(), label: { ar: "متابعة نتيجة المفاضلة", en: "Track shortlist outcome" } },
        ],
        entities: [
          { id: uid(), label: { ar: "لجنة الابتعاث", en: "Scholarship committee" } },
          { id: uid(), label: { ar: "وزارة التعليم", en: "Ministry of Education" } },
        ],
        opportunities: [
          { id: uid(), label: { ar: "جدول زمني تفاعلي للمتقدم", en: "Interactive applicant timeline" } },
        ],
      },
      ackStage("خلال ٢٠ يوم عمل", "Within 20 working days"),
    ],
  },

  // ───────────────────────── 11. Training Programme Registration ─────────────────────────
  {
    id: "j-gac-training",
    icon: "BookOpen",
    title: { ar: "البرامج التدريبية", en: "Training Programme Registration" },
    subtitle: {
      ar: "ورش التوعية ببرامج نظام المنافسة للجمهور والقطاع الخاص",
      en: "Competition-law awareness workshops for the public and private sector",
    },
    owner: { ar: "أكاديمية المنافسة - الهيئة العامة للمنافسة", en: "GAC Competition Academy" },
    types: [
      { ar: "ورشة افتراضية", en: "Virtual workshop" },
      { ar: "برنامج حضوري", en: "In-person programme" },
    ],
    outcomes: [
      { ar: "تسجيل مؤكد", en: "Registration confirmed" },
      { ar: "قائمة انتظار", en: "Waitlisted" },
    ],
    stages: [
      {
        id: uid(),
        icon: "LayoutGrid",
        name: { ar: "تصفّح البرامج", en: "Browse programmes" },
        sla: { ar: "ذاتي", en: "Self-serve" },
        sentiment: "satisfied",
        emotionScore: 1,
        touchpoints: [{ id: uid(), label: { ar: "كتالوج البرامج", en: "Programme catalogue" } }],
        actions: [
          { id: uid(), label: { ar: "تصفية البرامج بالموضوع والتاريخ", en: "Filter by topic & date" } },
        ],
        entities: [{ id: uid(), label: { ar: "إدارة التدريب والتطوير", en: "Training & Development" } }],
        opportunities: [
          { id: uid(), label: { ar: "توصيات شخصية بناءً على القطاع", en: "Personalised recommendations by sector" } },
        ],
      },
      {
        id: uid(),
        icon: "UserPlus",
        name: { ar: "إنشاء الحساب", en: "Create account" },
        sla: { ar: "فوري", en: "Instant" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [{ id: uid(), label: { ar: "صفحة التسجيل", en: "Registration page" } }],
        actions: [
          { id: uid(), label: { ar: "تأكيد الهوية أو الحساب التجاري", en: "Verify identity or business account" } },
        ],
        entities: [{ id: uid(), label: { ar: "نظام إدارة المتدربين", en: "Trainee management system" } }],
        opportunities: [{ id: uid(), label: { ar: "تسجيل سريع عبر نفاذ", en: "One-tap Nafath signup" } }],
      },
      {
        id: uid(),
        icon: "Mail",
        name: { ar: "تأكيد التسجيل والوصول", en: "Confirmation & access" },
        sla: { ar: "فوري", en: "Instant" },
        sentiment: "delighted",
        emotionScore: 2,
        touchpoints: [
          { id: uid(), label: { ar: "بريد إلكتروني", en: "Email" } },
          { id: uid(), label: { ar: "تقويم رقمي", en: "Digital calendar" } },
        ],
        actions: [
          { id: uid(), label: { ar: "إضافة الموعد للتقويم", en: "Add to calendar" } },
          { id: uid(), label: { ar: "تنزيل المواد التحضيرية", en: "Download pre-reads" } },
        ],
        entities: [{ id: uid(), label: { ar: "أكاديمية المنافسة", en: "Competition Academy" } }],
        opportunities: [
          { id: uid(), label: { ar: "شهادة حضور رقمية موقّعة", en: "Digitally-signed attendance certificate" } },
        ],
      },
    ],
  },

  // ───────────────────────── 12. Compliance Programme Application ─────────────────────────
  {
    id: "j-gac-compliance-programme",
    icon: "ShieldCheck",
    title: {
      ar: "التقديم على برنامج الامتثال",
      en: "Competition Compliance Programme Application",
    },
    subtitle: {
      ar: "تقييم الهيئة للبرامج الداخلية لامتثال المنشآت لنظام المنافسة",
      en: "GAC assessment of an organisation's internal Competition-Law compliance programme",
    },
    owner: { ar: "إدارة الامتثال - الهيئة العامة للمنافسة", en: "GAC Compliance Office" },
    types: [
      { ar: "تقييم أولي", en: "Initial assessment" },
      { ar: "إعادة تقييم سنوي", en: "Annual re-assessment" },
    ],
    outcomes: [
      { ar: "اعتماد البرنامج", en: "Programme accredited" },
      { ar: "ملاحظات للتحسين", en: "Improvement notes" },
      { ar: "رفض", en: "Rejected" },
    ],
    stages: [
      nafathStage(),
      {
        id: uid(),
        icon: "BookText",
        name: { ar: "تجميع وثائق الامتثال", en: "Compile compliance docs" },
        sla: { ar: "وتيرة المنشأة", en: "Organisation-paced" },
        sentiment: "confused",
        emotionScore: -1,
        touchpoints: [{ id: uid(), label: { ar: "نموذج الامتثال", en: "Compliance form" } }],
        actions: [
          { id: uid(), label: { ar: "رفع دليل الامتثال الداخلي", en: "Upload internal compliance guide" } },
          { id: uid(), label: { ar: "إثبات تدريب الموظفين", en: "Evidence of staff training" } },
          { id: uid(), label: { ar: "إثبات تعيين مسؤول الامتثال", en: "Designated compliance officer" } },
          { id: uid(), label: { ar: "آلية الإبلاغ السري الداخلي", en: "Internal confidential reporting mechanism" } },
          { id: uid(), label: { ar: "تبعية الإدارة العليا لمسؤول الامتثال", en: "Compliance officer reporting line to senior management" } },
        ],
        entities: [
          { id: uid(), label: { ar: "إدارة الالتزام في المنشأة", en: "Compliance team in organisation" } },
          { id: uid(), label: { ar: "المراجع الداخلي", en: "Internal auditor" } },
        ],
        opportunities: [
          { id: uid(), label: { ar: "قائمة مرجعية تفاعلية للامتثال", en: "Interactive compliance checklist" } },
        ],
      },
      {
        id: uid(),
        icon: "ClipboardCheck",
        name: { ar: "التقييم الفني", en: "Technical assessment" },
        sla: { ar: "حتى ٦٠ يوماً", en: "Up to 60 days" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [
          { id: uid(), label: { ar: "زيارات تقييمية", en: "Assessment visits" } },
          { id: uid(), label: { ar: "غرفة بيانات الامتثال", en: "Compliance data room" } },
        ],
        actions: [
          { id: uid(), label: { ar: "الرد على ملاحظات اللجنة", en: "Respond to committee observations" } },
        ],
        entities: [{ id: uid(), label: { ar: "لجنة تقييم الامتثال", en: "Compliance review committee" } }],
        opportunities: [
          { id: uid(), label: { ar: "تقرير اعتماد إلكتروني بقابلية التحقق", en: "Verifiable e-accreditation report" } },
        ],
      },
      ackStage("خلال ٦٠ يوماً", "Within 60 days"),
    ],
  },
];
