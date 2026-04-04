export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { type, user } = await req.json();
    const ADMIN_EMAIL = "kamadienosis@gmail.com";
    const time = new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" });

    const subjects = {
      signup: `🌿 NutriPulse: New User Signup — ${user.name}`,
      login: `🔐 NutriPulse: User Login — ${user.name}`,
      subscription: `💳 NutriPulse: New Subscription — ${user.name}`,
    };

    const bodies = {
      signup: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#f7f3ed;padding:32px;border-radius:16px;">
          <div style="background:linear-gradient(135deg,#0f2419,#1e5631);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
            <h1 style="color:#7ecba1;font-family:Georgia,serif;margin:0;">🌿 NutriPulse</h1>
            <p style="color:#c8ecd6;margin:8px 0 0;font-size:13px;">Admin Notification</p>
          </div>
          <h2 style="color:#0f2419;">New User Signed Up!</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#666;font-size:14px;">👤 Name</td><td style="padding:8px 0;font-weight:700;color:#1e5631;">${user.name}</td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:14px;">📧 Email</td><td style="padding:8px 0;font-weight:700;color:#1e5631;">${user.email}</td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:14px;">📱 Phone</td><td style="padding:8px 0;font-weight:700;color:#1e5631;">${user.phone || "Not provided"}</td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:14px;">🕐 Time (EAT)</td><td style="padding:8px 0;font-weight:700;color:#1e5631;">${time}</td></tr>
          </table>
          <p style="color:#aaa;font-size:12px;margin-top:24px;text-align:center;">NutriPulse · AI-Powered Nutrition for East Africa</p>
        </div>`,
      login: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#f7f3ed;padding:32px;border-radius:16px;">
          <div style="background:linear-gradient(135deg,#0f2419,#1e5631);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
            <h1 style="color:#7ecba1;font-family:Georgia,serif;margin:0;">🌿 NutriPulse</h1>
            <p style="color:#c8ecd6;margin:8px 0 0;font-size:13px;">Admin Notification</p>
          </div>
          <h2 style="color:#0f2419;">User Logged In</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#666;font-size:14px;">👤 Name</td><td style="padding:8px 0;font-weight:700;color:#1e5631;">${user.name}</td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:14px;">📧 Email</td><td style="padding:8px 0;font-weight:700;color:#1e5631;">${user.email}</td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:14px;">🕐 Time (EAT)</td><td style="padding:8px 0;font-weight:700;color:#1e5631;">${time}</td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:14px;">💎 Plan</td><td style="padding:8px 0;font-weight:700;color:#1e5631;">${user.plan || "Free"}</td></tr>
          </table>
          <p style="color:#aaa;font-size:12px;margin-top:24px;text-align:center;">NutriPulse · AI-Powered Nutrition for East Africa</p>
        </div>`,
      subscription: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#f7f3ed;padding:32px;border-radius:16px;">
          <div style="background:linear-gradient(135deg,#0f2419,#1e5631);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
            <h1 style="color:#7ecba1;font-family:Georgia,serif;margin:0;">🌿 NutriPulse</h1>
            <p style="color:#c8ecd6;margin:8px 0 0;font-size:13px;">💳 New Subscription!</p>
          </div>
          <h2 style="color:#0f2419;">New Premium Subscriber 🎉</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#666;font-size:14px;">👤 Name</td><td style="padding:8px 0;font-weight:700;color:#1e5631;">${user.name}</td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:14px;">📧 Email</td><td style="padding:8px 0;font-weight:700;color:#1e5631;">${user.email}</td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:14px;">💎 Plan</td><td style="padding:8px 0;font-weight:700;color:#e8c35a;">${user.plan}</td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:14px;">🕐 Time (EAT)</td><td style="padding:8px 0;font-weight:700;color:#1e5631;">${time}</td></tr>
          </table>
          <p style="color:#aaa;font-size:12px;margin-top:24px;text-align:center;">NutriPulse · AI-Powered Nutrition for East Africa</p>
        </div>`,
    };

    // Send via Resend (free 3000 emails/month)
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "NutriPulse <notifications@nutripulse.app>",
        to: [ADMIN_EMAIL],
        subject: subjects[type],
        html: bodies[type],
      }),
    });

    const result = await resendRes.json();
    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
