import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { query, chatHistory, context } = await req.json();
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      throw new Error("Missing OPENAI_API_KEY secret.");
    }

    const systemPrompt = `You are CASHCRUSH AI, a friendly and realistic financial coach for college students.
Analyze the user's spending context and help them balance their allowance, cut impulse spending, and build smart habits.

User Context:
- Currency: ${context.currency || "₹"}
- Monthly Budget Limit: ${context.monthlyBudget}
- Total Spent: ${context.totalSpent}
- Category Breakdown: ${JSON.stringify(context.categoryTotals)}
- Savings Goals progress: ${JSON.stringify(context.goals)}
- Recurring Subscriptions: ${JSON.stringify(context.recurring)}

Rules:
1. Speak directly, encouragingly, and like a peer.
2. Keep responses brief (under 130 words).
3. Do not make up numbers. Only use the provided context.
4. Reference their actual highest spending category or recent transactions where helpful.`;

    const apiMessages = [
      { role: "system", content: systemPrompt }
    ];

    if (chatHistory && chatHistory.length > 0) {
      chatHistory.forEach((msg: any) => {
        apiMessages.push({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text
        });
      });
    }

    apiMessages.push({ role: "user", content: query });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: apiMessages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }
    const reply = data.choices?.[0]?.message?.content || "Coach offline. Let's try again in a bit!";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
