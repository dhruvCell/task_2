import { configureStore } from '@reduxjs/toolkit';
import { reducer as formReducer } from 'redux-form';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    form: formReducer,
    users: userReducer,
  },
});

export default store;
