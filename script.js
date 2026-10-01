const taskInput = document.getElementById("value");
const addBtn = document.getElementById("btn");
const taskList = document.getElementById("task-container");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

const searchInput = document.getElementById("searchTask");
const clearCompletedBtn = document.getElementById("clearCompleted");
const emptyState = document.getElementById("emptyState");


// Load tasks from Local Storage
let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];


// Save tasks
function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}


// Add Task
function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}


// Render Tasks
function renderTasks(searchText = "") {

    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task =>
        task.text.toLowerCase().includes(searchText.toLowerCase())
    );


    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("checked");
        }

        li.innerHTML = `
            <div class="task-content">

                <button 
                    class="check-btn"
                    onclick="toggleTask(${task.id})"
                    aria-label="Complete task"
                >
                    ${task.completed ? "✓" : ""}
                </button>

                <span class="task-text">
                    ${task.text}
                </span>

            </div>

            <div class="task-actions">

                <button 
                    class="edit-btn"
                    onclick="editTask(${task.id})"
                >
                    Edit
                </button>
                
                <button 
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                    aria-label="Delete task"
                    title="Delete task"
                >
                    ×
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });


    updateStats();


    // Empty state
    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

        if (searchText !== "") {
            emptyState.querySelector("h2").textContent = "No tasks found";
            emptyState.querySelector("p").textContent =
                "Try searching for a different task.";
        } else {
            emptyState.querySelector("h2").textContent = "No tasks yet";
            emptyState.querySelector("p").textContent =
                "Add your first task and start getting things done.";
        }

    } else {

        emptyState.style.display = "none";
    }
}


// Complete / Uncomplete Task
function toggleTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    task.completed = !task.completed;

    saveTasks();
    renderTasks(searchInput.value);
}


// EDIT TASK
function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;


    const li = document
        .querySelector(`button[onclick="editTask(${id})"]`)
        .closest("li");


    li.innerHTML = `
        <div class="edit-mode">

            <input
                type="text"
                class="edit-input"
                id="edit-${id}"
                value="${task.text}"
                maxlength="100"
            >

            <button
                class="save-btn"
                onclick="updateTask(${id})"
            >
                Save
            </button>

            <button
                class="cancel-btn"
                onclick="renderTasks(searchInput.value)"
            >
                Cancel
            </button>

        </div>
    `;


    const editInput = document.getElementById(`edit-${id}`);

    editInput.focus();
    editInput.select();


    // Enter = Save
    editInput.addEventListener("keydown", function (e) {

        if (e.key === "Enter") {
            updateTask(id);
        }

        // Escape = Cancel
        if (e.key === "Escape") {
            renderTasks(searchInput.value);
        }

    });
}


// UPDATE TASK
function updateTask(id) {

    const editInput = document.getElementById(`edit-${id}`);

    if (!editInput) return;


    const updatedText = editInput.value.trim();

    if (updatedText === "") {
        alert("Task cannot be empty!");
        editInput.focus();
        return;
    }


    const task = tasks.find(task => task.id === id);

    if (!task) return;


    task.text = updatedText;

    saveTasks();
    renderTasks(searchInput.value);
}


// Delete Task
function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks(searchInput.value);
}


// Update Stats
function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const active = total - completed;


    totalTasks.textContent = total;
    activeTasks.textContent = active;
    completedTasks.textContent = completed;
}


// Search Tasks
searchInput.addEventListener("input", function () {

    renderTasks(searchInput.value);

});


// Clear Completed
clearCompletedBtn.addEventListener("click", function () {

    tasks = tasks.filter(
        task => !task.completed
    );

    saveTasks();
    renderTasks(searchInput.value);

});


// Add button
addBtn.addEventListener("click", addTask);


// Enter key = Add Task
taskInput.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {
        addTask();
    }

});


// Initial Render
renderTasks();