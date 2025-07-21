import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaCheck, FaTimes, FaFilter } from 'react-icons/fa';
import { db, auth } from '../firebase/config';
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import HabitForm from '../pages/HabitForm';
import { format, addDays, differenceInDays } from 'date-fns';
import { useAuth } from '../context/AuthContext';

function AllHabits({ habits, setHabits, fetchHabits }) {
  const [filteredHabits, setFilteredHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [error, setError] = useState(null);
  const [editHabit, setEditHabit] = useState(null);
  const { search } = useAuth();
  const [filters, setFilters] = useState({
    status: 'all',
    streak: 'all',
    category: 'all'
  });

  const categories = ['all', ...new Set(habits.map(habit => habit.category || 'uncategorized'))];

  const toggleDailyCompletion = async (habit) => {
    try {
      const todayKey = format(new Date(), 'yyyy-MM-dd');
      const newCompletionStatus = !habit.completedToday;
      
      let { currentStreak, longestStreak, totalCompleted } = habit;
      const yesterdayKey = format(addDays(new Date(), -1), 'yyyy-MM-dd');
      
      if (newCompletionStatus) {
        totalCompleted += 1;
        if (habit.completions?.[yesterdayKey]) {
          currentStreak += 1;
        } else {
          const lastCompletedDate = habit.lastCompleted?.toDate();
          if (lastCompletedDate && differenceInDays(new Date(), lastCompletedDate) <= 2) {
            currentStreak += 1;
          } else {
            currentStreak = 1;
          }
        }
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        totalCompleted = Math.max(0, totalCompleted - 1);
      }

      await updateDoc(doc(db, 'habits', habit.id), {
        [`completions.${todayKey}`]: newCompletionStatus,
        currentStreak,
        longestStreak,
        totalCompleted,
        lastUpdated: new Date(),
        lastCompleted: newCompletionStatus ? new Date() : null
      });

      fetchHabits();
    } catch (err) {
      console.error("Failed to update habit:", err);
      setError("Failed to update habit. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'habits', id));
      fetchHabits();
    } catch (err) {
      console.error("Failed to delete habit:", err);
      setError("Failed to delete habit. Please try again.");
    }
  };

  const calculateHabitStats = (habit) => {
    const completionEntries = Object.entries(habit.completions || {});
    const totalTrackedDays = completionEntries.length;
    const completedDays = completionEntries.filter(([_, completed]) => completed).length;
    const completionRate = totalTrackedDays > 0 ? Math.round((completedDays / totalTrackedDays) * 100) : 0;
    const targetDays = habit.targetDays || 30;
    const progressPercentage = Math.min(Math.round((completedDays / targetDays) * 100), 100);
    
    return {
      completionRate,
      currentStreak: habit.currentStreak || 0,
      longestStreak: habit.longestStreak || 0,
      totalCompleted: completedDays,
      targetDays,
      progressPercentage,
      daysRemaining: Math.max(0, targetDays - completedDays),
      isCompleted: completedDays >= targetDays
    };
  };

  const formatStreakText = (currentStreak, longestStreak) => {
    return `🔥 ${currentStreak}d (🏆 ${longestStreak}d)`;
  };

  const formatCompletionText = (totalCompleted, targetDays, isCompleted) => {
    return isCompleted 
      ? '✅ Goal achieved!' 
      : `📅 ${totalCompleted}/${targetDays} days`;
  };

  useEffect(() => {
    let results = habits;
    
    if (search) {
      results = results.filter(habit => 
        habit.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (filters.status !== 'all') {
      results = results.filter(habit => {
        const stats = calculateHabitStats(habit);
        return filters.status === 'completed' ? stats.isCompleted : !stats.isCompleted;
      });
    }
    
    if (filters.streak !== 'all') {
      results = results.filter(habit => {
        const currentStreak = habit.currentStreak || 0;
        if (filters.streak === 'good') return currentStreak >= 5;
        if (filters.streak === 'excellent') return currentStreak >= 15;
        return true;
      });
    }
    
    if (filters.category !== 'all') {
      results = results.filter(habit => 
        (habit.category || 'uncategorized') === filters.category
      );
    }
    
    setFilteredHabits(results);
  }, [habits, search, filters]);

  useEffect(() => {
    const checkForNewDay = () => {
      const now = new Date();
      if (now.getDate() !== currentDate.getDate()) {
        setCurrentDate(now);
        fetchHabits();
      }
    };
    const interval = setInterval(checkForNewDay, 60000);
    return () => clearInterval(interval);
  }, [currentDate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        {error}
        <button 
          onClick={fetchHabits}
          className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Daily Habits</h2>
        <div className="text-gray-500">
          {format(currentDate, 'EEEE, MMMM do')}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-400" />
            <span className="font-medium">Filters:</span>
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-3 py-1 border rounded-md"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed Goals</option>
            <option value="in-progress">In Progress</option>
          </select>
          
          <select
            value={filters.streak}
            onChange={(e) => setFilters({...filters, streak: e.target.value})}
            className="px-3 py-1 border rounded-md"
          >
            <option value="all">All Streaks</option>
            <option value="good">Good Streak (5+ days)</option>
            <option value="excellent">Excellent Streak (15+ days)</option>
          </select>
          
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="px-3 py-1 border rounded-md"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setFilters({
              status: 'all',
              streak: 'all',
              category: 'all'
            })}
            className="px-3 py-1 text-sm text-red-500 hover:text-red-700"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {filteredHabits.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {habits.length === 0 
            ? "No habits found. Create your first habit!"
            : "No habits match your current filters"}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHabits.map(habit => {
            const stats = calculateHabitStats(habit);
            const progressColor = stats.isCompleted ? 'bg-purple-500' : 'bg-green-500';
            
            return (
              <div key={habit.id} className={`bg-white p-4 rounded-lg shadow ${stats.isCompleted ? 'border-l-4 border-purple-500' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-lg">{habit.name}</h3>
                      {stats.isCompleted && (
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                          Goal Achieved!
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleDailyCompletion(habit)}
                        disabled={stats.isCompleted}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm cursor-pointer ${
                          habit.completedToday 
                            ? 'bg-green-100 text-green-800 border' 
                            : 'bg-gray-100 text-gray-800 border'
                        } ${stats.isCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {habit.completedToday ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaTimes className="text-gray-500" />
                        )}
                        <span>{habit.completedToday ? 'Done' : 'Mark'}</span>
                      </button>
                      
                      <div className="text-sm text-gray-600">
                        {formatStreakText(stats.currentStreak, stats.longestStreak)}
                      </div>
                      
                      <div className="text-sm font-medium">
                        {formatCompletionText(stats.totalCompleted, stats.targetDays, stats.isCompleted)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setEditHabit(habit)}
                      className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50"
                      title="Edit habit"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDelete(habit.id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                      title="Delete habit"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${progressColor} h-2 rounded-full`} 
                      style={{ width: `${stats.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {editHabit && (
        <HabitForm 
          habitToEdit={editHabit}
          onClose={() => setEditHabit(null)}
          onSave={fetchHabits}
        />
      )}
    </div>
  );
}

export default AllHabits;