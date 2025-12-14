import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSweets, setSearchQuery, setSelectedCategory } from '../redux/slices/sweetsSlice';
import {
  Container,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import SweetGallery from '../components/SweetGallery';

function Dashboard() {
  const dispatch = useDispatch();
  const { filteredItems, searchQuery, selectedCategory } = useSelector(state => state.sweets);
  const [categories, setCategories] = useState(['all']);

  useEffect(() => {
    // Fetch sweets from backend API
    const fetchSweets = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sweets');
        if (!response.ok) throw new Error('Failed to fetch sweets');
        const sweets = await response.json();
        dispatch(setSweets(sweets));

        // Extract unique categories
        const uniqueCategories = ['all', ...new Set(sweets.map(sweet => sweet.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching sweets:', error);
      }
    };

    fetchSweets();
  }, [dispatch]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        🍬 Welcome to SweetShop
      </Typography>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Search sweets by name or description..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          variant="outlined"
          size="small"
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
            label="Category"
          >
            {categories.map(category => (
              <MenuItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Sweets Gallery */}
      {filteredItems.length > 0 ? (
        <SweetGallery sweets={filteredItems} />
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No sweets found. Try adjusting your search or filters.
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default Dashboard;
