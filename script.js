const TMDB_API_KEY = "cb169c1f6fad54c5fd4d3eb920e3420e"; // Replace with your actual TMDb API key
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchGrid = document.getElementById("searchGrid");
const homeBtn = document.getElementById("homeBtn");
const tabs = document.querySelectorAll(".nav-tab");
const sections = document.querySelectorAll(".section-content");
const toggleMode = document.getElementById("toggleMode");

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");

// LocalStorage movie state
let movieData = {
  watchlist: [],
  watching: [],
  finished: []
};

loadFromStorage();
renderAllSections();

// Search functionality
searchInput.addEventListener("input", async (e) => {
  const query = e.target.value.trim();
  if (query.length > 0) {
    searchResults.classList.remove("hidden");
    document.getElementById("sections").classList.add("hidden");
    const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    showSearchResults(data.results || []);
  } else {
    searchResults.classList.add("hidden");
    document.getElementById("sections").classList.remove("hidden");
  }
});

homeBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchGrid.innerHTML = "";
  searchResults.classList.add("hidden");
  document.getElementById("sections").classList.remove("hidden");
});

// Theme toggle
toggleMode.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  document.documentElement.classList.toggle("light");
});

// Navigation tabs
tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(tab => tab.classList.remove("active"));
    btn.classList.add("active");
    const tabName = btn.dataset.tab;
    sections.forEach(section => {
      section.classList.add("hidden");
      if (section.id === tabName) section.classList.remove("hidden");
    });
  });
});

// Render search results
function showSearchResults(movies) {
  searchGrid.innerHTML = "";
  if (!movies.length) {
    searchGrid.innerHTML = "<p class='text-sm text-gray-500'>No results found.</p>";
    return;
  }

  movies.forEach(movie => {
    const isAdded = isInAnyList(movie.id);
    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
      <div class="p-2 text-center">
        <p class="text-sm font-semibold">${movie.title}</p>
        <button class="add-btn ${isAdded ? 'added' : ''}" data-id="${movie.id}" data-title="${movie.title}">
          ${isAdded ? "✓ Added" : "Add to Watchlist"}
        </button>
      </div>
    `;
    const addBtn = card.querySelector("button");
    if (!isAdded) {
      addBtn.addEventListener("click", () => {
        movieData.watchlist.push({ id: movie.id, title: movie.title });
        saveToStorage();
        addBtn.classList.add("added");
        addBtn.textContent = "✓ Added";
        renderAllSections();
      });
    }
    searchGrid.appendChild(card);
  });
}

// Show modal with full info (optional)
function openModal(contentHTML) {
  modal.classList.remove("hidden");
  modalContent.innerHTML = contentHTML;
}
function closeModal() {
  modal.classList.add("hidden");
}

// Check if movie is in any list
function isInAnyList(id) {
  return Object.values(movieData).some(list => list.some(m => m.id === id));
}

// Render all tabs
function renderAllSections() {
  ["watchlist", "watching", "finished"].forEach(key => {
    const container = document.querySelector(`#${key} .movie-grid`);
    container.innerHTML = "";
    const list = movieData[key];

    list.forEach(movie => {
      const card = document.createElement("div");
      card.className = "movie-card";
      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2/${movie.poster_path || ""}" alt="${movie.title}">
        <div class="p-2 text-center">
          <p class="text-sm font-semibold">${movie.title}</p>
          <div class="mt-1 flex justify-center gap-2 text-xs">
            ${key !== "watchlist" ? `<button class="move-btn" data-id="${movie.id}" data-from="${key}" data-to="watchlist">To Watchlist</button>` : ""}
            ${key !== "watching" ? `<button class="move-btn" data-id="${movie.id}" data-from="${key}" data-to="watching">To Watching</button>` : ""}
            ${key !== "finished" ? `<button class="move-btn" data-id="${movie.id}" data-from="${key}" data-to="finished">To Finished</button>` : ""}
            <button class="remove-btn text-red-600" data-id="${movie.id}" data-from="${key}">Remove</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  });

  setupButtons();
}

function setupButtons() {
  document.querySelectorAll(".move-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = +btn.dataset.id;
      const from = btn.dataset.from;
      const to = btn.dataset.to;
      const movie = movieData[from].find(m => m.id === id);
      if (movie) {
        movieData[from] = movieData[from].filter(m => m.id !== id);
        movieData[to].push(movie);
        saveToStorage();
        renderAllSections();
      }
    });
  });

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = +btn.dataset.id;
      const from = btn.dataset.from;
      movieData[from] = movieData[from].filter(m => m.id !== id);
      saveToStorage();
      renderAllSections();
    });
  });
}

function saveToStorage() {
  localStorage.setItem("movieTrackerData", JSON.stringify(movieData));
}
function loadFromStorage() {
  const saved = localStorage.getItem("movieTrackerData");
  if (saved) movieData = JSON.parse(saved);
}
