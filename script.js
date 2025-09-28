// ----- Helpers -----
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
}

function saveToStorage(tasks) {
    localStorage.setItem('horizon_tasks_v3', JSON.stringify(tasks));
}

function loadFromStorage() {
    const data = localStorage.getItem('horizon_tasks_v3');
    return data ? JSON.parse(data) : [];
}

function formatDate(dateStr) {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return isNaN(date) ? '' : date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getPriorityColor(priority) {
    switch (priority.toLowerCase()) {
        case 'high':
            return 'high';
        case 'medium':
            return 'medium';
        case 'low':
            return 'low';
        default:
            return '';
    }
}

// ----- State -----
let tasks = [];
let filter = 'all';
let editingId = null;

// ----- DOM Elements -----
const tasksList = document.getElementById('tasksList');
const searchInput = document.getElementById('searchInput');
const filters = document.getElementById('filters');
const sortPriorityBtn = document.getElementById('sortPriority');
const sortDueBtn = document.getElementById('sortDue');
const progressBarFill = document.getElementById('progressBarFill');
const progressText = document.getElementById('progressText');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

// Modal Elements
const openModalBtn = document.getElementById('openModalBtn');
const taskModal = document.getElementById('taskModal');
const modalTitle = document.getElementById('modalTitle');
const modalTaskTitle = document.getElementById('modalTaskTitle');
const modalTaskNotes = document.getElementById('modalTaskNotes');
const modalTaskTags = document.getElementById('modalTaskTags');
const modalTaskDue = document.getElementById('modalTaskDue');
const modalTaskPriority = document.getElementById('modalTaskPriority');
const taskForm = document.getElementById('taskForm');
const closeBtn = document.querySelector('.modal .close-btn');

// ----- Initialization -----
document.addEventListener('DOMContentLoaded', () => {
    tasks = loadFromStorage();
    renderTasks();
    renderProgress();
    setActiveFilter(document.querySelector('.filter-btn[data-filter="all"]'));
});

// ----- CRUD Functions -----
function addTask(title, notes, tags, due, priority) {
    const newTask = {
        id: generateId(),
        title,
        notes,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        done: false,
        created: new Date().toISOString(),
        due,
        priority
    };
    tasks.unshift(newTask);
    saveToStorage(tasks);
    renderTasks();
    renderProgress();
}

function editTask(id, title, notes, tags, due, priority) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.title = title;
        task.notes = notes;
        task.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        task.due = due;
        task.priority = priority;
        saveToStorage(tasks);
        renderTasks();
    }
}

function toggleTaskStatus(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.done = !task.done;
        saveToStorage(tasks);
        renderTasks();
        renderProgress();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveToStorage(tasks);
    renderTasks();
    renderProgress();
}

