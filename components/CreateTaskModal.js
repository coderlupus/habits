import Modal from 'react-modal';
import styles from '../styles/CreateTaskModal.module.css';

Modal.setAppElement('#__next');

export default function CreateTaskModal({ isOpen, onRequestClose, onSave }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Create New Task"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2>Create New Task</h2>
      <input type="text" placeholder="Enter your task..." className={styles.input} />
      <div className={styles.buttons}>
        <button onClick={onRequestClose} className={styles.cancelButton}>Cancel</button>
        <button onClick={onSave} className={styles.saveButton}>Save</button>
      </div>
    </Modal>
  )
}
