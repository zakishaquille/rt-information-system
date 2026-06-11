import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { apiClient } from "@/api/client";
import { 
  Squares2X2Icon as LayoutDashboard, 
  BanknotesIcon as Wallet, 
  DocumentTextIcon as Receipt, 
  HomeIcon as Home, 
  UserGroupIcon as Users, 
  Cog6ToothIcon as Settings, 
  ArrowTopRightOnSquareIcon as ExternalLink,
  Bars3Icon as Menu,
  XMarkIcon as X,
  ArrowRightOnRectangleIcon as LogOut
} from "@heroicons/react/24/outline";

export const DashboardLayout: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await apiClient.post("logout");
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      setUser(null);
    }
  };

  const navLinks = [
    { to: "/", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", exact: true },
    { to: "/payments", icon: <Receipt className="w-5 h-5" />, label: "Tagihan" },
    { to: "/transactions", icon: <Wallet className="w-5 h-5" />, label: "Kas" },
    { to: "/houses", icon: <Home className="w-5 h-5" />, label: "Houses" },
    { to: "/residents", icon: <Users className="w-5 h-5" />, label: "Residents" },
    { to: "/configurations", icon: <Settings className="w-5 h-5" />, label: "Pengaturan" },
  ];

  return (
    <div className="flex h-screen bg-[#eff3f9] text-[#6b6b6b] font-['Outfit'] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#eaedf1] flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#eaedf1]">
          <span className="font-bold text-2xl text-[#111827]">RTIS</span>
          <button 
            className="md:hidden text-[#6b6b6b] hover:text-[#0f79f3]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menu
          </div>
          {navLinks.map((link) => {
            const isActive = link.exact 
              ? location.pathname === link.to 
              : location.pathname.startsWith(link.to);
            
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                  isActive 
                    ? "bg-[#0f79f3]/10 text-[#0f79f3] font-medium" 
                    : "text-[#6b6b6b] hover:bg-[#eff3f9] hover:text-[#111827]"
                }`}
              >
                <span className={isActive ? "text-[#0f79f3]" : "text-gray-400"}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}

          <div className="mt-8 px-3 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Links
          </div>
          <a
            href="/laporan"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[#6b6b6b] hover:bg-[#eff3f9] hover:text-[#111827] transition-colors"
          >
            <span className="text-gray-400"><ExternalLink className="w-5 h-5" /></span>
            Laporan Publik
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#eaedf1] flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
          <button 
            className="md:hidden text-[#6b6b6b] hover:text-[#0f79f3] p-1 -ml-1 rounded-md"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm font-medium text-[#111827] hidden sm:block">
              {user?.name}
            </span>
            <div className="h-8 w-8 rounded-full bg-[#0f79f3]/10 text-[#0f79f3] flex items-center justify-center font-bold text-sm border border-[#0f79f3]/20">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#eff3f9] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
