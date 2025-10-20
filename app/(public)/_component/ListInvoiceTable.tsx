/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { PublicInvoiceType } from "@/app/data/get-invoices-data";

interface iAppProps {
  data: PublicInvoiceType[];
}

type SortKey = "invoice" | "tanggal_service";
type SortDir = "asc" | "desc";

function toYMD(d: string | Date | undefined | null): string {
  if (!d) return "";
  if (typeof d === "string") {
    // Kalo string ISO "2025-10-21T..." → ambil 10
    return d.length >= 10 ? d.slice(0, 10) : d;
  }
  if (d instanceof Date) {
    return d.toISOString().slice(0, 10);
  }
  return "";
}

export function statusBadgeClass(status: string) {
  switch (status) {
    case "Paid":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200";
    case "Paid Partially":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200";
    default: // Unpaid
      return "bg-slate-200 text-slate-900 dark:bg-slate-700/60 dark:text-slate-100";
  }
}

export function statusDotClass(status: string) {
  switch (status) {
    case "Paid":
      return "bg-emerald-500";
    case "Paid Partially":
      return "bg-amber-500";
    default: // Unpaid
      return "bg-slate-500"; // ← tetap kelihatan di dua tema
  }
}

export default function ListInvoiceTable({ data }: iAppProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("tanggal_service");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const statusOptions = useMemo(() => {
    const set = new Set<string>();
    (data ?? []).forEach((r) => r.status && set.add(r.status));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [data]);

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();

    const rows = (data ?? []).filter((row) => {
      const matchesQuery =
        !q ||
        (row.driverName ?? "").toLowerCase().includes(q) ||
        (row.status ?? "").toLowerCase().includes(q) ||
        (row.invoiceNumber ?? "").toLowerCase().includes(q);

      const matchesStatus = !status || row.status === status;
      return matchesQuery && matchesStatus;
    });

    rows.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;

      if (sortKey === "invoice")
        return (
          (a.invoiceNumber ?? "").localeCompare(b.invoiceNumber ?? "") * dir
        );

      if (sortKey === "tanggal_service")
        return toYMD(a.serviceDate).localeCompare(toYMD(b.serviceDate)) * dir;

      return 0;
    });

    return rows;
  }, [data, query, status, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      // same column → just flip
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      // new column → start with ASC (so the first click gives ASC, second DESC)
      setSortKey(key);
      setSortDir("asc"); // <-- keep this, it is correct for the behaviour you want
    }
  }

  function resetFilters() {
    setQuery("");
    setStatus("");
    setSortKey("tanggal_service");
    setSortDir("desc");
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div className="w-48">
          <label className="text-xs text-muted-foreground block mb-1">
            Filter Status
          </label>
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[220px]">
          <label className="text-xs text-muted-foreground block mb-1">
            Cari (Invoice / Petugas)
          </label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="mis. INV-TRK-2025-003 atau 'Budi'"
              className="pl-8"
              type="search"
            />
          </div>
        </div>

        <Button onClick={resetFilters} variant="secondary">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableCaption>Monitoring Service Truck</TableCaption>
          <TableHeader>
            <TableRow>
              <ThSort
                active={sortKey === "invoice"}
                dir={sortKey === "invoice" ? sortDir : undefined}
                onClick={() => toggleSort("invoice")}
              >
                Invoice
              </ThSort>
              <TableHead>Nama Petugas</TableHead>
              <TableHead>Status</TableHead>
              <ThSort
                active={sortKey === "tanggal_service"}
                dir={sortKey === "tanggal_service" ? sortDir : undefined}
                onClick={() => toggleSort("tanggal_service")}
              >
                Tanggal Service
              </ThSort>
              {/* <ThSort
                active={sortKey === "total_harga"}
                dir={sortKey === "total_harga" ? sortDir : undefined}
                onClick={() => toggleSort("total_harga")}
                className="hidden md:table-cell"
              >
                Total Harga
              </ThSort> */}
              <TableHead className="hidden md:table-cell">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredSorted.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  Tidak ada data yang cocok.
                </TableCell>
              </TableRow>
            ) : (
              filteredSorted.map((r) => (
                <TableRow key={r.invoiceNumber} className="hover:bg-muted/30">
                  <TableCell className="font-mono">{r.invoiceNumber}</TableCell>
                  <TableCell>{r.driverName}</TableCell>
                  <TableCell>
                    <div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium",
                          statusBadgeClass(r.status)
                        )}
                      >
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full",
                            statusDotClass(r.status)
                          )}
                        />
                        {r.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{toYMD(r.serviceDate)}</TableCell>
                  {/* <TableCell className="hidden md:table-cell font-medium">
                    {formatRupiah(r.total_harga)}
                  </TableCell> */}
                  <TableCell className="hidden md:table-cell">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        alert(
                          `Invoice ${r.invoiceNumber} — buka halaman detail di sini`
                        )
                      }
                    >
                      Lihat
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ThSort({
  children,
  active,
  dir,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  active?: boolean;
  dir?: SortDir;
  onClick: () => void;
  className?: string;
}) {
  const Icon = !active ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <TableHead className={`whitespace-nowrap ${className}`}>
      <Button
        variant="ghost"
        className="px-0 font-normal hover:bg-transparent"
        onClick={onClick}
        title="Klik untuk urutkan"
      >
        <span className="mr-2">{children}</span>
        <Icon className="h-4 w-4" />
      </Button>
    </TableHead>
  );
}
