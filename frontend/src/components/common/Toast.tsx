import React, { useEffect } from 'react';
import './Toast.css';

interface Props {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<Props> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <span>{type === 'success' ? '✓' : '✕'}</span>
      {message}
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  );
};

export default Toast;