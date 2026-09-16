/**
 * Enterprise Security Utilities
 * Defense-in-depth sanitization, input validation, and open-redirect protection.
 */

/**
 * Validates whether a given path is a safe internal relative path.
 * Defends against open-redirect vulnerabilities:
 * - Must be a string starting with '/'
 * - Must NOT start with '//' (protocol-relative URL)
 * - Must NOT contain backslashes '/\'
 * - Must NOT contain protocol indicators '://'
 * - Must NOT contain javascript: or data: URIs
 * - Must NOT contain CR/LF control characters (HTTP response splitting)
 */
export function isSafeInternalRedirect(path: unknown): boolean {
  if (typeof path !== "string") return false;
  
  const trimmed = path.trim();
  
  // Must start with single slash
  if (!trimmed.startsWith("/")) return false;
  
  // Protocol-relative check
  if (trimmed.startsWith("//") || trimmed.startsWith("/\\")) return false;
  
  // Protocol check
  if (trimmed.includes("://")) return false;
  
  // Scheme checks
  const lower = trimmed.toLowerCase();
  if (
    lower.includes("javascript:") ||
    lower.includes("data:") ||
    lower.includes("vbscript:")
  ) {
    return false;
  }
  
  // Control character check (CRLF)
  if (/[\r\n\t\0]/.test(trimmed)) return false;
  
  return true;
}

/**
 * Sanitizes an intended destination URL for redirects.
 * Returns the destination if it is a safe internal path, or fallback otherwise.
 */
export function sanitizeInternalRedirect(
  path: unknown,
  fallback = "/workspace"
): string {
  if (isSafeInternalRedirect(path)) {
    return (path as string).trim();
  }
  return fallback;
}

/**
 * Basic input string sanitizer to prevent control characters and trim whitespace
 */
export function sanitizeInputString(val: unknown, maxLength = 1000): string {
  if (typeof val !== "string") return "";
  // Strip control characters except newline and tab
  const cleaned = val.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  return cleaned.trim().slice(0, maxLength);
}

/**
 * Basic email format validator
 */
export function isValidEmail(email: unknown): boolean {
  if (typeof email !== "string") return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
}

/**
 * Validates recognized entity slug
 */
export function isValidEntitySlug(slug: unknown): boolean {
  return slug === "immense-air" || slug === "zion";
}
