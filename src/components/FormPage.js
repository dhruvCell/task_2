import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { setFormUser, setSubmitting, addUser, updateUser,validateField } from './redux/userSlice'; // Adjust path
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom'; // Import the useParams and useNavigate hooks

const withParamsAndNavigate = (Component) => {
  return (props) => {
    const params = useParams();
    const navigate = useNavigate();
    return <Component {...props} params={params} navigate={navigate} />;
  };
};

class FormPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: '',
        phone: '',
        email: '',
        marks1: '',
        marks2: '',
        marks3: '',
      },
    };
  }

  componentDidMount() {
    const { params, dispatch } = this.props;
    const { id } = params;

    if (id) {
      this.fetchUserData(id);
    }
    dispatch(setSubmitting(false));
  }

  fetchUserData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${id}`);
      const fetchedUser = response.data;
      this.setState({ user: fetchedUser });
      this.props.dispatch(setFormUser(fetchedUser));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;

    // Update local state
    this.setState((prevState) => ({
      user: {
        ...prevState.user,
        [name]: value,
      },
    }));

    // Dispatch actions to update form state and validate the field
    this.props.dispatch(setFormUser({ [name]: value }));

    // Validate field dynamically as user types
    this.props.dispatch(validateField({ field: name, value }));

    
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { user } = this.state;
    const { dispatch, navigate } = this.props;

    try {
      if (user.id) {
        await axios.patch(`http://localhost:5000/users/${user.id}`, user);
        dispatch(updateUser(user));
      } else {
        const response = await axios.post('http://localhost:5000/users', user);
        dispatch(addUser(response.data));
      }
      navigate('/');
    } catch (error) {
      console.error('Error submitting user:', error);
    }
  };

  render() {
    const { user } = this.state;
    const { errors, isSubmitting } = this.props;

    return (
      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {this.props.id ? 'Edit User' : 'Create User'}
        </Typography>
        <form onSubmit={this.handleSubmit}>
          {/* Name Input Field */}
          <Box mb={2}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={user.name}
              onChange={this.handleChange}
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name}
            />
          </Box>

          {/* Phone Input Field */}
          <Box mb={2}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={user.phone}
              onChange={this.handleChange}
              variant="outlined"
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Box>

          {/* Email Input Field */}
          <Box mb={2}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={user.email}
              onChange={this.handleChange}
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email}
            />
          </Box>

          {/* Marks 1 Input Field */}
          <Box mb={2}>
            <TextField
              fullWidth
              label="Marks 1"
              name="marks1"
              value={user.marks1}
              onChange={this.handleChange}
              variant="outlined"
              error={!!errors.marks1}
              helperText={errors.marks1}
            />
          </Box>

          {/* Marks 2 Input Field */}
          <Box mb={2}>
            <TextField
              fullWidth
              label="Marks 2"
              name="marks2"
              value={user.marks2}
              onChange={this.handleChange}
              variant="outlined"
              error={!!errors.marks2}
              helperText={errors.marks2}
            />
          </Box>

          {/* Marks 3 Input Field */}
          <Box mb={2}>
            <TextField
              fullWidth
              label="Marks 3"
              name="marks3"
              value={user.marks3}
              onChange={this.handleChange}
              variant="outlined"
              error={!!errors.marks3}
              helperText={errors.marks3}
            />
          </Box>

          {/* Submit Button */}
          <Box textAlign="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.users.form.user,
  errors: state.users.form.errors,
  isSubmitting: state.users.form.isSubmitting,
});

export default withParamsAndNavigate(connect(mapStateToProps)(FormPage));
