// Non-functional requirements seed.
import type { Bi } from "./governanceData";

export const NFR_HEADLINE: { id: string; label: Bi; value: string; unit: Bi; sub: Bi }[] = [
  { id: "uptime", label: { en: "Production Uptime", ar: "زمن التشغيل" }, value: "99.94", unit: { en: "%", ar: "٪" }, sub: { en: "Target ≥ 99.9% monthly (core)", ar: "المستهدف ≥ 99.9٪ شهرياً (الأساس)" } },
  { id: "rto", label: { en: "Recovery Time (RTO)", ar: "زمن الاستعادة" }, value: "1.5", unit: { en: "hours", ar: "ساعة" }, sub: { en: "Target ≤ 2 hours for critical", ar: "المستهدف ≤ 2 ساعة للحرجة" } },
  { id: "rpo", label: { en: "Recovery Point (RPO)", ar: "نقطة الاستعادة" }, value: "15", unit: { en: "min", ar: "دقيقة" }, sub: { en: "Target ≤ 15 min for critical data", ar: "المستهدف ≤ 15 دقيقة للبيانات الحرجة" } },
  { id: "page", label: { en: "Page Interactive (p95)", ar: "تفاعل الصفحة (p95)" }, value: "1.6", unit: { en: "s", ar: "ث" }, sub: { en: "Target ≤ 2s on broadband", ar: "المستهدف ≤ 2 ث على الإنترنت العريض" } },
  { id: "api", label: { en: "Server Response (p95)", ar: "استجابة الخادم (p95)" }, value: "320", unit: { en: "ms", ar: "م.ث" }, sub: { en: "Target ≤ 500 ms", ar: "المستهدف ≤ 500 م.ث" } },
  { id: "users", label: { en: "Concurrent Agents", ar: "الموظفون المتزامنون" }, value: "12,400", unit: { en: "", ar: "" }, sub: { en: "Target ≥ 10,000", ar: "المستهدف ≥ 10,000" } },
  { id: "sessions", label: { en: "Concurrent Sessions", ar: "الجلسات المتزامنة" }, value: "228K", unit: { en: "", ar: "" }, sub: { en: "Target ≥ 200,000", ar: "المستهدف ≥ 200,000" } },
  { id: "interactions", label: { en: "Annual Interactions", ar: "التفاعلات السنوية" }, value: "52M", unit: { en: "", ar: "" }, sub: { en: "Headroom ≥ 40% over peak", ar: "هامش ≥ 40٪ فوق الذروة" } },
];

export const PERFORMANCE_BUDGET: { area: Bi; budget: Bi; current: Bi; status: "ok" | "warn" | "fail" }[] = [
  { area: { en: "Initial JS bundle", ar: "حزمة JavaScript الأولية" }, budget: { en: "≤ 250 KB gzipped", ar: "≤ 250 ك.ب مضغوط" }, current: { en: "212 KB", ar: "212 ك.ب" }, status: "ok" },
  { area: { en: "Largest Contentful Paint", ar: "أكبر عنصر مرئي" }, budget: { en: "≤ 2.5 s", ar: "≤ 2.5 ث" }, current: { en: "2.1 s", ar: "2.1 ث" }, status: "ok" },
  { area: { en: "Time to Interactive", ar: "زمن التفاعل" }, budget: { en: "≤ 3.5 s", ar: "≤ 3.5 ث" }, current: { en: "3.2 s", ar: "3.2 ث" }, status: "ok" },
  { area: { en: "Cumulative Layout Shift", ar: "التحول التراكمي" }, budget: { en: "≤ 0.1", ar: "≤ 0.1" }, current: { en: "0.04", ar: "0.04" }, status: "ok" },
  { area: { en: "Search API p99 latency", ar: "زمن استجابة البحث p99" }, budget: { en: "≤ 800 ms", ar: "≤ 800 م.ث" }, current: { en: "920 ms", ar: "920 م.ث" }, status: "warn" },
  { area: { en: "Image weight per page", ar: "حجم الصور لكل صفحة" }, budget: { en: "≤ 600 KB", ar: "≤ 600 ك.ب" }, current: { en: "480 KB", ar: "480 ك.ب" }, status: "ok" },
];

