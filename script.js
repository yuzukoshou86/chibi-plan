const homeScreen = document.getElementById("homeScreen");
const conditionScreen = document.getElementById("conditionScreen");
const proposalScreen = document.getElementById("proposalScreen");

const startBtn = document.getElementById("startBtn");
const makePlanBtn = document.getElementById("makePlanBtn");
const backBtn = document.getElementById("backBtn");

const peopleRange = document.getElementById("peopleRange");
const peopleText = document.getElementById("peopleText");

const budgetRange = document.getElementById("budgetRange");
const budgetText = document.getElementById("budgetText");

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
const promptResult = document.getElementById("promptResult");

const senseRandom = document.getElementById("senseRandom");

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

/* ホイールの中身を作る */
function createWheelItems(container, values) {
  container.innerHTML = "";

  values.forEach((value) => {
    const item = document.createElement("div");
    item.className = "wheel-item";
    item.textContent = value;
    item.dataset.value = value;
    container.appendChild(item);
  });
}

/* ホイール中央にある項目を取得 */
function getCenterItem(container) {
  const items = Array.from(container.querySelectorAll(".wheel-item"));
  const containerCenter = container.getBoundingClientRect().top + container.clientHeight / 2;

  let closestItem = items[0];
  let closestDistance = Infinity;

  items.forEach((item) => {
    const itemCenter = item.getBoundingClientRect().top + item.clientHeight / 2;
    const distance = Math.abs(containerCenter - itemCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestItem = item;
    }
  });

  return closestItem;
}

/* 選択中の見た目を更新 */
function updateWheelSelected(container) {
  const items = container.querySelectorAll(".wheel-item");
  const selectedItem = getCenterItem(container);

  items.forEach((item) => item.classList.remove("selected"));
  selectedItem.classList.add("selected");

  updateHiddenTimes();
  validateForm();
}

/* hidden input に時間を入れる */
function updateHiddenTimes() {
  const startHour = getCenterItem(startHourWheel).dataset.value;
  const startMinute = getCenterItem(startMinuteWheel).dataset.value;
  const endHour = getCenterItem(endHourWheel).dataset.value;
  const endMinute = getCenterItem(endMinuteWheel).dataset.value;

  startTimeSelect.value = `${startHour}:${startMinute}`;
  endTimeSelect.value = `${endHour}:${endMinute}`;
}

/* 指定した時間へスクロール */
function scrollToValue(container, value) {
  const item = container.querySelector(`[data-value="${value}"]`);
  if (!item) return;

  container.scrollTop = item.offsetTop - container.clientHeight / 2 + item.clientHeight / 2;
  updateWheelSelected(container);
}

/* 時間ホイール作成 */
function createTimeOptions() {
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = ["00", "15", "30", "45"];

  createWheelItems(startHourWheel, hours);
  createWheelItems(startMinuteWheel, minutes);
  createWheelItems(endHourWheel, hours);
  createWheelItems(endMinuteWheel, minutes);

  [startHourWheel, startMinuteWheel, endHourWheel, endMinuteWheel].forEach((wheel) => {
    wheel.addEventListener("scroll", () => {
      clearTimeout(wheel.scrollTimer);
      wheel.scrollTimer = setTimeout(() => {
        updateWheelSelected(wheel);
      }, 80);
    });
  });

  setTimeout(() => {
    scrollToValue(startHourWheel, "09");
    scrollToValue(startMinuteWheel, "00");
    scrollToValue(endHourWheel, "17");
    scrollToValue(endMinuteWheel, "00");
    updateHiddenTimes();
    validateForm();
  }, 0);
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
    people: peopleText.textContent,
    budget: budgetText.textContent,
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
    conditions: condition,
    prompt: createPromptText(condition)
  };
}

/* 入力チェック */
function validateForm() {
  const selectedStartType = document.querySelector(".start-type.selected");
  const startTypeValue = selectedStartType ? selectedStartType.dataset.startType : "";

  const isValid =
    getCheckedValues("dayMood").length > 0 &&
    getCheckedValues("senseMood").length > 0 &&
    startPlaceInput.value.trim() !== "" &&
    peopleText.textContent !== "" &&
    budgetText.textContent !== "" &&
    getSelectedButtonText(".trip-type.selected") !== "" &&
    endTimeSelect.value !== "" &&
    (startTypeValue === "now" || startTimeSelect.value !== "");

  makePlanBtn.disabled = !isValid;
  formMessage.textContent = isValid
    ? "入力できました。スケジュール作成できます。"
    : "すべての項目を入力してください。";
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

/* ホーム → 条件設定 */
startBtn.addEventListener("click", () => {
  showScreen(conditionScreen);
  validateForm();
});

/* スケジュール作成 */
makePlanBtn.addEventListener("click", async () => {
  const condition = getUserCondition();
  const promptJson = createPromptJson(condition);

  promptResult.innerHTML = `
    <div class="loading-state" role="status">
      <span class="loading-leaf">🌱</span>
      <div>
        <h3>ぴったりの一日を考えています</h3>
        <p>スポットや移動時間を調べています。少しお待ちください。</p>
      </div>
    </div>
  `;

  makePlanBtn.disabled = true;
  makePlanBtn.textContent = "作成中…";

  try {
    const plan = await sendToAI(promptJson);

    promptResult.innerHTML = `
      <h3>🌿 ちびプランからの提案</h3>
      <pre class="ai-plan"></pre>
    `;
    promptResult.querySelector(".ai-plan").textContent = plan;
  } catch (error) {
    promptResult.innerHTML = `
      <div class="error-state" role="alert">
        <h3>プランを作成できませんでした</h3>
        <p></p>
      </div>
    `;
    promptResult.querySelector(".error-state p").textContent = error.message;
  } finally {
    makePlanBtn.textContent = "スケジュール作成";
    validateForm();
  }
});

/* 戻る */
backBtn.addEventListener("click", () => {
  showScreen(conditionScreen);
});

/* 人数 */
peopleRange.addEventListener("input", () => {
  peopleText.textContent = `${peopleRange.value}人`;
  validateForm();
});

/* 予算 */
budgetRange.addEventListener("input", () => {
  const budget = Number(budgetRange.value).toLocaleString();
  budgetText.textContent = `${budget}円`;
  validateForm();
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

/* 一日のテーマ */
document.querySelectorAll('input[name="dayMood"]').forEach((checkbox) => {
  checkbox.addEventListener("change", validateForm);
});

startPlaceInput.addEventListener("input", validateForm);

/* 初期処理 */
createTimeOptions();
validateForm();
