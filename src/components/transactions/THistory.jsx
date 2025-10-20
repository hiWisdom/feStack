import React, { useEffect, useMemo, useState, useRef } from "react";
import axiosInstance from "../../services/axios";
import { FiX } from "react-icons/fi";
import { CallMadeIcon, CallReceivedIcon } from "../ui/Icons";
import { DownloadIcons, ExpandMoreIcon } from "../ui/Icons";


const TRANSACTION_TYPES = [
  "Store transactions",
  "Get Tipped",
  "Withdrawals",
  "Chargebacks",
  "Cashback",
  "Refer & Earn",
];

const STATUS_OPTIONS = ["All", "successful", "pending", "declined"];

const PRESET_RANGES = {
  Today: () => {
    const today = new Date();
    return { from: startOfDay(today), to: endOfDay(today) };
  },
  "Last 7 Days": () => {
    const to = endOfDay(new Date());
    const from = startOfDay(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)); // inclusive 7 days
    return { from, to };
  },
  "This Month": () => {
    const now = new Date();
    const from = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
    const to = endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    return { from, to };
  },
  "Last 3 Months": () => {
    const now = new Date();
    const to = endOfDay(now);
    const from = startOfDay(new Date(now.getFullYear(), now.getMonth() - 2, 1));
    return { from, to };
  },
};

