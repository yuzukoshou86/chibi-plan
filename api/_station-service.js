const STATION_API_URL = "https://api.station.seo4d696b75.com/station/search";
const STATION_API_TIMEOUT_MS = 6_000;

export function normalizeStationQuery(value) {
  if (typeof value !== "string") return "";
  return value.normalize("NFKC").trim().replace(/駅$/u, "");
}

async function fetchStationMatches(query) {
  const normalizedQuery = normalizeStationQuery(query);
  if (!normalizedQuery || normalizedQuery.length > 40) return [];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), STATION_API_TIMEOUT_MS);

  try {
    const url = new URL(STATION_API_URL);
    url.searchParams.set("name", normalizedQuery);
    url.searchParams.set("original", "true");
    url.searchParams.set("extra", "false");

    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      const error = new Error("STATION_API_ERROR");
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("INVALID_STATION_RESPONSE");
    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}

function sanitizeStation(station) {
  if (!station || typeof station !== "object") return null;

  const name = typeof station.name === "string" ? station.name.trim() : "";
  const originalName = typeof station.original_name === "string" ? station.original_name.trim() : "";
  const nameKana = typeof station.name_kana === "string" ? station.name_kana.trim() : "";

  if (!name || !originalName || name.length > 80 || originalName.length > 80 || nameKana.length > 100) {
    return null;
  }

  return {
    code: Number.isInteger(station.code) ? station.code : null,
    name,
    originalName,
    nameKana
  };
}

export async function searchStations(query, limit = 8) {
  const matches = await fetchStationMatches(query);
  const target = normalizeStationQuery(query);
  const stations = [];
  const seen = new Set();

  for (const match of matches) {
    const station = sanitizeStation(match);
    if (!station) continue;

    const key = `${station.name}:${station.code ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    stations.push(station);
  }

  stations.sort((a, b) => {
    const aName = normalizeStationQuery(a.name);
    const bName = normalizeStationQuery(b.name);
    const score = (name, kana) => {
      if (name === target) return 0;
      if (name.startsWith(target)) return 1;
      if (kana.startsWith(target)) return 2;
      return 3;
    };
    return score(aName, a.nameKana) - score(bName, b.nameKana) || aName.localeCompare(bName, "ja");
  });

  return stations.slice(0, limit);
}

export async function isKnownStationName(value) {
  const target = normalizeStationQuery(value);
  if (!target || target.length > 40) return false;

  const matches = await fetchStationMatches(target);
  return matches.some((match) => {
    const station = sanitizeStation(match);
    if (!station) return false;
    return normalizeStationQuery(station.name) === target || normalizeStationQuery(station.originalName) === target;
  });
}
