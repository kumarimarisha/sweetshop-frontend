import React from 'react';
import API_BASE_URL from "../config/api_temp.js";
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updateSweet } from '../redux/slices/sweetsSlice';
import {
  Box,
  TextField,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditSweetForm({ sweet, onClose }) {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: sweet.name,
      description: sweet.description,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
      image: sweet.image || '',
    },
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const onSubmit = async (data) => {
    if (isLoading) return; // Prevent duplicate submissions
    
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('firebaseToken');
      
      if (!token) {
        throw new Error('Authentication token not found. Please logout and login again.');
      }

      console.log('Updating sweet with token:', token.substring(0, 20) + '...');
      
      const response = await fetch(`${API_BASE_URL}/api/sweets/${sweet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          category: data.category,
          price: parseFloat(data.price),
          quantity: parseInt(data.quantity),
          image: data.image || '',
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        console.error('Update response error:', responseData);
        throw new Error(responseData.message || 'Failed to update sweet');
      }

      dispatch(updateSweet({
        id: sweet.id,
        name: data.name,
        description: data.description,
        category: data.category,
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity),
        image: data.image || '',
      }));

      toast.success('Sweet updated successfully!');
      onClose();
    } catch (err) {
      console.error('Edit error:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DialogTitle>Edit Sweet</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Sweet Name"
            {...register('name', { required: 'Name is required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            {...register('description', { required: 'Description is required' })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <TextField
            fullWidth
            label="Category"
            {...register('category', { required: 'Category is required' })}
            error={!!errors.category}
            helperText={errors.category?.message}
          />
          <TextField
            fullWidth
            label="Price"
            type="number"
            inputProps={{ step: '0.01', min: '0' }}
            {...register('price', { required: 'Price is required' })}
            error={!!errors.price}
            helperText={errors.price?.message}
          />
          <TextField
            fullWidth
            label="Quantity"
            type="number"
            inputProps={{ min: '0' }}
            {...register('quantity', { required: 'Quantity is required' })}
            error={!!errors.quantity}
            helperText={errors.quantity?.message}
          />
          <TextField
            fullWidth
            label="Image URL (optional)"
            {...register('image')}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Sweet'}
        </Button>
      </DialogActions>
      <ToastContainer />
    </>
  );
}

export default EditSweetForm;
