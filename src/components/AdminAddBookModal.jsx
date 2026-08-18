import { useMemo, useState } from "react";
import BookImageUpload from "./BookImageUpload";

const EMPTY_FORM = {
  title: "",
  author: "",
  description: "",
  price: "",
  published_date: "",
  category: "",
  preview_link: "",
};

export default function AdminAddBookModal({ isOpen, onClose, onBookCreated }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  const categoryOptions = useMemo(
    () => [
      "History",
      "Literature",
      "Science & Technology",
      "Arts & Culture",
      "Religion & Philosophy",
      "Lifestyle & Hobbies",
      "Health & Medicine",
      "Education & References",
    ],
    []
  );

  if (!isOpen) return null;

  const validate = () => {
    const nextErrors = {};

    if (!form.title.trim()) nextErrors.title = "Title is required.";
    if (!form.author.trim()) nextErrors.author = "Author is required.";
    if (!form.description.trim()) nextErrors.description = "Description is required.";
    if (!form.category.trim()) nextErrors.category = "Category is required.";
    if (!form.published_date) nextErrors.published_date = "Publication date is required.";

    const numericPrice = Number(form.price);
    if (!form.price || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      nextErrors.price = "Price must be a valid positive number.";
    }

    if (!coverUrl) nextErrors.cover_url = "Please upload a book cover image.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("http://localhost:5000/api/admin/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          cover_url: coverUrl,
          price: Number(form.price),
        }),
      });

      const responseText = await response.text();
      let result = {};

      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch {
          throw new Error("The server returned an unexpected HTML response instead of JSON. Check that the backend route is available and running.");
        }
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to create the book.");
      }

      setForm(EMPTY_FORM);
      setCoverUrl("");
      setErrors({});

      if (onBookCreated) {
        onBookCreated(result.book);
      }
    } catch (error) {
      setSubmitError(error.message || "Unable to create the book right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
        <div className="admin-modal-header">
          <div>
            <p className="admin-modal-kicker">Book Management</p>
            <h3>Add New Book</h3>
          </div>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close add book form">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-book-form">
          <div className="admin-book-form-grid">
            <div className="admin-field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Book title"
              />
              {errors.title && <span className="admin-field-error">{errors.title}</span>}
            </div>

            <div className="admin-field">
              <label htmlFor="author">Author</label>
              <input
                id="author"
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Author name"
              />
              {errors.author && <span className="admin-field-error">{errors.author}</span>}
            </div>

            <div className="admin-field admin-field-full">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Brief description"
                rows="4"
              />
              {errors.description && <span className="admin-field-error">{errors.description}</span>}
            </div>

            <div className="admin-field">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="19.99"
              />
              {errors.price && <span className="admin-field-error">{errors.price}</span>}
            </div>

            <div className="admin-field">
              <label htmlFor="published_date">Publication Date</label>
              <input
                id="published_date"
                name="published_date"
                type="date"
                value={form.published_date}
                onChange={handleChange}
              />
              {errors.published_date && <span className="admin-field-error">{errors.published_date}</span>}
            </div>

            <div className="admin-field">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={form.category} onChange={handleChange}>
                <option value="">Select category</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <span className="admin-field-error">{errors.category}</span>}
            </div>

            <div className="admin-field admin-field-full">
              <label htmlFor="preview_link">Preview Link (optional)</label>
              <input
                id="preview_link"
                name="preview_link"
                value={form.preview_link}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>

            <div className="admin-field admin-field-full">
              <label>Book Cover</label>
              <BookImageUpload value={coverUrl} onChange={setCoverUrl} />
              {errors.cover_url && <span className="admin-field-error">{errors.cover_url}</span>}
            </div>
          </div>

          {submitError && <div className="admin-form-error">{submitError}</div>}

          <div className="admin-modal-actions">
            <button type="button" className="admin-button admin-button-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="admin-button" disabled={isSubmitting}>
              {isSubmitting ? "Adding Book..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
