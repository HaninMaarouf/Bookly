const express = require("express");
const router = express.Router();

const supabaseAdmin = require("../supabaseAdmin");

router.get("/books", async (req, res) => {
    const { data, error } = await supabaseAdmin
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return res.status(500).json({
            message: error.message || "Failed to load books.",
        });
    }

    res.json(data || []);
});

router.post("/books", async (req, res) => {
    try {
        const {
            title,
            author,
            description,
            price,
            cover_url,
            category,
            published_date,
            preview_link,
        } = req.body || {};

        if (!title || !title.trim()) {
            return res.status(400).json({ message: "Book title is required." });
        }

        if (!author || !author.trim()) {
            return res.status(400).json({ message: "Author is required." });
        }

        if (!description || !description.trim()) {
            return res.status(400).json({ message: "Description is required." });
        }

        if (!category || !category.trim()) {
            return res.status(400).json({ message: "Category is required." });
        }

        if (!published_date || !published_date.trim()) {
            return res.status(400).json({ message: "Publication date is required." });
        }

        const numericPrice = Number(price);
        if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
            return res.status(400).json({ message: "Price must be a valid positive number." });
        }

        if (!cover_url || !cover_url.trim()) {
            return res.status(400).json({ message: "A book cover image is required." });
        }

        const { data, error } = await supabaseAdmin
            .from("books")
            .insert({
                title: title.trim(),
                author: author.trim(),
                description: description.trim(),
                price: numericPrice.toFixed(2),
                cover_url: cover_url.trim(),
                category: category.trim(),
                published_date: published_date.trim(),
                preview_link: preview_link?.trim() || null,
            })
            .select()
            .single();

        if (error) {
            return res.status(500).json({
                message: error.message || "Failed to create the book.",
            });
        }

        return res.status(201).json({
            message: "Book created successfully.",
            book: {
                id: data.id,
                title: data.title,
                author: data.author,
                description: data.description,
                price: Number(data.price),
                cover_url: data.cover_url,
                category: data.category,
                published_date: data.published_date,
                preview_link: data.preview_link,
                created_at: data.created_at,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to create the book.",
        });
    }
});

router.delete("/books/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Book id is required." });
    }

    const { error } = await supabaseAdmin
        .from("books")
        .delete()
        .eq("id", id);

    if (error) {
        return res.status(500).json({
            message: error.message || "Failed to delete the book.",
        });
    }

    res.json({ message: "Book deleted successfully." });
});

// Get all users
router.get("/users", async (req, res) => {
    const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name, role, location, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
});

// Get one user + their orders + order items
router.get("/users/:id", async (req, res) => {
    const userId = req.params.id;

    // Get the user's profile
    const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name, role, location, created_at")
        .eq("id", userId)
        .single();

    if (profileError) {
        return res.status(404).json({
            error: "User not found"
        });
    }

    // Get the user's orders
    const { data: orders, error: ordersError } = await supabaseAdmin
        .from("orders")
        .select(`
            id,
            location,
            total,
            status,
            created_at,
            order_items (
                id,
                title,
                author,
                price,
                quantity
            )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (ordersError) {
        return res.status(500).json({
            error: ordersError.message
        });
    }

    res.json({
        profile,
        orders
    });
});

// Update a user's profile
router.patch("/users/:id", async (req, res) => {
    const userId = req.params.id;
    const { full_name, location } = req.body || {};

    if (!userId) {
        return res.status(400).json({
            error: "User id is required",
        });
    }

    if (!full_name || !full_name.trim()) {
        return res.status(400).json({
            error: "Full name is required",
        });
    }

    const { data, error } = await supabaseAdmin
        .from("profiles")
        .update({
            full_name: full_name.trim(),
            location: location?.trim() || null,
        })
        .eq("id", userId)
        .select("id, full_name, role, location, created_at")
        .single();

    if (error) {
        return res.status(500).json({
            error: error.message,
        });
    }

    res.json({
        message: "User updated successfully",
        profile: data,
    });
});

// Mark an order as delivered
router.patch("/orders/:id/confirm", async (req, res) => {
    const orderId = req.params.id;

    const { data, error } = await supabaseAdmin
        .from("orders")
        .update({ status: "delivered" })
        .eq("id", orderId)
        .select()
        .single();

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
});

module.exports = router;