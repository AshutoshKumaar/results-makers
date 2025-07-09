'use client';
import ResultForm from "@/app/resultsform/page";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/Footer";

export default function CreateResultPage() {
  return (
    <div className="min-h-screen">
     <Navbar />
      <main className="p-4">
         <h1 className="text-3xl font-bold my-4 px-2">Create Result</h1>
         <ResultForm />
      </main>
      <Footer />
      
    </div>
  );
}
