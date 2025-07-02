"use client";

import { db } from "@/app/firebase/config";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Navbar from "@/app/components/navbar";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function ResultListPage() {
  const [results, setResults] = useState([]);
  const [classFilter, setClassFilter] = useState("");
  const [rollFilter, setRollFilter] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
 
  const fetchResults = async () => {
    const snapshot = await getDocs(collection(db, "results"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setResults(data);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this result?")) {
      await deleteDoc(doc(db, "results", id));
      alert("Result deleted successfully!");
      fetchResults();
      setFiltered([]); // Reset filtered on delete
    }
  };

  const handlePrint = (id) => {
    const resultDiv = document.getElementById(`result-${id}`);
    if (!resultDiv) return;

    const printWindow = window.open("", "", "height=800,width=800");
    printWindow?.document.write("<html><head><title></title>");
    printWindow?.document.write(`
      <style>
      @import url('https://fonts.googleapis.com/css2?family=Mooli&display=swap');

        body { font-family: 'Mooli', sans-serif; margin: 40px; }
        #school-haeder { display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;}
  #total-section {
      display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem; 
  font-size: 1rem;
  text-align:center;
  }
        #p-1 {
            text-align: center;
            margin-top: 0px
        }
        #p-2 {
            text-align: center;
            margin-top: 0px
        }
        h1, h2 { text-align: center; }
        h2 {font-size: 45px; letter-spacing: 1px; margin-bottom:4px;}
        p { font-size: 16px; }
        #student-details {
        display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap:10px            
  font-size: 0.875rem;    
  margin-bottom: 1rem;
  border: 1px solid #000;
  padding: 1rem; 
  }
  #report-card {
          margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;     
  margin-bottom: 1rem;
  padding: 0.5rem;         
  border: 1px solid #1e293b; 
  text-align: center;
  border-radius: 0.75rem;
  width: 20%; 
  } #report-card span {
       font-size : 14px;
       font-weight : 600;
   }
        img {width : 80px; height: 80px;}
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        .signature { display: flex; justify-content: space-between; margin-top: 60px; }
        .signature div { text-align: center; }
        #action-buttons {display: none;}
      </style>
    `);
    printWindow?.document.write("</head><body>");
    printWindow?.document.write(resultDiv.innerHTML);
    printWindow?.document.write("</body></html>");
    printWindow?.document.close();
    printWindow?.print();
  };


  const handleGoBack = () => {
        setLoading(true)
        setTimeout(() => {
            router.push('/dashboard/results')
        }, 800)
  }

  const handleSearch = () => {
    const search = results.filter(
      (res) =>
        res.studentClass.toLowerCase().includes(classFilter.toLowerCase()) &&
        res.rollNo.toLowerCase().includes(rollFilter.toLowerCase())
    );
    setFiltered(search);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex flex-col  items-center justify-center bg-slate-200 text-blue-600 text-sm font-bold">
        <AiOutlineLoading3Quarters className="animate-spin text-5xl mb-4" />
        Redirect to the results-fill-up section
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-[90%] mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800 underline">
          All Student Results
        </h1>

        {/* Search Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <input
            type="text"
            placeholder="Search by Class"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-4 py-2 rounded border w-full sm:w-64"
          />
          <input
            type="text"
            placeholder="Search by Roll No"
            value={rollFilter}
            onChange={(e) => setRollFilter(e.target.value)}
            className="px-4 py-2 rounded border w-full sm:w-64"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
          >
            Search
          </button>
          {/* Go-back */}
           <button
            onClick={handleGoBack}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
          >
            Fill the results
          </button>
        </div>

        {/* Results Display */}
        {filtered.length > 0 ? (
          filtered.map((res) => (
            <div
              key={res.id}
              id={`result-${res.id}`}
              className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200 print:shadow-none print:border-none"
            >
              {/* SCHOOL HEADER */}
              <div
                id="school-haeder"
                className="text-center border-b border-black pb-4 mb-4 flex flex-row justify-center items-center"
              >
                <div className="mx-2">
                  <img
                    src="https://srnpublicschool.com/wp-content/uploads/2023/10/WhatsApp_Image_2023-10-19_at_10.25.55_AM-removebg-preview-2-300x286.png"
                    alt="Logo"
                    className="h-16 mx-auto mb-2"
                  />
                </div>
                <div className="mx-2">
                  <h2 className="text-3xl font-bold uppercase">
                    S.R.N Public School
                  </h2>
                  <p id="p-1" className="text-sm">
                    Navneet Nagar Baigna, Katihar Pin code: 854105
                  </p>
                   <p id="p-2" className="text-sm font-medium">
                    1st Terminal Examination 2025-26
                  </p>
                </div>
              </div>
              <div id="report-card" className="mx-auto border border-slate-800 text-center p-2 my-4 rounded-xl">
                   <span>Report Card</span>
                </div>

              {/* STUDENT DETAILS */}
              <div id="student-details" className="grid grid-cols-2 gap-4 text-sm mb-4">
                <p>
                  <strong>Name:</strong> {res.studentName}
                </p>
                <p>
                  <strong>Father's Name:</strong> {res.fatherName}
                </p>
                <p>
                  <strong>Class:</strong> {res.studentClass}
                </p>
                <p>
                  <strong>Roll No:</strong> {res.rollNo}
                </p>
              </div>

              {/* MARKS TABLE */}
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">Subject</th>
                    <th className="border px-2 py-1">Full Marks</th>
                    <th className="border px-2 py-1">Pass Marks</th>
                    <th className="border px-2 py-1">Obtaine Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {res.marks.map((m, i) => (
                    <tr key={i}>
                      <td className="border px-2 py-1">{m.subject}</td>
                      <td className="border px-2 py-1">{m.full}</td>
                      <td className="border px-2 py-1">{m.pass}</td>
                      <td className="border px-2 py-1">{m.obtained}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* TOTAL SECTION */}
              <div id="total-section" className="grid grid-cols-3 gap-4 mt-4 text-sm font-medium">
                <p>Total Marks: {res.total}</p>
                <p>Percentage: {res.percentage}%</p>
                <p>Rank: {res.rank}</p>
              </div>

              {/* SIGNATURES */}
              <div className="signature mt-12">
                <div>
                  <p>______________________</p>
                  <p>Class Teacher Signature</p>
                </div>
                <div>
                  <p>______________________</p>
                  <p>Principal Signature</p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div id="action-buttons" className="flex gap-3 mt-6 print:hidden">
                <button
                  onClick={() => handleDelete(res.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => handlePrint(res.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Print
                </button>
              </div>
            </div>
          ))
        ) : classFilter || rollFilter ? (
          <p className="text-center text-red-500 text-lg">
            No matching results found.
          </p>
        ) : (
          <p className="text-center text-gray-600 text-lg">
            Please search by Class and Roll No. to view results.
          </p>
        )}
      </div>
    </div>
  );
}
