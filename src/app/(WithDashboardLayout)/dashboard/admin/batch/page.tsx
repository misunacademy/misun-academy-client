import BatchDashboard from '@/components/module/batch/Batch';
import React from 'react';

const page = () => {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Batch Management</h1>
                    <p className="text-muted-foreground">Create and manage course batches</p>
                </div>
            </div>

            <BatchDashboard />
        </div>
    );
};

export default page;