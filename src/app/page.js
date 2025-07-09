import Image from "next/image";
import LoginPage from "./login/page";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div>
    <main>
         <LoginPage />
    </main>   
    </div>
  );
}




// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBbGmXuvrboZ-mmUouFlJqkQEwE6tkB1Ec",
//   authDomain: "results-makers.firebaseapp.com",
//   projectId: "results-makers",
//   storageBucket: "results-makers.firebasestorage.app",
//   messagingSenderId: "921667917567",
//   appId: "1:921667917567:web:0707ceb2bb43ed0d20deca",
//   measurementId: "G-2BY178B0N4"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);