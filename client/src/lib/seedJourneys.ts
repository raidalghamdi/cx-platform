// Seed data for the Service Journeys module.
// 5 prefilled bilingual journeys spanning realistic Saudi government CX scenarios.
// All journey state is held in-memory via JourneyContext — this file just bootstraps it.

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
  icon: string; // lucide icon for the journey card
  types: Bi[]; // journey-type pills (Routine / Urgent / Specialist, etc.)
  outcomes: Bi[]; // outcome paths (Confirmed / Rescheduled / Not Eligible, etc.)
  stages: Stage[];
};

// Helper to build IDs quickly
const id = () => Math.random().toString(36).slice(2, 9);

export const SEED_JOURNEYS: Journey[] = [
  // ---------- 1. Healthcare Appointment ----------
  {
    id: "j-healthcare",
    icon: "Stethoscope",
    title: { ar: "رحلة موعد رعاية صحية", en: "Healthcare Appointment Journey" },
    subtitle: {
      ar: "من ملاحظة العَرَض إلى استكمال الزيارة واستبيان المتابعة",
      en: "From symptom recognition to visit completion and follow-up survey",
    },
    owner: { ar: "وزارة الصحة", en: "Ministry of Health" },
    types: [
      { ar: "روتيني · ٣ أيام", en: "Routine · 3 days" },
      { ar: "طارئ · نفس اليوم", en: "Urgent · same day" },
      { ar: "تخصصي · ١٤ يوماً", en: "Specialist · 14 days" },
    ],
    outcomes: [
      { ar: "تم تأكيد الموعد", en: "Appointment Confirmed" },
      { ar: "إعادة جدولة", en: "Rescheduled" },
      { ar: "غير مؤهل", en: "Not Eligible" },
    ],
    stages: [
      {
        id: id(),
        icon: "Search",
        name: { ar: "التعرف على الأعراض والبحث", en: "Symptom recognition & search" },
        sla: { ar: "مُعتمد على وتيرة المستفيد", en: "Customer-paced" },
        sentiment: "confused",
        emotionScore: -1,
        touchpoints: [
          { id: id(), label: { ar: "بوابة موعد", en: "Mawid portal" } },
          { id: id(), label: { ar: "محرّك بحث", en: "Web search" } },
          { id: id(), label: { ar: "صحة 937", en: "Seha 937 hotline" } },
        ],
        actions: [
          { id: id(), label: { ar: "وصف الأعراض", en: "Describes symptoms" } },
          { id: id(), label: { ar: "البحث عن أقرب منشأة", en: "Looks up nearest facility" } },
          { id: id(), label: { ar: "مقارنة الخيارات المتاحة", en: "Compares available options" } },
        ],
        entities: [
          { id: id(), label: { ar: "وزارة الصحة", en: "Ministry of Health" } },
          { id: id(), label: { ar: "مركز اتصال صحة", en: "Seha contact centre" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "فرز ذكي للأعراض داخل التطبيق", en: "In-app smart symptom triage" } },
          { id: id(), label: { ar: "اقتراح آلي لنوع التخصص", en: "Auto-suggest specialty type" } },
        ],
      },
      {
        id: id(),
        icon: "ShieldCheck",
        name: { ar: "التحقق عبر نفاذ", en: "Authentication via Nafath" },
        sla: { ar: "فوري", en: "Instant" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [
          { id: id(), label: { ar: "تطبيق موعد", en: "Mawid app" } },
          { id: id(), label: { ar: "نفاذ", en: "Nafath" } },
        ],
        actions: [
          { id: id(), label: { ar: "تأكيد طلب الدخول", en: "Confirms login request" } },
          { id: id(), label: { ar: "إدخال رقم الموبايل", en: "Enters mobile number" } },
        ],
        entities: [
          { id: id(), label: { ar: "هيئة الحكومة الرقمية", en: "Digital Government Authority" } },
          { id: id(), label: { ar: "وزارة الصحة", en: "Ministry of Health" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "تسجيل دخول بيومتري", en: "Biometric sign-in option" } },
        ],
      },
      {
        id: id(),
        icon: "CalendarSearch",
        name: { ar: "اختيار المنشأة والموعد", en: "Choose facility & slot" },
        sla: { ar: "مُعتمد على وتيرة المستفيد", en: "Customer-paced" },
        sentiment: "satisfied",
        emotionScore: 1,
        touchpoints: [
          { id: id(), label: { ar: "تطبيق موعد", en: "Mawid app" } },
          { id: id(), label: { ar: "خرائط نقاط الرعاية", en: "Care-point map" } },
        ],
        actions: [
          { id: id(), label: { ar: "اختيار المركز الصحي", en: "Selects health centre" } },
          { id: id(), label: { ar: "تحديد التاريخ والساعة", en: "Picks date and time" } },
          { id: id(), label: { ar: "مراجعة بيانات الطبيب", en: "Reviews physician info" } },
        ],
        entities: [
          { id: id(), label: { ar: "تجمّع صحي إقليمي", en: "Regional health cluster" } },
          { id: id(), label: { ar: "المركز الصحي المختار", en: "Selected health centre" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "تنبيه بالأماكن الشاغرة في الوقت الفعلي", en: "Real-time slot availability alerts" } },
          { id: id(), label: { ar: "اقتراح بدائل أقرب وأسرع", en: "Suggest closer / faster alternatives" } },
        ],
      },
      {
        id: id(),
        icon: "BellRing",
        name: { ar: "التأكيد والتذكيرات", en: "Confirmation & reminders" },
        sla: { ar: "فوري", en: "Instant" },
        sentiment: "delighted",
        emotionScore: 2,
        touchpoints: [
          { id: id(), label: { ar: "رسالة نصية", en: "SMS" } },
          { id: id(), label: { ar: "إشعار تطبيق", en: "Push notification" } },
          { id: id(), label: { ar: "بريد إلكتروني", en: "Email" } },
        ],
        actions: [
          { id: id(), label: { ar: "حفظ الموعد في التقويم", en: "Saves appointment to calendar" } },
          { id: id(), label: { ar: "مشاركة الموعد مع المرافق", en: "Shares with companion" } },
        ],
        entities: [
          { id: id(), label: { ar: "منصة الإشعارات الحكومية", en: "Government notification platform" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "تذكير ذكي قبل الموعد بساعة", en: "Smart 1-hour reminder" } },
        ],
      },
      {
        id: id(),
        icon: "ClipboardList",
        name: { ar: "التحضير قبل الزيارة", en: "Pre-visit preparation" },
        sla: { ar: "١ إلى ٣ أيام", en: "1 to 3 days" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [
          { id: id(), label: { ar: "تطبيق صحتي", en: "Sehhaty app" } },
          { id: id(), label: { ar: "روابط معرفية", en: "KB articles" } },
        ],
        actions: [
          { id: id(), label: { ar: "قراءة تعليمات الصيام أو التحضير", en: "Reads fasting / prep guidance" } },
          { id: id(), label: { ar: "تحميل الوصفات السابقة", en: "Uploads previous prescriptions" } },
        ],
        entities: [
          { id: id(), label: { ar: "وزارة الصحة", en: "Ministry of Health" } },
          { id: id(), label: { ar: "المنشأة الصحية", en: "Healthcare facility" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "قائمة تحضير مخصصة حسب نوع الزيارة", en: "Visit-type specific prep checklist" } },
        ],
      },
      {
        id: id(),
        icon: "HeartPulse",
        name: { ar: "إتمام الزيارة واستبيان المتابعة", en: "Visit completion & follow-up survey" },
        sla: { ar: "نفس اليوم", en: "Same day" },
        sentiment: "satisfied",
        emotionScore: 1,
        touchpoints: [
          { id: id(), label: { ar: "زيارة فعلية", en: "In-person visit" } },
          { id: id(), label: { ar: "استبيان رضا", en: "CSAT survey" } },
          { id: id(), label: { ar: "ملف صحتي", en: "Sehhaty file" } },
        ],
        actions: [
          { id: id(), label: { ar: "إتمام الفحص", en: "Completes consultation" } },
          { id: id(), label: { ar: "استلام الوصفة الطبية", en: "Receives prescription" } },
          { id: id(), label: { ar: "تعبئة استبيان رضا قصير", en: "Fills short CSAT survey" } },
        ],
        entities: [
          { id: id(), label: { ar: "الطبيب المعالج", en: "Treating physician" } },
          { id: id(), label: { ar: "وحدة الجودة بالمنشأة", en: "Facility quality unit" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "حلقة مغلقة فورية للحالات السلبية", en: "Instant closed-loop for negative survey" } },
          { id: id(), label: { ar: "ربط الوصفة بالصيدلية المنزلية", en: "Link prescription to home pharmacy" } },
        ],
      },
    ],
  },

  // ---------- 2. Driver License Renewal ----------
  {
    id: "j-license",
    icon: "Car",
    title: { ar: "رحلة تجديد رخصة القيادة", en: "Driver License Renewal Journey" },
    subtitle: {
      ar: "تجديد رخصة قيادة سارية أو منتهية الصلاحية",
      en: "Renew a valid or expired driver license end-to-end",
    },
    owner: { ar: "الإدارة العامة للمرور", en: "General Department of Traffic" },
    types: [
      { ar: "تجديد إلكتروني", en: "Online renewal" },
      { ar: "تجديد بزيارة المرور", en: "In-person renewal" },
      { ar: "تجديد مع مخالفات", en: "Renewal with violations" },
    ],
    outcomes: [
      { ar: "تم التجديد", en: "Renewed" },
      { ar: "بحاجة إلى سداد مخالفات", en: "Violation settlement required" },
      { ar: "رفض لعدم اللياقة الطبية", en: "Rejected — medical fitness" },
    ],
    stages: [
      {
        id: id(),
        icon: "ListChecks",
        name: { ar: "التحقق من الأهلية", en: "Eligibility check" },
        sla: { ar: "فوري", en: "Instant" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [
          { id: id(), label: { ar: "تطبيق أبشر أفراد", en: "Absher Individuals app" } },
          { id: id(), label: { ar: "بوابة المرور", en: "Traffic portal" } },
        ],
        actions: [
          { id: id(), label: { ar: "اختيار خدمة تجديد رخصة القيادة", en: "Selects renewal service" } },
          { id: id(), label: { ar: "مراجعة المتطلبات", en: "Reviews requirements" } },
        ],
        entities: [
          { id: id(), label: { ar: "الإدارة العامة للمرور", en: "General Department of Traffic" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "تنبيه استباقي قبل ٩٠ يوماً من الانتهاء", en: "Proactive 90-day pre-expiry alert" } },
        ],
      },
      {
        id: id(),
        icon: "ShieldCheck",
        name: { ar: "التحقق عبر نفاذ", en: "Authentication via Nafath" },
        sla: { ar: "فوري", en: "Instant" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [
          { id: id(), label: { ar: "نفاذ", en: "Nafath" } },
          { id: id(), label: { ar: "أبشر", en: "Absher" } },
        ],
        actions: [
          { id: id(), label: { ar: "الموافقة على طلب الدخول", en: "Approves sign-in request" } },
        ],
        entities: [
          { id: id(), label: { ar: "هيئة الحكومة الرقمية", en: "Digital Government Authority" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "تكامل بصمة الوجه عبر توكلنا", en: "Face-ID integration via Tawakkalna" } },
        ],
      },
      {
        id: id(),
        icon: "Wallet",
        name: { ar: "دفع الرسوم", en: "Fee payment" },
        sla: { ar: "فوري", en: "Instant" },
        sentiment: "satisfied",
        emotionScore: 1,
        touchpoints: [
          { id: id(), label: { ar: "سداد", en: "SADAD" } },
          { id: id(), label: { ar: "مدى", en: "Mada" } },
          { id: id(), label: { ar: "أبل باي", en: "Apple Pay" } },
        ],
        actions: [
          { id: id(), label: { ar: "اختيار وسيلة الدفع", en: "Picks payment method" } },
          { id: id(), label: { ar: "تأكيد عملية السداد", en: "Confirms payment" } },
        ],
        entities: [
          { id: id(), label: { ar: "البنك المركزي السعودي", en: "Saudi Central Bank" } },
          { id: id(), label: { ar: "الإدارة العامة للمرور", en: "General Department of Traffic" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "حفظ بطاقة افتراضية للتجديدات المستقبلية", en: "Save default card for future renewals" } },
        ],
      },
      {
        id: id(),
        icon: "Activity",
        name: { ar: "التحقق من اللياقة الطبية", en: "Medical fitness verification" },
        sla: { ar: "يوم عمل واحد", en: "1 work day" },
        sentiment: "confused",
        emotionScore: -1,
        touchpoints: [
          { id: id(), label: { ar: "مركز فحص طبي معتمد", en: "Accredited medical centre" } },
          { id: id(), label: { ar: "ربط آلي بأبشر", en: "Auto-link to Absher" } },
        ],
        actions: [
          { id: id(), label: { ar: "زيارة مركز الفحص", en: "Visits medical centre" } },
          { id: id(), label: { ar: "اجتياز فحص النظر", en: "Completes vision test" } },
        ],
        entities: [
          { id: id(), label: { ar: "وزارة الصحة", en: "Ministry of Health" } },
          { id: id(), label: { ar: "المركز الطبي المعتمد", en: "Accredited centre" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "كشف لياقة عن بُعد بالكاميرا", en: "Remote camera-based vision check" } },
          { id: id(), label: { ar: "حجز موعد فحص داخل نفس التدفق", en: "Book medical slot in same flow" } },
        ],
      },
      {
        id: id(),
        icon: "BadgeCheck",
        name: { ar: "إصدار الرخصة وتسليمها", en: "License issuance & delivery" },
        sla: { ar: "ثلاثة أيام عمل", en: "3 work days" },
        sentiment: "delighted",
        emotionScore: 2,
        touchpoints: [
          { id: id(), label: { ar: "رخصة رقمية في توكلنا", en: "Digital license in Tawakkalna" } },
          { id: id(), label: { ar: "البريد السعودي سبل", en: "Saudi Post — SPL" } },
        ],
        actions: [
          { id: id(), label: { ar: "استعراض الرخصة الرقمية", en: "Views digital license" } },
          { id: id(), label: { ar: "متابعة شحن النسخة الفعلية", en: "Tracks physical card shipment" } },
        ],
        entities: [
          { id: id(), label: { ar: "الإدارة العامة للمرور", en: "General Department of Traffic" } },
          { id: id(), label: { ar: "البريد السعودي", en: "Saudi Post" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "خيار الاستلام الفوري من المراكز", en: "Same-day pickup from service centres" } },
        ],
      },
    ],
  },

  // ---------- 3. Business Registration ----------
  {
    id: "j-business",
    icon: "Building2",
    title: { ar: "رحلة تأسيس المنشأة التجارية", en: "Business Registration Journey" },
    subtitle: {
      ar: "من حجز الاسم التجاري إلى الرخصة التشغيلية",
      en: "From trade name reservation to operating license",
    },
    owner: { ar: "وزارة التجارة", en: "Ministry of Commerce" },
    types: [
      { ar: "مؤسسة فردية", en: "Sole proprietorship" },
      { ar: "شركة ذات مسؤولية محدودة", en: "LLC" },
      { ar: "فرع لشركة أجنبية", en: "Foreign subsidiary" },
    ],
    outcomes: [
      { ar: "سجل تجاري صادر", en: "Registration issued" },
      { ar: "بحاجة إلى مستندات إضافية", en: "Additional documents required" },
      { ar: "رفض الطلب", en: "Application rejected" },
    ],
    stages: [
      {
        id: id(),
        icon: "Tag",
        name: { ar: "حجز الاسم التجاري", en: "Trade name reservation" },
        sla: { ar: "فوري", en: "Instant" },
        sentiment: "satisfied",
        emotionScore: 1,
        touchpoints: [
          { id: id(), label: { ar: "منصة وزارة التجارة", en: "Ministry of Commerce portal" } },
        ],
        actions: [
          { id: id(), label: { ar: "اقتراح أسماء بديلة", en: "Proposes alternative names" } },
          { id: id(), label: { ar: "اختيار النشاط الرئيسي", en: "Picks primary activity" } },
        ],
        entities: [
          { id: id(), label: { ar: "وزارة التجارة", en: "Ministry of Commerce" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "فحص ذكي للأسماء المتاحة لحظياً", en: "Real-time AI name availability check" } },
        ],
      },
      {
        id: id(),
        icon: "FileText",
        name: { ar: "صياغة عقد التأسيس", en: "Articles of association" },
        sla: { ar: "يومان عمل", en: "2 work days" },
        sentiment: "confused",
        emotionScore: -1,
        touchpoints: [
          { id: id(), label: { ar: "نموذج إلكتروني", en: "Online builder" } },
          { id: id(), label: { ar: "محامٍ معتمد (اختياري)", en: "Authorised lawyer (optional)" } },
        ],
        actions: [
          { id: id(), label: { ar: "إدخال بيانات الشركاء", en: "Enters partner details" } },
          { id: id(), label: { ar: "تحديد رأس المال وحصص الشركاء", en: "Sets capital and shares" } },
        ],
        entities: [
          { id: id(), label: { ar: "وزارة التجارة", en: "Ministry of Commerce" } },
          { id: id(), label: { ar: "هيئة المحامين السعودية", en: "Saudi Bar Association" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "قوالب جاهزة لكل نوع نشاط", en: "Activity-specific document templates" } },
          { id: id(), label: { ar: "مساعد ذكي لمراجعة البنود", en: "AI clause review assistant" } },
        ],
      },
      {
        id: id(),
        icon: "Stamp",
        name: { ar: "التوثيق الإلكتروني", en: "Electronic authentication" },
        sla: { ar: "نفس اليوم", en: "Same day" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [
          { id: id(), label: { ar: "بوابة التوثيق", en: "Authentication portal" } },
          { id: id(), label: { ar: "نفاذ لكافة الشركاء", en: "Nafath for all partners" } },
        ],
        actions: [
          { id: id(), label: { ar: "توقيع رقمي من كل الشركاء", en: "Digital signature by all partners" } },
        ],
        entities: [
          { id: id(), label: { ar: "وزارة العدل", en: "Ministry of Justice" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "تتبع توقيعات الشركاء في الوقت الفعلي", en: "Real-time partner signature tracking" } },
        ],
      },
      {
        id: id(),
        icon: "Banknote",
        name: { ar: "إيداع رأس المال", en: "Capital deposit" },
        sla: { ar: "يوم عمل واحد", en: "1 work day" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [
          { id: id(), label: { ar: "بنك تجاري معتمد", en: "Authorised commercial bank" } },
          { id: id(), label: { ar: "خطاب البنك", en: "Bank confirmation letter" } },
        ],
        actions: [
          { id: id(), label: { ar: "فتح حساب بنكي للشركة", en: "Opens corporate bank account" } },
          { id: id(), label: { ar: "تحويل رأس المال المطلوب", en: "Deposits required capital" } },
        ],
        entities: [
          { id: id(), label: { ar: "البنك المركزي السعودي", en: "Saudi Central Bank" } },
          { id: id(), label: { ar: "البنك التجاري", en: "Commercial bank" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "ربط فوري بحساب البنك إلكترونياً", en: "Instant electronic bank linkage" } },
        ],
      },
      {
        id: id(),
        icon: "ScrollText",
        name: { ar: "إصدار السجل التجاري", en: "Commercial registration" },
        sla: { ar: "يوم عمل واحد", en: "1 work day" },
        sentiment: "delighted",
        emotionScore: 2,
        touchpoints: [
          { id: id(), label: { ar: "وزارة التجارة", en: "Ministry of Commerce" } },
          { id: id(), label: { ar: "إشعار في تطبيق المنشأة", en: "Establishment app notification" } },
        ],
        actions: [
          { id: id(), label: { ar: "تنزيل السجل التجاري", en: "Downloads CR certificate" } },
        ],
        entities: [
          { id: id(), label: { ar: "وزارة التجارة", en: "Ministry of Commerce" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "إصدار رقم السجل خلال دقائق", en: "CR number issued within minutes" } },
        ],
      },
      {
        id: id(),
        icon: "Users",
        name: { ar: "التسجيل في الغرفة التجارية", en: "Chamber of commerce registration" },
        sla: { ar: "يوم عمل واحد", en: "1 work day" },
        sentiment: "satisfied",
        emotionScore: 1,
        touchpoints: [
          { id: id(), label: { ar: "بوابة اتحاد الغرف السعودية", en: "Saudi Chambers Federation portal" } },
        ],
        actions: [
          { id: id(), label: { ar: "اختيار فئة العضوية", en: "Selects membership tier" } },
          { id: id(), label: { ar: "سداد رسوم العضوية", en: "Pays membership fee" } },
        ],
        entities: [
          { id: id(), label: { ar: "اتحاد الغرف السعودية", en: "Federation of Saudi Chambers" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "تسجيل تلقائي بناءً على نوع النشاط", en: "Auto-enroll by activity type" } },
        ],
      },
      {
        id: id(),
        icon: "Building",
        name: { ar: "إصدار الرخصة التشغيلية", en: "Operating license" },
        sla: { ar: "خمسة أيام عمل", en: "5 work days" },
        sentiment: "satisfied",
        emotionScore: 1,
        touchpoints: [
          { id: id(), label: { ar: "أمانة المنطقة", en: "Municipality" } },
          { id: id(), label: { ar: "بلدي", en: "Balady platform" } },
        ],
        actions: [
          { id: id(), label: { ar: "رفع مخطط الموقع", en: "Uploads site plan" } },
          { id: id(), label: { ar: "حجز موعد كشف ميداني", en: "Books site inspection" } },
        ],
        entities: [
          { id: id(), label: { ar: "وزارة الشؤون البلدية", en: "Ministry of Municipal Affairs" } },
          { id: id(), label: { ar: "الدفاع المدني", en: "Civil Defense" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "كشف افتراضي بالفيديو للنشاطات منخفضة المخاطر", en: "Virtual video inspection for low-risk activities" } },
        ],
      },
    ],
  },

  // ---------- 4. Citizen Complaint Resolution ----------
  {
    id: "j-complaint",
    icon: "MessageSquareWarning",
    title: { ar: "رحلة معالجة شكوى المستفيد", en: "Citizen Complaint Resolution Journey" },
    subtitle: {
      ar: "من تقديم الشكوى إلى الإغلاق المعرفي والتعلّم المؤسسي",
      en: "From submission through resolution to closed-loop learning",
    },
    owner: { ar: "منصة تجربة المستفيد · حكومي", en: "CX Platform · cross-government" },
    types: [
      { ar: "شكوى متعلقة بالخدمة", en: "Service-related" },
      { ar: "شكوى متعلقة بالجودة", en: "Quality-related" },
      { ar: "شكوى متعلقة بالموظف", en: "Staff-related" },
    ],
    outcomes: [
      { ar: "تم الحل", en: "Resolved" },
      { ar: "مُصعّدة", en: "Escalated" },
      { ar: "مغلقة بدون حل", en: "Closed without resolution" },
    ],
    stages: [
      {
        id: id(),
        icon: "MessageSquarePlus",
        name: { ar: "تقديم الشكوى", en: "Submission" },
        sla: { ar: "مُعتمد على المستفيد", en: "Customer-paced" },
        sentiment: "frustrated",
        emotionScore: -2,
        touchpoints: [
          { id: id(), label: { ar: "بوابة المستفيد", en: "Citizen portal" } },
          { id: id(), label: { ar: "واتساب الجهة", en: "WhatsApp channel" } },
          { id: id(), label: { ar: "تطبيق الجوال", en: "Mobile app" } },
        ],
        actions: [
          { id: id(), label: { ar: "كتابة وصف المشكلة", en: "Describes the issue" } },
          { id: id(), label: { ar: "إرفاق صور أو وثائق", en: "Attaches photos / docs" } },
        ],
        entities: [
          { id: id(), label: { ar: "وحدة استقبال الشكاوى", en: "Complaints intake unit" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "نموذج ذكي يقترح الفئة تلقائياً", en: "AI auto-categorisation form" } },
          { id: id(), label: { ar: "كشف العاطفة عند الكتابة", en: "Sentiment cue while typing" } },
        ],
      },
      {
        id: id(),
        icon: "MailCheck",
        name: { ar: "إقرار الاستلام", en: "Acknowledgement" },
        sla: { ar: "خلال ١٥ دقيقة", en: "Within 15 minutes" },
        sentiment: "confused",
        emotionScore: -1,
        touchpoints: [
          { id: id(), label: { ar: "رسالة نصية", en: "SMS" } },
          { id: id(), label: { ar: "إشعار البوابة", en: "Portal notification" } },
        ],
        actions: [
          { id: id(), label: { ar: "استلام رقم المرجع", en: "Receives reference number" } },
          { id: id(), label: { ar: "تأكيد تفاصيل التواصل", en: "Confirms contact details" } },
        ],
        entities: [
          { id: id(), label: { ar: "منصة الشكاوى المركزية", en: "Central complaints platform" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "إقرار صوتي شخصي بدلاً من نص آلي", en: "Personalised voice acknowledgement" } },
        ],
      },
      {
        id: id(),
        icon: "SearchCheck",
        name: { ar: "التحقيق", en: "Investigation" },
        sla: { ar: "ثلاثة أيام عمل", en: "3 work days" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [
          { id: id(), label: { ar: "اتصال هاتفي", en: "Phone call" } },
          { id: id(), label: { ar: "بريد متابعة", en: "Follow-up email" } },
        ],
        actions: [
          { id: id(), label: { ar: "الرد على استفسارات الباحث", en: "Responds to investigator queries" } },
          { id: id(), label: { ar: "تقديم مستندات إضافية", en: "Provides extra documentation" } },
        ],
        entities: [
          { id: id(), label: { ar: "الإدارة المعنية", en: "Responsible department" } },
          { id: id(), label: { ar: "وحدة الجودة", en: "Quality unit" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "نقاط مرئية لمسار التقدم", en: "Visible progress milestones" } },
        ],
      },
      {
        id: id(),
        icon: "Lightbulb",
        name: { ar: "اقتراح الحل", en: "Resolution proposal" },
        sla: { ar: "خمسة أيام عمل", en: "5 work days" },
        sentiment: "satisfied",
        emotionScore: 1,
        touchpoints: [
          { id: id(), label: { ar: "بوابة المستفيد", en: "Citizen portal" } },
          { id: id(), label: { ar: "اتصال هاتفي", en: "Phone call" } },
        ],
        actions: [
          { id: id(), label: { ar: "مراجعة الحل المقترح", en: "Reviews proposed solution" } },
          { id: id(), label: { ar: "الموافقة أو طلب إعادة النظر", en: "Approves or requests review" } },
        ],
        entities: [
          { id: id(), label: { ar: "مسؤول الحالة", en: "Case owner" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "خيارات حل متعددة للاختيار", en: "Multiple resolution options to pick from" } },
        ],
      },
      {
        id: id(),
        icon: "Smile",
        name: { ar: "رأي المستفيد بعد الحل", en: "Customer feedback" },
        sla: { ar: "يوم عمل واحد", en: "1 work day" },
        sentiment: "satisfied",
        emotionScore: 1,
        touchpoints: [
          { id: id(), label: { ar: "استبيان قصير", en: "Micro-survey" } },
          { id: id(), label: { ar: "رسالة نصية", en: "SMS" } },
        ],
        actions: [
          { id: id(), label: { ar: "تقييم التجربة", en: "Rates experience" } },
          { id: id(), label: { ar: "كتابة ملاحظة حرة", en: "Leaves free-text feedback" } },
        ],
        entities: [
          { id: id(), label: { ar: "وحدة صوت المستفيد", en: "Voice-of-Customer team" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "استبيان متكيف حسب نوع الحالة", en: "Case-type adaptive survey" } },
        ],
      },
      {
        id: id(),
        icon: "BookOpen",
        name: { ar: "الإغلاق والتعلم المؤسسي", en: "Closure & learning" },
        sla: { ar: "أسبوع عمل", en: "1 work week" },
        sentiment: "delighted",
        emotionScore: 2,
        touchpoints: [
          { id: id(), label: { ar: "قاعدة المعرفة الداخلية", en: "Internal knowledge base" } },
          { id: id(), label: { ar: "لقاء استعراض الجودة", en: "Quality review meeting" } },
        ],
        actions: [
          { id: id(), label: { ar: "إغلاق الحالة في المنصة", en: "Closes case in platform" } },
        ],
        entities: [
          { id: id(), label: { ar: "وحدة الجودة", en: "Quality unit" } },
          { id: id(), label: { ar: "إدارة التحسين المستمر", en: "Continuous improvement office" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "ربط الحالة بمقالات معرفية تلقائياً", en: "Auto-link case to KB articles" } },
          { id: id(), label: { ar: "تحويل الأنماط المتكررة إلى تحسينات منهجية", en: "Convert recurring patterns into systemic fixes" } },
        ],
      },
    ],
  },

  // ---------- 5. School Enrollment ----------
  {
    id: "j-school",
    icon: "GraduationCap",
    title: { ar: "رحلة تسجيل الطالب في المدرسة", en: "School Enrollment Journey" },
    subtitle: {
      ar: "من فحص الأهلية حتى اليوم الأول للطالب",
      en: "From eligibility check to the student's first day",
    },
    owner: { ar: "وزارة التعليم", en: "Ministry of Education" },
    types: [
      { ar: "مدرسة حكومية", en: "Public school" },
      { ar: "مدرسة أهلية", en: "Private school" },
      { ar: "مدرسة عالمية", en: "International school" },
      { ar: "تحويل بين المدارس", en: "Transfer" },
    ],
    outcomes: [
      { ar: "تم القبول", en: "Accepted" },
      { ar: "قائمة الانتظار", en: "Waitlisted" },
      { ar: "تحويل إلى مدرسة أخرى", en: "Redirected" },
    ],
    stages: [
      {
        id: id(),
        icon: "MapPin",
        name: { ar: "فحص الأهلية والنطاق الجغرافي", en: "Eligibility & catchment check" },
        sla: { ar: "فوري", en: "Instant" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [
          { id: id(), label: { ar: "نظام نور", en: "Noor system" } },
          { id: id(), label: { ar: "تطبيق توكلنا", en: "Tawakkalna" } },
        ],
        actions: [
          { id: id(), label: { ar: "إدخال عنوان السكن الوطني", en: "Enters national address" } },
          { id: id(), label: { ar: "اختيار المرحلة الدراسية", en: "Picks grade level" } },
        ],
        entities: [
          { id: id(), label: { ar: "وزارة التعليم", en: "Ministry of Education" } },
          { id: id(), label: { ar: "العنوان الوطني", en: "National Address" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "خريطة تفاعلية للمدارس المتاحة", en: "Interactive map of available schools" } },
        ],
      },
      {
        id: id(),
        icon: "Upload",
        name: { ar: "رفع المستندات", en: "Document upload" },
        sla: { ar: "مُعتمد على ولي الأمر", en: "Parent-paced" },
        sentiment: "confused",
        emotionScore: -1,
        touchpoints: [
          { id: id(), label: { ar: "نظام نور", en: "Noor system" } },
          { id: id(), label: { ar: "أبشر أفراد", en: "Absher Individuals" } },
        ],
        actions: [
          { id: id(), label: { ar: "رفع شهادات سابقة", en: "Uploads previous certificates" } },
          { id: id(), label: { ar: "رفع تقرير صحي", en: "Uploads health report" } },
        ],
        entities: [
          { id: id(), label: { ar: "وزارة التعليم", en: "Ministry of Education" } },
          { id: id(), label: { ar: "وزارة الصحة", en: "Ministry of Health" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "جلب الوثائق آلياً من الجهات الحكومية", en: "Auto-fetch documents from government sources" } },
        ],
      },
      {
        id: id(),
        icon: "Shuffle",
        name: { ar: "الاختيار والمطابقة", en: "Selection & matching" },
        sla: { ar: "ثلاثة أيام عمل", en: "3 work days" },
        sentiment: "neutral",
        emotionScore: 0,
        touchpoints: [
          { id: id(), label: { ar: "خوارزمية المطابقة", en: "Matching algorithm" } },
          { id: id(), label: { ar: "ترشيح الإدارة التعليمية", en: "Education directorate review" } },
        ],
        actions: [
          { id: id(), label: { ar: "متابعة حالة الطلب", en: "Monitors application status" } },
          { id: id(), label: { ar: "ترتيب الخيارات حسب الأفضلية", en: "Ranks preferred schools" } },
        ],
        entities: [
          { id: id(), label: { ar: "الإدارة التعليمية بالمنطقة", en: "Regional education directorate" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "شرح شفاف لكيفية المطابقة", en: "Transparent matching explanation" } },
        ],
      },
      {
        id: id(),
        icon: "BellRing",
        name: { ar: "إشعار القبول", en: "Acceptance notification" },
        sla: { ar: "فوري", en: "Instant" },
        sentiment: "delighted",
        emotionScore: 2,
        touchpoints: [
          { id: id(), label: { ar: "رسالة نصية", en: "SMS" } },
          { id: id(), label: { ar: "إشعار في نظام نور", en: "Noor notification" } },
          { id: id(), label: { ar: "بريد إلكتروني", en: "Email" } },
        ],
        actions: [
          { id: id(), label: { ar: "تأكيد قبول المقعد", en: "Confirms seat acceptance" } },
        ],
        entities: [
          { id: id(), label: { ar: "وزارة التعليم", en: "Ministry of Education" } },
          { id: id(), label: { ar: "المدرسة المُختارة", en: "Assigned school" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "تأكيد بنقرة واحدة من خلال الإشعار", en: "One-tap confirmation from notification" } },
        ],
      },
      {
        id: id(),
        icon: "Package",
        name: { ar: "سداد الرسوم والزي المدرسي", en: "Fees & uniform fulfilment" },
        sla: { ar: "أسبوع عمل", en: "1 work week" },
        sentiment: "satisfied",
        emotionScore: 1,
        touchpoints: [
          { id: id(), label: { ar: "سداد", en: "SADAD" } },
          { id: id(), label: { ar: "موردي الزي المعتمدون", en: "Approved uniform suppliers" } },
        ],
        actions: [
          { id: id(), label: { ar: "اختيار الموردين", en: "Selects supplier" } },
          { id: id(), label: { ar: "سداد الرسوم", en: "Pays fees" } },
        ],
        entities: [
          { id: id(), label: { ar: "وزارة التعليم", en: "Ministry of Education" } },
          { id: id(), label: { ar: "البنوك المحلية", en: "Local banks" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "حزم زي بمقاسات مقترحة آلياً", en: "Auto-sized uniform packages" } },
        ],
      },
      {
        id: id(),
        icon: "Sparkles",
        name: { ar: "ترحيب اليوم الأول", en: "First-day welcome" },
        sla: { ar: "اليوم الأول", en: "Day 1" },
        sentiment: "delighted",
        emotionScore: 2,
        touchpoints: [
          { id: id(), label: { ar: "زيارة فعلية", en: "In-person welcome" } },
          { id: id(), label: { ar: "حقيبة ترحيبية", en: "Welcome kit" } },
        ],
        actions: [
          { id: id(), label: { ar: "الالتحاق بالفصل", en: "Joins the classroom" } },
          { id: id(), label: { ar: "حضور لقاء أولياء الأمور", en: "Attends parent orientation" } },
        ],
        entities: [
          { id: id(), label: { ar: "إدارة المدرسة", en: "School administration" } },
          { id: id(), label: { ar: "مجلس أولياء الأمور", en: "Parent council" } },
        ],
        opportunities: [
          { id: id(), label: { ar: "جولة افتراضية قبل اليوم الأول", en: "Virtual tour before day 1" } },
          { id: id(), label: { ar: "استبيان مزاج بعد أسبوع", en: "1-week mood pulse survey" } },
        ],
      },
    ],
  },
];
