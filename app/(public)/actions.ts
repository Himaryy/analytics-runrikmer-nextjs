"use server";

import { GetInvoices, type PublicInvoiceType } from "../data/get-invoices-data";
import {
  GetPengecekanMandiri,
  PublicPengecekanMandiriType,
} from "../data/get-pengecekan-mandiri";

export async function fetchAllInvoices(): Promise<PublicInvoiceType[]> {
  return GetInvoices();
}

export async function fetchAllPengecekanMandiri(): Promise<
  PublicPengecekanMandiriType[]
> {
  return GetPengecekanMandiri();
}
