import React from "react";
import { useLocation } from "react-router";
import { motion } from "motion/react";

export const GenericPage: React.FC = () => {
  const location = useLocation();
  const title = location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(2);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-4"
      >
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </motion.div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-500 max-w-md">
        Halaman ini sedang dalam pengembangan untuk modul {title}. Silakan kembali lagi nanti untuk fitur lengkapnya.
      </p>
      <button 
        onClick={() => window.history.back()}
        className="px-6 py-2 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
      >
        Kembali
      </button>
    </div>
  );
};
