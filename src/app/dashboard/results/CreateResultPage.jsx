'use client';
import ResultForm from "@/app/resultsform/page";
import Navbar from "@/app/components/navbar";

export default function CreateResultPage() {
  return (
    <div className="p-6 min-h-screen bg-gray-100">
     <Navbar />
      <h1 className="text-xl font-bold my-4 px-2">Create Result</h1>
      <ResultForm />
    </div>
  );
}
