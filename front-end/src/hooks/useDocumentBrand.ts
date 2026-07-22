import { useEffect } from 'react';
import { BRAND } from '@/config/brand';

/** Aplica título e metadados institucionais no document. */
export function useDocumentBrand() {
  useEffect(() => {
    document.title = BRAND.documentTitle;

    const ensureMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    ensureMeta('description', BRAND.metaDescription);
    ensureMeta('theme-color', BRAND.themeColor);
    ensureMeta('application-name', BRAND.productName);
    ensureMeta('apple-mobile-web-app-title', BRAND.shortName);
  }, []);
}
