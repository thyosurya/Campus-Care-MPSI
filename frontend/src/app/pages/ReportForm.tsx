import React, { useState } from "react";
import { ArrowLeft, Camera, Upload, CheckCircle } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { motion } from "motion/react";
import { toast } from "sonner";

export const ReportForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Laporan berhasil dikirim!", {
        description: "Teknisi akan segera memverifikasi laporan Anda.",
      });
      navigate("/student");
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Buat Laporan Baru</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload Area */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Foto Kerusakan</label>
          <div 
            className={`relative h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${
              preview ? "border-blue-500" : "border-gray-300 hover:border-blue-400 bg-gray-50"
            }`}
            onClick={() => {
              // Simulating file pick
              setPreview("https://images.unsplash.com/photo-1718203862467-c33159fdc504?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhaXIlMjBjb25kaXRpb25lciUyMHVuaXR8ZW58MXx8fHwxNzgwODkyMzg4fDA&ixlib=rb-4.1.0&q=80&w=1080");
            }}
          >
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 backdrop-blur p-3 rounded-full shadow-lg">
                    <Camera className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-gray-900 font-semibold">Klik untuk ambil foto atau unggah</p>
                <p className="text-sm text-gray-500 mt-1">Format JPG, PNG (Maks. 5MB)</p>
              </div>
            )}
          </div>
        </div>

        {/* Category & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Kategori Fasilitas</label>
            <select className="w-full p-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none" required>
              <option value="">Pilih Kategori</option>
              <option value="ac">Air Conditioner (AC)</option>
              <option value="proyektor">Proyektor</option>
              <option value="kursi">Kursi / Meja</option>
              <option value="komputer">Komputer / Jaringan</option>
              <option value="listrik">Listrik / Lampu</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Prioritas</label>
            <div className="flex gap-2">
              {['Rendah', 'Sedang', 'Tinggi'].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`flex-1 py-3 rounded-2xl text-sm font-semibold border transition-all ${
                    p === 'Sedang' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Gedung</label>
            <select className="w-full p-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none" required>
              <option value="">Pilih Gedung</option>
              <option value="A">Gedung A (Rektorat)</option>
              <option value="B">Gedung B (Teknik)</option>
              <option value="C">Gedung C (Sains)</option>
              <option value="D">Gedung D (Ekonomi)</option>
              <option value="E">Gedung E (Kedokteran)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Ruangan</label>
            <input 
              type="text" 
              placeholder="Contoh: Ruang 304 atau Lab 1"
              className="w-full p-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Deskripsi Kerusakan</label>
          <textarea 
            rows={4}
            placeholder="Jelaskan detail kerusakan yang terjadi..."
            className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
            isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
              />
              Mengirim...
            </>
          ) : (
            "Kirim Laporan"
          )}
        </button>
      </form>
    </div>
  );
};