export const SECURITY_POSTURE: { control: Bi; standard: string; status: Bi }[] = [
  { control: { en: "Encryption at rest (AES-256, KMS)", ar: "التشفير المخزن (AES-256، KMS)" }, standard: "NCA ECC SEC-006", status: { en: "Active across all stores", ar: "مُفعّل لكل المخازن" } },
  { control: { en: "Encryption in transit (TLS 1.3)", ar: "التشفير أثناء النقل (TLS 1.3)" }, standard: "NCA ECC SEC-005", status: { en: "HSTS + modern ciphers only", ar: "HSTS وتشفير حديث فقط" } },
  { control: { en: "MFA for privileged users", ar: "المصادقة الثنائية للصلاحيات الحساسة" }, standard: "NCA ECC SEC-004", status: { en: "100% enforced", ar: "إلزامي 100٪" } },
  { control: { en: "Immutable audit log (7-yr retention)", ar: "سجل تدقيق غير قابل للتعديل (7 سنوات)" }, standard: "ISO 27001 / PDPL", status: { en: "Tamper-evident + SIEM stream", ar: "مقاوم للتعديل + بث إلى SIEM" } },
  { control: { en: "Vulnerability scan", ar: "فحص الثغرات" }, standard: "NCA ECC SEC-017", status: { en: "Daily SAST/DAST · weekly DAST", ar: "تحليل ساكن يومياً وفحص ديناميكي أسبوعياً" } },
  { control: { en: "Penetration test", ar: "اختبار الاختراق" }, standard: "NCA ECC", status: { en: "Annual external + per major release", ar: "سنوياً + مع كل إطلاق رئيسي" } },
  { control: { en: "Data residency (KSA)", ar: "إقامة البيانات (السعودية)" }, standard: "PDPL", status: { en: "All prod data in approved KSA zone", ar: "كل بيانات الإنتاج في منطقة معتمدة" } },
  { control: { en: "DPIA for new high-risk processing", ar: "تقييم الأثر للخصوصية" }, standard: "PDPL", status: { en: "Mandatory pre-launch gate", ar: "بوابة إلزامية قبل الإطلاق" } },
];

export const WCAG_PRINCIPLES: { id: string; title: Bi; description: Bi; conformance: number }[] = [
  { id: "perceivable", title: { en: "Perceivable", ar: "قابل للإدراك" }, description: { en: "Text alternatives, captions, contrast, AR/EN parity.", ar: "بدائل نصية، ترجمة مصاحبة، تباين، تكافؤ بين العربية والإنجليزية." }, conformance: 92 },
  { id: "operable", title: { en: "Operable", ar: "قابل للتشغيل" }, description: { en: "Keyboard access, focus order, no seizure triggers.", ar: "وصول بلوحة المفاتيح، ترتيب التركيز، خلو من المحفزات." }, conformance: 86 },
  { id: "understandable", title: { en: "Understandable", ar: "قابل للفهم" }, description: { en: "Readable, predictable, input assistance.", ar: "مقروء، متوقع، مساعدة في الإدخال." }, conformance: 90 },
  { id: "robust", title: { en: "Robust", ar: "متين" }, description: { en: "Compatible with assistive tech and validators.", ar: "متوافق مع التقنيات المساعدة والمدققات." }, conformance: 88 },
];

export const DR_TIERS: { tier: Bi; systems: Bi; rto: string; rpo: string }[] = [
  { tier: { en: "Tier 1 — Critical", ar: "الفئة 1 — حرجة" }, systems: { en: "Case workflow, complaint workflow, identity", ar: "سير الحالات، الشكاوى، الهوية" }, rto: "≤ 2h", rpo: "≤ 15m" },
  { tier: { en: "Tier 2 — Important", ar: "الفئة 2 — مهمة" }, systems: { en: "Knowledge base, VoC, journey analytics", ar: "قاعدة المعرفة، صوت المستفيد، تحليل الرحلات" }, rto: "≤ 8h", rpo: "≤ 1h" },
  { tier: { en: "Tier 3 — Supporting", ar: "الفئة 3 — مساندة" }, systems: { en: "Reporting, admin console, training", ar: "التقارير، الإدارة، التدريب" }, rto: "≤ 24h", rpo: "≤ 4h" },
];
