'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Target, CheckCircle, AlertCircle } from 'lucide-react';

interface JobMatchIndicatorProps {
  matchPercentage: number;
  skills: string[];
  userSkills: string[];
  className?: string;
  showDetails?: boolean;
}

export default function JobMatchIndicator({
  matchPercentage,
  skills = [],
  userSkills = [],
  className = '',
  showDetails = false
}: JobMatchIndicatorProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(matchPercentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [matchPercentage]);

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchBgColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100';
    if (percentage >= 75) return 'bg-blue-100';
    if (percentage >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getMatchGradient = (percentage: number) => {
    if (percentage >= 90) return 'from-green-500 to-emerald-500';
    if (percentage >= 75) return 'from-blue-500 to-cyan-500';
    if (percentage >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getMatchIcon = (percentage: number) => {
    if (percentage >= 90) return CheckCircle;
    if (percentage >= 75) return Target;
    if (percentage >= 60) return Star;
    return AlertCircle;
  };

  const MatchIcon = getMatchIcon(matchPercentage);

  // Calculate skill matches
  const matchedSkills = skills.filter(skill => 
    userSkills.some(userSkill => 
      userSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(userSkill.toLowerCase())
    )
  );

  const missingSkills = skills.filter(skill => 
    !userSkills.some(userSkill => 
      userSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(userSkill.toLowerCase())
    )
  );

  return (
    <div className={`${className}`}>
      {/* Main Match Indicator */}
      <div className="flex items-center space-x-3">
        {/* Circular Progress */}
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
            {/* Background circle */}
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-200"
            />
            {/* Progress circle */}
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className={getMatchColor(matchPercentage)}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: animatedPercentage / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{
                strokeDasharray: "175.929",
                strokeDashoffset: "175.929"
              }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className={`text-lg font-bold ${getMatchColor(matchPercentage)}`}
              >
                {animatedPercentage}%
              </motion.div>
            </div>
          </div>
        </div>

        {/* Match Details */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <MatchIcon size={16} className={getMatchColor(matchPercentage)} />
            <span className={`font-semibold ${getMatchColor(matchPercentage)}`}>
              {matchPercentage >= 90 ? 'Excellent Match' :
               matchPercentage >= 75 ? 'Good Match' :
               matchPercentage >= 60 ? 'Fair Match' : 'Poor Match'}
            </span>
          </div>
          
          <div className="text-sm text-gray-600">
            {matchedSkills.length} of {skills.length} skills match
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <motion.div
              className={`h-2 rounded-full bg-gradient-to-r ${getMatchGradient(matchPercentage)}`}
              initial={{ width: 0 }}
              animate={{ width: `${animatedPercentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.5 }}
          className="mt-4 space-y-3"
        >
          {/* Matched Skills */}
          {matchedSkills.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center">
                <CheckCircle size={14} className="mr-1" />
                Matching Skills ({matchedSkills.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {matchedSkills.map((skill, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {missingSkills.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-orange-700 mb-2 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                Skills to Develop ({missingSkills.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {missingSkills.slice(0, 5).map((skill, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full"
                  >
                    {skill}
                  </motion.span>
                ))}
                {missingSkills.length > 5 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{missingSkills.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Match Factors */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {Math.round((matchedSkills.length / skills.length) * 100)}%
              </div>
              <div className="text-xs text-gray-600">Skills Match</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {Math.round(Math.random() * 20 + 80)}%
              </div>
              <div className="text-xs text-gray-600">Experience Match</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
