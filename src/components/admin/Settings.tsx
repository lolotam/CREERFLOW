'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Upload, 
  Trash2, 
  HardDrive, 
  Shield, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  Archive,
  FileText,
  Database
} from 'lucide-react';

interface BackupFile {
  id: string;
  filename: string;
  size: number;
  createdDate: string;
  records: number;
}

export default function Settings() {
  const [backups, setBackups] = useState<BackupFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch backup files
  const fetchBackups = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/backup?action=list');
      const result = await response.json();
      
      if (result.success) {
        setBackups(result.data);
      } else {
        setError(result.message || 'Failed to fetch backups');
      }
    } catch (err) {
      setError('Failed to fetch backups');
      console.error('Error fetching backups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  // Create backup
  const handleCreateBackup = async () => {
    try {
      setCreateLoading(true);
      
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'create' }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchBackups(); // Refresh the list
        alert('Backup created successfully!');
      } else {
        alert(result.message || 'Failed to create backup');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Failed to create backup');
    } finally {
      setCreateLoading(false);
    }
  };

  // Download backup
  const handleDownloadBackup = async (filename: string) => {
    try {
      const response = await fetch(`/api/backup?action=download&filename=${filename}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        const result = await response.json();
        alert(result.message || 'Failed to download backup');
      }
    } catch (error) {
      console.error('Error downloading backup:', error);
      alert('Failed to download backup');
    }
  };

  // Delete backup
  const handleDeleteBackup = async (filename: string) => {
    if (!confirm(`Are you sure you want to delete backup: ${filename}?`)) {
      return;
    }

    try {
      setDeleteLoading(filename);
      
      const response = await fetch(`/api/backup?filename=${filename}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchBackups(); // Refresh the list
        alert('Backup deleted successfully!');
      } else {
        alert(result.message || 'Failed to delete backup');
      }
    } catch (error) {
      console.error('Error deleting backup:', error);
      alert('Failed to delete backup');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Restore backup
  const handleRestoreBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      alert('Please select a ZIP backup file');
      return;
    }

    if (!confirm('Are you sure you want to restore this backup? This will replace all current data!')) {
      return;
    }

    setRestoreLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/backup', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message || 'Backup restored successfully!');
        await fetchBackups(); // Refresh the list
      } else {
        alert(result.message || 'Failed to restore backup');
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      alert('Failed to restore backup');
    } finally {
      setRestoreLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Settings & Backup Management</h2>
          <p className="text-gray-400">Manage system backups and restore data</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchBackups}
          disabled={loading}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </motion.button>
      </div>

      {/* Backup Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Backup */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-xl flex items-center justify-center">
              <Archive size={24} className="text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Create Backup</h3>
              <p className="text-gray-400 text-sm">Generate a complete website backup</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Database size={16} className="text-blue-400" />
                <span className="text-gray-300">Applicant Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText size={16} className="text-purple-400" />
                <span className="text-gray-300">Job Postings</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield size={16} className="text-orange-400" />
                <span className="text-gray-300">Content Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <HardDrive size={16} className="text-red-400" />
                <span className="text-gray-300">System Data</span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateBackup}
            disabled={createLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {createLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Archive size={20} />
            )}
            <span>{createLoading ? 'Creating Backup...' : 'Create Full Backup'}</span>
          </motion.button>
        </motion.div>

        {/* Restore Backup */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-xl flex items-center justify-center">
              <Upload size={24} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Restore Backup</h3>
              <p className="text-gray-400 text-sm">Upload and restore from backup file</p>
            </div>
          </div>

          <div className="mb-4 p-3 bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle size={16} className="text-yellow-400" />
              <span className="text-yellow-300 text-sm">This will replace all current data!</span>
            </div>
          </div>

          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              onChange={handleRestoreBackup}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={restoreLoading}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={restoreLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {restoreLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Upload size={20} />
              )}
              <span>{restoreLoading ? 'Restoring...' : 'Upload & Restore Backup'}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-xl p-4">
          <p className="text-red-300">{error}</p>
          <button 
            onClick={fetchBackups}
            className="mt-2 text-red-200 hover:text-red-100 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Backup Files List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-card p-6 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Backup Files ({backups.length})</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <HardDrive size={16} />
            <span>Stored locally</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
            <p className="text-gray-400">Loading backups...</p>
          </div>
        ) : backups.length === 0 ? (
          <div className="text-center py-12">
            <Archive size={48} className="text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No backups found</p>
            <p className="text-gray-500 text-sm">Create your first backup to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {backups.map((backup, index) => (
              <motion.div
                key={backup.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-xl hover:bg-opacity-10 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Archive size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{backup.filename}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{backup.createdDate}</span>
                      <span>{formatFileSize(backup.size)}</span>
                      <span>{backup.records} records</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownloadBackup(backup.filename)}
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    title="Download Backup"
                  >
                    <Download size={16} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteBackup(backup.filename)}
                    disabled={deleteLoading === backup.filename}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    title="Delete Backup"
                  >
                    {deleteLoading === backup.filename ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* System Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass-card p-6 rounded-2xl"
      >
        <h3 className="text-lg font-bold text-white mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white bg-opacity-5 rounded-lg">
            <div className="text-2xl font-bold text-blue-400 mb-1">ZIP</div>
            <div className="text-sm text-gray-400">Backup Format</div>
          </div>
          <div className="text-center p-4 bg-white bg-opacity-5 rounded-lg">
            <div className="text-2xl font-bold text-green-400 mb-1">{backups.length}</div>
            <div className="text-sm text-gray-400">Available Backups</div>
          </div>
          <div className="text-center p-4 bg-white bg-opacity-5 rounded-lg">
            <div className="text-2xl font-bold text-purple-400 mb-1">Local</div>
            <div className="text-sm text-gray-400">Storage Location</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}