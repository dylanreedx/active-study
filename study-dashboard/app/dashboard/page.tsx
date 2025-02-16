import type {Metadata} from 'next';
import {Dashboard} from '@/components/dashboard';

export const metadata: Metadata = {
  title: 'Study Dashboard',
  description: 'Manage your study sessions and view study materials',
};

export default function DashboardPage() {
  return (
    <div className='container mx-auto py-10'>
      <Dashboard />
    </div>
  );
}
