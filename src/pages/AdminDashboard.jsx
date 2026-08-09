import { useAuth } from "../context/AuthContext";
import AdminUsers from "./AdminUsers";
import "../css/admin.css";

export default function AdminDashboard() {
  const { profile, logout } = useAuth();

  return (
    <div className="admin-layout">
      <div className="admin-container">
        <div className="admin-header-flex">
          <h1>Admin panel</h1>
          <button className="admin-button admin-button-outline admin-button-small" onClick={logout}>Log out</button>
        </div>

        <AdminUsers />
      </div>
    </div>
  );
}