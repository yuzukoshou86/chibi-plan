import { searchStations } from "./_station-service.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "この操作は許可されていません。" });
  }

  const query = typeof req.query?.q === "string" ? req.query.q : "";
  if (!query.trim() || query.length > 40) {
    return res.status(400).json({ error: "駅名を1文字以上40文字以内で入力してください。" });
  }

  try {
    const stations = await searchStations(query, 8);
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800");
    return res.status(200).json({ stations });
  } catch (error) {
    console.error("Station search failed.", {
      name: error?.name,
      status: error?.status,
      code: error?.cause?.code || error?.code
    });
    return res.status(502).json({ error: "駅情報を取得できませんでした。時間をおいて再度お試しください。" });
  }
}
