import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/footer.css';

export default function Footer() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <h3>Bookly</h3>
                    <p>Thoughtful books, calm spaces, and stories worth keeping.</p>
                </div>

                {user ? (
                    <button className="footer-logout-btn" onClick={handleLogout}>
                        <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Log out
                    </button>
                ) : (
                    <button className="footer-logout-btn" onClick={() => navigate('/login')}>
                        <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M14 17l5-5-5-5M19 12H9"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Log in
                    </button>
                )}
            </div>
        </footer>
    );
}