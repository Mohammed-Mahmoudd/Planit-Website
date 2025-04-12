// Calendar functionality
const daysTag = document.querySelector(".days"),
currentDate = document.querySelector(".current-date"),
prevNextIcon = document.querySelectorAll(".icons span");

// getting new date, current year and month
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();

// storing full name of all months in array
const months = [
    "January", "February", "March", "April", 
    "May", "June", "July", "August", 
    "September", "October", "November", "December"
];

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) {
        // creating li of previous month last days
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
        // creating li of all days of current month
        // adding active class to li if the current day, month, and year matched
        let isToday =
            i === date.getDate() &&
            currMonth === new Date().getMonth() &&
            currYear === new Date().getFullYear()
            ? "active"
            : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) {
        // creating li of next month first days
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
    daysTag.innerHTML = liTag;
};
renderCalendar();

prevNextIcon.forEach((icon) => {
    // getting prev and next icons
    icon.addEventListener("click", () => {
        // adding click event on both icons
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) {
            // if current month is less than 0 or greater than 11
            // creating a new date of current year & month and pass it as date value
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); // updating current year with new date year
            currMonth = date.getMonth(); // updating current month with new date month
        } else {
            date = new Date(); // pass the current date as date value
        }
        renderCalendar(); // calling renderCalendar function
    });
});

// Toggle sidebar on mobile
document.getElementById('toggle-nav').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
});

// Creativity button function
function creativity() {
    window.location.href = "./Idea submission/creativity.html";
}

// Timer functionality - التعديلات الجديدة هنا
let timerInterval;
let timerRunning = false;
let totalSeconds = 15 * 60; // 15 دقيقة بالثواني

function startTimer() {
    if (!timerRunning && totalSeconds > 0) {
        timerRunning = true;
        timerInterval = setInterval(updateTimer, 1000);
        // تغيير أيقونة التشغيل إلى الإيقاف المؤقت
        document.querySelector('.play-btn').style.display = 'none';
        document.querySelector('.pause-btn').style.display = 'flex';
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    // تغيير أيقونة الإيقاف المؤقت إلى التشغيل
    document.querySelector('.pause-btn').style.display = 'none';
    document.querySelector('.play-btn').style.display = 'flex';
}

function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    totalSeconds = 15 * 60;
    updateTimerDisplay();
    // إعادة الأيقونات إلى وضعها الأولي
    document.querySelector('.pause-btn').style.display = 'none';
    document.querySelector('.play-btn').style.display = 'flex';
}

function updateTimer() {
    if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        // عند انتهاء الوقت
        document.querySelector('.timer-content h4').style.color = '#f00';
        document.querySelector('.play-btn').style.display = 'none';
        document.querySelector('.pause-btn').style.display = 'none';
        return;
    }
    totalSeconds--;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    document.querySelector('.timer-content h4').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// إضافة حدث للنقاط الثلاث لتعديل الوقت
document.querySelector('.more-btn').addEventListener('click', function() {
    const currentMinutes = Math.floor(totalSeconds / 60);
    const newTime = prompt("Enter new time in minutes (e.g. 15):", currentMinutes);
    if (newTime && !isNaN(newTime) && newTime > 0) {
        totalSeconds = parseInt(newTime) * 60;
        updateTimerDisplay();
        // إعادة لون النص إلى الأبيض في حالة تغيير الوقت بعد انتهائه
        document.querySelector('.timer-content h4').style.color = '#fff';
        // إظهار أيقونة التشغيل في حالة إدخال وقت جديد
        document.querySelector('.play-btn').style.display = 'flex';
        document.querySelector('.pause-btn').style.display = 'none';
    }
});

// Event listeners for timer buttons
document.querySelector('.play-btn').addEventListener('click', startTimer);
document.querySelector('.pause-btn').addEventListener('click', pauseTimer);

// Initialize timer display
updateTimerDisplay();
document.querySelector('.pause-btn').style.display = 'none'; // إخفاء زر الإيقاف في البداية