import { Request, Response } from "express";
import { fetch } from "undici";

interface OpenRouterChoice {
  message: { role: string; content: string };
}

interface OpenRouterResponse {
  choices: OpenRouterChoice[];
  error?: { message: string };
}

export const generateSmartReply = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { message } = req.body;
  console.log(message);
  
  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.CLIENT_URL, // đổi thành domain FE
          "X-Title": "ChatApp",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemma-2-9b-it:free",
          messages: [
            {
              role: "system",
              content:
                "You are a smart assistant. Suggest 3 short, casual replies.",
            },
            { role: "user", content: message },
          ],
          max_tokens: 100,
        }),
      }
    );

    const data = (await response.json()) as OpenRouterResponse;

    if (!response.ok) {
      console.error("❌ OpenRouter error:", data);
      res
        .status(response.status)
        .json({ error: data.error?.message || "Provider returned error" });
      return;
    }
    if (response.status === 429) {
      res
        .status(429)
        .json({ error: "AI server đang bận, vui lòng thử lại sau ít phút." });
      return;
    }

    const replyText = data.choices?.[0]?.message?.content || "";
    res.json({ reply: replyText });
  } catch (err: any) {
    console.error("❌ SmartReply error:", err.message);
    res.status(500).json({ error: err.message || "Failed to generate reply" });
  }
};
