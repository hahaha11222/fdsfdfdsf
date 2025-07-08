
document.addEventListener("DOMContentLoaded", () => {
  const openModalBtn = document.getElementById("openModalBtn");
  const modal = document.getElementById("folderModal");
  const entryCountEl = document.getElementById("entryCount");
  const topDots = document.querySelector(".top-dots");
  const mainContent = document.querySelector("main.folder-empty-view");

  // Show modal
  openModalBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  // Close modal on outside click
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // Track entry count with localStorage
  function updateEntryCount() {
    let count = localStorage.getItem("entryCount");
    count = count ? parseInt(count) + 1 : 1;
    localStorage.setItem("entryCount", count);
    entryCountEl.textContent = count;
  }

  updateEntryCount();

  // Toggle typography
  topDots.addEventListener("click", () => {
    mainContent.classList.toggle("book-font");
  });
});
