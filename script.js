// Function to handle drag start event
function dragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
}

// Function to handle drag over event
function allowDrop(event) {
  event.preventDefault();
}

// Function to handle drop event
function drop(event) {
  event.preventDefault();
  const cardId = event.dataTransfer.getData("text/plain");
  const card = document.getElementById(cardId);
  const targetColumn = event.target.closest('.column');

  // Sort the tasks based on their priority
  const cards = Array.from(targetColumn.querySelectorAll('.card'));
  cards.push(card);
  cards.sort((a, b) => {
    const priorityA = a.querySelector('select[name="priority"]').value;
    const priorityB = b.querySelector('select[name="priority"]').value;
    const order = { high: 1, medium: 2, low: 3 };
    return order[priorityA] - order[priorityB];
  });

  // Append the sorted cards to the target column
  cards.forEach(card => targetColumn.appendChild(card));

  saveData();
}

// Save task data to the browser's local storage
function saveData() {
  const columns = document.querySelectorAll('.column');
  
  const tasks = columns.map(column => {
    const columnId = column.id;
    const cards = column.querySelectorAll('.card');
    
    return cards.map(card => {
      const title = card.querySelector('input[type="text"]').value;
      const tag = card.querySelector('select').value;
      // Get the priority value from the card
      const priority = card.querySelector('select[name="priority"]').value;
      return { title, tag, columnId, priority };
    });
  }).flat();

  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Reorder the tasks based on their priority
  columns.forEach(column => {
    const cards = Array.from(column.querySelectorAll('.card'));
    cards.sort((a, b) => {
      const priorityA = a.querySelector('select[name="priority"]').value;
      const priorityB = b.querySelector('select[name="priority"]').value;
      const order = { high: 1, medium: 2, low: 3 };
      return order[priorityA] - order[priorityB];
    });

    // Append the sorted cards to the column
    cards.forEach(card => column.appendChild(card));
  });
}
// Load task data from the browser's local storage
function loadData() {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  
  if (tasks) {
    tasks.forEach(task => {
      createCard(task.title, task.tag, task.columnId, task.priority);
    });
  }
}

// Function to create a new task card
function createCard(title, tag, columnId = "todo-column", priority = "medium") {
  const card = document.createElement('div');
  card.className = 'card';
  card.draggable = true;
  card.id = `card-${Date.now()}`;
  card.addEventListener('dragstart', dragStart);

  const optionsHTML = ['homework', 'grocery', 'goals', 'chores'].map(option => {
    return `<option value="${option}">${option.charAt(0).toUpperCase() + option.slice(1)}</option>`;
  }).join('');

  // Add a priority select element
  const priorityOptionsHTML = ['high', 'medium', 'low'].map(option => {
    return `<option value="${option}">${option.charAt(0).toUpperCase() + option.slice(1)}</option>`;
  }).join('');

  card.innerHTML = `
    <input type="text" value="${title}">
    <select>${optionsHTML}</select>
    <select name="priority">${priorityOptionsHTML}</select>
    <button>Delete</button>
  `;

  card.querySelector('input').addEventListener('input', saveData);
  card.querySelector('select').value = tag;
  card.querySelector('select').addEventListener('change', saveData);
  
  // Set the priority value and add an event listener
  card.querySelector('select[name="priority"]').value = priority;
  card.querySelector('select[name="priority"]').addEventListener('change', saveData);
  
  card.addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
      deleteCard(card);
    }
  });

  const column = document.getElementById(columnId);
  column.appendChild(card);
}

// Function to delete a task card
function deleteCard(card) {
  const column = card.parentNode;
  column.removeChild(card);
  saveData();
}
// Add task dynamically
function addTask() {
const taskInput = document.getElementById('task-input');
const taskTitle = taskInput.value.trim();
if (taskTitle === '') {
return;
}

createCard(taskTitle, 'homework', 'todo-column');
taskInput.value = '';
saveData();
}
// Create initial tasks (added to "To Do" column by default)
document.addEventListener('DOMContentLoaded', function() {
createCard("Task1", "homework");
createCard("Task2", "grocery");
createCard("Task3", "goals");
createCard("Task4", "chores");
});
// Load task data from the browser's local storage on page load
window.onload = function() {
loadData();
};
