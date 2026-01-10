import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import friendsReducer from './features/friends/friendsSlice';
import notificationsReducer from './features/notifications/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    friends: friendsReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // For non-serializable data like Dates in notifications if needed (though I used ISO string)
    }),
});
