// src/lib/seo/generateMetadata.ts
import type { Metadata } from 'next';

interface GenerateMetadataParams {
    title: string;
    description: string;
    keywords?: string[];
    slug?: string; // e.g., 'courses'
    image?: string; // fallback to default
}

const BASE_URL = 'https://www.misun-academy.com';
const DEFAULT_IMAGE = `/default-og-image.png`;
const SITE_NAME = 'MISUN Academy';

export const generateMetadata = ({
    title,
    description,
    keywords = [],
    slug = '',
    image = DEFAULT_IMAGE,
}: GenerateMetadataParams): Metadata => {
    const url = `${BASE_URL}/${slug}`;
    const finalImage = `${BASE_URL}/preview/${image}`;

    return {
        title,
        description,
        keywords,
        metadataBase: new URL(BASE_URL),
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: SITE_NAME,
            images: [
                {
                    url: finalImage,
                    width: 1200,
                    height: 630,
                    alt: `${title} | ${SITE_NAME}`,
                },
            ],
            locale: 'bn_BD',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [finalImage],
        },
    };
};
