// ================ Task Management System ================

// DOM Elements
const taskList = document.getElementById('task-list');
const customPrompt = document.getElementById('custom-prompt');
const promptInput = document.getElementById('prompt-input');
const promptError = document.getElementById('prompt-error');
const promptTitle = document.getElementById('prompt-title');
const promptConfirm = document.getElementById('prompt-confirm');
const promptCancel = document.getElementById('prompt-cancel');

// State variables
let currentTaskId = null;
let currentEditType = null;
const timers = {}; // Store timer intervals

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    setupPrompt();
});

// ================ Main Functions ================

function createTask() {
    const title = document.getElementById("main-title").value.trim();
    const subtitle = document.getElementById("sub-title").value.trim();
    const imageInput = document.getElementById("task-image");
    
    if (!title) {
        showAlert("Please enter a title.", "error");
        return;
    }

    const taskId = Date.now();
    const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    const taskData = {
        id: taskId,
        title: title,
        subtitle: subtitle,
        date: getCurrentFormattedDate(),
        time: getCurrentFormattedTime(),
        status: 'in-progress',
        timer: '01:00:00',
        image: null,
        priority: 'high',
        endDate: formatDate(endDate),
        endMonth: getFormattedEndMonth(endDate),
        timerRunning: false
    };

    if (imageInput.files[0]) {
        if (imageInput.files[0].size > 500000) { // 500KB max
            showAlert("Image is too large. Please use images smaller than 500KB.", "error");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            taskData.image = e.target.result;
            addTaskToDOM(taskData);
            saveTask(taskData);
            showAlert("Task created successfully!", "success");
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        addTaskToDOM(taskData);
        saveTask(taskData);
        showAlert("Task created successfully!", "success");
    }

    // Reset form
    document.getElementById("main-title").value = "";
    document.getElementById("sub-title").value = "";
    document.getElementById("task-image").value = "";
}

function addTaskToDOM(task) {
    const taskHTML = `
        <div class="col-12" id="task-${task.id}">
            <div class="task-card">
                <!-- Right-aligned control buttons -->
                <div class="task-control-buttons">
                    <button class="control-button complete-btn" onclick="completeTask(${task.id})">
                        Complete
                    </button>
                    <button class="control-button delete-btn" onclick="showDeleteConfirmation(${task.id})">
                        Delete
                    </button>
                </div>
                
                <!-- Top Section -->
                <div class="task-header">
                    <div class="task-image-container">
                        ${task.image ? 
                            `<img src="${task.image}" class="task-image" alt="task image" onclick="showImageModal('${task.image}')">` : 
                            `<div class="default-image">📷</div>`
                        }
                    </div>
                    <div class="task-title-wrapper">
                        <h3 class="task-title">${task.title}</h3>
                        <div class="task-sub">${task.subtitle || 'Sub title'}</div>
                        <div class="task-creation-date">Created at ${task.date}</div>
                    </div>
                </div>
                
                <!-- Middle Section - Action Buttons -->
                <div class="task-actions-row">
                    <button class="action-button" onclick="showEditPrompt(${task.id}, 'title', 'Edit Title', '${task.title}')">
                        ✏️ Edit your task
                    </button>
                    <button class="action-button" onclick="showEditPrompt(${task.id}, 'time', 'Edit Time', '${task.time}', validateTime)">
                        🕒 Set time
                    </button>
                    <button class="action-button" onclick="showEditPrompt(${task.id}, 'date', 'Edit Date', '${task.date}', validateDate)">
                        📅 Set date
                    </button>
                </div>
                
                <!-- Bottom Section - Task Info -->
                <div class="task-info-container">
                    <div class="task-info-item">
                        🔥 Priority: <span class="priority-high">${task.priority}</span>
                    </div>
                    <div class="task-info-item">
                        📅 ${task.date}
                    </div>
                    <div class="task-status">
                        ${task.status}
                    </div>
                </div>
            </div>
            
            <!-- External Info Boxes with connecting lines -->
            <div class="external-info-wrapper">
                <div class="connecting-line"></div>
                <div class="external-info-container">
                    <div class="external-info-box date-box" 
                         onclick="showEditPrompt(${task.id}, 'endDate', 'Edit End Date', '${task.endDate}', validateEndDate)">
                        <div class="external-info-title">End Date</div>
                        <div class="external-info-value end-date">${task.endDate}</div>
                        <div class="external-info-value end-month">${task.endMonth}</div>
                    </div>
                    <div class="external-info-box timer-box">
                        <div class="external-info-title">Timer</div>
                        <div class="external-info-value timer-display" 
                             onclick="showEditPrompt(${task.id}, 'timer', 'Edit Timer', '${task.timer}', validateTimer)">
                            ${task.timer}
                        </div>
                        <div class="timer-controls">
                            <button class="timer-control start-btn" onclick="startTimer(${task.id}, this)">
                                ▶️
                            </button>
                            <button class="timer-control sound-btn" onclick="toggleSound(this)">
                                🔊
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    taskList.insertAdjacentHTML("beforeend", taskHTML);
}

// ================ Timer Functions ================

function startTimer(taskId, button) {
    const taskElement = document.getElementById(`task-${taskId}`);
    const timerDisplay = taskElement.querySelector('.timer-display');
    
    // If timer is already running, stop it
    if (timers[taskId]) {
        clearInterval(timers[taskId]);
        delete timers[taskId];
        button.innerHTML = '▶️';
        updateTaskInStorage(taskId, { timerRunning: false });
        return;
    }
    
    button.innerHTML = '⏸️';
    updateTaskInStorage(taskId, { timerRunning: true });
    
    let timeParts = timerDisplay.textContent.split(':');
    let hours = parseInt(timeParts[0]);
    let minutes = parseInt(timeParts[1]);
    let seconds = parseInt(timeParts[2]);
    
    timers[taskId] = setInterval(() => {
        seconds--;
        
        if (seconds < 0) {
            seconds = 59;
            minutes--;
        }
        
        if (minutes < 0) {
            minutes = 59;
            hours--;
        }
        
        if (hours < 0) {
            // Timer reached zero
            clearInterval(timers[taskId]);
            delete timers[taskId];
            timerDisplay.textContent = "00:00:00";
            button.innerHTML = '▶️';
            updateTaskInStorage(taskId, { 
                timer: "00:00:00",
                timerRunning: false 
            });
            showAlert("Timer completed!", "success");
            return;
        }
        
        // Update display
        const newTime = `${hours.toString().padStart(2, '0')}:` +
                       `${minutes.toString().padStart(2, '0')}:` +
                       `${seconds.toString().padStart(2, '0')}`;
        
        timerDisplay.textContent = newTime;
            
        // Update in storage
        updateTaskInStorage(taskId, { 
            timer: newTime 
        });
    }, 1000);
}

function toggleSound(button) {
    if (button.textContent.includes('🔊')) {
        button.innerHTML = '🔇';
        showAlert("Sound muted", "success");
    } else {
        button.innerHTML = '🔊';
        showAlert("Sound unmuted", "success");
    }
}

// ================ Image Modal Functions ================

function showImageModal(imageSrc) {
    const modalHTML = `
        <div class="image-modal" onclick="closeImageModal()">
            <div class="image-modal-content">
                <img src="${imageSrc}" alt="Enlarged task image">
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) modal.remove();
}

