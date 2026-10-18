import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { resolvePublicSeo } from "../seo/publicSeoMap";

function upsertMeta(attribute, key, value) {
  let node = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attribute, key);
    document.head.appendChild(node);
  }
  node.setAttribute("content", value);
}

function upsertCanonical(href) {
  let node = document.head.querySelector('link[rel="canonical"]');
  if (!node) {
    node = document.createElement("link");
    node.setAttribute("rel", "canonical");
    document.head.appendChild(node);
  }
  node.setAttribute("href", href);
}

function DocumentSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = resolvePublicSeo(pathname);
    document.title = seo.title;
    upsertMeta("name", "description", seo.description);
    upsertMeta("name", "robots", seo.robots);
    upsertCanonical(seo.canonical);
    upsertMeta("property", "og:title", seo.title);
    upsertMeta("property", "og:description", seo.description);
    upsertMeta("property", "og:url", seo.canonical);
    upsertMeta("name", "twitter:title", seo.title);
    upsertMeta("name", "twitter:description", seo.description);
  }, [pathname]);

  return null;
}

export default DocumentSeo;
