// Static bilingual demo data — Saudi/GCC context.
// Used everywhere; no backend roundtrip. AR + EN sides for every record.

export type Bi = { ar: string; en: string };

export type Sentiment = "positive" | "neutral" | "negative";
export type ComplaintStatus =
  | "new"
  | "acknowledged"
  | "investigating"
  | "awaiting"
  | "resolved"
  | "closed"
  | "escalated";
export type SlaStatus = "onTrack" | "atRisk" | "breached";
export type Channel = "web" | "email" | "whatsapp" | "phone" | "twitter" | "app" | "walkin";
export type Priority = "low" | "medium" | "high" | "urgent";

export type Customer = {
  id: string;
  name: Bi;
  initials: string;
  nationalId: string;
  segment: Bi;
  joined: string;
  interactions: number;
  csat: number;
};

export type Complaint = {
  id: string;
  ref: string;
  customer: Customer;
  subject: Bi;
  description: Bi;
  channel: Channel;
  category: Bi;
  status: ComplaintStatus;
  sla: SlaStatus;
  priority: Priority;
  owner: Bi;
  opened: string;
  updated: string;
  closedAt?: string; // ISO datetime when status moved to resolved/closed (Round 3)
  agency: Bi;
  sentiment: Sentiment;
  timeline: { at: string; action: Bi; actor: Bi }[];
};

export const CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: { ar: "خالد المطيري", en: "Khalid Al-Mutairi" },
    initials: "KA",
    nationalId: "1098234561",
    segment: { ar: "مواطن — خدمات حكومية", en: "Citizen — Government services" },
    joined: "2022-04-12",
    interactions: 14,
    csat: 4.3,
  },
  {
    id: "c2",
    name: { ar: "فاطمة الزهراني", en: "Fatima Al-Zahrani" },
    initials: "FA",
    nationalId: "1076543219",
    segment: { ar: "مواطنة — الصحة", en: "Citizen — Health" },
    joined: "2021-09-03",
    interactions: 9,
    csat: 4.7,
  },
  {
    id: "c3",
    name: { ar: "محمد العمري", en: "Mohammed Al-Amri" },
    initials: "MA",
    nationalId: "1054329876",
    segment: { ar: "مقيم — الجوازات", en: "Resident — Passports" },
    joined: "2023-01-19",
    interactions: 5,
    csat: 3.6,
  },
  {
    id: "c4",
    name: { ar: "عائشة الدوسري", en: "Aisha Al-Dosari" },
    initials: "AD",
    nationalId: "1023987651",
    segment: { ar: "مواطنة — التعليم", en: "Citizen — Education" },
    joined: "2020-06-22",
    interactions: 22,
    csat: 4.1,
  },
  {
    id: "c5",
    name: { ar: "سارة الشهري", en: "Sara Al-Shehri" },
    initials: "SA",
    nationalId: "1087654321",
    segment: { ar: "مواطنة — الأعمال", en: "Citizen — Business" },
    joined: "2019-11-30",
    interactions: 31,
    csat: 4.5,
  },
  {
    id: "c6",
    name: { ar: "عبدالله السبيعي", en: "Abdullah Al-Subaie" },
    initials: "AS",
    nationalId: "1067890123",
    segment: { ar: "مواطن — النقل", en: "Citizen — Transport" },
    joined: "2024-02-08",
    interactions: 3,
    csat: 3.2,
  },
];

const AGENTS = [
  { ar: "أحمد الحربي", en: "Ahmed Al-Harbi" },
  { ar: "نوف الغامدي", en: "Nouf Al-Ghamdi" },
  { ar: "ياسر القرني", en: "Yasser Al-Qarni" },
  { ar: "هند العنزي", en: "Hind Al-Anzi" },
  { ar: "بدر الشمري", en: "Badr Al-Shammari" },
];

const AGENCIES = [
  { ar: "وزارة الصحة", en: "Ministry of Health" },
  { ar: "وزارة الداخلية", en: "Ministry of Interior" },
  { ar: "وزارة التعليم", en: "Ministry of Education" },
  { ar: "هيئة الزكاة والضريبة", en: "Zakat, Tax and Customs Authority" },
  { ar: "وزارة النقل", en: "Ministry of Transport" },
];

