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

const startPlaceInput = document.getElementById("startPlace");
const formMessage = document.getElementById("formMessage");
const promptResult = document.getElementById("promptResult");

const senseRandom = document.getElementById("senseRandom");

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

function showScreen(screen) {
  homeScreen.classList.remove("active");
  conditionScreen.classList.remove("active");
  proposalScreen.classList.remove("active");
  screen.classList.add("active");
}

function createTimeOptions() {
  const times = [];

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const hh = String(hour).padStart(2, "0");
      const mm = String(minute).padStart(2, "0");
      times.push(`${hh}:${mm}`);
    }
  }

  startTimeSelect.innerHTML = `<option value="">選択してください</option>`;
  endTimeSelect.innerHTML = `<option value="">選択してください</option>`;

  times.forEach((time) => {
    startTimeSelect.insertAdjacentHTML("beforeend", `<option value="${time}">${time}</option>`);
    endTimeSelect.insertAdjacentHTML("beforeend", `<option value="${time}">${time}</option>`);
  });

  startTimeSelect.value = "09:00";
  endTimeSelect.value = "";
}

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

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
    .map((input) => input.value);
}

function getSelectedButtonText(selector) {
  const selected = document.querySelector(selector);
  return selected ? selected.textContent.trim() : "";
}

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
${condition.senses.includes("おまかせ")
    ? "・おまかせ（五感の指定なし）"
    : condition.senses.map((item) => `・${item}`).join("\n")}

${FIXED_PROMPT}
`.trim();
}

function createPromptJson(condition) {
  return {
    serviceName: "ちびプラン",
    conditions: condition,
    prompt: createPromptText(condition)
  };
}

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

function sendToAI(promptJson) {
  console.log("AIへ送信予定のJSON:", promptJson);
}

startBtn.addEventListener("click", () => {
  showScreen(conditionScreen);
  validateForm();
});

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

backBtn.addEventListener("click", () => {
  showScreen(conditionScreen);
});

peopleRange.addEventListener("input", () => {
  peopleText.textContent = `${peopleRange.value}人`;
  validateForm();
});

budgetRange.addEventListener("input", () => {
  const budget = Number(budgetRange.value).toLocaleString();
  budgetText.textContent = `${budget}円`;
  validateForm();
});

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

hotelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    hotelButtons.forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");
    validateForm();
  });
});

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

document.querySelectorAll('input[name="dayMood"]').forEach((checkbox) => {
  checkbox.addEventListener("change", validateForm);
});

startPlaceInput.addEventListener("input", validateForm);
startTimeSelect.addEventListener("change", validateForm);
endTimeSelect.addEventListener("change", validateForm);

createTimeOptions();
validateForm();