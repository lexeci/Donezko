/**
 * @constant NO_INDEX_PAGE
 * SEO configuration for pages that should not be indexed by search engines.
 * This configuration sets the "index" and "follow" properties of the robots meta tag to `false`.
 * This ensures that the page will not be indexed and its links will not be followed by search engine crawlers.
 *
 * @example
 * const pageMeta = NO_INDEX_PAGE; // { robots: { index: false, follow: false } }
 */
export const NO_INDEX_PAGE: { robots: { index: boolean; follow: boolean } } = {
    robots: {index: false, follow: false},
};

/**
 * @constant INDEX_PAGE
 * SEO configuration for pages that should be indexed by search engines.
 * This configuration sets the "index" and "follow" properties of the robots meta tag to `true`.
 * This ensures that the page will be indexed and its links will be followed by search engine crawlers.
 *
 * @example
 * const pageMeta = INDEX_PAGE; // { robots: { index: true, follow: true } }
 */
export const INDEX_PAGE: { robots: { index: boolean; follow: boolean } } = {
    robots: {index: true, follow: true},
};

/**
 * @constant SITE_NAME
 * The name of the site used for branding and display purposes.
 * This value is used across the site for consistency in naming and branding.
 *
 * @example
 * const siteName = SITE_NAME; // 'TPlanner'
 */
export const SITE_NAME: string = 'TPlanner';
