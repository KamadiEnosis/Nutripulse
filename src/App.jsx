import { useState, useEffect, useRef } from "react";

// ─── Palette ────────────────────────────────────────────────────────────
const C = {
  forest: "#0f2419",
  jade: "#1e5631",
  mint: "#3a9d6e",
  lime: "#7ecba1",
  cream: "#f7f3ed",
  sand: "#e8c35a",
  terra: "#d4614a",
  charcoal: "#1a1a1a",
  mist: "#c8ecd6",
  glass: "rgba(255,255,255,0.07)",
  glassB: "rgba(255,255,255,0.13)",
};

// ─── Extended Food DB ────────────────────────────────────────────────────
const LOCAL_FOODS = [
  { name: "Ugali", cal: 120, carbs: 27, protein: 2, fat: 0.5, fiber: 0.4, category: "Staple", gi: "High" },
  { name: "Sukuma Wiki", cal: 35, carbs: 6, protein: 3, fat: 0.5, fiber: 2.1, category: "Vegetable", gi: "Low" },
  { name: "Managu (African Nightshade)", cal: 40, carbs: 7, protein: 4, fat: 0.6, fiber: 2.8, category: "Vegetable", gi: "Low" },
  { name: "Arrow Roots (Nduma)", cal: 112, carbs: 26, protein: 1.5, fat: 0.2, fiber: 3.4, category: "Staple", gi: "Medium" },
  { name: "Millet Porridge", cal: 90, carbs: 19, protein: 3, fat: 1, fiber: 1.8, category: "Grain", gi: "Low" },
  { name: "Omena (Silver Cyprinid)", cal: 220, carbs: 0, protein: 45, fat: 5, fiber: 0, category: "Protein", gi: "Low" },
  { name: "Njahi (Black Beans)", cal: 160, carbs: 28, protein: 10, fat: 0.6, fiber: 7.5, category: "Legume", gi: "Low" },
  { name: "Matoke (Plantain)", cal: 122, carbs: 31, protein: 1.3, fat: 0.3, fiber: 2.3, category: "Fruit/Staple", gi: "Medium" },
  { name: "Githeri (Maize & Beans)", cal: 178, carbs: 32, protein: 9, fat: 1.2, fiber: 6.2, category: "Legume", gi: "Medium" },
  { name: "Mukimo (Mashed Peas & Potato)", cal: 195, carbs: 38, protein: 6, fat: 2.1, fiber: 4.5, category: "Staple", gi: "Medium" },
  { name: "Tilapia (Grilled)", cal: 128, carbs: 0, protein: 26, fat: 2.7, fiber: 0, category: "Protein", gi: "Low" },
  { name: "Chapati", cal: 210, carbs: 35, protein: 5, fat: 6.5, fiber: 1.2, category: "Grain", gi: "High" },
  { name: "Avocado", cal: 160, carbs: 9, protein: 2, fat: 14.7, fiber: 6.7, category: "Fruit", gi: "Low" },
  { name: "Groundnuts (Roasted)", cal: 567, carbs: 16, protein: 26, fat: 49, fiber: 8.5, category: "Protein", gi: "Low" },
  { name: "Sweet Potato", cal: 86, carbs: 20, protein: 1.6, fat: 0.1, fiber: 3, category: "Staple", gi: "Medium" },
  { name: "Lentils (Kamande)", cal: 116, carbs: 20, protein: 9, fat: 0.4, fiber: 7.9, category: "Legume", gi: "Low" },
  { name: "Banana (Ndizi)", cal: 89, carbs: 23, protein: 1.1, fat: 0.3, fiber: 2.6, category: "Fruit", gi: "Medium" },
  { name: "Pawpaw (Papaya)", cal: 43, carbs: 11, protein: 0.5, fat: 0.3, fiber: 1.7, category: "Fruit", gi: "Low" },
  { name: "Sorghum Uji", cal: 75, carbs: 16, protein: 2.5, fat: 0.7, fiber: 1.5, category: "Grain", gi: "Low" },
  { name: "Kunde (Cowpeas)", cal: 149, carbs: 25, protein: 11, fat: 0.5, fiber: 6.1, category: "Legume", gi: "Low" },
];

const HEALTH_CONDITIONS = ["Diabetes Type 2", "Hypertension", "Obesity", "Cancer (Oncology)", "GI Disorder", "Mental Health", "Healthy"];

