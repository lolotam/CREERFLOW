'use client';

import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Users, Database, Mail } from 'lucide-react';
import Head from 'next/head';

export default function PrivacyPolicyPage() {

  const sections = [
    {
      id: '1',
      title: 'Information We Collect',
      icon: Database,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: '2', 
      title: 'How We Use Your Information',
      icon: Users,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: '3',
      title: 'Information Sharing',
      icon: Eye,
      color: 'from-green-500 to-blue-500'
    },
    {
      id: '4',
      title: 'Data Security',
      icon: Lock,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: '5',
      title: 'Your Rights',
      icon: Shield,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: '6',
      title: 'Contact Us',
      icon: Mail,
      color: 'from-pink-500 to-red-500'
    }
  ];

  return (
    <>
      <Head>
        <title>Privacy Policy - CareerFlow</title>
        <meta name="description" content="Learn how CareerFlow protects your personal information and respects your privacy." />
        <meta name="keywords" content="privacy policy, data protection, personal information, GDPR compliance, CareerFlow" />
        <meta property="og:title" content="Privacy Policy - CareerFlow" />
        <meta property="og:description" content="Learn how CareerFlow protects your personal information and respects your privacy." />
        <meta name="robots" content="index, follow" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Shield className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Policy</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
            Your privacy is important to us. This policy explains how CareerFlow collects, uses, and protects your personal information.
          </p>
          <p className="text-sm text-gray-400">
            Last updated: January 13, 2025
          </p>
        </motion.div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 rounded-2xl mb-8"
          >
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-gray-300 mb-8">
                CareerFlow (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>

              {/* Section 1 */}
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-12"
              >
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${sections[0].color} flex items-center justify-center mr-4`}>
                    <Database className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <h3 className="text-xl font-semibold text-white">1.1 Personal Information</h3>
                  <p>When you create an account or apply for jobs, we may collect:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Name, email address, phone number</li>
                    <li>Professional information (work experience, skills, education)</li>
                    <li>Resume, cover letter, and portfolio documents</li>
                    <li>Salary expectations and job preferences</li>
                    <li>Location and contact information</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mt-6">1.2 Automatically Collected Information</h3>
                  <p>We automatically collect certain information about your device and usage:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>IP address, browser type, and operating system</li>
                    <li>Pages visited, time spent on pages, and click data</li>
                    <li>Device identifiers and mobile network information</li>
                    <li>Location data (with your consent)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mt-6">1.3 Cookies and Tracking</h3>
                  <p>We use cookies and similar technologies to:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze site traffic and usage patterns</li>
                    <li>Provide personalized content and recommendations</li>
                    <li>Enable social media features and advertising</li>
                  </ul>
                </div>
              </motion.section>

              {/* Section 2 */}
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-12"
              >
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${sections[1].color} flex items-center justify-center mr-4`}>
                    <Users className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">2. How We Use Your Information</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <p>We use your information to:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Provide and maintain our job matching services</li>
                    <li>Process job applications and facilitate employer connections</li>
                    <li>Send you relevant job opportunities and updates</li>
                    <li>Improve our services and user experience</li>
                    <li>Communicate with you about your account and our services</li>
                    <li>Comply with legal obligations and protect our rights</li>
                    <li>Prevent fraud and ensure platform security</li>
                    <li>Conduct analytics and market research</li>
                  </ul>
                </div>
              </motion.section>

              {/* Section 3 */}
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mb-12"
              >
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${sections[2].color} flex items-center justify-center mr-4`}>
                    <Eye className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">3. Information Sharing and Disclosure</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <h3 className="text-xl font-semibold text-white">3.1 With Employers</h3>
                  <p>We may share your profile information and application materials with potential employers when you apply for jobs or express interest in opportunities.</p>

                  <h3 className="text-xl font-semibold text-white mt-6">3.2 Service Providers</h3>
                  <p>We may share information with trusted third-party service providers who assist us in:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Cloud hosting and data storage</li>
                    <li>Payment processing and billing</li>
                    <li>Email communications and marketing</li>
                    <li>Analytics and performance monitoring</li>
                    <li>Customer support services</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mt-6">3.3 Legal Requirements</h3>
                  <p>We may disclose your information when required by law or to:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Comply with legal process or government requests</li>
                    <li>Protect our rights, property, or safety</li>
                    <li>Prevent fraud or illegal activities</li>
                    <li>Enforce our Terms of Service</li>
                  </ul>
                </div>
              </motion.section>

              {/* Section 4 */}
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-12"
              >
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${sections[3].color} flex items-center justify-center mr-4`}>
                    <Lock className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">4. Data Security</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <p>We implement appropriate technical and organizational measures to protect your information:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments and updates</li>
                    <li>Limited access to personal information</li>
                    <li>Secure data centers and infrastructure</li>
                    <li>Employee training on data protection</li>
                  </ul>
                  <p className="mt-4">However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security of your information.</p>
                </div>
              </motion.section>

              {/* Section 5 */}
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mb-12"
              >
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${sections[4].color} flex items-center justify-center mr-4`}>
                    <Shield className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">5. Your Rights and Choices</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <p>You have the following rights regarding your personal information:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li><strong>Access:</strong> Request a copy of your personal information</li>
                    <li><strong>Update:</strong> Correct or update your information</li>
                    <li><strong>Delete:</strong> Request deletion of your account and data</li>
                    <li><strong>Portability:</strong> Receive your data in a structured format</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                    <li><strong>Restrict:</strong> Limit how we process your information</li>
                  </ul>
                  <p className="mt-4">To exercise these rights, please contact us at info@careerflow.com</p>
                </div>
              </motion.section>

              {/* Section 6 */}
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mb-12"
              >
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${sections[5].color} flex items-center justify-center mr-4`}>
                    <Mail className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">6. Additional Information</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <h3 className="text-xl font-semibold text-white">6.1 Data Retention</h3>
                  <p>We retain your information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your account at any time.</p>

                  <h3 className="text-xl font-semibold text-white mt-6">6.2 International Transfers</h3>
                  <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.</p>

                  <h3 className="text-xl font-semibold text-white mt-6">6.3 Children&apos;s Privacy</h3>
                  <p>Our services are not intended for individuals under 16 years of age. We do not knowingly collect personal information from children under 16.</p>

                  <h3 className="text-xl font-semibold text-white mt-6">6.4 Updates to This Policy</h3>
                  <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the &quot;Last Updated&quot; date.</p>
                </div>
              </motion.section>

              {/* Contact Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/20"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Questions About This Policy?</h2>
                <p className="text-gray-300 mb-4">
                  If you have any questions about this Privacy Policy or how we handle your personal information, please contact us:
                </p>
                <div className="flex items-center space-x-2 text-blue-400">
                  <Mail size={20} />
                  <a href="mailto:info@careerflow.com" className="hover:text-blue-300 transition-colors">
                    info@careerflow.com
                  </a>
                </div>
              </motion.section>
            </div>
          </motion.div>
        </div>
      </div>
      </div>
    </>
  );
}