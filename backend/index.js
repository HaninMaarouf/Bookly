const express = require("express");
const cors = require("cors");
const supabase = require("./supabase");
const supabaseAdmin = require("./supabaseAdmin");
const adminRoutes = require("./routes/admin");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});