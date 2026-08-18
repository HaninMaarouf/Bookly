const express = require("express");
const cors = require("cors");
const multer = require("multer");
const adminRoutes = require("./routes/admin");
const supabaseAdmin = require("./supabaseAdmin");

const app = express();
const PORT = 5000;

const API_KEY = "AIzaSyBUw6ZuTkCXTxkNrbpfWzH7RhAoraFP7Oo";
const BOOK_COVER_BUCKET = "book-covers";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
    fileFilter: (req, file, cb) => {
        const isAllowedMimeType = ALLOWED_MIME_TYPES.has(file.mimetype);
        const extension = file.originalname.toLowerCase().split(".").pop();
        const hasAllowedExtension = ["jpg", "jpeg", "png", "webp"].includes(extension);

        if (!isAllowedMimeType || !hasAllowedExtension) {
            return cb(new Error("Only JPG, JPEG, PNG, and WebP image files are allowed."));
        }

        cb(null, true);
    },
});

async function ensureBookCoverBucket() {
    const { data: existingBucket, error: getBucketError } = await supabaseAdmin.storage.getBucket(BOOK_COVER_BUCKET);

    if (!getBucketError && existingBucket) {
        return;
    }

    const bucketMissing =
        getBucketError?.status === 404 ||
        /bucket.*not found|not found.*bucket/i.test(getBucketError?.message || "");

    if (!bucketMissing) {
        throw new Error(getBucketError?.message || "Unable to check the book cover storage bucket.");
    }

    const { error: createBucketError } = await supabaseAdmin.storage.createBucket(BOOK_COVER_BUCKET, {
        public: true,
    });

    if (createBucketError) {
        const bucketAlreadyExists = /already exists|already.*exist/i.test(createBucketError.message || "");
        if (!bucketAlreadyExists) {
            throw new Error(createBucketError.message);
        }
    }
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Bookly server is running!");
});

app.use("/api/admin", adminRoutes);

app.get("/api/books", async (req, res) => {
    try {
        const query = req.query.q;
        const searchTerm = query?.trim();

        if (!searchTerm) {
            return res.status(400).json({
                message: "Please enter a book name",
            });
        }

        const googleUrl =
            `https://www.googleapis.com/books/v1/volumes` +
            `?q=${encodeURIComponent(searchTerm)}` +
            `&maxResults=20` +
            `&key=${API_KEY}`;

        const [googleResponse, customBooksResponse] = await Promise.all([
            fetch(googleUrl),
            supabaseAdmin
                .from("books")
                .select("*")
                .or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
                .order("created_at", { ascending: false })
        ]);

        const googleData = await googleResponse.json();

        if (!googleResponse.ok) {
            return res.status(googleResponse.status).json({
                message: googleData.error?.message || "Google Books API request failed",
            });
        }

        const books = (googleData.items || []).map((item) => {
            const info = item.volumeInfo || {};
            const saleInfo = item.saleInfo || {};

            let rawImage =
                info.imageLinks?.thumbnail ||
                info.imageLinks?.smallThumbnail ||
                "https://via.placeholder.com/128x192?text=No+Cover";

            const secureImage = rawImage.replace(/^http:\/\//i, "https://");

            const price = saleInfo.listPrice?.amount
                ? saleInfo.listPrice.amount.toFixed(2)
                : ((item.id.length % 15) + 9.99).toFixed(2);

            return {
                id: item.id,
                title: info.title || "Unknown Title",
                author: info.authors ? info.authors.join(", ") : "Unknown Author",
                description: info.description || "No description available for this book.",
                cover_url: secureImage,
                publishedDate: info.publishedDate || "Unknown",
                price: price,
                previewLink: info.previewLink || null,
            };
        });

        const customBooks = (customBooksResponse.data || []).map((book) => ({
            id: book.id,
            title: book.title || "Untitled Book",
            author: book.author || "Unknown Author",
            description: book.description || "No description available for this book.",
            cover_url: book.cover_url || "https://via.placeholder.com/128x192?text=No+Cover",
            publishedDate: book.published_date || "Unknown",
            price: Number(book.price || 0).toFixed(2),
            previewLink: book.preview_link || null,
        }));

        const merged = [...customBooks, ...books];
        const uniqueBooks = merged.filter(
            (book, index, array) =>
                index === array.findIndex((candidate) => candidate.id === book.id)
        );

        res.json({
            total: uniqueBooks.length,
            books: uniqueBooks,
        });
    } catch (error) {
        console.error("SERVER ERROR:", error);

        res.status(500).json({
            message: error.message,
        });
    }
});

app.post("/api/uploads/book-cover", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please choose an image file to upload.",
            });
        }

        await ensureBookCoverBucket();

        const sanitizedName = (req.file.originalname || "book-cover")
            .replace(/[^a-zA-Z0-9.-]/g, "_")
            .replace(/_+/g, "_");
        const fileName = `${Date.now()}-${sanitizedName}`;
        const filePath = `uploads/${fileName}`;

        const { data, error } = await supabaseAdmin.storage
            .from(BOOK_COVER_BUCKET)
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype,
                cacheControl: "3600",
                upsert: false,
            });

        if (error) {
            return res.status(500).json({
                message: error.message || "Failed to upload the book cover.",
            });
        }

        const { data: publicUrlData } = supabaseAdmin.storage
            .from(BOOK_COVER_BUCKET)
            .getPublicUrl(data.path);

        return res.status(200).json({
            url: publicUrlData.publicUrl,
            path: data.path,
            message: "Book cover uploaded successfully.",
        });
    } catch (error) {
        console.error("BOOK COVER UPLOAD ERROR:", error);

        return res.status(400).json({
            message: error.message || "Invalid image upload.",
        });
    }
});

app.use((req, res) => {
    res.status(404).json({
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "Image file is too large. Please choose an image under 5MB.",
            });
        }

        return res.status(400).json({
            message: error.message || "Upload failed.",
        });
    }

    if (error && error.type === "entity.parse.failed") {
        return res.status(400).json({
            message: "Invalid JSON payload.",
        });
    }

    if (error) {
        return res.status(400).json({
            message: error.message || "Upload failed.",
        });
    }

    next();
});

app.listen(PORT, () => {
    console.log(`Bookly server running on http://localhost:${PORT}`);
});