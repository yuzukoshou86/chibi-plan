const homeScreen = document.getElementById("homeScreen");
const conditionScreen = document.getElementById("conditionScreen");
const proposalScreen = document.getElementById("proposalScreen");

const startBtn = document.getElementById("startBtn");
const makePlanBtn = document.getElementById("makePlanBtn");
const backBtn = document.getElementById("backBtn");

const peopleSelect = document.getElementById("peopleSelect");
const budgetSelect = document.getElementById("budgetSelect");

const tripButtons = document.querySelectorAll(".trip-type");
const stayOptions = document.getElementById("stayOptions");
const hotelButtons = document.querySelectorAll(".hotel-btn");

const startTypeButtons = document.querySelectorAll(".start-type");
const startTimeBox = document.getElementById("startTimeBox");
const startHourSelect = document.getElementById("startHour");
const startMinuteSelect = document.getElementById("startMinute");
const endHourSelect = document.getElementById("endHour");
const endMinuteSelect = document.getElementById("endMinute");

const startPlaceInput = document.getElementById("startPlace");
const stationSuggestions = document.getElementById("stationSuggestions");
const stationStatus = document.getElementById("stationStatus");
const formMessage = document.getElementById("formMessage");
const proposalTitle = document.getElementById("proposalTitle");
const proposalLead = document.getElementById("proposalLead");
const proposalContent = document.getElementById("proposalContent");

const senseRandom = document.getElementById("senseRandom");
const dayRandom = document.getElementById("dayRandom");

let stationValidationState = "idle";
let validatedStation = "";
let stationValidationTimer;
let stationSuggestionRequestId = 0;

