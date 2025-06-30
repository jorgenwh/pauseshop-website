import { Helmet } from '@dr.pogodin/react-helmet';

interface SeoProps {
    title?: string;
    description?: string;
    canonical?: string;
    robots?: string;
}

export const Seo = ({ title, description, canonical, robots }: SeoProps) => {
    const appTitle = 'PauseShop';
    const appDescription = 'PauseShop helps you find products from images. Upload a photo and discover similar items from top retailers. Your intelligent shopping companion.';
    const siteUrl = 'https://pauseshop.net';

    const pageTitle = title ? `${title} | ${appTitle}` : appTitle;
    const pageDescription = description || appDescription;
    const pageUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

    return (
        <Helmet>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />
            {robots && <meta name="robots" content={robots} />}
            <link rel="canonical" href={pageUrl} />

            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={appTitle} />
            <meta property="og:image" content={`${siteUrl}/icons/icon-128-trim-color.png`} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={pageDescription} />
            <meta name="twitter:image" content={`${siteUrl}/icons/icon-128-trim-color.png`} />
        </Helmet>
    );
};