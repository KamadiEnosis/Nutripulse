import { useState, useEffect, useRef } from "react";

// ─── PALETTE ─────────────────────────────────────────────────────────────
const C = {
  forest: "#0a1f12", jade: "#1a5c35", mint: "#2d9e6b", lime: "#6dcf9e",
  cream: "#f8f4ee", sand: "#e9c46a", terra: "#e07b54", charcoal: "#1c1c1c",
  mist: "#c4ebd5", gold: "#f0c040", sky: "#e8f4fd", rose: "#fdeaea",
  lavender: "#f0eafd", amber: "#fef3e2",
};

// ─── HEALTH CONDITIONS (expanded — Africa-focused, high prevalence) ───────
const ALL_CONDITIONS = [
  // Metabolic
  { id:"diabetes2", label:"Diabetes Type 2", icon:"🩸", color:"#e07b54", group:"Metabolic" },
  { id:"diabetes1", label:"Diabetes Type 1", icon:"💉", color:"#d4614a", group:"Metabolic" },
  { id:"prediabetes", label:"Pre-Diabetes", icon:"⚡", color:"#f0a070", group:"Metabolic" },
  { id:"obesity", label:"Obesity / Overweight", icon:"⚖️", color:"#e9c46a", group:"Metabolic" },
  { id:"metabolic", label:"Metabolic Syndrome", icon:"🔄", color:"#cc8844", group:"Metabolic" },
  // Cardiovascular
  { id:"hypertension", label:"Hypertension", icon:"❤️", color:"#e05555", group:"Cardiovascular" },
  { id:"cardiovascular", label:"Heart Disease", icon:"🫀", color:"#c0392b", group:"Cardiovascular" },
  { id:"stroke", label:"Stroke Recovery", icon:"🧠", color:"#8e44ad", group:"Cardiovascular" },
  { id:"anaemia", label:"Anaemia / Iron Deficiency", icon:"🩺", color:"#c0392b", group:"Cardiovascular" },
  // Infections (High Africa burden)
  { id:"hiv", label:"HIV / AIDS", icon:"🎗️", color:"#e74c3c", group:"Infections" },
  { id:"tuberculosis", label:"Tuberculosis (TB)", icon:"🫁", color:"#7f8c8d", group:"Infections" },
  { id:"malaria", label:"Malaria Recovery", icon:"🦟", color:"#16a085", group:"Infections" },
  { id:"typhoid", label:"Typhoid Fever", icon:"🌡️", color:"#f39c12", group:"Infections" },
  // Oncology
  { id:"cancer", label:"Cancer (Oncology)", icon:"💊", color:"#8e44ad", group:"Oncology" },
  { id:"cancer_breast", label:"Breast Cancer", icon:"🎀", color:"#e91e8c", group:"Oncology" },
  { id:"cancer_cervical", label:"Cervical Cancer", icon:"💗", color:"#c0392b", group:"Oncology" },
  // Digestive & Kidney
  { id:"gi_disorder", label:"GI / Digestive Disorder", icon:"🫃", color:"#27ae60", group:"Digestive" },
  { id:"kidney", label:"Chronic Kidney Disease", icon:"🫘", color:"#2980b9", group:"Digestive" },
  { id:"liver", label:"Liver Disease / Hepatitis", icon:"🟡", color:"#f39c12", group:"Digestive" },
  // Blood & Genetic
  { id:"sickle_cell", label:"Sickle Cell Disease", icon:"🔴", color:"#c0392b", group:"Blood" },
  { id:"malnutrition", label:"Malnutrition / Underweight", icon:"🌱", color:"#27ae60", group:"Blood" },
  // Mental & Neurological
  { id:"mental_health", label:"Mental Health & Wellness", icon:"🧘", color:"#9b59b6", group:"Mental" },
  { id:"depression", label:"Depression / Anxiety", icon:"💙", color:"#3498db", group:"Mental" },
  // Reproductive
  { id:"pregnancy", label:"Pregnancy & Lactation", icon:"🤰", color:"#e91e8c", group:"Reproductive" },
  { id:"pcos", label:"PCOS / Hormonal Imbalance", icon:"🌸", color:"#e91e8c", group:"Reproductive" },
  { id:"menopause", label:"Menopause", icon:"🌺", color:"#e07b54", group:"Reproductive" },
  // Bone & Muscle
  { id:"osteoporosis", label:"Osteoporosis / Bone Health", icon:"🦴", color:"#95a5a6", group:"Bone" },
  { id:"arthritis", label:"Arthritis / Joint Pain", icon:"🦵", color:"#7f8c8d", group:"Bone" },
  // General
  { id:"healthy", label:"Generally Healthy", icon:"🌿", color:"#27ae60", group:"General" },
  { id:"athlete", label:"Athletic Performance", icon:"🏃", color:"#2980b9", group:"General" },
  { id:"immunity", label:"Immune Boost", icon:"🛡️", color:"#16a085", group:"General" },
  { id:"childhood", label:"Child Nutrition (Under 5)", icon:"👶", color:"#f39c12", group:"General" },
  { id:"elderly", label:"Elderly / Senior Nutrition", icon:"👴", color:"#7f8c8d", group:"General" },
];

// ─── CONDITION EDUCATION CONTENT ─────────────────────────────────────────
const CONDITION_INFO = {
  diabetes2: {
    title:"Type 2 Diabetes", icon:"🩸",
    what:"Type 2 diabetes occurs when your body cannot effectively use insulin to regulate blood sugar. In Africa, it affects over 24 million people and is rising rapidly due to urbanisation and dietary shifts.",
    causes:["Excess refined carbohydrates (white ugali, white rice, white bread)","Physical inactivity","Obesity — especially belly fat","Genetic predisposition","Stress and poor sleep"],
    nutrition_goals:["Stabilise blood sugar levels throughout the day","Reduce glycemic load per meal","Increase fiber to slow glucose absorption","Achieve and maintain healthy weight"],
    key_nutrients:[{n:"Dietary Fiber",r:"Slows sugar absorption — target 25–35g/day",f:"Njahi, lentils, managu, arrow roots"},{n:"Magnesium",r:"Improves insulin sensitivity",f:"Millet, managu, pumpkin seeds"},{n:"Chromium",r:"Helps insulin function",f:"Broccoli, whole grains, eggs"},{n:"Omega-3",r:"Reduces inflammation",f:"Omena, tilapia, flaxseed"}],
    avoid:["Sugary drinks, sodas, juices","White refined ugali (excess)","Processed/fried snacks","Alcohol"],
    tip:"Eat millet or sorghum ugali instead of maize — it has a much lower glycemic index and keeps your blood sugar stable for longer. 🌾",
  },
  hypertension: {
    title:"Hypertension (High Blood Pressure)", icon:"❤️",
    what:"Hypertension affects 1 in 3 African adults and is the leading cause of stroke and heart disease on the continent. It is called the 'silent killer' because it often has no symptoms.",
    causes:["Excess salt (sodium) intake","Low potassium diet","Obesity and physical inactivity","Stress, alcohol, smoking","Genetic factors — more prevalent in people of African descent"],
    nutrition_goals:["Lower sodium intake below 2,000mg/day","Increase potassium, magnesium, calcium","Achieve healthy weight","Reduce arterial stiffness through anti-inflammatory foods"],
    key_nutrients:[{n:"Potassium",r:"Counteracts sodium, relaxes blood vessels",f:"Banana, avocado, arrow roots, sweet potato"},{n:"Magnesium",r:"Relaxes blood vessel walls",f:"Managu, millet, groundnuts, leafy greens"},{n:"Calcium",r:"Helps control blood pressure",f:"Omena (whole), milk, mursik, moringa"},{n:"Nitrates",r:"Widens blood vessels",f:"Spinach, terere, beets, leafy greens"}],
    avoid:["Added salt — cook without salt, use lemon/herbs","Processed foods (canned, packaged)","Excessive red meat","Alcohol and caffeine in excess"],
    tip:"Try cooking sukuma wiki and other vegetables without any salt for 2 weeks. Your taste buds will adapt and you will be protecting your heart every meal. ❤️",
  },
  cancer: {
    title:"Cancer (Oncology Support)", icon:"💊",
    what:"Cancer is the third leading cause of death in Africa. Nutrition during cancer treatment helps maintain strength, manage side effects, support immune function, and improve quality of life.",
    causes:["Note: Nutrition does not cause cancer, but diet can reduce risk and support treatment","Poor nutrition weakens immune response","Processed meats and aflatoxins (mouldy grains) increase risk","Obesity is linked to several cancer types"],
    nutrition_goals:["Maintain body weight and muscle mass","Reduce treatment side effects (nausea, fatigue)","Support immune system function","Provide anti-inflammatory compounds"],
    key_nutrients:[{n:"Protein",r:"Rebuilds tissues damaged by treatment",f:"Omena, eggs, njahi, groundnut paste, soya"},{n:"Vitamin A",r:"Immune support, cell growth",f:"Pawpaw, carrots, spinach, sweet potato"},{n:"Zinc",r:"Wound healing and immune function",f:"Pumpkin seeds, beef, eggs, legumes"},{n:"Antioxidants",r:"Protect cells from damage",f:"Moringa, tomatoes, pawpaw, colourful vegetables"}],
    avoid:["Processed and smoked meats","Mouldy grains (check maize/groundnuts carefully — aflatoxin risk)","Alcohol","Raw/unwashed produce if immune-compromised"],
    tip:"Moringa leaves are one of Africa's greatest cancer-fighting superfoods — rich in antioxidants, vitamin C, and iron. Add moringa powder to your porridge daily. 🌿",
  },
  hiv: {
    title:"HIV / AIDS Nutrition Support", icon:"🎗️",
    what:"People living with HIV have higher nutritional needs due to the virus's effect on metabolism, appetite, and immunity. Good nutrition extends life and improves response to antiretroviral therapy (ART).",
    causes:["HIV increases resting energy expenditure by 10–30%","ART medications can cause nutrient malabsorption","Opportunistic infections increase nutritional demand","Poverty and food insecurity compound nutritional challenges"],
    nutrition_goals:["Strengthen immune function","Support ART medication effectiveness","Prevent opportunistic infections","Maintain healthy weight and muscle mass"],
    key_nutrients:[{n:"Protein",r:"Maintains muscle mass, supports immunity",f:"Eggs, omena, chicken, legumes, milk"},{n:"Zinc",r:"Critical for immune cell production",f:"Pumpkin seeds, beef, oysters, legumes"},{n:"Vitamin A",r:"Protects mucous membranes",f:"Pawpaw, mango, carrots, sweet potato"},{n:"B vitamins",r:"Energy metabolism, neurological health",f:"Whole grains, eggs, leafy greens, moringa"}],
    avoid:["Raw or undercooked meat/eggs (infection risk)","Unpasteurised dairy","Alcohol (reduces ART effectiveness)","Herbal remedies without medical advice (drug interactions)"],
    tip:"Moringa is especially valuable — it is one of the most nutrient-dense plants in Africa. One tablespoon of moringa powder provides significant zinc, iron, vitamin A, and protein. 🌱",
  },
  sickle_cell: {
    title:"Sickle Cell Disease", icon:"🔴",
    what:"Sickle Cell Disease (SCD) affects approximately 300,000 newborns annually in sub-Saharan Africa — the highest burden globally. Proper nutrition reduces crisis frequency and improves quality of life.",
    causes:["Genetic condition — not lifestyle-related","Nutritional deficiencies worsen symptoms","Dehydration triggers painful crises","Infections and oxidative stress precipitate crises"],
    nutrition_goals:["Stay well-hydrated (8–10 glasses of water daily)","Reduce frequency and severity of crises","Combat chronic anaemia","Reduce oxidative stress"],
    key_nutrients:[{n:"Folic Acid",r:"Essential for red blood cell production",f:"Njahi, dengu, spinach, managu, oranges"},{n:"Iron",r:"Correct anaemia (with medical supervision)",f:"Managu, moringa, omena, liver"},{n:"Zinc",r:"Reduces crisis frequency and infections",f:"Pumpkin seeds, beef, eggs"},{n:"Vitamin C",r:"Antioxidant, enhances iron absorption",f:"Guava, oranges, baobab, pawpaw"}],
    avoid:["Dehydration — always carry water","Cold foods/drinks that may trigger crisis","Alcohol","High-altitude travel without medical advice"],
    tip:"Hydration is medicine for sickle cell. Drink at least 2.5 litres of water daily — more in hot weather or during physical activity. Coconut water is excellent for electrolyte balance. 💧",
  },
  malnutrition: {
    title:"Malnutrition / Underweight", icon:"🌱",
    what:"Malnutrition remains a major challenge across Africa, affecting children, pregnant women, and those with chronic illness. It weakens immunity, impairs brain development, and increases mortality risk.",
    causes:["Food insecurity and poverty","Repeated infections (malaria, diarrhoea) increasing nutrient loss","Poor complementary feeding in infants","Wasting from chronic illness"],
    nutrition_goals:["Gradual, safe weight gain","Correct specific micronutrient deficiencies","Strengthen immune system","Restore normal growth (children)"],
    key_nutrients:[{n:"Energy-dense foods",r:"Caloric rehabilitation",f:"Groundnut paste, avocado, coconut, eggs"},{n:"Protein",r:"Tissue repair and muscle rebuilding",f:"Milk, eggs, legumes, omena, soya"},{n:"Zinc",r:"Growth and immune function",f:"Pumpkin seeds, beef, legumes"},{n:"Vitamin A",r:"Immunity and growth",f:"Orange/yellow foods, leafy greens, liver"}],
    avoid:["Very high-fiber foods initially (reduces caloric absorption)","Contaminated water or food","Alcohol"],
    tip:"Groundnut paste (peanut butter) mixed with moringa powder and a little honey is one of the most affordable, nutrient-dense foods for recovery — 2 tablespoons provide significant protein, zinc, and healthy fats. 🥜",
  },
  anaemia: {
    title:"Anaemia / Iron Deficiency", icon:"🩺",
    what:"Anaemia affects 67% of children and 38% of pregnant women in Africa. Iron deficiency is the most common cause, leading to fatigue, poor concentration, and impaired immune function.",
    causes:["Low dietary iron intake (low animal food access)","Poor iron absorption from plant sources","Heavy menstrual bleeding","Malaria, hookworm (parasites consuming blood)","Pregnancy increasing iron demand"],
    nutrition_goals:["Increase iron intake through food","Enhance iron absorption with vitamin C","Treat underlying causes with medical care","Restore energy levels"],
    key_nutrients:[{n:"Iron (Haem)",r:"Most bioavailable iron",f:"Liver, red meat, chicken, fish, omena"},{n:"Iron (Non-haem)",r:"Plant-based iron",f:"Managu, moringa, spinach, lentils, njahi"},{n:"Vitamin C",r:"Doubles iron absorption",f:"Guava, oranges, tomatoes, baobab"},{n:"Vitamin B12",r:"Required for red blood cell formation",f:"Eggs, meat, fish, dairy"}],
    avoid:["Tea and coffee with meals (block iron absorption — wait 1 hour)","Calcium supplements with iron-rich meals","Excess high-bran foods with iron meals"],
    tip:"Always eat your iron-rich meal with a source of vitamin C. A glass of fresh orange juice with your omena and sukuma wiki doubles the iron your body absorbs. 🍊",
  },
  pregnancy: {
    title:"Pregnancy & Lactation", icon:"🤰",
    what:"Pregnancy and breastfeeding are among the most nutritionally demanding periods of life. Good nutrition prevents maternal mortality, reduces low birth weight, and ensures healthy child development.",
    causes:["Increased nutrient demand for fetal growth","Risk: anaemia, pre-eclampsia, gestational diabetes","Nausea and food aversions reducing intake","Poverty limiting food access"],
    nutrition_goals:["Adequate folate to prevent neural tube defects","Sufficient iron to prevent anaemia","Calcium for bone development","DHA for brain development"],
    key_nutrients:[{n:"Folate / Folic Acid",r:"Prevents neural tube defects — critical in first trimester",f:"Dark leafy greens, lentils, njahi, oranges"},{n:"Iron",r:"Prevents maternal anaemia",f:"Liver, managu, moringa, omena, fortified cereals"},{n:"Calcium",r:"Fetal bone and tooth development",f:"Milk, mursik, omena (whole), moringa"},{n:"Iodine",r:"Brain development",f:"Iodised salt, seafood, eggs"}],
    avoid:["Raw/undercooked fish or meat","Unpasteurised dairy","Alcohol (no safe level in pregnancy)","Excess vitamin A supplements (liver in large amounts)","Herbal teas without medical advice"],
    tip:"Moringa leaves during pregnancy and lactation are remarkable — they provide iron, calcium, folate, and protein. A daily cup of moringa tea or powder in porridge supports both mother and baby. 🌿",
  },
  healthy: {
    title:"General Health & Wellness", icon:"🌿",
    what:"Even when healthy, African dietary patterns provide an incredible foundation for long-term wellness. Traditional whole foods are among the most nutrient-dense foods on earth — but modernisation is eroding this heritage.",
    causes:["Challenge: Urban shift to processed, refined foods","Sedentary lifestyle replacing traditional physical activity","Loss of traditional food knowledge","Economic pressures choosing cheap processed over nutritious local"],
    nutrition_goals:["Maintain a diverse, balanced diet","Prevent future chronic disease","Maintain healthy weight","Build a resilient immune system"],
    key_nutrients:[{n:"Variety",r:"Each colour provides different protective compounds",f:"Eat across the rainbow — different vegetables daily"},{n:"Fiber",r:"Gut health, cancer prevention, blood sugar",f:"Legumes, whole grains, vegetables"},{n:"Antioxidants",r:"Protect against cellular damage and aging",f:"Moringa, pawpaw, tomatoes, green vegetables"},{n:"Healthy fats",r:"Brain health, hormone production",f:"Avocado, fish, groundnuts, coconut"}],
    avoid:["Ultra-processed foods (packaged snacks, sodas)","Excessive refined sugars","Trans fats (deep-fried fast food)","Excess alcohol"],
    tip:"The traditional African plate — a grain, a legume, and a dark leafy vegetable — is nutritionally perfect. It provides complete protein, complex carbs, fiber, and micronutrients. Never abandon this heritage. 🌍",
  },
};

