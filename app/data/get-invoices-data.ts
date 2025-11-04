/* eslint-disable @typescript-eslint/no-explicit-any */
import { getInvoiceSchema, getInvoiceSchemaType } from "@/lib/zodSchemas";
import { BASE_URL } from "@/utils/apiURL";
import "server-only";

export async function GetInvoices(): Promise<getInvoiceSchemaType[]> {
  try {
    const res = await fetch(`${BASE_URL}/faktur`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
    });

    if (!res.ok) throw new Error("❌ Failed to fetch invoices");

    const data = await res.json();
    const listData = data.data;

    return listData.map((invoice: any) =>
      getInvoiceSchema.parse({
        // ...invoice,
        idFaktur: invoice.id_faktur,
        idInvoice: invoice.id_invoice,
        serviceDate: new Date(invoice.tanggal),
        driverName: invoice.nama,
        locationService: invoice.lokasi,
        odometerKm: invoice.jarak,
        keterangan: invoice.keterangan,
      })
    );
  } catch (error) {
    console.error("❌ Error while fetching invoices:", error);
    return [];
  }
}

export type PublicInvoiceType = Awaited<ReturnType<typeof GetInvoices>>[0];
