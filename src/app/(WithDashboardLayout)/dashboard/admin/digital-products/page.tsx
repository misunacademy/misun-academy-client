import { Metadata } from 'next';
import { DigitalProductsClient } from './_components/DigitalProductsClient';

export const metadata: Metadata = {
    title: 'Digital Products | Admin Dashboard | Misun Academy',
    description: 'Manage shortcut scripts, digital products, and guides sold through the Bootcamp page.',
};

export default function DigitalProductsPage() {
    return <DigitalProductsClient />;
}
