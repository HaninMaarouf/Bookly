import { useAuth } from "../context/AuthContext";
import AdminUsers from "./AdminUsers";
import Footer from "../components/Footer";
import "../css/admin.css";

export default function AdminDashboard() {
  const { profile } = useAuth();

  return (
    <>
      <div className="admin-layout">
        <div className="admin-container">
          <div className="admin-hero">
            <div className="admin-hero-text">
              <h1>Admin panel</h1>
              <p>Welcome back — here's everyone using Bookly.</p>
            </div>
            <span className="admin-badge-role">Administrator</span>
          </div>

          <AdminUsers />
        </div>
      </div>
      <Footer />
    </>
  );
}