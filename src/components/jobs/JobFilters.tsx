'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Filter, X, ChevronDown } from 'lucide-react';
import { useJobSearch } from './JobSearchProvider';
import { useState, useEffect } from 'react';

interface FilterStats {
  countries: Array<{ value: string; label: string; count: number }>;
  categories: Array<{ value: string; label: string; count: number }>;
  jobTypes: Array<{ value: string; label: string; count: number }>;
  experienceLevels: Array<{ value: string; label: string; count: number }>;
  totalJobs: number;
}

export default function JobFilters() {
  const t = useTranslations('jobs');
  const { state, dispatch, updateURLParams } = useJobSearch();
  const [expandedSections, setExpandedSections] = useState({
    country: true,
    category: true,
    type: true,
    experience: true,
    salary: true,
  });
  const [filterStats, setFilterStats] = useState<FilterStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch filter statistics from API
  useEffect(() => {
    const fetchFilterStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/jobs/stats');
        const result = await response.json();

        if (result.success) {
          setFilterStats(result.data);
          console.log('📊 Filter stats loaded:', result.data);
        } else {
          console.error('Failed to fetch filter stats:', result.message);
        }
      } catch (error) {
        console.error('Error fetching filter stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterStats();
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Use dynamic filter stats or fallback to empty arrays while loading
  const countries = filterStats?.countries || [
    { value: 'Kuwait', label: 'Kuwait', count: 0 },
    { value: 'United Arab Emirates', label: 'United Arab Emirates', count: 0 },
    { value: 'Saudi Arabia', label: 'Saudi Arabia', count: 0 },
    { value: 'Qatar', label: 'Qatar', count: 0 },
  ];

  const categories = filterStats?.categories || [
    { value: 'nursing', label: 'Nursing', count: 0 },
    { value: 'medical', label: 'Medical', count: 0 },
    { value: 'radiology', label: 'Radiology', count: 0 },
    { value: 'pharmacy', label: 'Pharmacy', count: 0 },
    { value: 'dental', label: 'Dental', count: 0 },
    { value: 'therapy', label: 'Therapy', count: 0 },
    { value: 'administration', label: 'Administration', count: 0 },
  ];

  const jobTypes = filterStats?.jobTypes || [
    { value: 'full-time', label: 'Full-time', count: 0 },
    { value: 'part-time', label: 'Part-time', count: 0 },
    { value: 'contract', label: 'Contract', count: 0 },
  ];

  const experienceLevels = filterStats?.experienceLevels || [
    { value: 'entry', label: 'Entry Level', count: 0 },
    { value: 'mid', label: 'Mid Level', count: 0 },
    { value: 'senior', label: 'Senior Level', count: 0 },
  ];

  const handleFilterChange = (key: string, value: string) => {
    const currentValue = state.filters[key as keyof typeof state.filters];
    const newValue = currentValue === value ? '' : value;
    dispatch({ type: 'SET_FILTER', payload: { key, value: newValue } });

    // Update URL parameters
    const updatedFilters = {
      ...state.filters,
      [key]: newValue,
    };
    updateURLParams(updatedFilters);
  };

  const clearAllFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
    // Clear URL parameters
    updateURLParams({
      category: '',
      location: '',
      country: '',
      salary: [0, 200000],
      type: '',
      experience: '',
      search: '',
    });
  };

  const hasActiveFilters = Object.values(state.filters).some(filter => 
    filter !== '' && !(Array.isArray(filter) && filter[0] === 0 && filter[1] === 200000)
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card p-6 rounded-2xl sticky top-24 rtl:text-right"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 rtl:flex-row-reverse">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Filter size={20} style={{ color: 'var(--accent-pink)' }} />
          <h3 className="text-lg font-semibold text-white">{t('filters')}</h3>
        </div>
        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAllFilters}
            className="text-sm hover:text-white flex items-center space-x-1"
            style={{ color: 'var(--accent-pink)' }}
          >
            <X size={16} />
            <span>{t('clearFilters')}</span>
          </motion.button>
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center py-4 mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
          <span className="ml-2 text-sm text-gray-400">{t('loadingFilters')}</span>
        </div>
      )}

      {/* Country Filter */}
      <FilterSection
        title={t('locationFilter')}
        isExpanded={expandedSections.country}
        onToggle={() => toggleSection('country')}
      >
        <div className="space-y-2">
          {countries.map((country) => (
            <FilterOption
              key={country.value}
              label={country.label}
              count={country.count}
              isSelected={state.filters.country === country.value}
              onClick={() => handleFilterChange('country', country.value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Category Filter */}
      <FilterSection
        title={t('categoryFilter')}
        isExpanded={expandedSections.category}
        onToggle={() => toggleSection('category')}
      >
        <div className="space-y-2">
          {categories.map((category) => (
            <FilterOption
              key={category.value}
              label={category.label}
              count={category.count}
              isSelected={state.filters.category === category.value}
              onClick={() => handleFilterChange('category', category.value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Job Type Filter */}
      <FilterSection
        title={t('jobTypeFilter')}
        isExpanded={expandedSections.type}
        onToggle={() => toggleSection('type')}
      >
        <div className="space-y-2">
          {jobTypes.map((type) => (
            <FilterOption
              key={type.value}
              label={type.label}
              count={type.count}
              isSelected={state.filters.type === type.value}
              onClick={() => handleFilterChange('type', type.value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Experience Level Filter */}
      <FilterSection
        title={t('experienceFilter')}
        isExpanded={expandedSections.experience}
        onToggle={() => toggleSection('experience')}
      >
        <div className="space-y-2">
          {experienceLevels.map((level) => (
            <FilterOption
              key={level.value}
              label={level.label}
              count={level.count}
              isSelected={state.filters.experience === level.value}
              onClick={() => handleFilterChange('experience', level.value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Salary Range Filter */}
      <FilterSection
        title={t('salaryFilter')}
        isExpanded={expandedSections.salary}
        onToggle={() => toggleSection('salary')}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>${state.filters.salary[0].toLocaleString()}</span>
            <span>-</span>
            <span>${state.filters.salary[1].toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="0"
            max="200000"
            step="5000"
            value={state.filters.salary[1]}
            onChange={(e) => dispatch({
              type: 'SET_FILTER',
              payload: { key: 'salary', value: [0, parseInt(e.target.value)] }
            })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>$0</span>
            <span>$200k+</span>
          </div>
        </div>
      </FilterSection>
    </motion.div>
  );
}

interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, isExpanded, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0" style={{ borderColor: 'var(--border-primary)' }}>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left py-2"
      >
        <h4 className="font-medium text-white">{title}</h4>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-gray-400" />
        </motion.div>
      </button>
      
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pt-2">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

interface FilterOptionProps {
  label: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
}

function FilterOption({ label, count, isSelected, onClick }: FilterOptionProps) {
  return (
    <motion.button
      whileHover={{ x: 2 }}
      onClick={onClick}
      className={`flex items-center justify-between w-full p-2 rounded-lg transition-all duration-200 ${
        isSelected
          ? 'text-black border'
          : 'hover:bg-white hover:bg-opacity-5 text-gray-300'
      }`}
      style={isSelected ? {
        background: 'var(--accent-pink)',
        borderColor: 'var(--accent-pink)'
      } : {}}
    >
      <span className="text-sm">{label}</span>
      <span className={`text-xs px-2 py-1 rounded-full ${
        isSelected
          ? 'bg-black bg-opacity-20 text-black'
          : 'bg-white bg-opacity-10 text-gray-400'
      }`}>
        {count}
      </span>
    </motion.button>
  );
}
