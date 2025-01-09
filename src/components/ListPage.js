import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUsers, deleteUser } from './redux/userSlice';
import axios from 'axios';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Button, Paper } from '@mui/material';

const ListPage = () => {
  const users = useSelector((state) => state.users.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users');
        dispatch(setUsers(response.data));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [dispatch]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  // Handle delete user
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // Send DELETE request to json-server
        await axios.delete(`http://localhost:5000/users/${id}`);

        // Dispatch delete action in Redux to remove user from Redux state
        dispatch(deleteUser(id));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Function to calculate total marks and determine pass/fail
  const calculatePassFail = (marks1, marks2, marks3) => {
    // Parse marks as integers to ensure correct addition
    const totalMarks = parseInt(marks1, 10) + parseInt(marks2, 10) + parseInt(marks3, 10);
    const passFail = totalMarks >= 50 ? 'Pass' : 'Fail';
    return { totalMarks, passFail };
  };

  return (
    <div>
      <h1>User List</h1>
      <Button variant="contained" color="primary" onClick={() => navigate('/form')}>
        Create User
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Marks1</TableCell>
              <TableCell>Marks2</TableCell>
              <TableCell>Marks3</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">No users available.</TableCell>
              </TableRow>
            ) : (
              users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => {
                const { totalMarks, passFail } = calculatePassFail(user.marks1, user.marks2, user.marks3);
                
                // Conditionally set the background color for the Status cell
                const statusColor = passFail === 'Pass' ? 'green' : 'red';

                return (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.marks1}</TableCell>
                    <TableCell>{user.marks2}</TableCell>
                    <TableCell>{user.marks3}</TableCell>
                    <TableCell
                      sx={{
                        
                        textAlign:'center',
                        color: 'white', // To ensure the text is visible on green/red background
                      }}
                    >
                      <div className='pass-fail' style={{backgroundColor: `${statusColor}`,padding:"0.32rem",fontWeight:"bold",borderRadius:"0.3rem"}}>
                      {passFail}

                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/form/${user.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleDelete(user.id)}
                        style={{ marginLeft: '8px' }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[1, 5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ListPage;
