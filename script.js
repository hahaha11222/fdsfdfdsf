function showPage(id) {
  document.querySelectorAll('.page-section').forEach(section => {
    section.classList.add('hidden');
  });
  document.getElementById(id).classList.remove('hidden');
  document.body.classList.toggle('theme-home', id === 'home');
}

function setTheme(theme) {
  document.body.className = `theme-${theme} theme-home`;
}

document.getElementById('profile-upload').addEventListener('change', function () {
  if (this.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('profile-pic').src = e.target.result;
    };
    reader.readAsDataURL(this.files[0]);
  }
});

function addMovie(type) {
  const titleInput = document.getElementById(`${type}-title`);
  const imageInput = document.getElementById(`${type}-image`);
  const movieList = document.getElementById(`${type}-movies`);

  const title = titleInput.value.trim();
  if (!title) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageData = e.target.result;
    const movieData = { title, image: imageData };
    saveMovie(type, movieData);
    const movieDiv = createMovieCard(title, null, type, imageData);
    movieList.appendChild(movieDiv);
  };

  if (imageInput.files.length > 0) {
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    const defaultImage = 'https://via.placeholder.com/150x220';
    const movieData = { title, image: defaultImage };
    saveMovie(type, movieData);
    const movieDiv = createMovieCard(title, null, type, defaultImage);
    movieList.appendChild(movieDiv);
  }

  titleInput.value = '';
  imageInput.value = '';
}

function createMovieCard(title, imageInput, listType, imageUrl = '') {
  const movieDiv = document.createElement('div');
  movieDiv.classList.add('movie');

  const img = document.createElement('img');

  if (imageInput && imageInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      img.src = e.target.result;
      movieDiv.dataset.image = e.target.result;
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else if (imageUrl) {
    img.src = imageUrl;
    movieDiv.dataset.image = imageUrl;
  } else {
    img.src = 'https://via.placeholder.com/150x220';
    movieDiv.dataset.image = 'https://via.placeholder.com/150x220';
  }

  const caption = document.createElement('p');
  caption.textContent = title;

  movieDiv.appendChild(img);
  movieDiv.appendChild(caption);

  movieDiv.addEventListener('click', () => {
    showActionPopup(movieDiv, title, listType);
  });

  return movieDiv;
}

function showActionPopup(movieDiv, title, listType) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '1000';

  const popup = document.createElement('div');
  popup.style.background = 'white';
  popup.style.color = 'black';
  popup.style.padding = '20px';
  popup.style.borderRadius = '8px';
  popup.style.textAlign = 'center';

  const titleEl = document.createElement('h3');
  titleEl.textContent = title;
  popup.appendChild(titleEl);

  let options = [];
  if (listType === 'watchlist') {
    options = ['Watch This', 'Remove'];
  } else if (listType === 'watching') {
    options = ['Finish Watching', 'Stop Watching'];
  }

  options.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.style.margin = '10px';
    btn.onclick = () => {
      if (option === 'Watch This') {
        moveMovie(title, listType, 'watching', movieDiv.dataset.image);
      } else if (option === 'Finish Watching') {
        moveMovie(title, listType, 'finished', movieDiv.dataset.image);
      } else if (option === 'Stop Watching' || option === 'Remove') {
        removeMovie(title, listType);
      }
      movieDiv.remove();
      document.body.removeChild(overlay);
    };
    popup.appendChild(btn);
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.onclick = () => document.body.removeChild(overlay);
  popup.appendChild(cancelBtn);

  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}

// --- LocalStorage Helpers ---

function saveMovie(type, movie) {
  const list = JSON.parse(localStorage.getItem(type)) || [];
  list.push(movie);
  localStorage.setItem(type, JSON.stringify(list));
}

function removeMovie(title, type) {
  let list = JSON.parse(localStorage.getItem(type)) || [];
  list = list.filter(movie => movie.title !== title);
  localStorage.setItem(type, JSON.stringify(list));
}

function moveMovie(title, fromType, toType, imageUrl) {
  removeMovie(title, fromType);
  const movieData = { title, image: imageUrl };
  saveMovie(toType, movieData);

  const targetList = document.getElementById(`${toType}-movies`);
  const newCard = createMovieCard(title, null, toType, imageUrl);
  targetList.appendChild(newCard);
}

function loadMoviesOnStart() {
  ['watchlist', 'watching', 'finished'].forEach(type => {
    const container = document.getElementById(`${type}-movies`);
    const list = JSON.parse(localStorage.getItem(type)) || [];
    list.forEach(movie => {
      const card = createMovieCard(movie.title, null, type, movie.image);
      container.appendChild(card);
    });
  });
}

window.onload = loadMoviesOnStart;