// ================ Storage Functions ================

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToDOM(task);
        // Restore running timers if needed
        if (task.timerRunning) {
            const button = document.querySelector(`#task-${task.id} .start-btn`);
            if (button) startTimer(task.id, button);
        }
    });
}

function updateTaskInStorage(taskId, updates) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.id == taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
        localStorage.setItem('tasks', JSON.stringify(tasks));
        return true;
    }
    return false;
}

function deleteTaskFromStorage(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id != taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ================ Field Update Functions ================

function updateTaskField(taskId, field, value) {
    value = value.trim();
    
    if (field === 'endDate') {
        const taskElement = document.getElementById(`task-${taskId}`);
        taskElement.querySelector('.end-date').textContent = value;
        
        // Update end month display
        const dateParts = value.split('/');
        if (dateParts.length === 3) {
            const monthNames = ["January", "February", "March", "April", "May", "June",
                              "July", "August", "September", "October", "November", "December"];
            const monthIndex = parseInt(dateParts[1]) - 1;
            const monthName = monthNames[monthIndex];
            const newEndMonth = `${monthName} ${dateParts[2]} / ${monthName.substring(0, 3)}`;
            taskElement.querySelector('.end-month').textContent = newEndMonth;
            updateTaskInStorage(taskId, { 
                endDate: value,
                endMonth: newEndMonth 
            });
        }
        showAlert("End date updated successfully!", "success");
        return;
    }
    
    if (value && updateTaskInStorage(taskId, { [field]: value })) {
        // Update the specific field in the DOM
        const taskElement = document.getElementById(`task-${taskId}`);
        if (field === 'time') {
            taskElement.querySelector('.task-time').textContent = value;
        } 
        else if (field === 'date') {
            taskElement.querySelector('.task-date').textContent = value;
        }
        else if (field === 'timer') {
            taskElement.querySelector('.timer-display').textContent = value;
            // Stop timer if it was running
            if (timers[taskId]) {
                clearInterval(timers[taskId]);
                delete timers[taskId];
                const button = taskElement.querySelector('.start-btn');
                if (button) button.innerHTML = '▶️';
                updateTaskInStorage(taskId, { timerRunning: false });
            }
        }
        else if (field === 'title') {
            taskElement.querySelector('.task-title').textContent = value;
        }
        showAlert("Task updated successfully!", "success");
    }
}

function getTaskFromStorage(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return tasks.find(task => task.id == taskId);
}

// ================ Validation Functions ================

function validateDate(dateString) {
    const regex = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{1,2},\s\d{4}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

function validateTime(timeString) {
    const regex = /^(1[0-2]|0?[1-9]):[0-5][0-9]\s(AM|PM)$/i;
    return regex.test(timeString);
}

function validateTimer(timerString) {
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    return regex.test(timerString);
}

function validateEndDate(dateString) {
    const regex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    return regex.test(dateString);
}

// ================ Helper Functions ================

function getCurrentFormattedDate() {
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    });
}

