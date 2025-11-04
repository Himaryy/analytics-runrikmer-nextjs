import { getDetailInvoicePageData } from "@/app/data/get-invoice-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ClipboardList } from "lucide-react";
import ListService from "./_component/ListService";
import HeaderDetail from "./_component/HeaderEditDetail";
import { GetParameters } from "@/app/data/get-parameter";

type Params = Promise<{ id_faktur: string }>;

export default async function DetailInvoicePage({
  params,
}: {
  params: Params;
}) {
  const { id_faktur } = await params;
  const data = await getDetailInvoicePageData(Number(id_faktur));
  const parameterService = await GetParameters();

  if (!data) {
    return <p className="p-6 text-destructive">Tidak ada data faktur.</p>;
  }

  const { header, details } = data;

  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-6">
      <HeaderDetail dataHeader={header} />

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
              List Service
            </CardTitle>
          </div>
          <CardDescription className="mt-1 text-xs md:text-sm">
            Tambahkan detail pengecekan secara ringkas. Gunakan “Pilih Lainnya”
            jika item service tidak ditemukan
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ListService
            header={header}
            details={details}
            parameters={parameterService}
          />
        </CardContent>
      </Card>
    </div>
  );
}
