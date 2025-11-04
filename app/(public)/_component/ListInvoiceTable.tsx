/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  RotateCcw,
  MoreVertical,
  Pencil,
  EyeIcon,
  Trash2,
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
import { SortDir, SortKey, ThSort } from "@/components/sortTable";
import { formatDateID } from "@/lib/formatValue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface iAppProps {
  data: PublicInvoiceType[];
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "Paid":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200";
    case "Paid Partially":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200";
    default: // Unpaid
      return "bg-slate-200 text-slate-900 dark:bg-slate-700/60 dark:text-slate-100";
  }
}

function statusDotClass(status: string) {
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

  // const statusOptions = useMemo(() => {
  //   const set = new Set<string>();
  //   (data ?? []).forEach((r) => r.status && set.add(r.status));
  //   return Array.from(set).sort((a, b) => a.localeCompare(b));
  // }, [data]);

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();

    const rows = (data ?? []).filter((row) => {
      const matchesQuery =
        !q ||
        (row.driverName ?? "").toLowerCase().includes(q) ||
        // (row.status ?? "").toLowerCase().includes(q) ||
        (row.idInvoice ?? "").toLowerCase().includes(q);

      // const matchesStatus = !status || row.status === status;
      // return matchesQuery && matchesStatus;
      return matchesQuery;
    });

    rows.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;

      if (sortKey === "invoice")
        return (a.idInvoice ?? "").localeCompare(b.idInvoice ?? "") * dir;

      if (sortKey === "tanggal_service")
        return (
          formatDateID(a.serviceDate).localeCompare(
            formatDateID(b.serviceDate)
          ) * dir
        );

      return 0;
    });

    return rows;
  }, [data, query, sortKey, sortDir]);

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
        {/* <div className="w-48">
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
        </div> */}

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

        <Button
          onClick={resetFilters}
          className="
    bg-green-600/15              /* default background */
    text-green-700               /* default text color */
    border border-green-600/30  
    dark:bg-green-400/20
    dark:text-white
    dark:border-green-400/30

    hover:bg-green-600/25        /* stronger green on hover */
    dark:hover:bg-green-400/30

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-green-600/40
    dark:focus-visible:ring-green-400/40

    transition-colors
  "
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
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
              {/* <TableHead>Status</TableHead> */}
              <ThSort
                active={sortKey === "tanggal_service"}
                dir={sortKey === "tanggal_service" ? sortDir : undefined}
                onClick={() => toggleSort("tanggal_service")}
              >
                Tanggal Service
              </ThSort>
              <TableHead>Odometer</TableHead>
              <TableHead>Keterangan</TableHead>

              <TableHead>Action</TableHead>
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
                <TableRow key={r.idInvoice} className="hover:bg-muted/30">
                  <TableCell className="font-mono">{r.idInvoice}</TableCell>
                  <TableCell>{r.driverName}</TableCell>
                  {/* <TableCell>
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
                  </TableCell> */}
                  <TableCell>{formatDateID(r.serviceDate)}</TableCell>
                  <TableCell>{r.odometerKm}</TableCell>
                  <TableCell>{r.keterangan}</TableCell>
                  {/* <TableCell className="hidden md:table-cell font-medium">
                    {formatRupiah(r.total_harga)}
                  </TableCell> */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="
        bg-green-600/15
        text-green-700
        border border-green-600/30
        dark:bg-green-400/20
        dark:text-white
        dark:border-green-400/30

        hover:bg-green-600/25
        dark:hover:bg-green-400/30

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-green-600/40
        dark:focus-visible:ring-green-400/40

        transition-colors
      "
                        >
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="
      w-48 rounded-md border
      bg-card shadow-md
      transition-all
    "
                      >
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/detail/${r.idFaktur}`}
                            className="
          flex gap-2 items-center
          hover:bg-green-600/10
          dark:hover:bg-green-400/10
          cursor-pointer px-2 py-2 rounded-sm
        "
                          >
                            <EyeIcon className="size-4" />
                            Lihat Detail
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                          <div
                            className="
          flex gap-2 items-center
          text-red-600
          hover:bg-red-600/10
          dark:text-red-400
          dark:hover:bg-red-400/10
          cursor-pointer px-2 py-2 rounded-sm
        "
                          >
                            <Trash2 className="size-4" />
                            Delete Invoice
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
