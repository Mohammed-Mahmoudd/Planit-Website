function createTask() {
    const title = document.getElementById("main-title").value;
    const subtitle = document.getElementById("sub-title").value;
    const imageInput = document.getElementById("task-image");
    const taskList = document.getElementById("task-list");

    if (!title) {
        alert("Please enter a title.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const taskId = Date.now();
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        
        const taskHTML = `
            <div class="col-md-6 col-lg-4">
                <div class="task-card">
                    <div class="task-header">
                        <div class="task-image-container">
                            ${imageInput.files[0] ? 
                                `<img src="${e.target.result}" class="task-image" alt="task image">` : 
                                `<div style="background:#675AA4;width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:white;">📷</div>`
                            }
                        </div>
                        <div class="task-title-wrapper">
                            <h3 class="task-title">${title}</h3>
                            <div class="task-date">${formattedDate}</div>
                        </div>
                    </div>
                    
                    <div class="task-meta">
                        <div class="task-meta-item edit-task">Edit task</div>
                        <div class="task-meta-item set-time">Set time</div>
                        <div class="task-meta-item set-date">Set date</div>
                    </div>
                    
                    <div class="task-progress">
                        <div class="progress-status">In Progress</div>
                        <div class="task-timer">1:00:00</div>
                    </div>
                    
                    <div class="task-actions">
                        <button class="task-btn complete-btn">Complete</button>
                        <button class="task-btn delete-btn" onclick="this.closest('.col-md-6').remove()">Delete</button>
                    </div>
                </div>
            </div>
        `;
        
        taskList.insertAdjacentHTML("beforeend", taskHTML);

        // Reset fields
        document.getElementById("main-title").value = "";
        document.getElementById("sub-title").value = "";
        document.getElementById("task-image").value = "";
    };

    if (imageInput.files[0]) {
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        reader.onload({ target: { result: '' } });
    }
}