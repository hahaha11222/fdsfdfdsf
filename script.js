const openModalBtn = document.getElementById("openModalBtn");
const folderModal = document.getElementById("folderModal");
const welcomeModal = document.getElementById("welcomeModal");
const welcomeCloseBtn = document.getElementById("welcomeCloseBtn");
const entryCountEl = document.getElementById("entryCount");
const modalInput = document.querySelector(".modal-input");
const modalCreateBtn = document.querySelector("#folderModal .modal-create-btn");
const folderEmptyText = document.querySelector(".folder-empty-text");

const folderFlipCard = document.getElementById("folderFlipCard");
const folderFlipInner = document.getElementById("folderFlipInner");

let folders = [];
let currentPage = 0;
let totalPages = 0;

const mainFolderView = document.querySelector("main.folder-empty-view");

let folderDetailView = null;
let currentFolderIndex = null;

let addSceneModal = null;
let addSceneForm = null;

// Open folder modal
openModalBtn.addEventListener("click", () => {
  modalInput.value = "";
  folderModal.classList.remove("hidden");
});

// Close modals on outside click
window.addEventListener("click", (e) => {
  if (e.target === folderModal) folderModal.classList.add("hidden");
  if (e.target === welcomeModal) {
    welcomeModal.classList.add("hidden");
    startEntryCount();
  }
  if (e.target === addSceneModal) addSceneModal.classList.add("hidden");
});

// Close welcome modal on button click
welcomeCloseBtn.addEventListener("click", () => {
  welcomeModal.classList.add("hidden");
  startEntryCount();
});

// Create folder
modalCreateBtn.addEventListener("click", () => {
  const name = modalInput.value.trim();
  if (!name) return;
  folders.push(name);
  updateFoldersUI();
  folderModal.classList.add("hidden");
});

// Create Add Scene Modal with approved design
function createAddSceneModal() {
  addSceneModal = document.createElement("div");
  addSceneModal.id = "addSceneModal";
  addSceneModal.className = "modal hidden";
  addSceneModal.innerHTML = `
    <div class="modal-content">
      <div class="modal-title">Add a Scene / Movie</div>
      <input type="text" name="title" placeholder="Movie Title" class="modal-input" />
      <input type="date" name="releaseDate" class="modal-input" />
      <input type="number" name="rating" min="0" max="10" step="0.1" placeholder="Rating (0-10)" class="modal-input" />
      <select name="status" class="modal-input">
        <option value="" disabled selected>Select Status</option>
        <option value="Watchlist">Watchlist</option>
        <option value="Watching">Watching</option>
        <option value="Finished">Finished</option>
      </select>
      <button class="modal-create-btn">Add Scene</button>
    </div>
  `;
  document.body.appendChild(addSceneModal);

  addSceneForm = addSceneModal.querySelector("div.modal-content");

  // Add submit button functionality: just log data for now
  const addBtn = addSceneModal.querySelector("button.modal-create-btn");
  addBtn.addEventListener("click", () => {
    const title = addSceneModal.querySelector("input[name='title']").value.trim();
    const releaseDate = addSceneModal.querySelector("input[name='releaseDate']").value;
    const rating = addSceneModal.querySelector("input[name='rating']").value;
    const status = addSceneModal.querySelector("select[name='status']").value;

    if (!title || !releaseDate || !rating || !status) {
      alert("Please fill out all fields.");
      return;
    }

    console.log("Movie data submitted:", { title, releaseDate, rating, status });

    // Just close modal for now
    addSceneModal.classList.add("hidden");
  });
}

// Initialize add scene modal on page load
createAddSceneModal();