export const COMPLAINTS: Complaint[] = [
  {
    id: "cx1",
    ref: "CX-2148",
    customer: CUSTOMERS[0],
    subject: { ar: "تأخر في إصدار رخصة القيادة", en: "Delay in driving licence issuance" },
    description: {
      ar: "قدمت طلب تجديد رخصة القيادة قبل 14 يوماً ولم يصدر حتى الآن رغم اكتمال المستندات.",
      en: "Submitted my driving licence renewal 14 days ago. Documents complete but no issuance yet.",
    },
    channel: "app",
    category: { ar: "خدمات المرور", en: "Traffic services" },
    status: "investigating",
    sla: "atRisk",
    priority: "high",
    owner: AGENTS[0],
    opened: "2026-05-08",
    updated: "2026-05-13",
    agency: AGENCIES[1],
    sentiment: "negative",
    timeline: [
      { at: "2026-05-08 09:14", action: { ar: "تم استلام الشكوى عبر التطبيق", en: "Complaint received via app" }, actor: { ar: "النظام", en: "System" } },
      { at: "2026-05-08 09:35", action: { ar: "تم الإسناد إلى أحمد الحربي", en: "Assigned to Ahmed Al-Harbi" }, actor: { ar: "فاطمة العتيبي", en: "Fatima Al-Otaibi" } },
      { at: "2026-05-10 11:02", action: { ar: "بدء التحقيق مع إدارة المرور", en: "Investigation started with Traffic Dept." }, actor: AGENTS[0] },
      { at: "2026-05-13 14:21", action: { ar: "طلب مستند إضافي من المستفيد", en: "Additional document requested from customer" }, actor: AGENTS[0] },
    ],
  },
  {
    id: "cx2",
    ref: "CX-2149",
    customer: CUSTOMERS[1],
    subject: { ar: "تأخر موعد العيادة التخصصية", en: "Specialist clinic appointment delay" },
    description: {
      ar: "تم تأجيل موعدي ثلاث مرات دون إشعار. أحتاج توضيحاً وإعادة جدولة عاجلة.",
      en: "My appointment has been postponed three times with no notice. I need clarification and urgent rescheduling.",
    },
    channel: "whatsapp",
    category: { ar: "المواعيد الطبية", en: "Medical appointments" },
    status: "acknowledged",
    sla: "onTrack",
    priority: "medium",
    owner: AGENTS[1],
    opened: "2026-05-11",
    updated: "2026-05-12",
    agency: AGENCIES[0],
    sentiment: "negative",
    timeline: [
      { at: "2026-05-11 10:02", action: { ar: "تم الاستلام عبر واتساب", en: "Received via WhatsApp" }, actor: { ar: "النظام", en: "System" } },
      { at: "2026-05-11 10:30", action: { ar: "تم الإقرار باستلام الشكوى", en: "Complaint acknowledged" }, actor: AGENTS[1] },
    ],
  },
  {
    id: "cx3",
    ref: "CX-2150",
    customer: CUSTOMERS[2],
    subject: { ar: "خطأ في احتساب رسوم الإقامة", en: "Incorrect residency fee calculation" },
    description: {
      ar: "تم احتساب رسوم الإقامة بمبلغ أعلى من الحد المقرر. أرفقت إيصال السداد.",
      en: "Residency fee was charged above the official rate. Payment receipt attached.",
    },
    channel: "email",
    category: { ar: "الرسوم والمدفوعات", en: "Fees & payments" },
    status: "escalated",
    sla: "breached",
    priority: "urgent",
    owner: AGENTS[2],
    opened: "2026-05-04",
    updated: "2026-05-13",
    agency: AGENCIES[3],
    sentiment: "negative",
    timeline: [
      { at: "2026-05-04 08:55", action: { ar: "تم الاستلام عبر البريد", en: "Received via email" }, actor: { ar: "النظام", en: "System" } },
      { at: "2026-05-12 16:40", action: { ar: "تم التصعيد إلى المستوى الثاني", en: "Escalated to Tier 2" }, actor: { ar: "فاطمة العتيبي", en: "Fatima Al-Otaibi" } },
    ],
  },
  {
    id: "cx4",
    ref: "CX-2151",
    customer: CUSTOMERS[3],
    subject: { ar: "مشكلة في تسجيل الطالب الإلكتروني", en: "Student e-registration issue" },
    description: {
      ar: "لا يقبل النظام تحميل شهادة الميلاد ضمن طلب التسجيل.",
      en: "The system refuses to upload the birth certificate as part of the registration request.",
    },
    channel: "web",
    category: { ar: "التسجيل الإلكتروني", en: "E-registration" },
    status: "resolved",
    sla: "onTrack",
    priority: "medium",
    owner: AGENTS[3],
    opened: "2026-05-02",
    updated: "2026-05-06",
    closedAt: "2026-05-06T09:30:00.000Z",
    agency: AGENCIES[2],
    sentiment: "neutral",
    timeline: [
      { at: "2026-05-02 13:11", action: { ar: "استلام عبر الويب", en: "Received via web" }, actor: { ar: "النظام", en: "System" } },
      { at: "2026-05-06 09:30", action: { ar: "تم الحل بإصلاح صلاحية الملف", en: "Resolved by fixing file permission" }, actor: AGENTS[3] },
    ],
  },
  {
    id: "cx5",
    ref: "CX-2152",
    customer: CUSTOMERS[4],
    subject: { ar: "إساءة من موظف خدمة في الفرع", en: "Misconduct from branch service staff" },
    description: {
      ar: "تعرضت لتعامل غير لائق أثناء مراجعة الفرع وأود تقديم شكوى رسمية.",
      en: "Experienced inappropriate conduct during my branch visit and wish to file a formal complaint.",
    },
    channel: "phone",
    category: { ar: "سلوك الموظفين", en: "Staff conduct" },
    status: "investigating",
    sla: "atRisk",
    priority: "high",
    owner: AGENTS[4],
    opened: "2026-05-09",
    updated: "2026-05-13",
    agency: AGENCIES[3],
    sentiment: "negative",
    timeline: [
      { at: "2026-05-09 15:21", action: { ar: "بلاغ هاتفي", en: "Phone report" }, actor: { ar: "مركز الاتصال", en: "Call centre" } },
      { at: "2026-05-10 09:00", action: { ar: "بدء التحقيق الإداري", en: "Administrative investigation started" }, actor: AGENTS[4] },
    ],
  },
  {
    id: "cx6",
    ref: "CX-2153",
    customer: CUSTOMERS[5],
    subject: { ar: "تطبيق النقل العام لا يقبل بطاقة الدفع", en: "Public-transport app rejects payment card" },
    description: {
      ar: "أحاول إعادة شحن بطاقة النقل عبر التطبيق ولا يكتمل الدفع.",
      en: "Trying to top up my transit card via the app — the payment does not complete.",
    },
    channel: "twitter",
    category: { ar: "المدفوعات الرقمية", en: "Digital payments" },
    status: "awaiting",
    sla: "onTrack",
    priority: "low",
    owner: AGENTS[0],
    opened: "2026-05-12",
    updated: "2026-05-13",
    agency: AGENCIES[4],
    sentiment: "neutral",
    timeline: [
      { at: "2026-05-12 19:11", action: { ar: "استلام عبر تويتر", en: "Received via Twitter" }, actor: { ar: "النظام", en: "System" } },
      { at: "2026-05-13 10:00", action: { ar: "طلب لقطة الشاشة للدفع", en: "Requested payment screenshot" }, actor: AGENTS[0] },
    ],
  },
  {
    id: "cx7",
    ref: "CX-2154",
    customer: CUSTOMERS[0],
    subject: { ar: "وقت انتظار طويل في الفرع", en: "Long wait time at branch" },
    description: {
      ar: "انتظرت أكثر من ساعتين دون استدعاء الدور.",
      en: "Waited more than two hours without being called.",
    },
    channel: "walkin",
    category: { ar: "تجربة الفروع", en: "Branch experience" },
    status: "closed",
    sla: "onTrack",
    priority: "low",
    owner: AGENTS[1],
    opened: "2026-04-28",
    updated: "2026-05-02",
    closedAt: "2026-05-02T11:00:00.000Z",
    agency: AGENCIES[1],
    sentiment: "neutral",
    timeline: [
      { at: "2026-04-28 12:00", action: { ar: "تم تسجيل الشكوى في الفرع", en: "Complaint logged at branch" }, actor: AGENTS[1] },
      { at: "2026-05-02 11:00", action: { ar: "تم الإغلاق بعد تواصل المستفيد", en: "Closed after customer contact" }, actor: AGENTS[1] },
    ],
  },
  {
    id: "cx8",
    ref: "CX-2155",
    customer: CUSTOMERS[1],
    subject: { ar: "صعوبة تسجيل الدخول إلى نفاذ", en: "Difficulty signing in via Nafath" },
    description: {
      ar: "لا أستطيع الدخول إلى الخدمة عبر تطبيق نفاذ منذ يومين.",
      en: "Cannot sign in to the service via the Nafath app for two days.",
    },
    channel: "web",
    category: { ar: "الهوية الرقمية", en: "Digital identity" },
    status: "new",
    sla: "onTrack",
    priority: "medium",
    owner: AGENTS[2],
    opened: "2026-05-13",
    updated: "2026-05-13",
    agency: AGENCIES[1],
    sentiment: "negative",
    timeline: [
      { at: "2026-05-13 08:42", action: { ar: "تم الاستلام عبر الويب", en: "Received via web" }, actor: { ar: "النظام", en: "System" } },
    ],
  },
];

