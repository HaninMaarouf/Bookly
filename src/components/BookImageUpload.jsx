import { useCallback, useRef, useState } from "react";
import "./BookImageUpload.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function BookImageUpload({ value, onChange, label = "Upload Book Cover" }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(value || "");

  const handleUpload = useCallback(async (file) => {
    if (!file) return;

    const fileType = file.type || "";
    const fileExt = file.name.split(".").pop()?.toLowerCase();

    if (!ALLOWED_TYPES.includes(fileType) && !["jpg", "jpeg", "png", "webp"].includes(fileExt)) {
      setError("Please choose a valid JPG, JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image is too large. Please choose a file under 5MB.");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:5000/api/uploads/book-cover", {
        method: "POST",
        body: formData,
      });

      const rawText = await response.text();
      let result = {};

      if (rawText) {
        try {
          result = JSON.parse(rawText);
        } catch {
          throw new Error("The upload server returned an invalid response. Please check that the backend is running.");
        }
      }

      if (!response.ok) {
        throw new Error(result.message || "Upload failed.");
      }

      if (onChange) {
        onChange(result.url);
      }

      setPreviewUrl(result.url);
    } catch (uploadError) {
      setError(uploadError.message || "The image could not be uploaded.");
      if (onChange) {
        onChange("");
      }
      setPreviewUrl("");
    } finally {
      setIsUploading(false);
    }
  }, [onChange]);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    handleUpload(file);

    event.target.value = "";
  };

  const activePreview = value || previewUrl;

  return (
    <div className="book-image-upload">
      <label className="book-image-upload-box" htmlFor="book-cover-upload">
        {activePreview ? (
          <img src={activePreview} alt="Book cover preview" className="book-image-upload-preview" />
        ) : (
          <div className="book-image-upload-placeholder">
            <div className="book-image-upload-icon">⬆</div>
            <span>{label}</span>
            <small>Choose Image</small>
          </div>
        )}
      </label>

      <input
        id="book-cover-upload"
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        hidden
      />

      <div className="book-image-upload-actions">
        <button
          type="button"
          className="admin-button admin-button-outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : activePreview ? "Replace Image" : "Choose Image"}
        </button>

        {activePreview && (
          <button
            type="button"
            className="admin-button admin-button-success"
            onClick={() => window.open(activePreview, "_blank", "noopener,noreferrer")}
          >
            View
          </button>
        )}
      </div>

      {error && <div className="book-image-upload-error">{error}</div>}
    </div>
  );
}
