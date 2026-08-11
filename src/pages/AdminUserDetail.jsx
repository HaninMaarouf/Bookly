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
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [id]);

    const handleOrderConfirmed = (orderId) => {
        setData((prev) => ({
            ...prev,
            orders: prev.orders.map((order) =>
                order.id === orderId ? { ...order, status: "delivered" } : order
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
                            <p>{data.profile.location || "No location on file"}</p>
                        </div>
                        <span className="admin-badge-role">{data.profile.role}</span>
                    </div>

                    <h2>Orders ({data.orders.length})</h2>

                    {data.orders.length === 0 ? (
                        <div className="admin-card admin-empty-state">
                            <p style={{ marginBottom: 0 }}>No orders yet.</p>
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