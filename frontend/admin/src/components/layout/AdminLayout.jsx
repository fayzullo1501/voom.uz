// src/components/layout/AdminLayout.jsx
import Sidebar from "./Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="h-screen w-full flex overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="flex-1 min-w-0 flex flex-col bg-white overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
