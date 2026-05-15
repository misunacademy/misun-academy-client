import DashboardPageContainer from '@/components/layout/DashboardPageContainer';
import BatchDashboard from './components/Batch';
import { Plus } from 'lucide-react';
import Link from 'next/link';

const page = () => {
    return (

        <DashboardPageContainer
            heading="Batch Management"
            subheading="Create and manage course batches"
            buttons={
            <div className=''>
                 <Link href="/dashboard/admin/batch/create" className='flex justify-center items-center gap-2 bg-primary px-4 py-2 text-white rounded-md font-semibold text-sm hover:bg-primary/80'><Plus className="w-4 h-4" />
                Create New Batch
            </Link>
            </div>
           }
            content={<BatchDashboard />} />

    );
};

export default page;