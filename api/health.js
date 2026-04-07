// api/health.js — Diagnostic endpoint to check if all env vars are configured
// Visit: https://nutripulsenutrition.vercel.app/api/health
// This helps debug missing environment variables without exposing key values

export const config = { runtime: "edge" };

export default async function handler(req) {
  const checks = {
    anthropic_key: !!process.env.ANTHROPIC_API_KEY,
    anthropic_key_format: process.env.ANTHROPIC_API_KEY?.startsWith("sk-ant-") || false,
    supabase_url: !!process.env.REACT_APP_SUPABASE_URL,
    supabase_key: !!process.env.REACT_APP_SUPABASE_ANON_KEY,
    resend_key: !!process.env.RESEND_API_KEY,
    mpesa_key: !!process.env.MPESA_CONSUMER_KEY,
    mpesa_env: process.env.MPESA_ENV || "not set (defaults to sandbox)",
  };

  const allCritical = checks.anthropic_key && checks.anthropic_key_format;

  // Test actual Anthropic API connection if key exists
  let apiTest = null;
  if (checks.anthropic_key) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 10,
          messages: [{ role: "user", content: "Hi" }],
        }),
      });
      if (res.ok) {
        apiTest = "✅ Anthropic API connection successful";
      } else {
        const err = await res.json();
        apiTest = `❌ Anthropic API error: ${res.status} — ${err?.error?.message || "Unknown error"}`;
      }
    } catch (e) {
      apiTest = `❌ Network error: ${e.message}`;
    }
  } else {
    apiTest = "⚠️ Skipped — API key not set";
  }

  const report = {
    status: allCritical ? "✅ NutriBot ready" : "❌ NutriBot NOT ready — see issues below",
    timestamp: new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" }),
    environment_checks: {
      "ANTHROPIC_API_KEY set": checks.anthropic_key ? "✅ Yes" : "❌ Missing — add this in Vercel Environment Variables",
      "ANTHROPIC_API_KEY format": checks.anthropic_key_format ? "✅ Correct (starts with sk-ant-)" : "❌ Wrong format — should start with sk-ant-",
      "REACT_APP_SUPABASE_URL": checks.supabase_url ? "✅ Set" : "⚠️ Not set (auth will use demo mode)",
      "REACT_APP_SUPABASE_ANON_KEY": checks.supabase_key ? "✅ Set" : "⚠️ Not set (auth will use demo mode)",
      "RESEND_API_KEY": checks.resend_key ? "✅ Set" : "⚠️ Not set (email notifications disabled)",
      "MPESA_CONSUMER_KEY": checks.mpesa_key ? "✅ Set" : "ℹ️ Not set (M-Pesa runs in demo mode)",
      "MPESA_ENV": checks.mpesa_env,
    },
    api_connection_test: apiTest,
    next_steps: allCritical ? [
      "All critical variables are set!",
      "If NutriBot still fails, try redeploying on Vercel",
      "Check Vercel Function Logs for detailed errors",
    ] : [
      "1. Go to console.anthropic.com and create an API key",
      "2. Go to Vercel → NutriPulse → Settings → Environment Variables",
      "3. Add ANTHROPIC_API_KEY with your key value",
      "4. Redeploy on Vercel",
      "5. Visit this /api/health page again to confirm",
    ],
  };

  return new Response(JSON.stringify(report, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
