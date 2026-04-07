// api/chat.js — NutriBot AI Backend (Vercel Edge Function)
// Secure server-side Claude API. No keys exposed to frontend.

export const config = { runtime: "edge" };

const rateLimitStore = new Map();
const RATE_LIMIT_FREE = 3;
const RATE_LIMIT_PAID = 100;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(ip, plan) {
  const key = `${ip}:${plan}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key) || { count: 0, resetAt: now + RATE_WINDOW_MS };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + RATE_WINDOW_MS; }
  entry.count++;
  rateLimitStore.set(key, entry);
  const limit = plan === "free" ? RATE_LIMIT_FREE : RATE_LIMIT_PAID;
  return { allowed: entry.count <= limit, remaining: Math.max(0, limit - entry.count) };
}

function buildSystemPrompt(userProfile) {
  const p = userProfile || {};
  const profileCtx = p.name ? `
CURRENT USER PROFILE:
- Name: ${p.name}
- Age: ${p.age || "not specified"}  
- Weight: ${p.weight || "not specified"}kg | Height: ${p.height || "not specified"}m
- Health Condition: ${p.condition || "General health"}
- Goals: ${p.goals || "General wellness"}
Personalise all advice to this profile.` : "";

  return `You are NutriBot — a warm, expert AI nutritionist for NutriPulse, specialising in East African nutrition. You speak like a knowledgeable Kenyan dietitian friend.
${profileCtx}

EAST AFRICAN FOODS YOU KNOW DEEPLY:
Staples: ugali (maize/millet/sorghum), chapati, rice, arrow roots (nduma), sweet potato, cassava (muhogo), matoke, githeri, mukimo, mandazi
Vegetables: sukuma wiki (kale), managu (African nightshade), terere (amaranth), kunde (cowpea leaves), spinach, cabbage, tomatoes
Legumes: njahi (black beans), dengu (green grams), lentils (kamande), groundnuts, soya beans, chickpeas  
Proteins: omena/dagaa (silver cyprinid), tilapia, Nile perch, nyama choma, eggs, milk, mursik, beef, chicken, offals
Fruits: ndizi (banana), pawpaw, mango, avocado, passion fruit, guava, watermelon, oranges
Grains: uji porridge (millet/sorghum/maize), oatmeal, brown rice, whole wheat bread
Beverages: chai, black tea, uji, fresh juices

WHAT YOU CAN DO:
- Generate full 7-day personalised meal plans (breakfast, lunch, dinner, snacks)
- Calculate calories and macros for any East African meal
- Create shopping lists with KES prices from local markets (Wakulima, mama mboga)
- Suggest recipes using local ingredients with local measurements (debe, bunch, kilo)
- Advise on condition-specific diets: Diabetes, Hypertension, Obesity, Cancer, GI, Anaemia, Pregnancy
- Create budget meal plans (from KES 100/day upwards)
- Suggest Ramadan/Christian fasting meal plans
- Help with weight loss, muscle gain, energy levels

PERSONALITY:
- Warm and encouraging like a trusted friend
- Use natural Swahili: karibu, sawa, asante, pole, poa
- Reference real Kenyan life: matatu rides, office lunches, mama mboga, market days
- Acknowledge budget realities — always suggest affordable alternatives
- Never shame food choices — always celebrate small wins
- Use occasional emojis for warmth 🌿🥗💪
- Be specific: "2 tablespoons groundnut paste (~30g)" not just "some peanut butter"

RULES:
- Prioritise local affordable foods over expensive imports ALWAYS
- For medical conditions add: "Please also consult a registered dietitian or doctor"
- Be concise: use bullet points, clear headers for meal plans
- Keep responses focused and practical
- If unsure, say so honestly`;
}

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
  }
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });

  try {
    const body = await req.json();
    const { messages, userProfile, plan } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ reply: "Please send a message first." }), { status: 400 });
    }

    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rateCheck = checkRateLimit(ip, plan || "free");
    if (!rateCheck.allowed) {
      return new Response(JSON.stringify({
        reply: plan === "free"
          ? "You have used all 3 free messages. Upgrade to Basic or Premium to continue! ⭐"
          : "Hourly limit reached. Please try again in a few minutes.",
        rateLimited: true,
      }), { status: 429 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ reply: "NutriBot is being configured. Please add your ANTHROPIC_API_KEY in Vercel environment variables. 🌿" }), { status: 200 });
    }

    const systemPrompt = buildSystemPrompt(userProfile);
    const recentMessages = messages.slice(-20).map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || "").slice(0, 4000),
    }));

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: systemPrompt,
        messages: recentMessages,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 401) return new Response(JSON.stringify({ reply: "NutriBot API key issue — please contact support. 🌿" }), { status: 200 });
      if (status === 429) return new Response(JSON.stringify({ reply: "NutriBot is very busy right now. Please try again in a moment! 😊" }), { status: 200 });
      return new Response(JSON.stringify({ reply: "NutriBot is temporarily unavailable. Please try again shortly. 🌿" }), { status: 200 });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || "Samahani, I did not get a response. Please try again!";

    return new Response(JSON.stringify({ reply, remaining: rateCheck.remaining }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ reply: "Pole sana! 😊 Connection issue. Please try again in a moment." }), { status: 200 });
  }
}
