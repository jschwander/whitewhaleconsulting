import Script from 'next/script';
import { APEX_HOST, CANONICAL_HOST } from '@/lib/site';

/**
 * Runs before React so client-side navigations never start on the apex host
 * (avoids cross-origin RSC fetches between whitewhaleconsulting.com and www).
 */
export default function CanonicalHostScript() {
  const script = `(function(){var h=location.hostname;if(h==="${APEX_HOST}"){location.replace("https://${CANONICAL_HOST}"+location.pathname+location.search+location.hash);}})();`;

  return (
    <Script id="canonical-host-redirect" strategy="beforeInteractive">
      {script}
    </Script>
  );
}
