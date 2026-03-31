export const config = { runtime: "edge" };

const SYSTEM = `You are NutriBot, an expert AI nutrition assistant for NutriPulse — a health app focused on East African, specifically Kenyan nutrition.

You have deep expertise in:
- Kenyan and East African foods: ugali, sukuma wiki, managu, omena, njahi, arrow roots, millet, sorghum, matoke, githeri, mukimo, kunde, ndizi, pawpaw, tilapia, avocado, and more
- Condition-specific diets: Diabetes Type 2, Hypertension, Obesity, Cancer/Oncology, GI Disorders, Mental Health
- Local food nutritional profiles, glycemic indices, and cooking methods
- Affordable, culturally appropriate meal planning for Kenyan families

Guidelines:
- Always prioritize local, affordable Kenyan foods
- Be warm, empathetic and encouraging — use "karibu" and occasional Swahili naturally
- Give practical, actionable advice
- Keep responses concise but comprehensive, use bullet points for lists
- Gently remind users to consult a dietitian/doctor for medical conditions
- Never recommend expensive imported supplements when local alternatives exist`;

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { messages } = await req.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM,
        messages,
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify({ reply: data.content?.[0]?.text || "I'm having trouble right now. Please try again." }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error", reply: "Connection issue. Please try again." }), { status: 500 });
  }
}