/* 固定プロンプト */
const FIXED_PROMPT = `
【あなたの役割】

あなたは普段からGoogleマップで旅をするのが大好きな「ちびプラン」の旅行プランナーです。
ちびプランは単に観光地を紹介するサービスではありません。

ユーザーが
「今日は充実した一日だった」
「自分では思いつかなかった場所へ行けた」
「また出かけたい」
と思える一日を設計するサービスです。

目的は効率よく観光することではなく、
ユーザーの条件に合った「満足度の高い一日」を設計することです。

【優先順位】

必ず以下の順番で判断してください。
・ユーザーの条件を満たすこと
・営業時間・定休日・予算・移動時間など現実的であること
・一日を通して満足度が高いこと
・自分では思いつかなかった場所や体験があること
・地域らしさを感じられること
・スケジュール全体のバランスが良いこと

【ユーザーについて】

ちびプランを利用するユーザーは、
・外出したい気持ちはあるが行き先が決められない
・遊び場所がマンネリ化している
・調べ物が苦手
・スケジュールを考えるのが苦手
・新しい経験をしたい
・一日の終わりに「充実した」と思いたい
という人です。

旅行好きの人ではなく、計画を立てることが苦手な人を想定してください。

【スポット選定手順】

必ず以下の流れで考えてください。
① ユーザー条件に合うジャンルを複数選ぶ
② 各ジャンルから条件に合う候補施設を複数探す
③ 候補同士を比較する
④ 最も満足度が高い組み合わせを選ぶ
⑤ スケジュールを作成する

【検討するジャンル】

施設を探す際は偏らないよう、以下のジャンルから条件に合うものを検討してください。

・博物館
・美術館
・科学館
・資料館
・水族館
・動物園
・植物園
・展望施設
・工場見学
・社会見学施設
・アート施設
・体験施設
・ワークショップ
・工房
・商店街
・市場
・温泉
・サウナ
・神社
・寺院
・日本庭園
・公園
・カフェ
・レストラン
・ご当地グルメ
・道の駅
・観光列車
・フェリー
・ロープウェイ
・ケーブルカー
・季節イベント
・地域イベント

※必要に応じてこの一覧以外も検討してください。

【比較項目】

候補施設は以下を比較してください。
・条件との一致度
・営業状況
・予算
・移動時間
・他施設との組み合わせやすさ
・地域らしさ
・新しい発見があるか
・一日全体の満足度

【エリア選定】

同じエリアだけで探さないでください。
移動時間・予算内で行ける複数エリアを比較してください。
近い場所を優先するのではなく、条件内で最も満足度が高くなるエリアを選択してください。

【食事】

昼食・夕食はしっかり食事を楽しめる店舗を優先してください。
カフェ・甘味処は休憩時間や食後に提案してください。
味覚を楽しみたい場合は、その地域らしい食文化や名物料理も積極的に検討してください。

【宿泊】

宿泊先提案あり
→具体的な宿泊施設を提案

宿泊先提案なし
→宿泊施設名は出さない

ただし、宿泊すると便利なエリアは提案してください。
宿泊施設は旅行全体の満足度を高める視点で選んでください。

【予算】

予算は1人当たりの金額です。
グループ全体の予算として解釈しないでください。
概算費用も1人当たりで表示してください。

【スケジュール】

開始時間から終了時間まで、現実的に移動可能なスケジュールを作成してください。
時間が余る場合は休憩や寄り道ではなく、条件に合うスポットを追加してください。

【店舗・施設名】

抽象的な提案は禁止です。
必ず店舗名・施設名を記載してください。
「カフェ巡り」「商店街散策」だけではなく、具体的な施設名を書いてください。

【穴場】

有名観光地だけで構成しないでください。
プラン内には必ず1か所以上、以下のいずれかを含めてください。
・地元で親しまれている施設
・専門性の高い施設
・あまり知られていないが評価が高い施設
・珍しい体験ができる施設

【体験設計】

各スポットでは「そこで何を体験するか」まで提案してください。

単に施設へ行くだけではなく、ユーザーがその場所で実際に楽しめる行動（以下「ちびタスク」）を必ず1つ以上提案してください。

ちびタスクは、以下の条件を満たすものを優先してください。
・その場所ならでは
・5〜30分程度で楽しめる
・初心者でも気軽にできる
・特別な準備が不要

【最終チェック】

完成したプランについて、以下を確認してください。
・条件を満たしているか
・営業時間に間に合うか
・予算内か
・移動は現実的か
・一日を通して満足できるか
・「今日は来て良かった」と思えるか
・「自分では思いつかなかった」と感じられる場所が含まれているか

満たさない場合はプランを改善してください。
`;

/* 画面切り替え */
function showScreen(screen) {
  homeScreen.classList.remove("active");
  conditionScreen.classList.remove("active");
  proposalScreen.classList.remove("active");
  screen.classList.add("active");
}

/* 今から出発の場合の現在時刻 15分丸め */
function getCurrentRoundedTime() {
  const now = new Date();
  const minutes = now.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 15) * 15;

  if (roundedMinutes === 60) {
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
  } else {
    now.setMinutes(roundedMinutes);
  }

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/* チェックされた値を取得 */
function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
    .map((input) => input.value);
}

function getSelectedButtonText(selector) {
  const selected = document.querySelector(selector);
  return selected ? selected.textContent.trim() : "";
}

function getSelectedTime(hourSelect, minuteSelect) {
  return `${hourSelect.value}:${minuteSelect.value}`;
}

/* 条件取得 */
function getUserCondition() {
  const selectedTripType = document.querySelector(".trip-type.selected");
  const selectedHotel = document.querySelector(".hotel-btn.selected");
  const selectedStartType = document.querySelector(".start-type.selected");

  const tripType = selectedTripType ? selectedTripType.textContent.trim() : "";
  const startType = selectedStartType ? selectedStartType.textContent.trim() : "";
  const startTypeValue = selectedStartType ? selectedStartType.dataset.startType : "";

  const condition = {
    dayTheme: getCheckedValues("dayMood"),
    senses: getCheckedValues("senseMood"),
    departure: startPlaceInput.value.trim(),
    people: `${peopleSelect.value}人`,
    budget: `${Number(budgetSelect.value).toLocaleString()}円`,
    tripType: tripType,
    startType: startType,
    startTime: startTypeValue === "now"
      ? getCurrentRoundedTime()
      : getSelectedTime(startHourSelect, startMinuteSelect),
    endTime: getSelectedTime(endHourSelect, endMinuteSelect)
  };

  if (tripType === "お泊まり") {
    condition.stayNights = document.getElementById("stayNights").value;
    condition.hotelSuggestion = selectedHotel ? selectedHotel.textContent.trim() : "";
  } else {
    condition.stayNights = "";
    condition.hotelSuggestion = "対象外";
  }

  return condition;
}

