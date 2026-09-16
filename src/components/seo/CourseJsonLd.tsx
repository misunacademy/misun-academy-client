const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://www.misun-academy.com';

type CourseJsonLdProps = {
  name: string;
  description: string;
  slug: string;
  providerName?: string;
  image?: string;
  courseCode?: string;
};

const CourseJsonLd = ({ name, description, slug, providerName, image, courseCode }: CourseJsonLdProps) => {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url: `${siteUrl}/courses/${slug}`,
    provider: {
      '@type': 'EducationalOrganization',
      name: providerName || 'MISUN Academy',
      sameAs: siteUrl,
    },
  };

  if (image) {
    jsonLd.image = image;
  }

  if (courseCode) {
    jsonLd.courseCode = courseCode;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default CourseJsonLd;