// KPI numbers — current month + 12-month trend
export const KPI = {
  csat: { value: 87.4, delta: +2.1 },
  nps: { value: 42, delta: +6 },
  ces: { value: 2.8, delta: -0.2 }, // lower is better
  fcr: { value: 71.3, delta: +1.4 },
  sla: { value: 91.2, delta: -0.6 },
  open: { value: 318, delta: -24 },
};

export const CSAT_TREND = [
  { m: "Jun", v: 82.1 },
  { m: "Jul", v: 83.4 },
  { m: "Aug", v: 84.0 },
  { m: "Sep", v: 84.6 },
  { m: "Oct", v: 85.2 },
  { m: "Nov", v: 85.0 },
  { m: "Dec", v: 86.1 },
  { m: "Jan", v: 86.5 },
  { m: "Feb", v: 86.8 },
  { m: "Mar", v: 87.0 },
  { m: "Apr", v: 87.1 },
  { m: "May", v: 87.4 },
];

export const SLA_BREACH_TREND = [
  { m: "Jun", v: 11 },
  { m: "Jul", v: 9 },
  { m: "Aug", v: 12 },
  { m: "Sep", v: 8 },
  { m: "Oct", v: 7 },
  { m: "Nov", v: 6 },
  { m: "Dec", v: 9 },
  { m: "Jan", v: 5 },
  { m: "Feb", v: 6 },
  { m: "Mar", v: 4 },
  { m: "Apr", v: 5 },
  { m: "May", v: 6 },
];