/* プロンプト本文作成 */
function createPromptText(condition) {
  return `
【ユーザーの条件】
出発地：${condition.departure}
人数：${condition.people}
予定：${condition.tripType}
予算：${condition.budget}
出発タイプ：${condition.startType}
出発時間：${condition.startTime}
終了時間：${condition.endTime}
宿泊日数：${condition.stayNights || "対象外"}
宿泊先の提案：${condition.hotelSuggestion}

【今日はどんな一日にしたい？】
${condition.dayTheme.map((item) => `・${item}`).join("\n")}

【どんな感覚を楽しみたい？】
${
  condition.senses.includes("おまかせ")
    ? "・おまかせ（五感の指定なし）"
    : condition.senses.map((item) => `・${item}`).join("\n")
}

${FIXED_PROMPT}
`.trim();
}

/* JSON作成 */
function createPromptJson(condition) {
  return {
    serviceName: "ちびプラン",
    conditions: condition,
    prompt: createPromptText(condition)
  };
}

/* 入力チェック */
function validateForm() {
  const selectedStartType = document.querySelector(".start-type.selected");
  const startTypeValue = selectedStartType ? selectedStartType.dataset.startType : "";

  const stationIsValid =
    stationValidationState === "valid" &&
    startPlaceInput.value.trim() === validatedStation;

  const isValid =
    getCheckedValues("dayMood").length > 0 &&
    getCheckedValues("senseMood").length > 0 &&
    stationIsValid &&
    peopleSelect.value !== "" &&
    budgetSelect.value !== "" &&
    getSelectedButtonText(".trip-type.selected") !== "" &&
    endHourSelect.value !== "" &&
    endMinuteSelect.value !== "" &&
    (startTypeValue === "now" || (startHourSelect.value !== "" && startMinuteSelect.value !== ""));

  makePlanBtn.disabled = !isValid;
  if (stationValidationState === "checking") {
    formMessage.textContent = "出発駅を確認しています。";
  } else {
    formMessage.textContent = isValid
      ? "入力できました。スケジュール作成できます。"
      : "すべての項目を入力してください。";
  }
}

function setStationStatus(message, state = "") {
  stationStatus.textContent = message;
  stationStatus.className = `field-status${state ? ` ${state}` : ""}`;
}

function hideStationSuggestions() {
  stationSuggestions.hidden = true;
  stationSuggestions.innerHTML = "";
}

function selectStation(station) {
  startPlaceInput.value = station.name;
  stationValidationState = "valid";
  validatedStation = station.name;
  setStationStatus(`${station.prefecture}の駅を選択しました。`, "success");
  hideStationSuggestions();
  validateForm();
}

function renderStationSuggestions(suggestions) {
  stationSuggestions.innerHTML = "";

  if (!suggestions.length) {
    stationSuggestions.hidden = true;
    setStationStatus("候補が見つかりませんでした。駅名を最後まで入力してください。", "error");
    return;
  }

  suggestions.forEach((station) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "station-suggestion";
    button.setAttribute("role", "option");
    button.innerHTML = `<strong></strong><span></span>`;
    button.querySelector("strong").textContent = station.name;
    button.querySelector("span").textContent = `${station.prefecture}・${station.kana}`;
    button.addEventListener("mousedown", (event) => event.preventDefault());
    button.addEventListener("click", () => selectStation(station));
    stationSuggestions.appendChild(button);
  });

  stationSuggestions.hidden = false;
  setStationStatus("候補から出発駅を選んでください。", "checking");
}

