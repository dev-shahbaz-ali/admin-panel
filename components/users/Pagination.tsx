"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page:       number;
  totalPages: number;
  pageSize:   number;
  total:      number;
  onPage:     (p: number) => void;
  onPageSize: (s: number) => void;
}

const PAGE_SIZES = [5, 10, 20];

export function Pagination({ page, totalPages, pageSize, total, onPage, onPageSize }: PaginationProps) {
  const from = Math.min((page - 1) * pageSize + 1, total);
  const to   = Math.min(page * pageSize, total);

  /* Build visible page numbers: always show first, last, current ±1, and ellipsis */
  function pages() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const set = new Set([1, totalPages, page, page - 1, page + 1].filter((p) => p >= 1 && p <= totalPages));
    const arr = [...set].sort((a, b) => a - b);
    const result: (number | "…")[] = [];
    arr.forEach((n, i) => {
      if (i > 0 && n - arr[i - 1] > 1) result.push("…");
      result.push(n);
    });
    return result;
  }

  const btnBase = "flex items-center justify-center min-w-[32px] h-8 px-2 rounded-lg text-sm transition-colors";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
      {/* Left: count + page size */}
      <div className="flex items-center gap-3 text-xs text-zinc-400">
        <span>
          {total === 0 ? "No results" : `${from}–${to} of ${total} users`}
        </span>
        <span className="text-zinc-200">|</span>
        <span className="flex items-center gap-1.5">
          Rows per page:
          <select
            value={pageSize}
            onChange={(e) => { onPageSize(Number(e.target.value)); onPage(1); }}
            className="h-7 px-1.5 rounded-md border border-zinc-200 bg-white text-xs text-zinc-700 focus:outline-none focus:ring-1 focus:ring-violet-400 cursor-pointer"
          >
            {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </span>
      </div>

      {/* Right: page buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className={cn(btnBase, "text-zinc-400 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed")}
        >
          <ChevronLeft size={15} />
        </button>

        {pages().map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="text-zinc-300 text-sm px-1">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p as number)}
              className={cn(
                btnBase,
                p === page
                  ? "bg-violet-600 text-white font-medium"
                  : "text-zinc-600 hover:bg-zinc-100"
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages || totalPages === 0}
          className={cn(btnBase, "text-zinc-400 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed")}
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
