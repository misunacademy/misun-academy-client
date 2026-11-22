'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Package,
    CheckCircle2,
    XCircle,
    Eye,
    EyeOff,
    FileCode,
    FileText,
} from 'lucide-react';
import DashboardPageContainer from '@/components/layout/DashboardPageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    DigitalProduct,
    useGetAdminDigitalProductsQuery,
    useUpdateAdminDigitalProductMutation,
    useDeleteAdminDigitalProductMutation,
} from '@/redux/api/digitalProductApi';
import { DigitalProductModal } from './DigitalProductModal';

export function DigitalProductsClient() {
    const [search, setSearch] = useState('');
    const [softwareFilter, setSoftwareFilter] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<DigitalProduct | null>(null);

    const { data, isLoading, refetch } = useGetAdminDigitalProductsQuery({
        search: search || undefined,
        software: softwareFilter || undefined,
    });

    const [updateProduct] = useUpdateAdminDigitalProductMutation();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteAdminDigitalProductMutation();

    const products = data?.data ?? [];

    const handleOpenCreate = () => {
        setEditingProduct(null);
        setModalOpen(true);
    };

    const handleOpenEdit = (p: DigitalProduct) => {
        setEditingProduct(p);
        setModalOpen(true);
    };

    const handleTogglePublished = async (p: DigitalProduct) => {
        try {
            await updateProduct({
                id: p._id,
                data: { isPublished: !p.isPublished },
            }).unwrap();
            toast.success(p.isPublished ? 'Product un-published' : 'Product published');
        } catch {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
        try {
            await deleteProduct(id).unwrap();
            toast.success('Product deleted successfully');
        } catch {
            toast.error('Failed to delete product');
        }
    };

    return (
        <DashboardPageContainer
            heading={
                <h1 className="flex items-center gap-2 font-bangla text-2xl font-bold text-gray-900">
                    <Package className="h-6 w-6 text-amber-500" />
                    ডিজিটাল প্রোডাক্টস ম্যানেজমেন্ট
                </h1>
            }
            subheading="বুটক্যাম্প পেজে প্রদর্শিত ফটোশপ ও ইলাস্ট্রেটর শর্টকাট স্ক্রিপ্ট, ইনস্ট্রাকশন PDF এবং মূল্য এখান থেকে পরিচালনা করুন।"
            buttons={
                <Button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 bg-[#ffd60a] font-bangla font-bold text-black transition hover:bg-[#ffd60a]/90 shadow-sm"
                >
                    <Plus className="h-4 w-4" /> নতুন প্রোডাক্ট যোগ করুন
                </Button>
            }
            content={
                <div className="space-y-6">
                    {/* Filters */}
                    <Card className="bg-white border-gray-200 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="প্রোডাক্ট খুঁজুন..."
                                        className="bg-gray-50/50 border-gray-200 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white"
                                    />
                                </div>
                                <select
                                    value={softwareFilter}
                                    onChange={(e) => setSoftwareFilter(e.target.value)}
                                    className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="">সব সফটওয়্যার</option>
                                    <option value="photoshop">Photoshop</option>
                                    <option value="illustrator">Illustrator</option>
                                    <option value="bundle">Combo Bundle</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Table */}
                    <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-700">
                                <thead className="border-b border-gray-200 bg-gray-100 text-xs font-bold uppercase text-gray-800">
                                    <tr>
                                        <th className="px-6 py-4">প্রোডাক্ট</th>
                                        <th className="px-6 py-4">সফটওয়্যার</th>
                                        <th className="px-6 py-4">মূল্য (BDT / INR)</th>
                                        <th className="px-6 py-4">ফাইলসমূহ</th>
                                        <th className="px-6 py-4">স্ট্যাটাস</th>
                                        <th className="px-6 py-4">মোট বিক্রি</th>
                                        <th className="px-6 py-4 text-right">অ্যাকশন</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-gray-600 font-semibold font-bangla">
                                                ডাটা লোড হচ্ছে...
                                            </td>
                                        </tr>
                                    ) : products.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-gray-600 font-semibold font-bangla">
                                                কোনো ডিজিটাল প্রোডাক্ট পাওয়া যায়নি।
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map((p) => {
                                            const bdtPrice = p.discountPriceBDT
                                                ? `৳${p.discountPriceBDT} (৳${p.priceBDT})`
                                                : `৳${p.priceBDT}`;
                                            const inrPrice = p.discountPriceINR
                                                ? `₹${p.discountPriceINR} (₹${p.priceINR})`
                                                : `₹${p.priceINR}`;

                                            return (
                                                <tr key={p._id} className="transition hover:bg-gray-50/80">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 font-bangla font-bold text-gray-900 text-sm">
                                                                {p.title}
                                                                {p.badge && (
                                                                    <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-300">
                                                                        {p.badge}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-gray-600 font-mono mt-0.5">
                                                                /{p.slug}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge
                                                            variant="outline"
                                                            className={`uppercase text-[11px] font-bold ${
                                                                p.software === 'photoshop'
                                                                    ? 'border-blue-300 text-blue-900 bg-blue-50'
                                                                    : p.software === 'illustrator'
                                                                      ? 'border-orange-300 text-orange-900 bg-orange-50'
                                                                      : 'border-amber-300 text-amber-900 bg-amber-50'
                                                            }`}
                                                        >
                                                            {p.software}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-xs font-bangla space-y-0.5">
                                                            <div className="text-emerald-900 font-bold text-sm">{bdtPrice}</div>
                                                            <div className="text-amber-900 font-semibold">{inrPrice}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-xs text-gray-800 space-y-1">
                                                            <div className="flex items-center gap-1.5 truncate max-w-[180px] font-medium" title={p.scriptFile?.fileName}>
                                                                <FileCode className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                                                                <span className="truncate">{p.scriptFile?.fileName}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 truncate max-w-[180px] text-gray-600 font-medium" title={p.guidePdf?.fileName}>
                                                                <FileText className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                                                                <span className="truncate">{p.guidePdf?.fileName}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1 text-xs">
                                                            <span
                                                                className={`inline-flex items-center gap-1 font-bold ${
                                                                    p.isPublished ? 'text-emerald-700' : 'text-gray-500'
                                                                }`}
                                                            >
                                                                {p.isPublished ? (
                                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                                                ) : (
                                                                    <XCircle className="h-3.5 w-3.5 text-gray-400" />
                                                                )}
                                                                {p.isPublished ? 'পাবলিশড' : 'ড্রাফট'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-mono font-bold text-gray-900 text-sm">
                                                        {p.salesCount || 0}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleTogglePublished(p)}
                                                                title={p.isPublished ? 'Unpublish' : 'Publish'}
                                                                className="h-8 w-8 p-0 text-gray-600 hover:text-gray-950"
                                                            >
                                                                {p.isPublished ? (
                                                                    <EyeOff className="h-4 w-4" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleOpenEdit(p)}
                                                                className="h-8 w-8 p-0 text-gray-600 hover:text-gray-950"
                                                                title="এডিট করুন"
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(p._id, p.title)}
                                                                disabled={isDeleting}
                                                                className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Create/Edit Modal */}
                    <DigitalProductModal
                        open={modalOpen}
                        onClose={() => {
                            setModalOpen(false);
                            refetch();
                        }}
                        editingProduct={editingProduct}
                    />
                </div>
            }
        />
    );
}
