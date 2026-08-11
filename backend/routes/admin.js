const express = require("express");
const router = express.Router();

const supabaseAdmin = require("../supabaseAdmin");

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