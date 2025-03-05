import Navbar from "../components/Navbar";

const UserDashboard = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h1>Welcome to User Dashboard</h1>
        <p>View and update your assigned tasks and daily activities.</p>
      </div>
    </>
  );
};

export default UserDashboard;
