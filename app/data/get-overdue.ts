/* eslint-disable @typescript-eslint/no-explicit-any */
import { getOvedueParameterKendaraan, getOverdueType } from "@/lib/zodSchemas";
import { BASE_URL } from "@/utils/apiURL";
import "server-only";

export async function GetOverdue(): Promise<getOverdueType[]> {
  // DI BACKENDNYA POST
  try {
    const res = await fetch(`${BASE_URL}/parameter/overdue`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
    });

    if (!res.ok) throw new Error("❌ Failed to fetch Ovedue");

    const data = await res.json();
    const listOverdue = data.data;

    return listOverdue.map((overdue: any) =>
      getOvedueParameterKendaraan.parse({
        idParameter: overdue.id_paarameter,
        intervalJarak: overdue.interval_jarak,
        intervalWaktu: overdue.interval_waktu,
        namaParameter: overdue.parameter,
        message: overdue.message,
        tanggal: overdue.tanggal,
        odometerKm: overdue.jarak,
        type: overdue.type,
      })
    );
  } catch (error) {
    console.error("❌ Error while fetching Overdue Parameter:", error);
    return [];
  }
}
