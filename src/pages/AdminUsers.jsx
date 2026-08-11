import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function getInitials(name) {
    if (!name) return "?";
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/admin/users"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }

                const data = await response.json();

                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, []);

    if (loading) {
        return <p>Loading users...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const regularUsers = users.filter((user) => user.role !== "admin");

    return (
        <div className="admin-card">
            <h2>Users ({regularUsers.length})</h2>

            {regularUsers.length === 0 ? (
                <div className="admin-empty-state">
                    <p>No users yet.</p>
                </div>
            ) : (
                <div className="admin-users-grid">
                    {regularUsers.map((user) => (
                        <div
                            key={user.id}
                            className="admin-user-card"
                            onClick={() => navigate(`/admin/users/${user.id}`)}
                        >
                            <div className="admin-user-avatar">
                                {getInitials(user.full_name)}
                            </div>
                            <div className="admin-user-name">
                                {user.full_name || "—"}
                            </div>
                            <div className="admin-user-location">
                                <svg viewBox="0 0 24 24" width="13" height="13" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 21s-6-5.5-6-11a6 6 0 1 1 12 0c0 5.5-6 11-6 11z"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />
                                    <circle cx="12" cy="10" r="2.2" fill="currentColor" />
                                </svg>
                                {user.location || "No location set"}
                            </div>
                            <span className="admin-badge admin-badge-user">
                                {user.role}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}