/**
 * Phát hiện chửi bới / bị chửi → bot chửi lại SIÊU CĂNG, hủy ego, không thương tiếc.
 */

/** Từ/cụm chửi + sỉ nhục tiếng Việt / teencode / EN */
const SWEAR_RE =
  /(?:\b|^)(?:đm|đmm|dmm|dm|đcm|dcm|đcm|đéo|deo|đjt|djt|địt|dit|đụ|đu|cặc|cac|lồn|lon|buồi|buoi|vcl|vl|clgt|cmm|cmnr|mẹ\s*mày|me\s*may|đĩ|di~|đĩ\s*mẹ|ngu|óc\s*chó|oc\s*cho|súc\s*vật|suc\s*vat|chó\s*đẻ|cho\s*de|thằng\s*chó|con\s*chó|đần|ngu\s*vl|óc\s*cức|oc\s*cuc|cứt|cut|bại\s*não|bai\s*nao|não\s*cứt|não\s*chó|đần\s*độn|óc\s*lợn|óc\s*heo|đồ\s*đĩ|con\s*đĩ|thằng\s*đĩ|phế\s*vật|rác\s*rưởi|shit|fuck|bitch|asshole|motherfucker|stfu|kys|retard|idiot)(?:\b|$|[^\p{L}])/iu;

const TARGET_HINT =
  /(?:mày|may|bố\s*mày|con\s*mẹ|thằng|con\s+\w+|@\w+|ngu|óc|súc\s*vật|bại\s*não|đĩ|<@!?\d+>)/i;

/**
 * Fallback roast — denser, ít sáo rỗng kiểu "não củ chuối".
 */
const ROAST_FALLBACKS = [
  "câm cái mõm đĩ lại, chửi như rác cống mà tưởng tao phải nể? não mày trống đến mức gõ ra chữ nào cũng tự tố mình bại não =))",
  "mày mở miệng là server tụt IQ tập thể — đồ óc cứt, trình chửi chưa đủ tư cách làm background noise =))",
  "há mõm ra gáy hăng vậy vì cả đời chỉ còn mỗi cái miệng hoạt động à? còn não thì chết từ lâu, đồ đĩ rẻ tiền =))",
  "nghe mày chửi xong tao muốn trao giải 'bại não của năm' — cạnh tranh không ai theo nổi cái ego rỗng tuếch này =))",
  "mày tưởng chửi to là ngầu? không, mày đang live stream mình ngu công khai cho cả channel xem =))",
  "đừng cố var, mày không có não để var — chỉ có mõm thối, tự tin ảo và cái đít đang nghĩ hộ đầu =))",
  "gõ loạn như súc vật rồi đòi người nể? về tập nói trước đã, đồ phế vật kỹ thuật số =))",
  "IQ mày thấp đến mức GPS từ chối chỉ đường vào sọ — im đi cho server đỡ thối =))",
  "mày chửi hăng vì sợ im lại lộ mình không có gì trong đầu đúng không đồ óc chó =))",
  "cái ego rác của mày to hơn não thật — nên mỗi câu gáy chỉ chứng minh mày đĩ ngu bẩm sinh =))",
  "tao không sợ mày chửi; tao sợ não mày quá mỏng, gõ thêm phát nữa là vỡ hết tự trọng ảo =))",
  "nhìn phát biết bại não: mồm thì như máy nổ, ý thì như Windows XP treo — đúng loại rác biết cầm điện thoại =))",
  "fuck you back, bitch bại não — mở mõm ra là cả channel muốn mute mày cho sạch =))",
  "mày không phải đối thủ, mày là tutorial cách ngu mà vẫn tự tin. câm lại đi =))",
  "gáy tiếp cũng được, tao chửi đến khi mày tắt Discord vẫn còn nghe mùi nhục =))",
  "đồ óc lợn: chữ thì tục, ý thì rỗng, punchline thì như cứt đặc — về bú bình rồi quay lại =))",
];

/** Mức độ căng dựa trên tin nhắn */
export function roastIntensity(content, mentionedBot) {
  let score = 1;
  const t = (content || "").toLowerCase();
  if (mentionedBot) score += 2;
  if (/đĩ|bại\s*não|óc\s*chó|súc\s*vật|fuck|bitch|địt|cặc|lồn/i.test(t)) score += 2;
  if ((t.match(/đm|dm|ngu|đĩ|fuck|vl|vcl/gi) || []).length >= 2) score += 1;
  if (t.length < 40) score += 1;
  return Math.min(score, 5);
}

export function isSwearing(content) {
  if (!content || typeof content !== "string") return false;
  const text = content.trim();
  if (text.length < 2) return false;
  return SWEAR_RE.test(text);
}

/** User đang chửi / bị chửi / sỉ nhục → trigger roast */
export function isRoastTrigger(content, { mentionedBot = false } = {}) {
  if (!isSwearing(content)) return false;
  if (mentionedBot) return true;
  if (TARGET_HINT.test(content)) return true;
  if (content.trim().length <= 100) return true;
  const hits = content.match(
    /đm|dmm|dm|đéo|địt|dit|cặc|lồn|vcl|vl|ngu|óc\s*chó|bại\s*não|đĩ|fuck|shit|bitch|đụ|đjt|súc\s*vật/gi
  );
  return (hits?.length || 0) >= 1;
}

export function pickFallbackRoast(intensity = 3) {
  const hard = ROAST_FALLBACKS.filter((s) =>
    /đĩ|bại não|óc|súc vật|phế vật|bitch|nhục|ego|cặc|lồn|mõm/i.test(s)
  );
  const pool = intensity >= 3 && hard.length ? hard : ROAST_FALLBACKS;
  return pool[Math.floor(Math.random() * pool.length)];
}
