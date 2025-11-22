import React, { useState, useRef } from 'react';
import { User, Bell, Shield, Monitor, ChevronRight, X, Save, Lock, Smartphone, Check, Eye, EyeOff, QrCode, Copy, Camera, Upload, List, Plus, Trash2, Pencil } from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    onLogout: () => void;
    user: UserProfile;
    onUpdateUser: (user: UserProfile) => void;
    taskCategories: string[];
    onUpdateTaskCategories: (categories: string[]) => void;
}

export const Settings: React.FC<SettingsProps> = ({ darkMode, toggleDarkMode, onLogout, user, onUpdateUser, taskCategories, onUpdateTaskCategories }) => {
    // Notifications State
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        updates: false
    });

    // 2FA State
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    // Modal States
    const [activeModal, setActiveModal] = useState<'none' | 'profile' | 'password' | '2fa' | 'categories'>('none');
    
    // Form States
    const [profileForm, setProfileForm] = useState({ ...user });
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    
    // Category Management State
    const [categoryInput, setCategoryInput] = useState('');
    const [editingCategory, setEditingCategory] = useState<{ original: string, current: string } | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        onUpdateUser(profileForm);
        setActiveModal('none');
        showSuccess('Profile updated successfully.');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                onUpdateUser({ ...user, profileImage: base64String });
                showSuccess('Profile photo updated.');
            };
            reader.readAsDataURL(file);
        }
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

    // --- Task Category Logic ---
    const handleAddCategory = () => {
        if (categoryInput.trim() && !taskCategories.includes(categoryInput.trim())) {
            onUpdateTaskCategories([...taskCategories, categoryInput.trim()]);
            setCategoryInput('');
        }
    };

    const handleDeleteCategory = (cat: string) => {
        if (window.confirm(`Are you sure you want to delete the category "${cat}"?`)) {
            onUpdateTaskCategories(taskCategories.filter(c => c !== cat));
        }
    };

    const saveEditedCategory = () => {
        if (editingCategory && editingCategory.current.trim() && editingCategory.current !== editingCategory.original) {
            if (taskCategories.includes(editingCategory.current.trim())) {
                alert('Category name already exists');
                return;
            }
            const updatedCategories = taskCategories.map(c => c === editingCategory.original ? editingCategory.current.trim() : c);
            onUpdateTaskCategories(updatedCategories);
            setEditingCategory(null);
        } else {
            setEditingCategory(null);
        }
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

    const renderCategoriesModal = () => {
        if (activeModal !== 'categories') return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white dark:bg-ar-dark-card rounded-2xl max-w-md w-full shadow-xl border border-ar-beige dark:border-gray-700 overflow-hidden flex flex-col max-h-[80vh]">
                    <div className="p-6 border-b border-ar-beige dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-ar-text dark:text-ar-dark-text">Manage Task Categories</h2>
                        <button onClick={() => setActiveModal('none')} className="text-ar-accent hover:text-ar-text dark:hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                    
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <label className="block text-sm font-medium text-ar-accent mb-2">Add New Category</label>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={categoryInput}
                                onChange={e => setCategoryInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                                placeholder="e.g. Medical"
                                className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-ar-text dark:text-white focus:ring-2 focus:ring-ar-taupe focus:outline-none"
                            />
                            <button 
                                onClick={handleAddCategory}
                                disabled={!categoryInput.trim()}
                                className="px-4 py-2 bg-ar-taupe text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                        <ul className="space-y-1">
                            {taskCategories.map(cat => (
                                <li key={cat} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg group">
                                    {editingCategory?.original === cat ? (
                                        <div className="flex items-center gap-2 flex-1 mr-2">
                                            <input 
                                                type="text"
                                                value={editingCategory.current}
                                                onChange={e => setEditingCategory({...editingCategory, current: e.target.value})}
                                                className="flex-1 p-1 px-2 text-sm rounded border border-ar-taupe bg-white dark:bg-gray-700 text-ar-text dark:text-white"
                                                autoFocus
                                            />
                                            <button onClick={saveEditedCategory} className="text-green-600 hover:text-green-700"><Check size={18} /></button>
                                            <button onClick={() => setEditingCategory(null)} className="text-red-500 hover:text-red-600"><X size={18} /></button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="font-medium text-ar-text dark:text-ar-dark-text">{cat}</span>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => setEditingCategory({ original: cat, current: cat })}
                                                    className="p-2 text-gray-400 hover:text-ar-taupe hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteCategory(cat)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
                        <button 
                            onClick={() => setActiveModal('none')}
                            className="text-sm text-ar-taupe hover:underline font-medium"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // ... (Edit Profile, Password, 2FA modals - same as before)
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
            {renderCategoriesModal()}

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
                    <div className="relative group">
                        {user.profileImage ? (
                            <img src={user.profileImage} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-ar-taupe" />
                        ) : (
                            <div className="w-20 h-20 bg-ar-taupe rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {user.firstName[0]}{user.lastName[0]}
                            </div>
                        )}
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            title="Upload Photo"
                        >
                            <Camera size={14} className="text-ar-text dark:text-white" />
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />
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

                {/* Appearance, Security & Task Config */}
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

                    {/* Task Configuration */}
                    <div className="bg-white dark:bg-ar-dark-card rounded-xl border border-ar-beige dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-ar-text dark:text-ar-dark-text flex items-center gap-2">
                                <List size={20} className="text-ar-taupe" /> Task Configuration
                            </h2>
                        </div>
                        <div className="p-6">
                            <button 
                                onClick={() => setActiveModal('categories')}
                                className="w-full text-left py-2 flex justify-between items-center text-ar-text dark:text-ar-dark-text hover:text-ar-taupe transition-colors"
                            >
                                <div>
                                    <p className="font-medium">Task Categories</p>
                                    <p className="text-xs text-ar-accent">Manage categories for family tasks</p>
                                </div>
                                <ChevronRight size={16} className="text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
             <div className="text-center text-xs text-gray-400 py-8">
                <p>AfterReach v1.1 • Build 2023.10.24</p>
            </div>
        </div>
    );
};