import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

    return (
        <div className="admin-card">
            <h2 style={{ marginTop: 0 }}>Users</h2>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Role</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users
                            .filter((user) => user.role !== "admin")
                            .map((user) => (
                                <tr
                                    key={user.id}
                                    onClick={() =>
                                        navigate(`/admin/users/${user.id}`)
                                    }
                                    style={{ cursor: "pointer" }}
                                >
                                    <td style={{ fontWeight: 500 }}>{user.full_name || "—"}</td>
                                    <td>{user.location || "—"}</td>
                                    <td>
                                        <span className={`admin-badge ${user.role === 'admin' ? 'admin-badge-admin' : 'admin-badge-user'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}