import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { logoutUser } from '../services/authService';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAdmin } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);
  
  // Check localStorage as fallback for admin status
  const isAdminLocal = isAdmin || localStorage.getItem('isAdmin') === 'true';

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      localStorage.removeItem('isAdmin');
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              🍬 SweetShop
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button color="inherit" onClick={() => navigate('/dashboard')}>
                Shop
              </Button>
              {isAdminLocal && (
                <Button color="inherit" onClick={() => navigate('/admin')}>
                  Admin Panel
                </Button>
              )}
              <Button color="inherit" onClick={() => navigate('/cart')}>
                Cart ({items.length})
              </Button>
              <Typography variant="body2" sx={{ mr: 2 }}>
                {user?.email}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <ToastContainer />
    </>
  );
}

export default Navbar;