// ─── EXPANDED MEAL PLANS ──────────────────────────────────────────────────
const MEAL_PLANS = {
  diabetes2: {
    theme:"Low Glycemic & Blood Sugar Stabilising", color:"#e07b54", icon:"🩸",
    meals:{
      Monday:{breakfast:"Sorghum uji + boiled egg + avocado (½)",lunch:"Ugali (millet, small) + sukuma wiki + omena (50g)",dinner:"Arrow roots + managu + grilled tilapia",snack:"Handful roasted groundnuts"},
      Tuesday:{breakfast:"Oatmeal + chia seeds + pawpaw (½ cup)",lunch:"Brown rice + njahi beans + kachumbari",dinner:"Sweet potato + sukuma wiki + lean beef stew",snack:"2 passion fruits"},
      Wednesday:{breakfast:"Millet porridge + boiled egg",lunch:"Githeri (maize+beans) + kachumbari",dinner:"Arrow roots + lentil soup + steamed cabbage",snack:"Roasted soya beans"},
      Thursday:{breakfast:"Sorghum uji + avocado + egg",lunch:"Brown ugali + kunde + tomato salad",dinner:"Matoke (small) + sukuma wiki + tilapia",snack:"Plain yoghurt (100g)"},
      Friday:{breakfast:"Oatmeal + banana (½)",lunch:"Sweet potato + dengu stew + salad",dinner:"Arrow roots + managu + beef (lean, 80g)",snack:"Groundnuts (small handful)"},
      Saturday:{breakfast:"Millet porridge + 2 eggs + avocado",lunch:"Brown ugali + njahi + sukuma wiki",dinner:"Lentil soup + 1 chapati (whole wheat) + kachumbari",snack:"Pawpaw slices"},
      Sunday:{breakfast:"Vegetable omelette (2 eggs, tomato, onion)",lunch:"Mukimo + grilled fish + kachumbari",dinner:"Arrow roots + njahi + steamed managu",snack:"Roasted groundnuts"},
    },
    food_sources:[
      {food:"Millet & Sorghum", benefit:"Low glycemic index grains that release glucose slowly, preventing blood sugar spikes. Rich in magnesium which improves insulin sensitivity.", role:"Primary carbohydrate source that stabilises blood sugar throughout the day."},
      {food:"Njahi (Black Beans)", benefit:"Extremely high in soluble fiber (15g/100g) which slows glucose absorption. Also provides plant protein preventing blood sugar fluctuations.", role:"Replaces high-GI carbs while keeping you full for 4–6 hours."},
      {food:"Managu (African Nightshade)", benefit:"Very low calorie, rich in chromium (improves insulin function), vitamin C, and antioxidants that reduce diabetic complications.", role:"Anti-inflammatory vegetable that protects blood vessels damaged by high glucose."},
      {food:"Omena (Silver Cyprinid)", benefit:"High protein (45g/100g) that slows digestion and glucose absorption. Rich in omega-3 fatty acids reducing inflammation.", role:"Affordable protein that prevents post-meal blood sugar spikes."},
      {food:"Arrow Roots (Nduma)", benefit:"Medium-GI starch with resistant starch content that feeds beneficial gut bacteria and slows digestion.", role:"Safer starch alternative to white ugali, providing sustained energy."},
    ],
  },
  hypertension: {
    theme:"Low Sodium, High Potassium (DASH-Africa)", color:"#e05555", icon:"❤️",
    meals:{
      Monday:{breakfast:"Oatmeal + banana + low-fat milk (no salt)",lunch:"Ugali (unsalted) + sukuma wiki + grilled fish",dinner:"Arrow roots + bean soup + tomato salad",snack:"Watermelon cubes"},
      Tuesday:{breakfast:"Millet porridge + avocado (½)",lunch:"Brown rice + managu + boiled chicken (no skin)",dinner:"Sweet potato + lentil soup (unsalted)",snack:"Banana"},
      Wednesday:{breakfast:"2 boiled eggs + avocado + black tea",lunch:"Githeri (unsalted) + kachumbari",dinner:"Matoke + sukuma wiki + tilapia (grilled)",snack:"Pawpaw"},
      Thursday:{breakfast:"Sorghum uji + boiled egg",lunch:"Sweet potato + kunde + cucumber salad",dinner:"Ugali (small, unsalted) + omena + managu",snack:"Watermelon"},
      Friday:{breakfast:"Oatmeal + banana + low-fat milk",lunch:"Brown rice + njahi (unsalted) + kachumbari",dinner:"Arrow roots + lentil soup + spinach",snack:"Plain yoghurt (low-fat)"},
      Saturday:{breakfast:"Millet porridge + avocado + egg",lunch:"Mukimo (light) + grilled tilapia",dinner:"Lentil soup + 1 chapati (no salt) + salad",snack:"Fresh fruit mix"},
      Sunday:{breakfast:"Vegetable omelette (no salt, herbs only)",lunch:"Ugali + sukuma wiki + chicken (boiled)",dinner:"Sweet potato + managu + lean beef",snack:"Groundnuts (unsalted)"},
    },
    food_sources:[
      {food:"Banana", benefit:"One of Africa's richest potassium sources (422mg per banana). Potassium counteracts sodium and relaxes blood vessel walls, directly lowering blood pressure.", role:"Daily potassium supplement in food form — more effective and safer than supplements."},
      {food:"Avocado", benefit:"Rich in potassium (975mg per avocado), monounsaturated fats, and folate. Proven to reduce systolic blood pressure by 2–5 mmHg.", role:"Heart-healthy fat source that replaces harmful saturated fats and provides potassium."},
      {food:"Managu (African Nightshade)", benefit:"Rich in magnesium and potassium, and naturally low in sodium. Contains nitrates that convert to nitric oxide, widening blood vessels.", role:"One of Africa's best vegetables for blood pressure — eat daily without salt."},
      {food:"Omena (whole, with bones)", benefit:"Calcium from tiny bones supports healthy blood pressure regulation. Also rich in omega-3 which reduces arterial stiffness.", role:"Affordable source of bone-strengthening calcium and anti-inflammatory omega-3."},
      {food:"Arrow Roots", benefit:"Good source of potassium and magnesium with no sodium. Lower sodium than most staples. High fiber reduces cholesterol.", role:"Safer starch alternative that supports blood pressure without sodium load."},
    ],
  },
  cancer: {
    theme:"Anti-inflammatory, High Protein, Immune Support", color:"#8e44ad", icon:"💊",
    meals:{
      Monday:{breakfast:"Fortified millet porridge + groundnut paste + boiled egg",lunch:"Matoke + omena soup + managu",dinner:"Arrow roots + lentil soup + tilapia (soft)",snack:"Avocado (½)"},
      Tuesday:{breakfast:"Sorghum uji + milk + boiled egg",lunch:"Soft githeri + steamed sukuma wiki",dinner:"Ugali (small) + bean soup + steamed managu",snack:"Banana + groundnuts"},
      Wednesday:{breakfast:"Oatmeal with milk + avocado",lunch:"Arrow roots + omena + soft vegetables",dinner:"Lentil soup + chapati + steamed greens",snack:"Pawpaw + yoghurt"},
      Thursday:{breakfast:"Porridge + groundnut paste + egg",lunch:"Matoke + soft-cooked chicken + managu soup",dinner:"Sweet potato + njahi + steamed sukuma",snack:"Avocado + banana"},
      Friday:{breakfast:"Millet uji + egg + milk",lunch:"Brown rice + omena + steamed managu",dinner:"Arrow roots + lentil soup + tilapia",snack:"Groundnuts + pawpaw"},
      Saturday:{breakfast:"Oatmeal + avocado + milk",lunch:"Mukimo (soft) + chicken broth",dinner:"Matoke + bean soup + greens",snack:"Fortified yoghurt"},
      Sunday:{breakfast:"Sorghum porridge + groundnut paste + egg",lunch:"Ugali + omena + managu stew",dinner:"Lentil soup + arrow roots + steamed vegetables",snack:"Banana + groundnuts"},
    },
    food_sources:[
      {food:"Moringa Leaves", benefit:"Contains sulforaphane and isothiocyanates — compounds proven to inhibit cancer cell growth. Also provides vitamins A, C, E and antioxidants that protect healthy cells during chemotherapy.", role:"Africa's most powerful anti-cancer plant food. Add to porridge, soup, or take as powder daily."},
      {food:"Groundnut Paste (Peanut Butter)", benefit:"Rich in resveratrol (anti-cancer antioxidant), healthy fats, and protein to maintain muscle mass lost during treatment.", role:"Energy-dense protein source critical for maintaining weight during chemotherapy."},
      {food:"Pawpaw (Papaya)", benefit:"Rich in papain enzyme (aids digestion if gut is affected by treatment), lycopene, and vitamin C. Beta-carotene is a potent antioxidant.", role:"Gentle digestive food that soothes the gut during radiation or chemotherapy."},
      {food:"Omena/Dagaa", benefit:"High protein (45g/100g) for tissue repair. Omega-3 fatty acids reduce inflammation and may enhance chemotherapy effectiveness.", role:"Most affordable complete protein source for muscle maintenance during treatment."},
      {food:"Turmeric + Ginger", benefit:"Curcumin in turmeric is one of the world's most studied anti-cancer compounds. Ginger reduces chemotherapy-induced nausea significantly.", role:"Add to all soups and stews — natural anti-nausea and anti-cancer spices."},
    ],
  },
  hiv: {
    theme:"Immune Boosting, High Protein, ART Support", color:"#e74c3c", icon:"🎗️",
    meals:{
      Monday:{breakfast:"Fortified porridge + groundnut paste + egg + orange juice",lunch:"Brown rice + njahi + sukuma wiki + chicken",dinner:"Arrow roots + lentil soup + tilapia",snack:"Avocado + banana"},
      Tuesday:{breakfast:"Millet uji + milk + 2 eggs",lunch:"Ugali + managu + beef stew (lean)",dinner:"Sweet potato + bean soup + greens",snack:"Pawpaw + groundnuts"},
      Wednesday:{breakfast:"Oatmeal + milk + pawpaw",lunch:"Githeri + kachumbari + boiled egg",dinner:"Matoke + omena stew + spinach",snack:"Yoghurt + banana"},
      Thursday:{breakfast:"Sorghum porridge + groundnut paste + egg",lunch:"Brown ugali + kunde + chicken",dinner:"Arrow roots + lentil soup + managu",snack:"Avocado (½)"},
      Friday:{breakfast:"2 eggs + avocado + whole wheat bread",lunch:"Rice + njahi + sukuma wiki + fish",dinner:"Sweet potato + bean stew + greens",snack:"Groundnuts + orange"},
      Saturday:{breakfast:"Millet porridge + milk + eggs",lunch:"Mukimo + tilapia + kachumbari",dinner:"Ugali + omena + managu",snack:"Pawpaw + yoghurt"},
      Sunday:{breakfast:"Omelette (3 eggs + vegetables)",lunch:"Brown rice + chicken stew + salad",dinner:"Matoke + bean soup + spinach",snack:"Banana + groundnuts"},
    },
    food_sources:[
      {food:"Moringa Powder", benefit:"Exceptional zinc content (crucial for CD4 cell production), vitamin A (protects mucous membranes from infections), and iron. Daily use shown to improve nutritional status in PLHIV.", role:"One tablespoon daily in porridge provides significant immune-boosting micronutrients."},
      {food:"Eggs", benefit:"Complete protein with all essential amino acids for immune cell production. Rich in B12, zinc, and selenium — all critical for HIV management.", role:"Most affordable complete protein for daily immune support."},
      {food:"Njahi & Legumes", benefit:"Plant protein, zinc, folate, and iron to combat the nutritional losses of HIV. B vitamins support neurological health affected by HIV.", role:"Affordable daily protein and micronutrient source that supports ART effectiveness."},
      {food:"Orange + Pawpaw", benefit:"Vitamin C is an antioxidant that reduces oxidative stress (elevated in HIV). Also enhances iron absorption from plant sources.", role:"Daily vitamin C intake protects immune cells and helps absorb iron from plant foods."},
      {food:"Omena (Silver Cyprinid)", benefit:"Omega-3 fatty acids reduce HIV-related inflammation. High protein maintains muscle mass. Selenium (immune mineral) in significant quantities.", role:"Most nutrient-dense affordable fish — omega-3 reduces immune-activation inflammation."},
    ],
  },
  sickle_cell: {
    theme:"Anti-Sickling, Hydration, Anti-inflammatory", color:"#c0392b", icon:"🔴",
    meals:{
      Monday:{breakfast:"Millet porridge + orange juice + egg",lunch:"Brown ugali + sukuma wiki (managu) + fish",dinner:"Lentil soup + sweet potato + spinach",snack:"Banana + water (2 glasses)"},
      Tuesday:{breakfast:"Oatmeal + pawpaw + milk",lunch:"Rice + njahi + managu + chicken",dinner:"Arrow roots + bean soup + greens",snack:"Guava + coconut water"},
      Wednesday:{breakfast:"Sorghum uji + egg + orange",lunch:"Githeri + kachumbari + boiled egg",dinner:"Matoke + omena stew + spinach",snack:"Watermelon + water"},
      Thursday:{breakfast:"Fortified porridge + groundnut paste + milk",lunch:"Brown ugali + kunde + fish",dinner:"Sweet potato + lentil soup + managu",snack:"Banana + water"},
      Friday:{breakfast:"2 eggs + avocado + orange juice",lunch:"Rice + njahi + sukuma wiki",dinner:"Arrow roots + bean stew + greens",snack:"Pawpaw + coconut water"},
      Saturday:{breakfast:"Millet porridge + egg + banana",lunch:"Ugali + managu + chicken stew",dinner:"Lentil soup + matoke + spinach",snack:"Guava + water"},
      Sunday:{breakfast:"Oatmeal + milk + fruit",lunch:"Mukimo + fish + kachumbari",dinner:"Sweet potato + bean soup + managu",snack:"Watermelon + water"},
    },
    food_sources:[
      {food:"Dark Leafy Greens (Managu, Spinach, Terere)", benefit:"Rich in folate — essential for producing healthy red blood cells. Also provides iron to combat chronic anaemia from haemolysis (destruction of sickled cells).", role:"Daily consumption supports healthy red blood cell production to replace rapidly destroyed cells."},
      {food:"Water & Coconut Water", benefit:"Dehydration is the primary trigger for sickling crises. Adequate hydration keeps red blood cells from deoxygenating and sickling.", role:"Medicine in liquid form — 10–12 glasses daily prevents crisis. Coconut water adds electrolytes."},
      {food:"Vitamin C rich fruits (Guava, Orange, Baobab)", benefit:"Vitamin C reduces oxidative stress that worsens sickling. Also enhances absorption of iron from plant foods.", role:"Daily vitamin C intake reduces cell damage and supports iron absorption."},
      {food:"Groundnuts & Legumes", benefit:"Rich in zinc — shown in studies to reduce frequency and severity of sickle cell crises. Also provides folic acid and protein.", role:"Zinc from daily groundnut consumption may reduce pain crisis frequency."},
      {food:"Omega-3 foods (Omena, Tilapia)", benefit:"Anti-inflammatory omega-3 reduces vaso-occlusive crisis frequency by reducing blood viscosity and inflammation in blood vessels.", role:"Regular fish consumption reduces inflammation that triggers painful crises."},
    ],
  },
  healthy: {
    theme:"Balanced, Diverse, Preventive Whole Foods", color:"#27ae60", icon:"🌿",
    meals:{
      Monday:{breakfast:"Millet porridge + boiled egg + avocado",lunch:"Ugali + sukuma wiki + grilled tilapia",dinner:"Arrow roots + njahi + managu stir-fry",snack:"Banana + groundnuts"},
      Tuesday:{breakfast:"Oatmeal + banana + black tea",lunch:"Githeri + kachumbari + plain yoghurt",dinner:"Sweet potato + lentil soup + sukuma wiki",snack:"Pawpaw"},
      Wednesday:{breakfast:"2 eggs + avocado + tea",lunch:"Brown rice + kunde + tomato salad",dinner:"Ugali + omena + managu",snack:"Roasted groundnuts"},
      Thursday:{breakfast:"Sorghum uji + egg",lunch:"Mukimo + tilapia + kachumbari",dinner:"Arrow roots + bean soup + greens",snack:"Fresh fruit"},
      Friday:{breakfast:"Oatmeal + avocado + egg",lunch:"Chapati (1, whole wheat) + njahi stew",dinner:"Sweet potato + omena + sukuma wiki",snack:"Yoghurt"},
      Saturday:{breakfast:"Millet porridge + 2 eggs + avocado",lunch:"Brown ugali + sukuma wiki + grilled fish",dinner:"Lentil soup + matoke + managu",snack:"Banana"},
      Sunday:{breakfast:"Vegetable omelette + tea",lunch:"Githeri + kachumbari + yoghurt",dinner:"Arrow roots + chicken stew + greens",snack:"Groundnuts + pawpaw"},
    },
    food_sources:[
      {food:"Moringa (The Miracle Tree)", benefit:"Gram for gram, more calcium than milk, more iron than spinach, more vitamin A than carrots, more protein than eggs. One tablespoon of moringa powder covers 20% of daily iron needs.", role:"Africa's most complete superfood — add to any meal daily as a preventive health powerhouse."},
      {food:"Omena (Silver Cyprinid)", benefit:"Pound for pound one of the world's most nutrient-dense foods. Complete protein, omega-3, calcium (from bones), iron, and zinc in one small affordable fish.", role:"Eat 2–3 times weekly for complete protein, healthy fats, and minerals."},
      {food:"Njahi & African Legumes", benefit:"High fiber (15g/100g), complete amino acids when paired with grains, prebiotic that feeds beneficial gut bacteria, lowers cholesterol and blood sugar.", role:"The foundation of a healthy African diet — eat legumes daily for gut, heart, and metabolic health."},
      {food:"Managu & Indigenous Leafy Greens", benefit:"More nutritious than any imported vegetable. Rich in iron, calcium, vitamin C, folate, and protective phytonutrients unique to African plants.", role:"Daily leafy green intake is the single most impactful dietary change for long-term health."},
      {food:"Avocado", benefit:"Africa's own 'superfood' — rich in potassium (more than banana), heart-healthy monounsaturated fats, folate, and vitamins K, E, C, B6. Enhances absorption of fat-soluble vitamins from other foods.", role:"Eat with vegetables to dramatically increase absorption of vitamins A, D, E, K from the whole meal."},
    ],
  },
};

