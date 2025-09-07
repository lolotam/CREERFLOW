'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Save, RotateCcw, Monitor, Smartphone, Tablet, RefreshCw } from 'lucide-react';

interface BackgroundConfig {
  page: string;
  pageName: string;
  desktop: string;
  tablet: string;
  mobile: string;
  type: 'solid' | 'gradient';
  direction?: 'to right' | 'to bottom' | 'to top right' | 'to bottom right';
}

const defaultPresets = [
  { name: 'Dark', primary: '#000000', secondary: '#1a1a1a' },
  { name: 'Blue Night', primary: '#0f172a', secondary: '#1e293b' },
  { name: 'Purple Dream', primary: '#581c87', secondary: '#7c3aed' },
  { name: 'Ocean', primary: '#0c4a6e', secondary: '#0369a1' },
  { name: 'Forest', primary: '#14532d', secondary: '#16a34a' },
  { name: 'Sunset', primary: '#9a3412', secondary: '#ea580c' },
  { name: 'Rose', primary: '#881337', secondary: '#e11d48' },
  { name: 'Amber', primary: '#92400e', secondary: '#f59e0b' },
];

export default function BackgroundColorManagement() {
  const [backgrounds, setBackgrounds] = useState<BackgroundConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const fetchBackgrounds = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/backgrounds');
      const result = await response.json();
      
      if (result.success) {
        setBackgrounds(result.data);
      } else {
        setError(result.message || 'Failed to fetch background settings');
      }
    } catch (err) {
      setError('Failed to fetch background settings');
      console.error('Error fetching backgrounds:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackgrounds();
  }, []);

  const handleSave = async (page: string, config: Partial<BackgroundConfig>) => {
    try {
      setSaveLoading(page);
      
      const response = await fetch('/api/backgrounds', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page,
          ...config
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setBackgrounds(backgrounds =>
          backgrounds.map(bg =>
            bg.page === page ? { ...bg, ...config } : bg
          )
        );
        alert('Background settings saved successfully!');
      } else {
        alert(result.message || 'Failed to save background settings');
      }
    } catch (error) {
      console.error('Error saving background:', error);
      alert('Failed to save background settings');
    } finally {
      setSaveLoading(null);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all background settings to default? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/backgrounds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reset' }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setBackgrounds(result.data);
        alert('Background settings reset to defaults!');
      } else {
        alert(result.message || 'Failed to reset background settings');
      }
    } catch (error) {
      console.error('Error resetting backgrounds:', error);
      alert('Failed to reset background settings');
    }
  };

  const applyPreset = (bg: BackgroundConfig, preset: typeof defaultPresets[0]) => {
    const newConfig = {
      desktop: `linear-gradient(to right, ${preset.primary}, ${preset.secondary})`,
      tablet: `linear-gradient(to right, ${preset.primary}, ${preset.secondary})`,
      mobile: `linear-gradient(to bottom, ${preset.primary}, ${preset.secondary})`,
      type: 'gradient' as const,
      direction: 'to right' as const
    };
    
    handleSave(bg.page, newConfig);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Background Color Management</h2>
          <p className="text-gray-400">Customize page backgrounds with gradients and solid colors</p>
        </div>
        
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchBackgrounds}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </motion.button>
        </div>
      </div>

      {/* Preview Device Selector */}
      <div className="flex items-center space-x-4 mb-6">
        <span className="text-white font-medium">Preview for:</span>
        {[
          { id: 'desktop', icon: Monitor, label: 'Desktop' },
          { id: 'tablet', icon: Tablet, label: 'Tablet' },
          { id: 'smartphone', icon: Smartphone, label: 'Mobile' }
        ].map(({ id, icon: Icon, label }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPreviewDevice(id as any)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              previewDevice === id
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                : 'bg-white bg-opacity-10 text-gray-400 hover:text-white'
            }`}
          >
            <Icon size={16} />
            <span>{label}</span>
          </motion.button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <p className="text-gray-400">Loading background settings...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-xl p-4 mb-4">
          <p className="text-red-300">{error}</p>
          <button 
            onClick={fetchBackgrounds}
            className="mt-2 text-red-200 hover:text-red-100 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Background Configurations */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {backgrounds.map((bg, index) => (
            <BackgroundEditor
              key={bg.page}
              background={bg}
              index={index}
              previewDevice={previewDevice}
              onSave={handleSave}
              saveLoading={saveLoading === bg.page}
              presets={defaultPresets}
              onApplyPreset={applyPreset}
            />
          ))}
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
              onClick={() => alert('Background changes are applied instantly!')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Changes Applied Live
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              <RotateCcw size={16} />
              <span>Reset All to Defaults</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Background Editor Component
function BackgroundEditor({
  background,
  index,
  previewDevice,
  onSave,
  saveLoading,
  presets,
  onApplyPreset
}: {
  background: BackgroundConfig;
  index: number;
  previewDevice: 'desktop' | 'tablet' | 'mobile';
  onSave: (page: string, config: Partial<BackgroundConfig>) => void;
  saveLoading: boolean;
  presets: typeof defaultPresets;
  onApplyPreset: (bg: BackgroundConfig, preset: typeof defaultPresets[0]) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editConfig, setEditConfig] = useState(background);

  const currentBackground = editConfig[previewDevice];

  const handleSave = () => {
    onSave(background.page, editConfig);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditConfig(background);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card p-6 rounded-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500">
            <Palette size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{background.pageName}</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-purple-500 bg-opacity-20 text-purple-400">
              {background.page}
            </span>
          </div>
        </div>

        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 text-gray-400 hover:text-white"
          >
            <Palette size={16} />
          </motion.button>
        )}
      </div>

      {/* Preview */}
      <div className="mb-4">
        <div
          className={`w-full h-20 rounded-xl ${previewDevice === 'mobile' ? 'h-32' : previewDevice === 'tablet' ? 'h-24' : 'h-20'}`}
          style={{ background: currentBackground }}
        />
        <p className="text-xs text-gray-400 mt-2">Preview for {previewDevice}</p>
      </div>

      {/* Color Presets */}
      {!isEditing && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">Quick presets:</p>
          <div className="grid grid-cols-4 gap-2">
            {presets.map((preset) => (
              <motion.button
                key={preset.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onApplyPreset(background, preset)}
                className="h-8 rounded-lg"
                style={{ background: `linear-gradient(to right, ${preset.primary}, ${preset.secondary})` }}
                title={preset.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Editor */}
      {isEditing && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {previewDevice === 'desktop' ? 'Desktop' : previewDevice === 'tablet' ? 'Tablet' : 'Mobile'} Background
            </label>
            <input
              type="text"
              value={editConfig[previewDevice]}
              onChange={(e) => setEditConfig(prev => ({ ...prev, [previewDevice]: e.target.value }))}
              className="w-full px-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter CSS background value (e.g., linear-gradient(to right, #000, #333))"
            />
          </div>

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
              onClick={handleCancel}
              disabled={saveLoading}
              className="bg-gray-600 hover:bg-gray-700 text-white flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <RotateCcw size={16} />
              <span>Cancel</span>
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
}