// public/app.js
async function loadBooks() {
  try {
    const res = await fetch("/books");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const books = await res.json();
    const el = document.getElementById("book-list");
    
    if (books.length === 0) {
      el.innerHTML = "<div>No books available. Add your first book!</div>";
    } else {
      el.innerHTML = books.map(b => 
        `<div style="display: flex; justify-content: space-between; align-items: center; padding: 5px;">
          <span>${b.bookNo}. ${b.bookName}</span>
          <button onclick="deleteBook(${b.bookNo})" style="background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Delete</button>
        </div>`
      ).join("");
    }
  } catch (error) {
    console.error("Failed to load books:", error);
    const el = document.getElementById("book-list");
    el.innerHTML = "<div style='color: red;'>Failed to load books. Please try again.</div>";
  }
}

window.addEventListener("DOMContentLoaded", loadBooks);

// Challenge 1: Delete book function
async function deleteBook(bookNo) {
  if (!confirm(`Are you sure you want to delete book #${bookNo}?`)) {
    return;
  }
  
  try {
    const res = await fetch(`/books/${bookNo}/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (res.ok) {
      loadBooks();
    } else {
      const error = await res.json();
      alert(`Failed to delete book: ${error.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    alert('Failed to delete book. Please try again.');
  }
}

// Challenge 2: Search books function
async function searchBooks() {
  const searchInput = document.getElementById('search-input');
  const query = searchInput.value.trim();
  
  try {
    const url = query 
      ? `/books/search?q=${encodeURIComponent(query)}`
      : '/books';
    
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const books = await res.json();
    const el = document.getElementById("book-list");
    
    if (books.length === 0) {
      el.innerHTML = "<div>No books found</div>";
    } else {
      el.innerHTML = books.map(b => 
        `<div style="display: flex; justify-content: space-between; align-items: center; padding: 5px;">
          <span>${b.bookNo}. ${b.bookName}</span>
          <button onclick="deleteBook(${b.bookNo})" style="background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Delete</button>
        </div>`
      ).join("");
    }
  } catch (error) {
    console.error('Failed to search books:', error);
    alert('Failed to search books. Please try again.');
  }
}

function clearSearch() {
  document.getElementById('search-input').value = '';
  loadBooks();
}

// Add event listeners for search
window.addEventListener("load", function() {
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-search');
  
  if (searchBtn) searchBtn.addEventListener('click', searchBooks);
  if (clearBtn) clearBtn.addEventListener('click', clearSearch);
  
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchBooks();
      }
    });
  }
});

// Make deleteBook function globally accessible
window.deleteBook = deleteBook;