'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Download, Mail, Phone, MoreHorizontal, RefreshCw, Trash2, X, Calendar, MapPin, Briefcase, GraduationCap, User } from 'lucide-react';

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  appliedDate: string;
  status: 'pending' | 'reviewing' | 'interview' | 'hired' | 'rejected';
  matchScore: number;
}

interface ApplicantsTableProps {
  searchTerm: string;
  filterStatus: string;
}

export default function ApplicantsTable({ searchTerm, filterStatus }: ApplicantsTableProps) {
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [applicantToDelete, setApplicantToDelete] = useState<string | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState<any | null>(null);

  // Fetch applications from API
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.set('search', searchTerm);
      if (filterStatus !== 'all') queryParams.set('status', filterStatus);
      
      const response = await fetch(`/api/applications?${queryParams.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setApplicants(result.data);
      } else {
        setError(result.message || 'Failed to fetch applications');
      }
    } catch (err) {
      setError('Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [searchTerm, filterStatus]);

  // Action functions
  const handleViewDetails = async (applicantId: string) => {
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicationId: applicantId }),
      });
      
      const result = await response.json();
      if (result.success) {
        setSelectedApplicant(result.data);
        setViewModalOpen(true);
      } else {
        alert('Failed to load application details');
      }
    } catch (error) {
      console.error('Error loading application details:', error);
      alert('Failed to load application details');
    }
  };

  const handleDeleteApplication = async (applicantId: string) => {
    try {
      const response = await fetch(`/api/applications?id=${applicantId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      if (result.success) {
        // Remove from local state
        setApplicants(prev => prev.filter(app => app.id !== applicantId));
        setDeleteConfirmOpen(false);
        setApplicantToDelete(null);
        alert('Application deleted successfully');
      } else {
        alert(result.message || 'Failed to delete application');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Failed to delete application');
    }
  };

  const handleDownloadResume = (applicant: Applicant) => {
    // Get the applicant data to access resume
    const fullData = applicants.find(app => app.id === applicant.id);
    if (fullData && (fullData as any).data?.resume) {
      const resume = (fullData as any).data.resume;
      const base64Data = resume.data;
      const fileName = resume.name || 'resume.pdf';
      
      // Convert base64 to blob and download
      try {
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: resume.type || 'application/pdf' });
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading resume:', error);
        alert('Failed to download resume');
      }
    } else {
      alert('No resume found for this applicant');
    }
  };

  const handleSendEmail = (applicant: Applicant) => {
    setEmailRecipient(applicant);
    setEmailModalOpen(true);
  };

  const sendEmailToApplicant = () => {
    if (emailRecipient) {
      // Create mailto link
      const subject = encodeURIComponent(`RE: Your application for ${emailRecipient.position}`);
      const body = encodeURIComponent(`Dear ${emailRecipient.name},\n\nThank you for your application. We would like to discuss your application further.\n\nBest regards,\nCareerFlow Team`);
      const mailtoLink = `mailto:${emailRecipient.email}?subject=${subject}&body=${body}`;
      
      window.open(mailtoLink);
      setEmailModalOpen(false);
      setEmailRecipient(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'interview':
        return 'bg-purple-100 text-purple-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Since filtering is now handled by the API, we use applicants directly
  const filteredApplicants = applicants;

  const toggleSelectApplicant = (id: string) => {
    setSelectedApplicants(prev => 
      prev.includes(id) 
        ? prev.filter(applicantId => applicantId !== id)
        : [...prev, id]
    );
  };

  const selectAllApplicants = () => {
    if (selectedApplicants.length === filteredApplicants.length) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(filteredApplicants.map(applicant => applicant.id));
    }
  };

  return (
    <div className="overflow-x-auto">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Applications ({applicants.length})</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchApplications}
          disabled={loading}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </motion.button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="text-gray-400 mt-2">Loading applications...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-xl p-4 mb-4">
          <p className="text-red-300">{error}</p>
          <button 
            onClick={fetchApplications}
            className="mt-2 text-red-200 hover:text-red-100 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Applications table */}
      {!loading && !error && (
        <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4">
              <input
                type="checkbox"
                checked={selectedApplicants.length === filteredApplicants.length && filteredApplicants.length > 0}
                onChange={selectAllApplicants}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Applicant</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Position</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Applied Date</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Match Score</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredApplicants.map((applicant, index) => (
            <motion.tr
              key={applicant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-4">
                <input
                  type="checkbox"
                  checked={selectedApplicants.includes(applicant.id)}
                  onChange={() => toggleSelectApplicant(applicant.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              
              <td className="py-4 px-4">
                <div>
                  <div className="font-medium text-gray-900">{applicant.name}</div>
                  <div className="text-sm text-gray-600">{applicant.email}</div>
                  <div className="text-sm text-gray-600">{applicant.phone}</div>
                </div>
              </td>
              
              <td className="py-4 px-4">
                <div className="text-gray-900">{applicant.position}</div>
              </td>
              
              <td className="py-4 px-4">
                <div className="text-gray-900">{new Date(applicant.appliedDate).toLocaleDateString()}</div>
              </td>
              
              <td className="py-4 px-4">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(applicant.status)}`}>
                  {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                </span>
              </td>
              
              <td className="py-4 px-4">
                <div className={`font-semibold ${getMatchScoreColor(applicant.matchScore)}`}>
                  {applicant.matchScore}%
                </div>
              </td>
              
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleViewDetails(applicant.id)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDownloadResume(applicant)}
                    className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                    title="Download Resume"
                  >
                    <Download size={16} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSendEmail(applicant)}
                    className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                    title="Send Email"
                  >
                    <Mail size={16} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setApplicantToDelete(applicant.id);
                      setDeleteConfirmOpen(true);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete Application"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
        </table>
      )}

      {/* No applications message */}
      {!loading && !error && filteredApplicants.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-400">No applications found.</p>
          <p className="text-gray-500 text-sm mt-2">Applications will appear here once someone submits the form.</p>
        </motion.div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {/* View Details Modal */}
        {viewModalOpen && selectedApplicant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setViewModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                  <button
                    onClick={() => setViewModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <User size={20} className="mr-2" />
                      Personal Information
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-700"><strong className="text-blue-600">Name:</strong> {selectedApplicant.name}</p>
                      <p className="text-gray-700"><strong className="text-blue-600">Email:</strong> {selectedApplicant.email}</p>
                      <p className="text-gray-700"><strong className="text-blue-600">Phone:</strong> {selectedApplicant.phone}</p>
                      <p className="text-gray-700"><strong className="text-blue-600">Address:</strong> {selectedApplicant.data?.addressLine1} {selectedApplicant.data?.addressLine2}</p>
                      <p className="text-gray-700"><strong className="text-blue-600">Country:</strong> {selectedApplicant.data?.country}</p>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Briefcase size={20} className="mr-2" />
                      Professional Information
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-700"><strong className="text-blue-600">Current Position:</strong> {selectedApplicant.data?.currentPosition || 'Not specified'}</p>
                      <p className="text-gray-700"><strong className="text-blue-600">Current Company:</strong> {selectedApplicant.data?.currentCompany || 'Not specified'}</p>
                      <p className="text-gray-700"><strong className="text-blue-600">Years of Experience:</strong> {selectedApplicant.data?.yearsExperience}</p>
                      <p className="text-gray-700"><strong className="text-blue-600">Education:</strong> {selectedApplicant.data?.education}</p>
                      <p className="text-gray-700"><strong className="text-blue-600">Status:</strong> {selectedApplicant.data?.status}</p>
                    </div>
                  </div>

                  {/* Skills */}
                  {selectedApplicant.data?.skills && selectedApplicant.data.skills.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplicant.data.skills.map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Application Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Calendar size={20} className="mr-2" />
                      Application Details
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-700"><strong className="text-blue-600">Applied Date:</strong> {new Date(selectedApplicant.appliedDate).toLocaleDateString()}</p>
                      <p className="text-gray-700"><strong className="text-blue-600">Match Score:</strong> {selectedApplicant.matchScore}%</p>
                      <p className="text-gray-700"><strong className="text-blue-600">Available Start Date:</strong> {selectedApplicant.data?.availableStartDate || 'Not specified'}</p>
                      <p className="text-gray-700"><strong className="text-blue-600">Salary Expectation:</strong> {selectedApplicant.data?.salaryExpectation || 'Not specified'}</p>
                    </div>
                  </div>

                  {/* Additional Information */}
                  {selectedApplicant.data?.additionalInfo && (
                    <div className="md:col-span-2 space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedApplicant.data.additionalInfo}</p>
                    </div>
                  )}

                  {/* Documents */}
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                    <div className="flex space-x-4">
                      {selectedApplicant.data?.resume && (
                        <button
                          onClick={() => handleDownloadResume(selectedApplicant)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download size={16} />
                          <span>Download Resume</span>
                        </button>
                      )}
                      {selectedApplicant.data?.coverLetter && (
                        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          <Download size={16} />
                          <span>Download Cover Letter</span>
                        </button>
                      )}
                      {selectedApplicant.data?.portfolio && (
                        <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                          <Download size={16} />
                          <span>Download Portfolio</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={24} className="text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Application</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this application? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setDeleteConfirmOpen(false);
                      setApplicantToDelete(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => applicantToDelete && handleDeleteApplication(applicantToDelete)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Email Modal */}
        {emailModalOpen && emailRecipient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Send Email</h3>
                <p className="text-gray-600 mb-2">
                  Send an email to <strong>{emailRecipient.name}</strong>
                </p>
                <p className="text-sm text-gray-500 mb-6">{emailRecipient.email}</p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setEmailModalOpen(false);
                      setEmailRecipient(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendEmailToApplicant}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Open Email Client
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
