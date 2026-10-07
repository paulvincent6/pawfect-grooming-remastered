import AdminSidebar from "../../components/AdminSidebar";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <AdminSidebar />

      <main>
        <h1>Admin Dashboard</h1>

        <p>Welcome, {user?.full_name || "Admin"}!</p>

        <h2>Overview</h2>

        <p>Use the admin menu to manage Pawfect Grooming.</p>

        <ul>
          <li>View and manage appointments</li>
          <li>View customers</li>
          <li>Manage grooming services</li>
        </ul>
      </main>
    </>
  );
}

export default Dashboard;