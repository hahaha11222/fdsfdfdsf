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

  const movieDiv = createMovieCard(title, imageInput, type);
  movieList.appendChild(movieDiv);

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
        const currentList = document.getElementById('watching-movies');
        const newCard = createMovieCard(title, null, 'watching', movieDiv.dataset.image);
        currentList.appendChild(newCard);
        movieDiv.remove();
      } else if (option === 'Finish Watching') {
        const finishedList = document.getElementById('finished-movies');
        const newCard = createMovieCard(title, null, 'finished', movieDiv.dataset.image);
        finishedList.appendChild(newCard);
        movieDiv.remove();
      } else if (option === 'Stop Watching' || option === 'Remove') {
        movieDiv.remove();
      }
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
