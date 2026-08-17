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

 const [favorites, setFavorites] = useState([]);
const [favoritesReady, setFavoritesReady] = useState(false);

// Load the correct favorites list whenever auth state changes:
// guests get their own key, each logged-in user gets their own key too.
useEffect(() => {
    const key = user ? `bookly_favorites_${user.id}` : 'bookly_favorites_guest';
    const saved = localStorage.getItem(key);
    setFavorites(saved ? JSON.parse(saved) : []);
    setFavoritesReady(true);
}, [user]);

// Save favorites — only reacts to favorites changing, not to user changing,
// so it never overwrites a freshly-loaded list with a stale one mid-switch.
useEffect(() => {
    if (!favoritesReady) return;
    const key = user ? `bookly_favorites_${user.id}` : 'bookly_favorites_guest';
    localStorage.setItem(key, JSON.stringify(favorites));
}, [favorites]);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage('');
        }, 3000);
    };

    // Guest: cart lives in localStorage. Logged in: cart lives in Supabase.
    // The moment someone logs in, any guest cart items get merged into their account.
    useEffect(() => {
        async function loadGuestCart() {
            const saved = localStorage.getItem('bookly_guest_cart');
            setCartItems(saved ? JSON.parse(saved) : []);
        }

        async function loadAndMergeCart() {
            const guestCartRaw = localStorage.getItem('bookly_guest_cart');
            const guestCart = guestCartRaw ? JSON.parse(guestCartRaw) : [];

            if (guestCart.length > 0) {
                const rowsToUpsert = guestCart.map((item) => ({
                    user_id: user.id,
                    book_id: item.id,
                    title: item.title,
                    author: item.author,
                    price: item.price,
                    cover_url: item.cover_url,
                    quantity: item.quantity,
                }));

                await supabase
                    .from('cart_items')
                    .upsert(rowsToUpsert, { onConflict: 'user_id,book_id' });

                localStorage.removeItem('bookly_guest_cart');
            }

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

        if (!user) {
            loadGuestCart();
        } else {
            loadAndMergeCart();
        }
    }, [user]);

    // Keep guest cart persisted to localStorage as it changes
    useEffect(() => {
        if (!user) {
            localStorage.setItem('bookly_guest_cart', JSON.stringify(cartItems));
        }
    }, [cartItems, user]);

    const handleAddToCart = async (book) => {
        const existing = cartItems.find((item) => item.id === book.id);
        const newQuantity = existing ? existing.quantity + 1 : 1;

        if (!user) {
            setCartItems((prevItems) => {
                if (existing) {
                    return prevItems.map((item) =>
                        item.id === book.id ? { ...item, quantity: newQuantity } : item
                    );
                }
                return [...prevItems, { ...book, quantity: 1 }];
            });
            showToast(`🛒 "${book.title}" added to cart!`);
            return;
        }

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

    const handleUpdateQuantity = async (bookId, delta) => {
        const item = cartItems.find((i) => i.id === bookId);
        if (!item) return;

        const newQuantity = item.quantity + delta;

        if (newQuantity <= 0) {
            await handleRemoveFromCart(bookId);
            return;
        }

        if (!user) {
            setCartItems((prev) =>
                prev.map((i) => (i.id === bookId ? { ...i, quantity: newQuantity } : i))
            );
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

    const handleRemoveFromCart = async (bookId) => {
        if (!user) {
            setCartItems((prev) => prev.filter((item) => item.id !== bookId));
            return;
        }

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

    const handleClearCart = async () => {
        if (!user) {
            setCartItems([]);
            localStorage.removeItem('bookly_guest_cart');
            return;
        }

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