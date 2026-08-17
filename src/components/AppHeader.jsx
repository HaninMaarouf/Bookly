import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './AppHeader.css';

function getInitials(name) {
    if (!name) return null;
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

export default function AppHeader({ favoritesCount, cartCount, onNavigateDashboard, onNavigateFavorites, onNavigateCart }) {
    const { user, profile, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        setMenuOpen(false);
        navigate('/login');
    };

    const initials = getInitials(profile?.full_name);

    return (
        <header className="navbar">
            <div className="navbar-logo" onClick={onNavigateDashboard}>
                <svg className="navbar-logo-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 25 C40 18, 25 18, 15 22 L15 78 C25 74, 40 74, 50 81 Z" fill="#FFFFFF" stroke="#4A3E3D" strokeWidth="3" />
                    <path d="M50 25 C60 18, 75 18, 85 22 L85 78 C75 74, 60 74, 50 81 Z" fill="#FFFFFF" stroke="#4A3E3D" strokeWidth="3" />
                    <line x1="50" y1="25" x2="50" y2="81" stroke="#8C6D58" strokeWidth="3" />
                    <line x1="20" y1="32" x2="42" y2="30" stroke="#E8D8CE" strokeWidth="3" />
                    <line x1="20" y1="42" x2="42" y2="40" stroke="#E8D8CE" strokeWidth="3" />
                    <line x1="20" y1="52" x2="42" y2="50" stroke="#E8D8CE" strokeWidth="3" />
                    <line x1="58" y1="30" x2="80" y2="32" stroke="#E8D8CE" strokeWidth="3" />
                    <line x1="58" y1="40" x2="80" y2="42" stroke="#E8D8CE" strokeWidth="3" />
                    <line x1="58" y1="50" x2="80" y2="52" stroke="#E8D8CE" strokeWidth="3" />
                </svg>
                <span className="navbar-logo-text">Bookly</span>
            </div>
            <div className="navbar-actions">
                <button className="favorites-pill" onClick={onNavigateFavorites}>
                    <svg className="favorites-heart-icon" viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 21s-6.5-4.35-9.5-8.5C0.7 9.5 1.5 5.5 5 4.2c2.2-0.8 4.4 0.1 5.5 1.9 1.1-1.8 3.3-2.7 5.5-1.9 3.5 1.3 4.3 5.3 2.5 8.3C18.5 16.65 12 21 12 21z"
                            fill="#D9534F"
                            stroke="#D9534F"
                            strokeWidth="1"
                        />
                    </svg>
                    <span className="pill-label">Favorites</span>
                    <span key={favoritesCount} className="pill-count pill-bounce">{favoritesCount}</span>
                </button>
                <button className="cart-button" onClick={onNavigateCart}>
                    <svg className="cart-icon-svg" viewBox="0 0 24 24" width="17" height="17" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M6 6h15l-1.5 9h-12L5 3H2"
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <circle cx="9" cy="20" r="1.4" fill="#FFFFFF" />
                        <circle cx="18" cy="20" r="1.4" fill="#FFFFFF" />
                    </svg>
                    <span className="pill-label">Cart</span>
                    <span key={cartCount} className="pill-count cart-count pill-bounce">{cartCount}</span>
                </button>

                <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle dark mode">
                    {theme === 'light' ? (
                        <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                            <path
                                d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
                </button>

                <div className="profile-menu" ref={menuRef}>
                    <button className="profile-avatar-btn" onClick={() => setMenuOpen((open) => !open)}>
                        {user && initials ? (
                            <span className="profile-avatar profile-avatar-filled">{initials}</span>
                        ) : (
                            <span className="profile-avatar profile-avatar-default">
                                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
                                    <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                </svg>
                            </span>
                        )}
                    </button>

                    {menuOpen && (
                        <div className="profile-dropdown">
                            {user ? (
                                <>
                                    <div className="profile-dropdown-header">
                                        <span className="profile-dropdown-name">{profile?.full_name || 'Reader'}</span>
                                        <span className="profile-dropdown-role">
                                            {profile?.role === 'admin' ? 'Administrator' : 'Member'}
                                        </span>
                                    </div>
                                    <button
                                        className="profile-dropdown-item"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            navigate(profile?.role === 'admin' ? '/admin/dashboard' : '/dashboard');
                                        }}
                                    >
                                        {profile?.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
                                    </button>
                                    <button className="profile-dropdown-item profile-dropdown-danger" onClick={handleLogout}>
                                        Log out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="profile-dropdown-item"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            navigate('/login', { state: { intent: 'user' } });
                                        }}
                                    >
                                        Log in as User
                                    </button>
                                    <button
                                        className="profile-dropdown-item"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            navigate('/login', { state: { intent: 'admin' } });
                                        }}
                                    >
                                        Log in as Admin
                                    </button>
                                    <button
                                        className="profile-dropdown-item"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            navigate('/signup');
                                        }}
                                    >
                                        Sign up
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}