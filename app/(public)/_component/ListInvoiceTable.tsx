// app/monitoring/page.tsx
"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { formatDateID, formatRupiah } from "@/lib/formatValue";
import { cn } from "@/lib/utils";

type ServiceItem = {
  nama: string;
  qty: number;
  harga_satuan: number;
  subtotal: number;
};

type ServiceRecord = {
  invoice: string;
  nama_petugas: string;
  status: "selesai" | "proses" | "terjadwal" | "dibatalkan";
  tanggal_service: string; // YYYY-MM-DD
  total_harga: number;
  total_harga_formatted: string;
  items: ServiceItem[];
};

type SortKey = "invoice" | "tanggal_service" | "total_harga";
type SortDir = "asc" | "desc";

const DATA: ServiceRecord[] = [
  {
    invoice: "INV-TRK-2025-001",
    nama_petugas: "Budi Santoso",
    status: "selesai",
    tanggal_service: "2025-01-15",
    total_harga: 1300000,
    total_harga_formatted: "Rp 1.300.000",
    items: [
      {
        nama: "Oli Mesin + Filter Oli",
        qty: 1,
        harga_satuan: 650000,
        subtotal: 650000,
      },
      { nama: "Filter Udara", qty: 1, harga_satuan: 180000, subtotal: 180000 },
      {
        nama: "Filter Solar (Fuel Filter)",
        qty: 1,
        harga_satuan: 220000,
        subtotal: 220000,
      },
      {
        nama: "Servis Lengkap (General Check-Up) - Jasa",
        qty: 1,
        harga_satuan: 250000,
        subtotal: 250000,
      },
    ],
  },
  {
    invoice: "INV-TRK-2025-002",
    nama_petugas: "Siti Aminah",
    status: "selesai",
    tanggal_service: "2025-02-12",
    total_harga: 1120000,
    total_harga_formatted: "Rp 1.120.000",
    items: [
      {
        nama: "Kampas Rem (Brake Lining)",
        qty: 2,
        harga_satuan: 275000,
        subtotal: 550000,
      },
      { nama: "Minyak Rem", qty: 2, harga_satuan: 75000, subtotal: 150000 },
      {
        nama: "Pelumas Bearing Roda",
        qty: 1,
        harga_satuan: 120000,
        subtotal: 120000,
      },
      {
        nama: "Jasa Pengerjaan Rem",
        qty: 1,
        harga_satuan: 300000,
        subtotal: 300000,
      },
    ],
  },
  {
    invoice: "INV-TRK-2025-003",
    nama_petugas: "Andi Wijaya",
    status: "selesai",
    tanggal_service: "2025-03-20",
    total_harga: 3850000,
    total_harga_formatted: "Rp 3.850.000",
    items: [
      {
        nama: "Kopling (Clutch Disc & Cover)",
        qty: 1,
        harga_satuan: 2750000,
        subtotal: 2750000,
      },
      {
        nama: "Oli Transmisi & Gardan",
        qty: 1,
        harga_satuan: 450000,
        subtotal: 450000,
      },
      {
        nama: "Jasa Penggantian Kopling",
        qty: 1,
        harga_satuan: 650000,
        subtotal: 650000,
      },
    ],
  },
  {
    invoice: "INV-TRK-2025-004",
    nama_petugas: "Rina Kusuma",
    status: "selesai",
    tanggal_service: "2025-04-18",
    total_harga: 800000,
    total_harga_formatted: "Rp 800.000",
    items: [
      {
        nama: "Radiator & Coolant (Flush + Isi Ulang)",
        qty: 1,
        harga_satuan: 350000,
        subtotal: 350000,
      },
      {
        nama: "Filter Kabin / AC",
        qty: 1,
        harga_satuan: 150000,
        subtotal: 150000,
      },
      {
        nama: "Lampu, Klakson, & Kelistrikan (Cek)",
        qty: 1,
        harga_satuan: 100000,
        subtotal: 100000,
      },
      {
        nama: "Jasa Servis Ringan",
        qty: 1,
        harga_satuan: 200000,
        subtotal: 200000,
      },
    ],
  },
  {
    invoice: "INV-TRK-2025-005",
    nama_petugas: "Dedi Pratama",
    status: "selesai",
    tanggal_service: "2025-05-22",
    total_harga: 620000,
    total_harga_formatted: "Rp 620.000",
    items: [
      {
        nama: "Ban (Tekanan & Rotasi)",
        qty: 1,
        harga_satuan: 240000,
        subtotal: 240000,
      },
      {
        nama: "Suspensi & As Roda (Cek)",
        qty: 1,
        harga_satuan: 180000,
        subtotal: 180000,
      },
      {
        nama: "Aki / Baterai (Tes Beban)",
        qty: 1,
        harga_satuan: 50000,
        subtotal: 50000,
      },
      {
        nama: "Jasa Pengecekan",
        qty: 1,
        harga_satuan: 150000,
        subtotal: 150000,
      },
    ],
  },
  {
    invoice: "INV-TRK-2025-006",
    nama_petugas: "Bima Saputra",
    status: "proses",
    tanggal_service: "2025-06-17",
    total_harga: 480000,
    total_harga_formatted: "Rp 480.000",
    items: [
      {
        nama: "Pelumas Power Steering / Hidrolik",
        qty: 1,
        harga_satuan: 160000,
        subtotal: 160000,
      },
      {
        nama: "Pelumas Bearing Roda",
        qty: 1,
        harga_satuan: 120000,
        subtotal: 120000,
      },
      {
        nama: "Jasa Penggantian Fluida",
        qty: 1,
        harga_satuan: 200000,
        subtotal: 200000,
      },
    ],
  },
  {
    invoice: "INV-TRK-2025-007",
    nama_petugas: "Sari Lestari",
    status: "terjadwal",
    tanggal_service: "2025-07-10",
    total_harga: 3000000,
    total_harga_formatted: "Rp 3.000.000",
    items: [
      {
        nama: "Servis Lengkap (General Check-Up)",
        qty: 1,
        harga_satuan: 600000,
        subtotal: 600000,
      },
      {
        nama: "Oli Mesin + Filter Oli",
        qty: 1,
        harga_satuan: 650000,
        subtotal: 650000,
      },
      { nama: "Filter Udara", qty: 1, harga_satuan: 180000, subtotal: 180000 },
      {
        nama: "Filter Solar (Fuel Filter)",
        qty: 1,
        harga_satuan: 220000,
        subtotal: 220000,
      },
      {
        nama: "Oli Transmisi & Gardan",
        qty: 1,
        harga_satuan: 450000,
        subtotal: 450000,
      },
      {
        nama: "Radiator & Coolant",
        qty: 1,
        harga_satuan: 350000,
        subtotal: 350000,
      },
      { nama: "Minyak Rem", qty: 1, harga_satuan: 150000, subtotal: 150000 },
      { nama: "Jasa Tambahan", qty: 1, harga_satuan: 400000, subtotal: 400000 },
    ],
  },
  {
    invoice: "INV-TRK-2025-008",
    nama_petugas: "Tono Hidayat",
    status: "dibatalkan",
    tanggal_service: "2025-08-05",
    total_harga: 770000,
    total_harga_formatted: "Rp 770.000",
    items: [
      {
        nama: "Lampu, Klakson, & Kelistrikan (Penggantian Lampu)",
        qty: 2,
        harga_satuan: 120000,
        subtotal: 240000,
      },
      {
        nama: "Klakson (Unit Baru)",
        qty: 1,
        harga_satuan: 180000,
        subtotal: 180000,
      },
      {
        nama: "Diagnosa Kelistrikan",
        qty: 1,
        harga_satuan: 150000,
        subtotal: 150000,
      },
      {
        nama: "Jasa Pemasangan",
        qty: 1,
        harga_satuan: 200000,
        subtotal: 200000,
      },
    ],
  },
];

