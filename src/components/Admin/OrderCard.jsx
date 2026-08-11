import { useState } from "react";

export default function OrderCard({ order, onConfirmed }) {
    const [confirming, setConfirming] = useState(false);
    const [confirmError, setConfirmError] = useState("");

    const isDelivered = order.status === "delivered";

    const handleConfirm = async () => {
        setConfirming(true);
        setConfirmError("");

        try {
            const response = await fetch(
                `http://localhost:5000/api/admin/orders/${order.id}/confirm`,
                { method: "PATCH" }
            );

            if (!response.ok) {
                throw new Error("Failed to confirm delivery");
            }

            onConfirmed(order.id);
        } catch (err) {
            setConfirmError(err.message);
        } finally {
            setConfirming(false);
        }
    };

    const formattedDate = order.created_at
        ? new Date(order.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
          })
        : "—";

    return (
        <div className="order-card">
            <div className="order-card-header">
                <div>
                    <h3 style={{ margin: 0 }}>Order #{order.id.slice(0, 8)}</h3>
                    <p style={{ margin: "2px 0 0", fontSize: "0.85rem" }}>{formattedDate}</p>
                </div>
                <span className={`status-pill ${isDelivered ? "status-pill-delivered" : "status-pill-pending"}`}>
                    {isDelivered ? "✓ Delivered" : "Pending"}
                </span>
            </div>

            <div className="order-summary-row">
                <div className="order-summary-item">
                    <span className="order-summary-label">Delivery address</span>
                    <span className="order-summary-value">{order.location || "—"}</span>
                </div>
                <div className="order-summary-item">
                    <span className="order-summary-label">Total</span>
                    <span className="order-summary-value">${Number(order.total).toFixed(2)}</span>
                </div>
            </div>

            <ul className="order-books-list">
                {order.order_items.map((item) => (
                    <li key={item.id} className="order-books-item">
                        <div className="order-books-item-title">
                            {item.title}
                            <div className="order-books-item-author">{item.author}</div>
                        </div>
                        <div className="order-books-item-qty">x{item.quantity}</div>
                        <div className="order-books-item-price">${Number(item.price).toFixed(2)}</div>
                    </li>
                ))}
            </ul>

            {confirmError && (
                <p style={{ color: "#B85C5C", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
                    {confirmError}
                </p>
            )}

            {!isDelivered && (
                <div className="order-card-footer">
                    <button
                        className="admin-button admin-button-success admin-button-small"
                        onClick={handleConfirm}
                        disabled={confirming}
                    >
                        {confirming ? "Confirming..." : "Confirm Delivery"}
                    </button>
                </div>
            )}
        </div>
    );
}