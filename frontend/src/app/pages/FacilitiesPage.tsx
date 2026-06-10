import React from "react";
import { Building2, Search, Filter, Plus, MoreVertical, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { motion } from "motion/react";

const FACILITIES = [
  { id: 1, name: "Gedung A (Rektorat)", type: "Administrasi", rooms: 45, status: "Good", maintenance: "12 Mei 2026" },
  { id: 2, name: "Gedung B (Teknik)", type: "Akademik", rooms: 32, status: "Warning", maintenance: "8 Juni 2026" },
  { id: 3, name: "Gedung C (Sains)", type: "Laboratorium", rooms: 28, status: "Good", maintenance: "1 Juni 2026" },
  { id: 4, name: "Gedung D (Ekonomi)", type: "Akademik", rooms: 40, status: "Critical", maintenance: "5 Juni 2026" },
  { id: 5, name: "Perpustakaan Pusat", type: "Publik", rooms: 12, status: "Good", maintenance: "20 Mei 2026" },
  { id: 6, name: "Auditorium Utama", type: "Publik", rooms: 4, status: "Good", maintenance: "15 Mei 2026" },
];

export const FacilitiesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Fasilitas</h2>
          <p className="text-gray-500">Pantau status dan jadwal pemeliharaan seluruh gedung kampus.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-200">
          <Plus className="w-5 h-5" />
          Tambah Gedung
        </button>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari gedung atau tipe..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <button className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 transition-colors">
          <Filter className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FACILITIES.map((fac, i) => (
          <motion.div
            key={fac.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:border-blue-200 transition-all group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Building2 className="w-6 h-6" />
                </div>
                <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{fac.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{fac.type}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Ruangan</p>
                  <p className="text-lg font-bold text-gray-900">{fac.rooms}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Pemeliharaan Terakhir</p>
                  <p className="text-sm font-bold text-gray-700">{fac.maintenance}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {fac.status === "Good" && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Normal
                    </div>
                  )}
                  {fac.status === "Warning" && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Perlu Atensi
                    </div>
                  )}
                  {fac.status === "Critical" && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold">
                      <XCircle className="w-3.5 h-3.5" />
                      Kritis
                    </div>
                  )}
                </div>
                <button className="text-sm font-bold text-blue-600 hover:underline">Detail</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
