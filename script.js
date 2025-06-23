document.addEventListener('DOMContentLoaded', function () {
  window.showPage = function (id) {
    document.querySelectorAll('.page-section').forEach(section => {
      section.classList.add('hidden');
    });
    document.getElementById(id).classList.remove('hidden');
    document.body.classList.toggle('theme-home', id === 'home');
  };

  window.setTheme = function (theme) {
    document.body.className = `theme-${theme} theme-home`;
  };

  document.getElementById('profile-upload').addEventListener('change', function () {
    if (this.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('profile-pic').src = e.target.result;
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  window.showFolderPrompt = function () {
    const existing = document.querySelector('.folder-popup');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'folder-popup';

    const popup = document.createElement('div');
    popup.className = 'popup-content';

    const title = document.createElement('h3');
    title.textContent = 'New Folder';
    popup.appendChild(title);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Folder name';
    popup.appendChild(input);

    const warning = document.createElement('p');
    warning.style.color = 'red';
    warning.style.fontSize = '12px';
    warning.style.margin = '0';
    warning.style.display = 'none';
    popup.appendChild(warning);

    const colorLabel = document.createElement('label');
    colorLabel.textContent = 'Choose color:';
    popup.appendChild(colorLabel);

    const colorWrapper = document.createElement('div');
    colorWrapper.style.display = 'flex';
    colorWrapper.style.alignItems = 'center';
    colorWrapper.style.gap = '10px';

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = '#cccccc';
    colorWrapper.appendChild(colorInput);

    const colorDot = document.createElement('span');
    colorDot.style.width = '20px';
    colorDot.style.height = '20px';
    colorDot.style.borderRadius = '50%';
    colorDot.style.border = '1px solid #ccc';
    colorDot.style.backgroundColor = colorInput.value;
    colorWrapper.appendChild(colorDot);

    const colorHexLabel = document.createElement('span');
    colorHexLabel.textContent = colorInput.value;
    colorWrapper.appendChild(colorHexLabel);

    colorInput.addEventListener('input', () => {
      colorDot.style.backgroundColor = colorInput.value;
      colorHexLabel.textContent = colorInput.value;
    });

    popup.appendChild(colorWrapper);

    const buttons = document.createElement('div');
    buttons.className = 'popup-buttons';

    const createBtn = document.createElement('button');
    createBtn.textContent = 'Create';
    createBtn.onclick = () => {
      const name = input.value.trim();
      if (name) {
        window.createFolder(name, colorInput.value);
        overlay.remove();
      } else {
        warning.textContent = 'Please enter a folder name.';
        warning.style.display = 'block';
      }
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.background = '#aaa';
    cancelBtn.style.color = '#fff';
    cancelBtn.onclick = () => overlay.remove();

    buttons.appendChild(createBtn);
    buttons.appendChild(cancelBtn);
    popup.appendChild(buttons);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  };

  window.createFolder = function (name, color) {
    const container = document.getElementById('watchlist-folders');
    const emptyNote = document.getElementById('empty-watchlist');
    if (emptyNote) emptyNote.remove();

    const folder = document.createElement('div');
    folder.className = 'drive-folder';
    folder.style.backgroundColor = color;
    folder.style.opacity = '0';
    folder.style.transform = 'scale(0.85)';

    const folderName = document.createElement('span');
    folderName.textContent = name;
    folder.appendChild(folderName);

    const actions = document.createElement('div');
    actions.className = 'folder-actions hidden';

    const renameBtn = document.createElement('button');
    renameBtn.textContent = 'Rename';
    renameBtn.onclick = (e) => {
      e.stopPropagation();
      const newName = prompt('Enter new folder name:', folderName.textContent);
      if (newName) folderName.textContent = newName;
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      const confirmDelete = confirm(`Are you sure you want to delete "${folderName.textContent}"?`);
      if (confirmDelete) {
        folder.remove();
        if (container.children.length === 0) {
          const note = document.createElement('p');
          note.textContent = 'No folders yet. Tap the + button to create one.';
          note.id = 'empty-watchlist';
          note.style.textAlign = 'center';
          note.style.marginTop = '20px';
          note.style.opacity = '0.6';
          container.appendChild(note);
        }
      }
    };

    actions.appendChild(renameBtn);
    actions.appendChild(deleteBtn);
    folder.appendChild(actions);
    container.appendChild(folder);

    // Show/hide on double click
    folder.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      actions.classList.toggle('hidden');
    });

    requestAnimationFrame(() => {
      folder.style.transition = 'all 0.3s ease';
      folder.style.opacity = '1';
      folder.style.transform = 'scale(1)';
    });
  };

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const target = card.getAttribute('data-target');
      window.showPage(target);
    });
  });

  const folderContainer = document.getElementById('watchlist-folders');
  if (folderContainer && folderContainer.children.length === 0) {
    const note = document.createElement('p');
    note.textContent = 'No folders yet. Tap the + button to create one.';
    note.id = 'empty-watchlist';
    note.style.textAlign = 'center';
    note.style.marginTop = '20px';
    note.style.opacity = '0.6';
    folderContainer.appendChild(note);
  }
});
