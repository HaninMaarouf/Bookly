import React from 'react';
import './SectionCard.css';

export default function SectionCard({ title, subtitle, onClick }) {
    return (
        <button className="section-card" onClick={onClick}>
            <span className="section-card-title">{title}</span>
            {subtitle && <span className="section-card-subtitle">{subtitle}</span>}
        </button>
    );
}
