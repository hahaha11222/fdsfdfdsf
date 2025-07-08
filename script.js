const openModalBtn = document.getElementById("openModalBtn");
const folderModal = document.getElementById("folderModal");
const welcomeModal = document.getElementById("welcomeModal");
const welcomeCloseBtn = document.getElementById("welcomeCloseBtn");
const entryCountEl = document.getElementById("entryCount");

// Show folder modal when [+] is clicked
openModalBtn.addEventListener("click", () => {
  folderModal.classList.remove("hidden");
});

// Close folder modal on outside click
window.addEventListener("click", (e) => {
  if (e.target === folderModal) {
    folderModal.classList.add("hidden");
  }
  if (e.target === welcomeModal) {
    welcomeModal.classList.add("hidden");
    startEntryCount();
  }
});

// Close welcome modal on button click
welcomeCloseBtn.addEventListener("click", () => {
  welcomeModal.classList.add("hidden");
  startEntryCount();
});

// Function to update entry count in localStorage and UI
function updateEntryCount() {
  let count = localStorage.getItem("entryCount");

  if (!count) {
    count = 1;
  } else {
    count = parseInt(count) + 1;
  }

  localStorage.setItem("entryCount", count);
  entryCountEl.textContent = count;
  entryCountEl.style.opacity = 1; // show with fade-in from CSS
}

// Start entry count, called after welcome modal closes or directly if not first visit
function startEntryCount() {
  updateEntryCount();
}

// On page load: check if first visit
window.addEventListener("DOMContentLoaded", () => {
  const hasVisited = localStorage.getItem("hasVisited");
  if (!hasVisited) {
    // First visit - show welcome modal
    welcomeModal.classList.remove("hidden");
    localStorage.setItem("hasVisited", "true");
    entryCountEl.textContent = "–"; // hide count until modal closes
    entryCountEl.style.opacity = 0;
  } else {
    // Not first visit - show entry count immediately
    startEntryCount();
  }
});
