'use client';

import { useRef, useState, type DragEvent } from 'react';
import { toast } from 'sonner';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Package,
    CheckCircle2,
    Clock,
    Eye,
    EyeOff,
    FileCode,
    FileText,
    GripVertical,
    ArrowUpDown,
} from 'lucide-react';
import DashboardPageContainer from '@/components/layout/DashboardPageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getApiErrorMessage } from '@/lib/api-helpers';
import { getEffectiveBdtPrice, getEffectiveInrPrice } from '@/lib/digitalProductPricing';
import {
    DigitalProduct,
    useGetAdminDigitalProductsQuery,
    useUpdateAdminDigitalProductMutation,
    useDeleteAdminDigitalProductMutation,
    useReorderAdminDigitalProductsMutation,
} from '@/redux/api/digitalProductApi';
import { DigitalProductModal } from './DigitalProductModal';

export function DigitalProductsClient() {
    const [search, setSearch] = useState('');
    const [softwareFilter, setSoftwareFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<DigitalProduct | null>(null);
    // In-progress drag order. Stores ids only, so every rendered row still uses
    // the freshest server data (edits are never stale).
    const [draftOrder, setDraftOrder] = useState<{ key: string; ids: string[] } | null>(null);
    const orderRef = useRef<string[]>([]);
    const draftKeyRef = useRef('');
    const dragIndexRef = useRef<number | null>(null);

    const { data, isLoading, refetch } = useGetAdminDigitalProductsQuery({
        search: search || undefined,
        software: softwareFilter || undefined,
        status: statusFilter || undefined,
        limit: 100,
    });

    const [updateProduct] = useUpdateAdminDigitalProductMutation();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteAdminDigitalProductMutation();
    const [reorderProducts] = useReorderAdminDigitalProductsMutation();

    const products = data?.data ?? [];
    const isFilterActive = Boolean(search.trim() || softwareFilter || statusFilter);
    const productsKey = products.map((p) => p._id).join(',');

    const productById = new Map(products.map((p) => [p._id, p] as const));
    const displayProducts =
        draftOrder && draftOrder.key === productsKey
            ? draftOrder.ids
                  .map((id) => productById.get(id))
                  .filter((p): p is DigitalProduct => Boolean(p))
            : products;

    const handleDragStart = (index: number) => {
        if (isFilterActive) return;
        dragIndexRef.current = index;
        draftKeyRef.current = productsKey;
        orderRef.current = displayProducts.map((p) => p._id);
    };

    const handleDragOver = (
        event: DragEvent<HTMLTableRowElement>,
        index: number
    ) => {
        event.preventDefault();
        if (isFilterActive) return;

        const from = dragIndexRef.current;
        if (from === null || from === index) return;

        const next = [...orderRef.current];
        const [moved] = next.splice(from, 1);
        if (!moved) return;
        next.splice(index, 0, moved);

        orderRef.current = next;
        setDraftOrder({ key: draftKeyRef.current, ids: next });
        dragIndexRef.current = index;
    };

    const handleDragEnd = async () => {
        dragIndexRef.current = null;
        if (isFilterActive) return;

        const currentIds = orderRef.current;
        const baseline = products.map((p) => p._id).join(',');
        if (!currentIds.length || currentIds.join(',') === baseline) return;

        const items = currentIds.map((id, index) => ({ id, sortOrder: index }));

        try {
            await reorderProducts({ items }).unwrap();
            toast.success('Product order updated successfully');
        } catch (err) {
            toast.error(getApiErrorMessage(err, 'Failed to update product order'));
            setDraftOrder(null);
            refetch();
        }
    };

    const handleOpenCreate = () => {
        setEditingProduct(null);
        setModalOpen(true);
    };

    const handleOpenEdit = (p: DigitalProduct) => {
        setEditingProduct(p);
        setModalOpen(true);
    };

    const handleTogglePublished = async (p: DigitalProduct) => {
        if (!p.isPublished && (!p.scriptFile?.url || !p.guidePdf?.url)) {
            toast.error('Cannot publish product without script file and guide PDF. Please edit the product and upload files.');
            return;
        }

        try {
            await updateProduct({
                id: p._id,
                data: { isPublished: !p.isPublished },
            }).unwrap();
            toast.success(p.isPublished ? 'Product moved to draft' : 'Product published successfully');
        } catch (err) {
            toast.error(getApiErrorMessage(err, 'Failed to update status'));
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
                <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                    <Package className="h-6 w-6 text-amber-500" />
                    Digital Products Management
                </h1>
            }
            subheading="Manage shortcut scripts, instruction guides, pricing, and downloadable assets sold through the storefront."
            buttons={
                <Button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 bg-[#ffd60a] font-bold text-black transition hover:bg-[#ffd60a]/90 shadow-sm"
                >
                    <Plus className="h-4 w-4" /> Add New Product
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
                                        placeholder="Search products by title or slug..."
                                        className="bg-gray-50/50 border-gray-200 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white"
                                    />
                                </div>
                                <select
                                    value={softwareFilter}
                                    onChange={(e) => setSoftwareFilter(e.target.value)}
                                    className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="">All Software</option>
                                    <option value="photoshop">Photoshop</option>
                                    <option value="illustrator">Illustrator</option>
                                    <option value="bundle">Combo Bundle</option>
                                    <option value="other">Other</option>
                                </select>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                            <p
                                className={`mt-3 flex items-center gap-1.5 text-[11px] font-medium ${
                                    isFilterActive ? 'text-amber-700' : 'text-gray-500'
                                }`}
                            >
                                <ArrowUpDown className="h-3.5 w-3.5 shrink-0" />
                                {isFilterActive
                                    ? 'Drag & drop ordering is paused while filters are active. Clear the filters to rearrange products.'
                                    : 'Drag the handle on the left of any row to change the storefront display order. Changes save automatically.'}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Product Table */}
                    <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-700">
                                <thead className="border-b border-gray-200 bg-gray-100 text-xs font-bold uppercase text-gray-800">
                                    <tr>
                                        <th className="w-10 px-3 py-4">
                                            <span className="sr-only">Reorder</span>
                                        </th>
                                        <th className="px-6 py-4">Product</th>
                                        <th className="px-6 py-4">Software</th>
                                        <th className="px-6 py-4">Price (BDT / INR)</th>
                                        <th className="px-6 py-4">Files</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Sales</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-gray-600 font-semibold">
                                                Loading digital products...
                                            </td>
                                        </tr>
                                    ) : displayProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-gray-600 font-semibold">
                                                No digital products found.
                                            </td>
                                        </tr>
                                    ) : (
                                        displayProducts.map((p, index) => {
                                            const bdtFree = getEffectiveBdtPrice(p) <= 0;
                                            const inrFree = getEffectiveInrPrice(p) <= 0;

                                            return (
                                                <tr
                                                    key={p._id}
                                                    draggable={!isFilterActive}
                                                    onDragStart={() => handleDragStart(index)}
                                                    onDragOver={(event) => handleDragOver(event, index)}
                                                    onDragEnd={handleDragEnd}
                                                    onDrop={(event) => event.preventDefault()}
                                                    className={`transition hover:bg-gray-50/80 ${
                                                        isFilterActive
                                                            ? ''
                                                            : 'cursor-move active:bg-amber-50/60'
                                                    }`}
                                                >
                                                    <td className="px-3 py-4 align-middle">
                                                        <span
                                                            title={
                                                                isFilterActive
                                                                    ? 'Clear filters to reorder'
                                                                    : 'Drag to reorder'
                                                            }
                                                            className={`inline-flex h-8 w-8 items-center justify-center rounded-md ${
                                                                isFilterActive
                                                                    ? 'cursor-not-allowed text-gray-300'
                                                                    : 'cursor-grab text-gray-400 hover:bg-gray-100 hover:text-gray-700 active:cursor-grabbing'
                                                            }`}
                                                        >
                                                            <GripVertical className="h-4 w-4" />
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
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
                                                        <div className="text-xs space-y-1">
                                                            <div className="flex items-center gap-1.5">
                                                                {bdtFree ? (
                                                                    <span className="font-bold text-emerald-800 text-sm">ফ্রি</span>
                                                                ) : p.discountPriceBDT != null && p.discountPriceBDT < p.priceBDT ? (
                                                                    <>
                                                                        <span className="font-medium text-gray-400 line-through decoration-red-500/70 text-xs">
                                                                            ৳{p.priceBDT}
                                                                        </span>
                                                                        <span className="text-emerald-800 font-bold text-sm">
                                                                            ৳{p.discountPriceBDT}
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-emerald-800 font-bold text-sm">
                                                                        ৳{p.priceBDT}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                {inrFree ? (
                                                                    <span className="font-bold text-amber-800 text-xs">ফ্রি</span>
                                                                ) : p.discountPriceINR != null && p.discountPriceINR < p.priceINR ? (
                                                                    <>
                                                                        <span className="font-medium text-gray-400 line-through decoration-red-500/70 text-[11px]">
                                                                            ₹{p.priceINR}
                                                                        </span>
                                                                        <span className="text-amber-800 font-bold text-xs">
                                                                            ₹{p.discountPriceINR}
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-amber-800 font-semibold text-xs">
                                                                        ₹{p.priceINR}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-xs text-gray-800 space-y-1">
                                                            <div className="flex items-center gap-1.5 truncate max-w-[180px] font-medium" title={p.scriptFile?.fileName || 'No script file uploaded'}>
                                                                <FileCode className={`h-3.5 w-3.5 shrink-0 ${p.scriptFile?.url ? 'text-amber-600' : 'text-gray-300'}`} />
                                                                <span className={`truncate ${p.scriptFile?.url ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                                                                    {p.scriptFile?.fileName || 'No script file'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 truncate max-w-[180px] font-medium" title={p.guidePdf?.fileName || 'No guide PDF uploaded'}>
                                                                <FileText className={`h-3.5 w-3.5 shrink-0 ${p.guidePdf?.url ? 'text-blue-600' : 'text-gray-300'}`} />
                                                                <span className={`truncate ${p.guidePdf?.url ? 'text-gray-600' : 'text-gray-400 italic'}`}>
                                                                    {p.guidePdf?.fileName || 'No guide PDF'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1 text-xs">
                                                            <span
                                                                className={`inline-flex items-center gap-1 font-bold ${
                                                                    p.isPublished ? 'text-emerald-700' : 'text-amber-700'
                                                                }`}
                                                            >
                                                                {p.isPublished ? (
                                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                                                ) : (
                                                                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                                                                )}
                                                                {p.isPublished ? 'Published' : 'Draft'}
                                                            </span>
                                                            {!p.isPublished && (!p.scriptFile?.url || !p.guidePdf?.url) && (
                                                                <span className="text-[10px] text-amber-600 font-medium">
                                                                    (Incomplete Files)
                                                                </span>
                                                            )}
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
                                                                title="Edit Product"
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(p._id, p.title)}
                                                                disabled={isDeleting}
                                                                className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                                                                title="Delete Product"
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
