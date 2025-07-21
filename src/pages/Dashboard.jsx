import React, { useEffect, useState } from 'react';
import { FaSignOutAlt, FaClipboardList, FaChartBar, FaCogs, FaBars, FaTimes } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';
import AllHabits from '../components/AllHabits';
import Statistics from '../components/Statistics';
import Areas from '../components/Areas';
import HabitForm from './HabitForm';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { format } from 'date-fns';
import DownloadPDF from '../components/DownloadPDF';

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState('habits');
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { logout, currentUser, setSearch } = useAuth();
  const UserName = localStorage.getItem('username') || "Guest";

  const fetchHabits = async () => {
    try {
      setLoading(true);
      if (!currentUser) return;
      
      const q = query(collection(db, 'habits'), where('uid', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const todayKey = format(new Date(), 'yyyy-MM-dd');
      
      const habitsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          completedToday: data.completions?.[todayKey] || false,
          currentStreak: data.currentStreak || 0,
          longestStreak: data.longestStreak || 0
        };
      });
      
      setHabits(habitsData);
    } catch (error) {
      console.error("Error fetching habits: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, 'habits'), where('uid', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, () => {
      fetchHabits();
    });

    return () => unsubscribe();
  }, [currentUser]);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'habits':
        return (
          <AllHabits 
            habits={habits} 
            setHabits={setHabits}
            loading={loading}
            fetchHabits={fetchHabits}
            setActiveComponent={setActiveComponent} 
          />
        );
      case 'stats':
        return <Statistics habits={habits} loading={loading} />;
      case 'areas':
        return <Areas habits={habits} />;
      default:
        return (
          <AllHabits 
            habits={habits} 
            setHabits={setHabits}
            loading={loading}
            fetchHabits={fetchHabits}
            setActiveComponent={setActiveComponent} 
          />
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Sidebar Toggle Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md cursor-pointer"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      >
        {isMobileSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transform transition-transform duration-300 fixed md:static w-72 bg-white shadow-lg p-6 flex flex-col z-40 h-full`}>
        <h1 className="text-2xl text-gray-800 font-bold mb-8">Habit <span className='text-red-500'>Tracker</span></h1>
        <nav className="space-y-6 text-lg font-medium text-gray-700">
          <button 
            onClick={() => {
              setActiveComponent('habits');
              setIsMobileSidebarOpen(false);
            }}
            className={`flex items-center gap-3 transition cursor-pointer ${activeComponent === 'habits' ? 'text-red-500' : 'hover:text-red-500'}`}
          >
            <FaClipboardList /> All Habits
          </button>
          <button 
            onClick={() => {
              setActiveComponent('stats');
              setIsMobileSidebarOpen(false);
            }}
            className={`flex items-center gap-3 transition cursor-pointer ${activeComponent === 'stats' ? 'text-red-500' : 'hover:text-red-500'}`}
          >
            <FaChartBar /> Statistics
          </button>
          <button 
            onClick={() => {
              setActiveComponent('areas');
              setIsMobileSidebarOpen(false);
            }}
            className={`flex items-center gap-3 transition cursor-pointer ${activeComponent === 'areas' ? 'text-red-500' : 'hover:text-red-500'}`}
          >
            <FaCogs /> Areas
          </button>
        </nav>

        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Export Data</h3>
          <DownloadPDF habits={habits} currentUser={currentUser} />
        </div>

        <div className="mt-auto pt-6 border-t">
          <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition cursor-pointer" onClick={logout}>
            <FaSignOutAlt /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 px-4 md:px-10 py-6 overflow-y-auto mt-16 md:mt-0">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 p-4 bg-white rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">
            👋 Hi, {UserName} 
          </h2>
          <div className="relative w-full md:w-80">
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search habits..."
              className="w-full px-5 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <svg className="absolute right-4 top-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {activeComponent === 'habits' && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition cursor-pointer"
            >
              <AiOutlinePlus /> New Habit
            </button>
          </div>
        )}
      
        {renderComponent()}
      </main>

      {isModalOpen && <HabitForm onClose={() => setIsModalOpen(false)} onSave={fetchHabits} />}
    </div>
  );
}

export default Dashboard;