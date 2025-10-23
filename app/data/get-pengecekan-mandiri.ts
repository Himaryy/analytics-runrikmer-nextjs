/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import mandiriJson from "@/utils/mandiriDummy.json";
import { pengecekanMandiriType } from "@/lib/zodSchemas";

export async function GetPengecekanMandiri() {
  await new Promise((r) => setTimeout(r, 500));

  return (mandiriJson as any[]).map((mandiriData) => ({
    ...mandiriData,
    serviceDate: new Date(mandiriData.serviceDate),
  })) as pengecekanMandiriType[];
}

export type PublicPengecekanMandiriType = Awaited<
  ReturnType<typeof GetPengecekanMandiri>
>[0];
