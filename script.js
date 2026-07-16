const homeScreen = document.getElementById("homeScreen");
const conditionScreen = document.getElementById("conditionScreen");
const proposalScreen = document.getElementById("proposalScreen");

const startBtn = document.getElementById("startBtn");
const makePlanBtn = document.getElementById("makePlanBtn");
const backBtn = document.getElementById("backBtn");

const peopleRange = document.getElementById("peopleRange");
const budgetRange = document.getElementById("budgetRange");

const tripButtons = document.querySelectorAll(".trip-type");
const stayOptions = document.getElementById("stayOptions");
const hotelButtons = document.querySelectorAll(".hotel-btn");

const startTypeButtons = document.querySelectorAll(".start-type");
const startTimeBox = document.getElementById("startTimeBox");
const startTimeSelect = document.getElementById("startTime");
const endTimeSelect = document.getElementById("endTime");

const startHourWheel = document.getElementById("startHourWheel");
const startMinuteWheel = document.getElementById("startMinuteWheel");
const endHourWheel = document.getElementById("endHourWheel");
const endMinuteWheel = document.getElementById("endMinuteWheel");

const startPlaceInput = document.getElementById("startPlace");
const formMessage = document.getElementById("formMessage");
const stationSuggestions = document.getElementById("stationSuggestions");
const stationStatus = document.getElementById("stationStatus");
const proposalLead = document.getElementById("proposalLead");
const proposalArea = document.querySelector(".proposal-area");

const dayRandom = document.getElementById("dayRandom");
const senseRandom = document.getElementById("senseRandom");
let isSubmitting = false;
let isStationValid = false;
let isStationSearchPending = false;
let stationSearchTimer = null;
let stationSearchController = null;

