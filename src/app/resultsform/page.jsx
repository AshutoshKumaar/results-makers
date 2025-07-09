"use client";
import { useState, useRef } from "react";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function ResultForm() {
  const [studentName, setStudentName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [rank, setRank] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageChange, setPageChange] = useState(false);
  const [marks, setMarks] = useState([
    { subject: "", full: "50", pass: "15", obtained: "" },
  ]);

  const router = useRouter();
  const inputRefs = useRef([]);

  const isFormValid = () =>
    studentName &&
    fatherName &&
    studentClass &&
    rollNo &&
    rank &&
    marks.every((m) => m.subject && m.obtained);

  const handleChange = (i, field, value) => {
    const updated = [...marks];
    updated[i][field] = value;
    setMarks(updated);
    if (isFormValid()) setError("");
  };

  const handleAddSubject = () => {
    const updatedMarks = [
      ...marks,
      { subject: "", full: "50", pass: "15", obtained: "" },
    ];
    setMarks(updatedMarks);

    setTimeout(() => {
      const lastIndex = updatedMarks.length - 1;
      inputRefs.current[lastIndex]?.scrollIntoView({ behavior: "smooth" });
      inputRefs.current[lastIndex]?.focus();
    }, 100);
  };

  const handleDeleteSubject = (index) => {
    if (marks.length === 1) return;
    const updated = [...marks];
    updated.splice(index, 1);
    setMarks(updated);
  };

  const calculateTotal = () =>
    marks.reduce((acc, cur) => acc + Number(cur.obtained || 0), 0);

  const calculateMax = () =>
    marks.reduce((acc, cur) => acc + Number(cur.full || 0), 0);

  const calculatePercentage = () => {
    const total = calculateTotal();
    const max = calculateMax();
    return max ? ((total / max) * 100).toFixed(2) : "0.00";
  };

  const handleResults = () => {
    setPageChange(true);
    setTimeout(() => {
      router.push("/dashboard/results/resultslistpage");
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setError("⚠️ Please fill all required fields including subject & obtained marks.");
      return;
    }

    setError("");
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
      percentage: calculatePercentage(),
    };

    try {
      await addDoc(collection(db, "results"), data);

      // Reset form
      setStudentName("");
      setFatherName("");
      setStudentClass("");
      setRollNo("");
      setRank("");
      setMarks([{ subject: "", full: "50", pass: "15", obtained: "" }]);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while saving the result.");
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
     <div className="border-[1px] shadow-sm border-slate-500">
         <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-6 max-w-3xl mx-auto"
      >
        {error && <p className="text-red-600 font-semibold">{error}</p>}

        {/* STUDENT INFO */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Student Name</label>
            <input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Enter student name"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Father's Name</label>
            <input
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Enter father's name"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Class</label>
            <input
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Enter class"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Roll No</label>
            <input
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Enter roll number"
            />
          </div>
        </div>

        {/* SUBJECT MARKS */}
        <div>
          <label className="block text-lg font-semibold mb-2">Subjects and Marks</label>
          <div className="space-y-4 h-[350px] overflow-y-auto border rounded p-4 bg-gray-50">
            {marks.map((row, i) => (
              <div
                key={i}
                className="space-y-2 bg-white p-3 border rounded shadow-sm"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <input
                      type="text"
                      ref={(el) => (inputRefs.current[i] = el)}
                      value={row.subject}
                      onChange={(e) => handleChange(i, "subject", e.target.value)}
                      className="border p-2 rounded w-full"
                      placeholder="e.g., Math"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Full Marks</label>
                    <input
                      type="number"
                      value={row.full}
                      onChange={(e) => handleChange(i, "full", e.target.value)}
                      className="border p-2 rounded w-full"
                      placeholder="e.g., 50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Pass Marks</label>
                    <input
                      type="number"
                      value={row.pass}
                      onChange={(e) => handleChange(i, "pass", e.target.value)}
                      className="border p-2 rounded w-full"
                      placeholder="e.g., 15"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Obtained Marks</label>
                    <input
                      type="number"
                      value={row.obtained}
                      onChange={(e) => handleChange(i, "obtained", e.target.value)}
                      className="border p-2 rounded w-full"
                      placeholder="e.g., 42"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubject(i)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddSubject}
            className="bg-yellow-500 text-white px-4 py-2 rounded mt-4 block"
          >
            + Add Subject
          </button>
        </div>

        {/* RANK & PERCENTAGE */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block mb-1 font-medium">Status</label>
            <input
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="e.g.,Pass, fail,  1st"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Percentage</label>
            <input
              value={calculatePercentage()}
              readOnly
              className="border p-2 rounded w-full bg-gray-100"
            />
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Save Result
        </button>
      </form>
     </div>

      <button
        onClick={handleResults}
        className="bg-blue-600 text-white px-4 py-2 mt-10 mx-auto rounded-2xl block"
      >
        Results Section
      </button>
    </div>
  );
}
