import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addSweet } from '../redux/slices/sweetsSlice';
import {
  Box,
  TextField,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
  import Typography from '@mui/material/Typography';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddSweetForm({ onClose }) {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const onSubmit = async (data) => {
    if (isLoading) return; // Prevent duplicate submissions
    
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('firebaseToken');
      const response = await fetch('http://localhost:5000/api/sweets', {
        method: 'POST',
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
      if (!response.ok) throw new Error('Failed to add sweet');
      const result = await response.json();

      dispatch(addSweet({
        id: result.id,
        name: data.name,
        description: data.description,
        category: data.category,
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity),
        image: data.image || '',
      }));

      toast.success('Sweet added successfully!');
      reset();
      onClose();
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DialogTitle>Add New Sweet</DialogTitle>
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
            placeholder="e.g., Chocolate, Gummy, Lollipop"
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
            {errors.image && (
              <Typography color="error" variant="caption">
                {errors.image?.message}
              </Typography>
            )}
            <Typography variant="caption" color="textSecondary">
              Paste full image URL from: imgur.com, unsplash.com, or any image hosting site
            </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Sweet'}
        </Button>
      </DialogActions>
      <ToastContainer />
    </>
  );
}

export default AddSweetForm;