async function searchStationSuggestions(query) {
  const requestId = ++stationSuggestionRequestId;
  setStationStatus("駅の候補を検索しています…", "checking");

  try {
    const response = await fetch(`/api/station-suggestions?q=${encodeURIComponent(query)}`);
    const result = await response.json();
    if (requestId !== stationSuggestionRequestId) return;
    if (!response.ok) throw new Error(result.error || "駅の候補を検索できませんでした。");

    const suggestions = result.suggestions || [];
    const exact = suggestions.find((station) => station.name === startPlaceInput.value.trim());
    if (exact) {
      selectStation(exact);
      return;
    }
    renderStationSuggestions(suggestions);
  } catch (error) {
    if (requestId !== stationSuggestionRequestId) return;
    hideStationSuggestions();
    setStationStatus(error.message, "error");
  }
}

async function validateStation() {
  const station = startPlaceInput.value.trim();

  if (!station.endsWith("駅")) {
    stationValidationState = "invalid";
    validatedStation = "";
    setStationStatus("「大阪駅」のように、正式な駅名を「駅」まで入力してください。", "error");
    validateForm();
    return;
  }

  stationValidationState = "checking";
  setStationStatus("実在する駅名か確認しています…", "checking");
  validateForm();

  try {
    const response = await fetch("/api/validate-station", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ station })
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "駅名を確認できませんでした。");
    }

    if (startPlaceInput.value.trim() !== station) return;

    if (result.valid) {
      stationValidationState = "valid";
      validatedStation = station;
      setStationStatus("実在する駅名を確認できました。", "success");
    } else {
      stationValidationState = "invalid";
      validatedStation = "";
      setStationStatus("駅名を確認できませんでした。正式な駅名を入力してください。", "error");
    }
  } catch (error) {
    if (startPlaceInput.value.trim() !== station) return;
    stationValidationState = "error";
    validatedStation = "";
    setStationStatus(`${error.message} もう一度入力してください。`, "error");
  }

  validateForm();
}

/* Vercel API経由でAIへ送信 */
async function sendToAI(promptJson) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: promptJson.prompt
    })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "スケジュールを作成できませんでした。");
  }

  return result.plan;
}

function addTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

