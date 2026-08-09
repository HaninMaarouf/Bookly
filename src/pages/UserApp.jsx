import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import Cart from './Cart';
import Favorites from './Favorites';
import AppHeader from '../components/AppHeader';
import AppToast from '../components/AppToast';
import Footer from '../components/Footer';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function UserApp() {
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [toastMessage, setToastMessage] = useState('');
    const [cartItems, setCartItems] = useState([]);

    const [favorites, setFavorites] = useState(() => {
        const savedFavs = localStorage.getItem('bookly_favorites');
        return savedFavs ? JSON.parse(savedFavs) : [];
    });

    useEffect(() => {
        localStorage.setItem('bookly_favorites', JSON.stringify(favorites));
    }, [favorites]);

    // Load this user's cart from Supabase on login
    useEffect(() => {
        if (!user) {
            setCartItems([]);
            return;
        }

        async function loadCart() {
            const { data, error } = await supabase
                .from('cart_items')
                .select('*')
                .eq('user_id', user.id);

            if (error) {
                console.error('Failed to load cart:', error);
                return;
            }

            const formatted = (data || []).map((row) => ({
                id: row.book_id,
                title: row.title,
                author: row.author,
                price: row.price,
                quantity: row.quantity,
                cover_url: row.cover_url,
            }));

            setCartItems(formatted);
        }

        loadCart();
    }, [user]);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage('');
        }, 3000);
    };

    // Add to cart — upserts into Supabase, then updates local state
    const handleAddToCart = async (book) => {
        if (!user) return;

        const existing = cartItems.find((item) => item.id === book.id);
        const newQuantity = existing ? existing.quantity + 1 : 1;

        const { error } = await supabase
            .from('cart_items')
            .upsert(
                {
                    user_id: user.id,
                    book_id: book.id,
                    title: book.title,
                    author: book.author,
                    price: book.price,
                    cover_url: book.cover_url,
                    quantity: newQuantity,
                },
                { onConflict: 'user_id,book_id' }
            );

        if (error) {
            console.error('Failed to add to cart:', error);
            return;
        }

        setCartItems((prevItems) => {
            if (existing) {
                return prevItems.map((item) =>
                    item.id === book.id ? { ...item, quantity: newQuantity } : item
                );
            }
            return [...prevItems, { ...book, quantity: 1 }];
        });
        showToast(`🛒 "${book.title}" added to cart!`);
    };

    // Update quantity — syncs to Supabase
    const handleUpdateQuantity = async (bookId, delta) => {
        if (!user) return;

        const item = cartItems.find((i) => i.id === bookId);
        if (!item) return;

        const newQuantity = item.quantity + delta;

        if (newQuantity <= 0) {
            await handleRemoveFromCart(bookId);
            return;
        }

        const { error } = await supabase
            .from('cart_items')
            .update({ quantity: newQuantity })
            .eq('user_id', user.id)
            .eq('book_id', bookId);

        if (error) {
            console.error('Failed to update quantity:', error);
            return;
        }

        setCartItems((prev) =>
            prev.map((i) => (i.id === bookId ? { ...i, quantity: newQuantity } : i))
        );
    };

    // Remove from cart — deletes from Supabase
    const handleRemoveFromCart = async (bookId) => {
        if (!user) return;

        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id)
            .eq('book_id', bookId);

        if (error) {
            console.error('Failed to remove from cart:', error);
            return;
        }

        setCartItems((prev) => prev.filter((item) => item.id !== bookId));
    };

    // Clear entire cart — used after successful checkout
    const handleClearCart = async () => {
        if (!user) return;

        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id);

        if (error) {
            console.error('Failed to clear cart:', error);
            return;
        }

        setCartItems([]);
    };

    const handleToggleFav = (book) => {
        setFavorites((prevFavs) => {
            const exists = prevFavs.some((item) => item.id === book.id);
            if (exists) {
                showToast(` Removed "${book.title}" from favorites.`);
                return prevFavs.filter((item) => item.id !== book.id);
            }
            showToast(` Added "${book.title}" to favorites!`);
            return [...prevFavs, book];
        });
    };

    const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="app-container">
            <AppHeader
                favoritesCount={favorites.length}
                cartCount={totalCartCount}
                onNavigateDashboard={() => setCurrentPage('dashboard')}
                onNavigateFavorites={() => setCurrentPage('favorites')}
                onNavigateCart={() => setCurrentPage('cart')}
            />
            <AppToast message={toastMessage} />

            <main className="main-content">
                {currentPage === 'dashboard' && (
                    <Dashboard
                        favorites={favorites}
                        onAddToCart={handleAddToCart}
                        onToggleFav={handleToggleFav}
                    />
                )}
                {currentPage === 'cart' && (
                    <Cart
                        cartItems={cartItems}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveFromCart}
                        onClearCart={handleClearCart}
                        onNavigateHome={() => setCurrentPage('dashboard')}
                    />
                )}
                {currentPage === 'favorites' && (
                    <Favorites
                        favorites={favorites}
                        onAddToCart={handleAddToCart}
                        onToggleFav={handleToggleFav}
                        onNavigateHome={() => setCurrentPage('dashboard')}
                    />
                )}
            </main>
            <Footer />
        </div>
    );
}