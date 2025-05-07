// Get DOM elements
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodo');
const todoList = document.getElementById('todoList');
const categorySelect = document.getElementById('categorySelect');
const filterButtons = document.querySelectorAll('.filter-btn');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');

// Initialize todos array from localStorage or empty array
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';
let currentPage = 1;
const todosPerPage = 5; // Number of todos to show per page

// Save todos to localStorage
const saveTodos = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
    console.log('Saved todos:', todos); // Debug log
};

// Create a new todo element
const createTodoElement = (todo) => {
    const todoItem = document.createElement('div');
    todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    todoItem.dataset.id = todo.id;

    const todoText = document.createElement('span');
    todoText.className = 'todo-text';
    todoText.textContent = todo.text;

    const todoCategory = document.createElement('span');
    todoCategory.className = `todo-category ${todo.category}`;
    todoCategory.textContent = todo.category.charAt(0).toUpperCase() + todo.category.slice(1);

    const todoActions = document.createElement('div');
    todoActions.className = 'todo-actions';

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editTodo(todo.id);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTodo(todo.id);

    // Complete/Incomplete button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = todo.completed ? 'incomplete-btn' : 'complete-btn';
    toggleBtn.textContent = todo.completed ? 'Incomplete' : 'Complete';
    toggleBtn.onclick = () => toggleTodo(todo.id);

    todoActions.appendChild(editBtn);
    todoActions.appendChild(deleteBtn);
    todoActions.appendChild(toggleBtn);

    todoItem.appendChild(todoText);
    todoItem.appendChild(todoCategory);
    todoItem.appendChild(todoActions);

    return todoItem;
};

// Filter todos based on current filter
const filterTodos = () => {
    console.log('Current filter:', currentFilter); // Debug log
    console.log('All todos:', todos); // Debug log
    
    const filtered = todos.filter(todo => {
        let shouldShow = false;
        switch (currentFilter) {
            case 'active':
                shouldShow = !todo.completed;
                break;
            case 'completed':
                shouldShow = todo.completed;
                break;
            case 'personal':
                shouldShow = todo.category === 'personal';
                break;
            case 'work':
                shouldShow = todo.category === 'work';
                break;
            default:
                shouldShow = true; // 'all' filter
        }
        console.log(`Todo ${todo.text}: shouldShow = ${shouldShow}`); // Debug log
        return shouldShow;
    });
    
    console.log('Filtered todos:', filtered); // Debug log
    return filtered;
};

// Get paginated todos
const getPaginatedTodos = () => {
    const filteredTodos = filterTodos();
    const startIndex = (currentPage - 1) * todosPerPage;
    const endIndex = startIndex + todosPerPage;
    return filteredTodos.slice(startIndex, endIndex);
};

// Update pagination controls
const updatePagination = () => {
    const filteredTodos = filterTodos();
    const totalPages = Math.ceil(filteredTodos.length / todosPerPage);
    
    // Update page info
    pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
    
    // Update button states
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
};

// Render filtered todos
const renderTodos = () => {
    todoList.innerHTML = '';
    const paginatedTodos = getPaginatedTodos();
    paginatedTodos.forEach(todo => {
        todoList.appendChild(createTodoElement(todo));
    });
    updatePagination();
};

// Add new todo
const addTodo = () => {
    const text = todoInput.value.trim();
    const category = categorySelect.value;
    if (text) {
        const newTodo = {
            id: Date.now(),
            text,
            category,
            completed: false
        };
        todos.push(newTodo);
        console.log('Added new todo:', newTodo); // Debug log
        saveTodos();
        // Reset to first page when adding new todo
        currentPage = 1;
        renderTodos();
        todoInput.value = '';
    }
};

// Edit todo
const editTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    const newText = prompt('Edit todo:', todo.text);
    if (newText !== null) {
        todo.text = newText.trim();
        saveTodos();
        renderTodos();
    }
};

// Delete todo
const deleteTodo = (id) => {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    // Adjust current page if needed
    const filteredTodos = filterTodos();
    const totalPages = Math.ceil(filteredTodos.length / todosPerPage);
    if (currentPage > totalPages) {
        currentPage = totalPages || 1;
    }
    renderTodos();
};

// Toggle todo completion status
const toggleTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        console.log('Toggled todo:', todo); // Debug log
        saveTodos();
        renderTodos();
    }
};

// Set active filter
const setFilter = (filter) => {
    currentFilter = filter;
    console.log('Setting filter to:', filter); // Debug log
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    // Reset to first page when changing filter
    currentPage = 1;
    renderTodos();
};

// Event listeners
addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
    });
});

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTodos();
    }
});

nextPageBtn.addEventListener('click', () => {
    const filteredTodos = filterTodos();
    const totalPages = Math.ceil(filteredTodos.length / todosPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTodos();
    }
});

// Clear localStorage and todos array for testing
localStorage.clear();
todos = [];

// Initial render
renderTodos(); 