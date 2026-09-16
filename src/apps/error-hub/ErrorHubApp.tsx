import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ERROR_DATASET, ErrorItem } from "./data/errors";
import { logAuditEvent } from "@/lib/audit";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Search, 
  Terminal, 
  ArrowLeft, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  X, 
  Clock, 
  Zap, 
  Filter, 
  Layers, 
  SlidersHorizontal,
  ChevronDown,
  FileText
} from "lucide-react";

export const ErrorHubApp: React.FC = () => {
  const { user, profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter State
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTarget, setSearchTarget] = useState<"all" | "code" | "desc">("all");
  const [renderLimit, setRenderLimit] = useState(48);
  const [queryDuration, setQueryDuration] = useState<number | null>(null);

  // Interaction feedback states
  const [copiedCodeId, setCopiedCodeId] = useState<number | null>(null);
  const [copiedDetailId, setCopiedDetailId] = useState<number | null>(null);
  const [sharedCodeId, setSharedCodeId] = useState<number | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(ERROR_DATASET.map((e) => e.category))).filter(Boolean);
    return ["All", ...cats];
  }, []);

  // Initialize recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("immense_error_recent_queries");
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch {
      // safe fallback
    }
  }, []);

  // Save recent search
  const saveRecentQuery = useCallback((term: string) => {
    const clean = term.trim();
    if (!clean || clean.length < 2) return;
    setRecentSearches((prev) => {
      const next = [clean, ...prev.filter((q) => q.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
      try {
        localStorage.setItem("immense_error_recent_queries", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // Deep-link query parameter parsing (?error=CODE or ?q=QUERY)
  useEffect(() => {
    const errorParam = searchParams.get("error");
    const qParam = searchParams.get("q");

    if (errorParam) {
      setQuery(errorParam);
      setSearchTarget("code");
      saveRecentQuery(errorParam);
    } else if (qParam) {
      setQuery(qParam);
      saveRecentQuery(qParam);
    }
  }, [searchParams, saveRecentQuery]);

  // Keyboard shortcut listener (/ or Ctrl+K to focus, Esc to clear)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "/" || (e.ctrlKey && e.key === "k") || (e.metaKey && e.key === "k")) &&
          document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        setQuery("");
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // High-Performance Search & Ranking Engine (<1ms)
  const filteredResults = useMemo(() => {
    const start = performance.now();
    let results = ERROR_DATASET;

    // Filter by category
    if (activeCategory !== "All") {
      results = results.filter((item) => item.category === activeCategory);
    }

    // Filter by query
    const cleanQuery = query.trim();
    if (cleanQuery) {
      const qLower = cleanQuery.toLowerCase();
      const tokens = qLower.split(/\s+/).filter(Boolean);

      results = results.filter((item) => {
        const code = item.code.toLowerCase();
        const desc = item.description.toLowerCase();

        if (searchTarget === "code") {
          return code.includes(qLower);
        }
        if (searchTarget === "desc") {
          return tokens.every((tok) => desc.includes(tok));
        }

        // Target: All (Rank exact code match first)
        if (code === qLower) return true;
        if (code.includes(qLower)) return true;
        return tokens.every((tok) => desc.includes(tok) || code.includes(tok));
      });

      // Sort exact matches to top
      results = [...results].sort((a, b) => {
        const aExact = a.code.toLowerCase() === qLower ? -1 : 0;
        const bExact = b.code.toLowerCase() === qLower ? -1 : 0;
        return aExact - bExact;
      });
    }

    const duration = performance.now() - start;
    setQueryDuration(Math.round(duration * 100) / 100);
    return results;
  }, [query, activeCategory, searchTarget]);

  // Sync URL query params with state
  const handleQueryChange = (val: string) => {
    setQuery(val);
    setRenderLimit(48); // Reset limit on new query
    if (val.trim()) {
      setSearchParams({ q: val.trim() }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  // Copy Error Code
  const handleCopyCode = async (item: ErrorItem) => {
    try {
      await navigator.clipboard.writeText(item.code);
      setCopiedCodeId(item.id);
      setTimeout(() => setCopiedCodeId(null), 1800);
    } catch {
      // fallback
    }
  };

  // Copy Full Details
  const handleCopyDetails = async (item: ErrorItem) => {
    try {
      const text = `Error Code: ${item.code}\nDescription: ${item.description}\nCategory: ${item.category}\nSource: Immense Error Hub`;
      await navigator.clipboard.writeText(text);
      setCopiedDetailId(item.id);
      setTimeout(() => setCopiedDetailId(null), 1800);
    } catch {
      // fallback
    }
  };

  // Share Deep Link
  const handleShare = async (item: ErrorItem) => {
    try {
      const url = `${window.location.origin}/apps/error-hub?error=${encodeURIComponent(item.code)}`;
      await navigator.clipboard.writeText(url);
      setSharedCodeId(item.id);
      setTimeout(() => setSharedCodeId(null), 2000);
    } catch {
      // fallback
    }
  };

  const displayedItems = filteredResults.slice(0, renderLimit);

  return (
    <div className="space-y-6">
      {/* Top Workspace Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Link
              to="/workspace"
              className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-brand-navy mr-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Workspace
            </Link>
            <span className="text-slate-300">/</span>
            <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight flex items-center gap-2">
              <span>Error Code Intelligence Hub</span>
            </h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
              Immense Air &middot; Support
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Production search engine covering 693 verified telecom, DLT, SMPP, and telephony definitions
          </p>
        </div>

        {/* Live Performance Stats */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Speed: <strong>{queryDuration !== null ? `${queryDuration}ms` : "<1ms"}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
            <Layers className="w-3.5 h-3.5 text-brand-blue" />
            <span>Total: <strong>693 Codes</strong></span>
          </div>
        </div>
      </div>

      {/* Hero Search Box */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveRecentQuery(query);
            }}
            placeholder="Search error code (e.g. 20A, 408, 5101) or keyword (e.g. DLT, timeout, auth)..."
            className="w-full pl-12 pr-28 py-3.5 text-sm sm:text-base rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue text-brand-navy placeholder:text-slate-400 transition-all font-medium"
          />

          <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-1.5">
            {query && (
              <button
                type="button"
                onClick={() => handleQueryChange("")}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-lg">
              Ctrl+K
            </kbd>
          </div>
        </div>

        {/* Target Selector & Quick Suggestions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 text-xs">
          {/* Recent Searches Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-1">
            <span className="text-slate-400 font-medium shrink-0">Popular / Recent:</span>
            {["20A", "408", "DLT", "SMPP", "5110", "timeout"].map((rec) => (
              <button
                key={rec}
                type="button"
                onClick={() => handleQueryChange(rec)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-brand-navy hover:text-white text-slate-600 transition-colors font-medium text-[11px] shrink-0"
              >
                {rec}
              </button>
            ))}
          </div>

          {/* Search Target Switcher */}
          <div className="flex items-center space-x-1.5 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Target:</span>
            <select
              value={searchTarget}
              onChange={(e) => setSearchTarget(e.target.value as any)}
              className="py-1 px-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-brand-navy focus:outline-none"
            >
              <option value="all">All Fields</option>
              <option value="code">Error Code Only</option>
              <option value="desc">Description Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
                setRenderLimit(48);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-brand-navy text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          Showing <span className="font-bold text-brand-navy">{filteredResults.length}</span> matching errors
          {activeCategory !== "All" && <span> in <strong>{activeCategory}</strong></span>}
        </div>
        {filteredResults.length > 0 && (
          <span className="text-[11px] text-slate-400">Rendering {displayedItems.length} items</span>
        )}
      </div>

      {/* Results Cards Grid */}
      {filteredResults.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-brand-navy">No Matching Error Codes</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No records matched &ldquo;<span className="font-semibold text-brand-navy">{query}</span>&rdquo;. Try searching by numeric code, hex value, or generic keyword like &ldquo;timeout&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => handleQueryChange("")}
            className="px-4 py-1.5 rounded-xl bg-brand-navy text-white text-xs font-semibold hover:bg-brand-blue transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Card Header: Code & Category */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-base font-extrabold text-brand-navy bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200/70 group-hover:border-brand-blue/40 group-hover:text-brand-blue transition-colors">
                      {item.code}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 truncate max-w-[170px]">
                    {item.category}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleCopyCode(item)}
                  className="inline-flex items-center space-x-1 text-slate-500 hover:text-brand-blue font-semibold transition-colors"
                >
                  {copiedCodeId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied ✓</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleCopyDetails(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    title="Copy full details"
                  >
                    {copiedDetailId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <FileText className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    title="Share deep link"
                  >
                    {sharedCodeId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Batch Load More Button */}
      {displayedItems.length < filteredResults.length && (
        <div className="pt-4 text-center">
          <button
            type="button"
            onClick={() => setRenderLimit((prev) => prev + 48)}
            className="px-6 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-brand-navy text-xs font-bold shadow-sm transition-all"
          >
            Load More Errors ({filteredResults.length - displayedItems.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
};
