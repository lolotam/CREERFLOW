'use client';

import { motion } from 'framer-motion';
import { FileText, Upload, Award } from 'lucide-react';
import { FormData } from '../ApplicationForm';
import FileUpload from '@/components/ui/FileUpload';

interface DocumentsStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function DocumentsStep({
  formData,
  updateFormData,
  onNext
}: DocumentsStepProps) {

  const isStepValid = () => {
    return formData.resume !== null; // Resume is required
  };

  return (
    <div className="space-y-8">
      {/* Resume Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FileUpload
          label="Resume"
          description="Upload your most recent resume (PDF, DOC, or DOCX)"
          onFileSelect={(file) => updateFormData({ resume: file })}
          currentFile={formData.resume}
          acceptedTypes={['.pdf', '.doc', '.docx']}
          maxSize={10}
          required
        />
      </motion.div>

      {/* Cover Letter Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <FileUpload
          label="Cover Letter"
          description="Optional: Upload a personalized cover letter"
          onFileSelect={(file) => updateFormData({ coverLetter: file })}
          currentFile={formData.coverLetter}
          acceptedTypes={['.pdf', '.doc', '.docx']}
          maxSize={5}
        />
      </motion.div>

      {/* Portfolio Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <FileUpload
          label="Portfolio"
          description="Optional: Upload your portfolio or work samples"
          onFileSelect={(file) => updateFormData({ portfolio: file })}
          currentFile={formData.portfolio}
          acceptedTypes={['.pdf', '.zip', '.doc', '.docx']}
          maxSize={20}
        />
      </motion.div>

      {/* Validation Message */}
      {!isStepValid() && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-4"
        >
          <p className="text-yellow-800 text-sm">
            Please upload your resume to continue.
          </p>
        </motion.div>
      )}

      {/* Next Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-end pt-6"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          disabled={!isStepValid()}
          className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
            isStepValid()
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Review
        </motion.button>
      </motion.div>
    </div>
  );
}
