// api/notify.js — Email Notification API (Vercel Edge Function)
// Sends admin notifications on signup, login, subscription events
// Uses Resend.com (free 3,000 emails/month)

export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method === "OPTIONS") return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const { type, user } = await req.json();
    const ADMIN_EMAIL = "kamadienosis@gmail.com";
    const time = new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi", dateStyle: "full", timeStyle: "short" });

    const emailContent = {
      signup: {
        subject: `🌿 NutriPulse: New Signup — ${user.name}`,
        html: `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#f7f3ed;padding:28px;border-radius:16px">
          <div style="background:linear-gradient(135deg,#0f2419,#1e5631);border-radius:12px;padding:24px;text-align:center;margin-bottom:22px">
            <div style="font-size:36px;margin-bottom:6px">🌿</div>
            <h1 style="color:#7ecba1;font-family:Georgia,serif;margin:0;font-size:22px">NutriPulse</h1>
            <p style="color:#c8ecd6;margin:6px 0 0;font-size:12px">New User Notification</p>
          </div>
          <h2 style="color:#0f2419;margin:0 0 18px">New User Signed Up! 🎉</h2>
          <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden">
            <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:12px 16px;color:#888;font-size:13px;width:40%">👤 Name</td><td style="padding:12px 16px;font-weight:700;color:#1e5631">${user.name}</td></tr>
            <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:12px 16px;color:#888;font-size:13px">📧 Email</td><td style="padding:12px 16px;font-weight:700;color:#1e5631">${user.email}</td></tr>
            <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:12px 16px;color:#888;font-size:13px">📱 Phone</td><td style="padding:12px 16px;font-weight:700;color:#1e5631">${user.phone || "Not provided"}</td></tr>
            <tr><td style="padding:12px 16px;color:#888;font-size:13px">🕐 Time (EAT)</td><td style="padding:12px 16px;font-weight:700;color:#1e5631">${time}</td></tr>
          </table>
          <p style="color:#aaa;font-size:11px;text-align:center;margin-top:20px">NutriPulse · AI-Powered Nutrition for East Africa</p>
        </div>`,
      },
      login: {
        subject: `🔐 NutriPulse: User Login — ${user.name}`,
        html: `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#f7f3ed;padding:28px;border-radius:16px">
          <div style="background:linear-gradient(135deg,#0f2419,#1e5631);border-radius:12px;padding:24px;text-align:center;margin-bottom:22px">
            <div style="font-size:36px;margin-bottom:6px">🌿</div>
            <h1 style="color:#7ecba1;font-family:Georgia,serif;margin:0;font-size:22px">NutriPulse</h1>
            <p style="color:#c8ecd6;margin:6px 0 0;font-size:12px">Login Notification</p>
          </div>
          <h2 style="color:#0f2419;margin:0 0 18px">User Logged In</h2>
          <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden">
            <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:12px 16px;color:#888;font-size:13px;width:40%">👤 Name</td><td style="padding:12px 16px;font-weight:700;color:#1e5631">${user.name}</td></tr>
            <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:12px 16px;color:#888;font-size:13px">📧 Email</td><td style="padding:12px 16px;font-weight:700;color:#1e5631">${user.email}</td></tr>
            <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:12px 16px;color:#888;font-size:13px">💎 Plan</td><td style="padding:12px 16px;font-weight:700;color:#1e5631">${user.plan || "Free"}</td></tr>
            <tr><td style="padding:12px 16px;color:#888;font-size:13px">🕐 Time (EAT)</td><td style="padding:12px 16px;font-weight:700;color:#1e5631">${time}</td></tr>
          </table>
          <p style="color:#aaa;font-size:11px;text-align:center;margin-top:20px">NutriPulse · AI-Powered Nutrition for East Africa</p>
        </div>`,
      },
      subscription: {
        subject: `💳 NutriPulse: New Subscription — ${user.name} (${user.plan})`,
        html: `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#f7f3ed;padding:28px;border-radius:16px">
          <div style="background:linear-gradient(135deg,#0f2419,#1e5631);border-radius:12px;padding:24px;text-align:center;margin-bottom:22px">
            <div style="font-size:36px;margin-bottom:6px">🌿</div>
            <h1 style="color:#e8c35a;font-family:Georgia,serif;margin:0;font-size:22px">NutriPulse</h1>
            <p style="color:#c8ecd6;margin:6px 0 0;font-size:12px">💳 New Subscription!</p>
          </div>
          <h2 style="color:#0f2419;margin:0 0 18px">New Premium Subscriber 🎉</h2>
          <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden">
            <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:12px 16px;color:#888;font-size:13px;width:40%">👤 Name</td><td style="padding:12px 16px;font-weight:700;color:#1e5631">${user.name}</td></tr>
            <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:12px 16px;color:#888;font-size:13px">📧 Email</td><td style="padding:12px 16px;font-weight:700;color:#1e5631">${user.email}</td></tr>
            <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:12px 16px;color:#888;font-size:13px">💎 Plan</td><td style="padding:12px 16px;font-weight:800;color:#e8c35a;font-size:15px">${user.plan}</td></tr>
            <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:12px 16px;color:#888;font-size:13px">💰 Amount</td><td style="padding:12px 16px;font-weight:700;color:#1e5631">${user.amount || "—"}</td></tr>
            <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:12px 16px;color:#888;font-size:13px">📱 M-Pesa Ref</td><td style="padding:12px 16px;font-weight:700;color:#1e5631">${user.transactionId || "Pending"}</td></tr>
            <tr><td style="padding:12px 16px;color:#888;font-size:13px">🕐 Time (EAT)</td><td style="padding:12px 16px;font-weight:700;color:#1e5631">${time}</td></tr>
          </table>
          <p style="color:#aaa;font-size:11px;text-align:center;margin-top:20px">NutriPulse · AI-Powered Nutrition for East Africa</p>
        </div>`,
      },
    };

    const content = emailContent[type];
    if (!content) return new Response(JSON.stringify({ success: false, error: "Unknown notification type" }), { status: 400 });

    // Send via Resend if API key is configured
    if (process.env.RESEND_API_KEY) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
        body: JSON.stringify({
          from: "NutriPulse <notifications@nutripulsenutrition.com>",
          to: [ADMIN_EMAIL],
          subject: content.subject,
          html: content.html,
        }),
      });
      const result = await resendRes.json();
      return new Response(JSON.stringify({ success: true, id: result.id }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    // No Resend key — log but don't fail
    console.log(`[NutriPulse Notification] Type: ${type}, User: ${user.email}, Time: ${time}`);
    return new Response(JSON.stringify({ success: true, demo: true }), { status: 200 });

  } catch (err) {
    console.error("Notify handler error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
