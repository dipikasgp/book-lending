// BookModal.js
import React from 'react';
import Modal from 'react-modal';

const BookModal = ({ isOpen, onRequestClose, title, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={modalStyles}
      ariaHideApp={false}
    >
      <div style={styles.modalHeader}>
        <h2 style={styles.modalTitle}>{title}</h2>
        <button onClick={onRequestClose} style={styles.closeButton}>
          &times;
        </button>
      </div>
      <div style={styles.modalContent}>{children}</div>
    </Modal>
  );
};

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
  },
};

const styles = {
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #ddd',
    padding: '10px',
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.2em',
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.5em',
    cursor: 'pointer',
  },
  modalContent: {
    padding: '20px',
  },
};

export default BookModal;
