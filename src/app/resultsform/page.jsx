'use client';
import { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function ResultForm() {
  const [studentName, setStudentName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [rank, setRank] = useState('');
  const [loading, setLoading] = useState(false);
  const [marks, setMarks] = useState([{ subject: '', full: '50', pass: '15', obtained: '' }]);
  const [error, setError] = useState('');
  const [pageChange, setPageChange] = useState(false)

  const router = useRouter();

  // Form validation function
  const isFormValid = () => {
    return (
      studentName &&
      fatherName &&
      studentClass &&
      rollNo &&
      rank &&
      marks.every((m) => m.subject && m.obtained)
    );
  };

  const handleChange = (i, field, value) => {
    const updated = [...marks];
    updated[i][field] = value;
    setMarks(updated);

    if (isFormValid()) setError('');
  };

  const handleAddSubject = () => {
    setMarks([...marks, { subject: '', full: '50', pass: '15', obtained: '' }]);
  };

  const calculateTotal = () => marks.reduce((acc, cur) => acc + Number(cur.obtained || 0), 0);
  const calculateMax = () => marks.reduce((acc, cur) => acc + Number(cur.full || 0), 0);
  const calculatePercentage = () => {
    const total = calculateTotal();
    const max = calculateMax();
    return max ? ((total / max) * 100).toFixed(2) : '0.00';
  };

  const handleResults = () => {
    setPageChange(true);
    setTimeout(() => {
      router.push('/dashboard/results/resultslistpage');
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setError('⚠️ Please fill all required fields including subject & obtained marks.');
      return;
    }

    setError('');
    setLoading(true);

    const data = {
      studentName,
      fatherName,
      studentClass,
      rollNo,
      rank,
      marks,
      total: calculateTotal(),
      max: calculateMax(),
      percentage: calculatePercentage()
    };

    try {
      await addDoc(collection(db, 'results'), data);

      // Clear form after submission
      setStudentName('');
      setFatherName('');
      setStudentClass('');
      setRollNo('');
      setRank('');
      setMarks([{ subject: '', full: '50', pass: '15', obtained: '' }]);
    } catch (err) {
      console.error(err);
      setError('Something went wrong while saving the result.');
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white text-lg font-bold text-blue-700">
        <AiOutlineLoading3Quarters className="animate-spin text-5xl mb-4" />
        Loading...
      </div>
    );
  }

  if (pageChange) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#f5f5f5] text-sm font-bold text-blue-700">
      <AiOutlineLoading3Quarters className="animate-spin text-5xl mb-4" />
      Redirecting to Results Preview Section...
    </div>
  );
}


  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        {error && <p className="text-red-600 font-semibold">{error}</p>}

        <div className="grid grid-cols-2 gap-4">
          <input value={studentName} onChange={e => { setStudentName(e.target.value); if (isFormValid()) setError(''); }} placeholder="Student Name" className="border p-2 rounded" />
          <input value={fatherName} onChange={e => { setFatherName(e.target.value); if (isFormValid()) setError(''); }} placeholder="Father's Name" className="border p-2 rounded" />
          <input value={studentClass} onChange={e => { setStudentClass(e.target.value); if (isFormValid()) setError(''); }} placeholder="Class" className="border p-2 rounded" />
          <input value={rollNo} onChange={e => { setRollNo(e.target.value); if (isFormValid()) setError(''); }} placeholder="Roll No" className="border p-2 rounded" />
        </div>

        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Subject</th>
              <th className="p-2 border">Full</th>
              <th className="p-2 border">Pass</th>
              <th className="p-2 border">Obtained</th>
            </tr>
          </thead>
          <tbody>
            {marks.map((row, i) => (
              <tr key={i}>
                <td className="p-2 border">
                  <input type="text" value={row.subject} onChange={e => handleChange(i, 'subject', e.target.value)} className="w-full border p-1" />
                </td>
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

        <button type="button" onClick={handleAddSubject} className="bg-yellow-500 text-white px-4 py-2 rounded">
          + Add Subject
        </button>

        <div className="grid grid-cols-2 gap-4">
          <input value={rank} onChange={e => { setRank(e.target.value); if (isFormValid()) setError(''); }} placeholder="Class Rank" className="border p-2 rounded" />
          <input value={calculatePercentage()} readOnly placeholder="Percentage" className="border p-2 rounded bg-gray-100" />
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Save Result
        </button>
      </form>

      <button onClick={handleResults} className="bg-blue-600 text-white px-4 py-2 mt-10 mx-auto rounded-2xl block">
        Results Section
      </button>
    </div>
  );
}
