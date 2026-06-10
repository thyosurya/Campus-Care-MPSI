import React from "react";
import { UserPlus, Shield, User, Wrench, ArrowRight, LogIn } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { apiFetch, setStoredAuth } from "../lib/api";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = React.useState<"student" | "technician" | "admin">("student");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("password");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const roles = [
    {
      id: "student",
      title: "Mahasiswa",
      desc: "Laporkan kerusakan fasilitas kampus",
      icon: User,
    },
    {
      id: "technician",
      title: "Teknisi",
      desc: "Kelola & perbaiki tugas harian",
      icon: Wrench,
    },
    {
      id: "admin",
      title: "Admin",
      desc: "Analisis & pantau seluruh sistem",
      icon: Shield,
    },
  ] as const;

  const fillDemo = (role: typeof selectedRole) => {
    setSelectedRole(role);
    const stamp = Date.now();
    const demo = {
      student: { name: "Budi Santoso", email: `student.${stamp}@campus.test`, password: "password" },
      technician: { name: "Ahmad Subarjo", email: `technician.${stamp}@campus.test`, password: "password" },
      admin: { name: "Nina Wijaya", email: `admin.${stamp}@campus.test`, password: "password" },
    }[role];

    setName(demo.name);
    setEmail(demo.email);
    setPassword(demo.password);
  };

  React.useEffect(() => {
    fillDemo("student");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await apiFetch<{
        token: string;
        user: { id: number; name: string; email: string; role: "student" | "technician" | "admin" };
      }>("/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          role: selectedRole,
        }),
      });

      setStoredAuth(response.token, response.user);
      toast.success("Registrasi berhasil");
      navigate(`/${response.user.role}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registrasi gagal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-200">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Buat Akun</h1>
          <p className="text-gray-500 mt-2 font-medium">Daftar dulu, lalu login otomatis kalau sukses.</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-700 block ml-1">Daftar Sebagai</label>
              <div className="grid grid-cols-1 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => fillDemo(role.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group ${
                      selectedRole === role.id
                        ? "border-blue-600 bg-blue-50/50 ring-4 ring-blue-50"
                        : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-xl transition-colors ${
                        selectedRole === role.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                      }`}
                    >
                      <role.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`font-bold transition-colors ${selectedRole === role.id ? "text-blue-900" : "text-gray-900"}`}>
                        {role.title}
                      </h4>
                      <p className="text-xs text-gray-500">{role.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Nama lengkap"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Institusi</label>
                <input
                  type="email"
                  placeholder="name@campus.ac.id"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Kata Sandi</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white p-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? "Mendaftar..." : "Buat Akun"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-gray-50">
            <p className="text-sm text-gray-500">
              Sudah punya akun?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
