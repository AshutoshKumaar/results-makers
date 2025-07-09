'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { FiUser } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import Link from 'next/link';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-50">
      <Link href={'/dashboard/results'}><h1 className="text-xl sm:text-2xl font-extrabold text-blue-700 tracking-wide">SRN Public School</h1></Link>

      {user && (
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-all duration-200"
          >
            <FiUser className="text-xl" />
            <span className="font-medium hidden sm:inline">
              {user.displayName || user.email?.split('@')[0]}
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white shadow-xl rounded-lg border border-gray-200 z-50">
              <div className="p-4 relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  <IoMdClose className="text-xl" />
                </button>

                <p className="text-sm font-semibold text-gray-700 mb-1">Logged in as:</p>
                <p className="text-base font-medium text-gray-900">{user.displayName || 'Anonymous'}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div className="p-4 border-t">
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
