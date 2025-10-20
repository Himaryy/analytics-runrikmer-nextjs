// app/(your-route)/_component/OverdueMaintenance.tsx
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Priority = "critical" | "high" | "medium" | "low";
type Row = {
  id: string;
  asset: string;
  service: string;
  dueDate: string; // ISO
  daysOverdue: number;
  priority: Priority;
  estimate: number; // in IDR
  assignee: string;
};

const MOCK_ROWS: Row[] = [
  {
    id: "1",
    asset: "Anoa-01",
    service: "Oli Mesin + Filter Oli",
    dueDate: "2025-09-20",
    daysOverdue: 29,
    priority: "critical",
    estimate: 2500000,
    assignee: "Sersan Budi",
  },
  {
    id: "2",
    asset: "Komodo-07",
    service: "Kampas Rem (Brake Lining)",
    dueDate: "2025-10-02",
    daysOverdue: 17,
    priority: "high",
    estimate: 1800000,
    assignee: "Praka Dimas",
  },
  {
    id: "3",
    asset: "Truck-Log-12",
    service: "Filter Solar (Fuel Filter)",
    dueDate: "2025-10-05",
    daysOverdue: 14,
    priority: "high",
    estimate: 750000,
    assignee: "Sertu Rian",
  },
  {
    id: "4",
    asset: "Jeep-Field-21",
    service: "Aki / Baterai",
    dueDate: "2025-09-29",
    daysOverdue: 20,
    priority: "medium",
    estimate: 1600000,
    assignee: "Prada Fikri",
  },
  {
    id: "5",
    asset: "Bulldozer-02",
    service: "Servis Lengkap (General Check-Up)",
    dueDate: "2025-09-10",
    daysOverdue: 39,
    priority: "critical",
    estimate: 5200000,
    assignee: "Sertu Rian",
  },
  {
    id: "6",
    asset: "Truk-Ammo-05",
    service: "Suspensi & As Roda",
    dueDate: "2025-10-10",
    daysOverdue: 9,
    priority: "medium",
    estimate: 2300000,
    assignee: "Praka Dimas",
  },
  {
    id: "7",
    asset: "Motor-Scout-03",
    service: "Ban (Tekanan & Rotasi)",
    dueDate: "2025-10-14",
    daysOverdue: 5,
    priority: "low",
    estimate: 300000,
    assignee: "Sersan Budi",
  },
];

function formatIDR(n: number) {
  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `Rp ${n.toLocaleString("id-ID")}`;
  }
}

function PriorityBadge({ p }: { p: Priority }) {
  const map: Record<Priority, { label: string; cls: string }> = {
    critical: {
      label: "Critical",
      cls: "bg-rose-600/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-100",
    },
    high: {
      label: "High",
      cls: "bg-amber-600/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-100",
    },
    medium: {
      label: "Medium",
      cls: "bg-green-700/15 text-green-700 dark:bg-green-400/20 dark:text-green-100",
    },
    low: {
      label: "Low",
      cls: "bg-zinc-600/15 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-100",
    },
  };
  const it = map[p];
  return <Badge className={cn("border-0", it.cls)}>{it.label}</Badge>;
}

