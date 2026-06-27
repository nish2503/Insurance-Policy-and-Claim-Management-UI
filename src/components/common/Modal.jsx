import "./Modal.css";

function Modal({ show, onClose, title, children, size = "md" }) {
  if (!show) return null;

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div
        className={`custom-modal custom-modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="custom-modal-header">
          <h5>{title}</h5>

          <button
            type="button"
            className={`btn-close ${
              document.body.classList.contains("dark") ? "btn-close-white" : ""
            }`}
            onClick={onClose}
          />
        </div>

        <div className="custom-modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
