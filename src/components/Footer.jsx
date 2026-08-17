import React from 'react';
import '../css/footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <h3>Bookly</h3>
                    <p className="footer-tagline">
                        Discover your next favorite book with Bookly.
                    </p>
                    <p className="footer-subtext">
                        Thoughtful books, calm spaces, and stories worth keeping.
                    </p>
                </div>


            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} Bookly. All rights reserved.</p>
            </div>
        </footer>
    );
}