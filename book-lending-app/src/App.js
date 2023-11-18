import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the root element for accessibility

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
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    // Fetch all books on component mount
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

  const handleCreateBook = async () => {
    try {
      // Parse rating and published_date to numbers
      const parsedRating = parseInt(newBook.rating, 10);
      const parsedPublishedDate = parseInt(newBook.published_date, 10);
  
      await axios.post('http://localhost:8000/create_book', {
        title: newBook.title,
        author: newBook.author,
        description: newBook.description,
        rating: parsedRating,
        published_date: parsedPublishedDate,
      });
  
      setNewBook({
        title: '',
        author: '',
        description: '',
        rating: 0,
        published_date: 2000,
      });
  
      setIsCreateModalOpen(false); // Close the create modal
      fetchBooks(); // Fetch the updated list of books
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };
  

  const handleUpdateBook = async () => {
    try {
      await axios.put('http://localhost:8000/books/update_book', selectedBook);
      setIsUpdateModalOpen(false); // Close the update modal
      fetchBooks(); // Fetch the updated list of books
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const openUpdateModal = (book) => {
    setSelectedBook(book);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setSelectedBook(null);
    setIsUpdateModalOpen(false);
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`http://localhost:8000/books/${bookId}`);
      fetchBooks(); // Fetch the updated list of books
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Book Lending App</h1>
      <div style={styles.section}>
        <h2 style={styles.subHeading}>Books</h2>
        <ul style={styles.list}>
          {books.map((book) => (
            <li key={book.id} style={styles.listItem}>
              <div style={styles.bookDetails}>
                <div>
                  <strong>{book.title}</strong> by {book.author}
                </div>
                <div>Rating: {book.rating}</div>
                <div>Published Date: {book.published_date}</div>
                <div>Description: {book.description}</div>
              </div>
              <button onClick={() => openUpdateModal(book)} style={styles.updateButton}>
                Update
              </button>
              <button onClick={() => handleDeleteBook(book.id)} style={styles.deleteButton}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div style={styles.section}>
        <h2 style={styles.subHeading}>Create New Book</h2>
        <button onClick={openCreateModal} style={styles.button}>
          Open Create Book Modal
        </button>
        <Modal
          isOpen={isCreateModalOpen}
          onRequestClose={closeCreateModal}
          style={modalStyles}
          contentLabel="Create Book Modal"
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
        </Modal>
      </div>
      <Modal
        isOpen={isUpdateModalOpen}
        onRequestClose={closeUpdateModal}
        style={modalStyles}
        contentLabel="Update Book Modal"
      >
        <h2 style={styles.subHeading}>Update Book</h2>
        <form style={styles.form}>
          <label style={styles.label}>Title:</label>
          <input
            type="text"
            name="title"
            value={selectedBook ? selectedBook.title : ''}
            onChange={handleInputChange}
            style={styles.input}
          />
          <br />
          <label style={styles.label}>Author:</label>
          <input
            type="text"
            name="author"
            value={selectedBook ? selectedBook.author : ''}
            onChange={handleInputChange}
            style={styles.input}
          />
          <br />
          <label style={styles.label}>Description:</label>
          <input
            type="text"
            name="description"
            value={selectedBook ? selectedBook.description : ''}
            onChange={handleInputChange}
            style={styles.input}
          />
          <br />
          <label style={styles.label}>Rating:</label>
          <input
            type="number"
            name="rating"
            value={selectedBook ? selectedBook.rating : 0}
            onChange={handleInputChange}
            style={styles.input}
          />
          <br />
          <label style={styles.label}>Published Date:</label>
          <input
            type="number"
            name="published_date"
            value={selectedBook ? selectedBook.published_date : 2000}
            onChange={handleInputChange}
            style={styles.input}
          />
          <br />
          <button type="button" onClick={handleUpdateBook} style={styles.button}>
            Confirm
          </button>
          <button type="button" onClick={closeUpdateModal} style={styles.button}>
            Cancel
          </button>
        </form>
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    fontSize: '2rem',
    margin: '20px 0',
    color: '#007BFF',
  },
  section: {
    marginBottom: '30px',
  },
  subHeading: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    color: '#007BFF',
  },
  list: {
    listStyle: 'none',
    padding: '0',
  },
  listItem: {
    marginBottom: '16px',
    padding: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#f9f9f9',
  },
  bookDetails: {
    marginRight: '16px',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    color: '#fff',
    padding: '8px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    border: 'none',
    marginRight: '8px',
  },
  updateButton: {
    backgroundColor: '#007BFF',
    color: '#fff',
    padding: '8px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    border: 'none',
    marginRight: '8px',
  },
  button: {
    backgroundColor: '#007BFF',
    color: '#fff',
    padding: '12px',
    fontSize: '1rem',
    cursor: 'pointer',
    border: 'none',
    marginRight: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontSize: '1rem',
    color: '#007BFF',
  },
  input: {
    marginBottom: '16px',
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
};

const modalStyles = {
  content: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '20px',
    borderRadius: '8px',
  },
};

export default App;
