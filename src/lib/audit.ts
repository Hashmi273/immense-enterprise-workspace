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

/**
 * Safely records an audit log entry in the PostgreSQL audit_logs table.
 * Strips any sensitive credentials, passwords, or tokens.
 */
export async function logAuditEvent(params: LogAuditParams): Promise<void> {
  try {
    const sanitizedMetadata = { ...params.metadata };
    delete sanitizedMetadata.password;
    delete sanitizedMetadata.token;
    delete sanitizedMetadata.accessToken;
    delete sanitizedMetadata.refreshToken;

    await supabase.from("audit_logs").insert({
      action: params.action,
      user_id: params.userId || null,
      organization_id: params.organizationId || null,
      application_id: params.applicationId || null,
      target_type: params.targetType || null,
      target_id: params.targetId || null,
      metadata: sanitizedMetadata,
    });
  } catch (err) {
    // Non-blocking catch to prevent application halt on audit failure
    console.warn("[Audit] Failed to record audit log entry:", err);
  }
}
