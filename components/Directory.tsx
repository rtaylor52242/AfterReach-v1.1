
import React, { useState, useRef } from 'react';
import { MOCK_PROFESSIONALS, INITIAL_ROLES } from '../constants';
import { Professional, ProfessionalRole, Review } from '../types';
import { Search, MapPin, Phone, Mail, Star, ArrowLeft, Award, Briefcase, Plus, Trash2, X, AlertTriangle, Save, Pencil, MessageSquare, Settings as SettingsIcon, Edit2, Camera } from 'lucide-react';

export const Directory: React.FC = () => {
  const [professionals, setProfessionals] = useState<Professional[]>(MOCK_PROFESSIONALS);
  const [selectedProf, setSelectedProf] = useState<Professional | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  
  // Role Management State
  const [roles, setRoles] = useState<string[]>(INITIAL_ROLES);
  const [isRoleManagerOpen, setIsRoleManagerOpen] = useState(false);
  const [newRoleInput, setNewRoleInput] = useState('');
  const [editingRole, setEditingRole] = useState<{ original: string, current: string } | null>(null);

  // Add/Edit/Delete Professional State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [profToDelete, setProfToDelete] = useState<string | null>(null);
  const [newServiceInput, setNewServiceInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Review State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState<{rating: number, text: string}>({ rating: 5, text: '' });

  const [formData, setFormData] = useState<Partial<Professional>>({
    role: INITIAL_ROLES[0],
    fullName: '',
    businessName: '',
    phone: '',
    email: '',
    address: '',
    bio: '',
    services: [],
    rating: 0,
    profileImage: ''
  });

  const filteredProfs = professionals.filter(prof => {
    const matchesSearch = 
      prof.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      prof.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || prof.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // --- Role Management Functions ---
  const handleAddRole = () => {
    if (newRoleInput.trim() && !roles.includes(newRoleInput.trim())) {
      setRoles([...roles, newRoleInput.trim()]);
      setNewRoleInput('');
    }
  };

  const handleDeleteRole = (roleToDelete: string) => {
    if (window.confirm(`Are you sure you want to delete the role "${roleToDelete}"?`)) {
      setRoles(roles.filter(r => r !== roleToDelete));
      // Reset filter if the deleted role was selected
      if (roleFilter === roleToDelete) setRoleFilter('All');
      
      // Note: Professionals with this role will keep the string value but it won't be in the list anymore.
    }
  };

  const startEditingRole = (role: string) => {
    setEditingRole({ original: role, current: role });
  };

  const saveEditedRole = () => {
    if (editingRole && editingRole.current.trim() && editingRole.current !== editingRole.original) {
        if (roles.includes(editingRole.current.trim())) {
            alert('Role name already exists');
            return;
        }
        
        const updatedRoleName = editingRole.current.trim();
        
        // Update Roles List
        setRoles(roles.map(r => r === editingRole.original ? updatedRoleName : r));
        
        // Cascade Update to Professionals
        const updatedProfs = professionals.map(p => ({
            ...p,
            role: p.role === editingRole.original ? updatedRoleName : p.role
        }));
        setProfessionals(updatedProfs);
        
        // Update current filter if needed
        if (roleFilter === editingRole.original) {
            setRoleFilter(updatedRoleName);
        }

        setEditingRole(null);
    } else {
        setEditingRole(null);
    }
  };

  const renderRoleManagerModal = () => {
    if (!isRoleManagerOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-ar-dark-card rounded-2xl max-w-md w-full shadow-xl border border-ar-beige dark:border-gray-700 overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-6 border-b border-ar-beige dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-ar-text dark:text-ar-dark-text">Manage Roles</h2>
                    <button onClick={() => setIsRoleManagerOpen(false)} className="text-ar-accent hover:text-ar-text dark:hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <label className="block text-sm font-medium text-ar-accent mb-2">Add New Role</label>
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            value={newRoleInput}
                            onChange={e => setNewRoleInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddRole()}
                            placeholder="e.g. Probate Specialist"
                            className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-ar-text dark:text-white focus:ring-2 focus:ring-ar-taupe focus:outline-none"
                        />
                        <button 
                            onClick={handleAddRole}
                            disabled={!newRoleInput.trim()}
                            className="px-4 py-2 bg-ar-taupe text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                        >
                            Add
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    <ul className="space-y-1">
                        {roles.map(role => (
                            <li key={role} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg group">
                                {editingRole?.original === role ? (
                                    <div className="flex items-center gap-2 flex-1 mr-2">
                                        <input 
                                            type="text"
                                            value={editingRole.current}
                                            onChange={e => setEditingRole({...editingRole, current: e.target.value})}
                                            className="flex-1 p-1 px-2 text-sm rounded border border-ar-taupe bg-white dark:bg-gray-700 text-ar-text dark:text-white"
                                            autoFocus
                                        />
                                        <button onClick={saveEditedRole} className="text-green-600 hover:text-green-700"><CheckIcon size={18} /></button>
                                        <button onClick={() => setEditingRole(null)} className="text-red-500 hover:text-red-600"><X size={18} /></button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="font-medium text-ar-text dark:text-ar-dark-text">{role}</span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => startEditingRole(role)}
                                                className="p-2 text-gray-400 hover:text-ar-taupe hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                                title="Edit Role Name"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteRole(role)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                                title="Delete Role"
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
                        onClick={() => setIsRoleManagerOpen(false)}
                        className="text-sm text-ar-taupe hover:underline font-medium"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
  };

  // --- Existing Functions ---

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
    if (!formData.fullName || !formData.businessName) return;

    if (editId) {
        // Update existing
        const updatedProfs = professionals.map(p => {
            if (p.id === editId) {
                return {
                    ...p,
                    ...formData,
                    role: formData.role, 
                    services: formData.services || [],
                    rating: formData.rating || 0
                } as Professional;
            }
            return p;
        });
        setProfessionals(updatedProfs);
        
        // Update selected view if needed
        if (selectedProf && selectedProf.id === editId) {
            const updated = updatedProfs.find(p => p.id === editId);
            if (updated) setSelectedProf(updated);
        }
    } else {
        // Add new
        const newProf: Professional = {
            id: Date.now().toString(),
            fullName: formData.fullName || '',
            role: formData.role as ProfessionalRole,
            businessName: formData.businessName || '',
            phone: formData.phone || '',
            email: formData.email || '',
            address: formData.address || '',
            bio: formData.bio || '',
            profileImage: formData.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName || 'User')}&background=random`,
            experienceYears: 0,
            certifications: [],
            services: formData.services && formData.services.length > 0 ? formData.services : ['General Consultation'],
            languages: ['English'],
            availability: 'Mon-Fri 9am-5pm',
            emergencyAvailability: false,
            rating: formData.rating || 0,
            reviewCount: 0,
            reviews: []
        };
        setProfessionals([...professionals, newProf]);
    }

    closeForm();
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedProf || !newReview.text) return;

      const review: Review = {
          id: Date.now().toString(),
          author: 'Alex Doe', // Mock current user
          date: new Date().toISOString().split('T')[0],
          rating: newReview.rating,
          text: newReview.text
      };

      const updatedProfs = professionals.map(p => {
          if (p.id === selectedProf.id) {
              const updatedReviews = [review, ...(p.reviews || [])];
              const newCount = updatedReviews.length;
              
              // Calculate new average rating from reviews array
              const totalStars = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
              const newRating = newCount > 0 ? (totalStars / newCount) : 0;
              
              return {
                  ...p,
                  reviews: updatedReviews,
                  reviewCount: newCount,
                  rating: parseFloat(newRating.toFixed(1))
              };
          }
          return p;
      });

      setProfessionals(updatedProfs);
      const updatedProf = updatedProfs.find(p => p.id === selectedProf.id);
      if (updatedProf) setSelectedProf(updatedProf);

      setIsReviewModalOpen(false);
      setNewReview({ rating: 5, text: '' });
  };

  const openAddForm = () => {
      setEditId(null);
      setFormData({
        role: roles[0],
        fullName: '',
        businessName: '',
        phone: '',
        email: '',
        address: '',
        bio: '',
        services: [],
        rating: 0,
        profileImage: ''
      });
      setNewServiceInput('');
      setIsFormOpen(true);
  };

  const openEditForm = (prof: Professional) => {
      setEditId(prof.id);
      setFormData({
          role: prof.role,
          fullName: prof.fullName,
          businessName: prof.businessName,
          phone: prof.phone,
          email: prof.email,
          address: prof.address,
          bio: prof.bio,
          services: prof.services ? [...prof.services] : [],
          rating: prof.rating,
          profileImage: prof.profileImage
      });
      setNewServiceInput('');
      setIsFormOpen(true);
  };

  const closeForm = () => {
      setIsFormOpen(false);
      setEditId(null);
  };

  const addService = () => {
    if (newServiceInput.trim()) {
        setFormData({
            ...formData,
            services: [...(formData.services || []), newServiceInput.trim()]
        });
        setNewServiceInput('');
    }
  };

  const removeService = (index: number) => {
      const newServices = [...(formData.services || [])];
      newServices.splice(index, 1);
      setFormData({ ...formData, services: newServices });
  };

  const confirmDelete = () => {
    if (profToDelete) {
        setProfessionals(professionals.filter(p => p.id !== profToDelete));
        setProfToDelete(null);
        if (selectedProf?.id === profToDelete) {
            setSelectedProf(null);
        }
    }
  };

  // Helper Icon for Edit Role
  const CheckIcon = ({ size }: { size: number }) => (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
  );

  const renderDeleteModal = () => {
      if (!profToDelete) return null;
      const prof = professionals.find(p => p.id === profToDelete);
      return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white dark:bg-ar-dark-card rounded-2xl p-6 max-w-sm w-full shadow-xl border border-ar-beige dark:border-gray-700">
                  <div className="flex items-center gap-3 text-red-500 mb-4">
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                        <AlertTriangle size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-ar-text dark:text-ar-dark-text">Delete Provider?</h3>
                  </div>
                  <p className="text-ar-accent dark:text-ar-dark-accent mb-6">
                      Are you sure you want to remove <span className="font-semibold text-ar-text dark:text-white">{prof?.fullName}</span>? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                      <button 
                        onClick={() => setProfToDelete(null)}
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

  const renderReviewModal = () => {
      if (!isReviewModalOpen) return null;
      return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white dark:bg-ar-dark-card rounded-2xl max-w-md w-full shadow-xl border border-ar-beige dark:border-gray-700">
                  <div className="p-6 border-b border-ar-beige dark:border-gray-700 flex justify-between items-center">
                      <h2 className="text-xl font-bold text-ar-text dark:text-ar-dark-text">Write a Review</h2>
                      <button onClick={() => setIsReviewModalOpen(false)} className="text-ar-accent hover:text-ar-text dark:hover:text-white">
                          <X size={24} />
                      </button>
                  </div>
                  <form onSubmit={handleReviewSubmit} className="p-6 space-y-6">
                      <div>
                          <label className="block text-sm font-medium text-ar-accent mb-2">Rating</label>
                          <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                      key={star}
                                      type="button"
                                      onClick={() => setNewReview({...newReview, rating: star})}
                                      className="focus:outline-none transition-transform hover:scale-110"
                                  >
                                      <Star 
                                          size={32} 
                                          className={newReview.rating >= star ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"} 
                                          fill={newReview.rating >= star ? "currentColor" : "none"}
                                      />
                                  </button>
                              ))}
                              <span className="text-lg font-medium ml-2 text-ar-text dark:text-white">{newReview.rating} / 5</span>
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-ar-accent mb-2">Your Review</label>
                          <textarea 
                              required
                              rows={4}
                              value={newReview.text}
                              onChange={e => setNewReview({...newReview, text: e.target.value})}
                              className="w-full p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white resize-none"
                              placeholder="Share your experience working with this professional..."
                          />
                      </div>
                      <div className="flex justify-end gap-3">
                          <button 
                              type="button"
                              onClick={() => setIsReviewModalOpen(false)}
                              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-ar-text dark:text-ar-dark-text hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                              Cancel
                          </button>
                          <button 
                              type="submit"
                              className="px-4 py-2 bg-ar-taupe text-white rounded-lg hover:bg-opacity-90 shadow-md"
                          >
                              Submit Review
                          </button>
                      </div>
                  </form>
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
                        {editId ? 'Edit Professional' : 'Add New Professional'}
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
                                src={formData.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName || 'Provider')}&background=random`} 
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
                                placeholder="e.g. Jane Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-ar-accent mb-1">Role</label>
                            <select 
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value as ProfessionalRole})}
                                className="w-full p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white"
                            >
                                {roles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-ar-accent mb-1">Business Name</label>
                            <input 
                                required
                                type="text"
                                value={formData.businessName}
                                onChange={e => setFormData({...formData, businessName: e.target.value})}
                                className="w-full p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white"
                                placeholder="e.g. Peace Law Firm"
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

                         {/* Services / Tags Edit */}
                         <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-ar-accent mb-1">Services (Tags)</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.services && formData.services.map((service, index) => (
                                    <span key={index} className="px-3 py-1 bg-ar-bg dark:bg-gray-700 rounded-full text-sm text-ar-text dark:text-white border border-gray-200 dark:border-gray-600 flex items-center gap-1">
                                        {service}
                                        <button 
                                            type="button"
                                            onClick={() => removeService(index)}
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
                                    value={newServiceInput}
                                    onChange={e => setNewServiceInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addService();
                                        }
                                    }}
                                    className="flex-1 p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white"
                                    placeholder="Add a service tag (e.g. Probate)..."
                                />
                                <button 
                                    type="button"
                                    onClick={addService}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-ar-text dark:text-white font-medium"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Rating Edit */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-ar-accent mb-1">Rating (Click stars to set)</label>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({...formData, rating: star})}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star 
                                            size={28} 
                                            className={(formData.rating || 0) >= star ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"} 
                                            fill={(formData.rating || 0) >= star ? "currentColor" : "none"}
                                        />
                                    </button>
                                ))}
                                <span className="ml-2 text-sm text-ar-text dark:text-white font-medium">
                                    {(formData.rating || 0).toFixed(1)} / 5.0
                                </span>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-ar-accent mb-1">Bio</label>
                            <textarea 
                                rows={4}
                                value={formData.bio}
                                onChange={e => setFormData({...formData, bio: e.target.value})}
                                className="w-full p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white resize-none"
                                placeholder="Short description..."
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
                            <Save size={18} /> {editId ? 'Update Professional' : 'Save Professional'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      );
  }

  if (selectedProf) {
    return (
      <div className="animate-in fade-in slide-in-from-right duration-300 relative">
        {renderFormModal()}
        {renderDeleteModal()}
        {renderReviewModal()}

        <button 
          onClick={() => setSelectedProf(null)} 
          className="flex items-center gap-2 text-ar-taupe hover:text-ar-text dark:hover:text-white mb-6 font-medium"
        >
          <ArrowLeft size={20} /> Back to Directory
        </button>

        <div className="bg-white dark:bg-ar-dark-card rounded-2xl shadow-lg overflow-hidden border border-ar-beige dark:border-gray-700 relative">
           <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button
                onClick={() => openEditForm(selectedProf)}
                className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white rounded-full transition-colors"
                title="Edit Professional"
              >
                 <Pencil size={20} />
              </button>
              <button 
                onClick={() => setProfToDelete(selectedProf.id)}
                className="p-2 bg-white/20 backdrop-blur-sm hover:bg-red-500 hover:text-white text-white rounded-full transition-colors"
                title="Delete Professional"
              >
                 <Trash2 size={20} />
              </button>
           </div>

          <div className="h-32 bg-gradient-to-r from-ar-taupe to-ar-beige"></div>
          <div className="px-8 pb-8 relative">
            <div className="relative -mt-16 mb-6">
              <img 
                src={selectedProf.profileImage} 
                alt={selectedProf.fullName} 
                className="w-32 h-32 rounded-full border-4 border-white dark:border-ar-dark-card shadow-md object-cover bg-white"
              />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-ar-text dark:text-ar-dark-text">{selectedProf.fullName}</h1>
                <p className="text-lg text-ar-accent">{selectedProf.role} at {selectedProf.businessName}</p>
                <div className="flex items-center gap-1 mt-2 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < Math.floor(selectedProf.rating) ? "currentColor" : "none"} />
                    ))}
                    <span className="text-ar-accent dark:text-ar-dark-accent text-sm ml-2">({selectedProf.reviewCount} reviews)</span>
                </div>
              </div>
              <div className="flex gap-3">
                  <a 
                    href={`mailto:${selectedProf.email}`}
                    className="px-6 py-2 bg-ar-taupe text-white rounded-lg hover:bg-opacity-90 transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Mail size={18} /> Email
                  </a>
                  <button 
                    onClick={() => setIsReviewModalOpen(true)}
                    className="px-6 py-2 border border-ar-taupe text-ar-taupe dark:text-ar-beige dark:border-ar-beige rounded-lg hover:bg-ar-bg dark:hover:bg-gray-700 transition flex items-center justify-center gap-2"
                  >
                      <Star size={18} /> Write Review
                  </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              <div className="md:col-span-2 space-y-8">
                <section>
                    <h3 className="text-xl font-semibold mb-4 text-ar-text dark:text-ar-dark-text">About</h3>
                    <p className="text-ar-accent dark:text-ar-dark-accent leading-relaxed">{selectedProf.bio || "No biography available."}</p>
                </section>

                <section>
                    <h3 className="text-xl font-semibold mb-4 text-ar-text dark:text-ar-dark-text">Services</h3>
                    <div className="flex flex-wrap gap-2">
                        {selectedProf.services.map(s => (
                            <span key={s} className="px-3 py-1 bg-ar-bg dark:bg-gray-700 rounded-full text-sm text-ar-text dark:text-ar-dark-text border border-gray-200 dark:border-gray-600">{s}</span>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-semibold mb-4 text-ar-text dark:text-ar-dark-text">Certifications</h3>
                    <ul className="space-y-2">
                         {selectedProf.certifications.length > 0 ? selectedProf.certifications.map(c => (
                            <li key={c} className="flex items-center gap-2 text-ar-accent dark:text-ar-dark-text">
                                <Award size={16} className="text-ar-gold" /> {c}
                            </li>
                        )) : <li className="text-ar-accent italic">No certifications listed.</li>}
                    </ul>
                </section>

                {/* Reviews Section */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-ar-text dark:text-ar-dark-text">Client Reviews</h3>
                        <button onClick={() => setIsReviewModalOpen(true)} className="text-ar-taupe text-sm hover:underline font-medium">
                            Write a Review
                        </button>
                    </div>
                    <div className="space-y-4">
                        {selectedProf.reviews && selectedProf.reviews.length > 0 ? (
                            selectedProf.reviews.map(review => (
                                <div key={review.id} className="bg-ar-bg dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="font-medium text-ar-text dark:text-white">{review.author}</span>
                                            <span className="text-xs text-ar-accent ml-2">{review.date}</span>
                                        </div>
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-ar-accent dark:text-ar-dark-accent italic">"{review.text}"</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 bg-ar-bg dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                <p className="text-ar-accent">No reviews yet.</p>
                            </div>
                        )}
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
                                <p className="font-medium text-ar-text dark:text-ar-dark-text">{selectedProf.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail size={18} className="text-ar-taupe mt-1" />
                            <div>
                                <p className="text-sm text-ar-accent">Email</p>
                                <p className="font-medium text-ar-text dark:text-ar-dark-text break-all">{selectedProf.email}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin size={18} className="text-ar-taupe mt-1" />
                            <div>
                                <p className="text-sm text-ar-accent">Address</p>
                                <p className="font-medium text-ar-text dark:text-ar-dark-text">{selectedProf.address}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Briefcase size={18} className="text-ar-taupe mt-1" />
                            <div>
                                <p className="text-sm text-ar-accent">Availability</p>
                                <p className="font-medium text-ar-text dark:text-ar-dark-text">{selectedProf.availability}</p>
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
      {renderRoleManagerModal()}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-ar-text dark:text-ar-dark-text">Professional Directory</h1>
        <div className="flex gap-2 w-full md:w-auto">
            <button 
                onClick={openAddForm}
                className="px-4 py-2 bg-ar-taupe text-white rounded-lg hover:bg-opacity-90 transition flex items-center gap-2 shadow-md whitespace-nowrap"
            >
                <Plus size={18} /> Add Provider
            </button>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
                <select 
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-2 py-1 bg-transparent text-ar-text dark:text-ar-dark-text focus:outline-none"
                >
                    <option value="All">All Roles</option>
                    {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
                <button 
                    onClick={() => setIsRoleManagerOpen(true)}
                    className="p-2 text-gray-500 hover:text-ar-taupe dark:text-gray-400 dark:hover:text-white rounded transition-colors"
                    title="Manage Roles"
                >
                    <SettingsIcon size={18} />
                </button>
            </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by name, business, or location..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-ar-dark-card text-ar-text dark:text-ar-dark-text focus:outline-none focus:ring-2 focus:ring-ar-taupe shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfs.map((prof) => (
          <div 
            key={prof.id} 
            onClick={() => setSelectedProf(prof)}
            className="bg-white dark:bg-ar-dark-card rounded-xl p-6 shadow-sm border border-ar-beige dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer group relative"
          >
             <button
                onClick={(e) => {
                    e.stopPropagation();
                    setProfToDelete(prof.id);
                }}
                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 transition-colors z-10 opacity-0 group-hover:opacity-100"
                title="Delete"
             >
                 <Trash2 size={18} />
             </button>

            <div className="flex items-center gap-4 mb-4">
              <img src={prof.profileImage} alt={prof.fullName} className="w-16 h-16 rounded-full object-cover bg-gray-100" />
              <div>
                <h3 className="font-bold text-lg text-ar-text dark:text-ar-dark-text group-hover:text-ar-taupe transition-colors">{prof.fullName}</h3>
                <p className="text-sm text-ar-accent">{prof.role}</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
               <p className="flex items-center gap-2 text-sm text-ar-accent dark:text-ar-dark-accent">
                  <MapPin size={16} /> {prof.address.split(',')[0]}
               </p>
               <p className="flex items-center gap-2 text-sm text-ar-accent dark:text-ar-dark-accent">
                  <Star size={16} className="text-yellow-500" fill="currentColor" /> {prof.rating} ({prof.reviewCount})
               </p>
            </div>
            <div className="flex flex-wrap gap-1">
                {prof.services.slice(0, 2).map(s => (
                    <span key={s} className="text-xs px-2 py-1 bg-ar-bg dark:bg-gray-700 rounded text-ar-accent dark:text-ar-dark-accent">{s}</span>
                ))}
                {prof.services.length > 2 && <span className="text-xs px-2 py-1 bg-ar-bg dark:bg-gray-700 rounded text-ar-accent dark:text-ar-dark-accent">+{prof.services.length - 2} more</span>}
            </div>
          </div>
        ))}
      </div>
      
      {filteredProfs.length === 0 && (
         <div className="text-center py-12 text-ar-accent">No professionals found matching your criteria.</div>
      )}
    </div>
  );
};
