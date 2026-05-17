// Round 3 PT hardening — DOMPurify wrapper for the rare case where we must
// render user-supplied HTML. Default React JSX text rendering already escapes
// content, so prefer that. Use this only when a feature genuinely needs HTML
// (rich-text KB articles, AI-generated drafts with formatting, etc.).

import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "code",
  "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "a", "blockquote", "hr",
];

const ALLOWED_ATTR = ["href", "title", "target", "rel"];

export function sanitizeHtml(input: string): string {
  if (typeof window === "undefined") return ""; // SSR safety
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Force external links to safe defaults; reject javascript: URIs.
    ADD_ATTR: ["target", "rel"],
  });
}
