import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Users, FileText, CheckCircle2, AlertCircle, TrendingUp, MoreHorizontal, UserCheck } from "lucide-react";
import { motion } from "motion/react";
import { apiFetch } from "../lib/api";

type AnalyticsResponse = {
  overview: {
    total_reports: number;
    completion_rate: number;
    active_technicians: number;
    facilities_needing_attention: number;
  };
  by_status: Record<string, number>;
  by_category: number[];
  recent_trend: Array<{ date: string | null; count: number }>;
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
};

const RECENT_ACTIVITIES = [
  { user: "Andi Saputra", action: "memverifikasi laporan", item: "REP-042", time: "5 menit yang lalu" },
  { user: "Siti Aminah", action: "melaporkan kerusakan", item: "Gedung E", time: "12 menit yang lalu" },
  { user: "Bambang", action: "menyelesaikan tugas", item: "TSK-089", time: "1 jam yang lalu" },
];

export const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = React.useState<AnalyticsResponse | null>(null);
  const [dashboard, setDashboard] = React.useState<DashboardResponse | null>(null);

  React.useEffect(() => {
    apiFetch<AnalyticsResponse>("/analytics")
      .then((response) => setAnalytics(response))
      .catch(() => setAnalytics(null));

    apiFetch<DashboardResponse>("/dashboard/admin")
      .then((response) => setDashboard(response))
      .catch(() => setDashboard(null));
  }, []);

  const dataMonthly = analytics?.recent_trend?.length
    ? analytics.recent_trend.slice(-6).map((item, index) => ({
        name: item.date ?? ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"][index] ?? `B${index + 1}`,
        total: item.count,
      }))
    : [
        { name: "Jan", total: 45 },
        { name: "Feb", total: 52 },
        { name: "Mar", total: 38 },
        { name: "Apr", total: 65 },
        { name: "Mei", total: 48 },
        { name: "Jun", total: 32 },
      ];

  const dataCategory = analytics?.by_category?.length
    ? analytics.by_category.map((value, index) => ({
        name: ["AC", "Listrik", "Mekanis", "Jaringan"][index] ?? `Kategori ${index + 1}`,
        value,
        color: ["#3B82F6", "#10B981", "#F59E0B", "#6366F1"][index] ?? "#94a3b8",
      }))
    : [
        { name: "AC", value: 40, color: "#3B82F6" },
        { name: "Listrik", value: 25, color: "#10B981" },
        { name: "Mekanis", value: 20, color: "#F59E0B" },
        { name: "Jaringan", value: 15, color: "#6366F1" },
      ];

  const totalReports = analytics?.overview.total_reports ?? dashboard?.stats.total ?? 1284;
  const completed = dashboard?.stats.completed ?? Math.round(totalReports * 0.82);
  const pending = dashboard?.stats.pending ?? Math.round(totalReports * 0.09);
  const active = dashboard?.stats.assigned ?? Math.round(totalReports * 0.04);
  const facilitiesAttention = analytics?.overview.facilities_needing_attention ?? 116;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Panel Administrator</h2>
          <p className="text-gray-500">Ringkasan operasional seluruh kampus.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
          Unduh Laporan PDF
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Laporan", value: totalReports.toLocaleString("id-ID"), icon: FileText, trend: `+${analytics?.overview.completion_rate ?? 12}%`, color: "blue" },
          { label: "Aktif", value: String(active), icon: TrendingUp, trend: "+5%", color: "indigo" },
          { label: "Selesai", value: String(completed), icon: CheckCircle2, trend: "+18%", color: "green" },
          { label: "Tertunda", value: String(pending + facilitiesAttention), icon: AlertCircle, trend: "-2%", color: "orange" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-xs font-bold ${stat.trend.startsWith("+") ? "text-green-600" : "text-red-600"} bg-gray-50 px-2 py-1 rounded-lg`}>
                {stat.trend}
              </span>
            </div>
            <h4 className="text-gray-500 text-sm font-medium">{stat.label}</h4>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Tren Laporan Bulanan</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataMonthly}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <RechartsTooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Kategori Kerusakan</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Aktivitas Terbaru</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {RECENT_ACTIVITIES.map((activity, i) => (
              <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-bold">{activity.user}</span> {activity.action} pada <span className="font-semibold text-blue-600">{activity.item}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-50/50 text-center">
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Lihat Semua Aktivitas</button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Verifikasi Pengguna</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-bold">5 Registrasi Baru</p>
                  <p className="text-xs text-gray-500">Butuh verifikasi akun</p>
                </div>
              </div>
              <button className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors">
                Tinjau Sekarang
              </button>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold">Teknisi Standby</p>
                  <p className="text-xs text-gray-500">{analytics?.overview.active_technicians ?? 12} teknisi aktif</p>
                </div>
              </div>
              <button className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">
                Kelola Tim
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