function statusBadgeClass(s: ServiceRecord["status"]) {
  // Kenapa: visual status jelas di theme apa pun.
  if (s === "selesai")
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
  if (s === "proses")
    return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
  if (s === "terjadwal")
    return "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300";
  return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300";
}

export default function ListInvoiceTable() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"" | ServiceRecord["status"]>("");
  const [sortKey, setSortKey] = useState<SortKey>("tanggal_service");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = DATA.filter((r) => {
      const matchesQ =
        !q ||
        r.invoice.toLowerCase().includes(q) ||
        r.nama_petugas.toLowerCase().includes(q);
      const matchesStatus = !status || r.status === status;
      return matchesQ && matchesStatus;
    });

    rows.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "invoice")
        return a.invoice.localeCompare(b.invoice) * dir;
      if (sortKey === "tanggal_service")
        return a.tanggal_service.localeCompare(b.tanggal_service) * dir;
      if (sortKey === "total_harga")
        return (a.total_harga - b.total_harga) * dir;
      return 0;
    });

    return rows;
  }, [query, status, sortKey, sortDir]);

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
              <SelectItem value="selesai">Selesai</SelectItem>
              <SelectItem value="proses">Proses</SelectItem>
              <SelectItem value="terjadwal">Terjadwal</SelectItem>
              <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
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
              <ThSort
                active={sortKey === "total_harga"}
                dir={sortKey === "total_harga" ? sortDir : undefined}
                onClick={() => toggleSort("total_harga")}
                className="hidden md:table-cell"
              >
                Total Harga
              </ThSort>
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
                <TableRow key={r.invoice} className="hover:bg-muted/30">
                  <TableCell className="font-mono">{r.invoice}</TableCell>
                  <TableCell>{r.nama_petugas}</TableCell>
                  <TableCell>
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
                        statusBadgeClass(r.status) // border + text colour (theme aware)
                      )}
                    >
                      {/* 100 % colour dot – never changes */}
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          r.status === "selesai" && "bg-emerald-500",
                          r.status === "proses" && "bg-amber-500",
                          r.status === "terjadwal" && "bg-sky-500",
                          r.status === "dibatalkan" && "bg-rose-500"
                        )}
                      />
                      <span>{r.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDateID(r.tanggal_service)}</TableCell>
                  <TableCell className="hidden md:table-cell font-medium">
                    {formatRupiah(r.total_harga)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        alert(
                          `Invoice ${r.invoice} — buka halaman detail di sini`
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