function addSourceLink(parent, label, url) {
  if (!url || !/^https:\/\//i.test(url)) return;
  const link = document.createElement("a");
  link.className = "source-link";
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = `${label || "公式サイト"}を見る ↗`;
  parent.appendChild(link);
}

function showProposalLoading() {
  proposalTitle.textContent = "ぴったりの一日を考えています";
  proposalLead.textContent = "スポットや移動時間を調べています。少しお待ちください。";
  proposalContent.innerHTML = `
    <div class="result-loading" role="status">
      <span class="loading-leaf">🌱</span>
      <div class="loading-lines"><span></span><span></span><span></span></div>
    </div>
  `;
}

function renderPlan(plan) {
  proposalTitle.textContent = plan.title;
  proposalLead.textContent = plan.summary;
  proposalContent.innerHTML = "";

  const overview = document.createElement("section");
  overview.className = "result-overview";
  addTextElement(overview, "span", "area-label", `📍 ${plan.area}`);
  addTextElement(overview, "h3", "result-section-title", "このプランにした理由");
  const reasonList = document.createElement("ul");
  reasonList.className = "reason-list";
  plan.reasonPoints.forEach((reason) => addTextElement(reasonList, "li", "", reason));
  overview.appendChild(reasonList);
  proposalContent.appendChild(overview);

  const scheduleSection = document.createElement("section");
  scheduleSection.className = "schedule-section";
  addTextElement(scheduleSection, "h3", "result-section-title", "一日のスケジュール");

  const timeline = document.createElement("div");
  timeline.className = "plan-timeline";

  plan.schedule.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "schedule-item";
    card.style.setProperty("--item-index", index);

    const marker = document.createElement("div");
    marker.className = "timeline-marker";
    marker.textContent = String(index + 1);
    card.appendChild(marker);

    const body = document.createElement("div");
    body.className = "schedule-card-body";
    addTextElement(body, "p", "schedule-time", item.time);
    addTextElement(body, "h4", "schedule-place", item.place);
    if (item.travel) addTextElement(body, "p", "schedule-travel", `🚶 ${item.travel}`);
    addTextElement(body, "p", "schedule-experience", item.experience);
    addSourceLink(body, item.sourceLabel, item.sourceUrl);

    const task = document.createElement("div");
    task.className = "chibi-task";
    addTextElement(task, "span", "task-label", "🌱 ちびタスク");
    addTextElement(task, "p", "", item.task);
    body.appendChild(task);

    addTextElement(body, "p", "schedule-cost", `1人当たり ${item.cost}`);
    card.appendChild(body);
    timeline.appendChild(card);
  });

  scheduleSection.appendChild(timeline);
  proposalContent.appendChild(scheduleSection);

  const footerGrid = document.createElement("div");
  footerGrid.className = "result-footer-grid";

  const costCard = document.createElement("section");
  costCard.className = "total-cost-card";
  addTextElement(costCard, "p", "result-card-label", "1人当たりの概算合計");
  addTextElement(costCard, "p", "total-cost", plan.totalCost.amount);
  const breakdown = document.createElement("dl");
  breakdown.className = "cost-breakdown";
  plan.totalCost.breakdown.forEach((item) => {
    addTextElement(breakdown, "dt", "", item.label);
    addTextElement(breakdown, "dd", "", item.amount);
  });
  costCard.appendChild(breakdown);
  footerGrid.appendChild(costCard);

  const cautionCard = document.createElement("section");
  cautionCard.className = "caution-card";
  addTextElement(cautionCard, "h3", "result-section-title", "当日の確認ポイント");
  const cautionList = document.createElement("div");
  cautionList.className = "caution-list";
  plan.cautions.forEach((caution) => {
    const item = document.createElement("article");
    item.className = "caution-item";
    addTextElement(item, "h4", "", caution.title);
    addTextElement(item, "p", "", caution.detail);
    addSourceLink(item, caution.sourceLabel, caution.sourceUrl);
    cautionList.appendChild(item);
  });
  cautionCard.appendChild(cautionList);
  footerGrid.appendChild(cautionCard);
  proposalContent.appendChild(footerGrid);
}

function showProposalError(message) {
  proposalTitle.textContent = "プランを作成できませんでした";
  proposalLead.textContent = "入力内容は残っています。戻ってもう一度お試しください。";
  proposalContent.innerHTML = "";
  const errorCard = document.createElement("div");
  errorCard.className = "error-state result-error";
  addTextElement(errorCard, "h3", "", "通信中に問題が発生しました");
  addTextElement(errorCard, "p", "", message);
  proposalContent.appendChild(errorCard);
}

/* ホーム → 条件設定 */
startBtn.addEventListener("click", () => {
  showScreen(conditionScreen);
  validateForm();
});

/* スケジュール作成 */
makePlanBtn.addEventListener("click", async () => {
  const condition = getUserCondition();
  const promptJson = createPromptJson(condition);

  showProposalLoading();
  showScreen(proposalScreen);
  window.scrollTo({ top: 0, behavior: "smooth" });

  makePlanBtn.disabled = true;
  makePlanBtn.textContent = "作成中…";

  try {
    const plan = await sendToAI(promptJson);
    renderPlan(plan);
  } catch (error) {
    showProposalError(error.message);
  } finally {
    makePlanBtn.textContent = "スケジュール作成";
    validateForm();
  }
});

/* 戻る */
backBtn.addEventListener("click", () => {
  showScreen(conditionScreen);
});

