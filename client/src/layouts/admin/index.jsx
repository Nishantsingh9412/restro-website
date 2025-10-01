import { Outlet } from "react-router-dom";
import { adminRoutes } from "../../routes.jsx";
import Sidebar from "../../components/sidebar/Sidebar.jsx";
import Navbar from "../../components/navbar/NavbarAdmin.jsx";

export default function AdminLayout() {
  return (
    <div className="flex bg-primary-bg min-h-screen h-full max-w-screen">
      <Sidebar routes={adminRoutes} />
      <main className="flex-1 min-h-screen h-full flex flex-col transition-all duration-300 bg-white">
        <div className="relative top-0 z-30 w-full">
          <Navbar />
        </div>
        <div className="flex-1 w-full px-1 md:px-2 ">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
