import { configureStore } from '@reduxjs/toolkit';

import { auth, firestore, functions } from '../firebase/firebaseSetup';

import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import historyReducer from './slices/historySlice';
import onboardingReducer from './slices/onboardingSlice';
import toolHistoryReducer from './slices/toolHistorySlice';
import toolsReducer from './slices/toolsSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    tools: toolsReducer,
    toolHistory: toolHistoryReducer,
    chat: chatReducer,
    onboarding: onboardingReducer,
    history: historyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export { auth, firestore, functions };
export default store;
