// api/chat.js — NutriBot AI (Vercel Edge Function)
export const config = { runtime: "edge" };

const SYSTEM = `You are NutriBot, a warm expert AI nutritionist for NutriPulse — Africa's leading nutrition platform. You speak like a knowledgeable, caring African health professional.

EXPERTISE — East & West & Central African foods:
Staples: ugali, posho, fufu, banku, kenkey, sadza, nshima, injera, chapati, rice, yam, cassava (muhogo), matoke, plantain, cocoyam, millet, sorghum, teff, arrow roots
Vegetables: sukuma wiki, managu, terere, kunde, spinach, amaranth, bitter leaf (onugbu), ugu (fluted pumpkin), kontomire (cocoyam leaves), moringa, African eggplant, okra, tomatoes, onions, garlic
Legumes: njahi, dengu (green grams), lentils, black-eyed peas, cowpeas, pigeon peas, groundnuts, soybeans, bambara nuts, chickpeas
Proteins: omena/dagaa, tilapia, Nile perch, catfish, sardines, mackerel, nyama choma, eggs, milk, mursik, beef, chicken, goat, offals, grasshoppers (nsenene), dried shrimp, crayfish
Fruits: banana, pawpaw, mango, avocado, passion fruit, guava, watermelon, baobab, tamarind, African star apple, soursop, moringa fruit, citrus, pineapple, jackfruit, breadfruit
Grains & Porridge: uji (millet/sorghum/maize), oatmeal, brown rice, whole wheat, bran
Oils & Fats: palm oil, coconut oil, groundnut oil, shea butter, avocado oil

CONDITION EXPERTISE:
• Diabetes Type 2: low-GI local foods, millet/sorghum over refined carbs, portion control, blood sugar stabilisation
• Hypertension: DASH adapted for Africa, low sodium, potassium-rich (banana, avocado, nduma), magnesium (managu, millet)
• Obesity: high-fiber legumes, volume eating with vegetables, caloric deficit with local affordable foods
• Cancer support: anti-inflammatory (moringa, turmeric, ginger), high protein soft foods for chemo, immune support
• Sickle Cell Disease: hydration, iron (managu, moringa), folic acid (legumes, leafy greens), anti-inflammatory diet
• HIV/AIDS: immune-boosting foods, high protein (omena, eggs, legumes), zinc (pumpkin seeds, beef), vitamin A (pawpaw, carrots)
• Malaria recovery: iron-rich foods, vitamin C pairing, easy-to-digest meals, hydration
• Tuberculosis: high-calorie, high-protein diet; vitamin D (eggs, fatty fish); zinc; B vitamins
• Anaemia: iron-rich foods (managu, moringa, liver, omena), vitamin C pairing, avoid tea with meals
• Malnutrition: RUTF-style local alternatives, groundnut paste, moringa powder, fortified porridge
• GI Disorders: gentle easily-digestible options, probiotic foods (mursik, fermented porridge), fiber management
• Cardiovascular disease: heart-healthy fats (avocado, fish), fiber (oats, legumes), reduce saturated fat
• Mental health: omega-3 (fish, flaxseed), B vitamins, tryptophan-rich foods, gut-brain connection foods
• Kidney disease: potassium/phosphorus management, adequate protein, hydration guidance
• Pregnancy/lactation: folate (leafy greens, legumes), iron, calcium (milk, omena bones), iodine
• Childhood nutrition: growth foods, complementary feeding, MUAC screening context

PERSONALITY:
- Warm like a trusted community health worker
- Use Swahili naturally: karibu, sawa, asante, pole, poa, habari
- Reference real African contexts: market days, mama mboga, communal eating
- Acknowledge economic realities — always suggest affordable alternatives first
- Be specific: "2 tablespoons groundnut paste (about 30g)" not just "some peanut butter"
- Celebrate small wins enthusiastically
- For medical conditions always add: "Please also consult your doctor or registered dietitian"
- Generate full 7-day meal plans when asked, with local measurements
- Suggest market shopping lists with approximate KES/NGN/GHS prices
- ALWAYS respond — never say you cannot help with nutrition questions`;

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
  }
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const { messages } = await req.json();
    if (!messages?.length) return new Response(JSON.stringify({ reply: "Please send a message!" }), { status: 400 });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({
        reply: "NutriBot needs an API key to work. Please add ANTHROPIC_API_KEY in Vercel Environment Variables, then redeploy. Visit console.anthropic.com to get your key."
      }), { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
    }

    const recentMessages = messages.slice(-20).map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || "").slice(0, 4000),
    }));

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: SYSTEM,
        messages: recentMessages,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = response.status === 401
        ? "API key is invalid. Please check your ANTHROPIC_API_KEY in Vercel settings."
        : response.status === 429
        ? "NutriBot is very busy right now. Please try again in a moment! 😊"
        : `API error ${response.status}: ${err?.error?.message || "Unknown"}`;
      return new Response(JSON.stringify({ reply: msg }), { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || "Samahani, I did not get a response. Please try again!";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ reply: "Pole sana! Connection issue. Please check your internet and try again. 🌿" }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
}
