const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

const API_KEY = "AIzaSyBUw6ZuTkCXTxkNrbpfWzH7RhAoraFP7Oo";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Bookly server is running!");
});

app.get("/api/books", async (req, res) => {
    try {
        const query = req.query.q;

        if (!query || query.trim() === "") {
            return res.status(400).json({
                message: "Please enter a book name",
            });
        }

        const url =
            `https://www.googleapis.com/books/v1/volumes` +
            `?q=${encodeURIComponent(query)}` +
            `&maxResults=20` +
            `&key=${API_KEY}`;

        console.log("Searching:", query);

        const response = await fetch(url);
        const data = await response.json();

        console.log("Google Status:", response.status);

        if (!response.ok) {
            console.log("Google Error:", data);

            return res.status(response.status).json({
                message:
                    data.error?.message || "Google Books API request failed",
            });
        }

        const books = (data.items || []).map((item) => {
            const info = item.volumeInfo || {};
            const saleInfo = item.saleInfo || {};

            // Ensure HTTPS image URL to prevent mixed content blocking
            let rawImage =
                info.imageLinks?.thumbnail ||
                info.imageLinks?.smallThumbnail ||
                "https://via.placeholder.com/128x192?text=No+Cover";

            const secureImage = rawImage.replace(/^http:\/\//i, "https://");

            // Format price or generate consistent fallback based on ID length
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

        res.json({
            total: data.totalItems || 0,
            books: books,
        });
    } catch (error) {
        console.error("SERVER ERROR:", error);

        res.status(500).json({
            message: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`Bookly server running on http://localhost:${PORT}`);
});