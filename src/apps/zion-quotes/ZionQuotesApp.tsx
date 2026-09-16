import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { QuotationDocument } from "./components/QuotationDocument";
import { PreviewFocusContext } from "./components/preview-focus";
import {
  PRODUCT_LABELS,
  computeTotal,
  defaultQuotation,
  type Product,
  type Quotation,
  type SavedQuotationRecord,
} from "./data/quotation";
import { quotationService } from "./services/quotationService";
import { hasPermission } from "@/lib/authorization";
import "./styles/quotation.css";
import {
  ArrowLeft,
  Save,
  Printer,
  Plus,
  History,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  ExternalLink,
  ChevronRight,
  Edit3,
} from "lucide-react";

const MM = 96 / 25.4;
const PAGE_W = 210 * MM;
const PAGE_H = 297 * MM;

function Field({
  label,
  value,
  onChange,
  onFocusPreview,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onFocusPreview?: () => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-brand-ink/60">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onFocus={onFocusPreview}
        onChange={(e) => {
          onChange(e.target.value);
          onFocusPreview?.();
        }}
        className="w-full rounded-lg border border-brand-line bg-white px-3 py-2 text-sm text-navy outline-none transition-all placeholder:text-brand-ink/35 focus:border-navy focus:ring-4 focus:ring-navy/10"
      />
    </label>
  );
}

function EyeButton({ onClick, title }: { onClick: () => void; title: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-brand-line bg-white text-brand-ink/60 transition-colors hover:border-navy hover:text-navy"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </button>
  );
}

