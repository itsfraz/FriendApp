import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../Services/authService';
import { API_URL } from '../../config';

// Thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      // Token is attached by interceptor in authService
      const response = await api.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userId', action.payload.userId);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { loginSuccess, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
