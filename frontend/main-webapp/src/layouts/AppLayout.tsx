import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import Header from "../components/navigation/Header";
import { SidebarProvider } from "../contexts/SidebarContext";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen bg-neutral-50">
        {/* Header - Full Width */}
        <Header />

        {/* Main Area: Sidebar + Content */}
        <div className="flex flex-1 p-4 gap-4">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 bg-white rounded-[20px] shadow-[0px_4px_4px_0px_#e2e8f0] p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
