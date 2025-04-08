import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { getUsers, addUser, updateUser, deleteUser } from "../services/UserService";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    password: "clickr@123", // Default password
    role_id: "2", // Default role (Employee)
    position: "",
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const usersData = await getUsers();
      console.log("Fetched users:", usersData); // Debugging: Check API response
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle delete user
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        fetchUsers(); // Refresh the user list
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Handle edit user
  const handleEdit = (user) => {
    setEditUser(user); // Set the user to be edited
    setShowModal(true); // Open the modal
  };

  // Handle save (add or update user)
  const handleSave = async () => {
    try {
      if (editUser) {
        await updateUser(editUser.user_id, editUser); // Update existing user
      } else {
        await addUser(newUser); // Add new user
      }
      setShowModal(false); // Close the modal
      fetchUsers(); // Refresh the user list
      // Reset newUser state
      setNewUser({
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        mobile_number: "",
        password: "clickr@123",
        role_id: "2",
        position: "",
      });
      setEditUser(null); // Reset editUser state
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>User Management</h2>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add User
      </Button>

      {/* User Table */}
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile Number</th>
            <th>Role</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.user_id}>
                <td>
                  {user.first_name} {user.middle_name} {user.last_name}
                </td>
                <td>{user.email}</td>
                <td>{user.mobile_number}</td>
                <td>
                  {user.role_id === 1
                    ? "Super Admin"
                    : user.role_id === 2
                    ? "Employee"
                    : "Admin"}
                </td>
                <td>{user.position}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEdit(user)}>
                    Edit
                  </Button>{" "}
                  <Button variant="danger" onClick={() => handleDelete(user.user_id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No users found</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for Adding/Editing Users */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editUser ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={editUser ? editUser.first_name : newUser.first_name}
                onChange={(e) =>
                  editUser
                    ? setEditUser({ ...editUser, first_name: e.target.value })
                    : setNewUser({ ...newUser, first_name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Middle Name</Form.Label>
              <Form.Control
                type="text"
                value={editUser ? editUser.middle_name : newUser.middle_name}
                onChange={(e) =>
                  editUser
                    ? setEditUser({ ...editUser, middle_name: e.target.value })
                    : setNewUser({ ...newUser, middle_name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={editUser ? editUser.last_name : newUser.last_name}
                onChange={(e) =>
                  editUser
                    ? setEditUser({ ...editUser, last_name: e.target.value })
                    : setNewUser({ ...newUser, last_name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editUser ? editUser.email : newUser.email}
                onChange={(e) =>
                  editUser
                    ? setEditUser({ ...editUser, email: e.target.value })
                    : setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                value={editUser ? editUser.mobile_number : newUser.mobile_number}
                onChange={(e) =>
                  editUser
                    ? setEditUser({ ...editUser, mobile_number: e.target.value })
                    : setNewUser({ ...newUser, mobile_number: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={editUser ? editUser.role_id : newUser.role_id}
                onChange={(e) =>
                  editUser
                    ? setEditUser({ ...editUser, role_id: e.target.value })
                    : setNewUser({ ...newUser, role_id: e.target.value })
                }
              >
                <option value="1">Super Admin</option>
                <option value="2">Employee</option>
                <option value="3">Admin</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Position</Form.Label>
              <Form.Control
                type="text"
                value={editUser ? editUser.position : newUser.position}
                onChange={(e) =>
                  editUser
                    ? setEditUser({ ...editUser, position: e.target.value })
                    : setNewUser({ ...newUser, position: e.target.value })
                }
              />
            </Form.Group>
            {!editUser && (
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  disabled // Password is set to default and cannot be changed
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;