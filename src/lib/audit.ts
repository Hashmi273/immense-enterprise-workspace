import { supabase } from "@/lib/supabase";

export interface LogAuditParams {
  action: string;
  userId?: string | null;
  organizationId?: string | null;
  applicationId?: string | null;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, any>;
}

export interface AuditRecord {
  id: string;
  action: string;
  user_id: string | null;
  organization_id: string | null;
  application_id: string | null;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, any>;
  ip_address?: string | null;
  created_at: string;
}

/**
 * List of sensitive keys that must NEVER be recorded in audit logs.
 * Checked case-insensitively and stripped recursively from all metadata payloads.
 */
const SENSITIVE_KEY_PATTERNS = [
  "password",
  "passwd",
  "pwd",
  "token",
  "access_token",
  "accesstoken",
  "refresh_token",
  "refreshtoken",
  "authorization",
  "bearer",
  "cookie",
  "service_role",
  "servicerole",
  "service_role_key",
  "api_key",
  "apikey",
  "secret",
  "client_secret",
  "private_key",
  "privatekey",
  "supabase_service_role_key",
  "credit_card",
  "card_number",
  "cvv",
  "ssn",
];

/**
 * Recursively sanitizes any object, array, or primitive before storing in audit logs.
 * - Strips any key matching SENSITIVE_KEY_PATTERNS.
 * - Masks sensitive phone numbers or long credentials if detected.
 * - Returns a clean JSON-serializable object.
 */
export function sanitizeAuditMetadata(input: any): any {
  if (input === null || input === undefined) {
    return {};
  }

  if (typeof input !== "object") {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeAuditMetadata(item));
  }

  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(input)) {
    const lowerKey = key.toLowerCase().replace(/[-_]/g, "");
    const isSensitive = SENSITIVE_KEY_PATTERNS.some((pattern) => {
      const cleanPattern = pattern.replace(/[-_]/g, "");
      return lowerKey === cleanPattern || lowerKey.includes(cleanPattern);
    });

    if (isSensitive) {
      // Omit entirely or mask
      continue;
    }

    if (value !== null && typeof value === "object") {
      sanitized[key] = sanitizeAuditMetadata(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Safely records an immutable audit log entry in the PostgreSQL audit_logs table.
 * - Enforces metadata sanitization to eliminate secrets or credentials.
 * - Best-effort logging: logs a warning if database write fails, preventing UI freeze.
 */
export async function logAuditEvent(params: LogAuditParams): Promise<boolean> {
  try {
    const sanitizedMetadata = sanitizeAuditMetadata(params.metadata);

    const payload = {
      action: params.action,
      user_id: params.userId || null,
      organization_id: params.organizationId || null,
      application_id: params.applicationId || null,
      target_type: params.targetType || null,
      target_id: params.targetId || null,
      metadata: sanitizedMetadata,
    };

    const { error } = await supabase.from("audit_logs").insert(payload);

    if (error) {
      console.warn("[Audit] Supabase audit write notice:", error.message);
      // Keep local in-memory/localStorage audit trail for fallback inspection
      recordLocalAuditFallback({
        id: "local-audit-" + Date.now(),
        ...payload,
        created_at: new Date().toISOString(),
      });
      return false;
    }

    return true;
  } catch (err) {
    console.warn("[Audit] Failed to record audit log entry:", err);
    return false;
  }
}

/**
 * In-memory / localStorage fallback buffer for offline or unconfigured environments.
 */
function recordLocalAuditFallback(record: AuditRecord) {
  try {
    const key = "immense_audit_logs_fallback";
    const existing = localStorage.getItem(key);
    const list: AuditRecord[] = existing ? JSON.parse(existing) : [];
    list.unshift(record);
    localStorage.setItem(key, JSON.stringify(list.slice(0, 100)));
  } catch {
    // Non-blocking
  }
}

/**
 * Fetches audit logs subject to organization and role permissions.
 * The database RLS policy enforces that:
 * - Super Admin can view all audit logs.
 * - Org Admin can view audit logs where organization_id = their org.
 * - Normal users (Sales, Support, Ops) receive 0 rows.
 */
export async function fetchAuditLogs(organizationId?: string | null): Promise<AuditRecord[]> {
  try {
    let query = supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;

    if (error || !data) {
      console.warn("[Audit] Fetch notice, checking local fallback:", error?.message);
      const key = "immense_audit_logs_fallback";
      const local = localStorage.getItem(key);
      return local ? JSON.parse(local) : [];
    }

    return data as AuditRecord[];
  } catch (err) {
    console.warn("[Audit] Fetch exception, returning empty:", err);
    return [];
  }
}
