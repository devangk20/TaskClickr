import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Badge } from "react-bootstrap";
import { getUsers, addUser, updateUser, deleteUser } from "../services/UserService";
import { PersonPlus, Pencil, Trash } from "react-bootstrap-icons";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    password: "",
    role_id: "2",
    position: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editUser) {
        await updateUser(editUser.user_id, editUser);
      } else {
        await addUser(newUser);
      }
      setShowModal(false);
      fetchUsers();
      setNewUser({
        first_name: "",
        last_name: "",
        email: "",
        mobile_number: "",
        password: "",
        role_id: "2",
        position: "",
      });
      setEditUser(null);
    } catch (error) {
      if (error.response?.data?.error === "Email already in use") {
        alert("A user with this email already exists.");
      } else {
        console.error("Error saving user:", error);
        alert("Something went wrong. Please try again.");
      }
    }
    
  };

  const handleInputChange = (field, value) => {
    editUser
      ? setEditUser({ ...editUser, [field]: value })
      : setNewUser({ ...newUser, [field]: value });
  };

  const getRoleBadge = (roleId) => {
    switch (parseInt(roleId)) {
      case 1:
        return <Badge bg="danger">Super Admin</Badge>;
      case 2:
        return <Badge bg="primary">Employee</Badge>;
      case 3:
        return <Badge bg="success">Admin</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">
          <PersonPlus className="me-2 text-primary" />
          Manage Users
        </h3>
        <Button
          variant="dark"
          className="px-4 py-2 rounded-pill shadow-sm"
          onClick={() => {
            setEditUser(null);
            setShowModal(true);
          }}
        >
          + New User
        </Button>
      </div>

      <div className="table-responsive shadow-sm rounded">
        <Table className="table table-hover align-middle bg-white">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Role</th>
              <th>Position</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map((user) => (
                <tr key={user.user_id} className="border-bottom">
                  <td>{`${user.first_name} ${user.last_name}`}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile_number}</td>
                  <td>{getRoleBadge(user.role_id)}</td>
                  <td>{user.position}</td>
                  <td className="text-end">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(user)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(user.user_id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted py-3">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditUser(null);
        }}
        centered
        dialogClassName="custom-user-modal"
      >
        <Modal.Header closeButton className="border-0 py-3 px-4 bg-light">
          <Modal.Title style={{ fontWeight: "600", fontSize: "1.4rem" }}>
            {editUser ? "Edit User" : "Create New User"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="px-4 pt-3 pb-0 bg-white">
          <Form>
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. John"
                    value={editUser ? editUser.first_name : newUser.first_name}
                    onChange={(e) =>
                      handleInputChange("first_name", e.target.value)
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Doe"
                    value={editUser ? editUser.last_name : newUser.last_name}
                    onChange={(e) =>
                      handleInputChange("last_name", e.target.value)
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-md-12">
                <Form.Group>
                  <Form.Label className="fw-semibold">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="e.g. johndoe@email.com"
                    value={editUser ? editUser.email : newUser.email}
                    onChange={(e) =>
                      handleInputChange("email", e.target.value)
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-md-12">
                <Form.Group>
                  <Form.Label className="fw-semibold">Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. +123456789"
                    value={
                      editUser
                        ? editUser.mobile_number
                        : newUser.mobile_number
                    }
                    onChange={(e) =>
                      handleInputChange("mobile_number", e.target.value)
                    }
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">Role</Form.Label>
                  <Form.Select
                    value={editUser ? editUser.role_id : newUser.role_id}
                    onChange={(e) =>
                      handleInputChange("role_id", e.target.value)
                    }
                  >
                    <option value="1">Super Admin</option>
                    <option value="2">Employee</option>
                    <option value="3">Admin</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">Position</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Backend Developer"
                    value={editUser ? editUser.position : newUser.position}
                    onChange={(e) =>
                      handleInputChange("position", e.target.value)
                    }
                  />
                </Form.Group>
              </div>
              {!editUser && (
                <div className="col-md-12">
                  <Form.Group>
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter a password"
                      value={newUser.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                    />
                    <Form.Text muted>
                      This password will be used for the user's initial login.
                    </Form.Text>
                  </Form.Group>
                </div>
              )}
            </div>
          </Form>
        </Modal.Body>

        <Modal.Footer className="bg-light border-0 px-4 pb-4 pt-3">
          <div className="d-flex w-100 justify-content-between">
            <Button variant="outline-dark" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="dark" onClick={handleSave}>
              {editUser ? "Update User" : "Create User"}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;
