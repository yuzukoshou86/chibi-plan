const STATION_API_URL = "https://express.heartrails.com/api/json";

function sendJson(response, status, body) {
  response.status(status).json(body);
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return sendJson(response, 405, { error: "POSTリクエストのみ利用できます。" });
  }

  const station = request.body?.station?.trim();
  if (typeof station !== "string" || station.length > 80 || !station.endsWith("駅")) {
    return sendJson(response, 200, { valid: false });
  }

  const stationName = station.slice(0, -1).trim();
  if (!stationName) {
    return sendJson(response, 200, { valid: false });
  }

  const url = new URL(STATION_API_URL);
  url.searchParams.set("method", "getStations");
  url.searchParams.set("name", stationName);

  try {
    const stationResponse = await fetch(url, {
      headers: { "User-Agent": "chibi-plan/1.0" }
    });

    if (!stationResponse.ok) {
      return sendJson(response, 502, { error: "駅名を確認できませんでした。" });
    }

    const result = await stationResponse.json();
    const stations = result?.response?.station || [];
    const matches = stations.some((item) => item?.name === stationName);

    return sendJson(response, 200, { valid: matches });
  } catch (error) {
    console.error(
      "Station validation failed:",
      error instanceof Error ? error.name : "UnknownError"
    );
    return sendJson(response, 500, {
      error: "駅名の確認中に通信エラーが発生しました。"
    });
  }
}
