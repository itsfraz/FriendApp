import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../Services/authService';
import { API_URL } from '../../config';

export const fetchFriends = createAsyncThunk(
  'friends/fetchFriends',
  async (userId, { rejectWithValue }) => {
    try {
      // api instance automatically adds Authorization header
      const response = await api.get(`/friend-list/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch friends');
    }
  }
);

const friendsSlice = createSlice({
  name: 'friends',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Optimistic updates could be added here
    setFriends: (state, action) => {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFriends } = friendsSlice.actions;
export default friendsSlice.reducer;