// ─── EXPANDED FOOD DATABASE (Africa-wide) ─────────────────────────────────
const LOCAL_FOODS = [
  // East Africa Staples
  {name:"Ugali (Maize)",cal:120,carbs:27,protein:2,fat:0.5,fiber:0.4,category:"Staple",gi:"High",region:"East Africa"},
  {name:"Ugali (Millet)",cal:105,carbs:23,protein:3,fat:1.2,fiber:2.1,category:"Staple",gi:"Low",region:"East Africa"},
  {name:"Ugali (Sorghum)",cal:100,carbs:22,protein:3.3,fat:1,fiber:2.5,category:"Staple",gi:"Low",region:"East Africa"},
  {name:"Chapati",cal:210,carbs:35,protein:5,fat:6.5,fiber:1.2,category:"Staple",gi:"High",region:"East Africa"},
  {name:"Githeri",cal:178,carbs:32,protein:9,fat:1.2,fiber:6.2,category:"Legume",gi:"Medium",region:"East Africa"},
  {name:"Mukimo",cal:195,carbs:38,protein:6,fat:2.1,fiber:4.5,category:"Staple",gi:"Medium",region:"East Africa"},
  {name:"Arrow Roots (Nduma)",cal:112,carbs:26,protein:1.5,fat:0.2,fiber:3.4,category:"Staple",gi:"Medium",region:"East Africa"},
  {name:"Matoke (Plantain)",cal:122,carbs:31,protein:1.3,fat:0.3,fiber:2.3,category:"Staple",gi:"Medium",region:"East Africa"},
  // West Africa Staples
  {name:"Fufu (Cassava)",cal:142,carbs:34,protein:0.5,fat:0.3,fiber:1.8,category:"Staple",gi:"High",region:"West Africa"},
  {name:"Banku",cal:135,carbs:30,protein:2.2,fat:0.5,fiber:1.5,category:"Staple",gi:"Medium",region:"West Africa"},
  {name:"Kenkey",cal:128,carbs:28,protein:2.8,fat:0.8,fiber:2.0,category:"Staple",gi:"Medium",region:"West Africa"},
  {name:"Pounded Yam",cal:118,carbs:27,protein:1.5,fat:0.1,fiber:4.1,category:"Staple",gi:"High",region:"West Africa"},
  {name:"Eba (Garri)",cal:148,carbs:35,protein:0.6,fat:0.2,fiber:1.6,category:"Staple",gi:"High",region:"West Africa"},
  {name:"Plantain (Boiled)",cal:116,carbs:29,protein:1,fat:0.2,fiber:2.3,category:"Staple",gi:"Medium",region:"West Africa"},
  // East/Horn of Africa
  {name:"Injera",cal:89,carbs:18,protein:3.5,fat:0.7,fiber:3.2,category:"Grain",gi:"Low",region:"Horn of Africa"},
  {name:"Teff (Whole Grain)",cal:101,carbs:20,protein:3.9,fat:0.7,fiber:2.8,category:"Grain",gi:"Low",region:"Horn of Africa"},
  // Southern Africa
  {name:"Sadza (Maize Meal)",cal:120,carbs:27,protein:2,fat:0.5,fiber:0.4,category:"Staple",gi:"High",region:"Southern Africa"},
  {name:"Nshima",cal:115,carbs:26,protein:2.1,fat:0.4,fiber:0.6,category:"Staple",gi:"High",region:"Southern Africa"},
  {name:"Mealie Bread",cal:198,carbs:40,protein:5,fat:2.5,fiber:3.2,category:"Grain",gi:"Medium",region:"Southern Africa"},
  // Vegetables
  {name:"Sukuma Wiki (Kale)",cal:35,carbs:6,protein:3,fat:0.5,fiber:2.1,category:"Vegetable",gi:"Low",region:"East Africa"},
  {name:"Managu (African Nightshade)",cal:40,carbs:7,protein:4,fat:0.6,fiber:2.8,category:"Vegetable",gi:"Low",region:"East Africa"},
  {name:"Terere (Amaranth)",cal:23,carbs:4,protein:2.5,fat:0.3,fiber:2.5,category:"Vegetable",gi:"Low",region:"East Africa"},
  {name:"Kunde (Cowpea Leaves)",cal:42,carbs:7,protein:4.5,fat:0.6,fiber:3.2,category:"Vegetable",gi:"Low",region:"East Africa"},
  {name:"Saga (Spider Plant)",cal:38,carbs:6,protein:3.8,fat:0.4,fiber:2.6,category:"Vegetable",gi:"Low",region:"East Africa"},
  {name:"Moringa Leaves",cal:64,carbs:8,protein:9,fat:1.4,fiber:4.0,category:"Vegetable",gi:"Low",region:"Pan-Africa"},
  {name:"Bitter Leaf (Onugbu)",cal:30,carbs:5,protein:3.3,fat:0.3,fiber:4.4,category:"Vegetable",gi:"Low",region:"West Africa"},
  {name:"Ugu (Fluted Pumpkin)",cal:35,carbs:6,protein:3,fat:0.2,fiber:2.8,category:"Vegetable",gi:"Low",region:"West Africa"},
  {name:"Kontomire (Cocoyam Leaves)",cal:42,carbs:7,protein:3.8,fat:0.5,fiber:2.4,category:"Vegetable",gi:"Low",region:"West Africa"},
  {name:"Okra",cal:33,carbs:7,protein:1.9,fat:0.2,fiber:3.2,category:"Vegetable",gi:"Low",region:"Pan-Africa"},
  {name:"African Eggplant (Ngilo)",cal:25,carbs:6,protein:1,fat:0.2,fiber:2.0,category:"Vegetable",gi:"Low",region:"Pan-Africa"},
  // Legumes
  {name:"Njahi (Black Beans)",cal:160,carbs:28,protein:10,fat:0.6,fiber:7.5,category:"Legume",gi:"Low",region:"East Africa"},
  {name:"Dengu (Green Grams)",cal:147,carbs:26,protein:9.9,fat:0.7,fiber:7.6,category:"Legume",gi:"Low",region:"East Africa"},
  {name:"Lentils (Kamande)",cal:116,carbs:20,protein:9,fat:0.4,fiber:7.9,category:"Legume",gi:"Low",region:"Pan-Africa"},
  {name:"Groundnuts (Roasted)",cal:567,carbs:16,protein:26,fat:49,fiber:8.5,category:"Legume",gi:"Low",region:"Pan-Africa"},
  {name:"Black-eyed Peas (Kunde)",cal:149,carbs:25,protein:11,fat:0.5,fiber:6.1,category:"Legume",gi:"Low",region:"Pan-Africa"},
  {name:"Bambara Nuts",cal:367,carbs:57,protein:19,fat:6.5,fiber:10,category:"Legume",gi:"Low",region:"West/Southern Africa"},
  {name:"Pigeon Peas",cal:121,carbs:21,protein:6.7,fat:0.4,fiber:5.1,category:"Legume",gi:"Low",region:"Pan-Africa"},
  {name:"Soya Beans",cal:173,carbs:10,protein:17,fat:9,fiber:6,category:"Legume",gi:"Low",region:"Pan-Africa"},
  {name:"Chickpeas",cal:164,carbs:27,protein:9,fat:2.6,fiber:7.6,category:"Legume",gi:"Low",region:"Pan-Africa"},
  // Proteins
  {name:"Omena (Silver Cyprinid)",cal:220,carbs:0,protein:45,fat:5,fiber:0,category:"Protein",gi:"Low",region:"East Africa"},
  {name:"Tilapia (Grilled)",cal:128,carbs:0,protein:26,fat:2.7,fiber:0,category:"Protein",gi:"Low",region:"East Africa"},
  {name:"Nile Perch",cal:130,carbs:0,protein:25,fat:3,fiber:0,category:"Protein",gi:"Low",region:"East Africa"},
  {name:"Catfish",cal:122,carbs:0,protein:18,fat:5.6,fiber:0,category:"Protein",gi:"Low",region:"West Africa"},
  {name:"Dried Shrimp",cal:295,carbs:3,protein:62,fat:3,fiber:0,category:"Protein",gi:"Low",region:"West Africa"},
  {name:"Mackerel",cal:205,carbs:0,protein:19,fat:13.9,fiber:0,category:"Protein",gi:"Low",region:"West Africa"},
  {name:"Sardines (canned)",cal:190,carbs:0,protein:25,fat:10,fiber:0,category:"Protein",gi:"Low",region:"Pan-Africa"},
  {name:"Eggs",cal:155,carbs:1.1,protein:13,fat:11,fiber:0,category:"Protein",gi:"Low",region:"Pan-Africa"},
  {name:"Chicken (lean)",cal:165,carbs:0,protein:31,fat:3.6,fiber:0,category:"Protein",gi:"Low",region:"Pan-Africa"},
  {name:"Beef (lean)",cal:143,carbs:0,protein:26,fat:3.7,fiber:0,category:"Protein",gi:"Low",region:"Pan-Africa"},
  {name:"Goat Meat",cal:109,carbs:0,protein:23,fat:2.3,fiber:0,category:"Protein",gi:"Low",region:"Pan-Africa"},
  {name:"Liver (Beef)",cal:135,carbs:3.9,protein:20,fat:3.6,fiber:0,category:"Protein",gi:"Low",region:"Pan-Africa"},
  {name:"Grasshoppers (Nsenene)",cal:120,carbs:3,protein:17,fat:5,fiber:1.8,category:"Protein",gi:"Low",region:"East Africa"},
  // Fruits
  {name:"Avocado",cal:160,carbs:9,protein:2,fat:14.7,fiber:6.7,category:"Fruit",gi:"Low",region:"Pan-Africa"},
  {name:"Banana (Ndizi)",cal:89,carbs:23,protein:1.1,fat:0.3,fiber:2.6,category:"Fruit",gi:"Medium",region:"Pan-Africa"},
  {name:"Pawpaw (Papaya)",cal:43,carbs:11,protein:0.5,fat:0.3,fiber:1.7,category:"Fruit",gi:"Low",region:"Pan-Africa"},
  {name:"Mango",cal:60,carbs:15,protein:0.8,fat:0.4,fiber:1.6,category:"Fruit",gi:"Medium",region:"Pan-Africa"},
  {name:"Guava",cal:68,carbs:14,protein:2.6,fat:1,fiber:5.4,category:"Fruit",gi:"Low",region:"Pan-Africa"},
  {name:"Passion Fruit",cal:97,carbs:23,protein:2.2,fat:0.7,fiber:10.4,category:"Fruit",gi:"Low",region:"Pan-Africa"},
  {name:"Watermelon",cal:30,carbs:8,protein:0.6,fat:0.2,fiber:0.4,category:"Fruit",gi:"High",region:"Pan-Africa"},
  {name:"Baobab Fruit",cal:83,carbs:16,protein:2.3,fat:0.3,fiber:44,category:"Fruit",gi:"Low",region:"Pan-Africa"},
  {name:"Soursop (Graviola)",cal:66,carbs:17,protein:1,fat:0.3,fiber:3.3,category:"Fruit",gi:"Low",region:"West Africa"},
  {name:"African Star Apple",cal:67,carbs:17,protein:0.7,fat:0.2,fiber:3.2,category:"Fruit",gi:"Low",region:"West Africa"},
  {name:"Tamarind",cal:239,carbs:63,protein:2.8,fat:0.6,fiber:5.1,category:"Fruit",gi:"Low",region:"Pan-Africa"},
  {name:"Jackfruit",cal:95,carbs:24,protein:1.7,fat:0.6,fiber:1.5,category:"Fruit",gi:"Medium",region:"East Africa"},
  {name:"Pineapple",cal:50,carbs:13,protein:0.5,fat:0.1,fiber:1.4,category:"Fruit",gi:"Medium",region:"Pan-Africa"},
  {name:"Sweet Potato",cal:86,carbs:20,protein:1.6,fat:0.1,fiber:3,category:"Staple",gi:"Medium",region:"Pan-Africa"},
  {name:"Cassava (Boiled)",cal:160,carbs:38,protein:1.4,fat:0.3,fiber:1.8,category:"Staple",gi:"High",region:"Pan-Africa"},
  {name:"Cocoyam / Taro",cal:112,carbs:26,protein:1.5,fat:0.2,fiber:4.1,category:"Staple",gi:"Medium",region:"West Africa"},
  // Grains
  {name:"Millet Porridge",cal:90,carbs:19,protein:3,fat:1,fiber:1.8,category:"Grain",gi:"Low",region:"Pan-Africa"},
  {name:"Sorghum Uji",cal:75,carbs:16,protein:2.5,fat:0.7,fiber:1.5,category:"Grain",gi:"Low",region:"Pan-Africa"},
  {name:"Oatmeal",cal:71,carbs:12,protein:2.5,fat:1.4,fiber:1.7,category:"Grain",gi:"Low",region:"General"},
  {name:"Brown Rice",cal:112,carbs:23,protein:2.3,fat:0.9,fiber:1.8,category:"Grain",gi:"Medium",region:"General"},
  {name:"Whole Wheat Bread",cal:247,carbs:41,protein:13,fat:3.4,fiber:7,category:"Grain",gi:"Medium",region:"General"},
  // Dairy & Fermented
  {name:"Mursik (Fermented Milk)",cal:52,carbs:5,protein:3.5,fat:2,fiber:0,category:"Dairy",gi:"Low",region:"East Africa"},
  {name:"Plain Yoghurt",cal:61,carbs:4.7,protein:3.5,fat:3.3,fiber:0,category:"Dairy",gi:"Low",region:"General"},
  {name:"Milk (Cow)",cal:61,carbs:4.8,protein:3.2,fat:3.3,fiber:0,category:"Dairy",gi:"Low",region:"Pan-Africa"},
  {name:"Ogi/Akamu (Fermented Maize Porridge)",cal:60,carbs:13,protein:1.2,fat:0.3,fiber:0.8,category:"Grain",gi:"Medium",region:"West Africa"},
  // Oils & Fats
  {name:"Palm Oil (Red)",cal:884,carbs:0,protein:0,fat:100,fiber:0,category:"Oil",gi:"Low",region:"West/Central Africa"},
  {name:"Coconut Oil",cal:862,carbs:0,protein:0,fat:100,fiber:0,category:"Oil",gi:"Low",region:"Coastal Africa"},
  {name:"Groundnut Oil",cal:884,carbs:0,protein:0,fat:100,fiber:0,category:"Oil",gi:"Low",region:"Pan-Africa"},
  // Herbs & Superfoods
  {name:"Moringa Powder",cal:205,carbs:38,protein:25,fat:5,fiber:19,category:"Superfood",gi:"Low",region:"Pan-Africa"},
  {name:"Baobab Powder",cal:250,carbs:59,protein:3.8,fat:0.9,fiber:44,category:"Superfood",gi:"Low",region:"Pan-Africa"},
  {name:"African Locust Bean (Dawadawa)",cal:367,carbs:42,protein:29,fat:11,fiber:11,category:"Superfood",gi:"Low",region:"West Africa"},
];

