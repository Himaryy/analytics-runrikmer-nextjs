/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getParameterKendaraan,
  getParameterKendaraanType,
} from "@/lib/zodSchemas";
import { BASE_URL } from "@/utils/apiURL";
import "server-only";

export async function GetParameters(): Promise<getParameterKendaraanType[]> {
  try {
    const res = await fetch(`${BASE_URL}/parameter`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
    });

    if (!res.ok) throw new Error("❌ Failed to fetch Parameter Kendaraan");

    const data = await res.json();
    const paramaters = data.data;

    return paramaters.map((parameter: any) =>
      getParameterKendaraan.parse({
        idParameter: parameter.id_parameter,
        intervalJarak: parameter.interval_jarak,
        intervalWaktu: parameter.interval_waktu,
        namaParameter: parameter.parameter,
      })
    );
  } catch (error) {
    console.error("❌ Error while fetching Parameters:", error);
    return [];
  }
}
