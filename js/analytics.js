export const GA_MEASUREMENT_ID = "G-J6NS8CCNWN";

let previousVirtualPath = null;
let previousPageLocation = document.referrer || null;

function normalizeVirtualPath(path) {
  return `/${String(path).replace(/^\/+/, "")}`;
}

function virtualLocation(path) {
  const url = new URL(window.location.href);
  url.hash = path;
  return url.href;
}

export function trackPageView(path, title) {
  const virtualPath = normalizeVirtualPath(path);
  if (virtualPath === previousVirtualPath) return;

  const pageLocation = virtualLocation(virtualPath);
  const parameters = {
    page_location: pageLocation,
    page_title: title,
  };
  if (previousPageLocation) parameters.page_referrer = previousPageLocation;

  if (typeof window.gtag === "function") {
    window.gtag("event", "page_view", parameters);
  }

  previousVirtualPath = virtualPath;
  previousPageLocation = pageLocation;
}
