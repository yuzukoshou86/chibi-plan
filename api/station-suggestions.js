const STATION_SEARCH_URL = "https://api.station.seo4d696b75.com/station/search";
const PREFECTURES = [
  "", "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];

function sendJson(response, status, body) {
  response.status(status).json(body);
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return sendJson(response, 405, { error: "GETリクエストのみ利用できます。" });
  }

  const query = String(request.query?.q || "").trim().replace(/駅$/, "");
  if (query.length < 2 || query.length > 40) {
    return sendJson(response, 200, { suggestions: [] });
  }

  const url = new URL(STATION_SEARCH_URL);
  url.searchParams.set("name", query);
  url.searchParams.set("original", "true");
  url.searchParams.set("extra", "false");

  try {
    const stationResponse = await fetch(url, {
      headers: { "User-Agent": "chibi-plan/1.0" }
    });
    if (!stationResponse.ok) {
      return sendJson(response, 502, { error: "駅の候補を検索できませんでした。" });
    }

    const stations = await stationResponse.json();
    const suggestions = stations.slice(0, 8).map((station) => ({
      name: `${station.original_name}駅`,
      prefecture: PREFECTURES[station.prefecture] || "所在地不明",
      kana: station.name_kana
    }));

    return sendJson(response, 200, { suggestions });
  } catch (error) {
    console.error("Station suggestions failed:", error instanceof Error ? error.name : "UnknownError");
    return sendJson(response, 500, { error: "駅の候補を検索できませんでした。" });
  }
}
