import React, { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router";
import { 
  Home, 
  FileText, 
  Bell, 
  User, 
  LayoutDashboard, 
  Wrench, 
  BarChart3, 
  Settings, 
  Plus,
  Building2,
  Users,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { clearStoredAuth, getStoredAuth } from "../lib/api";

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const storedAuth = getStoredAuth();
  
  // Robust role detection based on the path segments
  const pathParts = location.pathname.split('/').filter(Boolean);
  const role = pathParts[0] === 'admin' 
    ? 'admin' 
    : pathParts[0] === 'technician' 
      ? 'technician' 
      : 'student';

  const getNavItems = () => {
    const common = [
      { path: `/${role}`, icon: LayoutDashboard, label: "Dashboard" },
      { path: `/${role}/reports`, icon: FileText, label: "Laporan" },
    ];

    if (role === "admin") {
      return [
        ...common,
        { path: "/admin/facilities", icon: Building2, label: "Fasilitas" },
        { path: "/admin/technicians", icon: Wrench, label: "Teknisi" },
        { path: "/admin/analytics", icon: BarChart3, label: "Analitik" },
        { path: "/admin/notifications", icon: Bell, label: "Notifikasi" },
        { path: "/admin/profile", icon: User, label: "Profil" },
        { path: "/admin/settings", icon: Settings, label: "Pengaturan" },
      ];
    }

    return [
      ...common,
      { path: `/${role}/notifications`, icon: Bell, label: "Notifikasi" },
      { path: `/${role}/profile`, icon: User, label: "Profil" },
    ];
  };

  const navItems = getNavItems();
  const userName = storedAuth?.user.name ?? "Budi Santoso";
  const userRole = storedAuth?.user.role ?? role;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Campus Care</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-blue-50 text-blue-600 shadow-sm" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1531750026848-8ada78f641c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXQlMjBzbWlsaW5nJTIwZnJpZW5kbHklMjBmYWNlfGVufDF8fHx8MTc4MDg5MjM5MXww&ixlib=rb-4.1.0&q=80&w=1080" 
              alt="User" 
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{userRole}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              clearStoredAuth();
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet context={{ role }} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 z-50">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {navItems.slice(0, 4).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition-colors ${
                  isActive ? "text-blue-600" : "text-gray-400"
                }`
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile FAB */}
      {role === "student" && location.pathname !== "/student/report/new" && (
        <NavLink
          to="/student/report/new"
          className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 z-50 active:scale-95 transition-transform"
        >
          <Plus className="w-8 h-8" />
        </NavLink>
      )}
    </div>
  );
};
