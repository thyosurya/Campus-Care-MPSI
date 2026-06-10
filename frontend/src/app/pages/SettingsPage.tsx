import React from "react";
import { 
  Bell, 
  Shield, 
  Database, 
  Globe, 
  Lock, 
  Smartphone, 
  Cloud,
  ChevronRight,
  Info
} from "lucide-react";

export const SettingsPage: React.FC = () => {
  const sections = [
    {
      title: "Umum",
      items: [
        { icon: Globe, label: "Bahasa & Wilayah", desc: "Indonesia (WIB)", color: "blue" },
        { icon: Bell, label: "Notifikasi Sistem", desc: "Push, Email, WhatsApp", color: "indigo" },
        { icon: Smartphone, label: "Tampilan Mobile", desc: "Optimasi responsif", color: "purple" },
      ]
    },
    {
      title: "Keamanan",
      items: [
        { icon: Shield, label: "Kebijakan Akses", desc: "SSO Institusi aktif", color: "green" },
        { icon: Lock, label: "Enkripsi Data", desc: "AES-256 Enabled", color: "orange" },
        { icon: Database, label: "Backup Otomatis", desc: "Harian pukul 02:00", color: "slate" },
      ]
    }
  ];

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Pengaturan Sistem</h2>
        <p className="text-gray-500">Konfigurasi global aplikasi dan manajemen infrastruktur.</p>
      </div>

      <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-blue-100">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0">
          <Cloud className="w-8 h-8" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold mb-1">Status Server: Optimal</h3>
          <p className="text-blue-100 text-sm">Semua layanan berjalan normal. Terakhir diperbarui 2 menit yang lalu.</p>
        </div>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-bold hover:bg-blue-50 transition-colors">
          Cek Logs
        </button>
      </div>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{section.title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map((item, i) => (
                <button
                  key={i}
                  className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-3xl hover:border-blue-200 hover:shadow-md transition-all text-left group"
                >
                  <div className={`p-3 bg-${item.color}-50 text-${item.color}-600 rounded-2xl group-hover:bg-${item.color}-600 group-hover:text-white transition-colors`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200 flex items-start gap-4">
        <div className="p-2 bg-white rounded-lg border border-gray-100">
          <Info className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h5 className="font-bold text-gray-900 text-sm">Informasi Versi</h5>
          <p className="text-xs text-gray-500 mt-1">Campus Care v2.4.0-stable. Lisensi Institusi aktif hingga Juni 2027.</p>
        </div>
      </div>
    </div>
  );
};
