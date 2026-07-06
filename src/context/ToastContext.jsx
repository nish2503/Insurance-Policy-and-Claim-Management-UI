import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

let idCounter = 0;

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const showToast = useCallback(
    (message, type = "info", duration = 4500) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      timers.current[id] = setTimeout(() => removeToast(id), duration);
      return id;
    },
    [removeToast],
  );

  const toast = {
    show: showToast,
    success: (message, duration) => showToast(message, "success", duration),
    error: (message, duration) => showToast(message, "error", duration),
    info: (message, duration) => showToast(message, "info", duration),
    warning: (message, duration) => showToast(message, "warning", duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      <div className="app-toast-viewport">
        <style>{`
          .app-toast-viewport {
            position: fixed !important;
            top: 24px !important;
            right: 24px !important;
            z-index: 9999 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 12px !important;
            max-width: 380px !important;
            width: calc(100% - 32px) !important;
          }

          .app-toast-item {
            display: flex !important;
            align-items: flex-start !important;
            gap: 10px !important;
            background: var(--panel-bg, #ffffff) !important;
            color: var(--text-main, #0f172a) !important;
            border: 1px solid var(--border-color, rgba(15,23,42,.08)) !important;
            border-left: 4px solid var(--toast-accent, #3b82f6) !important;
            border-radius: 10px !important;
            padding: 14px 16px !important;
            box-shadow: 0 10px 25px -5px rgba(15,23,42,.15) !important;
            font-size: 0.9rem !important;
            font-family: 'Inter', system-ui, sans-serif !important;
            animation: toast-slide-in 0.25s ease-out !important;
          }

          .app-toast-item.success { --toast-accent: #16a34a !important; }
          .app-toast-item.error { --toast-accent: #dc2626 !important; }
          .app-toast-item.warning { --toast-accent: #f59e0b !important; }
          .app-toast-item.info { --toast-accent: #3b82f6 !important; }

          .app-toast-icon {
            font-size: 1.1rem !important;
            line-height: 1.2 !important;
            flex-shrink: 0 !important;
          }

          .app-toast-item.success .app-toast-icon { color: #16a34a !important; }
          .app-toast-item.error .app-toast-icon { color: #dc2626 !important; }
          .app-toast-item.warning .app-toast-icon { color: #f59e0b !important; }
          .app-toast-item.info .app-toast-icon { color: #3b82f6 !important; }

          .app-toast-message {
            flex: 1 !important;
            line-height: 1.4 !important;
            word-break: break-word !important;
          }

          .app-toast-close {
            background: transparent !important;
            border: none !important;
            color: var(--text-muted, #64748b) !important;
            cursor: pointer !important;
            font-size: 1rem !important;
            line-height: 1 !important;
            padding: 0 !important;
            flex-shrink: 0 !important;
          }

          @keyframes toast-slide-in {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }

          @media (max-width: 480px) {
            .app-toast-viewport {
              top: 12px !important;
              right: 12px !important;
              left: 12px !important;
              max-width: none !important;
              width: auto !important;
            }
          }
        `}</style>

        {toasts.map((t) => (
          <div key={t.id} className={`app-toast-item ${t.type}`} role="alert">
            <span className="app-toast-icon">
              {t.type === "success" && <i className="bi bi-check-circle-fill"></i>}
              {t.type === "error" && <i className="bi bi-x-circle-fill"></i>}
              {t.type === "warning" && <i className="bi bi-exclamation-triangle-fill"></i>}
              {t.type === "info" && <i className="bi bi-info-circle-fill"></i>}
            </span>
            <span className="app-toast-message">{t.message}</span>
            <button
              type="button"
              className="app-toast-close"
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss"
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

export default ToastProvider;