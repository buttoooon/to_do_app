/**
 * To-Do List Manager — app.js
 * JavaScript ES6+ | Логіка застосунку
 */

// ── Стан застосунку ──────────────────────────────────────────────────────
let tasks  = [];       // масив усіх завдань
let filter = 'all';   // поточний фільтр: 'all' | 'active' | 'done'

// ── Ініціалізація ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  renderTasks();

  // Додавання завдання клавішею Enter
  document.getElementById('taskInput')
    .addEventListener('keydown', e => {
      if (e.key === 'Enter') addTask();
    });
});

// ── LocalStorage ─────────────────────────────────────────────────────────
function loadFromStorage() {
  try {
    const saved = localStorage.getItem('todo_tasks');
    if (saved) tasks = JSON.parse(saved);
  } catch (e) {
    console.warn('Помилка читання localStorage:', e);
    tasks = [];
  }
}

function saveToStorage() {
  localStorage.setItem('todo_tasks', JSON.stringify(tasks));
}

// ── Додавання завдання ───────────────────────────────────────────────────
function addTask() {
  const input    = document.getElementById('taskInput');
  const taskText = input.value.trim();

  // Валідація
  if (taskText === '') {
    input.classList.add('error');
    input.focus();
    setTimeout(() => input.classList.remove('error'), 1500);
    return;
  }

  const newTask = {
    id:        Date.now(),
    text:      taskText,
    completed: false,
    createdAt: new Date().toLocaleString('uk-UA', {
      day:    '2-digit',
      month:  '2-digit',
      year:   'numeric',
      hour:   '2-digit',
      minute: '2-digit',
    }),
  };

  tasks.unshift(newTask);   // нове завдання — першим
  saveToStorage();
  renderTasks();

  input.value = '';
  input.focus();
}

// ── Зміна статусу ────────────────────────────────────────────────────────
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveToStorage();
  renderTasks();
}

// ── Редагування ──────────────────────────────────────────────────────────
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const newText = prompt('Редагувати завдання:', task.text);

  if (newText === null) return;           // натиснули Cancel
  if (newText.trim() === '') return;      // порожній текст — ігноруємо

  task.text = newText.trim();
  saveToStorage();
  renderTasks();
}

// ── Видалення ────────────────────────────────────────────────────────────
function deleteTask(id) {
  if (!confirm('Видалити це завдання?')) return;
  tasks = tasks.filter(t => t.id !== id);
  saveToStorage();
  renderTasks();
}

// ── Очищення виконаних ───────────────────────────────────────────────────
function clearCompleted() {
  const count = tasks.filter(t => t.completed).length;
  if (count === 0) return;
  if (!confirm(`Видалити ${count} виконаних завдань?`)) return;
  tasks = tasks.filter(t => !t.completed);
  saveToStorage();
  renderTasks();
}

// ── Фільтрація ───────────────────────────────────────────────────────────
function filterTasks(type) {
  filter = type;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const isActive = btn.getAttribute('onclick').includes(`'${type}'`);
    btn.classList.toggle('active', isActive);
  });
  renderTasks();
}

// ── Рендеринг ────────────────────────────────────────────────────────────
function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  // Фільтрація
  const visible = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'done')   return  t.completed;
    return true;
  });

  if (visible.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = filter === 'done'
      ? 'Немає виконаних завдань'
      : filter === 'active'
        ? 'Немає активних завдань'
        : 'Список порожній. Додайте перше завдання!';
    list.appendChild(empty);
  } else {
    visible.forEach(task => list.appendChild(createTaskElement(task)));
  }

  // Лічильник
  const activeCount = tasks.filter(t => !t.completed).length;
  document.getElementById('counter').textContent =
    `${activeCount} ${declension(activeCount, 'завдання', 'завдань', 'завдань')} залишилось`;
}

// ── Створення DOM-елемента завдання ──────────────────────────────────────
function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task-item' + (task.completed ? ' done' : '');

  // Чекбокс
  const cb = document.createElement('input');
  cb.type    = 'checkbox';
  cb.checked = task.completed;
  cb.addEventListener('change', () => toggleTask(task.id));

  // Текст
  const span = document.createElement('span');
  span.className   = 'task-text';
  span.textContent = task.text;  // textContent — безпечний (без XSS)

  // Дата
  const date = document.createElement('small');
  date.className   = 'task-date';
  date.textContent = task.createdAt;

  // Кнопка редагування
  const btnEdit = document.createElement('button');
  btnEdit.className   = 'btn-edit';
  btnEdit.title       = 'Редагувати';
  btnEdit.textContent = '✎';
  btnEdit.addEventListener('click', () => editTask(task.id));

  // Кнопка видалення
  const btnDel = document.createElement('button');
  btnDel.className   = 'btn-delete';
  btnDel.title       = 'Видалити';
  btnDel.textContent = '✕';
  btnDel.addEventListener('click', () => deleteTask(task.id));

  li.append(cb, span, date, btnEdit, btnDel);
  return li;
}

// ── Відмінювання числівників ─────────────────────────────────────────────
function declension(n, form1, form2, form5) {
  const abs = Math.abs(n) % 100;
  const n1  = abs % 10;
  if (abs > 10 && abs < 20) return form5;
  if (n1 > 1 && n1 < 5)    return form2;
  if (n1 === 1)             return form1;
  return form5;
}
