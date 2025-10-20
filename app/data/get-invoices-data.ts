/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import dataJson from "@/utils/dataDummy.json";
import { invoiceSchemaType } from "@/lib/zodSchemas";

export async function GetInvoices() {
  await new Promise((r) => setTimeout(r, 500));

  return (dataJson as any[]).map((invoice) => ({
    ...invoice,
    serviceDate: new Date(invoice.serviceDate),
  })) as invoiceSchemaType[];
}

export type PublicInvoiceType = Awaited<ReturnType<typeof GetInvoices>>[0];
