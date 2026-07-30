const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

function sendJson(response, status, body) {
  response.status(status).json(body);
}

function getOutputText(result) {
  if (typeof result.output_text === "string") {
    return result.output_text.trim();
  }

  return (result.output || [])
    .filter((item) => item.type === "message")
    .flatMap((item) => item.content || [])
    .filter((content) => content.type === "output_text")
    .map((content) => content.text)
    .join("\n")
    .trim();
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return sendJson(response, 405, { error: "POSTリクエストのみ利用できます。" });
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    return sendJson(response, 500, {
      error: "VercelにOPENAI_API_KEYが設定されていません。"
    });
  }

  const prompt = request.body?.prompt;

  if (typeof prompt !== "string" || prompt.trim() === "") {
    return sendJson(response, 400, { error: "プラン作成に必要な条件がありません。" });
  }

  if (prompt.length > 30000) {
    return sendJson(response, 400, { error: "入力内容が長すぎます。" });
  }

  const outputInstructions = `
回答は日本語で、ユーザーがそのまま実行できる見やすいスケジュールとして作成してください。
冒頭にプラン名と、このプランを選んだ理由を簡潔に示してください。
各予定には時刻、具体的な店舗・施設名、移動方法と所要時間、体験内容、ちびタスク、1人当たりの概算費用を含めてください。
最後に1人当たりの費用合計と、営業時間・定休日など当日確認が必要な注意事項を示してください。
施設の営業状況など最新情報が必要な場合はWeb検索を使い、確認できない情報を事実のように断定しないでください。
`.trim();

  try {
    const openAIResponse = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.6-terra",
        reasoning: { effort: "low" },
        tools: [{ type: "web_search" }],
        input: `${prompt}\n\n【出力方法】\n${outputInstructions}`,
        max_output_tokens: 5000,
        text: { verbosity: "medium" }
      })
    });

    const result = await openAIResponse.json();

    if (!openAIResponse.ok) {
      console.error("OpenAI API error:", result);
      const message =
        result?.error?.message ||
        "OpenAI APIでプランを作成できませんでした。";
      return sendJson(response, openAIResponse.status, { error: message });
    }

    const plan = getOutputText(result);

    if (!plan) {
      console.error("OpenAI API returned no output_text:", result);
      return sendJson(response, 502, {
        error: "AIからプラン本文を受け取れませんでした。"
      });
    }

    return sendJson(response, 200, { plan });
  } catch (error) {
    console.error(
      "Plan generation failed:",
      error instanceof Error ? error.name : "UnknownError"
    );
    return sendJson(response, 500, {
      error: "通信中に問題が発生しました。時間をおいてもう一度お試しください。"
    });
  }
}
