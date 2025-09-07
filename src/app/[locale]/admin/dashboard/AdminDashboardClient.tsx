'use client';

import AdminDashboard from '@/components/admin/AdminDashboard';
import { AdminAuthProvider, withAdminAuth } from '@/contexts/AdminAuthContext';

function AdminDashboardContent() {
  return (
    <main className="min-h-screen">
      <AdminDashboard />
    </main>
  );
}

// Wrap with authentication protection
const ProtectedAdminDashboard = withAdminAuth(AdminDashboardContent);

export default function AdminDashboardClient() {
  return (
    <AdminAuthProvider>
      <ProtectedAdminDashboard />
    </AdminAuthProvider>
  );
}
