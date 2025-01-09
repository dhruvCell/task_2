import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { setFormUser, setSubmitting, addUser, updateUser } from './redux/userSlice'; // Adjust path
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { Field, reduxForm, Form } from 'redux-form'; // Import redux-form components
import { useParams, useNavigate } from 'react-router-dom'; // Import the useParams and useNavigate hooks
import { validate } from './redux/userSlice'; // Import the validate function

const withParamsAndNavigate = (Component) => {
  return (props) => {
    const params = useParams();
    const navigate = useNavigate();
    return <Component {...props} params={params} navigate={navigate} />;
  };
};

class FormPage extends Component {
  componentDidMount() {
    const { params, dispatch, initialize } = this.props;
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

      // Initialize form with fetched user data
      this.props.initialize(fetchedUser);
      this.props.dispatch(setFormUser(fetchedUser));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  handleSubmit = async (values) => {
    const { dispatch, navigate } = this.props;

    try {
      if (values.id) {
        await axios.patch(`http://localhost:5000/users/${values.id}`, values);
        dispatch(updateUser(values));
      } else {
        const response = await axios.post('http://localhost:5000/users', values);
        dispatch(addUser(response.data));
      }
      navigate('/');
    } catch (error) {
      console.error('Error submitting user:', error);
    }
  };

  renderTextField = ({ input, label, meta: { touched, error } }) => (
    <Box mb={2}>
      <TextField
        {...input}  // Spread input props to pass value, onChange, etc.
        label={label}
        fullWidth
        variant="outlined"
        error={touched && !!error}
        helperText={touched && error}
      />
    </Box>
  );

  render() {
    const { handleSubmit, isSubmitting } = this.props;

    return (
      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {this.props.params.id ? 'Edit User' : 'Create User'}
        </Typography>
        <Form onSubmit={handleSubmit(this.handleSubmit)}>
          <Field name="name" label="Name" component={this.renderTextField} />
          <Field name="phone" label="Phone" component={this.renderTextField} />
          <Field name="email" label="Email" component={this.renderTextField} />
          <Field name="marks1" label="Marks 1" component={this.renderTextField} />
          <Field name="marks2" label="Marks 2" component={this.renderTextField} />
          <Field name="marks3" label="Marks 3" component={this.renderTextField} />
          
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
        </Form>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.users.form.user,
  isSubmitting: state.users.form.isSubmitting,
});

const FormPageRedux = reduxForm({
  form: 'userForm', // Unique form name
  validate, // Pass validate function here from userSlice
  touchOnChange: true, // This will trigger error display on change
})(FormPage);

export default withParamsAndNavigate(connect(mapStateToProps)(FormPageRedux));
