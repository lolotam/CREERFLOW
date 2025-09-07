'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Users, Target } from 'lucide-react';

export default function AnalyticsChart() {
  // Mock data for the chart
  const chartData = [
    { month: 'Jan', applications: 120, interviews: 45, hires: 12 },
    { month: 'Feb', applications: 150, interviews: 52, hires: 15 },
    { month: 'Mar', applications: 180, interviews: 68, hires: 18 },
    { month: 'Apr', applications: 165, interviews: 61, hires: 16 },
    { month: 'May', applications: 200, interviews: 75, hires: 22 },
    { month: 'Jun', applications: 220, interviews: 82, hires: 25 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.applications));

  const metrics = [
    {
      title: 'Application Rate',
      value: '+15%',
      description: 'vs last month',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Time to Hire',
      value: '18 days',
      description: 'average',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Interview Rate',
      value: '37%',
      description: 'of applications',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Conversion Rate',
      value: '11%',
      description: 'hire rate',
      icon: Target,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Recruitment Analytics</h2>
          <p className="text-gray-600">Track your hiring performance over time</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Applications</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Interviews</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Hires</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2">
          <div className="h-64 flex items-end justify-between space-x-2">
            {chartData.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center space-y-2">
                {/* Bars */}
                <div className="w-full flex flex-col space-y-1">
                  {/* Applications Bar */}
                  <motion.div
                    className="bg-blue-500 rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.applications / maxValue) * 150}px` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                  
                  {/* Interviews Bar */}
                  <motion.div
                    className="bg-purple-500"
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.interviews / maxValue) * 150}px` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                  />
                  
                  {/* Hires Bar */}
                  <motion.div
                    className="bg-green-500 rounded-b"
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.hires / maxValue) * 150}px` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.4 }}
                  />
                </div>
                
                {/* Month Label */}
                <span className="text-sm text-gray-600 font-medium">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <metric.icon size={20} className={metric.color} />
                <span className={`text-lg font-bold ${metric.color}`}>
                  {metric.value}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">{metric.title}</h4>
                <p className="text-xs text-gray-600">{metric.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
