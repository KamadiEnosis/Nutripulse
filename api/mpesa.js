// api/mpesa.js — M-Pesa Daraja STK Push API (Vercel Edge Function)
// Handles: token generation, STK push initiation, payment status polling
// Security: All M-Pesa credentials stay server-side only

export const config = { runtime: "edge" };

// ─── Safaricom Daraja Endpoints ───────────────────────────────────────────
const DARAJA_BASE = process.env.MPESA_ENV === "production"
  ? "https://api.safaricom.co.ke"
  : "https://sandbox.api.safaricom.co.ke";

// ─── Generate OAuth Token from Safaricom ─────────────────────────────────
async function getDarajaToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  if (!consumerKey || !consumerSecret) throw new Error("M-Pesa credentials not configured");

  const credentials = btoa(`${consumerKey}:${consumerSecret}`);
  const res = await fetch(`${DARAJA_BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` },
  });
  if (!res.ok) throw new Error(`Token fetch failed: ${res.status}`);
  const data = await res.json();
  if (!data.access_token) throw new Error("No access token in response");
  return data.access_token;
}

// ─── Generate STK Push Password (Base64 of Shortcode+Passkey+Timestamp) ──
function generatePassword(timestamp) {
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  return btoa(`${shortcode}${passkey}${timestamp}`);
}

// ─── Format phone number to 254XXXXXXXXX format ──────────────────────────
function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, ""); // strip non-digits
  if (cleaned.startsWith("254") && cleaned.length === 12) return cleaned;
  if (cleaned.startsWith("0") && cleaned.length === 10) return "254" + cleaned.slice(1);
  if (cleaned.startsWith("7") && cleaned.length === 9) return "254" + cleaned;
  if (cleaned.startsWith("1") && cleaned.length === 9) return "254" + cleaned;
  throw new Error("Invalid phone number. Use format: 07XX XXX XXX or +254 7XX XXX XXX");
}

// ─── Main Handler ─────────────────────────────────────────────────────────
export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
  }
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const body = await req.json();
    const { action } = body;

    // ─── ACTION: Initiate STK Push ───────────────────────────────────
    if (action === "initiate") {
      const { phone, amount, planName, userId } = body;

      // Validate required fields
      if (!phone || !amount || !planName) {
        return jsonResponse({ success: false, error: "Phone, amount and plan are required." }, 400);
      }

      // Check credentials exist
      if (!process.env.MPESA_CONSUMER_KEY) {
        // Demo mode — simulate success for testing before M-Pesa setup
        const demoRef = `DEMO${Date.now()}`;
        return jsonResponse({
          success: true,
          demo: true,
          checkoutRequestId: demoRef,
          message: "DEMO MODE: M-Pesa not yet configured. Payment simulated successfully.",
          merchantRequestId: "demo-merchant",
        });
      }

      let formattedPhone;
      try { formattedPhone = formatPhone(phone); }
      catch (e) { return jsonResponse({ success: false, error: e.message }, 400); }

      // Get OAuth token
      const token = await getDarajaToken();

      // Generate timestamp (YYYYMMDDHHmmss)
      const now = new Date();
      const pad = n => String(n).padStart(2, "0");
      const timestamp = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
      const password = generatePassword(timestamp);

      const shortcode = process.env.MPESA_SHORTCODE;
      const callbackUrl = process.env.MPESA_CALLBACK_URL || `${process.env.VERCEL_URL}/api/mpesa-callback`;

      // STK Push request payload
      const stkPayload = {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.ceil(Number(amount)), // M-Pesa requires whole numbers
        PartyA: formattedPhone,
        PartyB: shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: `NutriPulse-${planName}`,
        TransactionDesc: `NutriPulse ${planName} Subscription`,
      };

      const stkRes = await fetch(`${DARAJA_BASE}/mpesa/stkpush/v1/processrequest`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(stkPayload),
      });

      const stkData = await stkRes.json();

      if (stkData.ResponseCode === "0") {
        // Success — STK push sent to user's phone
        // Store pending transaction in Supabase if configured
        await storePendingTransaction({
          checkoutRequestId: stkData.CheckoutRequestID,
          merchantRequestId: stkData.MerchantRequestID,
          phone: formattedPhone,
          amount: Math.ceil(Number(amount)),
          planName,
          userId,
        });

        return jsonResponse({
          success: true,
          checkoutRequestId: stkData.CheckoutRequestID,
          merchantRequestId: stkData.MerchantRequestID,
          message: "Payment request sent to your phone successfully!",
        });
      } else {
        return jsonResponse({
          success: false,
          error: stkData.errorMessage || stkData.ResponseDescription || "Failed to initiate payment. Please try again.",
          code: stkData.ResponseCode,
        });
      }
    }

    // ─── ACTION: Poll payment status ─────────────────────────────────
    if (action === "status") {
      const { checkoutRequestId } = body;
      if (!checkoutRequestId) return jsonResponse({ success: false, error: "CheckoutRequestID required" }, 400);

      // Demo mode
      if (checkoutRequestId.startsWith("DEMO")) {
        return jsonResponse({ success: true, status: "completed", transactionId: `TXN${Date.now()}` });
      }

      if (!process.env.MPESA_CONSUMER_KEY) {
        return jsonResponse({ success: true, status: "pending", message: "M-Pesa not configured" });
      }

      const token = await getDarajaToken();
      const now = new Date();
      const pad = n => String(n).padStart(2, "0");
      const timestamp = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
      const password = generatePassword(timestamp);

      const queryRes = await fetch(`${DARAJA_BASE}/mpesa/stkpushquery/v1/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          BusinessShortCode: process.env.MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId,
        }),
      });

      const queryData = await queryRes.json();

      if (queryData.ResultCode === "0") {
        return jsonResponse({ success: true, status: "completed", transactionId: queryData.CheckoutRequestID, message: "Payment confirmed!" });
      } else if (queryData.ResultCode === "1032") {
        return jsonResponse({ success: false, status: "cancelled", message: "Payment was cancelled. Please try again." });
      } else if (queryData.ResultCode === "1037") {
        return jsonResponse({ success: false, status: "timeout", message: "Payment request timed out. Please try again." });
      } else if (queryData.ResultCode === "1") {
        return jsonResponse({ success: false, status: "failed", message: "Insufficient M-Pesa balance. Please top up and try again." });
      } else {
        return jsonResponse({ success: true, status: "pending", message: "Waiting for your M-Pesa confirmation..." });
      }
    }

    return jsonResponse({ success: false, error: "Unknown action" }, 400);

  } catch (err) {
    console.error("M-Pesa handler error:", err.message);
    return jsonResponse({
      success: false,
      error: "Payment service temporarily unavailable. Please try again.",
      detail: err.message,
    }, 500);
  }
}

// ─── Store pending transaction in Supabase ────────────────────────────────
async function storePendingTransaction(data) {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return; // skip if not configured

  try {
    await fetch(`${supabaseUrl}/rest/v1/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        checkout_request_id: data.checkoutRequestId,
        merchant_request_id: data.merchantRequestId,
        phone: data.phone,
        amount: data.amount,
        plan_name: data.planName,
        user_id: data.userId,
        status: "pending",
        created_at: new Date().toISOString(),
      }),
    });
  } catch (e) {
    console.log("Could not store transaction:", e.message);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}
