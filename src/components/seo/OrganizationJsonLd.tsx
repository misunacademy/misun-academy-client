const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://www.misun-academy.com';

const OrganizationJsonLd = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'MISUN Academy',
    url: siteUrl,
    description:
      'Build a successful career in the digital age by learning the right skills with MISUN Academy. From start to finish, we guide and support you to achieve your dreams in design and beyond.',
    foundingDate: '2024',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BD',
    },
    sameAs: [
      'https://www.facebook.com/misunacademy',
      'https://www.youtube.com/@misunacademy',
      'https://www.linkedin.com/company/misunacademy',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default OrganizationJsonLd;
