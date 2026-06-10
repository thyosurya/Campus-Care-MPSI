import React, { useState } from "react";
import { Search, Filter, Calendar, MapPin, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { StatusBadge } from "./StudentDashboard";

const ALL_REPORTS = [
  {
    id: "REP-001",
    title: "AC Tidak Dingin",
    location: "Gedung A, Ruang 302",
    status: "Repairing",
    date: "8 Juni 2026",
    category: "Air Conditioner",
    image: "https://images.unsplash.com/photo-1718203862467-c33159fdc504?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhaXIlMjBjb25kaXRpb25lciUyMHVuaXR8ZW58MXx8fHwxNzgwODkyMzg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "REP-002",
    title: "Proyektor Berkedip",
    location: "Gedung B, Lab Komputer 1",
    status: "Pending",
    date: "7 Juni 2026",
    category: "Projector",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdWx0aW1lZGlhJTIwcHJvamVjdG9yJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc4MDg5MjM5MHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "REP-003",
    title: "Kursi Patah",
    location: "Gedung C, Ruang 204",
    status: "Completed",
    date: "5 Juni 2026",
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1770827693775-5458df828bd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYnVpbGRpbmclMjBjbGVhbiUyMG1vZGVybnxlbnwxfHx8fDE3ODA4OTIzODZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "REP-004",
    title: "Lampu Padam",
    location: "Gedung D, Lorong Lantai 2",
    status: "Verified",
    date: "4 Juni 2026",
    category: "Electricity",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdWx0aW1lZGlhJTIwcHJvamVjdG9yJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc4MDg5MjM5MHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export const ReportList: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Semua");

  const tabs = ["Semua", "Menunggu", "Dalam Proses", "Selesai"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Daftar Laporan</h2>
        <div className="flex gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari laporan..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab 
                ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {ALL_REPORTS.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/report/${report.id}`)}
            className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-all cursor-pointer flex items-center gap-4"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0">
              <img src={report.image} alt={report.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status={report.status} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:inline">{report.category}</span>
              </div>
              <h4 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{report.title}</h4>
              <div className="flex flex-wrap gap-y-1 gap-x-4 mt-1">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span>{report.location}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span>{report.date}</span>
                </div>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
          </motion.div>
        ))}
      </div>

      {/* Pagination Placeholder */}
      <div className="flex justify-center pt-4">
        <div className="flex gap-2">
          {[1, 2, 3].map((n) => (
            <button key={n} className={`w-8 h-8 rounded-lg text-xs font-bold ${n === 1 ? "bg-blue-600 text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
