import { useState } from "react";

export default function OrderCard({ order }) {
    const [status, setStatus] = useState(order.status);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function confirmDelivery() {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `http://localhost:5000/api/admin/orders/${order.id}/confirm`,
                {
                    method: "PATCH",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update delivery status");
            }

            const updatedOrder = await response.json();

            setStatus(updatedOrder.status);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="admin-card">
            <h3 style={{ marginTop: 0, marginBottom: "0.75rem" }}>Order</h3>

            <div className="order-summary-row">
                <div className="order-summary-item">
                    <span className="order-summary-label">Location</span>
                    <span className="order-summary-value">{order.location || "—"}</span>
                </div>
                <div className="order-summary-item">
                    <span className="order-summary-label">Total</span>
                    <span className="order-summary-value">${order.total}</span>
                </div>
                <div className="order-summary-item">
                    <span className="order-summary-label">Status</span>
                    <span className={`order-summary-value ${status === 'delivered' ? 'status-text-delivered' : 'status-text-pending'}`} style={{ textTransform: 'capitalize' }}>
                        {status}
                    </span>
                </div>
            </div>

            <h4 style={{ marginBottom: "0.5rem" }}>Books</h4>

            <ul className="order-books-list">
                {order.order_items.map((item) => (
                    <li key={item.id} className="order-books-item">
                        <span className="order-books-item-title">{item.title}</span>
                        <span className="order-books-item-qty">× {item.quantity}</span>
                        <span className="order-books-item-price">${item.price}</span>
                    </li>
                ))}
            </ul>

            {error && <p style={{ color: "red", fontSize: "0.85rem" }}>{error}</p>}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                    className={`admin-button ${status === "delivered" ? "admin-button-success" : ""}`}
                    onClick={confirmDelivery}
                    disabled={status === "delivered" || loading}
                >
                    {status === "delivered"
                        ? "✓ Delivery Sent"
                        : loading
                            ? "Sending..."
                            : "Confirm Delivery"}
                </button>
            </div>
        </div>
    );
}