function updateFoldersUI() {
  if (folders.length > 0) folderEmptyText.style.display = "none";
  else folderEmptyText.style.display = "block";

  folderFlipInner.innerHTML = "";
  const pages = [];
  pages.push(folders.slice(0, 4));
  for (let i = 4; i < folders.length; i += 8) {
    pages.push(folders.slice(i, i + 8));
  }
  totalPages = pages.length;

  pages.forEach((pageFolders, index) => {
    const face = document.createElement("div");
    face.className = "folder-flip-face";
    face.style.display = index === currentPage ? "block" : "none";
    face.style.position = "absolute";
    face.style.top = "0";
    face.style.left = "0";
    face.style.width = "100%";
    face.style.backfaceVisibility = "hidden";

    const ul = document.createElement("ul");
    ul.className = "folder-list";

    pageFolders.forEach((title, folderIdx) => {
      const li = document.createElement("li");
      li.textContent = title;
      li.tabIndex = 0;
      li.addEventListener("click", () => openFolderDetail(index, folderIdx));
      ul.appendChild(li);
    });

    face.appendChild(ul);

    const btnWrapper = document.createElement("div");
    btnWrapper.style.textAlign = "center";
    btnWrapper.style.display = "flex";
    btnWrapper.style.justifyContent = "center";
    btnWrapper.style.gap = "0.5rem";

    if (index > 0) {
      const backBtn = document.createElement("button");
      backBtn.className = "flip-btn";
      backBtn.textContent = "show less";
      backBtn.addEventListener("click", () => {
        currentPage = index - 1;
        animateFlip();
      });
      btnWrapper.appendChild(backBtn);
    }

    if (index < pages.length - 1) {
      const moreBtn = document.createElement("button");
      moreBtn.className = "flip-btn";
      moreBtn.textContent = "more folders";
      moreBtn.addEventListener("click", () => {
        currentPage = index + 1;
        animateFlip();
      });
      btnWrapper.appendChild(moreBtn);
    }

    face.appendChild(btnWrapper);
    folderFlipInner.appendChild(face);
  });

  animateFlip();
}

function animateFlip() {
  folderFlipInner.style.transition = "opacity 0.3s ease";
  folderFlipInner.style.opacity = 0;
  setTimeout(() => {
    const allFaces = folderFlipInner.querySelectorAll(".folder-flip-face");
    allFaces.forEach((face, index) => {
      face.style.display = index === currentPage ? "block" : "none";
    });
    folderFlipInner.style.opacity = 1;
  }, 200);
}

function openFolderDetail(pageIndex, folderIdx) {
  let realIdx = pageIndex === 0 ? folderIdx : 4 + (pageIndex - 1) * 8 + folderIdx;
  currentFolderIndex = realIdx;

  if (!folderDetailView) {
    folderDetailView = document.createElement("section");
    folderDetailView.className = "folder-detail-view";
    document.body.appendChild(folderDetailView);
  }

  folderDetailView.innerHTML = "";

  const backBtn = document.createElement("button");
  backBtn.className = "back-btn";
  backBtn.textContent = "← Back to your folders";
  backBtn.addEventListener("click", () => {
    folderDetailView.style.display = "none";
    mainFolderView.style.display = "block";
  });
  folderDetailView.appendChild(backBtn);

  const filmTag = document.createElement("div");
  filmTag.className = "film-tag-frame";
  filmTag.style.margin = "1rem auto";
  filmTag.style.maxWidth = "400px";
  filmTag.innerHTML = `
    <div class="film-tag-label">folder</div>
    <div class="film-tag-content">
      🎞️ ${folders[realIdx]} · entry ${realIdx + 1} · ${new Date().toLocaleDateString()}
    </div>
  `;
  folderDetailView.appendChild(filmTag);

  const movieSection = document.createElement("div");
  movieSection.style.marginTop = "2rem";
  movieSection.style.maxWidth = "420px";
  movieSection.style.marginLeft = "auto";
  movieSection.style.marginRight = "auto";

  const addMovieBtn = document.createElement("button");
  addMovieBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" style="width: 18px; vertical-align: middle; margin-right: 6px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    </svg>
    Add Scene
  `;
  addMovieBtn.className = "flip-btn";
  addMovieBtn.style.fontWeight = "bold";
  addMovieBtn.style.marginBottom = "1.2rem";

  // Open Add Scene modal on button click
  addMovieBtn.addEventListener("click", () => {
    addSceneModal.classList.remove("hidden");
  });

  movieSection.appendChild(addMovieBtn);

  folderDetailView.appendChild(movieSection);

  mainFolderView.style.display = "none";
  folderDetailView.style.display = "block";
}

function updateEntryCount() {
  let count = localStorage.getItem("entryCount");
  count = count ? parseInt(count) + 1 : 1;
  localStorage.setItem("entryCount", count);
  entryCountEl.textContent = count;
  entryCountEl.style.opacity = 1;
}

function startEntryCount() {
  updateEntryCount();
}

window.addEventListener("DOMContentLoaded", () => {
  const hasVisited = localStorage.getItem("hasVisited");
  if (!hasVisited) {
    welcomeModal.classList.remove("hidden");
    localStorage.setItem("hasVisited", "true");
    entryCountEl.textContent = "–";
    entryCountEl.style.opacity = 0;
  } else {
    startEntryCount();
  }
});
