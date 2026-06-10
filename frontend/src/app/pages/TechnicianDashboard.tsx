import React from "react";
import { Wrench, CheckCircle2, Clock, MapPin, AlertTriangle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { StatusBadge } from "./StudentDashboard";

const TASKS = [
  {
    id: "TSK-101",
    title: "Perbaikan AC Bocor",
    location: "Gedung C, Ruang 102",
    priority: "Tinggi",
    status: "Repairing",
    time: "2 jam yang lalu",
    image: "https://images.unsplash.com/photo-1718203862467-c33159fdc504?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhaXIlMjBjb25kaXRpb25lciUyMHVuaXR8ZW58MXx8fHwxNzgwODkyMzg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "TSK-102",
    title: "Lampu Kelas Mati",
    location: "Gedung D, Aula Utama",
    priority: "Sedang",
    status: "Assigned",
    time: "5 jam yang lalu",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdWx0aW1lZGlhJTIwcHJvamVjdG9yJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc4MDg5MjM5MHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export const TechnicianDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<"current" | "history">("current");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pusat Tugas Teknisi</h2>
          <p className="text-gray-500">Anda memiliki 2 tugas aktif hari ini.</p>
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
          <Wrench className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {/* Progress Tracker Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-blue-100 text-sm font-medium">Progress Pekan Ini</p>
            <h3 className="text-3xl font-bold mt-1">85%</h3>
          </div>
          <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "85%" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            />
          </div>
          <div className="flex justify-between text-xs font-medium text-blue-100">
            <span>12 Selesai</span>
            <span>15 Total Laporan</span>
          </div>
        </div>
      </div>

      {/* Task Filters */}
      <div className="flex p-1 bg-gray-100 rounded-xl">
        <button
          onClick={() => setActiveTab("current")}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            activeTab === "current" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Tugas Aktif
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            activeTab === "history" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Riwayat
        </button>
      </div>

      {/* Task List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            {activeTab === "current" ? "Tugas yang Ditugaskan" : "Pekerjaan Selesai"}
          </h3>
          <span className="text-xs font-medium text-gray-400">Total: {activeTab === "current" ? TASKS.length : "0"}</span>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {activeTab === "current" ? (
            TASKS.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={task.image} alt={task.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={task.status} />
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            task.priority === 'Tinggi' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900">{task.title}</h4>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{task.location}</span>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>Masuk {task.time}</span>
                      </div>
                      <button className="text-xs font-bold text-blue-600 hover:text-blue-700 px-3 py-1.5 bg-blue-50 rounded-lg transition-colors">
                        Perbarui Progress
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">Belum ada riwayat pekerjaan.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
