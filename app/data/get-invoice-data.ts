/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getDetailInvoiceSchema,
  getDetailInvoiceType,
  getInvoiceSchema,
  getInvoiceSchemaType,
} from "@/lib/zodSchemas";
import { BASE_URL } from "@/utils/apiURL";
import "server-only";

export async function GetFakturByScanIdFaktur(
  id_faktur: number
): Promise<getInvoiceSchemaType | null> {
  try {
    const res = await fetch(`${BASE_URL}/faktur`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
    });
    if (!res.ok) throw new Error("❌ Failed to fetch Faktur list");

    const data = await res.json();
    const fakturById: any[] = Array.isArray(data?.data) ? data.data : [];

    const findFakturById = fakturById.find(
      (faktur) => Number(faktur?.id_faktur) === Number(id_faktur)
    );
    if (!findFakturById) return null;

    const mapped = {
      idFaktur: findFakturById.id_faktur,
      idInvoice: findFakturById.id_invoice,
      odometerKm: findFakturById.jarak,
      keterangan: findFakturById.keterangan,
      locationService: findFakturById.lokasi,
      driverName: findFakturById.nama,
      serviceDate: new Date(findFakturById.tanggal),
    };

    return getInvoiceSchema.parse(mapped);
  } catch (error) {
    console.error("❌ Error while scanning Faktur header:", error);
    return null;
  }
}

export async function GetDetailInvoice(
  id_faktur: number
): Promise<getDetailInvoiceType[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/detail_faktur?id_faktur=${id_faktur}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      }
    );

    if (!res.ok) throw new Error("❌ Failed to fetch Detail Invoice");

    const data = await res.json();
    const detailInvoice = Array.isArray(data?.data)
      ? data.data
      : data?.data
      ? [data.data]
      : [];

    return detailInvoice.map((detail: any) =>
      getDetailInvoiceSchema.parse({
        idDetailFaktur: detail.id_detail_faktur,
        idFaktur: detail.id_faktur,
        idInvoice: detail.id_invoice,
        idParameter: detail.id_parameter,
        odometerKm: detail.jarak,
        keteranganItem: detail.keterangan ?? undefined,
        namaParameter: detail.parameter,
        serviceDate: new Date(detail.tanggal),
      })
    );
  } catch (error) {
    console.error("❌ Error while fetching Detail Invoice:", error);
    return [];
  }
}

export async function getHeaderUsingDetailsInvoice(
  details: getDetailInvoiceType[]
): Promise<getInvoiceSchemaType | null> {
  if (!details.length) return null;
  return GetFakturByScanIdFaktur(details[0].idFaktur);
}

/** true jika (id_faktur, id_detail_faktur) ada */
export async function detailFakturExists(
  idFaktur: number,
  idDetailFaktur: number
): Promise<boolean> {
  const res = await fetch(
    `${BASE_URL}/detail_faktur?id_faktur=${Number(idFaktur)}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
    }
  );
  if (!res.ok) return false;

  const body: any = await res.json().catch(() => null);

  // handle soft envelope: { data: { data:false, message:..., status:200 } }
  if (body?.data && typeof body.data === "object" && body.data.data === false)
    return false;

  const raw = body?.data;
  const rows: any[] = Array.isArray(raw) ? raw : raw ? [raw] : [];

  const found = rows.find(
    (r) =>
      Number(r?.id_faktur) === Number(idFaktur) &&
      Number(r?.id_detail_faktur) === Number(idDetailFaktur)
  );
  return Boolean(found);
}

export type BasicInfo = {
  idFaktur: number;
  idInvoice: string;
  serviceDate: Date;
  totalItems: number;
};

export function deriveBasicInfo(
  details: getDetailInvoiceType[]
): BasicInfo | null {
  if (!details || details.length === 0) return null;
  const first = details[0];
  return {
    idFaktur: first.idFaktur,
    idInvoice: first.idInvoice,
    serviceDate: first.serviceDate,
    totalItems: details.length,
  };
}

export async function getDetailInvoicePageData(id_faktur: number): Promise<{
  header: getInvoiceSchemaType;
  details: getDetailInvoiceType[];
  basic: BasicInfo;
} | null> {
  const [header, details] = await Promise.all([
    GetFakturByScanIdFaktur(id_faktur),
    GetDetailInvoice(id_faktur),
  ]);

  if (!header) return null;
  const basic = deriveBasicInfo(details) ?? {
    idFaktur: header.idFaktur,
    idInvoice: header.idInvoice,
    serviceDate: header.serviceDate,
    totalItems: 0,
  };
  return { header, details, basic };
}