// ----- Rendering & Filtering -----
function renderTasks() {
    tasksList.innerHTML = '';
    const searchTerm = searchInput.value.toLowerCase();
    
    let filteredTasks = tasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm) || t.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        if (filter === 'all') return matchesSearch;
        if (filter === 'active') return matchesSearch && !t.done;
        if (filter === 'completed') return matchesSearch && t.done;
    });

    if (filteredTasks.length === 0) {
        tasksList.innerHTML = '<li class="empty-list">No tasks to display.</li>';
        return;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        li.classList.add(getPriorityColor(task.priority));
        li.classList.toggle('task-completed', task.done);
        
        const isOverdue = !task.done && task.due && new Date(task.due) < new Date();
        
        const tagsHtml = task.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        li.innerHTML = `
            <div class="task-checkbox-container">
                <input type="checkbox" class="task-checkbox" ${task.done ? 'checked' : ''}>
            </div>
            <div class="task-content">
                <span class="task-title">${task.title}</span>
                <div class="task-meta">
                    <span>
                        <i class="fas fa-exclamation-circle"></i> ${task.priority}
                    </span>
                    <span class="${isOverdue ? 'overdue' : ''}">
                        <i class="fas fa-calendar-alt"></i> ${formatDate(task.due)}
                    </span>
                    <span class="task-tags">${tagsHtml}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="edit-btn" aria-label="Edit task"><i class="fas fa-pen"></i></button>
                <button class="delete-btn" aria-label="Delete task"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        tasksList.appendChild(li);
    });
}

function renderProgress() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.done).length;
    let progressPercentage = 0;

    if (totalTasks > 0) {
        progressPercentage = Math.round((completedTasks / totalTasks) * 100);
    }
    
    progressBarFill.style.width = `${progressPercentage}%`;
    progressText.textContent = `${completedTasks} / ${totalTasks} tasks completed`;

    if (completedTasks === totalTasks && totalTasks > 0) {
        triggerConfetti();
    }
}

function setActiveFilter(element) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => button.classList.remove('active'));
    element.classList.add('active');
}

// ----- Modal Functions -----
function openModal(task = null) {
    taskModal.style.display = 'flex';
    if (task) {
        editingId = task.id;
        modalTitle.textContent = 'Edit Task';
        modalTaskTitle.value = task.title;
        modalTaskNotes.value = task.notes;
        modalTaskTags.value = task.tags.join(', ');
        modalTaskDue.value = task.due;
        modalTaskPriority.value = task.priority;
    } else {
        editingId = null;
        modalTitle.textContent = 'Add New Task';
        taskForm.reset();
    }
}

function closeModal() {
    taskModal.style.display = 'none';
    taskForm.reset();
}

// ----- Event Listeners -----
openModalBtn.addEventListener('click', () => openModal());
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target === taskModal) {
        closeModal();
    }
});

taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const title = modalTaskTitle.value.trim();
    if (title) {
        const notes = modalTaskNotes.value.trim();
        const tags = modalTaskTags.value.trim();
        const due = modalTaskDue.value;
        const priority = modalTaskPriority.value;
        
        if (editingId) {
            editTask(editingId, title, notes, tags, due, priority);
        } else {
            addTask(title, notes, tags, due, priority);
        }
        closeModal();
    }
});

searchInput.addEventListener('input', renderTasks);

filters.addEventListener('click', e => {
    if (e.target.dataset.filter) {
        filter = e.target.dataset.filter;
        renderTasks();
        setActiveFilter(e.target);
    }
});

tasksList.addEventListener('click', e => {
    const li = e.target.closest('li');
    if (!li) return;
    const id = li.dataset.id;
    
    if (e.target.closest('.task-checkbox-container')) {
        toggleTaskStatus(id);
    } else if (e.target.closest('.edit-btn')) {
        const taskToEdit = tasks.find(t => t.id === id);
        openModal(taskToEdit);
    } else if (e.target.closest('.delete-btn')) {
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask(id);
        }
    }
});

clearCompletedBtn.addEventListener('click', () => {
    if (tasks.some(t => t.done)) {
        if (confirm('Clear all completed tasks?')) {
            tasks = tasks.filter(t => !t.done);
            saveToStorage(tasks);
            renderTasks();
            renderProgress();
        }
    }
});

sortPriorityBtn.addEventListener('click', () => {
    console.log('You clicked on the Priority sort button.');
    const order = { High: 1, Medium: 2, Low: 3 };
    tasks.sort((a, b) => order[a.priority] - order[b.priority]);
    renderTasks();
});

sortDueBtn.addEventListener('click', () => {
    console.log('You clicked on the Due Date sort button.');
    tasks.sort((a, b) => {
        if (!a.due) return 1;
        if (!b.due) return -1;
        return new Date(a.due) - new Date(b.due);
    });
    renderTasks();
});

// ----- Confetti Effect -----
function triggerConfetti() {
    const duration = 2 * 1000;
    const end = Date.now() + duration;
    const colors = ['#5a67d8', '#434190', '#48bb78', '#ecc94b', '#f56565'];
    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors,
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors,
        });
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}