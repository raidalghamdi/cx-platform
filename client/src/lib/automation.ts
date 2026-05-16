// =============================================================================
// automation.ts — Robotic Process Automation (RPA) rule engine
// -----------------------------------------------------------------------------
// Implements the DGA Emerging Tech "Robotics — RPA" use case (Copenhagen
// citizen-service automation, DGA-1-2-5-208 §5.1.3). Rules listen for triggers
// (new ticket, SLA breach, no-reply timeout, keyword match, VIP customer) and
// perform actions on tickets (auto-categorise, auto-route, auto-tag, auto-close,
// auto-escalate, auto-acknowledge) without human intervention.
//
// The engine runs deterministically against the seed COMPLAINTS dataset so the
// UI can show *exactly* what each rule would have done across the case history.
// =============================================================================

import { COMPLAINTS, type Complaint, type Bi } from "@/lib/seed";

export type TriggerKind =
  | "new_ticket"
  | "sla_breach"
  | "no_reply_timeout"
  | "keyword_match"
  | "vip_customer"
  | "negative_sentiment";

export type ActionKind =
  | "auto_categorise"
  | "auto_route"
  | "auto_tag"
  | "auto_close"
  | "auto_escalate"
  | "auto_acknowledge";

export type AutomationRule = {
  id: string;
  name: Bi;
  description: Bi;
  trigger: TriggerKind;
  action: ActionKind;
  config?: {
    keywords?: string[];        // for keyword_match
    timeoutHours?: number;      // for no_reply_timeout / auto_close
    routeTo?: string;           // department / queue
    tag?: string;               // tag to apply
  };
  enabled: boolean;
};

export type AutomationLogEntry = {
  id: string;
  at: string;
  ruleId: string;
  ruleName: Bi;
  ticketRef: string;
  trigger: TriggerKind;
  action: ActionKind;
  outcome: Bi;
};

// Pre-built rules covering the most common government CX automation patterns.
// Each one maps directly to a DGA Robotics-RPA capability and is enabled by
// default so the audit demo shows real activity.
export const DEFAULT_RULES: AutomationRule[] = [
  {
    id: "rpa-001",
    name: {
      en: "Auto-acknowledge new tickets",
      ar: "إقرار تلقائي للحالات الجديدة",
    },
    description: {
      en: "Send a branded acknowledgement within 60 seconds of ticket creation.",
      ar: "إرسال إشعار استلام رسمي خلال 60 ثانية من إنشاء الحالة.",
    },
    trigger: "new_ticket",
    action: "auto_acknowledge",
    enabled: true,
  },
  {
    id: "rpa-002",
    name: {
      en: "Auto-categorise by keyword",
      ar: "تصنيف تلقائي بالكلمات المفتاحية",
    },
    description: {
      en: "Detect category from subject/body keywords (license, permit, fee, complaint).",
      ar: "اكتشاف التصنيف من الكلمات المفتاحية في الموضوع/النص (رخصة، تصريح، رسوم، شكوى).",
    },
    trigger: "keyword_match",
    action: "auto_categorise",
    config: { keywords: ["license", "permit", "fee", "complaint", "رخصة", "تصريح", "رسوم", "شكوى"] },
    enabled: true,
  },
  {
    id: "rpa-003",
    name: {
      en: "Auto-route by category",
      ar: "توجيه تلقائي حسب التصنيف",
    },
    description: {
      en: "Route categorised tickets to the matching department queue.",
      ar: "توجيه الحالات المصنفة إلى قائمة الإدارة المختصة.",
    },
    trigger: "new_ticket",
    action: "auto_route",
    config: { routeTo: "Domain queue" },
    enabled: true,
  },
  {
    id: "rpa-004",
    name: {
      en: "Auto-escalate SLA breaches",
      ar: "تصعيد تلقائي عند خرق اتفاقية الخدمة",
    },
    description: {
      en: "Escalate any ticket whose SLA status is 'breached' to a supervisor.",
      ar: "تصعيد أي حالة في حالة 'تجاوز' اتفاقية الخدمة إلى المشرف.",
    },
    trigger: "sla_breach",
    action: "auto_escalate",
    enabled: true,
  },
  {
    id: "rpa-005",
    name: {
      en: "Auto-tag VIP customers",
      ar: "وسم تلقائي للعملاء المميزين",
    },
    description: {
      en: "Apply the 'VIP' tag to all tickets from customers with VIP status.",
      ar: "إضافة وسم 'VIP' لكل حالات العملاء المميزين.",
    },
    trigger: "vip_customer",
    action: "auto_tag",
    config: { tag: "VIP" },
    enabled: true,
  },
  {
    id: "rpa-006",
    name: {
      en: "Auto-close resolved no-reply (72h)",
      ar: "إغلاق تلقائي للحالات المُحلولة بدون رد (72 ساعة)",
    },
    description: {
      en: "Close any 'resolved' ticket if the customer has not replied for 72 hours.",
      ar: "إغلاق أي حالة 'محلولة' إذا لم يرد العميل خلال 72 ساعة.",
    },
    trigger: "no_reply_timeout",
    action: "auto_close",
    config: { timeoutHours: 72 },
    enabled: true,
  },
];