export const CHANNEL_MIX = [
  { key: "web", value: 32 },
  { key: "email", value: 18 },
  { key: "whatsapp", value: 24 },
  { key: "phone", value: 14 },
  { key: "twitter", value: 7 },
  { key: "app", value: 5 },
];

export const CATEGORY_VOLUME = [
  { key: { ar: "المواعيد الطبية", en: "Medical appointments" }, v: 64 },
  { key: { ar: "خدمات المرور", en: "Traffic services" }, v: 58 },
  { key: { ar: "الرسوم والمدفوعات", en: "Fees & payments" }, v: 47 },
  { key: { ar: "الهوية الرقمية", en: "Digital identity" }, v: 39 },
  { key: { ar: "التسجيل الإلكتروني", en: "E-registration" }, v: 31 },
  { key: { ar: "تجربة الفروع", en: "Branch experience" }, v: 22 },
  { key: { ar: "المدفوعات الرقمية", en: "Digital payments" }, v: 18 },
];

export const TOP_THEMES: { theme: Bi; mentions: number; sentiment: Sentiment }[] = [
  { theme: { ar: "زمن الانتظار", en: "Wait time" }, mentions: 124, sentiment: "negative" },
  { theme: { ar: "ودّ الموظف", en: "Staff friendliness" }, mentions: 96, sentiment: "positive" },
  { theme: { ar: "وضوح المعلومات", en: "Information clarity" }, mentions: 88, sentiment: "neutral" },
  { theme: { ar: "سهولة التطبيق", en: "App usability" }, mentions: 71, sentiment: "positive" },
  { theme: { ar: "دقة الفواتير", en: "Billing accuracy" }, mentions: 63, sentiment: "negative" },
  { theme: { ar: "سرعة الاستجابة", en: "Response speed" }, mentions: 59, sentiment: "neutral" },
  { theme: { ar: "جودة الترجمة", en: "Translation quality" }, mentions: 32, sentiment: "neutral" },
];

export const SENTIMENT_BREAKDOWN = [
  { key: "positive" as Sentiment, value: 58 },
  { key: "neutral" as Sentiment, value: 27 },
  { key: "negative" as Sentiment, value: 15 },
];

// VoC surveys
export type Survey = {
  id: string;
  name: Bi;
  audience: Bi;
  responses: number;
  responseRate: number;
  score: number;
  status: Bi;
  type: "CSAT" | "NPS" | "CES";
};

export const SURVEYS: Survey[] = [
  {
    id: "s1",
    name: { ar: "استبيان رضا ما بعد التذكرة", en: "Post-ticket CSAT" },
    audience: { ar: "كل المستفيدين", en: "All customers" },
    responses: 1284,
    responseRate: 38.2,
    score: 4.4,
    status: { ar: "نشط", en: "Active" },
    type: "CSAT",
  },
  {
    id: "s2",
    name: { ar: "صافي مؤشر الترويج الفصلي", en: "Quarterly NPS" },
    audience: { ar: "المستفيدين النشطون", en: "Active customers" },
    responses: 642,
    responseRate: 21.5,
    score: 42,
    status: { ar: "نشط", en: "Active" },
    type: "NPS",
  },
  {
    id: "s3",
    name: { ar: "مؤشر الجهد — رحلة التطبيق", en: "CES — app journey" },
    audience: { ar: "مستخدمو التطبيق", en: "App users" },
    responses: 487,
    responseRate: 18.9,
    score: 2.8,
    status: { ar: "نشط", en: "Active" },
    type: "CES",
  },
  {
    id: "s4",
    name: { ar: "تجربة الفرع", en: "Branch experience" },
    audience: { ar: "زوار الفروع", en: "Branch visitors" },
    responses: 312,
    responseRate: 27.4,
    score: 4.1,
    status: { ar: "مسودة", en: "Draft" },
    type: "CSAT",
  },
  {
    id: "s5",
    name: { ar: "استبيان ما بعد المكالمة", en: "Post-call survey" },
    audience: { ar: "مكالمات مركز الاتصال", en: "Call-centre calls" },
    responses: 911,
    responseRate: 34.0,
    score: 4.2,
    status: { ar: "نشط", en: "Active" },
    type: "CSAT",
  },
];

// KB articles
export type Article = {
  id: string;
  title: Bi;
  category: "services" | "billing" | "account" | "technical" | "policy";
  views: number;
  helpful: number;
  updated: string;
  status: "published" | "draft" | "review";
  body: Bi;
};

