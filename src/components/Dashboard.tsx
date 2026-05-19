import React from 'react';
import { Users, FileText, CheckCircle, Clock, Zap } from 'lucide-react';
import { Student, MonthlyRecord } from '../types';

interface DashboardProps {
  students: Student[];
  records: MonthlyRecord[];
  setView: (view: 'dashboard' | 'students' | 'report' | 'journey') => void;
}

export default function Dashboard({ students, records, setView }: DashboardProps) {
  const totalStudents = students.length;
  const totalReports = records.length;
  const reportsThisMonth = records.filter(r => r.month === new Date().toLocaleString('id-ID', { month: 'long' })).length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Selamat Datang, Bu Yanti</h2>
        <p className="text-gray-500 mt-1">Berikut adalah ringkasan progres administrasi rapor Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Users className="text-blue-600" />} 
          label="Total Siswa" 
          value={totalStudents.toString()} 
          bgColor="bg-blue-50"
        />
        <StatCard 
          icon={<FileText className="text-purple-600" />} 
          label="Total Laporan" 
          value={totalReports.toString()} 
          bgColor="bg-purple-50"
        />
        <StatCard 
          icon={<CheckCircle className="text-green-600" />} 
          label="Laporan Bulan Ini" 
          value={reportsThisMonth.toString()} 
          bgColor="bg-green-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-1 gap-3">
            <ActionButton 
              onClick={() => setView('report')}
              icon={<Zap size={18} />}
              label="Buat Komentar Rapor Baru"
              sublabel="Input nilai bulanan & generate AI"
              color="bg-[#E63946]"
            />
            <ActionButton 
              onClick={() => setView('students')}
              icon={<Users size={18} />}
              label="Kelola Data Siswa"
              sublabel="Tambah atau edit profil siswa"
              color="bg-[#1D3557]"
            />
             <ActionButton 
              onClick={() => setView('journey')}
              icon={<LineChart size={18} />}
              label="Lihat Learning Journey"
              sublabel="Rangkuman naratif satu semester"
              color="bg-[#457B9D]"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-gray-400 flex flex-col items-center justify-center min-h-[300px]">
          <Clock size={48} className="mb-4 opacity-20" />
          <p className="text-sm font-medium">Aktivitas Terbaru</p>
          <p className="text-xs text-center mt-1">Aktivitas pengerjaan rapor Anda akan muncul di sini.</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bgColor }: { icon: React.ReactNode; label: string; value: string; bgColor: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 ${bgColor} rounded-2xl flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
    </div>
  );
}

function ActionButton({ onClick, icon, label, sublabel, color }: { onClick: () => void; icon: React.ReactNode; label: string; sublabel: string; color: string }) {
  return (
    <button 
      onClick={onClick}
      className={`group flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-lg transition-all duration-300 text-left`}
    >
      <div className={`w-10 h-10 ${color} text-white rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <div>
        <div className="font-bold text-sm text-gray-900">{label}</div>
        <div className="text-xs text-gray-500">{sublabel}</div>
      </div>
    </button>
  );
}

function LineChart({ size, className }: { size?: number, className?: string }) {
  return <Zap size={size} className={className} />; // Placeholder as actual LineChart icon is used in App
}
