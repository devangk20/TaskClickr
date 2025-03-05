import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import profileIcon from "../assets/profile-icon.png"; // Replace with actual image

const Profile = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    role: "",
    joiningDate: "",
    dob: "",
    bloodGroup: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setUserData({
      firstName: localStorage.getItem("firstName") || "John",
      lastName: localStorage.getItem("lastName") || "Doe",
      mobile: localStorage.getItem("mobile") || "1234567890",
      email: localStorage.getItem("email") || "johndoe@example.com",
      role: localStorage.getItem("role") === "1" ? "Super Admin" : localStorage.getItem("role") === "3" ? "Admin" : "User",
      joiningDate: localStorage.getItem("joiningDate") || "2023-01-01",
      dob: localStorage.getItem("dob") || "2000-01-01",
      bloodGroup: localStorage.getItem("bloodGroup") || "O+",
    });
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    localStorage.setItem("firstName", userData.firstName);
    localStorage.setItem("lastName", userData.lastName);
    localStorage.setItem("mobile", userData.mobile);
    localStorage.setItem("bloodGroup", userData.bloodGroup);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container d-flex justify-content-center mt-5" style={{ marginTop: "90px" }}>
      <div className="card shadow-lg p-4 text-center" style={{ width: "700px", borderRadius: "15px" }}>
        
        {/* Profile Image at the Top */}
        <div className="d-flex flex-column align-items-center">
          <img src={profileIcon} alt="Profile" className="rounded-circle border border-3 border-primary" width="120" height="120" />
          <h5 className="mt-2 fw-bold">{userData.firstName} {userData.lastName}</h5>
          <p className="text-muted">{userData.role}</p>
        </div>

        {/* Profile Details - Two Column Layout */}
        <div className="card-body w-100 text-start">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">First Name</label>
              <input type="text" name="firstName" className="form-control" value={userData.firstName} onChange={handleChange} disabled={!isEditing} />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Last Name</label>
              <input type="text" name="lastName" className="form-control" value={userData.lastName} onChange={handleChange} disabled={!isEditing} />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Mobile</label>
              <input type="text" name="mobile" className="form-control" value={userData.mobile} onChange={handleChange} disabled={!isEditing} />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Email</label>
              <input type="email" className="form-control" value={userData.email} disabled />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Date of Joining</label>
              <input type="text" className="form-control" value={userData.joiningDate} disabled />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Date of Birth</label>
              <input type="text" className="form-control" value={userData.dob} disabled />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Blood Group</label>
              <input type="text" name="bloodGroup" className="form-control" value={userData.bloodGroup} onChange={handleChange} disabled={!isEditing} />
            </div>
          </div>

          {/* Edit & Save Buttons */}
          {!isEditing ? (
            <button className="btn btn-primary w-100 mt-3" onClick={handleEdit}>Edit</button>
          ) : (
            <button className="btn btn-success w-100 mt-3" onClick={handleSave}>Save</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
