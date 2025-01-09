import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    form: {
      user: {
        id: null,
        name: '',
        phone: '',
        email: '',
        marks1: '',
        marks2: '',
        marks3: '',
      },
      errors: {
        name: '',
        phone: '',
        email: '',
        marks1: '',
        marks2: '',
        marks3: '',
      },
      isSubmitting: false,
    },
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index >= 0) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    setFormUser: (state, action) => {
      state.form.user = { ...state.form.user, ...action.payload };
    },
    setSubmitting: (state, action) => {
      state.form.isSubmitting = action.payload;
    },
  },
});

export const {
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  setFormUser,
  setSubmitting,
} = userSlice.actions;

export default userSlice.reducer;

// Validation function
export const validate = (values) => {
  const errors = {};

  // Validate name (only alphabets)
  if (!values.name) {
    errors.name = 'Name is required';
  } else if (!/^[A-Za-z\s]+$/.test(values.name)) {
    errors.name = 'Name must contain only alphabets';
  }

  // Validate phone number (basic phone number pattern)
  if (!values.phone) {
    errors.phone = 'Phone is required';
  } else if (!/^\+?[0-9]{10,15}$/.test(values.phone)) {
    errors.phone = 'Phone number must be valid';
  }

  // Validate email
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email is invalid';
  }

  // Validate marks between 1 and 100
  for (let i = 1; i <= 3; i++) {
    if (!values[`marks${i}`]) {
      errors[`marks${i}`] = `Marks ${i} is required`;
    } else if (values[`marks${i}`] < 1 || values[`marks${i}`] > 100) {
      errors[`marks${i}`] = `Marks must be between 1 and 100`;
    }
  }

  return errors;
};
