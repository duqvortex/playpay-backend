import React from 'react';

interface Props {
  message: string;
  onClose: () => void;
}

const AlertModal: React.FC<Props> = ({ message, onClose }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <p style={styles.text}>{message}</p>
        <button style={styles.button} onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default AlertModal;

const styles: any = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modal: {
    background: '#111',
    padding: 30,
    borderRadius: 16,
    textAlign: 'center',
    boxShadow: '0 0 30px rgba(255,122,0,0.5)',
    minWidth: 260,
  },
  text: {
    color: '#fff',
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    padding: '10px 20px',
    borderRadius: 8,
    border: 'none',
    background: '#ff7a00',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};
