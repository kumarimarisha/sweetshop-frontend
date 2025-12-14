import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateCartItemQuantity, removeFromCart, clearCart } from '../redux/slices/cartSlice';

function Cart() {
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector(state => state.cart);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleChangeQty = (id, qty) => {
    if (qty <= 0) return;
    dispatch(updateCartItemQuantity({ id, quantity: qty }));
  };

  if (!items || items.length === 0) {
    return (
      <Container sx={{ py: 6 }} maxWidth="md">
        <Typography variant="h5" align="center">Your cart is empty</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }} maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 3 }}>Your Cart</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          {items.map(item => (
            <Card key={item.id} sx={{ display: 'flex', mb: 2 }}>
              {item.image && (
                <CardMedia
                  component="img"
                  sx={{ width: 160, objectFit: 'cover' }}
                  image={item.image}
                  alt={item.name}
                />
              )}
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="textSecondary">₹{(item.price).toFixed(2)}</Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                  <Button size="small" variant="outlined" onClick={() => handleChangeQty(item.id, item.quantity - 1)}>-</Button>
                  <Typography>{item.quantity}</Typography>
                  <Button size="small" variant="outlined" onClick={() => handleChangeQty(item.id, item.quantity + 1)}>+</Button>
                </Box>
              </CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
                <IconButton color="error" onClick={() => handleRemove(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 2 }}>
            <Typography variant="h6">Order Summary</Typography>
            <Typography sx={{ mt: 2 }}>Items: {items.length}</Typography>
            <Typography sx={{ mt: 1 }}>Total: ₹{totalPrice.toFixed(2)}</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button variant="contained" color="primary" fullWidth>Checkout</Button>
            </Box>
            <Button variant="text" color="error" fullWidth sx={{ mt: 2 }} onClick={() => dispatch(clearCart())}>Clear Cart</Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Cart;
