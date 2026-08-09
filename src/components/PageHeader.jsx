import React from 'react';
import './PageHeader.css';

export default function PageHeader({ title, actionLabel, onAction }) {
    return (
        <div className="page-header">
            <h2>{title}</h2>
            {actionLabel && (
                <button className="btn-secondary" onClick={onAction}>
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
