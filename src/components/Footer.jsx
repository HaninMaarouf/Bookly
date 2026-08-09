import React from 'react';
import '../css/footer.css';

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <h3>Bookly</h3>
                    <p>Thoughtful books, calm spaces, and stories worth keeping.</p>
                </div>

                <div className="footer-links">
                    <div>
                        <h4>Visit</h4>
                        <a href="#">Home</a>
                        <a href="#">About</a>
                        <a href="#">Contact</a>
                    </div>
                    <div>
                        <h4>Browse</h4>
                        <a href="#">New Releases</a>
                        <a href="#">Best Sellers</a>
                        <a href="#">Categories</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
