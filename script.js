
const logs = document.getElementById("logs"); // Mga activity logs
let userName = prompt("Enter your name:") || "Anonymous"; // Name sa user 

document.addEventListener("DOMContentLoaded", function () { // User joined
  addLog("User joined: " + userName);
});

    

       // Log function
       function addLog(message) {
       const li = document.createElement("li");
       li.textContent = message;
       li.style.cssText = "background-color: #FFF9E6; margin-bottom: 8px; padding: 10px; border-radius: 4px; font-size: 14px; color: #333;";
       logs.appendChild(li);
}


       // Change user nga button
       function changeUser() {
       const newUser = prompt("Enter new user name:", userName);

       if (newUser && newUser.trim() !== "") {
       const oldUser = userName;
       userName = newUser.trim();
       addLog(`User switched from ${oldUser} to ${userName}`);
  }
}

class TodoList {
    constructor() {
        this.editingIndex = -1;

        // Get elements
        this.addButton = document.getElementById('addButton');
        this.todoInput = document.getElementById('todoInput');
        this.todoList = document.getElementById('todoList');


        
        // Add button click
        this.addButton.addEventListener('click', () => this.addOrUpdateTask());

        // Handle Done, Edit, Remove gamit one listener
        this.todoList.addEventListener('click', (e) => {
            const action = e.target.classList.contains('removeButton') ? 'remove' : 
                           e.target.classList.contains('editButton') ? 'edit' : 
                           e.target.classList.contains('doneButton') ? 'done' : null;
            if (action) this[action + 'Task'](e);
        });
    }

    

    // Add or Update task
addOrUpdateTask() {
    const text = this.todoInput.value.trim();
    if (!text) return;

    if (this.editingIndex === -1) {
        // ADD TASK
        this.addTask(text);
        addLog(`➕ Task added by ${userName}: "${text}"`); 
    } else {
        // UPDATE TASK
        const oldText = this.todoList.children[this.editingIndex]
                        .querySelector('.task-text').textContent;
        this.updateTask(text);
        addLog(`🔄 Task updated by ${userName}: "${oldText}" → "${text}"`); 
    }

    this.todoInput.value = '';
}

    // Create ug task
    addTask(taskText) {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item todo-item';
        listItem.innerHTML = `
            <span class="task-text">${taskText}</span>
            <span class="timestamp" style="display: block; margin-top: 0.5rem; color: gray;">Date Added: ${new Date().toLocaleString()}</span>
            <div style="margin-top: 0.5rem;">
                <button class="btn btn-success btn-sm doneButton">Done</button>
                <button class="btn btn-warning btn-sm editButton">Edit</button>
                <button class="btn btn-danger btn-sm removeButton">Remove</button>
            </div>
        `;
        this.todoList.appendChild(listItem);
    }

    // DONE BUTTON
    doneTask(event) {
    const taskItem = event.target.closest(".todo-item");
    const taskText = taskItem.querySelector(".task-text") || taskItem.querySelector(".task-left");
    if (!taskText) return;

    taskText.classList.toggle("completed");

    const doneBtn = taskItem.querySelector(".doneButton");
    const editBtn = taskItem.querySelector(".editButton");
    if (doneBtn) doneBtn.disabled = true;
    if (editBtn) editBtn.disabled = true;

    addLog(`✅ Task marked as done by ${userName}: "${taskText.textContent}"`);
}


    // EDIT BUTTON
    updateTask(taskText) {
        this.todoList.children[this.editingIndex].querySelector('.task-text').textContent = taskText;
        this.resetEditing();
    }

    // REMOVE BUTTON
    removeTask(event) {
        const item = event.target.closest(".todo-item"); 
        const taskText = item.querySelector(".task-text").textContent;
        this.todoList.removeChild(item);
        addLog(`❌ Task removed by ${userName}: "${taskText}"`);
    }

    // Load task into input for editing
    editTask(event) {
        const taskItem = event.target.closest(".todo-item");
        this.todoInput.value = taskItem.querySelector(".task-text").textContent;
        this.editingIndex = Array.from(this.todoList.children).indexOf(taskItem);
        this.addButton.textContent = "Update";

        addLog(`✏️ Task selected for edit by ${userName}: "${this.todoInput.value}"`);
    }

    // Reset back to Add mode
    resetEditing() {
        this.editingIndex = -1;
        this.addButton.textContent = 'Add';
    }
    
}

// Task Lists
class TimestampedTodoList extends TodoList {
    addTask(taskText) {
        super.addTask(taskText);
        const taskItem = this.todoList.lastChild; // Get the newly added task
        const timestamp = document.createElement('span'); // Time and Date
        timestamp.className = 'timestamp';
        timestamp.textContent = new Date().toLocaleString(); // Current time and date
        taskItem.appendChild(timestamp);
    }
}

// Start app when page loads
document.addEventListener('DOMContentLoaded', () => new TodoList());