# 🌿 NutriPulse

> **AI-Powered Nutrition for East Africa** — Personalised meal plans, local Kenyan food database, and Claude AI-powered NutriBot.

![NutriPulse](https://img.shields.io/badge/NutriPulse-v1.0-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![Claude AI](https://img.shields.io/badge/Claude-AI-orange) ![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **NutriBot AI** | Live Claude AI chatbot with deep Kenyan nutrition context |
| 📅 **7-Day Meal Plans** | Full week plans for Diabetes, Hypertension, Obesity, Cancer & more |
| 🌾 **Food Database** | 20+ local Kenyan & East African foods with macros, fiber & glycemic index |
| 📊 **Health Tracking** | Calorie logger, biometrics (weight, blood sugar, BP), BMI calculator |
| 🌍 **Community Hub** | Posts, wellness challenges, and health articles |
| 📧 **Admin Notifications** | Email alerts on every signup and login |
| 🔐 **Auth System** | Login, signup with password strength indicator, forgot password |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/kamadienosis/nutripulse.git
cd nutripulse

# Install dependencies
npm install

# Start development server
npm start
```

App runs at `http://localhost:3000`

### Demo Login
```
Email:    demo@nutripulse.com
Password: demo1234
```

---

## 🏗️ Project Structure

```
nutripulse/
├── public/
│   └── index.html          # HTML entry point with loading screen
├── src/
│   ├── App.jsx             # Main application (all components)
│   └── index.js            # React entry point
├── package.json
├── .gitignore
└── README.md
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project** → select `nutripulse`
3. Click **Deploy** — live in ~2 minutes!

### Deploy to Netlify
1. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
2. Select `nutripulse` → Build command: `npm run build` → Publish dir: `build`
3. Click **Deploy**

---

## 🍽️ Supported Health Conditions

- 🩺 Diabetes Type 2 — Low glycemic, balanced meals
- ❤️ Hypertension — Low sodium, high potassium
- ⚖️ Obesity — High fiber, calorie deficit
- 💊 Cancer (Oncology) — Anti-inflammatory, high protein
- 🌿 Healthy — Balanced & wholesome

---

## 🌾 Local Foods Database

Includes: Ugali, Sukuma Wiki, Managu, Omena, Njahi, Arrow Roots, Millet Porridge, Matoke, Githeri, Mukimo, Tilapia, Chapati, Avocado, Groundnuts, Sweet Potato, Lentils (Kamande), Banana (Ndizi), Pawpaw, Sorghum Uji, Kunde (Cowpeas)

---

## 🤖 AI Integration

NutriBot is powered by **Claude claude-sonnet-4-20250514** via the Anthropic API with a custom system prompt focused on:
- Kenyan & East African food culture
- Condition-specific dietary guidance
- Culturally appropriate meal suggestions
- Swahili-friendly, empathetic communication

---

## 📧 Admin Email Notifications

Every signup and login triggers an email notification to the admin at `kamadienosis@gmail.com` via Gmail MCP integration, including user name, email, phone, and Nairobi timestamp.

---

## 👨‍💻 Built By

**Enosis** — Built with ❤️ for community health in East Africa

---

## 📄 License

MIT License — feel free to fork and adapt for your community.
