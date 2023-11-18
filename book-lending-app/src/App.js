// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookList from './BookList';
import BookModal from './BookModal';
import './styles.css';

const App = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    rating: 0,
    published_date: 2000,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };

  const handleCreateBook = async () => {
    try {
      await axios.post('http://localhost:8000/create-book', {
        id: null,
        title: newBook.title,
        author: newBook.author,
        description: newBook.description,
        rating: parseInt(newBook.rating, 10),
        published_date: parseInt(newBook.published_date, 10),
      });

      setNewBook({
        title: '',
        author: '',
        description: '',
        rating: 0,
        published_date: 2000,
      });

      setIsCreateModalOpen(false);
      fetchBooks();
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  const handleEditBook = async () => {
    try {
      await axios.put(`http://localhost:8000/books/update_book`, {
        id: selectedBook.id,
        title: selectedBook.title,
        author: selectedBook.author,
        description: selectedBook.description,
        rating: parseInt(selectedBook.rating, 10),
        published_date: parseInt(selectedBook.published_date, 10),
      });

      setIsEditModalOpen(false);
      fetchBooks();
    } catch (error) {
      console.error('Error editing book:', error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`http://localhost:8000/books/${bookId}`);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const openEditModal = (book) => {
    setSelectedBook(book);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedBook(null);
    setIsEditModalOpen(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Book Lending App</h1>
      <div style={styles.section}>
        <h2 style={styles.subHeading}>Books</h2>
        <BookList
          books={books}
          openEditModal={openEditModal}
          handleDeleteBook={handleDeleteBook}
        />
      </div>
      <div style={styles.section}>
        <h2 style={styles.subHeading}>Create New Book</h2>
        <button onClick={openCreateModal} style={styles.button}>
          Open Create Book Modal
        </button>
        <BookModal
          isOpen={isCreateModalOpen}
          onRequestClose={closeCreateModal}
          title="Create Book Modal"
        >
          <h2 style={styles.subHeading}>Create New Book</h2>
          <form style={styles.form}>
            <label style={styles.label}>Title:</label>
            <input
              type="text"
              name="title"
              value={newBook.title}
              onChange={handleInputChange}
              style={styles.input}
            />
            <br />
            <label style={styles.label}>Author:</label>
            <input
              type="text"
              name="author"
              value={newBook.author}
              onChange={handleInputChange}
              style={styles.input}
            />
            <br />
            <label style={styles.label}>Description:</label>
            <input
              type="text"
              name="description"
              value={newBook.description}
              onChange={handleInputChange}
              style={styles.input}
            />
            <br />
            <label style={styles.label}>Rating:</label>
            <input
              type="number"
              name="rating"
              value={newBook.rating}
              onChange={handleInputChange}
              style={styles.input}
            />
            <br />
            <label style={styles.label}>Published Date:</label>
            <input
              type="number"
              name="published_date"
              value={newBook.published_date}
              onChange={handleInputChange}
              style={styles.input}
            />
            <br />
            <button type="button" onClick={handleCreateBook} style={styles.button}>
              Confirm
            </button>
            <button type="button" onClick={closeCreateModal} style={styles.button}>
              Cancel
            </button>
          </form>
        </BookModal>
      </div>
      <div style={styles.section}>
        <h2 style={styles.subHeading}>Edit Book</h2>
        {selectedBook && (
          <BookModal
            isOpen={isEditModalOpen}
            onRequestClose={closeEditModal}
            title="Edit Book Modal"
          >
            <form style={styles.form}>
              {/* ... (edit book form content) */}
              <button type="button" onClick={handleEditBook} style={styles.button}>
                Confirm
              </button>
              <button type="button" onClick={closeEditModal} style={styles.button}>
                Cancel
              </button>
            </form>
          </BookModal>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
  },
  section: {
    marginTop: '20px',
  },
  subHeading: {
    color: '#555',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    border: '1px solid #ddd',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
  },
  bookDetails: {
    color: '#333',
  },
  buttonsContainer: {
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  editButton: {
    marginRight: '8px',
  },
  deleteButton: {
    color: 'red',
  },
  button: {
    padding: '8px 16px',
    marginTop: '10px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
};

export default App;
