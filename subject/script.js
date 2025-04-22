const calendar = document.getElementById("calendar");
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();

// الحصول على أول يوم في الشهر
const firstDay = new Date(year, month, 1).getDay(); // 0 = الأحد
const daysInMonth = new Date(year, month + 1, 0).getDate();

const days = [];

// إضافة فراغات للبداية حسب اليوم الأول
for (let i = 0; i < firstDay; i++) {
  days.push("");
}

// إضافة أيام الشهر
for (let i = 1; i <= daysInMonth; i++) {
  days.push(i);
}

// عرض الأيام في HTML
days.forEach((day, index) => {
  const dayDiv = document.createElement("div");
  dayDiv.classList.add("day");

  if (day === now.getDate()) {
    dayDiv.classList.add("today");
  }

  dayDiv.textContent = day;
  calendar.appendChild(dayDiv);
});



let countdown;

function startTimer() {
  clearInterval(countdown); // clear any existing countdowns

  const minutes = parseInt(document.getElementById('minutesInput').value);
  if (isNaN(minutes) || minutes <= 0) {
    alert("Please enter a valid number of minutes.");
    return;
  }

  const timerDisplay = document.getElementById('timerDisplay');
  const alarmSound = document.getElementById('alarmSound');
  let totalSeconds = minutes * 60;

  function updateDisplay() {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    timerDisplay.textContent =
      `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  updateDisplay(); // show initial time

  countdown = setInterval(() => {
    totalSeconds--;
    if (totalSeconds < 0) {
      clearInterval(countdown);
      timerDisplay.textContent = "Time's up!";
      alarmSound.play(); // تشغيل الإنذار
      return;
    }
    updateDisplay();
  }, 1000);
}