export const ARTICLES: Article[] = [
  {
    id: "a1",
    title: { ar: "كيفية تجديد رخصة القيادة إلكترونياً", en: "How to renew your driving licence online" },
    category: "services",
    views: 18420,
    helpful: 92,
    updated: "2026-04-22",
    status: "published",
    body: {
      ar: "يمكن تجديد رخصة القيادة عبر تطبيق أبشر باتباع الخطوات: 1) الدخول بحساب نفاذ، 2) اختيار خدمة تجديد الرخصة، 3) سداد الرسوم، 4) استلام الرخصة بالبريد.",
      en: "You can renew your driving licence via the Absher app in four steps: 1) Sign in with Nafath, 2) Select 'Renew licence', 3) Pay the fee, 4) Receive the new licence by post.",
    },
  },
  {
    id: "a2",
    title: { ar: "حجز موعد عيادة تخصصية", en: "Booking a specialist clinic appointment" },
    category: "services",
    views: 12104,
    helpful: 88,
    updated: "2026-04-19",
    status: "published",
    body: {
      ar: "حجز المواعيد التخصصية يتم عبر تطبيق صحتي. حدد المنشأة ثم التخصص ثم الموعد المتاح. ستصلك رسالة تأكيد فور الحجز.",
      en: "Specialist appointments can be booked via the Sehhaty app. Pick the facility, then the specialty, then the available slot. A confirmation message is sent immediately.",
    },
  },
  {
    id: "a3",
    title: { ar: "فهم رسوم المقابل المالي للمقيمين", en: "Understanding residency fees for expatriates" },
    category: "billing",
    views: 9821,
    helpful: 76,
    updated: "2026-03-30",
    status: "published",
    body: {
      ar: "تُحتسب رسوم الإقامة وفق عدد المرافقين ومدة الإقامة. تُحدّث الرسوم بموجب اللائحة السنوية الصادرة عن الجهة المختصة.",
      en: "Residency fees are calculated based on the number of dependants and stay duration. Rates are updated annually per the regulations issued by the competent authority.",
    },
  },
  {
    id: "a4",
    title: { ar: "إعادة ضبط كلمة المرور في حساب نفاذ", en: "Resetting your Nafath password" },
    category: "account",
    views: 24309,
    helpful: 84,
    updated: "2026-04-11",
    status: "published",
    body: {
      ar: "إذا نسيت كلمة المرور، افتح تطبيق نفاذ، اضغط على 'نسيت كلمة المرور'، تحقق برقم الجوال، ثم أنشئ كلمة مرور جديدة.",
      en: "If you have forgotten your password, open the Nafath app, tap 'Forgot password', verify by mobile number, then create a new password.",
    },
  },
  {
    id: "a5",
    title: { ar: "حل مشاكل الدفع في التطبيق", en: "Fixing payment issues in the app" },
    category: "technical",
    views: 7654,
    helpful: 71,
    updated: "2026-05-02",
    status: "published",
    body: {
      ar: "تأكد من تفعيل بطاقتك للتجارة الإلكترونية، وتحقق من توفر رصيد كافٍ، وحدّث التطبيق إلى آخر إصدار.",
      en: "Make sure e-commerce is enabled on your card, verify sufficient balance, and update the app to the latest version.",
    },
  },
  {
    id: "a6",
    title: { ar: "سياسة الخصوصية وحماية البيانات", en: "Privacy and data protection policy" },
    category: "policy",
    views: 4321,
    helpful: 64,
    updated: "2026-02-18",
    status: "published",
    body: {
      ar: "نلتزم بنظام حماية البيانات الشخصية في المملكة. تُعالَج بياناتك بسرية ولأغراض الخدمة فقط.",
      en: "We comply with the Personal Data Protection Law of the Kingdom. Your data is processed confidentially and solely for service delivery.",
    },
  },
  {
    id: "a7",
    title: { ar: "كيفية تقديم شكوى رسمية", en: "How to file a formal complaint" },
    category: "services",
    views: 6532,
    helpful: 81,
    updated: "2026-04-29",
    status: "published",
    body: {
      ar: "يمكنك تقديم شكوى عبر بوابة المستفيد أو واتساب أو الاتصال بمركز الخدمة. سيتم تزويدك برقم مرجعي للمتابعة.",
      en: "You can file a complaint via the citizen portal, WhatsApp, or by calling the service centre. You will receive a reference number for tracking.",
    },
  },
  {
    id: "a8",
    title: { ar: "تحديث بيانات التواصل في الحساب", en: "Updating contact details on your account" },
    category: "account",
    views: 5210,
    helpful: 73,
    updated: "2026-03-12",
    status: "review",
    body: {
      ar: "ادخل إلى ملفك الشخصي > التواصل، وحدّث رقم الجوال أو البريد الإلكتروني. ستصلك رسالة تحقق.",
      en: "Open Profile > Contact, update your mobile number or email. A verification code will be sent.",
    },
  },
];

