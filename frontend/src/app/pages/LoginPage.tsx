import React from "react";
import { LogIn, Shield, User, Wrench, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);

  const roles = [
    {
      id: "student",
      title: "Mahasiswa",
      desc: "Laporkan kerusakan fasilitas kampus",
      icon: User,
      color: "blue",
      path: "/student"
    },
    {
      id: "technician",
      title: "Teknisi",
      desc: "Kelola & perbaiki tugas harian",
      icon: Wrench,
      color: "indigo",
      path: "/technician"
    },
    {
      id: "admin",
      title: "Admin",
      desc: "Analisis & pantau seluruh sistem",
      icon: Shield,
      color: "slate",
      path: "/admin"
    }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      const role = roles.find(r => r.id === selectedRole);
      if (role) navigate(role.path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-200">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Campus Care</h1>
          <p className="text-gray-500 mt-2 font-medium">Sistem Pelaporan Fasilitas Kampus</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-700 block ml-1">Masuk Sebagai</label>
              <div className="grid grid-cols-1 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group ${
                      selectedRole === role.id 
                        ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-50' 
                        : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-3 rounded-xl transition-colors ${
                      selectedRole === role.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'
                    }`}>
                      <role.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`font-bold transition-colors ${selectedRole === role.id ? 'text-blue-900' : 'text-gray-900'}`}>
                        {role.title}
                      </h4>
                      <p className="text-xs text-gray-500">{role.desc}</p>
                    </div>
                    {selectedRole === role.id && (
                      <motion.div layoutId="check" className="ml-auto">
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Institusi</label>
                <input 
                  type="email" 
                  placeholder="name@university.ac.id"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Kata Sandi</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button
              disabled={!selectedRole}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white p-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group"
            >
              Masuk Sekarang
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-gray-50">
            <p className="text-sm text-gray-500">
              Belum punya akun? <button className="text-blue-600 font-bold hover:underline">Daftar Sekarang</button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
