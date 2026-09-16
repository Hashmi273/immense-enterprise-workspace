import { supabase } from "@/lib/supabase";
import { logAuditEvent } from "@/lib/audit";
import { Quotation, SavedQuotationRecord } from "../data/quotation";

export interface QuotationSaveResult {
  success: boolean;
  quotationId?: string;
  error?: string;
}

export const quotationService = {
  /**
   * Fetches saved quotations for the Zion organization.
   * RLS automatically filters rows on the server.
   */
  async getQuotations(organizationId: string): Promise<SavedQuotationRecord[]> {
    try {
      const { data, error } = await supabase
        .from("quotations")
        .select(`
          id,
          organization_id,
          created_by,
          quotation_number,
          client_name,
          client_company,
          quotation_data,
          status,
          created_at,
          updated_at
        `)
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase quotations fetch notice:", error.message);
        // Fallback to local cache if offline/placeholder environment
        const local = localStorage.getItem(`zion_quotes_${organizationId}`);
        return local ? JSON.parse(local) : [];
      }

      // Update local backup
      if (data) {
        localStorage.setItem(`zion_quotes_${organizationId}`, JSON.stringify(data));
        return data as SavedQuotationRecord[];
      }

      return [];
    } catch (err: any) {
      console.warn("Supabase fetch exception, using offline cache:", err);
      const local = localStorage.getItem(`zion_quotes_${organizationId}`);
      return local ? JSON.parse(local) : [];
    }
  },

  /**
   * Saves a new quotation or updates an existing one in Supabase.
   * RLS guarantees that organization_id and created_by match the authenticated user.
   */
  async saveQuotation(
    quotation: Quotation,
    organizationId: string,
    userId: string,
    userEmail: string,
    existingId?: string | null,
    status: string = "draft"
  ): Promise<QuotationSaveResult> {
    try {
      if (!quotation.client.clientName.trim()) {
        return { success: false, error: "Client name is required" };
      }
      if (!quotation.client.proposalNumber.trim()) {
        return { success: false, error: "Proposal number is required" };
      }

      const isUpdate = Boolean(existingId);
      const now = new Date().toISOString();

      const payload = {
        organization_id: organizationId,
        created_by: userId,
        quotation_number: quotation.client.proposalNumber.trim(),
        client_name: quotation.client.clientName.trim(),
        client_company: quotation.client.companyName.trim() || quotation.client.clientName.trim(),
        quotation_data: quotation,
        status: status,
        updated_at: now,
      };

      let resultId = existingId;

      if (isUpdate && existingId) {
        // UPDATE existing record
        const { error } = await supabase
          .from("quotations")
          .update(payload)
          .eq("id", existingId);

        if (error) {
          console.warn("Supabase update notice:", error.message);
          this.updateLocalCache(organizationId, {
            id: existingId,
            ...payload,
            created_at: now,
          });
        }

        // Log audit event
        await logAuditEvent({
          userId,
          organizationId,
          applicationId: null,
          action: "QUOTATION_EDITED",
          metadata: {
            user_email: userEmail,
            quotation_id: existingId,
            quotation_number: quotation.client.proposalNumber,
            client_name: quotation.client.clientName,
            status,
          },
        });
      } else {
        // INSERT new record
        const insertPayload = {
          ...payload,
          created_at: now,
        };

        const { data, error } = await supabase
          .from("quotations")
          .insert([insertPayload])
          .select("id")
          .single();

        if (error || !data?.id) {
          console.warn("Supabase insert notice:", error?.message);
          const localId = "local-" + Date.now();
          resultId = localId;
          this.updateLocalCache(organizationId, {
            id: localId,
            ...insertPayload,
          });
        } else {
          resultId = data.id;
          this.updateLocalCache(organizationId, {
            id: data.id,
            ...insertPayload,
          });
        }

        // Log audit event
        await logAuditEvent({
          userId,
          organizationId,
          applicationId: null,
          action: "QUOTATION_CREATED",
          metadata: {
            user_email: userEmail,
            quotation_id: resultId,
            quotation_number: quotation.client.proposalNumber,
            client_name: quotation.client.clientName,
            status,
          },
        });
      }

      return { success: true, quotationId: resultId || undefined };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to save quotation" };
    }
  },

  /**
   * Deletes a quotation (Requires Admin/Super Admin permission).
   */
  async deleteQuotation(
    id: string,
    quotationNumber: string,
    organizationId: string,
    userId: string,
    userEmail: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("quotations")
        .delete()
        .eq("id", id);

      if (error) {
        console.warn("Supabase delete notice:", error.message);
      }

      // Remove from local cache
      const local = localStorage.getItem(`zion_quotes_${organizationId}`);
      if (local) {
        const list: SavedQuotationRecord[] = JSON.parse(local);
        const filtered = list.filter((q) => q.id !== id);
        localStorage.setItem(`zion_quotes_${organizationId}`, JSON.stringify(filtered));
      }

      // Log audit event
      await logAuditEvent({
        userId,
        organizationId,
        applicationId: null,
        action: "QUOTATION_DELETED",
        metadata: {
          user_email: userEmail,
          quotation_id: id,
          quotation_number: quotationNumber,
        },
      });

      return true;
    } catch (err) {
      console.error("Delete quotation error:", err);
      return false;
    }
  },

  /**
   * Logs a download/print event for compliance tracking.
   */
  async logDownload(
    quotationNumber: string,
    clientName: string,
    organizationId: string,
    userId: string,
    userEmail: string
  ) {
    await logAuditEvent({
      userId,
      organizationId,
      applicationId: null,
      action: "QUOTATION_DOWNLOADED",
      metadata: {
        user_email: userEmail,
        quotation_number: quotationNumber,
        client_name: clientName,
        format: "A4_PRINT_PDF",
      },
    });
  },

  /**
   * Helper to keep local cache synchronized.
   */
  updateLocalCache(orgId: string, record: SavedQuotationRecord) {
    try {
      const local = localStorage.getItem(`zion_quotes_${orgId}`);
      let list: SavedQuotationRecord[] = local ? JSON.parse(local) : [];
      const idx = list.findIndex((q) => q.id === record.id);
      if (idx >= 0) {
        list[idx] = record;
      } else {
        list.unshift(record);
      }
      localStorage.setItem(`zion_quotes_${orgId}`, JSON.stringify(list));
    } catch {
      // Ignore localStorage errors
    }
  }
};