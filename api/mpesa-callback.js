// api/mpesa-callback.js — Safaricom Daraja Callback Webhook
// Safaricom calls this URL after payment is completed/failed
// Updates subscription status in Supabase automatically

export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") return new Response("OK", { status: 200 });

  try {
    const body = await req.json();
    const callback = body?.Body?.stkCallback;
    if (!callback) return new Response("OK", { status: 200 });

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callback;

    if (ResultCode === 0) {
      // Payment successful — extract transaction details
      const items = CallbackMetadata?.Item || [];
      const get = name => items.find(i => i.Name === name)?.Value;

      const transactionId = get("MpesaReceiptNumber");
      const amount = get("Amount");
      const phone = String(get("PhoneNumber") || "");

      // Update transaction in Supabase
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        // Update transaction status
        await fetch(`${supabaseUrl}/rest/v1/transactions?checkout_request_id=eq.${CheckoutRequestID}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
          body: JSON.stringify({ status: "completed", transaction_id: transactionId, completed_at: new Date().toISOString() }),
        });

        // Get the transaction to find userId and planName
        const txRes = await fetch(`${supabaseUrl}/rest/v1/transactions?checkout_request_id=eq.${CheckoutRequestID}`, {
          headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
        });
        const txData = await txRes.json();
        const tx = txData?.[0];

        if (tx?.user_id && tx?.plan_name) {
          // Activate subscription for this user
          const planExpiry = new Date();
          planExpiry.setMonth(planExpiry.getMonth() + (tx.plan_name.toLowerCase().includes("annual") ? 12 : 1));

          await fetch(`${supabaseUrl}/rest/v1/subscriptions?user_id=eq.${tx.user_id}`, {
            method: "UPSERT",
            headers: { "Content-Type": "application/json", apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, Prefer: "resolution=merge-duplicates" },
            body: JSON.stringify({
              user_id: tx.user_id,
              plan: tx.plan_name,
              status: "active",
              transaction_id: transactionId,
              amount_paid: amount,
              activated_at: new Date().toISOString(),
              expires_at: planExpiry.toISOString(),
            }),
          });
        }
      }
    } else {
      // Payment failed — update transaction status
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseKey) {
        await fetch(`${supabaseUrl}/rest/v1/transactions?checkout_request_id=eq.${CheckoutRequestID}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
          body: JSON.stringify({ status: "failed", error_message: ResultDesc }),
        });
      }
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("M-Pesa callback error:", err);
    return new Response("OK", { status: 200 }); // Always return 200 to Safaricom
  }
}
