import React, { useState } from 'react';
import { Sparkles, Save, Trash2, Loader2, BookOpen } from 'lucide-react';
import { Student, MonthlyRecord, SUBJECTS, MONTHS, LEVELS } from '../types';

interface ReportFormProps {
  students: Student[];
  records: MonthlyRecord[];
  setRecords: React.Dispatch<React.SetStateAction<MonthlyRecord[]>>;
}

export default function ReportForm({ students, records, setRecords }: ReportFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    month: MONTHS[new Date().getMonth()],
    subjectId: SUBJECTS[0].id,
    score: 3,
    lglo: '',
    anecdote: '',
    comment: ''
  });

  const handleGenerateComment = async () => {
    if (!formData.studentId || !formData.lglo) {
      alert('Pilih siswa dan masukkan Learning Objective terlebih dahulu.');
      return;
    }

    setLoading(true);
    const studentName = students.find(s => s.id === formData.studentId)?.name;
    const subjectName = SUBJECTS.find(s => s.id === formData.subjectId)?.name;

    try {
      const response = await fetch('/api/generate-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          subject: subjectName,
          lglo: formData.lglo,
          score: formData.score,
          anecdote: formData.anecdote,
          month: formData.month
        })
      });

      const data = await response.json();
      setFormData({ ...formData, comment: data.comment });
    } catch (error) {
      console.error(error);
      alert('Gagal membuat komentar AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!formData.studentId || !formData.comment) return;

    const newRecord: MonthlyRecord = {
      id: Date.now().toString(),
      studentId: formData.studentId,
      month: formData.month,
      subjectId: formData.subjectId,
      objectiveId: 'manual', // In a real app, this would be selected from master data
      score: formData.score,
      anecdote: formData.anecdote,
      comment: formData.comment
    };

    setRecords([...records, newRecord]);
    setFormData({
      ...formData,
      comment: '',
      anecdote: '',
      lglo: ''
    });
    alert('Laporan berhasil disimpan!');
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Input Rapor Bulanan</h2>
        <p className="text-gray-500 mt-1">Masukkan data pembelajaran dan biarkan AI merangkai kata-katanya.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Pane */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Pilih Siswa</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none bg-gray-50"
                  value={formData.studentId}
                  onChange={e => setFormData({...formData, studentId: e.target.value})}
                >
                  <option value="">-- Pilih Siswa --</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.class})</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Bulan Pelaporan</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none bg-gray-50"
                  value={formData.month}
                  onChange={e => setFormData({...formData, month: e.target.value})}
                >
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Mata Pelajaran</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none bg-gray-50"
                  value={formData.subjectId}
                  onChange={e => setFormData({...formData, subjectId: e.target.value})}
                >
                  {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Pencapaian (Score)</label>
                <div className="flex gap-2">
                  {LEVELS.map(l => (
                    <button
                      key={l.value}
                      onClick={() => setFormData({...formData, score: l.value})}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${formData.score === l.value ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'}`}
                    >
                      {l.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Learning Objective (LO)</label>
              <textarea 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium min-h-[80px]"
                placeholder="Contoh: Menghafal surat Al-Maun ayat 1-3 dengan tartil."
                value={formData.lglo}
                onChange={e => setFormData({...formData, lglo: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Catatan Khusus / Anekdot</label>
                <span className="text-[10px] text-gray-400 font-medium italic">Opsional</span>
              </div>
              <textarea 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium min-h-[80px]"
                placeholder="Contoh: Ahmad sudah mulai mandiri saat murajaah, namun masih perlu diingatkan untuk tajwid ikhfa."
                value={formData.anecdote}
                onChange={e => setFormData({...formData, anecdote: e.target.value})}
              />
            </div>

            <button 
              onClick={handleGenerateComment}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              {loading ? 'Sedang Merangkai Komentar...' : 'Buat Komentar dengan AI'}
            </button>
          </div>
        </div>

        {/* AI Output Pane */}
        <div className="space-y-6">
          <div className="bg-[#1D3557] text-white p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden min-h-[400px] flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BookOpen size={120} />
            </div>
            
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Sparkles size={20} className="text-yellow-400" />
              Hasil Komentar AI
            </h3>

            {formData.comment ? (
              <div className="flex-1">
                <textarea 
                  className="w-full h-full bg-transparent border-none focus:outline-none text-blue-100 font-medium leading-relaxed resize-none text-sm italic"
                  value={formData.comment}
                  onChange={e => setFormData({...formData, comment: e.target.value})}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                <Sparkles size={48} className="mb-4" />
                <p className="text-sm">Klik tombol "Buat Komentar" untuk mulai menggenerate narasi rapor.</p>
              </div>
            )}

            <button 
              onClick={handleSave}
              disabled={!formData.comment}
              className="mt-auto w-full bg-white text-[#1D3557] py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              Simpan ke Rapor
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="text-sm font-bold text-gray-900 mb-2">Tips Mengaji Sekolah Lazuardi</h4>
            <ul className="text-[11px] text-gray-500 space-y-2 list-disc pl-4">
              <li>Berikan pujian pada tajwid dan makharijul huruf yang tepat.</li>
              <li>Sebutkan target hafalan berikutnya secara spesifik.</li>
              <li>Apresiasi ketekunan dan adab saat membaca Al-Quran.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
