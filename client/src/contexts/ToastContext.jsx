// src/context/ToastContext.js
import { createContext, useState, useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const ToastContext = createContext(() => {});

export const ToastProvider = ({ children }) => {
  const [queue, setQueue] = useState([]); // FIFO: first item is the one being shown
  const timerRef = useRef(null);

  const addToast = useCallback((message, type = "info", duration = 2000) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setQueue((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  // Exactly one timer: for the toast at the front of the queue
  useEffect(() => {
    // clear any previous timer
    clearTimeout(timerRef.current);

    const current = queue[0];
    if (!current) return;

    // schedule removal of the current toast after its own duration
    timerRef.current = setTimeout(() => {
      setQueue((prev) => prev.slice(1)); // pop the front; next toast (if any) becomes current
    }, current.duration || 2000);

    // cleanup
    return () => clearTimeout(timerRef.current);
  }, [queue]);

  // extra safety: clear timer on unmount
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div
        className="toast-container"
        style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
      >
        {queue[0] && (
          <div key={queue[0].id} className={`toast toast-${queue[0].type}`}>
            {queue[0].message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ToastContext;
