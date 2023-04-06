document.getElementById('search-button').addEventListener('click', async () => {
  const query = document.getElementById('search-input').value;
  if (!query) {
    return;
  }

  const response = await fetch(`/api/search?q=${query}`);
  const data = await response.json();

  const searchResultsDiv = document.getElementById('search-results');
  searchResultsDiv.innerHTML = '';

  if (data.error) {
    searchResultsDiv.innerHTML = `<p>${data.error}</p>`;
  } else {
    data.items.forEach(book => {
      const bookDiv = document.createElement('div');
      bookDiv.className = 'book';
      bookDiv.innerHTML = `
        <img src="${book.imageLinks}" alt="${book.title}">
        <h3>${book.title}</h3>
        <p>Author(s): ${book.authors.join(', ')}</p>
        <p>Description: ${book.description}</p>
        <button class="add-to-library" data-book-id="${book.id}">Add to Library</button>
      `;
      searchResultsDiv.appendChild(bookDiv);
    });


    const addToLibraryButtons = document.getElementsByClassName('add-to-library');
    Array.from(addToLibraryButtons).forEach(button => {
      button.addEventListener('click', async (event) => {
        const bookId = event.target.dataset.bookId;

        const response = await fetch(`/api/books/${bookId}`, {
          method: 'POST'
        });
        const data = await response.json();
        alert(data.message); 
      });
    });
  }
});


document.getElementById('search-results').addEventListener('click', async (event) => {
  if (event.target.classList.contains('add-button')) {
    const bookId = event.target.dataset.id;
    const savedBooks = document.getElementById('saved-books');
    savedBooks.innerHTML = 'Loading...';

    try {
     
      const response = await fetch(`/api/books/${bookId}`);
      const book = await response.json();
      savedBooks.innerHTML = '';

      
      const savedBookItem = document.createElement('li');
      savedBookItem.innerHTML =
      `<h4>${book.volumeInfo.title}</h4>
      <p>${book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
      <p>${book.volumeInfo.publisher || 'Unknown Publisher'}</p>
      <button class="remove-button" data-id="${book.id}">Remove</button>`;
    savedBooks.appendChild(savedBookItem);
  } catch (error) {
    console.error(error);
    savedBooks.innerHTML = 'Error fetching data';
  }
}
});

document.getElementById('saved-books').addEventListener('click', async (event) => {
if (event.target.classList.contains('remove-button')) {
  const bookId = event.target.dataset.id;
  const savedBookItem = event.target.parentNode;
  savedBookItem.innerHTML = 'Removing...';

  try {
    
    await fetch(`/api/books/${bookId}`, { method: 'DELETE' });
    savedBookItem.remove();
  } catch (error) {
    console.error(error);
    savedBookItem.innerHTML = 'Error removing book';
  }
}
});
