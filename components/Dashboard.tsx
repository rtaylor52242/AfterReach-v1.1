

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { LegalTask, ViewId, UserProfile } from '../types';
import { ArrowRight, AlertCircle, Users, Calendar } from 'lucide-react';

interface DashboardProps {
  legalTasks: LegalTask[];
  onNavigate: (view: ViewId) => void;
  user: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ legalTasks, onNavigate, user }) => {
  const completedCount = legalTasks.filter(t => t.completed).length;
  const totalCount = legalTasks.length;
  const remainingCount = totalCount - completedCount;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const data = [
    { name: 'Completed', value: completedCount },
    { name: 'Remaining', value: remainingCount },
  ];

  const COLORS = ['#6b8e7f', '#d4c5b9']; // Sage Green & Warm Beige

  const nextTasks = legalTasks.filter(t => !t.completed).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-ar-text dark:text-ar-dark-text mb-2">Welcome back, {user.firstName}.</h1>
        <p className="text-ar-accent dark:text-ar-dark-accent">Here is an overview of your progress today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="bg-white dark:bg-ar-dark-card rounded-2xl p-6 shadow-sm border border-ar-beige dark:border-gray-700 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ar-text dark:text-ar-dark-text mb-4">Checklist Progress</h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#000000' }}
                    itemStyle={{ color: '#000000' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-[-110px] mb-[70px]">
               <span className="text-3xl font-bold text-ar-text dark:text-ar-dark-text">{percentage}%</span>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('checklist')}
            className="mt-4 w-full py-2 px-4 bg-ar-taupe hover:bg-opacity-90 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            View Full Checklist <ArrowRight size={16} />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6 md:col-span-1">
            <div className="bg-white dark:bg-ar-dark-card rounded-2xl p-6 shadow-sm border border-ar-beige dark:border-gray-700 flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300">
                    <Users size={24} />
                </div>
                <div>
                    <p className="text-sm text-ar-accent dark:text-ar-dark-accent">Connected Providers</p>
                    <p className="text-2xl font-bold text-ar-text dark:text-ar-dark-text">2</p>
                </div>
            </div>

            <div className="bg-white dark:bg-ar-dark-card rounded-2xl p-6 shadow-sm border border-ar-beige dark:border-gray-700 flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full text-purple-600 dark:text-purple-300">
                    <Calendar size={24} />
                </div>
                <div>
                    <p className="text-sm text-ar-accent dark:text-ar-dark-accent">Upcoming Events</p>
                    <p className="text-2xl font-bold text-ar-text dark:text-ar-dark-text">3</p>
                </div>
            </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white dark:bg-ar-dark-card rounded-2xl p-6 shadow-sm border border-ar-beige dark:border-gray-700">
          <h2 className="text-lg font-semibold text-ar-text dark:text-ar-dark-text mb-4">Recommended Next Steps</h2>
          <div className="space-y-3">
            {nextTasks.length > 0 ? (
              nextTasks.map(task => (
                <div key={task.id} className="p-3 bg-ar-bg dark:bg-gray-800 rounded-xl flex items-start gap-3">
                  <AlertCircle size={18} className="text-ar-gold mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-sm text-ar-text dark:text-ar-dark-text">{task.title}</h3>
                    <p className="text-xs text-ar-accent mt-1 line-clamp-1">{task.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-ar-sage font-medium">All caught up! Well done.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
