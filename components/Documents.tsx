import React, { useState, useRef } from 'react';
import { MOCK_DOCUMENTS } from '../constants';
import { DocumentItem } from '../types';
import { FileText, Upload, Download, Trash2, Folder, X, AlertTriangle, Eye, Filter, FilterX } from 'lucide-react';

export const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>(MOCK_DOCUMENTS);
  const [isUploading, setIsUploading] = useState(false);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Upload Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<'Essential' | 'Financial' | 'Personal'>('Essential');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDocuments = filterCategory === 'All' 
    ? documents 
    : documents.filter(d => d.category === filterCategory);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const newDoc: DocumentItem = {
      id: Date.now().toString(),
      name: selectedFile.name,
      type: selectedFile.name.split('.').pop()?.toUpperCase() || 'FILE',
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`, // Simple mock size conversion
      category: category
    };

    // For mock purposes, ensure size isn't "0.0 MB" for small files
    if (newDoc.size === "0.0 MB") newDoc.size = "< 0.1 MB";

    setDocuments([newDoc, ...documents]);
    resetUploadForm();
  };

  const resetUploadForm = () => {
    setSelectedFile(null);
    setCategory('Essential');
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const confirmDelete = () => {
    if (docToDelete) {
      setDocuments(documents.filter(d => d.id !== docToDelete));
      setDocToDelete(null);
      if (previewDoc?.id === docToDelete) {
        setPreviewDoc(null);
      }
    }
  };

  const handleDownload = (doc: DocumentItem) => {
    // Simulating download by creating a temporary blob
    const textContent = `This is a placeholder content for the file: ${doc.name}\n\nCategory: ${doc.category}\nUpload Date: ${doc.uploadDate}`;
    const element = document.createElement("a");
    const file = new Blob([textContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = doc.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderDeleteModal = () => {
    if (!docToDelete) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-ar-dark-card rounded-2xl p-6 max-w-sm w-full shadow-xl border border-ar-beige dark:border-gray-700">
                <div className="flex items-center gap-3 text-red-500 mb-4">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                      <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-ar-text dark:text-ar-dark-text">Delete Document?</h3>
                </div>
                <p className="text-ar-accent dark:text-ar-dark-accent mb-6">
                    Are you sure you want to permanently remove this file? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button 
                      onClick={() => setDocToDelete(null)}
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

  const renderPreviewModal = () => {
    if (!previewDoc) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-ar-dark-card rounded-2xl w-full max-w-4xl h-[80vh] shadow-xl border border-ar-beige dark:border-gray-700 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-ar-beige dark:border-gray-700 flex justify-between items-center bg-white dark:bg-ar-dark-card">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-ar-bg dark:bg-gray-700 rounded text-ar-taupe">
                             <FileText size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-ar-text dark:text-ar-dark-text">{previewDoc.name}</h2>
                             <p className="text-xs text-ar-accent">{previewDoc.category} • {previewDoc.size}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleDownload(previewDoc)} 
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-ar-accent transition-colors"
                            title="Download"
                        >
                            <Download size={20} />
                        </button>
                        <button 
                            onClick={() => setPreviewDoc(null)} 
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-ar-accent transition-colors"
                            title="Close"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-8 overflow-auto flex items-center justify-center relative">
                    {/* Mock Preview Content */}
                    {previewDoc.type === 'JPG' || previewDoc.type === 'PNG' || previewDoc.type === 'JPEG' ? (
                        <div className="flex flex-col items-center">
                           <img 
                            src={`https://picsum.photos/seed/${previewDoc.id}/800/600`} 
                            alt={previewDoc.name} 
                            className="max-w-full max-h-[60vh] object-contain shadow-lg rounded-lg bg-white"
                           />
                           <p className="mt-4 text-ar-accent text-sm">Simulated Image Preview</p>
                        </div>
                    ) : previewDoc.type === 'PDF' ? (
                        <div className="bg-white w-full max-w-2xl h-full shadow-lg p-8 flex flex-col gap-4 overflow-hidden rounded-sm border border-gray-200">
                             <div className="flex justify-between items-end border-b pb-4 mb-4">
                                <div className="h-8 bg-gray-200 w-1/3 rounded animate-pulse"></div>
                                <div className="h-4 bg-gray-200 w-1/6 rounded animate-pulse"></div>
                             </div>
                             <div className="space-y-3">
                                 <div className="h-3 bg-gray-200 w-full rounded animate-pulse"></div>
                                 <div className="h-3 bg-gray-200 w-full rounded animate-pulse"></div>
                                 <div className="h-3 bg-gray-200 w-5/6 rounded animate-pulse"></div>
                                 <div className="h-3 bg-gray-200 w-full rounded animate-pulse"></div>
                             </div>
                             <br/>
                             <div className="space-y-3">
                                 <div className="h-3 bg-gray-200 w-full rounded animate-pulse"></div>
                                 <div className="h-3 bg-gray-200 w-4/6 rounded animate-pulse"></div>
                                 <div className="h-3 bg-gray-200 w-5/6 rounded animate-pulse"></div>
                             </div>
                             
                             <div className="mt-auto flex flex-col items-center gap-2 text-gray-400 text-sm">
                                 <FileText size={40} className="opacity-20" />
                                 <span>Simulated PDF Preview</span>
                                 <span>Page 1 of 1</span>
                             </div>
                        </div>
                    ) : (
                         <div className="text-center text-ar-accent">
                             <FileText size={64} className="mx-auto mb-4 opacity-30" />
                             <h3 className="text-lg font-medium mb-1">Preview Unavailable</h3>
                             <p className="text-sm">This file type cannot be previewed directly.</p>
                             <button 
                                onClick={() => handleDownload(previewDoc)}
                                className="mt-4 px-4 py-2 bg-ar-taupe text-white rounded-lg hover:bg-opacity-90 text-sm font-medium inline-flex items-center gap-2"
                             >
                                 <Download size={16} /> Download to View
                             </button>
                         </div>
                    )}
                </div>
            </div>
        </div>
    )
  };

  const renderUploadModal = () => {
    if (!isUploading) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-ar-dark-card rounded-2xl max-w-md w-full shadow-xl border border-ar-beige dark:border-gray-700">
                <div className="p-6 border-b border-ar-beige dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-ar-text dark:text-ar-dark-text">Upload Document</h2>
                    <button onClick={resetUploadForm} className="text-ar-accent hover:text-ar-text dark:hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleUpload} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-ar-accent mb-2">Select File</label>
                        <div 
                            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <Upload className="mx-auto text-ar-taupe mb-2" size={32} />
                            {selectedFile ? (
                                <div>
                                    <p className="font-medium text-ar-text dark:text-ar-dark-text">{selectedFile.name}</p>
                                    <p className="text-xs text-ar-accent">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                </div>
                            ) : (
                                <p className="text-ar-accent text-sm">Click to browse files</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-ar-accent mb-1">Category</label>
                        <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value as any)}
                            className="w-full p-3 rounded-lg bg-ar-bg dark:bg-gray-800 border border-transparent focus:border-ar-taupe focus:ring-0 text-ar-text dark:text-white"
                        >
                            <option value="Essential">Essential</option>
                            <option value="Financial">Financial</option>
                            <option value="Personal">Personal</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button 
                            type="button"
                            onClick={resetUploadForm}
                            className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-ar-text dark:text-ar-dark-text font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={!selectedFile}
                            className="px-6 py-3 rounded-lg bg-ar-taupe text-white font-medium hover:bg-opacity-90 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Upload size={18} /> Upload
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-8 relative">
        {renderDeleteModal()}
        {renderUploadModal()}
        {renderPreviewModal()}

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-ar-text dark:text-ar-dark-text">Document Vault</h1>
                <p className="text-ar-accent dark:text-ar-dark-accent mt-1">Securely store and organize essential paperwork.</p>
            </div>
            <div className="flex gap-2 items-center">
                {filterCategory !== 'All' && (
                    <button 
                        onClick={() => setFilterCategory('All')}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-ar-text dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-2 text-sm"
                    >
                        <FilterX size={16} /> Clear Filter
                    </button>
                )}
                <button 
                    onClick={() => setIsUploading(true)}
                    className="px-6 py-3 bg-ar-taupe text-white rounded-lg hover:bg-opacity-90 transition flex items-center gap-2 shadow-md"
                >
                    <Upload size={20} /> Upload Document
                </button>
            </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Essential', 'Financial', 'Personal'].map((cat) => (
                <div 
                    key={cat} 
                    onClick={() => setFilterCategory(current => current === cat ? 'All' : cat)}
                    className={`
                        p-6 rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer
                        ${filterCategory === cat 
                            ? 'bg-ar-taupe/10 border-ar-taupe dark:bg-ar-taupe/20 dark:border-ar-taupe ring-2 ring-ar-taupe ring-opacity-20' 
                            : 'bg-white dark:bg-ar-dark-card border-ar-beige dark:border-gray-700'}
                    `}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-lg ${filterCategory === cat ? 'bg-ar-taupe text-white' : 'bg-ar-bg dark:bg-gray-700 text-ar-taupe'}`}>
                            {filterCategory === cat ? <Filter size={24} /> : <Folder size={24} />}
                        </div>
                        <span className="text-2xl font-bold text-ar-text dark:text-ar-dark-text">
                            {documents.filter(d => d.category === cat).length}
                        </span>
                    </div>
                    <h3 className="font-semibold text-lg text-ar-text dark:text-ar-dark-text">{cat} Records</h3>
                    <p className="text-sm text-ar-accent mt-1">
                        {filterCategory === cat ? 'Filter Active' : 'View files \u2192'}
                    </p>
                </div>
            ))}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-ar-dark-card rounded-xl border border-ar-beige dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
                <h3 className="font-medium text-ar-text dark:text-ar-dark-text">
                    {filterCategory === 'All' ? 'All Documents' : `${filterCategory} Documents`}
                </h3>
                <span className="text-xs text-ar-accent">Showing {filteredDocuments.length} files</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-ar-bg dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <th className="p-4 text-sm font-semibold text-ar-accent">Name</th>
                            <th className="p-4 text-sm font-semibold text-ar-accent">Category</th>
                            <th className="p-4 text-sm font-semibold text-ar-accent">Date Added</th>
                            <th className="p-4 text-sm font-semibold text-ar-accent">Size</th>
                            <th className="p-4 text-sm font-semibold text-ar-accent text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocuments.map((doc) => (
                            <tr key={doc.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-red-500">
                                            <FileText size={20} />
                                        </div>
                                        <span className="font-medium text-ar-text dark:text-ar-dark-text">{doc.name}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="px-3 py-1 bg-ar-bg dark:bg-gray-700 rounded-full text-xs font-medium text-ar-text dark:text-ar-dark-text">{doc.category}</span>
                                </td>
                                <td className="p-4 text-sm text-ar-accent dark:text-ar-dark-accent">{doc.uploadDate}</td>
                                <td className="p-4 text-sm text-ar-accent dark:text-ar-dark-accent">{doc.size}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => setPreviewDoc(doc)}
                                            className="p-2 text-ar-accent hover:text-ar-taupe hover:bg-ar-bg dark:hover:bg-gray-700 rounded transition"
                                            title="Preview"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDownload(doc)}
                                            className="p-2 text-ar-accent hover:text-ar-taupe hover:bg-ar-bg dark:hover:bg-gray-700 rounded transition"
                                            title="Download"
                                        >
                                            <Download size={18} />
                                        </button>
                                        <button 
                                            onClick={() => setDocToDelete(doc.id)}
                                            className="p-2 text-ar-accent hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredDocuments.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-ar-accent">
                                    {filterCategory === 'All' 
                                        ? "No documents found. Upload one to get started." 
                                        : `No ${filterCategory} documents found.`}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};