'use client';

import { useState } from 'react';
import {
    Search,
    CheckCircle2,
    Clock,
    XCircle,
    DollarSign,
    IndianRupee,
    ShoppingCart,
    AlertCircle,
} from 'lucide-react';
import DashboardPageContainer from '@/components/layout/DashboardPageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    DigitalProductOrder,
    useGetAdminDigitalOrdersQuery,
    useGetAdminDigitalOrdersStatsQuery,
} from '@/redux/api/digitalProductApi';
import { DigitalOrderReviewDialog } from './DigitalOrderReviewDialog';

export function DigitalProductOrdersClient() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [reviewOrder, setReviewOrder] = useState<DigitalProductOrder | null>(null);

    const { data: statsData } = useGetAdminDigitalOrdersStatsQuery();
    const { data, isLoading, refetch } = useGetAdminDigitalOrdersQuery({
        search: search || undefined,
        status: statusFilter || undefined,
    });

    const stats = statsData?.data;
    const orders = data?.data ?? [];

    return (
        <DashboardPageContainer
            heading={
                <h1 className="flex items-center gap-2 font-bangla text-2xl font-bold text-gray-900">
                    <ShoppingCart className="h-6 w-6 text-amber-500" />
                    ডিজিটাল প্রোডাক্ট অর্ডার ও পেমেন্ট ভেরিফিকেশন
                </h1>
            }
            subheading="বুটক্যাম্প পেজ থেকে বিক্রিত ফটোশপ ও ইলাস্ট্রেটর স্ক্রিপ্ট প্যাকের সমস্ত অর্ডার ও ভারতীয় শিক্ষার্থীদের PhonePe ম্যানুয়াল পেমেন্ট এখান থেকে অনুমোদন করুন।"
            content={
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-white border-gray-200 shadow-sm">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardDescription className="font-bangla text-xs font-bold text-gray-700">মোট আয় (বাংলাদেশ - BDT)</CardDescription>
                                    <DollarSign className="h-5 w-5 text-emerald-700" />
                                </div>
                                <CardTitle className="text-2xl font-bold text-gray-900">
                                    ৳{(stats?.totalRevenueBDT || 0).toLocaleString()}
                                </CardTitle>
                                <p className="text-[11px] text-gray-600 font-bangla font-medium">SSLCommerz গেটওয়ে</p>
                            </CardHeader>
                        </Card>

                        <Card className="bg-white border-gray-200 shadow-sm">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardDescription className="font-bangla text-xs font-bold text-gray-700">মোট আয় (ভারত - INR)</CardDescription>
                                    <IndianRupee className="h-5 w-5 text-purple-700" />
                                </div>
                                <CardTitle className="text-2xl font-bold text-gray-900">
                                    ₹{(stats?.totalRevenueINR || 0).toLocaleString()}
                                </CardTitle>
                                <p className="text-[11px] text-gray-600 font-bangla font-medium">PhonePe ম্যানুয়াল সেন্ড মানি</p>
                            </CardHeader>
                        </Card>

                        <Card className="bg-white border-gray-200 shadow-sm">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardDescription className="font-bangla text-xs font-bold text-gray-700">পেন্ডিং অনুমোদন (PhonePe)</CardDescription>
                                    <AlertCircle className="h-5 w-5 text-amber-600" />
                                </div>
                                <CardTitle className="text-2xl font-bold text-amber-800">
                                    {stats?.pendingManualOrders || 0}
                                </CardTitle>
                                <p className="text-[11px] text-gray-600 font-bangla font-medium">যাচাই ও অনুমোদন প্রয়োজন</p>
                            </CardHeader>
                        </Card>

                        <Card className="bg-white border-gray-200 shadow-sm">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardDescription className="font-bangla text-xs font-bold text-gray-700">সম্পূর্ণ অর্ডার</CardDescription>
                                    <CheckCircle2 className="h-5 w-5 text-blue-700" />
                                </div>
                                <CardTitle className="text-2xl font-bold text-gray-900">
                                    {stats?.paidOrders || 0} / {stats?.totalOrders || 0}
                                </CardTitle>
                                <p className="text-[11px] text-gray-600 font-bangla font-medium">সফল লেনদেন ও ফাইল এক্সেস</p>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Filter Tabs & Search */}
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { label: 'সব অর্ডার', value: '' },
                                        { label: 'পেন্ডিং ভেরিফিকেশন', value: 'pending' },
                                        { label: 'পরিশোধিত (Paid)', value: 'paid' },
                                        { label: 'বাতিল (Rejected)', value: 'rejected' },
                                    ].map((tab) => (
                                        <Button
                                            key={tab.value}
                                            variant={statusFilter === tab.value ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setStatusFilter(tab.value)}
                                            className={`font-bangla text-xs ${
                                                statusFilter === tab.value
                                                    ? 'bg-[#ffd60a] font-bold text-black hover:bg-[#ffd60a]/90 shadow-sm'
                                                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                        >
                                            {tab.label}
                                        </Button>
                                    ))}
                                </div>

                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="অর্ডার #, ইমেইল বা TrxID..."
                                        className="bg-gray-50/50 border-gray-200 pl-9 text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Orders Table */}
                    <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-700">
                                <thead className="border-b border-gray-200 bg-gray-100 text-xs font-bold uppercase text-gray-800">
                                    <tr>
                                        <th className="px-6 py-4">অর্ডার ও তারিখ</th>
                                        <th className="px-6 py-4">গ্রাহক</th>
                                        <th className="px-6 py-4">প্রোডাক্ট</th>
                                        <th className="px-6 py-4">পেমেন্ট মেথড</th>
                                        <th className="px-6 py-4">পরিমাণ</th>
                                        <th className="px-6 py-4">TrxID / প্রেরক</th>
                                        <th className="px-6 py-4">স্ট্যাটাস</th>
                                        <th className="px-6 py-4 text-right">অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-gray-600 font-semibold font-bangla">
                                                ডাটা লোড হচ্ছে...
                                            </td>
                                        </tr>
                                    ) : orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-gray-600 font-semibold font-bangla">
                                                কোনো অর্ডার পাওয়া যায়নি।
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map((o) => {
                                            const isPending = o.status === 'pending';
                                            const isPaid = o.status === 'paid';

                                            return (
                                                <tr key={o._id} className="transition hover:bg-gray-50/80">
                                                    <td className="px-6 py-4">
                                                        <div className="font-mono text-xs font-bold text-gray-900">
                                                            {o.orderNumber}
                                                        </div>
                                                        <div className="text-[11px] text-gray-600 font-bangla mt-0.5 font-medium">
                                                            {new Date(o.createdAt).toLocaleDateString('bn-BD', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="font-bangla font-bold text-gray-900 text-sm">
                                                            {o.customer?.name}
                                                        </div>
                                                        <div className="text-xs text-gray-700 font-mono">
                                                            {o.customer?.email}
                                                        </div>
                                                        <div className="text-xs text-gray-600 font-mono">
                                                            {o.customer?.phone}
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="font-bangla text-xs font-bold text-gray-900 max-w-[180px] truncate">
                                                            {o.productSnapshot?.title || o.product?.title}
                                                        </div>
                                                        <span className="text-[10px] uppercase font-bold text-gray-600">
                                                            {o.productSnapshot?.software || o.product?.software}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {o.paymentMethod === 'PhonePe_Manual' ? (
                                                            <Badge
                                                                variant="outline"
                                                                className="border-amber-300 bg-amber-50 text-amber-900 font-bangla text-[11px] font-bold"
                                                            >
                                                                PhonePe (India 🇮🇳)
                                                            </Badge>
                                                        ) : o.paymentMethod === 'Perk' ? (
                                                            <Badge
                                                                variant="outline"
                                                                className="border-violet-300 bg-violet-50 text-violet-900 font-bangla text-[11px] font-bold"
                                                            >
                                                                Enrollment Perk (Free)
                                                            </Badge>
                                                        ) : (
                                                            <Badge
                                                                variant="outline"
                                                                className="border-blue-300 bg-blue-50 text-blue-900 font-bangla text-[11px] font-bold"
                                                            >
                                                                SSLCommerz (Online)
                                                            </Badge>
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4 font-mono font-bold text-gray-900 text-sm">
                                                        {o.currency === 'INR' ? `₹${o.amount}` : `৳${o.amount}`}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="font-mono text-xs font-bold text-gray-900">
                                                            {o.transactionId}
                                                        </div>
                                                        {o.senderNumber && (
                                                            <div className="text-[11px] text-gray-600 font-mono font-medium">
                                                                প্রেরক: {o.senderNumber}
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bangla font-bold ${
                                                                isPaid
                                                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                                                    : isPending
                                                                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                                                      : 'bg-red-100 text-red-900 border border-red-300'
                                                            }`}
                                                        >
                                                            {isPaid ? (
                                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                                                            ) : isPending ? (
                                                                <Clock className="h-3.5 w-3.5 text-amber-700" />
                                                            ) : (
                                                                <XCircle className="h-3.5 w-3.5 text-red-700" />
                                                            )}
                                                            {isPaid ? 'পরিশোধিত' : isPending ? 'পেন্ডিং ভেরিফিকেশন' : 'বাতিল'}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4 text-right">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => setReviewOrder(o)}
                                                            className={`font-bangla text-xs ${
                                                                isPending
                                                                    ? 'bg-[#ffd60a] text-black font-bold hover:bg-[#ffd60a]/90 border-transparent shadow-sm'
                                                                    : 'border-gray-300 bg-white font-bold text-gray-800 hover:bg-gray-100 shadow-sm'
                                                            }`}
                                                        >
                                                            {isPending ? 'যাচাই ও অনুমোদন' : 'বিবরণ দেখুন'}
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Review Dialog */}
                    <DigitalOrderReviewDialog
                        open={Boolean(reviewOrder)}
                        onClose={() => {
                            setReviewOrder(null);
                            refetch();
                        }}
                        order={reviewOrder}
                    />
                </div>
            }
        />
    );
}