// ─── SUPABASE LIGHTWEIGHT CLIENT ──────────────────────────────────────────
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || "";
const supabase = {
  auth: {
    signUp: async ({ email, password, options }) => {
      if (!SUPABASE_URL) return { data:null, error:{ message:"No Supabase configured" } };
      const r = await fetch(`${SUPABASE_URL}/auth/v1/signup`, { method:"POST", headers:{"Content-Type":"application/json",apikey:SUPABASE_ANON_KEY}, body:JSON.stringify({ email, password, data:options?.data }) });
      const d = await r.json();
      if (d.error) return { data:null, error:d.error };
      localStorage.setItem("np_token", d.access_token);
      const userData = { ...d.user, ...options?.data };
      localStorage.setItem("np_user", JSON.stringify(userData));
      return { data:{ user:userData }, error:null };
    },
    signIn: async ({ email, password }) => {
      if (!SUPABASE_URL) return { data:null, error:{ message:"No Supabase" } };
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

// ─── SHARED STYLES ────────────────────────────────────────────────────────
const iSty = { width:"100%", padding:"12px 16px", borderRadius:12, border:"1.5px solid #d0d0d0", fontSize:15, background:"#fff", color:C.charcoal, boxSizing:"border-box", outline:"none" };
const lSty = { display:"block", fontWeight:700, color:C.forest, marginBottom:6, fontSize:13 };
const bPri = { padding:"13px 24px", background:`linear-gradient(135deg, ${C.jade}, ${C.forest})`, color:"#fff", border:"none", borderRadius:12, cursor:"pointer", fontWeight:800, fontSize:15 };
const eSty = { background:"#fff0ed", border:"1px solid #f5c6bc", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#c0392b" };
const okSty = { background:"#edfaf3", border:"1px solid #a8e6c4", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#27ae60" };

async function sendNotification(type, user) {
  try { await fetch("/api/notify", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ type, user }) }); } catch(e) {}
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────
function Navbar({ page, setPage, user, onLogout }) {
  const navItems = ["Dashboard","Meal Plans","Food Database","Chat","Community","Tracking","Reminders"];
  const conditions = Array.isArray(user?.conditions) ? user.conditions : user?.condition ? [user.condition] : [];
  return (
    <nav style={{ background:C.forest, position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 24px rgba(0,0,0,0.4)" }}>
      <style>{`.nb{transition:all 0.2s;border:1px solid transparent;} .nb:hover{background:rgba(109,207,158,0.12)!important;border-color:rgba(109,207,158,0.2)!important;} .lo:hover{background:rgba(255,255,255,0.18)!important;}`}</style>
      <div style={{ maxWidth:1360, margin:"0 auto", padding:"0 20px", display:"flex", alignItems:"center", height:64 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", flex:1 }} onClick={() => setPage("Dashboard")}>
          <div style={{ width:38, height:38, borderRadius:"50%", background:`linear-gradient(135deg, ${C.mint}, ${C.lime})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, boxShadow:`0 0 0 3px rgba(109,207,158,0.25)` }}>🌿</div>
          <span style={{ color:C.cream, fontWeight:900, fontSize:21, fontFamily:"Georgia,serif" }}>Nutri<span style={{ color:C.lime }}>Pulse</span></span>
        </div>
        <div style={{ display:"flex", gap:1, alignItems:"center", flexWrap:"wrap" }}>
          {navItems.map(item => (
            <button key={item} className="nb" onClick={() => setPage(item)} style={{ background:page===item?"rgba(45,158,107,0.25)":"transparent", color:page===item?C.lime:"rgba(196,235,213,0.8)", cursor:"pointer", padding:"7px 11px", borderRadius:8, fontWeight:600, fontSize:12 }}>{item}</button>
          ))}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:10, paddingLeft:10, borderLeft:"1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ color:C.cream, fontSize:12, fontWeight:700 }}>{user?.name?.split(" ")[0] || "User"}</div>
              <div style={{ color:C.lime, fontSize:10, opacity:0.7 }}>{conditions.length > 0 ? conditions.map(c => ALL_CONDITIONS.find(x=>x.id===c)?.icon || "").join(" ") : "🌿"}</div>
            </div>
            <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg, ${C.mint}, ${C.jade})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:14 }}>{user?.name?.[0]?.toUpperCase()||"U"}</div>
            <button className="lo" onClick={onLogout} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:C.lime, borderRadius:8, padding:"5px 10px", cursor:"pointer", fontSize:11, fontWeight:700, transition:"all 0.2s" }}>Sign out</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── DASHBOARD (redesigned — client-centred) ──────────────────────────────
function Dashboard({ user, setPage }) {
  const conditions = Array.isArray(user?.conditions) ? user.conditions : user?.condition ? [user.condition] : ["healthy"];
  const conditionObjects = conditions.map(c => ALL_CONDITIONS.find(x => x.id === c)).filter(Boolean);
  const primaryCond = conditionObjects[0] || ALL_CONDITIONS.find(x=>x.id==="healthy");
  const h = new Date().getHours();
  const greeting = h < 5 ? "Good night" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const tips = [
    "🌿 Moringa leaves have 7x more vitamin C than oranges — add a spoonful to your daily porridge.",
    "🫘 Legumes (njahi, dengu, lentils) eaten daily reduce heart disease risk by up to 40%.",
    "💧 Drinking water 30 minutes before meals reduces calorie intake and improves digestion.",
    "🐟 Omena eaten with the bones provides more calcium than a glass of milk.",
    "🥑 Eating avocado with vegetables increases absorption of vitamins A, D, E, K by up to 400%.",
    "🌾 Millet and sorghum have 3x more nutrition than refined maize flour — and cost the same.",
    "🍋 Adding lemon or orange juice to iron-rich meals doubles the iron your body absorbs.",
    "🌱 Moringa powder: one tablespoon = 25% daily protein, 60% vitamin A, 20% iron needs.",
  ];
  const [tipIdx] = useState(Math.floor(Math.random() * tips.length));
  const weekDay = new Date().toLocaleDateString("en-KE", { weekday:"long", day:"numeric", month:"long" });

  return (
    <div style={{ background:"#f5f4ef", minHeight:"100vh" }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse3{0%,100%{opacity:1}50%{opacity:0.6}}
        .dash-card{transition:transform 0.2s,box-shadow 0.2s;} .dash-card:hover{transform:translateY(-3px);box-shadow:0 10px 30px rgba(0,0,0,0.1)!important;}
        .qbtn{transition:all 0.2s;} .qbtn:hover{background:#e8f5ee!important;border-color:${C.jade}!important;transform:translateX(3px);}
      `}</style>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }}>

        {/* ── Hero Welcome Banner ── */}
        <div style={{ background:`linear-gradient(135deg, ${C.forest} 0%, ${C.jade} 65%, ${C.mint} 100%)`, borderRadius:24, padding:"40px 48px", marginBottom:28, position:"relative", overflow:"hidden", boxShadow:"0 12px 48px rgba(10,31,18,0.35)", animation:"fadeUp 0.5s ease" }}>
          <div style={{ position:"absolute", right:-40, top:-40, fontSize:200, opacity:0.04, userSelect:"none" }}>🌍</div>
          <div style={{ position:"absolute", left:"58%", bottom:-30, fontSize:120, opacity:0.06, transform:"rotate(-15deg)", userSelect:"none" }}>🌿</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:20 }}>
            <div>
              <div style={{ color:C.lime, fontWeight:700, fontSize:12, marginBottom:8, letterSpacing:2, textTransform:"uppercase", opacity:0.9 }}>{greeting}</div>
              <h1 style={{ color:C.cream, margin:"0 0 10px", fontSize:36, fontFamily:"Georgia,serif", fontWeight:800, lineHeight:1.15 }}>{user?.name || "Welcome"} 👋</h1>
              <p style={{ color:C.mist, margin:"0 0 6px", fontSize:14, opacity:0.85 }}>{weekDay}</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:24, marginTop:8 }}>
                {conditionObjects.map(c => (
                  <span key={c.id} style={{ background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.2)", color:C.cream, padding:"5px 14px", borderRadius:30, fontSize:12, fontWeight:700 }}>
                    {c.icon} {c.label}
                  </span>
                ))}
              </div>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <button onClick={() => setPage("Meal Plans")} style={{ background:C.mint, color:C.forest, border:"none", padding:"11px 26px", borderRadius:30, fontWeight:800, cursor:"pointer", fontSize:13, boxShadow:"0 4px 16px rgba(45,158,107,0.5)" }}>📅 My Meal Plan →</button>
                <button onClick={() => setPage("Chat")} style={{ background:"rgba(255,255,255,0.12)", color:C.lime, border:`1.5px solid rgba(109,207,158,0.5)`, padding:"11px 26px", borderRadius:30, fontWeight:800, cursor:"pointer", fontSize:13 }}>🤖 Ask NutriBot</button>
                <button onClick={() => setPage("Education")} style={{ background:"rgba(255,255,255,0.08)", color:C.cream, border:"1.5px solid rgba(255,255,255,0.2)", padding:"11px 26px", borderRadius:30, fontWeight:800, cursor:"pointer", fontSize:13 }}>📚 Nutrition Guide</button>
              </div>
            </div>
            {/* Today's health score card */}
            <div style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:18, padding:"20px 24px", minWidth:180, textAlign:"center", backdropFilter:"blur(10px)" }}>
              <div style={{ color:C.lime, fontSize:11, fontWeight:700, letterSpacing:1, marginBottom:8, textTransform:"uppercase" }}>Today's Focus</div>
              <div style={{ fontSize:48, marginBottom:8 }}>{primaryCond?.icon}</div>
              <div style={{ color:C.cream, fontWeight:800, fontSize:14, lineHeight:1.3 }}>{primaryCond?.label}</div>
              <div style={{ height:2, background:"rgba(255,255,255,0.15)", borderRadius:1, margin:"12px 0" }} />
              <div style={{ color:C.lime, fontSize:11 }}>Your personalised plan is ready</div>
            </div>
          </div>
        </div>

        {/* ── Daily Tip + Condition Education Cards ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:28 }}>
          {/* Nutrition Tip */}
          <div className="dash-card" style={{ background:`linear-gradient(135deg, ${C.mist}, #f0faf5)`, borderRadius:18, padding:26, border:`2px solid ${C.lime}`, boxShadow:"0 2px 16px rgba(0,0,0,0.04)", animation:"fadeUp 0.5s ease 0.1s both" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:C.jade, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>💡</div>
              <h3 style={{ margin:0, color:C.jade, fontSize:14, fontWeight:800 }}>Daily Nutrition Insight</h3>
            </div>
            <p style={{ color:C.forest, lineHeight:1.85, margin:"0 0 14px", fontSize:14 }}>{tips[tipIdx]}</p>
            <button onClick={() => setPage("Education")} style={{ background:"transparent", border:`1px solid ${C.jade}`, color:C.jade, padding:"7px 16px", borderRadius:20, cursor:"pointer", fontWeight:700, fontSize:12 }}>Learn more →</button>
          </div>

          {/* Primary Condition Card */}
          <div className="dash-card" style={{ background:"#fff", borderRadius:18, padding:26, boxShadow:"0 2px 16px rgba(0,0,0,0.06)", animation:"fadeUp 0.5s ease 0.15s both", borderTop:`4px solid ${primaryCond?.color || C.mint}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:`${primaryCond?.color || C.mint}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{primaryCond?.icon}</div>
              <div>
                <h3 style={{ margin:0, color:C.forest, fontSize:14, fontWeight:800 }}>Your Condition Focus</h3>
                <div style={{ color:"#888", fontSize:12 }}>{primaryCond?.label}</div>
              </div>
            </div>
            {CONDITION_INFO[primaryCond?.id] ? (
              <>
                <p style={{ color:"#555", lineHeight:1.7, margin:"0 0 12px", fontSize:13 }}>{CONDITION_INFO[primaryCond.id].what.slice(0, 160)}...</p>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={() => setPage("Education")} style={{ background:`${primaryCond?.color || C.mint}15`, border:`1px solid ${primaryCond?.color || C.mint}`, color:primaryCond?.color || C.mint, padding:"7px 14px", borderRadius:20, cursor:"pointer", fontWeight:700, fontSize:12 }}>Read full guide →</button>
                </div>
              </>
            ) : (
              <p style={{ color:"#888", fontSize:13 }}>Select a condition during onboarding to see your personalised health education guide.</p>
            )}
          </div>
        </div>

        {/* ── Quick Health Actions ── */}
        <div style={{ background:"#fff", borderRadius:18, padding:26, boxShadow:"0 2px 16px rgba(0,0,0,0.05)", marginBottom:28, animation:"fadeUp 0.5s ease 0.2s both" }}>
          <h3 style={{ margin:"0 0 18px", color:C.forest, fontSize:16, fontWeight:800 }}>⚡ Your Health Actions Today</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px,1fr))", gap:12 }}>
            {[
              { icon:"🍽️", label:"Log Today's Meals", sub:"Track what you ate", page:"Tracking", color:C.terra },
              { icon:"📅", label:"View Meal Plan", sub:`${conditions[0]}-focused meals this week`, page:"Meal Plans", color:C.mint },
              { icon:"🤖", label:"Ask NutriBot", sub:"Get personalised AI nutrition advice", page:"Chat", color:C.jade },
              { icon:"📚", label:"Nutrition Education", sub:"Learn about your condition & diet", page:"Education", color:C.sand },
              { icon:"🌾", label:"Explore Foods", sub:"Browse 80+ African foods", page:"Food Database", color:"#8e44ad" },
              { icon:"🔔", label:"Set Reminders", sub:"Meal & medication times", page:"Reminders", color:"#2980b9" },
            ].map(a => (
              <button key={a.label} className="qbtn" onClick={() => setPage(a.page)} style={{ display:"flex", alignItems:"center", gap:12, background:"#fafafa", border:"1.5px solid #ebebeb", borderRadius:14, padding:"14px 16px", cursor:"pointer", textAlign:"left" }}>
                <div style={{ width:40, height:40, borderRadius:12, background:`${a.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{a.icon}</div>
                <div>
                  <div style={{ color:C.forest, fontWeight:800, fontSize:13 }}>{a.label}</div>
                  <div style={{ color:"#aaa", fontSize:11, marginTop:2 }}>{a.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Primary Health Care Pillars ── */}
        <div style={{ background:`linear-gradient(135deg, ${C.forest}, ${C.jade})`, borderRadius:18, padding:"28px 32px", animation:"fadeUp 0.5s ease 0.25s both" }}>
          <h3 style={{ color:C.lime, margin:"0 0 6px", fontWeight:800, fontSize:16 }}>🌍 Primary Health Care — Your 4 Pillars</h3>
          <p style={{ color:C.mist, fontSize:13, margin:"0 0 20px", opacity:0.85 }}>NutriPulse addresses the root causes of disease through evidence-based African nutrition</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px,1fr))", gap:14 }}>
            {[
              { icon:"🥗", title:"Therapeutic Nutrition", desc:"Food as medicine — condition-specific meal plans targeting root causes" },
              { icon:"🎓", title:"Health Education", desc:"Understanding your condition empowers better daily decisions" },
              { icon:"🔬", title:"Disease Prevention", desc:"African superfoods that prevent chronic disease before it starts" },
              { icon:"🤝", title:"Community Support", desc:"Shared experiences, challenges, and accountability with peers" },
            ].map(p => (
              <div key={p.title} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, padding:"16px 18px" }}>
                <div style={{ fontSize:26, marginBottom:8 }}>{p.icon}</div>
                <div style={{ color:C.cream, fontWeight:800, fontSize:13, marginBottom:4 }}>{p.title}</div>
                <div style={{ color:C.mist, fontSize:12, opacity:0.8, lineHeight:1.6 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── NUTRITION EDUCATION PAGE ─────────────────────────────────────────────
function EducationPage({ user }) {
  const conditions = Array.isArray(user?.conditions) ? user.conditions : user?.condition ? [user.condition] : ["healthy"];
  const [activeCondId, setActiveCondId] = useState(conditions[0] || "healthy");
  const info = CONDITION_INFO[activeCondId] || CONDITION_INFO.healthy;

  return (
    <div style={{ padding:"32px 24px", maxWidth:1100, margin:"0 auto" }}>
      <h2 style={{ color:C.forest, fontFamily:"Georgia,serif", fontSize:28, margin:"0 0 6px", fontWeight:800 }}>📚 Nutrition Education & Counselling</h2>
      <p style={{ color:"#777", marginBottom:24, fontSize:14 }}>Evidence-based nutrition guidance tailored to your health conditions</p>

      {/* Condition tabs */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:28 }}>
        {conditions.map(cid => {
          const c = ALL_CONDITIONS.find(x => x.id === cid);
          if (!c) return null;
          return (
            <button key={cid} onClick={() => setActiveCondId(cid)} style={{ padding:"9px 18px", borderRadius:30, border:"none", cursor:"pointer", background:activeCondId===cid?c.color:"#f0f0f0", color:activeCondId===cid?"#fff":"#666", fontWeight:700, fontSize:13, transition:"all 0.2s" }}>
              {c.icon} {c.label}
            </button>
          );
        })}
        {/* Also allow browsing other conditions */}
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ color:"#aaa", fontSize:12 }}>Browse all:</span>
          <select value={activeCondId} onChange={e => setActiveCondId(e.target.value)} style={{ padding:"8px 12px", borderRadius:20, border:`1.5px solid ${C.lime}`, fontSize:12, color:C.forest, background:C.cream, cursor:"pointer" }}>
            {Object.keys(CONDITION_INFO).map(k => {
              const c = ALL_CONDITIONS.find(x=>x.id===k);
              return <option key={k} value={k}>{c?.icon} {CONDITION_INFO[k].title}</option>;
            })}
          </select>
        </div>
      </div>

      {info && (
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {/* What is it */}
          <div style={{ background:"#fff", borderRadius:18, padding:28, boxShadow:"0 2px 14px rgba(0,0,0,0.06)" }}>
            <h3 style={{ color:C.forest, fontFamily:"Georgia,serif", fontSize:22, margin:"0 0 14px", fontWeight:800 }}>{info.icon} {info.title}</h3>
            <p style={{ color:"#444", lineHeight:1.85, fontSize:15, margin:0 }}>{info.what}</p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
            {/* Root Causes */}
            <div style={{ background:C.rose, borderRadius:16, padding:22, border:"1.5px solid #f5c6c6" }}>
              <h4 style={{ color:"#c0392b", margin:"0 0 14px", fontWeight:800, fontSize:15 }}>⚠️ Root Causes & Risk Factors</h4>
              <ul style={{ margin:0, padding:"0 0 0 18px" }}>
                {info.causes.map((c,i) => <li key={i} style={{ color:"#555", fontSize:13, lineHeight:1.8, marginBottom:4 }}>{c}</li>)}
              </ul>
            </div>
            {/* Nutrition Goals */}
            <div style={{ background:C.sky, borderRadius:16, padding:22, border:"1.5px solid #b8d9f0" }}>
              <h4 style={{ color:"#2980b9", margin:"0 0 14px", fontWeight:800, fontSize:15 }}>🎯 Nutrition Goals</h4>
              <ul style={{ margin:0, padding:"0 0 0 18px" }}>
                {info.nutrition_goals.map((g,i) => <li key={i} style={{ color:"#555", fontSize:13, lineHeight:1.8, marginBottom:4 }}>{g}</li>)}
              </ul>
            </div>
          </div>

          {/* Key Nutrients */}
          <div style={{ background:"#fff", borderRadius:16, padding:24, boxShadow:"0 2px 14px rgba(0,0,0,0.06)" }}>
            <h4 style={{ color:C.forest, margin:"0 0 16px", fontWeight:800, fontSize:15 }}>🔬 Key Nutrients & Their Role</h4>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px,1fr))", gap:12 }}>
              {info.key_nutrients.map((n,i) => (
                <div key={i} style={{ background:C.mist, borderRadius:12, padding:"14px 16px", borderLeft:`4px solid ${C.jade}` }}>
                  <div style={{ fontWeight:800, color:C.forest, fontSize:14, marginBottom:4 }}>{n.n}</div>
                  <div style={{ color:"#555", fontSize:12, lineHeight:1.6, marginBottom:6 }}>{n.r}</div>
                  <div style={{ color:C.jade, fontSize:12, fontWeight:700 }}>🌿 Sources: {n.f}</div>
                </div>
              ))}
            </div>
          </div>

          {/* What to Avoid */}
          <div style={{ background:C.amber, borderRadius:16, padding:22, border:"1.5px solid #f0c040" }}>
            <h4 style={{ color:"#7a5c00", margin:"0 0 14px", fontWeight:800, fontSize:15 }}>🚫 Foods & Habits to Avoid</h4>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
              {info.avoid.map((a,i) => (
                <span key={i} style={{ background:"rgba(255,255,255,0.6)", border:"1px solid #e0a800", color:"#7a5c00", padding:"6px 14px", borderRadius:20, fontSize:13, fontWeight:600 }}>❌ {a}</span>
              ))}
            </div>
          </div>

          {/* Pro Tip */}
          <div style={{ background:`linear-gradient(135deg, ${C.forest}, ${C.jade})`, borderRadius:16, padding:"24px 28px", color:C.cream }}>
            <div style={{ fontWeight:800, color:C.lime, marginBottom:8, fontSize:15 }}>💡 NutriPulse Pro Tip</div>
            <p style={{ margin:0, lineHeight:1.85, fontSize:14 }}>{info.tip}</p>
          </div>

          {/* Counselling note */}
          <div style={{ background:"#fff", borderRadius:16, padding:22, border:`2px solid ${C.lime}` }}>
            <h4 style={{ color:C.jade, margin:"0 0 12px", fontWeight:800, fontSize:15 }}>🩺 NutriPulse Counselling Note</h4>
            <p style={{ color:"#555", fontSize:13, lineHeight:1.8, margin:0 }}>
              NutriPulse provides evidence-based nutritional guidance rooted in African food traditions and modern nutritional science. All recommendations are general educational guidelines.
              <strong style={{ color:C.forest }}> For personalised clinical nutrition therapy, please consult a registered dietitian or your healthcare provider.</strong>
              {" "}If you are managing {info.title.toLowerCase()} with medication, discuss any significant dietary changes with your doctor, as nutrition can affect medication dosages and effectiveness.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MEAL PLANS PAGE ──────────────────────────────────────────────────────
function MealPlans({ user }) {
  const conditions = Array.isArray(user?.conditions) ? user.conditions : user?.condition ? [user.condition] : ["healthy"];
  const availablePlans = conditions.filter(c => MEAL_PLANS[c]);
  const [activePlan, setActivePlan] = useState(availablePlans[0] || "healthy");
  const plan = MEAL_PLANS[activePlan] || MEAL_PLANS.healthy;
  const allDays = Object.keys(plan.meals);
  const todayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];
  const [activeDay, setActiveDay] = useState(allDays.includes(todayName) ? todayName : allDays[0]);
  const meals = plan.meals[activeDay];
  const slots = [{key:"breakfast",icon:"🌅",label:"Breakfast",bg:"#fffbec"},{key:"lunch",icon:"☀️",label:"Lunch",bg:"#edf7f0"},{key:"dinner",icon:"🌙",label:"Dinner",bg:"#edf1fd"},{key:"snack",icon:"🍎",label:"Snack",bg:"#fdf0f0"}];

  return (
    <div style={{ padding:"32px 24px", maxWidth:1280, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <h2 style={{ color:C.forest, fontFamily:"Georgia,serif", fontSize:28, margin:"0 0 6px", fontWeight:800 }}>{plan.icon} Personalised Meal Plan</h2>
          <p style={{ color:"#777", margin:0, fontSize:14 }}>Condition: <strong style={{ color:plan.color }}>{CONDITION_INFO[activePlan]?.title || activePlan}</strong> · {plan.theme}</p>
        </div>
        <div style={{ background:C.forest, color:C.lime, borderRadius:12, padding:"10px 20px", fontSize:13, fontWeight:700 }}>📅 Full 7-Day Plan</div>
      </div>

      {/* Condition plan switcher */}
      {availablePlans.length > 1 && (
        <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
          <span style={{ color:"#888", fontSize:13, alignSelf:"center" }}>Switch plan:</span>
          {availablePlans.map(cid => {
            const c = ALL_CONDITIONS.find(x=>x.id===cid);
            return <button key={cid} onClick={() => { setActivePlan(cid); setActiveDay(allDays[0]); }} style={{ padding:"8px 16px", borderRadius:30, border:"none", cursor:"pointer", background:activePlan===cid?plan.color:"#f0f0f0", color:activePlan===cid?"#fff":"#666", fontWeight:700, fontSize:12 }}>{c?.icon} {c?.label}</button>;
          })}
        </div>
      )}

      {/* Day Tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
        {allDays.map(d => (
          <button key={d} onClick={() => setActiveDay(d)} style={{ padding:"9px 16px", borderRadius:30, border:"none", cursor:"pointer", background:activeDay===d?plan.color:d===todayName?C.mist:"#f0f0f0", color:activeDay===d?"#fff":d===todayName?C.jade:"#777", fontWeight:700, fontSize:12, outline:d===todayName&&activeDay!==d?`2px solid ${C.lime}`:"none" }}>
            {d}{d===todayName?" • Today":""}
          </button>
        ))}
      </div>

      {/* Meal Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px,1fr))", gap:16, marginBottom:28 }}>
        {slots.map(m => (
          <div key={m.key} style={{ background:m.bg, borderRadius:16, padding:22, boxShadow:"0 2px 14px rgba(0,0,0,0.06)", borderTop:`4px solid ${plan.color}` }}>
            <div style={{ fontWeight:800, fontSize:14, color:C.forest, marginBottom:12 }}>{m.icon} {m.label}</div>
            <p style={{ color:"#4a4a4a", lineHeight:1.75, margin:0, fontSize:13 }}>{meals?.[m.key] || "—"}</p>
          </div>
        ))}
      </div>

      {/* Dietitian's Note */}
      <div style={{ background:`linear-gradient(135deg, ${C.forest}, ${C.jade})`, borderRadius:16, padding:"24px 28px", color:C.cream, marginBottom:28 }}>
        <h3 style={{ margin:"0 0 10px", color:C.lime, fontSize:15, fontWeight:800 }}>🩺 Dietitian's Note</h3>
        <p style={{ margin:0, lineHeight:1.85, opacity:0.9, fontSize:13 }}>{CONDITION_INFO[activePlan]?.tip || "Follow this plan consistently and combine with adequate hydration and physical activity. Consult your doctor or dietitian for personalised adjustments."}</p>
      </div>

      {/* Food Sources Section */}
      {plan.food_sources && (
        <div style={{ background:"#fff", borderRadius:18, padding:28, boxShadow:"0 2px 14px rgba(0,0,0,0.06)" }}>
          <h3 style={{ color:C.forest, fontFamily:"Georgia,serif", fontSize:22, margin:"0 0 6px", fontWeight:800 }}>🌾 Key Food Sources in This Plan</h3>
          <p style={{ color:"#888", fontSize:14, marginBottom:22 }}>Why these foods are specifically chosen for <strong>{CONDITION_INFO[activePlan]?.title}</strong></p>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {plan.food_sources.map((fs, i) => (
              <div key={i} style={{ background:`${plan.color}08`, borderRadius:14, padding:"18px 20px", borderLeft:`5px solid ${plan.color}`, display:"grid", gridTemplateColumns:"1fr 2fr 1.5fr", gap:16, alignItems:"start" }}>
                <div>
                  <div style={{ fontWeight:800, color:C.forest, fontSize:15, marginBottom:4 }}>{fs.food}</div>
                  <div style={{ background:plan.color, color:"#fff", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, display:"inline-block" }}>Key Food</div>
                </div>
                <div>
                  <div style={{ color:"#888", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>Benefits & Importance</div>
                  <p style={{ color:"#444", fontSize:13, lineHeight:1.7, margin:0 }}>{fs.benefit}</p>
                </div>
                <div>
                  <div style={{ color:"#888", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>Role in Your Plan</div>
                  <p style={{ color:C.jade, fontSize:13, lineHeight:1.7, margin:0, fontWeight:600 }}>{fs.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FOOD DATABASE ────────────────────────────────────────────────────────
function FoodDatabase() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [region, setRegion] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const categories = ["All","Staple","Vegetable","Legume","Protein","Fruit","Grain","Dairy","Superfood","Oil"];
  const regions = ["All","East Africa","West Africa","Southern Africa","Horn of Africa","Pan-Africa","General"];
  const filtered = LOCAL_FOODS.filter(f =>
    (filter==="All"||f.category===filter) &&
    (region==="All"||f.region===region) &&
    f.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a,b) => sortBy==="name"?a.name.localeCompare(b.name):a[sortBy]-b[sortBy]);
  const giC = { Low:"#27ae60", Medium:"#e67e22", High:"#e74c3c" };

  return (
    <div style={{ padding:"32px 24px", maxWidth:1360, margin:"0 auto" }}>
      <style>{`.fc{transition:all 0.2s;}.fc:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,0.1)!important;}`}</style>
      <h2 style={{ color:C.forest, fontFamily:"Georgia,serif", fontSize:28, margin:"0 0 6px", fontWeight:800 }}>🌍 African Foods Database</h2>
      <p style={{ color:"#777", marginBottom:22, fontSize:14 }}>{LOCAL_FOODS.length} traditional African & general foods · East, West, Southern & Horn of Africa · Per 100g serving</p>

      <div style={{ display:"flex", gap:12, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <input placeholder="🔍 Search foods..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...iSty, flex:1, minWidth:180, borderRadius:30, border:`2px solid ${C.lime}`, background:C.cream, padding:"11px 20px" }} />
        <select value={region} onChange={e => setRegion(e.target.value)} style={{ padding:"11px 14px", borderRadius:30, border:`2px solid ${C.lime}`, fontSize:12, fontWeight:700, color:C.forest, background:C.cream, cursor:"pointer" }}>
          {regions.map(r => <option key={r}>{r}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding:"11px 14px", borderRadius:30, border:`2px solid ${C.lime}`, fontSize:12, fontWeight:700, color:C.forest, background:C.cream, cursor:"pointer" }}>
          <option value="name">A–Z</option><option value="cal">Calories</option><option value="protein">Protein</option><option value="fiber">Fiber</option>
        </select>
      </div>

      <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:20 }}>
        {categories.map(c => <button key={c} onClick={() => setFilter(c)} style={{ padding:"7px 14px", borderRadius:30, border:"none", cursor:"pointer", background:filter===c?C.jade:C.mist, color:filter===c?"#fff":C.forest, fontWeight:700, fontSize:12, transition:"all 0.2s" }}>{c}</button>)}
      </div>

      <div style={{ color:"#888", fontSize:13, marginBottom:16 }}>Showing {filtered.length} foods</div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(230px,1fr))", gap:13 }}>
        {filtered.map(food => (
          <div key={food.name} className="fc" style={{ background:"#fff", borderRadius:14, padding:16, boxShadow:"0 2px 10px rgba(0,0,0,0.06)", border:`1px solid ${C.mist}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <h3 style={{ margin:0, color:C.forest, fontSize:13, fontWeight:800, lineHeight:1.3 }}>{food.name}</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:3, alignItems:"flex-end", flexShrink:0, marginLeft:6 }}>
                <span style={{ background:C.mist, color:C.jade, padding:"2px 8px", borderRadius:20, fontSize:9, fontWeight:700 }}>{food.category}</span>
                <span style={{ background:`${giC[food.gi]}18`, color:giC[food.gi], padding:"2px 7px", borderRadius:20, fontSize:8, fontWeight:800 }}>GI: {food.gi}</span>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5, marginBottom:8 }}>
              {[{l:"Calories",v:`${food.cal} kcal`,c:C.terra},{l:"Carbs",v:`${food.carbs}g`,c:C.sand},{l:"Protein",v:`${food.protein}g`,c:C.mint},{l:"Fat",v:`${food.fat}g`,c:"#a8d5ba"}].map(n => (
                <div key={n.l} style={{ background:C.cream, borderRadius:7, padding:"5px 9px", borderLeft:`3px solid ${n.c}` }}>
                  <div style={{ fontSize:8, color:"#999", fontWeight:700, textTransform:"uppercase" }}>{n.l}</div>
                  <div style={{ fontSize:13, color:C.charcoal, fontWeight:800 }}>{n.v}</div>
                </div>
              ))}
            </div>
            {food.fiber > 0 && <div style={{ fontSize:11, color:"#888", marginBottom:4 }}>🌿 Fiber: <strong style={{ color:C.jade }}>{food.fiber}g</strong></div>}
            <div style={{ fontSize:10, color:"#bbb", fontStyle:"italic" }}>📍 {food.region}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NUTRIBOT CHAT ────────────────────────────────────────────────────────
function ChatBot({ user }) {
  const [messages, setMessages] = useState([{
    role:"assistant",
    content:"Jambo! 👋 I'm **NutriBot**, your AI nutrition assistant specialising in African health and food.\n\nI can help you with:\n• Personalised meal plans for your specific condition\n• Benefits of local African foods\n• Weight management with traditional foods\n• Nutrition during illness and recovery\n• Affordable healthy eating tips\n\nNinaweza kukusaidia — what would you like to know? 🌿"
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const conditions = Array.isArray(user?.conditions) ? user.conditions : user?.condition ? [user.condition] : [];

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput("");
    const updated = [...messages, { role:"user", content:msg }];
    setMessages(updated);
    setLoading(true);
    try {
      const apiMessages = updated.map(m => ({ role:m.role==="assistant"?"assistant":"user", content:m.content }));
      const res = await fetch("/api/chat", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ messages:apiMessages }),
      });
      const data = await res.json();
      const reply = data.reply || "Samahani, I did not get a response. Please try again!";
      setMessages(prev => [...prev, { role:"assistant", content:reply }]);
    } catch {
      setMessages(prev => [...prev, { role:"assistant", content:"Pole sana! 😊 Connection issue. Please check your internet and try again." }]);
    } finally { setLoading(false); }
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);

  const renderText = (text) => text.split("\n").map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    const fmt = line.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/^•\s/,"• ");
    return <p key={i} style={{ margin:"3px 0", lineHeight:1.75 }} dangerouslySetInnerHTML={{ __html:fmt }} />;
  });

  const quickQ = [
    conditions.length ? `What foods are best for ${ALL_CONDITIONS.find(x=>x.id===conditions[0])?.label}?` : "What are the healthiest African foods?",
    "Create a 7-day meal plan for me",
    "What is moringa good for?",
    "Affordable high-protein foods in Africa",
    "How do I manage blood sugar with local foods?",
    "What should I eat to boost my immune system?",
  ];

  return (
    <div style={{ padding:"32px 24px", maxWidth:960, margin:"0 auto" }}>
      <style>{`@keyframes pulse4{0%,100%{opacity:1}50%{opacity:0.5}} @keyframes fup2{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
        <div style={{ width:50, height:50, borderRadius:"50%", background:`linear-gradient(135deg, ${C.jade}, ${C.forest})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, boxShadow:"0 4px 16px rgba(26,92,53,0.4)" }}>🌿</div>
        <div>
          <h2 style={{ color:C.forest, fontFamily:"Georgia,serif", fontSize:26, margin:0, fontWeight:800 }}>NutriBot AI Assistant</h2>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:4 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#27ae60", animation:"pulse4 2s infinite" }} />
            <span style={{ color:"#27ae60", fontSize:12, fontWeight:700 }}>Online · African Nutrition Specialist</span>
          </div>
        </div>
      </div>

      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:18 }}>
        {quickQ.map(q => <button key={q} onClick={() => setInput(q)} style={{ background:C.mist, border:`1px solid ${C.lime}`, color:C.forest, padding:"7px 13px", borderRadius:20, fontSize:12, cursor:"pointer", fontWeight:600, transition:"all 0.2s" }}>{q}</button>)}
      </div>

      <div style={{ background:"#f8f7f2", borderRadius:20, overflow:"hidden", boxShadow:"0 6px 32px rgba(0,0,0,0.1)", border:`1.5px solid ${C.lime}` }}>
        <div style={{ height:460, overflowY:"auto", padding:"22px 22px 10px", display:"flex", flexDirection:"column", gap:16 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", animation:"fup2 0.3s ease" }}>
              {m.role==="assistant" && <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg, ${C.jade}, ${C.forest})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, marginRight:9, flexShrink:0, alignSelf:"flex-end", boxShadow:"0 2px 8px rgba(26,92,53,0.3)" }}>🌿</div>}
              <div style={{ maxWidth:"75%", padding:"13px 17px", borderRadius:m.role==="user"?"20px 5px 20px 20px":"5px 20px 20px 20px", background:m.role==="user"?`linear-gradient(135deg, ${C.jade}, ${C.forest})`:"#fff", color:m.role==="user"?"#fff":C.charcoal, boxShadow:"0 2px 10px rgba(0,0,0,0.08)", fontSize:13 }}>
                {renderText(m.content)}
              </div>
              {m.role==="user" && <div style={{ width:34, height:34, borderRadius:"50%", background:C.mint, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:13, marginLeft:9, flexShrink:0, alignSelf:"flex-end" }}>{user?.name?.[0]?.toUpperCase()||"U"}</div>}
            </div>
          ))}
          {loading && (
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg, ${C.jade}, ${C.forest})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>🌿</div>
              <div style={{ background:"#fff", padding:"13px 18px", borderRadius:"5px 20px 20px 20px", boxShadow:"0 2px 10px rgba(0,0,0,0.08)", display:"flex", gap:4, alignItems:"center" }}>
                {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:C.mint, animation:`pulse4 1.2s ease ${i*0.2}s infinite` }} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div style={{ padding:"14px 18px", borderTop:`1px solid ${C.mist}`, display:"flex", gap:10, background:"#fff" }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter"&&!e.shiftKey&&send()} placeholder="Ask NutriBot anything about nutrition, African foods, or your health condition..." disabled={loading} style={{ flex:1, padding:"12px 20px", borderRadius:30, border:`2px solid ${loading?C.mist:C.lime}`, outline:"none", fontSize:13, background:C.cream }} />
          <button onClick={send} disabled={loading} style={{ background:loading?"#ccc":`linear-gradient(135deg, ${C.mint}, ${C.jade})`, color:"#fff", border:"none", width:48, height:48, borderRadius:"50%", cursor:loading?"not-allowed":"pointer", fontSize:18, boxShadow:loading?"none":"0 4px 14px rgba(45,158,107,0.4)", transition:"all 0.2s" }}>→</button>
        </div>
      </div>
      <p style={{ textAlign:"center", color:"#bbb", fontSize:11, marginTop:12 }}>Educational information only. Always consult a registered dietitian or doctor for medical advice.</p>
    </div>
  );
}

