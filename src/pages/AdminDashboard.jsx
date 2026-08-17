import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import AdminUsers from "./AdminUsers";
import Footer from "../components/Footer";
import "../css/admin.css";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <div className="admin-layout">
        <div className="admin-container">
          <div className="admin-hero">
            <div className="admin-hero-text">
              <h1>Admin panel</h1>
              <p>Welcome back, {profile?.full_name || "admin"} — here's everyone using Bookly.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle dark mode">
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <span className="admin-badge-role">Administrator</span>
            </div>
          </div>

          <AdminUsers />
        </div>
      </div>
      <Footer />
    </>
  );
}