peopleSelect.addEventListener("change", validateForm);
budgetSelect.addEventListener("change", validateForm);

/* 日帰り・お泊まり */
tripButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tripButtons.forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");

    if (button.dataset.type === "stay") {
      stayOptions.classList.add("active");
    } else {
      stayOptions.classList.remove("active");
    }

    validateForm();
  });
});

/* 宿泊先提案 */
hotelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    hotelButtons.forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");
    validateForm();
  });
});

/* 今から出発・時間指定 */
startTypeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    startTypeButtons.forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");

    if (button.dataset.startType === "select") {
      startTimeBox.classList.remove("hidden");
    } else {
      startTimeBox.classList.add("hidden");
    }

    validateForm();
  });
});

/* おまかせ選択時は他の五感を解除 */
document.querySelectorAll('input[name="senseMood"]').forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const senseCheckboxes = Array.from(document.querySelectorAll('input[name="senseMood"]'));

    if (checkbox.value === "おまかせ" && checkbox.checked) {
      senseCheckboxes.forEach((item) => {
        if (item.value !== "おまかせ") item.checked = false;
      });
    }

    if (checkbox.value !== "おまかせ" && checkbox.checked) {
      senseRandom.checked = false;
    }

    validateForm();
  });
});

/* 一日のテーマのおまかせ選択時は他を解除 */
document.querySelectorAll('input[name="dayMood"]').forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const dayCheckboxes = Array.from(document.querySelectorAll('input[name="dayMood"]'));

    if (checkbox.value === "おまかせ" && checkbox.checked) {
      dayCheckboxes.forEach((item) => {
        if (item.value !== "おまかせ") item.checked = false;
      });
    }

    if (checkbox.value !== "おまかせ" && checkbox.checked) {
      dayRandom.checked = false;
    }

    validateForm();
  });
});

startPlaceInput.addEventListener("input", () => {
  clearTimeout(stationValidationTimer);
  stationSuggestionRequestId += 1;
  stationValidationState = "idle";
  validatedStation = "";
  hideStationSuggestions();

  const station = startPlaceInput.value.trim();
  if (!station) {
    setStationStatus("駅名を入力すると候補が表示されます。");
  } else if (station.replace(/駅$/, "").length < 2) {
    setStationStatus("駅名を2文字以上入力してください。", "checking");
  } else {
    setStationStatus("入力が終わると候補を検索します。", "checking");
    stationValidationTimer = setTimeout(() => searchStationSuggestions(station), 550);
  }

  validateForm();
});

startPlaceInput.addEventListener("blur", () => {
  clearTimeout(stationValidationTimer);
  setTimeout(() => {
    hideStationSuggestions();
    if (startPlaceInput.value.trim().endsWith("駅") && startPlaceInput.value.trim() !== validatedStation) {
      validateStation();
    }
  }, 180);
});

[startHourSelect, startMinuteSelect, endHourSelect, endMinuteSelect]
  .forEach((select) => select.addEventListener("change", validateForm));

for (let hour = 0; hour < 24; hour += 1) {
  [startHourSelect, endHourSelect].forEach((select) => {
    const option = document.createElement("option");
    option.value = String(hour).padStart(2, "0");
    option.textContent = String(hour).padStart(2, "0");
    select.appendChild(option);
  });
}

["00", "15", "30", "45"].forEach((minute) => {
  [startMinuteSelect, endMinuteSelect].forEach((select) => {
    const option = document.createElement("option");
    option.value = minute;
    option.textContent = minute;
    select.appendChild(option);
  });
});

startHourSelect.value = "09";
startMinuteSelect.value = "00";
endHourSelect.value = "17";
endMinuteSelect.value = "00";

for (let budget = 1000; budget <= 50000; budget += 1000) {
  const option = document.createElement("option");
  option.value = String(budget);
  option.textContent = `${budget.toLocaleString()}円`;
  option.selected = budget === 10000;
  budgetSelect.appendChild(option);
}

/* 初期処理 */
validateForm();
