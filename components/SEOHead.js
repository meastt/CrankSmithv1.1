import Head from 'next/head';

export default function SEOHead({ 
  title = "CrankSmith - Professional Bike Gear Calculator & Drivetrain Compatibility Tool",
  description = "Professional bike gear ratio calculator, drivetrain compatibility checker, and bike fit calculator. Perfect for cyclists, bike shops, and bike mechanics. Calculate optimal gearing for road, mountain, gravel, and touring bikes.",
  url = "https://cranksmith.com",
  image = "/og-image.jpg",
  keywords = "bike gear calculator, gear ratio calculator, drivetrain compatibility, bike fit calculator, cycling gear, bicycle gearing, bike setup, cycling tools, bike mechanics, cycling optimization",
  type = "website",
  structuredData = null,
  author = "CrankSmith",
  category = "cycling tools"
}) {
  
  // Default structured data for the site
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CrankSmith",
    "description": description,
    "url": url,
    "applicationCategory": "Sports & Recreation",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "CrankSmith",
      "url": url
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Cyclists, Bike Mechanics, Bike Shops"
    },
    "keywords": keywords,
    "inLanguage": "en-US",
    "isAccessibleForFree": true
  };

  const finalStructuredData = structuredData || defaultStructuredData;
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="language" content="en-US" />
      <meta name="category" content={category} />
      
      {/* Enhanced SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="revisit-after" content="1 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="referrer" content="origin-when-cross-origin" />
      
      {/* Geographic and Industry Targeting */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      <meta name="target" content="cyclists, bike mechanics, cycling enthusiasts" />
      <meta name="audience" content="cyclists" />
      <meta name="coverage" content="worldwide" />
      
      {/* Open Graph (Facebook/Social) Enhanced */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="CrankSmith" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content="CrankSmith - Professional Bike Gear Calculator" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Enhanced */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@cranksmithapp" />
      <meta name="twitter:creator" content="@cranksmithapp" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content="CrankSmith - Professional Bike Gear Calculator" />
      
      {/* Additional Platform Meta Tags */}
      <meta property="fb:app_id" content="CrankSmith" />
      <meta name="pinterest-rich-pin" content="true" />
      
      {/* Search Engine Optimization */}
      <link rel="canonical" href={url} />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData)
        }}
      />
      
      {/* Additional Bike-Specific Meta Tags */}
      <meta name="subject" content="Cycling Tools and Calculators" />
      <meta name="topic" content="Bicycle Gear Ratios and Compatibility" />
      <meta name="summary" content="Professional bike gear calculator and compatibility checker for cyclists" />
      <meta name="classification" content="Sports & Recreation - Cycling" />
      <meta name="owner" content="CrankSmith" />
      <meta name="url" content={url} />
      <meta name="identifier-URL" content={url} />
      <meta name="directory" content="submission" />
      <meta name="pagename" content={title} />
      <meta name="page-topic" content="cycling gear calculation" />
      <meta name="page-type" content="tool" />
      
      {/* Search Engine Verification Tags */}
      <meta name="google-site-verification" content="_OejAgyGekugOzvl7MqpGFmUY6cqxE1tF3frnHRb2vk" />
      <meta name='impact-site-verification' value='8d751d83-117e-4b87-b7c0-253d7bb08754' />
      {/* <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" /> */}
      {/* <meta name="yandex-verification" content="YOUR_YANDEX_VERIFICATION_CODE" /> */}
    </Head>
  );
} 