// Inbox conversations
export type Message = {
  id: string;
  from: "agent" | "customer";
  body: Bi;
  at: string;
};

export type Conversation = {
  id: string;
  customer: Customer;
  channel: Channel;
  unread: number;
  preview: Bi;
  sentiment: Sentiment;
  updated: string;
  messages: Message[];
  tags: Bi[];
};

export const CONVERSATIONS: Conversation[] = [
  {
    id: "v1",
    customer: CUSTOMERS[0],
    channel: "whatsapp",
    unread: 2,
    sentiment: "negative",
    updated: "12:08",
    preview: { ar: "ما زلت أنتظر تحديث الرخصة…", en: "Still waiting on my licence update…" },
    tags: [{ ar: "متابعة", en: "Follow-up" }, { ar: "أولوية عالية", en: "High priority" }],
    messages: [
      { id: "m1", from: "customer", at: "11:42", body: { ar: "السلام عليكم، هل من تحديث على طلب رخصتي؟ مر أسبوعين.", en: "Hello, any update on my licence? It has been two weeks." } },
      { id: "m2", from: "agent", at: "11:50", body: { ar: "وعليكم السلام، أراجع الحالة الآن وأعود إليك خلال دقائق.", en: "Hello, reviewing your case now. I will return shortly." } },
      { id: "m3", from: "customer", at: "12:08", body: { ar: "حسناً، أرجو التعجيل لأنني أحتاج الرخصة لعملي.", en: "Okay, please expedite — I need the licence for work." } },
    ],
  },
  {
    id: "v2",
    customer: CUSTOMERS[1],
    channel: "web",
    unread: 1,
    sentiment: "neutral",
    updated: "11:54",
    preview: { ar: "هل يمكن إعادة جدولة الموعد ليوم الخميس؟", en: "Can my appointment be rescheduled to Thursday?" },
    tags: [{ ar: "إعادة جدولة", en: "Reschedule" }],
    messages: [
      { id: "m1", from: "customer", at: "11:51", body: { ar: "مرحباً، أحتاج تغيير موعد العيادة.", en: "Hello, I need to change my clinic appointment." } },
      { id: "m2", from: "customer", at: "11:54", body: { ar: "هل يمكن إعادة جدولة الموعد ليوم الخميس؟", en: "Can it be rescheduled to Thursday?" } },
    ],
  },
  {
    id: "v3",
    customer: CUSTOMERS[2],
    channel: "email",
    unread: 0,
    sentiment: "negative",
    updated: "10:22",
    preview: { ar: "إيصال السداد مرفق — الرجاء المراجعة.", en: "Payment receipt attached — please review." },
    tags: [{ ar: "مالي", en: "Finance" }],
    messages: [
      { id: "m1", from: "customer", at: "09:01", body: { ar: "أرفقت إيصال السداد ومخالفة الاحتساب.", en: "Attached the payment receipt and the calculation discrepancy." } },
      { id: "m2", from: "agent", at: "10:22", body: { ar: "شكراً لك، تم تصعيد الحالة إلى الإدارة المالية.", en: "Thank you — case has been escalated to Finance." } },
    ],
  },
  {
    id: "v4",
    customer: CUSTOMERS[4],
    channel: "twitter",
    unread: 0,
    sentiment: "positive",
    updated: "09:48",
    preview: { ar: "تجربتي مع الفريق كانت ممتازة، شكراً!", en: "My experience with the team was excellent, thank you!" },
    tags: [{ ar: "ثناء", en: "Compliment" }],
    messages: [
      { id: "m1", from: "customer", at: "09:48", body: { ar: "تجربتي مع الفريق كانت ممتازة، شكراً لكم.", en: "My experience with the team was excellent, thank you." } },
    ],
  },
  {
    id: "v5",
    customer: CUSTOMERS[5],
    channel: "phone",
    unread: 0,
    sentiment: "neutral",
    updated: "Yesterday",
    preview: { ar: "ملخص المكالمة: مشكلة في تطبيق النقل.", en: "Call summary: transit app issue." },
    tags: [{ ar: "مسجلة", en: "Logged" }],
    messages: [
      { id: "m1", from: "agent", at: "Yesterday", body: { ar: "تم استلام البلاغ هاتفياً وتسجيله في النظام.", en: "Report received via phone and logged in the system." } },
    ],
  },
];

// Suggested replies for inbox composer
export const SUGGESTED_REPLIES: Bi[] = [
  { ar: "شكراً لتواصلك، نعمل على القضية حالياً وسنوافيك بالتحديث خلال 24 ساعة.", en: "Thank you for reaching out — we are working on your case and will update you within 24 hours." },
  { ar: "نعتذر عن التأخير. تم تصعيد الحالة وستسمع منا قريباً.", en: "Apologies for the delay. The case has been escalated and you will hear from us soon." },
  { ar: "هل يمكنك تزويدنا برقم الطلب لإكمال المراجعة؟", en: "Could you share the request number so we can complete the review?" },
];