// ─── Extended Meal Plans ─────────────────────────────────────────────────
const MEAL_PLANS = {
  "Diabetes Type 2": {
    theme: "Low Glycemic & Balanced",
    color: C.mint,
    icon: "🩺",
    note: "Your meals are designed to maintain stable blood sugar. Eat at consistent times, avoid skipping meals, and prefer millet/sorghum over refined ugali. Pair carbs with protein or fat to slow glucose absorption.",
    meals: {
      Monday: { breakfast: "Sorghum uji with skim milk + 2 boiled eggs", lunch: "Ugali (small) + sukuma wiki + omena (50g)", dinner: "Arrow roots + managu + grilled tilapia", snack: "Handful of groundnuts" },
      Tuesday: { breakfast: "Oatmeal with avocado slices + black tea (no sugar)", lunch: "Brown rice + njahi beans + kachumbari", dinner: "Sweet potato + sukuma wiki + lean beef stew", snack: "Pawpaw slices" },
      Wednesday: { breakfast: "Millet porridge + boiled egg", lunch: "Arrow roots + omena + managu stir-fry", dinner: "Ugali (small) + lentil soup + steamed cabbage", snack: "Roasted soya beans" },
      Thursday: { breakfast: "Sorghum uji + avocado (¼) + egg", lunch: "Githeri + kachumbari + plain yoghurt", dinner: "Matoke (small) + sukuma wiki + tilapia (grilled)", snack: "2 passion fruits" },
      Friday: { breakfast: "Oatmeal + banana slices (½) + black tea", lunch: "Sweet potato + kunde + tomato salad", dinner: "Arrow roots + managu + beef (lean, 80g)", snack: "Groundnuts (small handful)" },
      Saturday: { breakfast: "Millet porridge + 2 boiled eggs + avocado", lunch: "Brown ugali + njahi + sukuma wiki", dinner: "Lentil soup + chapati (1 small) + kachumbari", snack: "Plain yoghurt (100g)" },
      Sunday: { breakfast: "Omelette (2 eggs, sukuma, tomato) + black tea", lunch: "Mukimo + grilled tilapia + kachumbari", dinner: "Arrow roots + lentils + steamed managu", snack: "Roasted groundnuts" },
    },
  },
  "Hypertension": {
    theme: "Low Sodium, High Potassium",
    color: C.jade,
    icon: "❤️",
    note: "Reduce salt in all preparations. Focus on potassium-rich foods like bananas, avocado, and arrow roots. DASH diet principles apply — generous vegetables, lean proteins, and limited processed foods.",
    meals: {
      Monday: { breakfast: "Oatmeal with banana + low-fat milk (no added salt)", lunch: "Ugali + sukuma wiki (no salt) + grilled fish", dinner: "Arrow roots + bean soup + tomato salad", snack: "Watermelon cubes" },
      Tuesday: { breakfast: "Millet porridge + avocado (½)", lunch: "Brown rice + managu + boiled chicken (skinless)", dinner: "Sweet potatoes + lentil soup (low sodium)", snack: "Banana" },
      Wednesday: { breakfast: "2 boiled eggs + avocado + black tea (no sugar)", lunch: "Githeri (no salt added) + kachumbari", dinner: "Matoke + sukuma wiki + tilapia (grilled)", snack: "Pawpaw" },
      Thursday: { breakfast: "Sorghum uji + boiled egg", lunch: "Sweet potato + kunde + tomato cucumber salad", dinner: "Ugali (small) + omena + managu", snack: "Watermelon / cucumber slices" },
      Friday: { breakfast: "Oatmeal + banana (½) + low-fat milk", lunch: "Brown rice + njahi + kachumbari (no salt)", dinner: "Arrow roots + lentil soup + steamed spinach", snack: "Plain yoghurt (low-fat)" },
      Saturday: { breakfast: "Millet porridge + avocado + egg", lunch: "Mukimo (light) + grilled tilapia", dinner: "Lentil soup + 1 chapati (no salt) + salad", snack: "Fresh fruits (papaya, watermelon)" },
      Sunday: { breakfast: "Omelette (no salt, with herbs) + black tea", lunch: "Ugali + sukuma wiki + chicken (boiled, no skin)", dinner: "Sweet potato + managu + lean beef (80g)", snack: "Handful groundnuts (unsalted)" },
    },
  },
  "Obesity": {
    theme: "High Fiber, Calorie Deficit",
    color: C.sand,
    icon: "⚖️",
    note: "Focus on volume eating — fill half your plate with non-starchy vegetables. Reduce refined carbs significantly. High-fiber legumes and vegetables will keep you full. Aim for 300–500 kcal daily deficit.",
    meals: {
      Monday: { breakfast: "Millet porridge (small) + 1 boiled egg + sukuma wiki", lunch: "Large salad (managu, tomato, cucumber) + omena (50g)", dinner: "Arrow roots (100g) + lentil soup (large) + cabbage", snack: "Cucumber sticks" },
      Tuesday: { breakfast: "Sorghum uji (small) + avocado (¼)", lunch: "Sukuma wiki stir-fry + boiled egg + tomato", dinner: "Matoke (small) + sukuma wiki + grilled tilapia", snack: "Pawpaw" },
      Wednesday: { breakfast: "2 boiled eggs + avocado (¼) + black tea", lunch: "Njahi beans + kachumbari (large) + steamed managu", dinner: "Githeri (small) + extra sukuma wiki", snack: "Passion fruit" },
      Thursday: { breakfast: "Oatmeal (small) + banana (½)", lunch: "Grilled fish + large vegetable salad", dinner: "Lentil soup (large) + arrow roots (small)", snack: "Plain yoghurt (100g)" },
      Friday: { breakfast: "Millet porridge + egg", lunch: "Kunde (½ cup) + sukuma wiki + tomato salad", dinner: "Sweet potato (small) + lean beef stew + managu", snack: "Watermelon" },
      Saturday: { breakfast: "Omelette (sukuma, tomato, 2 eggs)", lunch: "Brown rice (small) + omena + large vegetable salad", dinner: "Arrow roots + njahi + steamed cabbage", snack: "Cucumber + tomato" },
      Sunday: { breakfast: "Sorghum uji + boiled egg", lunch: "Grilled tilapia + sukuma wiki + kachumbari", dinner: "Lentil soup + managu + matoke (small)", snack: "Handful groundnuts" },
    },
  },
  "Cancer (Oncology)": {
    theme: "Anti-inflammatory, High Protein",
    color: C.terra,
    icon: "💊",
    note: "Prioritise easily digestible, high-protein foods. Anti-inflammatory ingredients like ginger, turmeric, and managu are beneficial. If appetite is poor, opt for smaller, frequent meals and fortified porridges. Always consult your oncology dietitian for chemo-specific adjustments.",
    meals: {
      Monday: { breakfast: "Fortified millet porridge (with groundnut paste) + boiled egg", lunch: "Matoke + omena soup + managu", dinner: "Arrow roots + lentil soup + tilapia (soft-cooked)", snack: "Avocado (½)" },
      Tuesday: { breakfast: "Sorghum uji + milk + boiled egg", lunch: "Soft githeri + steamed sukuma wiki", dinner: "Ugali (small) + bean soup + steamed managu", snack: "Banana + groundnuts" },
      Wednesday: { breakfast: "Oatmeal with milk + avocado (¼)", lunch: "Arrow roots + omena + soft vegetables", dinner: "Lentil soup + chapati (1) + steamed greens", snack: "Yoghurt + pawpaw" },
      Thursday: { breakfast: "Porridge with groundnut paste + boiled egg", lunch: "Matoke + chicken (soft-cooked) + managu soup", dinner: "Sweet potato + njahi + steamed sukuma", snack: "Avocado + banana" },
      Friday: { breakfast: "Millet uji + egg + milk", lunch: "Brown rice + omena + steamed managu", dinner: "Arrow roots + lentil soup + tilapia", snack: "Groundnuts + pawpaw" },
      Saturday: { breakfast: "Oats + avocado + milk", lunch: "Mukimo (soft) + chicken broth", dinner: "Matoke + bean soup + greens", snack: "Fortified yoghurt" },
      Sunday: { breakfast: "Sorghum porridge + egg + groundnut paste", lunch: "Ugali + omena + managu stew", dinner: "Lentil soup + arrow roots + steamed vegetables", snack: "Banana + groundnuts" },
    },
  },
  "Healthy": {
    theme: "Balanced & Wholesome",
    color: C.lime,
    icon: "🌿",
    note: "Focus on variety and balance. Include a mix of whole grains, legumes, vegetables, and lean proteins daily. Local foods are nutrient-dense and affordable — you're already winning.",
    meals: {
      Monday: { breakfast: "Millet porridge + boiled egg + avocado", lunch: "Ugali + sukuma wiki + grilled tilapia", dinner: "Arrow roots + njahi + managu stir-fry", snack: "Banana + groundnuts" },
      Tuesday: { breakfast: "Oatmeal + banana + black tea", lunch: "Githeri + kachumbari + plain yoghurt", dinner: "Sweet potato + lentil soup + sukuma wiki", snack: "Pawpaw" },
      Wednesday: { breakfast: "2 eggs + avocado + tea", lunch: "Brown rice + kunde + tomato salad", dinner: "Ugali + omena + managu", snack: "Roasted groundnuts" },
      Thursday: { breakfast: "Sorghum uji + egg", lunch: "Mukimo + tilapia + kachumbari", dinner: "Arrow roots + bean soup + steamed greens", snack: "Fresh fruit" },
      Friday: { breakfast: "Oatmeal + avocado + egg", lunch: "Chapati (1) + njahi stew + kachumbari", dinner: "Sweet potato + omena + sukuma wiki", snack: "Yoghurt" },
      Saturday: { breakfast: "Millet porridge + 2 eggs + avocado", lunch: "Brown ugali + sukuma wiki + grilled fish", dinner: "Lentil soup + matoke + managu", snack: "Banana" },
      Sunday: { breakfast: "Omelette + sukuma + tea", lunch: "Githeri + kachumbari + yoghurt", dinner: "Arrow roots + chicken stew + greens", snack: "Groundnuts + pawpaw" },
    },
  },
};

// ─── Gmail notification via Anthropic API ────────────────────────────────
const ADMIN_EMAIL = "kamadienosis@gmail.com";

async function sendEmailNotification(type, userData) {
  try {
    const subjects = {
      signup: `🌿 NutriPulse: New User Signup — ${userData.name}`,
      login: `🔐 NutriPulse: User Login — ${userData.name}`,
    };
    const bodies = {
      signup: `Hello Enosis,\n\nA new user has signed up on NutriPulse!\n\n👤 Name: ${userData.name}\n📧 Email: ${userData.email}\n📱 Phone: ${userData.phone || "Not provided"}\n🕐 Time: ${new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" })}\n\nBest,\nNutriPulse System`,
      login: `Hello Enosis,\n\nA user has logged into NutriPulse.\n\n👤 Name: ${userData.name}\n📧 Email: ${userData.email}\n🕐 Time: ${new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" })}\n\nBest,\nNutriPulse System`,
    };

    await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 200,
        system: `You are a notification system. The user wants to send an email to ${ADMIN_EMAIL}. Use the Gmail MCP tool to send this email immediately. Subject: "${subjects[type]}". Body: "${bodies[type]}". Send it and confirm.`,
        messages: [{ role: "user", content: "Send the notification email now." }],
        mcp_servers: [{ type: "url", url: "https://gmail.mcp.claude.com/mcp", name: "gmail-mcp" }],
      }),
    });
  } catch (e) {
    console.log("Email notification attempted:", type, userData.email);
  }
}

