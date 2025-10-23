/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PublicPengecekanMandiriType } from "@/app/data/get-pengecekan-mandiri";
import { EmptyState } from "@/components/EmptyStatePage";
import { SortDir, SortKey } from "@/components/sortTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormLabel, FormMessage } from "@/components/ui/form";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  pengecekanMandiriSchema,
  pengecekanMandiriStatus,
  pengecekanMandiriType,
  serviceList,
} from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardList, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface iAppProps {
  data: PublicPengecekanMandiriType[];
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

export function TabsInputData() {
  const form = useForm<pengecekanMandiriType>({
    resolver: zodResolver(pengecekanMandiriSchema),
    defaultValues: {
      driverName: "",
      lines: [{ serviceType: "Oli Mesin + Filter Oli", keteranganItem: "" }],
      status: "OK",
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  });

  const watchLines = form.watch("lines");

  function onSubmit(data: pengecekanMandiriType) {
    console.log("data", data);
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="border border-zinc-200/70 dark:border-zinc-700/60">
            <CardHeader
              className={cn(
                "py-3 md:py-3.5",
                "border-b border-zinc-300/90 dark:border-zinc-700",
                "bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-900/50",
                "rounded-t-xl"
              )}
            >
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-zinc-500" />
                <CardTitle className="text-base md:text-lg text-green-700 dark:text-green-300">
                  Pengecekan Mandiri — Input Data
                </CardTitle>
              </div>
              <CardDescription className="mt-1 text-xs md:text-sm">
                Tambahkan detail pengecekan secara ringkas. Gunakan “Pilih
                Lainnya” jika item service tidak ditemukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Detail Service</FormLabel>
                </div>

                {fields.map((item, idx) => {
                  const isCustom =
                    watchLines?.[idx]?.serviceType === "Pilih Lainnya";

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "grid w-full gap-3",
                        // sm: stack (1 kolom), md+: horizontal
                        isCustom
                          ? "md:grid-cols-[auto_1fr_2fr_auto]" // Select | Custom | Keterangan | Delete
                          : "md:grid-cols-[auto_2fr_auto]" // Select | Keterangan | Delete
                      )}
                    >
                      {/* ----- 1.  selector (always visible) ----- */}
                      <FormField
                        control={form.control}
                        name={`lines.${idx}.serviceType`}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(val) => {
                              field.onChange(val);
                              if (val !== "Pilih Lainnya") {
                                // clear the custom name when user leaves "Pilih Lainnya"
                                form.setValue(`lines.${idx}.customService`, "");
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {serviceList.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />

                      {/* ----- 2.  extra name field (only for "Pilih Lainnya") ----- */}
                      {isCustom && (
                        <FormField
                          control={form.control}
                          name={`lines.${idx}.customService`}
                          render={({ field }) => (
                            <>
                              <Input
                                placeholder="New service name"
                                {...field}
                              />
                              <FormMessage />
                            </>
                          )}
                        />
                      )}

                      <div className="flex gap-2 w-full items-center">
                        {/* ----- 3.  price / value ----- */}
                        <FormField
                          control={form.control}
                          name={`lines.${idx}.keteranganItem`}
                          render={({ field }) => (
                            <>
                              <Textarea
                                placeholder="Keterangan item service..."
                                {...field}
                              />
                              <FormMessage />
                            </>
                          )}
                        />

                        {/* ----- 4.  delete ----- */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(idx)}
                          disabled={fields.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ serviceType: serviceList[0], keteranganItem: "" })
                  }
                  className={cn(
                    "rounded-lg px-4 font-medium shadow-sm",
                    "text-green-700 bg-green-600/10 hover:bg-green-600/15",
                    "border border-green-600/30",
                    "dark:text-white dark:bg-green-400/15 dark:hover:bg-green-400/25 dark:border-green-400/30",
                    "focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-green-600/40 dark:focus-visible:ring-green-400/40",
                    "disabled:opacity-60 disabled:pointer-events-none"
                  )}
                >
                  <Plus className="mr-2 h-4 w-4" /> Tambah Baris
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className={cn(
              "w-full h-10 rounded-lg px-4 font-medium",
              "bg-green-600 text-white hover:bg-green-700",
              // "dark:bg-green-600 dark:hover:bg-green-700",
              "border border-transparent shadow-sm",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-green-600/40 dark:focus-visible:ring-green-400/40",
              "disabled:opacity-60 disabled:pointer-events-none"
            )}
          >
            Simpan Data
          </Button>
        </form>
      </Form>
    </>
  );
}

export function TabsHistoryPengecekanMandiri({ data }: iAppProps) {
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
        (row.status ?? "").toLowerCase().includes(q);

      const matchesStatus = !status || row.status === status;
      return matchesQuery && matchesStatus;
    });

    rows.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "tanggal_service")
        return toYMD(a.serviceDate).localeCompare(toYMD(b.serviceDate)) * dir;

      return 0;
    });
    return rows;
  }, [data, query, status, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function resetFilters() {
    setQuery("");
    setStatus("");
    setSortKey("tanggal_service");
    setSortDir("desc");
  }
  return (
    <>
      <Card className="border border-zinc-200/70 dark:border-zinc-700/60">
        <CardHeader
          className={cn(
            "py-3 md:py-3.5",
            "border-b border-zinc-300/90 dark:border-zinc-700",
            "bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-900/50",
            "rounded-t-xl"
          )}
        >
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-zinc-500" />
            <CardTitle className="text-base md:text-lg text-green-700 dark:text-green-300">
              History Pengecekan Mandiri
            </CardTitle>
          </div>
          <CardDescription className="mt-1 text-xs md:text-sm">
            Tambahkan detail pengecekan secara ringkas. Gunakan “Pilih Lainnya”
            jika item service tidak ditemukan
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap items-end gap-3 my-6">
            <div className="w-48">
              <label className="text-xs text-muted-foreground block mb-1">
                Filter Status
              </label>
              <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  {pengecekanMandiriStatus.map((status) => (
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

          {filteredSorted.length === 0 ? (
            <EmptyState />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Service Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSorted.map((row, index) => (
                  <TableRow
                    key={index + 1}
                    className="hover:bg-green-600/5 dark:hover:bg-green-400/5"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.driverName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
