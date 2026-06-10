import React from "react";
import { User, Mail, Shield, Building, Calendar, Settings, LogOut, Camera } from "lucide-react";
import { motion } from "motion/react";
import { useOutletContext } from "react-router";

export const ProfilePage: React.FC = () => {
  const { role } = useOutletContext<{ role: string }>();

  const userData = {
    name: "Budi Santoso",
    email: "budi.santoso@university.ac.id",
    id: "12345678",
    department: "Teknik Informatika",
    joinDate: "September 2023",
    roleName: role.charAt(0).toUpperCase() + role.slice(1)
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem]" />
        <div className="absolute -bottom-12 left-8 flex items-end gap-6">
          <div className="relative group">
            <img 
              src="https://images.unsplash.com/photo-1531750026848-8ada78f641c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXQlMjBzbWlsaW5nJTIwZnJpZW5kbHklMjBmYWNlfGVufDF8fHx8MTc4MDg5MjM5MXww&ixlib=rb-4.1.0&q=80&w=1080" 
              alt="Profile" 
              className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl"
            />
            <button className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6" />
            </button>
          </div>
          <div className="pb-4">
            <h2 className="text-3xl font-bold text-gray-900">{userData.name}</h2>
            <p className="text-gray-500 font-medium">{userData.roleName} • {userData.department}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Informasi Personal</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase">Nama Lengkap</p>
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <User className="w-4 h-4 text-gray-400" />
                  {userData.name}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase">Email Institusi</p>
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {userData.email}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase">ID / NIM</p>
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <Shield className="w-4 h-4 text-gray-400" />
                  {userData.id}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase">Fakultas / Unit</p>
                <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <Building className="w-4 h-4 text-gray-400" />
                  {userData.department}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Pengaturan Akun</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Settings className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-gray-700">Ubah Kata Sandi</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-blue-600" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-gray-700">Privasi & Keamanan</span>
                </div>
              </button>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-200">
            <h4 className="font-bold mb-4">Status Keanggotaan</h4>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-blue-100 font-medium uppercase">Bergabung Sejak</p>
                <p className="font-bold">{userData.joinDate}</p>
              </div>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 text-sm">
              Akun Anda telah terverifikasi oleh sistem akademik.
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 p-4 border-2 border-red-100 text-red-600 rounded-2xl font-bold hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            Keluar dari Aplikasi
          </button>
        </div>
      </div>
    </div>
  );
};
