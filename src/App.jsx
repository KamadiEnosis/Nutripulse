import { useState, useEffect, useRef } from "react";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || "";

const supabase = {
  auth: {
    signUp: async ({ email, password, options }) => {
      if (!SUPABASE_URL) return { data: null, error: { message: "No Supabase configured" } };
      const r = await fetch(`${SUPABASE_URL}/auth/v1/signup`, { method:"POST", headers:{"Content-Type":"application/json",apikey:SUPABASE_ANON_KEY}, body:JSON.stringify({ email, password, data:options?.data }) });
      const d = await r.json();
      if (d.error) return { data:null, error:d.error };
      localStorage.setItem("np_token", d.access_token);
      const userData = { ...d.user, ...options?.data };
      localStorage.setItem("np_user", JSON.stringify(userData));
      return { data:{ user:userData }, error:null };
    },
    signIn: async ({ email, password }) => {
      if (!SUPABASE_URL) return { data:null, error:{ message:"No Supabase configured" } };
      const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, { method:"POST", headers:{"Content-Type":"application/json",apikey:SUPABASE_ANON_KEY}, body:JSON.stringify({ email, password }) });
      const d = await r.json();
      if (d.error) return { data:null, error:d.error };
      localStorage.setItem("np_token", d.access_token);
      const userData = { ...d.user, ...d.user?.user_metadata };
      localStorage.setItem("np_user", JSON.stringify(userData));
      return { data:{ user:userData }, error:null };
    },
    signOut: async () => { localStorage.removeItem("np_token"); localStorage.removeItem("np_user"); return { error:null }; },
    getSession: () => {
      const token = localStorage.getItem("np_token");
      const user = localStorage.getItem("np_user");
      if (token && user) return { data:{ session:{ user:JSON.parse(user) } } };
      return { data:{ session:null } };
    },
  },
};

const C = { forest:"#0f2419", jade:"#1e5631", mint:"#3a9d6e", lime:"#7ecba1", cream:"#f7f3ed", sand:"#e8c35a", terra:"#d4614a", charcoal:"#1a1a1a", mist:"#c8ecd6", glass:"rgba(255,255,255,0.07)", glassB:"rgba(255,255,255,0.13)", gold:"#f0c040" };

const PLANS = {
  free: { name:"Free", price:0, color:C.lime, icon:"🌱", features:["Basic food database","Dashboard overview","Community (read only)","Basic tracking"], limits:{ chatMessages:3, mealPlanDays:1, aiChat:false } },
  basic: { name:"Basic", priceKES:500, priceUSD:4, period:"month", color:C.mint, icon:"🌿", features:["Full food database (20+ foods)","3-day meal plans","NutriBot AI (20 msgs/day)","Health tracking & BMI","Community participation","Email reminders"], limits:{ chatMessages:20, mealPlanDays:3, aiChat:true } },
  premium: { name:"Premium", priceKES:1200, priceUSD:9, period:"month", color:C.sand, icon:"⭐", features:["Everything in Basic","Full 7-day meal plans","Unlimited NutriBot AI","Personalised counselling","Priority dietitian reviews","Push notifications","Downloadable meal plans"], limits:{ chatMessages:Infinity, mealPlanDays:7, aiChat:true }, popular:true },
  annual: { name:"Annual", priceKES:10000, priceUSD:75, period:"year", color:C.gold, icon:"👑", features:["Everything in Premium","Save 30% vs monthly","1-on-1 dietitian session","Custom meal plan generation","Family account (4 members)"], limits:{ chatMessages:Infinity, mealPlanDays:7, aiChat:true } },
};

const LOCAL_FOODS = [
  { name:"Ugali", cal:120, carbs:27, protein:2, fat:0.5, fiber:0.4, category:"Staple", gi:"High" },
  { name:"Sukuma Wiki", cal:35, carbs:6, protein:3, fat:0.5, fiber:2.1, category:"Vegetable", gi:"Low" },
  { name:"Managu (African Nightshade)", cal:40, carbs:7, protein:4, fat:0.6, fiber:2.8, category:"Vegetable", gi:"Low" },
  { name:"Arrow Roots (Nduma)", cal:112, carbs:26, protein:1.5, fat:0.2, fiber:3.4, category:"Staple", gi:"Medium" },
  { name:"Millet Porridge", cal:90, carbs:19, protein:3, fat:1, fiber:1.8, category:"Grain", gi:"Low" },
  { name:"Omena (Silver Cyprinid)", cal:220, carbs:0, protein:45, fat:5, fiber:0, category:"Protein", gi:"Low" },
  { name:"Njahi (Black Beans)", cal:160, carbs:28, protein:10, fat:0.6, fiber:7.5, category:"Legume", gi:"Low" },
  { name:"Matoke (Plantain)", cal:122, carbs:31, protein:1.3, fat:0.3, fiber:2.3, category:"Fruit/Staple", gi:"Medium" },
  { name:"Githeri (Maize & Beans)", cal:178, carbs:32, protein:9, fat:1.2, fiber:6.2, category:"Legume", gi:"Medium" },
  { name:"Mukimo (Mashed Peas & Potato)", cal:195, carbs:38, protein:6, fat:2.1, fiber:4.5, category:"Staple", gi:"Medium" },
  { name:"Tilapia (Grilled)", cal:128, carbs:0, protein:26, fat:2.7, fiber:0, category:"Protein", gi:"Low" },
  { name:"Chapati", cal:210, carbs:35, protein:5, fat:6.5, fiber:1.2, category:"Grain", gi:"High" },
  { name:"Avocado", cal:160, carbs:9, protein:2, fat:14.7, fiber:6.7, category:"Fruit", gi:"Low" },
  { name:"Groundnuts (Roasted)", cal:567, carbs:16, protein:26, fat:49, fiber:8.5, category:"Protein", gi:"Low" },
  { name:"Sweet Potato", cal:86, carbs:20, protein:1.6, fat:0.1, fiber:3, category:"Staple", gi:"Medium" },
  { name:"Lentils (Kamande)", cal:116, carbs:20, protein:9, fat:0.4, fiber:7.9, category:"Legume", gi:"Low" },
  { name:"Banana (Ndizi)", cal:89, carbs:23, protein:1.1, fat:0.3, fiber:2.6, category:"Fruit", gi:"Medium" },
  { name:"Pawpaw (Papaya)", cal:43, carbs:11, protein:0.5, fat:0.3, fiber:1.7, category:"Fruit", gi:"Low" },
  { name:"Sorghum Uji", cal:75, carbs:16, protein:2.5, fat:0.7, fiber:1.5, category:"Grain", gi:"Low" },
  { name:"Kunde (Cowpeas)", cal:149, carbs:25, protein:11, fat:0.5, fiber:6.1, category:"Legume", gi:"Low" },
];

const HEALTH_CONDITIONS = ["Diabetes Type 2","Hypertension","Obesity","Cancer (Oncology)","GI Disorder","Mental Health","Healthy"];

