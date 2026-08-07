import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Splash.css';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-page">
      <div className="book-scene">
        <svg className="book closed" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="15" width="60" height="70" rx="4" fill="#A9784E" />
          <rect x="20" y="15" width="60" height="70" rx="4" fill="none" stroke="#4A3B2C" strokeWidth="2" />
          <line x1="50" y1="15" x2="50" y2="85" stroke="#4A3B2C" strokeWidth="1.5" opacity="0.4" />
          <rect x="24" y="19" width="52" height="4" rx="2" fill="#F5EDE4" opacity="0.6" />
        </svg>

        <svg className="book open" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 25 C40 18, 25 18, 15 22 L15 78 C25 74, 40 74, 50 81 Z" fill="#FFFFFF" stroke="#4A3B2C" strokeWidth="2" />
          <path d="M50 25 C60 18, 75 18, 85 22 L85 78 C75 74, 60 74, 50 81 Z" fill="#FFFFFF" stroke="#4A3B2C" strokeWidth="2" />
          <line x1="50" y1="25" x2="50" y2="81" stroke="#C9A177" strokeWidth="2" />
          <line x1="20" y1="32" x2="42" y2="30" stroke="#E8D9C5" strokeWidth="2" />
          <line x1="20" y1="42" x2="42" y2="40" stroke="#E8D9C5" strokeWidth="2" />
          <line x1="20" y1="52" x2="42" y2="50" stroke="#E8D9C5" strokeWidth="2" />
          <line x1="58" y1="30" x2="80" y2="32" stroke="#E8D9C5" strokeWidth="2" />
          <line x1="58" y1="40" x2="80" y2="42" stroke="#E8D9C5" strokeWidth="2" />
          <line x1="58" y1="50" x2="80" y2="52" stroke="#E8D9C5" strokeWidth="2" />
        </svg>
      </div>

      <h1 className="splash-title">Bookly</h1>
      <p className="splash-tagline">Your next favorite book, one click away</p>
    </div>
  );
}