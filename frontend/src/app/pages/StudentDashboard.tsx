import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, Filter, Clock, CheckCircle2, PlayCircle } from "lucide-react";
import { NavLink } from "react-router";
import { motion } from "motion/react";
import { apiFetch, getStoredAuth } from "../lib/api";

type ReportSummary = {
  code: string;
  title: string;
  location: string;
  status: string;
  category: string;
  image_url?: string | null;
  reported_at?: string;
};

type DashboardResponse = {
  stats: {
    pending: number;
    verified: number;
    assigned: number;
    repairing: number;
    completed: number;
    total: number;
  };
  recent_reports: ReportSummary[];
};

const DEFAULT_RECENT_REPORTS: ReportSummary[] = [
  {
    code: "REP-001",
    title: "AC Tidak Dingin",
    location: "Gedung A, Ruang 302",
    status: "Repairing",
    category: "Air Conditioner",
    image_url: "https://images.unsplash.com/photo-1718203862467-c33159fdc504?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    code: "REP-002",
    title: "Proyektor Berkedip",
    location: "Gedung B, Lab Komputer 1",
    status: "Pending",
    category: "Projector",
    image_url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
];

export const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Pending: "bg-orange-100 text-orange-700",
    Verified: "bg-purple-100 text-purple-700",
    Assigned: "bg-blue-100 text-blue-700",
    Repairing: "bg-blue-500 text-white",
    Completed: "bg-green-100 text-green-700",
  };

  const labels: Record<string, string> = {
    Pending: "Menunggu",
    Verified: "Terverifikasi",
    Assigned: "Ditugaskan",
    Repairing: "Sedang Diperbaiki",
    Completed: "Selesai",
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {labels[status] || status}
    </span>
  );
};

export const StudentDashboard: React.FC = () => {
  const auth = getStoredAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    apiFetch<DashboardResponse>("/dashboard/student")
      .then((response) => setDashboard(response))
      .catch(() => setDashboard(null));
  }, []);

  const stats = dashboard
    ? [
        { label: "Menunggu", count: dashboard.stats.pending, color: "bg-orange-50 text-orange-600", icon: Clock },
        { label: "Dalam Proses", count: dashboard.stats.repairing + dashboard.stats.assigned, color: "bg-blue-50 text-blue-600", icon: PlayCircle },
        { label: "Selesai", count: dashboard.stats.completed, color: "bg-green-50 text-green-600", icon: CheckCircle2 },
      ]
    : [
        { label: "Menunggu", count: 3, color: "bg-orange-50 text-orange-600", icon: Clock },
        { label: "Dalam Proses", count: 2, color: "bg-blue-50 text-blue-600", icon: PlayCircle },
        { label: "Selesai", count: 12, color: "bg-green-50 text-green-600", icon: CheckCircle2 },
      ];

  const recentReports = dashboard?.recent_reports?.length ? dashboard.recent_reports : DEFAULT_RECENT_REPORTS;

  const filteredReports = useMemo(() => {
    return recentReports.filter((report) =>
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [recentReports, searchQuery]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Halo, {auth?.user.name ?? "Budi Santoso"} 👋</h2>
          <p className="text-gray-500">Selamat datang di sistem pelaporan kerusakan fasilitas.</p>
        </div>
        <div className="hidden md:block">
          <NavLink
            to="/student/report/new"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-200"
          >
            <Plus className="w-5 h-5" />
            Laporkan Kerusakan
          </NavLink>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari laporan atau fasilitas..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />
        </div>
        <button className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 transition-colors">
          <Filter className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between ${stat.color.split(" ")[0]}`}
          >
            <div>
              <p className="text-sm font-medium opacity-80">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-1">{stat.count}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.color.split(" ")[1].replace("text-", "bg-").replace("600", "100")}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </motion.div>
        ))}
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Laporan Terbaru</h3>
          <NavLink to="/student/reports" className="text-sm font-semibold text-blue-600 hover:underline">
            Lihat Semua
          </NavLink>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredReports.length > 0 ? (
            filteredReports.map((report, i) => (
              <motion.div
                key={report.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-center hover:border-blue-200 transition-all cursor-pointer group"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={report.image_url ?? DEFAULT_RECENT_REPORTS[0].image_url!} alt={report.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{report.category}</span>
                    <StatusBadge status={report.status} />
                  </div>
                  <h4 className="font-bold text-gray-900 truncate">{report.title}</h4>
                  <p className="text-sm text-gray-500 truncate">{report.location}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{report.reported_at ? new Date(report.reported_at).toLocaleDateString("id-ID") : "-"}</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-500">Tidak ada laporan yang ditemukan.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
