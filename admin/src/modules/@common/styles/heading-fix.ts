import { createGlobalStyle } from 'styled-components';

/**
 * The nested DesignSystemProvider injects a GlobalStyle with `h1-h6 { font: unset }`
 * which strips heading styles set by Strapi's own provider. This global override
 * restores the correct Typography variant sizes for headings.
 */
export const HeadingFixGlobalStyle = createGlobalStyle`
  [data-strapi-header] h1,
  [data-strapi-header] h2 {
    font-size: 3.2rem !important;
    font-weight: 600 !important;
    line-height: 1.25 !important;
  }
  [data-strapi-header-sticky] h1,
  [data-strapi-header-sticky] h2 {
    font-size: 1.8rem !important;
    font-weight: 600 !important;
    line-height: 1.22 !important;
  }
`;
