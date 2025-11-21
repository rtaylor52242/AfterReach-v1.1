
import React, { useState } from 'react';
import { ViewId } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  ListTodo, 
  Calendar as CalendarIcon, 
  FileText, 
  MessageCircleHeart, 
  Menu, 
  X, 
  Moon, 
  Sun,
  UserCircle,
  Settings
} from 'lucide-react';

interface LayoutProps {
  activeTab: ViewId;
  onNavigate: (view: ViewId) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ activeTab, onNavigate, darkMode, toggleDarkMode, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems: { id: ViewId; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard size={20} /> },
    { id: 'directory', label: 'Find Providers', icon: <Users size={20} /> },
    { id: 'checklist', label: 'Legal Checklist', icon: <CheckSquare size={20} /> },
    { id: 'tasks', label: 'Family Tasks', icon: <ListTodo size={20} /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon size={20} /> },
    { id: 'documents', label: 'Documents', icon: <FileText size={20} /> },
    { id: 'ai-chat', label: 'Ask Aura', icon: <MessageCircleHeart size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleNavClick = (id: ViewId) => {
    onNavigate(id);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <header className="md:hidden bg-white dark:bg-ar-dark-card border-b border-ar-beige dark:border-gray-700 p-4 flex justify-between items-center z-20 sticky top-0">
        <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-ar-taupe rounded-full flex items-center justify-center text-white font-bold">AR</div>
             <span className="font-bold text-lg text-ar-taupe dark:text-ar-taupe">AfterReach v1.1</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-ar-text dark:text-ar-dark-text">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-10 w-64 bg-white dark:bg-ar-dark-card border-r border-ar-beige dark:border-gray-700 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="hidden md:flex items-center gap-2 mb-8">
             <div className="w-10 h-10 bg-ar-taupe rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">AR</div>
             <span className="font-bold text-2xl text-ar-taupe">AfterReach v1.1</span>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                  ${activeTab === item.id 
                    ? 'bg-ar-taupe text-white shadow-md' 
                    : 'text-ar-accent dark:text-ar-dark-accent hover:bg-ar-bg dark:hover:bg-gray-700'}
                `}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-ar-beige dark:border-gray-700 space-y-4">
            <button 
              onClick={toggleDarkMode}
              className="flex items-center gap-3 text-ar-text dark:text-ar-dark-text w-full px-4 py-2 rounded-lg hover:bg-ar-bg dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <div className="flex items-center gap-3 px-4 py-2">
               <UserCircle size={32} className="text-ar-taupe" />
               <div>
                 <p className="text-sm font-semibold text-ar-text dark:text-ar-dark-text">Alex Doe</p>
                 <p className="text-xs text-ar-accent">Premium Member</p>
               </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-ar-bg dark:bg-ar-dark-bg p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
