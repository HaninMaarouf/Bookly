import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { profile, logout } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome, {profile?.full_name || 'reader'} 👋</h1>
      <button onClick={logout}>Log out</button>
    </div>
  );
}