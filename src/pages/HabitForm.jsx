import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';

const HabitForm = ({ onClose, habitToEdit, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        repeat: 'Daily',
        goal: '5 times',
        timeOfDay: 'Morning',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        targetDays: 30,
        completions: {},
        currentStreak: 0,
        longestStreak: 0,
        totalCompleted: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (habitToEdit) {
            setFormData({
                name: habitToEdit.name || '',
                repeat: habitToEdit.repeat || 'Daily',
                goal: habitToEdit.goal || '5 times',
                timeOfDay: habitToEdit.timeOfDay || 'Morning',
                startDate: habitToEdit.startDate || format(new Date(), 'yyyy-MM-dd'),
                targetDays: habitToEdit.targetDays || 30,
                completions: habitToEdit.completions || {},
                currentStreak: habitToEdit.currentStreak || 0,
                longestStreak: habitToEdit.longestStreak || 0,
                totalCompleted: habitToEdit.totalCompleted || 0
            });
        }
    }, [habitToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'targetDays' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated");

            if (!formData.name.trim()) {
                throw new Error("Habit name is required");
            }

            if (formData.targetDays <= 0) {
                throw new Error("Target days must be at least 1");
            }

            const todayKey = format(new Date(), 'yyyy-MM-dd');
            const habitData = {
                ...formData,
                uid: user.uid,
                createdAt: habitToEdit ? habitToEdit.createdAt : serverTimestamp(),
                updatedAt: serverTimestamp(),
                completions: habitToEdit ? formData.completions : { [todayKey]: false }
            };

            if (habitToEdit) {
                await updateDoc(doc(db, 'habits', habitToEdit.id), habitData);
            } else {
                await addDoc(collection(db, 'habits'), habitData);
            }

            onClose();
            if (onSave) onSave();
        } catch (err) {
            console.error("Error saving habit: ", err);
            setError(err.message || 'Failed to save habit');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-[90%] max-w-xl shadow-xl relative">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
                    onClick={onClose}
                    disabled={loading}
                >
                    <FaTimes className="text-xl" />
                </button>

                <h2 className="text-2xl font-bold mb-4 text-center text-red-600">
                    {habitToEdit ? 'Edit Habit' : 'Create New Habit'}
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block font-medium mb-1">Habit Name *</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            type="text"
                            placeholder="e.g. Read 30 minutes"
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-medium mb-1">Target Days</label>
                            <input
                                name="targetDays"
                                type="number"
                                min="1"
                                max="365"
                                value={formData.targetDays}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-400"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Repeat</label>
                            <select
                                name="repeat"
                                value={formData.repeat}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-400"
                            >
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-medium mb-1">Time of Day</label>
                            <select
                                name="timeOfDay"
                                value={formData.timeOfDay}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-400"
                            >
                                <option value="Morning">Morning</option>
                                <option value="Afternoon">Afternoon</option>
                                <option value="Evening">Evening</option>
                                <option value="Night">Night</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Start Date</label>
                            <input
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-400"
                                max={format(new Date(), 'yyyy-MM-dd')}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-70 cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            habitToEdit ? 'Update Habit' : 'Create Habit'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HabitForm;