function Card({
  title,
  subtitle,
  children,
  right,
  innerRef,
  active,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
  innerRef?: (el: HTMLElement | null) => void;
  active?: boolean;
}) {
  return (
    <section
      ref={innerRef}
      className={`fade-up scroll-mt-24 rounded-2xl border bg-white p-5 shadow-panel transition-colors ${
        active ? "border-navy/60 ring-4 ring-navy/10" : "border-brand-line"
      }`}
    >
      <header className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-navy">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-brand-ink/60">{subtitle}</p> : null}
        </div>
        {right}
      </header>
      {children}
    </section>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
        on ? "bg-navy" : "bg-brand-line"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
          on ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

type ZoomMode = number | "fit-width" | "fit-page";

export function ZionQuotesApp() {
  const { user, profile, organization, role, permissions } = useAuth();

  const [data, setData] = useState<Quotation>(defaultQuotation);
  const [currentQuotationId, setCurrentQuotationId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState<"editor" | "history">("editor");
  const [savedQuotations, setSavedQuotations] = useState<SavedQuotationRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [openKey, setOpenKey] = useState<string | null>("bulkSms");
  const [highlight, setHighlight] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [zoom, setZoom] = useState<ZoomMode>("fit-width");
  const [scale, setScale] = useState(1);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const editorRefs = useRef<Record<string, HTMLElement | null>>({});
  const glowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canDeleteQuotation = hasPermission(profile, role, permissions, "delete_quotation");

  const loadHistory = useCallback(async () => {
    if (!organization?.id) return;
    setIsLoadingHistory(true);
    try {
      const list = await quotationService.getQuotations(organization.id);
      setSavedQuotations(list);
    } catch (err) {
      console.error("Failed to load quotation history", err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [organization?.id]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    setData((d) =>
      d.client.date
        ? d
        : { ...d, client: { ...d.client, date: new Date().toLocaleDateString("en-GB") } },
    );
  }, []);

  /* ------------------------------- zoom ------------------------------- */
  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const apply = () => {
      if (typeof zoom === "number") return setScale(zoom);
      const w = (el.clientWidth - 48) / PAGE_W;
      if (zoom === "fit-width") return setScale(Math.min(1.5, Math.max(0.2, w)));
      const h = (el.clientHeight - 48) / PAGE_H;
      setScale(Math.min(1.5, Math.max(0.2, Math.min(w, h))));
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [zoom]);

  /* ---------------------- preview navigation --------------------- */
  const scrollPreviewTo = useCallback((el: HTMLElement | null) => {
    const scroller = scrollerRef.current;
    if (!el || !scroller) return;
    const top =
      el.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top +
      scroller.scrollTop -
      scroller.clientHeight / 2 +
      el.getBoundingClientRect().height / 2;
    scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, []);

  const focusPreview = useCallback(
    (focusId: string) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const el = scroller.querySelector<HTMLElement>(`[data-focus="${focusId}"]`);
      if (!el) return;
      scrollPreviewTo(el);
      setHighlight(focusId);
      if (glowTimer.current) clearTimeout(glowTimer.current);
      glowTimer.current = setTimeout(() => setHighlight(null), 2000);
    },
    [scrollPreviewTo],
  );

  const goToPage = useCallback((pageId: string) => {
    const scroller = scrollerRef.current;
    const el = scroller?.querySelector<HTMLElement>(`#page-${CSS.escape(pageId)}`);
    if (!scroller || !el) return;
    const top =
      el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
    scroller.scrollTo({ top: Math.max(0, top - 12), behavior: "smooth" });
  }, []);

  /* --------------- preview click -> open editor section --------------- */
  const onSelect = useCallback((focusId: string) => {
    const section = focusId.split(":")[0] ?? "client";
    setActiveSection(section);
    if (section !== "client" && section !== "manager" && section !== "contact") {
      setOpenKey(section);
    }
    const target =
      editorRefs.current[section === "contact" ? "manager" : section] ?? editorRefs.current["client"];
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setActiveSection(null), 2000);
  }, []);

  const enabledCount = data.products.filter((p) => p.enabled).length;
  const pageCount = enabledCount + 2;

  const grandTotal = useMemo(
    () =>
      data.products
        .filter((p) => p.enabled)
        .reduce((sum, p) => {
          const explicit = Number(p.pricing.total);
          return sum + (explicit > 0 ? explicit : computeTotal(p.pricing));
        }, 0),
    [data.products],
  );

  const pages = useMemo(
    () => [
      { id: "cover", label: "Cover" },
      ...data.products.filter((p) => p.enabled).map((p) => ({ id: p.key, label: PRODUCT_LABELS[p.key] })),
      { id: "contact", label: "Terms & Contact" },
    ],
    [data.products],
  );

  const patchProduct = (key: string, patch: Partial<Product>) => {
    setIsDirty(true);
    setData((d) => ({
      ...d,
      products: d.products.map((p) => (p.key === key ? { ...p, ...patch } : p)),
    }));
  };

  const setEditorRef = (key: string) => (el: HTMLElement | null) => {
    editorRefs.current[key] = el;
  };

  const handleNewQuotation = () => {
    if (isDirty) {
      const confirmDiscard = window.confirm(
        "You have unsaved changes. Discard and create a new quotation?"
      );
      if (!confirmDiscard) return;
    }
    const fresh = defaultQuotation();
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    fresh.client.proposalNumber = `ZM/${new Date().getFullYear()}/${randomSeq}`;
    setData(fresh);
    setCurrentQuotationId(null);
    setIsDirty(false);
    setActiveTab("editor");
    setSaveMessage(null);
  };

  const handleSaveQuotation = async () => {
    if (!organization?.id || !user?.id) {
      setSaveMessage({
        type: "error",
        text: "Cannot save: User organization identity is missing.",
      });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    const result = await quotationService.saveQuotation(
      data,
      organization.id,
      user.id,
      user.email || "",
      currentQuotationId,
      "draft"
    );

    setIsSaving(false);
    if (result.success) {
      setIsDirty(false);
      if (result.quotationId) {
        setCurrentQuotationId(result.quotationId);
      }
      setSaveMessage({
        type: "success",
        text: currentQuotationId
          ? "Quotation updated in cloud successfully!"
          : "Quotation saved to cloud successfully!",
      });
      loadHistory();
      setTimeout(() => setSaveMessage(null), 4000);
    } else {
      setSaveMessage({
        type: "error",
        text: result.error || "Failed to save quotation to Supabase.",
      });
    }
  };

  const handlePrint = () => {
    if (organization?.id && user?.id) {
      quotationService.logDownload(
        data.client.proposalNumber,
        data.client.clientName,
        organization.id,
        user.id,
        user.email || ""
      );
    }
    window.print();
  };

  const handleLoadSavedQuotation = (record: SavedQuotationRecord) => {
    if (isDirty) {
      const confirmDiscard = window.confirm(
        "You have unsaved changes. Discard and load this quotation?"
      );
      if (!confirmDiscard) return;
    }
    setData(record.quotation_data);
    setCurrentQuotationId(record.id);
    setIsDirty(false);
    setActiveTab("editor");
  };

  const handleDeleteSavedQuotation = async (
    record: SavedQuotationRecord,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (!canDeleteQuotation) {
      alert("You do not have permission to delete quotations.");
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to delete proposal ${record.quotation_number} (${record.client_name})?`
    );
    if (!confirmed || !organization?.id || !user?.id) return;

    const ok = await quotationService.deleteQuotation(
      record.id,
      record.quotation_number,
      organization.id,
      user.id,
      user.email || ""
    );

    if (ok) {
      if (currentQuotationId === record.id) {
        handleNewQuotation();
      }
      loadHistory();
    }
  };

  return (
    <div className="min-h-screen bg-brand-grey">
      <header className="no-print sticky top-0 z-30 border-b border-brand-line bg-white/95 backdrop-blur shadow-sm">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center space-x-3">
            <Link
              to="/workspace"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-ink/60 hover:text-navy transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Workspace</span>
            </Link>
            <span className="text-brand-line">|</span>
            <div className="flex items-center space-x-2.5">
              <div className="flex h-8 items-center justify-center rounded-lg bg-white px-2 py-0.5 border border-brand-line shadow-sm">
                <img src="/zion-logo.png" alt="Zion Marketing" className="h-5 w-auto object-contain" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-navy leading-tight flex items-center gap-2">
                  <span>Zion Quotation Manager</span>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Live
                  </span>
                </h1>
                <p className="text-[11px] text-brand-ink/60">
                  {organization?.name || "Zion Marketing"} &middot; High-Fidelity A4 Proposals
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-brand-line text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("editor")}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
                  activeTab === "editor"
                    ? "bg-white text-navy shadow-sm"
                    : "text-brand-ink/70 hover:text-navy"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Proposal Editor</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("history");
                  loadHistory();
                }}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
                  activeTab === "history"
                    ? "bg-white text-navy shadow-sm"
                    : "text-brand-ink/70 hover:text-navy"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Saved Proposals ({savedQuotations.length})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleNewQuotation}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-brand-ink bg-white border border-brand-line rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>

            <button
              type="button"
              onClick={handleSaveQuotation}
              disabled={isSaving}
              className={`inline-flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold text-white rounded-lg transition-all shadow-panel ${
                isDirty
                  ? "bg-[#FF6B00] hover:bg-[#e05e00] animate-pulse"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : currentQuotationId ? "Update Cloud" : "Save Quotation"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold text-white bg-navy hover:bg-navy-deep rounded-lg transition-all shadow-panel"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Generate PDF</span>
            </button>
          </div>
        </div>

        {saveMessage && (
          <div
            className={`px-6 py-2 text-xs font-semibold flex items-center justify-between border-t ${
              saveMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            <div className="flex items-center space-x-2">
              {saveMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <span>{saveMessage.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setSaveMessage(null)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              &times;
            </button>
          </div>
        )}
      </header>

      {activeTab === "history" ? (
        <div className="max-w-5xl mx-auto px-5 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-navy">Quotation History</h2>
              <p className="text-xs text-brand-ink/60">
                Saved proposals for {organization?.name || "Zion Marketing"} protected by PostgreSQL RLS.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("editor")}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-600 hover:underline"
            >
              <span>Return to Proposal Editor</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-brand-line shadow-panel overflow-hidden">
            {isLoadingHistory ? (
              <div className="p-12 text-center text-brand-ink/50 text-sm">
                <Clock className="w-6 h-6 animate-spin mx-auto mb-2 text-navy" />
                Loading organization quotation records...
              </div>
            ) : savedQuotations.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <FileText className="w-10 h-10 text-brand-ink/30 mx-auto" />
                <h3 className="text-sm font-bold text-navy">No Saved Proposals Yet</h3>
                <p className="text-xs text-brand-ink/60 max-w-sm mx-auto">
                  Create a new proposal in the editor and click "Save Quotation" to store it securely in Supabase.
                </p>
                <button
                  type="button"
                  onClick={handleNewQuotation}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-navy text-white rounded-lg hover:bg-navy-deep transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Quotation</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-brand-line text-brand-ink/70 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Proposal Number</th>
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Company</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Last Updated</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-line/60">
                    {savedQuotations.map((q) => (
                      <tr
                        key={q.id}
                        className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                          currentQuotationId === q.id ? "bg-blue-50/50" : ""
                        }`}
                        onClick={() => handleLoadSavedQuotation(q)}
                      >
                        <td className="py-3 px-4 font-bold text-navy flex items-center space-x-1.5">
                          <FileText className="w-3.5 h-3.5 text-brand-ink/50" />
                          <span>{q.quotation_number}</span>
                          {currentQuotationId === q.id && (
                            <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                              Current
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium text-brand-ink">
                          {q.client_name}
                        </td>
                        <td className="py-3 px-4 text-brand-ink/70">
                          {q.client_company}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 capitalize">
                            {q.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-brand-ink/50">
                          {new Date(q.updated_at || q.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLoadSavedQuotation(q);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-[11px]"
                          >
                            Edit
                          </button>
                          {canDeleteQuotation && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteSavedQuotation(q, e)}
                              className="text-red-500 hover:text-red-700 font-semibold text-[11px]"
                              title="Delete proposal (Admin only)"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="print-area-wrapper mx-auto grid max-w-[1600px] items-start gap-6 px-5 py-6 lg:grid-cols-[440px_minmax(0,1fr)]">
        {/* -------- Editor -------- */}
        <div className="no-print space-y-4">
          <Card
            title="Client Information"
            subtitle="Appears on the proposal cover page"
            innerRef={setEditorRef("client")}
            active={activeSection === "client"}
            right={<EyeButton title="Preview cover page" onClick={() => focusPreview("client:name")} />}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Client Name"
                value={data.client.clientName}
                onFocusPreview={() => focusPreview("client:name")}
                onChange={(v) => setData((d) => ({ ...d, client: { ...d.client, clientName: v } }))}
              />
              <Field
                label="Company Name"
                value={data.client.companyName}
                onFocusPreview={() => focusPreview("client:company")}
                onChange={(v) => setData((d) => ({ ...d, client: { ...d.client, companyName: v } }))}
              />
              <Field
                label="Proposal Number"
                value={data.client.proposalNumber}
                onFocusPreview={() => focusPreview("client:proposal")}
                onChange={(v) =>
                  setData((d) => ({ ...d, client: { ...d.client, proposalNumber: v } }))
                }
              />
              <Field
                label="Date"
                value={data.client.date}
                onFocusPreview={() => focusPreview("client:date")}
                onChange={(v) => setData((d) => ({ ...d, client: { ...d.client, date: v } }))}
              />
            </div>
          </Card>

          <Card title="Product Pages" subtitle="Only enabled products are included in the PDF">
            <div className="space-y-2.5">
              {data.products.map((p) => {
                const open = openKey === p.key;
                return (
                  <div
                    key={p.key}
                    ref={setEditorRef(p.key) as unknown as React.Ref<HTMLDivElement>}
                    className={`scroll-mt-24 overflow-hidden rounded-xl border transition-colors ${
                      activeSection === p.key
                        ? "border-navy ring-4 ring-navy/10"
                        : p.enabled
                          ? "border-navy/25 bg-navy/[0.03]"
                          : "border-brand-line bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 px-4 py-3">
                      <Toggle on={p.enabled} onChange={(v) => patchProduct(p.key, { enabled: v })} />
                      <button
                        type="button"
                        onClick={() => setOpenKey(open ? null : p.key)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <span className="block truncate text-sm font-semibold text-navy">
                          {PRODUCT_LABELS[p.key]}
                        </span>
                        <span className="block text-xs text-brand-ink/55">
                          {p.enabled ? "Included in PDF" : "Excluded from PDF"}
                        </span>
                      </button>
                      {p.enabled ? (
                        <EyeButton
                          title={`Preview ${PRODUCT_LABELS[p.key]}`}
                          onClick={() => goToPage(p.key)}
                        />
                      ) : null}
                      <span
                        className={`text-brand-ink/40 transition-transform duration-300 ${
                          open ? "rotate-180" : ""
                        }`}
                      >
                        ▾
                      </span>
                    </div>

                    <div
                      className="grid transition-all duration-300"
                      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <div className="space-y-3 border-t border-brand-line/70 px-4 py-4">
                          <Field
                            label="Page Title"
                            value={p.title}
                            onFocusPreview={() => focusPreview(`${p.key}:title`)}
                            onChange={(v) => patchProduct(p.key, { title: v })}
                          />
                          <Field
                            label="Section Heading"
                            value={p.subTitle}
                            onFocusPreview={() => focusPreview(`${p.key}:sub`)}
                            onChange={(v) => patchProduct(p.key, { subTitle: v })}
                          />
                          {p.tables.map((t, i) => (
                            <div key={i} className="grid grid-cols-2 gap-3">
                              <Field
                                label={`${t.slabLabel} · Slab`}
                                value={t.slabValue}
                                onFocusPreview={() => focusPreview(`${p.key}:pricing`)}
                                onChange={(v) =>
                                  patchProduct(p.key, {
                                    tables: p.tables.map((x, j) =>
                                      j === i ? { ...x, slabValue: v } : x,
                                    ),
                                  })
                                }
                              />
                              <Field
                                label={`${t.rateLabel}`}
                                value={t.rateValue}
                                onFocusPreview={() => focusPreview(`${p.key}:pricing`)}
                                onChange={(v) =>
                                  patchProduct(p.key, {
                                    tables: p.tables.map((x, j) =>
                                      j === i ? { ...x, rateValue: v } : x,
                                    ),
                                  })
                                }
                              />
                            </div>
                          ))}

                          <div className="rounded-lg bg-white p-3">
                            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-brand-ink/60">
                              Pricing
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                              {(
                                [
                                  ["setup", "Setup Charges"],
                                  ["monthly", "Monthly Charges"],
                                  ["price", "Price"],
                                  ["gst", "GST (%)"],
                                ] as const
                              ).map(([k, label]) => (
                                <Field
                                  key={k}
                                  label={label}
                                  value={p.pricing[k]}
                                  onFocusPreview={() => focusPreview(`${p.key}:pricing`)}
                                  onChange={(v) =>
                                    patchProduct(p.key, { pricing: { ...p.pricing, [k]: v } })
                                  }
                                />
                              ))}
                            </div>
                            <div className="mt-3">
                              <Field
                                label="Final Total (leave 0 to auto-calculate)"
                                value={p.pricing.total}
                                onFocusPreview={() => focusPreview(`${p.key}:pricing`)}
                                onChange={(v) =>
                                  patchProduct(p.key, { pricing: { ...p.pricing, total: v } })
                                }
                              />
                              <p className="mt-1.5 text-xs text-brand-ink/60">
                                Auto total: ₹{" "}
                                {computeTotal(p.pricing).toLocaleString("en-IN", {
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                          </div>

                          <label className="block">
                            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-brand-ink/60">
                              Bullet Points (one per line)
                            </span>
                            <textarea
                              rows={6}
                              value={p.bullets.join("\n")}
                              onFocus={() => focusPreview(`${p.key}:bullets`)}
                              onChange={(e) => {
                                patchProduct(p.key, { bullets: e.target.value.split("\n") });
                                focusPreview(`${p.key}:bullets`);
                              }}
                              className="w-full rounded-lg border border-brand-line bg-white px-3 py-2 text-sm text-navy outline-none focus:border-navy focus:ring-4 focus:ring-navy/10"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card
            title="Account Manager"
            subtitle="Shown on the final Contact Us page"
            innerRef={setEditorRef("manager")}
            active={activeSection === "manager"}
            right={
              <EyeButton title="Preview contact page" onClick={() => focusPreview("manager:card")} />
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Name"
                value={data.manager.name}
                onFocusPreview={() => focusPreview("manager:card")}
                onChange={(v) => setData((d) => ({ ...d, manager: { ...d.manager, name: v } }))}
              />
              <Field
                label="Designation"
                value={data.manager.designation}
                onFocusPreview={() => focusPreview("manager:card")}
                onChange={(v) =>
                  setData((d) => ({ ...d, manager: { ...d.manager, designation: v } }))
                }
              />
              <Field
                label="Mobile Number"
                value={data.manager.mobile}
                onFocusPreview={() => focusPreview("manager:card")}
                onChange={(v) => setData((d) => ({ ...d, manager: { ...d.manager, mobile: v } }))}
              />
              <Field
                label="Email Address"
                value={data.manager.email}
                onFocusPreview={() => focusPreview("manager:card")}
                onChange={(v) => setData((d) => ({ ...d, manager: { ...d.manager, email: v } }))}
              />
              <div className="sm:col-span-2">
                <Field
                  label="Office Address"
                  value={
                    data.manager.officeAddress ??
                    "Office No. 805, 8th Floor, 63 Goldmedal Avenue, S. V. Road, Piramal Nagar, Goregaon West, Mumbai – 400104"
                  }
                  onFocusPreview={() => focusPreview("manager:card")}
                  onChange={(v) =>
                    setData((d) => ({ ...d, manager: { ...d.manager, officeAddress: v } }))
                  }
                />
              </div>
            </div>
          </Card>
        </div>

        {/* -------- Sticky live A4 preview -------- */}
        <div className="min-w-0 lg:sticky lg:top-[76px]">
          <div className="no-print mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-navy">Live A4 Preview</h2>
            <div className="flex items-center gap-1.5">
              {([50, 75, 100] as const).map((z) => (
                <ZoomBtn key={z} active={zoom === z / 100} onClick={() => setZoom(z / 100)}>
                  {z}%
                </ZoomBtn>
              ))}
              <ZoomBtn active={zoom === "fit-width"} onClick={() => setZoom("fit-width")}>
                Fit Width
              </ZoomBtn>
              <ZoomBtn active={zoom === "fit-page"} onClick={() => setZoom("fit-page")}>
                Fit Page
              </ZoomBtn>
            </div>
          </div>

          <div className="relative">
            <div
              id="print-root"
              ref={scrollerRef}
              className="preview-scroller overflow-auto rounded-2xl bg-brand-grey lg:h-[calc(100vh-140px)]"
            >
              <div
                className="page-scaler flex flex-col items-center gap-6 py-3"
                style={{ zoom: scale }}
              >
                <PreviewFocusContext.Provider value={{ highlight, onSelect }}>
                  <QuotationDocument data={data} />
                </PreviewFocusContext.Provider>
              </div>
            </div>

            {/* floating page navigator */}
            <nav className="no-print absolute right-3 top-3 max-h-[70%] w-[150px] overflow-auto rounded-xl border border-brand-line bg-white/95 p-1.5 shadow-panel backdrop-blur">
              {pages.map((pg) => (
                <button
                  key={pg.id}
                  type="button"
                  onClick={() => goToPage(pg.id)}
                  className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-brand-ink/75 transition-colors hover:bg-navy/[0.07] hover:text-navy"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="shrink-0 opacity-60"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>
                  <span className="truncate">{pg.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

function ZoomBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-navy bg-navy text-white"
          : "border-brand-line bg-white text-brand-ink/70 hover:border-navy/40 hover:text-navy"
      }`}
    >
      {children}
    </button>
  );
}