/* 固定プロンプト */
const FIXED_PROMPT = `
あなたは「ちびプラン」のおでかけプランナーです。

ユーザーの条件をもとに、現実的でワクワクする一日のおでかけプランを作成してください。

【サービス方針】

・新しい発見、新しい体験につながる提案をしてください。
・行き先だけでなく、その場所で何を楽しめるのかも提案してください。
・外に出たいけれど何をしたらいいかわからない人が、「今日はこれをしてみよう」と思える一日を設計してください。
・近くで済ませることを目的とせず、条件の範囲内で少しでもワクワクする体験を優先してください。
・「また出かけたい」と思える満足度の高い一日を目指してください。
・「どこへ行くか」ではなく、「どんな一日を過ごせるか」を大切にしてください。

【優先順位】

1. ユーザーが選択した条件（出発地・人数・予算・時間・宿泊条件・今日の気分・楽しみたい感覚など）は必ず守ってください。
2. 営業時間・定休日・移動時間・交通費を考慮し、現実的に実行できるプランにしてください。
3. 「また出かけたい」と思える満足度の高い一日を優先してください。
4. 新しい発見やワクワクにつながる体験を優先してください。
5. 行き先は出発地周辺だけで探さず、予算・移動時間・滞在時間を考慮したうえで、実現可能な範囲を幅広く検討してください。
6. 条件を満たす候補が複数ある場合は、複数のエリアを比較し、その中から最も満足度が高いプランを選択してください。
7. 時間と予算に余裕がある場合は、一つのエリアだけで完結させる必要はありません。電車や車で別エリアへ移動し、街並みや景色、雰囲気の違いも楽しめる一日にしてください。
8. 条件を満たす候補が複数ある場合は、出発地から最も近い場所ではなく、「自分では思いつかなかった」「行ってみたい」と感じられる場所を優先してください。
9. 定番スポットだけに偏らず、穴場・隠れ家・珍しい体験も積極的に検討してください。
10. 同じ条件でも毎回できるだけ異なる場所や体験になるよう工夫してください。

【予算】

・ユーザーが入力した予算は、1人当たりの予算です。
・人数分で割ったり、グループ全体の予算として解釈しないでください。
・宿泊・交通費・食事・体験費用などを考慮し、1人当たりの予算内で収まるようにしてください。
・概算費用は、1人当たりの目安金額として表示してください。

【行き先の選定】

・行き先を決定する前に、条件を満たす複数のエリアを比較してください。
・探索範囲は出発地周辺に限定せず、条件内で訪問できる範囲全体から候補を探してください。
・近いからという理由だけで選ばず、一日の満足度が高くなる場所を選択してください。
・時間に余裕がある場合は、ユーザーが普段あまり訪れない街やエリアも積極的に候補へ含めてください。
・移動そのものが景色や雰囲気の変化を楽しめる場合は、その価値も考慮してください。

【スポットの提案方法】

・できるだけ具体的な施設名・店舗名・スポット名を提案してください。
・施設名だけでなく、その場所で何を楽しめるのかも説明してください。
・営業時間や営業状況が確認できない施設はメインプランへ入れないでください。

【食事の提案】

・昼食・夕食の時間帯は、カフェや甘味処ではなく、食事を楽しめる店舗を優先してください。
・地域ならではの名物や人気の食事、地元で評判の料理がある場合は積極的に取り入れてください。
・カフェや甘味処は、休憩時間や食後の時間帯に提案してください。
・「味覚を楽しみたい」が選択されている場合は、その地域ならではの食文化や名物料理も積極的に検討してください。

【スケジュール構成】

・景色・食事・体験・休憩のバランスを意識してください。
・同じ種類の施設ばかり続かないようにしてください。
・朝・昼・夕方・夜で雰囲気が変わるよう工夫してください。
・無理な移動は避けつつ、移動によって新しい景色や街の雰囲気を楽しめる場合は積極的に取り入れてください。
・休憩時間を適度に設けてください。

【ちびプランらしさ】

・ユーザーが「こんな場所知らなかった」「こんな楽しみ方があるんだ」と感じられる提案を含めてください。
・検索すれば誰でも出てくる定番コースではなく、条件に合う複数の候補を比較したうえで、ちびプランならではの一日を提案してください。
・ただ目的地を並べるのではなく、一日を通して冒険や発見を感じられる流れを意識してください。
・効率よく回ることよりも、「今日は本当に楽しかった」と思える体験を優先してください。

【外出先タスク】

・各スポットごとに、その場所だからこそ楽しめる小さなタスクを1つ提案してください。
・タスクは難しすぎず、一人でも気軽に実行できる内容にしてください。
・「やらなければいけないこと」ではなく、「楽しみ方のヒント」として提案してください。
・例：「今日いちばん好きな景色を1枚撮る」「地元のお店で気になる商品を1つ見つける」「5分だけ目を閉じて街の音を聞いてみる」

【文章ルール】

・です・ます調で書いてください。
・親しみやすく、読みやすい文章にしてください。
・語尾を統一してください。
・一人称は使わないでください。
・情報量は十分に保ちながら、不要な説明は省き、見やすく整理してください。

【宿泊ルール】

・ユーザーが「宿泊先の提案あり」を選択した場合のみ、具体的な宿泊施設を提案してください。
・ユーザーが「宿泊先の提案なし」を選択した場合は、具体的な宿泊施設名は提案しないでください。
・宿泊先を提案しない場合でも、観光や移動に便利な宿泊エリア（例：三宮駅周辺、京都駅周辺など）は提案してください。
・宿泊施設を提案しない場合でも、宿泊すると便利なエリアがある場合は、そのエリア名と理由を案内してください。

【宿泊エリアの選定】

・宿泊する場合は、翌日の観光やアクセスも考慮してください。
・観光地から遠すぎる宿泊施設は避けてください。
・移動時間が短くなるエリアを優先してください。

【宿泊施設】

・予算に合った宿泊施設を提案してください。
・宿泊施設を選んだ理由も簡潔に説明してください。
・高級ホテルを提案するのではなく、ユーザーの目的に合った宿泊施設を優先してください。
・宿泊自体が旅行の楽しみとなる場合は、宿泊施設で過ごす時間も旅程の一部として考えてください。

【現実性】

・宿泊費を含めて予算内に収まらない場合は、無理に宿泊施設を提案しないでください。
・宿泊が難しい場合は、
「現在の条件では宿泊を含めることは難しいため、日帰りプランまたは予算の見直しをご検討ください。」
のように理由を説明し、代替案を提案してください。
・宿泊施設は「泊まる場所」ではなく、「旅行全体の満足度を高める要素」として選定してください。

【宿泊の優先順位】

・宿泊施設そのものを楽しむ旅行なのか、
・観光を楽しむための宿泊なのか、
ユーザーの条件を踏まえて判断し、宿泊施設の選び方を変えてください。
`;

