import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../services/axios";
import { FiMoreVertical, FiDownload, FiFileText, FiUser, FiFilter, FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";

/**
 * TransactionsTable.jsx
 * Plain React + Tailwind version (no TypeScript)
 */

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "", "deposit","withdrawal","successful" etc. We'll use transaction.type or status depending on your dataset
  const [page, setPage] = useState(1);
  const pageSize = 7;
  const [sortKey, setSortKey] = useState("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/transactions");
        // API returns an array — keep as-is
        if (!mounted) return;
        setTransactions(Array.isArray(res.data) ? res.data : res.data || []);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => (mounted = false);
  }, []);

  // Derived: transformed rows (ensure there are required fields)
  const transformed = useMemo(() => {
    return transactions.map((t, idx) => ({
      id: t.payment_reference || `tx-${idx}`,
      name: (t.metadata && (t.metadata.name || t.metadata.fullName)) || "Unknown",
      country: (t.metadata && t.metadata.country) || "-",
      type: t.type || "-", // deposit / withdrawal
      status: t.status || "-",
      amount: typeof t.amount === "number" ? t.amount : parseFloat(t.amount) || 0,
      date: t.date || "",
      raw: t,
    }));
  }, [transactions]);

  // Filter + search
  const filtered = useMemo(() => {
    return transformed
      .filter(r => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          (r.name && r.name.toLowerCase().includes(q)) ||
          (r.id && r.id.toLowerCase().includes(q)) ||
          (r.country && r.country.toLowerCase().includes(q))
        );
      })
      .filter(r => {
        if (!statusFilter) return true;
        // statusFilter supports "deposit" / "withdrawal" / "successful" etc.
        if (["deposit", "withdrawal"].includes(statusFilter)) {
          return r.type === statusFilter;
        }
        return r.status === statusFilter;
      });
  }, [transformed, search, statusFilter]);

  // Sorting
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let va = a[sortKey];
      let vb = b[sortKey];
      // date compare
      if (sortKey === "date") {
        va = new Date(va).getTime() || 0;
        vb = new Date(vb).getTime() || 0;
      }
      if (typeof va === "string" && typeof vb === "string") {
        const res = va.localeCompare(vb);
        return sortAsc ? res : -res;
      }
      const res = (va > vb) ? 1 : va < vb ? -1 : 0;
      return sortAsc ? res : -res;
    });
    return arr;
  }, [filtered, sortKey, sortAsc]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  // Actions: update local UI (no server call)
  const markAsPaid = (id) => {
    setTransactions(prev => prev.map(t => ( (t.payment_reference || t.id) === id ? { ...t, status: "paid" } : t )));
  };
  const markAsRefunded = (id) => {
    setTransactions(prev => prev.map(t => ( (t.payment_reference || t.id) === id ? { ...t, status: "refunded" } : t )));
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ["Reference","Name","Type","Status","Amount","Date","Country"];
    const rows = sorted.map(r => [
      r.id,
      r.name,
      r.type,
      r.status,
      r.amount.toFixed(2),
      new Date(r.date).toLocaleDateString(),
      r.country,
    ]);
    const csv = [headers, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const changeSort = (key) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  // Summary text
  const summaryText = `${transactions.length} Transactions`;

  return (
    <div className="w-full space-y-4">
      {/* Top bar: summary left, actions right */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Transactions</h2>
          <p className="text-sm text-gray-500">{summaryText}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-50"
            onClick={() => setShowFilterPanel(prev => !prev)}
            aria-expanded={showFilterPanel}
          >
            <FiFilter className="h-4 w-4" />
            <span>Filter</span>
          </button>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded hover:bg-gray-50"
            title="Export CSV"
          >
            <FiDownload className="h-4 w-4" />
            <span className="text-sm">Export</span>
          </button>
        </div>
      </div>

      {/* Filter panel placeholder */}
      {showFilterPanel && (
        <div className="p-4 border rounded bg-white">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                className="w-full pl-10 pr-3 py-2 border rounded"
                placeholder="Search name, reference or country..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            <div className="flex gap-2">
              <button
                className={`px-3 py-2 rounded ${statusFilter === "" ? "bg-gray-900 text-white" : "bg-white border"}`}
                onClick={() => { setStatusFilter(""); setPage(1); }}
              >
                All
              </button>
              <button
                className={`px-3 py-2 rounded ${statusFilter === "deposit" ? "bg-green-600 text-white" : "bg-white border"}`}
                onClick={() => { setStatusFilter("deposit"); setPage(1); }}
              >
                Deposit
              </button>
              <button
                className={`px-3 py-2 rounded ${statusFilter === "withdrawal" ? "bg-red-600 text-white" : "bg-white border"}`}
                onClick={() => { setStatusFilter("withdrawal"); setPage(1); }}
              >
                Withdrawal
              </button>
              <button
                className={`px-3 py-2 rounded ${statusFilter === "successful" ? "bg-green-600 text-white" : "bg-white border"}`}
                onClick={() => { setStatusFilter("successful"); setPage(1); }}
              >
                Successful
              </button>
            </div>

            <div>
              <button
                className="px-3 py-2 bg-blue-600 text-white rounded"
                onClick={() => { /* placeholder for applying advanced filters later */ }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded border">
        <table className="min-w-full divide-y table-auto">
          <thead className="bg-white sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium cursor-pointer" onClick={() => changeSort("id")}>Reference</th>
              <th className="px-4 py-3 text-left text-sm font-medium cursor-pointer" onClick={() => changeSort("name")}>Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Country</th>
              <th className="px-4 py-3 text-right text-sm font-medium cursor-pointer" onClick={() => changeSort("amount")}>Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium cursor-pointer" onClick={() => changeSort("date")}>Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">Loading transactions...</td>
              </tr>
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">No transactions found</td>
              </tr>
            ) : (
              pageData.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 text-sm font-medium">{r.id}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-col">
                      <span className="font-medium">{r.name}</span>
                      <span className="text-xs text-gray-400">{r.raw.metadata?.email || "-"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{r.country}</td>
                  <td className="px-4 py-3 text-sm text-right">₦{Number(r.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-sm">{r.date ? new Date(r.date).toLocaleDateString() : "-"}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 text-xs rounded ${r.type === "deposit" ? "bg-green-100 text-green-800" : r.type === "withdrawal" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>
                      {r.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 text-xs rounded ${r.status === "successful" || r.status === "paid" ? "bg-green-100 text-green-800" : r.status === "pending" ? "bg-yellow-100 text-yellow-800" : r.status === "refunded" ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-800"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="inline-block relative">
                      <button className="p-2 hover:bg-gray-100 rounded" aria-haspopup="menu" aria-expanded="false">
                        <FiMoreVertical className="w-5 h-5" />
                      </button>

                      {/* Simple action menu (replace with a proper dropdown lib if desired) */}
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md hidden group-hover:block">
                        {/* left hidden by default; this is a placeholder */}
                      </div>

                      {/* Quick inline actions */}
                      <div className="flex justify-end gap-2 mt-1">
                        <button title="View invoice" className="p-2 hover:bg-gray-100 rounded" onClick={() => alert(`View invoice ${r.id}`)}>
                          <FiFileText className="w-4 h-4" />
                        </button>
                        <button title="Download" className="p-2 hover:bg-gray-100 rounded" onClick={() => alert(`Download ${r.id}`)}>
                          <FiDownload className="w-4 h-4" />
                        </button>
                        <button title="Profile" className="p-2 hover:bg-gray-100 rounded" onClick={() => alert(`Open profile for ${r.name}`)}>
                          <FiUser className="w-4 h-4" />
                        </button>
                        {r.status !== "paid" ? (
                          <button className="px-2 py-1 bg-green-600 text-white text-xs rounded" onClick={() => markAsPaid(r.id)}>Mark paid</button>
                        ) : (
                          <button className="px-2 py-1 bg-indigo-600 text-white text-xs rounded" onClick={() => markAsRefunded(r.id)}>Refund</button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Showing {Math.min((page - 1) * pageSize + 1, sorted.length)} - {Math.min(page * pageSize, sorted.length)} of {sorted.length}</div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 border rounded disabled:opacity-50"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <FiChevronLeft />
          </button>
          <div className="px-3 py-2 border rounded">Page {page} / {totalPages}</div>
          <button
            className="px-3 py-2 border rounded disabled:opacity-50"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
