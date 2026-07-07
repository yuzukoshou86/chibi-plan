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
const dayOptions = document.getElementById("dayOptions");
const stayOptions = document.getElementById("stayOptions");
const hotelButtons = document.querySelectorAll(".hotel-btn");

const promptResult = document.getElementById("promptResult");

/* 固定プロンプト */
const FIXED_PROMPT = `
あなたは「ちびプラン」のおでかけプランナーです。

ユーザーの条件をもとに、現実的で楽しいおでかけスケジュールを作成してください。

【サービス方針】
・新しい発見、新しい体験につながる提案をしてください
・行き先だけでなく、その場所で何を楽しむかも提案してください
・外に出たいけど何をしたらいいかわからない人に向けて、楽しみ方を具体的に提案してください

【作成ルール】
・予算内に収めてください
・移動時間を考慮してください
・無理のないスケジュールにしてください
・休憩時間を入れてください
・営業時間が不明な場所は無理に提案しないでください

【文章ルール】
・です・ます調で書いてください
・一人称は使わないでください
・語尾を統一してください
・親しみやすく、わかりやすい文章にしてください

【ちびプランらしさ】
・有名スポットだけでなく、穴場・隠れ家・少し珍しい体験も1つ以上含めてください
・ただし、営業情報が不確かな場所や閉業の可能性がある場所はメインプランに入れないでください
・ユーザーが「自分では思いつかなかった」と感じる提案を含めてください

【外出先タスク】
・各スポットごとに、ユーザーがその場所で楽しめる小さなタスクを1つ提案してください
・タスクは難しすぎず、ひとりでも実行しやすい内容にしてください
・例：「今日いちばん好きな景色を1枚撮る」「地元のお店で気になる商品を1つ見つける」「ベンチで5分ぼーっとする」
・タスクは“やらなきゃいけないこと”ではなく、“楽しみ方のヒント”として提案してください
`;

/* 画面切り替え */
function showScreen(screen) {
  homeScreen.classList.remove("active");
  conditionScreen.classList.remove("active");
  proposalScreen.classList.remove("active");

  screen.classList.add("active");
}

/* チェックされた値を配列で取得 */
function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
    .map((input) => input.value);
}

/* 配列をプロンプト用の箇条書きにする */
function formatList(items) {
  if (items.length === 0) {
    return "・未選択";
  }

  return items.map((item) => `・${item}`).join("\n");
}

/* ユーザー条件を取得 */
function getUserCondition() {
  const selectedTripType = document.querySelector(".trip-type.selected");
  const selectedHotel = document.querySelector(".hotel-btn.selected");

  const startPlace = document.getElementById("startPlace").value;
  const people = peopleText.textContent;
  const budget = budgetText.textContent;

  const dayHours = document.getElementById("dayHours");
  const stayNights = document.getElementById("stayNights");

  let tripDetail = "";
  let hotelSuggestion = "対象外";

  if (selectedTripType.dataset.type === "day") {
    tripDetail = dayHours.value;
  } else {
    tripDetail = stayNights.value;
    hotelSuggestion = selectedHotel ? selectedHotel.textContent : "未選択";
  }

  return {
    startPlace: startPlace || "未入力",
    dayMoods: getCheckedValues("dayMood"),
    senseMoods: getCheckedValues("senseMood"),
    people: people,
    tripType: selectedTripType.textContent,
    tripDetail: tripDetail,
    hotelSuggestion: hotelSuggestion,
    budget: budget
  };
}

/* プロンプト生成 */
function createPrompt(condition) {
  const variablePrompt = `
【ユーザーの条件】
出発地：${condition.startPlace}
人数：${condition.people}
予定：${condition.tripType}
時間・宿泊：${condition.tripDetail}
宿泊先の提案：${condition.hotelSuggestion}
予算：${condition.budget}

【今日はどんな一日にしたい？】
${formatList(condition.dayMoods)}

【どんな感覚を楽しみたい？】
${formatList(condition.senseMoods)}
`;

  return `${variablePrompt}

${FIXED_PROMPT}`.trim();
}

/* 後でAI APIへ送るとき用 */
function sendToAI(prompt) {
  console.log("AIへ送信予定のプロンプト:", prompt);
}

/* ホーム → 条件設定 */
startBtn.addEventListener("click", () => {
  showScreen(conditionScreen);
});

/* スケジュール作成 */
makePlanBtn.addEventListener("click", () => {
  const condition = getUserCondition();
  const prompt = createPrompt(condition);

  promptResult.innerHTML = `
    <h3>生成されたプロンプト</h3>
    <pre>${prompt}</pre>
  `;

  sendToAI(prompt);
});

/* 提案画面 → 条件設定 */
backBtn.addEventListener("click", () => {
  showScreen(conditionScreen);
});

/* 人数スライダー */
peopleRange.addEventListener("input", () => {
  peopleText.textContent = `${peopleRange.value}人`;
});

/* 予算スライダー */
budgetRange.addEventListener("input", () => {
  const budget = Number(budgetRange.value).toLocaleString();
  budgetText.textContent = `${budget}円`;
});

/* 日帰り・お泊まり切り替え */
tripButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tripButtons.forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");

    if (button.dataset.type === "day") {
      dayOptions.classList.add("active");
      stayOptions.classList.remove("active");
    } else {
      stayOptions.classList.add("active");
      dayOptions.classList.remove("active");
    }
  });
});

/* 宿泊先提案の切り替え */
hotelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    hotelButtons.forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");
  });
});