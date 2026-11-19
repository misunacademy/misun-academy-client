import { Metadata } from 'next';
import { DigitalProductOrdersClient } from './_components/DigitalProductOrdersClient';

export const metadata: Metadata = {
    title: 'Digital Product Orders | Admin Dashboard | Misun Academy',
    description: 'Verify PhonePe manual payments and review digital product orders from the Bootcamp page.',
};

export default function DigitalProductOrdersPage() {
    return <DigitalProductOrdersClient />;
}