// ─── COMMUNITY ────────────────────────────────────────────────────────────
function Community() {
  const [liked, setLiked] = useState({});
  const posts = [
    { author:"Jane W.", avatar:"J", time:"2h ago", title:"My 3-month diabetes journey with local foods", body:"Switched from white ugali to millet porridge and my HbA1c dropped by 0.8%! NutriBot AI recommended this — it really works!", likes:34, comments:12, tag:"Diabetes", color:C.terra },
    { author:"Peter M.", avatar:"P", time:"5h ago", title:"Traditional foods that helped my cancer recovery", body:"During chemo I survived on managu soup, arrowroot porridge, and omena. These foods kept my protein levels up even on the hardest days.", likes:56, comments:23, tag:"Oncology", color:"#8e44ad" },
    { author:"Amina K.", avatar:"A", time:"1d ago", title:"7-day sugar detox using local African foods 🌿", body:"Day 1 of my sugar detox: sorghum uji + boiled eggs + sukuma wiki. My energy is already better and I haven't had a blood sugar crash today!", likes:89, comments:41, tag:"Diabetes", color:C.sand },
    { author:"Grace N.", avatar:"G", time:"2d ago", title:"Moringa — how I reversed my anaemia in 3 months", body:"My haemoglobin went from 8.2 to 12.4 g/dL using moringa powder, managu, and omena daily. No iron supplements needed! African superfoods are real.", likes:112, comments:34, tag:"Anaemia", color:C.mint },
  ];
  const challenges = [
    { title:"🌿 7-Day Local Foods Only", participants:143, deadline:"4 days left" },
    { title:"💧 2.5L Water Daily", participants:87, deadline:"Ongoing" },
    { title:"🌱 Moringa Challenge (30 days)", participants:212, deadline:"15 days left" },
    { title:"🥗 Meatless Mondays", participants:58, deadline:"Weekly" },
  ];
  return (
    <div style={{ padding:"32px 24px", maxWidth:1280, margin:"0 auto" }}>
      <h2 style={{ color:C.forest, fontFamily:"Georgia,serif", fontSize:28, margin:"0 0 6px", fontWeight:800 }}>🌍 Community Wellness Hub</h2>
      <p style={{ color:"#777", marginBottom:28, fontSize:14 }}>Share your journey, support others, and grow together across Africa</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:28 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          {posts.map((p,i) => (
            <div key={i} style={{ background:"#fff", borderRadius:18, padding:24, boxShadow:"0 2px 14px rgba(0,0,0,0.06)", border:`1px solid ${C.mist}`, borderLeft:`4px solid ${p.color}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg, ${p.color}, ${C.forest})`, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:17 }}>{p.avatar}</div>
                <div><div style={{ fontWeight:800, color:C.forest, fontSize:14 }}>{p.author}</div><div style={{ fontSize:11, color:"#bbb" }}>{p.time}</div></div>
                <span style={{ marginLeft:"auto", background:`${p.color}20`, color:p.color, padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:800 }}>{p.tag}</span>
              </div>
              <h3 style={{ margin:"0 0 9px", color:C.forest, fontSize:16, fontWeight:800 }}>{p.title}</h3>
              <p style={{ color:"#555", lineHeight:1.75, margin:"0 0 16px", fontSize:13 }}>{p.body}</p>
              <div style={{ display:"flex", gap:18, borderTop:`1px solid #f0f0f0`, paddingTop:12 }}>
                <button onClick={() => setLiked(prev => ({...prev,[i]:!prev[i]}))} style={{ background:"none", border:"none", color:liked[i]?C.terra:"#aaa", cursor:"pointer", fontSize:13, fontWeight:700 }}>{liked[i]?"❤️":"🤍"} {p.likes+(liked[i]?1:0)}</button>
                <button style={{ background:"none", border:"none", color:"#aaa", cursor:"pointer", fontSize:13, fontWeight:700 }}>💬 {p.comments}</button>
                <button style={{ background:"none", border:"none", color:C.jade, cursor:"pointer", fontSize:13, fontWeight:800, marginLeft:"auto" }}>Share →</button>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ background:`linear-gradient(135deg, ${C.forest}, ${C.jade})`, borderRadius:18, padding:22, color:C.cream, marginBottom:18 }}>
            <h3 style={{ margin:"0 0 16px", color:C.lime, fontWeight:800 }}>⚡ Health Challenges</h3>
            {challenges.map((ch,i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"12px 14px", marginBottom:10 }}>
                <div style={{ fontWeight:800, marginBottom:3, fontSize:13 }}>{ch.title}</div>
                <div style={{ fontSize:11, color:C.lime, marginBottom:9 }}>{ch.participants} participants · {ch.deadline}</div>
                <button style={{ background:C.mint, color:C.forest, border:"none", padding:"6px 15px", borderRadius:20, cursor:"pointer", fontWeight:800, fontSize:11 }}>Join →</button>
              </div>
            ))}
          </div>
          <div style={{ background:"#fff", borderRadius:18, padding:22, boxShadow:"0 2px 14px rgba(0,0,0,0.06)", border:`1.5px solid ${C.lime}` }}>
            <h3 style={{ margin:"0 0 14px", color:C.forest, fontWeight:800, fontSize:14 }}>📚 Latest Articles</h3>
            {[{t:"Managing Diabetes with African Superfoods",i:"🩸"},{t:"Moringa: Africa's Most Complete Nutrition",i:"🌿"},{t:"Sickle Cell & Diet: What the Research Shows",i:"🔴"},{t:"HIV & Nutrition: Boosting Immunity Affordably",i:"🎗️"},{t:"Why Traditional African Diets Prevent Disease",i:"🌍"}].map((a,i) => (
              <div key={i} style={{ padding:"10px 0", borderBottom:i<4?`1px solid ${C.mist}`:"none", display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                <span style={{ fontSize:16 }}>{a.i}</span>
                <span style={{ color:C.jade, fontSize:13, fontWeight:700, lineHeight:1.4 }}>{a.t} →</span>
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
    { name:"Millet porridge + egg", time:"7:30 AM", cal:290, meal:"Breakfast" },
    { name:"Ugali + sukuma wiki + omena", time:"1:00 PM", cal:480, meal:"Lunch" },
  ]);
  const [newMeal, setNewMeal] = useState(""); const [newCal, setNewCal] = useState(""); const [mealType, setMealType] = useState("Snack");
  const [bios, setBios] = useState({ weight:user?.weight||"70", sugar:"98", bp:"120/80", mood:"😊" });
  const [saved, setSaved] = useState(false);
  const totalCal = meals.reduce((s,m) => s+m.cal, 0);
  const goal = 2100; const pct = Math.min((totalCal/goal)*100, 100);
  const addMeal = () => {
    if (!newMeal.trim()||!newCal) return;
    setMeals(prev => [...prev, { name:newMeal, time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), cal:parseInt(newCal), meal:mealType }]);
    setNewMeal(""); setNewCal("");
  };
  const bmi = user?.height?(parseFloat(bios.weight)/(user.height**2)).toFixed(1):"—";
  const bmiLabel = !user?.height?"—":bmi<18.5?"Underweight":bmi<25?"Normal":bmi<30?"Overweight":"Obese";
  const bmiColor = !user?.height?"#aaa":bmi<18.5?"#3498db":bmi<25?"#27ae60":bmi<30?"#e67e22":"#e74c3c";
  return (
    <div style={{ padding:"32px 24px", maxWidth:1280, margin:"0 auto" }}>
      <h2 style={{ color:C.forest, fontFamily:"Georgia,serif", fontSize:28, margin:"0 0 6px", fontWeight:800 }}>📊 Health Tracking</h2>
      <p style={{ color:"#777", marginBottom:24, fontSize:14 }}>Monitor your daily nutrition and biometrics</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:22 }}>
        <div style={{ background:"#fff", borderRadius:18, padding:24, boxShadow:"0 2px 14px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin:"0 0 16px", color:C.forest, fontWeight:800, fontSize:16 }}>🔥 Calorie Tracker</h3>
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:8 }}>
              <span style={{ fontWeight:900, fontSize:32, color:pct>90?C.terra:C.jade }}>{totalCal.toLocaleString()}</span>
              <span style={{ color:"#aaa", fontSize:13 }}>/ {goal.toLocaleString()} kcal</span>
            </div>
            <div style={{ height:10, background:C.mist, borderRadius:5, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`, background:pct>90?`linear-gradient(90deg,${C.terra},#e74c3c)`:`linear-gradient(90deg,${C.mint},${C.jade})`, borderRadius:5, transition:"width 0.5s" }} />
            </div>
          </div>
          {meals.map((m,i) => <div key={i} style={{ display:"flex", justifyContent:"space-between", background:C.cream, borderRadius:10, padding:"10px 14px", marginBottom:8 }}><div><div style={{ fontWeight:700, fontSize:13, color:C.forest }}>{m.name}</div><div style={{ fontSize:11, color:"#bbb" }}>{m.meal} · {m.time}</div></div><div style={{ fontWeight:900, color:C.terra, fontSize:14 }}>{m.cal} kcal</div></div>)}
          <div style={{ borderTop:`2px dashed ${C.mist}`, paddingTop:14, marginTop:8 }}>
            <input placeholder="Meal description" value={newMeal} onChange={e => setNewMeal(e.target.value)} style={{ ...iSty, marginBottom:8, border:`1.5px solid ${C.lime}` }} />
            <div style={{ display:"flex", gap:8, marginBottom:10 }}>
              <input type="number" placeholder="Calories" value={newCal} onChange={e => setNewCal(e.target.value)} style={{ ...iSty, flex:1, border:`1.5px solid ${C.lime}` }} />
              <select value={mealType} onChange={e => setMealType(e.target.value)} style={{ flex:1, padding:"11px 10px", borderRadius:12, border:`1.5px solid ${C.lime}`, fontSize:13, color:C.forest }}>
                {["Breakfast","Lunch","Dinner","Snack"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <button onClick={addMeal} style={{ ...bPri, width:"100%", textAlign:"center", fontSize:14 }}>Add Meal ✓</button>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:"#fff", borderRadius:18, padding:24, boxShadow:"0 2px 14px rgba(0,0,0,0.06)" }}>
            <h3 style={{ margin:"0 0 16px", color:C.forest, fontWeight:800, fontSize:16 }}>📏 Biometric Log</h3>
            {[{label:"⚖️ Weight (kg)",key:"weight",unit:"kg"},{label:"🩸 Blood Sugar (mg/dL)",key:"sugar",unit:"mg/dL"},{label:"❤️ Blood Pressure",key:"bp",unit:"mmHg"}].map(b => (
              <div key={b.key} style={{ marginBottom:12 }}><label style={lSty}>{b.label}</label><div style={{ display:"flex", gap:8, alignItems:"center" }}><input value={bios[b.key]} onChange={e => setBios(p => ({...p,[b.key]:e.target.value}))} style={{ ...iSty, fontSize:16, fontWeight:800, border:`1.5px solid ${C.lime}` }} /><span style={{ color:"#aaa", fontSize:12, whiteSpace:"nowrap" }}>{b.unit}</span></div></div>
            ))}
            <div style={{ marginBottom:14 }}><label style={lSty}>😊 Mood Today</label><div style={{ display:"flex", gap:8 }}>{["😄","😊","😐","😞","😫"].map(m => <button key={m} onClick={() => setBios(p => ({...p,mood:m}))} style={{ fontSize:24, background:bios.mood===m?C.mist:"transparent", border:bios.mood===m?`2px solid ${C.jade}`:"2px solid transparent", borderRadius:10, padding:6, cursor:"pointer" }}>{m}</button>)}</div></div>
            <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} style={{ ...bPri, width:"100%", textAlign:"center", fontSize:14 }}>{saved?"✅ Saved!":"Save Today's Record"}</button>
          </div>
          <div style={{ background:`linear-gradient(135deg, ${C.forest}, ${C.jade})`, borderRadius:18, padding:24, color:C.cream }}>
            <h3 style={{ margin:"0 0 12px", color:C.lime, fontWeight:800 }}>📐 BMI Calculator</h3>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <div><div style={{ fontSize:44, fontWeight:900, color:bmiColor }}>{bmi}</div><div style={{ fontSize:14, fontWeight:700, color:bmiColor }}>{bmiLabel}</div></div>
              <div style={{ flex:1, fontSize:12, opacity:0.8, lineHeight:1.6 }}>Height: {user?.height||"—"}m<br/>Weight: {bios.weight}kg</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── REMINDERS ────────────────────────────────────────────────────────────
function ReminderSystem() {
  const [reminders, setReminders] = useState(() => {
    try { return JSON.parse(localStorage.getItem("np_reminders")) || [
      { id:1, type:"meal", label:"Breakfast time", icon:"🌅", time:"07:00", enabled:true },
      { id:2, type:"meal", label:"Lunch time", icon:"☀️", time:"13:00", enabled:true },
      { id:3, type:"meal", label:"Dinner time", icon:"🌙", time:"19:00", enabled:true },
      { id:4, type:"water", label:"Drink water", icon:"💧", time:"10:00", enabled:false },
      { id:5, type:"water", label:"Drink water", icon:"💧", time:"15:00", enabled:false },
      { id:6, type:"challenge", label:"Daily health check", icon:"⚡", time:"09:00", enabled:false },
      { id:7, type:"medication", label:"Medication reminder", icon:"💊", time:"08:00", enabled:false },
    ]; } catch { return []; }
  });
  const [toast, setToast] = useState(null);
  const save = (updated) => { setReminders(updated); localStorage.setItem("np_reminders", JSON.stringify(updated)); };
  const toggle = (id) => save(reminders.map(r => r.id===id?{...r,enabled:!r.enabled}:r));
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const t = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
      reminders.forEach(r => { if (r.enabled&&r.time===t) { setToast(`${r.icon} ${r.label}`); setTimeout(() => setToast(null), 5000); if ("Notification" in window&&Notification.permission==="granted") new Notification("NutriPulse 🌿", { body:r.label }); }});
    };
    const iv = setInterval(check, 60000);
    return () => clearInterval(iv);
  }, [reminders]);
  useEffect(() => { if ("Notification" in window && Notification.permission==="default") Notification.requestPermission(); }, []);
  const typeColors = { meal:C.mint, water:"#4fc3f7", challenge:C.sand, medication:C.terra };
  return (
    <>
      {toast && <div style={{ position:"fixed", top:76, right:20, background:C.forest, color:C.cream, padding:"12px 18px", borderRadius:12, boxShadow:"0 8px 32px rgba(0,0,0,0.3)", zIndex:1000, display:"flex", alignItems:"center", gap:10, maxWidth:280 }}><span style={{ fontSize:20 }}>🌿</span><div><div style={{ fontWeight:800, fontSize:13 }}>NutriPulse Reminder</div><div style={{ fontSize:12, color:C.lime }}>{toast}</div></div><button onClick={() => setToast(null)} style={{ background:"none", border:"none", color:"#aaa", cursor:"pointer", fontSize:16, marginLeft:6 }}>×</button></div>}
      <div style={{ padding:"32px 24px", maxWidth:700, margin:"0 auto" }}>
        <h2 style={{ color:C.forest, fontFamily:"Georgia,serif", fontSize:28, margin:"0 0 6px", fontWeight:800 }}>🔔 Reminders</h2>
        <p style={{ color:"#777", marginBottom:24, fontSize:14 }}>Set reminders for meals, water, medications, and daily health checks</p>
        <div style={{ background:"#fff", borderRadius:16, padding:22, boxShadow:"0 2px 12px rgba(0,0,0,0.06)", marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h3 style={{ margin:0, color:C.forest, fontWeight:800, fontSize:15 }}>Your Reminders</h3>
            <button onClick={() => { if ("Notification" in window) Notification.requestPermission().then(p => { if(p==="granted") setToast("Browser notifications enabled! ✅"); }); }} style={{ background:C.mist, border:`1px solid ${C.lime}`, color:C.jade, padding:"7px 14px", borderRadius:20, cursor:"pointer", fontWeight:700, fontSize:12 }}>Enable Browser Alerts</button>
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
          <h3 style={{ margin:"0 0 8px", color:C.lime, fontWeight:800, fontSize:14 }}>💡 Tip</h3>
          <p style={{ margin:0, fontSize:13, opacity:0.9, lineHeight:1.7 }}>Enable browser notifications to receive reminders even when NutriPulse is not open. For medication reminders, always confirm timing with your healthcare provider.</p>
        </div>
      </div>
    </>
  );
}

// ─── ONBOARDING (multi-condition) ─────────────────────────────────────────
function OnboardingScreen({ onComplete, userName }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name:userName||"", age:"", height:"1.65", weight:"70", conditions:[], goals:"" });
  const [condSearch, setCondSearch] = useState("");
  const groups = [...new Set(ALL_CONDITIONS.map(c => c.group))];
  const filteredConds = condSearch ? ALL_CONDITIONS.filter(c => c.label.toLowerCase().includes(condSearch.toLowerCase())) : ALL_CONDITIONS;
  const toggleCond = (id) => setData(p => ({ ...p, conditions: p.conditions.includes(id) ? p.conditions.filter(x=>x!==id) : [...p.conditions, id] }));
  const steps = [
    { title:"Welcome to NutriPulse 🌿", subtitle:"Africa's nutrition platform — personalised to your health" },
    { title:"Your Health Conditions", subtitle:"Select all that apply — you can change these anytime" },
    { title:"Your Body Metrics", subtitle:"Used to calculate your personalised nutrition needs" },
  ];
  const s = steps[step];
  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(135deg, ${C.forest} 0%, ${C.jade} 60%, ${C.mint} 100%)`, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{`@keyframes fup3{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ background:"#fff", borderRadius:24, padding:"40px 36px", maxWidth:600, width:"100%", boxShadow:"0 32px 100px rgba(0,0,0,0.3)", animation:"fup3 0.4s ease" }}>
        <div style={{ display:"flex", gap:6, marginBottom:28 }}>{steps.map((_,i) => <div key={i} style={{ flex:1, height:5, borderRadius:3, background:i<=step?C.jade:C.mist, transition:"background 0.3s" }} />)}</div>
        <h2 style={{ fontFamily:"Georgia,serif", color:C.forest, fontSize:24, margin:"0 0 6px", fontWeight:800 }}>{s.title}</h2>
        <p style={{ color:"#888", marginBottom:22, fontSize:13 }}>{s.subtitle}</p>

        {step === 0 && (
          <div>
            <label style={lSty}>What should we call you? *</label>
            <input value={data.name} onChange={e => setData(p => ({...p,name:e.target.value}))} placeholder="Your full name" style={{ ...iSty, marginBottom:14, border:`1.5px solid ${C.lime}` }} />
            <label style={lSty}>Age</label>
            <input value={data.age} onChange={e => setData(p => ({...p,age:e.target.value}))} placeholder="e.g. 34" style={{ ...iSty, border:`1.5px solid ${C.lime}` }} />
          </div>
        )}

        {step === 1 && (
          <div>
            <input value={condSearch} onChange={e => setCondSearch(e.target.value)} placeholder="🔍 Search conditions..." style={{ ...iSty, marginBottom:14, border:`1.5px solid ${C.lime}` }} />
            {data.conditions.length > 0 && (
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:12, color:C.jade, fontWeight:700, marginBottom:8 }}>Selected ({data.conditions.length}):</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {data.conditions.map(id => { const c = ALL_CONDITIONS.find(x=>x.id===id); return c ? <span key={id} onClick={() => toggleCond(id)} style={{ background:C.jade, color:"#fff", padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer" }}>{c.icon} {c.label} ×</span> : null; })}
                </div>
              </div>
            )}
            <div style={{ maxHeight:320, overflowY:"auto", border:`1px solid ${C.mist}`, borderRadius:12, padding:12 }}>
              {groups.map(group => {
                const groupConds = filteredConds.filter(c => c.group === group);
                if (!groupConds.length) return null;
                return (
                  <div key={group} style={{ marginBottom:14 }}>
                    <div style={{ fontWeight:800, color:C.forest, fontSize:12, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>{group}</div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {groupConds.map(c => {
                        const sel = data.conditions.includes(c.id);
                        return (
                          <button key={c.id} onClick={() => toggleCond(c.id)} style={{ padding:"6px 14px", borderRadius:30, border:`2px solid ${sel?c.color:C.mist}`, background:sel?`${c.color}18`:"#fafafa", color:sel?c.color:C.forest, cursor:"pointer", fontWeight:sel?800:600, fontSize:12, transition:"all 0.15s" }}>
                            {c.icon} {c.label} {sel?"✓":""}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            {data.conditions.length === 0 && <p style={{ color:"#aaa", fontSize:12, marginTop:8 }}>Select at least one condition, or choose "Generally Healthy"</p>}
          </div>
        )}

        {step === 2 && (
          <div>
            {[{field:"height",label:"Height (m)",placeholder:"e.g. 1.68"},{field:"weight",label:"Weight (kg)",placeholder:"e.g. 72"}].map(f => (
              <div key={f.field} style={{ marginBottom:14 }}>
                <label style={lSty}>{f.label}</label>
                <input value={data[f.field]} onChange={e => setData(p => ({...p,[f.field]:e.target.value}))} placeholder={f.placeholder} style={{ ...iSty, border:`1.5px solid ${C.lime}` }} />
              </div>
            ))}
            <label style={lSty}>Your main health goal (optional)</label>
            <input value={data.goals} onChange={e => setData(p => ({...p,goals:e.target.value}))} placeholder="e.g. Manage blood sugar, lose 10kg, boost immunity..." style={{ ...iSty, border:`1.5px solid ${C.lime}` }} />
          </div>
        )}

        <div style={{ display:"flex", gap:10, marginTop:26 }}>
          {step > 0 && <button onClick={() => setStep(s => s-1)} style={{ flex:1, padding:"13px", background:C.mist, color:C.forest, border:"none", borderRadius:12, cursor:"pointer", fontWeight:800 }}>← Back</button>}
          <button onClick={() => {
            if (step === 0 && !data.name.trim()) return;
            if (step === 1 && data.conditions.length === 0) { toggleCond("healthy"); return; }
            if (step < steps.length-1) { setStep(s => s+1); }
            else { onComplete({ ...data, height:parseFloat(data.height)||1.65, condition:data.conditions[0]||"healthy" }); }
          }} style={{ ...bPri, flex:2 }}>
            {step < steps.length-1 ? "Continue →" : "Start My Journey 🌿"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────
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
        const demo = { name:"Demo User", email:"demo@nutripulse.com", conditions:["diabetes2","hypertension"], condition:"diabetes2", height:1.68, weight:"72", age:"34" };
        localStorage.setItem("np_user", JSON.stringify(demo)); localStorage.setItem("np_token","demo");
        setSuccess("Welcome back! Redirecting...");
        await sendNotification("login", demo);
        setTimeout(() => onAuth(demo, false), 800);
      } else { setError("Incorrect credentials. Try demo@nutripulse.com / demo1234"); }
    } else {
      setSuccess("Welcome back! Redirecting...");
      await sendNotification("login", data.user);
      setTimeout(() => onAuth(data.user, false), 800);
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    setError(""); setSuccess("");
    const { name, email, phone, password, confirm } = sd;
    if (!name||!email||!password||!confirm) { setError("Please fill in all required fields."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email."); return; }
    if (password.length<6) { setError("Password must be at least 6 characters."); return; }
    if (password!==confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    const { error:err } = await supabase.auth.signUp({ email, password, options:{ data:{ name, phone, conditions:["healthy"], condition:"healthy", height:1.65, weight:"65" } } });
    if (err) { setError(err.message||"Signup failed. Please try again."); }
    else { setSuccess("Account created! Setting up your profile..."); await sendNotification("signup", { name, email, phone }); setTimeout(() => onAuth({ name, email, phone, conditions:["healthy"], condition:"healthy", height:1.65, weight:"65" }, true), 800); }
    setLoading(false);
  };

  const pwS = pw => pw.length>=12?4:pw.length>=8?3:pw.length>=6?2:pw.length>0?1:0;
  const pwC = s => s>=3?C.mint:s===2?C.sand:C.terra;

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(145deg, ${C.forest} 0%, #0d1f12 45%, ${C.jade} 100%)`, display:"flex", alignItems:"center", justifyContent:"center", padding:24, position:"relative", overflow:"hidden" }}>
      <style>{`
        @keyframes floatL{0%,100%{transform:translateY(0) rotate(var(--r))} 50%{transform:translateY(-14px) rotate(var(--r))}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin2{to{transform:rotate(360deg)}}
        .af:focus{border-color:${C.mint}!important;box-shadow:0 0 0 3px rgba(45,158,107,0.2)!important;}
        .abtn:hover{filter:brightness(1.08);transform:translateY(-1px);} .abtn{transition:all 0.2s;}
        .tabn{transition:all 0.2s;}
      `}</style>
      {[{t:"7%",l:"5%",s:70,o:0.09,r:-20,d:3.5},{t:"72%",l:"2%",s:100,o:0.06,r:30,d:4.2},{t:"14%",r:"3%",s:80,o:0.08,r2:15,d:5},{t:"80%",r:"4%",s:55,o:0.1,r2:-35,d:3.8}].map((l,i)=>(
        <div key={i} style={{ position:"absolute",fontSize:l.s,top:l.t,left:l.l,right:l.r,opacity:l.o,userSelect:"none",pointerEvents:"none",animation:`floatL ${l.d}s ease-in-out infinite`,"--r":`${l.r||l.r2||0}deg`,transform:`rotate(${l.r||l.r2||0}deg)` }}>🌿</div>
      ))}

      <div style={{ display:"flex", width:"100%", maxWidth:1000, borderRadius:28, overflow:"hidden", boxShadow:"0 40px 120px rgba(0,0,0,0.55)", animation:"fadeInUp 0.5s ease" }}>
        {/* Left */}
        <div style={{ flex:1, background:`linear-gradient(160deg, ${C.jade}, ${C.forest})`, padding:"54px 44px", color:"#fff", display:"flex", flexDirection:"column", justifyContent:"space-between", minWidth:280 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:44 }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg, ${C.mint}, ${C.lime})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, boxShadow:"0 4px 16px rgba(45,158,107,0.4)" }}>🌿</div>
              <span style={{ fontFamily:"Georgia,serif", fontSize:26, fontWeight:900 }}>Nutri<span style={{ color:C.lime }}>Pulse</span></span>
            </div>
            <h2 style={{ fontSize:30, fontFamily:"Georgia,serif", margin:"0 0 14px", lineHeight:1.25, fontWeight:800 }}>Your health journey starts here. 🌱</h2>
            <p style={{ color:C.lime, lineHeight:1.85, fontSize:14, opacity:0.9 }}>Africa's most comprehensive nutrition platform — personalised meal plans, AI health guidance, and community support for over 30 health conditions.</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14, marginTop:36 }}>
            {[["🌍","Pan-African Nutrition","Foods from East, West, Southern & Horn of Africa"],["🤖","AI Health Assistant","Personalised advice for your specific condition"],["📚","Health Education","Understand root causes, not just symptoms"],["🎯","Multi-condition Support","Manage multiple health conditions simultaneously"]].map(([icon,title,desc]) => (
              <div key={title} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{icon}</div>
                <div><div style={{ fontWeight:800, fontSize:13 }}>{title}</div><div style={{ fontSize:11, opacity:0.7 }}>{desc}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div style={{ flex:1.1, background:"#fff", padding:"44px 40px", overflowY:"auto", maxHeight:"92vh" }}>
          <div style={{ display:"flex", background:"#f3f3f3", borderRadius:13, padding:4, marginBottom:26 }}>
            {["login","signup"].map(t => <button key={t} className="tabn" onClick={() => { setTab(t); setError(""); setSuccess(""); }} style={{ flex:1, padding:"10px", borderRadius:10, border:"none", cursor:"pointer", fontWeight:800, fontSize:14, background:tab===t?"#fff":"transparent", color:tab===t?C.forest:"#aaa", boxShadow:tab===t?"0 2px 8px rgba(0,0,0,0.1)":"none" }}>{t==="login"?"Sign In":"Create Account"}</button>)}
          </div>

          {tab==="login" ? (
            <div>
              <h3 style={{ color:C.forest, fontFamily:"Georgia,serif", fontSize:22, margin:"0 0 5px", fontWeight:800 }}>Welcome back 👋</h3>
              <p style={{ color:"#aaa", fontSize:12, marginBottom:20 }}>Sign in to your NutriPulse account</p>
              <label style={lSty}>Email</label>
              <input className="af" type="email" value={ld.email} onChange={e => setLd(p => ({...p,email:e.target.value}))} placeholder="you@email.com" style={{ ...iSty, marginBottom:12 }} />
              <label style={lSty}>Password</label>
              <div style={{ position:"relative", marginBottom:18 }}>
                <input className="af" type={showPass?"text":"password"} value={ld.password} onChange={e => setLd(p => ({...p,password:e.target.value}))} onKeyDown={e => e.key==="Enter"&&handleLogin()} style={{ ...iSty, paddingRight:44 }} />
                <button onClick={() => setShowPass(p => !p)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:15, color:"#bbb" }}>{showPass?"🙈":"👁️"}</button>
              </div>
              {error && <div style={{ ...eSty, marginBottom:12 }}>⚠️ {error}</div>}
              {success && <div style={{ ...okSty, marginBottom:12 }}>✅ {success}</div>}
              <button className="abtn" onClick={handleLogin} disabled={loading} style={{ ...bPri, width:"100%", textAlign:"center", opacity:loading?0.7:1 }}>
                {loading?<span style={{ display:"inline-block", animation:"spin2 0.8s linear infinite" }}>⟳</span>:"Sign In →"}
              </button>
              <p style={{ textAlign:"center", color:"#ccc", fontSize:11, marginTop:14 }}>Demo: demo@nutripulse.com / demo1234</p>
            </div>
          ) : (
            <div>
              <h3 style={{ color:C.forest, fontFamily:"Georgia,serif", fontSize:22, margin:"0 0 5px", fontWeight:800 }}>Create your account ✨</h3>
              <p style={{ color:"#aaa", fontSize:12, marginBottom:18 }}>Free · Takes 2 minutes · No payment required</p>
              <label style={lSty}>Full Name *</label>
              <input className="af" value={sd.name} onChange={e => setSd(p => ({...p,name:e.target.value}))} placeholder="e.g. Jane Wanjiku" style={{ ...iSty, marginBottom:11 }} />
              <label style={lSty}>Email *</label>
              <input className="af" type="email" value={sd.email} onChange={e => setSd(p => ({...p,email:e.target.value}))} placeholder="you@email.com" style={{ ...iSty, marginBottom:11 }} />
              <label style={lSty}>Phone (optional)</label>
              <input className="af" value={sd.phone} onChange={e => setSd(p => ({...p,phone:e.target.value}))} placeholder="+254 7XX XXX XXX" style={{ ...iSty, marginBottom:11 }} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:11 }}>
                <div>
                  <label style={lSty}>Password *</label>
                  <div style={{ position:"relative" }}>
                    <input className="af" type={showPass?"text":"password"} value={sd.password} onChange={e => setSd(p => ({...p,password:e.target.value}))} placeholder="Min. 6 chars" style={{ ...iSty, paddingRight:38 }} />
                    <button onClick={() => setShowPass(p => !p)} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:13, color:"#bbb" }}>{showPass?"🙈":"👁️"}</button>
                  </div>
                </div>
                <div>
                  <label style={lSty}>Confirm *</label>
                  <input className="af" type="password" value={sd.confirm} onChange={e => setSd(p => ({...p,confirm:e.target.value}))} placeholder="Repeat" style={iSty} />
                </div>
              </div>
              {sd.password && <div style={{ marginBottom:10 }}><div style={{ display:"flex", gap:3 }}>{[1,2,3,4].map(i => { const s=pwS(sd.password); return <div key={i} style={{ flex:1, height:3, borderRadius:2, background:i<=s?pwC(s):"#e8e8e8" }} />; })}</div><span style={{ fontSize:10, color:"#bbb" }}>{["","Too short","Weak","Good","Strong"][pwS(sd.password)]}</span></div>}
              {error && <div style={{ ...eSty, marginBottom:11 }}>⚠️ {error}</div>}
              {success && <div style={{ ...okSty, marginBottom:11 }}>✅ {success}</div>}
              <button className="abtn" onClick={handleSignup} disabled={loading} style={{ ...bPri, width:"100%", textAlign:"center", opacity:loading?0.7:1 }}>
                {loading?<span style={{ display:"inline-block", animation:"spin2 0.8s linear infinite" }}>⟳</span>:"Create Account & Continue →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────
export default function App() {
  const [authState, setAuthState] = useState("loading");
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("Dashboard");

  useEffect(() => {
    const { data } = supabase.auth.getSession();
    if (data.session?.user) { setUser(data.session.user); setAuthState("app"); }
    else { setAuthState("auth"); }
  }, []);

  const handleAuth = (u, isNew) => { setUser(u); setAuthState(isNew?"onboarding":"app"); };
  const handleOnboarding = (d) => { setUser(prev => ({...prev,...d})); setAuthState("app"); };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setAuthState("auth"); setPage("Dashboard");
  };

  if (authState==="loading") return (
    <div style={{ minHeight:"100vh", background:C.forest, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:14 }}>
      <div style={{ fontSize:52 }}>🌿</div>
      <div style={{ fontFamily:"Georgia,serif", fontSize:24, fontWeight:800, color:C.cream }}>Nutri<span style={{ color:C.lime }}>Pulse</span></div>
      <div style={{ color:C.lime, fontSize:13, opacity:0.8 }}>Loading your health profile...</div>
    </div>
  );
  if (authState==="auth") return <AuthScreen onAuth={handleAuth} />;
  if (authState==="onboarding") return <OnboardingScreen onComplete={handleOnboarding} userName={user?.name} />;

  const pageMap = {
    Dashboard: <Dashboard user={user} setPage={setPage} />,
    "Meal Plans": <MealPlans user={user} />,
    "Food Database": <FoodDatabase />,
    Chat: <ChatBot user={user} />,
    Community: <Community />,
    Tracking: <Tracking user={user} />,
    Reminders: <ReminderSystem />,
    Education: <EducationPage user={user} />,
  };

  return (
    <div style={{ minHeight:"100vh", background:"#f5f4ef", fontFamily:"Georgia,serif" }}>
      <style>{`
        @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        *{box-sizing:border-box;}
        button,input,select,p,div,span,li{font-family:system-ui,'Segoe UI',sans-serif;}
        h1,h2,h3,h4{font-family:Georgia,serif;}
        input,select{outline:none;}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:${C.lime};border-radius:3px;}
      `}</style>
      <Navbar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
      <main>{pageMap[page] || pageMap.Dashboard}</main>
      <footer style={{ textAlign:"center", padding:"24px", color:"#bbb", fontSize:12, borderTop:`1px solid ${C.mist}`, marginTop:40, fontFamily:"system-ui,sans-serif" }}>
        NutriPulse © 2025 · AI-Powered Nutrition for Africa · Built with ❤️ for community health · Serving East, West, Southern & Horn of Africa
      </footer>
    </div>
  );
}
