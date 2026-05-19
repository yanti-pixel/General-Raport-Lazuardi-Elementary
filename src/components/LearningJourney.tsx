import React, { useState } from 'react';
import { LineChart, Sparkles, Download, Loader2, ChevronRight } from 'lucide-react';
import { Student, MonthlyRecord, SUBJECTS } from '../types';

interface LearningJourneyProps {
  students: Student[];
  records: MonthlyRecord[];
}

export default function LearningJourney({ students, records }: LearningJourneyProps) {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');

  const studentRecords = records.filter(r => r.studentId === selectedStudentId);
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleGenerateSummary = async () => {
    if (!selectedStudentId || studentRecords.length === 0) {
      alert('Pilih siswa yang sudah memiliki data laporan bulanan.');
      return;
    }

    setLoading(true);
    try {
      const reportsData = studentRecords.map(r => ({
        month: r.month,
        subject: SUBJECTS.find(s => s.id === r.subjectId)?.name,
        score: r.score,
        anecdote: r.anecdote,
        comment: r.comment
      }));

      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: selectedStudent?.name,
          reports: reportsData
        })
      });

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error(error);
      alert('Gagal membuat rangkuman semester.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Learning Journey</h2>
          <p className="text-gray-500 mt-1">Rangkuman perkembangan siswa selama satu semester.</p>
        </div>
        <div className="flex gap-4">
          <select 
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium bg-white"
            value={selectedStudentId}
            onChange={e => {
              setSelectedStudentId(e.target.value);
              setSummary('');
            }}
          >
            <option value="">-- Pilih Siswa --</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button 
            onClick={handleGenerateSummary}
            disabled={loading || !selectedStudentId}
            className="bg-[#E63946] text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            Generate Rangkuman
          </button>
        </div>
      </div>

      {!selectedStudentId ? (
        <div className="bg-white p-20 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
          <LineChart size={64} className="mb-4 opacity-10" />
          <p className="font-medium text-center">Silakan pilih siswa untuk melihat data perjalanannya.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* History Timeline */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Laporan Tersimpan
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px]">{studentRecords.length}</span>
            </h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {studentRecords.length > 0 ? (
                studentRecords.map(record => (
                  <div key={record.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{record.month}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${record.score >= 3 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        Score: {record.score}
                      </span>
                    </div>
                    <div className="font-bold text-sm mb-1">{SUBJECTS.find(s => s.id === record.subjectId)?.name}</div>
                    <p className="text-[11px] text-gray-500 line-clamp-2">{record.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">Belum ada laporan untuk siswa ini.</p>
              )}
            </div>
          </div>

          {/* AI Summary Pane */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm min-h-[500px] relative">
               <div className="flex justify-between items-center mb-10 border-b border-gray-50 pb-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Learning Journey Report</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Semester 1 • Lazuardi School • {selectedStudent?.name}</p>
                </div>
                {summary && (
                  <button className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-blue-600 transition-colors">
                    <Download size={20} />
                  </button>
                )}
              </div>

              {summary ? (
                <div className="prose prose-sm max-w-none animate-in fade-in slide-in-from-bottom-4">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-serif text-lg italic">
                    {summary}
                  </div>
                  
                  <div className="mt-12 flex justify-between items-end border-t border-gray-100 pt-8">
                    <div>
                      <div className="font-bold text-sm">Mengetahui Orang Tua,</div>
                      <div className="h-16"></div>
                      <div className="font-bold text-sm border-b border-gray-900 inline-block px-10"></div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm">Guru Kelas,</div>
                      <div className="h-16"></div>
                      <div className="font-bold text-sm border-b border-gray-900 inline-block px-10">Yanti Guru</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-300">
                  <Sparkles size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-medium">Tekan tombol di atas untuk melihat rangkuman perjalanan murid.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