// Closed-loop follow-ups (detractors)
export type CLItem = {
  id: string;
  customer: Customer;
  score: number;
  comment: Bi;
  surveyId: string;
  due: string;
  owner: Bi;
};

export const CLOSED_LOOP: CLItem[] = [
  {
    id: "cl1",
    customer: CUSTOMERS[2],
    score: 2,
    comment: { ar: "خدمة بطيئة جداً ولا يوجد متابعة.", en: "Very slow service and no follow-up." },
    surveyId: "s1",
    due: "2026-05-15",
    owner: AGENTS[0],
  },
  {
    id: "cl2",
    customer: CUSTOMERS[5],
    score: 3,
    comment: { ar: "التطبيق يحتاج تحسين.", en: "The app needs improvement." },
    surveyId: "s3",
    due: "2026-05-16",
    owner: AGENTS[1],
  },
  {
    id: "cl3",
    customer: CUSTOMERS[3],
    score: 4,
    comment: { ar: "وقت الانتظار طويل جداً.", en: "Wait time is way too long." },
    surveyId: "s4",
    due: "2026-05-17",
    owner: AGENTS[2],
  },
];

// Open escalations
export type Escalation = {
  id: string;
  ref: string;
  subject: Bi;
  owner: Bi;
  tier: 1 | 2 | 3;
  age: number;
};

export const ESCALATIONS: Escalation[] = [
  { id: "e1", ref: "CX-2150", subject: { ar: "خطأ في احتساب رسوم الإقامة", en: "Incorrect residency fee calculation" }, owner: AGENTS[2], tier: 2, age: 9 },
  { id: "e2", ref: "CX-2152", subject: { ar: "إساءة من موظف خدمة", en: "Misconduct from service staff" }, owner: AGENTS[4], tier: 2, age: 4 },
  { id: "e3", ref: "CX-2148", subject: { ar: "تأخر إصدار الرخصة", en: "Licence issuance delay" }, owner: AGENTS[0], tier: 1, age: 5 },
];

// Customer self-service requests
export type PortalRequest = {
  id: string;
  ref: string;
  subject: Bi;
  status: ComplaintStatus;
  agency: Bi;
  opened: string;
};

export const MY_REQUESTS: PortalRequest[] = [
  { id: "r1", ref: "CX-2148", subject: { ar: "تأخر إصدار رخصة القيادة", en: "Driving licence issuance delay" }, status: "investigating", agency: AGENCIES[1], opened: "2026-05-08" },
  { id: "r2", ref: "CX-2154", subject: { ar: "وقت انتظار طويل في الفرع", en: "Long wait at branch" }, status: "closed", agency: AGENCIES[1], opened: "2026-04-28" },
  { id: "r3", ref: "CX-2160", subject: { ar: "طلب إصدار شهادة سعودة", en: "Saudisation certificate request" }, status: "acknowledged", agency: AGENCIES[3], opened: "2026-05-11" },
];

// Admin: users / personas
export const ADMIN_USERS = [
  { id: "u1", name_en: "Raid Al-Ghamdi", name_ar: "رائد الغامدي", role: "executive", status: "active", function_en: "Strategy", function_ar: "الاستراتيجية" },
  { id: "u2", name_en: "Fatima Al-Otaibi", name_ar: "فاطمة العتيبي", role: "supervisor", status: "active", function_en: "Operations", function_ar: "العمليات" },
  { id: "u3", name_en: "Ahmed Al-Harbi", name_ar: "أحمد الحربي", role: "agent", status: "active", function_en: "Front-line", function_ar: "الخط الأمامي" },
  { id: "u4", name_en: "Nouf Al-Ghamdi", name_ar: "نوف الغامدي", role: "agent", status: "active", function_en: "Front-line", function_ar: "الخط الأمامي" },
  { id: "u5", name_en: "Yasser Al-Qarni", name_ar: "ياسر القرني", role: "agent", status: "active", function_en: "Front-line", function_ar: "الخط الأمامي" },
  { id: "u6", name_en: "Hind Al-Anzi", name_ar: "هند العنزي", role: "agent", status: "active", function_en: "Front-line", function_ar: "الخط الأمامي" },
  { id: "u7", name_en: "Badr Al-Shammari", name_ar: "بدر الشمري", role: "agent", status: "leave", function_en: "Front-line", function_ar: "الخط الأمامي" },
  { id: "u8", name_en: "Layla Al-Qahtani", name_ar: "ليلى القحطاني", role: "quality", status: "active", function_en: "Quality", function_ar: "الجودة" },
  { id: "u9", name_en: "Sara Al-Shehri", name_ar: "سارة الشهري", role: "quality", status: "active", function_en: "Quality", function_ar: "الجودة" },
  { id: "u10", name_en: "Mohammed Al-Amri", name_ar: "محمد العمري", role: "supervisor", status: "active", function_en: "Operations", function_ar: "العمليات" },
  { id: "u11", name_en: "Aisha Al-Dosari", name_ar: "عائشة الدوسري", role: "supervisor", status: "active", function_en: "Operations", function_ar: "العمليات" },
  { id: "u12", name_en: "Noor Al Noor", name_ar: "نور النور", role: "admin", status: "active", function_en: "Administration", function_ar: "الإدارة" },
  { id: "u13", name_en: "Khalid Al-Mutairi", name_ar: "خالد المطيري", role: "customer", status: "active", function_en: "Citizen", function_ar: "مواطن" },
  { id: "u14", name_en: "Abdullah Al-Subaie", name_ar: "عبدالله السبيعي", role: "customer", status: "active", function_en: "Citizen", function_ar: "مواطن" },
];

