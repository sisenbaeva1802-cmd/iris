import Script from "next/script";
// The IRIS UI engine lives in /public/app/bilimquiz.js and talks to /api/extract and /api/generate.
export default function Page() {
  return (<>
    <nav suppressHydrationWarning><div className="logo" data-go="home" id="lg" /><div className="links" id="lk" /><div className="um" id="um" /></nav>
    <main id="app" suppressHydrationWarning />
    <Script src="/app/bilimquiz.js" strategy="afterInteractive" />
  </>);
}
