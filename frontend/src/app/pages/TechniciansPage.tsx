import React from "react";
import { User, Star, MoreHorizontal, Plus, Search } from "lucide-react";
import { apiFetch } from "../lib/api";

type TechnicianItem = {
  id: number;
  name: string;
  specialty: string;
  status: "Active" | "On Duty" | "Away";
  rating: number;
  tasks: number;
  avatar?: string;
};

const STATUS_DOT: Record<TechnicianItem["status"], string> = {
  Active: "bg-green-500",
  "On Duty": "bg-blue-500",
  Away: "bg-gray-400",
};

export const TechniciansPage: React.FC = () => {
  const [technicians, setTechnicians] = React.useState<TechnicianItem[]>([]);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    apiFetch<{ data: TechnicianItem[] }>("/technicians")
      .then((response) => setTechnicians(response.data))
      .catch(() => setTechnicians([]));
  }, []);

  const filteredTechnicians = technicians.filter((tech) => {
    const q = search.toLowerCase();
    return (
      tech.name.toLowerCase().includes(q) ||
      tech.specialty.toLowerCase().includes(q)
    );
  });

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
              {filteredTechnicians.length > 0 ? filteredTechnicians.map((tech) => (
                <tr key={tech.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={tech.avatar ?? "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"}
                        alt={tech.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
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
                      <div className={`w-2 h-2 rounded-full ${STATUS_DOT[tech.status]}`} />
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
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    Tidak ada teknisi yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
