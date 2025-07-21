import React, { useState } from 'react';
import logo from '../../public/habitLogo.png';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
      const nav = useNavigate()
  return (
    <nav className="w-full px-6 md:px-12 py-4 bg-white shadow-sm">
      <div className="flex justify-between items-center">
     

        <div onClick={()=> nav("/")} className="flex items-center gap-2 cursor-pointer">
          <img src={logo} alt="Logo" className="w-8 h-8 md:w-10 md:h-10" />
          <span className="text-xl md:text-2xl font-bold text-gray-800">
            Habit <span className="text-red-600">Tracker</span>
          </span>
        </div>

        
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className='cursor-pointer'>
            <svg
              className="w-6 h-6 text-red-500 "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        
        <div className="hidden md:flex space-x-3">
          <button onClick={()=>nav('/login')} className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition cursor-pointer">
            Log in
          </button>
          <button onClick={()=>nav('/signup')} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition cursor-pointer">
            Sign Up
          </button>
        </div>
      </div>

       
      {menuOpen && (
        <div className="flex flex-col items-start mt-4 space-y-2 md:hidden">
          <button onClick={()=>nav('/login')} className="w-full px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition cursor-pointer">
            Log in
          </button>
          <button onClick={()=>nav('/signup')} className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition cursor-pointer">
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