/* 画面切り替え */
function showScreen(screen) {
  homeScreen.classList.remove("active");
  conditionScreen.classList.remove("active");
  proposalScreen.classList.remove("active");
  screen.classList.add("active");
}

function createSelectOptions(select, values) {
  select.replaceChildren();
  values.forEach((entry) => {
    const option = document.createElement("option");
    option.value = typeof entry === "object" ? entry.value : entry;
    option.textContent = typeof entry === "object" ? entry.label : entry;
    select.appendChild(option);
  });
}

/* hidden input に時間を入れる */
function updateHiddenTimes() {
  startTimeSelect.value = `${startHourWheel.value}:${startMinuteWheel.value}`;
  endTimeSelect.value = `${endHourWheel.value}:${endMinuteWheel.value}`;
  validateForm();
}

function createTimeOptions() {
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = ["00", "15", "30", "45"];

  createSelectOptions(startHourWheel, hours);
  createSelectOptions(startMinuteWheel, minutes);
  createSelectOptions(endHourWheel, hours);
  createSelectOptions(endMinuteWheel, minutes);

  [startHourWheel, startMinuteWheel, endHourWheel, endMinuteWheel].forEach((select) => {
    select.addEventListener("change", updateHiddenTimes);
  });

  startHourWheel.value = "09";
  startMinuteWheel.value = "00";
  endHourWheel.value = "17";
  endMinuteWheel.value = "00";
  updateHiddenTimes();
}

function createChoiceOptions() {
  const people = Array.from({ length: 10 }, (_, index) => ({
    value: String(index + 1),
    label: `${index + 1}人`
  }));
  const budgets = Array.from({ length: 50 }, (_, index) => {
    const value = (index + 1) * 1000;
    return { value: String(value), label: `${value.toLocaleString()}円` };
  });

  createSelectOptions(peopleRange, people);
  createSelectOptions(budgetRange, budgets);
  peopleRange.value = "1";
  budgetRange.value = "10000";
  peopleRange.addEventListener("change", validateForm);
  budgetRange.addEventListener("change", validateForm);
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
    people: `${peopleRange.value}人`,
    budget: `${Number(budgetRange.value).toLocaleString()}円`,
    tripType: tripType,
    startType: startType,
    startTime: startTypeValue === "now" ? getCurrentRoundedTime() : startTimeSelect.value,
    endTime: endTimeSelect.value
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
    conditions: condition
  };
}

function hideStationSuggestions() {
  stationSuggestions.classList.add("hidden");
  stationSuggestions.replaceChildren();
  startPlaceInput.setAttribute("aria-expanded", "false");
}

function selectStation(station) {
  const stationName = station.name.endsWith("駅") ? station.name : `${station.name}駅`;
  startPlaceInput.value = stationName;
  isStationValid = true;
  isStationSearchPending = false;
  stationStatus.textContent = `選択中：${stationName}`;
  stationStatus.classList.add("valid");
  hideStationSuggestions();
  validateForm();
}

