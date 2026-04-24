import BatchDashboard from '@/components/module/dashboard/batch/Batch';
import { Plus } from 'lucide-react';
import Link from 'next/link';


const page = () => {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Batch Management</h1>
                    <p className="text-muted-foreground">Create and manage course batches</p>
                </div>
                <div className="flex justify-end">
                    <Link href="/dashboard/admin/batch/create" className='flex justify-center items-center gap-2 bg-primary px-4 py-2 text-white rounded-md font-semibold text-sm hover:bg-primary/80'><Plus className="w-4 h-4" />
                        Create New Batch
                    </Link>

                </div>
            </div>

            <BatchDashboard />
        </div>
    );
};

export default page;