import React, { Component } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const FormPageWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  return <FormPage navigate={navigate} location={location} dispatch={dispatch} />;
};

class FormPage extends Component {
  constructor(props) {
    super(props);
    const user = props.location.state?.user || {
      name: '',
      phone: '',
      email: '',
      marks1: '',
      marks2: '',
      marks3: ''
    };

    this.state = { user };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      user: {
        ...prevState.user,
        [name]: value,
      },
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { user } = this.state;
    const { dispatch, navigate } = this.props;

    try {
      if (user.id) {
        await axios.patch(`http://localhost:5000/users/${user.id}`, user);
        dispatch({ type: 'UPDATE_USER', payload: user });
      } else {
        const response = await axios.post('http://localhost:5000/users', user);
        dispatch({ type: 'ADD_USER', payload: response.data });
      }
      navigate('/');
    } catch (error) {
      console.error('Error submitting user:', error);
    }
  };

  render() {
    const { user } = this.state;

    return (
      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {user.id ? 'Edit User' : 'Create User'}
        </Typography>
        <form onSubmit={this.handleSubmit}>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={user.name}
              onChange={this.handleChange}
              variant="outlined"
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={user.phone}
              onChange={this.handleChange}
              variant="outlined"
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={user.email}
              onChange={this.handleChange}
              variant="outlined"
              type="email"
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Marks 1"
              name="marks1"
              value={user.marks1}
              onChange={this.handleChange}
              variant="outlined"
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Marks 2"
              name="marks2"
              value={user.marks2}
              onChange={this.handleChange}
              variant="outlined"
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Marks 3"
              name="marks3"
              value={user.marks3}
              onChange={this.handleChange}
              variant="outlined"
            />
          </Box>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ padding: '10px', marginTop: '16px' }}
          >
            {user.id ? 'Update User' : 'Create User'}
          </Button>
        </form>
      </Container>
    );
  }
}

export default FormPageWrapper;