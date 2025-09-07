'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';

interface SalaryRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

export default function SalaryRangeSlider({
  min = 0,
  max = 200000,
  step = 5000,
  value,
  onChange,
  className = ''
}: SalaryRangeSliderProps) {
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const formatSalary = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const handleMinChange = (newMin: number) => {
    const clampedMin = Math.max(min, Math.min(newMin, localValue[1] - step));
    const newValue: [number, number] = [clampedMin, localValue[1]];
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleMaxChange = (newMax: number) => {
    const clampedMax = Math.min(max, Math.max(newMax, localValue[0] + step));
    const newValue: [number, number] = [localValue[0], clampedMax];
    setLocalValue(newValue);
    onChange(newValue);
  };

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const minPercentage = getPercentage(localValue[0]);
  const maxPercentage = getPercentage(localValue[1]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Value Display */}
      <div className="flex items-center justify-between">
        <motion.div
          animate={{ scale: isDragging === 'min' ? 1.1 : 1 }}
          className="flex items-center space-x-1"
        >
          <DollarSign size={16} className="text-green-600" />
          <span className="font-semibold text-gray-900">
            {formatSalary(localValue[0])}
          </span>
        </motion.div>
        
        <div className="text-gray-500">to</div>
        
        <motion.div
          animate={{ scale: isDragging === 'max' ? 1.1 : 1 }}
          className="flex items-center space-x-1"
        >
          <DollarSign size={16} className="text-green-600" />
          <span className="font-semibold text-gray-900">
            {localValue[1] >= max ? `${formatSalary(max)}+` : formatSalary(localValue[1])}
          </span>
        </motion.div>
      </div>

      {/* Slider Container */}
      <div className="relative h-6 flex items-center">
        {/* Track */}
        <div className="absolute w-full h-2 bg-gray-200 rounded-full">
          {/* Active Range */}
          <motion.div
            className="absolute h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`
            }}
            animate={{
              boxShadow: isDragging ? '0 0 20px rgba(59, 130, 246, 0.5)' : '0 0 0px rgba(59, 130, 246, 0)'
            }}
          />
        </div>

        {/* Min Thumb */}
        <motion.div
          className="absolute w-6 h-6 bg-white border-2 border-blue-500 rounded-full cursor-pointer shadow-lg z-10"
          style={{ left: `calc(${minPercentage}% - 12px)` }}
          whileHover={{ scale: 1.2 }}
          whileDrag={{ scale: 1.3 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          onDragStart={() => setIsDragging('min')}
          onDragEnd={() => setIsDragging(null)}
          onDrag={(_, info) => {
            const rect = (info.point.x - info.offset.x) / window.innerWidth;
            const newValue = min + (rect * (max - min));
            handleMinChange(Math.round(newValue / step) * step);
          }}
          animate={{
            borderColor: isDragging === 'min' ? '#3b82f6' : '#6b7280',
            boxShadow: isDragging === 'min' ? '0 0 20px rgba(59, 130, 246, 0.5)' : '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isDragging === 'min' ? 1 : 0,
              y: isDragging === 'min' ? -40 : -30
            }}
            className="absolute left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
          >
            {formatSalary(localValue[0])}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </motion.div>
        </motion.div>

        {/* Max Thumb */}
        <motion.div
          className="absolute w-6 h-6 bg-white border-2 border-purple-500 rounded-full cursor-pointer shadow-lg z-10"
          style={{ left: `calc(${maxPercentage}% - 12px)` }}
          whileHover={{ scale: 1.2 }}
          whileDrag={{ scale: 1.3 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          onDragStart={() => setIsDragging('max')}
          onDragEnd={() => setIsDragging(null)}
          onDrag={(_, info) => {
            const rect = (info.point.x - info.offset.x) / window.innerWidth;
            const newValue = min + (rect * (max - min));
            handleMaxChange(Math.round(newValue / step) * step);
          }}
          animate={{
            borderColor: isDragging === 'max' ? '#8b5cf6' : '#6b7280',
            boxShadow: isDragging === 'max' ? '0 0 20px rgba(139, 92, 246, 0.5)' : '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isDragging === 'max' ? 1 : 0,
              y: isDragging === 'max' ? -40 : -30
            }}
            className="absolute left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
          >
            {localValue[1] >= max ? `${formatSalary(max)}+` : formatSalary(localValue[1])}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </motion.div>
        </motion.div>
      </div>

      {/* Range Labels */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatSalary(min)}</span>
        <span>{formatSalary(max)}+</span>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Entry', range: [30000, 50000] as [number, number] },
          { label: 'Mid', range: [50000, 80000] as [number, number] },
          { label: 'Senior', range: [80000, 120000] as [number, number] },
          { label: 'Executive', range: [120000, 200000] as [number, number] },
        ].map((preset) => (
          <motion.button
            key={preset.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(preset.range)}
            className={`text-xs px-3 py-1 rounded-full border transition-all duration-200 ${
              localValue[0] === preset.range[0] && localValue[1] === preset.range[1]
                ? 'bg-blue-100 border-blue-500 text-blue-700'
                : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {preset.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
