'use client';
import { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const subjects = ['Math', 'Computer', 'Social Studies', 'G.K', 'Moral Science', 'Science','English', 'Hindi', 'oral', 'Drawing']

export default function ResultForm() {
  const [studentName, setStudentName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [rank, setRank] = useState('');
  const router = useRouter();
  const [marks, setMarks] = useState(subjects.map(subject => ({
    subject, full: '100', pass: '30', obtained: ''
  })));

  const calculateTotal = () => marks.reduce((acc, cur) => acc + Number(cur.obtained || 0), 0);
  const calculateMax = () => marks.reduce((acc, cur) => acc + Number(cur.full || 0), 0);
  const calculatePercentage = () => {
    const total = calculateTotal(), max = calculateMax();
    return max ? ((total / max) * 100).toFixed(2) : '0.00';
  };

  const handleChange = (i, field, val) => {
    const updated = [...marks];
    updated[i][field] = val;
    setMarks(updated);
  };

  const handleResults = () => {
      router.push('/dashboard/results/resultslistpage');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      studentName, fatherName, studentClass, rollNo, rank,
      marks, total: calculateTotal(), max: calculateMax(), percentage: calculatePercentage()
    };
    await addDoc(collection(db, 'results'), data);
    alert('Result saved!');
    
  };

  return (
   <div>
     <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Student Name" className="border p-2 rounded" />
        <input value={fatherName} onChange={e => setFatherName(e.target.value)} placeholder="Father's Name" className="border p-2 rounded" />
        <input value={studentClass} onChange={e => setStudentClass(e.target.value)} placeholder="Class" className="border p-2 rounded" />
        <input value={rollNo} onChange={e => setRollNo(e.target.value)} placeholder="Roll No" className="border p-2 rounded" />
      </div>

      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Subject</th>
            <th className="p-2 border">Full Marks</th>
            <th className="p-2 border">Pass Marks</th>
            <th className="p-2 border">Obtained Marks</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((row, i) => (
            <tr key={i}>
              <td className="p-2 border">{row.subject}</td>
              <td className="p-2 border">
                <input type="number" value={row.full} onChange={e => handleChange(i, 'full', e.target.value)} className="w-full border p-1" />
              </td>
              <td className="p-2 border">
                <input type="number" value={row.pass} onChange={e => handleChange(i, 'pass', e.target.value)} className="w-full border p-1" />
              </td>
              <td className="p-2 border">
                <input type="number" value={row.obtained} onChange={e => handleChange(i, 'obtained', e.target.value)} className="w-full border p-1" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-4">
        <input value={rank} onChange={e => setRank(e.target.value)} placeholder="Class Rank" className="border p-2 rounded" />
        <input value={calculatePercentage()} readOnly placeholder="Percentage" className="border p-2 rounded bg-gray-100" />
      </div>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save Result</button>
    </form>

    <button onClick={handleResults} className="bg-blue-600 text-white px-4 py-2 mt-10 mx-auto rounded-2xl">Results Section</button>
   </div>
  );
}
