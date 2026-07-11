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

/* 後でAI APIに送る用 */
function sendToAI(promptJson) {
  console.log("AIへ送信予定のJSON:", promptJson);
}

/* ホーム → 条件設定 */
startBtn.addEventListener("click", () => {
  showScreen(conditionScreen);
  validateForm();
});

/* スケジュール作成 */
makePlanBtn.addEventListener("click", () => {
  const condition = getUserCondition();
  const promptJson = createPromptJson(condition);
  const jsonText = JSON.stringify(promptJson, null, 2);

  promptResult.innerHTML = `
    <h3>生成されたJSON</h3>
    <pre>${jsonText}</pre>
  `;

  sendToAI(promptJson);
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