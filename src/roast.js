/**
 * Phát hiện chửi bới / bị chửi → bot chửi lại SIÊU CĂNG, hủy ego, không thương tiếc.
 */

/** Từ/cụm chửi + sỉ nhục tiếng Việt / teencode / EN */
const SWEAR_RE =
  /(?:\b|^)(?:đm|đmm|dmm|dm|đcm|dcm|đcm|đéo|deo|đjt|djt|địt|dit|đụ|đu|cặc|cac|lồn|lon|buồi|buoi|vcl|vl|clgt|cmm|cmnr|mẹ\s*mày|me\s*may|đĩ|di~|đĩ\s*mẹ|ngu|óc\s*chó|oc\s*cho|súc\s*vật|suc\s*vat|chó\s*đẻ|cho\s*de|thằng\s*chó|con\s*chó|đần|ngu\s*vl|óc\s*cức|oc\s*cuc|cứt|cut|bại\s*não|bai\s*nao|não\s*cứt|não\s*chó|đần\s*độn|óc\s*lợn|óc\s*heo|đồ\s*đĩ|con\s*đĩ|thằng\s*đĩ|phế\s*vật|rác\s*rưởi|shit|fuck|bitch|asshole|motherfucker|stfu|kys|retard|idiot)(?:\b|$|[^\p{L}])/iu;

const TARGET_HINT =
  /(?:mày|may|bố\s*mày|con\s*mẹ|thằng|con\s+\w+|@\w+|ngu|óc|súc\s*vật|bại\s*não|đĩ|<@!?\d+>)/i;

/**
 * Fallback roast MAX PAIN — đĩ / ngu / bại não / hủy ego / muốn tắt Discord.
 */
const ROAST_FALLBACKS = [
  "câm mõm lại đi con đĩ bại não, chửi cái giọng như cứt thối mà tưởng tao sợ hả? nhục thế này còn gáy thì não mày chắc chỉ để trang trí =))",
  "mày ngu đến mức mở mồm ra server mất 50 IQ, đồ bại não thở bằng mồm và nghĩ bằng đít — nghe xong muốn tắt Discord luôn chứ gì =))",
  "há cái mõm đĩ ra chửi ai? trình mày như rác cống, não thì như wifi hàng xóm — lúc có lúc không, sống như phế vật đúng chất =))",
  "đồ ngu vl, chửi như đứa trẻ vãi bãi. về bú bình rồi tập nói lại trước khi gáy tiếp, kẻo cả server thương hại mày muốn ói =))",
  "mày là định nghĩa của bại não: mồm to, não teo, tự tin ảo như con đĩ mới mua filter — nhìn phát muốn chôn luôn cái ego rác của mày =))",
  "chửi tao? mày còn không đủ tư cách làm background noise. câm lại, đồ óc cứt, đừng làm tao phải lột sạch cái mặt dày của mày =))",
  "nghe mày chửi xong tao muốn tặng mày giải 'đĩ ngu của năm' — cạnh tranh không ai theo nổi, nhục muốn xóa acc luôn cũng đúng =))",
  "thằng/con bại não này, mồm thì thối như bãi nôn, não thì trống như sọ dừa khô — gáy thêm phát nữa là thành meme thất bại vĩnh viễn =))",
  "mày chửi hăng vậy vì cả đời chỉ có mỗi cái miệng là còn hoạt động được à đồ đĩ rẻ tiền? não thì chết từ lâu rồi =))",
  "im đi con chó đẻ. IQ mày thấp đến mức GPS còn từ chối chỉ đường vào não mày — sống vậy cũng mệt thật =))",
  "gáy tiếp đi đồ phế vật — tao chửi mày đến khi mày tắt Discord vẫn còn thấy nhục muốn chết cụ luôn =))",
  "mày tưởng chửi to là ngầu? không, mày chỉ là con đĩ bại não đang quảng cáo mình ngu công khai cho cả server cười =))",
  "nói chuyện như súc vật xong đòi người ta nể? óc lợn à? về chuồng đi cho server sạch, đừng làm không khí thối thêm =))",
  "cái não mày hình như để trang trí — chửi cái kiểu đấy chỉ chứng minh mày đĩ ngu bẩm sinh, nhục muốn biến khỏi chat luôn cũng phải =))",
  "bị chửi hay chửi người, mày vẫn là rác. biến đi trước khi tao lột sạch cái tự trọng ảo của mày đến mức không muốn sống trên Discord nữa =))",
  "fuck you back, đồ bitch bại não — mồm mày mở ra là server tụt chuẩn văn minh xuống cống, còn mày thì tụt hết mặt mũi =))",
  "đừng cố chửi, mày không có não để chửi. chỉ có mõm đĩ và cái ego rỗng tuếch — gáy thêm là tự đào huyệt danh dự =))",
  "nhìn phát biết bại não: gõ loạn xạ, chửi sặc mùi thất bại, não chạy chậm hơn Windows XP — sống như lỗi phần mềm bị bỏ rơi =))",
  "mày gáy như muốn chứng minh mình tồn tại, nhưng mỗi chữ chỉ chứng minh mày là đống rác biết gõ phím — tắt máy đi cho đời đỡ khổ =))",
  "óc chó vừa ngu vừa hăng: chửi xong tưởng ngầu, thực ra cả channel đang nhìn mày như xem circus thất bại =))",
];

/** Mức độ căng dựa trên tin nhắn */
export function roastIntensity(content, mentionedBot) {
  let score = 1;
  const t = (content || "").toLowerCase();
  if (mentionedBot) score += 2;
  if (/đĩ|bại\s*não|óc\s*chó|súc\s*vật|fuck|bitch|địt|cặc|lồn/i.test(t)) score += 2;
  if ((t.match(/đm|dm|ngu|đĩ|fuck|vl|vcl/gi) || []).length >= 2) score += 1;
  if (t.length < 40) score += 1; // spam chửi ngắn = càng phải đập
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
  // intensity cao → ưu tiên câu hủy ego / đĩ / bại não
  const hard = ROAST_FALLBACKS.filter((s) =>
    /đĩ|bại não|ngu vl|óc|súc vật|phế vật|bitch|chết cụ|xóa acc|tắt Discord/i.test(s)
  );
  const pool = intensity >= 3 && hard.length ? hard : ROAST_FALLBACKS;
  return pool[Math.floor(Math.random() * pool.length)];
}

/* Detect toxic → index auto-engage cùng chatWithAi (1 nhân cách + history). */
