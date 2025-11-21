import React, { useState } from 'react';
import { LegalTask } from '../types';
import { CheckCircle2, Circle, AlertCircle, ExternalLink, Calendar, Plus, X, Save } from 'lucide-react';

interface ChecklistProps {
  tasks: LegalTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: LegalTask) => void;
}

export const Checklist: React.FC<ChecklistProps> = ({ tasks, onToggleTask, onAddTask }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState<Partial<LegalTask>>({
    title: '',
    description: '',
    dueDate: ''
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = Math.round((completedCount / tasks.length) * 100);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    const task: LegalTask = {
        id: Date.now().toString(),
        title: newTask.title || '',
        description: newTask.description || '',
        completed: false,
        dueDate: newTask.dueDate,
    };

    onAddTask(task);
    setIsAdding(false);
    setNewTask({ title: '', description: '', dueDate: '' });
  };

  const renderAddModal = () => {
      if (!isAdding) return null;
      return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white dark:bg-ar-dark-card rounded-2xl max-w-lg w-full shadow-xl border border-ar-beige dark:border-gray-700">
                  <div className="p-6 border-b border-ar-beige dark:border-gray-700 flex justify-between items-center">
                      <h2 className="text-xl font-bold text-ar-text dark:text-ar-dark-text">Add Checklist Item</h2>
                      <button onClick={() => setIsAdding(false)} className="text-ar-accent hover:text-ar-text dark:hover:text-white">
                          <X size={24} />
                      </button>
                  </div>
                  
                  <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-ar-accent mb-1">Title</label>
                          <input 
                              autoFocus
                              required
                              type="text"
                              value={newTask.title}
                              onChange={e => setNewTask({...newTask, title: e.target.value})}
                              className="w-full p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white"
                              placeholder="e.g. Contact Human Resources"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-ar-accent mb-1">Description</label>
                          <textarea 
                              rows={3}
                              value={newTask.description}
                              onChange={e => setNewTask({...newTask, description: e.target.value})}
                              className="w-full p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white resize-none"
                              placeholder="Details about the task..."
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-ar-accent mb-1">Due Date (Optional)</label>
                          <input 
                              type="date"
                              value={newTask.dueDate}
                              onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                              className="w-full p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white"
                          />
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                          <button 
                              type="button"
                              onClick={() => setIsAdding(false)}
                              className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-ar-text dark:text-ar-dark-text font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                              Cancel
                          </button>
                          <button 
                              type="submit"
                              className="px-6 py-3 rounded-lg bg-ar-taupe text-white font-medium hover:bg-opacity-90 shadow-md flex items-center gap-2"
                          >
                              <Save size={18} /> Add Item
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      );
  };

  return (
    <div className="space-y-6 relative">
      {renderAddModal()}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-ar-text dark:text-ar-dark-text">Legal & Estate Checklist</h1>
          <p className="text-ar-accent dark:text-ar-dark-accent mt-1">Key tasks to handle the estate administration process.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right">
                <span className="text-2xl font-bold text-ar-taupe">{progress}%</span>
                <span className="text-sm text-ar-accent block">Completed</span>
            </div>
            <button 
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-ar-taupe text-white rounded-lg hover:bg-opacity-90 transition flex items-center gap-2 shadow-md"
            >
                <Plus size={18} /> Add Item
            </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <div 
          className="bg-ar-taupe h-3 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="space-y-3 mt-8">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className={`
              group flex items-start gap-4 p-5 rounded-xl border transition-all duration-200
              ${task.completed 
                ? 'bg-ar-bg dark:bg-gray-800/50 border-transparent opacity-75' 
                : 'bg-white dark:bg-ar-dark-card border-ar-beige dark:border-gray-700 shadow-sm hover:shadow-md'}
            `}
          >
            <button 
              onClick={() => onToggleTask(task.id)}
              className="mt-1 text-ar-accent hover:text-ar-taupe transition-colors focus:outline-none"
            >
              {task.completed 
                ? <CheckCircle2 size={24} className="text-ar-sage" /> 
                : <Circle size={24} />
              }
            </button>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className={`font-semibold text-lg ${task.completed ? 'text-ar-accent line-through' : 'text-ar-text dark:text-ar-dark-text'}`}>
                  {task.title}
                </h3>
                {!task.completed && (
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded font-medium">Action Needed</span>
                )}
              </div>
              
              <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400' : 'text-ar-accent'}`}>
                {task.description}
              </p>
              
              <div className="flex items-center gap-4 mt-3">
                 {task.dueDate && (
                    <span className={`flex items-center gap-1 text-xs font-medium ${task.completed ? 'text-gray-400' : 'text-ar-taupe'}`}>
                        <Calendar size={14} /> Due: {task.dueDate}
                    </span>
                 )}
                 {task.externalLink && (
                    <a href="#" className="flex items-center gap-1 text-xs text-blue-500 hover:underline">
                        <ExternalLink size={14} /> Resource
                    </a>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};