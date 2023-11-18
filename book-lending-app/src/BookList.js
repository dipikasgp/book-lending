// BookList.js
import React from 'react';

const BookList = ({ books, openEditModal, handleDeleteBook }) => {
    return (
      <ul style={styles.list}>
        {books.map((book) => (
          <li key={book.id} style={styles.listItem}>
            <div style={styles.bookDetails}>
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>Description: {book.description}</p>
              <p>Rating: {book.rating}</p>
              <p>Published Date: {book.published_date}</p>
            </div>
            <div style={styles.buttonsContainer}>
              <button
                onClick={() => openEditModal(book)}
                style={{ ...styles.button, ...styles.iconButton }}
              >
                <span className="material-icons">edit</span>
              </button>
              <button
                onClick={() => handleDeleteBook(book.id)}
                style={{ ...styles.button, ...styles.iconButton }}
              >
                <span className="material-icons">delete</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

const styles = {
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    border: '1px solid #ddd',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookDetails: {
    color: '#333',
  },
  buttonsContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  editButton: {
    marginRight: '8px',
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    color: 'red',
    backgroundColor: '#f44336',
  },
  button: {
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default BookList;
