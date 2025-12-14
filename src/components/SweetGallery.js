import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SweetGallery({ sweets }) {
  const dispatch = useDispatch();
  const [selectedSweet, setSelectedSweet] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleImageClick = (sweet) => {
    setSelectedSweet(sweet);
    setQuantity(1);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSweet(null);
  };

  const handleAddToCart = () => {
    if (selectedSweet.quantity === 0) {
      toast.error('Out of stock!');
      return;
    }

    dispatch(addToCart({
      id: selectedSweet.id,
      name: selectedSweet.name,
      price: selectedSweet.price,
      image: selectedSweet.image,
      quantity: quantity,
    }));

    toast.success(`${selectedSweet.name} added to cart!`);
    handleCloseDialog();
  };

  return (
    <>
      <Grid container spacing={2}>
        {sweets.map(sweet => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={sweet.id}>
            <Paper
              elevation={2}
              sx={{
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
                },
                backgroundColor: '#fff',
                borderRadius: '12px',
              }}
              onClick={() => handleImageClick(sweet)}
            >
              {/* Image Container */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '280px',
                  overflow: 'hidden',
                  backgroundColor: '#f5f5f5',
                }}
              >
                {sweet.image ? (
                  <img
                    src={sweet.image}
                    alt={sweet.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#e0e0e0',
                    }}
                  >
                    <Typography variant="caption" color="textSecondary">
                      No Image
                    </Typography>
                  </Box>
                )}

                {/* Stock Status Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor:
                      sweet.quantity === 0 ? '#ff5252' : '#4caf50',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {sweet.quantity === 0 ? 'Out of Stock' : `${sweet.quantity} Left`}
                </Box>
              </Box>

              {/* Info Section */}
              <Box sx={{ padding: '12px' }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '14px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    mb: 0.5,
                  }}
                >
                  {sweet.name}
                </Typography>

                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{
                    display: 'block',
                    fontSize: '11px',
                    mb: 0.5,
                  }}
                >
                  {sweet.category}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: 'bold', fontSize: '16px' }}
                  >
                    ₹{sweet.price.toFixed(2)}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '11px', color: '#999' }}>
                    Click to view
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Details Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {selectedSweet && (
          <>
            <DialogTitle sx={{ fontWeight: 'bold' }}>
              {selectedSweet.name}
            </DialogTitle>
            <DialogContent>
              {selectedSweet.image && (
                <Box
                  sx={{
                    width: '100%',
                    height: '250px',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    mb: 2,
                    backgroundColor: '#f5f5f5',
                  }}
                >
                  <img
                    src={selectedSweet.image}
                    alt={selectedSweet.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              )}

              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {selectedSweet.description}
              </Typography>

              <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Category
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {selectedSweet.category}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    In Stock
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: selectedSweet.quantity === 0 ? '#ff5252' : '#4caf50',
                    }}
                  >
                    {selectedSweet.quantity}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                ₹{selectedSweet.price.toFixed(2)}
              </Typography>

              {selectedSweet.quantity > 0 && (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2">Quantity:</Typography>
                  <Button
                    size="small"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <TextField
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.min(selectedSweet.quantity, parseInt(e.target.value) || 1))
                    }
                    inputProps={{ min: 1, max: selectedSweet.quantity }}
                    sx={{ width: '60px' }}
                    size="small"
                  />
                  <Button
                    size="small"
                    onClick={() => setQuantity(Math.min(selectedSweet.quantity, quantity + 1))}
                  >
                    +
                  </Button>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleAddToCart}
                  disabled={selectedSweet.quantity === 0}
                >
                  Add to Cart
                </Button>
                <Button fullWidth variant="outlined" onClick={handleCloseDialog}>
                  Close
                </Button>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}

export default SweetGallery;
