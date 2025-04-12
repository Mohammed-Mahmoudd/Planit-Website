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
    const taskData = {
        id: taskId,
        title: title,
        subtitle: subtitle,
        date: getCurrentFormattedDate(),
        time: getCurrentFormattedTime(),
        status: 'in-progress',
        timer: '01:00:00',
        image: null
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
        <div class="col-md-6 col-lg-4" id="task-${task.id}">
            <div class="task-card">
                <div class="task-header">
                    <div class="task-image-container">
                        ${task.image ? 
                            `<img src="${task.image}" class="task-image" alt="task image">` : 
                            `<div class="default-image">📷</div>`
                        }
                    </div>
                    <div class="task-title-wrapper">
                        <h3 class="task-title" contenteditable="true" 
                            onblur="updateTaskField(${task.id}, 'title', this.textContent)">
                            ${task.title}
                        </h3>
                        <div class="task-date" contenteditable="true" 
                            onblur="updateTaskField(${task.id}, 'date', this.textContent)">
                            ${task.date}
                        </div>
                    </div>
                </div>
                
                ${task.subtitle ? `
                <div class="task-sub" contenteditable="true" 
                    onblur="updateTaskField(${task.id}, 'subtitle', this.textContent)">
                    ${task.subtitle}
                </div>` : ''}
                
                <div class="task-meta">
                    <div class="task-meta-item edit-task" onclick="showEditPrompt(${task.id}, 'time', 'Edit Time', '${task.time}', validateTime)">
                        <span>Set time</span>
                        <span class="task-time">${task.time}</span>
                    </div>
                    <div class="task-meta-item set-date" onclick="showEditPrompt(${task.id}, 'date', 'Edit Date', '${task.date}', validateDate)">
                        <span>Set date</span>
                        <span class="task-date-value">${task.date}</span>
                    </div>
                </div>
                
                <div class="task-progress">
                    <div class="progress-status">
                        <span>Status:</span>
                        <select class="status-select" onchange="updateTaskField(${task.id}, 'status', this.value)">
                            <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                            <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                            <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                        </select>
                    </div>
                    <div class="task-timer" onclick="showEditPrompt(${task.id}, 'timer', 'Edit Timer', '${task.timer}', validateTimer)">
                        ${task.timer}
                    </div>
                </div>
                
                <div class="task-actions">
                    <button class="task-btn complete-btn" onclick="completeTask(${task.id})">
                        Complete
                    </button>
                    <button class="task-btn delete-btn" onclick="showDeleteConfirmation(${task.id})">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `;
    
    taskList.insertAdjacentHTML("beforeend", taskHTML);
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
    
    // Special validation for date field
    if (field === 'date' && !validateDate(value)) {
        const taskElement = document.getElementById(`task-${taskId}`);
        taskElement.querySelector('.task-date').textContent = getTaskFromStorage(taskId)?.date || getCurrentFormattedDate();
        showAlert("Invalid date format. Please use: MMM DD, YYYY (e.g. Apr 22, 2023)", "error");
        return;
    }
    
    if (value && updateTaskInStorage(taskId, { [field]: value })) {
        // Update any related fields in the DOM
        if (field === 'date') {
            document.getElementById(`task-${taskId}`).querySelector('.task-date-value').textContent = value;
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
        default:
            promptInput.placeholder = '';
    }
    
    customPrompt.style.display = 'flex';
    promptInput.focus();
    
    // Store the validator function
    promptInput.dataset.validator = validator.name;
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
    
    if (!isValid) {
        promptInput.classList.add('invalid-input');
        return;
    }
    
    if (newValue) {
        updateTaskField(currentTaskId, currentEditType, newValue);
        
        // Update the specific field in the DOM
        const taskElement = document.getElementById(`task-${currentTaskId}`);
        if (currentEditType === 'time') {
            taskElement.querySelector('.task-time').textContent = newValue;
        } 
        else if (currentEditType === 'date') {
            taskElement.querySelector('.task-date').textContent = newValue;
            taskElement.querySelector('.task-date-value').textContent = newValue;
        }
        else if (currentEditType === 'timer') {
            taskElement.querySelector('.task-timer').textContent = newValue;
        }
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
            taskElement.querySelector('.status-select').value = 'completed';
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
    document.getElementById(`task-${taskId}`).remove();
    deleteTaskFromStorage(taskId);
    showAlert("Task deleted successfully!", "success");
}

// ================ Utility Functions ================

function clearAllTasks() {
    if (confirm("Are you sure you want to delete ALL tasks? This cannot be undone.")) {
        localStorage.removeItem('tasks');
        taskList.innerHTML = '';
        showAlert("All tasks have been deleted.", "success");
    }
}