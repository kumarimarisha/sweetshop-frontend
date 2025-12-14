import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function SweetCard({ sweet }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (sweet.quantity === 0) {
      toast.error('Out of stock!');
      return;
    }

    dispatch(addToCart({
      id: sweet.id,
      name: sweet.name,
      price: sweet.price,
      image: sweet.image,
      quantity: quantity,
    }));

    toast.success(`${sweet.name} added to cart!`);
    setQuantity(1);
  };

  return (
    <Card sx={{ 
      height: '420px', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {sweet.image && (
        <CardMedia
          component="img"
          height="150"
          image={sweet.image}
          alt={sweet.name}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        padding: '12px',
        '&:last-child': { paddingBottom: '12px' }
      }}>
        <Typography gutterBottom variant="subtitle1" component="div" sx={{ 
          fontWeight: 'bold',
          fontSize: '14px',
          height: '24px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {sweet.name}
        </Typography>
        
        <Typography variant="caption" color="textSecondary" sx={{ 
          mb: 0.5,
          height: '40px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: 1.2
        }}>
          {sweet.description}
        </Typography>
        
        <Typography variant="caption" color="textSecondary" sx={{ mb: 0.5, fontSize: '12px' }}>
          {sweet.category}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, gap: 1 }}>
          <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
            ₹{sweet.price.toFixed(2)}
          </Typography>
          <Typography variant="caption" color={sweet.quantity === 0 ? 'error' : 'success'} sx={{ fontSize: '11px' }}>
            {sweet.quantity === 0 ? 'Out of Stock' : `${sweet.quantity} stock`}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', mb: 1 }}>
          <Button
            size="small"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={sweet.quantity === 0}
            sx={{ padding: '4px 8px', minWidth: '30px' }}
          >
            -
          </Button>
          <Typography sx={{ minWidth: '20px', textAlign: 'center', fontSize: '12px' }}>{quantity}</Typography>
          <Button
            size="small"
            onClick={() => setQuantity(Math.min(sweet.quantity, quantity + 1))}
            disabled={sweet.quantity === 0}
            sx={{ padding: '4px 8px', minWidth: '30px' }}
          >
            +
          </Button>
        </Box>
        
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleAddToCart}
          disabled={sweet.quantity === 0}
          size="small"
          sx={{ fontSize: '12px', padding: '6px' }}
        >
          Purchase
        </Button>
      </CardContent>
      <ToastContainer />
    </Card>
  );
}

export default SweetCard;
