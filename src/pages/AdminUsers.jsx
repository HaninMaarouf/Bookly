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

    const [userToDelete, setUserToDelete] = useState(null);
    const [deletingUserId, setDeletingUserId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState("");

    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            setLoading(true);

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
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            setDeletingUserId(userToDelete.id);
            setDeleteMessage("");

            const response = await fetch(
                `http://localhost:5000/api/admin/users/${userToDelete.id}`,
                {
                    method: "DELETE",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Failed to delete user"
                );
            }

            setUsers((currentUsers) =>
                currentUsers.filter(
                    (user) => user.id !== userToDelete.id
                )
            );

            setDeleteMessage(
                `${userToDelete.full_name || "User"} was deleted successfully.`
            );

            setUserToDelete(null);
        } catch (err) {
            setDeleteMessage(err.message);
            setUserToDelete(null);
        } finally {
            setDeletingUserId(null);
        }
    };

    if (loading) {
        return <p>Loading users...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const regularUsers = users.filter(
        (user) => user.role !== "admin"
    );

    return (
        <div className="admin-card">
            <div className="admin-section-header">
                <div>
                    <h2>Users ({regularUsers.length})</h2>
                    <p>Manage Bookly users.</p>
                </div>
            </div>

            {deleteMessage && (
                <div className="admin-success-message">
                    {deleteMessage}
                </div>
            )}

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
                        >
                            <div
                                className="admin-user-card-content"
                                onClick={() =>
                                    navigate(
                                        `/admin/users/${user.id}`
                                    )
                                }
                            >
                                <div className="admin-user-avatar">
                                    {getInitials(user.full_name)}
                                </div>

                                <div className="admin-user-name">
                                    {user.full_name || "—"}
                                </div>

                                <div className="admin-user-location">
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="13"
                                        height="13"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12 21s-6-5.5-6-11a6 6 0 1 1 12 0c0 5.5-6 11-6 11z"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        />

                                        <circle
                                            cx="12"
                                            cy="10"
                                            r="2.2"
                                            fill="currentColor"
                                        />
                                    </svg>

                                    {user.location ||
                                        "No location set"}
                                </div>

                                <span className="admin-badge admin-badge-user">
                                    {user.role}
                                </span>
                            </div>

                            <button
                                type="button"
                                className="admin-button admin-button-outline admin-delete-user-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteMessage("");
                                    setUserToDelete(user);
                                }}
                                disabled={
                                    deletingUserId === user.id
                                }
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {userToDelete && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h2>Delete User</h2>

                        <p>
                            Are you sure you want to delete{" "}
                            <strong>
                                {userToDelete.full_name || "this user"}
                            </strong>
                            ?
                        </p>

                        <p>
                            This will permanently delete the user's
                            account and profile. Their order history
                            will be preserved.
                        </p>

                        <div className="admin-modal-actions">
                            <button
                                type="button"
                                className="admin-button admin-button-outline"
                                onClick={() =>
                                    setUserToDelete(null)
                                }
                                disabled={Boolean(deletingUserId)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="admin-button admin-delete-confirm-button"
                                onClick={handleDeleteUser}
                                disabled={Boolean(deletingUserId)}
                            >
                                {deletingUserId
                                    ? "Deleting..."
                                    : "Delete User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}