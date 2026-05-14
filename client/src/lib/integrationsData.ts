// Integrations registry seed.
import type { Bi } from "./governanceData";

export type IntegrationStatus = "live" | "in-dev" | "planned" | "deprecated";
export type IntegrationDirection = "inbound" | "outbound" | "bi";

export type Integration = {
  id: string;
  name: Bi;
  category: Bi;
  type: IntegrationDirection;
  protocol: string;
  auth: string;
  owner: Bi;
  status: IntegrationStatus;
  sla: Bi;
  doc: string;
};

export const INTEGRATIONS: Integration[] = [
  // Identity
  { id: "nafath", name: { en: "Nafath National Identity", ar: "نفاذ الهوية الوطنية" }, category: { en: "Identity", ar: "الهوية" }, type: "bi", protocol: "OIDC", auth: "mTLS + client_secret", owner: { en: "IAM Team", ar: "فريق إدارة الهوية" }, status: "live", sla: { en: "99.9% · p95 1.2s", ar: "99.9٪ · p95 1.2 ث" }, doc: "https://nafath.sa" },
  { id: "absher", name: { en: "Absher Citizen Services", ar: "أبشر للخدمات" }, category: { en: "Identity", ar: "الهوية" }, type: "outbound", protocol: "REST", auth: "OAuth2", owner: { en: "IAM Team", ar: "فريق إدارة الهوية" }, status: "live", sla: { en: "99.5% · p95 2s", ar: "99.5٪ · p95 2 ث" }, doc: "https://absher.sa" },
  { id: "mygovsso", name: { en: "GovTech SSO Gateway", ar: "بوابة الدخول الموحد الحكومية" }, category: { en: "Identity", ar: "الهوية" }, type: "bi", protocol: "SAML 2.0", auth: "Signed assertions", owner: { en: "IAM Team", ar: "فريق إدارة الهوية" }, status: "live", sla: { en: "99.95% · p95 800ms", ar: "99.95٪ · p95 800 م.ث" }, doc: "internal" },
  // Payments
  { id: "sadad", name: { en: "SADAD Payment System", ar: "نظام سداد للمدفوعات" }, category: { en: "Payments", ar: "المدفوعات" }, type: "outbound", protocol: "REST", auth: "OAuth2 + mTLS", owner: { en: "Finance Systems", ar: "أنظمة المالية" }, status: "live", sla: { en: "99.7%", ar: "99.7٪" }, doc: "https://sama.gov.sa" },
  { id: "mada", name: { en: "MADA Card Network", ar: "شبكة مدى للبطاقات" }, category: { en: "Payments", ar: "المدفوعات" }, type: "outbound", protocol: "ISO 8583 / REST", auth: "mTLS", owner: { en: "Finance Systems", ar: "أنظمة المالية" }, status: "live", sla: { en: "99.9%", ar: "99.9٪" }, doc: "https://sama.gov.sa" },
  { id: "stcpay", name: { en: "STC Pay Wallet", ar: "محفظة STC Pay" }, category: { en: "Payments", ar: "المدفوعات" }, type: "outbound", protocol: "REST", auth: "OAuth2", owner: { en: "Finance Systems", ar: "أنظمة المالية" }, status: "in-dev", sla: { en: "TBD", ar: "قيد التحديد" }, doc: "https://stcpay.com.sa" },
  // Communications
  { id: "twilio-sms", name: { en: "SMS Gateway (Unifonic)", ar: "بوابة الرسائل النصية (يونيفونك)" }, category: { en: "Communications", ar: "الاتصالات" }, type: "bi", protocol: "REST + webhooks", auth: "API key + IP allowlist", owner: { en: "Comms Platform", ar: "منصة الاتصالات" }, status: "live", sla: { en: "99.5% delivery", ar: "99.5٪ تسليم" }, doc: "https://unifonic.com" },
  { id: "whatsapp", name: { en: "WhatsApp Business API (BSP)", ar: "واجهة واتساب للأعمال" }, category: { en: "Communications", ar: "الاتصالات" }, type: "bi", protocol: "REST + webhooks", auth: "OAuth2", owner: { en: "Comms Platform", ar: "منصة الاتصالات" }, status: "live", sla: { en: "99.7%", ar: "99.7٪" }, doc: "https://business.whatsapp.com" },
  { id: "email", name: { en: "Enterprise Email Gateway", ar: "بوابة البريد المؤسسي" }, category: { en: "Communications", ar: "الاتصالات" }, type: "bi", protocol: "SMTP + IMAP/Graph", auth: "OAuth2", owner: { en: "Comms Platform", ar: "منصة الاتصالات" }, status: "live", sla: { en: "99.9%", ar: "99.9٪" }, doc: "internal" },
  { id: "x", name: { en: "X (Twitter) Social Listening", ar: "إكس (تويتر) لمتابعة الإشارات" }, category: { en: "Communications", ar: "الاتصالات" }, type: "inbound", protocol: "Streaming API", auth: "OAuth2", owner: { en: "Social Team", ar: "فريق وسائل التواصل" }, status: "live", sla: { en: "Best effort", ar: "أفضل جهد" }, doc: "https://developer.x.com" },
  // Health
  { id: "sehhaty", name: { en: "Sehhaty Health Records", ar: "صحتي للسجلات الصحية" }, category: { en: "Health", ar: "الصحة" }, type: "outbound", protocol: "FHIR R4", auth: "OAuth2 + scopes", owner: { en: "Health Integrations", ar: "تكاملات الصحة" }, status: "live", sla: { en: "99.5%", ar: "99.5٪" }, doc: "https://sehhaty.sa" },
  { id: "mawid", name: { en: "Mawid Appointments", ar: "موعد للحجوزات" }, category: { en: "Health", ar: "الصحة" }, type: "bi", protocol: "REST", auth: "OAuth2", owner: { en: "Health Integrations", ar: "تكاملات الصحة" }, status: "live", sla: { en: "99.0%", ar: "99.0٪" }, doc: "https://mawid.sa" },
  // Civic
  { id: "tawakkalna", name: { en: "Tawakkalna Civic Services", ar: "توكلنا للخدمات" }, category: { en: "Civic", ar: "خدمات حكومية" }, type: "outbound", protocol: "REST", auth: "OAuth2", owner: { en: "GovTech", ar: "التحول الحكومي" }, status: "live", sla: { en: "99.5%", ar: "99.5٪" }, doc: "https://tawakkalna.sdaia.gov.sa" },
  { id: "etimad", name: { en: "Etimad Procurement", ar: "اعتماد للمشتريات" }, category: { en: "Civic", ar: "خدمات حكومية" }, type: "outbound", protocol: "SOAP / REST", auth: "mTLS", owner: { en: "Procurement", ar: "المشتريات" }, status: "live", sla: { en: "99.0%", ar: "99.0٪" }, doc: "https://etimad.sa" },
  { id: "yakeen", name: { en: "Yakeen Identity Verification", ar: "يقين للتحقق من الهوية" }, category: { en: "Civic", ar: "خدمات حكومية" }, type: "outbound", protocol: "SOAP", auth: "mTLS", owner: { en: "IAM Team", ar: "فريق إدارة الهوية" }, status: "live", sla: { en: "99.7%", ar: "99.7٪" }, doc: "https://yakeen.sa" },
  // Internal
  { id: "crm", name: { en: "Enterprise CRM (Dynamics 365)", ar: "نظام إدارة العلاقات المؤسسي" }, category: { en: "Internal", ar: "أنظمة داخلية" }, type: "bi", protocol: "REST + OData", auth: "OAuth2", owner: { en: "IT Apps", ar: "تطبيقات تقنية المعلومات" }, status: "live", sla: { en: "99.9%", ar: "99.9٪" }, doc: "internal" },
  { id: "erp", name: { en: "Enterprise ERP (Oracle Fusion)", ar: "نظام تخطيط الموارد المؤسسي" }, category: { en: "Internal", ar: "أنظمة داخلية" }, type: "outbound", protocol: "REST + Events", auth: "OAuth2", owner: { en: "IT Apps", ar: "تطبيقات تقنية المعلومات" }, status: "live", sla: { en: "99.5%", ar: "99.5٪" }, doc: "internal" },
  { id: "dwh", name: { en: "Data Warehouse / Lakehouse", ar: "مستودع البيانات" }, category: { en: "Internal", ar: "أنظمة داخلية" }, type: "outbound", protocol: "Kafka + ODBC", auth: "Kerberos / SCRAM", owner: { en: "Data Platform", ar: "منصة البيانات" }, status: "live", sla: { en: "Daily SLAs", ar: "اتفاقيات يومية" }, doc: "internal" },
  { id: "idp", name: { en: "Internal Identity Provider", ar: "موفر الهوية الداخلي" }, category: { en: "Internal", ar: "أنظمة داخلية" }, type: "bi", protocol: "OIDC + SCIM", auth: "OIDC", owner: { en: "IAM Team", ar: "فريق إدارة الهوية" }, status: "live", sla: { en: "99.95%", ar: "99.95٪" }, doc: "internal" },
  { id: "siem", name: { en: "Security SIEM (Splunk)", ar: "نظام إدارة الأمن والأحداث" }, category: { en: "Internal", ar: "أنظمة داخلية" }, type: "outbound", protocol: "Syslog + HEC", auth: "Token", owner: { en: "SecOps", ar: "عمليات الأمن" }, status: "live", sla: { en: "Real-time", ar: "آني" }, doc: "internal" },
  // AI
  { id: "llm", name: { en: "Enterprise LLM Provider", ar: "موفر النموذج اللغوي المؤسسي" }, category: { en: "AI", ar: "ذكاء اصطناعي" }, type: "outbound", protocol: "REST (streaming)", auth: "API key + private link", owner: { en: "AI Platform", ar: "منصة الذكاء الاصطناعي" }, status: "live", sla: { en: "99.5% · p95 4s", ar: "99.5٪ · p95 4 ث" }, doc: "internal" },
  { id: "translate", name: { en: "AR ↔ EN Translation Service", ar: "خدمة الترجمة العربية الإنجليزية" }, category: { en: "AI", ar: "ذكاء اصطناعي" }, type: "outbound", protocol: "REST", auth: "API key", owner: { en: "AI Platform", ar: "منصة الذكاء الاصطناعي" }, status: "live", sla: { en: "99.5%", ar: "99.5٪" }, doc: "internal" },
  { id: "sentiment", name: { en: "Sentiment / Emotion Classifier", ar: "مصنّف المشاعر والعواطف" }, category: { en: "AI", ar: "ذكاء اصطناعي" }, type: "outbound", protocol: "REST", auth: "API key", owner: { en: "AI Platform", ar: "منصة الذكاء الاصطناعي" }, status: "live", sla: { en: "99.0%", ar: "99.0٪" }, doc: "internal" },
  { id: "transcribe", name: { en: "Call Transcription (AR/EN)", ar: "تحويل المكالمات إلى نصوص" }, category: { en: "AI", ar: "ذكاء اصطناعي" }, type: "outbound", protocol: "REST + WebSocket", auth: "API key", owner: { en: "AI Platform", ar: "منصة الذكاء الاصطناعي" }, status: "in-dev", sla: { en: "TBD", ar: "قيد التحديد" }, doc: "internal" },
];
