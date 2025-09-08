'use client';

import AdminDashboard from '@/components/admin/AdminDashboard';
import { AdminAuthProvider, withAdminAuth } from '@/contexts/AdminAuthContext';

function AdminApplicantsContent() {
  return (
    <main className="min-h-screen bg-gray-50">
      <AdminDashboard />
    </main>
  );
}

// Wrap with authentication protection
const ProtectedAdminApplicants = withAdminAuth(AdminApplicantsContent);

export default function AdminApplicantsClient() {
  return (
    <AdminAuthProvider>
      <ProtectedAdminApplicants />
    </AdminAuthProvider>
  );
}