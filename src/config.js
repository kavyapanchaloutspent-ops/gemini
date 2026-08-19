import "dotenv/config";

function required(name) {
  const v = process.env[name];
  if (!v || !String(v).trim()) {
    throw new Error(`Thiếu biến môi trường bắt buộc: ${name}`);
  }
  return String(v).trim();
}

function list(name) {
  return (process.env[name] || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export const config = {
  discordToken: required("DISCORD_TOKEN"),
  clientId: process.env.DISCORD_CLIENT_ID || "",
  adminUserIds: list("ADMIN_USER_IDS"),
  adminRoleIds: list("ADMIN_ROLE_IDS"),

  ai: {
    /** Primary key Nexus g2a_… / nvapi-… / sk-… (pool + lệnh .api) */
    apiKey:
      process.env.AI_API_KEY ||
      process.env.NEXUS_API_KEY ||
      process.env.NVIDIA_API_KEY ||
      process.env.AI_API_KEYS?.split(/[\s,;]+/).filter(Boolean)[0] ||
      "",
    /** Nexus OpenAI-compatible */
    baseURL: process.env.AI_BASE_URL || "https://api.nexusapi.co/v1",
    /** Model chính — mặc định grok-4.5-high (nhanh + tiết kiệm hơn 4.6) */
    model: process.env.AI_MODEL || "grok-4.5-high",
    /** Fallback vision/chat model string */
    visionModel: process.env.AI_VISION_MODEL || "grok-4.5-high",
    /** Reasoning budget (chỉ NVIDIA Nemotron) */
    reasoningBudget: Number(process.env.AI_REASONING_BUDGET || 512),
    /** Output cap — thấp để kéo 100M token ≥6 ngày */
    maxTokens: Number(process.env.AI_MAX_TOKENS || 512),
    toxicMaxTokens: Number(process.env.AI_TOXIC_MAX_TOKENS || 300),
    /** true/false — bật thinking (mặc định tắt cho nhanh + ít token) */
    enableThinking: String(process.env.AI_ENABLE_THINKING ?? "false").toLowerCase() !== "false",
    /** Race 2 key đốt ~2x token — mặc định tắt */
    race: String(process.env.AI_RACE ?? "false").toLowerCase() === "true",
  },

  /** Vision riêng (optional; mặc định cùng Nexus key/base) */
  vision: {
    apiKey:
      process.env.NVIDIA_VISION_API_KEY ||
      process.env.AI_API_KEY ||
      process.env.NEXUS_API_KEY ||
      process.env.NVIDIA_API_KEY ||
      "",
    baseURL: process.env.NVIDIA_VISION_BASE_URL || process.env.AI_BASE_URL || "https://api.nexusapi.co/v1",
    model: process.env.NVIDIA_VISION_MODEL || process.env.AI_VISION_MODEL || "grok-4.5-high",
    timeoutMs: Number(process.env.NVIDIA_VISION_TIMEOUT_MS || 15_000),
  },
  /** Optional: OpenRouter chỉ cho scam-vision (không phải chat chính) */
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY || "",
    baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
    visionModel:
      process.env.OPENROUTER_VISION_MODEL ||
      "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  },
  /** Cloudflare Workers AI — FLUX.1 schnell (tạo ảnh) */
  cf: {
    accountId: process.env.CF_ACCOUNT_ID || "",
    apiToken: process.env.CF_API_TOKEN || "",
    steps: Number(process.env.CF_FLUX_STEPS || 4),
  },

  /** Surge.sh — deploy site tĩnh (tool của Grok, không log token) */
  surge: {
    login: process.env.SURGE_LOGIN || "",
    token: process.env.SURGE_TOKEN || "",
    /** cooldown deploy mỗi user (ms) */
    cooldownMs: Number(process.env.SURGE_COOLDOWN_MS || 60_000),
  },

  warnThreshold: Number(process.env.WARN_THRESHOLD || 3),
  kickThreshold: Number(process.env.KICK_THRESHOLD || 5),
  muteMinutes: Number(process.env.MUTE_MINUTES || 10),
  requireMention: String(process.env.REQUIRE_MENTION ?? "true").toLowerCase() !== "false",
  botName: process.env.BOT_NAME || "Grok",

  /** History ngắn = ít input token + rep nhanh hơn */
  historyLimit: Number(process.env.HISTORY_LIMIT || 6),
  /** Cooldown chống spam đốt token; latency mục tiêu ~4s nằm ở model/timeout */
  aiCooldownMs: Number(process.env.AI_COOLDOWN_MS || 2500),
  /** Rate limit moderation AI (ms) giữa 2 lần check nặng */
  modCooldownMs: 800,
};
