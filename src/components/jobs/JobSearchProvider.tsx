'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  salary: string;
  type: 'full-time' | 'part-time' | 'contract';
  category: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  posted: string;
  matchPercentage?: number;
  featured: boolean;
  status: 'active' | 'paused' | 'closed';
  applicants: number;
}

interface JobSearchState {
  jobs: Job[];
  filteredJobs: Job[];
  filters: {
    category: string;
    location: string;
    country: string;
    salary: [number, number];
    type: string;
    experience: string;
    search: string;
  };
  loading: boolean;
  error: string | null;
  totalJobs: number;
  currentPage: number;
}

type JobSearchAction =
  | { type: 'SET_JOBS'; payload: Job[] }
  | { type: 'SET_FILTER'; payload: { key: string; value: any } }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_MORE' }
  | { type: 'RESET_FILTERS' };

const initialState: JobSearchState = {
  jobs: [],
  filteredJobs: [],
  filters: {
    category: '',
    location: '',
    country: '',
    salary: [0, 200000],
    type: '',
    experience: '',
    search: '',
  },
  loading: false,
  error: null,
  totalJobs: 0,
  currentPage: 1,
};

// Helper function to filter jobs based on current filters
function applyFilters(jobs: Job[], filters: JobSearchState['filters']): Job[] {
  console.log('🔍 Applying filters:', {
    totalJobs: jobs.length,
    filters,
    sampleJobs: jobs.slice(0, 3).map(job => ({ id: job.id, title: job.title, category: job.category }))
  });

  return jobs.filter(job => {
    // Search filter
    if (filters.search && !job.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !job.company.toLowerCase().includes(filters.search.toLowerCase()) &&
        !job.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Category filter (case-insensitive)
    if (filters.category && job.category?.toLowerCase() !== filters.category.toLowerCase()) {
      return false;
    }
    
    // Country filter
    if (filters.country && job.country !== filters.country) {
      return false;
    }
    
    // Type filter
    if (filters.type && job.type !== filters.type) {
      return false;
    }
    
    // Experience filter
    if (filters.experience && job.experience !== filters.experience) {
      return false;
    }
    
    // Salary filter - parse salary and check if it's within range
    if (filters.salary && filters.salary[1] < 200000) {
      const salaryMatch = job.salary.match(/(\d{1,3}(?:,\d{3})*)/g);
      if (salaryMatch) {
        const minSalary = parseInt(salaryMatch[0].replace(/,/g, ''));
        const maxSalary = salaryMatch.length > 1 ? parseInt(salaryMatch[1].replace(/,/g, '')) : minSalary;
        
        // Convert to USD if needed (approximate conversions)
        let minUSD = minSalary;
        let maxUSD = maxSalary;
        
        if (job.salary.includes('AED')) {
          minUSD = minSalary * 0.27; // AED to USD
          maxUSD = maxSalary * 0.27;
        } else if (job.salary.includes('SAR')) {
          minUSD = minSalary * 0.27; // SAR to USD
          maxUSD = maxSalary * 0.27;
        } else if (job.salary.includes('KWD')) {
          minUSD = minSalary * 3.25; // KWD to USD
          maxUSD = maxSalary * 3.25;
        } else if (job.salary.includes('QAR')) {
          minUSD = minSalary * 0.27; // QAR to USD
          maxUSD = maxSalary * 0.27;
        }
        
        if (minUSD > filters.salary[1]) {
          return false;
        }
      }
    }
    
    return true;
  });
}

function jobSearchReducer(state: JobSearchState, action: JobSearchAction): JobSearchState {
  switch (action.type) {
    case 'SET_JOBS':
      console.log('🔄 Reducer SET_JOBS received payload with length:', action.payload.length);
      
      // Force simple state update to isolate issues
      return {
        ...state,
        jobs: action.payload,
        filteredJobs: action.payload,
        totalJobs: action.payload.length,
        loading: false,
        error: null,
      };
    
    case 'SET_FILTER':
      const newFilters = {
        ...state.filters,
        [action.payload.key]: action.payload.value,
      };

      console.log('🔄 SET_FILTER action:', {
        key: action.payload.key,
        value: action.payload.value,
        newFilters,
        totalJobsBeforeFilter: state.jobs.length
      });

      const filteredJobs = applyFilters(state.jobs, newFilters);

      console.log('🔄 Filter results:', {
        filteredJobsCount: filteredJobs.length,
        sampleFilteredJobs: filteredJobs.slice(0, 3).map(job => ({ id: job.id, title: job.title, category: job.category }))
      });

      return {
        ...state,
        filters: newFilters,
        filteredJobs,
        totalJobs: filteredJobs.length,
        currentPage: 1,
      };
    
    case 'SET_SEARCH':
      const searchFilters = {
        ...state.filters,
        search: action.payload,
      };
      
      const filteredJobsSearch = applyFilters(state.jobs, searchFilters);
      
      return {
        ...state,
        filters: searchFilters,
        filteredJobs: filteredJobsSearch,
        totalJobs: filteredJobsSearch.length,
        currentPage: 1,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    
    case 'LOAD_MORE':
      return {
        ...state,
        currentPage: state.currentPage + 1,
      };
    
    case 'RESET_FILTERS':
      const resetFilteredJobs = applyFilters(state.jobs, initialState.filters);
      return {
        ...state,
        filters: initialState.filters,
        filteredJobs: resetFilteredJobs,
        totalJobs: resetFilteredJobs.length,
        currentPage: 1,
      };
    
    default:
      return state;
  }
}

const JobSearchContext = createContext<{
  state: JobSearchState;
  dispatch: React.Dispatch<JobSearchAction>;
  fetchJobs: () => void;
  updateURLParams: (filters: JobSearchState['filters']) => void;
} | null>(null);

export function useJobSearch() {
  const context = useContext(JobSearchContext);
  if (!context) {
    throw new Error('useJobSearch must be used within a JobSearchProvider');
  }
  return context;
}

interface JobSearchProviderProps {
  children: ReactNode;
}

export default function JobSearchProvider({ children }: JobSearchProviderProps) {
  const [state, dispatch] = useReducer(jobSearchReducer, initialState);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  console.log('🚀 JobSearchProvider component mounted/rendered');

  const fetchJobs = async () => {
    try {
      console.log('🔄 Starting fetchJobs...');
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Build query parameters based on filters
      const queryParams = new URLSearchParams();
      
      // Only fetch active jobs for public job listings
      queryParams.set('status', 'active');
      queryParams.set('limit', '500'); // Get more jobs for client-side filtering
      
      const url = `/api/jobs?${queryParams.toString()}`;
      console.log('📡 Fetching from:', url);
      
      const response = await fetch(url);
      console.log('📥 Response status:', response.status);
      
      const result = await response.json();
      console.log('📊 API Result:', { 
        success: result.success, 
        dataLength: result.data?.length || 0,
        message: result.message 
      });
      
      if (result.success) {
        // Calculate match percentages for jobs
        const jobsWithMatch = result.data.map((job: Job) => ({
          ...job,
          matchPercentage: job.matchPercentage || Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        }));

        console.log('✅ Dispatching SET_JOBS with', jobsWithMatch.length, 'jobs');
        console.log('📋 Sample job:', jobsWithMatch[0]);
        
        console.log('About to dispatch SET_JOBS with data length:', jobsWithMatch.length);
        dispatch({ type: 'SET_JOBS', payload: jobsWithMatch });
        console.log('SET_JOBS dispatch completed');
      } else {
        console.error('❌ API Error:', result.message);
        dispatch({ type: 'SET_ERROR', payload: result.message || 'Failed to fetch jobs' });
      }
    } catch (error) {
      console.error('💥 Error fetching jobs:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch jobs' });
    }
  };

  // Handle URL parameters and apply filters (only after jobs are loaded)
  useEffect(() => {
    // Only apply URL parameters if we have jobs loaded
    if (state.jobs.length === 0) {
      console.log('🔗 Skipping URL parameter application - no jobs loaded yet');
      return;
    }

    const category = searchParams.get('category');
    console.log('🔗 URL parameters check:', {
      category,
      allParams: Object.fromEntries(searchParams.entries()),
      currentFilters: state.filters,
      jobsLoaded: state.jobs.length
    });

    if (category && state.filters.category !== category) {
      console.log('🔗 URL parameter detected - applying category filter:', category);
      dispatch({ type: 'SET_FILTER', payload: { key: 'category', value: category } });
    }
  }, [searchParams, state.jobs.length]);

  // Function to update URL parameters when filters change
  const updateURLParams = (filters: JobSearchState['filters']) => {
    const params = new URLSearchParams();

    // Only add non-empty filter values to URL
    if (filters.category) params.set('category', filters.category);
    if (filters.country) params.set('country', filters.country);
    if (filters.type) params.set('type', filters.type);
    if (filters.experience) params.set('experience', filters.experience);
    if (filters.search) params.set('search', filters.search);

    // Update URL without triggering navigation
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  };

  // Initial fetch only - filters are applied client-side
  useEffect(() => {
    console.log('🚀 JobSearchProvider useEffect triggered - fetching jobs...');
    fetchJobs();
  }, []);

  return (
    <JobSearchContext.Provider value={{ state, dispatch, fetchJobs, updateURLParams }}>
      {children}
    </JobSearchContext.Provider>
  );
}