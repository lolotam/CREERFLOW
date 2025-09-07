'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Calendar, Bell, Star } from 'lucide-react';

interface DashboardMockupProps {
  className?: string;
}

export default function DashboardMockup({ className = '' }: DashboardMockupProps) {
  const mockJobs = [
    { title: 'Senior Nurse', company: 'City Hospital', match: 95, status: 'Applied' },
    { title: 'Radiologist', company: 'Medical Center', match: 88, status: 'Interview' },
    { title: 'Pharmacist', company: 'Health Clinic', match: 92, status: 'Pending' },
  ];

  const mockStats = [
    { label: 'Applications', value: 12, icon: BarChart3, color: 'text-blue-500' },
    { label: 'Interviews', value: 3, icon: Calendar, color: 'text-green-500' },
    { label: 'Profile Views', value: 47, icon: Users, color: 'text-purple-500' },
    { label: 'Match Rate', value: '94%', icon: TrendingUp, color: 'text-orange-500' },
  ];

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-xl ${className}`}>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h3 className="text-xl font-bold text-gray-900">Career Dashboard</h3>
          <p className="text-gray-600 text-sm">Welcome back, Sarah!</p>
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-3 h-3 bg-green-500 rounded-full"
        />
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        {mockStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className="bg-gray-50 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
              <stat.icon size={24} className={stat.color} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Chart Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6"
      >
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Application Activity</h4>
        <div className="flex items-end justify-between h-20">
          {[40, 70, 45, 80, 60, 90, 55].map((height, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.8, delay: 0.1 * index }}
              className="bg-gradient-to-t from-blue-500 to-purple-500 w-6 rounded-t-sm"
            />
          ))}
        </div>
      </motion.div>

      {/* Recent Jobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Applications</h4>
        <div className="space-y-3">
          {mockJobs.map((job, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{job.title}</p>
                <p className="text-xs text-gray-600">{job.company}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star size={12} className="text-yellow-500" />
                  <span className="text-xs font-medium">{job.match}%</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  job.status === 'Applied' ? 'bg-blue-100 text-blue-700' :
                  job.status === 'Interview' ? 'bg-green-100 text-green-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {job.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating Notification */}
      <motion.div
        initial={{ opacity: 0, scale: 0, x: 20, y: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute -top-2 -right-2 bg-blue-500 text-white p-2 rounded-lg shadow-lg"
      >
        <div className="flex items-center space-x-2 text-sm">
          <Bell size={14} />
          <span>New match!</span>
        </div>
      </motion.div>
    </div>
  );
}
