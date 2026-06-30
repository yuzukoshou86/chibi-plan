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

const moodButtons = document.querySelectorAll(".mood");
const tripTypeButtons = document.querySelectorAll(".trip-type");

function showScreen(screen) {
  homeScreen.classList.remove("active");
  conditionScreen.classList.remove("active");
  proposalScreen.classList.remove("active");

  screen.classList.add("active");
}

startBtn.addEventListener("click", () => {
  showScreen(conditionScreen);
});

makePlanBtn.addEventListener("click", () => {
  showScreen(proposalScreen);
});

backBtn.addEventListener("click", () => {
  showScreen(conditionScreen);
});

peopleRange.addEventListener("input", () => {
  peopleText.textContent = `${peopleRange.value}人`;
});

budgetRange.addEventListener("input", () => {
  const budget = Number(budgetRange.value).toLocaleString();
  budgetText.textContent = `${budget}円`;
});

moodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    moodButtons.forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");
  });
});

const tripButtons = document.querySelectorAll(".trip-type");
const dayOptions = document.getElementById("dayOptions");
const stayOptions = document.getElementById("stayOptions");
const hotelButtons = document.querySelectorAll(".hotel-btn");

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

hotelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    hotelButtons.forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");
  });
});