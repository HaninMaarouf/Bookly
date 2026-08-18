import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderCard from "../components/Admin/OrderCard";
import Footer from "../components/Footer";
import "../css/admin.css";

export default function AdminUserDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");
    const [saveError, setSaveError] = useState("");

    const [formData, setFormData] = useState({
        full_name: "",
        location: "",
    });

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/admin/users/${id}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch user");
                }

                const result = await response.json();

                setData(result);

                setFormData({
                    full_name: result.profile.full_name || "",
                    location: result.profile.location || "",
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = () => {
        setSaveMessage("");
        setSaveError("");

        setFormData({
            full_name: data.profile.full_name || "",
            location: data.profile.location || "",
        });

        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setFormData({
            full_name: data.profile.full_name || "",
            location: data.profile.location || "",
        });

        setSaveMessage("");
        setSaveError("");
        setIsEditing(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setSaveMessage("");
            setSaveError("");

            const response = await fetch(
                `http://localhost:5000/api/admin/users/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        full_name: formData.full_name,
                        location: formData.location,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Failed to update user"
                );
            }

            setData((prev) => ({
                ...prev,
                profile: result.profile,
            }));

            setSaveMessage("User updated successfully.");
            setIsEditing(false);
        } catch (err) {
            setSaveError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleOrderConfirmed = (orderId) => {
        setData((prev) => ({
            ...prev,
            orders: prev.orders.map((order) =>
                order.id === orderId
                    ? { ...order, status: "delivered" }
                    : order
            ),
        }));
    };

    if (loading) {
        return (
            <div className="admin-layout">
                <div className="admin-container">
                    <p>Loading user...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-layout">
                <div className="admin-container">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="admin-layout">
                <div className="admin-container">

                    <button
                        className="admin-button admin-button-outline admin-button-small admin-back-link"
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        ← Back to Users
                    </button>

                    <div className="admin-hero">
                        <div className="admin-hero-text">
                            <h1>{data.profile.full_name || "—"}</h1>

                            <p>
                                {data.profile.location ||
                                    "No location on file"}
                            </p>
                        </div>

                        <span className="admin-badge-role">
                            {data.profile.role}
                        </span>
                    </div>

                    <div className="admin-card">

                        <div className="admin-section-header">
                            <div>
                                <h2>User Information</h2>

                                <p>
                                    Manage this user's profile information.
                                </p>
                            </div>

                            {!isEditing && (
                                <button
                                    type="button"
                                    className="admin-button"
                                    onClick={handleEdit}
                                >
                                    Edit User
                                </button>
                            )}
                        </div>

                        {saveMessage && (
                            <div className="admin-success-message">
                                {saveMessage}
                            </div>
                        )}

                        {saveError && (
                            <div className="admin-error-message">
                                {saveError}
                            </div>
                        )}

                        {!isEditing ? (
                            <div className="admin-user-information">

                                <p>
                                    <strong>Full Name:</strong>{" "}
                                    {data.profile.full_name || "—"}
                                </p>

                                <p>
                                    <strong>Location:</strong>{" "}
                                    {data.profile.location ||
                                        "No location set"}
                                </p>

                            </div>
                        ) : (
                            <form onSubmit={handleSave}>

                                <div className="admin-form-group">
                                    <label htmlFor="full_name">
                                        Full Name
                                    </label>

                                    <input
                                        id="full_name"
                                        name="full_name"
                                        type="text"
                                        value={formData.full_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label htmlFor="location">
                                        Location
                                    </label>

                                    <input
                                        id="location"
                                        name="location"
                                        type="text"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="admin-form-actions">

                                    <button
                                        type="submit"
                                        className="admin-button"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </button>

                                    <button
                                        type="button"
                                        className="admin-button admin-button-outline"
                                        onClick={handleCancelEdit}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>
                        )}

                    </div>

                    <h2>Orders ({data.orders.length})</h2>

                    {data.orders.length === 0 ? (
                        <div className="admin-card admin-empty-state">
                            <p style={{ marginBottom: 0 }}>
                                No orders yet.
                            </p>
                        </div>
                    ) : (
                        data.orders.map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onConfirmed={handleOrderConfirmed}
                            />
                        ))
                    )}

                </div>
            </div>

            <Footer />
        </>
    );
}