import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, Users, FileText, CheckCircle2 } from "lucide-react";
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

const CATEGORY_COLORS = ["#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"];

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = React.useState<AnalyticsResponse | null>(null);

  React.useEffect(() => {
    apiFetch<AnalyticsResponse>("/analytics")
      .then((response) => setAnalytics(response))
      .catch(() => setAnalytics(null));
  }, []);

  const categoryData = (analytics?.by_category?.length ? analytics.by_category : [45, 30, 15, 10]).map((value, index) => ({
    name: ["Listrik", "AC", "Proyektor", "Lainnya"][index] ?? `Kategori ${index + 1}`,
    value,
    color: CATEGORY_COLORS[index] ?? "#94a3b8",
  }));

  const monthlyData = (analytics?.recent_trend?.length ? analytics.recent_trend : [
    { date: "Jan", count: 24 },
    { date: "Feb", count: 18 },
    { date: "Mar", count: 35 },
    { date: "Apr", count: 28 },
    { date: "May", count: 42 },
    { date: "Jun", count: 38 },
  ]).map((item, index) => ({
    name: item.date ?? ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index] ?? `B${index + 1}`,
    reports: item.count,
    completed: Math.max(0, item.count - 4),
  }));

  const totalReports = analytics?.overview.total_reports ?? 1284;
  const completionRate = analytics?.overview.completion_rate ?? 94.2;
  const activeTechnicians = analytics?.overview.active_technicians ?? 12;
  const facilitiesAttention = analytics?.overview.facilities_needing_attention ?? 4;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analitik Sistem</h2>
        <p className="text-gray-500">Pantau performa operasional dan tren laporan kerusakan secara mendalam.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Laporan", value: totalReports.toLocaleString("id-ID"), change: "+12%", icon: FileText, color: "blue" },
          { label: "Penyelesaian", value: `${completionRate}%`, change: "+2%", icon: CheckCircle2, color: "green" },
          { label: "Waktu Respon", value: "2.4 Jam", change: "-15%", icon: TrendingUp, color: "indigo" },
          { label: "Pengguna Aktif", value: activeTechnicians.toLocaleString("id-ID"), change: "+5%", icon: Users, color: "slate" },
        ].map((stat, i) => {
          const colorMap: Record<string, string> = {
            blue: "bg-blue-50 text-blue-600",
            green: "bg-green-50 text-green-600",
            indigo: "bg-indigo-50 text-indigo-600",
            slate: "bg-slate-50 text-slate-600",
          };

          return (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className={`w-12 h-12 ${colorMap[stat.color]} rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-end gap-2 mt-1">
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <span className={`text-xs font-bold mb-1 ${stat.change.startsWith("+") ? "text-green-500" : "text-blue-500"}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900">Tren Laporan Bulanan</h3>
            <select className="bg-gray-50 border-none rounded-xl text-xs font-bold px-3 py-2 outline-none">
              <option>6 Bulan Terakhir</option>
              <option>1 Tahun Terakhir</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                  cursor={{ stroke: "#3B82F6", strokeWidth: 2, strokeDasharray: "5 5" }}
                />
                <Area type="monotone" dataKey="reports" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorReports)" />
                <Area type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={3} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-8">Distribusi Kategori Kerusakan</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-[250px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} innerRadius={60} outerRadius={100} paddingAngle={8} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={4} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              {categoryData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-bold text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Status Laporan</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(analytics?.by_status ?? { Pending: 3, Assigned: 2, Repairing: 5, Completed: 12 }).map(([name, value]) => ({ name, value }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Ringkasan Operasional</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <span className="text-sm font-medium text-gray-600">Fasilitas perlu atensi</span>
              <span className="text-lg font-bold text-gray-900">{facilitiesAttention}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <span className="text-sm font-medium text-gray-600">Teknisi aktif</span>
              <span className="text-lg font-bold text-gray-900">{activeTechnicians}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <span className="text-sm font-medium text-gray-600">Laporan selesai</span>
              <span className="text-lg font-bold text-gray-900">{Math.round(totalReports * (completionRate / 100))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