function getCurrentFormattedTime() {
    return new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function getFormattedEndMonth(date) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[date.getMonth()];
    return `${monthName} ${date.getFullYear()} / ${monthName.substring(0, 3)}`;
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert-${type}`;
    alertDiv.textContent = message;
    
    alertDiv.style.position = 'fixed';
    alertDiv.style.bottom = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.padding = '12px 20px';
    alertDiv.style.borderRadius = '8px';
    alertDiv.style.zIndex = '1000';
    alertDiv.style.color = 'white';
    alertDiv.style.fontWeight = '500';
    alertDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    alertDiv.style.animation = 'fadeIn 0.3s ease-in-out';
    
    if (type === 'error') {
        alertDiv.style.backgroundColor = '#EF4444';
    } else {
        alertDiv.style.backgroundColor = '#10B981';
    }
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'fadeOut 0.3s ease-in-out';
        setTimeout(() => {
            alertDiv.remove();
        }, 300);
    }, 3000);
}

// ================ Custom Prompt System ================

function setupPrompt() {
    promptConfirm.addEventListener('click', confirmPrompt);
    promptCancel.addEventListener('click', closePrompt);
    
    promptInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            confirmPrompt();
        }
    });
}

function showEditPrompt(taskId, type, title, currentValue, validator) {
    currentTaskId = taskId;
    currentEditType = type;
    
    promptTitle.textContent = title;
    promptInput.value = currentValue;
    promptError.textContent = '';
    promptInput.classList.remove('invalid-input');
    
    // Set placeholder based on type
    switch(type) {
        case 'date':
            promptInput.placeholder = 'MMM DD, YYYY (e.g. Apr 22, 2023)';
            break;
        case 'time':
            promptInput.placeholder = 'HH:MM AM/PM (e.g. 02:30 PM)';
            break;
        case 'timer':
            promptInput.placeholder = 'HH:MM:SS (e.g. 01:30:00)';
            break;
        case 'endDate':
            promptInput.placeholder = 'DD/MM/YYYY (e.g. 31/12/2023)';
            break;
        default:
            promptInput.placeholder = '';
    }
    
    customPrompt.style.display = 'flex';
    promptInput.focus();
    
    // Store the validator function
    promptInput.dataset.validator = validator?.name || '';
}

function confirmPrompt() {
    const newValue = promptInput.value.trim();
    const validatorName = promptInput.dataset.validator;
    let isValid = true;
    
    // Validate based on the field type
    if (validatorName === 'validateDate') {
        isValid = validateDate(newValue);
        if (!isValid) {
            promptError.textContent = 'Please use format: MMM DD, YYYY (e.g. Apr 22, 2023)';
        }
    } 
    else if (validatorName === 'validateTime') {
        isValid = validateTime(newValue);
        if (!isValid) {
            promptError.textContent = 'Please use format: HH:MM AM/PM (e.g. 02:30 PM)';
        }
    }
    else if (validatorName === 'validateTimer') {
        isValid = validateTimer(newValue);
        if (!isValid) {
            promptError.textContent = 'Please use format: HH:MM:SS (e.g. 01:30:00)';
        }
    }
    else if (validatorName === 'validateEndDate') {
        isValid = validateEndDate(newValue);
        if (!isValid) {
            promptError.textContent = 'Please use format: DD/MM/YYYY (e.g. 31/12/2023)';
        }
    }
    
    if (!isValid) {
        promptInput.classList.add('invalid-input');
        return;
    }
    
    if (newValue) {
        updateTaskField(currentTaskId, currentEditType, newValue);
    }
    
    closePrompt();
}

function closePrompt() {
    customPrompt.style.display = 'none';
    promptInput.value = '';
    promptError.textContent = '';
    promptInput.classList.remove('invalid-input');
}

// ================ Task Actions ================

function completeTask(taskId) {
    if (confirm("Mark this task as completed?")) {
        if (updateTaskInStorage(taskId, { status: 'completed' })) {
            const taskElement = document.getElementById(`task-${taskId}`);
            taskElement.querySelector('.task-status').textContent = 'completed';
            showAlert("Task marked as completed!", "success");
        }
    }
}

function showDeleteConfirmation(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
        deleteTask(taskId);
    }
}

function deleteTask(taskId) {
    // Stop timer if running
    if (timers[taskId]) {
        clearInterval(timers[taskId]);
        delete timers[taskId];
    }
    
    document.getElementById(`task-${taskId}`).remove();
    deleteTaskFromStorage(taskId);
    showAlert("Task deleted successfully!", "success");
}

// ================ Utility Functions ================

function clearAllTasks() {
    if (confirm("Are you sure you want to delete ALL tasks? This cannot be undone.")) {
        // Stop all running timers
        Object.keys(timers).forEach(taskId => {
            clearInterval(timers[taskId]);
        });
        
        localStorage.removeItem('tasks');
        taskList.innerHTML = '';
        showAlert("All tasks have been deleted.", "success");
    }
}