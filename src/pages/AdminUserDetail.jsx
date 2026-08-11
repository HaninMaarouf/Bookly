import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderCard from "../components/Admin/OrderCard";
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

    if (loading) {
        return <p>Loading user...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="admin-layout">
            <div className="admin-container">
                <button 
                    className="admin-button admin-button-outline admin-button-small" 
                    onClick={() => navigate("/admin/dashboard")} 
                    style={{ marginBottom: '1.25rem' }}
                >
                    ← Back to Users
                </button>

                <div className="admin-card admin-card-compact">
                    <h1 style={{ marginTop: 0, marginBottom: 0 }}>{data.profile.full_name || "—"}</h1>
                </div>

                <h2 style={{ marginTop: '1.75rem', marginBottom: '1rem' }}>Orders</h2>

                {data.orders.length === 0 ? (
                    <div className="admin-card admin-card-compact">
                        <p style={{ marginBottom: 0 }}>No orders yet.</p>
                    </div>
                ) : (
                    data.orders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                        />
                    ))
                )}
            </div>
        </div>
    );
}