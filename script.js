"use strict";
import {
  format,
  getUnixTime,
  fromUnixTime,
  isSameDay,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
} from "date-fns";

// Constants
const gridDates = document.querySelector(".date-picker-grid-dates");
const btnDatePicker = document.querySelector(".date-picker-button");
const datePicker = document.querySelector(".date-picker");
const headerMonthYear = document.querySelector(".current-month");
const btnNextMonth = document.querySelector(".next-month-button");
const btnPrevMonth = document.querySelector(".prev-month-button");
let currentDate = new Date();
let selectedDate = currentDate;

// Functions
function getDatesToDisplay(date) {
  const firstDate = startOfWeek(startOfMonth(date));
  const lastDate = endOfWeek(endOfMonth(date));
  return eachDayOfInterval({ start: firstDate, end: lastDate });
}

function toggleDatePicker() {
  datePicker.classList.toggle("show");
}

function setBtnDate(date) {
  btnDatePicker.textContent = format(date, "MMMM do, yyyy");
}

function updateHeader(date) {
  headerMonthYear.textContent = format(date, "MMMM - yyyy");
}

function renderMonth(refDate) {
  updateHeader(refDate);
  const dates = getDatesToDisplay(refDate);
  gridDates.innerHTML = "";
  dates.forEach((dateToDisp) => {
    const btnDate = document.createElement("button");
    btnDate.className = "date";
    btnDate.textContent = dateToDisp.getDate();
    btnDate.dataset.timeUnix = getUnixTime(dateToDisp);
    if (refDate.getMonth() !== dateToDisp.getMonth()) {
      btnDate.classList.add("date-picker-other-month-date");
    }
    if (isSameDay(dateToDisp, selectedDate)) {
      btnDate.classList.add("selected");
    }
    gridDates.appendChild(btnDate);
  });
}

// Event handlers
btnDatePicker.addEventListener("click", () => {
  toggleDatePicker();
  const isShowingDatePicker = datePicker.classList.contains("show");
  if (isShowingDatePicker) {
    renderMonth(selectedDate);
  }
});

document.addEventListener("click", (e) => {
  const clickedOnDatePicker = e.target.closest(".date-picker-container");
  const isButton = e.target === btnDatePicker;
  const isHiddenDatePicker = !datePicker.classList.contains("show");
  if (clickedOnDatePicker || isButton || isHiddenDatePicker) return;
  toggleDatePicker();
});

datePicker.addEventListener("click", (e) => {
  if (e.target.matches(".date")) {
    selectedDate = fromUnixTime(e.target.dataset.timeUnix);
    setBtnDate(selectedDate);
    toggleDatePicker();
  }
});

btnNextMonth.addEventListener("click", () => {
  currentDate = addMonths(currentDate, 1);
  renderMonth(currentDate);
});

btnPrevMonth.addEventListener("click", () => {
  currentDate = subMonths(currentDate, 1);
  renderMonth(currentDate);
});

// Initialization
setBtnDate(currentDate);
