'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, TrendingUp, Clock, Search, Filter, Download, Plus, Settings, BarChart3, Briefcase, LogOut, User, Palette, Mail, MessageSquare } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import StatsCards from './StatsCards';
import ApplicantsTable from './ApplicantsTable';
import AnalyticsChart from './AnalyticsChart';
import JobManagement from './JobManagement';
import ContentManagement from './ContentManagement';
import BackgroundColorManagement from './BackgroundColorManagement';
import SettingsComponent from './Settings';
import EmailSubscribersManagement from './EmailSubscribersManagement';
import ContactMessagesManagement from './ContactMessagesManagement';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { user, logout } = useAdminAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleExportApplications = async () => {
    try {
      const response = await fetch('/api/applications/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `applications-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        alert('Applications exported successfully!');
      } else {
        const result = await response.json();
        alert(result.message || 'Failed to export applications');
      }
    } catch (error) {
      console.error('Error exporting applications:', error);
      alert('Failed to export applications');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'applicants', label: 'Applicants', icon: Users },
    { id: 'jobs', label: 'Job Management', icon: Briefcase },
    { id: 'subscribers', label: 'Email Subscribers', icon: Mail },
    { id: 'messages', label: 'Contact Messages', icon: MessageSquare },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'backgrounds', label: 'Backgrounds', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const stats = [
    {
      title: 'Total Applications',
      value: '1,247',
      change: '+12%',
      trend: 'up' as const,
      icon: FileText,
      color: 'blue' as const
    },
    {
      title: 'Active Candidates',
      value: '892',
      change: '+8%',
      trend: 'up' as const,
      icon: Users,
      color: 'green' as const
    },
    {
      title: 'Interviews Scheduled',
      value: '156',
      change: '+24%',
      trend: 'up' as const,
      icon: Clock,
      color: 'purple' as const
    },
    {
      title: 'Hire Rate',
      value: '23%',
      change: '+3%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'orange' as const
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <StatsCards stats={stats} />
            <AnalyticsChart />
            <ApplicantsTable searchTerm={searchTerm} filterStatus={filterStatus} />
          </>
        );
      case 'applicants':
        return <ApplicantsTable searchTerm={searchTerm} filterStatus={filterStatus} />;
      case 'jobs':
        return <JobManagement />;
      case 'subscribers':
        return <EmailSubscribersManagement />;
      case 'messages':
        return <ContactMessagesManagement />;
      case 'content':
        return <ContentManagement />;
      case 'backgrounds':
        return <BackgroundColorManagement />;
      case 'settings':
        return <SettingsComponent />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rtl:text-right">
      <div className="container mx-auto px-4 pt-28 pb-6">
        <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
      >
        <div className="flex justify-between items-center rtl:flex-row-reverse">
          <div className="rtl:text-right">
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent rtl:text-right">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 text-lg rtl:text-right">Manage applications and track recruitment analytics</p>
          </div>

          {/* Admin User Info & Logout */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse rtl:flex-row-reverse">
            <div className="flex items-center space-x-3 rtl:space-x-reverse rtl:flex-row-reverse bg-white bg-opacity-10 px-4 py-2 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="rtl:text-right">
                <p className="text-white font-medium rtl:text-right">Welcome back!</p>
                <p className="text-gray-300 text-sm rtl:text-right">{user?.username}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center space-x-2 rtl:space-x-reverse rtl:flex-row-reverse bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-lg"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex space-x-1 rtl:space-x-reverse rtl:flex-row-reverse bg-white/10 backdrop-blur-lg p-1 rounded-2xl border border-white/20">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center space-x-2 rtl:space-x-reverse rtl:flex-row-reverse px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-black shadow-lg'
                  : 'text-white hover:text-black hover:bg-white hover:bg-opacity-10'
              }`}
              style={activeTab === tab.id ? { background: 'var(--gradient-primary)' } : {}}
            >
              <tab.icon size={20} />
              <span className="rtl:text-right">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl border-2 border-white border-opacity-30"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Search and Filter Controls (for applicants tab) */}
      {activeTab === 'applicants' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search applicants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 w-full"
                style={{ '--tw-ring-color': 'var(--accent-pink)' } as React.CSSProperties}
              />
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300"
              style={{ '--tw-ring-color': 'var(--accent-pink)' } as React.CSSProperties}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="interview">Interview</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Export */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportApplications}
              className="btn-primary px-6 py-3 flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Export</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
        </div>
      </div>
    </div>
  );
}
