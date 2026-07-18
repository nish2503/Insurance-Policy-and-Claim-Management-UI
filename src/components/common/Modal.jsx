function Modal({ show, onClose, title, children }) {
  if (!show) return null;

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div
        className="custom-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="custom-modal-header">
          <h5 className="mb-0">{title}</h5>

          <button
            type="button"
            className="btn-close"
            onClick={onClose}
          ></button>
        </div>

        <div className="custom-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;