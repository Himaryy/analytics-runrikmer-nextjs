"use client";
import { CardStats } from "@/components/CardStats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Tabs } from "@radix-ui/react-tabs";
import { AddInvoiceStructure } from "./_component/AddInvoiceStructure";
import ListInvoiceTable from "./_component/ListInvoiceTable";
import ListOverdueTable from "./_component/ListOverdueTable";

export default function HomePage() {
  const tabs = [
    { value: "add-invoice", label: "Input Invoice" },
    { value: "list-invoice", label: "List Invoice" },
    { value: "overdue-maintenance", label: "Overdue Maintenance" },
  ];
  return (
    <>
      <div className="flex flex-col space-y-6">
        {/* Card stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 mb-8">
          <CardStats title="Total Invoice" value="128" />
          <CardStats title="Paid" value="Rp 42.500.000" />
          <CardStats title="Overdue" value="7" />
        </section>

        <Tabs defaultValue="add-invoice" className="w-full space-y-3">
          <TabsList className="grid grid-cols-3 w-full shadow-md">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  // Active (subtle chip) — LIGHT
                  "[&[data-state=active]]:bg-green-600/15",
                  "[&[data-state=active]]:text-green-700",
                  "[&[data-state=active]]:border",
                  "[&[data-state=active]]:border-green-600/30",
                  // Active (subtle chip) — DARK
                  "dark:[&[data-state=active]]:bg-green-400/20",
                  "dark:[&[data-state=active]]:text-white",
                  "dark:[&[data-state=active]]:border",
                  "dark:[&[data-state=active]]:border-green-400/30",
                  // Hover (very mild)
                  "hover:bg-green-600/10 dark:hover:bg-green-400/10",
                  // Focus ring (soft)
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40 dark:focus-visible:ring-green-400/40",
                  "rounded-md transition-colors"
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="add-invoice">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-300">
                  Masukan Data Invoice Maintenance
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <AddInvoiceStructure />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list-invoice">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-300">
                  List Invoice Maintenance
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <ListInvoiceTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overdue-maintenance">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-300">
                  Overdue Maintenance
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <ListOverdueTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
