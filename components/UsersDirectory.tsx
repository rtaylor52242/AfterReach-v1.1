import React, { useState, useRef } from 'react';
import { FamilyMember } from '../types';
import { Search, MapPin, Phone, Mail, ArrowLeft, Briefcase, Plus, Trash2, X, AlertTriangle, Save, Pencil, Camera, Heart, Clock } from 'lucide-react';

interface UsersDirectoryProps {
    users: FamilyMember[];
    onUpdateUsers: (users: FamilyMember[]) => void;
}

export const UsersDirectory: React.FC<UsersDirectoryProps> = ({ users, onUpdateUsers }) => {
  const [selectedUser, setSelectedUser] = useState<FamilyMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add/Edit/Delete State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [newSkillInput, setNewSkillInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<FamilyMember>>({
    fullName: '',
    relationship: '',
    phone: '',
    email: '',
    address: '',
    bio: '',
    skills: [],
    availability: '',
    profileImage: ''
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.relationship.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, profileImage: reader.result as string });
        };
        reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.relationship) return;

    if (editId) {
        // Update existing
        const updatedUsers = users.map(u => {
            if (u.id === editId) {
                return {
                    ...u,
                    ...formData,
                    skills: formData.skills || []
                } as FamilyMember;
            }
            return u;
        });
        onUpdateUsers(updatedUsers);
        
        // Update selected view if needed
        if (selectedUser && selectedUser.id === editId) {
            const updated = updatedUsers.find(u => u.id === editId);
            if (updated) setSelectedUser(updated);
        }
    } else {
        // Add new
        const newUser: FamilyMember = {
            id: Date.now().toString(),
            fullName: formData.fullName || '',
            relationship: formData.relationship || '',
            phone: formData.phone || '',
            email: formData.email || '',
            address: formData.address || '',
            bio: formData.bio || '',
            profileImage: formData.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName || 'User')}&background=random`,
            skills: formData.skills && formData.skills.length > 0 ? formData.skills : [],
            availability: formData.availability || 'Flexible'
        };
        onUpdateUsers([...users, newUser]);
    }

    closeForm();
  };

  const openAddForm = () => {
      setEditId(null);
      setFormData({
        fullName: '',
        relationship: '',
        phone: '',
        email: '',
        address: '',
        bio: '',
        skills: [],
        availability: '',
        profileImage: ''
      });
      setNewSkillInput('');
      setIsFormOpen(true);
  };

  const openEditForm = (user: FamilyMember) => {
      setEditId(user.id);
      setFormData({
          fullName: user.fullName,
          relationship: user.relationship,
          phone: user.phone,
          email: user.email,
          address: user.address,
          bio: user.bio,
          skills: user.skills ? [...user.skills] : [],
          availability: user.availability,
          profileImage: user.profileImage
      });
      setNewSkillInput('');
      setIsFormOpen(true);
  };

  const closeForm = () => {
      setIsFormOpen(false);
      setEditId(null);
  };

  const addSkill = () => {
    if (newSkillInput.trim()) {
        setFormData({
            ...formData,
            skills: [...(formData.skills || []), newSkillInput.trim()]
        });
        setNewSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
      const newSkills = [...(formData.skills || [])];
      newSkills.splice(index, 1);
      setFormData({ ...formData, skills: newSkills });
  };

  const confirmDelete = () => {
    if (userToDelete) {
        onUpdateUsers(users.filter(u => u.id !== userToDelete));
        setUserToDelete(null);
        if (selectedUser?.id === userToDelete) {
            setSelectedUser(null);
        }
    }
  };

  const renderDeleteModal = () => {
      if (!userToDelete) return null;
      const user = users.find(u => u.id === userToDelete);
      return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white dark:bg-ar-dark-card rounded-2xl p-6 max-w-sm w-full shadow-xl border border-ar-beige dark:border-gray-700">
                  <div className="flex items-center gap-3 text-red-500 mb-4">
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                        <AlertTriangle size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-ar-text dark:text-ar-dark-text">Delete User?</h3>
                  </div>
                  <p className="text-ar-accent dark:text-ar-dark-accent mb-6">
                      Are you sure you want to remove <span className="font-semibold text-ar-text dark:text-white">{user?.fullName}</span>? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                      <button 
                        onClick={() => setUserToDelete(null)}
                        className="flex-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-ar-text dark:text-ar-dark-text hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                      >
                          Cancel
                      </button>
                      <button 
                        onClick={confirmDelete}
                        className="flex-1 py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium shadow-md"
                      >
                          Delete
                      </button>
                  </div>
              </div>
          </div>
      );
  };

  const renderFormModal = () => {
      if (!isFormOpen) return null;
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-ar-dark-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-ar-beige dark:border-gray-700">
                <div className="p-6 border-b border-ar-beige dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-ar-dark-card z-10">
                    <h2 className="text-xl font-bold text-ar-text dark:text-ar-dark-text">
                        {editId ? 'Edit User' : 'Add New User'}
                    </h2>
                    <button onClick={closeForm} className="text-ar-accent hover:text-ar-text dark:hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                    {/* Image Upload Section */}
                    <div className="flex flex-col items-center mb-4">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <img 
                                src={formData.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName || 'User')}&background=random`} 
                                alt="Profile" 
                                className="w-24 h-24 rounded-full object-cover border-2 border-ar-taupe bg-gray-100"
                            />
                            <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Camera size={24} className="text-white" />
                            </div>
                            <button 
                                type="button"
                                className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                        <p className="text-xs text-ar-accent mt-2">Click image to update photo</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-ar-accent mb-1">Full Name</label>
                            <input 
                                required
                                type="text"
                                value={formData.fullName}
                                onChange={e => setFormData({...formData, fullName: e.target.value})}
                                className="w-full p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white"
                                placeholder="e.g. John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-ar-accent mb-1">Relationship</label>
                            <input
                                type="text"
                                required
                                value={formData.relationship}
                                onChange={e => setFormData({...formData, relationship: e.target.value})}
                                className="w-full p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white"
                                placeholder="e.g. Brother, Friend"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-ar-accent mb-1">Phone</label>
                            <input 
                                required
                                type="tel"
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                className="w-full p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white"
                                placeholder="(555) 000-0000"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-ar-accent mb-1">Availability</label>
                            <input 
                                required
                                type="text"
                                value={formData.availability}
                                onChange={e => setFormData({...formData, availability: e.target.value})}
                                className="w-full p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white"
                                placeholder="e.g. Weekends only"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-ar-accent mb-1">Email</label>
                            <input 
                                required
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className="w-full p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white"
                                placeholder="email@example.com"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-ar-accent mb-1">Address</label>
                            <input 
                                required
                                type="text"
                                value={formData.address}
                                onChange={e => setFormData({...formData, address: e.target.value})}
                                className="w-full p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white"
                                placeholder="123 Street, City, State"
                            />
                        </div>

                         {/* Skills / Help Edit */}
                         <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-ar-accent mb-1">Helps With (Tasks/Skills)</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.skills && formData.skills.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-ar-bg dark:bg-gray-700 rounded-full text-sm text-ar-text dark:text-white border border-gray-200 dark:border-gray-600 flex items-center gap-1">
                                        {skill}
                                        <button 
                                            type="button"
                                            onClick={() => removeSkill(index)}
                                            className="hover:text-red-500 focus:outline-none"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    value={newSkillInput}
                                    onChange={e => setNewSkillInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addSkill();
                                        }
                                    }}
                                    className="flex-1 p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white"
                                    placeholder="Add a skill (e.g. Driving, Childcare)..."
                                />
                                <button 
                                    type="button"
                                    onClick={addSkill}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-ar-text dark:text-white font-medium"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-ar-accent mb-1">Bio / Notes</label>
                            <textarea 
                                rows={4}
                                value={formData.bio}
                                onChange={e => setFormData({...formData, bio: e.target.value})}
                                className="w-full p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white resize-none"
                                placeholder="Short description or notes..."
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4">
                        <button 
                            type="button"
                            onClick={closeForm}
                            className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-ar-text dark:text-ar-dark-text font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-6 py-3 rounded-lg bg-ar-taupe text-white font-medium hover:bg-opacity-90 shadow-md flex items-center gap-2"
                        >
                            <Save size={18} /> {editId ? 'Update User' : 'Save User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      );
  }

  if (selectedUser) {
    return (
      <div className="animate-in fade-in slide-in-from-right duration-300 relative">
        {renderFormModal()}
        {renderDeleteModal()}

        <button 
          onClick={() => setSelectedUser(null)} 
          className="flex items-center gap-2 text-ar-taupe hover:text-ar-text dark:hover:text-white mb-6 font-medium"
        >
          <ArrowLeft size={20} /> Back to Network
        </button>

        <div className="bg-white dark:bg-ar-dark-card rounded-2xl shadow-lg overflow-hidden border border-ar-beige dark:border-gray-700 relative">
           <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button
                onClick={() => openEditForm(selectedUser)}
                className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white rounded-full transition-colors"
                title="Edit User"
              >
                 <Pencil size={20} />
              </button>
              <button 
                onClick={() => setUserToDelete(selectedUser.id)}
                className="p-2 bg-white/20 backdrop-blur-sm hover:bg-red-500 hover:text-white text-white rounded-full transition-colors"
                title="Delete User"
              >
                 <Trash2 size={20} />
              </button>
           </div>

          <div className="h-32 bg-gradient-to-r from-ar-sage to-ar-taupe"></div>
          <div className="px-8 pb-8 relative">
            <div className="relative -mt-16 mb-6">
              <img 
                src={selectedUser.profileImage} 
                alt={selectedUser.fullName} 
                className="w-32 h-32 rounded-full border-4 border-white dark:border-ar-dark-card shadow-md object-cover bg-white"
              />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-ar-text dark:text-ar-dark-text">{selectedUser.fullName}</h1>
                <p className="text-lg text-ar-accent">{selectedUser.relationship}</p>
              </div>
              <div className="flex gap-3">
                  <a 
                    href={`mailto:${selectedUser.email}`}
                    className="px-6 py-2 bg-ar-taupe text-white rounded-lg hover:bg-opacity-90 transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Mail size={18} /> Email
                  </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              <div className="md:col-span-2 space-y-8">
                <section>
                    <h3 className="text-xl font-semibold mb-4 text-ar-text dark:text-ar-dark-text">Bio & Notes</h3>
                    <p className="text-ar-accent dark:text-ar-dark-accent leading-relaxed">{selectedUser.bio || "No notes available."}</p>
                </section>

                <section>
                    <h3 className="text-xl font-semibold mb-4 text-ar-text dark:text-ar-dark-text">Can Help With</h3>
                    <div className="flex flex-wrap gap-2">
                        {selectedUser.skills.map(s => (
                            <span key={s} className="px-3 py-1 bg-ar-bg dark:bg-gray-700 rounded-full text-sm text-ar-text dark:text-ar-dark-text border border-gray-200 dark:border-gray-600">{s}</span>
                        ))}
                    </div>
                </section>
              </div>

              <div className="space-y-6">
                <div className="bg-ar-bg dark:bg-gray-800 p-6 rounded-xl border border-ar-beige dark:border-gray-700">
                    <h3 className="font-semibold mb-4 text-ar-text dark:text-ar-dark-text">Contact Information</h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Phone size={18} className="text-ar-taupe mt-1" />
                            <div>
                                <p className="text-sm text-ar-accent">Phone</p>
                                <p className="font-medium text-ar-text dark:text-ar-dark-text">{selectedUser.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail size={18} className="text-ar-taupe mt-1" />
                            <div>
                                <p className="text-sm text-ar-accent">Email</p>
                                <p className="font-medium text-ar-text dark:text-ar-dark-text break-all">{selectedUser.email}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin size={18} className="text-ar-taupe mt-1" />
                            <div>
                                <p className="text-sm text-ar-accent">Address</p>
                                <p className="font-medium text-ar-text dark:text-ar-dark-text">{selectedUser.address}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock size={18} className="text-ar-taupe mt-1" />
                            <div>
                                <p className="text-sm text-ar-accent">Availability</p>
                                <p className="font-medium text-ar-text dark:text-ar-dark-text">{selectedUser.availability}</p>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {renderFormModal()}
      {renderDeleteModal()}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold text-ar-text dark:text-ar-dark-text">Friends & Family Network</h1>
            <p className="text-ar-accent dark:text-ar-dark-accent mt-1">Manage the people who can help with tasks.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            <button 
                onClick={openAddForm}
                className="px-4 py-2 bg-ar-taupe text-white rounded-lg hover:bg-opacity-90 transition flex items-center gap-2 shadow-md whitespace-nowrap"
            >
                <Plus size={18} /> Add User
            </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by name, relationship, or location..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-ar-dark-card text-ar-text dark:text-ar-dark-text focus:outline-none focus:ring-2 focus:ring-ar-taupe shadow-sm"
        />
        {searchTerm && (
            <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-ar-text dark:hover:text-white"
                title="Clear Search"
            >
                <X size={18} />
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div 
            key={user.id} 
            onClick={() => setSelectedUser(user)}
            className="bg-white dark:bg-ar-dark-card rounded-xl p-6 shadow-sm border border-ar-beige dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer group relative"
          >
             <button
                onClick={(e) => {
                    e.stopPropagation();
                    setUserToDelete(user.id);
                }}
                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 transition-colors z-10 opacity-0 group-hover:opacity-100"
                title="Delete"
             >
                 <Trash2 size={18} />
             </button>

            <div className="flex items-center gap-4 mb-4">
              <img src={user.profileImage} alt={user.fullName} className="w-16 h-16 rounded-full object-cover bg-gray-100" />
              <div>
                <h3 className="font-bold text-lg text-ar-text dark:text-ar-dark-text group-hover:text-ar-taupe transition-colors">{user.fullName}</h3>
                <p className="text-sm text-ar-accent flex items-center gap-1"><Heart size={12} fill="currentColor" className="text-red-400" /> {user.relationship}</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
               <p className="flex items-center gap-2 text-sm text-ar-accent dark:text-ar-dark-accent">
                  <MapPin size={16} /> {user.address.split(',')[0]}
               </p>
               <p className="flex items-center gap-2 text-sm text-ar-accent dark:text-ar-dark-accent">
                  <Briefcase size={16} /> {user.skills.length} helpful skills
               </p>
            </div>
            <div className="flex flex-wrap gap-1">
                {user.skills.slice(0, 2).map(s => (
                    <span key={s} className="text-xs px-2 py-1 bg-ar-bg dark:bg-gray-700 rounded text-ar-accent dark:text-ar-dark-accent">{s}</span>
                ))}
                {user.skills.length > 2 && <span className="text-xs px-2 py-1 bg-ar-bg dark:bg-gray-700 rounded text-ar-accent dark:text-ar-dark-accent">+{user.skills.length - 2} more</span>}
            </div>
          </div>
        ))}
      </div>
      
      {filteredUsers.length === 0 && (
         <div className="text-center py-12 text-ar-accent">No users found matching your criteria.</div>
      )}
    </div>
  );
};