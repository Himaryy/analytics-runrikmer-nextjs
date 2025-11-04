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
import { fetchAllPengecekanMandiri } from "./actions";
import {
  TabsHistoryPengecekanMandiri,
  TabsInputData,
} from "./_component/TabsPengecekanMandiri";
import { ClipboardList } from "lucide-react";
import { GetParameters } from "../data/get-parameter";
import { GetInvoices } from "../data/get-invoices-data";
import { GetOverdue } from "../data/get-overdue";

export default async function HomePage() {
  const allInvoices = await GetInvoices();
  const allDataPengecekanMandiri = await fetchAllPengecekanMandiri();
  // const allParameterKendaraan = await GetParameters();
  // const overdueParameters = await GetOverdue();

  const tabs = [
    { value: "add-invoice", label: "Input Invoice" },
    { value: "pengecekan-mandiri", label: "Pengecekan Mandiri" },
    { value: "overdue-maintenance", label: "Overdue Maintenance" },
    { value: "list-invoice", label: "List Invoice" },
  ];

  const tabsMandiri = [
    { value: "input-data", label: "Input Data" },
    {
      value: "history-pengecekan-mandiri",
      label: "History Pengecekan Mandiri",
    },
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
          <TabsList
            className={cn(
              // turn the default inline-flex bar into a responsive grid
              "grid w-full grid-cols-2 md:grid-cols-4 ",
              "auto-rows-fr items-stretch gap-1 p-1 rounded-md bg-white border dark:bg-muted",
              // kill the default fixed height from shadcn
              "h-auto"
            )}
          >
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  // fill the grid cell fully
                  "flex h-full w-full items-center justify-center",
                  "rounded-md border border-transparent px-3 text-sm font-medium transition-colors",
                  // keep minimum tap target on very small screens
                  "min-h-2",
                  // Hover
                  "hover:bg-green-600/10 dark:hover:bg-green-400/10",
                  // Focus ring
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40 dark:focus-visible:ring-green-400/40",
                  // Active (your chip styles)
                  "[&[data-state=active]]:bg-green-600/15",
                  "[&[data-state=active]]:text-green-700",
                  "[&[data-state=active]]:border",
                  "[&[data-state=active]]:border-green-600/30",
                  "dark:[&[data-state=active]]:bg-green-400/20",
                  "dark:[&[data-state=active]]:text-white",
                  "dark:[&[data-state=active]]:border",
                  "dark:[&[data-state=active]]:border-green-400/30"
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="add-invoice">
            <Card>
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
                    Input Data Invoice
                  </CardTitle>
                </div>
                <CardDescription className="mt-1 text-xs md:text-sm">
                  Silakan lengkapi form data invoice di bawah ini. Gunakan
                  “Pilih Lainnya” jika item service tidak ditemukan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddInvoiceStructure />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pengecekan-mandiri">
            <Card>
              <CardContent>
                <Tabs defaultValue="input-data" className="w-full space-y-3">
                  <TabsList
                    className={cn(
                      // turn the default inline-flex bar into a responsive grid
                      "grid w-full grid-cols-2",
                      "auto-rows-fr items-stretch gap-1 p-1 rounded-md bg-white border dark:bg-muted",
                      // kill the default fixed height from shadcn
                      "h-auto"
                    )}
                  >
                    {tabsMandiri.map((tabMandiri) => (
                      <TabsTrigger
                        key={tabMandiri.value}
                        value={tabMandiri.value}
                        className={cn(
                          // fill the grid cell fully
                          "flex h-full w-full items-center justify-center",
                          "rounded-md border border-transparent px-3 text-sm font-medium transition-colors",
                          // keep minimum tap target on very small screens
                          "min-h-2",
                          // Hover
                          "hover:bg-green-600/10 dark:hover:bg-green-400/10",
                          // Focus ring
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40 dark:focus-visible:ring-green-400/40",
                          // Active (your chip styles)
                          "[&[data-state=active]]:bg-green-600/15",
                          "[&[data-state=active]]:text-green-700",
                          "[&[data-state=active]]:border",
                          "[&[data-state=active]]:border-green-600/30",
                          "dark:[&[data-state=active]]:bg-green-400/20",
                          "dark:[&[data-state=active]]:text-white",
                          "dark:[&[data-state=active]]:border",
                          "dark:[&[data-state=active]]:border-green-400/30"
                        )}
                      >
                        {tabMandiri.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="input-data">
                    <TabsInputData />
                  </TabsContent>

                  <TabsContent value="history-pengecekan-mandiri">
                    <TabsHistoryPengecekanMandiri
                      data={allDataPengecekanMandiri}
                    />
                  </TabsContent>
                </Tabs>
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
                <ListInvoiceTable data={allInvoices} />
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
