
import React, { useState } from 'react';
import { User, Bell, Shield, Monitor, LogOut, ChevronRight } from 'lucide-react';

interface SettingsProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ darkMode, toggleDarkMode }) => {
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        updates: false
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-ar-text dark:text-ar-dark-text">Settings</h1>
                <p className="text-ar-accent dark:text-ar-dark-accent mt-1">Manage your account preferences and application settings.</p>
            </div>

            {/* Account Section */}
            <div className="bg-white dark:bg-ar-dark-card rounded-xl border border-ar-beige dark:border-gray-700 overflow-hidden">
                 <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-ar-text dark:text-ar-dark-text flex items-center gap-2">
                        <User size={20} className="text-ar-taupe" /> Account Information
                    </h2>
                 </div>
                 <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="w-20 h-20 bg-ar-taupe rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        AD
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-ar-text dark:text-ar-dark-text">Alex Doe</h3>
                        <p className="text-ar-accent">alex.doe@example.com</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-ar-taupe/10 text-ar-taupe rounded-full text-xs font-semibold">Premium Member</span>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-ar-text dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
                        Edit Profile
                    </button>
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Notifications */}
                <div className="bg-white dark:bg-ar-dark-card rounded-xl border border-ar-beige dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-ar-text dark:text-ar-dark-text flex items-center gap-2">
                            <Bell size={20} className="text-ar-taupe" /> Notifications
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-ar-text dark:text-ar-dark-text">Email Notifications</p>
                                <p className="text-xs text-ar-accent">Receive daily summaries and reminders</p>
                            </div>
                            <button 
                                onClick={() => setNotifications({...notifications, email: !notifications.email})}
                                className={`w-12 h-6 rounded-full transition-colors relative ${notifications.email ? 'bg-ar-taupe' : 'bg-gray-300 dark:bg-gray-600'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifications.email ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>
                         <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium text-ar-text dark:text-ar-dark-text">Push Notifications</p>
                                <p className="text-xs text-ar-accent">Instant alerts for tasks</p>
                            </div>
                            <button 
                                onClick={() => setNotifications({...notifications, push: !notifications.push})}
                                className={`w-12 h-6 rounded-full transition-colors relative ${notifications.push ? 'bg-ar-taupe' : 'bg-gray-300 dark:bg-gray-600'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifications.push ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Appearance & Security */}
                <div className="space-y-6">
                     <div className="bg-white dark:bg-ar-dark-card rounded-xl border border-ar-beige dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-ar-text dark:text-ar-dark-text flex items-center gap-2">
                                <Monitor size={20} className="text-ar-taupe" /> Appearance
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-ar-text dark:text-ar-dark-text">Dark Mode</p>
                                    <p className="text-xs text-ar-accent">Adjust screen brightness for eye comfort</p>
                                </div>
                                <button 
                                    onClick={toggleDarkMode}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-ar-taupe' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${darkMode ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-ar-dark-card rounded-xl border border-ar-beige dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-ar-text dark:text-ar-dark-text flex items-center gap-2">
                                <Shield size={20} className="text-ar-taupe" /> Privacy & Security
                            </h2>
                        </div>
                        <div className="p-6 space-y-2">
                            <button className="w-full text-left py-2 flex justify-between items-center text-ar-text dark:text-ar-dark-text hover:text-ar-taupe">
                                <span>Change Password</span>
                                <ChevronRight size={16} className="text-gray-400" />
                            </button>
                            <button className="w-full text-left py-2 flex justify-between items-center text-ar-text dark:text-ar-dark-text hover:text-ar-taupe">
                                <span>Two-Factor Authentication</span>
                                <ChevronRight size={16} className="text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-8">
                <button className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium px-6 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                    <LogOut size={20} /> Sign Out
                </button>
            </div>
            
             <div className="text-center text-xs text-gray-400 pb-8">
                <p>AfterReach v1.1 • Build 2023.10.24</p>
            </div>
        </div>
    );
};
