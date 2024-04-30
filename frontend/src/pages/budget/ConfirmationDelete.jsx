import React, { useState } from "react";
import Modal from "react-modal";
import styles from "../../styles/modal.module.scss";

const ConfirmationDelete = ({ isOpen, onRequestClose, onDeleteConfirmed }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleDelete = () => {
    onDeleteConfirmed(inputValue);
    setInputValue("");
  };

  return (
    <Modal
      className={styles.modal}
      overlayClassName={styles.overlay}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <h2>Confirm</h2>
      <p>Please write the budget name for delete:</p>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <div className={styles.buttons}>
        <button className={styles.delete} onClick={handleDelete}>
          Delete
        </button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default ConfirmationDelete;
