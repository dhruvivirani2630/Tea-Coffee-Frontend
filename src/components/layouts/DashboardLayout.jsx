import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout = () => (
  <div className="app-shell">
    <Header />
    <div className="shell-body">
      <Sidebar />
      <main className="content">
        <Outlet />
      </main>
    </div>
    <Footer />
  </div>
);

export default DashboardLayout;
