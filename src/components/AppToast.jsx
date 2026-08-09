import React from 'react';
import './AppToast.css';

export default function AppToast({ message }) {
    if (!message) return null;

    return <div className="app-toast">{message}</div>;
}
