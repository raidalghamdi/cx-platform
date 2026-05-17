// Channel adapters — Round 3
// Mock send() implementations for email / WhatsApp / chat. Each adapter exposes
// the same shape so a production adapter (SMTP, WhatsApp Business Cloud API,
// embedded web-chat) can drop in unchanged.

export type AdapterChannel = "email" | "whatsapp" | "chat";

export type SendPayload = {
  subject?: string;
  body: string;
};

export type SendResult = {
  ok: boolean;
  externalId?: string;
  error?: string;
};

export interface ChannelAdapter {
  channel: AdapterChannel;
  send(threadId: string, payload: SendPayload): Promise<SendResult>;
}

// ── simulation helpers ───────────────────────────────────────────────────────

function randomLatency(min = 600, max = 1200): number {
  return Math.floor(min + Math.random() * (max - min));
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// 95% success rate per the brief — fail 5% of the time with a believable error.
async function simulateSend(channel: AdapterChannel, threadId: string): Promise<SendResult> {
  await sleep(randomLatency());
  const succeeded = Math.random() < 0.95;
  if (!succeeded) {
    return {
      ok: false,
      error:
        channel === "email"
          ? "SMTP relay rejected (temporary)"
          : channel === "whatsapp"
            ? "WhatsApp Business API returned 503"
            : "Chat socket disconnected before ack",
    };
  }
  return {
    ok: true,
    externalId: `${channel}_${threadId}_${Date.now().toString(36)}`,
  };
}

// ── concrete adapters ────────────────────────────────────────────────────────

export const EmailAdapter: ChannelAdapter = {
  channel: "email",
  async send(threadId, _payload) {
    // Production: hand off to SMTP relay via API. We do not log payload bodies
    // here because they may contain customer PII — leave that to the backend.
    return simulateSend("email", threadId);
  },
};

export const WhatsAppAdapter: ChannelAdapter = {
  channel: "whatsapp",
  async send(threadId, payload) {
    // WhatsApp Business caps messages at 4096 characters. Reject early so the
    // UI can surface a clean error rather than the upstream returning 413.
    if (payload.body.length > 4096) {
      return { ok: false, error: "Message exceeds 4096 characters" };
    }
    return simulateSend("whatsapp", threadId);
  },
};

export const ChatAdapter: ChannelAdapter = {
  channel: "chat",
  async send(threadId, _payload) {
    return simulateSend("chat", threadId);
  },
};

const REGISTRY: Record<AdapterChannel, ChannelAdapter> = {
  email: EmailAdapter,
  whatsapp: WhatsAppAdapter,
  chat: ChatAdapter,
};

export function getAdapter(channel: AdapterChannel): ChannelAdapter {
  return REGISTRY[channel];
}
