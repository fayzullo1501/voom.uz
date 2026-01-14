// src/components/layout/AdminLayout.jsx
import Sidebar from "./Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col bg-white">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
