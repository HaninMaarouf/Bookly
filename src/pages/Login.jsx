import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../css/Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const intent = location.state?.intent;
  const infoMessage = location.state?.message;
  const redirectTo = location.state?.from;

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setLoading(false);
      setError(signInError.message);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    setLoading(false);

    if (profileError) {
      setError('Could not load your profile. Please try again.');
      return;
    }

    if (profile?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate(redirectTo || '/dashboard');
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <h1>{intent === 'admin' ? 'Admin Login' : 'Log in to Bookly'}</h1>

        {infoMessage && (
          <p
            style={{
              background: '#FBEFE2',
              color: '#A9784E',
              padding: '0.6rem 0.8rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              textAlign: 'center',
              margin: 0,
            }}
          >
            {infoMessage}
          </p>
        )}

        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>

        <p className="auth-switch">
          No account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}