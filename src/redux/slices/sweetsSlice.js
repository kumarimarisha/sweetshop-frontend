import { createSlice } from '@reduxjs/toolkit';

const sweetsSlice = createSlice({
  name: 'sweets',
  initialState: {
    items: [],
    filteredItems: [],
    loading: false,
    error: null,
    searchQuery: '',
    selectedCategory: 'all',
  },
  reducers: {
    setSweetsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSweetsError: (state, action) => {
      state.error = action.payload;
    },
    setSweets: (state, action) => {
      state.items = action.payload;
      state.filteredItems = action.payload;
      state.loading = false;
    },
    addSweet: (state, action) => {
      state.items.push(action.payload);
      state.filteredItems = state.items;
    },
    updateSweet: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        state.filteredItems = state.items;
      }
    },
    deleteSweet: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.filteredItems = state.items;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      filterSweets(state);
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      filterSweets(state);
    },
  },
});

const filterSweets = (state) => {
  let filtered = state.items;

  // Filter by search query
  if (state.searchQuery) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(state.searchQuery.toLowerCase())
    );
  }

  // Filter by category
  if (state.selectedCategory !== 'all') {
    filtered = filtered.filter(item => item.category === state.selectedCategory);
  }

  state.filteredItems = filtered;
};

export const {
  setSweetsLoading,
  setSweetsError,
  setSweets,
  addSweet,
  updateSweet,
  deleteSweet,
  setSearchQuery,
  setSelectedCategory,
} = sweetsSlice.actions;
export default sweetsSlice.reducer;
