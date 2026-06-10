import React from "react";
import { User, Shield, Star, Phone, Mail, MoreHorizontal, Plus, Search } from "lucide-react";
import { motion } from "motion/react";

const TECHNICIANS = [
  { id: 1, name: "Ahmad Subarjo", specialty: "Kelistrikan", status: "Active", rating: 4.8, tasks: 5, avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3ODA4OTIzOTF8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 2, name: "Siti Aminah", specialty: "Pendingin Ruangan", status: "On Duty", rating: 4.9, tasks: 2, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc4MDg5MjM5MHww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 3, name: "Bambang Pamungkas", specialty: "IT & Jaringan", status: "Active", rating: 4.7, tasks: 8, avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3ODA4OTIzOTF8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 4, name: "Rina Wijaya", specialty: "Fasilitas Umum", status: "Away", rating: 4.6, tasks: 0, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc4MDg5MjM5MHww&ixlib=rb-4.1.0&q=80&w=1080" },
];

export const TechniciansPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Teknisi</h2>
          <p className="text-gray-500">Atur penugasan dan pantau performa tim teknis lapangan.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-200">
          <Plus className="w-5 h-5" />
          Tambah Teknisi
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Cari nama atau spesialisasi..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Nama Teknisi</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Spesialisasi</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Tugas</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Rating</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {TECHNICIANS.map((tech) => (
                <tr key={tech.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={tech.avatar} alt={tech.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-gray-900">{tech.name}</p>
                        <p className="text-xs text-gray-500">ID: T-0{tech.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                      {tech.specialty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        tech.status === "Active" ? "bg-green-500" : tech.status === "On Duty" ? "bg-blue-500" : "bg-gray-400"
                      }`} />
                      <span className="text-sm font-semibold text-gray-700">{tech.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">{tech.tasks} Aktif</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-orange-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold">{tech.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-100">
                      <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
