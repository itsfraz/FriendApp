import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
    unreadCount: 0,
  },
  reducers: {
    addNotification: (state, action) => {
      state.list.unshift({ ...action.payload, timestamp: new Date().toISOString() });
      state.unreadCount += 1;
    },
    clearNotifications: (state) => {
      state.list = [];
      state.unreadCount = 0;
    },
    markAllAsRead: (state) => {
        state.unreadCount = 0;
    }
  },
});

export const { addNotification, clearNotifications, markAllAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
