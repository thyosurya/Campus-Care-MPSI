import React, { useEffect, useMemo, useState } from "react";
import { Search, Calendar, MapPin, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router";
import { motion } from "motion/react";
import { apiFetch } from "../lib/api";
import { StatusBadge } from "./StudentDashboard";

type ReportItem = {
  code: string;
  title: string;
  location: string;
  status: string;
  reported_at?: string;
  category: string;
  image_url?: string | null;
};

export const ReportList: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useOutletContext<{ role: string }>();
  const [activeTab, setActiveTab] = useState("Semua");
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState<ReportItem[]>([]);

  const tabs = ["Semua", "Menunggu", "Dalam Proses", "Selesai"];

  useEffect(() => {
    const params: Record<string, string> = {};

    if (activeTab === "Menunggu") params.status = "Pending";
    if (activeTab === "Dalam Proses") params.status = "Repairing";
    if (activeTab === "Selesai") params.status = "Completed";

    apiFetch<{ data: ReportItem[] }>("/reports", { query: params })
      .then((response) => setReports(response.data))
      .catch(() => setReports([]));
  }, [activeTab]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const query = search.toLowerCase();
      return (
        report.title.toLowerCase().includes(query) ||
        report.location.toLowerCase().includes(query) ||
        report.category.toLowerCase().includes(query)
      );
    });
  }, [reports, search]);

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

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

      <div className="grid grid-cols-1 gap-4">
        {filteredReports.map((report, i) => (
          <motion.div
            key={report.code}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/${role}/report/${report.code}`)}
            className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-all cursor-pointer flex items-center gap-4"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
              <img
                src={report.image_url ?? "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"}
                alt={report.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status={report.status} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:inline">
                  {report.category}
                </span>
              </div>
              <h4 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{report.title}</h4>
              <div className="flex flex-wrap gap-y-1 gap-x-4 mt-1">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span>{report.location}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span>{report.reported_at ? new Date(report.reported_at).toLocaleDateString("id-ID") : "-"}</span>
                </div>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
          </motion.div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-500">Tidak ada laporan yang ditemukan.</p>
        </div>
      )}
    </div>
  );
};
