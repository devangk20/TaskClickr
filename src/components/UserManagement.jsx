import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { getUsers, addUser, updateUser, deleteUser } from "../services/UserService";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({ first_name: "", last_name: "", email: "", role_id: "2", password: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const usersData = await getUsers();
    console.log("Fetched users:", usersData); // Check the structure of API response
    setUsers(usersData);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
      fetchUsers();
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editUser) {
      await updateUser(editUser.user_id, editUser);
    } else {
      await addUser(newUser);
    }
    setShowModal(false);
    fetchUsers();
  };

  return (
    <div className="container mt-4">
      <h2>User Management</h2>
      <Button variant="primary" onClick={() => setShowModal(true)}>Add User</Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.first_name} {user.last_name}</td>
              <td>{user.email}</td>
              <td>{user.role_id === 1 ? "Super Admin" : user.role_id === 3 ? "Admin" : "Employee"}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(user)}>Edit</Button>{" "}
                <Button variant="danger" onClick={() => handleDelete(user.user_id)}>Delete</Button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4">No users found</td>
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
              <Form.Control type="text" value={editUser ? editUser.first_name : newUser.first_name} onChange={(e) => {
                editUser ? setEditUser({ ...editUser, first_name: e.target.value }) : setNewUser({ ...newUser, first_name: e.target.value });
              }} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" value={editUser ? editUser.last_name : newUser.last_name} onChange={(e) => {
                editUser ? setEditUser({ ...editUser, last_name: e.target.value }) : setNewUser({ ...newUser, last_name: e.target.value });
              }} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={editUser ? editUser.email : newUser.email} onChange={(e) => {
                editUser ? setEditUser({ ...editUser, email: e.target.value }) : setNewUser({ ...newUser, email: e.target.value });
              }} />
            </Form.Group>
            {!editUser && (
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;