// ─── Shared styles ────────────────────────────────────────────────────────
const inputSty = {
  width: "100%", padding: "12px 16px", borderRadius: 12,
  border: "1.5px solid #d0d0d0", fontSize: 15, background: "#fff",
  color: C.charcoal, boxSizing: "border-box", outline: "none",
};
const labelSty = { display: "block", fontWeight: 700, color: C.forest, marginBottom: 6, fontSize: 13 };
const btnPrimary = {
  padding: "13px 24px", background: `linear-gradient(135deg, ${C.jade}, ${C.forest})`,
  color: "#fff", border: "none", borderRadius: 12, cursor: "pointer",
  fontWeight: 800, fontSize: 15, letterSpacing: "0.3px",
};
const errSty = { background: "#fff0ed", border: "1px solid #f5c6bc", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#c0392b" };
const okSty = { background: "#edfaf3", border: "1px solid #a8e6c4", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#27ae60" };

// ─── NAVBAR ──────────────────────────────────────────────────────────────
function Navbar({ page, setPage, user, onLogout }) {
  const [mob, setMob] = useState(false);
  const navItems = ["Dashboard", "Meal Plans", "Food Database", "Chat", "Community", "Tracking"];
  return (
    <nav style={{ background: C.forest, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 24px rgba(0,0,0,0.4)" }}>
      <style>{`
        .nav-btn{transition:all 0.2s;} .nav-btn:hover{background:rgba(126,203,161,0.12)!important;}
        .logout-btn:hover{background:rgba(255,255,255,0.18)!important;}
      `}</style>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", height: 66 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flex: 1 }} onClick={() => setPage("Dashboard")}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${C.mint}, ${C.lime})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 0 0 3px rgba(126,203,161,0.25)" }}>🌿</div>
          <span style={{ color: C.cream, fontWeight: 900, fontSize: 22, fontFamily: "'Georgia',serif", letterSpacing: "-0.5px" }}>Nutri<span style={{ color: C.lime }}>Pulse</span></span>
        </div>
        <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {navItems.map(item => (
            <button key={item} className="nav-btn" onClick={() => setPage(item)} style={{
              background: page === item ? `rgba(62,157,110,0.25)` : "transparent",
              color: page === item ? C.lime : "rgba(200,236,214,0.75)",
              border: page === item ? `1px solid rgba(126,203,161,0.3)` : "1px solid transparent",
              cursor: "pointer", padding: "8px 13px", borderRadius: 8, fontWeight: 600, fontSize: 13,
            }}>{item}</button>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 16, paddingLeft: 16, borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${C.mint}, ${C.jade})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>{user.name[0].toUpperCase()}</div>
            <div>
              <div style={{ color: C.cream, fontSize: 13, fontWeight: 700 }}>{user.name.split(" ")[0]}</div>
              <div style={{ color: C.lime, fontSize: 11, opacity: 0.8 }}>{user.condition}</div>
            </div>
            <button className="logout-btn" onClick={onLogout} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: C.lime, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700, marginLeft: 4, transition: "all 0.2s" }}>Sign out</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────
function Dashboard({ user, setPage }) {
  const stats = [
    { icon: "🔥", label: "Calories Today", value: "1,842", target: "2,100", color: C.terra, pct: 88 },
    { icon: "💧", label: "Water (ml)", value: "1,400", target: "2,500", color: "#4fc3f7", pct: 56 },
    { icon: "🩸", label: "Blood Sugar", value: "98", unit: "mg/dL", color: C.sand, pct: 72 },
    { icon: "⚖️", label: "Weight", value: "74.2", unit: "kg", color: C.mint, pct: 65 },
  ];
  const tips = [
    "🌿 Add sukuma wiki daily — it's packed with iron, folate, and vitamins A & C.",
    "🫘 Njahi beans are excellent for blood sugar control and gut health.",
    "🐟 Omena is one of Kenya's richest, most affordable sources of Omega-3 and calcium.",
    "🌾 Switch to millet or sorghum porridge for breakfast to lower your glycemic load.",
    "🥑 Avocado provides heart-healthy fats that slow glucose absorption.",
    "🌱 Managu (African Nightshade) has more iron than spinach — don't overlook it!",
  ];
  const [tipIdx] = useState(Math.floor(Math.random() * tips.length));
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ padding: "36px 28px", maxWidth: 1280, margin: "0 auto" }}>
      <style>{`.stat-card{transition:transform 0.2s,box-shadow 0.2s;}.stat-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,0.12)!important;} .qa-btn{transition:all 0.2s;} .qa-btn:hover{background:${C.mist}!important;border-color:${C.jade}!important;}`}</style>

      {/* Hero Banner */}
      <div style={{ background: `linear-gradient(135deg, ${C.forest} 0%, ${C.jade} 70%, ${C.mint} 100%)`, borderRadius: 24, padding: "40px 48px", marginBottom: 32, position: "relative", overflow: "hidden", boxShadow: "0 8px 40px rgba(15,36,25,0.35)" }}>
        <div style={{ position: "absolute", right: -30, top: -30, fontSize: 180, opacity: 0.05, transform: "rotate(15deg)", userSelect: "none" }}>🌿</div>
        <div style={{ position: "absolute", left: "55%", bottom: -20, fontSize: 100, opacity: 0.06, transform: "rotate(-10deg)", userSelect: "none" }}>🥗</div>
        <div style={{ color: C.lime, fontWeight: 700, fontSize: 13, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase", opacity: 0.9 }}>{greeting},</div>
        <h1 style={{ color: C.cream, margin: "0 0 10px", fontSize: 36, fontFamily: "'Georgia',serif", fontWeight: 800 }}>{user.name} 👋</h1>
        <p style={{ color: C.mist, margin: "0 0 28px", opacity: 0.85, fontSize: 15 }}>
          Managing: <strong>{user.condition}</strong> · {new Date().toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <button onClick={() => setPage("Meal Plans")} style={{ background: C.mint, color: C.forest, border: "none", padding: "11px 28px", borderRadius: 30, fontWeight: 800, cursor: "pointer", fontSize: 14, boxShadow: "0 4px 16px rgba(58,157,110,0.4)" }}>📅 Today's Meal Plan →</button>
          <button onClick={() => setPage("Chat")} style={{ background: "transparent", color: C.lime, border: `2px solid rgba(126,203,161,0.5)`, padding: "11px 28px", borderRadius: 30, fontWeight: 800, cursor: "pointer", fontSize: 14 }}>🤖 Ask NutriBot AI</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 16, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ background: "#fff", borderRadius: 18, padding: "22px 24px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: `1px solid rgba(200,236,214,0.6)` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontSize: 30 }}>{s.icon}</span>
              <span style={{ fontSize: 11, background: C.mist, color: C.jade, padding: "3px 10px", borderRadius: 20, fontWeight: 700 }}>{s.pct}%</span>
            </div>
            <div style={{ color: "#888", fontSize: 11, fontWeight: 700, marginTop: 12, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
            <div style={{ color: C.charcoal, fontSize: 30, fontWeight: 900, marginTop: 4 }}>
              {s.value}<span style={{ fontSize: 13, color: "#aaa", fontWeight: 400 }}>{s.unit ? ` ${s.unit}` : ""}</span>
            </div>
            {s.target && <div style={{ color: "#bbb", fontSize: 12, marginTop: 2 }}>Goal: {s.target}</div>}
            <div style={{ height: 4, background: "#f0f0f0", borderRadius: 2, marginTop: 12, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${s.pct}%`, background: `linear-gradient(90deg, ${s.color}88, ${s.color})`, borderRadius: 2, transition: "width 0.5s" }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Tip */}
        <div style={{ background: `linear-gradient(135deg, ${C.mist}, #ffffff)`, borderRadius: 18, padding: 28, border: `1.5px solid ${C.lime}`, boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
          <h3 style={{ margin: "0 0 14px", color: C.jade, fontSize: 15, fontWeight: 800 }}>💡 Daily Nutrition Insight</h3>
          <p style={{ color: C.forest, lineHeight: 1.8, margin: 0, fontSize: 15 }}>{tips[tipIdx]}</p>
        </div>
        {/* Quick Actions */}
        <div style={{ background: "#fff", borderRadius: 18, padding: 28, boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
          <h3 style={{ margin: "0 0 18px", color: C.forest, fontSize: 15, fontWeight: 800 }}>⚡ Quick Actions</h3>
          {[
            { icon: "🍽️", label: "Log a Meal", sub: "Track today's intake", page: "Tracking" },
            { icon: "📅", label: "Weekly Plan", sub: "View your meal schedule", page: "Meal Plans" },
            { icon: "🔍", label: "Food Lookup", sub: "Search 20+ local foods", page: "Food Database" },
            { icon: "💬", label: "Talk to NutriBot", sub: "AI-powered nutrition advice", page: "Chat" },
          ].map(a => (
            <button key={a.label} className="qa-btn" onClick={() => setPage(a.page)} style={{
              display: "flex", alignItems: "center", gap: 14, width: "100%", background: "#fafafa",
              border: "1.5px solid #ebebeb", borderRadius: 12, padding: "12px 16px", cursor: "pointer",
              marginBottom: 10, textAlign: "left", transition: "all 0.2s",
            }}>
              <span style={{ fontSize: 22 }}>{a.icon}</span>
              <div>
                <div style={{ color: C.forest, fontWeight: 700, fontSize: 14 }}>{a.label}</div>
                <div style={{ color: "#aaa", fontSize: 12 }}>{a.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MEAL PLANS ──────────────────────────────────────────────────────────
function MealPlans({ user }) {
  const condKey = MEAL_PLANS[user.condition] ? user.condition : "Healthy";
  const plan = MEAL_PLANS[condKey];
  const days = Object.keys(plan.meals);
  const todayIdx = new Date().getDay();
  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const todayName = dayNames[todayIdx];
  const [activeDay, setActiveDay] = useState(days.includes(todayName) ? todayName : days[0]);
  const meals = plan.meals[activeDay];

  const mealSlots = [
    { key: "breakfast", icon: "🌅", label: "Breakfast", bg: "#fffbec" },
    { key: "lunch", icon: "☀️", label: "Lunch", bg: "#edf7f0" },
    { key: "dinner", icon: "🌙", label: "Dinner", bg: "#edf1fd" },
    { key: "snack", icon: "🍎", label: "Snack", bg: "#fdf0f0" },
  ];

  return (
    <div style={{ padding: "36px 28px", maxWidth: 1280, margin: "0 auto" }}>
      <style>{`.day-btn{transition:all 0.2s;}`}</style>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ color: C.forest, fontFamily: "'Georgia',serif", fontSize: 30, margin: "0 0 6px", fontWeight: 800 }}>
            {plan.icon} Your Personalised Meal Plan
          </h2>
          <p style={{ color: "#777", margin: 0, fontSize: 15 }}>
            Condition: <strong style={{ color: plan.color }}>{condKey}</strong> · Theme: <em>{plan.theme}</em>
          </p>
        </div>
        <div style={{ background: C.forest, color: C.lime, borderRadius: 12, padding: "10px 20px", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
          📅 7-Day Full Week Plan
        </div>
      </div>

      {/* Day Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 30, flexWrap: "wrap" }}>
        {days.map(d => (
          <button key={d} className="day-btn" onClick={() => setActiveDay(d)} style={{
            padding: "10px 20px", borderRadius: 30, border: "none", cursor: "pointer",
            background: activeDay === d ? C.jade : d === todayName ? C.mist : "#f0f0f0",
            color: activeDay === d ? "#fff" : d === todayName ? C.jade : "#777",
            fontWeight: 700, fontSize: 13, outline: d === todayName && activeDay !== d ? `2px solid ${C.lime}` : "none",
          }}>{d} {d === todayName ? "• Today" : ""}</button>
        ))}
      </div>

      {/* Meal Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 20, marginBottom: 32 }}>
        {mealSlots.map(m => (
          <div key={m.key} style={{ background: m.bg, borderRadius: 18, padding: 24, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", borderTop: `4px solid ${plan.color}` }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: C.forest, marginBottom: 14 }}>{m.icon} {m.label}</div>
            <p style={{ color: "#4a4a4a", lineHeight: 1.75, margin: 0, fontSize: 14 }}>{meals[m.key] || "—"}</p>
          </div>
        ))}
      </div>

      {/* Dietitian Note */}
      <div style={{ background: `linear-gradient(135deg, ${C.forest}, ${C.jade})`, borderRadius: 18, padding: "28px 32px", color: C.cream, boxShadow: "0 8px 32px rgba(15,36,25,0.25)" }}>
        <h3 style={{ margin: "0 0 12px", color: C.lime, fontSize: 16, fontWeight: 800 }}>🩺 Dietitian's Note for {condKey}</h3>
        <p style={{ margin: 0, lineHeight: 1.85, opacity: 0.9, fontSize: 14 }}>{plan.note}</p>
      </div>
    </div>
  );
}

// ─── FOOD DATABASE ────────────────────────────────────────────────────────
function FoodDatabase() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const categories = ["All", ...new Set(LOCAL_FOODS.map(f => f.category))];
  const filtered = LOCAL_FOODS
    .filter(f => (filter === "All" || f.category === filter) && f.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === "name" ? a.name.localeCompare(b.name) : a[sortBy] - b[sortBy]);

  const giColor = { Low: "#27ae60", Medium: "#e67e22", High: "#e74c3c" };

  return (
    <div style={{ padding: "36px 28px", maxWidth: 1280, margin: "0 auto" }}>
      <style>{`.food-card{transition:all 0.2s;cursor:default;}.food-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,0.12)!important;}`}</style>
      <h2 style={{ color: C.forest, fontFamily: "'Georgia',serif", fontSize: 30, margin: "0 0 6px", fontWeight: 800 }}>🌾 Local Foods Database</h2>
      <p style={{ color: "#777", marginBottom: 28, fontSize: 15 }}>Nutritional info for {LOCAL_FOODS.length} traditional Kenyan & East African foods · Per 100g serving</p>

      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <input placeholder="🔍 Search foods..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputSty, flex: 1, minWidth: 200, borderRadius: 30, border: `2px solid ${C.lime}`, background: C.cream, padding: "12px 22px" }} />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: "12px 16px", borderRadius: 30, border: `2px solid ${C.lime}`, fontSize: 13, fontWeight: 700, color: C.forest, background: C.cream, cursor: "pointer" }}>
          <option value="name">Sort: A–Z</option>
          <option value="cal">Sort: Calories</option>
          <option value="protein">Sort: Protein</option>
          <option value="fiber">Sort: Fiber</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{ padding: "8px 18px", borderRadius: 30, border: "none", cursor: "pointer", background: filter === c ? C.jade : C.mist, color: filter === c ? "#fff" : C.forest, fontWeight: 700, fontSize: 13, transition: "all 0.2s" }}>{c}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px,1fr))", gap: 16 }}>
        {filtered.map(food => (
          <div key={food.name} className="food-card" style={{ background: "#fff", borderRadius: 18, padding: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: `1px solid ${C.mist}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <h3 style={{ margin: 0, color: C.forest, fontSize: 15, fontWeight: 800, lineHeight: 1.3 }}>{food.name}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                <span style={{ background: C.mist, color: C.jade, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{food.category}</span>
                <span style={{ background: `${giColor[food.gi]}20`, color: giColor[food.gi], padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 800 }}>GI: {food.gi}</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Calories", value: `${food.cal} kcal`, color: C.terra },
                { label: "Carbs", value: `${food.carbs}g`, color: C.sand },
                { label: "Protein", value: `${food.protein}g`, color: C.mint },
                { label: "Fat", value: `${food.fat}g`, color: "#a8d5ba" },
              ].map(n => (
                <div key={n.label} style={{ background: C.cream, borderRadius: 10, padding: "8px 12px", borderLeft: `3px solid ${n.color}` }}>
                  <div style={{ fontSize: 10, color: "#999", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{n.label}</div>
                  <div style={{ fontSize: 16, color: C.charcoal, fontWeight: 800 }}>{n.value}</div>
                </div>
              ))}
            </div>
            {food.fiber > 0 && (
              <div style={{ marginTop: 10, fontSize: 12, color: "#888", display: "flex", justifyContent: "space-between" }}>
                <span>🌿 Fiber: <strong style={{ color: C.jade }}>{food.fiber}g</strong></span>
                <span style={{ color: "#bbb" }}>per 100g</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CHATBOT (Claude API Powered) ────────────────────────────────────────
function ChatBot() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Jambo! 👋 I'm **NutriBot**, your AI-powered nutrition assistant trained on East African dietary contexts.\n\nI can help you with:\n• Diabetes, hypertension, and oncology diets\n• Local Kenyan food recommendations\n• Personalised meal planning\n• Weight management tips\n\nAsk me anything about nutrition!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const SYSTEM_PROMPT = `You are NutriBot, an expert AI nutrition assistant for NutriPulse — a health app focused on East African, specifically Kenyan nutrition. 

You have deep expertise in:
- Kenyan and East African foods: ugali, sukuma wiki, managu, omena, njahi, arrow roots, millet, sorghum, matoke, githeri, mukimo, kunde, ndizi, pawpaw, tilapia, and more
- Condition-specific diets: Diabetes Type 2, Hypertension, Obesity, Cancer/Oncology, GI Disorders, Mental Health nutrition
- Local food nutritional profiles, glycemic indices, and cooking methods
- Affordable, culturally appropriate meal planning

Guidelines:
- Always prioritize local, affordable Kenyan foods in your recommendations
- Be empathetic, warm, and encouraging
- Give practical, actionable advice
- Use simple language (mix of English, and feel free to use occasional Swahili words naturally)
- Always include a gentle reminder to consult a registered dietitian or doctor for medical conditions
- Keep responses concise but comprehensive — use bullet points for lists
- If asked about a specific condition, give condition-specific local food advice`;

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiMessages = newMessages.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }));

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });

      const data = await res.json();
      const reply = data.content?.[0]?.text || "I'm having trouble connecting right now. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Connection issue. Please check your internet and try again." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const renderText = (text) => {
    return text.split("\n").map((line, i) => {
      if (!line.trim()) return <br key={i} />;
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/^•\s/, "• ");
      return <p key={i} style={{ margin: "3px 0", lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  const quickQ = [
    "What local foods help manage diabetes?",
    "Best Kenyan foods for high blood pressure",
    "Affordable high-protein foods in Kenya",
    "What should a cancer patient eat?",
    "How to lose weight with local foods?",
    "Is ugali good for diabetics?",
  ];

  return (
    <div style={{ padding: "36px 28px", maxWidth: 960, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${C.jade}, ${C.forest})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: "0 4px 16px rgba(30,86,49,0.4)" }}>🌿</div>
        <div>
          <h2 style={{ color: C.forest, fontFamily: "'Georgia',serif", fontSize: 28, margin: 0, fontWeight: 800 }}>NutriBot AI Assistant</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#27ae60", animation: "pulse 2s ease-in-out infinite" }} />
            <span style={{ color: "#27ae60", fontSize: 13, fontWeight: 700 }}>Powered by Claude AI · Online</span>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}} @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <p style={{ color: "#888", marginBottom: 20, fontSize: 14 }}>Evidence-based nutrition guidance with local Kenyan food context</p>

      {/* Quick Questions */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {quickQ.map(q => (
          <button key={q} onClick={() => setInput(q)} style={{ background: C.mist, border: `1px solid ${C.lime}`, color: C.forest, padding: "8px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", fontWeight: 600, transition: "all 0.2s" }}>{q}</button>
        ))}
      </div>

      {/* Chat Window */}
      <div style={{ background: "#f8f7f2", borderRadius: 22, overflow: "hidden", boxShadow: "0 6px 32px rgba(0,0,0,0.12)", border: `1.5px solid ${C.lime}` }}>
        <div style={{ height: 480, overflowY: "auto", padding: "24px 24px 12px", display: "flex", flexDirection: "column", gap: 18 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", animation: "fadeUp 0.3s ease" }}>
              {m.role === "assistant" && (
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${C.jade}, ${C.forest})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginRight: 10, flexShrink: 0, alignSelf: "flex-end", boxShadow: "0 2px 8px rgba(30,86,49,0.3)" }}>🌿</div>
              )}
              <div style={{
                maxWidth: "72%", padding: "14px 18px",
                borderRadius: m.role === "user" ? "22px 6px 22px 22px" : "6px 22px 22px 22px",
                background: m.role === "user" ? `linear-gradient(135deg, ${C.jade}, ${C.forest})` : "#fff",
                color: m.role === "user" ? "#fff" : C.charcoal,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)", fontSize: 14,
              }}>
                {renderText(m.content)}
              </div>
              {m.role === "user" && (
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.mint, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, marginLeft: 10, flexShrink: 0, alignSelf: "flex-end" }}>U</div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${C.jade}, ${C.forest})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌿</div>
              <div style={{ background: "#fff", padding: "14px 20px", borderRadius: "6px 22px 22px 22px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", display: "flex", gap: 5, alignItems: "center" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.mint, animation: `pulse 1.2s ease ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.mist}`, display: "flex", gap: 12, background: "#fff" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask NutriBot anything about nutrition, diet, or local foods..."
            disabled={loading}
            style={{ flex: 1, padding: "13px 22px", borderRadius: 30, border: `2px solid ${loading ? C.mist : C.lime}`, outline: "none", fontSize: 14, background: C.cream, transition: "border-color 0.2s" }}
          />
          <button onClick={send} disabled={loading} style={{ background: loading ? "#ccc" : `linear-gradient(135deg, ${C.mint}, ${C.jade})`, color: "#fff", border: "none", width: 50, height: 50, borderRadius: "50%", cursor: loading ? "not-allowed" : "pointer", fontSize: 20, boxShadow: loading ? "none" : "0 4px 16px rgba(58,157,110,0.4)", transition: "all 0.2s" }}>→</button>
        </div>
      </div>
      <p style={{ textAlign: "center", color: "#bbb", fontSize: 12, marginTop: 14 }}>NutriBot provides educational information only. Always consult a registered dietitian for medical advice.</p>
    </div>
  );
}

// ─── COMMUNITY ───────────────────────────────────────────────────────────
function Community() {
  const [liked, setLiked] = useState({});
  const posts = [
    { author: "Jane W.", avatar: "J", time: "2h ago", title: "My 3-month diabetes journey with local foods", body: "I switched from white ugali to millet porridge and my HbA1c dropped by 0.8%! Njahi beans have been a game changer. The NutriBot AI actually recommended this combo — it works!", likes: 34, comments: 12, tag: "Diabetes", color: C.mint },
    { author: "Peter M.", avatar: "P", time: "5h ago", title: "Traditional foods that helped my cancer recovery", body: "During chemo, I survived on managu soup, arrowroot porridge, and omena. These foods kept my protein levels up even on rough days. Grateful for this community's support.", likes: 56, comments: 23, tag: "Oncology", color: C.terra },
    { author: "Amina K.", avatar: "A", time: "1d ago", title: "Weekly Challenge: 7-day sugar detox 🌿", body: "Join me this week for a 7-day refined sugar detox using only whole, local foods. I'll post daily updates! Day 1: sorghum uji + boiled eggs + sukuma wiki. Who's in?", likes: 89, comments: 41, tag: "Challenge", color: C.sand },
    { author: "David O.", avatar: "D", time: "2d ago", title: "Omena: The superfood we've been sleeping on", body: "Per 100g, omena gives you 45g of protein, loads of calcium, and Omega-3. It's cheaper than any protein supplement. We have the best superfoods right here in Kenya.", likes: 67, comments: 18, tag: "Education", color: C.jade },
  ];
  const challenges = [
    { title: "🥗 7-Day Local Foods Only", participants: 143, deadline: "4 days left", color: C.mint },
    { title: "💧 2.5L Water Daily", participants: 87, deadline: "Ongoing", color: "#4fc3f7" },
    { title: "🚶 10,000 Steps Challenge", participants: 212, deadline: "3 days left", color: C.sand },
    { title: "🌿 Meatless Mondays", participants: 58, deadline: "Weekly", color: C.jade },
  ];

  return (
    <div style={{ padding: "36px 28px", maxWidth: 1280, margin: "0 auto" }}>
      <h2 style={{ color: C.forest, fontFamily: "'Georgia',serif", fontSize: 30, margin: "0 0 6px", fontWeight: 800 }}>🌍 Community Wellness Hub</h2>
      <p style={{ color: "#777", marginBottom: 32, fontSize: 15 }}>Share stories, join challenges, and grow together</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {posts.map((p, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 20, padding: 26, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: `1px solid ${C.mist}`, borderLeft: `4px solid ${p.color}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg, ${p.color}, ${C.forest})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18 }}>{p.avatar}</div>
                <div>
                  <div style={{ fontWeight: 800, color: C.forest, fontSize: 15 }}>{p.author}</div>
                  <div style={{ fontSize: 12, color: "#bbb" }}>{p.time}</div>
                </div>
                <span style={{ marginLeft: "auto", background: `${p.color}20`, color: p.color, padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 800 }}>{p.tag}</span>
              </div>
              <h3 style={{ margin: "0 0 10px", color: C.forest, fontSize: 17, fontWeight: 800 }}>{p.title}</h3>
              <p style={{ color: "#555", lineHeight: 1.75, margin: "0 0 18px", fontSize: 14 }}>{p.body}</p>
              <div style={{ display: "flex", gap: 20, borderTop: `1px solid #f0f0f0`, paddingTop: 14 }}>
                <button onClick={() => setLiked(prev => ({ ...prev, [i]: !prev[i] }))} style={{ background: "none", border: "none", color: liked[i] ? C.terra : "#aaa", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
                  {liked[i] ? "❤️" : "🤍"} {p.likes + (liked[i] ? 1 : 0)}
                </button>
                <button style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>💬 {p.comments}</button>
                <button style={{ background: "none", border: "none", color: C.jade, cursor: "pointer", fontSize: 14, fontWeight: 800, marginLeft: "auto" }}>Share →</button>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ background: `linear-gradient(135deg, ${C.forest}, ${C.jade})`, borderRadius: 20, padding: 26, color: C.cream, marginBottom: 20, boxShadow: "0 8px 32px rgba(15,36,25,0.25)" }}>
            <h3 style={{ margin: "0 0 18px", color: C.lime, fontWeight: 800 }}>⚡ Active Challenges</h3>
            {challenges.map((ch, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 16px", marginBottom: 12 }}>
                <div style={{ fontWeight: 800, marginBottom: 4, fontSize: 14 }}>{ch.title}</div>
                <div style={{ fontSize: 12, color: C.lime, marginBottom: 10 }}>{ch.participants} participants · {ch.deadline}</div>
                <button style={{ background: C.mint, color: C.forest, border: "none", padding: "7px 18px", borderRadius: 20, cursor: "pointer", fontWeight: 800, fontSize: 12 }}>Join Challenge →</button>
              </div>
            ))}
          </div>
          <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: `1.5px solid ${C.lime}` }}>
            <h3 style={{ margin: "0 0 16px", color: C.forest, fontWeight: 800 }}>📚 Latest Articles</h3>
            {[
              { t: "Managing Diabetes with Kenyan Superfoods", icon: "🩺" },
              { t: "Oncology Nutrition: Eating Through Chemo", icon: "💊" },
              { t: "The Hidden Power of Sukuma Wiki", icon: "🌿" },
              { t: "Omena: East Africa's Most Underrated Protein", icon: "🐟" },
            ].map((a, i) => (
              <div key={i} style={{ padding: "12px 0", borderBottom: i < 3 ? `1px solid ${C.mist}` : "none", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <span style={{ fontSize: 18 }}>{a.icon}</span>
                <span style={{ color: C.jade, fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>{a.t} →</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TRACKING ─────────────────────────────────────────────────────────────
function Tracking({ user }) {
  const [meals, setMeals] = useState([
    { name: "Millet porridge + egg", time: "7:30 AM", cal: 290, meal: "Breakfast" },
    { name: "Ugali + sukuma wiki + omena", time: "1:00 PM", cal: 480, meal: "Lunch" },
  ]);
  const [newMeal, setNewMeal] = useState("");
  const [newCal, setNewCal] = useState("");
  const [mealType, setMealType] = useState("Snack");
  const [biometrics, setBiometrics] = useState({ weight: user.weight || "74.2", sugar: "98", bp: "120/80", mood: "😊" });
  const [saved, setSaved] = useState(false);

  const totalCal = meals.reduce((s, m) => s + m.cal, 0);
  const goal = 2100;
  const pct = Math.min((totalCal / goal) * 100, 100);

  const addMeal = () => {
    if (!newMeal.trim() || !newCal) return;
    setMeals(prev => [...prev, { name: newMeal, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), cal: parseInt(newCal), meal: mealType }]);
    setNewMeal(""); setNewCal("");
  };

  const bmi = user.height ? (parseFloat(biometrics.weight) / (user.height ** 2)).toFixed(1) : "—";
  const bmiLabel = !user.height ? "—" : bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  const bmiColor = !user.height ? "#aaa" : bmi < 18.5 ? "#3498db" : bmi < 25 ? "#27ae60" : bmi < 30 ? "#e67e22" : "#e74c3c";

  return (
    <div style={{ padding: "36px 28px", maxWidth: 1280, margin: "0 auto" }}>
      <h2 style={{ color: C.forest, fontFamily: "'Georgia',serif", fontSize: 30, margin: "0 0 6px", fontWeight: 800 }}>📊 Health Tracking</h2>
      <p style={{ color: "#777", marginBottom: 32, fontSize: 15 }}>Monitor your daily nutrition and biometrics</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        {/* Calorie Tracker */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 22px", color: C.forest, fontWeight: 800, fontSize: 18 }}>🔥 Calorie Tracker</h3>
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <span style={{ fontWeight: 900, fontSize: 36, color: pct > 90 ? C.terra : C.jade }}>{totalCal.toLocaleString()}</span>
              <span style={{ color: "#aaa", fontSize: 14 }}>/ {goal.toLocaleString()} kcal</span>
            </div>
            <div style={{ height: 14, background: C.mist, borderRadius: 7, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: pct > 90 ? `linear-gradient(90deg, ${C.terra}, #e74c3c)` : `linear-gradient(90deg, ${C.mint}, ${C.jade})`, borderRadius: 7, transition: "width 0.5s" }} />
            </div>
            <div style={{ textAlign: "right", fontSize: 13, color: "#aaa", marginTop: 6 }}>
              {goal - totalCal > 0 ? `${(goal - totalCal).toLocaleString()} kcal remaining` : "🎯 Daily goal reached!"}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
            {meals.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.cream, borderRadius: 12, padding: "12px 16px" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.forest }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: "#bbb" }}>{m.meal} · {m.time}</div>
                </div>
                <div style={{ fontWeight: 900, color: C.terra, fontSize: 16 }}>{m.cal} kcal</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `2px dashed ${C.mist}`, paddingTop: 18 }}>
            <div style={{ fontWeight: 800, color: C.forest, marginBottom: 12, fontSize: 14 }}>+ Log a Meal</div>
            <input placeholder="Meal description (e.g. Ugali + sukuma wiki)" value={newMeal} onChange={e => setNewMeal(e.target.value)} style={{ ...inputSty, marginBottom: 10, border: `1.5px solid ${C.lime}` }} />
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <input type="number" placeholder="Calories" value={newCal} onChange={e => setNewCal(e.target.value)} style={{ ...inputSty, flex: 1, border: `1.5px solid ${C.lime}` }} />
              <select value={mealType} onChange={e => setMealType(e.target.value)} style={{ flex: 1, padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${C.lime}`, fontSize: 14, fontWeight: 600, color: C.forest }}>
                {["Breakfast", "Lunch", "Dinner", "Snack"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <button onClick={addMeal} style={{ ...btnPrimary, width: "100%", textAlign: "center" }}>Add Meal ✓</button>
          </div>
        </div>

        {/* Biometrics + BMI */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <h3 style={{ margin: "0 0 22px", color: C.forest, fontWeight: 800, fontSize: 18 }}>📏 Biometric Log</h3>
            {[
              { label: "⚖️ Weight (kg)", key: "weight", unit: "kg" },
              { label: "🩸 Blood Sugar (mg/dL)", key: "sugar", unit: "mg/dL" },
              { label: "❤️ Blood Pressure", key: "bp", unit: "mmHg" },
            ].map(b => (
              <div key={b.key} style={{ marginBottom: 16 }}>
                <label style={labelSty}>{b.label}</label>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input value={biometrics[b.key]} onChange={e => setBiometrics(p => ({ ...p, [b.key]: e.target.value }))} style={{ ...inputSty, fontSize: 18, fontWeight: 800, border: `1.5px solid ${C.lime}` }} />
                  <span style={{ color: "#aaa", fontSize: 13, whiteSpace: "nowrap" }}>{b.unit}</span>
                </div>
              </div>
            ))}
            <div style={{ marginBottom: 18 }}>
              <label style={labelSty}>😊 Mood Today</label>
              <div style={{ display: "flex", gap: 10 }}>
                {["😄", "😊", "😐", "😞", "😫"].map(m => (
                  <button key={m} onClick={() => setBiometrics(p => ({ ...p, mood: m }))} style={{ fontSize: 28, background: biometrics.mood === m ? C.mist : "transparent", border: biometrics.mood === m ? `2px solid ${C.jade}` : "2px solid transparent", borderRadius: 12, padding: 8, cursor: "pointer", transition: "all 0.2s" }}>{m}</button>
                ))}
              </div>
            </div>
            <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} style={{ ...btnPrimary, width: "100%", textAlign: "center" }}>
              {saved ? "✅ Saved!" : "Save Today's Record"}
            </button>
          </div>

          {/* BMI Card */}
          <div style={{ background: `linear-gradient(135deg, ${C.forest}, ${C.jade})`, borderRadius: 20, padding: 28, color: C.cream, boxShadow: "0 8px 32px rgba(15,36,25,0.25)" }}>
            <h3 style={{ margin: "0 0 16px", color: C.lime, fontWeight: 800 }}>📐 BMI Calculator</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div>
                <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1, color: bmiColor }}>{bmi}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: bmiColor, marginTop: 4 }}>{bmiLabel}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 8, lineHeight: 1.6 }}>
                  Height: <strong>{user.height || "—"}m</strong><br />
                  Weight: <strong>{biometrics.weight}kg</strong>
                </div>
                <div style={{ height: 8, background: "rgba(255,255,255,0.15)", borderRadius: 4 }}>
                  <div style={{ height: "100%", width: bmi < 40 ? `${Math.min((bmi / 40) * 100, 100)}%` : "100%", background: bmiColor, borderRadius: 4, transition: "width 0.5s" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, opacity: 0.6, marginTop: 4 }}>
                  <span>18.5</span><span>25</span><span>30</span><span>40+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────
function OnboardingScreen({ onComplete, userName }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name: userName || "", age: "", height: "1.65", weight: "70", condition: "Diabetes Type 2", goal: "Manage my condition" });

  const steps = [
    { title: "Welcome to NutriPulse 🌿", subtitle: "AI-powered nutrition built for East Africa", field: "name", label: "What should we call you?", placeholder: "Your full name" },
    { title: "Your Health Profile", subtitle: "We'll personalise your meal plans accordingly", field: "condition", label: "Primary health condition", type: "select" },
    { title: "Body Metrics", subtitle: "Used to calculate your personalised calorie needs", fields: [{ field: "height", label: "Height (m)", placeholder: "e.g. 1.68" }, { field: "weight", label: "Weight (kg)", placeholder: "e.g. 72" }, { field: "age", label: "Age", placeholder: "e.g. 34" }] },
  ];
  const s = steps[step];

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${C.forest} 0%, ${C.jade} 60%, ${C.mint} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#fff", borderRadius: 24, padding: "48px 44px", maxWidth: 480, width: "100%", boxShadow: "0 32px 100px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 36 }}>
          {steps.map((_, i) => <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= step ? C.jade : C.mist, transition: "background 0.3s" }} />)}
        </div>
        <h2 style={{ fontFamily: "'Georgia',serif", color: C.forest, fontSize: 26, margin: "0 0 8px", fontWeight: 800 }}>{s.title}</h2>
        <p style={{ color: "#888", marginBottom: 28, fontSize: 14 }}>{s.subtitle}</p>
        {s.fields ? (
          s.fields.map(f => (
            <div key={f.field} style={{ marginBottom: 16 }}>
              <label style={labelSty}>{f.label}</label>
              <input value={data[f.field]} onChange={e => setData(p => ({ ...p, [f.field]: e.target.value }))} placeholder={f.placeholder} style={{ ...inputSty, border: `1.5px solid ${C.lime}` }} />
            </div>
          ))
        ) : s.type === "select" ? (
          <div>
            <label style={labelSty}>{s.label}</label>
            <select value={data[s.field]} onChange={e => setData(p => ({ ...p, [s.field]: e.target.value }))} style={{ ...inputSty, border: `1.5px solid ${C.lime}`, cursor: "pointer" }}>
              {HEALTH_CONDITIONS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        ) : (
          <div>
            <label style={labelSty}>{s.label}</label>
            <input value={data[s.field]} onChange={e => setData(p => ({ ...p, [s.field]: e.target.value }))} placeholder={s.placeholder} style={{ ...inputSty, border: `1.5px solid ${C.lime}` }} />
          </div>
        )}
        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          {step > 0 && <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: "14px", background: C.mist, color: C.forest, border: "none", borderRadius: 12, cursor: "pointer", fontWeight: 800, fontSize: 15 }}>← Back</button>}
          <button onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : onComplete({ ...data, height: parseFloat(data.height) || 1.65 })} style={{ ...btnPrimary, flex: 2 }}>
            {step < steps.length - 1 ? "Continue →" : "Start My Journey 🌿"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MOCK ACCOUNTS ────────────────────────────────────────────────────────
const MOCK_ACCOUNTS = [
  { email: "demo@nutripulse.com", password: "demo1234", name: "Demo User", condition: "Diabetes Type 2", height: 1.68, weight: "72", age: "34" },
];

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [tab, setTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const accounts = useRef([...MOCK_ACCOUNTS]);

  const handleLogin = () => {
    setError(""); setSuccess("");
    if (!loginData.email || !loginData.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setTimeout(async () => {
      const found = accounts.current.find(a => a.email.toLowerCase() === loginData.email.toLowerCase() && a.password === loginData.password);
      if (found) {
        setSuccess("Welcome back! Redirecting…");
        await sendEmailNotification("login", found);
        setTimeout(() => onAuth(found, false), 800);
      } else {
        setError("Incorrect email or password. Try demo@nutripulse.com / demo1234");
      }
      setLoading(false);
    }, 1000);
  };

  const handleSignup = () => {
    setError(""); setSuccess("");
    const { name, email, phone, password, confirm } = signupData;
    if (!name || !email || !password || !confirm) { setError("Please fill in all required fields."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (accounts.current.find(a => a.email.toLowerCase() === email.toLowerCase())) { setError("An account with this email already exists."); return; }
    setLoading(true);
    setTimeout(async () => {
      const newUser = { email, password, name, phone, condition: "Healthy", height: 1.65, weight: "65", age: "" };
      accounts.current.push(newUser);
      setSuccess("Account created! Setting up your profile…");
      await sendEmailNotification("signup", newUser);
      setTimeout(() => onAuth(newUser, true), 800);
      setLoading(false);
    }, 1100);
  };

  const handleForgot = () => {
    if (!forgotEmail) { setError("Enter your email address."); return; }
    setError("");
    setSuccess(`If ${forgotEmail} is registered, a reset link has been sent.`);
    setTimeout(() => { setForgotMode(false); setSuccess(""); }, 2500);
  };

  const pwStrength = (pw) => pw.length >= 12 ? 4 : pw.length >= 8 ? 3 : pw.length >= 6 ? 2 : pw.length > 0 ? 1 : 0;
  const pwColor = (s) => s >= 3 ? C.mint : s === 2 ? C.sand : C.terra;

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(145deg, ${C.forest} 0%, #101e15 45%, ${C.jade} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes float{0%,100%{transform:translateY(0px) rotate(var(--r))} 50%{transform:translateY(-16px) rotate(var(--r))}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .ai:focus{border-color:${C.mint}!important;box-shadow:0 0 0 3px rgba(58,157,110,0.2)!important;}
        .ab:hover{filter:brightness(1.08);transform:translateY(-1px);}
        .ab{transition:all 0.2s;}
        .tab-a{transition:all 0.25s;}
      `}</style>

      {/* BG Leaves */}
      {[{t:"8%",l:"5%",s:70,o:0.1,r:-20,d:3.5},{t:"70%",l:"3%",s:100,o:0.07,r:30,d:4.2},{t:"15%",r:"4%",s:80,o:0.09,r2:15,d:5},{t:"78%",r:"5%",s:55,o:0.11,r2:-35,d:3.8}].map((l,i)=>(
        <div key={i} style={{ position:"absolute",fontSize:l.s,top:l.t,left:l.l,right:l.r,opacity:l.o,userSelect:"none",pointerEvents:"none",animation:`float ${l.d}s ease-in-out infinite`,"--r":`${l.r||l.r2||0}deg`,transform:`rotate(${l.r||l.r2||0}deg)` }}>🌿</div>
      ))}

      <div style={{ display: "flex", width: "100%", maxWidth: 1000, borderRadius: 28, overflow: "hidden", boxShadow: "0 40px 120px rgba(0,0,0,0.5)", animation: "fadeUp 0.5s ease" }}>
        {/* Left Panel */}
        <div style={{ flex: 1, background: `linear-gradient(160deg, ${C.jade}, ${C.forest})`, padding: "60px 50px", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 320 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 52 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg, ${C.mint}, ${C.lime})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 4px 16px rgba(58,157,110,0.4)" }}>🌿</div>
              <span style={{ fontFamily: "'Georgia',serif", fontSize: 28, fontWeight: 900 }}>Nutri<span style={{ color: C.lime }}>Pulse</span></span>
            </div>
            <h2 style={{ fontSize: 36, fontFamily: "'Georgia',serif", margin: "0 0 18px", lineHeight: 1.2, fontWeight: 800 }}>Your health journey<br />starts with food. 🌱</h2>
            <p style={{ color: C.lime, lineHeight: 1.85, fontSize: 15, opacity: 0.9 }}>AI-powered nutrition for East Africa — personalised meal plans, local food insights, and real community support.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 44 }}>
            {[["🤖", "Live AI (Claude)", "Real intelligent nutrition advice"], ["🌿", "Local Foods", "20+ Kenyan foods with full macro data"], ["📅", "7-Day Plans", "Full week meal plans for your condition"], ["👥", "Community", "Learn from others on the same journey"]].map(([icon, title, desc]) => (
              <div key={title} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: C.glass, border: `1px solid ${C.glassB}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{icon}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{title}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ flex: 1.1, background: "#fff", padding: "52px 48px", overflowY: "auto", maxHeight: "90vh" }}>
          {forgotMode ? (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              <h3 style={{ color: C.forest, fontFamily: "'Georgia',serif", fontSize: 24, margin: "0 0 8px", fontWeight: 800 }}>Reset your password</h3>
              <p style={{ color: "#aaa", fontSize: 13, marginBottom: 24 }}>Enter your email and we'll send reset instructions.</p>
              <label style={labelSty}>Email Address</label>
              <input className="ai" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="you@email.com" style={{ ...inputSty, border: "1.5px solid #d0d0d0" }} />
              {error && <div style={{ ...errSty, marginTop: 14 }}>⚠️ {error}</div>}
              {success && <div style={{ ...okSty, marginTop: 14 }}>✅ {success}</div>}
              <button className="ab" onClick={handleForgot} style={{ ...btnPrimary, width: "100%", marginTop: 20, textAlign: "center" }}>Send Reset Link</button>
              <button onClick={() => { setForgotMode(false); setError(""); setSuccess(""); }} style={{ width: "100%", marginTop: 12, background: "none", border: "none", color: C.jade, fontSize: 14, cursor: "pointer", fontWeight: 700 }}>← Back to login</button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", background: "#f5f5f5", borderRadius: 14, padding: 4, marginBottom: 32 }}>
                {["login", "signup"].map(t => (
                  <button key={t} className="tab-a" onClick={() => { setTab(t); setError(""); setSuccess(""); }} style={{ flex: 1, padding: "11px", borderRadius: 11, border: "none", cursor: "pointer", fontWeight: 800, fontSize: 14, background: tab === t ? "#fff" : "transparent", color: tab === t ? C.forest : "#aaa", boxShadow: tab === t ? "0 2px 8px rgba(0,0,0,0.1)" : "none" }}>
                    {t === "login" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>

              {tab === "login" ? (
                <div style={{ animation: "fadeUp 0.3s ease" }}>
                  <h3 style={{ color: C.forest, fontFamily: "'Georgia',serif", fontSize: 24, margin: "0 0 6px", fontWeight: 800 }}>Welcome back 👋</h3>
                  <p style={{ color: "#aaa", fontSize: 13, marginBottom: 26 }}>Sign in to your NutriPulse account</p>
                  <label style={labelSty}>Email Address</label>
                  <input className="ai" type="email" value={loginData.email} onChange={e => setLoginData(p => ({ ...p, email: e.target.value }))} placeholder="you@email.com" style={{ ...inputSty, marginBottom: 16, border: "1.5px solid #d0d0d0" }} />
                  <label style={labelSty}>Password</label>
                  <div style={{ position: "relative", marginBottom: 8 }}>
                    <input className="ai" type={showPass ? "text" : "password"} value={loginData.password} onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="Your password" style={{ ...inputSty, paddingRight: 46, border: "1.5px solid #d0d0d0" }} />
                    <button onClick={() => setShowPass(p => !p)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#bbb" }}>{showPass ? "🙈" : "👁️"}</button>
                  </div>
                  <button onClick={() => setForgotMode(true)} style={{ background: "none", border: "none", color: C.jade, fontSize: 13, cursor: "pointer", fontWeight: 700, padding: 0, marginBottom: 20 }}>Forgot password?</button>
                  {error && <div style={{ ...errSty, marginBottom: 14 }}>⚠️ {error}</div>}
                  {success && <div style={{ ...okSty, marginBottom: 14 }}>✅ {success}</div>}
                  <button className="ab" onClick={handleLogin} disabled={loading} style={{ ...btnPrimary, width: "100%", textAlign: "center", opacity: loading ? 0.7 : 1 }}>
                    {loading ? <span style={{ display: "inline-block", animation: "spin 0.8s linear infinite" }}>⟳</span> : "Sign In →"}
                  </button>
                  <p style={{ textAlign: "center", color: "#ccc", fontSize: 12, marginTop: 18 }}>Demo: demo@nutripulse.com / demo1234</p>
                </div>
              ) : (
                <div style={{ animation: "fadeUp 0.3s ease" }}>
                  <h3 style={{ color: C.forest, fontFamily: "'Georgia',serif", fontSize: 24, margin: "0 0 6px", fontWeight: 800 }}>Create your account ✨</h3>
                  <p style={{ color: "#aaa", fontSize: 13, marginBottom: 24 }}>Free to join — set up takes 2 minutes</p>
                  <label style={labelSty}>Full Name <span style={{ color: C.terra }}>*</span></label>
                  <input className="ai" value={signupData.name} onChange={e => setSignupData(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Jane Wanjiku" style={{ ...inputSty, marginBottom: 14, border: "1.5px solid #d0d0d0" }} />
                  <label style={labelSty}>Email Address <span style={{ color: C.terra }}>*</span></label>
                  <input className="ai" type="email" value={signupData.email} onChange={e => setSignupData(p => ({ ...p, email: e.target.value }))} placeholder="you@email.com" style={{ ...inputSty, marginBottom: 14, border: "1.5px solid #d0d0d0" }} />
                  <label style={labelSty}>Phone <span style={{ color: "#ccc", fontWeight: 400 }}>(optional)</span></label>
                  <input className="ai" value={signupData.phone} onChange={e => setSignupData(p => ({ ...p, phone: e.target.value }))} placeholder="+254 7XX XXX XXX" style={{ ...inputSty, marginBottom: 14, border: "1.5px solid #d0d0d0" }} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                    <div>
                      <label style={labelSty}>Password <span style={{ color: C.terra }}>*</span></label>
                      <div style={{ position: "relative" }}>
                        <input className="ai" type={showPass ? "text" : "password"} value={signupData.password} onChange={e => setSignupData(p => ({ ...p, password: e.target.value }))} placeholder="Min. 6 chars" style={{ ...inputSty, paddingRight: 42, border: "1.5px solid #d0d0d0" }} />
                        <button onClick={() => setShowPass(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#bbb" }}>{showPass ? "🙈" : "👁️"}</button>
                      </div>
                    </div>
                    <div>
                      <label style={labelSty}>Confirm <span style={{ color: C.terra }}>*</span></label>
                      <input className="ai" type="password" value={signupData.confirm} onChange={e => setSignupData(p => ({ ...p, confirm: e.target.value }))} placeholder="Repeat password" style={{ ...inputSty, border: "1.5px solid #d0d0d0" }} />
                    </div>
                  </div>
                  {signupData.password && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        {[1,2,3,4].map(i => { const s = pwStrength(signupData.password); return <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= s ? pwColor(s) : "#e8e8e8", transition: "background 0.3s" }} />; })}
                      </div>
                      <span style={{ fontSize: 11, color: "#bbb" }}>{["","Too short","Weak","Good","Strong"][pwStrength(signupData.password)]}</span>
                    </div>
                  )}
                  {error && <div style={{ ...errSty, marginBottom: 14 }}>⚠️ {error}</div>}
                  {success && <div style={{ ...okSty, marginBottom: 14 }}>✅ {success}</div>}
                  <button className="ab" onClick={handleSignup} disabled={loading} style={{ ...btnPrimary, width: "100%", textAlign: "center", opacity: loading ? 0.7 : 1 }}>
                    {loading ? <span style={{ display: "inline-block", animation: "spin 0.8s linear infinite" }}>⟳</span> : "Create Account & Continue →"}
                  </button>
                  <p style={{ fontSize: 12, color: "#ccc", textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>By signing up, you agree to our <span style={{ color: C.jade, cursor: "pointer" }}>Terms</span> and <span style={{ color: C.jade, cursor: "pointer" }}>Privacy Policy</span>.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────
export default function App() {
  const [authState, setAuthState] = useState("auth");
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("Dashboard");

  const handleAuth = (userData, isNewUser) => { setUser(userData); setAuthState(isNewUser ? "onboarding" : "app"); };
  const handleOnboarding = (profileData) => { setUser(prev => ({ ...prev, ...profileData })); setAuthState("app"); };
  const handleLogout = () => { setUser(null); setAuthState("auth"); setPage("Dashboard"); };

  if (authState === "auth") return <AuthScreen onAuth={handleAuth} />;
  if (authState === "onboarding") return <OnboardingScreen onComplete={handleOnboarding} userName={user?.name} />;

  const pageMap = {
    Dashboard: <Dashboard user={user} setPage={setPage} />,
    "Meal Plans": <MealPlans user={user} />,
    "Food Database": <FoodDatabase />,
    Chat: <ChatBot />,
    Community: <Community />,
    Tracking: <Tracking user={user} />,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f4ef", fontFamily: "system-ui,'Segoe UI',sans-serif" }}>
      <style>{`
        *{box-sizing:border-box;}
        button,input,select{font-family:inherit;}
        input,select{outline:none;}
        ::-webkit-scrollbar{width:6px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:${C.lime};border-radius:3px;}
      `}</style>
      <Navbar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
      <main>{pageMap[page]}</main>
      <footer style={{ textAlign: "center", padding: "28px", color: "#bbb", fontSize: 13, borderTop: `1px solid ${C.mist}`, marginTop: 48 }}>
        NutriPulse © 2025 · AI-Powered Nutrition for East Africa · Built with ❤️ for community health
      </footer>
    </div>
  );
}
