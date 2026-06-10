import React, { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Calendar, Wrench, MessageSquare, Send, CheckCircle2, Clock, Circle } from "lucide-react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { motion } from "motion/react";
import { apiFetch } from "../lib/api";
import { StatusBadge } from "./StudentDashboard";

type ReportDetailData = {
  code: string;
  title: string;
  description: string;
  location: string;
  category: string;
  status: string;
  image_url?: string | null;
  reporter_name: string;
  technician_name?: string | null;
  reported_at?: string;
  timeline?: Array<{ status: string; label: string; date: string; active: boolean; done: boolean }>;
  comments?: Array<{ author: string; role: string; message: string; time: string }>;
};

const DEFAULT_TIMELINE = [
  { status: "Submitted", label: "Laporan Terkirim", date: "8 Juni, 09:00", active: true, done: true },
  { status: "Verified", label: "Laporan Terverifikasi", date: "8 Juni, 10:30", active: true, done: true },
  { status: "Assigned", label: "Teknisi Ditugaskan", date: "8 Juni, 11:15", active: true, done: true },
  { status: "Repairing", label: "Sedang Diperbaiki", date: "8 Juni, 13:00", active: true, done: false },
  { status: "Completed", label: "Selesai", date: "-", active: false, done: false },
];

export const ReportDetail: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useOutletContext<{ role: string }>();
  const { id } = useParams();
  const [report, setReport] = useState<ReportDetailData | null>(null);

  useEffect(() => {
    if (!id) return;

    apiFetch<{ data: ReportDetailData }>(`/reports/${id}`)
      .then((response) => setReport(response.data))
      .catch(() => setReport(null));
  }, [id]);

  const timeline = report?.timeline ?? DEFAULT_TIMELINE;
  const comments = report?.comments ?? [];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Detail Laporan {report?.code ?? id ?? "-"}</h2>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={report?.status ?? "Pending"} />
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-500">Kategori: {report?.category ?? "-"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            <img
              src={report?.image_url ?? "https://images.unsplash.com/photo-1718203862467-c33159fdc504?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"}
              alt="Damage"
              className="w-full aspect-video object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{report?.title ?? "Laporan Kerusakan"}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {report?.description ?? "Memuat detail laporan..."}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Lokasi</p>
                    <p className="text-sm font-bold">{report?.location ?? "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Dilaporkan Pada</p>
                    <p className="text-sm font-bold">
                      {report?.reported_at ? new Date(report.reported_at).toLocaleDateString("id-ID") : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1531750026848-8ada78f641c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Reporter"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-xs text-gray-400 font-medium">Pelapor</p>
                <p className="text-sm font-bold">{report?.reporter_name ?? "Budi Santoso"}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Teknisi Ditugaskan</p>
                <p className="text-sm font-bold">{report?.technician_name ?? "Belum ditugaskan"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-gray-900">Komentar & Diskusi</h4>
            </div>
            <div className="p-6 space-y-6 max-h-80 overflow-y-auto bg-gray-50/30">
              {comments.length > 0 ? comments.map((comment) => (
                <div key={`${comment.author}-${comment.time}`} className={`flex gap-3 ${comment.role === "reporter" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 ${comment.role === "reporter" ? "bg-gray-300" : "bg-blue-600"}`} />
                  <div className={`${comment.role === "reporter" ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border border-gray-100 rounded-tl-none"} p-3 rounded-2xl shadow-sm`}>
                    <p className={`text-sm font-bold mb-1 ${comment.role === "reporter" ? "text-blue-100" : ""}`}>
                      {comment.author} <span className="text-[10px] font-normal opacity-70 ml-2">{comment.time}</span>
                    </p>
                    <p className="text-sm">{comment.message}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500">Belum ada komentar.</p>
              )}
            </div>
            <div className="p-4 bg-white border-t border-gray-100 flex gap-3">
              <input
                type="text"
                placeholder="Tulis pesan..."
                className="flex-1 px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
              />
              <button className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-6">Status Laporan</h4>
            <div className="space-y-0 relative">
              {timeline.map((step, i) => (
                <div key={step.status} className="flex gap-4 min-h-[70px]">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                        step.done ? "bg-green-100 text-green-600" : step.active ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-300"
                      }`}
                    >
                      {step.done ? <CheckCircle2 className="w-5 h-5" /> : step.active ? <Clock className="w-5 h-5" /> : <Circle className="w-4 h-4 fill-current" />}
                    </div>
                    {i < timeline.length - 1 && (
                      <div className={`w-0.5 h-full ${step.done ? "bg-green-200" : "bg-gray-100"}`} />
                    )}
                  </div>
                  <div className="pt-1">
                    <p className={`text-sm font-bold ${step.active ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
                    <p className="text-xs text-gray-400 mt-1">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-400 hover:border-red-200 hover:text-red-500 transition-all">
              Batalkan Laporan
            </button>
          </div>

          <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
            <h4 className="font-bold text-orange-900 flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5" />
              Estimasi Selesai
            </h4>
            <p className="text-sm text-orange-700 leading-relaxed">
              {role === "technician"
                ? "Laporan ini sedang berada dalam antrian pengerjaan."
                : "Perbaikan diperkirakan akan selesai dalam 2-3 jam ke depan."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
