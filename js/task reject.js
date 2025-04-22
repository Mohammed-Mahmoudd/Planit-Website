const TASK_STATUS = {
    COMPLETED: 'completed',
    IN_PROGRESS: 'in-progress'
};

function updateTaskCounters() {
    const tasks = getTasksFromStorage();
    
    const completedCount = tasks.filter(task => task.status === TASK_STATUS.COMPLETED).length;
    const inProgressCount = tasks.filter(task => task.status === TASK_STATUS.IN_PROGRESS).length;
    
    // اختيار مباشر بناءً على data-counter
    const completedCounter = document.querySelector('[data-counter="completed"]');
    const inProgressCounter = document.querySelector('[data-counter="in-progress"]');

    if (completedCounter) {
        completedCounter.textContent = completedCount;
    }

    if (inProgressCounter) {
        inProgressCounter.textContent = inProgressCount;
    }
}

function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function updateTaskStatus(taskId, newStatus) {
    const tasks = getTasksFromStorage();
    const taskIndex = tasks.findIndex(task => task.id == taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].status = newStatus;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateTaskCounters();
        return true;
    }
    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    updateTaskCounters();
    
    window.addEventListener('storage', function(event) {
        if (event.key === 'tasks') {
            updateTaskCounters();
        }
    });
});

// للاستخدام الخارجي
function completeTask(taskId) {
    return updateTaskStatus(taskId, TASK_STATUS.COMPLETED);
}

function setTaskInProgress(taskId) {
    return updateTaskStatus(taskId, TASK_STATUS.IN_PROGRESS);
}
