import React, { useState } from 'react';
import { UserPlus, Trash2, Edit2, Search } from 'lucide-react';
import { Student } from '../types';

interface StudentListProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

export default function StudentList({ students, setStudents }: StudentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', class: '' });

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.class) return;
    
    const student: Student = {
      id: Date.now().toString(),
      name: newStudent.name,
      class: newStudent.class,
    };
    
    setStudents([...students, student]);
    setNewStudent({ name: '', class: '' });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus siswa ini? Semua data rapor terkait juga akan hilang.')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Data Siswa</h2>
          <p className="text-gray-500 mt-1">Kelola data murid yang ada di kelas Anda.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-[#1D3557] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
        >
          <UserPlus size={18} />
          Tambah Siswa
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-xl animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Nama Lengkap</label>
              <input 
                type="text" 
                value={newStudent.name}
                onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                placeholder="Contoh: Ahmad Fauzi"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              />
            </div>
            <div className="w-32 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Kelas</label>
              <input 
                type="text" 
                value={newStudent.class}
                onChange={e => setNewStudent({...newStudent, class: e.target.value})}
                placeholder="1-A"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-[#E63946] text-white px-6 py-3 rounded-xl font-bold">Simpan</button>
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari siswa atau kelas..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm font-medium"
          />
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] uppercase tracking-widest font-bold text-gray-400">
              <th className="px-6 py-4">Nama Siswa</th>
              <th className="px-6 py-4">Kelas</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{student.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold">{student.class}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-20 text-center text-gray-400 italic">
                  Belum ada data siswa.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
