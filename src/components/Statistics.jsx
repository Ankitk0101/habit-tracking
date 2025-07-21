import React from 'react';
import { FaFire } from 'react-icons/fa';
import { format } from 'date-fns';

function Statistics({ habits, loading }) {
  // Calculate statistics based on habits data
  const calculateStats = () => {
    if (!habits || habits.length === 0) {
      return {
        completionRate: 0,
        habitsCompleted: 0,
        totalHabits: 0,
        bestStreak: 0,
        currentStreak: 0,
        totalCompletedDays: 0
      };
    }

    const todayKey = format(new Date(), 'yyyy-MM-dd');
    
    // Calculate today's completion
    const habitsCompletedToday = habits.filter(habit => 
      habit.completions?.[todayKey]
    ).length;
    
    const completionRate = Math.round(
      (habitsCompletedToday / habits.length) * 100
    );

    // Calculate streaks
    const bestStreak = Math.max(...habits.map(h => h.longestStreak || 0));
    const currentStreak = Math.max(...habits.map(h => h.currentStreak || 0));

    // Calculate total completed days
    const totalCompletedDays = habits.reduce((sum, habit) => {
      const completions = habit.completions || {};
      return sum + Object.values(completions).filter(Boolean).length;
    }, 0);

    return {
      completionRate,
      habitsCompleted: habitsCompletedToday,
      totalHabits: habits.length,
      bestStreak,
      currentStreak,
      totalCompletedDays
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  const {
    completionRate,
    habitsCompleted,
    totalHabits,
    bestStreak,
    currentStreak,
    totalCompletedDays
  } = calculateStats();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Statistics</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold mb-4">Today's Completion</h3>
          <div className="w-40 h-40 mx-auto relative">
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-red-500 stroke-current"
                strokeWidth="4"
                strokeDasharray={`${completionRate}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-red-600">{completionRate}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            {habitsCompleted} of {totalHabits} habits completed today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 flex items-center">
              <FaFire className="text-red-500 mr-2" /> Best Streak
            </h4>
            <p className="text-2xl font-bold text-red-500">{bestStreak} days</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 flex items-center">
              <FaFire className="text-orange-500 mr-2" /> Current Streak
            </h4>
            <p className="text-2xl font-bold text-red-500">{currentStreak} days</p>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-700">Total Completed Days</h4>
          <p className="text-2xl font-bold text-red-500">{totalCompletedDays}</p>
          <p className="text-sm text-gray-500 mt-1">
            Across all your habits
          </p>
        </div>
      </div>
    </div>
  );
}

export default Statistics;