// Helpers for date start/end
function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export default function TransactionsTable() {
  // Data
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI
  const [search] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 7;

  // Sorting (kept minimal; we use key only)
  const [sortKey] = useState("date");
  const [sortAsc] = useState(false);

  // Filter panel UI
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const panelRef = useRef(null);

  // Filter state (controlled inputs inside panel)
  const [selectedPreset, setSelectedPreset] = useState("Last 7 Days");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [typeFilter, setTypeFilter] = useState(""); // empty => all types
  const [statusFilter, setStatusFilter] = useState("All"); // "All" or status

  // Applied filters (the ones actually used to filter data)
  const [appliedFilters, setAppliedFilters] = useState({
    from: null,
    to: null,
    type: "",
    status: "All",
  });

  // Fetch transactions
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/transactions");
        if (!mounted) return;
        const raw = Array.isArray(res.data) ? res.data : res.data || [];
        setTransactions(raw);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  // Click outside / ESC to close panel
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setShowFilterPanel(false);
    }
    function onDocClick(e) {
      if (!showFilterPanel) return;
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowFilterPanel(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDocClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDocClick);
    };
  }, [showFilterPanel]);

  // Derived: normalized rows
  const transformed = useMemo(() => {
    return transactions.map((t, idx) => ({
      id: t.payment_reference || `tx-${idx}`,
      name: (t.metadata && (t.metadata.name || t.metadata.fullName)) || "-",
      country: (t.metadata && t.metadata.country) || "-",
      type: (t.type || "-").toLowerCase(),
      status: (t.status || "-").toLowerCase(),
      amount: typeof t.amount === "number" ? t.amount : parseFloat(t.amount) || 0,
      date: t.date || "",
      raw: t,
    }));
  }, [transactions]);

  // Apply search + appliedFilters + status/type filtering
  const filtered = useMemo(() => {
    return transformed
      .filter((r) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          (r.name && r.name.toLowerCase().includes(q)) ||
          (r.id && r.id.toLowerCase().includes(q)) ||
          (r.country && r.country.toLowerCase().includes(q))
        );
      })
      .filter((r) => {
        // status filter
        if (appliedFilters.status && appliedFilters.status !== "All") {
          if (!r.status) return false;
          if (r.status !== appliedFilters.status.toLowerCase()) return false;
        }
        // type filter
        if (appliedFilters.type) {
          // transform both sides to normalized form for matching
          const norm = appliedFilters.type.toLowerCase();
          // your dataset uses specific strings — attempt to match by substring
          if (!r.type || !r.type.toLowerCase().includes(norm.split(" ")[0])) return false;
        }
        // date range filter
        if (appliedFilters.from && appliedFilters.to) {
          const tDate = new Date(r.date);
          if (Number.isNaN(tDate.getTime())) return false;
          if (tDate < appliedFilters.from || tDate > appliedFilters.to) return false;
        }
        return true;
      });
  }, [transformed, search, appliedFilters]);

  // Sorting
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let va = a[sortKey];
      let vb = b[sortKey];
      if (sortKey === "date") {
        va = new Date(va).getTime() || 0;
        vb = new Date(vb).getTime() || 0;
      }
      if (typeof va === "string" && typeof vb === "string") {
        const res = va.localeCompare(vb);
        return sortAsc ? res : -res;
      }
      const res = va > vb ? 1 : va < vb ? -1 : 0;
      return sortAsc ? res : -res;
    });
    return arr;
  }, [filtered, sortKey, sortAsc]);


  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  // Export CSV
  const exportCSV = () => {
    const headers = ["Reference", "Name", "Type", "Status", "Amount", "Date", "Country"];
    const rows = sorted.map((r) => [
      r.id,
      r.name,
      r.type,
      r.status.charAt(0).toUpperCase() + r.status.slice(1),
      r.amount.toFixed(2),
      new Date(r.date).toLocaleDateString(),
      r.country,
    ]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Apply filters: compute date range from selectedPreset or custom, set appliedFilters
  const applyFilters = () => {
    let from = null;
    let to = null;
    if (selectedPreset !== "Custom") {
      const presetFn = PRESET_RANGES[selectedPreset];
      if (presetFn) {
        const range = presetFn();
        from = range.from;
        to = range.to;
      }
    } else {
      // custom
      if (customFrom) from = startOfDay(new Date(customFrom));
      if (customTo) to = endOfDay(new Date(customTo));
    }

    setAppliedFilters({
      from,
      to,
      type: typeFilter,
      status: statusFilter || "All",
    });

    // close panel after applying
    setShowFilterPanel(false);
    // reset to first page
    setPage(1);
  };

  // Quick handler to change preset and clear custom inputs
  const choosePreset = (p) => {
    setSelectedPreset(p);
    setCustomFrom("");
    setCustomTo("");
  };

  // Summary text
  const summaryText = `${transactions.length} Transactions`;

  return (
    <div className="border-2 border-[red] w-full space-y-4 px-6 lg:px-10">
      {/* Top bar: summary left, actions right */}
      <div className="border-2 border-[yellow] px-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{summaryText}</h2>
          <p className="text-sm text-gray-500">Your transactions for the selected range</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilterPanel((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EFF1F6] hover:bg-gray-50 lg:h-[46px]"
            aria-expanded={showFilterPanel}
            aria-controls="transactions-filter-panel"
          >
            <span>Filter</span>
            <div
              className="border-2 border-[red] h-[20px] w-[20px]"
            >
              <ExpandMoreIcon />
            </div>
          </button>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EFF1F6] hover:bg-gray-50 lg:h-[46px]"
            title="Export CSV"
          >
            <span className="text-sm">Export</span>
            <DownloadIcons />
          </button>
        </div>
      </div>

      {/* Filter slide-in panel (right) */}
      {showFilterPanel && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/30 z-40" aria-hidden="true" />

          {/* Panel */}
          <aside
            id="transactions-filter-panel"
            ref={panelRef}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl transform transition-transform"
            style={{ transform: showFilterPanel ? "translateX(0)" : "translateX(100%)" }}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between p-4">
              <h3 className="text-lg font-medium">Filters</h3>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-2 rounded-md hover:bg-gray-100"
                  onClick={() => {
                    // reset filter UI to current applied filters
                    if (appliedFilters.from && appliedFilters.to) {
                      setSelectedPreset("Custom");
                      setCustomFrom(formatISODate(appliedFilters.from));
                      setCustomTo(formatISODate(appliedFilters.to));
                    } else {
                      setSelectedPreset("Last 7 Days");
                      setCustomFrom("");
                      setCustomTo("");
                    }
                    setTypeFilter(appliedFilters.type || "");
                    setStatusFilter(appliedFilters.status || "All");
                  }}
                >
                  Reset
                </button>
                <button
                  aria-label="Close filters"
                  className="p-2 rounded-md hover:bg-gray-100"
                  onClick={() => setShowFilterPanel(false)}
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto h-full">
              {/* Date Range Presets */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Date Range</h4>
                <div className="grid grid-cols-1 gap-2">
                  {Object.keys(PRESET_RANGES).map((key) => (
                    <label key={key} className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="preset"
                        value={key}
                        checked={selectedPreset === key}
                        onChange={() => choosePreset(key)}
                        className="form-radio"
                      />
                      <span className="text-sm">{key}</span>
                    </label>
                  ))}

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="preset"
                      value="Custom"
                      checked={selectedPreset === "Custom"}
                      onChange={() => setSelectedPreset("Custom")}
                      className="form-radio"
                    />
                    <span className="text-sm">Custom</span>
                  </label>

                  {/* Custom date inputs */}
                  {selectedPreset === "Custom" && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="date"
                        className="border px-2 py-2 rounded w-1/2"
                        value={customFrom}
                        onChange={(e) => setCustomFrom(e.target.value)}
                      />
                      <input
                        type="date"
                        className="border px-2 py-2 rounded w-1/2"
                        value={customTo}
                        onChange={(e) => setCustomTo(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction Type */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Transaction Type</h4>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {TRANSACTION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Status</h4>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s === "All" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6">
                <button
                  onClick={applyFilters}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Transactions list */}
      <div className="border-2 border-[red] overflow-x-auto bg-white rounded">
        <div className="border-2 border-[red] w-full">
          <div className="bg-white">
            {loading ? (
              <div className="px-6 py-8 text-center text-gray-500">Loading transactions...</div>
            ) : pageData.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No matching transactions found for the selected filter.
              </div>
            ) : (
              pageData.map((r) => (
                <div key={r.id} className="flex m-2 lg:m-4 items-center justify-between p-3  rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-[60px] h-[60px]">
                      <span
                        className={`w-full h-full inline-flex items-center justify-center rounded-full ${
                          r.type === "deposit" ? "bg-green-100 text-green-700" : r.type === "withdrawal" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {r.type === "deposit" && <CallReceivedIcon />}
                        {r.type === "withdrawal" && <CallMadeIcon />}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-semibold text-[16px]">
                        {r.raw.metadata?.product_name || "Cash Withdrawal"}
                      </span>

                      <span className="text-sm text-gray-500">
                        {r.name ? (
                          r.name
                        ) : (
                          <span
                            className={`py-1 text-sm rounded ${
                              r.status === "successful"
                                ? "text-green-800 font-bold"
                                : r.status === "pending"
                                ? "text-yellow-800"
                                : r.status === "declined"
                                ? "text-red-800"
                                : "text-gray-800"
                            }`}
                          >
                            {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <p className="text-[16px] font-bold">
                      USD {Number(r.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-500">
                      {r.date ? new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// small helper: format Date -> yyyy-mm-dd for <input type="date">
function formatISODate(d) {
  if (!d) return "";
  const dt = new Date(d);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}