function renderStationSuggestions(stations) {
  stationSuggestions.replaceChildren();

  stations.forEach((station) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "station-suggestion";
    button.setAttribute("role", "option");

    const name = createTextElement("span", station.name, "station-suggestion-name");
    const kana = createTextElement("span", station.nameKana, "station-suggestion-kana");
    button.append(name, kana);
    button.addEventListener("click", () => selectStation(station));
    stationSuggestions.appendChild(button);
  });

  const hasSuggestions = stations.length > 0;
  stationSuggestions.classList.toggle("hidden", !hasSuggestions);
  startPlaceInput.setAttribute("aria-expanded", String(hasSuggestions));
}

async function searchStationSuggestions(query) {
  stationSearchController?.abort();
  stationSearchController = new AbortController();
  isStationSearchPending = true;
  stationStatus.textContent = "駅名を検索しています…";
  stationStatus.classList.remove("valid");
  validateForm();

  try {
    const response = await fetch(`/api/stations?q=${encodeURIComponent(query)}`, {
      signal: stationSearchController.signal
    });
    const data = await response.json();

    if (startPlaceInput.value.trim() !== query) return;
    if (!response.ok) throw new Error(data?.error || "駅情報を取得できませんでした。");

    const stations = Array.isArray(data?.stations) ? data.stations : [];
    renderStationSuggestions(stations);
    stationStatus.textContent = stations.length
      ? "候補から出発駅を選択してください。"
      : "該当する駅が見つかりません。正式な駅名を確認してください。";
  } catch (error) {
    if (error.name === "AbortError") return;
    hideStationSuggestions();
    stationStatus.textContent = "駅情報を取得できませんでした。時間をおいて再度お試しください。";
  } finally {
    if (startPlaceInput.value.trim() === query) {
      isStationSearchPending = false;
      validateForm();
    }
  }
}

/* 入力チェック */
function validateForm() {
  const selectedStartType = document.querySelector(".start-type.selected");
  const startTypeValue = selectedStartType ? selectedStartType.dataset.startType : "";

  const isValid =
    getCheckedValues("dayMood").length > 0 &&
    getCheckedValues("senseMood").length > 0 &&
    isStationValid &&
    !isStationSearchPending &&
    peopleRange.value !== "" &&
    budgetRange.value !== "" &&
    getSelectedButtonText(".trip-type.selected") !== "" &&
    endTimeSelect.value !== "" &&
    (startTypeValue === "now" || startTimeSelect.value !== "");

  makePlanBtn.disabled = isSubmitting || !isValid;
  if (isSubmitting) return;

  if (startPlaceInput.value.trim() && !isStationValid) {
    formMessage.textContent = "出発地は検索候補から実在する駅を選択してください。";
  } else {
    formMessage.textContent = isValid
      ? "入力できました。スケジュール作成できます。"
      : "すべての項目を入力してください。";
  }
}

function createTextElement(tagName, text, className = "") {
  const element = document.createElement(tagName);
  element.textContent = text;
  if (className) element.className = className;
  return element;
}

function renderPlan(plan) {
  const card = document.createElement("div");
  card.className = "plan-card generated-plan";
  card.appendChild(createTextElement("p", "AI旅行プラン", "area-label"));
  card.appendChild(createTextElement("h3", plan.title));
  card.appendChild(createTextElement("p", plan.summary, "plan-summary"));

  const totals = document.createElement("div");
  totals.className = "plan-totals";
  totals.appendChild(createTextElement("span", `合計予算（目安）: ${Number(plan.totalBudget).toLocaleString()}円`));
  totals.appendChild(createTextElement("span", `合計時間: ${plan.totalTime}`));
  card.appendChild(totals);

  card.appendChild(createTextElement("h4", "スケジュール"));
  const schedule = document.createElement("div");
  schedule.className = "generated-schedule";

  plan.schedule.forEach((item) => {
    const scheduleItem = document.createElement("article");
    scheduleItem.className = "schedule-item";
    scheduleItem.appendChild(createTextElement("h5", `${item.time}｜${item.spot}`));
    scheduleItem.appendChild(createTextElement("p", item.description));
    scheduleItem.appendChild(
      createTextElement(
        "p",
        `費用（目安）: ${Number(item.estimatedCost).toLocaleString()}円 ／ 移動時間: ${item.travelTime}`,
        "schedule-meta"
      )
    );
    schedule.appendChild(scheduleItem);
  });

  card.appendChild(schedule);
  card.appendChild(createTextElement("h4", "注意事項"));

  const notes = document.createElement("ul");
  plan.notes.forEach((note) => {
    notes.appendChild(createTextElement("li", note));
  });
  card.appendChild(notes);

  proposalLead.textContent = plan.summary;
  proposalArea.replaceChildren(card);
  showScreen(proposalScreen);
}

