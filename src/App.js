import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { setUser, setLoading, setIsAdmin } from './redux/slices/authSlice';
import { setCart } from './redux/slices/cartSlice';
import { onAuthChange, getUserRole } from './services/authService';
import { loadCartForUser, saveCartForUser } from './services/cartService';
import store from './redux/store';
import theme from './theme';

// Pages - will be created next
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Cart from './pages/Cart';
import Navbar from './components/Navbar';

import './App.css';

function AppContent() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.auth);
  const cart = useSelector(state => state.cart);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthChange(async (authUser) => {
      if (authUser) {
        // Get user role with timeout
        const rolePromise = getUserRole(authUser.uid);
        const timeoutPromise = new Promise(resolve => setTimeout(() => resolve('user'), 3000));
        const role = await Promise.race([rolePromise, timeoutPromise]);
        const isAdmin = role === 'admin';

        dispatch(setUser({
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
        }));
        dispatch(setIsAdmin(isAdmin));
        
        // Load user's saved cart from Firestore with timeout
        try {
          const cartPromise = loadCartForUser(authUser.uid);
          const cartTimeoutPromise = new Promise(resolve => setTimeout(() => resolve([]), 3000));
          const savedCart = await Promise.race([cartPromise, cartTimeoutPromise]);
          dispatch(setCart(savedCart));
        } catch (err) {
          console.error('Failed to load saved cart:', err);
        }
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    });

    // Fallback: Force stop loading after 5 seconds
    const timeout = setTimeout(() => {
      dispatch(setLoading(false));
    }, 5000);

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [dispatch]);

  // Persist cart to Firestore when cart changes and user is logged in
  useEffect(() => {
    if (user && user.uid) {
      // debounce/save directly
      saveCartForUser(user.uid, cart).catch(err => console.error('Error saving cart:', err));
    }
  }, [cart.items, cart.totalPrice, user]);

  if (loading) {
    return (
      <div className="loading-container">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user ? <AdminPanel /> : <Navigate to="/login" />} />
        <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />

        {/* Default Route */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;