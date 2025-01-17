import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Alert,
  DialogContentText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const navigate = useNavigate();

   useEffect(() => {
     const verifyUserRole = async () => {
       const token = localStorage.getItem("token");
       if (!token) {
         navigate("/login"); // Redirect to login if no token is found
         return;
       }

       try {
         const userResponse = await axios.get(
           "http://localhost:8000/api/user-detail/",
           {
             headers: {
               Authorization: `Bearer ${token}`,
             },
           }
         );

         if (userResponse.data.role !== "admin") {
           navigate("/unauthorized"); // Redirect to unauthorized page if role is not admin
           return;
         }
       } catch (err) {
         setError("Error fetching user data.");
         console.error("Error verifying user role:", err);
       }
     };
     verifyUserRole();
   }, [navigate]);
  
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/user/")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching users.");
        setLoading(false);
      });
  }, []);

  const toggleActive = (id) => {
    setLoading(true);
    axiosInstance
      .patch(`/user/${id}/`)
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, is_active: !user.is_active } : user
          )
        );
        setLoading(false);
      })
      .catch((error) => {
        setError("Error toggling user status.");
        setLoading(false);
      });
  };

  const deleteUser = () => {
    setLoading(true);
    axiosInstance
      .delete(`/user/${userToDelete}/`)
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userToDelete)
        );
        setDeleteConfirmOpen(false);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error deleting user.");
        setLoading(false);
      });
  };

  const handleDialogOpen = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = () => {
    setLoading(true);
    axiosInstance
      .post("/user/", newUser)
      .then((response) => {
        setUsers((prevUsers) => [...prevUsers, response.data]);
        setNewUser({ username: "", email: "", password: "", role: "" });
        handleDialogClose();
        setLoading(false);
      })
      .catch((error) => {
        setError("Error adding user.");
        setLoading(false);
      });
  };

  const handleDeleteConfirmOpen = (id) => {
    setUserToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            User Management
          </Typography>
          <Box>
            <Button
              color="inherit"
              onClick={handleDialogOpen}
              disabled={loading}
            >
              Add User
            </Button>
            <Button
              color="inherit"
              onClick={handleLogout}
              style={{ marginLeft: "10px" }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ marginTop: 3 }}>
        {error && <Alert severity="error">{error}</Alert>}
        {loading && (
          <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
        )}

        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                >
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.is_active ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color={user.is_active ? "secondary" : "success"}
                      onClick={() => toggleActive(user.id)}
                      disabled={loading}
                    >
                      {user.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      style={{ marginLeft: "10px" }}
                      onClick={() => handleDeleteConfirmOpen(user.id)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add User Dialog */}
        <Dialog open={open} onClose={handleDialogClose}>
          <DialogTitle>Add New User</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Username"
              type="text"
              fullWidth
              name="username"
              value={newUser.username}
              onChange={handleInputChange}
              disabled={loading}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              disabled={loading}
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
              disabled={loading}
            />
            <TextField
              margin="dense"
              label="Role"
              type="text"
              fullWidth
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
              disabled={loading}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleDialogClose}
              color="secondary"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleAddUser} color="primary" disabled={loading}>
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteConfirmClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={deleteUser} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default UserManagement;
