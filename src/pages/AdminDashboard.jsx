import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import AdminUsers from "./AdminUsers";
import Footer from "../components/Footer";
import AdminAddBookModal from "../components/AdminAddBookModal";
import DeleteBookConfirmationModal from "../components/DeleteBookConfirmationModal";
import "../css/admin.css";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookCreateMessage, setBookCreateMessage] = useState("");
  const [customBooks, setCustomBooks] = useState([]);
  const [customBooksLoading, setCustomBooksLoading] = useState(true);
  const [deletingBookId, setDeletingBookId] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);

  const fetchCustomBooks = async () => {
    try {
      setCustomBooksLoading(true);
      const response = await fetch("http://localhost:5000/api/admin/books");

      if (!response.ok) {
        throw new Error("Failed to load books.");
      }

      const data = await response.json();
      setCustomBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Could not load custom books:", error);
      setCustomBooks([]);
    } finally {
      setCustomBooksLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomBooks();
  }, []);

  const handleConfirmDeleteBook = async () => {
    if (!bookToDelete) return;

    const bookId = bookToDelete.id;

    try {
      setDeletingBookId(bookId);
      const response = await fetch(`http://localhost:5000/api/admin/books/${bookId}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete the book.");
      }

      setCustomBooks((current) => current.filter((book) => book.id !== bookId));
      setBookCreateMessage(`"${data.title || bookToDelete.title || "Book"}" was deleted successfully.`);
      setBookToDelete(null);
    } catch (error) {
      setBookCreateMessage(error.message || "Unable to delete the book right now.");
      setBookToDelete(null);
    } finally {
      setDeletingBookId(null);
    }
  };

  return (
    <>
      <div className="admin-layout">
        <div className="admin-container">
          <div className="admin-hero">
            <div className="admin-hero-text">
              <h1>Admin panel</h1>
              <p>Welcome back, {profile?.full_name || "admin"} — here's everyone using Bookly.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle dark mode">
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <span className="admin-badge-role">Administrator</span>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-section-header">
              <div>
                <h2>Book Management</h2>
                <p>Add a custom book to the existing collection.</p>
              </div>
              <button
                type="button"
                className="admin-button"
                onClick={() => setIsBookModalOpen(true)}
              >
                + Add New Book
              </button>
            </div>

            {bookCreateMessage && (
              <div className="admin-success-message">{bookCreateMessage}</div>
            )}

            <div className="admin-book-list-wrapper">
              <h3>Current Custom Books</h3>
              {customBooksLoading ? (
                <p>Loading custom books...</p>
              ) : customBooks.length === 0 ? (
                <p className="admin-empty-state">No custom books available yet.</p>
              ) : (
                <div className="admin-book-list">
                  {customBooks.map((book) => (
                    <div key={book.id} className="admin-book-item">
                      <img src={book.cover_url} alt={book.title} className="admin-book-cover" />
                      <div className="admin-book-meta">
                        <strong>{book.title}</strong>
                        <span>{book.author}</span>
                        <small>{book.category || "Uncategorized"}</small>
                      </div>
                      <button
                        type="button"
                        className="admin-button admin-button-outline admin-button-small"
                        onClick={() => setBookToDelete(book)}
                        disabled={deletingBookId === book.id}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <AdminAddBookModal
            isOpen={isBookModalOpen}
            onClose={() => setIsBookModalOpen(false)}
            onBookCreated={(book) => {
              setBookCreateMessage(`"${book.title}" was added successfully.`);
              setIsBookModalOpen(false);
              fetchCustomBooks();
            }}
          />

          <DeleteBookConfirmationModal
            isOpen={Boolean(bookToDelete)}
            book={bookToDelete}
            isDeleting={Boolean(deletingBookId)}
            onConfirm={handleConfirmDeleteBook}
            onCancel={() => setBookToDelete(null)}
          />

          <AdminUsers />
        </div>
      </div>
      <Footer />
    </>
  );
}