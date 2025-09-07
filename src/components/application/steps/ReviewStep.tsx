'use client';

import { motion } from 'framer-motion';
import { User, Mail, Phone, Briefcase, FileText, Check } from 'lucide-react';
import { FormData } from '../ApplicationForm';

interface ReviewStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function ReviewStep({
  formData,
  onSubmit,
  isSubmitting
}: ReviewStepProps) {

  const sections = [
    {
      title: 'Personal Information',
      icon: User,
      items: [
        { label: 'Name', value: `${formData.firstName} ${formData.lastName}` },
        { label: 'Email', value: formData.email },
        { label: 'Phone', value: formData.phone },
        { label: 'Address', value: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`.replace(/^, |, $|, , /g, '') || 'Not provided' },
      ]
    },
    {
      title: 'Experience & Skills',
      icon: Briefcase,
      items: [
        { label: 'Current Position', value: formData.currentPosition || 'Not provided' },
        { label: 'Current Company', value: formData.currentCompany || 'Not provided' },
        { label: 'Years of Experience', value: formData.yearsExperience },
        { label: 'Education', value: formData.education },
        { label: 'Skills', value: formData.skills.length > 0 ? formData.skills.join(', ') : 'None added' },
      ]
    },
    {
      title: 'Documents',
      icon: FileText,
      items: [
        { label: 'Resume', value: formData.resume ? formData.resume.name : 'Not uploaded' },
        { label: 'Cover Letter', value: formData.coverLetter ? formData.coverLetter.name : 'Not uploaded' },
        { label: 'Portfolio', value: formData.portfolio ? formData.portfolio.name : 'Not uploaded' },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Review Sections */}
      {sections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
          className="bg-gray-50 rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <section.icon size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.items.map((item, itemIndex) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: sectionIndex * 0.1 + itemIndex * 0.05 }}
                className="flex flex-col"
              >
                <span className="text-sm font-medium text-gray-600">{item.label}</span>
                <span className="text-gray-900 mt-1">{item.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Terms and Conditions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-6"
      >
        <div className="flex items-start space-x-3">
          <Check size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Application Agreement</h4>
            <p className="text-blue-800 text-sm leading-relaxed">
              By submitting this application, I confirm that all information provided is accurate and complete. 
              I understand that any false information may result in disqualification from consideration. 
              I authorize the company to verify the information provided and contact my references.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center pt-6"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Submitting Application...</span>
            </>
          ) : (
            <>
              <Check size={24} />
              <span>Submit Application</span>
            </>
          )}
        </motion.button>
        
        <p className="text-sm text-gray-600 mt-4">
          Your application will be submitted securely and you&apos;ll receive a confirmation email.
        </p>
      </motion.div>
    </div>
  );
}
