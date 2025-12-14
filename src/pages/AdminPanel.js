import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSweets, deleteSweet } from '../redux/slices/sweetsSlice';
import {
  Container,
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddSweetForm from '../components/AddSweetForm';
import EditSweetForm from '../components/EditSweetForm';

function AdminPanel() {
  const dispatch = useDispatch();
  const { items } = useSelector(state => state.sweets);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState(null);

  useEffect(() => {
    // Fetch sweets from backend API
    const fetchSweets = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sweets');
        if (!response.ok) throw new Error('Failed to fetch sweets');
        const sweets = await response.json();
        dispatch(setSweets(sweets));
      } catch (error) {
        console.error('Error fetching sweets:', error);
      }
    };

    fetchSweets();
  }, [dispatch]);

  const handleDelete = async (sweetId) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        const token = localStorage.getItem('firebaseToken');
        const response = await fetch(`http://localhost:5000/api/sweets/${sweetId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to delete');
        dispatch(deleteSweet(sweetId));
        toast.success('Sweet deleted successfully!');
      } catch (error) {
        toast.error('Error deleting sweet: ' + error.message);
      }
    }
  };

  const handleEdit = (sweet) => {
    setSelectedSweet(sweet);
    setOpenEditForm(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Admin Panel - Manage Sweets</Typography>
        <Button
          variant="contained"
          color="success"
          onClick={() => setOpenAddForm(true)}
        >
          Add New Sweet
        </Button>
      </Box>

      {/* Add Sweet Form Dialog */}
      <Dialog open={openAddForm} onClose={() => setOpenAddForm(false)} maxWidth="sm" fullWidth>
        <AddSweetForm onClose={() => setOpenAddForm(false)} />
      </Dialog>

      {/* Edit Sweet Form Dialog */}
      {selectedSweet && (
        <Dialog open={openEditForm} onClose={() => setOpenEditForm(false)} maxWidth="sm" fullWidth>
          <EditSweetForm
            sweet={selectedSweet}
            onClose={() => {
              setOpenEditForm(false);
              setSelectedSweet(null);
            }}
          />
        </Dialog>
      )}

      {/* Sweets Table */}
      {items.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(sweet => (
                <TableRow key={sweet.id}>
                  <TableCell>{sweet.name}</TableCell>
                  <TableCell>{sweet.category}</TableCell>
                  <TableCell align="right">₹{sweet.price.toFixed(2)}</TableCell>
                  <TableCell align="right">{sweet.quantity}</TableCell>
                  <TableCell>{sweet.description}</TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEdit(sweet)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(sweet.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>No sweets yet. Create your first one!</Typography>
        </Box>
      )}
      <ToastContainer />
    </Container>
  );
}

export default AdminPanel;
