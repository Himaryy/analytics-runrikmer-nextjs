"use server";

import { GetInvoices, type PublicInvoiceType } from "../data/get-invoices-data";

export async function fetchAllInvoices(): Promise<PublicInvoiceType[]> {
  return GetInvoices();
}
