const categoriesDiv = document.getElementById('categories');
const notesDiv = document.getElementById('notes');
const modal = document.getElementById('modal');
const inputTitle = document.getElementById('input-title');
const inputDesc = document.getElementById('input-description');
const modalTitle = document.getElementById('modal-title');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const addCatBtn = document.getElementById('add-category-btn');
const addNoteBtn = document.getElementById('add-note-btn');
const backBtn = document.getElementById('back-btn');
const categorySection = document.getElementById('category-section');
const notesSection = document.getElementById('notes-section');
const categoryTitle = document.getElementById('category-title');

let categories = JSON.parse(localStorage.getItem('pokemonNotes')) || {};
let currentCategory = null;
let editMode = null;

// 🧩 Render all categories
function renderCategories() {
  categoriesDiv.innerHTML = '';
  for (let name in categories) {
    const div = document.createElement('div');
    div.className = 'category';
    div.textContent = name;
    div.onclick = () => openCategory(name);
    categoriesDiv.appendChild(div);
  }
}

// 📁 Open category and show notes
function openCategory(name) {
  currentCategory = name;
  categoryTitle.textContent = name;
  categorySection.classList.add('hidden');
  notesSection.classList.remove('hidden');
  renderNotes();
}

// 📓 Render notes
function renderNotes() {
  notesDiv.innerHTML = '';
  categories[currentCategory].forEach((note, index) => {
    const div = document.createElement('div');
    div.className = 'note';
    div.innerHTML = `
      <strong>${note.title}</strong>
      <small>${note.description}</small>
      <button onclick="editNote(${index})">✏ Edit</button>
      <button onclick="deleteNote(${index})">🗑 Delete</button>
    `;
    notesDiv.appendChild(div);
  });
}

// 🆕 Add Category or Note
function openModal(type) {
  modal.classList.remove('hidden');
  modalTitle.textContent = type === 'category' ? 'Add Category' : 'Add Note';
  inputTitle.value = '';
  inputDesc.value = '';
  editMode = null;

  saveBtn.onclick = () => {
    const title = inputTitle.value.trim();
    const desc = inputDesc.value.trim();

    if (!title) return alert('Please enter a title');

    if (type === 'category') {
      categories[title] = [];
      saveData();
      renderCategories();
    } else {
      categories[currentCategory].push({ title, description: desc });
      saveData();
      renderNotes();
    }
    modal.classList.add('hidden');
  };
}

// 💾 Save to localStorage
function saveData() {
  localStorage.setItem('pokemonNotes', JSON.stringify(categories));
}

// 🗑 Delete note
function deleteNote(index) {
  if (confirm('Delete this note?')) {
    categories[currentCategory].splice(index, 1);
    saveData();
    renderNotes();
  }
}

// ✏ Edit note
function editNote(index) {
  const note = categories[currentCategory][index];
  openModal('note');
  inputTitle.value = note.title;
  inputDesc.value = note.description;
  modalTitle.textContent = 'Edit Note';
  editMode = index;

  saveBtn.onclick = () => {
    note.title = inputTitle.value.trim();
    note.description = inputDesc.value.trim();
    saveData();
    renderNotes();
    modal.classList.add('hidden');
  };
}

// 🔙 Back button
backBtn.onclick = () => {
  currentCategory = null;
  notesSection.classList.add('hidden');
  categorySection.classList.remove('hidden');
};

// ❌ Cancel modal
cancelBtn.onclick = () => modal.classList.add('hidden');

// ➕ Add new
addCatBtn.onclick = () => openModal('category');
addNoteBtn.onclick = () => openModal('note');

// 🏁 Initial render
renderCategories();
