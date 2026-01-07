 let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const taskForm = document.getElementById("taskForm");
    const taskList = document.getElementById("taskList");
    const searchInput = document.getElementById("search");
    const filterPriority = document.getElementById("filterPriority");

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function clearForm() {
        taskForm.reset();
        document.getElementById("taskId").value = "";
    }

    function addTask(e) {
        e.preventDefault();

        const id = document.getElementById("taskId").value;
        const title = document.getElementById("title").value.trim();
        const description = document.getElementById("description").value;
        const dueDate = document.getElementById("dueDate").value;
        const priority = document.getElementById("priority").value;

        if (!title || !dueDate) {
            alert("Title and Due Date are required!");
            return;
        }

        if (id) {
            const task = tasks.find(t => t.id === id);
            task.title = title;
            task.description = description;
            task.dueDate = dueDate;
            task.priority = priority;
        } else {
            tasks.push({
                id: Date.now().toString(),
                title,
                description,
                dueDate,
                priority
            });
        }

        saveTasks();
        displayTasks();
        clearForm();
    }

    function displayTasks() {
        taskList.innerHTML = "";

        const searchText = searchInput.value.toLowerCase();
        const priorityFilter = filterPriority.value;

        const filteredTasks = tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchText);
            const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
            return matchesSearch && matchesPriority;
        });

        filteredTasks.forEach(task => {
            const div = document.createElement("div");
            div.className = `task ${task.priority}`;

            div.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description || "No description"}</p>
                <p><strong>Due:</strong> ${task.dueDate}</p>
                <p><strong>Priority:</strong> ${task.priority}</p>
                <div class="task-buttons">
                    <button onclick="editTask('${task.id}')">Edit</button>
                    <button onclick="deleteTask('${task.id}')">Delete</button>
                </div>
            `;

            taskList.appendChild(div);
        });
    }

    function editTask(id) {
        const task = tasks.find(t => t.id === id);
        document.getElementById("taskId").value = task.id;
        document.getElementById("title").value = task.title;
        document.getElementById("description").value = task.description;
        document.getElementById("dueDate").value = task.dueDate;
        document.getElementById("priority").value = task.priority;
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        displayTasks();
    }

    taskForm.addEventListener("submit", addTask);
    searchInput.addEventListener("input", displayTasks);
    filterPriority.addEventListener("change", displayTasks);

    displayTasks();
