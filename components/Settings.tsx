
import React, { useState } from 'react';
import { User, Bell, Shield, Monitor, LogOut, ChevronRight, X, Save, Lock, Smartphone, Check, Eye, EyeOff, QrCode, Copy } from 'lucide-react';

interface SettingsProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ darkMode, toggleDarkMode, onLogout }) => {
    // User Profile State
    const [user, setUser] = useState({
        firstName: 'Alex',
        lastName: 'Doe',
        email: 'alex.doe@example.com',
        role: 'Premium Member'
    });

    // Notifications State
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        updates: false
    });

    // 2FA State
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    // Modal States
    const [activeModal, setActiveModal] = useState<'none' | 'profile' | 'password' | '2fa'>('none');
    
    // Form States
    const [profileForm, setProfileForm] = useState({ ...user });
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Helper: Show Success Message
    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    // --- Edit Profile Logic ---
    const openProfileModal = () => {
        setProfileForm({ ...user });
        setActiveModal('profile');
    };

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        setUser(profileForm);
        setActiveModal('none');
        showSuccess('Profile updated successfully.');
    };

    // --- Change Password Logic ---
    const openPasswordModal = () => {
        setPasswordForm({ current: '', new: '', confirm: '' });
        setShowPasswords({ current: false, new: false, confirm: false });
        setActiveModal('password');
    };

    const handlePasswordSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.new !== passwordForm.confirm) {
            alert("New passwords do not match.");
            return;
        }
        if (passwordForm.new.length < 8) {
            alert("Password must be at least 8 characters.");
            return;
        }
        // Mock API call here
        setActiveModal('none');
        showSuccess('Password changed successfully.');
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    // --- 2FA Logic ---
    const toggle2FA = () => {
        setIs2FAEnabled(!is2FAEnabled);
    };

    // --- Renderers ---

    const renderSuccessMessage = () => {
        if (!successMsg) return null;
        return (
            <div className="fixed top-4 right-4 z-50 bg-ar-sage text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top fade-in">
                <Check size={20} />
                {successMsg}
            </div>
        );
    };

    const renderEditProfileModal = () => {
        if (activeModal !== 'profile') return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white dark:bg-ar-dark-card rounded-2xl max-w-md w-full shadow-xl border border-ar-beige dark:border-gray-700">
                    <div className="p-6 border-b border-ar-beige dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-ar-text dark:text-ar-dark-text">Edit Profile</h2>
                        <button onClick={() => setActiveModal('none')} className="text-ar-accent hover:text-ar-text dark:hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                    <form onSubmit={handleProfileSave} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-ar-accent mb-1">First Name</label>
                                <input 
                                    type="text"
                                    required
                                    value={profileForm.firstName}
                                    onChange={e => setProfileForm({...profileForm, firstName: e.target.value})}
                                    className="w-full p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-ar-accent mb-1">Last Name</label>
                                <input 
                                    type="text"
                                    required
                                    value={profileForm.lastName}
                                    onChange={e => setProfileForm({...profileForm, lastName: e.target.value})}
                                    className="w-full p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-ar-accent mb-1">Email Address</label>
                            <input 
                                type="email"
                                required
                                value={profileForm.email}
                                onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                                className="w-full p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button 
                                type="button"
                                onClick={() => setActiveModal('none')}
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-ar-text dark:text-ar-dark-text font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-ar-taupe text-white rounded-lg hover:bg-opacity-90 shadow-md flex items-center gap-2"
                            >
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const renderChangePasswordModal = () => {
        if (activeModal !== 'password') return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white dark:bg-ar-dark-card rounded-2xl max-w-md w-full shadow-xl border border-ar-beige dark:border-gray-700">
                    <div className="p-6 border-b border-ar-beige dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-ar-text dark:text-ar-dark-text">Change Password</h2>
                        <button onClick={() => setActiveModal('none')} className="text-ar-accent hover:text-ar-text dark:hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                    <form onSubmit={handlePasswordSave} className="p-6 space-y-4">
                        {['current', 'new', 'confirm'].map((field) => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-ar-accent mb-1 capitalize">
                                    {field === 'confirm' ? 'Confirm New Password' : `${field} Password`}
                                </label>
                                <div className="relative">
                                    <input 
                                        type={showPasswords[field as keyof typeof showPasswords] ? 'text' : 'password'}
                                        required
                                        value={passwordForm[field as keyof typeof passwordForm]}
                                        onChange={e => setPasswordForm({...passwordForm, [field]: e.target.value})}
                                        className="w-full p-3 pr-10 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility(field as any)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-ar-text dark:hover:text-white"
                                    >
                                        {showPasswords[field as keyof typeof showPasswords] ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        <div className="flex justify-end gap-3 pt-4">
                            <button 
                                type="button"
                                onClick={() => setActiveModal('none')}
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-ar-text dark:text-ar-dark-text font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-ar-taupe text-white rounded-lg hover:bg-opacity-90 shadow-md flex items-center gap-2"
                            >
                                <Lock size={18} /> Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const render2FAModal = () => {
        if (activeModal !== '2fa') return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white dark:bg-ar-dark-card rounded-2xl max-w-md w-full shadow-xl border border-ar-beige dark:border-gray-700">
                    <div className="p-6 border-b border-ar-beige dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-ar-text dark:text-ar-dark-text">Two-Factor Authentication</h2>
                        <button onClick={() => setActiveModal('none')} className="text-ar-accent hover:text-ar-text dark:hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6 p-4 bg-ar-bg dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${is2FAEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                                    <Smartphone size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-ar-text dark:text-white">{is2FAEnabled ? 'Enabled' : 'Disabled'}</p>
                                    <p className="text-xs text-ar-accent">Secure your account</p>
                                </div>
                            </div>
                            <button 
                                onClick={toggle2FA}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${is2FAEnabled ? 'bg-ar-taupe' : 'bg-gray-300 dark:bg-gray-600'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${is2FAEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        {is2FAEnabled && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                                    <div className="mx-auto w-32 h-32 bg-white p-2 rounded-lg mb-2 border border-gray-200 flex items-center justify-center">
                                        <QrCode size={100} className="text-black" />
                                    </div>
                                    <p className="text-sm text-ar-text dark:text-ar-dark-text font-medium mb-1">Scan this QR Code</p>
                                    <p className="text-xs text-ar-accent">Use Google Authenticator or Authy</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-ar-accent mb-1 uppercase">Setup Key</label>
                                    <div className="flex gap-2">
                                        <code className="flex-1 p-2 bg-ar-bg dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-sm text-ar-text dark:text-white font-mono">
                                            HX89 2L9P 4M2Q 9X9A
                                        </code>
                                        <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-ar-text dark:text-white" title="Copy">
                                            <Copy size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end pt-6">
                            <button 
                                onClick={() => setActiveModal('none')}
                                className="px-4 py-2 bg-ar-taupe text-white rounded-lg hover:bg-opacity-90 shadow-md"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 relative">
            {renderSuccessMessage()}
            {renderEditProfileModal()}
            {renderChangePasswordModal()}
            {render2FAModal()}

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
                        {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-ar-text dark:text-ar-dark-text">{user.firstName} {user.lastName}</h3>
                        <p className="text-ar-accent">{user.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-ar-taupe/10 text-ar-taupe rounded-full text-xs font-semibold">{user.role}</span>
                    </div>
                    <button 
                        onClick={openProfileModal}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-ar-text dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                    >
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
                            <button 
                                onClick={openPasswordModal}
                                className="w-full text-left py-2 flex justify-between items-center text-ar-text dark:text-ar-dark-text hover:text-ar-taupe transition-colors"
                            >
                                <span>Change Password</span>
                                <ChevronRight size={16} className="text-gray-400" />
                            </button>
                            <button 
                                onClick={() => setActiveModal('2fa')}
                                className="w-full text-left py-2 flex justify-between items-center text-ar-text dark:text-ar-dark-text hover:text-ar-taupe transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <span>Two-Factor Authentication</span>
                                    {is2FAEnabled && <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-bold">ON</span>}
                                </div>
                                <ChevronRight size={16} className="text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-8">
                <button 
                    onClick={onLogout}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium px-6 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                    <LogOut size={20} /> Sign Out
                </button>
            </div>
            
             <div className="text-center text-xs text-gray-400 pb-8">
                <p>AfterReach v1.1 • Build 2023.10.24</p>
            </div>
        </div>
    );
};
