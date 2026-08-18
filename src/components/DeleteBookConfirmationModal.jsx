import { useEffect } from "react";
import "./DeleteBookConfirmationModal.css";

export default function DeleteBookConfirmationModal({
  isOpen,
  book,
  isDeleting,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onCancel();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen || !book) return null;

  return (
    <div
      className="delete-modal-backdrop"
      onClick={isDeleting ? undefined : onCancel}
    >
      <div
        className="delete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="delete-modal-header">
          <h2 id="delete-modal-title">Delete Book</h2>
          <button
            type="button"
            className="delete-modal-close"
            onClick={onCancel}
            disabled={isDeleting}
            aria-label="Close delete confirmation"
          >
            ×
          </button>
        </div>

        <div className="delete-modal-content">
          {book.cover_url && (
            <img src={book.cover_url} alt={book.title} className="delete-modal-cover" />
          )}

          <div className="delete-modal-info">
            <h3>{book.title}</h3>
            <p className="delete-modal-author">by {book.author}</p>
          </div>

          <div className="delete-modal-message">
            <p>Are you sure you want to delete this book from the catalog?</p>
            <p className="delete-modal-warning">This action cannot be undone.</p>
          </div>
        </div>

        <div className="delete-modal-actions">
          <button
            type="button"
            className="admin-button admin-button-outline"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="admin-button admin-button-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete Book"}
          </button>
        </div>
      </div>
    </div>
  );
}

