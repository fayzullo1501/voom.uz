import Sidebar from "./Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-[#F5F6FA]">
      <Sidebar />
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
