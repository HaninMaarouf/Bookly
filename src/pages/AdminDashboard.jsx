import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { profile, logout } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin panel — hi, {profile?.full_name || 'admin'}</h1>
      <button onClick={logout}>Log out</button>
    </div>
  );
}