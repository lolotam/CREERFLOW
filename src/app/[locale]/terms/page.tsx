'use client';

import { motion } from 'framer-motion';
import { FileText, User, Shield, AlertTriangle, Scale, Mail } from 'lucide-react';
import Head from 'next/head';

export default function TermsOfServicePage() {

  const sections = [
    {
      id: '1',
      title: 'Acceptance of Terms',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: '2', 
      title: 'User Accounts',
      icon: User,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: '3',
      title: 'Platform Usage',
      icon: Shield,
      color: 'from-green-500 to-blue-500'
    },
    {
      id: '4',
      title: 'Prohibited Activities',
      icon: AlertTriangle,
      color: 'from-red-500 to-orange-500'
    },
    {
      id: '5',
      title: 'Legal Compliance',
      icon: Scale,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: '6',
      title: 'Contact Information',
      icon: Mail,
      color: 'from-pink-500 to-red-500'
    }
  ];

  return (
    <>
      <Head>
        <title>Terms of Service - CareerFlow</title>
        <meta name="description" content="Read CareerFlow's Terms of Service to understand your rights and responsibilities when using our platform." />
        <meta name="keywords" content="terms of service, user agreement, legal terms, conditions, CareerFlow platform" />
        <meta property="og:title" content="Terms of Service - CareerFlow" />
        <meta property="og:description" content="Read CareerFlow's Terms of Service to understand your rights and responsibilities when using our platform." />
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <FileText className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Service</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
            Please read these terms carefully before using CareerFlow. By accessing our platform, you agree to be bound by these terms.
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
                Welcome to CareerFlow! These Terms of Service (&quot;Terms&quot;) govern your use of our website, mobile application, and services (collectively, the &quot;Service&quot;) operated by CareerFlow (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;).
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
                    <FileText className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <p>By accessing and using CareerFlow, you accept and agree to be bound by the terms and provision of this agreement.</p>
                  <p>If you do not agree to abide by the above, please do not use this service.</p>
                  <p>We reserve the right to update and change the Terms of Service from time to time without notice. Any new features that augment or enhance the current Service, including the release of new tools and resources, shall be subject to the Terms of Service.</p>
                  <p>Continued use of the Service after any such changes shall constitute your consent to such changes.</p>
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
                    <User className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">2. User Accounts and Registration</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <h3 className="text-xl font-semibold text-white">2.1 Account Creation</h3>
                  <p>To access certain features of our Service, you may be required to create an account. You must provide accurate, current, and complete information during the registration process.</p>
                  
                  <h3 className="text-xl font-semibold text-white mt-6">2.2 Account Security</h3>
                  <p>You are responsible for:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Maintaining the confidentiality of your account credentials</li>
                    <li>All activities that occur under your account</li>
                    <li>Notifying us immediately of any unauthorized use</li>
                    <li>Ensuring your contact information remains current</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mt-6">2.3 Account Termination</h3>
                  <p>We may terminate or suspend your account at any time for violations of these Terms or for any other reason at our sole discretion.</p>
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
                    <Shield className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">3. Use License and Restrictions</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <h3 className="text-xl font-semibold text-white">3.1 License Grant</h3>
                  <p>Subject to these Terms, we grant you a limited, non-exclusive, non-transferable license to use our Service for your personal and professional job-seeking activities.</p>

                  <h3 className="text-xl font-semibold text-white mt-6">3.2 User Content</h3>
                  <p>You retain ownership of content you submit to our platform, but you grant us a license to use, display, and distribute your content for the purpose of providing our services.</p>
                  
                  <h3 className="text-xl font-semibold text-white mt-6">3.3 Acceptable Use</h3>
                  <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>In any way that violates applicable laws or regulations</li>
                    <li>To transmit or procure the sending of any advertising or promotional material</li>
                    <li>To impersonate or attempt to impersonate the Company, employees, or other users</li>
                    <li>To engage in any other conduct that restricts or inhibits anyone&apos;s use of the Service</li>
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
                    <AlertTriangle className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">4. Prohibited Activities</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <p>The following activities are strictly prohibited:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Submitting false, misleading, or fraudulent information</li>
                    <li>Using automated systems or bots to access the Service</li>
                    <li>Attempting to gain unauthorized access to our systems</li>
                    <li>Harassing, abusing, or harming other users</li>
                    <li>Violating intellectual property rights</li>
                    <li>Distributing malware or other harmful code</li>
                    <li>Circumventing security measures or access controls</li>
                    <li>Using the Service for any commercial purposes without authorization</li>
                  </ul>
                  <p className="mt-4">Violation of these prohibitions may result in immediate termination of your account and potential legal action.</p>
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
                    <Scale className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">5. Legal Disclaimers and Limitations</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <h3 className="text-xl font-semibold text-white">5.1 Service Availability</h3>
                  <p>While we strive to maintain continuous service availability, we do not guarantee uninterrupted access. The Service may be temporarily unavailable for maintenance, updates, or technical issues.</p>

                  <h3 className="text-xl font-semibold text-white mt-6">5.2 Disclaimer of Warranties</h3>
                  <p>The Service is provided &quot;as is&quot; and &quot;as available&quot; without any representations or warranties, express or implied. We disclaim all warranties, including but not limited to:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Merchantability and fitness for a particular purpose</li>
                    <li>Non-infringement of third-party rights</li>
                    <li>Accuracy, reliability, or completeness of content</li>
                    <li>Security or virus-free operation</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mt-6">5.3 Limitation of Liability</h3>
                  <p>In no event shall CareerFlow be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>

                  <h3 className="text-xl font-semibold text-white mt-6">5.4 Indemnification</h3>
                  <p>You agree to defend, indemnify, and hold harmless CareerFlow from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees arising out of or relating to your violation of these Terms.</p>
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
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center mr-4`}>
                    <FileText className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">6. Additional Terms</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <h3 className="text-xl font-semibold text-white">6.1 Governing Law</h3>
                  <p>These Terms shall be governed by and construed in accordance with the laws of Kuwait, without regard to conflict of law provisions.</p>

                  <h3 className="text-xl font-semibold text-white mt-6">6.2 Dispute Resolution</h3>
                  <p>Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration in accordance with the rules of the relevant arbitration authority.</p>

                  <h3 className="text-xl font-semibold text-white mt-6">6.3 Severability</h3>
                  <p>If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.</p>

                  <h3 className="text-xl font-semibold text-white mt-6">6.4 Entire Agreement</h3>
                  <p>These Terms constitute the entire agreement between you and CareerFlow regarding your use of the Service, superseding any prior agreements.</p>

                  <h3 className="text-xl font-semibold text-white mt-6">6.5 Assignment</h3>
                  <p>You may not assign or transfer your rights under these Terms without our prior written consent. We may assign our rights and obligations under these Terms without restriction.</p>
                </div>
              </motion.section>

              {/* Contact Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-purple-500/20"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Questions About These Terms?</h2>
                <p className="text-gray-300 mb-4">
                  If you have any questions about these Terms of Service or need clarification on any provision, please contact us:
                </p>
                <div className="flex items-center space-x-2 text-purple-400">
                  <Mail size={20} />
                  <a href="mailto:info@careerflow.com" className="hover:text-purple-300 transition-colors">
                    info@careerflow.com
                  </a>
                </div>
                <p className="text-sm text-gray-400 mt-4">
                  By continuing to use CareerFlow, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </motion.section>
            </div>
          </motion.div>
        </div>
      </div>
      </div>
    </>
  );
}