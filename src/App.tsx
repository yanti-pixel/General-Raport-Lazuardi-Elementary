/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  FileText, 
  LineChart, 
  PlusCircle, 
  ChevronRight, 
  Save, 
  Sparkles,
  BookOpen,
  LayoutDashboard,
  GraduationCap
} from 'lucide-react';
import { Student, MonthlyRecord, SUBJECTS, MONTHS, LEVELS } from './types';

// Components
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import ReportForm from './components/ReportForm';
import LearningJourney from './components/LearningJourney';

type View = 'dashboard' | 'students' | 'report' | 'journey';

export default function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<MonthlyRecord[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedStudents = localStorage.getItem('lazuardi_students');
    const savedRecords = localStorage.getItem('lazuardi_records');
    if (savedStudents) setStudents(JSON.parse(savedStudents));
    if (savedRecords) setRecords(JSON.parse(savedRecords));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('lazuardi_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('lazuardi_records', JSON.stringify(records));
  }, [records]);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard students={students} records={records} setView={setActiveView} />;
      case 'students':
        return <StudentList students={students} setStudents={setStudents} />;
      case 'report':
        return <ReportForm students={students} records={records} setRecords={setRecords} />;
      case 'journey':
        return <LearningJourney students={students} records={records} />;
      default:
        return <Dashboard students={students} records={records} setView={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans">
      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 px-4 py-8 flex flex-col gap-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-[#E63946] rounded-xl flex items-center justify-center text-white shadow-lg">
              <GraduationCap size={24} />
            </div>
            <h1 className="font-bold text-xl tracking-tight">Lazuardi</h1>
          </div>

          <div className="flex flex-col gap-2">
            <NavItem 
              active={activeView === 'dashboard'} 
              onClick={() => setActiveView('dashboard')}
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
            />
            <NavItem 
              active={activeView === 'students'} 
              onClick={() => setActiveView('students')}
              icon={<Users size={20} />}
              label="Data Siswa"
            />
            <NavItem 
              active={activeView === 'report'} 
              onClick={() => setActiveView('report')}
              icon={<FileText size={20} />}
              label="Input Rapor"
            />
            <NavItem 
              active={activeView === 'journey'} 
              onClick={() => setActiveView('journey')}
              icon={<LineChart size={20} />}
              label="Learning Journey"
            />
          </div>

          <div className="mt-auto bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
              YG
            </div>
            <div>
              <div className="text-sm font-semibold">Yanti Guru</div>
              <div className="text-[10px] text-gray-500">Teacher Account</div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-10 max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
        ${active 
          ? 'bg-[#1D3557] text-white shadow-md' 
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}
      `}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}