/* AI APIに送る */
async function sendToAI(condition) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 85_000);

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conditions: condition }),
      signal: controller.signal
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      throw new Error("サーバーから正しい応答を受信できませんでした。");
    }

    if (!response.ok) {
      throw new Error(data?.error || "旅行プランを生成できませんでした。");
    }

    if (!data?.plan || !Array.isArray(data.plan.schedule) || !Array.isArray(data.plan.notes)) {
      throw new Error("旅行プランの形式が正しくありません。");
    }

    return data.plan;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("通信がタイムアウトしました。もう一度お試しください。");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/* ホーム → 条件設定 */
startBtn.addEventListener("click", () => {
  showScreen(conditionScreen);
  validateForm();
});

/* スケジュール作成 */
makePlanBtn.addEventListener("click", async () => {
  if (isSubmitting) return;

  const condition = getUserCondition();
  const originalButtonText = makePlanBtn.textContent;
  let errorMessage = "";

  isSubmitting = true;
  makePlanBtn.textContent = "旅行プランを生成中…";
  formMessage.textContent = "AIが旅行プランを考えています。しばらくお待ちください。";
  validateForm();

  try {
    const plan = await sendToAI(condition);
    renderPlan(plan);
  } catch (error) {
    errorMessage = error.message || "通信に失敗しました。時間をおいて再度お試しください。";
  } finally {
    isSubmitting = false;
    makePlanBtn.textContent = originalButtonText;
    validateForm();
    if (errorMessage) formMessage.textContent = errorMessage;
  }
});

/* 戻る */
backBtn.addEventListener("click", () => {
  showScreen(conditionScreen);
});

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

function setupRandomChoice(name, randomCheckbox) {
  document.querySelectorAll(`input[name="${name}"]`).forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
      const checkboxes = Array.from(document.querySelectorAll(`input[name="${name}"]`));

      if (checkbox.value === "おまかせ" && checkbox.checked) {
        checkboxes.forEach((item) => {
          if (item.value !== "おまかせ") item.checked = false;
        });
      }

      if (checkbox.value !== "おまかせ" && checkbox.checked) {
        randomCheckbox.checked = false;
      }

      validateForm();
    });
  });
}

setupRandomChoice("senseMood", senseRandom);
setupRandomChoice("dayMood", dayRandom);

startPlaceInput.addEventListener("input", () => {
  isStationValid = false;
  isStationSearchPending = false;
  stationStatus.classList.remove("valid");
  hideStationSuggestions();
  clearTimeout(stationSearchTimer);
  stationSearchController?.abort();

  const query = startPlaceInput.value.trim();
  if (!query) {
    stationStatus.textContent = "駅名を入力し、候補から選択してください。";
    validateForm();
    return;
  }

  stationStatus.textContent = "入力を続けると駅の候補を表示します。";
  stationSearchTimer = setTimeout(() => searchStationSuggestions(query), 300);
  validateForm();
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".station-field")) hideStationSuggestions();
});

/* 初期処理 */
createTimeOptions();
createChoiceOptions();
validateForm();
