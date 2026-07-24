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
    const { query, expenses = [], budget = 8000, goals = [], recurring = [], currency = "₹" } = await req.json();
    const apiKey = Deno.env.get("OPENAI_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API Key is not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build context details
    const totalSpent = expenses.reduce((sum: number, exp: any) => sum + parseFloat(exp.amount), 0);
    const categoryBreakdown = expenses.reduce((acc: any, exp: any) => {
      acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
      return acc;
    }, {});

    const recentList = expenses.slice(0, 5).map((e: any) => `• ${e.title} (${e.category}): ${currency}${e.amount}`).join("\n");
    const goalsList = goals.map((g: any) => `• ${g.title}: Saved ${currency}${g.saved_amount} of ${currency}${g.target_amount}`).join("\n");

    const prompt = `
You are CASHCRUSH AI, a friendly, encouraging personal finance coach for college students.
Use the following real-time financial context of the student to answer their question. Keep recommendations highly practical, simple, and tailored for a student budget.

Student Monthly Budget limit: ${currency}${budget}
Total Spent this month: ${currency}${totalSpent}
Remaining limit: ${currency}${budget - totalSpent}

Spending Category Breakdown:
${Object.entries(categoryBreakdown).map(([cat, val]) => `- ${cat}: ${currency}${val}`).join("\n")}

Recent Transactions:
${recentList || "None"}

Savings Targets:
${goalsList || "None"}

User Question: "${query}"

Guidelines:
1. Address the student's question directly and helpfully.
2. Reference their actual spending figures (e.g. total spent, budget, or categories) to make it highly personalized.
3. If they ask about buying a specific item (e.g. "Can I order pizza?"), estimate the item's cost (e.g., ₹400 for pizza), subtract it from their remaining budget or category allowance, and advise them accordingly.
4. Keep the response friendly, concise, and under 150 words. Never make up numbers.
`;

    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are CASHCRUSH AI, a helpful financial assistant for students." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 250,
      }),
    });

    const aiData = await openAiResponse.json();
    const replyText = aiData.choices?.[0]?.message?.content || "Sorry, I am having trouble thinking right now. Please try again.";

    return new Response(
      JSON.stringify({ reply: replyText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
