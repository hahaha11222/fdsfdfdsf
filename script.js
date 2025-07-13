const TMDB_API_KEY = "cb169c1f6fad54c5fd4d3eb920e3420e";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const sectionContainers = {
  watchlist: document.querySelector("#watchlist .grid"),
  watching: document.querySelector("#watching .grid"),
  finished: document.querySelector("#finished .grid")
};

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const fab = document.getElementById("fab");

let movieData = {
  watchlist: [],
  watching: [],
  finished: [],
  notes: {}
};

loadFromStorage();
renderAllSections();

searchInput.addEventListener("keyup", async (e) => {
  const query = e.target.value.trim();
  if (query.length < 2) return (searchResults.innerHTML = "");
  const data = await searchMovies(query);
  renderSearchResults(data.results);
});

document.querySelectorAll(".tab-btn").forEach((btn) =>
  btn.addEventListener("click", () => {
    document.querySelectorAll(".movie-section").forEach((sec) => sec.classList.add("hidden"));
    document.getElementById(btn.dataset.tab).classList.remove("hidden");
  })
);

document.getElementById("toggleMode").onclick = () => {
  document.documentElement.classList.toggle("dark");
};

fab.onclick = () => {
  searchInput.focus();
};

function saveToStorage() {
  localStorage.setItem("movieTracker", JSON.stringify(movieData));
}
function loadFromStorage() {
  const data = localStorage.getItem("movieTracker");
  if (data) movieData = JSON.parse(data);
}
function renderAllSections() {
  ["watchlist", "watching", "finished"].forEach(async (listType) => {
    sectionContainers[listType].innerHTML = "";
    for (const id of movieData[listType]) {
      const movie = await getMovieDetails(id);
      const card = createMovieCard(movie, listType);
      sectionContainers[listType].appendChild(card);
    }
  });
}
function createMovieCard(movie, category) {
  const div = document.createElement("div");
  div.className = "movie-card cursor-pointer";
  div.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" />
    <div class="p-2">
      <h3 class="font-bold text-sm">${movie.title}</h3>
      <p class="text-xs text-gray-500 dark:text-gray-300">${movie.release_date?.split("-")[0]}</p>
      <textarea class="w-full text-xs mt-1 border rounded p-1" placeholder="Note..." onchange="saveNote(${movie.id}, this.value)">${movieData.notes[movie.id] || ""}</textarea>
      <div class="mt-2 flex flex-col text-xs space-y-1">
        ${category !== "watchlist" ? `<button onclick="moveMovie(event, ${movie.id}, '${category}', 'watchlist')">🎯 To Watchlist</button>` : ""}
        ${category !== "watching" ? `<button onclick="moveMovie(event, ${movie.id}, '${category}', 'watching')">👁 To Watching</button>` : ""}
        ${category !== "finished" ? `<button onclick="moveMovie(event, ${movie.id}, '${category}', 'finished')">✅ To Finished</button>` : ""}
        <button onclick="removeMovie(event, ${movie.id}, '${category}')" class="text-red-500">🗑 Remove</button>
      </div>
    </div>
  `;
  div.onclick = (e) => {
    if (e.target.tagName === "BUTTON" || e.target.tagName === "TEXTAREA") return;
    showMovieDetails(movie.id);
  };
  return div;
}
function renderSearchResults(results) {
  searchResults.innerHTML = "";
  results.forEach((movie) => {
    if (!movie.poster_path) return;
    const div = document.createElement("div");
    div.className = "movie-card";
    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" />
      <div class="p-2">
        <h3 class="font-bold text-sm">${movie.title}</h3>
        <p class="text-xs text-gray-500">${movie.release_date?.split("-")[0]}</p>
        <div class="mt-2 flex flex-col text-xs space-y-1">
          <button onclick="addMovie(${movie.id}, 'watchlist')">🎯 Add to Watchlist</button>
          <button onclick="addMovie(${movie.id}, 'watching')">👁 Add to Watching</button>
          <button onclick="addMovie(${movie.id}, 'finished')">✅ Add to Finished</button>
        </div>
      </div>
    `;
    searchResults.appendChild(div);
  });
}
async function searchMovies(query) {
  const res = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
  return res.json();
}
async function getMovieDetails(id) {
  const res = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`);
  return res.json();
}
function addMovie(id, category) {
  if (!movieData[category].includes(id)) {
    movieData[category].push(id);
    saveToStorage();
    renderAllSections();
  }
}
function moveMovie(e, id, from, to) {
  e.stopPropagation();
  movieData[from] = movieData[from].filter(mid => mid !== id);
  if (!movieData[to].includes(id)) movieData[to].push(id);
  saveToStorage();
  renderAllSections();
}
function removeMovie(e, id, from) {
  e.stopPropagation();
  movieData[from] = movieData[from].filter(mid => mid !== id);
  delete movieData.notes[id];
  saveToStorage();
  renderAllSections();
}
function saveNote(id, val) {
  movieData.notes[id] = val;
  saveToStorage();
}
function closeModal() {
  modal.classList.add("hidden");
}
async function showMovieDetails(id) {
  const movie = await getMovieDetails(id);
  const trailer = await getTrailer(id);
  const cast = await getCast(id);
  modalContent.innerHTML = `
    <h2 class="text-lg font-bold mb-2">${movie.title}</h2>
    <p class="text-sm">${movie.overview}</p>
    <p class="mt-2 text-sm">Genres: ${movie.genres.map(g => g.name).join(", ")}</p>
    <p class="text-sm">Runtime: ${movie.runtime} mins</p>
    <p class="text-sm">Rating: ${movie.vote_average}</p>
    <p class="text-sm">Cast: ${cast.slice(0,5).map(c => c.name).join(", ")}</p>
    ${trailer ? `<a class="text-blue-600 underline" href="https://youtube.com/watch?v=${trailer}" target="_blank">🎬 Watch Trailer</a>` : ""}
  `;
  modal.classList.remove("hidden");
}
async function getTrailer(id) {
  const res = await fetch(`${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}`);
  const data = await res.json();
  const yt = data.results.find(v => v.site === "YouTube" && v.type === "Trailer");
  return yt?.key || null;
}
async function getCast(id) {
  const res = await fetch(`${TMDB_BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}`);
  const data = await res.json();
  return data.cast || [];
}
