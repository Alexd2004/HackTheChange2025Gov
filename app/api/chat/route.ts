


// // app/api/chat/route.ts
// import { NextRequest } from "next/server";

// export const runtime = "edge";

// const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
// const OPENAI_URL = "https://api.openai.com/v1/responses";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { messages, system, temperature = 0.4 } = body as {
//       messages: { role: "user" | "assistant" | "system"; content: string }[];
//       system?: string;
//       temperature?: number;
//     };

//     if (!process.env.OPENAI_API_KEY)
//       return new Response("Missing OPENAI_API_KEY", { status: 500 });

//     // 👉 Flatten messages into one text input
//     const conversation = [
//       ...(system ? [`System: ${system}`] : []),
//       ...messages.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`),
//     ].join("\n");

//     const resp = await fetch(OPENAI_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: MODEL,
//         temperature,
//         input: conversation, // ✅ single string input
//       }),
//     });

//     if (!resp.ok) {
//       const text = await resp.text();
//       console.error("❌ Upstream error:", text);
//       return new Response(text || "Upstream error", { status: 500 });
//     }

//     const json = await resp.json();

//     const output =
//       json.output_text ??
//       json.output?.[0]?.content?.[0]?.text ??
//       json.output?.[0]?.content?.[0]?.text?.value ??
//       "";

//     console.log("🤖 OpenAI reply:", output);
//     return Response.json({ reply: output || "⚠️ No reply text received." });
//   } catch (err: unknown) {
//     const message =
//       err instanceof Error
//         ? err.message
//         : typeof err === "string"
//           ? err
//           : "unknown";
//     console.error("🔥 Server error:", err);
//     return new Response(`Server error: ${message}`, { status: 500 });
//   }
// }



import { NextRequest } from "next/server";
import { getAnalyticsSummary } from "@/lib/supabase/analyticsHelpers";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export const runtime = "edge";
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
const OPENAI_URL = "https://api.openai.com/v1/responses";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages = [],
      system,
      temperature = 0.4,
    } = body as {
      messages?: ChatMessage[];
      system?: string;
      temperature?: number;
    };

    if (!process.env.OPENAI_API_KEY)
      return new Response("Missing OPENAI_API_KEY", { status: 500 });

    // 🧩 1️⃣ Get latest analytics snapshot
    const analyticsText = await getAnalyticsSummary();

    // 🧩 2️⃣ Merge user conversation + analytics context
    const conversation = [
      `System: ${system ?? ""}`,
      `Context: Here is the latest analytics snapshot from the 311 request database.\n${analyticsText}`,
      ...messages.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`),
    ].join("\n");

    // 🧩 3️⃣ Send to OpenAI
    const resp = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature,
        input: conversation,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("❌ OpenAI upstream error:", text);
      return new Response(text || "Upstream error", { status: 500 });
    }

    const json = await resp.json();
    const output =
      json.output_text ??
      json.output?.[0]?.content?.[0]?.text ??
      json.output?.[0]?.content?.[0]?.text?.value ??
      "";

    console.log("🤖 AI reply:", output);
    return Response.json({ reply: output || "⚠️ No reply text received." });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
          ? err
          : "unknown";
    console.error("🔥 Server error:", err);
    return new Response(`Server error: ${message}`, { status: 500 });
  }
}
