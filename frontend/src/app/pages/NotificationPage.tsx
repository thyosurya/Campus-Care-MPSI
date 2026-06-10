import React from "react";
import { Bell, Clock, CheckCircle2, AlertCircle, Wrench, Info, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { useOutletContext } from "react-router";

export const NotificationPage: React.FC = () => {
  const { role } = useOutletContext<{ role: string }>();

  const notifications = [
    {
      id: 1,
      title: "Laporan Terverifikasi",
      desc: "Laporan kerusakan AC di Gedung C telah disetujui dan diteruskan ke teknisi.",
      type: "success",
      icon: CheckCircle2,
      time: "10 menit yang lalu",
      for: ["student", "admin"]
    },
    {
      id: 2,
      title: "Tugas Baru Ditugaskan",
      desc: "Anda memiliki tugas baru untuk perbaikan lampu di Gedung D.",
      type: "warning",
      icon: Wrench,
      time: "1 jam yang lalu",
      for: ["technician"]
    },
    {
      id: 3,
      title: "Pembaruan Status",
      desc: "Teknisi sedang menuju lokasi untuk perbaikan proyektor di Lab 3.",
      type: "info",
      icon: Info,
      time: "3 jam yang lalu",
      for: ["student"]
    },
    {
      id: 4,
      title: "Sistem Maintenance",
      desc: "Aplikasi akan mengalami pemeliharaan rutin pada pukul 23:00 WIB.",
      type: "alert",
      icon: AlertCircle,
      time: "Yesterday",
      for: ["student", "technician", "admin"]
    },
    {
      id: 5,
      title: "Komentar Baru",
      desc: "Admin memberikan catatan tambahan pada laporan REP-042.",
      type: "message",
      icon: MessageSquare,
      time: "Yesterday",
      for: ["student", "technician"]
    }
  ].filter(n => n.for.includes(role));

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "success": return "bg-green-50 text-green-600";
      case "warning": return "bg-orange-50 text-orange-600";
      case "alert": return "bg-red-50 text-red-600";
      case "message": return "bg-indigo-50 text-indigo-600";
      default: return "bg-blue-50 text-blue-600";
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifikasi</h2>
          <p className="text-gray-500">Informasi terbaru mengenai laporan dan sistem.</p>
        </div>
        <button className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors">
          Tandai semua dibaca
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 hover:border-blue-200 transition-all cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${getTypeStyles(n.type)}`}>
                <n.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-gray-900">{n.title}</h4>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                    <Clock className="w-3 h-3" />
                    {n.time}
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{n.desc}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Tidak ada notifikasi</h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-2">
              Semua berita terbaru akan muncul di sini saat tersedia.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