const MP = {
  "Diabetes Type 2":{ theme:"Low Glycemic & Balanced", color:C.mint, icon:"🩺", note:"Eat at consistent times, prefer millet/sorghum over refined ugali. Pair carbs with protein to slow glucose absorption.", meals:{
    Monday:{breakfast:"Sorghum uji + skim milk + 2 boiled eggs",lunch:"Ugali (small) + sukuma wiki + omena (50g)",dinner:"Arrow roots + managu + grilled tilapia",snack:"Handful of groundnuts"},
    Tuesday:{breakfast:"Oatmeal + avocado slices + black tea (no sugar)",lunch:"Brown rice + njahi beans + kachumbari",dinner:"Sweet potato + sukuma wiki + lean beef stew",snack:"Pawpaw slices"},
    Wednesday:{breakfast:"Millet porridge + boiled egg",lunch:"Arrow roots + omena + managu stir-fry",dinner:"Ugali (small) + lentil soup + steamed cabbage",snack:"Roasted soya beans"},
    Thursday:{breakfast:"Sorghum uji + avocado (1/4) + egg",lunch:"Githeri + kachumbari + plain yoghurt",dinner:"Matoke (small) + sukuma wiki + tilapia (grilled)",snack:"2 passion fruits"},
    Friday:{breakfast:"Oatmeal + banana slices (1/2) + black tea",lunch:"Sweet potato + kunde + tomato salad",dinner:"Arrow roots + managu + beef (lean, 80g)",snack:"Groundnuts (small handful)"},
    Saturday:{breakfast:"Millet porridge + 2 boiled eggs + avocado",lunch:"Brown ugali + njahi + sukuma wiki",dinner:"Lentil soup + chapati (1 small) + kachumbari",snack:"Plain yoghurt (100g)"},
    Sunday:{breakfast:"Omelette (2 eggs, sukuma, tomato) + black tea",lunch:"Mukimo + grilled tilapia + kachumbari",dinner:"Arrow roots + lentils + steamed managu",snack:"Roasted groundnuts"},
  }},
  "Hypertension":{ theme:"Low Sodium, High Potassium", color:C.jade, icon:"❤️", note:"Reduce salt in all preparations. Focus on potassium-rich foods like bananas, avocado, and arrow roots.", meals:{
    Monday:{breakfast:"Oatmeal + banana + low-fat milk (no salt)",lunch:"Ugali + sukuma wiki (no salt) + grilled fish",dinner:"Arrow roots + bean soup + tomato salad",snack:"Watermelon cubes"},
    Tuesday:{breakfast:"Millet porridge + avocado (1/2)",lunch:"Brown rice + managu + boiled chicken (skinless)",dinner:"Sweet potatoes + lentil soup (low sodium)",snack:"Banana"},
    Wednesday:{breakfast:"2 boiled eggs + avocado + black tea",lunch:"Githeri (no salt) + kachumbari",dinner:"Matoke + sukuma wiki + tilapia (grilled)",snack:"Pawpaw"},
    Thursday:{breakfast:"Sorghum uji + boiled egg",lunch:"Sweet potato + kunde + tomato cucumber salad",dinner:"Ugali (small) + omena + managu",snack:"Watermelon / cucumber slices"},
    Friday:{breakfast:"Oatmeal + banana (1/2) + low-fat milk",lunch:"Brown rice + njahi + kachumbari (no salt)",dinner:"Arrow roots + lentil soup + steamed spinach",snack:"Plain yoghurt (low-fat)"},
    Saturday:{breakfast:"Millet porridge + avocado + egg",lunch:"Mukimo (light) + grilled tilapia",dinner:"Lentil soup + 1 chapati (no salt) + salad",snack:"Fresh fruits (papaya, watermelon)"},
    Sunday:{breakfast:"Omelette (no salt, with herbs) + black tea",lunch:"Ugali + sukuma wiki + chicken (boiled, no skin)",dinner:"Sweet potato + managu + lean beef (80g)",snack:"Groundnuts (unsalted)"},
  }},
  "Obesity":{ theme:"High Fiber, Calorie Deficit", color:C.sand, icon:"⚖️", note:"Fill half your plate with non-starchy vegetables. Reduce refined carbs. Aim for 300-500 kcal daily deficit.", meals:{
    Monday:{breakfast:"Millet porridge (small) + 1 boiled egg + sukuma wiki",lunch:"Large salad (managu, tomato, cucumber) + omena (50g)",dinner:"Arrow roots (100g) + lentil soup (large) + cabbage",snack:"Cucumber sticks"},
    Tuesday:{breakfast:"Sorghum uji (small) + avocado (1/4)",lunch:"Sukuma wiki stir-fry + boiled egg + tomato",dinner:"Matoke (small) + sukuma wiki + grilled tilapia",snack:"Pawpaw"},
    Wednesday:{breakfast:"2 boiled eggs + avocado (1/4) + black tea",lunch:"Njahi beans + kachumbari (large) + steamed managu",dinner:"Githeri (small) + extra sukuma wiki",snack:"Passion fruit"},
    Thursday:{breakfast:"Oatmeal (small) + banana (1/2)",lunch:"Grilled fish + large vegetable salad",dinner:"Lentil soup (large) + arrow roots (small)",snack:"Plain yoghurt (100g)"},
    Friday:{breakfast:"Millet porridge + egg",lunch:"Kunde (1/2 cup) + sukuma wiki + tomato salad",dinner:"Sweet potato (small) + lean beef stew + managu",snack:"Watermelon"},
    Saturday:{breakfast:"Omelette (sukuma, tomato, 2 eggs)",lunch:"Brown rice (small) + omena + large vegetable salad",dinner:"Arrow roots + njahi + steamed cabbage",snack:"Cucumber + tomato"},
    Sunday:{breakfast:"Sorghum uji + boiled egg",lunch:"Grilled tilapia + sukuma wiki + kachumbari",dinner:"Lentil soup + managu + matoke (small)",snack:"Handful groundnuts"},
  }},
  "Cancer (Oncology)":{ theme:"Anti-inflammatory, High Protein", color:C.terra, icon:"💊", note:"Prioritise easily digestible, high-protein foods. Anti-inflammatory managu, ginger, and turmeric are beneficial. Always consult your oncology dietitian.", meals:{
    Monday:{breakfast:"Fortified millet porridge (with groundnut paste) + boiled egg",lunch:"Matoke + omena soup + managu",dinner:"Arrow roots + lentil soup + tilapia (soft-cooked)",snack:"Avocado (1/2)"},
    Tuesday:{breakfast:"Sorghum uji + milk + boiled egg",lunch:"Soft githeri + steamed sukuma wiki",dinner:"Ugali (small) + bean soup + steamed managu",snack:"Banana + groundnuts"},
    Wednesday:{breakfast:"Oatmeal with milk + avocado (1/4)",lunch:"Arrow roots + omena + soft vegetables",dinner:"Lentil soup + chapati (1) + steamed greens",snack:"Yoghurt + pawpaw"},
    Thursday:{breakfast:"Porridge with groundnut paste + boiled egg",lunch:"Matoke + chicken (soft-cooked) + managu soup",dinner:"Sweet potato + njahi + steamed sukuma",snack:"Avocado + banana"},
    Friday:{breakfast:"Millet uji + egg + milk",lunch:"Brown rice + omena + steamed managu",dinner:"Arrow roots + lentil soup + tilapia",snack:"Groundnuts + pawpaw"},
    Saturday:{breakfast:"Oats + avocado + milk",lunch:"Mukimo (soft) + chicken broth",dinner:"Matoke + bean soup + greens",snack:"Fortified yoghurt"},
    Sunday:{breakfast:"Sorghum porridge + egg + groundnut paste",lunch:"Ugali + omena + managu stew",dinner:"Lentil soup + arrow roots + steamed vegetables",snack:"Banana + groundnuts"},
  }},
  "Healthy":{ theme:"Balanced & Wholesome", color:C.lime, icon:"🌿", note:"Focus on variety and balance. Local foods are nutrient-dense and affordable.", meals:{
    Monday:{breakfast:"Millet porridge + boiled egg + avocado",lunch:"Ugali + sukuma wiki + grilled tilapia",dinner:"Arrow roots + njahi + managu stir-fry",snack:"Banana + groundnuts"},
    Tuesday:{breakfast:"Oatmeal + banana + black tea",lunch:"Githeri + kachumbari + plain yoghurt",dinner:"Sweet potato + lentil soup + sukuma wiki",snack:"Pawpaw"},
    Wednesday:{breakfast:"2 eggs + avocado + tea",lunch:"Brown rice + kunde + tomato salad",dinner:"Ugali + omena + managu",snack:"Roasted groundnuts"},
    Thursday:{breakfast:"Sorghum uji + egg",lunch:"Mukimo + tilapia + kachumbari",dinner:"Arrow roots + bean soup + steamed greens",snack:"Fresh fruit"},
    Friday:{breakfast:"Oatmeal + avocado + egg",lunch:"Chapati (1) + njahi stew + kachumbari",dinner:"Sweet potato + omena + sukuma wiki",snack:"Yoghurt"},
    Saturday:{breakfast:"Millet porridge + 2 eggs + avocado",lunch:"Brown ugali + sukuma wiki + grilled fish",dinner:"Lentil soup + matoke + managu",snack:"Banana"},
    Sunday:{breakfast:"Omelette + sukuma + tea",lunch:"Githeri + kachumbari + yoghurt",dinner:"Arrow roots + chicken stew + greens",snack:"Groundnuts + pawpaw"},
  }},
};

async function callNutriBot(messages) {
  try {
    const res = await fetch("/api/chat", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ messages }) });
    const data = await res.json();
    return data.reply || "I am having trouble connecting. Please try again.";
  } catch { return "Connection issue. Please check your internet and try again."; }
}

async function sendNotification(type, user) {
  try { await fetch("/api/notify", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ type, user }) }); } catch(e) {}
}

