import PaymentTable from '@/components/module/dashboard/payment/PaymentTable';


const page = () => {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Payment Management</h1>
                    <p className="text-muted-foreground">Monitor and manage all payment transactions</p>
                </div>
            </div>

            <PaymentTable />
        </div>
    );
};

export default page;