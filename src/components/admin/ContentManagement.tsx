'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Save, X, Image, Type, Layout, Globe, RefreshCw, Download, RotateCcw } from 'lucide-react';

interface ContentSection {
  id: string;
  title: string;
  type: 'text' | 'image' | 'hero' | 'stats';
  content: string;
  isEditing: boolean;
}

export default function ContentManagement() {
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState<string | null>(null);

  // Fetch content from API
  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/content');
      const result = await response.json();
      
      if (result.success) {
        setContentSections(result.data.map((section: any) => ({
          ...section,
          isEditing: false
        })));
      } else {
        setError(result.message || 'Failed to fetch content');
      }
    } catch (err) {
      setError('Failed to fetch content');
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleEdit = (id: string) => {
    setContentSections(sections =>
      sections.map(section =>
        section.id === id ? { ...section, isEditing: true } : section
      )
    );
  };

  const handleSave = async (id: string, newContent: string) => {
    try {
      setSaveLoading(id);
      
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sectionId: id,
          content: newContent
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setContentSections(sections =>
          sections.map(section =>
            section.id === id 
              ? { ...section, content: newContent, isEditing: false }
              : section
          )
        );
        alert('Content saved successfully!');
      } else {
        alert(result.message || 'Failed to save content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save content');
    } finally {
      setSaveLoading(null);
    }
  };

  const handleCancel = (id: string) => {
    setContentSections(sections =>
      sections.map(section =>
        section.id === id ? { ...section, isEditing: false } : section
      )
    );
  };

  const handleBackup = async () => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'backup' }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Content backed up successfully!');
      } else {
        alert(result.message || 'Failed to backup content');
      }
    } catch (error) {
      console.error('Error backing up content:', error);
      alert('Failed to backup content');
    }
  };

  const handleRestore = async () => {
    if (!confirm('Are you sure you want to restore content to defaults? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'restore' }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setContentSections(result.data.map((section: any) => ({
          ...section,
          isEditing: false
        })));
        alert('Content restored to defaults!');
      } else {
        alert(result.message || 'Failed to restore content');
      }
    } catch (error) {
      console.error('Error restoring content:', error);
      alert('Failed to restore content');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return Type;
      case 'image':
        return Image;
      case 'hero':
        return Layout;
      case 'stats':
        return Globe;
      default:
        return Type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'text':
        return '#3b82f6'; // blue
      case 'image':
        return '#10b981'; // green
      case 'hero':
        return '#ec4899'; // pink
      case 'stats':
        return '#8b5cf6'; // purple
      default:
        return '#3b82f6'; // blue
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Content Management</h2>
          <p className="text-gray-400">Edit website content and copy ({contentSections.length} sections)</p>
        </div>
        
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchContent}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </motion.button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <p className="text-gray-400">Loading content...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-xl p-4 mb-4">
          <p className="text-red-300">{error}</p>
          <button 
            onClick={fetchContent}
            className="mt-2 text-red-200 hover:text-red-100 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Content Sections */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {contentSections.map((section, index) => {
            const IconComponent = getTypeIcon(section.type);
            const typeColor = getTypeColor(section.type);
            
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: typeColor + '20' }}
                    >
                      <IconComponent 
                        size={20} 
                        style={{ color: typeColor }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{section.title}</h3>
                      <span 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: typeColor + '20',
                          color: typeColor
                        }}
                      >
                        {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                      </span>
                    </div>
                  </div>

                  {!section.isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(section.id)}
                      className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 text-gray-400 hover:text-white"
                    >
                      <Edit size={16} />
                    </motion.button>
                  )}
                </div>

                {/* Content Display/Edit */}
                {section.isEditing ? (
                  <EditableContent
                    section={section}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    saveLoading={saveLoading === section.id}
                  />
                ) : (
                  <ContentDisplay section={section} />
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Global Actions */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card p-6 rounded-2xl"
        >
          <h3 className="text-lg font-bold text-white mb-4">Global Actions</h3>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert('Content changes are automatically saved!')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              All Changes Saved
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackup}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Backup Content</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRestore}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              <RotateCcw size={16} />
              <span>Restore Defaults</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Content Display Component
function ContentDisplay({ section }: { section: ContentSection }) {
  if (section.type === 'stats') {
    try {
      const stats = JSON.parse(section.content);
      return (
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-lg font-bold text-white">{value as string}</div>
              <div className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
            </div>
          ))}
        </div>
      );
    } catch {
      return <p className="text-red-400">Invalid JSON format</p>;
    }
  }

  return (
    <div className="bg-white bg-opacity-5 rounded-xl p-4">
      <p className="text-white whitespace-pre-wrap">{section.content}</p>
    </div>
  );
}

// Editable Content Component
function EditableContent({ 
  section, 
  onSave, 
  onCancel,
  saveLoading
}: { 
  section: ContentSection;
  onSave: (id: string, content: string) => void;
  onCancel: (id: string) => void;
  saveLoading: boolean;
}) {
  const [editContent, setEditContent] = useState(section.content);

  const handleSave = () => {
    onSave(section.id, editContent);
  };

  return (
    <div className="space-y-4">
      {section.type === 'stats' ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 font-mono text-sm rtl:text-right"
          style={{ color: '#000000 !important' }}
          placeholder='Enter JSON format for stats (e.g., {"totalJobs": "2,500+", "companies": "150+"})'
        />
      ) : (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          rows={section.type === 'hero' ? 2 : 4}
          className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 rtl:text-right"
          style={{ color: '#000000 !important' }}
          placeholder={`Enter ${section.type === 'hero' ? 'hero section' : 'content'} text...`}
        />
      )}

      <div className="flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saveLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {saveLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Save size={16} />
          )}
          <span>{saveLoading ? 'Saving...' : 'Save'}</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCancel(section.id)}
          disabled={saveLoading}
          className="bg-gray-600 hover:bg-gray-700 text-white flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <X size={16} />
          <span>Cancel</span>
        </motion.button>
      </div>
    </div>
  );
}