export default function ListOverdueTable() {
  const [query, setQuery] = React.useState("");
  const [priority, setPriority] = React.useState<"all" | Priority>("all");
  const [assignee, setAssignee] = React.useState<string>("all");

  const assignees = React.useMemo(() => {
    const s = new Set(MOCK_ROWS.map((r) => r.assignee));
    return ["all", ...Array.from(s)];
  }, []);

  const sorted = React.useMemo(
    () => [...MOCK_ROWS].sort((a, b) => b.daysOverdue - a.daysOverdue),
    []
  );

  const rows = React.useMemo(() => {
    let out = sorted;
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter(
        (r) =>
          r.asset.toLowerCase().includes(q) ||
          r.service.toLowerCase().includes(q)
      );
    }
    if (priority !== "all") out = out.filter((r) => r.priority === priority);
    if (assignee !== "all") out = out.filter((r) => r.assignee === assignee);
    return out;
  }, [sorted, query, priority, assignee]);

  const totals = React.useMemo(() => {
    const t = (list: Row[]) => list.reduce((s, r) => s + r.estimate, 0);
    return {
      all: rows.length,
      critical: rows.filter((r) => r.priority === "critical").length,
      high: rows.filter((r) => r.priority === "high").length,
      est: t(rows),
    };
  }, [rows]);

  return (
    <div className="space-y-4">
      {/* Header stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard title="Total Overdue" value={`${totals.all}`} />
        <StatCard
          title="Critical / High"
          value={`${totals.critical} / ${totals.high}`}
          tone="alert"
        />
        <StatCard
          title="Est. Cost"
          value={formatIDR(totals.est)}
          tone="money"
        />
      </div>

      {/* Filters */}
      <Card className="border border-zinc-200/70 dark:border-zinc-700/60">
        <CardHeader className="py-3">
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>
            Cari unit atau jenis service, filter prioritas & petugas.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="Search asset / service…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9"
          />
          <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={assignee} onValueChange={setAssignee}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              {assignees.map((a) => (
                <SelectItem key={a} value={a}>
                  {a === "all" ? "All assignees" : a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border border-zinc-200/70 dark:border-zinc-700/60">
        <CardHeader className="py-3">
          <CardTitle className="text-base">Overdue List</CardTitle>
          <CardDescription>
            Urutkan otomatis dari yang paling telat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <EmptyState />
          ) : (
            <Table>
              <TableCaption className="text-xs">
                Last updated just now.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Days Overdue</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Est. Cost</TableHead>
                  <TableHead>PIC</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow
                    key={r.id}
                    className="hover:bg-green-600/5 dark:hover:bg-green-400/5"
                  >
                    <TableCell className="font-medium">{r.asset}</TableCell>
                    <TableCell className="max-w-[280px] truncate">
                      {r.service}
                    </TableCell>
                    <TableCell>{r.dueDate}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {r.daysOverdue}
                    </TableCell>
                    <TableCell>
                      <PriorityBadge p={r.priority} />
                    </TableCell>
                    <TableCell className="text-right">
                      {formatIDR(r.estimate)}
                    </TableCell>
                    <TableCell>{r.assignee}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" className="h-8">
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 bg-green-700 text-white hover:bg-green-700/90 dark:bg-green-600 dark:hover:bg-green-600/90"
                      >
                        Mark done
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  tone = "neutral",
}: {
  title: string;
  value: string;
  tone?: "neutral" | "alert" | "money";
}) {
  const toneCls =
    tone === "alert"
      ? "text-amber-700 dark:text-amber-300"
      : tone === "money"
      ? "text-green-700 dark:text-green-300"
      : "text-zinc-900 dark:text-zinc-100";
  const wash =
    tone === "alert"
      ? "from-amber-500/6 dark:from-amber-300/8"
      : tone === "money"
      ? "from-green-600/6 dark:from-green-400/8"
      : "from-zinc-500/4 dark:from-zinc-400/6";

  return (
    <Card className="relative overflow-hidden rounded-lg border border-zinc-200/70 dark:border-zinc-700/60 bg-white dark:bg-zinc-900 shadow-sm">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent",
          wash
        )}
      />
      <CardHeader className="py-3 px-3">
        <div className="text-[11px] leading-none text-muted-foreground">
          {title}
        </div>
        <CardTitle className={cn("text-lg font-semibold", toneCls)}>
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10">
      <div className="size-10 rounded-full grid place-items-center bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
        !
      </div>
      <div className="text-sm text-muted-foreground">
        No overdue items found for current filters.
      </div>
      <div className="text-xs text-zinc-500">
        Try clearing filters or adjusting your search.
      </div>
    </div>
  );
}
