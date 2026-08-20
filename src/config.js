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
    /** NVIDIA nvapi-… (pool + lệnh .api) */
    apiKey:
      process.env.AI_API_KEY ||
      process.env.NVIDIA_API_KEY ||
      process.env.AI_API_KEYS?.split(/[\s,;]+/).filter(Boolean)[0] ||
      "",
    /** NVIDIA hosted OpenAI-compatible */
    baseURL: process.env.AI_BASE_URL || "https://integrate.api.nvidia.com/v1",
    /**
     * DeepSeek trên NVIDIA hiện lỗi connect → dùng Nemotron Ultra (bản cũ chửi ngon).
     * Fallback nhanh: nemotron-3-super
     */
    model: process.env.AI_MODEL || "nvidia/nemotron-3-ultra-550b-a55b",
    fallbackModel: process.env.AI_FALLBACK_MODEL || "nvidia/nemotron-3-super-120b-a12b",
    visionModel: process.env.AI_VISION_MODEL || "nvidia/nemotron-3-ultra-550b-a55b",
    reasoningBudget: Number(process.env.AI_REASONING_BUDGET || 1024),
    maxTokens: Number(process.env.AI_MAX_TOKENS || 1024),
    toxicMaxTokens: Number(process.env.AI_TOXIC_MAX_TOKENS || 480),
    /** toxic/fast auto tắt; chat thường có thể bật */
    enableThinking: String(process.env.AI_ENABLE_THINKING ?? "false").toLowerCase() !== "false",
    race: String(process.env.AI_RACE ?? "false").toLowerCase() === "true",
    timeoutMs: Number(process.env.AI_TIMEOUT_MS || 35_000),
    retries: Number(process.env.AI_RETRIES || 1),
  },

  vision: {
    apiKey:
      process.env.NVIDIA_VISION_API_KEY ||
      process.env.AI_API_KEY ||
      process.env.NVIDIA_API_KEY ||
      "",
    baseURL: process.env.NVIDIA_VISION_BASE_URL || "https://integrate.api.nvidia.com/v1",
    model: process.env.NVIDIA_VISION_MODEL || "google/gemma-4-31b-it",
    timeoutMs: Number(process.env.NVIDIA_VISION_TIMEOUT_MS || 20_000),
  },

  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY || "",
    baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
    visionModel:
      process.env.OPENROUTER_VISION_MODEL ||
      "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  },

  cf: {
    accountId: process.env.CF_ACCOUNT_ID || "",
    apiToken: process.env.CF_API_TOKEN || "",
    steps: Number(process.env.CF_FLUX_STEPS || 4),
  },

  surge: {
    login: process.env.SURGE_LOGIN || "",
    token: process.env.SURGE_TOKEN || "",
    cooldownMs: Number(process.env.SURGE_COOLDOWN_MS || 60_000),
  },

  warnThreshold: Number(process.env.WARN_THRESHOLD || 3),
  kickThreshold: Number(process.env.KICK_THRESHOLD || 5),
  muteMinutes: Number(process.env.MUTE_MINUTES || 10),
  requireMention: String(process.env.REQUIRE_MENTION ?? "true").toLowerCase() !== "false",
  botName: process.env.BOT_NAME || "Grok",

  historyLimit: Number(process.env.HISTORY_LIMIT || 12),
  aiCooldownMs: Number(process.env.AI_COOLDOWN_MS || 1200),
  modCooldownMs: 800,
};