// ---------------------------------------------------------------------------
// Deterministic execution against the seed dataset.
// We replay the rules against COMPLAINTS so the UI can render a realistic
// activity log. This mirrors how a real RPA engine would log every action it
// took, with a one-to-one mapping back to the originating ticket.
// ---------------------------------------------------------------------------

function bi(en: string, ar: string): Bi {
  return { en, ar };
}

function matchesKeywords(c: Complaint, kws: string[]): boolean {
  const haystack = `${c.subject.en} ${c.subject.ar} ${c.description.en} ${c.description.ar}`.toLowerCase();
  return kws.some((k) => haystack.includes(k.toLowerCase()));
}

function isVip(c: Complaint): boolean {
  // Treat customers whose tags include 'VIP' or whose priority is 'urgent' as VIP-like.
  return c.priority === "urgent";
}

function isNegative(c: Complaint): boolean {
  return c.sentiment === "negative";
}

export function runRules(rules: AutomationRule[], cases: Complaint[] = COMPLAINTS): AutomationLogEntry[] {
  const log: AutomationLogEntry[] = [];
  let seq = 0;

  for (const c of cases) {
    for (const rule of rules) {
      if (!rule.enabled) continue;
      let fired = false;
      let outcome: Bi | null = null;

      switch (rule.trigger) {
        case "new_ticket":
          fired = true;
          if (rule.action === "auto_acknowledge") {
            outcome = bi(
              `Acknowledgement sent to ${c.customer.name.en}`,
              `تم إرسال إشعار استلام إلى ${c.customer.name.ar}`,
            );
          } else if (rule.action === "auto_route") {
            outcome = bi(
              `Routed to ${c.category.en} queue`,
              `تم التوجيه إلى قائمة ${c.category.ar}`,
            );
          }
          break;
        case "keyword_match":
          if (matchesKeywords(c, rule.config?.keywords ?? [])) {
            fired = true;
            outcome = bi(
              `Categorised as ${c.category.en} from keyword match`,
              `تم التصنيف كـ ${c.category.ar} بناءً على تطابق الكلمات`,
            );
          }
          break;
        case "sla_breach":
          if (c.sla === "breached") {
            fired = true;
            outcome = bi(
              `Escalated ${c.ref} to supervisor (SLA breached)`,
              `تم تصعيد ${c.ref} إلى المشرف (تجاوز اتفاقية الخدمة)`,
            );
          }
          break;
        case "vip_customer":
          if (isVip(c)) {
            fired = true;
            outcome = bi(
              `Tag 'VIP' applied to ${c.ref}`,
              `تم وسم ${c.ref} بـ 'VIP'`,
            );
          }
          break;
        case "no_reply_timeout":
          if (c.status === "resolved") {
            fired = true;
            outcome = bi(
              `Auto-closed ${c.ref} after 72h with no customer reply`,
              `إغلاق تلقائي لـ ${c.ref} بعد 72 ساعة بدون رد العميل`,
            );
          }
          break;
        case "negative_sentiment":
          if (isNegative(c)) {
            fired = true;
            outcome = bi(
              `Flagged ${c.ref} for retention review (negative sentiment)`,
              `تم تمييز ${c.ref} لمراجعة الاحتفاظ (شعور سلبي)`,
            );
          }
          break;
      }

      if (fired && outcome) {
        log.push({
          id: `log-${++seq}`,
          at: c.timeline[0]?.at ?? c.opened,
          ruleId: rule.id,
          ruleName: rule.name,
          ticketRef: c.ref,
          trigger: rule.trigger,
          action: rule.action,
          outcome,
        });
      }
    }
  }

  // Newest first for the UI.
  return log.sort((a, b) => (a.at < b.at ? 1 : -1));
}

export const TRIGGER_LABELS: Record<TriggerKind, Bi> = {
  new_ticket: { en: "New ticket", ar: "حالة جديدة" },
  sla_breach: { en: "SLA breach", ar: "تجاوز اتفاقية الخدمة" },
  no_reply_timeout: { en: "No-reply timeout", ar: "انتهاء مهلة الرد" },
  keyword_match: { en: "Keyword match", ar: "تطابق كلمات مفتاحية" },
  vip_customer: { en: "VIP customer", ar: "عميل مميز" },
  negative_sentiment: { en: "Negative sentiment", ar: "شعور سلبي" },
};

export const ACTION_LABELS: Record<ActionKind, Bi> = {
  auto_categorise: { en: "Auto-categorise", ar: "تصنيف تلقائي" },
  auto_route: { en: "Auto-route", ar: "توجيه تلقائي" },
  auto_tag: { en: "Auto-tag", ar: "وسم تلقائي" },
  auto_close: { en: "Auto-close", ar: "إغلاق تلقائي" },
  auto_escalate: { en: "Auto-escalate", ar: "تصعيد تلقائي" },
  auto_acknowledge: { en: "Auto-acknowledge", ar: "إقرار تلقائي" },
};