export const SLA_POLICIES = [
  { id: "p1", name_en: "Standard", name_ar: "قياسية", low: 72, medium: 48, high: 24, urgent: 4 },
  { id: "p2", name_en: "VIP", name_ar: "كبار المستفيدين", low: 24, medium: 12, high: 6, urgent: 2 },
  { id: "p3", name_en: "Regulatory", name_ar: "تنظيمية", low: 48, medium: 24, high: 12, urgent: 4 },
];

export const ESCALATION_MATRIX = [
  { tier: 1, role_en: "Agent", role_ar: "موظف خدمة", threshold_en: "0–24h", threshold_ar: "٠–٢٤ ساعة" },
  { tier: 2, role_en: "Supervisor", role_ar: "مشرف", threshold_en: "24–48h", threshold_ar: "٢٤–٤٨ ساعة" },
  { tier: 3, role_en: "Head of CX", role_ar: "رئيس قسم التجربة", threshold_en: "> 48h or VIP", threshold_ar: "أكثر من ٤٨ ساعة أو كبار المستفيدين" },
];

export const PERMISSIONS_MATRIX = [
  { module: "dashboard", executive: "admin", supervisor: "write", agent: "read", quality: "read", customer: "—", admin: "admin" },
  { module: "complaints", executive: "read", supervisor: "admin", agent: "write", quality: "write", customer: "—", admin: "admin" },
  { module: "inbox", executive: "—", supervisor: "admin", agent: "write", quality: "read", customer: "—", admin: "admin" },
  { module: "voc", executive: "read", supervisor: "write", agent: "—", quality: "write", customer: "—", admin: "admin" },
  { module: "kb", executive: "read", supervisor: "write", agent: "read", quality: "write", customer: "read", admin: "admin" },
  { module: "portal", executive: "—", supervisor: "—", agent: "—", quality: "—", customer: "write", admin: "admin" },
  { module: "copilot", executive: "—", supervisor: "write", agent: "write", quality: "—", customer: "—", admin: "admin" },
  { module: "admin", executive: "—", supervisor: "—", agent: "—", quality: "—", customer: "—", admin: "admin" },
];

// Copilot canned responses
export const COPILOT_RESPONSES: Record<string, Bi> = {
  summarise: {
    ar: "الحالة CX-2148: المستفيد خالد المطيري ينتظر تجديد رخصة القيادة منذ ١٤ يوماً. المستندات مكتملة. مسؤول الحالة أحمد الحربي. التوصية: التواصل مع إدارة المرور وتزويد المستفيد بإفادة خلال ٤٨ ساعة.",
    en: "Case CX-2148: Customer Khalid Al-Mutairi has been waiting 14 days for a driving licence renewal. Documents are complete. Case owner Ahmed Al-Harbi. Recommendation: contact Traffic Dept. and update the customer within 48 hours.",
  },
  reply: {
    ar: "نموذج رد مقترح: شكراً لتواصلك، نعتذر عن التأخير في معاملتك. تم تصعيد الحالة وسيتم التواصل معك خلال ٢٤ ساعة بنتيجة المراجعة.",
    en: "Draft reply: Thank you for reaching out. We apologise for the delay on your request. The case has been escalated and you will be contacted within 24 hours with the outcome.",
  },
  kb: {
    ar: "مسودة مقال: كيفية متابعة طلب تجديد الرخصة عبر تطبيق أبشر — مع الخطوات الأربع المعتادة وروابط مساعدة.",
    en: "Article draft: How to track your licence renewal on the Absher app — with the four standard steps and helper links.",
  },
  translate: {
    ar: "ترجمة جاهزة: 'Your request has been escalated and you will hear back within 24 hours.' → 'تم تصعيد طلبك وسيتم التواصل معك خلال ٢٤ ساعة.'",
    en: "Translation ready: 'تم تصعيد طلبك وسيتم التواصل معك خلال ٢٤ ساعة.' → 'Your request has been escalated and you will hear back within 24 hours.'",
  },
  sentiment: {
    ar: "تحليل المشاعر: المحادثة تصنّف كـ 'سلبية' (ثقة ٠.٨٧) — الكلمات الدالة: تأخر، انتظار، بدون رد.",
    en: "Sentiment analysis: Conversation classified as 'Negative' (confidence 0.87) — key terms: delay, waiting, no response.",
  },
};
