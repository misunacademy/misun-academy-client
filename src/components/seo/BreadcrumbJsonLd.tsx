'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

const BreadcrumbJsonLd = () => {
    const pathname = usePathname();

    // Map routes to breadcrumb names and URLs
    const breadcrumbMap: { [key: string]: { name: string; item: string } } = {
        '/': {
            name: 'হোম',
            item: 'https://www.misun-academy.com/'
        },
        '/about': {
            name: 'আমাদের সম্পর্কে',
            item: 'https://www.misun-academy.com/about'
        },
        '/courses': {
            name: 'কোর্স সম্পর্কে',
            item: 'https://www.misun-academy.com/courses',
        },
        '/checkout': {
            name: 'এনরোল করুন',
            item: 'https://www.misun-academy.com/checkout',
        },
    };

    // Generate breadcrumb trail
    const breadcrumbs = Object.entries(breadcrumbMap)
        .filter(([route]) => pathname.startsWith(route))
        .map(([, value], index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: value.name,
            item: value.item,
        }));

    if (!breadcrumbs.length) return null;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs,
    };

    return (
        <Script
            id="breadcrumb-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
};

export default BreadcrumbJsonLd;
