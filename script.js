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

// Create container for folder detail view dynamically
let folderDetailView = null;
let currentFolderIndex = null;

openModalBtn.addEventListener("click", () => {
  modalInput.value = "";
  folderModal.classList.remove("hidden");
});

window.addEventListener("click", (e) => {
  if (e.target === folderModal) folderModal.classList.add("hidden");
  if (e.target === welcomeModal) {
    welcomeModal.classList.add("hidden");
    startEntryCount();
  }
});

welcomeCloseBtn.addEventListener("click", () => {
  welcomeModal.classList.add("hidden");
  startEntryCount();
});

modalCreateBtn.addEventListener("click", () => {
  const name = modalInput.value.trim();
  if (!name) return;
  folders.push(name);
  updateFoldersUI();
  folderModal.classList.add("hidden");
});

function updateFoldersUI() {
  if (folders.length > 0) folderEmptyText.style.display = "none";
  else folderEmptyText.style.display = "block";

  folderFlipInner.innerHTML = "";

  const pages = [];

  // First page: 4 folders
  pages.push(folders.slice(0, 4));

  // Next pages: 8 folders each
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
      li.tabIndex = 0; // for accessibility
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
  // Calculate actual folder index
  let realIdx = pageIndex === 0 ? folderIdx : 4 + (pageIndex - 1) * 8 + folderIdx;
  currentFolderIndex = realIdx;

  if (!folderDetailView) {
    folderDetailView = document.createElement("section");
    folderDetailView.className = "folder-detail-view";
    document.body.appendChild(folderDetailView);
  }
  
  folderDetailView.innerHTML = "";

  // Back button
  const backBtn = document.createElement("button");
  backBtn.className = "back-btn";
  backBtn.textContent = "← Back to your folders";
  backBtn.addEventListener("click", () => {
    folderDetailView.style.display = "none";
    mainFolderView.style.display = "block";
  });
  folderDetailView.appendChild(backBtn);

  // Folder title with film tag style
  const filmTag = document.createElement("div");
  filmTag.className = "film-tag-frame";
  filmTag.style.margin = "1rem auto";
  filmTag.style.maxWidth = "400px";
  filmTag.innerHTML = `
    <div class="film-tag-label">folder</div>
    <div class="film-tag-content">
      ${folders[realIdx]} · entry ${realIdx + 1} · ${new Date().toLocaleDateString()}
    </div>
  `;
  folderDetailView.appendChild(filmTag);

  // Poetic quote under title
  const quote = document.createElement("div");
  quote.className = "folder-detail-message";
  quote.innerHTML = `
    <div class="letter-quote">“The frames we keep tell stories beyond the reel.”</div>
    <div class="letter-source">— marga 🎬</div>
  `;
  folderDetailView.appendChild(quote);

  // Movie list (empty for now with Add Movie button)
  const movieSection = document.createElement("div");
  movieSection.style.marginTop = "2rem";
  movieSection.style.maxWidth = "420px";
  movieSection.style.marginLeft = "auto";
  movieSection.style.marginRight = "auto";

  const addMovieBtn = document.createElement("button");
  addMovieBtn.textContent = "+ Add Scene";
  addMovieBtn.className = "flip-btn";
  addMovieBtn.style.fontWeight = "bold";
  addMovieBtn.style.marginBottom = "1rem";

  addMovieBtn.addEventListener("click", () => {
    alert(`Add movie functionality will come here for folder "${folders[realIdx]}"`);
  });

  movieSection.appendChild(addMovieBtn);

  // Placeholder for movies (empty)
  const movieList = document.createElement("div");
  movieList.style.fontStyle = "italic";
  movieList.style.color = "#777";
  movieList.textContent = "No scenes yet. Start your cinematic journey here.";

  movieSection.appendChild(movieList);
  folderDetailView.appendChild(movieSection);

  // Show detail, hide folder list
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