const iSty = { width:"100%", padding:"12px 16px", borderRadius:12, border:"1.5px solid #d0d0d0", fontSize:15, background:"#fff", color:"#1a1a1a", boxSizing:"border-box", outline:"none" };
const lSty = { display:"block", fontWeight:700, color:"#0f2419", marginBottom:6, fontSize:13 };
const bPri = { padding:"13px 24px", background:"linear-gradient(135deg, #1e5631, #0f2419)", color:"#fff", border:"none", borderRadius:12, cursor:"pointer", fontWeight:800, fontSize:15 };
const eSty = { background:"#fff0ed", border:"1px solid #f5c6bc", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#c0392b" };
const okSty = { background:"#edfaf3", border:"1px solid #a8e6c4", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#27ae60" };

function SubscriptionPage({ user, onUpgrade, onBack }) {
  const [selected, setSelected] = useState("premium");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleSubscribe = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    await sendNotification("subscription", { ...user, plan:PLANS[selected].name });
    setLoading(false); setSuccess(true);
    setTimeout(() => onUpgrade(selected), 1500);
  };
  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(135deg, ${C.forest}, ${C.jade})`, padding:"40px 24px" }}>
      <div style={{ maxWidth:1000, margin:"0 auto" }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", color:C.lime, padding:"8px 16px", borderRadius:20, cursor:"pointer", fontWeight:700, fontSize:13, marginBottom:32 }}>← Back</button>
        <div style={{ textAlign:"center", marginBottom:44 }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🌿</div>
          <h1 style={{ color:C.cream, fontFamily:"'Georgia',serif", fontSize:34, margin:"0 0 10px", fontWeight:800 }}>Choose Your Plan</h1>
          <p style={{ color:C.lime, fontSize:15, opacity:0.9 }}>Unlock personalised nutrition, AI counselling and full meal plans</p>
        </div>
        {success && <div style={{ background:"rgba(126,203,161,0.2)", border:"2px solid #7ecba1", borderRadius:16, padding:24, textAlign:"center", marginBottom:28, color:"#fff" }}><div style={{ fontSize:36, marginBottom:8 }}>🎉</div><div style={{ fontWeight:800, fontSize:18 }}>Welcome to {PLANS[selected].name}!</div></div>}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(210px,1fr))", gap:18, marginBottom:36 }}>
          {Object.entries(PLANS).map(([key, plan]) => (
            <div key={key} onClick={() => setSelected(key)} style={{ background:selected===key?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.06)", border:selected===key?`2px solid ${plan.color}`:"2px solid rgba(255,255,255,0.1)", borderRadius:18, padding:22, cursor:"pointer", transition:"all 0.2s", position:"relative", transform:selected===key?"translateY(-4px)":"none" }}>
              {plan.popular && <div style={{ position:"absolute", top:-11, left:"50%", transform:"translateX(-50%)", background:C.sand, color:C.forest, padding:"3px 14px", borderRadius:20, fontSize:10, fontWeight:900, whiteSpace:"nowrap" }}>MOST POPULAR</div>}
              <div style={{ fontSize:26, marginBottom:6 }}>{plan.icon}</div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:17, marginBottom:4 }}>{plan.name}</div>
              <div style={{ color:plan.color, fontWeight:900, fontSize:22, marginBottom:14 }}>{plan.price===0?"FREE":`KES ${plan.priceKES?.toLocaleString()}`}{plan.period&&<span style={{ fontSize:12, fontWeight:400, opacity:0.8 }}>/{plan.period}</span>}</div>
              {plan.priceUSD && <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, marginBottom:12 }}>approx. USD ${plan.priceUSD}/{plan.period}</div>}
              <ul style={{ listStyle:"none", padding:0, margin:0 }}>
                {plan.features.map((f,i) => <li key={i} style={{ color:"rgba(255,255,255,0.85)", fontSize:12, padding:"3px 0", display:"flex", alignItems:"flex-start", gap:6 }}><span style={{ color:plan.color, fontWeight:800, flexShrink:0 }}>v</span>{f}</li>)}
              </ul>
            </div>
          ))}
        </div>
        {selected!=="free" && (
          <div style={{ maxWidth:460, margin:"0 auto" }}>
            <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:14, padding:22, marginBottom:16 }}>
              <h3 style={{ color:C.lime, margin:"0 0 14px", fontWeight:800, fontSize:15 }}>Payment Options</h3>
              {[{icon:"📱",label:"M-Pesa",desc:"Pay via M-Pesa Paybill"},{icon:"💳",label:"Card",desc:"Visa / Mastercard"},{icon:"🏦",label:"Bank Transfer",desc:"Direct bank transfer"}].map(p => (
                <div key={p.label} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px", background:"rgba(255,255,255,0.06)", borderRadius:10, marginBottom:8, cursor:"pointer", border:"1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ fontSize:20 }}>{p.icon}</span>
                  <div><div style={{ color:"#fff", fontWeight:700, fontSize:13 }}>{p.label}</div><div style={{ color:"rgba(255,255,255,0.6)", fontSize:11 }}>{p.desc}</div></div>
                </div>
              ))}
              <div style={{ background:"rgba(126,203,161,0.1)", border:"1px solid rgba(126,203,161,0.3)", borderRadius:10, padding:"10px 14px", marginTop:10, color:C.lime, fontSize:12 }}>Secure payment · Cancel anytime · 7-day free trial</div>
            </div>
            <button onClick={handleSubscribe} disabled={loading||success} style={{ width:"100%", padding:"15px", borderRadius:12, border:"none", cursor:loading?"not-allowed":"pointer", background:loading?"#aaa":`linear-gradient(135deg, ${PLANS[selected].color}, ${C.jade})`, color:C.forest, fontWeight:900, fontSize:16 }}>
              {loading?"Processing...":success?"Done!":`Start ${PLANS[selected].name} — KES ${PLANS[selected].priceKES?.toLocaleString()}/${PLANS[selected].period}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ReminderSystem() {
  const [reminders, setReminders] = useState(() => {
    try { return JSON.parse(localStorage.getItem("np_reminders")) || [
      { id:1, type:"meal", label:"Breakfast time", icon:"🌅", time:"07:00", enabled:true },
      { id:2, type:"meal", label:"Lunch time", icon:"☀️", time:"13:00", enabled:true },
      { id:3, type:"meal", label:"Dinner time", icon:"🌙", time:"19:00", enabled:true },
      { id:4, type:"water", label:"Drink water", icon:"💧", time:"10:00", enabled:false },
      { id:5, type:"water", label:"Drink water", icon:"💧", time:"15:00", enabled:false },
      { id:6, type:"challenge", label:"Daily challenge check", icon:"⚡", time:"09:00", enabled:false },
    ]; } catch { return []; }
  });
  const [toast, setToast] = useState(null);

  const save = (updated) => { setReminders(updated); localStorage.setItem("np_reminders", JSON.stringify(updated)); };
  const toggle = (id) => save(reminders.map(r => r.id===id?{...r,enabled:!r.enabled}:r));

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const t = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
      reminders.forEach(r => { if (r.enabled && r.time===t) { setToast(`${r.icon} ${r.label}`); setTimeout(() => setToast(null), 5000); if ("Notification" in window && Notification.permission==="granted") new Notification("NutriPulse", { body:r.label }); }});
    };
    const iv = setInterval(check, 60000);
    return () => clearInterval(iv);
  }, [reminders]);

  useEffect(() => { if ("Notification" in window && Notification.permission==="default") Notification.requestPermission(); }, []);

  const typeColors = { meal:C.mint, water:"#4fc3f7", challenge:C.sand };

  return (
    <>
      {toast && <div style={{ position:"fixed", top:76, right:20, background:C.forest, color:C.cream, padding:"12px 18px", borderRadius:12, boxShadow:"0 8px 32px rgba(0,0,0,0.3)", zIndex:1000, display:"flex", alignItems:"center", gap:10, maxWidth:280 }}><span style={{ fontSize:20 }}>🌿</span><div><div style={{ fontWeight:800, fontSize:13 }}>NutriPulse Reminder</div><div style={{ fontSize:12, color:C.lime }}>{toast}</div></div><button onClick={() => setToast(null)} style={{ background:"none", border:"none", color:"#aaa", cursor:"pointer", fontSize:16, marginLeft:6 }}>x</button></div>}
      <div style={{ padding:"32px 24px", maxWidth:700, margin:"0 auto" }}>
        <h2 style={{ color:C.forest, fontFamily:"'Georgia',serif", fontSize:28, margin:"0 0 6px", fontWeight:800 }}>🔔 Reminders</h2>
        <p style={{ color:"#777", marginBottom:24, fontSize:14 }}>Set daily reminders for meals, water and challenges</p>
        <div style={{ background:"#fff", borderRadius:16, padding:22, boxShadow:"0 2px 12px rgba(0,0,0,0.06)", marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h3 style={{ margin:0, color:C.forest, fontWeight:800, fontSize:15 }}>Your Reminders</h3>
            <button onClick={() => { if ("Notification" in window) Notification.requestPermission().then(p => { if (p==="granted") setToast("Browser notifications enabled!"); }); }} style={{ background:C.mist, border:`1px solid ${C.lime}`, color:C.jade, padding:"7px 14px", borderRadius:20, cursor:"pointer", fontWeight:700, fontSize:12 }}>Enable Browser Alerts</button>
          </div>
          {reminders.map(r => (
            <div key={r.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", background:r.enabled?`${typeColors[r.type]}15`:"#fafafa", borderRadius:10, marginBottom:8, border:`1.5px solid ${r.enabled?typeColors[r.type]:"#ebebeb"}`, transition:"all 0.2s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:20 }}>{r.icon}</span>
                <div><div style={{ fontWeight:700, color:C.forest, fontSize:13 }}>{r.label}</div><div style={{ color:"#aaa", fontSize:11 }}>Daily at {r.time}</div></div>
              </div>
              <div onClick={() => toggle(r.id)} style={{ width:44, height:24, borderRadius:12, background:r.enabled?C.jade:"#ddd", cursor:"pointer", position:"relative", transition:"background 0.2s" }}>
                <div style={{ width:20, height:20, borderRadius:"50%", background:"#fff", position:"absolute", top:2, left:r.enabled?22:2, transition:"left 0.2s", boxShadow:"0 2px 4px rgba(0,0,0,0.2)" }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:`linear-gradient(135deg, ${C.forest}, ${C.jade})`, borderRadius:14, padding:20, color:C.cream }}>
          <h3 style={{ margin:"0 0 8px", color:C.lime, fontWeight:800, fontSize:14 }}>Tip</h3>
          <p style={{ margin:0, fontSize:13, opacity:0.9, lineHeight:1.7 }}>Click "Enable Browser Alerts" to receive reminders even when NutriPulse is not open in your browser.</p>
        </div>
      </div>
    </>
  );
}

function Navbar({ page, setPage, user, onLogout, plan }) {
  const planConfig = PLANS[plan] || PLANS.free;
  const navItems = ["Dashboard","Meal Plans","Food Database","Chat","Community","Tracking","Reminders"];
  return (
    <nav style={{ background:C.forest, position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 24px rgba(0,0,0,0.4)" }}>
      <style>{`.nb{transition:all 0.2s;} .nb:hover{background:rgba(126,203,161,0.12)!important;}`}</style>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 18px", display:"flex", alignItems:"center", height:62 }}>
        <div style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer", flex:1 }} onClick={() => setPage("Dashboard")}>
          <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg, ${C.mint}, ${C.lime})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🌿</div>
          <span style={{ color:C.cream, fontWeight:900, fontSize:19, fontFamily:"'Georgia',serif" }}>Nutri<span style={{ color:C.lime }}>Pulse</span></span>
        </div>
        <div style={{ display:"flex", gap:1, alignItems:"center", flexWrap:"wrap" }}>
          {navItems.map(item => <button key={item} className="nb" onClick={() => setPage(item)} style={{ background:page===item?"rgba(62,157,110,0.25)":"transparent", color:page===item?C.lime:"rgba(200,236,214,0.75)", border:page===item?`1px solid rgba(126,203,161,0.3)`:"1px solid transparent", cursor:"pointer", padding:"6px 10px", borderRadius:8, fontWeight:600, fontSize:12 }}>{item}</button>)}
          <div onClick={() => setPage("Subscription")} style={{ background:`${planConfig.color}22`, border:`1px solid ${planConfig.color}`, color:planConfig.color, padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:800, cursor:"pointer", marginLeft:6 }}>{planConfig.icon} {planConfig.name}</div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:8, paddingLeft:8, borderLeft:"1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg, ${C.mint}, ${C.jade})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:12 }}>{user?.name?.[0]?.toUpperCase()||"U"}</div>
            <button onClick={onLogout} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:C.lime, borderRadius:8, padding:"5px 10px", cursor:"pointer", fontSize:11, fontWeight:700 }}>Sign out</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Dashboard({ user, setPage, plan }) {
  const isPremium = plan==="premium"||plan==="annual";
  const isBasicPlus = plan!=="free";
  const h = new Date().getHours();
  const gr = h<12?"Good morning":h<17?"Good afternoon":"Good evening";
  const tips = ["🌿 Sukuma wiki is packed with iron, folate, and vitamins A & C — add it daily.","🫘 Njahi beans are excellent for blood sugar control and gut health.","🐟 Omena is one of Kenya's richest sources of Omega-3 and calcium.","🌾 Switch to millet or sorghum porridge for breakfast to lower your glycemic load.","🥑 Avocado's heart-healthy fats slow glucose absorption."];
  const [tipIdx] = useState(Math.floor(Math.random()*tips.length));
  return (
    <div style={{ padding:"32px 22px", maxWidth:1280, margin:"0 auto" }}>
      {plan==="free" && <div onClick={() => setPage("Subscription")} style={{ background:`linear-gradient(135deg, ${C.sand}, #e0a800)`, borderRadius:12, padding:"13px 22px", marginBottom:22, display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}><span style={{ fontSize:22 }}>⭐</span><div><div style={{ fontWeight:800, color:C.forest, fontSize:14 }}>Upgrade to unlock the full NutriPulse experience</div><div style={{ color:"rgba(15,36,25,0.7)", fontSize:12 }}>Full meal plans, unlimited AI chat, and personalised counselling from KES 500/month</div></div></div>
        <div style={{ background:C.forest, color:C.lime, padding:"7px 16px", borderRadius:20, fontWeight:800, fontSize:12, whiteSpace:"nowrap" }}>Upgrade →</div>
      </div>}
      <div style={{ background:`linear-gradient(135deg, ${C.forest} 0%, ${C.jade} 70%, ${C.mint} 100%)`, borderRadius:20, padding:"34px 42px", marginBottom:26, position:"relative", overflow:"hidden", boxShadow:"0 8px 40px rgba(15,36,25,0.35)" }}>
        <div style={{ position:"absolute", right:-20, top:-20, fontSize:150, opacity:0.05, transform:"rotate(15deg)", userSelect:"none" }}>🌿</div>
        <div style={{ color:C.lime, fontWeight:700, fontSize:11, marginBottom:6, letterSpacing:1, textTransform:"uppercase" }}>{gr},</div>
        <h1 style={{ color:C.cream, margin:"0 0 8px", fontSize:30, fontFamily:"'Georgia',serif", fontWeight:800 }}>{user?.name||"there"} 👋</h1>
        <p style={{ color:C.mist, margin:"0 0 22px", opacity:0.85, fontSize:13 }}>Managing: <strong>{user?.condition||"General Health"}</strong> · {new Date().toLocaleDateString("en-KE",{weekday:"long",day:"numeric",month:"long"})}</p>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <button onClick={() => setPage("Meal Plans")} style={{ background:C.mint, color:C.forest, border:"none", padding:"9px 22px", borderRadius:30, fontWeight:800, cursor:"pointer", fontSize:13 }}>Today's Meal Plan →</button>
          <button onClick={() => setPage("Chat")} style={{ background:"transparent", color:C.lime, border:`2px solid rgba(126,203,161,0.5)`, padding:"9px 22px", borderRadius:30, fontWeight:800, cursor:"pointer", fontSize:13 }}>Ask NutriBot AI {!isBasicPlus?"(3 free)":""}</button>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div style={{ background:`linear-gradient(135deg, ${C.mist}, #fff)`, borderRadius:14, padding:22, border:`1.5px solid ${C.lime}` }}>
          <h3 style={{ margin:"0 0 10px", color:C.jade, fontSize:13, fontWeight:800 }}>Daily Nutrition Insight</h3>
          <p style={{ color:C.forest, lineHeight:1.8, margin:0, fontSize:13 }}>{tips[tipIdx]}</p>
        </div>
        <div style={{ background:"#fff", borderRadius:14, padding:22, boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
          <h3 style={{ margin:"0 0 14px", color:C.forest, fontSize:13, fontWeight:800 }}>Quick Actions</h3>
          {[{icon:"🍽️",label:"Log a Meal",sub:"Track today's intake",page:"Tracking"},{icon:"📅",label:"Weekly Plan",sub:isPremium?"Full 7-day plan":"Preview (upgrade for full)",page:"Meal Plans"},{icon:"💬",label:"NutriBot AI",sub:isBasicPlus?"Ask anything":"3 free questions",page:"Chat"},{icon:"⭐",label:plan==="free"?"Upgrade Plan":"My Subscription",sub:plan==="free"?"From KES 500/month":`${PLANS[plan]?.name} active`,page:"Subscription"}].map(a => (
            <button key={a.label} onClick={() => setPage(a.page)} style={{ display:"flex", alignItems:"center", gap:10, width:"100%", background:"#fafafa", border:"1.5px solid #ebebeb", borderRadius:9, padding:"9px 12px", cursor:"pointer", marginBottom:7, textAlign:"left", transition:"all 0.2s" }}>
              <span style={{ fontSize:18 }}>{a.icon}</span><div><div style={{ color:C.forest, fontWeight:700, fontSize:12 }}>{a.label}</div><div style={{ color:"#aaa", fontSize:11 }}>{a.sub}</div></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MealPlans({ user, plan, setPage }) {
  const isPremium = plan==="premium"||plan==="annual";
  const isBasic = plan==="basic";
  const condKey = MP[user?.condition]?user.condition:"Healthy";
  const planData = MP[condKey];
  const allDays = Object.keys(planData.meals);
  const allowed = isPremium?allDays:isBasic?allDays.slice(0,3):allDays.slice(0,1);
  const todayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];
  const [activeDay, setActiveDay] = useState(allowed.includes(todayName)?todayName:allowed[0]);
  const meals = planData.meals[activeDay];
  const slots = [{key:"breakfast",icon:"🌅",label:"Breakfast",bg:"#fffbec"},{key:"lunch",icon:"☀️",label:"Lunch",bg:"#edf7f0"},{key:"dinner",icon:"🌙",label:"Dinner",bg:"#edf1fd"},{key:"snack",icon:"🍎",label:"Snack",bg:"#fdf0f0"}];
  return (
    <div style={{ padding:"32px 22px", maxWidth:1280, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22, flexWrap:"wrap", gap:10 }}>
        <div><h2 style={{ color:C.forest, fontFamily:"'Georgia',serif", fontSize:26, margin:"0 0 4px", fontWeight:800 }}>{planData.icon} Personalised Meal Plan</h2><p style={{ color:"#777", margin:0, fontSize:13 }}>Condition: <strong style={{ color:planData.color }}>{condKey}</strong> · {planData.theme}</p></div>
        {!isPremium && <button onClick={() => setPage("Subscription")} style={{ background:`linear-gradient(135deg, ${C.sand}, #e0a800)`, color:C.forest, border:"none", padding:"9px 18px", borderRadius:20, fontWeight:800, cursor:"pointer", fontSize:12 }}>Unlock Full 7-Day Plan</button>}
      </div>
      <div style={{ display:"flex", gap:7, marginBottom:22, flexWrap:"wrap" }}>
        {allDays.map(d => { const locked = !allowed.includes(d); return <button key={d} onClick={() => !locked&&setActiveDay(d)} style={{ padding:"8px 15px", borderRadius:30, border:"none", cursor:locked?"not-allowed":"pointer", background:locked?"#f0f0f0":activeDay===d?planData.color:d===todayName?C.mist:"#f5f5f0", color:locked?"#ccc":activeDay===d?"#fff":d===todayName?C.jade:"#777", fontWeight:700, fontSize:12, opacity:locked?0.6:1 }}>{d}{d===todayName?" •":""} {locked?"🔒":""}</button>; })}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(230px,1fr))", gap:14, marginBottom:22 }}>
        {slots.map(m => <div key={m.key} style={{ background:m.bg, borderRadius:14, padding:20, boxShadow:"0 2px 10px rgba(0,0,0,0.06)", borderTop:`4px solid ${planData.color}` }}><div style={{ fontWeight:800, fontSize:13, color:C.forest, marginBottom:10 }}>{m.icon} {m.label}</div><p style={{ color:"#4a4a4a", lineHeight:1.75, margin:0, fontSize:13 }}>{meals?.[m.key]||"—"}</p></div>)}
      </div>
      {!isPremium && <div style={{ background:"#f8f8f8", borderRadius:14, padding:20, border:`2px dashed ${C.lime}`, textAlign:"center", marginBottom:16 }}><div style={{ fontSize:28, marginBottom:6 }}>🔒</div><div style={{ fontWeight:800, color:C.forest, fontSize:15, marginBottom:4 }}>{isBasic?"Days 4–7 locked":"Days 2–7 locked"}</div><div style={{ color:"#888", fontSize:13, marginBottom:14 }}>Upgrade to {isBasic?"Premium":"Basic or Premium"} to unlock more days</div><button onClick={() => setPage("Subscription")} style={{ ...bPri, fontSize:13 }}>Upgrade Now</button></div>}
      <div style={{ background:`linear-gradient(135deg, ${C.forest}, ${C.jade})`, borderRadius:14, padding:"22px 26px", color:C.cream }}><h3 style={{ margin:"0 0 8px", color:C.lime, fontSize:14, fontWeight:800 }}>Dietitian's Note</h3><p style={{ margin:0, lineHeight:1.85, opacity:0.9, fontSize:13 }}>{planData.note}</p></div>
    </div>
  );
}

function ChatBot({ plan, setPage }) {
  const isBasicPlus = plan!=="free";
  const [messages, setMessages] = useState([{ role:"assistant", content:"Jambo! I'm NutriBot, your AI-powered nutrition assistant.\n\nAsk me about:\n• Diabetes, hypertension and oncology diets\n• Local Kenyan food recommendations\n• Weight management with local foods\n• Meal planning and nutrition questions\n\nNinaweza kukusaidia!" }]);
  const [input, setInput] = useState(""); const [loading, setLoading] = useState(false);
  const [msgCount, setMsgCount] = useState(() => parseInt(localStorage.getItem("np_msg_count")||"0"));
  const FREE_LIMIT = 3;
  const canSend = isBasicPlus || msgCount < FREE_LIMIT;
  const bottomRef = useRef(null);
  const send = async () => {
    if (!input.trim()||loading||!canSend) return;
    const msg = input.trim(); setInput("");
    const updated = [...messages, { role:"user", content:msg }];
    setMessages(updated); setLoading(true);
    const nc = msgCount+1; setMsgCount(nc); localStorage.setItem("np_msg_count", nc);
    try {
      const apiMsgs = updated.map(m => ({ role:m.role==="assistant"?"assistant":"user", content:m.content }));
      const reply = await callNutriBot(apiMsgs);
      setMessages(prev => [...prev, { role:"assistant", content:reply }]);
    } catch { setMessages(prev => [...prev, { role:"assistant", content:"Connection issue. Please try again." }]); }
    finally { setLoading(false); }
  };
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);
  const renderText = (t) => t.split("\n").map((l,i) => { if (!l.trim()) return <br key={i} />; const f = l.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"); return <p key={i} style={{ margin:"3px 0", lineHeight:1.7 }} dangerouslySetInnerHTML={{ __html:f }} />; });
  const quickQ = ["What foods help manage diabetes?","Best Kenyan foods for high blood pressure","Affordable high-protein foods in Kenya","What should a cancer patient eat?"];
  return (
    <div style={{ padding:"32px 22px", maxWidth:940, margin:"0 auto" }}>
      <style>{`@keyframes pulse2{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
        <div style={{ width:46, height:46, borderRadius:"50%", background:`linear-gradient(135deg, ${C.jade}, ${C.forest})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🌿</div>
        <div><h2 style={{ color:C.forest, fontFamily:"'Georgia',serif", fontSize:24, margin:0, fontWeight:800 }}>NutriBot AI Assistant</h2><div style={{ display:"flex", alignItems:"center", gap:5, marginTop:3 }}><div style={{ width:7, height:7, borderRadius:"50%", background:"#27ae60", animation:"pulse2 2s infinite" }} /><span style={{ color:"#27ae60", fontSize:11, fontWeight:700 }}>Powered by Claude AI · Online</span></div></div>
        {!isBasicPlus && <div style={{ marginLeft:"auto", background:"#fff8e8", border:`1px solid ${C.sand}`, borderRadius:10, padding:"7px 12px", fontSize:12, color:"#7a5c00" }}><strong>{FREE_LIMIT-msgCount}</strong> free messages left</div>}
      </div>
      {!isBasicPlus && msgCount>=FREE_LIMIT && <div style={{ background:`${C.sand}22`, border:`2px solid ${C.sand}`, borderRadius:14, padding:22, textAlign:"center", marginBottom:18 }}><div style={{ fontSize:30, marginBottom:6 }}>🔒</div><div style={{ fontWeight:800, color:C.forest, fontSize:15, marginBottom:4 }}>Free message limit reached</div><div style={{ color:"#666", fontSize:13, marginBottom:14 }}>Upgrade to Basic or Premium for unlimited AI messages</div><button onClick={() => setPage("Subscription")} style={{ ...bPri, fontSize:13 }}>Upgrade Now</button></div>}
      <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:14 }}>
        {quickQ.map(q => <button key={q} onClick={() => canSend&&setInput(q)} style={{ background:C.mist, border:`1px solid ${C.lime}`, color:C.forest, padding:"6px 12px", borderRadius:20, fontSize:11, cursor:canSend?"pointer":"not-allowed", fontWeight:600, opacity:canSend?1:0.5 }}>{q}</button>)}
      </div>
      <div style={{ background:"#f8f7f2", borderRadius:18, overflow:"hidden", boxShadow:"0 6px 28px rgba(0,0,0,0.1)", border:`1.5px solid ${C.lime}` }}>
        <div style={{ height:420, overflowY:"auto", padding:"18px 18px 8px", display:"flex", flexDirection:"column", gap:13 }}>
          {messages.map((m,i) => <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
            {m.role==="assistant"&&<div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg, ${C.jade}, ${C.forest})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, marginRight:7, flexShrink:0, alignSelf:"flex-end" }}>🌿</div>}
            <div style={{ maxWidth:"72%", padding:"11px 15px", borderRadius:m.role==="user"?"18px 4px 18px 18px":"4px 18px 18px 18px", background:m.role==="user"?`linear-gradient(135deg, ${C.jade}, ${C.forest})`:"#fff", color:m.role==="user"?"#fff":C.charcoal, boxShadow:"0 2px 8px rgba(0,0,0,0.07)", fontSize:13 }}>{renderText(m.content)}</div>
            {m.role==="user"&&<div style={{ width:30, height:30, borderRadius:"50%", background:C.mint, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:12, marginLeft:7, flexShrink:0, alignSelf:"flex-end" }}>U</div>}
          </div>)}
          {loading&&<div style={{ display:"flex", alignItems:"center", gap:7 }}><div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg, ${C.jade}, ${C.forest})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>🌿</div><div style={{ background:"#fff", padding:"11px 15px", borderRadius:"4px 18px 18px 18px", boxShadow:"0 2px 8px rgba(0,0,0,0.07)", display:"flex", gap:4 }}>{[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:C.mint, animation:`pulse2 1.2s ease ${i*0.2}s infinite` }} />)}</div></div>}
          <div ref={bottomRef} />
        </div>
        <div style={{ padding:"12px 15px", borderTop:`1px solid ${C.mist}`, display:"flex", gap:9, background:"#fff" }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter"&&!e.shiftKey&&send()} placeholder={canSend?"Ask NutriBot anything about nutrition...":"Upgrade to continue chatting"} disabled={loading||!canSend} style={{ flex:1, padding:"11px 18px", borderRadius:30, border:`2px solid ${!canSend?C.sand:loading?C.mist:C.lime}`, outline:"none", fontSize:13, background:C.cream }} />
          <button onClick={send} disabled={loading||!canSend} style={{ background:(!canSend||loading)?"#ccc":`linear-gradient(135deg, ${C.mint}, ${C.jade})`, color:"#fff", border:"none", width:44, height:44, borderRadius:"50%", cursor:(!canSend||loading)?"not-allowed":"pointer", fontSize:17 }}>→</button>
        </div>
      </div>
      <p style={{ textAlign:"center", color:"#bbb", fontSize:11, marginTop:10 }}>Educational information only. Always consult a registered dietitian for medical advice.</p>
    </div>
  );
}

function Community({ plan, setPage }) {
  const canParticipate = plan!=="free";
  const [liked, setLiked] = useState({});
  const posts = [
    { author:"Jane W.", avatar:"J", time:"2h ago", title:"My 3-month diabetes journey with local foods", body:"Switched from white ugali to millet porridge and my HbA1c dropped by 0.8%! NutriBot AI recommended this combo — it really works!", likes:34, comments:12, tag:"Diabetes", color:C.mint },
    { author:"Peter M.", avatar:"P", time:"5h ago", title:"Traditional foods that helped my cancer recovery", body:"During chemo I survived on managu soup, arrowroot porridge, and omena. These foods kept my protein levels up even on the hardest days.", likes:56, comments:23, tag:"Oncology", color:C.terra },
    { author:"Amina K.", avatar:"A", time:"1d ago", title:"Weekly Challenge: 7-day sugar detox", body:"Join me this week for a 7-day refined sugar detox using only whole, local foods. Day 1: sorghum uji + boiled eggs + sukuma wiki. Who is in?", likes:89, comments:41, tag:"Challenge", color:C.sand },
  ];
  return (
    <div style={{ padding:"32px 22px", maxWidth:1280, margin:"0 auto" }}>
      <h2 style={{ color:C.forest, fontFamily:"'Georgia',serif", fontSize:26, margin:"0 0 4px", fontWeight:800 }}>Community Wellness Hub</h2>
      <p style={{ color:"#777", marginBottom:20, fontSize:13 }}>Share stories, join challenges, and grow together</p>
      {!canParticipate && <div style={{ background:"#fff8e8", border:`1px solid ${C.sand}`, borderRadius:10, padding:"11px 16px", marginBottom:18, display:"flex", alignItems:"center", justifyContent:"space-between" }}><span style={{ color:"#7a5c00", fontSize:13 }}>You are viewing in read-only mode. Upgrade to post and join challenges.</span><button onClick={() => setPage("Subscription")} style={{ background:C.sand, color:C.forest, border:"none", padding:"6px 14px", borderRadius:20, fontWeight:800, cursor:"pointer", fontSize:12 }}>Upgrade</button></div>}
      {posts.map((p,i) => <div key={i} style={{ background:"#fff", borderRadius:16, padding:20, boxShadow:"0 2px 10px rgba(0,0,0,0.06)", border:`1px solid ${C.mist}`, borderLeft:`4px solid ${p.color}`, marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:10 }}>
          <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg, ${p.color}, ${C.forest})`, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800 }}>{p.avatar}</div>
          <div><div style={{ fontWeight:800, color:C.forest, fontSize:13 }}>{p.author}</div><div style={{ fontSize:11, color:"#bbb" }}>{p.time}</div></div>
          <span style={{ marginLeft:"auto", background:`${p.color}20`, color:p.color, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:800 }}>{p.tag}</span>
        </div>
        <h3 style={{ margin:"0 0 7px", color:C.forest, fontSize:15, fontWeight:800 }}>{p.title}</h3>
        <p style={{ color:"#555", lineHeight:1.7, margin:"0 0 12px", fontSize:13 }}>{p.body}</p>
        <div style={{ display:"flex", gap:14, borderTop:`1px solid #f0f0f0`, paddingTop:10 }}>
          <button onClick={() => canParticipate&&setLiked(prev => ({...prev,[i]:!prev[i]}))} style={{ background:"none", border:"none", color:liked[i]?C.terra:"#aaa", cursor:canParticipate?"pointer":"not-allowed", fontSize:13, fontWeight:700 }}>{liked[i]?"❤️":"🤍"} {p.likes+(liked[i]?1:0)}</button>
          <button style={{ background:"none", border:"none", color:"#aaa", cursor:canParticipate?"pointer":"not-allowed", fontSize:13 }}>💬 {p.comments}</button>
        </div>
      </div>)}
    </div>
  );
}

function Tracking({ user }) {
  const [meals, setMeals] = useState([{ name:"Millet porridge + egg", time:"7:30 AM", cal:290, meal:"Breakfast" },{ name:"Ugali + sukuma wiki + omena", time:"1:00 PM", cal:480, meal:"Lunch" }]);
  const [newMeal, setNewMeal] = useState(""); const [newCal, setNewCal] = useState(""); const [mealType, setMealType] = useState("Snack");
  const [bios, setBios] = useState({ weight:user?.weight||"74.2", sugar:"98", bp:"120/80", mood:"😊" });
  const [saved, setSaved] = useState(false);
  const totalCal = meals.reduce((s,m) => s+m.cal, 0);
  const goal = 2100; const pct = Math.min((totalCal/goal)*100, 100);
  const addMeal = () => { if (!newMeal.trim()||!newCal) return; setMeals(prev => [...prev, { name:newMeal, time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), cal:parseInt(newCal), meal:mealType }]); setNewMeal(""); setNewCal(""); };
  const bmi = user?.height?(parseFloat(bios.weight)/(user.height**2)).toFixed(1):"—";
  const bmiLabel = !user?.height?"—":bmi<18.5?"Underweight":bmi<25?"Normal":bmi<30?"Overweight":"Obese";
  const bmiColor = !user?.height?"#aaa":bmi<18.5?"#3498db":bmi<25?"#27ae60":bmi<30?"#e67e22":"#e74c3c";
  return (
    <div style={{ padding:"32px 22px", maxWidth:1280, margin:"0 auto" }}>
      <h2 style={{ color:C.forest, fontFamily:"'Georgia',serif", fontSize:26, margin:"0 0 4px", fontWeight:800 }}>Health Tracking</h2>
      <p style={{ color:"#777", marginBottom:22, fontSize:13 }}>Monitor your daily nutrition and biometrics</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <div style={{ background:"#fff", borderRadius:16, padding:22, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin:"0 0 14px", color:C.forest, fontWeight:800, fontSize:15 }}>Calorie Tracker</h3>
          <div style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:7 }}><span style={{ fontWeight:900, fontSize:30, color:pct>90?C.terra:C.jade }}>{totalCal.toLocaleString()}</span><span style={{ color:"#aaa", fontSize:13 }}>/ {goal.toLocaleString()} kcal</span></div>
            <div style={{ height:9, background:C.mist, borderRadius:5, overflow:"hidden" }}><div style={{ height:"100%", width:`${pct}%`, background:pct>90?`linear-gradient(90deg,${C.terra},#e74c3c)`:`linear-gradient(90deg,${C.mint},${C.jade})`, borderRadius:5, transition:"width 0.5s" }} /></div>
          </div>
          {meals.map((m,i) => <div key={i} style={{ display:"flex", justifyContent:"space-between", background:C.cream, borderRadius:9, padding:"9px 12px", marginBottom:7 }}><div><div style={{ fontWeight:700, fontSize:12, color:C.forest }}>{m.name}</div><div style={{ fontSize:11, color:"#bbb" }}>{m.meal} · {m.time}</div></div><div style={{ fontWeight:900, color:C.terra, fontSize:13 }}>{m.cal} kcal</div></div>)}
          <div style={{ borderTop:`2px dashed ${C.mist}`, paddingTop:12, marginTop:7 }}>
            <input placeholder="Meal description" value={newMeal} onChange={e => setNewMeal(e.target.value)} style={{ ...iSty, marginBottom:7, border:`1.5px solid ${C.lime}` }} />
            <div style={{ display:"flex", gap:7, marginBottom:9 }}>
              <input type="number" placeholder="Calories" value={newCal} onChange={e => setNewCal(e.target.value)} style={{ ...iSty, flex:1, border:`1.5px solid ${C.lime}` }} />
              <select value={mealType} onChange={e => setMealType(e.target.value)} style={{ flex:1, padding:"11px 10px", borderRadius:11, border:`1.5px solid ${C.lime}`, fontSize:13, color:C.forest }}>
                {["Breakfast","Lunch","Dinner","Snack"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <button onClick={addMeal} style={{ ...bPri, width:"100%", textAlign:"center", fontSize:13 }}>Add Meal</button>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ background:"#fff", borderRadius:16, padding:22, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
            <h3 style={{ margin:"0 0 14px", color:C.forest, fontWeight:800, fontSize:15 }}>Biometric Log</h3>
            {[{label:"Weight (kg)",key:"weight",unit:"kg"},{label:"Blood Sugar (mg/dL)",key:"sugar",unit:"mg/dL"},{label:"Blood Pressure",key:"bp",unit:"mmHg"}].map(b => <div key={b.key} style={{ marginBottom:11 }}><label style={lSty}>{b.label}</label><div style={{ display:"flex", gap:7, alignItems:"center" }}><input value={bios[b.key]} onChange={e => setBios(p => ({...p,[b.key]:e.target.value}))} style={{ ...iSty, fontSize:15, fontWeight:800, border:`1.5px solid ${C.lime}` }} /><span style={{ color:"#aaa", fontSize:12, whiteSpace:"nowrap" }}>{b.unit}</span></div></div>)}
            <div style={{ marginBottom:13 }}><label style={lSty}>Mood Today</label><div style={{ display:"flex", gap:7 }}>{["😄","😊","😐","😞","😫"].map(m => <button key={m} onClick={() => setBios(p => ({...p,mood:m}))} style={{ fontSize:22, background:bios.mood===m?C.mist:"transparent", border:bios.mood===m?`2px solid ${C.jade}`:"2px solid transparent", borderRadius:9, padding:6, cursor:"pointer" }}>{m}</button>)}</div></div>
            <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} style={{ ...bPri, width:"100%", textAlign:"center", fontSize:13 }}>{saved?"Saved!":"Save Today"}</button>
          </div>
          <div style={{ background:`linear-gradient(135deg, ${C.forest}, ${C.jade})`, borderRadius:16, padding:22, color:C.cream }}>
            <h3 style={{ margin:"0 0 10px", color:C.lime, fontWeight:800, fontSize:14 }}>BMI Calculator</h3>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div><div style={{ fontSize:40, fontWeight:900, color:bmiColor }}>{bmi}</div><div style={{ fontSize:13, fontWeight:700, color:bmiColor }}>{bmiLabel}</div></div>
              <div style={{ flex:1, fontSize:12, opacity:0.8 }}>Height: {user?.height||"—"}m · Weight: {bios.weight}kg</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FoodDatabase() {
  const [search, setSearch] = useState(""); const [filter, setFilter] = useState("All"); const [sortBy, setSortBy] = useState("name");
  const cats = ["All", ...new Set(LOCAL_FOODS.map(f => f.category))];
  const filtered = LOCAL_FOODS.filter(f => (filter==="All"||f.category===filter)&&f.name.toLowerCase().includes(search.toLowerCase())).sort((a,b) => sortBy==="name"?a.name.localeCompare(b.name):a[sortBy]-b[sortBy]);
  const giC = { Low:"#27ae60", Medium:"#e67e22", High:"#e74c3c" };
  return (
    <div style={{ padding:"32px 22px", maxWidth:1280, margin:"0 auto" }}>
      <style>{`.fc{transition:all 0.2s;}.fc:hover{transform:translateY(-3px);box-shadow:0 10px 26px rgba(0,0,0,0.1)!important;}`}</style>
      <h2 style={{ color:C.forest, fontFamily:"'Georgia',serif", fontSize:26, margin:"0 0 4px", fontWeight:800 }}>Local Foods Database</h2>
      <p style={{ color:"#777", marginBottom:20, fontSize:13 }}>{LOCAL_FOODS.length} traditional Kenyan and East African foods · Per 100g serving</p>
      <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
        <input placeholder="Search foods..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...iSty, flex:1, minWidth:160, borderRadius:30, border:`2px solid ${C.lime}`, background:C.cream, padding:"10px 18px" }} />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding:"10px 12px", borderRadius:30, border:`2px solid ${C.lime}`, fontSize:12, fontWeight:700, color:C.forest, background:C.cream, cursor:"pointer" }}>
          <option value="name">A–Z</option><option value="cal">Calories</option><option value="protein">Protein</option><option value="fiber">Fiber</option>
        </select>
      </div>
      <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:18 }}>{cats.map(c => <button key={c} onClick={() => setFilter(c)} style={{ padding:"7px 14px", borderRadius:30, border:"none", cursor:"pointer", background:filter===c?C.jade:C.mist, color:filter===c?"#fff":C.forest, fontWeight:700, fontSize:12, transition:"all 0.2s" }}>{c}</button>)}</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(230px,1fr))", gap:13 }}>
        {filtered.map(food => <div key={food.name} className="fc" style={{ background:"#fff", borderRadius:14, padding:16, boxShadow:"0 2px 10px rgba(0,0,0,0.06)", border:`1px solid ${C.mist}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:9 }}>
            <h3 style={{ margin:0, color:C.forest, fontSize:13, fontWeight:800, lineHeight:1.3 }}>{food.name}</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:3, alignItems:"flex-end" }}>
              <span style={{ background:C.mist, color:C.jade, padding:"2px 7px", borderRadius:20, fontSize:9, fontWeight:700 }}>{food.category}</span>
              <span style={{ background:`${giC[food.gi]}18`, color:giC[food.gi], padding:"2px 6px", borderRadius:20, fontSize:8, fontWeight:800 }}>GI: {food.gi}</span>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
            {[{l:"Calories",v:`${food.cal} kcal`,c:C.terra},{l:"Carbs",v:`${food.carbs}g`,c:C.sand},{l:"Protein",v:`${food.protein}g`,c:C.mint},{l:"Fat",v:`${food.fat}g`,c:"#a8d5ba"}].map(n => <div key={n.l} style={{ background:C.cream, borderRadius:7, padding:"6px 9px", borderLeft:`3px solid ${n.c}` }}><div style={{ fontSize:8, color:"#999", fontWeight:700, textTransform:"uppercase" }}>{n.l}</div><div style={{ fontSize:13, color:C.charcoal, fontWeight:800 }}>{n.v}</div></div>)}
          </div>
          {food.fiber>0&&<div style={{ marginTop:7, fontSize:11, color:"#888" }}>Fiber: <strong style={{ color:C.jade }}>{food.fiber}g</strong></div>}
        </div>)}
      </div>
    </div>
  );
}

function OnboardingScreen({ onComplete, userName }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name:userName||"", age:"", height:"1.65", weight:"70", condition:"Diabetes Type 2" });
  const steps = [
    { title:"Welcome to NutriPulse", subtitle:"AI-powered nutrition built for East Africa", field:"name", label:"What should we call you?", placeholder:"Your full name" },
    { title:"Your Health Profile", subtitle:"We will personalise your meal plans", field:"condition", label:"Primary health condition", type:"select" },
    { title:"Body Metrics", subtitle:"Used to calculate your calorie needs", fields:[{field:"height",label:"Height (m)",placeholder:"e.g. 1.68"},{field:"weight",label:"Weight (kg)",placeholder:"e.g. 72"},{field:"age",label:"Age",placeholder:"e.g. 34"}] },
  ];
  const s = steps[step];
  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(135deg, ${C.forest} 0%, ${C.jade} 60%, ${C.mint} 100%)`, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:"#fff", borderRadius:20, padding:"42px 38px", maxWidth:440, width:"100%", boxShadow:"0 32px 100px rgba(0,0,0,0.3)" }}>
        <div style={{ display:"flex", gap:6, marginBottom:26 }}>{steps.map((_,i) => <div key={i} style={{ flex:1, height:5, borderRadius:3, background:i<=step?C.jade:C.mist, transition:"background 0.3s" }} />)}</div>
        <h2 style={{ fontFamily:"'Georgia',serif", color:C.forest, fontSize:22, margin:"0 0 5px", fontWeight:800 }}>{s.title}</h2>
        <p style={{ color:"#888", marginBottom:20, fontSize:13 }}>{s.subtitle}</p>
        {s.fields?s.fields.map(f => <div key={f.field} style={{ marginBottom:11 }}><label style={lSty}>{f.label}</label><input value={data[f.field]} onChange={e => setData(p => ({...p,[f.field]:e.target.value}))} placeholder={f.placeholder} style={{ ...iSty, border:`1.5px solid ${C.lime}` }} /></div>)
          :s.type==="select"?<div><label style={lSty}>{s.label}</label><select value={data[s.field]} onChange={e => setData(p => ({...p,[s.field]:e.target.value}))} style={{ ...iSty, border:`1.5px solid ${C.lime}`, cursor:"pointer" }}>{HEALTH_CONDITIONS.map(c => <option key={c}>{c}</option>)}</select></div>
          :<div><label style={lSty}>{s.label}</label><input value={data[s.field]} onChange={e => setData(p => ({...p,[s.field]:e.target.value}))} placeholder={s.placeholder} style={{ ...iSty, border:`1.5px solid ${C.lime}` }} /></div>}
        <div style={{ display:"flex", gap:9, marginTop:22 }}>
          {step>0&&<button onClick={() => setStep(s => s-1)} style={{ flex:1, padding:"12px", background:C.mist, color:C.forest, border:"none", borderRadius:11, cursor:"pointer", fontWeight:800 }}>Back</button>}
          <button onClick={() => step<steps.length-1?setStep(s => s+1):onComplete({...data,height:parseFloat(data.height)||1.65})} style={{ ...bPri, flex:2 }}>{step<steps.length-1?"Continue →":"Start My Journey"}</button>
        </div>
      </div>
    </div>
  );
}

function AuthScreen({ onAuth }) {
  const [tab, setTab] = useState("login");
  const [ld, setLd] = useState({ email:"", password:"" });
  const [sd, setSd] = useState({ name:"", email:"", phone:"", password:"", confirm:"" });
  const [error, setError] = useState(""); const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState(false); const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(""); setSuccess("");
    if (!ld.email||!ld.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    const { data, error:err } = await supabase.auth.signIn({ email:ld.email, password:ld.password });
    if (err) {
      if (ld.email==="demo@nutripulse.com"&&ld.password==="demo1234") {
        const demo = { name:"Demo User", email:"demo@nutripulse.com", condition:"Diabetes Type 2", height:1.68, weight:"72", age:"34" };
        localStorage.setItem("np_user", JSON.stringify(demo)); localStorage.setItem("np_token","demo_token");
        setSuccess("Welcome back! Redirecting..."); await sendNotification("login", demo); setTimeout(() => onAuth(demo, false), 800);
      } else { setError("Incorrect email or password. Try demo@nutripulse.com / demo1234"); }
    } else { setSuccess("Welcome back! Redirecting..."); await sendNotification("login", data.user); setTimeout(() => onAuth(data.user, false), 800); }
    setLoading(false);
  };

  const handleSignup = async () => {
    setError(""); setSuccess("");
    const { name, email, phone, password, confirm } = sd;
    if (!name||!email||!password||!confirm) { setError("Please fill in all required fields."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address."); return; }
    if (password.length<6) { setError("Password must be at least 6 characters."); return; }
    if (password!==confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    const { data, error:err } = await supabase.auth.signUp({ email, password, options:{ data:{ name, phone, condition:"Healthy", height:1.65, weight:"65" } } });
    if (err) { setError(err.message||"Signup failed. Please try again."); }
    else { setSuccess("Account created! Setting up your profile..."); await sendNotification("signup", { name, email, phone }); setTimeout(() => onAuth({ name, email, phone, condition:"Healthy", height:1.65, weight:"65" }, true), 800); }
    setLoading(false);
  };

  const pwS = pw => pw.length>=12?4:pw.length>=8?3:pw.length>=6?2:pw.length>0?1:0;
  const pwC = s => s>=3?C.mint:s===2?C.sand:C.terra;

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(145deg, ${C.forest} 0%, #101e15 45%, ${C.jade} 100%)`, display:"flex", alignItems:"center", justifyContent:"center", padding:24, position:"relative", overflow:"hidden" }}>
      <style>{`@keyframes float{0%,100%{transform:translateY(0px) rotate(var(--r))} 50%{transform:translateY(-14px) rotate(var(--r))}} @keyframes fup{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}} @keyframes spin{to{transform:rotate(360deg)}} .ai:focus{border-color:${C.mint}!important;box-shadow:0 0 0 3px rgba(58,157,110,0.2)!important;} .ab:hover{filter:brightness(1.08);} .ab,.ta{transition:all 0.2s;}`}</style>
      {[{t:"8%",l:"5%",s:65,o:0.1,r:-20,d:3.5},{t:"70%",l:"3%",s:90,o:0.07,r:30,d:4.2},{t:"15%",r:"4%",s:72,o:0.09,r2:15,d:5}].map((l,i)=><div key={i} style={{ position:"absolute",fontSize:l.s,top:l.t,left:l.l,right:l.r,opacity:l.o,userSelect:"none",pointerEvents:"none",animation:`float ${l.d}s ease-in-out infinite`,"--r":`${l.r||l.r2||0}deg`,transform:`rotate(${l.r||l.r2||0}deg)` }}>🌿</div>)}
      <div style={{ display:"flex", width:"100%", maxWidth:960, borderRadius:24, overflow:"hidden", boxShadow:"0 40px 120px rgba(0,0,0,0.5)", animation:"fup 0.5s ease" }}>
        <div style={{ flex:1, background:`linear-gradient(160deg, ${C.jade}, ${C.forest})`, padding:"50px 42px", color:"#fff", display:"flex", flexDirection:"column", justifyContent:"space-between", minWidth:270 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:42 }}><div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg, ${C.mint}, ${C.lime})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🌿</div><span style={{ fontFamily:"'Georgia',serif", fontSize:24, fontWeight:900 }}>Nutri<span style={{ color:C.lime }}>Pulse</span></span></div>
            <h2 style={{ fontSize:28, fontFamily:"'Georgia',serif", margin:"0 0 12px", lineHeight:1.25, fontWeight:800 }}>Your health journey starts with food. 🌱</h2>
            <p style={{ color:C.lime, lineHeight:1.85, fontSize:13, opacity:0.9 }}>AI-powered nutrition for East Africa — personalised meal plans, local food insights, and real community support.</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:32 }}>
            {[["🤖","Live Claude AI","Real intelligent nutrition advice"],["💳","Flexible Plans","Free, Basic and Premium options"],["🌿","Local Foods","20+ Kenyan foods with full macros"],["🔔","Smart Reminders","Meal and challenge notifications"]].map(([icon,title,desc]) => <div key={title} style={{ display:"flex", alignItems:"center", gap:11 }}><div style={{ width:36, height:36, borderRadius:9, background:C.glass, border:`1px solid ${C.glassB}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{icon}</div><div><div style={{ fontWeight:800, fontSize:12 }}>{title}</div><div style={{ fontSize:11, opacity:0.7 }}>{desc}</div></div></div>)}
          </div>
        </div>
        <div style={{ flex:1.1, background:"#fff", padding:"42px 38px", overflowY:"auto", maxHeight:"90vh" }}>
          <div style={{ display:"flex", background:"#f5f5f5", borderRadius:12, padding:4, marginBottom:24 }}>
            {["login","signup"].map(t => <button key={t} className="ta" onClick={() => { setTab(t); setError(""); setSuccess(""); }} style={{ flex:1, padding:"9px", borderRadius:9, border:"none", cursor:"pointer", fontWeight:800, fontSize:13, background:tab===t?"#fff":"transparent", color:tab===t?C.forest:"#aaa", boxShadow:tab===t?"0 2px 8px rgba(0,0,0,0.1)":"none" }}>{t==="login"?"Sign In":"Create Account"}</button>)}
          </div>
          {tab==="login"?(
            <div style={{ animation:"fup 0.3s ease" }}>
              <h3 style={{ color:C.forest, fontFamily:"'Georgia',serif", fontSize:21, margin:"0 0 5px", fontWeight:800 }}>Welcome back 👋</h3>
              <p style={{ color:"#aaa", fontSize:12, marginBottom:18 }}>Sign in to your NutriPulse account</p>
              <label style={lSty}>Email</label>
              <input className="ai" type="email" value={ld.email} onChange={e => setLd(p => ({...p,email:e.target.value}))} placeholder="you@email.com" style={{ ...iSty, marginBottom:11 }} />
              <label style={lSty}>Password</label>
              <div style={{ position:"relative", marginBottom:16 }}>
                <input className="ai" type={showPass?"text":"password"} value={ld.password} onChange={e => setLd(p => ({...p,password:e.target.value}))} onKeyDown={e => e.key==="Enter"&&handleLogin()} style={{ ...iSty, paddingRight:42 }} />
                <button onClick={() => setShowPass(p => !p)} style={{ position:"absolute", right:11, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:14, color:"#bbb" }}>{showPass?"🙈":"👁️"}</button>
              </div>
              {error&&<div style={{ ...eSty, marginBottom:11 }}>⚠️ {error}</div>}
              {success&&<div style={{ ...okSty, marginBottom:11 }}>✅ {success}</div>}
              <button className="ab" onClick={handleLogin} disabled={loading} style={{ ...bPri, width:"100%", textAlign:"center", opacity:loading?0.7:1 }}>
                {loading?<span style={{ display:"inline-block", animation:"spin 0.8s linear infinite" }}>⟳</span>:"Sign In →"}
              </button>
              <p style={{ textAlign:"center", color:"#ccc", fontSize:11, marginTop:12 }}>Demo: demo@nutripulse.com / demo1234</p>
            </div>
          ):(
            <div style={{ animation:"fup 0.3s ease" }}>
              <h3 style={{ color:C.forest, fontFamily:"'Georgia',serif", fontSize:21, margin:"0 0 5px", fontWeight:800 }}>Create your account ✨</h3>
              <p style={{ color:"#aaa", fontSize:12, marginBottom:16 }}>Free to join — takes 2 minutes</p>
              <label style={lSty}>Full Name *</label>
              <input className="ai" value={sd.name} onChange={e => setSd(p => ({...p,name:e.target.value}))} placeholder="e.g. Jane Wanjiku" style={{ ...iSty, marginBottom:10 }} />
              <label style={lSty}>Email *</label>
              <input className="ai" type="email" value={sd.email} onChange={e => setSd(p => ({...p,email:e.target.value}))} placeholder="you@email.com" style={{ ...iSty, marginBottom:10 }} />
              <label style={lSty}>Phone (optional)</label>
              <input className="ai" value={sd.phone} onChange={e => setSd(p => ({...p,phone:e.target.value}))} placeholder="+254 7XX XXX XXX" style={{ ...iSty, marginBottom:10 }} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:10 }}>
                <div><label style={lSty}>Password *</label><div style={{ position:"relative" }}><input className="ai" type={showPass?"text":"password"} value={sd.password} onChange={e => setSd(p => ({...p,password:e.target.value}))} placeholder="Min. 6 chars" style={{ ...iSty, paddingRight:36 }} /><button onClick={() => setShowPass(p => !p)} style={{ position:"absolute", right:9, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:12, color:"#bbb" }}>{showPass?"🙈":"👁️"}</button></div></div>
                <div><label style={lSty}>Confirm *</label><input className="ai" type="password" value={sd.confirm} onChange={e => setSd(p => ({...p,confirm:e.target.value}))} placeholder="Repeat" style={iSty} /></div>
              </div>
              {sd.password&&<div style={{ marginBottom:10 }}><div style={{ display:"flex", gap:3 }}>{[1,2,3,4].map(i => { const s=pwS(sd.password); return <div key={i} style={{ flex:1, height:3, borderRadius:2, background:i<=s?pwC(s):"#e8e8e8" }} />; })}</div><span style={{ fontSize:10, color:"#bbb" }}>{["","Too short","Weak","Good","Strong"][pwS(sd.password)]}</span></div>}
              {error&&<div style={{ ...eSty, marginBottom:10 }}>⚠️ {error}</div>}
              {success&&<div style={{ ...okSty, marginBottom:10 }}>✅ {success}</div>}
              <button className="ab" onClick={handleSignup} disabled={loading} style={{ ...bPri, width:"100%", textAlign:"center", opacity:loading?0.7:1 }}>
                {loading?<span style={{ display:"inline-block", animation:"spin 0.8s linear infinite" }}>⟳</span>:"Create Account & Continue →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [authState, setAuthState] = useState("loading");
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("Dashboard");
  const [plan, setPlan] = useState(() => localStorage.getItem("np_plan")||"free");

  useEffect(() => {
    const { data } = supabase.auth.getSession();
    if (data.session?.user) { setUser(data.session.user); setAuthState("app"); }
    else { setAuthState("auth"); }
  }, []);

  const handleAuth = (u, isNew) => { setUser(u); setAuthState(isNew?"onboarding":"app"); };
  const handleOnboarding = (d) => { setUser(prev => ({...prev,...d})); setAuthState("app"); };
  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setAuthState("auth"); setPage("Dashboard"); localStorage.removeItem("np_msg_count"); };
  const handleUpgrade = (newPlan) => { setPlan(newPlan); localStorage.setItem("np_plan", newPlan); setPage("Dashboard"); };

  if (authState==="loading") return <div style={{ minHeight:"100vh", background:C.forest, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:14 }}><div style={{ fontSize:48 }}>🌿</div><div style={{ fontFamily:"'Georgia',serif", fontSize:22, fontWeight:800, color:C.cream }}>Nutri<span style={{ color:C.lime }}>Pulse</span></div><div style={{ color:C.lime, fontSize:12, opacity:0.8 }}>Loading...</div></div>;
  if (authState==="auth") return <AuthScreen onAuth={handleAuth} />;
  if (authState==="onboarding") return <OnboardingScreen onComplete={handleOnboarding} userName={user?.name} />;
  if (page==="Subscription") return <SubscriptionPage user={user} onUpgrade={handleUpgrade} onBack={() => setPage("Dashboard")} />;

  const pageMap = { Dashboard:<Dashboard user={user} setPage={setPage} plan={plan} />, "Meal Plans":<MealPlans user={user} plan={plan} setPage={setPage} />, "Food Database":<FoodDatabase />, Chat:<ChatBot plan={plan} setPage={setPage} />, Community:<Community plan={plan} setPage={setPage} />, Tracking:<Tracking user={user} />, Reminders:<ReminderSystem /> };

  return (
    <div style={{ minHeight:"100vh", background:"#f5f4ef", fontFamily:"system-ui,'Segoe UI',sans-serif" }}>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}} *{box-sizing:border-box;} button,input,select{font-family:inherit;} input,select{outline:none;} ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-thumb{background:${C.lime};border-radius:3px;}`}</style>
      <Navbar page={page} setPage={setPage} user={user} onLogout={handleLogout} plan={plan} />
      <main>{pageMap[page]||pageMap.Dashboard}</main>
      <footer style={{ textAlign:"center", padding:"22px", color:"#bbb", fontSize:12, borderTop:`1px solid ${C.mist}`, marginTop:38 }}>NutriPulse 2025 · AI-Powered Nutrition for East Africa · Built with love for community health</footer>
    </div>
  );
}
